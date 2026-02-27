import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const handler = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (!mobile) setSidebarOpen(false);
        };
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);

    const handleToggle = () => {
        if (isMobile) setSidebarOpen((s) => !s);
        else setCollapsed((c) => !c);
    };

    // On mobile: sidebar shown via sidebarOpen (translate off/on screen)
    // On desktop: sidebar shown via collapsed (narrows to icon-only)
    const sidebarCollapsed = isMobile ? !sidebarOpen : collapsed;

    return (
        <div className="min-h-screen bg-[var(--color-bg)] transition-colors duration-200">
            <Sidebar
                collapsed={sidebarCollapsed}
                isMobile={isMobile}
                onClose={() => setSidebarOpen(false)}
            />
            <Topbar
                collapsed={sidebarCollapsed}
                onToggle={handleToggle}
            />
            <main
                className={`
          pt-16 min-h-screen transition-all duration-300
          ${sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-[250px]'}
        `}
            >
                <div className="p-4 sm:p-6 animate-fade-in">{children}</div>
            </main>
        </div>
    );
};

export default Layout;
