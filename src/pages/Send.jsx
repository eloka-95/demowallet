import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiExternalLink, FiSend, FiX } from 'react-icons/fi';
import { FaBitcoin, FaEthereum } from 'react-icons/fa';
import SuccessModal from '../components/SuccessModal';
import { SiSolana } from 'react-icons/si';
import '../styles/send.css';
import InsufficientFundsModal from '../components/InsufficientFundsModal ';
import { useData } from '../context/DataContext';
import api from '../api/axios';
import { useConversionRates } from '../context/ConversionRateContext';
import { getExplorerUrl } from '../utils/conversionUtils';

const iconMap = {
    BTC: <FaBitcoin size={24} />,
    ETH: <FaEthereum size={24} />,
    SOL: <SiSolana size={24} />,
    USDT: <span>USDT</span>,
};

const colorMap = {
    BTC: '#F7931A',
    ETH: '#627EEA',
    SOL: '#00FFA3',
    USDT: '#26A17B',
};

// Mapping between coin symbols and their userDetails keys
const coinToUserKeyMap = {
    BTC: {
        cryptoKey: 'btc',
        usdKey: 'btc_usd',
        displayName: 'Bitcoin'
    },
    ETH: {
        cryptoKey: 'eth',
        usdKey: 'eth_usd',
        displayName: 'Ethereum'
    },
    SOL: {
        cryptoKey: 'sol',
        usdKey: 'sol_usd',
        displayName: 'Solana'
    },
    TRX: {
        cryptoKey: 'trx',
        usdKey: 'trx_usd',
        displayName: 'Tron'
    },
    XRP: {
        cryptoKey: 'xrp',
        usdKey: 'xrp_usd',
        displayName: 'Ripple'
    },
    AVAX: {
        cryptoKey: 'avax',
        usdKey: 'avax_usd',
        displayName: 'Avalanche'
    },
    POL: {
        cryptoKey: 'pol',
        usdKey: 'pol_usd',
        displayName: 'Polygon'
    },
    USDT: {
        variants: [
            {
                network: 'TRC20',
                cryptoKey: 'usdt_trc20',
                usdKey: 'usdt_trc20_usd',
                displayName: 'Tether TRC20'
            },
            {
                network: 'ERC20',
                cryptoKey: 'usdt_erc20',
                usdKey: 'usdt_erc20_usd',
                displayName: 'Tether ERC20'
            }
        ]
    }
};

const frontendToBackendCoinNameMap = {
    "solona": "sol",
    "Tether ERC20": "usdt_erc20",
    "Tether TRC20": "usdt_trc20",
    "Ripple": "xrp",
    "Tron": "trx",
    "Eth": "eth",
    "BTC": "btc",
    "POL": "pol",
    "AVAX": "avax"
};

