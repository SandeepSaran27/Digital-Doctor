/*import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchQueue } from '@/store/slices/appointmentSlice';
import { updateStatusThunk } from '@/store/slices/appointmentSlice';
import useAutoRefresh from '@/hooks/useAutoRefresh';
import useAuth from '@/hooks/useAuth';

const STATUS_COLORS = {
    waiting: 'badge-yellow',
    'in-consultation': 'badge-blue',
    completed: 'badge-green',
    cancelled: 'badge-red',
};

const QueueBoard = ({ doctorId }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { role } = useAuth();
    const { queue, loading } = useSelector((s) => s.appointments);

    useAutoRefresh(() => {
        dispatch(fetchQueue(doctorId ? { doctor: doctorId } : {}));
    }, 15000);

    const updateStatus = (id, status) => dispatch(updateStatusThunk({ id, status }));

    if (loading && !queue.length) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 rounded-2xl shimmer" />
                ))}
            </div>
        );
    }

    if (!queue.length) {
        return (
            <div className="card text-center py-12 text-slate-400">
                <div className="text-4xl mb-2">🎫</div>
                <p className="font-medium">No patients in queue</p>
                <p className="text-sm mt-1">Queue refreshes every 15 seconds</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="section-title mb-0">{t('nav.queue')}</h3>
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="w-2 h-2 bg-accent-400 rounded-full dot-blink" />
                    Live — refreshes every 15s
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {queue.map((appt) => (
                    <div
                        key={appt._id}
                        className={`card hover:shadow-md transition-all group ${appt.status === 'in-consultation' ? 'ring-2 ring-primary-400' : ''
                            }`}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-lg font-bold shadow">
                                {appt.tokenNumber}
                            </div>
                            <span className={`badge ${STATUS_COLORS[appt.status] || 'badge-gray'}`}>
                                {t(`appointments.${appt.status?.replace('-', '')}`) || appt.status}
                            </span>
                        </div>

                        <p className="font-semibold text-slate-800 dark:text-white text-sm truncate">
                            {appt.patient?.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">{appt.chiefComplaint || 'General Consultation'}</p>

                        {(role === 'doctor' || role === 'admin') && appt.status === 'waiting' && (
                            <div className="mt-3 flex gap-2">
                                <button
                                    onClick={() => updateStatus(appt._id, 'in-consultation')}
                                    className="flex-1 btn-primary text-xs py-1.5"
                                >
                                    Call In
                                </button>
                            </div>
                        )}
                        {(role === 'doctor' || role === 'admin') && appt.status === 'in-consultation' && (
                            <div className="mt-3 flex gap-2">
                                <button
                                    onClick={() => updateStatus(appt._id, 'completed')}
                                    className="flex-1 btn-accent text-xs py-1.5"
                                >
                                    ✓ Done
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QueueBoard;
*/

import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchQueue } from '@/store/slices/appointmentSlice';
import { updateStatusThunk } from '@/store/slices/appointmentSlice';
import useAutoRefresh from '@/hooks/useAutoRefresh';
import useAuth from '@/hooks/useAuth';

const STATUS_COLORS = {
    waiting: 'badge-yellow',
    'in-consultation': 'badge-blue',
    completed: 'badge-green',
    cancelled: 'badge-red',
};

const QueueBoard = ({ doctorId }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { role } = useAuth();
    const { queue, loading } = useSelector((s) => s.appointments);

    useAutoRefresh(() => {
        dispatch(fetchQueue(doctorId ? { doctor: doctorId } : {}));
    }, 15000);

    const updateStatus = (id, status) => dispatch(updateStatusThunk({ id, status }));

    if (loading && !queue.length) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 rounded-2xl shimmer" />
                ))}
            </div>
        );
    }

    if (!queue.length) {
        return (
            <div className="card text-center py-12 text-slate-400">
                <div className="text-4xl mb-2">🎫</div>
                <p className="font-medium">No patients in queue</p>
                <p className="text-sm mt-1">Queue refreshes every 15 seconds</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="section-title mb-0">{t('nav.queue')}</h3>
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="w-2 h-2 bg-accent-400 rounded-full dot-blink" />
                    Live — refreshes every 15s
                </span>
            </div>

            {/* Token cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {queue.map((appt) => (
                    <div
                        key={appt._id}
                        className={`card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group ${appt.status === 'in-consultation' ? 'ring-2 ring-primary-500 shadow-lg shadow-primary-500/20 bg-gradient-to-b from-primary-50/50 to-white dark:from-primary-900/10 dark:to-slate-900 border-primary-200 dark:border-primary-800' : 'border border-slate-100 dark:border-slate-800'
                            }`}
                    >
                        {/* Token number & Status */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-primary-500/30 ring-4 ring-white dark:ring-slate-900 relative">
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center">
                                    <span className={`w-2 h-2 rounded-full ${appt.status === 'in-consultation' ? 'bg-primary-500 animate-pulse' : 'bg-slate-300'}`} />
                                </span>
                                {appt.tokenNumber}
                            </div>
                            <span className={`badge px-3 py-1.5 rounded-full ${STATUS_COLORS[appt.status] || 'badge-gray'} shadow-sm font-semibold tracking-wide uppercase text-[10px]`}>
                                {t(`appointments.${appt.status?.replace('-', '')}`) || appt.status}
                            </span>
                        </div>

                        {/* Patient info */}
                        <div className="p-1">
                            <p className="font-bold text-slate-800 dark:text-white text-base truncate flex items-center gap-2">
                                {appt.patient?.name}
                                {appt.status === 'in-consultation' && <span className="text-[10px] text-primary-600 bg-primary-100 px-2 py-0.5 rounded flex items-center gap-1"><span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce" />Now</span>}
                            </p>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 truncate">
                                <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {appt.chiefComplaint || 'General Consultation'}
                            </div>
                        </div>

                        {/* Actions for doctor/receptionist */}
                        {(role === 'doctor' || role === 'admin') && appt.status === 'waiting' && (
                            <div className="mt-4 flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={() => updateStatus(appt._id, 'in-consultation')}
                                    className="flex-1 btn-primary bg-primary-600 hover:bg-primary-700 text-xs py-2 shadow-sm rounded-xl transition-all"
                                >
                                    Call Patient In
                                </button>
                            </div>
                        )}
                        {(role === 'doctor' || role === 'admin') && appt.status === 'in-consultation' && (
                            <div className="mt-4 flex gap-2 pt-3 border-t border-primary-100 dark:border-primary-900/50">
                                <button
                                    onClick={() => updateStatus(appt._id, 'completed')}
                                    className="flex-1 btn-accent bg-emerald-500 hover:bg-emerald-600 text-xs py-2 shadow-sm rounded-xl transition-all text-white"
                                >
                                    ✓ Mark as Completed
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QueueBoard;
