from ultralytics import YOLO
import cv2
import numpy as np

model = None

def load_model():
    """Loads the YOLOv8 model."""
    global model
    # Path is now relative to the backend's root directory
    model = YOLO("models/best.pt")

def predict_image(image_bytes: bytes):
    """
    Runs prediction on the image and returns a list of detections.
    """
    if model is None:
        raise RuntimeError("Model has not been loaded. Call load_model() first.")

    # Convert image bytes to an image
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Run prediction
    results = model(img)

    # Process results
    detections = []
    for result in results:
        for box in result.boxes:
            detections.append({
                "class_name": model.names[int(box.cls)],
                "confidence_score": float(box.conf),
                "bounding_box": {
                    "x_min": int(box.xyxy[0][0]),
                    "y_min": int(box.xyxy[0][1]),
                    "x_max": int(box.xyxy[0][2]),
                    "y_max": int(box.xyxy[0][3]),
                }
            })
    return detections
