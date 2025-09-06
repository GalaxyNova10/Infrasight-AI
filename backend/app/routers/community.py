# backend/app/routers/community.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, extract
from typing import List, Optional
from datetime import datetime
from geoalchemy2.shape import to_shape

from .. import models, schemas, database

router = APIRouter(
    prefix="/community",
    tags=["Community"]
)

def get_all_issues(db: Session):
    """Gets all issues for the community map."""
    all_issues = db.query(models.InfrastructureIssue).options(joinedload(models.InfrastructureIssue.reporter)).order_by(
        models.InfrastructureIssue.detected_at.desc()
    ).all()
    
    results = []
    for issue in all_issues:
        issue_data = {
            "id": issue.id,
            "title": issue.title,
            "description": issue.description,
            "issue_type": issue.issue_type,
            "status": issue.status,
            "priority": issue.priority,
            "latitude": issue.latitude,
            "longitude": issue.longitude,
            "address": issue.address,
            "detection_source": issue.detection_source,
            "detected_at": issue.detected_at,
            "updated_at": issue.updated_at,
            "reporter": issue.reporter,
        }
        results.append(schemas.InfrastructureIssue.model_validate(issue_data))

    return results

# --- Individual Data Functions (kept for clarity) ---

def get_community_stats(db: Session):
    current_month = datetime.utcnow().month
    current_year = datetime.utcnow().year

    stats = db.query(
        func.count(models.InfrastructureIssue.id).filter(
            models.InfrastructureIssue.status == schemas.IssueStatusEnum.resolved,
            extract('month', models.InfrastructureIssue.resolved_at) == current_month,
            extract('year', models.InfrastructureIssue.resolved_at) == current_year
        ),
        func.count(func.distinct(models.InfrastructureIssue.reported_by_id))
    ).one()

    issues_resolved_this_month = stats[0] or 0
    active_reporters = stats[1] or 0
    
    community_impact_score = round((issues_resolved_this_month * 1.5) + (active_reporters * 1.2))

    return {
        "issuesResolvedThisMonth": issues_resolved_this_month,
        "activeReporters": active_reporters,
        "communityImpactScore": community_impact_score
    }

def get_development_news():
    return [
        {
            "title": "GCC Intensifies Monsoon Preparedness Across City",
            "summary": "The Greater Chennai Corporation has expedited stormwater drain desilting and is setting up relief centers.",
            "imageUrl": "/assets/images/gcc_action.png",
            "link": "#"
        },
        {
            "title": "Phase II Metro Construction Progresses in Porur",
            "summary": "CMRL reports significant progress on the elevated corridor for the Metro's Phase II.",
            "imageUrl": "/assets/images/resolution.png",
            "link": "#"
        },
    ]

def get_leaderboard(db: Session):
    leaderboard_data = (
        db.query(
            models.UserProfile.full_name,
            models.UserProfile.avatar_url,
            func.count(models.InfrastructureIssue.id).label('report_count')
        )
        .join(models.InfrastructureIssue, models.UserProfile.id == models.InfrastructureIssue.reported_by_id)
        .group_by(models.UserProfile.id)
        .order_by(func.count(models.InfrastructureIssue.id).desc())
        .limit(5)
        .all()
    )
    return [
        schemas.LeaderboardEntry(
            username=name,
            avatarUrl=avatar,
            reportCount=count,
            location="Chennai",
            mostReportedIssueType="Potholes"
        )
        for name, avatar, count in leaderboard_data
    ]

def get_events():
    return [
        {
            "title": "Besant Nagar Beach Cleanup Drive",
            "date": "2025-09-15",
            "location": "Besant Nagar Beach",
            "description": "Join us for the monthly cleanup drive to keep our shores clean."
        },
        {
            "title": "Tree Plantation at Madhavaram",
            "date": "2025-10-05",
            "location": "Madhavaram Botanical Garden",
            "description": "A community initiative to increase the green cover in North Chennai."
        }
    ]

def get_spotlight(db: Session):
    resolved_issues_with_media = db.query(models.InfrastructureIssue).options(
        joinedload(models.InfrastructureIssue.media),
        joinedload(models.InfrastructureIssue.reporter)
    ).filter(
        models.InfrastructureIssue.status == schemas.IssueStatusEnum.resolved,
        models.InfrastructureIssue.media.any()
    ).order_by(models.InfrastructureIssue.resolved_at.desc()).limit(10).all()

    spotlight_stories = []
    for issue in resolved_issues_with_media:
        if len(spotlight_stories) >= 2: break
        
        sorted_media = sorted(issue.media, key=lambda m: m.uploaded_at)
        
        if len(sorted_media) >= 2:
            reporter_name = issue.reporter.full_name if issue.reporter else "An Active Citizen"
            story = schemas.SpotlightStory(
                issueTitle=f"{issue.issue_type.value.replace('_', ' ').title()} Fixed in {issue.address}",
                citizenReporter=reporter_name,
                resolved_date=issue.resolved_at,
                impact_statement=f"A '{issue.issue_type.value.replace('_', ' ').title()}' issue was resolved, improving the area.",
                before_image_url=sorted_media[0].file_url,
                after_image_url=sorted_media[-1].file_url
            )
            spotlight_stories.append(story)

    if not spotlight_stories:
        return [schemas.SpotlightStory(
            issueTitle="Awaiting Community Reports!",
            citizenReporter="You?",
            impactStatement="Report an issue and upload before/after photos to see your success story here!"
        )]
    return spotlight_stories

def get_all_issues(db: Session):
    """Gets all issues for the community map."""
    all_issues = db.query(models.InfrastructureIssue).options(joinedload(models.InfrastructureIssue.reporter)).order_by(
        models.InfrastructureIssue.detected_at.desc()
    ).all()
    
    results = []
    for issue in all_issues:
        issue_data = {
            "id": issue.id,
            "title": issue.title,
            "description": issue.description,
            "issue_type": issue.issue_type,
            "status": issue.status,
            "priority": issue.priority,
            "latitude": issue.latitude,
            "longitude": issue.longitude,
            "address": issue.address,
            "detection_source": issue.detection_source,
            "detected_at": issue.detected_at,
            "updated_at": issue.updated_at,
            "reporter": issue.reporter,
        }
        results.append(schemas.InfrastructureIssue.model_validate(issue_data))

    return results

# --- Main Endpoint to Consolidate Data ---

@router.get("/")
def get_community_hub_data(db: Session = Depends(database.get_db)):
    """
    Returns all necessary data for the community hub page in a single request.
    """
    try:
        return {
            "stats": get_community_stats(db),
            "developmentNews": get_development_news(),
            "leaderboard": get_leaderboard(db),
            "events": get_events(),
            "spotlight": get_spotlight(db),
            "issues": get_all_issues(db)
        }
    except Exception as e:
        return {"error": str(e)}
