from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from geoalchemy2.shape import to_shape
from datetime import datetime, timedelta

from .. import models, schemas, database

router = APIRouter(
    prefix="/api/v1",
    tags=["Issues"]
)


@router.get("/dashboard/metrics", response_model=schemas.DashboardMetrics)
def get_dashboard_metrics(db: Session = Depends(database.get_db)):
    """Get key dashboard metrics for Chennai infrastructure monitoring."""
    try:
        # Get active issues (reported in last 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        active_issues = db.query(models.Detection).filter(
            models.Detection.timestamp >= thirty_days_ago
        ).count()
        
        # Get resolution rate (issues marked as resolved in last 30 days)
        resolved_issues = db.query(models.Detection).filter(
            and_(
                models.Detection.timestamp >= thirty_days_ago,
                models.Detection.status == 'resolved'
            )
        ).count()
        
        resolution_rate = (resolved_issues / active_issues * 100) if active_issues > 0 else 0
        
        # Get AI detections today
        today = datetime.utcnow().date()
        ai_detections_today = db.query(models.Detection).filter(
            func.date(models.Detection.timestamp) == today
        ).count()
        
        # Calculate average response time (mock data for now)
        average_response_time = 2.4  # hours
        
        print(f"Dashboard metrics calculated: {active_issues} active issues, {resolution_rate:.1f}% resolution rate")
        
        return schemas.DashboardMetrics(
            active_issues=active_issues,
            resolution_rate=round(resolution_rate, 1),
            ai_detections_today=ai_detections_today,
            average_response_time=average_response_time
        )
        
    except Exception as e:
        print(f"Error calculating dashboard metrics: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to calculate dashboard metrics")


@router.get("/analytics", response_model=schemas.AnalyticsData)
def get_analytics_data(
    date_range: str = Query("30days", description="Time range: 7days, 30days, 90days"),
    db: Session = Depends(database.get_db)
):
    """Get comprehensive analytics data for Chennai infrastructure issues."""
    try:
        # Calculate date range
        if date_range == "7days":
            start_date = datetime.utcnow() - timedelta(days=7)
        elif date_range == "90days":
            start_date = datetime.utcnow() - timedelta(days=90)
        else:  # 30days default
            start_date = datetime.utcnow() - timedelta(days=30)
        
        # Get total issues
        total_issues = db.query(models.Detection).filter(
            models.Detection.timestamp >= start_date
        ).count()
        
        # Issues by type
        issues_by_type = db.query(
            models.Detection.type,
            func.count(models.Detection.id)
        ).filter(
            models.Detection.timestamp >= start_date
        ).group_by(models.Detection.type).all()
        
        issues_by_type_dict = {issue_type: count for issue_type, count in issues_by_type}
        
        # Issues by severity (using urgency as proxy)
        issues_by_severity = db.query(
            func.case(
                (models.Detection.urgency >= 4, 'critical'),
                (models.Detection.urgency >= 3, 'high'),
                (models.Detection.urgency >= 2, 'medium'),
                else_='low'
            ).label('severity'),
            func.count(models.Detection.id)
        ).filter(
            models.Detection.timestamp >= start_date
        ).group_by('severity').all()
        
        issues_by_severity_dict = {severity: count for severity, count in issues_by_severity}
        
        # Issues by status
        issues_by_status = db.query(
            models.Detection.status,
            func.count(models.Detection.id)
        ).filter(
            models.Detection.timestamp >= start_date
        ).group_by(models.Detection.status).all()
        
        issues_by_status_dict = {status: count for status, count in issues_by_status}
        
        # Mock data for areas (in real app, this would come from location data)
        issues_by_area = {
            "T. Nagar": 15,
            "Adyar": 12,
            "Mylapore": 8,
            "Velachery": 10,
            "Anna Nagar": 6,
            "Besant Nagar": 4,
            "Guindy": 7
        }
        
        # Mock resolution trends (daily data for last 30 days)
        resolution_trends = []
        for i in range(30):
            date = datetime.utcnow() - timedelta(days=i)
            resolution_trends.append({
                "date": date.strftime("%Y-%m-%d"),
                "resolved": 5 + (i % 3),  # Mock data
                "reported": 8 + (i % 5)   # Mock data
            })
        resolution_trends.reverse()
        
        # Mock department performance
        department_performance = [
            {"department": "GCC Public Works", "issues_handled": 45, "avg_resolution_time": 2.1},
            {"department": "GCC Water Department", "issues_handled": 32, "avg_resolution_time": 1.8},
            {"department": "GCC Electrical", "issues_handled": 28, "avg_resolution_time": 1.5},
            {"department": "GCC Sanitation", "issues_handled": 38, "avg_resolution_time": 2.3}
        ]
        
        print(f"Analytics data generated for {date_range}: {total_issues} total issues")
        
        return schemas.AnalyticsData(
            total_issues=total_issues,
            issues_by_type=issues_by_type_dict,
            issues_by_severity=issues_by_severity_dict,
            issues_by_status=issues_by_status_dict,
            issues_by_area=issues_by_area,
            resolution_trends=resolution_trends,
            department_performance=department_performance
        )
        
    except Exception as e:
        print(f"Error generating analytics data: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate analytics data")


