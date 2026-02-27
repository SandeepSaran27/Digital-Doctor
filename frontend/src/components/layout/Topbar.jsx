import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuth from '@/hooks/useAuth';

const LANGS = [
    { code: 'en', label: 'EN' },
    { code: 'te', label: 'తెలుగు' },
];
const Topbar = ({ collapsed, onToggle }) => {
    const { t, i18n } = useTranslation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        if (dark) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', dark ? 'dark' : 'light');
    }, [dark]);

    const changeLang = (code) => {
        i18n.changeLanguage(code);
        localStorage.setItem('lang', code);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header
            className={`
        fixed top-0 right-0 z-20 h-16 flex items-center px-4 gap-3
        bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-700
        transition-all duration-300
        ${collapsed ? 'left-0 lg:left-16' : 'left-0 lg:left-[250px]'}
      `}
        >
            {/* Sidebar toggle */}
            <button
                onClick={onToggle}
                className="btn-ghost p-2 rounded-xl"
                aria-label="Toggle sidebar"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5">
                {LANGS.map((l) => (
                    <button
                        key={l.code}
                        onClick={() => changeLang(l.code)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${i18n.language === l.code
                            ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm'
                            : 'text-slate-500'
                            }`}
                    >
                        {l.label}
                    </button>
                ))}
            </div>

            {/* Dark mode toggle */}
            <button
                onClick={() => setDark((d) => !d)}
                className="btn-ghost p-2 rounded-xl text-xl"
                title="Toggle dark mode"
            >
                {dark ? '☀️' : '🌙'}
            </button>

            {/* User Avatar + Dropdown */}
            <div className="relative">
                <button
                    onClick={() => setShowMenu((s) => !s)}
                    className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-bold">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="hidden sm:block text-left">
                        <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight max-w-[120px] truncate">
                            {user?.name}
                        </div>
                        <div className="text-[10px] text-slate-400 capitalize">{user?.role}</div>
                    </div>
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {showMenu && (
                    <div className="absolute right-0 top-full mt-2 w-44 card py-1 z-50 animate-fade-in">
                        <button
                            onClick={() => { setShowMenu(false); navigate('/profile'); }}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg"
                        >
                            👤 Profile
                        </button>
                        <hr className="my-1 border-slate-100 dark:border-slate-700" />
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-danger-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                            🚪 {t('auth.logout')}
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Topbar;
