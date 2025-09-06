from fastapi import APIRouter, Depends, HTTPException, status, Form, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import uuid
import os # Import os for file size check

# Import from your project's modules
from .. import database, schemas, crud, models, security

router = APIRouter(
    prefix="/citizen-reports",
    tags=["Citizen Reports"]
)

# Define allowed image types and max file size
ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"]
MAX_IMAGE_SIZE_MB = 5
MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024

@router.post("/", response_model=schemas.InfrastructureIssue, status_code=status.HTTP_201_CREATED)
def create_citizen_report(
    db: Session = Depends(database.get_db),
    current_user: models.UserProfile = Depends(security.get_current_active_user),
    # Use Form(...) for multipart/form-data from the frontend
    title: str = Form(...),
    description: str = Form(...),
    issue_type: schemas.IssueTypeEnum = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    address: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None) # Optional file upload
):
    """
    Creates a new infrastructure issue from a citizen report.
    This endpoint is designed to be called from a form that includes a file upload.
    """
    
    # Validate image file if provided
    if image:
        if image.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid image type. Only {', '.join(ALLOWED_IMAGE_TYPES)} are allowed."
            )
        # Read a small chunk to check size without loading entire file into memory
        # This is a basic check, for very large files, streaming might be better
        image.file.seek(0, os.SEEK_END)
        file_size = image.file.tell()
        image.file.seek(0) # Reset file pointer to the beginning

        if file_size > MAX_IMAGE_SIZE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Image file size exceeds {MAX_IMAGE_SIZE_MB}MB limit."
            )

    # In a real-world application, you would add logic here to:
    # 1. Get the currently logged-in user to set as the reporter.
    # 2. If an 'image' is provided, upload it to a cloud storage service (like AWS S3)
    #    and save the URL to a new IssueMedia record in the database.
    
    # Create the Pydantic schema for the new issue
    report_data = schemas.InfrastructureIssueCreate(
        title=title,
        description=description,
        issue_type=issue_type,
        latitude=latitude,
        longitude=longitude,
        address=address,
        detection_source='citizen_report',
        reported_by_id=current_user.id
    )
    
    # In a fully implemented system, you would call your CRUD function:
    new_issue = crud.create_infrastructure_issue(db=db, issue=report_data)
    return new_issue
    
    # Returning a placeholder response until the user ID logic is complete
    # to prevent database errors for now.
    # return {
    #     "id": uuid.uuid4(),
    #     "title": title,
    #     "description": description,
    #     "issue_type": issue_type,
    #     "latitude": latitude,
    #     "longitude": longitude,
    #     "address": address,
    #     "status": "detected",
    #     "priority": "medium",
    #     "detection_source": "citizen_report",
    #     "detected_at": datetime.utcnow(),
    #     "reporter": None
    # }

# NOTE: The other endpoints for getting/updating reports should be in a separate
# `issues.py` router, since citizen reports are just one type of issue.
# This keeps your API clean and avoids duplicate logic.
