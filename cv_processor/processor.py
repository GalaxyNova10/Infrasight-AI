import cv2
import requests
import time
from ultralytics import YOLO

# --- Configuration ---
model = YOLO('yolov8n.pt')

# Path to the video file INSIDE the container
VIDEO_SOURCE = "/app/videos/street.mp4" 

# Backend API endpoint using the Docker service name
BACKEND_API_URL = 'http://backend:8000/api/v1/detections'

# Map YOLO classes to issue types
CLASS_TO_ISSUE_TYPE = {
    'person': 'pothole',
    'bottle': 'garbage',
    'bench': 'broken_bin',
}

# Geotag for the detections
FIXED_LOCATION = {
    "lat": 13.0827, # Chennai Latitude
    "lon": 80.2707  # Chennai Longitude
}

# --- Main Processing Loop ---
def main():
    cap = cv2.VideoCapture(VIDEO_SOURCE)
    if not cap.isOpened():
        print(f"[ERROR] Could not open video source: {VIDEO_SOURCE}")
        return

    print("[INFO] Processing started...")
    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            print("[INFO] Video stream ended.")
            break

        # Run YOLOv8 inference
        results = model(frame)

        # Process detections
        for result in results:
            for box in result.boxes:
                class_id = int(box.cls[0])
                class_name = model.names[class_id]
                confidence = float(box.conf[0])

                if class_name in CLASS_TO_ISSUE_TYPE and confidence > 0.6:
                    issue_type = CLASS_TO_ISSUE_TYPE[class_name]
                    detection_data = {
                        "type": issue_type,
                        "confidence": round(confidence, 2),
                        "location": FIXED_LOCATION,
                    }

                    try:
                        response = requests.post(BACKEND_API_URL, json=detection_data)
                        response.raise_for_status()
                        print(f"[✓] Sent detection: {detection_data['type']}")
                    except requests.exceptions.RequestException as e:
                        print(f"[ERROR] Failed to send detection to backend: {e}")
                        time.sleep(5)

    cap.release()
    print("[INFO] Processing finished.")


if __name__ == "__main__":
    main()