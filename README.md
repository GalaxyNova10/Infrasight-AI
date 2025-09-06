InfraSight AI: Real-Time Civic Issue Detection

<p align="center">
  <img src="frontend/src/Logo.png" alt="InfraSight AI Logo" width="150"/>
</p>

<p align="center">
  <strong>An AI-powered platform that transforms city surveillance into a proactive infrastructure monitoring network.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10-blue.svg" alt="Python">
  <img src="https://img.shields.io/badge/React-18-blue.svg" alt="React">
  <img src="https://img.shields.io/badge/FastAPI-0.100-green.svg" alt="FastAPI">
  <img src="https://img.shields.io/badge/PostgreSQL-13-blue.svg" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Docker-Ready-blue.svg" alt="Docker">
</p>

---

## 🚀 The Solution in Action

InfraSight AI automatically detects civic issues from camera feeds and citizen reports, streamlining the process from detection to resolution. Our system provides a live dashboard and interactive map for officials to make data-driven decisions.

*Put a high-quality GIF of your application dashboard or map in action here. This is the most powerful way to show what your project does.*

![InfraSight AI Dashboard Demo](docs/images/dashboard-demo.gif)

## ✨ Key Features

- **🤖 Automated AI Detection:** Real-time identification of civic issues from video streams using a custom-trained YOLOv8 model.

- **📝 Intelligent Citizen Reporting:** A web portal for citizens to submit reports with images, which are verified and analyzed by our AI. 

- **🗺️ Live Interactive Map:** A geospatial dashboard for officials to view the real-time location and status of all reported issues.

- **📊 Data-Driven Analytics:** A comprehensive dashboard that provides insights into issue hotspots, resolution times, and departmental performance.

- **🔔 Real-time Alerts:** Automated notifications sent to the correct municipal departments via the Twilio API.

🧠 Our Custom AI Model
The core of InfraSight is a powerful YOLOv8 model we trained on a massive, 5-class dataset of over 74,000 images tailored for urban environments.

Pothole

Garbage Pile

Street Flooding

Illegal Parking

Debris

[Icon for Pothole]

[Icon for Garbage]

[Icon for Flooding]

[Icon for Parking]

[Icon for Debris]

🛠️ Technology Stack
Category

Technology

Backend

<img src="https://www.google.com/search?q=https://img.shields.io/badge/FastAPI-009688%3Fstyle%3Dfor-the-badge%26logo%3Dfastapi%26logoColor%3Dwhite" alt="FastAPI"> <img src="https://www.google.com/search?q=https://img.shields.io/badge/Python-3776AB%3Fstyle%3Dfor-the-badge%26logo%3Dpython%26logoColor%3Dwhite" alt="Python">

Frontend

<img src="https://www.google.com/search?q=https://img.shields.io/badge/React-20232A%3Fstyle%3Dfor-the-badge%26logo%3Dreact%26logoColor%3D61DAFB" alt="React"> <img src="https://www.google.com/search?q=https://img.shields.io/badge/Tailwind_CSS-38B2AC%3Fstyle%3Dfor-the-badge%26logo%3Dtailwind-css%26logoColor%3Dwhite" alt="Tailwind CSS">

Database

<img src="https://www.google.com/search?q=https://img.shields.io/badge/PostgreSQL-316192%3Fstyle%3Dfor-the-badge%26logo%3Dpostgresql%26logoColor%3Dwhite" alt="PostgreSQL"> <img src="https://www.google.com/search?q=https://img.shields.io/badge/PostGIS-E76F00%3Fstyle%3Dfor-the-badge" alt="PostGIS">

AI/ML

<img src="https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white" alt="PyTorch"> <img src="https://www.google.com/search?q=https://img.shields.io/badge/spaCy-09A3D5%3Fstyle%3Dfor-the-badge%26logo%3Dspacy%26logoColor%3Dwhite" alt="spaCy">

Deployment

<img src="https://www.google.com/search?q=https://img.shields.io/badge/Docker-2496ED%3Fstyle%3Dfor-the-badge%26logo%3Ddocker%26logoColor%3Dwhite" alt="Docker">

🏗️ Architecture
Our system uses a dual-stream pipeline to process data from both automated camera feeds and citizen reports. All data is unified and stored in a geospatial database, which powers the frontend dashboard and alerting systems.

🚀 Getting Started
This project is fully containerized and easy to run locally.

Prerequisites
Docker Desktop installed and running.

Git for cloning the repository.

Setup Instructions
Clone the Repository:

git clone [https://github.com/your-username/infrasight-ai.git](https://github.com/your-username/infrasight-ai.git)
cd infrasight-ai

Configure Environment Variables:

Navigate to the backend directory.

Copy the example environment file: cp .env.example .env (on Windows, use copy .env.example .env)

Open the new .env file and fill in your credentials for the Database, Google, and Twilio.

Place Your Trained Model:

Download your custom-trained best.pt model file.

Place it inside the backend/models/ directory.

Build and Run with Docker Compose:

From the project's root directory, run:

docker-compose up --build

Access the Application:

Frontend: http://localhost:3000

Backend API Docs: http://localhost:8000/docs

🔮 Future Vision
Expand Detection: Train the model on new classes like damaged signs and open manholes.

Predictive Analytics: Use historical data to predict future problem hotspots.

Citizen Feedback Loop: A public portal for citizens to track the status of their reports.

👥 Team
Shadow Legion
