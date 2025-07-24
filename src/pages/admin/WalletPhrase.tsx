import React, { useState, useEffect } from 'react';
import './styles/WalletPhraseAuth.css';

const WalletPhraseAuth = ({ isAdmin = false }) => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verificationMode, setVerificationMode] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [currentWallet, setCurrentWallet] = useState(null);
  const [adminView, setAdminView] = useState(isAdmin);
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');

  // Mock data fetch - replace with actual API call
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data with multiple wallets
        const mockWallets = [
          {
            id: 1,
            user_id: 101,
            coin_name: 'Bitcoin',
            phrase: ['apple', 'banana', 'cherry', 'dragon', 'elephant', 'fountain', 'giraffe', 'happiness', 'island', 'jungle', 'kangaroo', 'lighthouse'],
            status: 'active',
            created_at: '2023-05-15T10:30:00Z',
            updated_at: '2023-05-15T10:30:00Z'
          },
          {
            id: 2,
            user_id: 101,
            coin_name: 'Ethereum',
            phrase: ['mountain', 'notebook', 'ocean', 'penguin', 'quasar', 'rainbow', 'sunset', 'tiger', 'umbrella', 'volcano', 'waterfall', 'xylophone'],
            status: 'active',
            created_at: '2023-06-20T14:45:00Z',
            updated_at: '2023-06-20T14:45:00Z'
          },
          {
            id: 3,
            user_id: 101,
            coin_name: 'Solana',
            phrase: ['alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot', 'golf', 'hotel', 'india', 'juliet', 'kilo', 'lima'],
            status: 'active',
            created_at: '2023-07-10T09:15:00Z',
            updated_at: '2023-07-10T09:15:00Z'
          }
        ];

        const mockRequests = [
          {
            id: 1,
            user_id: 102,
            wallet_id: 3,
            coin_name: 'Solana',
            status: 'pending',
            requested_at: '2023-07-10T09:15:00Z',
            reason: 'Wallet recovery'
          },
          {
            id: 2,
            user_id: 103,
            wallet_id: 4,
            coin_name: 'Cardano',
            status: 'approved',
            requested_at: '2023-07-08T16:30:00Z',
            approved_at: '2023-07-09T10:00:00Z',
            reason: 'Device migration'
          }
        ];

        setWallets(mockWallets);
        setRequests(mockRequests);
        setCurrentWallet(mockWallets[0]);
        setLoading(false);
      } catch (err) {
        setError('Failed to load data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleWalletSelect = (wallet) => {
    setCurrentWallet(wallet);
    setVerificationMode(false);
    setVerificationResult(null);
    setUserInput('');
  };

  const handleVerification = () => {
    if (!currentWallet) return;

    const userWords = userInput.trim().split(/\s+/);
    const isCorrect = JSON.stringify(userWords) === JSON.stringify(currentWallet.phrase);

    setVerificationResult(isCorrect);
  };

  const copyToClipboard = (phrase) => {
    navigator.clipboard.writeText(phrase.join(' '));
    alert('Phrase copied to clipboard!');
  };

  const handleAdminAction = (requestId, action) => {
    setRequests(prev => prev.map(req =>
      req.id === requestId ? { ...req, status: action } : req
    ));
  };

  const filteredRequests = () => {
    if (filter === 'all') return requests;
    return requests.filter(req => req.status === filter);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading wallet data...</p>
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

  if (adminView) {
    return (
      <div className="admin-container">
        <header className="admin-header">
          <h1>Wallet Phrase Administration</h1>
          <div className="admin-controls">
            <button
              className="toggle-view-btn"
              onClick={() => setAdminView(false)}
            >
              Switch to User View
            </button>
            <div className="filter-controls">
              <label>Filter:</label>
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All Requests</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </header>

        <div className="requests-list">
          <table>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>User ID</th>
                <th>Coin</th>
                <th>Status</th>
                <th>Requested At</th>
                <th>Reason</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests().map(request => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>User #{request.user_id}</td>
                  <td>{request.coin_name}</td>
                  <td>
                    <span className={`status-badge ${request.status}`}>
                      {request.status}
                    </span>
                  </td>
                  <td>{new Date(request.requested_at).toLocaleString()}</td>
                  <td>{request.reason}</td>
                  <td className="actions-cell">
                    {request.status === 'pending' && (
                      <>
                        <button
                          className="approve-btn"
                          onClick={() => handleAdminAction(request.id, 'approved')}
                        >
                          Approve
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => handleAdminAction(request.id, 'rejected')}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {request.status !== 'pending' && (
                      <span className="action-completed">
                        Action taken on {new Date(request.approved_at || request.requested_at).toLocaleDateString()}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-wallet-view">
          <h2>Wallet Phrase Verification</h2>
          <div className="verification-container">
            <div className="verification-instructions">
              <p>Enter a wallet phrase to verify against our records:</p>
            </div>

            <textarea
              className="phrase-input"
              placeholder="Enter the 12-word phrase separated by spaces"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              rows={4}
            />

            <button
              className="verify-submit-btn"
              onClick={handleVerification}
            >
              Verify Phrase
            </button>

            {verificationResult !== null && (
              <div className={`verification-result ${verificationResult ? 'success' : 'error'}`}>
                {verificationResult ? (
                  <>
                    <span className="result-icon">✓</span>
                    <span>This phrase matches one in our records.</span>
                  </>
                ) : (
                  <>
                    <span className="result-icon">✗</span>
                    <span>No matching phrase found in our records.</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-phrase-container">
      <header className="wallet-header">
        <h1>Wallet Recovery Phrases</h1>
        <div className="user-controls">
          <p className="subtitle">Securely manage your wallet recovery phrases</p>
          {isAdmin && (
            <button
              className="toggle-view-btn"
              onClick={() => setAdminView(true)}
            >
              Switch to Admin View
            </button>
          )}
        </div>
      </header>

      <div className="wallet-grid-container">
        <div className="wallet-grid">
          {wallets.map(wallet => (
            <div key={wallet.id} className="wallet-card">
              <div className="wallet-card-header">
                <h3>{wallet.coin_name} Wallet</h3>
                <div className="wallet-actions">
                  <button
                    className="action-btn copy-btn"
                    onClick={() => copyToClipboard(wallet.phrase)}
                  >
                    Copy Phrase
                  </button>
                  <button
                    className={`action-btn verify-btn ${verificationMode && currentWallet?.id === wallet.id ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentWallet(wallet);
                      setVerificationMode(!verificationMode);
                    }}
                  >
                    {verificationMode && currentWallet?.id === wallet.id ? 'Cancel' : 'Verify'}
                  </button>
                </div>
              </div>

              {!(verificationMode && currentWallet?.id === wallet.id) ? (
                <div className="phrase-grid">
                  {wallet.phrase.map((word, index) => (
                    <div key={index} className="phrase-word">
                      <span className="word-number">{index + 1}.</span>
                      <span className="word-text">{word}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="verification-container">
                  <div className="verification-instructions">
                    <p>Please enter your 12-word recovery phrase in the correct order:</p>
                    <div className="hint">
                      Hint: First word is "{wallet.phrase[0]}", last word is "{wallet.phrase[11]}"
                    </div>
                  </div>

                  <textarea
                    className="phrase-input"
                    placeholder="Enter your 12-word phrase separated by spaces"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    rows={4}
                  />

                  <button
                    className="verify-submit-btn"
                    onClick={handleVerification}
                  >
                    Verify Phrase
                  </button>

                  {verificationResult !== null && currentWallet?.id === wallet.id && (
                    <div className={`verification-result ${verificationResult ? 'success' : 'error'}`}>
                      {verificationResult ? (
                        <>
                          <span className="result-icon">✓</span>
                          <span>Verification successful!</span>
                        </>
                      ) : (
                        <>
                          <span className="result-icon">✗</span>
                          <span>Verification failed. Please try again.</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <footer className="security-warning">
        <div className="warning-icon">⚠️</div>
        <p>
          <strong>Security Notice:</strong> Never share your recovery phrase with anyone.
          Store it securely offline. This application does not store your phrase in plain text.
        </p>
      </footer>
    </div>
  );
};

export default WalletPhraseAuth;