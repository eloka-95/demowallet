import axios from 'axios';

const api = axios.create({
    baseURL: 'https://apiegifinance.ltd',
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});
// api.js
    api.interceptors.request.use(config => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, error => {
        return Promise.reject(error);
    });

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Handle specific status codes
            if (error.response.status === 401) {
                // Unauthorized - token expired or invalid
                console.error('Authentication error:', error);
                // You might want to trigger logout here
            } else if (error.response.status === 403) {
                // Forbidden - no permission
                console.error('Authorization error:', error);
            }
        }
        return Promise.reject(error);
    }
);

export default api;




// import axios from 'axios';

// const api = axios.create({
//     baseURL: 'https://api.growthalpha.ltd',
//     withCredentials: true,
//     headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//     }
// });
// // api.js
// api.interceptors.request.use(config => {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// }, error => {
//     return Promise.reject(error);
// });

// // Response interceptor
// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response) {
//             // Handle specific status codes
//             if (error.response.status === 401) {
//                 // Unauthorized - token expired or invalid
//                 console.error('Authentication error:', error);
//                 // You might want to trigger logout here
//             } else if (error.response.status === 403) {
//                 // Forbidden - no permission
//                 console.error('Authorization error:', error);
//             }
//         }
//         return Promise.reject(error);
//     }
// );

// export default api;