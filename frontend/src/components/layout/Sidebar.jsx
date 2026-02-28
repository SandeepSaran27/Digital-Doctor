/*import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuth from '@/hooks/useAuth';

const navItems = [
    { to: '/dashboard', key: 'dashboard', icon: '🏠', roles: ['admin', 'doctor', 'receptionist', 'patient'] },
    { to: '/patients', key: 'patients', icon: '👥', roles: ['admin', 'doctor', 'receptionist'] },
    { to: '/appointments', key: 'appointments', icon: '📅', roles: ['admin', 'doctor', 'receptionist', 'patient'] },
    { to: '/queue', key: 'queue', icon: '🎫', roles: ['admin', 'doctor', 'receptionist', 'patient'] },
    { to: '/chatbot', key: 'chatbot', icon: '🤖', roles: ['admin', 'doctor', 'patient'] },
    { to: '/symptoms', key: 'symptoms', icon: '🩺', roles: ['admin', 'doctor', 'patient'] },
    { to: '/emergency', key: 'emergency', icon: '🚨', roles: ['admin', 'doctor', 'receptionist'] },
    { to: '/analytics', key: 'analytics', icon: '📊', roles: ['admin', 'doctor'] },
    { to: '/qr-checkin', key: 'qrCheckin', icon: '📷', roles: ['admin', 'receptionist'] },
    { to: '/doctor/calendar', key: 'calendar', icon: '🗓️', roles: ['admin', 'doctor'] },
    { to: '/admin', key: 'admin', icon: '⚙️', roles: ['admin'] },
];

const Sidebar = ({ collapsed, isMobile, onClose }) => {
    const { t } = useTranslation();
    const { role } = useAuth();

    const visible = navItems.filter((n) => n.roles.includes(role));

    return (
        <>
            {isMobile && !collapsed && (
                <div
                    className="fixed inset-0 bg-black/40 z-20 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
          fixed top-0 left-0 h-full z-30 flex flex-col
          bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700
          transition-all duration-300 ease-in-out shadow-lg
          ${collapsed ? '-translate-x-full lg:translate-x-0 lg:w-16' : 'translate-x-0 w-[250px]'}
        `}
            >
                <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-200 dark:border-slate-700 min-h-[64px]">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-lg font-bold shadow">
                        D
                    </div>
                    {!collapsed && (
                        <div>
                            <div className="text-sm font-bold text-slate-800 dark:text-white leading-tight">Digital Doctor</div>
                            <div className="text-xs text-slate-400">RMP Clinic</div>
                        </div>
                    )}
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
                    {visible.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={isMobile ? onClose : undefined}
                            className={({ isActive }) =>
                                `nav-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
                            }
                            title={collapsed ? t(`nav.${item.key}`) : undefined}
                        >
                            <span className="text-lg leading-none">{item.icon}</span>
                            {!collapsed && (
                                <span className="truncate">{t(`nav.${item.key}`)}</span>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {!collapsed && (
                    <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-700">
                        <span className="badge badge-blue capitalize">{role}</span>
                    </div>
                )}
            </aside>
        </>
    );
};

export default Sidebar;
*/

