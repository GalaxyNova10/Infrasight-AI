from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import httpx
from .routers import detections, citizen_reports, issues
from .routers import dashboard, video_feeds, map, analytics, reports
from .database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Chennai Civic Watch API",
    description="AI-powered infrastructure monitoring and citizen reporting system for Greater Chennai Corporation",
    version="2.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(detections.router, prefix="/api/v1")
app.include_router(citizen_reports.router, prefix="/api/v1")
app.include_router(issues.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")
app.include_router(video_feeds.router, prefix="/api/v1")
app.include_router(map.router, prefix="/api/v1")
app.include_router(analytics.router, prefix="/api/v1")
app.include_router(reports.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "message": "Chennai Civic Watch API is running!",
        "version": "2.0.0",
        "status": "operational",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": "2024-01-20T10:00:00Z",
        "service": "Chennai Civic Watch API"
    }

@app.get("/api/v1/config/chennai")
async def get_chennai_config():
    """
    Get Chennai-specific configuration data for the frontend.
    """
    return {
        "city_areas": [
            "T. Nagar", "Adyar", "Mylapore", "Velachery", "Sholinganallur",
            "Anna Nagar", "Besant Nagar", "Guindy", "Chromepet", "Tambaram",
            "Porur", "Vadapalani", "Alwarpet", "Egmore", "Triplicane",
            "Royapettah", "Mandaveli", "Kotturpuram", "Nungambakkam", "Kodambakkam"
        ],
        "issue_categories": [
            "Waterlogging / Flooding",
            "Garbage Disposal / Waste Management", 
            "Potholes / Bad Roads",
            "Poor Street Lighting",
            "Traffic Congestion",
            "Illegal Banners / Posters",
            "Open Drains / Sewage Issues",
            "Damaged Public Property"
        ],
        "departments": [
            "GCC Roads Department",
            "GCC Water Department", 
            "GCC Electrical Department",
            "GCC Sanitation Department",
            "GCC Traffic Department",
            "GCC Public Works"
        ],
        "default_state": "Tamil Nadu",
        "default_city": "Chennai",
        "contact_info": {
            "email": "civicwatch@gcc.gov.in",
            "phone": "+91-44-2538-0000",
            "address": "Greater Chennai Corporation, Ripon Building, Chennai"
        }
    }

# Existing endpoints for backward compatibility
@app.post("/api/v1/citizen_reports/upload")
async def upload_citizen_report(
    full_name: str,
    contact_number: str,
    locality: str,
    issue_category: str,
    description: str,
    image_url: str = None
):
    """
    Upload a citizen report with image verification.
    """
    try:
        # Verify image using CV processor
        if image_url:
            cv_processor_url = "http://localhost:8001/verify"
            async with httpx.AsyncClient() as client:
                response = await client.post(cv_processor_url, json={"image_url": image_url})
                if response.status_code != 200:
                    raise HTTPException(status_code=400, detail="Image verification failed")
        
        # Create citizen report
        from .routers.citizen_reports import create_citizen_report
        report_data = {
            "full_name": full_name,
            "contact_number": contact_number,
            "locality": locality,
            "issue_category": issue_category,
            "description": description,
            "image_url": image_url
        }
        
        result = await create_citizen_report(report_data)
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/issues")
async def get_issues():
    """
    Get all issues ordered by timestamp descending.
    """
    from .routers.issues import get_issues_summary
    return await get_issues_summary()

@app.post("/api/v1/issues")
async def create_issue(issue_data: dict):
    """
    Create a new issue.
    """
    from .routers.detections import create_detection
    return await create_detection(issue_data)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)