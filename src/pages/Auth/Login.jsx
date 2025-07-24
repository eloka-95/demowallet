import React, { useState } from 'react';
import AuthContainer from './AuthContainer';
import { Link, useNavigate } from 'react-router-dom';
import './css/AuthForms.css';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';




const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // First get CSRF cookie
            await api.get('/sanctum/csrf-cookie');
            // Then attempt login
            const result = await login(email, password);

            if (result.success) {
                // Redirect based on user role
                switch (result.user.user_role) {
                    case 'admin':
                        navigate('/admin');
                        break;
                    default:
                        navigate('/');
                }
            } else {
                setError(result.error);
            }
        } catch (error) {
            setError('Login failed. Please try again.');
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <AuthContainer title="Welcome Back">
            <form onSubmit={handleSubmit} className="auth-form">
                {error && <div className="auth-error">{error}</div>}

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

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                    />
                </div>

                <div className="auth-actions">
                    <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
                </div>

                <button type="submit" className="auth-button primary">
                    {isLoading ? (
                        <>
                            <span className="spinner"></span>
                            signing in...
                        </>
                    ) : 'Sign In'}

                </button>

                <div className="auth-footer">
                    Don't have an account? <Link to="/register" className="auth-link">Sign up</Link>
                </div>
            </form>
        </AuthContainer>
    );
};

export default Login;