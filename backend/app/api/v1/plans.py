from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from typing import List
from datetime import datetime, timedelta
from decimal import Decimal

from ...database import get_db
from ...models.user import User
from ...models.plan import Plan, UserPlan
from ...models.transaction import Transaction, TransactionType, TransactionStatus, PaymentMethod
from ...schemas.plan import PlanResponse, PlanCreate, PlanUpdate, PlanPurchase, VoucherRedeem
from ...api.deps import get_current_user, get_current_admin_user
from ...core.security import generate_transaction_ref
from ...services.mikrotik import mikrotik_service
from ...services.payment import mpesa_service

router = APIRouter(prefix="/plans", tags=["Plans"])


@router.get("/", response_model=List[PlanResponse])
async def get_all_plans(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = True,
    db: AsyncSession = Depends(get_db)
):
    """Get all available plans"""
    query = select(Plan)
    
    if active_only:
        query = query.where(Plan.is_active == True)
    
    query = query.order_by(Plan.sort_order, Plan.price).offset(skip).limit(limit)
    
    result = await db.execute(query)
    plans = result.scalars().all()
    return plans


@router.get("/{plan_id}", response_model=PlanResponse)
async def get_plan(
    plan_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get specific plan details"""
    result = await db.execute(select(Plan).where(Plan.id == plan_id))
    plan = result.scalar_one_or_none()
    
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan not found"
        )
    
    return plan


@router.post("/", response_model=PlanResponse, status_code=status.HTTP_201_CREATED)
async def create_plan(
    plan_data: PlanCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create a new plan (Admin only)"""
    
    # Check if plan name already exists
    result = await db.execute(select(Plan).where(Plan.name == plan_data.name))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Plan with this name already exists"
        )
    
    new_plan = Plan(**plan_data.model_dump())
    db.add(new_plan)
    await db.commit()
    await db.refresh(new_plan)
    
    # Create MikroTik profile if specified
    if new_plan.mikrotik_profile:
        rate_limit = ""
        if new_plan.download_speed_limit and new_plan.upload_speed_limit:
            rate_limit = f"{new_plan.download_speed_limit}k/{new_plan.upload_speed_limit}k"
        
        mikrotik_service.create_user_profile(
            name=new_plan.mikrotik_profile,
            rate_limit=rate_limit
        )
    
    return new_plan


@router.put("/{plan_id}", response_model=PlanResponse)
async def update_plan(
    plan_id: int,
    plan_data: PlanUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update plan (Admin only)"""
    
    result = await db.execute(select(Plan).where(Plan.id == plan_id))
    plan = result.scalar_one_or_none()
    
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan not found"
        )
    
    # Update only provided fields
    update_data = plan_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(plan, field, value)
    
    await db.commit()
    await db.refresh(plan)
    
    return plan


@router.post("/purchase", status_code=status.HTTP_201_CREATED)
async def purchase_plan(
    purchase_data: PlanPurchase,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Purchase a plan"""
    
    # Get plan details
    result = await db.execute(select(Plan).where(Plan.id == purchase_data.plan_id))
    plan = result.scalar_one_or_none()
    
    if not plan or not plan.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan not found or not available"
        )
    
    # Generate transaction reference
    transaction_ref = generate_transaction_ref()
    
    # Create transaction record
    transaction = Transaction(
        transaction_ref=transaction_ref,
        user_id=current_user.id,
        transaction_type=TransactionType.PURCHASE,
        payment_method=PaymentMethod(purchase_data.payment_method),
        status=TransactionStatus.PENDING,
        amount=plan.price,
        plan_id=plan.id,
        description=f"Purchase of {plan.name}"
    )
    
    db.add(transaction)
    await db.commit()
    await db.refresh(transaction)
    
    # Process payment based on method
    if purchase_data.payment_method == "wallet":
        # Pay from wallet
        if current_user.wallet_balance < plan.price:
            transaction.status = TransactionStatus.FAILED
            await db.commit()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Insufficient wallet balance"
            )
        
        # Deduct from wallet
        current_user.wallet_balance -= plan.price
        transaction.status = TransactionStatus.COMPLETED
        transaction.completed_at = datetime.utcnow()
        
        # Create user plan
        await _activate_user_plan(db, current_user, plan, transaction.id)
        
        await db.commit()
        
        return {
            "success": True,
            "message": "Plan purchased successfully",
            "transaction_ref": transaction_ref
        }
    
    elif purchase_data.payment_method == "mpesa":
        # M-Pesa STK Push
        if not purchase_data.phone_number:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Phone number required for M-Pesa payment"
            )
        
        result = mpesa_service.stk_push(
            phone_number=purchase_data.phone_number,
            amount=int(plan.price),
            account_reference=transaction_ref,
            transaction_desc=f"Purchase {plan.name}"
        )
        
        if result['success']:
            transaction.provider_ref = result['checkout_request_id']
            await db.commit()
            
            return {
                "success": True,
                "message": "Payment initiated. Please enter M-Pesa PIN on your phone.",
                "transaction_ref": transaction_ref,
                "checkout_request_id": result['checkout_request_id']
            }
        else:
            transaction.status = TransactionStatus.FAILED
            await db.commit()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result['message']
            )
    
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid payment method"
        )


async def _activate_user_plan(
    db: AsyncSession,
    user: User,
    plan: Plan,
    transaction_id: int
):
    """Helper to activate user plan"""
    
    # Calculate expiry
    expires_at = None
    if plan.validity_days:
        expires_at = datetime.utcnow() + timedelta(days=plan.validity_days)
    elif plan.validity_hours:
        expires_at = datetime.utcnow() + timedelta(hours=plan.validity_hours)
    
    # Create user plan
    user_plan = UserPlan(
        user_id=user.id,
        plan_id=plan.id,
        is_active=True,
        activated_at=datetime.utcnow(),
        expires_at=expires_at,
        data_remaining_mb=plan.data_limit_mb,
        transaction_id=transaction_id
    )
    
    db.add(user_plan)
    
    # Add user to MikroTik
    if plan.mikrotik_profile:
        mikrotik_service.add_hotspot_user(
            username=user.username,
            password=user.username,  # You might want to generate a separate hotspot password
            profile=plan.mikrotik_profile,
            mac_address=user.mac_address
        )
    
    return user_plan


@router.get("/my-plans/active")
async def get_my_active_plans(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current user's active plans"""
    
    query = select(UserPlan).where(
        and_(
            UserPlan.user_id == current_user.id,
            UserPlan.is_active == True
        )
    ).order_by(UserPlan.activated_at.desc())
    
    result = await db.execute(query)
    user_plans = result.scalars().all()
    
    return user_plans