import { Link, useLocation } from 'react-router-dom';
import { Home, Scan, FileText } from 'lucide-react';

const BottomNav = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', label: '首頁', icon: Home },
        { path: '/scan', label: '掃描', icon: Scan },
        { path: '/generate', label: 'Qrcode', icon: FileText },
    ];

    return (
        <div className="bottom-nav">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-item ${isActive ? 'active' : ''}`}
                    >
                        <item.icon size={24} />
                        <span>{item.label}</span>
                    </Link>
                );
            })}
        </div>
    );
};

export default BottomNav;
