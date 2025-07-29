import React, { useEffect, useState, useMemo } from 'react';
import '../styles/Home.css';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import {
    FiHome, FiArrowUp, FiArrowDown, FiSend, FiDollarSign, FiLink, FiZap, FiSettings
} from 'react-icons/fi';
import { BsWallet2, BsGraphUp } from 'react-icons/bs';
import { useData } from '../context/DataContext';
import axios from 'axios';
import { useConversionRates } from '../context/ConversionRateContext';
import { formatCurrency } from '../utils/format';


const Home = () => {
    const { userDetails, cryptocurrencies, loading } = useData();
    const [liveData, setLiveData] = useState([]);
    const [isFetchingLive, setIsFetchingLive] = useState(true);
    const [randomFluctuations, setRandomFluctuations] = useState({});
    const { convertAmount } = useConversionRates()
    const [upPulse, setUpPulse] = useState(0);
    const [downPulse, setDownPulse] = useState(0);


    useEffect(() => {
        const interval = setInterval(() => {
            setUpPulse((Math.random() * 0.005).toFixed(4));
            setDownPulse((Math.random() * 0.005).toFixed(4));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    // Create a mapping between cryptocurrency symbols and their corresponding userDetails keys
    const cryptoToUserKeyMap = {
        'BTC': { balanceKey: 'btc', usdKey: 'btc_usd' },
        'ETH': { balanceKey: 'eth', usdKey: 'eth_usd' },
        'TRX': { balanceKey: 'trx', usdKey: 'trx_usd' },
        'SOL': { balanceKey: 'sol', usdKey: 'sol_usd' },
        'XRP': { balanceKey: 'xrp', usdKey: 'xrp_usd' },
        'AVAX': { balanceKey: 'avax', usdKey: 'avax_usd' },
        'POL': { balanceKey: 'pol', usdKey: 'pol_usd' },
        'USDT': {
            // Special handling for USDT as it has two versions
            name: 'Tether', // Default name if not matched
            variants: [
                { network: 'TRC20', balanceKey: 'usdt_trc20', usdKey: 'usdt_trc20_usd' },
                { network: 'ERC20', balanceKey: 'usdt_erc20', usdKey: 'usdt_erc20_usd' }
            ]
        }
    };

    // Memoized merge to combine cryptocurrency data with user balances
    const mergedCoins = useMemo(() => {
        if (!cryptocurrencies?.cryptocurrencies || !userDetails) return [];

        return cryptocurrencies.cryptocurrencies.map((coin) => {
            const live = liveData.find(c => c.symbol.toLowerCase() === coin.symbol.toLowerCase());

            // Handle USDT separately due to multiple variants
            if (coin.symbol === 'USDT') {
                const variant = cryptoToUserKeyMap.USDT.variants.find(v =>
                    coin.name.toLowerCase().includes(v.network.toLowerCase())
                );

                if (variant) {
                    return {
                        ...coin,
                        icon: live?.image || coin.icon || "/default-coin.svg",
                        change_percent: live?.price_change_percentage_24h ?? coin.change_percent,
                        price_usd: live?.current_price ?? coin.price_usd,
                        balance: parseFloat(userDetails[variant.balanceKey] || 0),
                        usd_balance: parseFloat(userDetails[variant.usdKey] || 0)
                    };
                }
            }

            // Handle other coins
            const mapping = cryptoToUserKeyMap[coin.symbol];
            if (mapping) {
                return {
                    ...coin,
                    icon: live?.image || coin.icon || "/default-coin.svg",
                    change_percent: live?.price_change_percentage_24h ?? coin.change_percent,
                    price_usd: live?.current_price ?? coin.price_usd,
                    balance: parseFloat(userDetails[mapping.balanceKey] || 0),
                    usd_balance: parseFloat(userDetails[mapping.usdKey] || 0)
                };
            }

            // Fallback for coins not in our mapping
            return {
                ...coin,
                icon: live?.image || coin.icon || "/default-coin.svg",
                change_percent: live?.price_change_percentage_24h ?? coin.change_percent,
                price_usd: live?.current_price ?? coin.price_usd,
                balance: parseFloat(coin.balance || 0),
                usd_balance: parseFloat(coin.price_usd * coin.balance || 0)
            };
        });
    }, [cryptocurrencies, userDetails, liveData]);

    // Rest of your component remains the same...
    // Fetch live data
    useEffect(() => {
        const fetchLivePrices = async () => {
            try {
                const res = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
                    params: {
                        vs_currency: 'usd',
                        ids: 'bitcoin,ethereum,tether,tron,solana,ripple,avalanche,polygon',
                        order: 'market_cap_desc',
                        per_page: 100,
                        page: 1,
                        sparkline: false
                    }
                });
                setLiveData(res.data);
            } catch (error) {
                console.error("Live fetch failed:", error.message);
            } finally {
                setIsFetchingLive(false);
            }
        };
        fetchLivePrices();
    }, []);

    // Generate animated fake fluctuations
    useEffect(() => {
        const interval = setInterval(() => {
            setRandomFluctuations(prev => {
                const updated = {};
                mergedCoins.forEach(coin => {
                    const key = `${coin.symbol}-${coin.network}`;
                    updated[key] = {
                        red: (Math.random() * -0.0001).toFixed(4),
                        blue: (Math.random() * 0.0001).toFixed(4),
                    };
                });
                return updated;
            });
        }, 2000);
        return () => clearInterval(interval);
    }, [mergedCoins]);

    return (
        <div className="home-container">
            {/* Header */}
            <header className="header">
                <h1><FiHome className="icon" /> Dashboard</h1>
                <div className="header-right">
                    <LogoutButton />
                    {/* <Link to="/transaction-History" className="wallet-connect">
                        <FiSettings className="icon subtle-icon" />
                        History
                    </Link> */}
                    <Link to="/wallet/settings" className="settings-button">
                        <FiSettings className="icon subtle-icon" />
                    </Link>
                    <button className="wallet-connect">
                        <BsWallet2 className="icon" /> 0x1f...3a4b
                    </button>
                </div>
            </header>
            {/* transaction-History */}
            {/* Balance Section */}
            <div className="balance-card">
                <h2 className="balance-title"><BsWallet2 className="icon" /> Current Balance</h2>
                <p className="balance-amount">${formatCurrency(userDetails?.usd_total || 0)}</p>
                <div className="flow-container">
                    <div className="flow-card in-card">
                        <p className="flow-label"><FiArrowDown className="icon" /> Inflow</p>
                        <p className="flow-amount in-amount">${formatCurrency(userDetails?.usd_total || 0)}</p>
                    </div>
                    <div className="flow-card out-card">
                        <p className="flow-label"><FiArrowUp className="icon" /> Outflow</p>
                        <p className="flow-amount out-amount">${formatCurrency(userDetails?.out_amount || 0)}</p>
                    </div>
                </div>

                <div className="actions-container">
                    <Link className="action-button send-button" to="/wallet/send">
                        <FiSend className="icon" /> Send
                    </Link>
                    <Link className="action-button receive-button" to="/wallet/receive">
                        <FiArrowDown className="icon" /> Receive
                    </Link>
                    <button className="action-button buy-button">
                        <FiDollarSign className="icon" /> Buy
                    </button>
                    <Link className="action-button x-button" to="/wallet/kyc-verification">
                        <FiLink className="icon" /> KYC
                    </Link>
                    <Link className="action-button waite-button" to="/wallet/wallet-connect">
                        <FiZap className="icon" />Connect Wallet
                    </Link>
                </div>
            </div>

            {/* Holdings Section */}
            <div className="holdings-card">
                <h2 className="holdings-title">
                    <BsGraphUp className="icon" /> Your Holdings
                </h2>

                <div className="holdings-list">
                    {loading.crypto || isFetchingLive ? (
                        <p style={{ padding: '1rem', color: 'gray' }}>Loading holdings...</p>
                    ) : mergedCoins.length === 0 ? (
                        <p style={{ padding: '1rem', color: 'gray' }}>No holdings found</p>
                    ) : (
                        mergedCoins.map(coin => {
                            const key = `${coin.symbol}-${coin.network || 'default'}`;
                            const value = coin.usd_balance || (coin.price_usd * coin.balance);
                            const cryptoEquivalent = convertAmount(value, "USD", coin.symbol);

                            return (
                                <div key={key} className="holding-item">
                                    <div className="token-info">
                                        <div className="token-icon">
                                            <img
                                                src={coin.icon}
                                                alt={coin.symbol}
                                                width={24}
                                                height={24}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.replaceWith(document.createTextNode(coin.symbol));
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <p className="holding-name">{coin.name}</p>
                                            <p className="holding-amount">
                                                {value.toFixed(2)} USD ≈ {cryptoEquivalent.toFixed(8)} {coin.symbol}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="holding-value">${value.toFixed(2)}</p>
                                        <p className={`holding-change ${coin.change_percent >= 0 ? 'positive-change' : 'negative-change'}`}>
                                            {coin.change_percent >= 0 ? '+' : ''}
                                            {parseFloat(coin.change_percent).toFixed(2)}%
                                        </p>
                                        {randomFluctuations[key] && (
                                            <div className="micro-fluctuations" style={{ fontSize: '10px', marginTop: '4px' }}>
                                                <span style={{ color: 'red', marginRight: '8px' }}>
                                                    {randomFluctuations[key].red}
                                                </span>
                                                <span style={{ color: 'blue' }}>
                                                    +{randomFluctuations[key].blue}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;