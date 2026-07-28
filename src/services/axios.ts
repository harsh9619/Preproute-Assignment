import axios from 'axios';

// Create configured Axios instance
const axiosInstance = axios.create({
  baseURL: 'https://admin-moderator-backend-staging.up.railway.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('preproute_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to format success / error data
axiosInstance.interceptors.response.use(
  (response) => {
    // Return the response data body directly (e.g. { success: true, data: [...] })
    return response.data;
  },
  (error) => {
    // Extract server message or standard error message
    const errMsg = error.response?.data?.message || error.message || 'API request error';
    return Promise.reject(new Error(errMsg));
  }
);

export default axiosInstance;
