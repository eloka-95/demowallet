import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiExternalLink, FiSend, FiX } from 'react-icons/fi';
import { FaBitcoin, FaEthereum } from 'react-icons/fa';
import { SiSolana } from 'react-icons/si';
import '../styles/send.css';
import { useData } from '../context/DataContext';
import api from '../api/axios';
import { useConversionRates } from '../context/ConversionRateContext';

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

const coinToUserKeyMap = {
    BTC: { cryptoKey: 'btc', usdKey: 'btc_usd', displayName: 'Bitcoin' },
    ETH: { cryptoKey: 'eth', usdKey: 'eth_usd', displayName: 'Ethereum' },
    SOL: { cryptoKey: 'sol', usdKey: 'sol_usd', displayName: 'Solana' },
    TRX: { cryptoKey: 'trx', usdKey: 'trx_usd', displayName: 'Tron' },
    XRP: { cryptoKey: 'xrp', usdKey: 'xrp_usd', displayName: 'Ripple' },
    AVAX: { cryptoKey: 'avax', usdKey: 'avax_usd', displayName: 'Avalanche' },
    POL: { cryptoKey: 'pol', usdKey: 'pol_usd', displayName: 'Polygon' },
    USDT: {
        variants: [
            {
                network: 'TRC20',
                cryptoKey: 'usdt_trc20',
                usdKey: 'usdt_trc20_usd',
                displayName: 'Tether TRC20',
            },
            {
                network: 'ERC20',
                cryptoKey: 'usdt_erc20',
                usdKey: 'usdt_erc20_usd',
                displayName: 'Tether ERC20',
            },
        ],
    },
};

const frontendToBackendCoinNameMap = {
    'solona': 'sol',
    'Tether ERC20': 'usdt_erc20',
    'Tether TRC20': 'usdt_trc20',
    'Ripple': 'xrp',
    'Tron': 'trx',
    'Eth': 'eth',
    'BTC': 'btc',
    'POL': 'pol',
    'AVAX': 'avax',
};

export default function Receivecoin() {
    const { coinId } = useParams();
    const navigate = useNavigate();
    const [transferData, setTransferData] = useState({ amount: '' });
    const [selectedCoin, setSelectedCoin] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { convertAmount } = useConversionRates();
    const { userDetails, cryptocurrencies } = useData();
    const userEnteredAmount = parseFloat(transferData.amount);

    const getBackendCoinName = (coin) => {
        const symbol = coin.symbol?.toLowerCase();
        const network = coin.network?.toLowerCase();

        if (symbol === 'usdt') {
            if (network === 'trc20') return 'usdt_trc20';
            if (network === 'erc20') return 'usdt_erc20';
            return 'usdt';
        }

        return symbol; // e.g., 'btc', 'eth', 'sol', etc.
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

            let cryptoBalance = 0;
            let usdBalance = 0;
            let displayName = match.name;

            if (symbol === 'USDT') {
                const variant = coinToUserKeyMap.USDT.variants.find(v =>
                    network.includes(v.network)
                );
                if (variant) {
                    cryptoBalance = parseFloat(userDetails[variant.cryptoKey] || 0);
                    usdBalance = parseFloat(userDetails[variant.usdKey] || 0);
                    displayName = variant.displayName;
                }
            } else if (coinToUserKeyMap[symbol]) {
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
                price_usd: match.price_usd || (usdBalance / (cryptoBalance || 1)),
            });
        } else {
            navigate('/wallet/transfer/receive');
        }
    }, [coinId, cryptocurrencies, userDetails, navigate]);

    const validateForm = () => {
        if (!transferData.amount || isNaN(transferData.amount) || Number(transferData.amount) <= 0) {
            alert('Please enter a valid amount');
            return false;
        }
        return true;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTransferData(prev => ({ ...prev, [name]: value }));
        setErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const formData = {
                coin_name: getBackendCoinName(selectedCoin), // This maps to 'btc', 'usdt_trc20', etc.
                amount_usd: userEnteredAmount.toFixed(2), // What the user typed
                amount_coin: convertAmount(userEnteredAmount, "USD", selectedCoin.symbol)?.toFixed(8) || '0.00000000'
            };

            const response = await api.post('api/receive-crypto', formData);

            navigate(`/wallet-details/${formData.coin_name}/${formData.amount_usd}/${formData.amount_coin}`);
        } catch (error) {
            console.error('Transfer error:', error);
            setErrorMessage('Transaction failed. Please try again.');
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
                <h1 className="send-title">RECEIVE CRYPTO</h1>
            </div>

            <div className="coin-display">
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

                </div>
            </div>

            <form onSubmit={handleSubmit} className="transfer-form">
                <div className="form-section">
                    <h3 className="section-title">
                        <FiSend className="section-icon" /> Transfer Details
                    </h3>

                    {errorMessage && <div className="error-message">{errorMessage}</div>}

                    <div className="form-group">
                        <label htmlFor="amount" className="form-label">Amount to Receive</label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                value={transferData.amount}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="0.00"
                                step="0.00000001"
                                min="0"
                                required
                            />
                            <span className="coin-symbol">{selectedCoin.symbol}</span>
                            <div className="input-underline"></div>
                        </div>
                    </div>
                </div>

                <div className="button-group">
                    <button type="submit" className="submit-button" disabled={isSubmitting}>
                        {isSubmitting ? (<><span className="spinner"></span> Processing...</>) : (<><FiSend className="button-icon" /> Confirm Receive</>)}
                    </button>
                    <button type="button" className="cancel-button" onClick={() => navigate(-1)}>
                        <FiX className="button-icon" /> Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
