import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request Interceptor: Attach JWT token instantly to every outgoing request
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('collabboard_token') || sessionStorage.getItem('collabboard_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle global token expiration or unauthorized access
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('collabboard_token');
            localStorage.removeItem('collabboard_user');
            sessionStorage.removeItem('collabboard_token');
            sessionStorage.removeItem('collabboard_user');

            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;