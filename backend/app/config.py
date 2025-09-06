# backend/app/config.py

from pydantic_settings import BaseSettings
from .chennai_config import CHENNAI_CONFIG

class Settings(BaseSettings):
    RESET_PASSWORD_URL: str
    CHENNAI_CONFIG: dict = CHENNAI_CONFIG

settings = Settings()