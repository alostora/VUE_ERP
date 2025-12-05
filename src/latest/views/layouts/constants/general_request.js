// src/latest/views/layouts/constants/general_request.js

/**
 * Global request configuration with dynamic token handling
 * Maintains compatibility with existing code structure
 */

// Base configuration
const general_request = {
  // Base URL from environment
  BASE_URL: import.meta.env.VITE_HOST_URL || 'http://localhost:8000',
  
  // Dynamic headers getter - reads token fresh every time
  get headers() {
    const token = localStorage.getItem('authToken');
    return {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };
  },
  
  // Axios instance with interceptors
  axiosInstance: null,
  
  /**
   * Get or create axios instance with interceptors
   */
  getAxiosInstance() {
    if (!this.axiosInstance) {
      const axios = require('axios');
      
      this.axiosInstance = axios.create({
        baseURL: this.BASE_URL,
        timeout: 30000, // 30 seconds timeout
      });
      
      // Request interceptor - adds token dynamically
      this.axiosInstance.interceptors.request.use(
        (config) => {
          const token = localStorage.getItem('authToken');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
      
      // Response interceptor - handles token refresh
      this.axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;
          
          // Handle 401 Unauthorized errors
          if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
              // Attempt to refresh token
              const refreshToken = localStorage.getItem('refreshToken');
              if (!refreshToken) {
                throw new Error('No refresh token available');
              }
              
              const response = await axios.post(`${this.BASE_URL}/auth/refresh`, {
                refresh_token: refreshToken
              }, {
                headers: {
                  'Content-Type': 'application/json'
                }
              });
              
              // Store new tokens
              if (response.data.access_token) {
                localStorage.setItem('authToken', response.data.access_token);
                localStorage.setItem('refreshToken', response.data.refresh_token || refreshToken);
                
                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
                return this.axiosInstance(originalRequest);
              }
            } catch (refreshError) {
              // Refresh failed - clear tokens and redirect to login
              this.clearAuthTokens();
              if (window.location.pathname !== '/login') {
                window.location.href = '/login';
              }
              return Promise.reject(refreshError);
            }
          }
          
          return Promise.reject(error);
        }
      );
    }
    
    return this.axiosInstance;
  },
  
  /**
   * Clear authentication tokens
   */
  clearAuthTokens() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },
  
  /**
   * Make API request with proper error handling
   */
  async request(config) {
    try {
      const instance = this.getAxiosInstance();
      return await instance(config);
    } catch (error) {
      this.handleRequestError(error);
      throw error;
    }
  },
  
  /**
   * Handle request errors
   */
  handleRequestError(error) {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url
      });
      
      // Specific error handling
      switch (error.response.status) {
        case 401:
          console.warn('Unauthorized access - redirecting to login');
          break;
        case 403:
          console.warn('Forbidden - insufficient permissions');
          break;
        case 404:
          console.warn('Resource not found');
          break;
        case 500:
          console.error('Internal server error');
          break;
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network error - no response received:', error.request);
    } else {
      // Error in request setup
      console.error('Request setup error:', error.message);
    }
  },
  
  /**
   * Legacy compatibility method
   */
  getHeaders() {
    return this.headers;
  }
};

export default general_request;