import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUpload, FaCheck, FaGlobe, FaIdCard, FaTimes, FaSpinner } from 'react-icons/fa';
import '../styles/KYCVerification.css';
import api from '../api/axios';

const KYCVerification = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [country, setCountry] = useState('');
    const [documentType, setDocumentType] = useState('passport');
    const [frontFile, setFrontFile] = useState(null);
    const [frontPreview, setFrontPreview] = useState(null);
    const [backFile, setBackFile] = useState(null);
    const [backPreview, setBackPreview] = useState(null);
    const [selfieFile, setSelfieFile] = useState(null);
    const [selfiePreview, setSelfiePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [kycStatus, setKycStatus] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const frontInputRef = useRef(null);
    const backInputRef = useRef(null);
    const selfieInputRef = useRef(null);

    const countries = [
        'United States', 'Canada', 'United Kingdom', 'Germany', 'France',
        'Japan', 'Australia', 'Singapore', 'South Korea', 'Brazil'
    ];

    useEffect(() => {
        // Check if user already has KYC status
        checkKYCStatus();
    }, []);
    const checkKYCStatus = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/api/kyc/status');
            setKycStatus(response.data.status);

            // If already approved, redirect to dashboard
            if (response.data.user_verified) {
                navigate('/dashboard', { replace: true });
            }

            // If already submitted but pending, show success message
            if (response.data.status === 'pending') {
                setStep(4);
            }
        } catch (err) {
            console.error('Error checking KYC status:', err);
            setError(err.response?.data?.message || 'Failed to check KYC status');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            navigate(-1);
        }
    };

    const handleFileChange = (e, setFile, setPreview) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type and size
            if (!file.type.match('image.*')) {
                setError('Please upload an image file');
                return;
            }

            if (file.size > 2 * 1024 * 1024) { // 2MB
                setError('File size should be less than 2MB');
                return;
            }

            setError(null);
            setFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeFile = (type) => {
        switch (type) {
            case 'front':
                setFrontFile(null);
                setFrontPreview(null);
                if (frontInputRef.current) frontInputRef.current.value = '';
                break;
            case 'back':
                setBackFile(null);
                setBackPreview(null);
                if (backInputRef.current) backInputRef.current.value = '';
                break;
            case 'selfie':
                setSelfieFile(null);
                setSelfiePreview(null);
                if (selfieInputRef.current) selfieInputRef.current.value = '';
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('country', country);
            formData.append('document_type', documentType);
            formData.append('front_document', frontFile);

            if (documentType !== 'passport' && backFile) {
                formData.append('back_document', backFile);
            }

            formData.append('selfie', selfieFile);

            const response = await api.post('/api/kyc/submit', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setStep(4); // Success step
        } catch (err) {
            console.error('Error submitting KYC:', err);
            setError(err.response?.data?.message || 'Failed to submit KYC documents');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="kyc-container">
                <div className="loading-spinner">
                    <FaSpinner className="spinner-icon" />
                    <p>Checking your verification status...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="kyc-container">
            <button className="back-button" onClick={handleBack}>
                <FaArrowLeft style={{ marginRight: '8px' }} />
                Back
            </button>

            <div className="kyc-card">
                {error && (
                    <div className="kyc-error-alert">
                        {error}
                        <button onClick={() => setError(null)} className="close-error">
                            <FaTimes />
                        </button>
                    </div>
                )}

                <div className="kyc-header">
                    <h2>Identity Verification</h2>
                    <div className="progress-steps">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`step ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}
                            >
                                {i < step ? <FaCheck /> : i}
                            </div>
                        ))}
                    </div>
                </div>

                {step === 1 && (
                    <div className="kyc-step">
                        <div className="step-icon">
                            <FaGlobe size={48} color="var(--primary)" />
                        </div>
                        <h3>Select Your Country</h3>
                        <p>Choose the country that issued your identity document</p>

                        <div className="country-selector">
                            <select
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="kyc-input"
                            >
                                <option value="">Select Country</option>
                                {countries.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            className="kyc-primary-btn"
                            onClick={() => setStep(2)}
                            disabled={!country}
                        >
                            Continue
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="kyc-step">
                        <div className="step-icon">
                            <FaIdCard size={48} color="var(--primary)" />
                        </div>
                        <h3>Upload Identity Document</h3>
                        <p>Please upload a clear photo of your government-issued ID</p>

                        <div className="document-options">
                            <label>
                                <input
                                    type="radio"
                                    name="documentType"
                                    value="passport"
                                    checked={documentType === 'passport'}
                                    onChange={() => setDocumentType('passport')}
                                />
                                Passport
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="documentType"
                                    value="driver-license"
                                    checked={documentType === 'driver-license'}
                                    onChange={() => setDocumentType('driver-license')}
                                />
                                Driver's License
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="documentType"
                                    value="id-card"
                                    checked={documentType === 'id-card'}
                                    onChange={() => setDocumentType('id-card')}
                                />
                                National ID
                            </label>
                        </div>

                        <div className="upload-section">
                            <div className="upload-box">
                                {frontPreview ? (
                                    <div className="document-preview">
                                        <img src={frontPreview} alt="Front of document" />
                                        <button
                                            className="remove-btn"
                                            onClick={() => removeFile('front')}
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                ) : (
                                    <label htmlFor="front-upload">
                                        <FaUpload size={24} />
                                        <span>Upload Front Side</span>
                                        <input
                                            id="front-upload"
                                            ref={frontInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, setFrontFile, setFrontPreview)}
                                            hidden
                                        />
                                    </label>
                                )}
                            </div>

                            {documentType !== 'passport' && (
                                <div className="upload-box">
                                    {backPreview ? (
                                        <div className="document-preview">
                                            <img src={backPreview} alt="Back of document" />
                                            <button
                                                className="remove-btn"
                                                onClick={() => removeFile('back')}
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    ) : (
                                        <label htmlFor="back-upload">
                                            <FaUpload size={24} />
                                            <span>Upload Back Side</span>
                                            <input
                                                id="back-upload"
                                                ref={backInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, setBackFile, setBackPreview)}
                                                hidden
                                            />
                                        </label>
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            className="kyc-primary-btn"
                            onClick={() => setStep(3)}
                            disabled={!frontFile || (documentType !== 'passport' && !backFile)}
                        >
                            Continue
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="kyc-step">
                        <h3>Take a Selfie</h3>
                        <p>We need to verify that you're the same person on the ID</p>

                        <div className="selfie-upload">
                            <div className="upload-box large">
                                {selfiePreview ? (
                                    <div className="selfie-preview">
                                        <img src={selfiePreview} alt="Selfie" />
                                        <button
                                            className="remove-btn"
                                            onClick={() => removeFile('selfie')}
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                ) : (
                                    <label htmlFor="selfie-upload">
                                        <FaUpload size={32} />
                                        <span>Upload Selfie</span>
                                        <input
                                            id="selfie-upload"
                                            ref={selfieInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, setSelfieFile, setSelfiePreview)}
                                            hidden
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="requirements">
                            <h4>Requirements:</h4>
                            <ul>
                                <li>Face must be clearly visible</li>
                                <li>No sunglasses or hats</li>
                                <li>Good lighting conditions</li>
                                <li>No filters or edits</li>
                            </ul>
                        </div>

                        <button
                            className="kyc-primary-btn"
                            onClick={handleSubmit}
                            disabled={!selfieFile || isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <FaSpinner className="spinner" />
                                    Submitting...
                                </>
                            ) : 'Submit Verification'}
                        </button>
                    </div>
                )}

                {step === 4 && (
                    <div className="kyc-success">
                        <div className="success-icon">
                            <FaCheck size={64} color="var(--success)" />
                        </div>
                        <h3>Verification Submitted</h3>
                        <p>Your documents have been received and are being reviewed. We'll notify you once your verification is complete.</p>
                        <button
                            className="kyc-primary-btn"
                            onClick={() => navigate('/wallet')}
                        >
                            Return to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KYCVerification;