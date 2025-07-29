import React, { useState, useEffect } from 'react';
import './styles/TransactionHistory.css';
import api from '../../api/axios';

const Transaction = () => {
    const [activeTab, setActiveTab] = useState('receive');
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        status: 'all',
        coin: 'all',
        dateRange: 'all',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [selectedItem, setSelectedItem] = useState(null);
    const [totalItems, setTotalItems] = useState(0);
    const [processingId, setProcessingId] = useState(null);
    const [processingAction, setProcessingAction] = useState(null);

    // Fetch data based on active tab
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const endpoint = activeTab === 'receive'
                    ? '/api/receive-crypto'
                    : '/api/pending';

                const response = await api.get(endpoint, {
                    params: {
                        status: filters.status !== 'all' ? filters.status : undefined,
                        coin: filters.coin !== 'all' ? filters.coin : undefined,
                        per_page: itemsPerPage,
                        page: currentPage
                    }
                });

                const items = response.data?.data || response.data || [];
                const total = response.data?.total || items.length;

                setTransactions(items);
                setTotalItems(total);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.response?.data?.message || 'Failed to load transactions');
                setLoading(false);
                setTransactions([]);
                setTotalItems(0);
            }
        };

        fetchData();
    }, [activeTab, filters, currentPage, itemsPerPage]);

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
        setCurrentPage(1);
    };

    const handleStatusUpdate = async (itemId, action) => {
        try {
            setProcessingId(itemId);
            setProcessingAction(action);
            setError(null);

            // Correct endpoints based on backend routes
            const endpoint = activeTab === 'receive'
                ? `/api/admin/receive-crypto/${itemId}/${action}`
                : `/api/admin/send-crypto/${itemId}/${action}`;

            await api.post(endpoint);

            // Refresh the data instead of just updating status locally
            const refreshEndpoint = activeTab === 'receive'
                ? '/api/receive-crypto'
                : '/api/pending';

            const response = await api.get(refreshEndpoint, {
                params: {
                    status: filters.status !== 'all' ? filters.status : undefined,
                    coin: filters.coin !== 'all' ? filters.coin : undefined,
                    per_page: itemsPerPage,
                    page: currentPage
                }
            });

            const items = response.data?.data || response.data || [];
            setTransactions(items);

            // Also update selected item if it's the one being processed
            if (selectedItem?.id === itemId) {
                const updatedItem = items.find(item => item.id === itemId);
                if (updatedItem) {
                    setSelectedItem(updatedItem);
                }
            }

        } catch (err) {
            console.error('Error updating status:', err);
            setError(err.response?.data?.message || `Failed to ${action} transaction`);

            // Show more detailed error if available
            if (err.response?.data?.error) {
                setError(err.response.data.error);
            }
        } finally {
            setProcessingId(null);
            setProcessingAction(null);
        }
    };

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading {activeTab === 'receive' ? 'receive' : 'send'} transactions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-icon">!</div>
                <p>{error}</p>
                <button className="retry-btn" onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div className="transaction-history-container">
            <header className="history-header">
                <h1>Transaction History</h1>
                <p className="subtitle">View and manage all system transactions</p>
            </header>

            <div className="tab-switcher">
                <button
                    className={activeTab === 'receive' ? 'active' : ''}
                    onClick={() => setActiveTab('receive')}
                >
                    Receive Transactions
                </button>
                <button
                    className={activeTab === 'send' ? 'active' : ''}
                    onClick={() => setActiveTab('send')}
                >
                    Send Transactions
                </button>
            </div>

            <div className="filters-section">
                <div className="filter-group">
                    <label>Status:</label>
                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="declined">Declined</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Coin:</label>
                    <select
                        value={filters.coin}
                        onChange={(e) => handleFilterChange('coin', e.target.value)}
                    >
                        <option value="all">All Coins</option>
                        {Array.from(new Set(transactions.map(tx => tx.coin_name))).map(coin => (
                            <option key={coin} value={coin}>{coin}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Date Range:</label>
                    <select
                        value={filters.dateRange}
                        onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">Last 7 Days</option>
                        <option value="month">Last 30 Days</option>
                        <option value="year">Last Year</option>
                    </select>
                </div>
            </div>

            <div className="stats-summary">
                <div className="stat-card">
                    <h3>Total Transactions</h3>
                    <p>{totalItems}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Value (USD)</h3>
                    <p>${transactions.reduce((sum, tx) => sum + parseFloat(tx.amount_usd || 0), 0).toFixed(2)}</p>
                </div>
                <div className="stat-card">
                    <h3>Pending Actions</h3>
                    <p>{transactions.filter(tx => tx.status === 'pending').length}</p>
                </div>
            </div>

            <div className="transactions-table-container">
                <table className="transactions-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Coin</th>
                            <th>Amount</th>
                            <th>USD Value</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length > 0 ? (
                            transactions.map(item => (
                                <tr
                                    key={item.id}
                                    onClick={() => setSelectedItem(item)}
                                    className={selectedItem?.id === item.id ? 'selected' : ''}
                                >
                                    <td>{item.id}</td>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar">{item.user?.name?.charAt(0) || 'U'}</div>
                                            <div>
                                                <div className="user-name">{item.user?.name || 'Unknown'}</div>
                                                <div className="user-email">{item.user?.email || ''}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{item.coin_name}</td>
                                    <td>{parseFloat(item.amount_coin || 0).toFixed(8)}</td>
                                    <td>${parseFloat(item.amount_usd || 0).toFixed(2)}</td>
                                    <td>{new Date(item.created_at).toLocaleString()}</td>
                                    <td>
                                        <span className={`status-badge ${item.status}`}>
                                            {item.status === 'pending' ? 'Pending' :
                                                item.status === 'approved' ? 'Approved' : 'Declined'}
                                        </span>
                                    </td>
                                    <td>
                                        {item.status === 'pending' && (
                                            <div className="action-buttons">
                                                <button
                                                    className="approve-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleStatusUpdate(item.id, 'approve');
                                                    }}
                                                    disabled={processingId === item.id && processingAction === 'approve'}
                                                >
                                                    {processingId === item.id && processingAction === 'approve' ? (
                                                        <>
                                                            <span className="button-spinner"></span> Processing...
                                                        </>
                                                    ) : 'Approve'}
                                                </button>
                                                <button
                                                    className="decline-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleStatusUpdate(item.id, 'decline');
                                                    }}
                                                    disabled={processingId === item.id && processingAction === 'decline'}
                                                >
                                                    {processingId === item.id && processingAction === 'decline' ? (
                                                        <>
                                                            <span className="button-spinner"></span> Processing...
                                                        </>
                                                    ) : 'Decline'}
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className="no-results">
                                <td colSpan="8">
                                    No transactions found matching your filters
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalItems > 0 && (
                <div className="pagination-controls">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}

            {selectedItem && (
                <div className="transaction-detail-modal">
                    <div className="modal-content">
                        <button
                            className="close-modal"
                            onClick={() => setSelectedItem(null)}
                        >
                            &times;
                        </button>
                        <h2>Transaction Details</h2>

                        <div className="detail-grid">
                            <div className="detail-item">
                                <label>ID:</label>
                                <span>{selectedItem.id}</span>
                            </div>
                            <div className="detail-item">
                                <label>User:</label>
                                <span>{selectedItem.user?.name || 'Unknown'} ({selectedItem.user?.email || 'N/A'})</span>
                            </div>
                            <div className="detail-item">
                                <label>Type:</label>
                                <span className="type-badge">
                                    {activeTab === 'receive' ? 'Receive' : 'Send'}
                                </span>
                            </div>
                            <div className="detail-item">
                                <label>Coin:</label>
                                <span>{selectedItem.coin_name}</span>
                            </div>
                            <div className="detail-item">
                                <label>Amount:</label>
                                <span>
                                    {parseFloat(selectedItem.amount_coin || 0).toFixed(8)} {selectedItem.coin_name}
                                </span>
                            </div>
                            <div className="detail-item">
                                <label>USD Value:</label>
                                <span>${parseFloat(selectedItem.amount_usd || 0).toFixed(2)}</span>
                            </div>
                            {activeTab === 'send' && selectedItem.wallet_address && (
                                <div className="detail-item">
                                    <label>Wallet Address:</label>
                                    <span>{selectedItem.wallet_address}</span>
                                </div>
                            )}
                            <div className="detail-item">
                                <label>Status:</label>
                                <span className={`status-badge ${selectedItem.status}`}>
                                    {selectedItem.status === 'pending' ? 'Pending' :
                                        selectedItem.status === 'approved' ? 'Approved' : 'Declined'}
                                </span>
                            </div>
                            <div className="detail-item full-width">
                                <label>Date:</label>
                                <span>{new Date(selectedItem.created_at).toLocaleString()}</span>
                            </div>
                        </div>

                        {selectedItem.status === 'pending' && (
                            <div className="modal-actions">
                                <button
                                    className="approve-btn"
                                    onClick={() => handleStatusUpdate(selectedItem.id, 'approve')}
                                    disabled={processingId === selectedItem.id && processingAction === 'approve'}
                                >
                                    {processingId === selectedItem.id && processingAction === 'approve' ? (
                                        <>
                                            <span className="button-spinner"></span> Processing...
                                        </>
                                    ) : 'Approve Transaction'}
                                </button>
                                <button
                                    className="decline-btn"
                                    onClick={() => handleStatusUpdate(selectedItem.id, 'decline')}
                                    disabled={processingId === selectedItem.id && processingAction === 'decline'}
                                >
                                    {processingId === selectedItem.id && processingAction === 'decline' ? (
                                        <>
                                            <span className="button-spinner"></span> Processing...
                                        </>
                                    ) : 'Decline Transaction'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transaction;