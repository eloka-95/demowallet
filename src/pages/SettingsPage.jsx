import React, { useState, useEffect } from 'react';
import {
    FiBell, FiUser, FiShield, FiLogOut, FiMail,
    FiEye, FiLock, FiCreditCard, FiCheckCircle,
    FiArrowLeft, FiX, FiEdit, FiSave
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import api from '../api/axios';
import '../styles/SettingsPage.css';

const SettingsPage = () => {
    const { userDetails, fetchUserDetails } = useData();
    const [darkMode, setDarkMode] = useState(false);
    const [activeSection, setActiveSection] = useState('profile');
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showPinForm, setShowPinForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [kycData, setKycData] = useState(null);
    const [kycStatus, setKycStatus] = useState(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({
        name: '',
        email: '',
        country: ''
    });
    const [loading, setLoading] = useState({
        password: false,
        profile: false,
        kyc: false
    });
    const [errors, setErrors] = useState({
        password: '',
        profile: '',
        kyc: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (userDetails) {
            setProfileForm({
                name: userDetails.name || '',
                email: userDetails.email || '',
                country: userDetails.country || ''
            });
        }
    }, [userDetails]);

    useEffect(() => {
        if (activeSection === 'kyc') {
            fetchKycData();
        }
    }, [activeSection]);

    const fetchKycData = async () => {
        try {
            setLoading(prev => ({ ...prev, kyc: true }));
            setErrors(prev => ({ ...prev, kyc: '' }));

            // Use the new endpoint that returns both status and submission data
            const response = await api.get('/api/user/kyc');

            // Set both status and data from the single response
            setKycStatus({
                status: response.data.status,
                rejection_reason: response.data.submission?.rejection_reason
            });

            // Set KYC data if available
            if (response.data.status !== 'not_submitted') {
                setKycData(response.data.submission);
            } else {
                setKycData(null);
            }
        } catch (err) {
            setErrors(prev => ({ ...prev, kyc: err.response?.data?.message || 'Failed to fetch KYC data' }));
        } finally {
            setLoading(prev => ({ ...prev, kyc: false }));
        }
    };
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setErrors(prev => ({ ...prev, password: 'Passwords do not match' }));
            return;
        }

        try {
            setLoading(prev => ({ ...prev, password: true }));
            setErrors(prev => ({ ...prev, password: '' }));

            // Use lowercase post() and ensure your api instance includes auth token
            await api.post('/api/change-password', {
                current_password: currentPassword,
                password: newPassword,
                password_confirmation: confirmPassword
            });

            setShowPasswordForm(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            // Optional: Show success message
            alert('Password updated successfully!');
        } catch (err) {
            const errorMessage = err.response?.data?.message ||
                err.response?.data?.error ||
                'Failed to update password';
            setErrors(prev => ({ ...prev, password: errorMessage }));
        } finally {
            setLoading(prev => ({ ...prev, password: false }));
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();

        try {
            setLoading(prev => ({ ...prev, profile: true }));
            setErrors(prev => ({ ...prev, profile: '' }));

            await api.put(`/api/users/${userDetails.id}`, profileForm);
            await fetchUserDetails();
            setIsEditingProfile(false);
        } catch (err) {
            setErrors(prev => ({ ...prev, profile: err.response?.data?.message || 'Failed to update profile' }));
        } finally {
            setLoading(prev => ({ ...prev, profile: false }));
        }
    };

    const toggleDarkMode = () => setDarkMode(!darkMode);
    const handleGoBack = () => navigate(-1);

    const handlePinSubmit = (e) => {
        e.preventDefault();
        console.log('PIN update submitted');
        setShowPinForm(false);
        setPin('');
        setConfirmPin('');
    };

    const handleLogout = async () => {
        try {
            await api.post('/api/logout');

            // Clear user data from context/state
            // (Assuming you're using the useData context you mentioned earlier)
            if (fetchUserDetails) {
                fetchUserDetails(null); // or whatever your context uses to clear user data
            }

            // Clear local storage if you store tokens there
            localStorage.removeItem('auth_token');

            // Redirect to login page
            navigate('/wallet/login');

        } catch (err) {
            console.error('Logout failed:', err);
            // Optionally show an error message
            setErrors(prev => ({ ...prev, logout: 'Failed to logout' }));
        }
    };

    return (
        <div className={`settings-container ${darkMode ? 'dark' : ''}`}>
            {/* Password Update Modal */}
            {showPasswordForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Update Password</h3>
                            <button onClick={() => setShowPasswordForm(false)} className="modal-close">
                                <FiX />
                            </button>
                        </div>
                        {errors.password && <div className="error-message">{errors.password}</div>}
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="form-group">
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength="8"
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="modal-submit-btn"
                                disabled={loading.password}
                            >
                                {loading.password ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="settings-header">
                <div className="header-left">
                    <button className="back-button" onClick={handleGoBack}>
                        <FiArrowLeft className="back-icon" />
                    </button>
                    <h1>Settings</h1>
                </div>
            </div>

            <div className="settings-content">
                <div className="settings-sidebar">
                    <div
                        className={`sidebar-item ${activeSection === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveSection('profile')}
                    >
                        <FiUser className="sidebar-icon" />
                        <span>Profile</span>
                    </div>
                    <div
                        className={`sidebar-item ${activeSection === 'security' ? 'active' : ''}`}
                        onClick={() => setActiveSection('security')}
                    >
                        <FiShield className="sidebar-icon" />
                        <span>Security</span>
                    </div>
                    <div
                        className={`sidebar-item ${activeSection === 'kyc' ? 'active' : ''}`}
                        onClick={() => setActiveSection('kyc')}
                    >
                        <FiCreditCard className="sidebar-icon" />
                        <span>KYC Verification</span>
                    </div>
                    <div
                        className="sidebar-item logout"
                        onClick={handleLogout}
                        style={{ cursor: 'pointer' }}
                    >
                        <FiLogOut className="sidebar-icon" />
                        <span>Log out</span>
                    </div>
                </div>

                <div className="settings-main">
                    {activeSection === 'profile' && (
                        <div className="settings-section">
                            <div className="section-header">
                                <h2>Profile Settings</h2>
                                {!isEditingProfile ? (
                                    <button
                                        className="edit-btn"
                                        onClick={() => setIsEditingProfile(true)}
                                    >
                                        <FiEdit /> Edit Profile
                                    </button>
                                ) : (
                                    <button
                                        className="save-btn"
                                        onClick={handleProfileUpdate}
                                        disabled={loading.profile}
                                    >
                                        <FiSave /> {loading.profile ? 'Saving...' : 'Save Changes'}
                                    </button>
                                )}
                            </div>

                            {errors.profile && <div className="error-message">{errors.profile}</div>}

                            {isEditingProfile ? (
                                <div className="profile-form">
                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <input
                                            type="text"
                                            value={profileForm.name}
                                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            value={profileForm.email}
                                            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                            required
                                            disabled
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Country</label>
                                        <input
                                            type="text"
                                            value={profileForm.country}
                                            onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="profile-info">
                                    <div className="info-item">
                                        <span className="info-label">Name:</span>
                                        <span className="info-value">{userDetails?.name}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Email:</span>
                                        <span className="info-value">{userDetails?.email}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Country:</span>
                                        <span className="info-value">{userDetails?.country}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Account Status:</span>
                                        <span className={`info-value status-${userDetails?.user_status}`}>
                                            {userDetails?.user_status}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeSection === 'security' && (
                        <div className="settings-section">
                            <h2>Security</h2>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <FiLock className="setting-icon" />
                                    <h3>Update Password</h3>
                                    <p>Change your account password</p>
                                </div>
                                <button
                                    className="action-btn"
                                    onClick={() => setShowPasswordForm(true)}
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    )}

                    {activeSection === 'kyc' && (
                        <div className="settings-section">
                            <h2>KYC Verification</h2>
                            {loading.kyc ? (
                                <div className="loading">Loading KYC information...</div>
                            ) : errors.kyc ? (
                                <div className="error-message">{errors.kyc}</div>
                            ) : (
                                <div className="kyc-info">
                                    {!kycStatus || kycStatus.status === 'not_submitted' ? (
                                        <div className="kyc-not-submitted">
                                            <p>You haven't submitted your KYC documents yet.</p>
                                            <button
                                                className="submit-kyc-btn"
                                                onClick={() => navigate('/wallet/kyc-verification')}
                                            >
                                                Submit KYC Documents
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="kyc-details">
                                            <div className="kyc-status">
                                                <span className="status-label">Status:</span>
                                                <span className={`status-badge status-${kycStatus.status}`}>
                                                    {kycStatus.status}
                                                </span>
                                            </div>

                                            {kycData && (
                                                <>
                                                    <div className="kyc-document">
                                                        <h4>Document Type:</h4>
                                                        <p>{kycData.document_type}</p>
                                                    </div>
                                                    <div className="kyc-document">
                                                        <h4>Country:</h4>
                                                        <p>{kycData.country}</p>
                                                    </div>
                                                    <div className="kyc-document">
                                                        <h4>Submitted On:</h4>
                                                        <p>{new Date(kycData.submitted_at).toLocaleDateString()}</p>
                                                    </div>

                                                    {/* Show document previews if available */}
                                                    {kycStatus.status === 'approved' && kycData.documents && (
                                                        <div className="document-previews">
                                                            <h4>Document Preview:</h4>
                                                            <div className="preview-grid">
                                                                <a href={kycData.documents.front_document_url} target="_blank" rel="noopener noreferrer">
                                                                    <img src={kycData.documents.front_document_url} alt="Front Document" className="document-preview" />
                                                                </a>
                                                                {kycData.documents.back_document_url && (
                                                                    <a href={kycData.documents.back_document_url} target="_blank" rel="noopener noreferrer">
                                                                        <img src={kycData.documents.back_document_url} alt="Back Document" className="document-preview" />
                                                                    </a>
                                                                )}
                                                                <a href={kycData.documents.selfie_url} target="_blank" rel="noopener noreferrer">
                                                                    <img src={kycData.documents.selfie_url} alt="Selfie" className="document-preview" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {kycStatus.status === 'rejected' && kycStatus.rejection_reason && (
                                                        <div className="kyc-rejection">
                                                            <h4>Rejection Reason:</h4>
                                                            <p>{kycStatus.rejection_reason}</p>
                                                            <button
                                                                className="submit-kyc-btn"
                                                                onClick={() => navigate('/wallet/kyc-verification')}
                                                            >
                                                                Resubmit KYC
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;