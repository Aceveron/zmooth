from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime
from decimal import Decimal
from ..models.plan import PlanType


class PlanBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=255)
    description: Optional[str] = None
    plan_type: PlanType
    price: Decimal = Field(..., gt=0)
    currency: str = "KES"
    data_limit_mb: Optional[int] = None
    validity_days: Optional[int] = None
    validity_hours: Optional[int] = None
    download_speed_limit: Optional[int] = None
    upload_speed_limit: Optional[int] = None
    mikrotik_profile: Optional[str] = None


class PlanCreate(PlanBase):
    @validator('data_limit_mb')
    def validate_data_limit(cls, v, values):
        if values.get('plan_type') == PlanType.DATA_BASED and not v:
            raise ValueError('Data limit required for data-based plans')
        return v
    
    @validator('validity_days', 'validity_hours')
    def validate_validity(cls, v, values):
        plan_type = values.get('plan_type')
        if plan_type == PlanType.TIME_BASED and not (values.get('validity_days') or values.get('validity_hours')):
            raise ValueError('Validity period required for time-based plans')
        return v


class PlanUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    data_limit_mb: Optional[int] = None
    validity_days: Optional[int] = None
    validity_hours: Optional[int] = None
    download_speed_limit: Optional[int] = None
    upload_speed_limit: Optional[int] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    mikrotik_profile: Optional[str] = None


class PlanResponse(PlanBase):
    id: int
    is_active: bool
    is_featured: bool
    sort_order: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class PlanPurchase(BaseModel):
    plan_id: int
    payment_method: str = Field(..., pattern="^(mpesa|card|wallet|voucher)$")
    phone_number: Optional[str] = None  # For M-Pesa


class VoucherRedeem(BaseModel):
    voucher_code: str = Field(..., min_length=10, max_length=50)