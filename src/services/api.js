import axios from 'axios';

// Create an instance of Axios with default settings
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:3001",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors for requests
apiClient.interceptors.request.use(
  (config) => {
    // Add Authorization token or other headers if needed
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptors for responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle API errors globally
    if (error.response?.status === 400) {
      // Redirect to login or handle unauthorized access
    }
    return Promise.reject(error);
  }
);

// API Methods
const api = {
  get: (url, params) => apiClient.get(url, { params }),
  post: (url, data, config = {}) =>
    apiClient.post(url, data, {
      ...config,
      headers: {
        ...config.headers,
        ...(data instanceof FormData && { 'Content-Type': 'multipart/form-data' }),
      },
    }),
  put: (url, data) => apiClient.put(url, data),
  delete: (url) => apiClient.delete(url),
};

export default api;
