from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, extract, cast, Date
from datetime import datetime, timedelta
import uuid

from .. import models, schemas, database, security

router = APIRouter(
    prefix="/issues", # The /api/v1 prefix is handled in main.py
    tags=["Issues & Analytics"]
)

# --- Helper function to convert DB objects to Pydantic schemas ---
def _convert_issue_to_schema(issue: models.InfrastructureIssue) -> schemas.InfrastructureIssue:
    """Safely converts the DB model to a Pydantic model, handling relationships."""
    issue_data = schemas.InfrastructureIssue.model_validate(issue).model_dump()
    return schemas.InfrastructureIssue(**issue_data)


# --- Endpoints ---

@router.get("/dashboard/metrics", response_model=schemas.DashboardMetrics)
def get_dashboard_metrics(db: Session = Depends(database.get_db)):
    """Get key dashboard metrics for Chennai infrastructure monitoring."""
    try:
        today_start = datetime.utcnow().date()

        # Count active issues (not 'resolved')
        active_issues = db.query(models.InfrastructureIssue).filter(
            models.InfrastructureIssue.status != schemas.IssueStatusEnum.resolved
        ).count()

        # Calculate resolution rate
        total_issues = db.query(models.InfrastructureIssue).count()
        if total_issues > 0:
            resolved_issues_count = db.query(models.InfrastructureIssue).filter(
                models.InfrastructureIssue.status == schemas.IssueStatusEnum.resolved
            ).count()
            resolution_rate = (resolved_issues_count / total_issues) * 100
        else:
            resolution_rate = 0

        # Count AI detections for today
        ai_detections_today = db.query(models.InfrastructureIssue).filter(
            and_(
                cast(models.InfrastructureIssue.detected_at, Date) == today_start,
                models.InfrastructureIssue.source == schemas.DetectionSourceEnum.ai_camera
            )
        ).count()

        # Calculate average response time for resolved issues
        avg_response_time_delta = db.query(
            func.avg(
                func.julianday(models.InfrastructureIssue.resolved_at) - func.julianday(models.InfrastructureIssue.detected_at)
            )
        ).filter(
            models.InfrastructureIssue.status == schemas.IssueStatusEnum.resolved,
            models.InfrastructureIssue.resolved_at.isnot(None)
        ).scalar()

        # Convert average days to hours, handle None case
        avg_response_time_hours = (avg_response_time_delta * 24) if avg_response_time_delta else 0

        return schemas.DashboardMetrics(
            active_issues=active_issues,
            resolution_rate=round(resolution_rate, 1),
            ai_detections_today=ai_detections_today,
            avg_response_time_hours=round(avg_response_time_hours, 1)
        )

    except Exception as e:
        # It's good practice to log the error `e` here
        raise HTTPException(status_code=500, detail=f"Failed to calculate dashboard metrics: {str(e)}")


@router.get("/analytics", response_model=schemas.AnalyticsSummary)
def get_analytics_data(
    date_range: schemas.DateRangeEnum = Query(schemas.DateRangeEnum.thirty_days, description="Time range: 7days, 30days, 90days"),
    db: Session = Depends(database.get_db)
):
    """Get comprehensive analytics data for Chennai infrastructure issues."""
    try:
        days = {
            schemas.DateRangeEnum.seven_days: 7,
            schemas.DateRangeEnum.thirty_days: 30,
            schemas.DateRangeEnum.ninety_days: 90
        }.get(date_range, 30)
        start_date = datetime.utcnow() - timedelta(days=days)

        base_query = db.query(models.InfrastructureIssue).filter(models.InfrastructureIssue.detected_at >= start_date)

        total_issues = base_query.count()
        total_resolved = base_query.filter(models.InfrastructureIssue.status == schemas.IssueStatusEnum.resolved).count()

        # Issues by Type
        issues_by_type_query = base_query.group_by(models.InfrastructureIssue.issue_type).with_entities(
            models.InfrastructureIssue.issue_type, func.count(models.InfrastructureIssue.id)
        ).all()
        issues_by_type = {str(k.value): v for k, v in issues_by_type_query}

        # Issues by Status
        issues_by_status_query = base_query.group_by(models.InfrastructureIssue.status).with_entities(
            models.InfrastructureIssue.status, func.count(models.InfrastructureIssue.id)
        ).all()
        issues_by_status = {str(k.value): v for k, v in issues_by_status_query}

        # Issues by Severity (Priority)
        issues_by_severity_query = base_query.group_by(models.InfrastructureIssue.priority).with_entities(
            models.InfrastructureIssue.priority, func.count(models.InfrastructureIssue.id)
        ).all()
        issues_by_severity = {str(k.value): v for k, v in issues_by_severity_query}

        # Issues by Area (Locality/Address)
        issues_by_area_query = base_query.group_by(models.InfrastructureIssue.address).with_entities(
            models.InfrastructureIssue.address, func.count(models.InfrastructureIssue.id)
        ).order_by(func.count(models.InfrastructureIssue.id).desc()).limit(10).all()
        issues_by_area = {k: v for k, v in issues_by_area_query}
        
        # Calculate average resolution time in days
        avg_resolution_delta = db.query(
            func.avg(
                extract('epoch', models.InfrastructureIssue.resolved_at) - extract('epoch', models.InfrastructureIssue.detected_at)
            )
        ).filter(
            models.InfrastructureIssue.status == schemas.IssueStatusEnum.resolved,
            models.InfrastructureIssue.resolved_at.isnot(None),
            models.InfrastructureIssue.detected_at >= start_date
        ).scalar()
        avg_resolution_time_days = (avg_resolution_delta / 86400) if avg_resolution_delta else 0

        return schemas.AnalyticsSummary(
            issues_by_type=issues_by_type,
            issues_by_severity=issues_by_severity,
            issues_by_status=issues_by_status,
            issues_by_area=issues_by_area,
            resolution_trends=[], # Placeholder - requires more complex time-series query
            department_performance=[], # Placeholder - requires joining with department data
            total_issues=total_issues,
            total_resolved=total_resolved,
            overall_resolution_rate=(total_resolved / total_issues * 100) if total_issues > 0 else 0,
            avg_resolution_time_days=round(avg_resolution_time_days, 1)
        )

    except Exception as e:
        # It's good practice to log the error `e` here
        raise HTTPException(status_code=500, detail=f"Failed to generate analytics data: {str(e)}")



