import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    HiHome,
    HiSearch,
    HiCollection,
    HiPencilAlt,
    HiHeart,
    HiCog,
    HiPlus,
    HiLogout,
    HiChevronLeft,
    HiChevronRight,
    HiUserCircle
} from 'react-icons/hi';
import { useState } from 'react';
import clsx from 'clsx';

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const { logout, user } = useAuth(); // Assuming useAuth exposes 'user'
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { icon: HiHome, label: 'Home', path: '/dashboard' },
        { icon: HiSearch, label: 'Search', path: '/search' },
        { icon: HiCollection, label: 'My Library', path: '/library' },
        { icon: HiPencilAlt, label: 'Notes', path: '/notes' },
        { icon: HiHeart, label: 'Favorites', path: '/favorites' },
        { icon: HiCog, label: 'Settings', path: '/settings' },
    ];

    return (
        <motion.div
            initial={false}
            animate={{ width: collapsed ? 80 : 260 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-screen bg-surface-950 border-r border-white/10 flex flex-col fixed left-0 top-0 z-50 flex-shrink-0"
        >
            {/* Header / New Chat */}
            <div className="p-4">
                <div onClick={() => !collapsed && navigate('/dashboard')} className={clsx("flex items-center gap-2 mb-6 cursor-pointer", collapsed && "justify-center")}>
                    <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0">
                         <span className="font-bold text-white">K</span>
                    </div>
                    {!collapsed && (
                        <span className="text-lg font-semibold text-white tracking-tight">KnowDex</span>
                    )}
                </div>

                <button
                    onClick={() => navigate('/chat/new')}
                    className={clsx(
                        "flex items-center gap-2 rounded-lg border border-white/20 transition-all hover:bg-white/5",
                        collapsed ? "p-3 justify-center" : "px-3 py-2 w-full"
                    )}
                >
                    <HiPlus className="text-lg" />
                    {!collapsed && <span className="text-sm font-medium">New Chat</span>}
                </button>
            </div>

            {/* Nav Items */}
            <div className="flex-1 overflow-y-auto py-2 px-3 space-y-1 scrollbar-hide">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => clsx(
                            "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group",
                            isActive
                                ? "bg-white/10 text-white"
                                : "text-surface-400 hover:text-white hover:bg-white/5"
                        )}
                        title={collapsed ? item.label : undefined}
                    >
                        <item.icon className="text-xl flex-shrink-0" />
                        {!collapsed && (
                            <span className="text-sm font-medium truncat">{item.label}</span>
                        )}
                    </NavLink>
                ))}
            </div>

            {/* User Profile / Logout */}
            <div className="p-4 border-t border-white/10">
                <div className={clsx("flex items-center gap-3", collapsed ? "justify-center" : "")}>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {/* Placeholder for user avatar */}
                       <HiUserCircle className="w-full h-full text-white/80" />
                    </div>
                    {!collapsed && (
                        <div className="flex-1 overflow-hidden">
                            <h4 className="text-sm font-medium text-white truncate">User Account</h4>
                            <button onClick={handleLogout} className="text-xs text-surface-400 hover:text-white flex items-center gap-1 mt-0.5">
                                <HiLogout size={12} /> Log out
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Collapse Toggle (Optional, can be placed differently as per ChatGPT UI usually doesn't have a visible toggle always, but good for UX) */}
             <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-1/2 w-6 h-6 rounded-full bg-surface-800 border border-white/10 flex items-center justify-center text-surface-400 hover:text-white hover:bg-surface-700 transition-colors z-50 text-xs shadow-xl"
            >
                {collapsed ? <HiChevronRight strokeWidth={2} /> : <HiChevronLeft strokeWidth={2} />}
            </button>
        </motion.div>
    );
}
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
