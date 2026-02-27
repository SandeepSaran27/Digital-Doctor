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
    const { user, role } = useAuth();
    const dispatch = useDispatch();
    
    // The 'list' now only contains data relevant to the logged-in user
    const { list: appointments } = useSelector((s) => s.appointments);

    useEffect(() => { 
        dispatch(fetchAppointments({ limit: 10 })); 
    }, [dispatch]);

    // 1. Logic for Patient Stats
    // Since the backend only sends this patient's data, we find their active appointment
    const activeAppointment = appointments.find(a => a.status === 'waiting');
    
    // Note: For 'patientsAhead', the backend would ideally send a 'queueCount' 
    // because the current user cannot see other patients' data anymore.
    const patientsAhead = activeAppointment?.patientsAheadOfMe || 0; 

    // Patient's old data logic
    const displayAppointments = role === 'patient' 
        ? appointments.filter(a => a.status === 'completed' || a.status === 'cancelled') 
        : appointments;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="page-title">{t('dashboard.welcome')}, {user?.name?.split(' ')[0]} 👋</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>
                {(role === 'receptionist' || role === 'admin') && (
                    <Link to="/appointments/book" className="btn-primary">+ Book Appointment</Link>
                )}
            </div>

            {/* PATIENT VIEW: Token & Queue Status */}
            {role === 'patient' && activeAppointment && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="card bg-primary-50 border-primary-100 flex flex-col items-center justify-center p-6">
                        <p className="text-primary-600 text-sm font-medium uppercase tracking-wider">Your Active Token</p>
                        <h2 className="text-5xl font-extrabold text-primary-700 mt-2">#{activeAppointment.tokenNumber}</h2>
                    </div>
                    <div className="card bg-blue-50 border-blue-100 flex flex-col items-center justify-center p-6">
                        <p className="text-blue-600 text-sm font-medium uppercase tracking-wider">Patients in Queue</p>
                        <h2 className="text-5xl font-extrabold text-blue-700 mt-2">{patientsAhead}</h2>
                    </div>
                </div>
            )}

            {/* ADMIN/DOCTOR VIEW: Analytics */}
            {(role === 'admin' || role === 'doctor') && <AnalyticsCharts />}

            {/* QUEUE BOARD: Hidden for Patients to ensure privacy */}
            {role !== 'patient' && <QueueBoard />}

            {/* DATA TABLE: Unified view (Backend already filtered this) */}
            {displayAppointments.length > 0 && (
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="section-title mb-0">
                            {role === 'patient' ? 'My Appointment History' : 'Recent Appointments'}
                        </h3>
                        <Link to="/appointments" className="text-sm text-primary-600 hover:underline">View All →</Link>
                    </div>
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Token</th>
                                    {role !== 'patient' ? <th>Patient</th> : <th>Doctor</th>}
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayAppointments.map((a) => (
                                    <tr key={a._id}>
                                        <td className="font-bold text-primary-600">#{a.tokenNumber}</td>
                                        {role !== 'patient' ? (
                                            <td>{a.patient?.firstName} {a.patient?.lastName}</td>
                                        ) : (
                                            <td>{a.doctor?.name}</td>
                                        )}
                                        <td className="text-xs">{a.date ? new Date(a.date).toLocaleString('en-IN') : '-'}</td>
                                        <td><span className="badge badge-blue capitalize">{a.type}</span></td>
                                        <td>
                                            <span className={`badge ${
                                                a.status === 'completed' ? 'badge-green' :
                                                a.status === 'waiting' ? 'badge-yellow' :
                                                'badge-red'
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
