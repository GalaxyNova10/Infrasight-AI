# backend/app/main.py

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, Request, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse # Import JSONResponse
from fastapi.exceptions import RequestValidationError # Import RequestValidationError
from pydantic import ValidationError # Import ValidationError

from fastapi.staticfiles import StaticFiles
from sqlalchemy import text

# Import your project modules
from . import models, schemas, cv_model
from .database import engine, get_db

# Import all your routers
from .routers import (
    auth,
    users,
    issues,
    video_feeds,
    analytics,
    community,
    system,
    detections,
    citizen_reports,
    dashboard,
    map,
    reports,
    cv_api,
    nlp_reports
)

# Create database tables on startup
models.Base.metadata.create_all(bind=engine)

# Define the lifespan event manager to load the model on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Code to run on startup
    print("--- Loading CV Model ---")
    cv_model.load_models()
    print("--- CV Model Loaded Successfully ---")
    yield
    # Code to run on shutdown (optional)
    print("--- Application Shutting Down ---")

# Initialize the FastAPI app
app = FastAPI(
    title="InfraSight API",
    description="AI-powered infrastructure monitoring and citizen reporting system.",
    version="1.0.0",
    lifespan=lifespan  # Use the lifespan event for startup tasks
)

app.mount("/videos", StaticFiles(directory="videos"), name="videos")
app.mount("/uploads", StaticFiles(directory="backend/uploads"), name="uploads")

# Configure CORS (Cross-Origin Resource Sharing)
origins = [
    "http://localhost:3000",
    "http://localhost:5173", # Vite's default port
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom exception handler for RequestValidationError (422 errors)
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print(f"Validation error occurred: {exc.errors()} for request: {request.url}")
    # Do not try to serialize exc.body directly, just return the detail
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors()}
    )

# Custom exception handler for Pydantic ValidationError (if not caught by RequestValidationError)
@app.exception_handler(ValidationError)
async def pydantic_validation_exception_handler(request: Request, exc: ValidationError):
    print(f"Pydantic validation error occurred: {exc.errors()} for request: {request.url}")
    # Do not try to serialize exc.body directly, just return the detail
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors()}
    )


# Include all the API routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(issues.router, prefix="/api/v1")
app.include_router(video_feeds.router, prefix="/api/v1")
app.include_router(analytics.router, prefix="/api/v1")
app.include_router(community.router, prefix="/api/v1")
app.include_router(system.router, prefix="/api/v1")
app.include_router(detections.router, prefix="/api/v1")
app.include_router(citizen_reports.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")
app.include_router(map.router, prefix="/api/v1")
app.include_router(reports.router, prefix="/api/v1")
app.include_router(cv_api.router, prefix="/api/v1")
app.include_router(nlp_reports.router, prefix="/api/v1")


# Root and Health Check endpoints
@app.get("/")
async def root():
    return {
        "message": "InfraSight AI API is running!",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text('SELECT 1')) # Changed this line
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": "disconnected", "error": str(e)}