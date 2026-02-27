import { useEffect } from 'react';
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
            {/* Background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            </div>

            <div className="glass rounded-3xl p-8 w-full max-w-md animate-slide-up relative">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg mx-auto mb-4">
                        D
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Digital Doctor</h1>
                    <p className="text-slate-500 text-sm mt-1">RMP Clinic Management System</p>
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

                {/* Demo credentials */}
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