/*import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuth from '@/hooks/useAuth';

const navItems = [
    { to: '/dashboard', key: 'dashboard', icon: '🏠', roles: ['admin', 'doctor', 'receptionist', 'patient'] },
    { to: '/patients', key: 'patients', icon: '👥', roles: ['admin', 'doctor', 'receptionist'] },
    { to: '/appointments', key: 'appointments', icon: '📅', roles: ['admin', 'doctor', 'receptionist'] },
    { to: '/queue', key: 'queue', icon: '🎫', roles: ['admin', 'doctor', 'receptionist', 'patient'] },
    { to: '/chatbot', key: 'chatbot', icon: '🤖', roles: ['admin', 'doctor', 'patient'] },
    { to: '/symptoms', key: 'symptoms', icon: '🩺', roles: ['admin', 'doctor', 'patient'] },
    { to: '/emergency', key: 'emergency', icon: '🚨', roles: ['admin', 'doctor', 'receptionist'] },
    { to: '/analytics', key: 'analytics', icon: '📊', roles: ['admin', 'doctor'] },
    { to: '/qr-checkin', key: 'qrCheckin', icon: '📷', roles: ['admin', 'receptionist'] },
    { to: '/doctor/calendar', key: 'calendar', icon: '🗓️', roles: ['admin', 'doctor'] },
    { to: '/admin', key: 'admin', icon: '⚙️', roles: ['admin'] },
];

const Sidebar = ({ collapsed, isMobile, onClose }) => {
    const { t } = useTranslation();
    const { role } = useAuth();

    const visible = navItems.filter((n) => n.roles.includes(role));

    return (
        <>
            {isMobile && !collapsed && (
                <div
                    className="fixed inset-0 bg-black/40 z-20 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
          fixed top-0 left-0 h-full z-30 flex flex-col
          bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700
          transition-all duration-300 ease-in-out shadow-lg
          ${collapsed ? '-translate-x-full lg:translate-x-0 lg:w-16' : 'translate-x-0 w-[250px]'}
        `}
            >
                <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-200 dark:border-slate-700 min-h-[64px]">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-lg font-bold shadow">
                        D
                    </div>
                    {!collapsed && (
                        <div>
                            <div className="text-sm font-bold text-slate-800 dark:text-white leading-tight">Digital Doctor</div>
                            <div className="text-xs text-slate-400">RMP Clinic</div>
                        </div>
                    )}
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
                    {visible.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={isMobile ? onClose : undefined}
                            className={({ isActive }) =>
                                `nav-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
                            }
                            title={collapsed ? t(`nav.${item.key}`) : undefined}
                        >
                            <span className="text-lg leading-none">{item.icon}</span>
                            {!collapsed && (
                                <span className="truncate">{t(`nav.${item.key}`)}</span>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {!collapsed && (
                    <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-700">
                        <span className="badge badge-blue capitalize">{role}</span>
                    </div>
                )}
            </aside>
        </>
    );
};

export default Sidebar;
*/

/*import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuth from '@/hooks/useAuth';

const navItems = [
    { to: '/dashboard', key: 'dashboard', icon: '🏠', roles: ['admin', 'doctor', 'receptionist', 'patient'] },
    { to: '/patients', key: 'patients', icon: '👥', roles: ['admin', 'doctor', 'receptionist'] },
    { to: '/appointments', key: 'appointments', icon: '📅', roles: ['admin', 'doctor', 'receptionist'] },
    { to: '/appointments/book', key: 'bookAppointments', icon: '📅', roles: ['patient'] },
    { to: '/queue', key: 'queue', icon: '🎫', roles: ['admin', 'doctor', 'receptionist', 'patient'] },
    { to: '/chatbot', key: 'chatbot', icon: '🤖', roles: ['admin', 'doctor', 'patient'] },
    { to: '/symptoms', key: 'symptoms', icon: '🩺', roles: ['admin', 'doctor', 'patient'] },
    { to: '/emergency', key: 'emergency', icon: '🚨', roles: ['admin', 'doctor', 'receptionist'] },
    { to: '/analytics', key: 'analytics', icon: '📊', roles: ['admin', 'doctor'] },
    { to: '/qr-checkin', key: 'qrCheckin', icon: '📷', roles: ['admin', 'receptionist'] },
    { to: '/doctor/calendar', key: 'calendar', icon: '🗓️', roles: ['admin', 'doctor'] },
    { to: '/admin', key: 'admin', icon: '⚙️', roles: ['admin'] },
];

const Sidebar = ({ collapsed, isMobile, onClose }) => {
    const { t } = useTranslation();
    const { role } = useAuth();

    const visible = navItems.filter((n) => n.roles.includes(role));

    return (
        <>
            {isMobile && !collapsed && (
                <div
                    className="fixed inset-0 bg-black/40 z-20 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
          fixed top-0 left-0 h-full z-30 flex flex-col
          bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700
          transition-all duration-300 ease-in-out shadow-lg
          ${collapsed ? '-translate-x-full lg:translate-x-0 lg:w-16' : 'translate-x-0 w-[250px]'}
        `}
            >
                <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-200 dark:border-slate-700 min-h-[64px]">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-lg font-bold shadow">
                        D
                    </div>
                    {!collapsed && (
                        <div>
                            <div className="text-sm font-bold text-slate-800 dark:text-white leading-tight">Digital Doctor</div>
                            <div className="text-xs text-slate-400">RMP Clinic</div>
                        </div>
                    )}
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
                    {visible.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={isMobile ? onClose : undefined}
                            className={({ isActive }) =>
                                `nav-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
                            }
                            title={collapsed ? t(`nav.${item.key}`) : undefined}
                        >
                            <span className="text-lg leading-none">{item.icon}</span>
                            {!collapsed && (
                                <span className="truncate">{t(`nav.${item.key}`)}</span>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {!collapsed && (
                    <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-700">
                        <span className="badge badge-blue capitalize">{role}</span>
                    </div>
                )}
            </aside>
        </>
    );
};

export default Sidebar;
*/

