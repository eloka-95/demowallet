import { Outlet, NavLink } from 'react-router-dom';
import { FaHome, FaCog, FaBell, FaExchangeAlt, FaHistory } from 'react-icons/fa';
import { BsCurrencyExchange, BsPeople } from 'react-icons/bs';
import './AppLayout.css';

const UseAdminLayout = () => {
    return (
        <div className="app-layout">
            {/* Top Navigation Bar */}
            <header className="top-nav">
                <div className="logo-container">
                    <div className="logo">
                        {/* <img src="/logo.png" alt="App Logo" /> */}
                    </div>
                </div>
                <div className="notification-icon">
                    <FaBell size={20} />
                    <span className="notification-badge">3</span>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="main-content">
                <Outlet />
            </main>

            {/* Bottom Navigation */}
            <nav className="bottom-nav">
                <NavLink
                    to="/wallet/admin"
                    end
                    className={({ isActive }) =>
                        `nav-button ${isActive ? 'active' : ''}`
                    }
                >
                    <FaHome size={24} />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/wallet/admin/users"
                    className={({ isActive }) =>
                        `nav-button ${isActive ? 'active' : ''}`
                    }
                >
                    <BsPeople size={24} />
                    <span>Users</span>
                </NavLink>

                <NavLink
                    to="/wallet/admin/cryptocurrency"
                    className={({ isActive }) =>
                        `nav-button ${isActive ? 'active' : ''}`
                    }
                >
                    <BsCurrencyExchange size={24} />
                    <span>Crypto</span>
                </NavLink>

                <NavLink
                    to="/wallet/admin/wallets"
                    className={({ isActive }) =>
                        `nav-button ${isActive ? 'active' : ''}`
                    }
                >
                    <FaExchangeAlt size={24} />
                    <span>Wallets</span>
                </NavLink>

                <NavLink
                    to="/wallet/admin/settings"
                    className={({ isActive }) =>
                        `nav-button ${isActive ? 'active' : ''}`
                    }
                >
                    <FaCog size={24} />
                    <span>Settings</span>
                </NavLink>

            </nav>
        </div>
    );
};

export default UseAdminLayout;
