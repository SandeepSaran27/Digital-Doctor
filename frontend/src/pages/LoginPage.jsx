/*import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { loginUser, clearError } from '@/store/slices/authSlice';
import { toast } from 'react-toastify';

const LoginPage = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((s) => s.auth);
    const { register, handleSubmit, formState: { errors } } = useForm();

    useEffect(() => {
        if (isAuthenticated) navigate('/dashboard', { replace: true });
        return () => { dispatch(clearError()); };
    }, [isAuthenticated, navigate, dispatch]);

    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    const onSubmit = (data) => dispatch(loginUser(data));

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-900 p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            </div>

            <div className="glass rounded-3xl p-8 w-full max-w-md animate-slide-up relative">
                <div className="text-center mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg mx-auto mb-4">
                        D
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Digital Doctor</h1>
                    <p className="text-slate-500 text-sm mt-1">RMP Clinic Management System</p>
                </div>

                <div className="text-center mb-6">
                    <Link to="/" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center gap-1 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="label">{t('auth.email')}</label>
                        <input
                            className={`input ${errors.email ? 'border-danger-400' : ''}`}
                            type="email"
                            placeholder="doctor@digitaldoctor.com"
                            {...register('email', { required: 'Email is required' })}
                        />
                        {errors.email && <p className="text-danger-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="label mb-0">{t('auth.password')}</label>
                            <a href="#" className="text-xs text-primary-600 hover:underline">{t('auth.forgotPassword')}</a>
                        </div>
                        <input
                            className={`input ${errors.password ? 'border-danger-400' : ''}`}
                            type="password"
                            placeholder="••••••••"
                            {...register('password', { required: 'Password is required' })}
                        />
                        {errors.password && <p className="text-danger-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    <button type="submit" className="btn-primary w-full justify-center text-base py-3" disabled={loading}>
                        {loading ? (
                            <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />&nbsp;Signing in...</>
                        ) : t('auth.login')}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-6">
                    {t('auth.noAccount')}&nbsp;
                    <Link to="/register" className="text-primary-600 font-semibold hover:underline">{t('auth.register')}</Link>
                </p>

                <div className="mt-6 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-xs text-slate-500 space-y-1">
                    <p className="font-semibold text-slate-600 dark:text-slate-300 mb-1">Demo Accounts</p>
                    {[
                        ['Admin', 'admin@digitaldoctor.com', 'Admin@1234'],
                        ['Doctor', 'doctor@digitaldoctor.com', 'Doctor@1234'],
                        ['Receptionist', 'receptionist@digitaldoctor.com', 'Recept@1234'],
                        ['Patient', 'patient@digitaldoctor.com', 'Patient@1234'],
                    ].map(([role, email, pw]) => (
                        <p key={role}><span className="font-medium text-slate-600 dark:text-slate-400 w-20 inline-block">{role}:</span> {email} / {pw}</p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
*/

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { loginUser, clearError } from '@/store/slices/authSlice';
import { toast } from 'react-toastify';

