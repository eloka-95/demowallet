import { useEffect } from 'react';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';
import './styles/Success.css';

export default function SuccessModal({ isOpen, onClose, transactionData }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen || !transactionData) return null;

    return (
        <div className="modal-overlay">
            <div className="web3-modal">
                <button className="modal-close-btn" onClick={onClose}>
                    <FaTimes />
                </button>

                <div className="modal-content">
                    <div className="success-icon">
                        <FaCheckCircle />
                    </div>

                    <h3 className="modal-title">Transaction Successful!</h3>

                    <div className="modal-details">
                        <div className="detail-row">
                            <span className="detail-label">Amount Sent:</span>
                            <span className="detail-value">
                                {transactionData.amount} {transactionData.symbol || transactionData.coin}
                            </span>
                        </div>

                        <div className="detail-row">
                            <span className="detail-label">To Address:</span>
                            <span className="detail-value address">
                                {transactionData.address.substring(0, 6)}...{transactionData.address.slice(-4)}
                                <a
                                    href={`${transactionData.explorerUrl?.replace('/tx/', '/address/') || '#'}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="explorer-link"
                                >
                                    <FiExternalLink />
                                </a>
                            </span>
                        </div>

                        <div className="detail-row">
                            <span className="detail-label">Transaction Hash:</span>
                            <span className="detail-value hash">
                                {transactionData.txHash.substring(0, 10)}...{transactionData.txHash.slice(-8)}
                                <a
                                    href={transactionData.explorerUrl || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="explorer-link"
                                >
                                    <FiExternalLink />
                                </a>
                            </span>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button className="modal-btn primary" onClick={onClose}>
                            Done
                        </button>
                     
                    </div>
                </div>
            </div>
        </div>
    );
}