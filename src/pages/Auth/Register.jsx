import React, { useState } from 'react';
import AuthContainer from './AuthContainer';
import { Link, useNavigate } from 'react-router-dom';
import { countries, flatCountries } from '../countries';
import './css/AuthForms.css';
import api from '../../api/axios';



const Register = () => {

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        country: ''
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        // Frontend validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }
        if (!formData.country) {
            setError('Please select your country');
            setIsLoading(false);
            return;
        }

        try {
            // First get CSRF cookie
            await api.get('/sanctum/csrf-cookie');

            // Then make registration request
            const response = await api.post('/api/register', {
                name: formData.name,
                username: formData.username,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.confirmPassword,
                country: formData.country
            });

            setSuccessMessage('Registration successful! Please check your email for verification code.');

            // Redirect to verification page
            navigate('/verify-email', {
                state: { email: formData.email }
            });

        } catch (error) {
            if (error.response?.status === 422) {
                // Laravel validation errors
                const errors = error.response.data.errors;
                setError(errors[Object.keys(errors)[0]][0]); // Show first error
            } else {
                setError('Registration failed. Please try again.');
                console.error('Registration error:', error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContainer title="Create Account">
            <form onSubmit={handleSubmit} className="auth-form">

                {error && <div className="auth-error">{error}</div>}
                {successMessage && <div className="auth-success">{successMessage}</div>}

                <div className="input-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Name"
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="username">User Name</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="User name"
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="country">Country</label>
                    <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        className="country-select"
                    >
                        <option value="">Select your country</option>
                        {countries.map(region => (
                            <optgroup key={region.region} label={region.region}>
                                {region.countries.map(country => (
                                    <option key={country.code} value={country.code}>
                                        {country.name}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="auth-button primary"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="spinner"></span>
                            Creating Account...
                        </>
                    ) : 'Sign Up'}
                </button>

                <div className="auth-footer">
                    Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
                </div>
            </form>
        </AuthContainer>
    );
};

export default Register;