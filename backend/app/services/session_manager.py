import logging
from datetime import datetime, timedelta
from typing import Optional, Dict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, update
from ..models.session import Session
from ..models.user import User
from ..models.plan import UserPlan
from ..core.security import generate_session_id
from .mikrotik import mikrotik_service

logger = logging.getLogger(__name__)


class SessionManager:
    """Manages user internet sessions"""
    
    @staticmethod
    async def create_session(
        db: AsyncSession,
        user: User,
        nas_ip: str,
        framed_ip: str,
        mac_address: Optional[str] = None
    ) -> Optional[Session]:
        """Create new user session"""
        
        # Check if user has active plan
        result = await db.execute(
            select(UserPlan).where(
                and_(
                    UserPlan.user_id == user.id,
                    UserPlan.is_active == True,
                    UserPlan.expires_at > datetime.utcnow()
                )
            )
        )
        user_plan = result.scalar_one_or_none()
        
        if not user_plan:
            logger.warning(f"User {user.username} has no active plan")
            return None
        
        # Check data balance for data-based plans
        if user_plan.data_remaining_mb is not None and user_plan.data_remaining_mb <= 0:
            logger.warning(f"User {user.username} has exhausted data")
            return None
        
        # Create session
        session = Session(
            session_id=generate_session_id(),
            user_id=user.id,
            username=user.username,
            nas_ip_address=nas_ip,
            framed_ip_address=framed_ip,
            mac_address=mac_address,
            user_plan_id=user_plan.id,
            is_active=True,
            started_at=datetime.utcnow()
        )
        
        db.add(session)
        await db.commit()
        await db.refresh(session)
        
        logger.info(f"Created session {session.session_id} for user {user.username}")
        return session
    
    @staticmethod
    async def update_session(
        db: AsyncSession,
        session_id: str,
        upload_bytes: int,
        download_bytes: int,
        session_time: int
    ) -> bool:
        """Update session usage (RADIUS accounting)"""
        
        result = await db.execute(
            select(Session).where(
                and_(
                    Session.session_id == session_id,
                    Session.is_active == True
                )
            )
        )
        session = result.scalar_one_or_none()
        
        if not session:
            logger.warning(f"Session {session_id} not found")
            return False
        
        # Update session data
        session.upload_bytes = upload_bytes
        session.download_bytes = download_bytes
        session.total_bytes = upload_bytes + download_bytes
        session.session_duration = session_time
        
        # Update user plan data usage
        if session.user_plan_id:
            bytes_to_mb = (upload_bytes + download_bytes) / (1024 * 1024)
            
            result = await db.execute(
                select(UserPlan).where(UserPlan.id == session.user_plan_id)
            )
            user_plan = result.scalar_one_or_none()
            
            if user_plan:
                user_plan.data_used_mb = int(bytes_to_mb)
                
                if user_plan.data_remaining_mb is not None:
                    user_plan.data_remaining_mb = max(
                        0,
                        user_plan.plan.data_limit_mb - user_plan.data_used_mb
                    )
                    
                    # Disconnect if data exhausted
                    if user_plan.data_remaining_mb <= 0:
                        await SessionManager.terminate_session(
                            db,
                            session_id,
                            "Data-Limit-Exceeded"
                        )
        
        await db.commit()
        return True
    
    @staticmethod
    async def terminate_session(
        db: AsyncSession,
        session_id: str,
        termination_cause: str = "User-Request"
    ) -> bool:
        """Terminate active session"""
        
        result = await db.execute(
            select(Session).where(
                and_(
                    Session.session_id == session_id,
                    Session.is_active == True
                )
            )
        )
        session = result.scalar_one_or_none()
        
        if not session:
            return False
        
        # Update session
        session.is_active = False
        session.stopped_at = datetime.utcnow()
        session.termination_cause = termination_cause
        
        # Calculate final duration
        if session.started_at:
            duration = (datetime.utcnow() - session.started_at).total_seconds()
            session.session_duration = int(duration)
        
        await db.commit()
        
        # Disconnect from MikroTik
        try:
            mikrotik_service.disconnect_user(session.username)
        except Exception as e:
            logger.error(f"Failed to disconnect user from MikroTik: {e}")
        
        logger.info(f"Terminated session {session_id}")
        return True
    
    @staticmethod
    async def check_expired_plans(db: AsyncSession):
        """Check and deactivate expired plans"""
        
        # Get expired plans
        result = await db.execute(
            select(UserPlan).where(
                and_(
                    UserPlan.is_active == True,
                    UserPlan.expires_at <= datetime.utcnow()
                )
            )
        )
        expired_plans = result.scalars().all()
        
        for user_plan in expired_plans:
            # Deactivate plan
            user_plan.is_active = False
            
            # Get user
            result = await db.execute(
                select(User).where(User.id == user_plan.user_id)
            )
            user = result.scalar_one_or_none()
            
            if user:
                # Terminate all active sessions
                result = await db.execute(
                    select(Session).where(
                        and_(
                            Session.user_id == user.id,
                            Session.is_active == True
                        )
                    )
                )
                active_sessions = result.scalars().all()
                
                for session in active_sessions:
                    await SessionManager.terminate_session(
                        db,
                        session.session_id,
                        "Plan-Expired"
                    )
                
                # Disable user in MikroTik
                try:
                    mikrotik_service.update_hotspot_user(
                        username=user.username,
                        disabled=True
                    )
                except Exception as e:
                    logger.error(f"Failed to disable user in MikroTik: {e}")
            
            logger.info(f"Deactivated expired plan for user {user_plan.user_id}")
        
        await db.commit()
        return len(expired_plans)
    
    @staticmethod
    async def get_active_sessions_count(db: AsyncSession) -> int:
        """Get count of active sessions"""
        from sqlalchemy import func as sql_func
        
        result = await db.execute(
            select(sql_func.count(Session.id)).where(Session.is_active == True)
        )
        count = result.scalar()
        return count or 0


# Singleton instance
session_manager = SessionManager()