@router.get("/summary", response_model=List[schemas.InfrastructureIssue])
def get_issues_summary(
    limit: int = Query(10, description="Number of issues to return"),
    db: Session = Depends(database.get_db)
):
    """Get a summary of recent issues for the dashboard table."""
    try:
        recent_issues = db.query(models.InfrastructureIssue).order_by(
            models.InfrastructureIssue.detected_at.desc()
        ).limit(limit).all()
        
        return [_convert_issue_to_schema(issue) for issue in recent_issues]
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to get issues summary")


@router.post("/work-orders", response_model=schemas.WorkOrder, status_code=status.HTTP_201_CREATED)
def create_work_order(work_order: schemas.WorkOrderCreate, db: Session = Depends(database.get_db)):
    """Create a new work order for an issue."""
    db_issue = db.query(models.InfrastructureIssue).filter(models.InfrastructureIssue.id == work_order.issue_id).first()
    if not db_issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    db_work_order = models.WorkOrder(**work_order.model_dump())
    db.add(db_work_order)
    db.commit()
    db.refresh(db_work_order)
    return db_work_order
    

@router.get("/work-orders", response_model=List[schemas.WorkOrder])
def get_work_orders(
    status: Optional[schemas.WorkOrderStatusEnum] = None,
    assigned_to: Optional[uuid.UUID] = None,
    limit: int = Query(100, description="Number of work orders to return"),
    db: Session = Depends(database.get_db)
):
    """Get all work orders with optional filtering."""
    query = db.query(models.WorkOrder)
    if status:
        query = query.filter(models.WorkOrder.status == status)
    if assigned_to:
        query = query.filter(models.WorkOrder.assigned_to == assigned_to)
    
    work_orders = query.order_by(models.WorkOrder.created_at.desc()).limit(limit).all()
    return work_orders


@router.patch("/work-orders/{work_order_id}", response_model=schemas.WorkOrder)
def update_work_order_status(
    work_order_id: uuid.UUID,
    status_update: schemas.WorkOrderStatusUpdate, # Assuming this schema exists
    db: Session = Depends(database.get_db)
):
    """Update the status of a work order."""
    work_order = db.query(models.WorkOrder).filter(models.WorkOrder.id == work_order_id).first()
    if not work_order:
        raise HTTPException(status_code=404, detail="Work order not found")
    
    work_order.status = status_update.status
    if status_update.status == 'completed':
        work_order.completed_date = datetime.utcnow().date()
    if status_update.notes:
        work_order.notes = status_update.notes
    
    db.commit()
    db.refresh(work_order)
    return work_order

@router.patch("/{issue_id}/resolve", response_model=schemas.InfrastructureIssue)
def resolve_issue(
    issue_id: uuid.UUID,
    db: Session = Depends(database.get_db),
    current_user: models.UserProfile = Depends(security.get_current_admin_user)
):
    """
    Mark an issue as resolved.
    """
    db_issue = db.query(models.InfrastructureIssue).filter(models.InfrastructureIssue.id == issue_id).first()
    if not db_issue:
        raise HTTPException(status_code=404, detail="Issue not found")

    db_issue.status = schemas.IssueStatusEnum.resolved
    db_issue.resolved_at = datetime.utcnow()
    db.commit()
    db.refresh(db_issue)
    return _convert_issue_to_schema(db_issue)