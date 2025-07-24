import React from 'react';
import './css/AuthContainer.css'

const AuthContainer = ({ children, title }) => {
    return (
        <div className="auth-container">
            <div className="auth-glass-card">
                <h2 className="auth-title">{title}</h2>
                {children}
            </div>
        </div>
    );
};

export default AuthContainer;