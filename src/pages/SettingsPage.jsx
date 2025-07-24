import React, { useState } from 'react';
import {
    FiBell, FiUser, FiShield, FiLogOut, FiMail,
    FiEye, FiLock, FiCreditCard, FiCheckCircle,
    FiArrowLeft, FiX
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import '../styles/SettingsPage.css';

const SettingsPage = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [activeSection, setActiveSection] = useState('notifications');
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showPinForm, setShowPinForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const navigate = useNavigate();

    const toggleDarkMode = () => setDarkMode(!darkMode);
    const handleGoBack = () => navigate(-1);

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        // Add password validation and update logic here
        console.log('Password update submitted');
        setShowPasswordForm(false);
        // Reset form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handlePinSubmit = (e) => {
        e.preventDefault();
        // Add PIN validation and update logic here
        console.log('PIN update submitted');
        setShowPinForm(false);
        // Reset form
        setPin('');
        setConfirmPin('');
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
                            <button type="submit" className="modal-submit-btn">
                                Update Password
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* PIN Setup Modal */}
            {showPinForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Set Transaction PIN</h3>
                            <button onClick={() => setShowPinForm(false)} className="modal-close">
                                <FiX />
                            </button>
                        </div>
                        <form onSubmit={handlePinSubmit}>
                            <div className="form-group">
                                <label>New 4-digit PIN</label>
                                <input
                                    type="password"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    required
                                    maxLength="4"
                                    pattern="\d{4}"
                                    inputMode="numeric"
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm PIN</label>
                                <input
                                    type="password"
                                    value={confirmPin}
                                    onChange={(e) => setConfirmPin(e.target.value)}
                                    required
                                    maxLength="4"
                                    pattern="\d{4}"
                                    inputMode="numeric"
                                />
                            </div>
                            <button type="submit" className="modal-submit-btn">
                                Set PIN
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
                {/* <div className="dark-mode-toggle">
                    <span>Dark Mode</span>
                    <button
                        onClick={toggleDarkMode}
                        className={`toggle-btn ${darkMode ? 'active' : ''}`}
                    >
                        <div className="toggle-knob"></div>
                    </button>
                </div> */}
            </div>

            <div className="settings-content">
                <div className="settings-sidebar">
                    <div
                        className={`sidebar-item ${activeSection === 'notifications' ? 'active' : ''}`}
                        onClick={() => setActiveSection('notifications')}
                    >
                        <FiBell className="sidebar-icon" />
                        <span>Notifications</span>
                    </div>
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
                    <div className="sidebar-item logout">
                        <FiLogOut className="sidebar-icon" />
                        <span>Log out</span>
                    </div>
                </div>

                <div className="settings-main">
                    {activeSection === 'notifications' && (
                        <div className="settings-section">
                            <h2>Notifications</h2>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <h3>Payment Alert</h3>
                                    <p>Send notification when new payment received</p>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>
                    )}

                    {activeSection === 'profile' && (
                        <div className="settings-section">
                            <h2>Profile Settings</h2>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <FiEye className="setting-icon" />
                                    <h3>View Account ID</h3>
                                </div>
                                <button className="action-btn">View</button>
                            </div>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <FiMail className="setting-icon" />
                                    <h3>Update E-mail</h3>
                                </div>
                                <button className="action-btn">Update</button>
                            </div>
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
                            <div className="setting-item">
                                <div className="setting-info">
                                    <FiCreditCard className="setting-icon" />
                                    <h3>Transaction Pin</h3>
                                    <p>Set a 4-digit PIN for transactions</p>
                                </div>
                                <button
                                    className="action-btn"
                                    onClick={() => setShowPinForm(true)}
                                >
                                    Set Pin
                                </button>
                            </div>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <FiCheckCircle className="setting-icon" />
                                    <h3>2 Step Verification</h3>
                                    <p>Enable extra security for your account</p>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;