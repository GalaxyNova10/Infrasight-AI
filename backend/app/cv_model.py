import os
import cv2
import numpy as np
from ultralytics import YOLO
import requests # Use the requests library for API calls

# --- Global Model Cache ---
model_cache = {}

def load_models():
    """
    Loads the YOLOv8 model from the specified path.
    This function is called once on application startup.
    """
    try:
        model_path = "models/best.pt"
        print(f"[INFO] Attempting to load YOLOv8 model from: {model_path}")
        if not os.path.exists(model_path):
            print(f"[ERROR] Model file not found at {model_path}. Please ensure it exists.")
            raise FileNotFoundError(f"Model file not found at {model_path}")
        
        model_cache['yolo'] = YOLO(model_path)
        print("[INFO] YOLOv8 model loaded successfully.")
    except Exception as e:
        print(f"[CRITICAL ERROR] Failed to load YOLOv8 model: {e}")
        # Re-raise the exception to prevent the application from starting in a broken state.
        raise RuntimeError(f"YOLOv8 model could not be loaded. Error: {e}")


def predict_image(image_bytes: bytes):
    """
    Runs YOLOv8 prediction on an image and returns both the detections
    and the annotated image as bytes.
    """
    yolo_model = model_cache.get('yolo')
    if not yolo_model:
        raise RuntimeError("YOLO model is not loaded.")

    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    results = yolo_model(img)
    
    detections = []
    for result in results:
        for box in result.boxes:
            detections.append({
                "class_name": yolo_model.names[int(box.cls)],
                "confidence_score": float(box.conf),
                "bounding_box": { 
                    "x_min": int(box.xyxy[0][0]), 
                    "y_min": int(box.xyxy[0][1]), 
                    "x_max": int(box.xyxy[0][2]), 
                    "y_max": int(box.xyxy[0][3]) 
                }
            })
    
    # Generate the annotated image with bounding boxes
    annotated_image_bytes = image_bytes # Default to original if annotation fails
    if results:
        annotated_img_array = results[0].plot()
        # Encode the annotated image back to bytes (JPEG format)
        success, buffer = cv2.imencode('.jpg', annotated_img_array)
        if success:
            annotated_image_bytes = buffer.tobytes()

    return detections, annotated_image_bytes

def get_ai_summary(detections: list) -> str:
    """
    Generates a text summary for a list of detections using a Hugging Face summarization model.
    """
    hf_token = os.getenv("HUGGINGFACE_API_TOKEN")
    if not hf_token:
        return "Could not generate summary: Hugging Face API token not set."

    # Use a reliable summarization model
    model_url = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"
    headers = {"Authorization": f"Bearer {hf_token}"}

    try:
        if not detections:
            return "No issues were detected in the image."

        # Create a simple text input for the summarization model
        detection_names = [d["class_name"].replace("_", " ") for d in detections]
        text_to_summarize = (
            f"The following infrastructure issues were detected by an AI camera in Chennai: "
            f"{', '.join(detection_names)}. These issues could pose risks to public safety and traffic flow. "
            "A report should be generated to address these findings promptly."
        )

        # Call the Hugging Face API for summarization
        response = requests.post(model_url, headers=headers, json={"inputs": text_to_summarize}, timeout=20)
        response.raise_for_status()

        result = response.json()
        
        # Summarization models typically return 'summary_text'
        if result and isinstance(result, list) and result[0].get('summary_text'):
            return result[0]['summary_text'].strip()
        else:
            # Fallback for unexpected response structure
            print(f"[HUGGING FACE API WARNING] Unexpected response format: {result}")
            return "AI summary could not be generated from the model's response."

    except requests.exceptions.RequestException as e:
        error_details = e.response.json() if e.response else str(e)
        print(f"[HUGGING FACE API ERROR] An error occurred: {error_details}")
        if "is currently loading" in str(error_details):
             return "The AI summary model is starting up. Please try again in 20 seconds."
        return "AI summary is temporarily unavailable."