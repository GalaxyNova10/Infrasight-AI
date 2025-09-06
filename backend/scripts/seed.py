
import sys
import os
from sqlalchemy.orm import Session

# Add the parent directory to the path to allow imports from the app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import crud, schemas
from app.database import SessionLocal, engine
from app.models import Base

# Create tables
Base.metadata.create_all(bind=engine)

def seed_database():
    db: Session = SessionLocal()

    users_to_create = [
        schemas.UserProfileCreate(
            email="admin@cityworks.gov",
            full_name="Admin User",
            password="Admin123!",
            role="admin",
            phone="1234567890"
        ),
        schemas.UserProfileCreate(
            email="manager@cityworks.gov",
            full_name="Manager User",
            password="Manager123!",
            role="city_official",
            phone="1234567890"
        ),
        schemas.UserProfileCreate(
            email="worker@cityworks.gov",
            full_name="Worker User",
            password="Worker123!",
            role="maintenance_crew",
            phone="1234567890"
        ),
        schemas.UserProfileCreate(
            email="citizen@email.com",
            full_name="Citizen User",
            password="Citizen123!",
            role="citizen",
            phone="1234567890"
        ),
    ]

    for user_data in users_to_create:
        db_user = crud.get_user_by_email(db, email=user_data.email)
        if not db_user:
            crud.create_user(db=db, user=user_data)
            print(f"User {user_data.email} created.")
        else:
            print(f"User {user_data.email} already exists.")

    db.close()

if __name__ == "__main__":
    print("Seeding database...")
    seed_database()
    print("Database seeding complete.")
