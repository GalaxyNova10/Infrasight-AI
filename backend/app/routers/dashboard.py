from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
import random
from typing import List, Dict, Any
from ..schemas import DashboardMetrics, SystemStatus, RecentActivity

router = APIRouter(prefix="/api/v1/dashboard", tags=["dashboard"])

@router.get("/stats", response_model=DashboardMetrics)
async def get_dashboard_stats():
    """
    Get dashboard statistics including active issues, resolution rate, AI detections, and response time.
    """
    # Generate realistic but dynamic stats
    base_active_issues = 125
    base_resolution_rate = 85
    base_ai_detections = 42
    base_response_time = 18
    
    # Add some variation to make it feel real-time
    active_issues = base_active_issues + random.randint(-10, 15)
    resolution_rate = max(70, min(95, base_resolution_rate + random.randint(-5, 8)))
    ai_detections = base_ai_detections + random.randint(-8, 12)
    response_time = max(12, min(24, base_response_time + random.randint(-3, 5)))
    
    return DashboardMetrics(
        active_issues=active_issues,
        resolution_rate=resolution_rate,
        ai_detections_today=ai_detections,
        avg_response_time_hours=response_time
    )

@router.get("/system-status", response_model=SystemStatus)
async def get_system_status():
    """
    Get current system status including AI detection, data sync, and last check time.
    """
    # Simulate system status with occasional issues
    status_options = [
        "All systems operational",
        "All systems operational",
        "All systems operational",
        "Minor delays in data processing",
        "All systems operational"
    ]
    
    ai_status_options = [
        "Active",
        "Active",
        "Active",
        "Processing",
        "Active"
    ]
    
    sync_status_options = [
        "Real-time",
        "Real-time",
        "Real-time",
        "Slight delay",
        "Real-time"
    ]
    
    return SystemStatus(
        system_status=random.choice(status_options),
        ai_detection=random.choice(ai_status_options),
        gcc_data_sync=random.choice(sync_status_options),
        last_check=datetime.utcnow().isoformat()
    )

@router.get("/recent-activity", response_model=RecentActivity)
async def get_recent_activity():
    """
    Get recent alerts and issues for the dashboard.
    """
    # Chennai-specific locations
    chennai_locations = [
        "Anna Salai", "Mount Road", "Adyar Bridge", "T. Nagar", "Mylapore",
        "Velachery", "Sholinganallur", "Anna Nagar", "Besant Nagar", "Guindy",
        "Chromepet", "Tambaram", "Porur", "Vadapalani", "Alwarpet", "Egmore"
    ]
    
    # Chennai-specific issue types
    issue_types = [
        "Waterlogging", "Pothole", "Street Light Outage", "Garbage Overflow",
        "Sewage Blockage", "Traffic Signal Fault", "Road Damage", "Drain Blockage"
    ]
    
    # Generate recent alerts
    alerts = []
    for i in range(random.randint(3, 8)):
        alert_time = datetime.utcnow() - timedelta(minutes=random.randint(5, 120))
        alerts.append({
            "id": f"ALERT-{random.randint(1000, 9999)}",
            "type": random.choice(["AI Detection", "Manual Report", "System Alert"]),
            "message": f"New {random.choice(issue_types).lower()} detected in {random.choice(chennai_locations)}",
            "severity": random.choice(["Low", "Medium", "High"]),
            "timestamp": alert_time.isoformat()
        })
    
    # Generate recent issues
    issues = []
    for i in range(random.randint(5, 12)):
        issue_time = datetime.utcnow() - timedelta(hours=random.randint(1, 48))
        issue_type = random.choice(issue_types)
        location = random.choice(chennai_locations)
        
        issues.append({
            "id": f"CHEN-{random.randint(1000, 9999)}",
            "type": issue_type,
            "location": location,
            "status": random.choice(["New", "In Progress", "Assigned", "Under Review"]),
            "severity": random.choice(["Low", "Medium", "High", "Critical"]),
            "timestamp": issue_time.isoformat(),
            "description": f"{issue_type} issue reported in {location} area"
        })
    
    # Sort by timestamp (most recent first)
    alerts.sort(key=lambda x: x["timestamp"], reverse=True)
    issues.sort(key=lambda x: x["timestamp"], reverse=True)
    
    return RecentActivity(
        alerts=alerts[:5],  # Return only 5 most recent alerts
        issues=issues[:8]   # Return only 8 most recent issues
    ) 