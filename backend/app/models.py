from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, Enum, Numeric, JSON, Date
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
import uuid  # <-- ADDED
from .database import Base
from geoalchemy2 import Geometry  # <-- ADDED for PostGIS

# --- ENUMS (No changes needed) ---
class UserRoleEnum(str, enum.Enum):
    admin = 'admin'
    city_official = 'city_official'
    department_head = 'department_head'
    maintenance_crew = 'maintenance_crew'
    citizen = 'citizen'

class IssueStatusEnum(str, enum.Enum):
    detected = 'detected'
    verified = 'verified'
    in_progress = 'in_progress'
    resolved = 'resolved'
    false_positive = 'false_positive'

class IssuePriorityEnum(str, enum.Enum):
    low = 'low'
    medium = 'medium'
    high = 'high'
    critical = 'critical'

class IssueTypeEnum(str, enum.Enum):
    pothole = 'pothole'
    water_leak = 'water_leak'
    garbage_overflow = 'garbage_overflow'
    streetlight_fault = 'streetlight_fault'
    traffic_signal = 'traffic_signal'
    road_damage = 'road_damage'
    sidewalk_issue = 'sidewalk_issue'
    other = 'other'

class DepartmentTypeEnum(str, enum.Enum):
    public_works = 'public_works'
    utilities = 'utilities'
    transportation = 'transportation'
    sanitation = 'sanitation'
    parks_recreation = 'parks_recreation'

class DetectionSourceEnum(str, enum.Enum):
    ai_camera = 'ai_camera'
    citizen_report = 'citizen_report'
    sensor = 'sensor'
    manual_inspection = 'manual_inspection'

class WorkOrderStatusEnum(str, enum.Enum):
    pending = 'pending'
    in_progress = 'in_progress'
    completed = 'completed'
    cancelled = 'cancelled'

# --- MODELS ---
class UserProfile(Base):
    __tablename__ = 'user_profiles'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)  # <-- CHANGED
    email = Column(String, unique=True, nullable=False, index=True)  # <-- CHANGED
    full_name = Column(String, nullable=False)
    role = Column(Enum(UserRoleEnum), default=UserRoleEnum.citizen, nullable=False)
    department = Column(Enum(DepartmentTypeEnum))
    phone = Column(String)
    avatar_url = Column(String, nullable=True)
    password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    reset_token = Column(String, index=True, nullable=True)
    reset_token_expires = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # <-- CHANGED

    reported_issues = relationship('InfrastructureIssue', foreign_keys='InfrastructureIssue.reported_by_id', back_populates='reporter')
    assigned_issues = relationship('InfrastructureIssue', foreign_keys='InfrastructureIssue.assigned_to_id', back_populates='assignee')
    uploaded_media = relationship('IssueMedia', foreign_keys='IssueMedia.uploaded_by_id', back_populates='uploader')
    notifications = relationship('Notification', back_populates='user')

class VideoFeed(Base):
    __tablename__ = 'video_feeds'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)  # <-- CHANGED
    name = Column(String, nullable=False)
    location_name = Column(String, nullable=False)
    latitude = Column(Numeric(10, 8), nullable=False)
    longitude = Column(Numeric(11, 8), nullable=False)
    location = Column(Geometry(geometry_type='POINT', srid=4326), index=True)  # <-- ADDED
    stream_url = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    ai_detection_enabled = Column(Boolean, default=True)
    department = Column(Enum(DepartmentTypeEnum), default=DepartmentTypeEnum.public_works)
    installation_date = Column(Date)
    last_maintenance = Column(Date)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # <-- CHANGED

    issues = relationship('InfrastructureIssue', back_populates='video_feed')
    detections = relationship('AIDetection', back_populates='video_feed')

