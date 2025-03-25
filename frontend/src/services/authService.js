import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

// Add token to all requests
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const authService = {
    // Register new user
    register: async (userData) => {
        try {
            console.log('Sending registration request:', userData);
            const response = await axios.post(`${API_URL}/register`, userData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            console.log('Registration response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Registration error:', error.response?.data || error.message);
            throw error.response?.data || { message: 'Registration failed' };
        }
    },

    // Login user
    login: async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            if (error.response?.data) {
                throw error.response.data;
            }
            throw { message: 'Login failed' };
        }
    },

    // Get current user
    getCurrentUser: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            const response = await axios.get(`${API_URL}/users/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

export default authService; 