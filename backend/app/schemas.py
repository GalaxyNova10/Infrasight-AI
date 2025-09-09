import uuid
from pydantic import BaseModel, EmailStr, ConfigDict, Field, validator
from typing import List, Optional, Any, Dict
from datetime import datetime, date
from enum import Enum # Import Enum
import re # Import regex module

# Import the enums from your models to ensure consistency
from .models import UserRoleEnum, IssueStatusEnum, IssuePriorityEnum, IssueTypeEnum, DepartmentTypeEnum, DetectionSourceEnum, WorkOrderStatusEnum

# ==============================================================================
# Base Schemas (Shared Properties)
# ==============================================================================

class UserProfileBase(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2, max_length=100)
    phone: Optional[str] = Field(None, min_length=5, max_length=20) # Consider regex for phone number format validation

class InfrastructureIssueBase(BaseModel):
    title: str = Field(min_length=5, max_length=150)
    description: Optional[str] = Field(None, max_length=1000)
    issue_type: IssueTypeEnum
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    address: Optional[str] = Field(None, max_length=255)
    priority: IssuePriorityEnum = IssuePriorityEnum.medium

class VideoFeedBase(BaseModel):
    name: str = Field(min_length=3, max_length=100)
    location_name: str = Field(min_length=3, max_length=150)
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    stream_url: str = Field(min_length=10, max_length=255) # Consider URL validation

class WorkOrderBase(BaseModel):
    title: str = Field(min_length=5, max_length=150)
    description: Optional[str] = Field(None, max_length=1000)
    department: DepartmentTypeEnum
    
# ==============================================================================
# Create Schemas (for POST/PUT requests - data coming IN)
# ==============================================================================

