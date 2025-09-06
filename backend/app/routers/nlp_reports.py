
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import crud, schemas, security, models
from ..database import get_db
from ..services import nlp_service

router = APIRouter(
    prefix="/reports",
    tags=["NLP Reports"],
    responses={404: {"description": "Not found"}},
)

class TextReport(schemas.BaseModel):
    report_text: str

@router.post("/text", response_model=schemas.InfrastructureIssue)
def create_issue_from_text(
    report: TextReport,
    db: Session = Depends(get_db),
    current_user: models.UserProfile = Depends(security.get_current_active_user),
):
    """
    Create an infrastructure issue from unstructured text.
    """
    nlp_result = nlp_service.analyze_report_text(report.report_text)

    issue_data = schemas.InfrastructureIssueCreate(
        title=nlp_result["title"],
        description=report.report_text,
        issue_type=nlp_result["issue_type"],
        latitude=0.0,  # Placeholder
        longitude=0.0, # Placeholder
        address=nlp_result["address"],
        detection_source=models.DetectionSourceEnum.citizen_report,
        reported_by_id=current_user.id,
    )

    return crud.create_infrastructure_issue(db=db, issue=issue_data)
