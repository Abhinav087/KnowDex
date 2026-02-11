import { motion } from 'framer-motion';
import { ReactNode, useState, useEffect } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
    children: ReactNode;
    showSidebar?: boolean;
}

export default function Layout({ children, showSidebar = true }: LayoutProps) {
    // Note: detailed sidebar state management would normally be lifted to context
    // For now we assume a standard layout spacer
    return (
        <div className="flex min-h-screen bg-white dark:bg-surface-950 text-slate-900 dark:text-white transition-colors duration-200">
            {showSidebar && <Sidebar />}
            
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className={`flex-1 relative z-0 flex flex-col items-center w-full pl-20 md:pl-[80px] transition-[padding] duration-300`}
            >
                <div className="w-full h-screen overflow-hidden flex flex-col">
                    {children}
                </div>
            </motion.main>
        </div>
    );
}