class UserProfileCreate(UserProfileBase):
    password: str = Field(min_length=8, max_length=50) # Consider adding regex for password complexity (e.g., uppercase, number, special char)
    role: UserRoleEnum = UserRoleEnum.citizen

    @validator('password')
    def password_complexity(cls, v):
        if not re.match(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$", v):
            raise ValueError('Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.')
        return v

class InfrastructureIssueCreate(InfrastructureIssueBase):
    detection_source: DetectionSourceEnum
    reported_by_id: uuid.UUID # Link to the user who reported it

class VideoFeedCreate(VideoFeedBase):
    is_active: bool = True
    ai_detection_enabled: bool = True

class WorkOrderCreate(WorkOrderBase):
    issue_id: uuid.UUID
    assigned_to_id: Optional[uuid.UUID] = None

class WorkOrderCreateRequest(BaseModel):
    department: DepartmentTypeEnum
    notes: Optional[str] = Field(None, max_length=1000)

class CitizenReport(BaseModel):
    full_name: str = Field(min_length=2, max_length=100)
    contact_number: str = Field(min_length=5, max_length=20) # Consider regex for phone number format validation
    locality: str = Field(min_length=2, max_length=100)
    issue_category: str = Field(min_length=2, max_length=100) # Consider making this an Enum or validating against a predefined list
    description: str = Field(min_length=10, max_length=1000)
    image_url: Optional[str] = Field(None, max_length=255) # Consider URL validation

class CitizenReportCreateForm(BaseModel):
    title: str = Field(min_length=5, max_length=150)
    description: Optional[str] = Field(None, max_length=1000)
    issue_type: IssueTypeEnum
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    address: Optional[str] = Field(None, max_length=255)

    model_config = ConfigDict(from_attributes=True)


# ==============================================================================
# Read Schemas (for GET requests - data going OUT)
# ==============================================================================

class UserProfile(UserProfileBase):
    id: uuid.UUID
    role: UserRoleEnum
    department: Optional[DepartmentTypeEnum] = None
    is_active: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class InfrastructureIssue(InfrastructureIssueBase):
    id: uuid.UUID
    status: IssueStatusEnum
    detection_source: DetectionSourceEnum
    detected_at: datetime
    updated_at: datetime
    
    # Example of including a nested object for related data
    reporter: Optional[UserProfile] = None
    
    model_config = ConfigDict(from_attributes=True)

class VideoFeed(VideoFeedBase):
    id: uuid.UUID
    is_active: bool
    ai_detection_enabled: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class WorkOrder(WorkOrderBase):
    id: uuid.UUID
    issue_id: uuid.UUID
    status: WorkOrderStatusEnum
    created_at: datetime
    updated_at: datetime
    assigned_to: Optional[UserProfile] = None

    model_config = ConfigDict(from_attributes=True)

class CitizenReportResponse(CitizenReport):
    id: uuid.UUID
    created_at: datetime

class Location(BaseModel):
    lat: float
    lon: float

# ==============================================================================
# Update Schemas
# ==============================================================================

class WorkOrderStatusUpdate(BaseModel):
    status: WorkOrderStatusEnum
    notes: Optional[str] = Field(None, max_length=1000)

# ==============================================================================
# Auth & Token Schemas
# ==============================================================================

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class GoogleToken(BaseModel):
    token: str

class PasswordResetRequest(BaseModel):
    token: str
    new_password: str = Field(min_length=8, max_length=50)

    @validator('new_password')
    def new_password_complexity(cls, v):
        if not re.match(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$", v):
            raise ValueError('New password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.')
        return v

# ==============================================================================
# Community Page & Other Specific Schemas
# ==============================================================================

class DateRangeEnum(str, Enum):
    seven_days = "7days"
    thirty_days = "30days"
    ninety_days = "90days"

class DashboardMetrics(BaseModel):
    active_issues: int
    resolution_rate: float
    ai_detections_today: int
    avg_response_time_hours: float

class SystemStatus(BaseModel):
    system_status: str
    ai_detection: str
    gcc_data_sync: str
    last_check: datetime

class Alert(BaseModel):
    id: str
    type: str
    message: str
    severity: str
    timestamp: datetime

class Issue(BaseModel):
    id: str
    type: str
    location: str
    status: str
    severity: str
    timestamp: datetime
    description: str
    reporter: str
    assignedTo: str
    priority: str
    estimatedResolutionTime: str

class RecentActivity(BaseModel):
    alerts: List[Alert]
    issues: List[Issue]

class LeaderboardEntry(BaseModel):
    username: str
    location: str
    reportCount: int
    avatarUrl: Optional[str] = None
    mostReportedIssueType: Optional[str] = None

class CommunityEvent(BaseModel):
    title: str
    date: str # Using str for simplicity, can be date
    location: str
    description: str

class SpotlightStory(BaseModel):
    issueTitle: str
    citizenReporter: str
    impactStatement: str
    imageUrl: Optional[str] = None

class AnalyticsSummary(BaseModel):
    issues_by_type: List[Dict[str, int]]
    issues_by_severity: List[Dict[str, int]]
    issues_by_status: List[Dict[str, int]]
    issues_by_area: List[Dict[str, int]]
    resolution_trends: List[Dict[str, Any]]
    department_performance: List[Dict[str, Any]]
    total_issues: int
    total_resolved: int
    overall_resolution_rate: float
    avg_resolution_time_days: float

class MapIssue(BaseModel):
    id: str
    issueType: str
    severity: str
    status: str
    area: str
    timestamp: datetime
    description: str
    reporter: str
    assignedTo: str
    priority: str
    estimatedResolutionTime: str

class GeoJSONFeature(BaseModel):
    type: str
    geometry: Dict[str, Any]
    properties: MapIssue

class GeoJSONFeatureCollection(BaseModel):
    type: str
    features: List[GeoJSONFeature]

class InfrastructureIssueAdmin(InfrastructureIssue):
    reporter: Optional[UserProfile] = None
    media: List["IssueMediaSchema"] = []
    assigned_to: Optional[UserProfile] = None

    model_config = ConfigDict(from_attributes=True)

class IssueMediaSchema(BaseModel):
    id: uuid.UUID
    issue_id: uuid.UUID
    file_url: str
    file_type: str
    uploaded_by_id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
