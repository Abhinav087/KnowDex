import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    HiHome,
    HiChip,
    HiLogout,
    HiChevronLeft,
    HiChevronRight,
    HiLightningBolt,
    HiFolder
} from 'react-icons/hi';
import { useState } from 'react';
import clsx from 'clsx';

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { icon: HiHome, label: 'Dashboard', path: '/dashboard' },
    ];

    return (
        <motion.div
            initial={false}
            animate={{ width: collapsed ? 80 : 280 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-screen bg-surface-950/80 backdrop-blur-xl border-r border-white/5 flex flex-col fixed left-0 top-0 z-50 shadow-2xl shadow-black/50"
        >
            {/* Header */}
            <div className="h-20 flex items-center px-6 border-b border-white/5 relative">
                <div className={clsx("flex items-center gap-3 overflow-hidden", collapsed && "justify-center")}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex-shrink-0 flex items-center justify-center shadow-lg shadow-primary-500/20 relative group">
                        <div className="absolute inset-0 bg-primary-400 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                        <HiChip className="text-white text-xl relative z-10" />
                    </div>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex flex-col"
                            >
                                <span className="text-lg font-bold text-white tracking-tight">
                                    Knowdex<span className="text-primary-400">AI</span>
                                </span>
                                <span className="text-[10px] font-medium text-surface-400 uppercase tracking-widest">Research Hub</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-surface-800 border border-white/10 rounded-full flex items-center justify-center text-surface-200 hover:text-white hover:bg-surface-700 transition-all shadow-lg hover:scale-110 active:scale-95 z-50"
                >
                    {collapsed ? <HiChevronRight size={14} /> : <HiChevronLeft size={14} />}
                </button>
            </div>

            {/* Nav Items */}
            <div className="flex-1 py-8 px-3 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => clsx(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                            isActive
                                ? "bg-primary-600/10 text-primary-400 shadow-inner"
                                : "text-surface-400 hover:text-white hover:bg-white/5"
                        )}
                        title={collapsed ? item.label : undefined}
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute left-0 w-1 h-6 bg-primary-500 rounded-r-full"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    />
                                )}
                                <item.icon className={clsx("text-xl flex-shrink-0 relative z-10 transition-colors", isActive ? "text-primary-400" : "group-hover:text-white")} />
                                {!collapsed && (
                                    <span className="font-medium relative z-10 text-sm tracking-wide">{item.label}</span>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}

                {!collapsed && (
                    <div className="mt-8 px-4">
                        <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3 pl-2">Tools</h3>
                        <div className="space-y-1">
                            <button className="w-full flex items-center gap-3 px-4 py-2 text-surface-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm text-left">
                                <HiFolder className="text-lg opacity-50" />
                                <span>Library</span>
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-2 text-surface-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm text-left">
                                <HiLightningBolt className="text-lg opacity-50" />
                                <span>Automations</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* User Section (Bottom) */}
            <div className="p-4 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    className={clsx(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-surface-400 hover:text-red-400 hover:bg-red-500/10 transition-all group",
                        collapsed && "justify-center"
                    )}
                >
                    <HiLogout className="text-xl transition-transform group-hover:-translate-x-1" />
                    {!collapsed && <span className="font-medium text-sm">Sign Out</span>}
                </button>
            </div>
        </motion.div>
    );
}
