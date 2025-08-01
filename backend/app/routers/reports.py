from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from datetime import datetime
import random
from typing import List, Optional
from ..schemas import CitizenReport, CitizenReportResponse

router = APIRouter(prefix="/api/v1/reports", tags=["reports"])

@router.post("/", response_model=dict)
async def submit_citizen_report(
    full_name: str = Form(...),
    contact_number: str = Form(...),
    locality: str = Form(...),
    issue_category: str = Form(...),
    description: str = Form(...),
    files: Optional[List[UploadFile]] = File(None)
):
    """
    Submit a new citizen report with file uploads.
    """
    try:
        # Validate required fields
        if not full_name or not contact_number or not locality or not issue_category or not description:
            raise HTTPException(status_code=400, detail="All required fields must be provided")
        
        # Generate a unique report ID
        report_id = f"CHEN-{random.randint(1000, 9999)}"
        
        # Process uploaded files (in real implementation, save to storage)
        file_count = len(files) if files else 0
        file_names = []
        if files:
            for file in files:
                # In real implementation, save file to cloud storage
                file_names.append(file.filename)
        
        # Log the received data
        print(f"Received new citizen report:")
        print(f"  Report ID: {report_id}")
        print(f"  Full Name: {full_name}")
        print(f"  Contact: {contact_number}")
        print(f"  Locality: {locality}")
        print(f"  Category: {issue_category}")
        print(f"  Description: {description}")
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
    status: Optional[str] = None
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
        mock_reports = [r for r in mock_reports if r["status"] == status]
    
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