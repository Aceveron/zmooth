import axios from 'axios';

// Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_VERSION = '/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}${API_VERSION}`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await api.post('/auth/refresh', {
            refresh_token: refreshToken,
          });

          const { access_token, refresh_token: newRefreshToken } = response.data;
          
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ============================================
// AUTHENTICATION API
// ============================================

export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const { access_token, refresh_token } = response.data;
    
    // Store tokens
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
    return response.data;
  },
};

// ============================================
// USER API
// ============================================

export const userAPI = {
  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/me', profileData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.post('/users/change-password', passwordData);
    return response.data;
  },

  // Get user sessions
  getSessions: async () => {
    const response = await api.get('/users/me/sessions');
    return response.data;
  },

  // Get user transactions
  getTransactions: async (params = {}) => {
    const response = await api.get('/users/me/transactions', { params });
    return response.data;
  },
};

// ============================================
// PLANS API
// ============================================

export const plansAPI = {
  // Get all plans
  getAll: async (params = {}) => {
    const response = await api.get('/plans', { params });
    return response.data;
  },

  // Get plan by ID
  getById: async (planId) => {
    const response = await api.get(`/plans/${planId}`);
    return response.data;
  },

  // Purchase plan
  purchase: async (purchaseData) => {
    const response = await api.post('/plans/purchase', purchaseData);
    return response.data;
  },

  // Get user's active plans
  getMyActivePlans: async () => {
    const response = await api.get('/plans/my-plans/active');
    return response.data;
  },

  // Redeem voucher
  redeemVoucher: async (voucherCode) => {
    const response = await api.post('/plans/redeem-voucher', { voucher_code: voucherCode });
    return response.data;
  },
};

// ============================================
// ADMIN API
// ============================================

export const adminAPI = {
  // User Management
  users: {
    getAll: async (params = {}) => {
      const response = await api.get('/admin/users', { params });
      return response.data;
    },
    
    getById: async (userId) => {
      const response = await api.get(`/admin/users/${userId}`);
      return response.data;
    },
    
    update: async (userId, userData) => {
      const response = await api.put(`/admin/users/${userId}`, userData);
      return response.data;
    },
    
    delete: async (userId) => {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    },
    
    creditWallet: async (userId, amount) => {
      const response = await api.post(`/admin/users/${userId}/credit`, { amount });
      return response.data;
    },
  },

  // Plan Management
  plans: {
    create: async (planData) => {
      const response = await api.post('/plans', planData);
      return response.data;
    },
    
    update: async (planId, planData) => {
      const response = await api.put(`/plans/${planId}`, planData);
      return response.data;
    },
    
    delete: async (planId) => {
      const response = await api.delete(`/plans/${planId}`);
      return response.data;
    },
  },

  // Voucher Management
  vouchers: {
    generate: async (voucherData) => {
      const response = await api.post('/admin/vouchers/generate', voucherData);
      return response.data;
    },
    
    getAll: async (params = {}) => {
      const response = await api.get('/admin/vouchers', { params });
      return response.data;
    },
    
    deactivate: async (voucherId) => {
      const response = await api.post(`/admin/vouchers/${voucherId}/deactivate`);
      return response.data;
    },
  },

  // Dashboard Statistics
  dashboard: {
    getStats: async () => {
      const response = await api.get('/admin/dashboard/stats');
      return response.data;
    },
    
    getRevenue: async (period = '30d') => {
      const response = await api.get('/admin/dashboard/revenue', { params: { period } });
      return response.data;
    },
    
    getActiveSessions: async () => {
      const response = await api.get('/admin/dashboard/active-sessions');
      return response.data;
    },
  },

  // Session Management
  sessions: {
    getAll: async (params = {}) => {
      const response = await api.get('/admin/sessions', { params });
      return response.data;
    },
    
    disconnect: async (sessionId) => {
      const response = await api.post(`/admin/sessions/${sessionId}/disconnect`);
      return response.data;
    },
  },
};

// ============================================
// PAYMENT API
// ============================================

export const paymentAPI = {
  // Initiate M-Pesa payment
  initiateMpesa: async (paymentData) => {
    const response = await api.post('/payments/mpesa/initiate', paymentData);
    return response.data;
  },

  // Check payment status
  checkStatus: async (transactionRef) => {
    const response = await api.get(`/payments/status/${transactionRef}`);
    return response.data;
  },

  // Get transaction history
  getTransactions: async (params = {}) => {
    const response = await api.get('/payments/transactions', { params });
    return response.data;
  },
};

// ============================================
// WALLET API
// ============================================

export const walletAPI = {
  // Get wallet balance
  getBalance: async () => {
    const response = await api.get('/wallet/balance');
    return response.data;
  },

  // Top up wallet
  topUp: async (topUpData) => {
    const response = await api.post('/wallet/topup', topUpData);
    return response.data;
  },

  // Get wallet transactions
  getTransactions: async (params = {}) => {
    const response = await api.get('/wallet/transactions', { params });
    return response.data;
  },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};

export const getToken = () => {
  return localStorage.getItem('access_token');
};

export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

// Default export
export default api;