import React, { useState } from 'react';
import AuthContainer from './AuthContainer';
import { Link } from 'react-router-dom';
import './css/AuthForms.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your password reset logic here
        setMessage('If an account exists with this email, you will receive a reset link.');
        console.log('Forgot password submitted:', { email });
    };

    return (
        <AuthContainer title="Reset Password">
            <form onSubmit={handleSubmit} className="auth-form">
                {error && <div className="auth-error">{error}</div>}
                {message && <div className="auth-message">{message}</div>}

                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                    />
                </div>

                <button type="submit" className="auth-button primary">Send Reset Link</button>

                <div className="auth-footer">
                    Remember your password? <Link to="/wallet/login" className="auth-link">Sign in</Link>
                </div>
            </form>
        </AuthContainer>
    );
};

export default ForgotPassword;