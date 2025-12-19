from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from ..database import Base

class VoucherStatus(str, enum.Enum):
    ACTIVE = "active"
    USED = "used"
    EXPIRED = "expired"
    DISABLED = "disabled"

class Voucher(Base):
    """Voucher codes for plan redemption"""
    __tablename__ = "vouchers"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    
    # Plan association
    plan_id = Column(Integer, ForeignKey("plans.id", ondelete="CASCADE"), nullable=False)
    
    # Status
    status = Column(SQLEnum(VoucherStatus), default=VoucherStatus.ACTIVE)
    
    # Usage
    used_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    used_at = Column(DateTime(timezone=True), nullable=True)
    
    # Validity
    expires_at = Column(DateTime(timezone=True), nullable=True)
    
    # Creation info
    created_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    batch_id = Column(String(100), nullable=True, index=True)  # for bulk generation
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    created_by_user = relationship("User", foreign_keys=[created_by_user_id], back_populates="vouchers")
    
    def __repr__(self):
        return f"<Voucher {self.code}>"