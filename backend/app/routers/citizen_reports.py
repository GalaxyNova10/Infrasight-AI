from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from geoalchemy2.shape import to_shape
from datetime import datetime, timedelta

from .. import models, schemas, database

router = APIRouter(
    prefix="/api/v1",
    tags=["Citizen Reports"]
)


@router.post("/users/register", response_model=schemas.UserResponse, status_code=201)
def register_user(user_data: schemas.UserRegistration, db: Session = Depends(database.get_db)):
    """Register a new citizen user for the Chennai infrastructure reporting system."""
    try:
        # Check if user already exists
        existing_user = db.query(models.User).filter(models.User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="User with this email already exists")
        
        # Create new user
        db_user = models.User(
            first_name=user_data.firstName,
            last_name=user_data.lastName,
            email=user_data.email,
            phone=user_data.phone,
            address=user_data.address,
            city=user_data.city,
            pincode=user_data.pincode,
            notification_preferences=user_data.notificationPreferences,
            issue_categories=user_data.issueCategories,
            agree_to_terms=user_data.agreeToTerms,
            agree_to_privacy=user_data.agreeToPrivacy,
            subscribe_newsletter=user_data.subscribeNewsletter
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        print(f"New user registered: {user_data.email} from {user_data.city}")
        
        return schemas.UserResponse(
            id=db_user.id,
            firstName=db_user.first_name,
            lastName=db_user.last_name,
            email=db_user.email,
            city=db_user.city,
            pincode=db_user.pincode,
            createdAt=db_user.created_at
        )
        
    except Exception as e:
        db.rollback()
        print(f"Error registering user: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to register user")


@router.post("/citizen-reports", response_model=schemas.CitizenReportResponse, status_code=201)
def create_citizen_report(report_data: schemas.CitizenReport, db: Session = Depends(database.get_db)):
    """Create a new citizen report for infrastructure issues in Chennai."""
    try:
        # Create location WKT string
        location_wkt = f'POINT({report_data.longitude} {report_data.latitude})'
        
        # Calculate priority score based on issue type
        priority_score = 1
        if report_data.issue_type in ['waterlogging', 'drains']:
            priority_score = 4
        elif report_data.issue_type in ['potholes', 'streetlights']:
            priority_score = 3
        elif report_data.issue_type in ['garbage', 'banners']:
            priority_score = 2
        
        # Create citizen report
        db_report = models.CitizenReport(
            issue_type=report_data.issue_type,
            description=report_data.description,
            latitude=report_data.latitude,
            longitude=report_data.longitude,
            location=location_wkt,
            address=report_data.address,
            city_area=report_data.city_area,
            pincode=report_data.pincode,
            reporter_name=report_data.reporter_name,
            reporter_email=report_data.reporter_email,
            reporter_phone=report_data.reporter_phone,
            priority_score=priority_score
        )
        
        db.add(db_report)
        db.commit()
        db.refresh(db_report)
        
        print(f"New citizen report created: {report_data.issue_type} in {report_data.city_area}")
        
        # Convert location back to coordinates
        point = to_shape(db_report.location)
        
        return schemas.CitizenReportResponse(
            id=db_report.id,
            issue_type=db_report.issue_type,
            description=db_report.description,
            location=schemas.Location(lat=point.y, lon=point.x),
            address=db_report.address,
            city_area=db_report.city_area,
            pincode=db_report.pincode,
            status=db_report.status,
            reported_at=db_report.reported_at,
            reporter_name=db_report.reporter_name,
            reporter_email=db_report.reporter_email
        )
        
    except Exception as e:
        db.rollback()
        print(f"Error creating citizen report: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create citizen report")


@router.get("/citizen-reports", response_model=List[schemas.CitizenReportResponse])
def get_citizen_reports(
    city_area: str = None,
    issue_type: str = None,
    status: str = None,
    limit: int = 100,
    db: Session = Depends(database.get_db)
):
    """Get all citizen reports with optional filtering."""
    query = db.query(models.CitizenReport)
    
    if city_area:
        query = query.filter(models.CitizenReport.city_area == city_area)
    if issue_type:
        query = query.filter(models.CitizenReport.issue_type == issue_type)
    if status:
        query = query.filter(models.CitizenReport.status == status)
    
    reports = query.order_by(models.CitizenReport.reported_at.desc()).limit(limit).all()
    
    response_reports = []
    for report in reports:
        point = to_shape(report.location)
        response_reports.append(
            schemas.CitizenReportResponse(
                id=report.id,
                issue_type=report.issue_type,
                description=report.description,
                location=schemas.Location(lat=point.y, lon=point.x),
                address=report.address,
                city_area=report.city_area,
                pincode=report.pincode,
                status=report.status,
                reported_at=report.reported_at,
                reporter_name=report.reporter_name,
                reporter_email=report.reporter_email
            )
        )
    
    return response_reports


@router.get("/citizen-reports/{report_id}", response_model=schemas.CitizenReportResponse)
def get_citizen_report(report_id: int, db: Session = Depends(database.get_db)):
    """Get a specific citizen report by ID."""
    report = db.query(models.CitizenReport).filter(models.CitizenReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Citizen report not found")
    
    point = to_shape(report.location)
    return schemas.CitizenReportResponse(
        id=report.id,
        issue_type=report.issue_type,
        description=report.description,
        location=schemas.Location(lat=point.y, lon=point.x),
        address=report.address,
        city_area=report.city_area,
        pincode=report.pincode,
        status=report.status,
        reported_at=report.reported_at,
        reporter_name=report.reporter_name,
        reporter_email=report.reporter_email
    )


@router.patch("/citizen-reports/{report_id}", response_model=schemas.CitizenReportResponse)
def update_citizen_report_status(
    report_id: int, 
    status: str, 
    assigned_to: str = None,
    db: Session = Depends(database.get_db)
):
    """Update the status of a citizen report."""
    report = db.query(models.CitizenReport).filter(models.CitizenReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Citizen report not found")
    
    report.status = status
    if assigned_to:
        report.assigned_to = assigned_to
    
    db.commit()
    db.refresh(report)
    
    point = to_shape(report.location)
    return schemas.CitizenReportResponse(
        id=report.id,
        issue_type=report.issue_type,
        description=report.description,
        location=schemas.Location(lat=point.y, lon=point.x),
        address=report.address,
        city_area=report.city_area,
        pincode=report.pincode,
        status=report.status,
        reported_at=report.reported_at,
        reporter_name=report.reporter_name,
        reporter_email=report.reporter_email
    )
