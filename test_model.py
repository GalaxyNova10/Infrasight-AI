import os
import argparse
import cv2
from ultralytics import YOLO
from PIL import Image

def main(args):
    """Main function to run prediction on a single image."""
    # --- 1. Validate Paths ---
    if not os.path.exists(args.model_path):
        print(f"[ERROR] Model file not found at: {args.model_path}")
        return
    if not os.path.exists(args.image_path):
        print(f"[ERROR] Image file not found at: {args.image_path}")
        return

    # --- 2. Load Your Custom-Trained Model ---
    print(f"[INFO] Loading model from: {args.model_path}")
    try:
        model = YOLO(args.model_path)
        print("[INFO] Model loaded successfully.")
    except Exception as e:
        print(f"[ERROR] Failed to load the model. Error: {e}")
        return

    # --- 3. Run Prediction on the Image ---
    print(f"[INFO] Running prediction on: {args.image_path}")
    try:
        # The model.predict() method handles reading the image and running inference
        results = model.predict(args.image_path, conf=args.confidence)
    except Exception as e:
        print(f"[ERROR] An error occurred during prediction: {e}")
        return

    # --- 4. Display and Save the Results ---
    if not results or len(results[0].boxes) == 0:
        print("[INFO] No objects were detected in the image.")
        # Still show the original image
        cv2.imshow("InfraSight AI - No Detections", cv2.imread(args.image_path))
    else:
        # The .plot() method returns a NumPy array (in BGR format) of the annotated image
        annotated_image_bgr = results[0].plot()

        # Display the result in a pop-up window
        print("[INFO] Displaying result. Press any key in the window to close.")
        cv2.imshow("InfraSight AI - Prediction Result", annotated_image_bgr)
        
        # Save the result to a new file
        dir_name, file_name = os.path.split(args.image_path)
        file_base, file_ext = os.path.splitext(file_name)
        output_filename = f"{file_base}_result{file_ext}"
        output_path = os.path.join(dir_name, output_filename)
        
        cv2.imwrite(output_path, annotated_image_bgr)
        print(f"[SUCCESS] Annotated image saved to: {output_path}")

    cv2.waitKey(0)  # Wait indefinitely for a key press
    cv2.destroyAllWindows()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Test your custom-trained InfraSight AI model on an image.")
    
    # Required argument for the image
    parser.add_argument("image_path", type=str, help="The full path to the image file you want to analyze.")
    
    # Optional arguments with sensible defaults
    parser.add_argument("--model_path", type=str, default="backend/models/best.pt", help="Path to your custom-trained .pt model file.")
    parser.add_argument("--confidence", type=float, default=0.25, help="Confidence threshold for detections (e.g., 0.25 for 25%).")

    args = parser.parse_args()
    main(args)