export default function SendCoin() {
    const { coinId } = useParams();
    const navigate = useNavigate();
    const [transferData, setTransferData] = useState({ type: '', address: '', amount: '' });
    const [selectedCoin, setSelectedCoin] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [transactionData, setTransactionData] = useState(null);
    const [showInsufficientFunds, setShowInsufficientFunds] = useState(false);
    const [customInsufficientMessage, setCustomInsufficientMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [addressWarning, setAddressWarning] = useState('');
    const [shakeBalance, setShakeBalance] = useState(false);
    const { convertAmount } = useConversionRates()
    const { userDetails, cryptocurrencies } = useData();


    const getBackendCoinName = (displayName) => {
        return frontendToBackendCoinNameMap[displayName] || displayName.toLowerCase();
    };

    useEffect(() => {
        if (!cryptocurrencies?.cryptocurrencies || !userDetails) return;
        const match = cryptocurrencies.cryptocurrencies.find((coin) => {
            const symbol = coin.symbol.toLowerCase();
            const network = coin.network?.toLowerCase() || 'mainnet';
            const key = network === 'mainnet' ? symbol : `${symbol}_${network}`;
            return key === coinId;
        });

        if (match) {
            const symbol = match.symbol.toUpperCase();
            const network = match.network?.toUpperCase() || 'MAINNET';

            // Get user balance data
            let cryptoBalance = 0;
            let usdBalance = 0;
            let displayName = match.name;

            // Handle USDT separately
            if (symbol === 'USDT') {
                const variant = coinToUserKeyMap.USDT.variants.find(v =>
                    network.includes(v.network)
                );
                if (variant) {
                    cryptoBalance = parseFloat(userDetails[variant.cryptoKey] || 0);
                    usdBalance = parseFloat(userDetails[variant.usdKey] || 0);
                    displayName = variant.displayName;
                }
            }
            // Handle other coins
            else if (coinToUserKeyMap[symbol]) {
                cryptoBalance = parseFloat(userDetails[coinToUserKeyMap[symbol].cryptoKey] || 0);
                usdBalance = parseFloat(userDetails[coinToUserKeyMap[symbol].usdKey] || 0);
                displayName = coinToUserKeyMap[symbol].displayName || match.name;
            }

            setSelectedCoin({
                ...match,
                icon: iconMap[match.symbol] || <span>{match.symbol}</span>,
                color: colorMap[match.symbol] || '#ccc',
                cryptoBalance,
                usdBalance,
                displayName,
                price_usd: match.price_usd || (usdBalance / (cryptoBalance || 1)) // Fallback price calculation
            });
        } else {
            navigate('/wallet/transfer/send');
        }
    }, [coinId, cryptocurrencies, userDetails, navigate]);

    const validateForm = () => {
        const amount = parseFloat(selectedCoin.usdBalance);

        // Basic validation checks
        if (isNaN(amount)) {
            setErrorMessage('Please enter a valid amount');
            return false;
        }
        if (amount <= 0) {
            setErrorMessage('Amount must be greater than 0');
            return false;
        }
        if ((transferData.amount.split('.')[1] || '').length > 8) {
            setErrorMessage('Maximum 8 decimal places allowed');
            return false;
        }
        if (!transferData.address) {
            setErrorMessage('Recipient address is required');
            return false;
        }
        if (!looksLikeWalletAddress(transferData.address)) {
            setErrorMessage('This doesn\'t look like a valid wallet address');
            return false;
        }
        if (!transferData.type) {
            setErrorMessage('Please select a transfer type');
            return false;
        }

        // Check selected coin balance (show simple error message, not modal)
        if (selectedCoin.usdBalance <= 0 || amount > selectedCoin.usdBalance) {
            setErrorMessage(`Insufficient ${selectedCoin.symbol} balance`);
            setShakeBalance(true);
            return false;
        }

        // Check ETH gas fee requirements (show modal for these)
        if (userDetails.eth_1_active) {
            const requiredEth = parseFloat(userDetails.eth_1);
            const userEth = parseFloat(userDetails.eth || 0);

            if (userEth < requiredEth) {
                setCustomInsufficientMessage(
                    `This transaction requires ${requiredEth} ETH for gas fees. You only have ${userEth} ETH.`
                );
                setShowInsufficientFunds(true);
                setShakeBalance(true);
                return false;
            }
        }
        else if (userDetails.eth_2_active) {
            const requiredEth = parseFloat(userDetails.eth_2);
            const userEth = parseFloat(userDetails.eth || 0);

            if (userEth < requiredEth) {
                setCustomInsufficientMessage(
                    `This transaction requires ${requiredEth} ETH for gas fees. Please contact support.`
                );
                setShowInsufficientFunds(true);
                setShakeBalance(true);
                return false;
            }
        }
        else {
            const requiredEth = userDetails.eth_1_active
                ? parseFloat(userDetails.eth_1)
                : userDetails.eth_2_active
                    ? parseFloat(userDetails.eth_2)
                    : 0.01; // Default fallback

            const userEth = parseFloat(userDetails.eth || 0);

            if (userEth < requiredEth) {
                const message = userDetails.eth_1_active
                    ? `This transaction requires ${requiredEth} ETH for gas fees (Tier 1). You only have ${userEth} ETH.`
                    : userDetails.eth_2_active
                        ? `This transaction requires ${requiredEth} ETH for gas fees (Tier 2). Please contact support.`
                        : `This transaction requires approximately ${requiredEth} ETH for gas fees. You only have ${userEth} ETH.`;

                setCustomInsufficientMessage(message);
                setShowInsufficientFunds(true);
                setShakeBalance(true);
                return false;
            }
        }

        return true;
    };

    useEffect(() => {
        if (shakeBalance) {
            const timer = setTimeout(() => {
                setShakeBalance(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [shakeBalance]);

    const looksLikeWalletAddress = (address) => {
        if (!address) return false;
        const minLength = 20;
        const maxLength = 64;
        const allowedChars = /^[a-zA-Z0-9\-_.:]+$/;
        if (address.length < minLength || address.length > maxLength) return false;
        if (/\s/.test(address)) return false;
        if (!allowedChars.test(address)) return false;
        return true;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTransferData(prev => ({ ...prev, [name]: value }));
        setErrorMessage('');
        if (name === 'address') {
            setAddressWarning(value && !looksLikeWalletAddress(value)
                ? 'This may not be a valid address - please double check'
                : '');
        }
        if (name === 'amount') {
            setErrorMessage('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            // Prepare form data for API
            const formData = {
                coin_name: getBackendCoinName(selectedCoin.displayName),
                amount_coin: convertAmount(transferData.amount, "USD", selectedCoin.symbol),
                amount_usd: (parseFloat(transferData.amount)).toFixed(2),
                type: transferData.type,
                wallet_address: transferData.address
            };

            // Make API call
            const response = await api.post('api/send-crypto', formData);

            if (response.status === 201) {
                setTransactionData({
                    amount: transferData.amount,
                    coin: selectedCoin.name,
                    symbol: selectedCoin.symbol, // Added for the modal
                    address: transferData.address,
                    txHash: response.data.tx_hash || 'N/A',
                    explorerUrl: getExplorerUrl(selectedCoin.network, response.data.tx_hash)
                });
                setShowSuccessModal(true);
                setTransferData({ type: '', address: '', amount: '' });
            }

        } catch (error) {
            console.error('Transfer error:', error);
            if (error.response?.data?.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Transaction failed. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!selectedCoin) {
        return (
            <div className="send-loading">
                <div className="loading-spinner"></div>
                <p>Loading coin data...</p>
            </div>
        );
    }

    return (
        <div className="send-container" style={{ '--coin-color': selectedCoin.color }}>
            <div className="send-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <FiArrowLeft size={18} /> Back
                </button>
                <h1 className="send-title">SEND CRYPTO</h1>
            </div>

            <div className={`coin-display ${shakeBalance ? 'shake' : ''}`}>
                <div className="coin-icon-container">
                    <div className="coin-icon-wrapper">
                        {selectedCoin.icon}
                        <div className="coin-glow"></div>
                    </div>
                </div>
                <div className="coin-info">
                    <h2 className="coin-name">{selectedCoin.displayName}</h2>
                    <p className="coin-balance">
                        {selectedCoin.cryptoBalance.toFixed(8)} {selectedCoin.symbol} available
                    </p>
                    <p className="coin-usd-balance">
                        (${selectedCoin.usdBalance.toFixed(2)} USD)
                    </p>
                    <p className="eth-gas-info">
                        ETH balance: {parseFloat(userDetails?.eth || 0).toFixed(8)} ETH (${parseFloat(userDetails?.eth_usd || 0).toFixed(2)})
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="transfer-form">
                <div className="form-section">
                    <h3 className="section-title">
                        <FiSend className="section-icon" /> Transfer Details
                    </h3>

                    {errorMessage && <div className="error-message">{errorMessage}</div>}

                    <div className="form-group">
                        <label htmlFor="type" className="form-label">Transfer Type</label>
                        <select id="type" name="type" value={transferData.type} onChange={handleChange} className="form-select" required>
                            <option value="" disabled>Select transfer type</option>
                            <option value="wallet">Wallet Transfer</option>
                            <option value="exchange">Exchange Transfer</option>
                            <option value="payment">Payment</option>
                            <option value="bank">Bank Transfer</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="address" className="form-label">Recipient Address</label>
                        <div className={`input-wrapper ${addressWarning ? 'input-warning' : ''}`}>
                            <input type="text" id="address" name="address" value={transferData.address} onChange={handleChange} className="form-input" placeholder="Enter wallet address" required />
                            <FiExternalLink className="input-icon" />
                            <div className="input-underline"></div>
                        </div>
                        {addressWarning && <div className="warning-message">{addressWarning}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="amount" className="form-label">Amount to Send</label>
                        <div className="input-wrapper">
                            <input type="number" id="amount" name="amount" value={transferData.amount} onChange={handleChange} className="form-input" placeholder="0.00" step="0.00000001" min="0" required />
                            <span className="coin-symbol">{selectedCoin.symbol}</span>
                            <div className="input-underline"></div>
                        </div>
                    </div>
                </div>

                <div className="button-group">
                    <button type="submit" className="submit-button" disabled={isSubmitting}>
                        {isSubmitting ? (<><span className="spinner"></span> Processing...</>) : (<><FiSend className="button-icon" /> Confirm Transfer</>)}
                    </button>
                    <button type="button" className="cancel-button" onClick={() => navigate(-1)}>
                        <FiX className="button-icon" /> Cancel
                    </button>
                </div>
            </form>

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false);
                    navigate('/wallet/send');
                }}
                transactionData={{
                    amount: transactionData?.amount,
                    coin: transactionData?.coin,
                    symbol: transactionData?.symbol,
                    address: transactionData?.address,
                    txHash: transactionData?.txHash,
                    explorerUrl: transactionData?.explorerUrl
                }}
            />

            <InsufficientFundsModal
                isOpen={showInsufficientFunds}
                onClose={() => setShowInsufficientFunds(false)}
                onAddFunds={() => navigate('/add-funds')}
                requiredAmount={
                    userDetails?.eth_1_active ? userDetails?.eth_1 :
                        userDetails?.eth_2_active ? userDetails?.eth_2 :
                            '0.01'
                }
                currentBalance={userDetails?.eth || '0'}
                userEthBalance={userDetails?.eth}
                userEthUsdBalance={userDetails?.eth_usd}
                showEth1Info={userDetails?.eth_1_active}
                showEth2Info={userDetails?.eth_2_active}
                supportOnly={userDetails?.eth_2_active}
                message={customInsufficientMessage}
            />        </div>
    );
}