import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/user.css';
import { useData } from '../../context/DataContext';
import api from '../../api/axios';

const AdminUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [errorMessage, setErrorMessage] = useState(null);
    const { fetchAllUsers, allUsers } = useData();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setErrorMessage(null);
                await fetchAllUsers();
            } catch (error) {
                console.error('Error fetching users:', error);
                setErrorMessage('Failed to load users. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [fetchAllUsers]);

    useEffect(() => {
        if (allUsers && allUsers.data) {
            try {
                const transformedUsers = allUsers.data.map(user => ({
                    id: user.id,
                    name: `${user.name || ''}`.trim() || 'No Name',
                    username: user.username || '',
                    email: user.email || 'N/A',
                    email_verified_at: user.email_verified_at || null,
                    phone: user.phone || 'N/A',
                    country: user.country || 'N/A',
                    status: user.status || 'active',
                    account_verified: user.account_verified || false,
                    profile_img: user.profile_img || '',
                    eth: parseFloat(user.eth) || 0,
                    usd_total: (parseFloat(user.eth_usd) || 0),
                    user_blocked: user.user_blocked || false, // ✅ Add this if missing!

                }));

                setUsers(transformedUsers);
            } catch (error) {
                console.error('Error transforming user data:', error);
                setErrorMessage('Error processing user data.');
            }
        }
    }, [allUsers]);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone && user.phone.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRowClick = (userId) => {
        navigate(`/wallet/admin/user/${userId}`);
    };

    const handleDeleteUser = async (userId, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                setUsers(users.filter(user => user.id !== userId));
            } catch (error) {
                console.error('Error deleting user:', error);
                setErrorMessage('Failed to delete user. Please try again.');
            }
        }
    };

    const handleSuspendUser = async (userId, e) => {
        e.stopPropagation();

        const user = users.find(u => u.id === userId);
        const previousStatus = user.user_blocked;
        const newStatus = !previousStatus;
        const actionText = newStatus ? 'suspend' : 'unsuspend';

        if (window.confirm(`Are you sure you want to ${actionText} this user?`)) {
            // Optimistically update UI
            setUsers(users.map(u =>
                u.id === userId ? { ...u, user_blocked: newStatus } : u
            ));

            try {
                await api.post(`/api/admin/users/${userId}/toggle-block`);

                // ✅ Refetch full users to ensure latest data
                await fetchAllUsers();

            } catch (error) {
                console.error('Error toggling block status:', error);
                setErrorMessage(`Failed to ${actionText} user.`);

                // Rollback on error
                setUsers(users.map(u =>
                    u.id === userId ? { ...u, user_blocked: previousStatus } : u
                ));
            }
        }
    };



    const getStatusClass = (status) => {
        switch (status) {
            case 'active': return 'status-active';
            case 'inactive': return 'status-inactive';
            case 'pending': return 'status-pending';
            case 'suspended': return 'status-suspended';
            default: return '';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString || dateString === 'N/A') return 'N/A';
        try {
            const date = new Date(dateString);
            return isNaN(date.getTime())
                ? 'Invalid Date'
                : date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid Date';
        }
    };

    const formatBoolean = (value) => {
        return value ? '✅' : '❌';
    };

    const formatCurrency = (value) => {
        if (value === undefined || value === null) return 'N/A';
        try {
            const num = typeof value === 'string' ? parseFloat(value) : value;
            return isNaN(num)
                ? 'N/A'
                : num.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
        } catch (error) {
            console.error('Error formatting currency:', error);
            return 'N/A';
        }
    };

    return (
        <div className="admin-users-container">
            <div className="admin-users-header">
                <h1 className="admin-users-title">Users Management</h1>
                <div className="search-container">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            {errorMessage && (
                <div className="error-message">
                    {errorMessage}
                    <button onClick={() => setErrorMessage(null)} className="dismiss-error">
                        ×
                    </button>
                </div>
            )}

            {isMobile ? (
                <div className="mobile-users-list">
                    {loading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="mobile-user-card-skeleton">
                                <div className="skeleton-avatar"></div>
                                <div className="skeleton-text"></div>
                            </div>
                        ))
                    ) : filteredUsers.length === 0 ? (
                        <div className="no-results">No users found</div>
                    ) : (
                        filteredUsers
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((user) => (
                                <div
                                    key={user.id}
                                    className="mobile-user-card"
                                    onClick={() => handleRowClick(user.id)}
                                >
                                    <div className="mobile-user-header">
                                        {user.profile_img ? (
                                            <img src={user.profile_img} alt={user.name} className="user-avatar" />
                                        ) : (
                                            <div className="user-avatar-default">👤</div>
                                        )}
                                        <div className="mobile-user-info">
                                            <div className="user-name">
                                                {user.name}
                                                {user.account_verified && (
                                                    <span className="verified-badge">Verified</span>
                                                )}
                                            </div>
                                            <div className="user-username">@{user.username}</div>
                                            <div className={`status-label ${getStatusClass(user.status)}`}>
                                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                            </div>
                                        </div>
                                        <span className="forward-icon">→</span>
                                    </div>
                                    <div className="mobile-user-details">
                                        <div className="detail-item">
                                            <span className="detail-label">Verification</span>
                                            <span className="detail-value">
                                                Email: {formatBoolean(user.email_verified_at)}<br />
                                                Account: {formatBoolean(user.account_verified)}
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">ETH</span>
                                            <span className="detail-value balance-value">{formatCurrency(user.eth)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Total Balance</span>
                                            <span className="detail-value total-value">${formatCurrency(user.usd_total)}</span>
                                        </div>
                                        <div className="detail-item actions-group">
                                            <button
                                                className={`action-button suspend-button ${user.user_blocked ? 'unsuspend' : 'suspend'}`}
                                                onClick={(e) => handleSuspendUser(user.id, e)}
                                            >
                                                {user.user_blocked ? 'Unsuspend' : 'Suspend'}
                                            </button>

                                            <button
                                                className="action-button delete-button"
                                                onClick={(e) => handleDeleteUser(user.id, e)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                    )}
                    <div className="pagination-controls">
                        <select
                            value={rowsPerPage}
                            onChange={handleChangeRowsPerPage}
                            className="rows-per-page-select"
                        >
                            <option value={5}>5 rows</option>
                            <option value={10}>10 rows</option>
                            <option value={25}>25 rows</option>
                        </select>
                        <div className="page-buttons">
                            <button
                                onClick={() => handleChangePage(page - 1)}
                                disabled={page === 0}
                            >
                                Previous
                            </button>
                            <span>Page {page + 1} of {Math.ceil(filteredUsers.length / rowsPerPage)}</span>
                            <button
                                onClick={() => handleChangePage(page + 1)}
                                disabled={page >= Math.ceil(filteredUsers.length / rowsPerPage) - 1}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="desktop-users-table">
                    <div className="table-scroll-container">
                        <table className="users-table">
                            <thead>
                                <tr className="table-header-row">
                                    <th className="user-info-header">User Info</th>
                                    <th className="status-header">Status</th>
                                    <th className="verification-header">Verification</th>
                                    <th className="balance-header">ETH</th>
                                    <th className="total-header">Total Balance</th>
                                    <th className="actions-header">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <tr key={index} className="loading-row">
                                            <td colSpan="6">
                                                <div className="loading-skeleton"></div>
                                            </td>
                                        </tr>
                                    ))
                                ) : filteredUsers.length === 0 ? (
                                    <tr className="no-results-row">
                                        <td colSpan="6" className="no-results">No users found</td>
                                    </tr>
                                ) : (
                                    filteredUsers
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((user) => (
                                            <tr
                                                key={user.id}
                                                className="user-row"
                                                onClick={() => handleRowClick(user.id)}
                                            >
                                                <td className="user-info-cell">
                                                    <div className="user-cell">
                                                        {user.profile_img ? (
                                                            <img src={user.profile_img} alt={user.name} className="user-avatar" />
                                                        ) : (
                                                            <div className="user-avatar-default">👤</div>
                                                        )}
                                                        <div className="user-info">
                                                            <div className="user-name">
                                                                {user.name}
                                                                {user.account_verified && (
                                                                    <span className="verified-badge">Verified</span>
                                                                )}
                                                            </div>
                                                            <div className="user-email">{user.email}</div>
                                                            <div className="user-username">@{user.username}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className={`status-cell ${getStatusClass(user.status || 'active')}`}>
                                                    {(user.status || 'active').charAt(0).toUpperCase() + (user.status || 'active').slice(1)}
                                                </td>
                                                <td className="verification-cell">
                                                    <div>Email: {formatBoolean(user.email_verified_at)}</div>
                                                    <div>Account: {formatBoolean(user.account_verified)}</div>
                                                </td>
                                                <td className="balance-cell">{formatCurrency(user.eth)}</td>
                                                <td className="total-cell">${formatCurrency(user.usd_total)}</td>
                                                <td className="actions-cell">
                                                    <div className="action-buttons">
                                                        <button
                                                            className="action-button suspend-button"
                                                            onClick={(e) => handleSuspendUser(user.id, e)}
                                                        >
                                                            {user.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
                                                        </button>
                                                        <button
                                                            className="action-button delete-button"
                                                            onClick={(e) => handleDeleteUser(user.id, e)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="pagination-controls">
                        <select
                            value={rowsPerPage}
                            onChange={handleChangeRowsPerPage}
                            className="rows-per-page-select"
                        >
                            <option value={5}>5 rows</option>
                            <option value={10}>10 rows</option>
                            <option value={25}>25 rows</option>
                        </select>
                        <div className="page-buttons">
                            <button
                                onClick={() => handleChangePage(page - 1)}
                                disabled={page === 0}
                            >
                                Previous
                            </button>
                            <span>Page {page + 1} of {Math.ceil(filteredUsers.length / rowsPerPage)}</span>
                            <button
                                onClick={() => handleChangePage(page + 1)}
                                disabled={page >= Math.ceil(filteredUsers.length / rowsPerPage) - 1}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;