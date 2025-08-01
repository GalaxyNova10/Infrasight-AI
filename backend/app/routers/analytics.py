from fastapi import APIRouter, HTTPException, Response
from datetime import datetime, timedelta
import random
import csv
import io
from typing import List, Dict, Any
from ..schemas import AnalyticsData, AnalyticsSummary

router = APIRouter(prefix="/api/v1/analytics", tags=["analytics"])

@router.get("/summary", response_model=AnalyticsSummary)
async def get_analytics_summary():
    """
    Get comprehensive analytics summary for the analytics dashboard.
    """
    # Chennai-specific areas
    chennai_areas = [
        "T. Nagar", "Adyar", "Mylapore", "Velachery", "Sholinganallur",
        "Anna Nagar", "Besant Nagar", "Guindy", "Chromepet", "Tambaram",
        "Porur", "Vadapalani", "Alwarpet", "Egmore", "Triplicane",
        "Royapettah", "Mandaveli", "Kotturpuram", "Nungambakkam", "Kodambakkam"
    ]
    
    # Issue categories
    issue_categories = [
        "Waterlogging / Flooding", "Garbage Disposal", "Potholes / Bad Roads",
        "Poor Street Lighting", "Traffic Congestion", "Illegal Banners / Posters",
        "Open Drains / Sewage Issues", "Damaged Public Property"
    ]
    
    # Generate issues by type data
    issues_by_type = []
    for category in issue_categories:
        count = random.randint(50, 300)
        resolved = int(count * random.uniform(0.7, 0.95))
        issues_by_type.append({
            "category": category,
            "total": count,
            "resolved": resolved,
            "pending": count - resolved,
            "resolution_rate": round((resolved / count) * 100, 1)
        })
    
    # Generate issues by severity data
    severity_levels = ["Low", "Medium", "High", "Critical"]
    issues_by_severity = []
    for severity in severity_levels:
        count = random.randint(20, 150)
        issues_by_severity.append({
            "severity": severity,
            "count": count,
            "percentage": round((count / sum([item["count"] for item in issues_by_severity])) * 100, 1) if issues_by_severity else round((count / 400) * 100, 1)
        })
    
    # Generate issues by status data
    status_types = ["New", "In Progress", "Assigned", "Under Review", "Resolved"]
    issues_by_status = []
    for status in status_types:
        count = random.randint(10, 100)
        issues_by_status.append({
            "status": status,
            "count": count,
            "percentage": round((count / sum([item["count"] for item in issues_by_status])) * 100, 1) if issues_by_status else round((count / 300) * 100, 1)
        })
    
    # Generate issues by area data
    issues_by_area = []
    for area in chennai_areas:
        total = random.randint(30, 200)
        resolved = int(total * random.uniform(0.6, 0.9))
        issues_by_area.append({
            "area": area,
            "total": total,
            "resolved": resolved,
            "pending": total - resolved,
            "resolution_rate": round((resolved / total) * 100, 1)
        })
    
    # Generate resolution trends (last 12 months)
    resolution_trends = []
    for i in range(12):
        month_date = datetime.utcnow() - timedelta(days=30 * i)
        reported = random.randint(80, 200)
        resolved = int(reported * random.uniform(0.7, 0.95))
        resolution_trends.append({
            "month": month_date.strftime("%B %Y"),
            "reported": reported,
            "resolved": resolved,
            "resolution_rate": round((resolved / reported) * 100, 1)
        })
    resolution_trends.reverse()  # Most recent first
    
    # Generate department performance data
    gcc_departments = [
        "GCC Roads Department", "GCC Water Department", "GCC Electrical Department",
        "GCC Sanitation Department", "GCC Traffic Department", "GCC Public Works"
    ]
    department_performance = []
    for dept in gcc_departments:
        total_assigned = random.randint(50, 200)
        completed = int(total_assigned * random.uniform(0.6, 0.9))
        avg_resolution_time = random.uniform(1.5, 4.5)
        department_performance.append({
            "department": dept,
            "total_assigned": total_assigned,
            "completed": completed,
            "pending": total_assigned - completed,
            "completion_rate": round((completed / total_assigned) * 100, 1),
            "avg_resolution_time_days": round(avg_resolution_time, 1)
        })
    
    return AnalyticsSummary(
        issues_by_type=issues_by_type,
        issues_by_severity=issues_by_severity,
        issues_by_status=issues_by_status,
        issues_by_area=issues_by_area,
        resolution_trends=resolution_trends,
        department_performance=department_performance,
        total_issues=sum([item["total"] for item in issues_by_type]),
        total_resolved=sum([item["resolved"] for item in issues_by_type]),
        overall_resolution_rate=round((sum([item["resolved"] for item in issues_by_type]) / sum([item["total"] for item in issues_by_type])) * 100, 1),
        avg_resolution_time_days=round(random.uniform(2.0, 3.5), 1)
    )

