import { NavLink } from 'react-router-dom';
import { FiUsers, FiDollarSign, FiClock, FiWallet, FiLock } from 'react-icons/fi';

export default function AdminBottomBar() {
    const navItems = [
        { path: '/wallet/admin/users', icon: <FiUsers />, text: 'Users' },
        { path: '/wallet/admin/cryptocurrency', icon: <FiDollarSign />, text: 'Crypto' },
        { path: '/wallet/admin/history', icon: <FiClock />, text: 'History' },
        { path: '/wallet/admin/wallets', icon: <FiWallet />, text: 'Wallets' },
        { path: '/wallet/admin/wallet-Phrase', icon: <FiLock />, text: 'Freeze' },
    ];

    return (
        <div className="admin-bottom-bar">
            {navItems.map((item) => (
                <NavLink
                    to={item.path}
                    key={item.path}
                    className={({ isActive }) =>
                        `bottom-nav-item ${isActive ? 'active' : ''}`
                    }
                >
                    <span className="bottom-nav-icon">{item.icon}</span>
                    <span className="bottom-nav-text">{item.text}</span>
                </NavLink>
            ))}
        </div>
    );
}