import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/WalletDetails.css';
import { QRCodeCanvas } from 'qrcode.react';
import { FaBitcoin, FaCopy, FaCheck, FaInfoCircle, FaArrowLeft } from 'react-icons/fa';

const WalletDetails = () => {
    const { amount } = useParams();
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();

    const walletAddress = '3A24UNH7U3pn6tuZXb672DHCc7egCLS5i';
    const cryptoAmount = '+0.000183 BTC';
    const usdAmount = '$20.00';

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(walletAddress);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy!", err);
        }
    };

    const handleBack = () => {
        navigate("/receive"); // Go back to previous page
    };

    return (
        <div className="wallet-receive-container">
            <button className="back-button" onClick={handleBack}>
                <FaArrowLeft style={{ marginRight: '8px' }} />
                Back
            </button>

            <div className="wallet-receive-card">
                <div className="amount-display">
                    <div className="crypto-amount">{cryptoAmount}</div>
                    <div className="usd-amount">{usdAmount}</div>
                    <button className="details-btn">
                        <FaInfoCircle style={{ marginRight: '8px' }} />
                        Details
                    </button>
                    <div className="crypto-name">
                        <FaBitcoin style={{ marginRight: '8px' }} />
                        Bitcoin
                    </div>
                </div>

                <div className="divider"></div>

                <div className="qr-code-container">
                    <QRCodeCanvas
                        value={walletAddress}
                        size={200}
                        fgColor="var(--darker)"
                        bgColor="transparent"
                        level="H"
                    />
                    <p className="scan-instruction">Scan QR code to Deposit</p>
                </div>

                <div className="disclaimer">
                    <p>Disclaimer</p>
                    <p className="disclaimer-text">
                        Please deposit only Bitcoin to this address. If you deposit any other coins,
                        it will be lost forever. Please, reconfirm wallet address before sending to this wallet address.
                    </p>
                </div>

                <div className="divider"></div>

                <div className="address-container">
                    <p className="wallet-address">{walletAddress}</p>
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