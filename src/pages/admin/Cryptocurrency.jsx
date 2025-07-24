import React, { useState, useEffect } from 'react';
import './styles/CryptocurrencyAdmin.css';
import { useData } from '../../context/DataContext';

const AdminCryptocurrency = () => {
  // const [cryptocurrencies, setCryptocurrencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCrypto, setEditingCrypto] = useState(null);
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    price_usd: '',
    balance: '',
    change_percent: '',
    network: '',
    icon: ''
  });

  const { cryptocurrencies } = useData();

  useEffect(() => {
    if (
      cryptocurrencies &&
      Array.isArray(cryptocurrencies.cryptocurrencies) &&
      cryptocurrencies.cryptocurrencies.length > 0
    ) {
      setIsLoading(false);
    }
  }, [cryptocurrencies]);


  console.log(cryptocurrencies)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    resetForm();
    setIsModalOpen(false);
  };

  const handleEdit = (crypto) => {
    setEditingCrypto(crypto);
    setFormData({
      symbol: crypto.symbol,
      name: crypto.name,
      price_usd: crypto.price_usd,
      balance: crypto.balance,
      change_percent: crypto.change_percent,
      network: crypto.network,
      icon: crypto.icon
    });
    setIsModalOpen(true);
  };

  // const handleDelete = (id) => {
  //   if (window.confirm('Are you sure you want to delete this cryptocurrency?')) {
  //     console.log("coll")
  //   }
  // };

  const resetForm = () => {
    setFormData({
      symbol: '',
      name: '',
      price_usd: '',
      balance: '',
      change_percent: '',
      network: '',
      icon: ''
    });
    setEditingCrypto(null);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(price);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(num);
  };

  const formatChange = (change) => {
    if (change === null || isNaN(change)) return 'N/A';
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  return (
    <div className="admin-crypto-container">
      <header className="admin-crypto-header">
        <h1>Cryptocurrency Management</h1>
        <button
          className="admin-crypto-btn admin-crypto-btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          Add Cryptocurrency
        </button>
      </header>

      <main className="admin-crypto-content">
        {isLoading ? (
          <div className="admin-crypto-loading">Loading cryptocurrencies...</div>
        ) : (
          <div className="admin-crypto-table-container">
            <table className="admin-crypto-table">
              <thead>
                <tr>
                  <th className="admin-crypto-th name">Name</th>
                  <th className="admin-crypto-th price">Price (USD)</th>
                  <th className="admin-crypto-th value"></th>

                  <th className="admin-crypto-th actions">Actions</th>
                    <th className="admin-crypto-th change"></th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(cryptocurrencies.cryptocurrencies) && cryptocurrencies.cryptocurrencies.length > 0 ? (
                  cryptocurrencies.cryptocurrencies.map(crypto => (
                    <tr key={crypto.id} className="admin-crypto-tr">
                      <td className="admin-crypto-td name">
                        <div className="admin-crypto-name-cell">
                          <img
                            src={crypto.icon || 'https://via.placeholder.com/24'}
                            alt={crypto.name}
                            className="admin-crypto-icon"
                          />
                          <span>
                            {crypto.name} ({crypto.symbol})
                          </span>
                        </div>
                      </td>
                      <td className="admin-crypto-td price">{formatPrice(crypto.price_usd)}</td>
                      {/* <td className="admin-crypto-td value">{formatPrice(crypto.total_value_usd)}</td> */}
                      <td className={`admin-crypto-td change ${crypto.change_percent >= 0 ? 'positive' : 'negative'}`}>
                        {/* {formatChange(crypto.change_percent)} */}
                      </td>
                      <td className="admin-crypto-td actions">
                        <div className="admin-crypto-actions">
                          <button
                            className="admin-crypto-btn admin-crypto-btn-edit"
                            onClick={() => handleEdit(crypto)}
                          >
                            Edit
                          </button>
                          {/* <button
                            className="admin-crypto-btn admin-crypto-btn-delete"
                            onClick={() => handleDelete(crypto.id)}
                          >
                            Delete
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="admin-crypto-no-data">
                      No cryptocurrencies found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="admin-crypto-modal-overlay">
          <div className="admin-crypto-modal">
            <div className="admin-crypto-modal-header">
              <h2>{editingCrypto ? 'Edit Cryptocurrency' : 'Add New Cryptocurrency'}</h2>
              <button
                className="admin-crypto-modal-close"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="admin-crypto-form">
              <div className="admin-crypto-form-group">
                <label htmlFor="symbol">Symbol</label>
                <input
                  type="text"
                  id="symbol"
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="admin-crypto-form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="admin-crypto-form-group">
                <label htmlFor="price_usd">Price (USD)</label>
                <input
                  type="number"
                  id="price_usd"
                  name="price_usd"
                  step="0.00000001"
                  value={formData.price_usd}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="admin-crypto-form-group">
                <label htmlFor="balance">Balance</label>
                <input
                  type="number"
                  id="balance"
                  name="balance"
                  step="0.00000001"
                  value={formData.balance}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="admin-crypto-form-group">
                <label htmlFor="change_percent">24h Change (%)</label>
                <input
                  type="number"
                  id="change_percent"
                  name="change_percent"
                  step="0.01"
                  value={formData.change_percent}
                  onChange={handleInputChange}
                />
              </div>
              <div className="admin-crypto-form-group">
                <label htmlFor="network">Network</label>
                <input
                  type="text"
                  id="network"
                  name="network"
                  value={formData.network}
                  onChange={handleInputChange}
                />
              </div>
              <div className="admin-crypto-form-group">
                <label htmlFor="icon">Icon URL</label>
                <input
                  type="text"
                  id="icon"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  placeholder="https://example.com/icon.png"
                />
              </div>
              <div className="admin-crypto-form-actions">
                <button
                  type="button"
                  className="admin-crypto-btn admin-crypto-btn-secondary"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-crypto-btn admin-crypto-btn-primary">
                  {editingCrypto ? 'Update' : 'Add'} Cryptocurrency
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCryptocurrency;