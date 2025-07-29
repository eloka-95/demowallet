import React, { useState, useEffect } from 'react';
import './admin/styles/TransactionHistory.css'
import api from '../api/axios';


const UserTransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        type: 'all',
        status: 'all',
        coin: 'all',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [selectedItem, setSelectedItem] = useState(null);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await api.get('/api/transactions/my/transaction', {
                    params: {
                        status: filters.status !== 'all' ? filters.status : undefined,
                        type: filters.type !== 'all' ? filters.type : undefined,
                        per_page: itemsPerPage,
                        page: currentPage
                    }
                });

                // Handle different possible response structures
                const data = response.data.data?.data || response.data.data || [];
                const total = response.data.data?.total || response.data.meta?.total || data.length;

                console.log("Processed Transactions:", data); // Debug log

                setTransactions(data);
                setTotalItems(total);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching transactions:', err);
                setError(err.response?.data?.message || 'Failed to load transactions');
                setLoading(false);
                setTransactions([]);
            }
        };

        fetchTransactions();
    }, [filters, currentPage, itemsPerPage]);

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
        setCurrentPage(1);
    };

    const mapStatusToLabel = (status) => {
        switch (status) {
            case 'pending': return 'Network Validation';
            case 'approved': return 'Completed';
            case 'declined': return 'Error';
            default: return status;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'pending': return 'pending';
            case 'approved': return 'approved';
            case 'declined': return 'declined';
            default: return '';
        }
    };

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading your transaction history...</p>
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
                <h1>Your Transaction History</h1>
                <p className="subtitle">View all your cryptocurrency transactions</p>
            </header>

            <div className="filters-section">
                <div className="filter-group">
                    <label>Transaction Type:</label>
                    <select
                        value={filters.type}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                    >
                        <option value="all">All Types</option>
                        <option value="send">Sent</option>
                        <option value="receive">Received</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Status:</label>
                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Network Validation</option>
                        <option value="approved">Completed</option>
                        <option value="declined">Error</option>
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
            </div>

            <div className="transactions-table-container">
                <table className="transactions-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Type</th>
                            <th>Coin</th>
                            <th>Amount</th>
                            <th>USD Value</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions && transactions.length > 0 ? (
                            transactions.map(item => (
                                <tr
                                    key={item.id}
                                    onClick={() => setSelectedItem(item)}
                                    className={selectedItem?.id === item.id ? 'selected' : ''}
                                >
                                    <td>{item.id}</td>
                                    <td>
                                        <span className={`type-badge ${item.type}`}>
                                            {item.type === 'send' ? 'Sent' : 'Received'}
                                        </span>
                                    </td>
                                    <td>{item.coin_name}</td>
                                    <td>{parseFloat(item.amount_coin || 0).toFixed(8)}</td>
                                    <td>${parseFloat(item.amount_usd || 0).toFixed(2)}</td>
                                    <td>{new Date(item.created_at).toLocaleString()}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(item.status)}`}>
                                            {mapStatusToLabel(item.status)}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className="no-results">
                                <td colSpan="7">No transactions found matching your filters</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalItems > itemsPerPage && (
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
                                <label>Type:</label>
                                <span className={`type-badge ${selectedItem.type}`}>
                                    {selectedItem.type === 'send' ? 'Sent' : 'Received'}
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
                            <div className="detail-item">
                                <label>Status:</label>
                                <span className={`status-badge ${getStatusClass(selectedItem.status)}`}>
                                    {mapStatusToLabel(selectedItem.status)}
                                </span>
                            </div>
                            <div className="detail-item full-width">
                                <label>Description:</label>
                                <span>{selectedItem.description || 'No description available'}</span>
                            </div>
                            <div className="detail-item">
                                <label>Date:</label>
                                <span>{new Date(selectedItem.created_at).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserTransactionHistory;