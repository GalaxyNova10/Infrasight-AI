from fastapi import APIRouter

router = APIRouter()

@router.get("/system/stats")
async def get_system_stats():
    return {
        "total_issues": 1234,
        "resolved_issues": 1000,
        "active_users": 500,
        "new_reports_today": 50
    }
