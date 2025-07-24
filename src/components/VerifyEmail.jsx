import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './styles/VerifyEmail.css'



const VerifyEmail = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { state } = useLocation();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post('/api/verify-email', {
                email: state?.email,
                code
            });

            navigate('/login', {
                state: { message: 'Email verified successfully! Please login.' }
            });
        } catch (error) {
            setError(error.response?.data?.message || 'Verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="verify-email-container">
            <h2>Verify Your Email</h2>
            <p>We've sent a 6-digit code to <strong>{state?.email}</strong></p>

            <form className="verify-email-form" onSubmit={handleSubmit}>
                {error && <div className="verify-error-message">{error}</div>}

                <div className="verify-input-group">
                    <label>Verification Code</label>
                    <input
                        className="verify-code-input"
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        maxLength="6"
                        required
                    />
                </div>

                <button
                    className="verify-submit-btn"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? 'Verifying...' : 'Verify Email'}
                </button>
            </form>
        </div>
    );
};

// http://localhost:8000/api/check-verification/user@example.com

export default VerifyEmail;



