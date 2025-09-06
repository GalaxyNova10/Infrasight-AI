# backend/app/routers/cv_api.py

from fastapi import APIRouter, File, UploadFile, HTTPException, Form, Depends
from pydantic import BaseModel
import os
import cv2
import numpy as np
import requests
import time
from typing import List

from .. import cv_model
from ..schemas import InfrastructureIssueCreate

router = APIRouter(
    prefix="/cv-api",
    tags=["CV API"]
)

# --- Pydantic Schemas ---
class VideoPathRequest(BaseModel):
    file_path: str

# --- VideoProcessor Class ---
# This class now correctly initializes using the globally loaded model
class VideoProcessor:
    def __init__(self, confidence_threshold=0.5):
        if cv_model.model is None:
            raise RuntimeError("CV Model is not loaded. Check the application startup event.")
            
        self.model = cv_model.model
        self.confidence_threshold = confidence_threshold
        self.class_names = self.model.names
        print(f"[INFO] VideoProcessor instance created. Detecting classes: {list(self.class_names.values())}")

        self.BACKEND_API_URL = os.getenv("MAIN_BACKEND_URL", "http://backend:8000/api/v1/detections")
        self.FIXED_LOCATION = {
            "lat": 13.0827,  # Chennai Latitude
            "lon": 80.2707   # Chennai Longitude
        }

    def _send_detection_to_backend(self, detection_data):
        try:
            response = requests.post(self.BACKEND_API_URL, json=detection_data, timeout=5)
            response.raise_for_status()
            print(f"[✓] Sent detection: {detection_data.get('issue_type', 'Unknown')}")
            return True
        except requests.exceptions.RequestException as e:
            print(f"[ERROR] Failed to send detection to backend: {e}")
            return False

    def process_video_for_issues(self, video_path: str, output_path: str = "output.mp4", frame_skip=0, save_video=True):
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            print(f"[ERROR] Cannot open video file: {video_path}")
            return 0

        writer = None
        if save_video:
            fps = cap.get(cv2.CAP_PROP_FPS)
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            writer = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
            print(f"[INFO] Saving processed video to: {output_path}")

        detections_sent_count = 0
        frame_idx = 0
        print(f"[INFO] Starting analysis for video: {video_path}")

        while True:
            success, frame = cap.read()
            if not success:
                break

            if frame_idx % (frame_skip + 1) == 0:
                results = self.model(frame)

                for result in results:
                    for box in result.boxes:
                        confidence = float(box.conf[0])
                        if confidence > self.confidence_threshold:
                            class_id = int(box.cls[0])
                            class_name = self.class_names[class_id]
                            issue_type = class_name.lower().replace(" ", "_")

                            detection_data = {
                                "title": f"{class_name} Detected",
                                "description": f"AI camera detected a {class_name} with confidence {confidence:.2f}.",
                                "issue_type": issue_type,
                                "latitude": self.FIXED_LOCATION["lat"],
                                "longitude": self.FIXED_LOCATION["lon"],
                                "address": "Detected by AI camera in Chennai",
                                "source": "ai_camera"
                            }
                            # In a real system, you'd associate this with a real user
                            # For now, this part would need a valid user ID to work with the DB
                            # if self._send_detection_to_backend(detection_data):
                            #     detections_sent_count += 1

                if save_video:
                    annotated_frame = results[0].plot()
                    writer.write(annotated_frame)

            frame_idx += 1

        cap.release()
        if writer:
            writer.release()
        print(f"[INFO] Video analysis complete. Sent {detections_sent_count} detections.")
        return detections_sent_count

# --- Dependency Injection Function ---
# This function will be called by FastAPI for endpoints that need the processor
def get_video_processor():
    return VideoProcessor()

# --- API Endpoints ---

@router.post("/predict/image")
async def predict_image_endpoint(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")
    try:
        image_bytes = await file.read()
        detections = cv_model.predict_image(image_bytes)
        return {"filename": file.filename, "detections": detections}
    except Exception as e:
        print(f"Error processing image: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing image: {e}")


@router.post("/predict/video")
async def predict_video_endpoint(
    request: VideoPathRequest,
    video_processor: VideoProcessor = Depends(get_video_processor)
):
    file_path = request.file_path
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"Video file not found at path: {file_path}")

    detections_sent_count = video_processor.process_video_for_issues(file_path)
    return {
        "message": "Video analysis complete.",
        "file_processed": file_path,
        "detections_sent": detections_sent_count
    }