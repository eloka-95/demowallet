import React from 'react';
import { FaExclamationTriangle, FaHeadset } from 'react-icons/fa';
import './styles/InsufficientFundsModal.css';

const InsufficientFundsModal = ({
    isOpen,
    onClose,
    onAddFunds,
    message,
    eth1Value,
    eth2Value,
    currentBalance,
    currentCoinBalance,
    requestedCoinAmount,
    requiredAmount,
    userEthBalance,
    userEthUsdBalance,
    showEth1Info,
    showEth2Info,
    supportOnly,
    coinSymbol,
    isGasFeeError
}) => {
    if (!isOpen) return null;

    return (
        <div className="insufficient-funds-modal">
            <div className="insufficient-funds-content">
                <div className="insufficient-funds-icon">
                    <FaExclamationTriangle />
                </div>

                <h2 className="insufficient-funds-title">Insufficient Funds</h2>

                {supportOnly ? (
                    <div className="support-message-only">
                        <p className="insufficient-funds-message">
                            {message || 'Please contact support to resolve your Ethereum issue.'}
                        </p>
                        <div className="support-message">
                            <FaHeadset className="support-icon" />
                            <p>Need help? Contact our <a href="/support" className="support-link">support team</a>.</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="insufficient-funds-details">
                            <p className="insufficient-funds-message">
                                {message}
                            </p>

                            <div className="balance-comparison">
                                {!isGasFeeError && (
                                    <>
                                        <div className="balance-row">
                                            <span className="balance-label">Requested {coinSymbol}:</span>
                                            <span className="balance-amount">{requestedCoinAmount} {coinSymbol}</span>
                                        </div>
                                        <div className="balance-row">
                                            <span className="balance-label">Your {coinSymbol} Balance:</span>
                                            <span className="balance-amount">{currentCoinBalance} {coinSymbol}</span>
                                        </div>
                                    </>
                                )}

                                {(showEth1Info || showEth2Info || isGasFeeError) && (
                                    <>
                                        <div className="section-divider">Gas Fee Requirements</div>
                                        {showEth1Info && (
                                            <div className="balance-row">
                                                <span className="balance-label">ETH₁ Requirement:</span>
                                                <span className="balance-amount">{eth1Value} ETH</span>
                                            </div>
                                        )}
                                        {showEth2Info && (
                                            <div className="balance-row">
                                                <span className="balance-label">ETH₂ Requirement:</span>
                                                <span className="balance-amount">{eth2Value} ETH</span>
                                            </div>
                                        )}
                                        <div className="balance-row">
                                            <span className="balance-label">Your ETH Balance:</span>
                                            <span className="balance-amount">
                                                {userEthBalance} ETH (${userEthUsdBalance})
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="support-message">
                            <FaHeadset className="support-icon" />
                            <p>Need help? Contact our <a href="/support" className="support-link">support team</a>.</p>
                        </div>
                    </>
                )}

                <div className="insufficient-funds-actions">
                    {!supportOnly && (
                        <button
                            className="insufficient-funds-button insufficient-funds-button-primary"
                            onClick={onAddFunds}
                        >
                            Add Funds
                        </button>
                    )}
                    <button
                        className="insufficient-funds-button insufficient-funds-button-secondary"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InsufficientFundsModal;