class InfrastructureIssue(Base):
    __tablename__ = 'infrastructure_issues'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)  # <-- CHANGED
    title = Column(String, nullable=False)
    description = Column(Text)
    issue_type = Column(Enum(IssueTypeEnum), nullable=False, index=True)  # <-- CHANGED
    status = Column(Enum(IssueStatusEnum), default=IssueStatusEnum.detected, index=True)  # <-- CHANGED
    priority = Column(Enum(IssuePriorityEnum), default=IssuePriorityEnum.medium)
    latitude = Column(Numeric(10, 8), nullable=False)
    longitude = Column(Numeric(11, 8), nullable=False)
    location = Column(Geometry(geometry_type='POINT', srid=4326), index=True)  # <-- ADDED
    address = Column(String)
    detection_source = Column(Enum(DetectionSourceEnum), nullable=False)
    video_feed_id = Column(UUID(as_uuid=True), ForeignKey('video_feeds.id'), index=True)  # <-- CHANGED
    reported_by_id = Column(UUID(as_uuid=True), ForeignKey('user_profiles.id'), index=True)  # <-- CHANGED
    assigned_to_id = Column(UUID(as_uuid=True), ForeignKey('user_profiles.id'), index=True)  # <-- CHANGED
    department = Column(Enum(DepartmentTypeEnum), index=True)  # <-- CHANGED
    estimated_cost = Column(Numeric(10, 2))
    detected_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # <-- CHANGED

    video_feed = relationship('VideoFeed', back_populates='issues')
    reporter = relationship('UserProfile', foreign_keys=[reported_by_id], back_populates='reported_issues')
    assignee = relationship('UserProfile', foreign_keys=[assigned_to_id], back_populates='assigned_issues')
    media = relationship('IssueMedia', back_populates='issue')
    work_orders = relationship('WorkOrder', back_populates='issue')
    detections = relationship('AIDetection', back_populates='issue')
    notifications = relationship('Notification', back_populates='issue')

class IssueMedia(Base):
    __tablename__ = 'issue_media'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)  # <-- CHANGED
    issue_id = Column(UUID(as_uuid=True), ForeignKey('infrastructure_issues.id'), nullable=False, index=True)  # <-- CHANGED
    file_url = Column(String, nullable=False)
    file_type = Column(String, nullable=False)  # 'image' or 'video'
    file_size = Column(Integer)
    description = Column(Text)
    taken_at = Column(DateTime, default=datetime.utcnow)
    uploaded_by_id = Column(UUID(as_uuid=True), ForeignKey('user_profiles.id'), index=True)  # <-- CHANGED
    created_at = Column(DateTime, default=datetime.utcnow)

    issue = relationship('InfrastructureIssue', back_populates='media')
    uploader = relationship('UserProfile', foreign_keys=[uploaded_by_id], back_populates='uploaded_media')  # <-- CHANGED

class WorkOrder(Base):
    __tablename__ = 'work_orders'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)  # <-- CHANGED
    issue_id = Column(UUID(as_uuid=True), ForeignKey('infrastructure_issues.id'), nullable=False, index=True)  # <-- CHANGED
    title = Column(String, nullable=False)
    description = Column(Text)
    status = Column(Enum(WorkOrderStatusEnum), default=WorkOrderStatusEnum.pending, nullable=False)
    assigned_to_id = Column(UUID(as_uuid=True), ForeignKey('user_profiles.id'), index=True)  # <-- CHANGED
    created_by_id = Column(UUID(as_uuid=True), ForeignKey('user_profiles.id'))
    department = Column(Enum(DepartmentTypeEnum), nullable=False, index=True)  # <-- CHANGED
    estimated_hours = Column(Numeric(5, 2))
    actual_hours = Column(Numeric(5, 2))
    materials_cost = Column(Numeric(10, 2))
    labor_cost = Column(Numeric(10, 2))
    scheduled_date = Column(Date)
    completed_date = Column(Date)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # <-- CHANGED

    issue = relationship('InfrastructureIssue', back_populates='work_orders')

class AIDetection(Base):
    __tablename__ = 'ai_detections'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)  # <-- CHANGED
    video_feed_id = Column(UUID(as_uuid=True), ForeignKey('video_feeds.id'), index=True)  # <-- CHANGED
    issue_id = Column(UUID(as_uuid=True), ForeignKey('infrastructure_issues.id'), index=True)  # <-- CHANGED
    detection_type = Column(Enum(IssueTypeEnum), nullable=False)
    confidence_score = Column(Numeric(5, 4), nullable=False)
    bounding_box = Column(JSON)
    image_url = Column(String)
    is_verified = Column(Boolean, default=False)
    verified_by_id = Column(UUID(as_uuid=True), ForeignKey('user_profiles.id'))
    verified_at = Column(DateTime)
    detected_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    video_feed = relationship('VideoFeed', back_populates='detections')
    issue = relationship('InfrastructureIssue', back_populates='detections')

class Notification(Base):
    __tablename__ = 'notifications'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)  # <-- CHANGED
    user_id = Column(UUID(as_uuid=True), ForeignKey('user_profiles.id'), nullable=False, index=True)  # <-- CHANGED
    issue_id = Column(UUID(as_uuid=True), ForeignKey('infrastructure_issues.id'), index=True)  # <-- CHANGED
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String, default='info')  # 'info', 'warning', 'error', 'success'
    is_read = Column(Boolean, default=False, index=True)  # <-- CHANGED
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship('UserProfile', back_populates='notifications')
    issue = relationship('InfrastructureIssue', back_populates='notifications')