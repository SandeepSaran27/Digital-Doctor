import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { createPatient } from '@/store/slices/patientSlice';
import { toast } from 'react-toastify';

const NewPatientPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

    const onSubmit = async (data) => {
        const payload = {
            ...data,
            dateOfBirth: data.dateOfBirth || undefined,
            address: { city: data.city, state: data.state, pincode: data.pincode, street: data.street },
            emergencyContact: { name: data.ecName, phone: data.ecPhone, relationship: data.ecRelation },
            medicalHistory: {
                allergies: data.allergies ? data.allergies.split(',').map((s) => s.trim()) : [],
                chronicConditions: data.chronic ? data.chronic.split(',').map((s) => s.trim()) : [],
                currentMedications: data.medications ? data.medications.split(',').map((s) => s.trim()) : [],
            },
        };
        const result = await dispatch(createPatient(payload));
        if (createPatient.fulfilled.match(result)) {
            toast.success('Patient registered successfully!');
            navigate(`/patients/${result.payload._id}`);
        } else {
            toast.error(result.payload || 'Failed to register patient');
        }
    };

    return (
        <div className="max-w-2xl space-y-5 animate-fade-in">
            <h1 className="page-title">Register New Patient</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Basic Info */}
                <div className="card space-y-4">
                    <h3 className="section-title">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="label">First Name *</label><input className="input" {...register('firstName', { required: true })} /></div>
                        <div><label className="label">Last Name *</label><input className="input" {...register('lastName', { required: true })} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="label">Phone *</label><input className="input" type="tel" {...register('phone', { required: true })} /></div>
                        <div><label className="label">Email</label><input className="input" type="email" {...register('email')} /></div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div><label className="label">Date of Birth</label><input className="input" type="date" {...register('dateOfBirth')} /></div>
                        <div>
                            <label className="label">Gender</label>
                            <select className="input" {...register('gender')}>
                                <option value="">—</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                            </select>
                        </div>
                        <div><label className="label">Blood Group</label>
                            <select className="input" {...register('bloodGroup')}>
                                {['', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((b) => <option key={b}>{b}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Address */}
                <div className="card space-y-3">
                    <h3 className="section-title">Address</h3>
                    <div><label className="label">Street</label><input className="input" {...register('street')} /></div>
                    <div className="grid grid-cols-3 gap-3">
                        <div><label className="label">City</label><input className="input" {...register('city')} /></div>
                        <div><label className="label">State</label><input className="input" {...register('state')} /></div>
                        <div><label className="label">Pincode</label><input className="input" {...register('pincode')} /></div>
                    </div>
                </div>

                {/* Emergency Contact */}
                <div className="card space-y-3">
                    <h3 className="section-title">Emergency Contact</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div><label className="label">Name</label><input className="input" {...register('ecName')} /></div>
                        <div><label className="label">Relationship</label><input className="input" {...register('ecRelation')} /></div>
                        <div><label className="label">Phone</label><input className="input" type="tel" {...register('ecPhone')} /></div>
                    </div>
                </div>

                {/* Medical History */}
                <div className="card space-y-3">
                    <h3 className="section-title">Medical History <span className="text-xs text-slate-400 font-normal">(comma-separated)</span></h3>
                    <div><label className="label">Allergies</label><input className="input" {...register('allergies')} placeholder="e.g. Penicillin, Dust" /></div>
                    <div><label className="label">Chronic Conditions</label><input className="input" {...register('chronic')} placeholder="e.g. Diabetes, Hypertension" /></div>
                    <div><label className="label">Current Medications</label><input className="input" {...register('medications')} placeholder="e.g. Metformin 500mg" /></div>
                </div>

                <div className="flex gap-3">
                    <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
                        {isSubmitting ? 'Saving...' : '✓ Register Patient'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewPatientPage;
