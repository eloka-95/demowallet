import React, { useState, useEffect } from 'react';
import './styles/TransactionHistory.css';

const AdminHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    coin: 'all',
    dateRange: 'all',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Mock data fetch - replace with actual API call
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data based on your Transaction model
        const mockData = [
          {
            id: 1,
            user_id: 101,
            source_type: 'App\\Models\\SendCrypto',
            source_id: 5,
            coin_name: 'Bitcoin',
            amount_coin: 0.05,
            amount_usd: 1500.00,
            type: 'send',
            status: 'approved',
            description: 'Sent to wallet bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
            created_at: '2023-07-15T10:30:00Z',
            updated_at: '2023-07-15T10:30:00Z',
            user: {
              id: 101,
              name: 'John Doe',
              email: 'john@example.com'
            }
          },
          {
            id: 2,
            user_id: 102,
            source_type: 'App\\Models\\ReceiveCrypto',
            source_id: 8,
            coin_name: 'Ethereum',
            amount_coin: 2.5,
            amount_usd: 4500.00,
            type: 'receive',
            status: 'pending',
            description: 'Received from 0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
            created_at: '2023-07-14T14:45:00Z',
            updated_at: '2023-07-14T14:45:00Z',
            user: {
              id: 102,
              name: 'Alice Smith',
              email: 'alice@example.com'
            }
          },
          {
            id: 3,
            user_id: 103,
            source_type: 'App\\Models\\SendCrypto',
            source_id: 12,
            coin_name: 'Solana',
            amount_coin: 15.0,
            amount_usd: 300.00,
            type: 'send',
            status: 'declined',
            description: 'Sent to wallet 9g1Z9Jj1zKJy1gJLk1g1J1g1J1g1J1g1J1g1J1g1J',
            created_at: '2023-07-12T09:15:00Z',
            updated_at: '2023-07-12T09:30:00Z',
            user: {
              id: 103,
              name: 'Bob Johnson',
              email: 'bob@example.com'
            }
          },
          // Add more mock transactions as needed
        ];

        setTransactions(mockData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load transaction history');
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const filteredTransactions = transactions.filter(tx => {
    return (
      (filters.type === 'all' || tx.type === filters.type) &&
      (filters.status === 'all' || tx.status === filters.status) &&
      (filters.coin === 'all' || tx.coin_name === filters.coin) &&
      (filters.dateRange === 'all' ||
        (new Date(tx.created_at) >= getDateRangeStart(filters.dateRange))
      )
    );
  });

  function getDateRangeStart(range) {
    const now = new Date();
    switch (range) {
      case 'today': return new Date(now.setHours(0, 0, 0, 0));
      case 'week': return new Date(now.setDate(now.getDate() - 7));
      case 'month': return new Date(now.setMonth(now.getMonth() - 1));
      case 'year': return new Date(now.setFullYear(now.getFullYear() - 1));
      default: return new Date(0);
    }
  }

  // Get current transactions for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const handleStatusUpdate = (txId, newStatus) => {
    // In a real app, this would call your backend API
    setTransactions(prev => prev.map(tx =>
      tx.id === txId ? { ...tx, status: newStatus } : tx
    ));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading transaction history...</p>
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
          <p>{filteredTransactions.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Value (USD)</h3>
          <p>${filteredTransactions.reduce((sum, tx) => sum + parseFloat(tx.amount_usd), 0).toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Actions</h3>
          <p>{filteredTransactions.filter(tx => tx.status === 'pending').length}</p>
        </div>
      </div>

      <div className="transactions-table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Type</th>
              <th>Coin</th>
              <th>Amount</th>
              <th>USD Value</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.length > 0 ? (
              currentTransactions.map(tx => (
                <tr
                  key={tx.id}
                  onClick={() => setSelectedTransaction(tx)}
                  className={selectedTransaction?.id === tx.id ? 'selected' : ''}
                >
                  <td>{tx.id}</td>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">{tx.user.name.charAt(0)}</div>
                      <div>
                        <div className="user-name">{tx.user.name}</div>
                        <div className="user-email">{tx.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`type-badge ${tx.type}`}>
                      {tx.type === 'send' ? 'Sent' : 'Received'}
                    </span>
                  </td>
                  <td>{tx.coin_name}</td>
                  <td>{parseFloat(tx.amount_coin).toFixed(8)}</td>
                  <td>${parseFloat(tx.amount_usd).toFixed(2)}</td>
                  <td>{new Date(tx.created_at).toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${tx.status}`}>
                      {tx.status === 'pending' ? 'Pending' :
                        tx.status === 'approved' ? 'Approved' : 'Declined'}
                    </span>
                  </td>
                  <td>
                    {tx.status === 'pending' && (
                      <div className="action-buttons">
                        <button
                          className="approve-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(tx.id, 'approved');
                          }}
                        >
                          Approve
                        </button>
                        <button
                          className="decline-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(tx.id, 'declined');
                          }}
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="no-results">
                <td colSpan="9">No transactions found matching your filters</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredTransactions.length > 0 && (
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

      {selectedTransaction && (
        <div className="transaction-detail-modal">
          <div className="modal-content">
            <button
              className="close-modal"
              onClick={() => setSelectedTransaction(null)}
            >
              &times;
            </button>
            <h2>Transaction Details</h2>

            <div className="detail-grid">
              <div className="detail-item">
                <label>Transaction ID:</label>
                <span>{selectedTransaction.id}</span>
              </div>
              <div className="detail-item">
                <label>User:</label>
                <span>{selectedTransaction.user.name} ({selectedTransaction.user.email})</span>
              </div>
              <div className="detail-item">
                <label>Type:</label>
                <span className={`type-badge ${selectedTransaction.type}`}>
                  {selectedTransaction.type === 'send' ? 'Sent' : 'Received'}
                </span>
              </div>
              <div className="detail-item">
                <label>Coin:</label>
                <span>{selectedTransaction.coin_name}</span>
              </div>
              <div className="detail-item">
                <label>Amount:</label>
                <span>
                  {parseFloat(selectedTransaction.amount_coin).toFixed(8)} {selectedTransaction.coin_name}
                </span>
              </div>
              <div className="detail-item">
                <label>USD Value:</label>
                <span>${parseFloat(selectedTransaction.amount_usd).toFixed(2)}</span>
              </div>
              <div className="detail-item">
                <label>Date:</label>
                <span>{new Date(selectedTransaction.created_at).toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <label>Status:</label>
                <span className={`status-badge ${selectedTransaction.status}`}>
                  {selectedTransaction.status === 'pending' ? 'Pending' :
                    selectedTransaction.status === 'approved' ? 'Approved' : 'Declined'}
                </span>
              </div>
              <div className="detail-item full-width">
                <label>Description:</label>
                <span>{selectedTransaction.description}</span>
              </div>
            </div>

            {selectedTransaction.status === 'pending' && (
              <div className="modal-actions">
                <button
                  className="approve-btn"
                  onClick={() => {
                    handleStatusUpdate(selectedTransaction.id, 'approved');
                    setSelectedTransaction(null);
                  }}
                >
                  Approve Transaction
                </button>
                <button
                  className="decline-btn"
                  onClick={() => {
                    handleStatusUpdate(selectedTransaction.id, 'declined');
                    setSelectedTransaction(null);
                  }}
                >
                  Decline Transaction
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHistory;