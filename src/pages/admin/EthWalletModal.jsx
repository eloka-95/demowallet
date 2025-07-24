import React, { useState } from 'react';

const EthWalletModal = ({ showModal, setShowModal, action, handleSubmit, currentStatus }) => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await handleSubmit(action.type === 'topup' ? amount : null);
        } finally {
            setLoading(false);
        }
    };

    if (!showModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>
                        {action.type === 'topup' ? `Top Up ETH ${action.wallet}` :
                            currentStatus ? `Deactivate ETH ${action.wallet}` : `Activate ETH ${action.wallet}`}
                    </h2>
                    <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                        &times;
                    </button>
                </div>

                <form onSubmit={handleFormSubmit}>
                    {action.type === 'topup' && (
                        <div className="form-group">
                            <label>Amount (ETH)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min="0.00000001"
                                step="0.00000001"
                                required
                                className="form-input"
                                placeholder="0.00"
                            />
                        </div>
                    )}

                    {action.type === 'toggle' && (
                        <div className="confirmation-message">
                            <p>Are you sure you want to {currentStatus ? 'deactivate' : 'activate'} ETH {action.wallet}?</p>
                            <p className="warning-text">
                                {currentStatus ?
                                    "This will disable this wallet for the user." :
                                    "This will automatically deactivate the other ETH wallet."}
                            </p>
                        </div>
                    )}

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-cancel"
                            onClick={() => setShowModal(false)}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`btn btn-submit ${action.type === 'toggle' && currentStatus ? 'btn-danger' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' :
                                action.type === 'topup' ? 'Confirm Top Up' :
                                    currentStatus ? 'Deactivate' : 'Activate'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EthWalletModal;