import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import {
    triggerEmergency,
    fetchEmergencyLogs,
    resolveEmergency,
    resetTrigger,
} from '@/store/slices/emergencySlice';
import { useEffect } from 'react';

const EmergencyPanel = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { logs, triggering, triggered, loading } = useSelector((s) => s.emergency);
    const { register, handleSubmit, reset } = useForm();

    const [confirm, setConfirm] = useState(false);

    useEffect(() => { dispatch(fetchEmergencyLogs()); }, [dispatch]);

    useEffect(() => {
        if (triggered) {
            reset();
            setConfirm(false);
            const t = setTimeout(() => dispatch(resetTrigger()), 4000);
            return () => clearTimeout(t);
        }
    }, [triggered, dispatch, reset]);

    const onSubmit = (data) => {
        if (!confirm) { setConfirm(true); return; }
        dispatch(triggerEmergency(data));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
            {/* Trigger panel */}
            <div className={`card space-y-4 ${confirm ? 'ring-2 ring-danger-400' : ''}`}>
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${confirm ? 'bg-danger-100 emergency-ring' : 'bg-red-50 dark:bg-red-900/20'}`}>
                        🚨
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-white">{t('emergency.title')}</h3>
                        <p className="text-xs text-slate-400">Sends alerts to all on-call staff</p>
                    </div>
                </div>

                {triggered ? (
                    <div className="rounded-xl bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-700 p-4 text-center">
                        <div className="text-4xl mb-2">🚑</div>
                        <p className="font-semibold text-danger-600 dark:text-danger-400">Emergency Alert Sent!</p>
                        <p className="text-xs text-slate-500 mt-1">Staff have been notified via SMS and email.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                        <div>
                            <label className="label">Patient Name / ID</label>
                            <input className="input" {...register('patientInfo')} placeholder="Patient name or ID" />
                        </div>
                        <div>
                            <label className="label">Emergency Details</label>
                            <textarea
                                className="input resize-none"
                                rows={3}
                                {...register('description', { required: true })}
                                placeholder="Describe the emergency situation..."
                            />
                        </div>
                        <div>
                            <label className="label">Location</label>
                            <input className="input" {...register('location')} placeholder="Ward / Room number" />
                        </div>

                        {confirm && (
                            <div className="rounded-xl bg-danger-50 dark:bg-danger-900/20 border border-danger-200 p-3 text-sm text-danger-600 font-medium">
                                ⚠️ Are you sure? This will alert all staff members immediately.
                            </div>
                        )}

                        <div className="flex gap-2">
                            {confirm && (
                                <button type="button" onClick={() => setConfirm(false)} className="btn-secondary flex-1">
                                    {t('emergency.cancelLabel')}
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={triggering}
                                className={`btn-danger flex-1 ${confirm ? 'emergency-ring' : ''}`}
                            >
                                {triggering ? '⏳ Sending...' : confirm ? '✓ Confirm Emergency' : t('emergency.trigger')}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Logs */}
            <div className="card space-y-3">
                <h3 className="section-title">{t('emergency.logs')}</h3>
                {loading && <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-16 shimmer rounded-xl" />)}</div>}
                {!loading && logs.length === 0 && (
                    <p className="text-slate-400 text-sm text-center py-8">No emergency logs</p>
                )}
                <div className="space-y-2 max-h-80 overflow-y-auto">
                    {logs.map((log) => (
                        <div key={log._id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                            <span className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${log.resolved ? 'bg-accent-400' : 'bg-danger-500 animate-pulse'}`} />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                                    {log.description || 'Emergency Alert'}
                                </p>
                                <p className="text-xs text-slate-400">{new Date(log.createdAt || log.timestamp).toLocaleString('en-IN')}</p>
                            </div>
                            <span className={`badge flex-shrink-0 ${log.resolved ? 'badge-green' : 'badge-red'}`}>
                                {log.resolved ? t('emergency.resolved') : t('emergency.active')}
                            </span>
                            {!log.resolved && (
                                <button
                                    onClick={() => dispatch(resolveEmergency(log._id))}
                                    className="text-xs text-accent-600 hover:underline flex-shrink-0"
                                >
                                    Resolve
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EmergencyPanel;
