import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiHome, FiUsers, FiDollarSign, FiPieChart,
  FiSettings, FiArrowUp, FiArrowDown,
  FiActivity, FiCreditCard, FiShield,
  FiClock
} from 'react-icons/fi';
import {
  BsWallet2, BsCurrencyBitcoin, BsGraphUp,
  BsFillBarChartFill, BsThreeDotsVertical
} from 'react-icons/bs';
import './styles/AdminDashboard.css'
import LogoutButton from '../../components/LogoutButton';
import { useData } from '../../context/DataContext';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/format';
import { useConversionRates } from '../../context/ConversionRateContext';



const AdminDashboard = () => {

  const { adminStats } = useAuth();
  const { userDetails, cryptocurrencies, loading, fetchAllUsers, allUsers, error } = useData();
  const { convertAmount, getRate, refreshRates, } = useConversionRates()
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [upPulse, setUpPulse] = useState(0);
  const [downPulse, setDownPulse] = useState(0);


  useEffect(() => {
    if ((!allUsers || allUsers.length === 0) && !loading.allUsers && !error.allUsers) {
      fetchAllUsers();
    }
  }, [allUsers, loading.allUsers, error.allUsers, fetchAllUsers]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshRates();
    setTimeout(() => setIsRefreshing(false), 1500);
  };


  useEffect(() => {
    const interval = setInterval(() => {
      setUpPulse((Math.random() * 0.005).toFixed(4));
      setDownPulse((Math.random() * 0.005).toFixed(4));
    }, 2000);

    return () => clearInterval(interval);
  }, []);



  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <h1 className='icon'><FiHome className="icon" /> Admin Dashboard</h1>

        <div>
          <nav className="admin-nav-links">
            <Link to="/admin/wallet-phrase" className="nav-link text">
              <BsWallet2 className="icon" /> Wallet Phrase
            </Link>
            <Link to="/admin/history" className="nav-link">
              <FiClock className="icon" /> History
            </Link>
          </nav>
        </div>

        <div className="header-right">
          <LogoutButton />
          <div className="admin-notification">
            <span className="notification-badge">3</span>
            <FiActivity className="icon" />
          </div>
          <div className="admin-profile">
            <span>Admin User</span>
            <div className="profile-avatar">AU</div>
          </div>
        </div>

      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total-balance">
            <FiDollarSign />
          </div>
          <div className="stat-info">
            <h3>Total Balance</h3>
            <p>
              ${formatCurrency(adminStats.total_usd_balance)}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon total-users">
            <FiUsers />
          </div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p>{adminStats.total_users}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon money-in">
            <FiArrowDown />
          </div>
          <div className="stat-info">
            <h3>Total Blacklist</h3>
            <p>${adminStats.total_blocked_users.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon money-out">
            <FiArrowUp />
          </div>
          <div className="stat-info">
            <h3>Total Outflow</h3>
            <p>
              ${formatCurrency(adminStats.total_withdrawn_amount)}
            </p>
          </div>
        </div>
      </div>

      {/* Charts and Tables Section */}
      <div className="content-row">
        {/* Crypto List */}
        <div className="content-card crypto-card">
          <div className="card-header">
            <h3 className='icon' ><BsCurrencyBitcoin className="icon coinPrice" />
              Cryptocurrencies
            </h3>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              style={{
                padding: '10px 16px',
                borderRadius: '6px',
                backgroundColor: isRefreshing ? '#6c757d' : '#007bff',
                color: 'white',
                border: 'none',
                cursor: isRefreshing ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s',
              }}
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh Rates'}
            </button>          </div>

          <div className="crypto-table">
            <div className="table-header">
              <span>Name</span>
              <span>Price</span>
              <span>24h Change</span>
              <span>Rate</span>
            </div>

            {loading.crypto ? (
              <div className="loading-row">Loading...</div>
            ) : Array.isArray(cryptocurrencies.cryptocurrencies) && cryptocurrencies.cryptocurrencies.length > 0 ? (
              cryptocurrencies.cryptocurrencies.map(crypto => (
                <div className="table-row" key={crypto.id}>
                  <div className="crypto-name">
                    <span className="crypto-symbol">{crypto.symbol}</span>
                    <span>{crypto.name}</span>
                  </div>
                  <div className='coinPrice'>${parseFloat(crypto.price_usd).toLocaleString()}</div>
                  <div className={parseFloat(crypto.change || 0) >= 0 ? 'positive-change' : 'negative-change'}>
                    <div style={{ fontSize: '0.8rem', color: '#999', display: 'flex', gap: '8px' }}>
                      <span style={{ color: 'blue' }}>+{upPulse}</span>
                      <span style={{ color: 'red' }}>-{downPulse}</span>
                    </div>                  </div>
                  <div className='coinRate'> {getRate(crypto.symbol)}</div>
                </div>
              ))
            ) : (
              <div className="empty-state">No cryptocurrency data available.</div>
            )}
          </div>


          <div className="card-footer">
            <Link to="/admin/cryptocurrency">View All Cryptocurrencies</Link>
          </div>
        </div>


        <div className="content-card users-card">
          <div className="card-header">
            <h3 className='icon'><FiUsers className="icon" /> Recent Users</h3>
            <button className="card-menu">
              <BsThreeDotsVertical />
            </button>
          </div>

          <div className="users-table">
            {loading.allUsers ? (
              <div className="loading-row">Loading users...</div>
            ) : allUsers?.data?.length === 0 ? (
              <div className="empty-state">No users found.</div>
            ) : (
              allUsers?.data?.map(user => (
                <div className="user-row" key={user.id}>
                  <div className="user-avatar">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div className="user-info">
                    <h4 className='username'>{user.name}</h4>
                    <p>{user.email}</p>
                  </div>
                  <div className="user-status">
                    <span className={`status-badge ${user.verified ? 'verified' : 'pending'}`}>
                      {user.verified ? 'Verified' : 'Pending'}
                    </span>
                    <span className="join-date">
                      Joined {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="card-footer">
            <Link to="/admin/users">View All Users</Link>
          </div>
        </div>
      </div>

      {/* Wallet Analytics */}
      {/* <div className="content-card analytics-card">
        <div className="card-header">
          <h3  className='icon'><BsGraphUp className="icon" /> Wallet Analytics</h3>
          <div className="time-filter">
            <button className="active">24h</button>
            <button>7d</button>
            <button>30d</button>
            <button>90d</button>
          </div>
        </div>
        <div className="analytics-content">
          <div className="analytics-chart">
            <div className="chart-placeholder">
              <BsFillBarChartFill className="chart-icon" />
              <p>Wallet activity chart</p>
            </div>
          </div>
          <div className="analytics-stats">
            <div className="analytics-stat">
              <h4>Active Users</h4>
              <p>{walletStats.activeUsers}</p>
              <span className="positive-change">+12%</span>
            </div>
            <div className="analytics-stat">
              <h4>Pending Transactions</h4>
              <p>{walletStats.pendingTransactions}</p>
              <span className="negative-change">-3%</span>
            </div>
            <div className="analytics-stat">
              <h4>New Users (7d)</h4>
              <p>142</p>
              <span className="positive-change">+8%</span>
            </div>
            <div className="analytics-stat">
              <h4>Avg. Transaction</h4>
              <p>$1,245.50</p>
              <span className="positive-change">+5%</span>
            </div>
          </div>
        </div>
      </div> */}

    </div>
  );
};

export default AdminDashboard;