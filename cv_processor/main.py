import cv2
import time
import os

def log(msg):
    print(f"[CV Processor] {msg}")

log("Started.")

# Load test image
image_path = "test.jpg"
if os.path.exists(image_path):
    try:
        image = cv2.imread(image_path)
        if image is not None:
            log(f"Image loaded. Shape: {image.shape}")

            # Convert to grayscale
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            cv2.imwrite("gray.jpg", gray)
            log("Saved grayscale version as gray.jpg.")

            # Edge detection
            edges = cv2.Canny(gray, 100, 200)
            cv2.imwrite("edges.jpg", edges)
            log("Saved edge-detected version as edges.jpg.")

        else:
            log("Image file exists but failed to load (possibly corrupted or unsupported format).")
    except Exception as e:
        log(f"Error reading image: {e}")
else:
    log("No image found at path 'test.jpg'.")

# Keeps the container alive and healthy
try:
    while True:
        time.sleep(10)
except KeyboardInterrupt:
    log("Shutting down gracefully.")