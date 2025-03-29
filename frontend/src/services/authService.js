import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

console.log("Using API URL:", API_URL); // Debugging

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
            const response = await axios.post(`${API_URL}/register`, userData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
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
            
            // Store token and user data
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            
            return response.data;
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            throw error.response?.data || { message: 'Login failed' };
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

    // Generate script
    generateScript: async (scriptData, signal) => {
        try {
            const response = await axios.post(`${API_URL}/generate-script`, scriptData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                signal
            });
            return response.data;
        } catch (error) {
            if (error.name === 'CanceledError') {
                throw new Error('Request was cancelled');
            }
            console.error('Script generation error:', error.response?.data || error.message);
            throw error.response?.data || { message: 'Script generation failed' };
        }
    },

    // Get user's script history
    getScriptHistory: async () => {
        try {
            const response = await axios.get(`${API_URL}/scripts/history`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching script history:', error.response?.data || error.message);
            throw error.response?.data || { message: 'Failed to fetch script history' };
        }
    },

    // Change password
    changePassword: async (currentPassword, newPassword, confirmPassword) => {
        try {
            const response = await axios.post(
                `${API_URL}/users/change-password`,
                { currentPassword, newPassword, confirmPassword },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Password change error:', error.response?.data || error.message);
            throw error.response?.data || { message: 'Failed to change password' };
        }
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

export default authService;
