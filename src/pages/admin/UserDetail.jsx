import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles/UserDetail.css';
import api from '../../api/axios';
import UserTransactionModal from './UserTransactionModal';
import EthWalletModal from './EthWalletModal';
import { formatCurrency, formatDate } from '../../utils/format';

const UserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState('');
    const [showEthModal, setShowEthModal] = useState(false);
    const [ethAction, setEthAction] = useState({ type: null, wallet: null });
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    const [formData, setFormData] = useState({
        user_id: id,
        amount: '',
        message: '',
        amount_crypto: '',
        type: 'solona'
    });

    const cryptoOptions = [
        { value: 'solona', label: 'Solona (SOL)' },
        { value: 'usdt_erc20', label: 'Tether ERC20 (USDT_ERC20)' },
        { value: 'usdt_trc20', label: 'Tether TRC20 (USDT_TRC20)' },
        { value: 'xrp', label: 'Ripple (XRP)' },
        { value: 'trx', label: 'Tron (TRX)' },
        { value: 'eth', label: 'Eth (ETH)' },
        { value: 'btc', label: 'BTC (BTC)' },
        { value: 'pol', label: 'POL (POL)' },
        { value: 'avax', label: 'AVAX (AVAX)' }
    ];

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/api/users/${id}`);
                const apiData = response.data;

                const uiUser = {
                    id: apiData.id,
                    name: apiData.name,
                    username: apiData.username,
                    email: apiData.email,
                    email_verified_at: apiData.email_verified_at,
                    phone: apiData.phone,
                    country: apiData.country,
                    state: apiData.state,
                    address: apiData.address,
                    user_status: apiData.user_status,
                    user_role: apiData.user_role,
                    account_verified: apiData.account_verified,
                    is_verified: apiData.is_verified,
                    user_blocked: apiData.user_blocked,
                    is_demo_account: apiData.is_demo_account,
                    first_deposit: apiData.first_deposit,
                    eth_1_active: apiData.eth_1_active,
                    eth_2_active: apiData.eth_2_active,
                    eth_1: parseFloat(apiData.eth_1) || 0,
                    eth_2: parseFloat(apiData.eth_2) || 0,
                    btc: parseFloat(apiData.btc) || 0,
                    btc_usd: parseFloat(apiData.btc_usd) || 0,
                    usdt_trc20: parseFloat(apiData.usdt_trc20) || 0,
                    usdt_trc20_usd: parseFloat(apiData.usdt_trc20_usd) || 0,
                    usdt_erc20: parseFloat(apiData.usdt_erc20) || 0,
                    usdt_erc20_usd: parseFloat(apiData.usdt_erc20_usd) || 0,
                    eth: parseFloat(apiData.eth) || 0,
                    eth_usd: parseFloat(apiData.eth_usd) || 0,
                    trx: parseFloat(apiData.trx) || 0,
                    trx_usd: parseFloat(apiData.trx_usd) || 0,
                    sol: parseFloat(apiData.sol) || 0,
                    sol_usd: parseFloat(apiData.sol_usd) || 0,
                    xrp: parseFloat(apiData.xrp) || 0,
                    xrp_usd: parseFloat(apiData.xrp_usd) || 0,
                    avax: parseFloat(apiData.avax) || 0,
                    avax_usd: parseFloat(apiData.avax_usd) || 0,
                    pol: parseFloat(apiData.pol) || 0,
                    pol_usd: parseFloat(apiData.pol_usd) || 0,
                    usd_total: parseFloat(apiData.usd_total) || 0,
                    earning: parseFloat(apiData.earning) || 0,
                    referral_earning: parseFloat(apiData.referral_earning) || 0,
                    referral_count: parseInt(apiData.referral_count) || 0,
                    registration_fee: parseFloat(apiData.registration_fee) || 0,
                    out_amount: parseFloat(apiData.out_amount) || 0,
                    profile_img: apiData.profile_image_url || 'https://randomuser.me/api/portraits/men/1.jpg',
                    last_seen: apiData.last_seen,
                    referral_code: apiData.referral_code,
                    document_img: apiData.document_image_url,
                    document_type: apiData.document_type
                };

                setUser(uiUser);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user:', error);
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddETH = (walletType) => {
        setEthAction({ type: 'topup', wallet: walletType });
        setShowEthModal(true);
    };

    const handleToggleETH = (walletType, currentStatus) => {
        setEthAction({ type: 'toggle', wallet: walletType, currentStatus });
        setShowEthModal(true);
    };

    const handleEthAction = async (amount = null) => {
        try {
            let endpoint = '';
            let data = {};

            if (ethAction.type === 'topup') {
                endpoint = `/api/admin/users/${id}/eth${ethAction.wallet}/topup`;
                data = { amount };
            } else if (ethAction.type === 'toggle') {
                endpoint = `/api/admin/users/${id}/eth${ethAction.wallet}/toggle`;
            }

            const response = await api.post(endpoint, data);

            console.log(response);
            // Use the response data directly instead of making a new request
            setUser(prev => ({
                ...prev,
                [`eth_${ethAction.wallet}`]: parseFloat(response.data[`eth_${ethAction.wallet}`]) || 0,
                eth_1_active: response.data.eth_1_active,
                eth_2_active: response.data.eth_2_active
            }));

            setNotification({
                show: true,
                message: response.data.message || 'Action completed successfully',
                type: 'success'
            });

        } catch (error) {
            setNotification({
                show: true,
                message: error.response?.data?.message || 'Failed to complete action',
                type: 'error'
            });
            console.error('ETH action error:', error);
        } finally {
            setShowEthModal(false);
            setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
        }
    };

    const handleBonus = () => {
        setActionType('bonus');
        setShowModal(true);
    };

    const handleDebit = () => {
        setActionType('debit');
        setShowModal(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const formatCurrency = (value) => {
        if (value === undefined || value === null) return 'N/A';
        return parseFloat(value).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    if (loading) {
        return <div className="user-detail-loading">Loading user data...</div>;
    }

    if (!user) {
        return <div className="user-detail-error">User not found</div>;
    }

    const allCryptos = [
        { name: 'BTC', amount: user.btc, usd: user.btc_usd },
        { name: 'ETH', amount: user.eth, usd: user.eth_usd },
        { name: 'USDT (TRC20)', amount: user.usdt_trc20, usd: user.usdt_trc20_usd },
        { name: 'USDT (ERC20)', amount: user.usdt_erc20, usd: user.usdt_erc20_usd },
        { name: 'TRX', amount: user.trx, usd: user.trx_usd },
        { name: 'SOL', amount: user.sol, usd: user.sol_usd },
        { name: 'XRP', amount: user.xrp, usd: user.xrp_usd },
        { name: 'AVAX', amount: user.avax, usd: user.avax_usd },
        { name: 'POL', amount: user.pol, usd: user.pol_usd }
    ];


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let endpoint = '';
            let payload = {};

            if (actionType === 'bonus') {
                endpoint = `/api/admin/users/${id}/bonus`;
                payload = {
                    amount: parseFloat(formData.amount),
                    amount_crypto: formData.amount_crypto,
                    type: formData.type,
                    message: formData.message,
                };
            } else if (actionType === 'debit') {
                endpoint = `/api/admin/users/${id}/debit`;
                payload = {
                    amount: parseFloat(formData.amount),
                    amount_crypto: formData.amount_crypto,
                    type: formData.type,
                    message: formData.message,
                };
            } else if (actionType === 'withdrawal') {
                endpoint = `/api/admin/users/${id}/withdrawal/update`;
                payload = {
                    amount: parseFloat(formData.amount),
                };
            }

            if (isNaN(payload.amount) || payload.amount === 0) {
                alert('Please enter a valid non-zero amount.');
                return;
            }

            const response = await api.post(endpoint, payload);

            alert(`${actionType} updated successfully!`);

            // Refresh user data
            const userResponse = await api.get(`/api/users/${id}`);
            setUser(prev => ({
                ...prev,
                ...userResponse.data,
                out_amount: parseFloat(userResponse.data.out_amount) || 0,
            }));

            setFormData({
                user_id: id,
                amount: '',
                message: '',
                amount_crypto: '',
                type: 'solona',
            });
            setShowModal(false);
        } catch (error) {
            console.error(`Error with ${actionType}:`, error);
            alert(`Failed to ${actionType}: ${error.response?.data?.message || error.message}`);
        }
    };



    return (
        <div className="user-detail-container">
            {notification.show && (
                <div className={`notification-toast ${notification.type}`}>
                    {notification.message}
                </div>
            )}
            <button className="back-button" onClick={() => navigate(-1)}>
                ← Back to Users
            </button>

            <div className="user-header">
                <img src={user.profile_img} alt={user.name} className="user-avatar-large" />
                <div className="user-info">
                    <h1>{user.name}</h1>
                    <p>@{user.username} • {user.user_role}</p>
                    <div className={`user-status ${user.user_status}`}>
                        {user.user_status?.charAt(0)?.toUpperCase() + user.user_status?.slice(1)}
                    </div>
                </div>
            </div>

            <div className="user-actions">
                <div className="total-balance">
                    <h3>Total Balance</h3>
                    <div className="balance-amount">${formatCurrency(user.usd_total)}</div>
                </div>
                <div className="action-buttons">
                    <button className="bonus-button" onClick={handleBonus}>
                        Add Fund
                    </button>
                    <button className="debit-button" onClick={handleDebit}>
                        Debit User
                    </button>
                    <button
                        className="debit-button"
                        onClick={() => {
                            setActionType('withdrawal');
                            setShowModal(true);
                        }}
                    >
                        Adjust Withdrawal Fund
                    </button>

                </div>
            </div>

            <div className="user-detail-sections">
                <div className="user-section">
                    <h2>Account Information</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Email:</span>
                            <span className="info-value">{user.email}</span>
                            <span className="info-verified">
                                {user.email_verified_at ? `Verified on ${formatDate(user.email_verified_at)}` : 'Not verified'}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Phone:</span>
                            <span className="info-value">{user.phone || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Country:</span>
                            <span className="info-value">{user.country || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">State:</span>
                            <span className="info-value">{user.state || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Address:</span>
                            <span className="info-value">{user.address || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Account Verified:</span>
                            <span className="info-value">{user.account_verified ? '✅ Yes' : '❌ No'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Document Verified:</span>
                            <span className="info-value">{user.is_verified ? '✅ Yes' : '❌ No'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Document Type:</span>
                            <span className="info-value">{user.document_type || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Demo Account:</span>
                            <span className="info-value">{user.is_demo_account ? '✅ Yes' : '❌ No'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">First Deposit:</span>
                            <span className="info-value">{user.first_deposit ? '✅ Yes' : '❌ No'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Last Seen:</span>
                            <span className="info-value">{formatDate(user.last_seen)}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Referral Code:</span>
                            <span className="info-value">{user.referral_code || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Referrals:</span>
                            <span className="info-value">{user.referral_count}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Total Withdrawn:</span>
                            <span className="info-value">${formatCurrency(user.out_amount)}</span>
                        </div>
                    </div>
                </div>

                <div className="user-section">
                    <h2>Wallet Balances</h2>

                    <div className="wallet-grid">
                        <div className={`wallet-item ${user.eth_1_active ? 'active-wallet' : ''}`}>
                            <h3 className={user.eth_1_active ? 'active-text' : ''}>
                                ETH 1 {user.eth_1_active && '(Active)'}
                            </h3>
                            <div className="wallet-amount">{formatCurrency(user.eth_1)} ETH</div>
                            <div className="wallet-actions">
                                <button
                                    className="wallet-action add"
                                    onClick={() => handleAddETH(1)}
                                >
                                    Add ETH 1
                                </button>
                                <button
                                    className={`wallet-action ${user.eth_1_active ? 'deactivate' : 'activate'}`}
                                    onClick={() => handleToggleETH(1, user.eth_1_active)}
                                >
                                    {user.eth_1_active ? 'Deactivate' : 'Activate'}
                                </button>
                            </div>
                        </div>

                        <div className={`wallet-item ${user.eth_2_active ? 'active-wallet' : ''}`}>
                            <h3 className={user.eth_2_active ? 'active-text' : ''}>
                                ETH 2 {user.eth_2_active && '(Active)'}
                            </h3>
                            <div className="wallet-amount">{formatCurrency(user.eth_2)} ETH</div>
                            <div className="wallet-actions">
                                <button
                                    className="wallet-action add"
                                    onClick={() => handleAddETH(2)}
                                >
                                    Add ETH 2
                                </button>
                                <button
                                    className={`wallet-action ${user.eth_2_active ? 'deactivate' : 'activate'}`}
                                    onClick={() => handleToggleETH(2, user.eth_2_active)}
                                >
                                    {user.eth_2_active ? 'Deactivate' : 'Activate'}
                                </button>
                            </div>
                        </div>

                        <div className="wallet-item">
                            <h3>Total USD Value</h3>
                            <div className="wallet-amount-total">${formatCurrency(user.usd_total)}</div>
                        </div>
                    </div>

                </div>

                <div className="user-section">
                    <h2>All Cryptocurrencies</h2>
                    <div className="crypto-grid">
                        {allCryptos.map((crypto, index) => (
                            <div className="crypto-item" key={index}>
                                <h3>{crypto.name}</h3>
                                <div className="crypto-amount">{formatCurrency(crypto.amount)}</div>
                                <div className="crypto-usd">${formatCurrency(crypto.usd)}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="user-section">
                    <h2>Earnings</h2>
                    <div className="earnings-grid">
                        <div className="earnings-item">
                            <span className="earnings-label">Total Earnings:</span>
                            <span className="earnings-value">${formatCurrency(user.earning)}</span>
                        </div>
                        <div className="earnings-item">
                            <span className="earnings-label">Referral Earnings:</span>
                            <span className="earnings-value">${formatCurrency(user.referral_earning)}</span>
                        </div>
                        <div className="earnings-item">
                            <span className="earnings-label">Registration Fee:</span>
                            <span className="earnings-value">${formatCurrency(user.registration_fee)}</span>
                        </div>
                    </div>
                </div>
            </div>
            <UserTransactionModal
                showModal={showModal}
                setShowModal={setShowModal}
                actionType={actionType}
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                cryptoOptions={cryptoOptions}
            />

            <EthWalletModal
                showModal={showEthModal}
                setShowModal={setShowEthModal}
                action={ethAction}
                handleSubmit={handleEthAction}
                currentStatus={ethAction.currentStatus}
            />
        </div>
    );
};

export default UserDetail;