from .utils.scoring import calculate_urgency_score

def create_issue(db: Session, issue: schemas.IssueCreate):
    urgency = calculate_urgency_score(issue.type, issue.latitude, issue.longitude)
    db_issue = models.Issue(
        type=issue.type,
        description=issue.description,
        latitude=issue.latitude,
        longitude=issue.longitude,
        severity=issue.severity,
        urgency_score=urgency,
        image_url=issue.image_url,
    )
    db.add(db_issue)
    db.commit()
    db.refresh(db_issue)
    return db_issue