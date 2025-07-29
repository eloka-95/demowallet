import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/WalletDetails.css';
import { QRCodeCanvas } from 'qrcode.react';
import { FaBitcoin, FaCopy, FaCheck, FaInfoCircle, FaArrowLeft } from 'react-icons/fa';
import { useWallet } from '../context/WalletContext';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


const WalletDetails = () => {
    const [copied, setCopied] = useState(false);
    const [currentWallet, setCurrentWallet] = useState(null);
    const navigate = useNavigate();
    const { coin, usdAmount, coinAmount } = useParams();
    const { wallets: walletData, loading, error } = useWallet();

    // Find the matching wallet when component mounts or coin changes
    useEffect(() => {
        if (walletData?.wallets && coin) {
            const matchedWallet = walletData.wallets.find(wallet =>
                wallet.wallet_name.toLowerCase() === coin.toLowerCase()
            );
            setCurrentWallet(matchedWallet);
        }
    }, [walletData, coin]);

    const handleCopy = async () => {
        try {
            if (currentWallet?.wallet_address) {
                await navigator.clipboard.writeText(currentWallet.wallet_address);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch (err) {
            console.error("Failed to copy!", err);
        }
    };

    const handleBack = () => {
        navigate("/wallet/receive");
    };

    if (loading) return <div className="loading-message">Loading wallet details...</div>;
    if (error) return <div className="error-message">Error: {error.message}</div>;
    if (!currentWallet) return <div className="error-message">Wallet not found for {coin}</div>;



    return (
        <div className="wallet-receive-container">
            <button className="back-button" onClick={handleBack}>
                <FaArrowLeft style={{ marginRight: '8px' }} />
                Back
            </button>

            <div className="wallet-receive-card">
                <div className="amount-display">
                    <div className="crypto-amount">{coinAmount}</div>
                    <div className="usd-amount">${usdAmount}</div>
                    <button className="details-btn">
                        <FaInfoCircle style={{ marginRight: '8px' }} />
                        Details
                    </button>
                    <div className="crypto-name">
                        <FaBitcoin style={{ marginRight: '8px' }} />
                        {coin.toUpperCase()}
                    </div>
                </div>

                <div className="divider"></div>

                <div className="qr-code-container">

                    {currentWallet?.bar_code ? (
                        <img
                            src={`${BACKEND_URL}/storage/${currentWallet?.bar_code}`}
                            alt="Wallet barcode"
                            className="admin-wallet-barcode"
                        />
                    ) : 'N/A'}

                    <p className="scan-instruction">Scan QR code to Deposit</p>
                </div>

                <div className="disclaimer">
                    <p>Disclaimer</p>
                    <p className="disclaimer-text">
                        Please deposit only {coin.toUpperCase()} to this address. If you deposit any other coins,
                        it will be lost forever. Please, reconfirm wallet address before sending to this wallet address.
                    </p>
                </div>

                <div className="divider"></div>

                <div className="address-container">
                    <p className="wallet-address">{currentWallet.wallet_address}</p>
                    <button className="copy-btn" onClick={handleCopy}>
                        {copied ? (
                            <>
                                <FaCheck style={{ marginRight: '8px' }} />
                                Copied!
                            </>
                        ) : (
                            <>
                                <FaCopy style={{ marginRight: '8px' }} />
                                Copy
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WalletDetails;