const ROLES = [
    {
        role: 'Doctor',
        subtitle: 'Medical Professional',
        color: 'from-cyan-500 to-blue-600',
        shadow: 'shadow-cyan-500/20',
        accent: 'border-cyan-500 bg-cyan-500/10 text-cyan-400',
        icon: (
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    {
        role: 'Patient',
        subtitle: 'Health Seeker',
        color: 'from-rose-500 to-pink-600',
        shadow: 'shadow-rose-500/20',
        accent: 'border-rose-500 bg-rose-500/10 text-rose-400',
        icon: (
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        ),
    },
    {
        role: 'Admin',
        subtitle: 'System Administrator',
        color: 'from-violet-500 to-purple-600',
        shadow: 'shadow-violet-500/20',
        accent: 'border-violet-500 bg-violet-500/10 text-violet-400',
        icon: (
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
    },
];

const roleCredentials = {
    Doctor:  { email: 'doctor@digitaldoctor.com',  password: 'Doctor@1234'  },
    Patient: { email: 'patient@digitaldoctor.com', password: 'Patient@1234' },
    Admin:   { email: 'admin@digitaldoctor.com',   password: 'Admin@1234'   },
};

const LoginPage = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((s) => s.auth);
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();
    const [selectedRole, setSelectedRole] = useState(null);

    useEffect(() => {
        if (isAuthenticated) navigate('/dashboard', { replace: true });
        return () => { dispatch(clearError()); };
    }, [isAuthenticated, navigate, dispatch]);

    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    const handleRoleSelect = (roleObj) => {
        setSelectedRole(roleObj);
        const creds = roleCredentials[roleObj.role];
        setValue('email',    creds.email,    { shouldValidate: false });
        setValue('password', creds.password, { shouldValidate: false });
    };

    const handleBack = () => {
        setSelectedRole(null);
        reset();
    };

    const onSubmit = (data) => dispatch(loginUser(data));

    /* ── Role selection screen ── */
    if (!selectedRole) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4 font-sans">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" />
                    <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl" />
                </div>

                <div className="relative w-full max-w-sm">
                    {/* Brand */}
                    <div className="text-center mb-10">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20">
                            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4m0 12v4M2 12h4m12 0h4" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-extrabold text-white">Digital Doctor</h1>
                        <p className="text-slate-400 text-sm mt-1">Who are you logging in as?</p>
                    </div>

                    {/* Role cards */}
                    <div className="flex flex-col gap-4">
                        {ROLES.map((r) => (
                            <button
                                key={r.role}
                                type="button"
                                onClick={() => handleRoleSelect(r)}
                                className="w-full flex items-center gap-4 bg-slate-800/60 border border-slate-700/50 hover:border-slate-500 backdrop-blur-xl rounded-2xl p-5 text-left transition-all hover:bg-slate-700/50 group"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center shadow-lg ${r.shadow} shrink-0`}>
                                    {r.icon}
                                </div>
                                <div className="flex-1">
                                    <p className="text-white font-semibold text-base">{r.role}</p>
                                    <p className="text-slate-400 text-xs mt-0.5">{r.subtitle}</p>
                                </div>
                                <svg className="w-5 h-5 text-slate-600 group-hover:text-slate-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <Link to="/" className="text-xs text-slate-600 hover:text-slate-400 inline-flex items-center gap-1 transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    /* ── Login form screen (role selected) ── */
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4 font-sans">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" />
            </div>

            <div className="relative w-full max-w-md bg-slate-800/60 border border-slate-700/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8">

                {/* Back button */}
                <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors mb-6"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Change role
                </button>

                {/* Selected role logo */}
                <div className="text-center mb-7">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedRole.color} flex items-center justify-center mx-auto mb-4 shadow-lg ${selectedRole.shadow}`}>
                        {selectedRole.icon}
                    </div>
                    <h1 className="text-2xl font-extrabold text-white tracking-tight">{selectedRole.role} Login</h1>
                    <p className="text-slate-400 text-sm mt-1">{selectedRole.subtitle}</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="flex items-center gap-1.5 text-sm font-medium text-slate-300 mb-1.5">
                            <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {t('auth.email')}
                        </label>
                        <input
                            className={`w-full bg-slate-700/60 border ${errors.email ? 'border-red-500' : 'border-slate-600'} text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition`}
                            type="email"
                            placeholder="doctor@digitaldoctor.com"
                            {...register('email', { required: 'Email is required' })}
                        />
                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-300">
                                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                {t('auth.password')}
                            </label>
                            <a href="#" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                                {t('auth.forgotPassword')}
                            </a>
                        </div>
                        <input
                            className={`w-full bg-slate-700/60 border ${errors.password ? 'border-red-500' : 'border-slate-600'} text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition`}
                            type="password"
                            placeholder="••••••••"
                            {...register('password', { required: 'Password is required' })}
                        />
                        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r ${selectedRole.color} disabled:opacity-60 text-white font-semibold rounded-xl py-3 text-sm transition-all shadow-lg ${selectedRole.shadow} hover:opacity-90`}
                    >
                        {loading ? (
                            <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing in...</>
                        ) : `Sign in as ${selectedRole.role}`}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-6">
                    {t('auth.noAccount')}&nbsp;
                    <Link to="/register" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">
                        {t('auth.register')}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
