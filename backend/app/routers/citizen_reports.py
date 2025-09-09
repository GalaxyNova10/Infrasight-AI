from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import Optional
import shutil
import os
import uuid

from .. import crud, schemas, models
from ..database import get_db
from ..security import get_current_active_user

router = APIRouter(
    prefix="/citizen-reports",
    tags=["citizen-reports"],
    responses={404: {"description": "Not found"}},
)

UPLOAD_DIR = "backend/uploads"

# Ensure the upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/", response_model=schemas.InfrastructureIssue)
async def create_citizen_report(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    issue_type: models.IssueTypeEnum = Form(...),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    address: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    current_user: models.UserProfile = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Allows an authenticated citizen to report an infrastructure issue.
    Includes optional image upload and links the report to the current user.
    """
    print(f"Received report: title={title}, issue_type={issue_type}, latitude={latitude}, longitude={longitude}")

    image_path = None
    if image:
        try:
            file_extension = os.path.splitext(image.filename)[1]
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            image_path = os.path.join(UPLOAD_DIR, unique_filename)

            # Save the image to the local filesystem
            with open(image_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Could not upload image: {e}")

    # Create the InfrastructureIssue
    issue_create = schemas.InfrastructureIssueCreate(
        title=title,
        description=description,
        issue_type=issue_type,
        latitude=latitude,
        longitude=longitude,
        address=address,
        detection_source=models.DetectionSourceEnum.citizen_report,
        reported_by_id=current_user.id
    )
    db_issue = crud.create_infrastructure_issue(db=db, issue=issue_create)

    # If an image was uploaded, create a Media record
    if image_path:
        media_file_url = f"/uploads/{unique_filename}"
        crud.create_issue_media(
            db=db,
            issue_id=db_issue.id,
            file_path=media_file_url,
            uploaded_by_id=current_user.id
        )

    return db_issue