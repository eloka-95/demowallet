import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaSearch, FaSpinner, FaFileImage, FaTimesCircle } from 'react-icons/fa';
import api from '../../api/axios';
import './styles/AdminKYCVerification.css';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AdminKYCVerification = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [previewImage, setPreviewImage] = useState(null);
    const [approvingId, setApprovingId] = useState(null);
    const [rejectingId, setRejectingId] = useState(null);

    const fetchSubmissions = async (page = 1) => {
        try {
            setLoading(true);
            const response = await api.get('/api/getKyc', {
                params: {
                    page,
                    search: searchTerm,
                    status: statusFilter === 'all' ? null : statusFilter
                }
            });
            setSubmissions(response.data.data);
            setTotalPages(response.data.last_page);
            setCurrentPage(response.data.current_page);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            setApprovingId(id);
            await api.post(`/api/admin/kyc/${id}/approve`);
            fetchSubmissions(currentPage);
        } catch (error) {
            console.error('Error approving submission:', error);
        } finally {
            setApprovingId(null);
        }
    };

    const handleReject = async () => {
        try {
            setRejectingId(selectedSubmission.id);
            await api.post(`/api/admin/kyc/${selectedSubmission.id}/reject`, {
                reason: rejectReason
            });
            setShowRejectModal(false);
            setRejectReason('');
            fetchSubmissions(currentPage);
        } catch (error) {
            console.error('Error rejecting submission:', error);
        } finally {
            setRejectingId(null);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, [searchTerm, statusFilter]);

    const getStatusBadge = (status) => {
        const statusClasses = {
            pending: 'status-pending',
            approved: 'status-approved',
            rejected: 'status-rejected'
        };

        return (
            <span className={`status-badge ${statusClasses[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const openPreview = (imageUrl) => {
        setPreviewImage(imageUrl);
    };

    const closePreview = () => {
        setPreviewImage(null);
    };

    return (
        <div className="admin-kyc-container">
            <h1 className="admin-kyc-title">KYC Verifications</h1>

            <div className="admin-kyc-filters">
                <div className="search-container">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filter-container">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="status-filter"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="loading-spinner">
                    <FaSpinner className="spinner-icon" />
                    <p>Loading submissions...</p>
                </div>
            ) : (
                <>
                    <div className="submissions-table-container">
                        <table className="submissions-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Document Type</th>
                                    <th>Country</th>
                                    <th>Status</th>
                                    <th>Submitted At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.length > 0 ? (
                                    submissions.map((submission) => (
                                        <tr key={submission.id}>
                                            <td>
                                                <div className="user-info">
                                                    <div className="user-name">{submission.user.name}</div>
                                                    <div className="user-email">{submission.user.email}</div>
                                                </div>
                                            </td>
                                            <td className="document-type">
                                                {submission.document_type.replace('-', ' ')}
                                            </td>
                                            <td>{submission.country}</td>
                                            <td>{getStatusBadge(submission.status)}</td>
                                            <td>{formatDate(submission.submitted_at)}</td>
                                            <td className="actions-cell">
                                                <button
                                                    onClick={() => setSelectedSubmission(submission)}
                                                    className="view-btn"
                                                >
                                                    View
                                                </button>
                                                {submission.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(submission.id)}
                                                            className="approve-btn"
                                                            disabled={approvingId === submission.id}
                                                        >
                                                            {approvingId === submission.id ? (
                                                                <FaSpinner className="spinner-icon" />
                                                            ) : (
                                                                'Approve'
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedSubmission(submission);
                                                                setShowRejectModal(true);
                                                            }}
                                                            className="reject-btn"
                                                            disabled={rejectingId === submission.id}
                                                        >
                                                            {rejectingId === submission.id ? (
                                                                <FaSpinner className="spinner-icon" />
                                                            ) : (
                                                                'Reject'
                                                            )}
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="no-results">
                                            No KYC submissions found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination-container">
                            <button
                                onClick={() => fetchSubmissions(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="pagination-btn"
                            >
                                Previous
                            </button>
                            <span className="page-info">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => fetchSubmissions(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="pagination-btn"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Submission Detail Modal */}
            {selectedSubmission && (
                <div className="modal-overlay">
                    <div className="submission-modal">
                        <div className="modal-header">
                            <h2>KYC Submission Details</h2>
                            <button
                                onClick={() => setSelectedSubmission(null)}
                                className="close-modal"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="modal-content">
                            <div className="user-details">
                                <h3>User Information</h3>
                                <div className="detail-row">
                                    <span className="detail-label">Name:</span>
                                    <span>{selectedSubmission.user.name}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Email:</span>
                                    <span>{selectedSubmission.user.email}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Country:</span>
                                    <span>{selectedSubmission.country}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Document Type:</span>
                                    <span>{selectedSubmission.document_type.replace('-', ' ')}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Status:</span>
                                    {getStatusBadge(selectedSubmission.status)}
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Submitted At:</span>
                                    <span>{formatDate(selectedSubmission.submitted_at)}</span>
                                </div>
                                {selectedSubmission.rejection_reason && (
                                    <div className="detail-row">
                                        <span className="detail-label">Rejection Reason:</span>
                                        <span>{selectedSubmission.rejection_reason}</span>
                                    </div>
                                )}
                            </div>

                            <div className="document-images">
                                <h3>Document Images</h3>
                                <div className="images-grid">
                                    <div className="image-container">
                                        <h4>Front Document</h4>
                                        <div
                                            className="image-wrapper clickable-image"
                                            onClick={() => openPreview(`${BACKEND_URL}/storage/${selectedSubmission.front_document_path}`)}
                                        >
                                            <img
                                                src={`${BACKEND_URL}/storage/${selectedSubmission.front_document_path}`}
                                                alt="Front Document"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.parentElement.innerHTML = '<div class="image-error"><FaFileImage /> Image not available</div>';
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {selectedSubmission.back_document_path && (
                                        <div className="image-container">
                                            <h4>Back Document</h4>
                                            <div
                                                className="image-wrapper clickable-image"
                                                onClick={() => openPreview(`${BACKEND_URL}/storage/${selectedSubmission.back_document_path}`)}
                                            >
                                                <img
                                                    src={`${BACKEND_URL}/storage/${selectedSubmission.back_document_path}`}
                                                    alt="Back Document"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.parentElement.innerHTML = '<div class="image-error"><FaFileImage /> Image not available</div>';
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="image-container">
                                        <h4>Selfie</h4>
                                        <div
                                            className="image-wrapper clickable-image"
                                            onClick={() => openPreview(`${BACKEND_URL}/storage/${selectedSubmission.selfie_path}`)}
                                        >
                                            <img
                                                src={`${BACKEND_URL}/storage/${selectedSubmission.selfie_path}`}
                                                alt="Selfie"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.parentElement.innerHTML = '<div class="image-error"><FaFileImage /> Image not available</div>';
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                onClick={() => setSelectedSubmission(null)}
                                className="close-btn"
                            >
                                Close
                            </button>
                            {selectedSubmission.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => handleApprove(selectedSubmission.id)}
                                        className="approve-btn"
                                        disabled={approvingId === selectedSubmission.id}
                                    >
                                        {approvingId === selectedSubmission.id ? (
                                            <FaSpinner className="spinner-icon" />
                                        ) : (
                                            'Approve'
                                        )}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedSubmission(null);
                                            setShowRejectModal(true);
                                        }}
                                        className="reject-btn"
                                        disabled={rejectingId === selectedSubmission.id}
                                    >
                                        {rejectingId === selectedSubmission.id ? (
                                            <FaSpinner className="spinner-icon" />
                                        ) : (
                                            'Reject'
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="modal-overlay">
                    <div className="reject-modal">
                        <div className="modal-header">
                            <h2>Reject KYC Submission</h2>
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className="close-modal"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="modal-content">
                            <p>Please provide a reason for rejecting this submission:</p>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Enter rejection reason..."
                                className="reject-reason-input"
                            />
                        </div>

                        <div className="modal-footer">
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className="cancel-btn"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={!rejectReason.trim() || rejectingId === selectedSubmission?.id}
                                className="confirm-reject-btn"
                            >
                                {rejectingId === selectedSubmission?.id ? (
                                    <FaSpinner className="spinner-icon" />
                                ) : (
                                    'Confirm Rejection'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Preview Modal */}
            {previewImage && (
                <div className="image-preview-overlay" onClick={closePreview}>
                    <div className="image-preview-modal" onClick={e => e.stopPropagation()}>
                        <button className="close-preview-btn" onClick={closePreview}>
                            <FaTimesCircle />
                        </button>
                        <img src={previewImage} alt="Document Preview" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminKYCVerification;