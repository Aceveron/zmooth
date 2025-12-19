from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime
from ..models.user import UserRole


class UserRegister(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8)
    phone_number: Optional[str] = Field(None, pattern=r'^\+?[0-9]{10,15}$')
    full_name: Optional[str] = None
    
    @validator('username')
    def username_alphanumeric(cls, v):
        if not v.replace('_', '').replace('-', '').isalnum():
            raise ValueError('Username must be alphanumeric with optional _ or -')
        return v


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[int] = None
    username: Optional[str] = None
    role: Optional[UserRole] = None


class PasswordChange(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=8)


class PasswordReset(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)


class RefreshToken(BaseModel):
    refresh_token: str