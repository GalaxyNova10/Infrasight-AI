# backend/Dockerfile

FROM python:3.10-slim
WORKDIR /app

# ADD libglib2.0-0 to this line
RUN apt-get update && apt-get install -y libgl1 libglib2.0-0

# Copy and install dependencies first to leverage Docker cache
COPY requirements.txt .
RUN --mount=type=cache,target=/root/.cache/pip pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy the application code
COPY app /app/app

# Copy the models and videos for CV processing
COPY models /app/models
COPY videos /app/videos

# No CMD needed as it's defined in docker-compose.yml