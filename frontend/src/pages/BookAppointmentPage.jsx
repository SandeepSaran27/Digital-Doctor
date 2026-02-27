import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { bookAppointment } from '@/store/slices/appointmentSlice';
import { fetchPatients } from '@/store/slices/patientSlice';
import api from '@/services/api';
import { toast } from 'react-toastify';

const BookAppointmentPage = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const { list: patients } = useSelector((s) => s.patients);
    const [doctors, setDoctors] = useState([]);
    const loading = useSelector((s) => s.appointments.loading);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { patient: params.get('patient') || '' },
    });

    useEffect(() => {
        dispatch(fetchPatients({ limit: 500 }));
        api.get('/doctors').then(({ data }) => setDoctors(data.data || [])).catch(() => { });
    }, [dispatch]);

    const onSubmit = async (data) => {
        // Map the form data to match the backend's expected req.body keys
        const payload = {
            patientId: data.patient,
            doctorId: data.doctor,
            date: new Date(data.appointmentDate).toISOString(),
            type: data.type,
            chiefComplaint: data.chiefComplaint
        };

        const result = await dispatch(bookAppointment(payload));

        if (bookAppointment.fulfilled.match(result)) {
            toast.success('Appointment booked! Token #' + result.payload.tokenNumber);
            navigate('/appointments');
        } else {
            toast.error(result.payload?.message || result.error?.message || 'Booking failed');
        }
    };

    return (
        <div className="max-w-lg space-y-5 animate-fade-in">
            <h1 className="page-title">{t('appointments.book')}</h1>
            <div className="card">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <div>
                        <label className="label">Doctor</label>
                        <select className="input" {...register('doctor', { required: true })}>
                            <option value="">-- Select Doctor --</option>
                            {doctors.map((d) => {
                                // This helper ensures we get the string ID regardless of format
                                const doctorId = typeof d._id === 'object' ? d._id.$oid : d._id;

                                return (
                                    <option key={doctorId} value={doctorId}>
                                        Dr. {d.name} — {d.specialization}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div>
                        <label className="label">Date & Time</label>
                        <input className="input" type="datetime-local" {...register('appointmentDate', { required: true })} />
                    </div>
                    <div>
                        <label className="label">Type</label>
                        <select className="input" {...register('type', { required: true })}>
                            <option value="walkin">Walk-in</option>
                            <option value="online">Online</option>
                        </select>
                    </div>
                    <div>
                        <label className="label">Chief Complaint</label>
                        <input className="input" placeholder="Reason for visit..." {...register('chiefComplaint')} />
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Cancel</button>
                        <button type="submit" disabled={loading} className="btn-primary flex-1">
                            {loading ? 'Booking...' : '✓ Book Appointment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookAppointmentPage;
