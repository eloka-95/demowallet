import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import './styles/AdminWallet.css';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AdminWallets = () => {
  const [wallets, setWallets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState(null);
  const [formData, setFormData] = useState({
    wallet_name: '',
    wallet_address: '',
    bar_code: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  // Fetch wallets from API
  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const response = await api.get('/api/wallets'); // Added 'api/' prefix
        console.log("wallet data", response)
        setWallets(response.data.wallets);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching wallets:', error);
        setIsLoading(false);
      }
    };

    fetchWallets();
  }, []);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      bar_code: file
    });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('wallet_name', formData.wallet_name);
      formDataToSend.append('wallet_address', formData.wallet_address);
      if (formData.bar_code) {
        formDataToSend.append('bar_code', formData.bar_code);
      }

      if (editingWallet) {
        // Update existing wallet
        const response = await api.post(`/api/admin/wallets/${editingWallet.id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        setWallets(wallets.map(wallet =>
          wallet.id === editingWallet.id ? response.data.wallet : wallet
        ));
      } else {
        // Add new wallet
        const response = await api.post('/api/admin/wallets', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        setWallets([...wallets, response.data.wallet]);
      }

      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving wallet:', error);
      alert(error.response?.data?.message || 'Error saving wallet. Please try again.');
    }
  };

  const handleEdit = (wallet) => {
    setEditingWallet(wallet);
    setFormData({
      wallet_name: wallet.wallet_name,
      wallet_address: wallet.wallet_address,
      bar_code: null
    });
    setImagePreview(wallet.bar_code ?
      `${BACKEND_URL}/storage/${wallet.bar_code}` :
      null
    );
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this wallet?')) {
      try {
        await api.delete(`/api/admin/wallets/${id}`);
        setWallets(wallets.filter(wallet => wallet.id !== id));
      } catch (error) {
        console.error('Error deleting wallet:', error);
        alert(error.response?.data?.message || 'Error deleting wallet. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      wallet_name: '',
      wallet_address: '',
      bar_code: null
    });
    setImagePreview(null);
    setEditingWallet(null);
  };

  const formatWalletAddress = (address) => {
    if (address.length > 16) {
      return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
    }
    return address;
  };

  const getWalletInfo = (walletName) => {
    if (!walletName) return { symbol: '', network: '' };
    const parts = walletName.split('_');
    return {
      symbol: parts[0].toUpperCase(),
      network: parts[1] || 'N/A'
    };
  };

  return (
    <div className="admin-wallet-container">
      <header className="admin-wallet-header">
        <h1>Wallet Management</h1>
        <button
          className="admin-wallet-btn admin-wallet-btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          Add Wallet
        </button>
      </header>

      <main className="admin-wallet-content">
        {isLoading ? (
          <div className="admin-wallet-loading">Loading wallets...</div>
        ) : (
          <div className="admin-wallet-table-container">
            <table className="admin-wallet-table">
              <thead>
                <tr>
                  <th className="admin-wallet-th crypto">Crypto</th>
                  <th className="admin-wallet-th network">Network</th>
                  <th className="admin-wallet-th address">Wallet Address</th>
                  <th className="admin-wallet-th barcode">Barcode</th>
                  <th className="admin-wallet-th actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {wallets.length > 0 ? (
                  wallets.map(wallet => {
                    const { symbol, network } = getWalletInfo(wallet.wallet_name);
                    return (
                      <tr key={wallet.id} className="admin-wallet-tr">
                        <td className="admin-wallet-td crypto">
                          <span className="admin-wallet-crypto-symbol">{symbol}</span>
                        </td>
                        <td className="admin-wallet-td network">{network}</td>
                        <td className="admin-wallet-td address">
                          <span className="admin-wallet-address" title={wallet.wallet_address}>
                            {formatWalletAddress(wallet.wallet_address)}
                          </span>
                        </td>
                        <td className="admin-wallet-td barcode">
                          {wallet.bar_code ? (
                            <img
                              src={`${BACKEND_URL}/storage/${wallet.bar_code}`}
                              alt="Wallet barcode"
                              className="admin-wallet-barcode"
                            />

                          ) : 'N/A'}
                        </td>
                        <td className="admin-wallet-td actions">
                          <div className="admin-wallet-actions">
                            <button
                              className="admin-wallet-btn admin-wallet-btn-edit"
                              onClick={() => handleEdit(wallet)}
                            >
                              Edit
                            </button>
                            <button
                              className="admin-wallet-btn admin-wallet-btn-delete"
                              onClick={() => handleDelete(wallet.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="admin-wallet-no-data">
                      No wallets found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="admin-wallet-modal-overlay">
          <div className="admin-wallet-modal">
            <div className="admin-wallet-modal-header">
              <h2>{editingWallet ? 'Edit Wallet' : 'Add New Wallet'}</h2>
              <button
                className="admin-wallet-modal-close"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="admin-wallet-form">
              <div className="admin-wallet-form-group">
                <label htmlFor="wallet_name">Wallet Name (Format: SYMBOL_NETWORK)</label>
                <input
                  type="text"
                  id="wallet_name"
                  name="wallet_name"
                  value={formData.wallet_name}
                  onChange={handleInputChange}
                  placeholder="BTC_MAINNET"
                  required
                />
              </div>
              <div className="admin-wallet-form-group">
                <label htmlFor="wallet_address">Wallet Address</label>
                <input
                  type="text"
                  id="wallet_address"
                  name="wallet_address"
                  value={formData.wallet_address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="admin-wallet-form-group">
                <label htmlFor="bar_code">Barcode Image</label>
                <input
                  type="file"
                  id="bar_code"
                  name="bar_code"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {imagePreview && (
                  <div className="admin-wallet-image-preview">
                    <img
                      src={imagePreview}
                      alt="Barcode preview"
                      style={{ maxWidth: '200px', maxHeight: '100px' }}
                    />
                  </div>
                )}
              </div>
              <div className="admin-wallet-form-actions">
                <button
                  type="button"
                  className="admin-wallet-btn admin-wallet-btn-secondary"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-wallet-btn admin-wallet-btn-primary">
                  {editingWallet ? 'Update' : 'Add'} Wallet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWallets;