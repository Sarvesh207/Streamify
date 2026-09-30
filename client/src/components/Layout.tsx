import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="min-h-screen text-gray-100 bg-black font-sans selection:bg-purple-500 selection:text-white">
            <Navbar toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} />
            
            <div className={`p-4 pt-20 pb-20 sm:pb-4 min-h-screen transition-all duration-300 ${isSidebarOpen ? 'sm:ml-64' : 'sm:ml-20'}`}>
                <main className="mx-auto max-w-screen-2xl">
                    {children}
                </main>
            </div>
            
            <BottomNav />
           
        </div>
    );
}
