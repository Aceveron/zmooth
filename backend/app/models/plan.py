
from sqlalchemy import Column, Integer, String, Numeric, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from ..database import Base


class PlanType(str, enum.Enum):
 	DATA_BASED = "data_based"
 	TIME_BASED = "time_based"



class Plan(Base):
	__tablename__ = "plans"

	id = Column(Integer, primary_key=True, index=True)
	name = Column(String(150), unique=True, index=True, nullable=False)
	description = Column(Text, nullable=True)
	price = Column(Numeric(10, 2), default=0.00)
	duration_days = Column(Integer, default=30)
	data_mb = Column(Integer, default=0)
	is_active = Column(Boolean, default=True)

	created_at = Column(DateTime(timezone=True), server_default=func.now())
	updated_at = Column(DateTime(timezone=True), onupdate=func.now())

	# Relationships
	purchases = relationship("UserPlan", back_populates="plan", cascade="all, delete-orphan")

	def __repr__(self):
		return f"<Plan {self.name}>"


class UserPlan(Base):
	__tablename__ = "user_plans"

	id = Column(Integer, primary_key=True, index=True)
	user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
	plan_id = Column(Integer, ForeignKey("plans.id", ondelete="CASCADE"), nullable=False)

	start_date = Column(DateTime(timezone=True), server_default=func.now())
	end_date = Column(DateTime(timezone=True), nullable=True)
	active = Column(Boolean, default=True)

	created_at = Column(DateTime(timezone=True), server_default=func.now())
	updated_at = Column(DateTime(timezone=True), onupdate=func.now())

	# Relationships
	user = relationship("User", back_populates="purchased_plans")
	plan = relationship("Plan", back_populates="purchases")

	def __repr__(self):
		return f"<UserPlan user_id={self.user_id} plan_id={self.plan_id}>"
