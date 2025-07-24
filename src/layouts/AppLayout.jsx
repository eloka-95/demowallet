import { Outlet, NavLink } from 'react-router-dom';
import { FaHome, FaCog, FaBell, FaExchangeAlt } from 'react-icons/fa';
import { BsCurrencyExchange } from 'react-icons/bs';
import './AppLayout.css';

const AppLayout = () => {
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
                <NavLink to="/" className={({ isActive }) =>
                    `nav-button ${isActive ? 'active' : ''}`}>
                    <FaHome size={24} />
                    <span>Home</span>
                </NavLink>
                <NavLink to="/buy" className={({ isActive }) =>
                    `nav-button ${isActive ? 'active' : ''}`}>
                    <BsCurrencyExchange size={24} />
                    <span>Buy</span>
                </NavLink>
                <NavLink to="/swap" className={({ isActive }) =>
                    `nav-button ${isActive ? 'active' : ''}`}>
                    <FaExchangeAlt size={24} />
                    <span>Swap</span>
                </NavLink>
                <NavLink to="/settings" className={({ isActive }) =>
                    `nav-button ${isActive ? 'active' : ''}`}>
                    <FaCog size={24} />
                    <span>Settings</span>
                </NavLink>
            </nav>
        </div>
    );
};

export default AppLayout;