import axios from 'axios';
import store from '@/store';
import { logoutUser } from '@/store/slices/authSlice';

// All requests go to the backend with credentials (cookies) sent automatically
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
    timeout: 30000,
    withCredentials: true, // ← send HTTP-only cookie on every request
    headers: { 'Content-Type': 'application/json' },
});

// Response: if 401 the cookie has expired/invalid — log the user out
// Guard: never re-trigger on the logout or me endpoints to avoid circular loops
{/*api.interceptors.response.use(
    (response) => response,
    (error) => {
        const url = error.config?.url || '';
        const isAuthEndpoint = url.includes('/auth/logout') || url.includes('/auth/login') || url.includes('/auth/register');
        if (error.response?.status === 401 && !isAuthEndpoint) {
            store.dispatch(logoutUser());
        }
        return Promise.reject(error);
    }
);*/}

export default api;
