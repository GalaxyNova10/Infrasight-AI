from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
import random
from typing import List
import uuid # Import uuid

from ..schemas import VideoFeed, VideoFeedBase # Import VideoFeedBase for creation

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
            "location_name": "T. Nagar", # Changed to location_name
            "latitude": 13.0478, # Changed to latitude
            "longitude": 80.2425, # Changed to longitude
            "description": "Traffic monitoring at T. Nagar junction"
        },
        {
            "name": "Anna Salai Main Cam",
            "location_name": "Anna Salai",
            "latitude": 13.0827,
            "longitude": 80.2707,
            "description": "Main road monitoring on Anna Salai"
        },
        {
            "name": "Adyar Bridge Cam",
            "location_name": "Adyar",
            "latitude": 13.0067,
            "longitude": 80.2544,
            "description": "Bridge and traffic monitoring"
        },
        {
            "name": "Mylapore Temple Cam",
            "location_name": "Mylapore",
            "latitude": 13.0370,
            "longitude": 80.2707,
            "description": "Area around Kapaleeshwarar Temple"
        },
        {
            "name": "Velachery Junction Cam",
            "location_name": "Velachery",
            "latitude": 12.9716,
            "longitude": 80.2207,
            "description": "Major junction monitoring"
        },
        {
            "name": "Sholinganallur OMR Cam",
            "location_name": "Sholinganallur",
            "latitude": 12.9067,
            "longitude": 80.2277,
            "description": "OMR corridor monitoring"
        },
        {
            "name": "Anna Nagar Circle Cam",
            "location_name": "Anna Nagar",
            "latitude": 13.0827,
            "longitude": 80.2707,
            "description": "Anna Nagar circle traffic monitoring"
        },
        {
            "name": "Besant Nagar Beach Cam",
            "location_name": "Besant Nagar",
            "latitude": 13.0067,
            "longitude": 80.2544,
            "description": "Beach area monitoring"
        },
        {
            "name": "Guindy Industrial Cam",
            "location_name": "Guindy",
            "latitude": 13.0067,
            "longitude": 80.2544,
            "description": "Industrial area monitoring"
        },
        {
            "name": "Chromepet Station Cam",
            "location_name": "Chromepet",
            "latitude": 12.9516,
            "longitude": 80.1407,
            "description": "Railway station area monitoring"
        }
    ]

    video_feeds = []

    for i, camera in enumerate(chennai_cameras):
        # Simulate some cameras being offline occasionally
        is_active = random.random() > 0.1

        # Generate placeholder stream URL
        stream_url = f"https://chennai-civic-watch.com/streams/cam-{i+1:02d}"

        video_feeds.append(VideoFeed(
            id=uuid.uuid4(), # Generate a UUID for the ID
            name=camera["name"],
            location_name=camera["location_name"],
            latitude=camera["latitude"],
            longitude=camera["longitude"],
            stream_url=stream_url,
            is_active=is_active,
            ai_detection_enabled=True, # Assuming AI detection is always enabled for these feeds
            created_at=datetime.utcnow()
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
        if str(feed.id) == feed_id: # Compare UUID as string
            return feed

    raise HTTPException(status_code=404, detail="Video feed not found")

@router.get("/location/{location_name}", response_model=List[VideoFeed]) # Changed path parameter name
async def get_video_feeds_by_location(location_name: str): # Changed parameter name
    """
    Get all video feeds for a specific location.
    """
    feeds = await get_video_feeds()
    location_feeds = [feed for feed in feeds if feed.location_name.lower() == location_name.lower()] # Use location_name

    if not location_feeds:
        raise HTTPException(status_code=404, detail=f"No video feeds found for location: {location_name}")

    return location_feeds