from fastapi import APIRouter, HTTPException, UploadFile, File, Form, status, Depends
from datetime import datetime
import random
from typing import List, Optional
import os # Import os for file size check

from ..schemas import CitizenReport, CitizenReportResponse, IssueStatusEnum # Import IssueStatusEnum
from .. import database, schemas # Re-import schemas to ensure it's up-to-date

router = APIRouter(prefix="/api/v1/reports", tags=["reports"])

# Define allowed image types and max file size (duplicate from citizen_reports.py, consider centralizing)
ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"]
MAX_IMAGE_SIZE_MB = 5
MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024

@router.post("/", response_model=dict) # response_model can be CitizenReportResponse if saving to DB
async def submit_citizen_report(
    full_name: str = Form(...),
    contact_number: str = Form(...),
    locality: str = Form(...),
    issue_category: str = Form(...),
    description: str = Form(...),
    image: Optional[UploadFile] = File(None) # Optional file upload
):
    """
    Submit a new citizen report with file uploads.
    """
    try:
        report_data = CitizenReport(
            full_name=full_name,
            contact_number=contact_number,
            locality=locality,
            issue_category=issue_category,
            description=description
        )
        # Validate image file if provided
        if image:
            if image.content_type not in ALLOWED_IMAGE_TYPES:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid image type. Only {', '.join(ALLOWED_IMAGE_TYPES)} are allowed."
                )
            image.file.seek(0, os.SEEK_END)
            file_size = image.file.tell()
            image.file.seek(0) # Reset file pointer to the beginning

            if file_size > MAX_IMAGE_SIZE_BYTES:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Image file size exceeds {MAX_IMAGE_SIZE_MB}MB limit."
                )

        # Generate a unique report ID
        report_id = f"CHEN-{random.randint(1000, 9999)}"

        # Process uploaded files (in real implementation, save to storage)
        file_count = 1 if image else 0
        file_names = [image.filename] if image else []

        # Log the received data
        print(f"Received new citizen report:")
        print(f"  Report ID: {report_id}")
        print(f"  Full Name: {report_data.full_name}")
        print(f"  Contact: {report_data.contact_number}")
        print(f"  Locality: {report_data.locality}")
        print(f"  Category: {report_data.issue_category}")
        print(f"  Description: {report_data.description}")
        print(f"  Files uploaded: {file_count}")
        if file_names:
            print(f"  File names: {file_names}")

        # In real implementation, save to database
        # await save_citizen_report_to_db(report_data)

        return {
            "message": "Report submitted successfully",
            "report_id": report_id,
            "status": "New",
            "submitted_at": datetime.utcnow().isoformat(),
            "estimated_response_time": "24-48 hours",
            "files_uploaded": file_count
        }

    except Exception as e:
        print(f"Error processing citizen report: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to submit report. Please try again.")

@router.get("/my-reports", response_model=List[CitizenReportResponse])
async def get_my_reports(
    contact_number: Optional[str] = None,
    status: Optional[IssueStatusEnum] = None # Use IssueStatusEnum
):
    """
    Get reports submitted by a citizen (filtered by contact number).
    """
    # In real implementation, this would query the database
    # For now, return mock data

    mock_reports = [
        {
            "id": "CHEN-9821",
            "title": "Sewage Overflow near Kapaleeshwarar Temple",
            "category": "Open Drains / Sewage Issues",
            "location": "Mylapore",
            "status": "Resolved",
            "submitted_date": "2024-01-15T10:30:00Z",
            "resolved_date": "2024-01-17T14:20:00Z",
            "description": "Severe sewage overflow causing health hazards near the temple area",
            "priority": "High",
            "assigned_to": "GCC Sanitation Department",
            "reporter_name": "Rajesh Kumar",
            "contact_number": "+91-98765-43210",
            "updates": [
                {
                    "date": "2024-01-15T11:00:00Z",
                    "message": "Report received and assigned to sanitation team"
                },
                {
                    "date": "2024-01-16T09:30:00Z",
                    "message": "Team dispatched to location for assessment"
                },
                {
                    "date": "2024-01-17T14:20:00Z",
                    "message": "Issue resolved. Sewage line repaired and area cleaned"
                }
            ]
        },
        {
            "id": "CHEN-9822",
            "title": "Large Pothole on Anna Salai",
            "category": "Potholes / Bad Roads",
            "location": "Anna Salai",
            "status": "In Progress",
            "submitted_date": "2024-01-18T08:15:00Z",
            "description": "Large pothole causing traffic disruption and vehicle damage",
            "priority": "Medium",
            "assigned_to": "GCC Roads Department",
            "reporter_name": "Priya Sharma",
            "contact_number": "+91-98765-43211",
            "updates": [
                {
                    "date": "2024-01-18T09:00:00Z",
                    "message": "Report received and assigned to roads department"
                },
                {
                    "date": "2024-01-19T10:30:00Z",
                    "message": "Site inspection completed. Repair work scheduled"
                }
            ]
        }
    ]

    # Apply filters if provided
    if contact_number:
        mock_reports = [r for r in mock_reports if r["contact_number"] == contact_number]

    if status:
        mock_reports = [r for r in mock_reports if r["status"] == status.value] # Compare with .value

    return mock_reports

@router.get("/{report_id}", response_model=CitizenReportResponse)
async def get_citizen_report(report_id: str):
    """
    Get a specific citizen report by ID.
    """
    # In real implementation, query database by report_id
    # For now, return mock data

    mock_reports = [
        {
            "id": "CHEN-9821",
            "title": "Sewage Overflow near Kapaleeshwarar Temple",
            "category": "Open Drains / Sewage Issues",
            "location": "Mylapore",
            "status": "Resolved",
            "submitted_date": "2024-01-15T10:30:00Z",
            "resolved_date": "2024-01-17T14:20:00Z",
            "description": "Severe sewage overflow causing health hazards near the temple area",
            "priority": "High",
            "assigned_to": "GCC Sanitation Department",
            "reporter_name": "Rajesh Kumar",
            "contact_number": "+91-98765-43210",
            "updates": [
                {
                    "date": "2024-01-15T11:00:00Z",
                    "message": "Report received and assigned to sanitation team"
                },
                {
                    "date": "2024-01-16T09:30:00Z",
                    "message": "Team dispatched to location for assessment"
                },
                {
                    "date": "2024-01-17T14:20:00Z",
                    "message": "Issue resolved. Sewage line repaired and area cleaned"
                }
            ]
        }
    ]

    for report in mock_reports:
        if report["id"] == report_id:
            return report

    raise HTTPException(status_code=404, detail="Report not found")

@router.get("/stats/summary")
async def get_reports_summary():
    """
    Get summary statistics for citizen reports.
    """
    return {
        "total_reports": 1247,
        "resolved_reports": 1058,
        "pending_reports": 189,
        "resolution_rate": 84.8,
        "avg_response_time_hours": 18.5,
        "reports_today": 23,
        "reports_this_week": 156,
        "reports_this_month": 642
    }