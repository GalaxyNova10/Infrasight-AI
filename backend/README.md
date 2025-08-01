# InfraSight AI Chennai Backend API

A comprehensive FastAPI backend for the Chennai Municipal Infrastructure Monitoring System, supporting citizen reporting, AI-powered issue detection, and administrative management.

## 🏗️ Architecture

- **Framework**: FastAPI
- **Database**: PostgreSQL with PostGIS for spatial data
- **ORM**: SQLAlchemy
- **Authentication**: JWT (planned)
- **File Upload**: Support for image uploads with AI verification

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- PostgreSQL with PostGIS extension
- Redis (for caching, optional)

### Installation

1. **Clone and setup virtual environment**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. **Database Setup**
```bash
# Create PostgreSQL database with PostGIS
createdb chennai_infrastructure
psql chennai_infrastructure -c "CREATE EXTENSION postgis;"
```

3. **Environment Variables**
Create a `.env` file:
```env
DATABASE_URL=postgresql://username:password@localhost/chennai_infrastructure
SECRET_KEY=your-secret-key-here
CV_PROCESSOR_URL=http://localhost:8001
```

4. **Run the Application**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 📋 API Endpoints

### 🔍 Health & Configuration

#### GET `/`
- **Description**: Root endpoint
- **Response**: Service status message

#### GET `/health`
- **Description**: Health check endpoint
- **Response**: Service health status

#### GET `/api/v1/config/chennai`
- **Description**: Get Chennai-specific configuration
- **Response**: City areas, issue categories, departments

### 👥 Citizen Management

#### POST `/api/v1/users/register`
- **Description**: Register new citizen user
- **Body**: User registration data
- **Response**: Created user information

#### GET `/api/v1/citizen-reports`
- **Description**: Get citizen reports with filtering
- **Query Parameters**: `city_area`, `issue_type`, `status`, `limit`
- **Response**: List of citizen reports

#### POST `/api/v1/citizen-reports`
- **Description**: Create new citizen report
- **Body**: Citizen report data
- **Response**: Created report information

#### GET `/api/v1/citizen-reports/{report_id}`
- **Description**: Get specific citizen report
- **Response**: Citizen report details

#### PATCH `/api/v1/citizen-reports/{report_id}`
- **Description**: Update citizen report status
- **Body**: Status and assignment data
- **Response**: Updated report information

### 📊 Dashboard & Analytics

#### GET `/api/v1/dashboard/metrics`
- **Description**: Get dashboard key metrics
- **Response**: Active issues, resolution rate, AI detections, response time

#### GET `/api/v1/analytics`
- **Description**: Get comprehensive analytics data
- **Query Parameters**: `date_range` (7days, 30days, 90days)
- **Response**: Issues by type, severity, status, area, trends, department performance

#### GET `/api/v1/issues/summary`
- **Description**: Get recent issues summary
- **Query Parameters**: `limit`
- **Response**: Recent issues with details

### 🔧 Issue Management

#### GET `/api/v1/issues`
- **Description**: Get all detected issues
- **Response**: List of all issues (AI + citizen)

#### POST `/api/v1/issues`
- **Description**: Create new issue (admin)
- **Body**: Issue creation data
- **Response**: Created issue information

#### PATCH `/api/v1/issues/{issue_id}`
- **Description**: Update issue status
- **Body**: Status update data
- **Response**: Updated issue information

### 🛠️ Work Order Management

#### POST `/api/v1/work-orders`
- **Description**: Create new work order
- **Body**: Work order data
- **Response**: Created work order information

#### GET `/api/v1/work-orders`
- **Description**: Get work orders with filtering
- **Query Parameters**: `status`, `assigned_to`, `limit`
- **Response**: List of work orders

#### PATCH `/api/v1/work-orders/{work_order_id}`
- **Description**: Update work order status
- **Body**: Status and completion data
- **Response**: Updated work order information

### 🤖 AI Detection

#### POST `/api/v1/detections`
- **Description**: Create new AI detection
- **Body**: Detection data
- **Response**: Created detection information

#### POST `/api/v1/citizen_reports/upload`
- **Description**: Upload citizen report with image verification
- **Body**: Multipart form with image and metadata
- **Response**: Verification result and report creation

## 📊 Data Models

### User Registration
```json
{
  "firstName": "Rajesh",
  "lastName": "Kumar",
  "email": "rajesh.kumar@email.com",
  "phone": "+91-9876543210",
  "address": "123 Anna Salai",
  "city": "t-nagar",
  "pincode": "600001",
  "notificationPreferences": {
    "email": true,
    "sms": false,
    "push": true
  },
  "issueCategories": ["potholes", "waterlogging"],
  "agreeToTerms": true,
  "agreeToPrivacy": true,
  "subscribeNewsletter": false
}
```

### Citizen Report
```json
{
  "issue_type": "potholes",
  "description": "Large pothole causing vehicle damage",
  "latitude": 13.0827,
  "longitude": 80.2707,
  "address": "Anna Salai near Mount Road",
  "city_area": "t-nagar",
  "pincode": "600001",
  "reporter_name": "Rajesh Kumar",
  "reporter_email": "rajesh.kumar@email.com",
  "reporter_phone": "+91-9876543210"
}
```

### Dashboard Metrics
```json
{
  "active_issues": 47,
  "resolution_rate": 89.2,
  "ai_detections_today": 156,
  "average_response_time": 2.4
}
```

## 🏙️ Chennai-Specific Features

### City Areas
- T. Nagar, Adyar, Mylapore, Velachery
- Sholinganallur, Anna Nagar, Besant Nagar
- Guindy, Chromepet, Tambaram, Porur, Vadapalani

### Issue Categories
- Waterlogging / Flooding
- Garbage Disposal / Waste Management
- Potholes / Bad Roads
- Poor Street Lighting
- Traffic Congestion
- Illegal Banners / Posters
- Open Drains / Sewage Issues
- Damaged Public Property

### Departments
- Greater Chennai Corporation (GCC)
- GCC Public Works
- GCC Water Department
- GCC Electrical
- GCC Sanitation
- GCC Enforcement

## 🔐 Security Features

- Input validation with Pydantic models
- SQL injection prevention with SQLAlchemy ORM
- File upload validation and virus scanning
- Rate limiting (planned)
- JWT authentication (planned)

## 📈 Performance Optimizations

- Database indexing on frequently queried fields
- Connection pooling
- Query optimization with SQLAlchemy
- Caching with Redis (planned)
- Pagination for large datasets

## 🧪 Testing

### Run Tests
```bash
pytest tests/
```

### Test Coverage
```bash
pytest --cov=app tests/
```

## 🚀 Deployment

### Docker
```bash
docker build -t chennai-infrastructure-backend .
docker run -p 8000:8000 chennai-infrastructure-backend
```

### Production
- Use Gunicorn with multiple workers
- Set up reverse proxy (Nginx)
- Configure SSL certificates
- Set up monitoring and logging

## 📝 API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation at `/docs` 