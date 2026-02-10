import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
    children: ReactNode;
    showSidebar?: boolean;
}

export default function Layout({ children, showSidebar = true }: LayoutProps) {
    return (
        <div className="flex min-h-screen bg-surface-950 text-white selection:bg-primary-500/30">
            {showSidebar && <Sidebar />}
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`flex-1 ${showSidebar ? 'ml-20 md:ml-[80px]' : ''} relative z-0 flex flex-col items-center w-full`}
            >
                <div className="w-full h-full p-4 md:p-8 overflow-x-hidden">
                    {children}
                </div>

                {/* Background Gradients */}
                <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                    <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary-900/10 blur-[120px]" />
                    <div className="absolute bottom-[0%] left-[0%] w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-[100px]" />
                </div>
            </motion.main>
        </div>
    );
}
