from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Literal
from datetime import datetime
from geoalchemy2 import Geometry
from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, Text, JSON


class Location(BaseModel):
    lat: float
    lon: float


class DetectionBase(BaseModel):
    type: Literal['pothole', 'waterlogging', 'garbage', 'streetlights', 'traffic', 'banners', 'drains', 'damaged_property']
    confidence: float
    location: Location


class DetectionCreate(DetectionBase):
    pass


class DetectionRead(DetectionBase):
    id: int
    urgency: int
    status: str = 'reported'
    timestamp: datetime

    model_config = {
        "from_attributes": True  # Enables model conversion from ORM objects
    }


class Detection(DetectionRead):
    """Full detection model used internally."""
    pass


class Issue(BaseModel):
    id: int
    type: str
    description: Optional[str] = None
    location: Location
    severity: str
    confidence: float
    urgency_score: float
    status: str
    image_url: Optional[str] = None
    timestamp: datetime

    model_config = {
        "from_attributes": True  # Enables model conversion from ORM objects
    }


# New schemas for Chennai-specific functionality
class UserRegistration(BaseModel):
    firstName: str
    lastName: str
    email: str
    phone: str
    address: str
    city: str
    pincode: str
    notificationPreferences: dict
    issueCategories: List[str]
    agreeToTerms: bool
    agreeToPrivacy: bool
    subscribeNewsletter: bool


class UserResponse(BaseModel):
    id: int
    firstName: str
    lastName: str
    email: str
    city: str
    pincode: str
    createdAt: datetime

    model_config = {
        "from_attributes": True
    }


class CitizenReport(BaseModel):
    issue_type: str
    description: Optional[str] = None
    latitude: float
    longitude: float
    address: str
    city_area: str
    pincode: str
    reporter_name: Optional[str] = None
    reporter_email: Optional[str] = None
    reporter_phone: Optional[str] = None


class CitizenReportResponse(BaseModel):
    id: int
    issue_type: str
    description: Optional[str]
    location: Location
    address: str
    city_area: str
    pincode: str
    status: str
    reported_at: datetime
    reporter_name: Optional[str]
    reporter_email: Optional[str]

    model_config = {
        "from_attributes": True
    }


class DashboardMetrics(BaseModel):
    active_issues: int
    resolution_rate: float
    ai_detections_today: int
    avg_response_time_hours: float


class SystemStatus(BaseModel):
    system_status: str
    ai_detection: str
    gcc_data_sync: str
    last_check: str


class Alert(BaseModel):
    id: str
    type: str
    message: str
    severity: str
    timestamp: str


class Issue(BaseModel):
    id: str
    type: str
    location: str
    status: str
    severity: str
    timestamp: str
    description: str


class RecentActivity(BaseModel):
    alerts: List[Alert]
    issues: List[Issue]


class VideoFeed(BaseModel):
    id: str
    name: str
    location: str
    status: str
    url: str
    coordinates: Dict[str, float]
    description: str
    last_updated: str


class GeoJSONFeature(BaseModel):
    type: str = "Feature"
    geometry: Dict[str, Any]
    properties: Dict[str, Any]


class GeoJSONFeatureCollection(BaseModel):
    type: str = "FeatureCollection"
    features: List[GeoJSONFeature]


class MapIssue(BaseModel):
    id: str
    issue_type: str
    severity: str
    timestamp: str
    details: Dict[str, Any]


class AnalyticsData(BaseModel):
    issues_by_type: List[Dict[str, Any]]
    issues_by_severity: List[Dict[str, Any]]
    issues_by_status: List[Dict[str, Any]]
    issues_by_area: List[Dict[str, Any]]
    resolution_trends: List[Dict[str, Any]]
    department_performance: List[Dict[str, Any]]


class AnalyticsSummary(BaseModel):
    issues_by_type: List[Dict[str, Any]]
    issues_by_severity: List[Dict[str, Any]]
    issues_by_status: List[Dict[str, Any]]
    issues_by_area: List[Dict[str, Any]]
    resolution_trends: List[Dict[str, Any]]
    department_performance: List[Dict[str, Any]]
    total_issues: int
    total_resolved: int
    overall_resolution_rate: float
    avg_resolution_time_days: float


class CitizenReport(BaseModel):
    full_name: str
    contact_number: str
    locality: str
    issue_category: str
    description: str


class CitizenReportResponse(BaseModel):
    id: str
    title: str
    category: str
    location: str
    status: str
    submitted_date: str
    resolved_date: Optional[str] = None
    description: str
    priority: str
    assigned_to: str
    reporter_name: str
    contact_number: str
    updates: List[Dict[str, str]]


class UserRegistration(BaseModel):
    full_name: str
    email: str
    contact_number: str
    locality: str
    issue_categories: List[str]
    terms_accepted: bool


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    contact_number: str
    locality: str
    issue_categories: List[str]
    created_at: datetime


class WorkOrder(BaseModel):
    issue_id: str
    assigned_to: str
    priority: str
    description: str
    estimated_completion_date: str


class WorkOrderResponse(BaseModel):
    id: int
    issue_id: str
    assigned_to: str
    priority: str
    status: str
    description: str
    created_at: datetime
    estimated_completion_date: str
    completed_at: Optional[datetime] = None

# Existing schemas for backward compatibility
class DetectionBase(BaseModel):
    type: Literal[
        'pothole', 'waterlogging', 'garbage', 'streetlights', 
        'traffic', 'banners', 'drains', 'damaged_property'
    ]
    confidence: float = Field(..., ge=0.0, le=1.0)
    location: Location
    timestamp: datetime
    image_url: Optional[str] = None
    severity: Literal['low', 'medium', 'high', 'critical'] = 'medium'

class DetectionCreate(DetectionBase):
    pass

class Detection(DetectionBase):
    id: int
    urgency_score: float
    status: str = 'new'
    assigned_to: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True