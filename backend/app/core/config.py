from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
from functools import lru_cache


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "zmooth"
    APP_ENV: str = "production"
    DEBUG: bool = False
    API_V1_PREFIX: str = "/api/v1"
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Database
    DATABASE_URL: str
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 10
    
    # RADIUS
    RADIUS_SECRET: str
    RADIUS_AUTH_PORT: int = 1812
    RADIUS_ACCT_PORT: int = 1813
    RADIUS_HOST: str = "0.0.0.0"
    
    # MikroTik
    MIKROTIK_HOST: str
    MIKROTIK_USERNAME: str
    MIKROTIK_PASSWORD: str
    MIKROTIK_PORT: int = 8728
    MIKROTIK_USE_SSL: bool = True
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # M-Pesa (Safaricom - Kenya)
    MPESA_CONSUMER_KEY: str = ""
    MPESA_CONSUMER_SECRET: str = ""
    MPESA_SHORTCODE: str = ""
    MPESA_PASSKEY: str = ""
    MPESA_CALLBACK_URL: str = ""
    MPESA_ENVIRONMENT: str = "sandbox"  # or "production"
    
    # Email
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_FROM: str = ""
    
    # CORS
    # Accept a comma-separated string in .env (e.g. "http://a,https://b")
    # We'll parse it into a list when settings are loaded.
    CORS_ORIGINS: str = "http://localhost:5173"
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # Session Management
    SESSION_CHECK_INTERVAL: int = 300  # seconds
    INACTIVE_SESSION_TIMEOUT: int = 600  # seconds
    
    # File Upload
    MAX_UPLOAD_SIZE: int = 5 * 1024 * 1024  # 5MB
    ALLOWED_FILE_TYPES: List[str] = ["image/jpeg", "image/png", "application/pdf"]
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True
    )


@lru_cache()
def get_settings() -> Settings:
    s = Settings()
    # If CORS_ORIGINS was provided as a comma-separated string in the env
    # (DotEnvSettingsSource does not accept non-JSON arrays), parse it here
    # into a list that FastAPI expects.
    try:
        cors_val = s.CORS_ORIGINS
        if isinstance(cors_val, str):
            s.CORS_ORIGINS = [u.strip() for u in cors_val.split(",") if u.strip()]
    except Exception:
        # keep default as single-origin list if anything goes wrong
        s.CORS_ORIGINS = ["http://localhost:5173"]
    return s


settings = get_settings()