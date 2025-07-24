import axios from 'axios';

// For development (React on port 5173, Laravel on port 8000)
const baseURL = 'http://localhost:8000';

// For production (update these with your actual URLs)
// const baseURL = 'https://your-laravel-api.com';

const api = axios.create({
    baseURL,
    withCredentials: true, // Essential for cookies
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

export default api;