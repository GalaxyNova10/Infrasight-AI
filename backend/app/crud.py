# backend/app/crud.py
from sqlalchemy.orm import Session
from . import models, schemas, security

def get_user_by_email(db: Session, email: str):
    """Fetches a single user by their email address."""
    return db.query(models.UserProfile).filter(models.UserProfile.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    """Fetches all users with pagination."""
    return db.query(models.UserProfile).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserProfileCreate):
    """Creates a new user, hashes the password, and saves to the database."""
    hashed_password = security.get_password_hash(user.password)
    db_user = models.UserProfile(
        email=user.email,
        full_name=user.full_name,
        password=hashed_password,
        role=user.role,
        phone=user.phone
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_infrastructure_issue(db: Session, issue: schemas.InfrastructureIssueCreate):
    """Creates a new infrastructure issue and saves it to the database."""
    db_issue = models.InfrastructureIssue(**issue.model_dump())
    db.add(db_issue)
    db.commit()
    db.refresh(db_issue)
    return db_issue

def create_issue_media(db: Session, issue_id: str, file_path: str, uploaded_by_id: str):
    """Creates a new issue media record."""
    db_media = models.IssueMedia(
        issue_id=issue_id,
        file_url=file_path,
        uploaded_by_id=uploaded_by_id,
        file_type='image' # Assuming image for now
    )
    db.add(db_media)
    db.commit()
    db.refresh(db_media)
    return db_media
