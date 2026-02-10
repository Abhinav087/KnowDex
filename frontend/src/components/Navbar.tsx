import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineAcademicCap, HiOutlineLogout } from 'react-icons/hi';

export default function Navbar() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-600/30 group-hover:shadow-primary-500/50 transition-all">
                        <HiOutlineAcademicCap className="text-white text-lg" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-white to-surface-200/80 bg-clip-text text-transparent">
                        Knowdex AI
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" className="text-surface-200/70 hover:text-white transition-colors text-sm font-medium">
                                Dashboard
                            </Link>
                            <button onClick={handleLogout} className="flex items-center gap-2 text-surface-200/50 hover:text-red-400 transition-colors text-sm">
                                <HiOutlineLogout className="text-lg" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-surface-200/70 hover:text-white transition-colors text-sm font-medium">
                                Login
                            </Link>
                            <Link to="/register" className="btn-primary text-sm !py-2 !px-4">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
