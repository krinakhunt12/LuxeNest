import axios from 'axios';

const API_BASE_URL = 'https://luxenest-o11m.onrender.com/api';
// const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
    decompress: true, // Enable gzip decompression
    // Increase timeout for production
    timeout: 30000, // 30 seconds for production
});

// Request interceptor to add auth token
api.interceptors.request.use(
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

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {

        // Handle cancelled requests
        if (axios.isCancel(error)) {
            console.log('Request cancelled:', error.message);
            return Promise.reject({
                success: false,
                message: 'Request was cancelled',
                isCancelled: true
            });
        }

        if (error.response) {
            // Handle specific error codes
            if (error.response.status === 401) {
                // Unauthorized - clear token and redirect to login
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }

            // Return error message from server
            return Promise.reject(error.response.data);
        }

        // Network error or timeout
        const errorMessage = (error as any).code === 'ECONNABORTED' 
            ? 'Request timeout. Please try again.'
            : 'Network error. Please check your connection.';
            
        return Promise.reject({
            success: false,
            message: errorMessage,
            isNetworkError: true
        });
    }
);

export default api;

