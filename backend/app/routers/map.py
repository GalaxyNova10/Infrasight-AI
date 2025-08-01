from fastapi import APIRouter, HTTPException, Query
from datetime import datetime, timedelta
import random
from typing import List, Optional
from ..schemas import MapIssue, GeoJSONFeature, GeoJSONFeatureCollection

router = APIRouter(prefix="/api/v1/map", tags=["map"])

@router.get("/issues", response_model=GeoJSONFeatureCollection)
async def get_map_issues(
    issue_type: Optional[str] = Query(None, description="Filter by issue type"),
    severity: Optional[str] = Query(None, description="Filter by severity level"),
    status: Optional[str] = Query(None, description="Filter by issue status"),
    area: Optional[str] = Query(None, description="Filter by area/locality")
):
    """
    Get GeoJSON data of all active infrastructure issues for the map.
    Supports filtering by issue type, severity, status, and area.
    """
    # Chennai-specific locations with coordinates
    chennai_areas = {
        "T. Nagar": {"lat": 13.0478, "lng": 80.2425},
        "Anna Salai": {"lat": 13.0827, "lng": 80.2707},
        "Adyar": {"lat": 13.0067, "lng": 80.2544},
        "Mylapore": {"lat": 13.0370, "lng": 80.2707},
        "Velachery": {"lat": 12.9716, "lng": 80.2207},
        "Sholinganallur": {"lat": 12.9067, "lng": 80.2277},
        "Anna Nagar": {"lat": 13.0827, "lng": 80.2707},
        "Besant Nagar": {"lat": 13.0067, "lng": 80.2544},
        "Guindy": {"lat": 13.0067, "lng": 80.2544},
        "Chromepet": {"lat": 12.9516, "lng": 80.1407},
        "Tambaram": {"lat": 12.9245, "lng": 80.1275},
        "Porur": {"lat": 13.0167, "lng": 80.1667},
        "Vadapalani": {"lat": 13.0500, "lng": 80.2167},
        "Alwarpet": {"lat": 13.0333, "lng": 80.2500},
        "Egmore": {"lat": 13.0833, "lng": 80.2667},
        "Triplicane": {"lat": 13.0667, "lng": 80.2667},
        "Royapettah": {"lat": 13.0500, "lng": 80.2500},
        "Mandaveli": {"lat": 13.0167, "lng": 80.2500},
        "Kotturpuram": {"lat": 13.0167, "lng": 80.2333},
        "Nungambakkam": {"lat": 13.0667, "lng": 80.2333},
        "Kodambakkam": {"lat": 13.0500, "lng": 80.2167}
    }
    
    # Chennai-specific issue types
    issue_types = [
        "Waterlogging", "Pothole", "Street Light Outage", "Garbage Overflow",
        "Sewage Blockage", "Traffic Signal Fault", "Road Damage", "Drain Blockage",
        "Illegal Banners", "Damaged Property", "Traffic Congestion", "Water Supply"
    ]
    
    # Generate mock issues
    features = []
    
    for i in range(random.randint(15, 35)):  # Generate 15-35 issues
        area_name = random.choice(list(chennai_areas.keys()))
        base_coords = chennai_areas[area_name]
        
        # Add some random variation to coordinates within the area
        lat = base_coords["lat"] + random.uniform(-0.005, 0.005)
        lng = base_coords["lng"] + random.uniform(-0.005, 0.005)
        
        issue_type = random.choice(issue_types)
        severity = random.choice(["Low", "Medium", "High", "Critical"])
        status = random.choice(["New", "In Progress", "Assigned", "Under Review"])
        
        # Apply filters if provided
        if issue_type and issue_type != issue_type:
            continue
        if severity and severity != severity:
            continue
        if status and status != status:
            continue
        if area and area_name.lower() != area.lower():
            continue
        
        # Generate issue timestamp
        issue_time = datetime.utcnow() - timedelta(hours=random.randint(1, 168))  # 1 hour to 1 week ago
        
        # Create GeoJSON feature
        feature = GeoJSONFeature(
            type="Feature",
            geometry={
                "type": "Point",
                "coordinates": [lng, lat]  # GeoJSON uses [longitude, latitude]
            },
            properties={
                "id": f"CHEN-{random.randint(1000, 9999)}",
                "issueType": issue_type,
                "severity": severity,
                "status": status,
                "area": area_name,
                "timestamp": issue_time.isoformat(),
                "description": f"{issue_type} issue in {area_name}",
                "reporter": f"Citizen-{random.randint(100, 999)}",
                "assignedTo": f"GCC {random.choice(['Roads', 'Water', 'Electrical', 'Sanitation'])} Department",
                "priority": random.choice(["Low", "Medium", "High"]),
                "estimatedResolutionTime": f"{random.randint(1, 7)} days"
            }
        )
        
        features.append(feature)
    
    return GeoJSONFeatureCollection(
        type="FeatureCollection",
        features=features
    )

@router.get("/issues/{issue_id}", response_model=GeoJSONFeature)
async def get_map_issue(issue_id: str):
    """
    Get specific issue by ID for map display.
    """
    # Get all issues and find the specific one
    all_issues = await get_map_issues()
    for feature in all_issues.features:
        if feature.properties["id"] == issue_id:
            return feature
    
    raise HTTPException(status_code=404, detail="Issue not found")

@router.get("/issues/area/{area_name}", response_model=GeoJSONFeatureCollection)
async def get_map_issues_by_area(area_name: str):
    """
    Get all issues for a specific area.
    """
    return await get_map_issues(area=area_name)

@router.get("/issues/type/{issue_type}", response_model=GeoJSONFeatureCollection)
async def get_map_issues_by_type(issue_type: str):
    """
    Get all issues of a specific type.
    """
    return await get_map_issues(issue_type=issue_type) 