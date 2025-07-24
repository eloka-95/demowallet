import api from '../api';

export default {
    async register(userData) {
        // 1. Get CSRF cookie first
        await api.get('/sanctum/csrf-cookie');

        // 2. Submit registration
        return api.post('/register', userData);
    },

    async verifyEmail(verificationUrl) {
        return api.get(verificationUrl);
      },
      
    async login(email, password) {
        // 1. Get CSRF cookie
        await api.get('/sanctum/csrf-cookie');

        // 2. Authenticate
        return api.post('/login', { email, password });
    },

    async logout() {
        return api.post('/logout');
    },

    async getUser() {
        return api.get('/api/user');
    }
};