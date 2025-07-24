// components/Auth/LogoutButton.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './styles/logout.css'


// Updated LogoutButton.jsx
const LogoutButton = () => {
    const { logout } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="logout-button"
            disabled={isLoggingOut}
        >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
    );
};


export default LogoutButton;
