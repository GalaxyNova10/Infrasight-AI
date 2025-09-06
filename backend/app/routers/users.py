from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas, security
from ..database import get_db

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("/me/issues", response_model=List[schemas.InfrastructureIssue])
def get_my_issues(
    db: Session = Depends(get_db),
    current_user: models.UserProfile = Depends(security.get_current_user)
):
    """Fetch all issues reported by the currently authenticated user."""
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    issues = db.query(models.InfrastructureIssue).filter(
        models.InfrastructureIssue.reported_by_id == current_user.id
    ).order_by(models.InfrastructureIssue.detected_at.desc()).all()
    
    return issues