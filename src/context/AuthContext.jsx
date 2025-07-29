import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userStatus, setUserStatus] = useState(null);
    const [isBlocked, setIsBlocked] = useState(false);
    const [adminStats, setAdminStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastActivity, setLastActivity] = useState(Date.now());
    const navigate = useNavigate();

    // Helper function to store auth data
    const storeAuthData = (user, token, stats = null) => {
        setCurrentUser(user);
        setUserRole(user.user_role);
        setUserStatus(user.user_status);
        setIsBlocked(user.user_blocked);
        setAdminStats(user.user_role === 'admin' ? stats : null);
        setLastActivity(Date.now()); // Update activity time on login

        if (token) {
            localStorage.setItem("authToken", token);
            localStorage.setItem("authUser", JSON.stringify(user));
            localStorage.setItem("userRole", user.user_role);
            localStorage.setItem("userStatus", user.user_status);
            localStorage.setItem("isBlocked", user.user_blocked);
            localStorage.setItem("lastActivity", Date.now().toString());

            if (user.user_role === 'admin' && stats) {
                localStorage.setItem("adminStats", JSON.stringify(stats));
            }
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
    };

    // Helper function to clear auth data
    const clearAuthData = () => {
        setCurrentUser(null);
        setUserRole(null);
        setUserStatus(null);
        setIsBlocked(false);
        setAdminStats(null);
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userStatus");
        localStorage.removeItem("isBlocked");
        localStorage.removeItem("adminStats");
        localStorage.removeItem("lastActivity");
        delete api.defaults.headers.common["Authorization"];
    };

    // Check authentication status on initial load
    useEffect(() => {
        const checkAuthStatus = async () => {
            const storedToken = localStorage.getItem("authToken");
            const storedUser = localStorage.getItem("authUser");
            const storedRole = localStorage.getItem("userRole");
            const storedStatus = localStorage.getItem("userStatus");
            const storedBlocked = localStorage.getItem("isBlocked");
            const storedAdminStats = localStorage.getItem("adminStats");
            const storedActivity = localStorage.getItem("lastActivity");

            // Check if session is expired (24 hours of inactivity)
            if (storedActivity && Date.now() - parseInt(storedActivity) > 86400000) {
                clearAuthData();
                setLoading(false);
                return;
            }

            if (storedToken && storedUser) {
                try {
                    // Verify token with backend
                    const response = await api.get('/api/user');

                    // Check if user is active and not blocked
                    if (response.data.user_status !== 'active' || response.data.user_blocked) {
                        throw new Error('Account not active');
                    }

                    // Parse stored admin stats if user is admin
                    const adminStats = storedRole === 'admin' && storedAdminStats ? JSON.parse(storedAdminStats) : null;

                    storeAuthData(JSON.parse(storedUser), storedToken, adminStats);
                } catch (error) {
                    console.error("Token verification failed:", error);
                    clearAuthData();
                }
            } else {
                clearAuthData();
            }
            setLoading(false);
        };

        checkAuthStatus();
    }, []);

    // Track user activity
    useEffect(() => {
        const activities = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];

        const updateActivity = () => {
            const now = Date.now();
            setLastActivity(now);
            localStorage.setItem("lastActivity", now.toString());
        };

        // Add event listeners for user activity
        activities.forEach(event => {
            window.addEventListener(event, updateActivity);
        });

        return () => {
            activities.forEach(event => {
                window.removeEventListener(event, updateActivity);
            });
        };
    }, []);

    // Check for inactivity and log out if needed
    useEffect(() => {
        const checkInactivity = () => {
            const storedActivity = localStorage.getItem("lastActivity");
            if (storedActivity && Date.now() - parseInt(storedActivity) > 86400000) {
                logout();
            }
        };

        // Check every 5 minutes
        const interval = setInterval(checkInactivity, 300000);
        return () => clearInterval(interval);
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            // First get CSRF cookie
            await api.get('/sanctum/csrf-cookie');
            // Then attempt login
            const response = await api.post('/api/login', {
                email,
                password
            });

            // Check account status
            if (response.data.user.user_status !== 'active' || response.data.user.user_blocked) {
                throw new Error('Account not active or blocked');
            }

            // Store auth data, including admin_stats if present
            storeAuthData(response.data.user, response.data.access_token, response.data.admin_stats);

            return {
                success: true,
                user: response.data.user,
                admin_stats: response.data.admin_stats
            };
        } catch (error) {
            clearAuthData();

            let errorMessage = "Login failed";
            if (error.message === 'Account not active or blocked') {
                errorMessage = "Your account is not active or deactivated. Please contact support.";
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            return {
                success: false,
                error: errorMessage
            };
        }
    };

    const logout = async () => {
        try {
            // Get token before clearing auth data
            const token = localStorage.getItem('authToken');
            // Clear local data first to prevent race conditions
            clearAuthData();
            // Then revoke token on server
            if (token) {
                await api.post('/api/logout', {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            navigate('/wallet/login');
        }
    };

    const value = {
        currentUser,
        userRole,
        userStatus,
        isBlocked,
        adminStats,
        loading,
        login,
        logout,
        isAuthenticated: !!currentUser,
        isAdmin: userRole === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}