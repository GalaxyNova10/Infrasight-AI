from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
import random
from typing import List
from ..schemas import VideoFeed

router = APIRouter(prefix="/api/v1/video-feeds", tags=["video-feeds"])

@router.get("/", response_model=List[VideoFeed])
async def get_video_feeds():
    """
    Get list of all video feeds with Chennai-specific locations and metadata.
    """
    # Chennai-specific camera locations
    chennai_cameras = [
        {
            "name": "T. Nagar Traffic Cam",
            "location": "T. Nagar",
            "coordinates": {"lat": 13.0478, "lng": 80.2425},
            "description": "Traffic monitoring at T. Nagar junction"
        },
        {
            "name": "Anna Salai Main Cam",
            "location": "Anna Salai",
            "coordinates": {"lat": 13.0827, "lng": 80.2707},
            "description": "Main road monitoring on Anna Salai"
        },
        {
            "name": "Adyar Bridge Cam",
            "location": "Adyar",
            "coordinates": {"lat": 13.0067, "lng": 80.2544},
            "description": "Bridge and traffic monitoring"
        },
        {
            "name": "Mylapore Temple Cam",
            "location": "Mylapore",
            "coordinates": {"lat": 13.0370, "lng": 80.2707},
            "description": "Area around Kapaleeshwarar Temple"
        },
        {
            "name": "Velachery Junction Cam",
            "location": "Velachery",
            "coordinates": {"lat": 12.9716, "lng": 80.2207},
            "description": "Major junction monitoring"
        },
        {
            "name": "Sholinganallur OMR Cam",
            "location": "Sholinganallur",
            "coordinates": {"lat": 12.9067, "lng": 80.2277},
            "description": "OMR corridor monitoring"
        },
        {
            "name": "Anna Nagar Circle Cam",
            "location": "Anna Nagar",
            "coordinates": {"lat": 13.0827, "lng": 80.2707},
            "description": "Anna Nagar circle traffic monitoring"
        },
        {
            "name": "Besant Nagar Beach Cam",
            "location": "Besant Nagar",
            "coordinates": {"lat": 13.0067, "lng": 80.2544},
            "description": "Beach area monitoring"
        },
        {
            "name": "Guindy Industrial Cam",
            "location": "Guindy",
            "coordinates": {"lat": 13.0067, "lng": 80.2544},
            "description": "Industrial area monitoring"
        },
        {
            "name": "Chromepet Station Cam",
            "location": "Chromepet",
            "coordinates": {"lat": 12.9516, "lng": 80.1407},
            "description": "Railway station area monitoring"
        }
    ]
    
    video_feeds = []
    
    for i, camera in enumerate(chennai_cameras):
        # Simulate some cameras being offline occasionally
        status = "Active" if random.random() > 0.1 else "Offline"
        
        # Generate placeholder video URLs (in real implementation, these would be actual stream URLs)
        video_url = f"https://chennai-civic-watch.com/streams/cam-{i+1:02d}"
        
        # Add some variation to make it feel real-time
        last_updated = datetime.utcnow()
        if status == "Offline":
            last_updated = datetime.utcnow() - timedelta(minutes=random.randint(5, 60))
        
        video_feeds.append(VideoFeed(
            id=f"cam-{i+1:02d}",
            name=camera["name"],
            location=camera["location"],
            status=status,
            url=video_url,
            coordinates=camera["coordinates"],
            description=camera["description"],
            last_updated=last_updated.isoformat()
        ))
    
    return video_feeds

@router.get("/{feed_id}", response_model=VideoFeed)
async def get_video_feed(feed_id: str):
    """
    Get specific video feed by ID.
    """
    # Find the feed in our list
    feeds = await get_video_feeds()
    for feed in feeds:
        if feed.id == feed_id:
            return feed
    
    raise HTTPException(status_code=404, detail="Video feed not found")

@router.get("/location/{location}", response_model=List[VideoFeed])
async def get_video_feeds_by_location(location: str):
    """
    Get all video feeds for a specific location.
    """
    feeds = await get_video_feeds()
    location_feeds = [feed for feed in feeds if feed.location.lower() == location.lower()]
    
    if not location_feeds:
        raise HTTPException(status_code=404, detail=f"No video feeds found for location: {location}")
    
    return location_feeds 