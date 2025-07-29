import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiChevronRight } from 'react-icons/fi';
import { FaBitcoin, FaEthereum } from 'react-icons/fa';
import { SiSolana } from 'react-icons/si';
import './styles/CoinSelection.css';
import { useData } from '../context/DataContext';

const CoinSelection = () => {
    const navigate = useNavigate();
    const { type } = useParams();
    const [hoveredCoin, setHoveredCoin] = useState(null);
    const { cryptocurrencies, userDetails } = useData();

    // console.log(type)

    // Create a mapping between cryptocurrency symbols and their corresponding userDetails keys
    const cryptoToUserKeyMap = {
        'BTC': { usdKey: 'btc_usd' },
        'ETH': { usdKey: 'eth_usd' },
        'TRX': { usdKey: 'trx_usd' },
        'SOL': { usdKey: 'sol_usd' },
        'XRP': { usdKey: 'xrp_usd' },
        'AVAX': { usdKey: 'avax_usd' },
        'POL': { usdKey: 'pol_usd' },
        'USDT': {
            variants: [
                { network: 'TRC20', usdKey: 'usdt_trc20_usd' },
                { network: 'ERC20', usdKey: 'usdt_erc20_usd' }
            ]
        }
    };

    const coins = useMemo(() => {
        const list = cryptocurrencies?.cryptocurrencies || [];

        const iconMap = {
            BTC: <FaBitcoin className="coin-svg-icon" />,
            ETH: <FaEthereum className="coin-svg-icon" />,
            SOL: <SiSolana className="coin-svg-icon" />,
        };

        const colorMap = {
            BTC: '#F7931A',
            ETH: '#627EEA',
            SOL: '#00FFA3',
        };

        return list.map((coin) => {
            const symbol = coin.symbol?.toUpperCase();
            const network = coin.network?.toLowerCase() || 'mainnet';
            const coinKey = network === 'mainnet' ? symbol.toLowerCase() : `${symbol.toLowerCase()}_${network}`;

            // Get the USD balance from userDetails
            let usdBalance = 0;

            // Handle USDT separately due to multiple variants
            if (symbol === 'USDT') {
                const variant = cryptoToUserKeyMap.USDT.variants.find(v =>
                    coin.name.toLowerCase().includes(v.network.toLowerCase())
                );
                if (variant && userDetails) {
                    usdBalance = parseFloat(userDetails[variant.usdKey] || 0);
                }
            }
            // Handle other coins
            else if (cryptoToUserKeyMap[symbol] && userDetails) {
                usdBalance = parseFloat(userDetails[cryptoToUserKeyMap[symbol].usdKey] || 0);
            }

            return {
                id: coinKey,
                coinKey,
                name: coin.name,
                icon: iconMap[coin.symbol] || <span className="coin-svg-icon">{coin.symbol}</span>,
                balance: usdBalance || parseFloat(coin.total_value_usd || 0),
                color: colorMap[coin.symbol] || '#ccc',
            };
        });
    }, [cryptocurrencies, userDetails]);

    const handleSelectCoin = (coinKey) => {
        if (type === "receive") {
            navigate(`/wallet/receive-transaction/${coinKey}`);
        } else if (type === "send") {
            navigate(`/wallet/send-transaction/${coinKey}`);
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="coin-selection-container">
            <div className="coin-selection-header">
                <button
                    className="back-button"
                    onClick={() => navigate('/')}
                    onMouseEnter={() => setHoveredCoin(null)}
                >
                    <FiArrowLeft className="back-icon" />
                    Back
                </button>
                <h1 className="coin-selection-title">TRANSFER CRYPTO</h1>
            </div>

            <div className="coin-selection-content">
                <div className="welcome-message">
                    <span className="welcome-text">Select a coin to transfer</span>
                    <div className="gradient-bar"></div>
                </div>

                <div className="coin-list">
                    {coins.map((coin) => (
                        <div
                            key={coin.id}
                            className={`coin-item ${hoveredCoin === coin.id ? 'hovered' : ''}`}
                            onClick={() => handleSelectCoin(coin.coinKey)}
                            onMouseEnter={() => setHoveredCoin(coin.id)}
                            onMouseLeave={() => setHoveredCoin(null)}
                            style={{ '--coin-color': coin.color }}
                        >
                            <div className="coin-icon-container">
                                <div className="coin-icon-wrapper">
                                    {coin.icon}
                                    {hoveredCoin === coin.id && <div className="coin-hover-glow"></div>}
                                </div>
                            </div>
                            <div className="coin-info">
                                <div className="coin-name">{coin.name}</div>
                                <div className="coin-balance">${coin.balance.toFixed(2)}</div>
                            </div>
                            <FiChevronRight className="arrow-icon" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CoinSelection;