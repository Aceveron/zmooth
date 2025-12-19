import requests
import base64
import logging
from datetime import datetime
from typing import Dict, Optional
from ..core.config import settings

logger = logging.getLogger(__name__)


class MPesaService:
    """M-Pesa STK Push Payment Integration (Safaricom - Kenya)"""
    
    def __init__(self):
        self.consumer_key = settings.MPESA_CONSUMER_KEY
        self.consumer_secret = settings.MPESA_CONSUMER_SECRET
        self.shortcode = settings.MPESA_SHORTCODE
        self.passkey = settings.MPESA_PASSKEY
        self.callback_url = settings.MPESA_CALLBACK_URL
        self.environment = settings.MPESA_ENVIRONMENT
        
        # Set API URLs based on environment
        if self.environment == "production":
            self.auth_url = "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
            self.stk_push_url = "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
            self.query_url = "https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query"
        else:
            self.auth_url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
            self.stk_push_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
            self.query_url = "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query"
    
    def get_access_token(self) -> Optional[str]:
        """Get OAuth access token"""
        try:
            auth_string = f"{self.consumer_key}:{self.consumer_secret}"
            auth_bytes = auth_string.encode('ascii')
            auth_base64 = base64.b64encode(auth_bytes).decode('ascii')
            
            headers = {
                'Authorization': f'Basic {auth_base64}'
            }
            
            response = requests.get(self.auth_url, headers=headers)
            response.raise_for_status()
            
            token = response.json().get('access_token')
            return token
            
        except Exception as e:
            logger.error(f"Failed to get M-Pesa access token: {e}")
            return None
    
    def generate_password(self, timestamp: str) -> str:
        """Generate password for STK push"""
        data_to_encode = f"{self.shortcode}{self.passkey}{timestamp}"
        encoded = base64.b64encode(data_to_encode.encode())
        return encoded.decode('utf-8')
    
    def stk_push(
        self,
        phone_number: str,
        amount: int,
        account_reference: str,
        transaction_desc: str
    ) -> Dict:
        """Initiate STK Push payment"""
        
        # Format phone number (remove + and ensure starts with 254)
        if phone_number.startswith('+'):
            phone_number = phone_number[1:]
        if phone_number.startswith('0'):
            phone_number = '254' + phone_number[1:]
        if not phone_number.startswith('254'):
            phone_number = '254' + phone_number
        
        access_token = self.get_access_token()
        if not access_token:
            return {
                'success': False,
                'message': 'Failed to authenticate with M-Pesa'
            }
        
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password = self.generate_password(timestamp)
        
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'BusinessShortCode': self.shortcode,
            'Password': password,
            'Timestamp': timestamp,
            'TransactionType': 'CustomerPayBillOnline',
            'Amount': amount,
            'PartyA': phone_number,
            'PartyB': self.shortcode,
            'PhoneNumber': phone_number,
            'CallBackURL': self.callback_url,
            'AccountReference': account_reference,
            'TransactionDesc': transaction_desc
        }
        
        try:
            response = requests.post(
                self.stk_push_url,
                json=payload,
                headers=headers,
                timeout=30
            )
            
            result = response.json()
            
            if response.status_code == 200 and result.get('ResponseCode') == '0':
                return {
                    'success': True,
                    'checkout_request_id': result.get('CheckoutRequestID'),
                    'merchant_request_id': result.get('MerchantRequestID'),
                    'response_code': result.get('ResponseCode'),
                    'response_description': result.get('ResponseDescription'),
                    'customer_message': result.get('CustomerMessage')
                }
            else:
                return {
                    'success': False,
                    'message': result.get('errorMessage', 'Payment initiation failed'),
                    'response': result
                }
                
        except Exception as e:
            logger.error(f"STK Push failed: {e}")
            return {
                'success': False,
                'message': str(e)
            }
    
    def query_transaction(self, checkout_request_id: str) -> Dict:
        """Query STK Push transaction status"""
        access_token = self.get_access_token()
        if not access_token:
            return {
                'success': False,
                'message': 'Failed to authenticate with M-Pesa'
            }
        
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password = self.generate_password(timestamp)
        
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'BusinessShortCode': self.shortcode,
            'Password': password,
            'Timestamp': timestamp,
            'CheckoutRequestID': checkout_request_id
        }
        
        try:
            response = requests.post(
                self.query_url,
                json=payload,
                headers=headers,
                timeout=30
            )
            
            return response.json()
            
        except Exception as e:
            logger.error(f"Transaction query failed: {e}")
            return {
                'success': False,
                'message': str(e)
            }


# Singleton instance
mpesa_service = MPesaService()