@router.get("/issues/summary", response_model=List[Dict[str, Any]])
def get_issues_summary(
    limit: int = Query(10, description="Number of issues to return"),
    db: Session = Depends(database.get_db)
):
    """Get a summary of recent issues for the dashboard table."""
    try:
        # Get recent issues with mock data for demonstration
        issues = [
            {
                "id": "ISS-001",
                "type": "pothole",
                "title": "Large Pothole on Anna Salai",
                "location": "Anna Salai & Mount Road",
                "severity": "high",
                "status": "pending",
                "department": "Greater Chennai Corporation",
                "reportedBy": "AI Detection",
                "timestamp": datetime.utcnow() - timedelta(minutes=2),
                "assignedTo": "Rajesh Kumar",
                "estimatedTime": "2 hours"
            },
            {
                "id": "ISS-002",
                "type": "waterlogging",
                "title": "Water Main Break in Adyar",
                "location": "Adyar Bridge Road",
                "severity": "critical",
                "status": "in_progress",
                "department": "GCC Water Department",
                "reportedBy": "AI Detection",
                "timestamp": datetime.utcnow() - timedelta(minutes=5),
                "assignedTo": "Emergency Team",
                "estimatedTime": "4 hours"
            },
            {
                "id": "ISS-003",
                "type": "streetlight",
                "title": "Street Light Malfunction in Mylapore",
                "location": "Santhome High Road",
                "severity": "medium",
                "status": "assigned",
                "department": "GCC Electrical",
                "reportedBy": "Citizen Report",
                "timestamp": datetime.utcnow() - timedelta(minutes=15),
                "assignedTo": "Mohan Kumar",
                "estimatedTime": "1 hour"
            },
            {
                "id": "ISS-004",
                "type": "garbage",
                "title": "Overflowing Waste Bins in Velachery",
                "location": "Velachery Main Road",
                "severity": "medium",
                "status": "resolved",
                "department": "GCC Sanitation",
                "reportedBy": "AI Detection",
                "timestamp": datetime.utcnow() - timedelta(minutes=30),
                "assignedTo": "Priya Sharma",
                "estimatedTime": "Completed"
            },
            {
                "id": "ISS-005",
                "type": "pothole",
                "title": "Road Surface Damage on OMR",
                "location": "OMR Sholinganallur",
                "severity": "low",
                "status": "pending",
                "department": "Greater Chennai Corporation",
                "reportedBy": "Citizen Report",
                "timestamp": datetime.utcnow() - timedelta(minutes=45),
                "assignedTo": "Unassigned",
                "estimatedTime": "3 hours"
            }
        ]
        
        return issues[:limit]
        
    except Exception as e:
        print(f"Error getting issues summary: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get issues summary")


@router.post("/work-orders", response_model=schemas.WorkOrderResponse, status_code=201)
def create_work_order(work_order: schemas.WorkOrder, db: Session = Depends(database.get_db)):
    """Create a new work order for an issue."""
    try:
        # Verify issue exists
        issue = db.query(models.Detection).filter(models.Detection.id == work_order.issue_id).first()
        if not issue:
            raise HTTPException(status_code=404, detail="Issue not found")
        
        # Create work order
        db_work_order = models.WorkOrder(
            issue_id=work_order.issue_id,
            assigned_to=work_order.assigned_to,
            priority=work_order.priority,
            description=work_order.description,
            estimated_completion=work_order.estimated_completion
        )
        
        db.add(db_work_order)
        db.commit()
        db.refresh(db_work_order)
        
        print(f"New work order created: Issue {work_order.issue_id} assigned to {work_order.assigned_to}")
        
        return schemas.WorkOrderResponse(
            id=db_work_order.id,
            issue_id=db_work_order.issue_id,
            assigned_to=db_work_order.assigned_to,
            priority=db_work_order.priority,
            status=db_work_order.status,
            created_at=db_work_order.created_at,
            estimated_completion=db_work_order.estimated_completion,
            description=db_work_order.description
        )
        
    except Exception as e:
        db.rollback()
        print(f"Error creating work order: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create work order")


@router.get("/work-orders", response_model=List[schemas.WorkOrderResponse])
def get_work_orders(
    status: str = None,
    assigned_to: str = None,
    limit: int = 100,
    db: Session = Depends(database.get_db)
):
    """Get all work orders with optional filtering."""
    query = db.query(models.WorkOrder)
    
    if status:
        query = query.filter(models.WorkOrder.status == status)
    if assigned_to:
        query = query.filter(models.WorkOrder.assigned_to == assigned_to)
    
    work_orders = query.order_by(models.WorkOrder.created_at.desc()).limit(limit).all()
    
    return [
        schemas.WorkOrderResponse(
            id=wo.id,
            issue_id=wo.issue_id,
            assigned_to=wo.assigned_to,
            priority=wo.priority,
            status=wo.status,
            created_at=wo.created_at,
            estimated_completion=wo.estimated_completion,
            description=wo.description
        ) for wo in work_orders
    ]


@router.patch("/work-orders/{work_order_id}", response_model=schemas.WorkOrderResponse)
def update_work_order_status(
    work_order_id: int,
    status: str,
    completion_notes: str = None,
    db: Session = Depends(database.get_db)
):
    """Update the status of a work order."""
    work_order = db.query(models.WorkOrder).filter(models.WorkOrder.id == work_order_id).first()
    if not work_order:
        raise HTTPException(status_code=404, detail="Work order not found")
    
    work_order.status = status
    if status == 'completed':
        work_order.completed_at = datetime.utcnow()
    if completion_notes:
        work_order.completion_notes = completion_notes
    
    db.commit()
    db.refresh(work_order)
    
    print(f"Work order {work_order_id} status updated to: {status}")
    
    return schemas.WorkOrderResponse(
        id=work_order.id,
        issue_id=work_order.issue_id,
        assigned_to=work_order.assigned_to,
        priority=work_order.priority,
        status=work_order.status,
        created_at=work_order.created_at,
        estimated_completion=work_order.estimated_completion,
        description=work_order.description
    )