import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuth from '@/hooks/useAuth';

const navItems = [
    { to: '/dashboard', key: 'dashboard', icon: '🏠', roles: ['admin', 'doctor', 'receptionist', 'patient'] },
    { to: '/patients', key: 'patients', icon: '👥', roles: ['admin', 'doctor', 'receptionist'] },
    { to: '/appointments', key: 'appointments', icon: '📅', roles: ['admin', 'doctor', 'receptionist', 'patient'] },
    { to: '/appointments/book', key: 'bookAppointments', icon: '📅', roles: ['patient'] },
    { to: '/patients/me', key: 'myHistory', icon: '📝', roles: ['patient'] },
    { to: '/queue', key: 'queue', icon: '🎫', roles: ['admin', 'doctor', 'receptionist'] },
    { to: '/chatbot', key: 'chatbot', icon: '🤖', roles: ['admin', 'doctor', 'patient'] },
    { to: '/symptoms', key: 'symptoms', icon: '🩺', roles: ['admin', 'patient'] },
    { to: '/emergency', key: 'emergency', icon: '🚨', roles: ['admin', 'doctor', 'receptionist'] },
    { to: '/analytics', key: 'analytics', icon: '📊', roles: ['admin', 'doctor'] },
    { to: '/qr-checkin', key: 'qrCheckin', icon: '📷', roles: ['admin', 'receptionist'] },
    { to: '/doctor/calendar', key: 'calendar', icon: '🗓️', roles: ['admin'] },
    { to: '/admin', key: 'admin', icon: '⚙️', roles: ['admin'] },
];

const Sidebar = ({ collapsed, isMobile, onClose }) => {
    const { t } = useTranslation();
    const { role } = useAuth();

    const visible = navItems.filter((n) => n.roles.includes(role));

    return (
        <>
            {/* Mobile overlay */}
            {isMobile && !collapsed && (
                <div
                    className="fixed inset-0 bg-black/40 z-20 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
          fixed top-0 left-0 h-full z-30 flex flex-col
          bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700
          transition-all duration-300 ease-in-out shadow-lg
          ${collapsed ? '-translate-x-full lg:translate-x-0 lg:w-16' : 'translate-x-0 w-[250px]'}
        `}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-200 dark:border-slate-700 min-h-[64px]">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-lg font-bold shadow">
                        D
                    </div>
                    {!collapsed && (
                        <div>
                            <div className="text-sm font-bold text-slate-800 dark:text-white leading-tight">Digital Doctor</div>
                            <div className="text-xs text-slate-400">RMP Clinic</div>
                        </div>
                    )}
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
                    {visible.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={isMobile ? onClose : undefined}
                            className={({ isActive }) =>
                                `nav-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
                            }
                            title={collapsed ? t(`nav.${item.key}`) : undefined}
                        >
                            <span className="text-lg leading-none">{item.icon}</span>
                            {!collapsed && (
                                <span className="truncate">{t(`nav.${item.key}`)}</span>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Role badge */}
                {!collapsed && (
                    <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-700">
                        <span className="badge badge-blue capitalize">{role}</span>
                    </div>
                )}
            </aside>
        </>
    );
};

export default Sidebar;
