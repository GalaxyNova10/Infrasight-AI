from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from geoalchemy2.shape import to_shape
import uuid

from .. import models, schemas, alerting, database

router = APIRouter(
    prefix="/detections",
    tags=["AI Detections"]
)

# --- Helper function to convert DB objects to Pydantic schemas ---
def _convert_db_issue_to_schema(db_issue: models.InfrastructureIssue) -> schemas.InfrastructureIssue:
    """Safely converts the DB model to a Pydantic model, handling relationships."""
    reporter_data = None
    if db_issue.reporter:
        reporter_data = schemas.UserProfile.model_validate(db_issue.reporter)
    
    # Use model_validate for safe Pydantic v2 conversion from ORM objects
    issue_data = schemas.InfrastructureIssue.model_validate(db_issue).model_dump()
    if db_issue.location is not None:
        point = to_shape(db_issue.location)
        issue_data['location'] = schemas.Location(lat=point.y, lon=point.x)
    
    issue_data['reporter'] = reporter_data
    return schemas.InfrastructureIssue(**issue_data)


# --- Helper function for priority calculation ---
def calculate_priority(detection: schemas.InfrastructureIssueCreate) -> schemas.IssuePriorityEnum:
    """Calculates a priority level based on the issue type."""
    # This is a simplified logic. A real system might use confidence scores etc.
    score = 1
    
    if detection.issue_type in [schemas.IssueTypeEnum.water_leak, schemas.IssueTypeEnum.traffic_signal]:
        score += 2
    elif detection.issue_type in [schemas.IssueTypeEnum.pothole, schemas.IssueTypeEnum.streetlight_fault]:
        score += 1
    
    if score >= 3:
        return schemas.IssuePriorityEnum.high
    elif score == 2:
        return schemas.IssuePriorityEnum.medium
    else:
        return schemas.IssuePriorityEnum.low

# --- API Endpoints ---

@router.post("/", response_model=schemas.InfrastructureIssue, status_code=status.HTTP_201_CREATED)
def create_ai_detection(
    detection_data: schemas.InfrastructureIssueCreate, 
    db: Session = Depends(database.get_db)
):
    """
    Receives a new AI detection, creates a formal InfrastructureIssue,
    and saves it to the database.
    """
    priority = calculate_priority(detection_data)
    location_wkt = f'POINT({detection_data.longitude} {detection_data.latitude})'
    
    db_issue = models.InfrastructureIssue(
        title=f"AI Detected: {detection_data.issue_type.value.replace('_', ' ').title()}",
        description=detection_data.description,
        issue_type=detection_data.issue_type,
        latitude=detection_data.latitude,
        longitude=detection_data.longitude,
        location=location_wkt,
        priority=priority,
        detection_source=schemas.DetectionSourceEnum.ai_camera
        # NOTE: In a real system, a 'reported_by_id' for a system user would be added here
    )
    
    db.add(db_issue)
    db.commit()
    db.refresh(db_issue)
    
    response_issue = _convert_db_issue_to_schema(db_issue)
    
    if response_issue.priority in [schemas.IssuePriorityEnum.high, schemas.IssuePriorityEnum.critical]:
        # You can re-enable alerting here once alerting.py is updated
        # alerting.send_alert(response_issue)
        pass

    return response_issue