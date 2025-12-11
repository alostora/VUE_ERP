
const general_request = {

  BASE_URL: import.meta.env.VITE_HOST_URL || 'http://localhost:8000',

  get headers() {
    const token = localStorage.getItem('authToken');
    return {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };
  },

  axiosInstance: null,

  getAxiosInstance() {
    if (!this.axiosInstance) {
      const axios = require('axios');

      this.axiosInstance = axios.create({
        baseURL: this.BASE_URL,
        timeout: 30000,
      });

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

      this.axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;

          if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
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

              if (response.data.access_token) {
                localStorage.setItem('authToken', response.data.access_token);
                localStorage.setItem('refreshToken', response.data.refresh_token || refreshToken);

                originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
                return this.axiosInstance(originalRequest);
              }
            } catch (refreshError) {
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

  clearAuthTokens() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },

  async request(config) {
    try {
      const instance = this.getAxiosInstance();
      return await instance(config);
    } catch (error) {
      this.handleRequestError(error);
      throw error;
    }
  },

  handleRequestError(error) {
    if (error.response) {
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url
      });

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
      console.error('Network error - no response received:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }
  },

  getHeaders() {
    return this.headers;
  }
};

export default general_request;