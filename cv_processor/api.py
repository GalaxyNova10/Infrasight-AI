from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from ultralytics import YOLO
import cv2
import numpy as np

app = FastAPI(title="InfraSight CV Verification API")

# Load the model once when the API starts
model = YOLO('yolov8n.pt')
# Map API issue types to model class names (e.g., your fine-tuned classes)
# For demo, we map 'pothole' to the COCO class 'person'
CLASS_MAPPING = {
    "pothole": "person", 
}

@app.post("/verify_image")
async def verify_image(
    issue_type: str = Form(...),
    file: UploadFile = File(...)
):
    """
    Receives an image and checks if it contains the specified issue type.
    """
    if issue_type not in CLASS_MAPPING:
        raise HTTPException(status_code=400, detail=f"Invalid issue type: {issue_type}")

    target_class_name = CLASS_MAPPING[issue_type]

    # Read image content
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Run inference
    results = model(img)

    # Check for the target class
    for result in results:
        for box in result.boxes:
            class_name = model.names[int(box.cls[0])]
            if class_name == target_class_name:
                confidence = float(box.conf[0])
                if confidence > 0.5: # Verification threshold
                    return {"verified": True, "confidence": confidence, "reason": "Detection successful."}

    return {"verified": False, "confidence": 0, "reason": "Target object not found in image."}