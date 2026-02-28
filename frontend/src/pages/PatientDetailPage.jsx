/*import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatientById } from '@/store/slices/patientSlice';
import LabReportUpload from '@/components/LabReportUpload';
import useAuth from '@/hooks/useAuth';

const TAB = { info: 'Info', history: 'History', visits: 'Visits', labs: 'Lab Reports' };

const PatientDetailPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { role } = useAuth();
    const { selected: patient, loading } = useSelector((s) => s.patients);
    const [tab, setTab] = useState('info');

    useEffect(() => { dispatch(fetchPatientById(id)); }, [dispatch, id]);

    if (loading) return <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;
    if (!patient) return <div className="card text-center py-12 text-slate-400">Patient not found.</div>;

    return (
        <div className="space-y-5 animate-fade-in">
            <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xl font-bold shadow">
                        {patient.firstName?.[0]}{patient.lastName?.[0]}
                    </div>
                    <div>
                        <h1 className="page-title">{patient.firstName} {patient.lastName}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="badge badge-red">{patient.bloodGroup}</span>
                            <span className="badge badge-gray capitalize">{patient.gender}</span>
                            <span className="text-xs text-slate-400">{patient.phone}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link to={`/appointments/book?patient=${id}`} className="btn-primary text-sm">Book Appointment</Link>
                    {(role === 'doctor' || role === 'admin') && (
                        <Link to={`/prescriptions/new?patient=${id}`} className="btn-secondary text-sm">Write Prescription</Link>
                    )}
                </div>
            </div>

            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 w-fit">
                {Object.entries(TAB).map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() => setTab(key)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${tab === key ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="animate-fade-in">
                {tab === 'info' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="card space-y-3">
                            <h3 className="section-title">Personal Information</h3>
                            {[
                                ['Date of Birth', patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('en-IN') : '—'],
                                ['Email', patient.email || '—'],
                                ['Phone', patient.phone],
                                ['Address', [patient.address?.street, patient.address?.city, patient.address?.state, patient.address?.pincode].filter(Boolean).join(', ') || '—'],
                            ].map(([k, v]) => (
                                <div key={k} className="flex gap-2 text-sm">
                                    <span className="text-slate-400 w-32 flex-shrink-0">{k}</span>
                                    <span className="text-slate-700 dark:text-slate-300 font-medium">{v}</span>
                                </div>
                            ))}
                        </div>
                        <div className="card space-y-3">
                            <h3 className="section-title">Emergency Contact</h3>
                            <div className="text-sm space-y-1">
                                <p><span className="text-slate-400">Name: </span>{patient.emergencyContact?.name || '—'}</p>
                                <p><span className="text-slate-400">Relation: </span>{patient.emergencyContact?.relationship || '—'}</p>
                                <p><span className="text-slate-400">Phone: </span>{patient.emergencyContact?.phone || '—'}</p>
                            </div>
                        </div>
                    </div>
                )}

                {tab === 'history' && (
                    <div className="card space-y-3">
                        <h3 className="section-title">Medical History</h3>
                        {[
                            ['Allergies', patient.medicalHistory?.allergies?.join(', ') || 'None'],
                            ['Chronic Conditions', patient.medicalHistory?.chronicConditions?.join(', ') || 'None'],
                            ['Current Medications', patient.medicalHistory?.currentMedications?.join(', ') || 'None'],
                            ['Surgeries', patient.medicalHistory?.surgeries?.join(', ') || 'None'],
                            ['Family History', patient.medicalHistory?.familyHistory?.join(', ') || 'None'],
                        ].map(([k, v]) => (
                            <div key={k} className="flex gap-3 text-sm">
                                <span className="text-slate-400 w-40 flex-shrink-0">{k}</span>
                                <span className="text-slate-700 dark:text-slate-300">{v}</span>
                            </div>
                        ))}
                    </div>
                )}

                {tab === 'visits' && (
                    <div className="space-y-3">
                        {(patient.visits || []).length === 0 && (
                            <div className="card text-center text-slate-400 py-10">No visits recorded</div>
                        )}
                        {(patient.visits || []).map((v, i) => (
                            <div key={i} className="card flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-1" />
                                    {i < patient.visits.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-700 mt-1" />}
                                </div>
                                <div className="flex-1 pb-2">
                                    <p className="text-xs text-slate-400">{new Date(v.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    <p className="font-semibold text-slate-800 dark:text-white text-sm mt-1">{v.diagnosis}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{v.chiefComplaint}</p>
                                    {v.notes && <p className="text-xs text-slate-400 mt-1 italic">{v.notes}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {tab === 'labs' && (
                    <div className="space-y-4">
                        {(role === 'doctor' || role === 'admin' || role === 'receptionist') && (
                            <LabReportUpload patientId={id} onUploaded={() => dispatch(fetchPatientById(id))} />
                        )}
                        {(patient.labReports || []).length === 0 && (
                            <div className="card text-center text-slate-400 py-10">No lab reports uploaded</div>
                        )}
                        {(patient.labReports || []).map((r, i) => (
                            <div key={i} className="card flex items-center gap-3">
                                <span className="text-2xl">{r.fileType?.includes('pdf') ? '📄' : '🖼️'}</span>
                                <div className="flex-1">
                                    <p className="font-medium text-sm text-slate-700 dark:text-slate-300">{r.fileName}</p>
                                    <p className="text-xs text-slate-400">{new Date(r.uploadedAt).toLocaleDateString('en-IN')} · {r.notes}</p>
                                </div>
                                <a href={`/api/lab-reports/${r._id}/download`} className="btn-secondary text-xs" target="_blank" rel="noreferrer">
                                    ⬇️ Download
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientDetailPage;
*/

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatientById } from '@/store/slices/patientSlice';
import LabReportUpload from '@/components/LabReportUpload';
import useAuth from '@/hooks/useAuth';

