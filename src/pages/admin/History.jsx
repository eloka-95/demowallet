import React, { useState, useEffect } from 'react';
import './styles/TransactionHistory.css';
import api from '../../api/axios';

const AdminHistory = () => {
  const [activeTab, setActiveTab] = useState('transactions');
  const [transactions, setTransactions] = useState([]);
  const [bonuses, setBonuses] = useState([]);
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
  const [selectedItem, setSelectedItem] = useState(null);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (activeTab === 'transactions') {
          const response = await api.get('/api/bonus-debit-history/getTrans', {
            params: {
              status: filters.status !== 'all' ? filters.status : undefined,
              type: filters.type !== 'all' ? filters.type : undefined,
              coin: filters.coin !== 'all' ? filters.coin : undefined,
              per_page: itemsPerPage,
              page: currentPage
            }
          });

          const items = response.data?.data?.data || [];
          const total = response.data?.data?.total || 0;

          setTransactions(items);
          setTotalItems(total);
        } else {
          const response = await api.get('/api/bonus-debit-history/getFund', {
            params: {
              type: filters.type !== 'all' ? filters.type : undefined,
              per_page: itemsPerPage,
              page: currentPage
            }
          });

          const items = response.data?.data?.data || [];
          const total = response.data?.data?.total || 0;

          setBonuses(items);
          setTotalItems(total);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to load data');
        setLoading(false);
        if (activeTab === 'transactions') {
          setTransactions([]);
          setTotalItems(0);
        } else {
          setBonuses([]);
          setTotalItems(0);
        }
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

  const currentItems = activeTab === 'transactions'
    ? transactions
    : bonuses;

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading {activeTab === 'transactions' ? 'transaction' : 'bonus'} history...</p>
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
        <h1>{activeTab === 'transactions' ? 'Transaction' : 'Bonus/Debit'} History</h1>
        <p className="subtitle">View all system {activeTab === 'transactions' ? 'transactions' : 'bonuses/debits'}</p>
      </header>

      <div className="tab-switcher">
        <button
          className={activeTab === 'transactions' ? 'active' : ''}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
        <button
          className={activeTab === 'bonuses' ? 'active' : ''}
          onClick={() => setActiveTab('bonuses')}
        >
          Bonuses/Debits
        </button>
      </div>

      <div className="filters-section">
        {activeTab === 'transactions' ? (
          <>
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
          </>
        ) : (
          <div className="filter-group">
            <label>Type:</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="bonus">Bonus</option>
              <option value="debit">Debit</option>
            </select>
          </div>
        )}

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
          <h3>Total {activeTab === 'transactions' ? 'Transactions' : 'Items'}</h3>
          <p>{totalItems}</p>
        </div>
        {activeTab === 'transactions' ? (
          <div className="stat-card">
            <h3>Total Value (USD)</h3>
            <p>${transactions.reduce((sum, tx) => sum + parseFloat(tx.amount_usd || 0), 0).toFixed(2)}</p>
          </div>
        ) : (
          <div className="stat-card">
            <h3>Total Bonus Value</h3>
            <p>${bonuses.filter(b => b.type === 'bonus').reduce((sum, b) => sum + parseFloat(b.amount || 0), 0).toFixed(2)}</p>
          </div>
        )}
        {activeTab === 'transactions' && (
          <div className="stat-card">
            <h3>Pending Actions</h3>
            <p>{transactions.filter(tx => tx.status === 'pending').length}</p>
          </div>
        )}
      </div>

      <div className="transactions-table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>ID</th>
              {activeTab === 'transactions' ? (
                <>
                  <th>User</th>
                  <th>Type</th>
                  <th>Coin</th>
                  <th>Amount</th>
                  <th>USD Value</th>
                  <th>Date</th>
                  <th>Status</th>
                </>
              ) : (
                <>
                  <th>User</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Message</th>
                  <th>Date</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map(item => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={selectedItem?.id === item.id ? 'selected' : ''}
                >
                  <td>{item.id}</td>
                  {activeTab === 'transactions' ? (
                    <>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">{item.user?.name?.charAt(0) || 'U'}</div>
                          <div>
                            <div className="user-name">{item.user?.name || 'Unknown'}</div>
                            <div className="user-email">{item.user?.email || ''}</div>
                          </div>
                        </div>
                      </td>
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
                        <span className={`status-badge ${item.status}`}>
                          {item.status === 'pending' ? 'Pending' :
                            item.status === 'approved' ? 'Approved' : 'Declined'}
                        </span>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">{item.user?.name?.charAt(0) || 'U'}</div>
                          <div>
                            <div className="user-name">{item.user?.name || 'Unknown'}</div>
                            <div className="user-email">{item.user?.email || ''}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`type-badge ${item.type}`}>
                          {item.type === 'bonus' ? 'Bonus' : 'Debit'}
                        </span>
                      </td>
                      <td className={item.type === 'bonus' ? 'text-success' : 'text-danger'}>
                        {item.type === 'bonus' ? '+' : '-'}${parseFloat(item.amount || 0).toFixed(2)}
                      </td>
                      <td>{item.message}</td>
                      <td>{new Date(item.created_at).toLocaleString()}</td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr className="no-results">
                <td colSpan={activeTab === 'transactions' ? 8 : 6}>
                  No {activeTab === 'transactions' ? 'transactions' : 'items'} found matching your filters
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
            <h2>{activeTab === 'transactions' ? 'Transaction' : 'Bonus/Debit'} Details</h2>

            <div className="detail-grid">
              <div className="detail-item">
                <label>ID:</label>
                <span>{selectedItem.id}</span>
              </div>
              <div className="detail-item">
                <label>User:</label>
                <span>{selectedItem.user?.name || 'Unknown'} ({selectedItem.user?.email || 'N/A'})</span>
              </div>

              {activeTab === 'transactions' ? (
                <>
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
                    <span className={`status-badge ${selectedItem.status}`}>
                      {selectedItem.status === 'pending' ? 'Pending' :
                        selectedItem.status === 'approved' ? 'Approved' : 'Declined'}
                    </span>
                  </div>
                  <div className="detail-item full-width">
                    <label>Description:</label>
                    <span>{selectedItem.description}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="detail-item">
                    <label>Type:</label>
                    <span className={`type-badge ${selectedItem.type}`}>
                      {selectedItem.type === 'bonus' ? 'Bonus' : 'Debit'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Amount:</label>
                    <span className={selectedItem.type === 'bonus' ? 'text-success' : 'text-danger'}>
                      {selectedItem.type === 'bonus' ? '+' : '-'}${parseFloat(selectedItem.amount || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="detail-item full-width">
                    <label>Message:</label>
                    <span>{selectedItem.message}</span>
                  </div>
                </>
              )}

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

export default AdminHistory;