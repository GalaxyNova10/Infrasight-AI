# cv_processor/Dockerfile

# Use the official Ultralytics image which includes PyTorch, OpenCV, and YOLOv8
FROM ultralytics/ultralytics:latest

# Set the working directory
WORKDIR /app

# Copy the requirements file for our extra packages
COPY requirements.txt .

# Install the few remaining dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application code
COPY . .