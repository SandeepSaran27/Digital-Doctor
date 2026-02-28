/*import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import QueueBoard from '@/components/QueueBoard';
import AnalyticsCharts from '@/components/AnalyticsCharts';
import { fetchAppointments } from '@/store/slices/appointmentSlice';
import { useSelector } from 'react-redux';

const DashboardPage = () => {
    const { t } = useTranslation();
    const { user, role, loading } = useAuth();
    const dispatch = useDispatch();
    const { list: appointments, loading: apptLoading } =
        useSelector((s) => s.appointments);

    useEffect(() => {
        if (loading) return; // Wait for getMe() to resolve
        if (user?._id) {
            dispatch(fetchAppointments({ limit: 5 }));
        }
    }, [dispatch, loading, user?._id]);
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="page-title">{t('dashboard.welcome')}, {user?.name?.split(' ')[0]} 👋</h1>
                    <p className="text-slate-500 text-sm mt-1">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                {(role === 'receptionist' || role === 'admin') && (
                    <Link to="/appointments/book" className="btn-primary">+ Book Appointment</Link>
                )}
            </div>

            {(role === 'admin' || role === 'doctor') && <AnalyticsCharts />}

            <QueueBoard />

            {appointments.length > 0 && (
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="section-title mb-0">Recent Appointments</h3>
                        <Link to="/appointments" className="text-sm text-primary-600 hover:underline">View All →</Link>
                    </div>
                    <div className="table-wrapper">
                        <table className="table">
                            <thead><tr>
                                <th>Token</th><th>Patient</th><th>Doctor</th><th>Date</th><th>Type</th><th>Status</th>
                            </tr></thead>
                            <tbody>
                                {appointments.slice(0, 5).map((a) => (
                                    <tr key={a._id}>
                                        <td className="font-bold text-primary-600">#{a.tokenNumber}</td>
                                        <td>{a.patient?.name}</td>
                                        <td>{a.doctor?.name}</td>
                                        <td className="text-xs">{new Date(a.date).toLocaleString('en-IN')}</td>
                                        <td><span className="badge badge-blue capitalize">{a.type}</span></td>
                                        <td>
                                            <span className={`badge ${a.status === 'completed' ? 'badge-green' :
                                                a.status === 'waiting' ? 'badge-yellow' :
                                                    a.status === 'cancelled' ? 'badge-red' : 'badge-blue'
                                                } capitalize`}>{a.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
    */

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import QueueBoard from '@/components/QueueBoard';
import AnalyticsCharts from '@/components/AnalyticsCharts';
import { fetchAppointments } from '@/store/slices/appointmentSlice';
import { useSelector } from 'react-redux';

const DashboardPage = () => {
    const { t } = useTranslation();
    const { user, role, loading } = useAuth();
    const dispatch = useDispatch();
    const { list: appointments, loading: apptLoading } =
        useSelector((s) => s.appointments);

    useEffect(() => {
        if (loading) return; // Wait for getMe() to resolve
        if (user?._id) {
            dispatch(fetchAppointments({ limit: 5 }));
        }
    }, [dispatch, loading, user?._id]);
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="page-title">{t('dashboard.welcome')}, {user?.name?.split(' ')[0]} 👋</h1>
                    <p className="text-slate-500 text-sm mt-1">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                {(role === 'receptionist' || role === 'admin') && (
                    <Link to="/appointments/book" className="btn-primary">+ Book Appointment</Link>
                )}
            </div>

            {/* Quick stat tiles — role specific */}
            {(role === 'admin' || role === 'doctor') && <AnalyticsCharts />}

            {/* Queue board — all roles */}
            <QueueBoard />

            {/* Recent appointments */}
            {appointments.length > 0 && (
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="section-title mb-0">Recent Appointments</h3>
                        <Link to="/appointments" className="text-sm text-primary-600 hover:underline">View All →</Link>
                    </div>
                    <div className="table-wrapper">
                        <table className="table">
                            <thead><tr>
                                <th>Token</th><th>Patient</th><th>Doctor</th><th>Date</th><th>Type</th><th>Status</th>
                            </tr></thead>
                            <tbody>
                                {appointments.slice(0, 5).map((a) => (
                                    <tr key={a._id}>
                                        <td className="font-bold text-primary-600">#{a.tokenNumber}</td>
                                        <td>{a.patient?.name || user?.name}</td>
                                        <td>{a.doctor?.name}</td>
                                        <td className="text-xs">{new Date(a.date).toLocaleString('en-IN')}</td>
                                        <td><span className="badge badge-blue capitalize">{a.type}</span></td>
                                        <td>
                                            <span className={`badge ${a.status === 'completed' ? 'badge-green' :
                                                a.status === 'waiting' ? 'badge-yellow' :
                                                    a.status === 'cancelled' ? 'badge-red' : 'badge-blue'
                                                } capitalize`}>{a.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
            
