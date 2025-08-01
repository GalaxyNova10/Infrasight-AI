from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from geoalchemy2.shape import to_shape

# Note the '..' for importing from the parent 'app' directory
from .. import models, schemas, alerting, database

router = APIRouter(
    prefix="/api/v1",
    tags=["Detections"]
)

# --- Helper Function ---
def calculate_urgency(detection: schemas.DetectionCreate) -> int:
    """Calculates an urgency score from 1 (low) to 5 (high) for Chennai infrastructure issues."""
    urgency = 1
    
    # Base urgency from confidence
    if detection.confidence > 0.85:
        urgency += 2
    elif detection.confidence > 0.70:
        urgency += 1
    
    # Chennai-specific issue type priorities
    if detection.type in ['waterlogging', 'drains']:
        urgency += 2  # High priority for water-related issues
    elif detection.type in ['potholes', 'streetlights']:
        urgency += 1  # Medium priority for road and lighting issues
    elif detection.type in ['garbage', 'banners']:
        urgency += 0  # Lower priority for aesthetic issues
    
    return min(urgency, 5)


@router.post("/detections", response_model=schemas.Detection, status_code=201)
def create_detection(
    detection: schemas.DetectionCreate, db: Session = Depends(database.get_db)
):
    """Receive a new detection and save it to the database."""
    urgency_score = calculate_urgency(detection)
    location_wkt = f'POINT({detection.location.lon} {detection.location.lat})'
    
    db_detection = models.Detection(
        type=detection.type, confidence=detection.confidence,
        latitude=detection.location.lat, longitude=detection.location.lon,
        location=location_wkt, urgency=urgency_score
    )
    
    db.add(db_detection)
    db.commit()
    db.refresh(db_detection)
    
    point = to_shape(db_detection.location)
    response_detection = schemas.Detection(
        id=db_detection.id, type=db_detection.type, confidence=db_detection.confidence,
        urgency=db_detection.urgency, status=db_detection.status,
        timestamp=db_detection.timestamp,  # Add timestamp to the response
        location=schemas.Location(lat=point.y, lon=point.x)
    )
    
    if response_detection.urgency >= 4:
        alerting.send_alert(response_detection)

    return response_detection


@router.get("/issues", response_model=List[schemas.Detection])
def get_all_issues(db: Session = Depends(database.get_db)):
    """Get all logged issues from the database."""
    issues = db.query(models.Detection).order_by(models.Detection.id.desc()).all()
    
    response_issues = []
    for issue in issues:
        point = to_shape(issue.location)
        response_issues.append(
            schemas.Detection(
                id=issue.id, type=issue.type, confidence=issue.confidence,
                urgency=issue.urgency, status=issue.status,
                timestamp=issue.timestamp,  # Add timestamp to the response
                location=schemas.Location(lat=point.y, lon=point.x)
            )
        )
    return response_issues


@router.patch("/issues/{issue_id}", response_model=schemas.Detection)
def update_issue_status(
    issue_id: int, status: str, db: Session = Depends(database.get_db)
):
    """Finds an issue by its ID and updates its status."""
    db_issue = db.query(models.Detection).filter(models.Detection.id == issue_id).first()
    if db_issue is None:
        raise HTTPException(status_code=404, detail="Issue not found")

    db_issue.status = status
    db.commit()
    db.refresh(db_issue)
    
    point = to_shape(db_issue.location)
    response_issue = schemas.Detection(
        id=db_issue.id, type=db_issue.type, confidence=db_issue.confidence,
        urgency=db_issue.urgency, status=db_issue.status,
        timestamp=db_issue.timestamp,  # Add timestamp to the response
        location=schemas.Location(lat=point.y, lon=point.x)
    )
    return response_issue