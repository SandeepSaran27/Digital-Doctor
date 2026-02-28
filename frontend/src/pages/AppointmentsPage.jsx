import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchAppointments, updateStatusThunk } from '@/store/slices/appointmentSlice';
import useAuth from '@/hooks/useAuth';

const STATUS_CLASS = {
    waiting: 'badge-yellow',
    'in-consultation': 'badge-blue',
    completed: 'badge-green',
    cancelled: 'badge-red',
};

const AppointmentsPage = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
const { role, user } = useAuth();
    const { list, total, loading } = useSelector((s) => s.appointments);

    useEffect(() => { dispatch(fetchAppointments()); }, [dispatch]);
    const filteredAppointments = list.filter((a) => {

    // Doctor → only own queue
    if (role === "doctor") {
        return a.doctor?._id === user?._id;
    }

    // Patient → only own appointments
    if (role === "patient") {
        return a.patient?._id === user?._id;
    }

    // Admin / Receptionist → see all
    return true;
});

    return (
        <div className="space-y-5 animate-fade-in">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <h1 className="page-title">{t('appointments.title')} <span className="text-slate-400 text-lg font-normal">({total})</span></h1>
                {(role !== 'admin') && (
                    <Link to="/appointments/book" className="btn-primary">+ {t('appointments.book')}</Link>
                )}
            </div>

            <div className="table-wrapper">
                <table className="table">
                    <thead><tr>
                        <th>{t('appointments.token')}</th>
                        <th>Patient</th>
                        <th>{t('appointments.doctor')}</th>
                        <th>{t('appointments.date')}</th>
                        <th>{t('appointments.type')}</th>
                        <th>{t('appointments.status')}</th>
                        {(role === 'doctor' || role === 'admin') && <th>Actions</th>}
                    </tr></thead>
                    <tbody>
                        {loading && [...Array(6)].map((_, i) => (
                            <tr key={i}><td colSpan={7}><div className="h-8 shimmer rounded" /></td></tr>
                        ))}
                        {!loading && filteredAppointments.map((a) => (
                            <tr key={a._id}>
                                <td className="font-bold text-primary-600 text-lg">#{a.tokenNumber}</td>
                                <td>
                                    <p className="font-medium">{a.patient?.firstName} {a.patient?.lastName}</p>
                                    <p className="text-xs text-slate-400">{a.chiefComplaint?.slice(0, 30)}</p>
                                </td>
                                <td>{a.doctor?.name}</td>
                                <td className="text-xs">{new Date(a.appointmentDate).toLocaleString('en-IN')}</td>
                                <td><span className="badge badge-blue capitalize">{a.type}</span></td>
                                <td><span className={`badge capitalize ${STATUS_CLASS[a.status] || 'badge-gray'}`}>{a.status}</span></td>
                                {(role === 'doctor' || role === 'admin') && (
                                    <td>
                                        {a.status === 'waiting' && (
                                            <button
                                                onClick={() => dispatch(updateStatusThunk({ id: a._id, status: 'in-consultation' }))}
                                                className="text-primary-600 hover:underline text-xs font-medium"
                                            >
                                                Call In
                                            </button>
                                        )}
                                        {a.status === 'in-consultation' && (
                                            <button
                                                onClick={() => dispatch(updateStatusThunk({ id: a._id, status: 'completed' }))}
                                                className="text-accent-600 hover:underline text-xs font-medium"
                                            >
                                                Complete
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                        {!loading && filteredAppointments.length === 0 && (
                            <tr><td colSpan={7} className="text-center text-slate-400 py-10">{t('common.noData')}</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AppointmentsPage;
