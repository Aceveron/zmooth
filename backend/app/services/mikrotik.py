import routeros_api
import logging
from typing import Dict, List, Optional
from ..core.config import settings

logger = logging.getLogger(__name__)


class MikroTikService:
    """Service for MikroTik RouterOS integration"""
    
    def __init__(self):
        self.host = settings.MIKROTIK_HOST
        self.username = settings.MIKROTIK_USERNAME
        self.password = settings.MIKROTIK_PASSWORD
        self.port = settings.MIKROTIK_PORT
        self.use_ssl = settings.MIKROTIK_USE_SSL
        self.connection = None
    
    def connect(self):
        """Establish connection to MikroTik"""
        try:
            self.connection = routeros_api.RouterOsApiPool(
                host=self.host,
                username=self.username,
                password=self.password,
                port=self.port,
                use_ssl=self.use_ssl,
                ssl_verify=False,
                plaintext_login=True
            )
            api = self.connection.get_api()
            logger.info("Successfully connected to MikroTik")
            return api
        except Exception as e:
            logger.error(f"Failed to connect to MikroTik: {e}")
            raise
    
    def disconnect(self):
        """Close MikroTik connection"""
        if self.connection:
            self.connection.disconnect()
            logger.info("Disconnected from MikroTik")
    
    def add_hotspot_user(
        self,
        username: str,
        password: str,
        profile: str = "default",
        mac_address: Optional[str] = None,
        limit_uptime: Optional[str] = None,
        limit_bytes_total: Optional[int] = None
    ) -> bool:
        """Add user to MikroTik Hotspot"""
        api = self.connect()
        try:
            hotspot_user = api.get_resource('/ip/hotspot/user')
            
            user_data = {
                'name': username,
                'password': password,
                'profile': profile,
            }
            
            if mac_address:
                user_data['mac-address'] = mac_address
            
            if limit_uptime:
                user_data['limit-uptime'] = limit_uptime
            
            if limit_bytes_total:
                user_data['limit-bytes-total'] = str(limit_bytes_total)
            
            hotspot_user.add(**user_data)
            logger.info(f"Added hotspot user: {username}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to add hotspot user: {e}")
            return False
        finally:
            self.disconnect()
    
    def update_hotspot_user(
        self,
        username: str,
        profile: Optional[str] = None,
        limit_uptime: Optional[str] = None,
        limit_bytes_total: Optional[int] = None,
        disabled: Optional[bool] = None
    ) -> bool:
        """Update existing hotspot user"""
        api = self.connect()
        try:
            hotspot_user = api.get_resource('/ip/hotspot/user')
            users = hotspot_user.get(name=username)
            
            if not users:
                logger.warning(f"User {username} not found")
                return False
            
            user_id = users[0]['id']
            update_data = {}
            
            if profile:
                update_data['profile'] = profile
            if limit_uptime:
                update_data['limit-uptime'] = limit_uptime
            if limit_bytes_total:
                update_data['limit-bytes-total'] = str(limit_bytes_total)
            if disabled is not None:
                update_data['disabled'] = 'yes' if disabled else 'no'
            
            hotspot_user.set(id=user_id, **update_data)
            logger.info(f"Updated hotspot user: {username}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to update hotspot user: {e}")
            return False
        finally:
            self.disconnect()
    
    def remove_hotspot_user(self, username: str) -> bool:
        """Remove user from MikroTik Hotspot"""
        api = self.connect()
        try:
            hotspot_user = api.get_resource('/ip/hotspot/user')
            users = hotspot_user.get(name=username)
            
            if not users:
                logger.warning(f"User {username} not found")
                return False
            
            hotspot_user.remove(id=users[0]['id'])
            logger.info(f"Removed hotspot user: {username}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to remove hotspot user: {e}")
            return False
        finally:
            self.disconnect()
    
    def disconnect_user(self, username: str) -> bool:
        """Disconnect active user session"""
        api = self.connect()
        try:
            active_users = api.get_resource('/ip/hotspot/active')
            sessions = active_users.get(user=username)
            
            for session in sessions:
                active_users.remove(id=session['id'])
            
            logger.info(f"Disconnected user: {username}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to disconnect user: {e}")
            return False
        finally:
            self.disconnect()
    
    def get_active_users(self) -> List[Dict]:
        """Get all active hotspot users"""
        api = self.connect()
        try:
            active_users = api.get_resource('/ip/hotspot/active')
            users = active_users.get()
            return users
        except Exception as e:
            logger.error(f"Failed to get active users: {e}")
            return []
        finally:
            self.disconnect()
    
    def create_user_profile(
        self,
        name: str,
        rate_limit: str = "",  # e.g., "2M/5M" (download/upload)
        session_timeout: str = "",
        shared_users: int = 1
    ) -> bool:
        """Create a new user profile"""
        api = self.connect()
        try:
            profiles = api.get_resource('/ip/hotspot/user/profile')
            
            profile_data = {
                'name': name,
                'shared-users': str(shared_users)
            }
            
            if rate_limit:
                profile_data['rate-limit'] = rate_limit
            
            if session_timeout:
                profile_data['session-timeout'] = session_timeout
            
            profiles.add(**profile_data)
            logger.info(f"Created profile: {name}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to create profile: {e}")
            return False
        finally:
            self.disconnect()


# Singleton instance
mikrotik_service = MikroTikService()