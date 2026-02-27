import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { registerUser, clearError } from '@/store/slices/authSlice';
import { toast } from 'react-toastify';

const ROLES = ['patient', 'doctor', 'receptionist', 'admin'];

const RegisterPage = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((s) => s.auth);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    useEffect(() => {
        if (isAuthenticated) navigate('/dashboard', { replace: true });
        return () => dispatch(clearError());
    }, [isAuthenticated, navigate, dispatch]);

    useEffect(() => { if (error) toast.error(error); }, [error]);

    const onSubmit = (data) => dispatch(registerUser(data));

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-900 p-4">
            <div className="glass rounded-3xl p-8 w-full max-w-md animate-slide-up">
                <div className="text-center mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xl font-bold shadow mx-auto mb-3">D</div>
                    <h1 className="text-xl font-extrabold text-slate-800 dark:text-white">Create Account</h1>
                    <p className="text-sm text-slate-500">Join Digital Doctor</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div>
                        <label className="label">{t('auth.name')}</label>
                        <input className="input" placeholder="Dr. Rajesh Kumar" {...register('name', { required: true })} />
                    </div>

                    <div>
                        <label className="label">{t('auth.email')}</label>
                        <input className="input" type="email" placeholder="doctor@example.com" {...register('email', { required: true })} />
                    </div>

                    <div>
                        <label className="label">{t('auth.phone')}</label>
                        <input className="input" type="tel" placeholder="9000000000" {...register('phone', { required: true, pattern: /^[6-9]\d{9}$/ })} />
                        {errors.phone && <p className="text-danger-500 text-xs mt-1">Enter a valid 10-digit phone</p>}
                    </div>

                    <div>
                        <label className="label">{t('auth.role')}</label>
                        <select className="input" {...register('role', { required: true })}>
                            <option value="">-- Select Role --</option>
                            {ROLES.map((r) => <option key={r} value={r} className="capitalize">{r}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="label">{t('auth.password')}</label>
                        <input className="input" type="password" placeholder="Min 8 characters" {...register('password', { required: true, minLength: 8 })} />
                        {errors.password && <p className="text-danger-500 text-xs mt-1">Password must be at least 8 characters</p>}
                    </div>

                    <button type="submit" className="btn-primary w-full justify-center py-3" disabled={loading}>
                        {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : t('auth.register')}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-4">
                    {t('auth.haveAccount')}&nbsp;
                    <Link to="/login" className="text-primary-600 font-semibold hover:underline">{t('auth.login')}</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
