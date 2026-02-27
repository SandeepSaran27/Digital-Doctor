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
                        className={`card hover:shadow-md transition-all group ${appt.status === 'in-consultation' ? 'ring-2 ring-primary-400' : ''
                            }`}
                    >
                        {/* Token number */}
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-lg font-bold shadow">
                                {appt.tokenNumber}
                            </div>
                            <span className={`badge ${STATUS_COLORS[appt.status] || 'badge-gray'}`}>
                                {t(`appointments.${appt.status?.replace('-', '')}`) || appt.status}
                            </span>
                        </div>

                        {/* Patient name */}
                        <p className="font-semibold text-slate-800 dark:text-white text-sm truncate">
                            {appt.patient?.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">{appt.chiefComplaint || 'General Consultation'}</p>

                        {/* Actions for doctor/receptionist */}
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
