from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import os
from datetime import datetime, timedelta
import uuid

# Import Google's token verification tools
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from .. import database, schemas, crud, models, security
from ..config import settings
from pydantic import EmailStr # Import EmailStr

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

# --- Utility Functions ---
async def send_password_reset_email(email: str, token: str):
    """A placeholder function to simulate sending a password reset email."""
    reset_link = f"{settings.RESET_PASSWORD_URL}?token={token}"
    print("\n--- PASSWORD RESET ---")
    print(f"To: {email}")
    print(f"Reset Link: {reset_link}")
    print("----------------------\n")

# --- Authentication Endpoints ---

@router.post("/register", response_model=schemas.UserProfile, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserProfileCreate, db: Session = Depends(database.get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email is already registered")
    return crud.create_user(db=db, user=user)


@router.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not security.verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = security.create_access_token(
        data={"sub": user.email, "role": user.role.value}
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/google", response_model=schemas.Token)
def google_auth(token_request: schemas.GoogleToken, db: Session = Depends(database.get_db)):
    """
    Handles Google Sign-In. Verifies Google token, finds or creates a user,
    and returns a JWT access token for our application.
    """
    try:
        id_info = id_token.verify_oauth2_token(
            token_request.token, google_requests.Request(), os.getenv("GOOGLE_CLIENT_ID")
        )
        email = id_info.get("email")
        full_name = id_info.get("name")

        if not email:
            raise HTTPException(status_code=400, detail="No email found in Google token")

        user = crud.get_user_by_email(db, email=email)
        if not user:
            user_data = schemas.UserProfileCreate(
                email=email,
                full_name=full_name,
                password=str(uuid.uuid4()), # Generate a random password for Google users
                role="citizen"
            )
            user = crud.create_user(db, user=user_data)
        
        access_token = security.create_access_token(
            data={"sub": user.email, "role": user.role.value}
        )
        return {"access_token": access_token, "token_type": "bearer"}

    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid Google token")


@router.post("/password-recovery/{email}", status_code=status.HTTP_200_OK)
async def recover_password(
    email: EmailStr, 
    background_tasks: BackgroundTasks, 
    db: Session = Depends(database.get_db)
):
    """
    Initiates the password recovery process for a user.
    Generates a secure, single-use token and sends it to the user's email.
    """
    user = crud.get_user_by_email(db, email=email)
    if not user:
        # To prevent user enumeration, we don't reveal if the email exists.
        # We'll just return a success message.
        return {"message": "If an account with that email exists, a password reset link has been sent."}

    # Generate and store the reset token
    token = security.create_access_token(data={"sub": user.email}, expires_delta=timedelta(hours=1))
    user.reset_token = token
    user.reset_token_expires = datetime.utcnow() + timedelta(hours=1)
    db.commit()

    # Use background tasks to send the email without blocking the response
    background_tasks.add_task(send_password_reset_email, email, token)
    
    return {"message": "If an account with that email exists, a password reset link has been sent."}


@router.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_password(request: schemas.PasswordResetRequest, db: Session = Depends(database.get_db)):
    """
    Resets the user's password using a valid reset token.
    """
    user = db.query(models.UserProfile).filter(
        models.UserProfile.reset_token == request.token,
        models.UserProfile.reset_token_expires > datetime.utcnow()
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired password reset token."
        )

    # Update password and invalidate the token
    user.password = security.get_password_hash(request.new_password)
    user.reset_token = None
    user.reset_token_expires = None
    db.commit()

    return {"message": "Your password has been successfully reset."}


@router.get("/users/me", response_model=schemas.UserProfile)
def read_users_me(current_user: models.UserProfile = Depends(security.get_current_active_user)):
    """A protected endpoint to fetch the details of the currently logged-in user."""
    return current_user