@router.get("/export")
async def export_analytics_data():
    """
    Export analytics data as CSV file.
    """
    # Get analytics summary
    summary = await get_analytics_summary()
    
    # Create CSV content
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow(["Chennai Civic Watch - Analytics Report"])
    writer.writerow([f"Generated on: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}"])
    writer.writerow([])
    
    # Summary statistics
    writer.writerow(["SUMMARY STATISTICS"])
    writer.writerow(["Total Issues", summary.total_issues])
    writer.writerow(["Total Resolved", summary.total_resolved])
    writer.writerow(["Overall Resolution Rate", f"{summary.overall_resolution_rate}%"])
    writer.writerow(["Average Resolution Time", f"{summary.avg_resolution_time_days} days"])
    writer.writerow([])
    
    # Issues by type
    writer.writerow(["ISSUES BY TYPE"])
    writer.writerow(["Category", "Total", "Resolved", "Pending", "Resolution Rate (%)"])
    for item in summary.issues_by_type:
        writer.writerow([item["category"], item["total"], item["resolved"], item["pending"], item["resolution_rate"]])
    writer.writerow([])
    
    # Issues by area
    writer.writerow(["ISSUES BY AREA"])
    writer.writerow(["Area", "Total", "Resolved", "Pending", "Resolution Rate (%)"])
    for item in summary.issues_by_area:
        writer.writerow([item["area"], item["total"], item["resolved"], item["pending"], item["resolution_rate"]])
    writer.writerow([])
    
    # Department performance
    writer.writerow(["DEPARTMENT PERFORMANCE"])
    writer.writerow(["Department", "Total Assigned", "Completed", "Pending", "Completion Rate (%)", "Avg Resolution Time (days)"])
    for item in summary.department_performance:
        writer.writerow([item["department"], item["total_assigned"], item["completed"], item["pending"], item["completion_rate"], item["avg_resolution_time_days"]])
    writer.writerow([])
    
    # Resolution trends
    writer.writerow(["RESOLUTION TRENDS (Last 12 Months)"])
    writer.writerow(["Month", "Reported", "Resolved", "Resolution Rate (%)"])
    for item in summary.resolution_trends:
        writer.writerow([item["month"], item["reported"], item["resolved"], item["resolution_rate"]])
    
    # Get CSV content
    csv_content = output.getvalue()
    output.close()
    
    # Return CSV file
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename=chennai-civic-watch-analytics-{datetime.utcnow().strftime('%Y%m%d')}.csv"
        }
    )

@router.get("/trends")
async def get_analytics_trends():
    """
    Get detailed trend analysis for the analytics dashboard.
    """
    # Generate trend data for the last 30 days
    trends = []
    for i in range(30):
        date = datetime.utcnow() - timedelta(days=29 - i)
        reported = random.randint(5, 25)
        resolved = int(reported * random.uniform(0.6, 0.9))
        ai_detections = random.randint(2, 15)
        
        trends.append({
            "date": date.strftime("%Y-%m-%d"),
            "reported": reported,
            "resolved": resolved,
            "ai_detections": ai_detections,
            "resolution_rate": round((resolved / reported) * 100, 1) if reported > 0 else 0
        })
    
    return {
        "daily_trends": trends,
        "period": "Last 30 days",
        "total_reported": sum([day["reported"] for day in trends]),
        "total_resolved": sum([day["resolved"] for day in trends]),
        "total_ai_detections": sum([day["ai_detections"] for day in trends])
    } 