import React from 'react';
import './styles/UserTransactionModal.css';

const UserTransactionModal = ({
    showModal,
    setShowModal,
    actionType,
    formData,
    handleInputChange,
    handleSubmit,
    cryptoOptions
}) => {
    return (
        showModal && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>
                        {actionType === 'bonus' && 'Add Bonus'}
                        {actionType === 'debit' && 'Debit User'}
                        {actionType === 'withdrawal' && 'Adjust Withdrawal'}
                    </h2>

                    <form onSubmit={handleSubmit}>
                        {actionType === 'withdrawal' ? (
                            <>
                                <div className="form-group">
                                    <label htmlFor="amount">Amount (use minus sign to reduce):</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 100 or -50"
                                        step="0.00000001"
                                        required
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="form-group">
                                    <label>Amount (USD)</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        min="0.01"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Amount Crypto</label>
                                    <input
                                        type="number"
                                        name="amount_crypto"
                                        value={formData.amount_crypto}
                                        onChange={handleInputChange}
                                        min="0.01"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Crypto Type</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        {cryptoOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Message (Optional)</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        maxLength="1000"
                                    />
                                </div>
                            </>
                        )}

                        <div className="form-actions">
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="submit-button">
                                {actionType === 'bonus'
                                    ? 'Add Bonus'
                                    : actionType === 'debit'
                                        ? 'Debit User'
                                        : 'Update Withdrawal'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default UserTransactionModal;