const TAB = { info: 'Info', history: 'History', visits: 'Visits', labs: 'Lab Reports' };

const PatientDetailPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { user } = useAuth();
    const { role } = useAuth();
    const { selected: patient, loading } = useSelector((s) => s.patients);
    const [tab, setTab] = useState('info');

    const effectiveId = id === 'me' ? user?._id : id;

    useEffect(() => {
        if (effectiveId) dispatch(fetchPatientById(effectiveId));
    }, [dispatch, effectiveId]);

    if (loading) return <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;
    if (!patient) return <div className="card text-center py-12 text-slate-400">Patient not found.</div>;

    return (
        <div className="space-y-5 animate-fade-in">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xl font-bold shadow">
                        {patient.firstName?.[0]}{patient.lastName?.[0]}
                    </div>
                    <div>
                        <h1 className="page-title">{patient.firstName} {patient.lastName}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="badge badge-red">{patient.bloodGroup}</span>
                            <span className="badge badge-gray capitalize">{patient.gender}</span>
                            <span className="text-xs text-slate-400">{patient.phone}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link to={`/appointments/book?patient=${id}`} className="btn-primary text-sm">Book Appointment</Link>
                    {(role === 'doctor' || role === 'admin') && (
                        <Link to={`/prescriptions/new?patient=${id}`} className="btn-secondary text-sm">Write Prescription</Link>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 w-fit">
                {Object.entries(TAB).map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() => setTab(key)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${tab === key ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div className="animate-fade-in">
                {tab === 'info' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="card space-y-3">
                            <h3 className="section-title">Personal Information</h3>
                            {[
                                ['Date of Birth', patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('en-IN') : '—'],
                                ['Email', patient.email || '—'],
                                ['Phone', patient.phone],
                                ['Address', [patient.address?.street, patient.address?.city, patient.address?.state, patient.address?.pincode].filter(Boolean).join(', ') || '—'],
                            ].map(([k, v]) => (
                                <div key={k} className="flex gap-2 text-sm">
                                    <span className="text-slate-400 w-32 flex-shrink-0">{k}</span>
                                    <span className="text-slate-700 dark:text-slate-300 font-medium">{v}</span>
                                </div>
                            ))}
                        </div>
                        <div className="card space-y-3">
                            <h3 className="section-title">Emergency Contact</h3>
                            <div className="text-sm space-y-1">
                                <p><span className="text-slate-400">Name: </span>{patient.emergencyContact?.name || '—'}</p>
                                <p><span className="text-slate-400">Relation: </span>{patient.emergencyContact?.relationship || '—'}</p>
                                <p><span className="text-slate-400">Phone: </span>{patient.emergencyContact?.phone || '—'}</p>
                            </div>
                        </div>
                    </div>
                )}

                {tab === 'history' && (
                    <div className="card space-y-3">
                        <h3 className="section-title">Medical History</h3>
                        {[
                            ['Allergies', patient.medicalHistory?.allergies?.join(', ') || 'None'],
                            ['Chronic Conditions', patient.medicalHistory?.chronicConditions?.join(', ') || 'None'],
                            ['Current Medications', patient.medicalHistory?.currentMedications?.join(', ') || 'None'],
                            ['Surgeries', patient.medicalHistory?.surgeries?.join(', ') || 'None'],
                            ['Family History', patient.medicalHistory?.familyHistory?.join(', ') || 'None'],
                        ].map(([k, v]) => (
                            <div key={k} className="flex gap-3 text-sm">
                                <span className="text-slate-400 w-40 flex-shrink-0">{k}</span>
                                <span className="text-slate-700 dark:text-slate-300">{v}</span>
                            </div>
                        ))}
                    </div>
                )}

                {tab === 'visits' && (
                    <div className="space-y-3">
                        {(patient.visits || []).length === 0 && (
                            <div className="card text-center text-slate-400 py-10">No visits recorded</div>
                        )}
                        {(patient.visits || []).map((v, i) => (
                            <div key={i} className="card flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-1" />
                                    {i < patient.visits.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-700 mt-1" />}
                                </div>
                                <div className="flex-1 pb-2">
                                    <p className="text-xs text-slate-400">{new Date(v.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    <p className="font-semibold text-slate-800 dark:text-white text-sm mt-1">{v.diagnosis}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{v.chiefComplaint}</p>
                                    {v.notes && <p className="text-xs text-slate-400 mt-1 italic">{v.notes}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {tab === 'labs' && (
                    <div className="space-y-4">
                        {(role === 'doctor' || role === 'admin' || role === 'receptionist') && (
                            <LabReportUpload patientId={id} onUploaded={() => dispatch(fetchPatientById(id))} />
                        )}
                        {(patient.labReports || []).length === 0 && (
                            <div className="card text-center text-slate-400 py-10">No lab reports uploaded</div>
                        )}
                        {(patient.labReports || []).map((r, i) => (
                            <div key={i} className="card flex items-center gap-3">
                                <span className="text-2xl">{r.fileType?.includes('pdf') ? '📄' : '🖼️'}</span>
                                <div className="flex-1">
                                    <p className="font-medium text-sm text-slate-700 dark:text-slate-300">{r.fileName}</p>
                                    <p className="text-xs text-slate-400">{new Date(r.uploadedAt).toLocaleDateString('en-IN')} · {r.notes}</p>
                                </div>
                                <a href={`/api/lab-reports/${r._id}/download`} className="btn-secondary text-xs" target="_blank" rel="noreferrer">
                                    ⬇️ Download
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientDetailPage;
