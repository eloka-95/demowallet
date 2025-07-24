import { NavLink } from 'react-router-dom';
import { FiMenu, FiX, FiUsers, FiDollarSign, FiClock, FiWallet, FiLock } from 'react-icons/fi';

export default function AdminSidebar({ isOpen, toggleSidebar }) {
    const navItems = [
        { path: '/admin', icon: <FiMenu />, text: 'Dashboard' },
        { path: '/admin/users', icon: <FiUsers />, text: 'Users' },
        { path: '/admin/cryptocurrency', icon: <FiDollarSign />, text: 'Cryptocurrency' },
        { path: '/admin/history', icon: <FiClock />, text: 'History' },
        { path: '/admin/wallets', icon: <FiWallet />, text: 'Wallets' },
        { path: '/admin/wallet-Phrase', icon: <FiLock />, text: 'Wallet Freeze' },
    ];

    return (
        <aside className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                <button onClick={toggleSidebar} className="toggle-btn">
                    {isOpen ? <FiX /> : <FiMenu />}
                </button>
                {isOpen && <h3>Admin Panel</h3>}
            </div>
            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        to={item.path}
                        key={item.path}
                        className={({ isActive }) =>
                            `nav-item ${isActive ? 'active' : ''}`
                        }
                    >
                        <span className="nav-icon">{item.icon}</span>
                        {isOpen && <span className="nav-text">{item.text}</span>}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}