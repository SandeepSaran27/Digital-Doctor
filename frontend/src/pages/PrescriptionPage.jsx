import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import PrescriptionCard from '@/components/PrescriptionCard';
import api from '@/services/api';

const PrescriptionPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [prescription, setPrescription] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/prescriptions/${id}`)
            .then(({ data }) => setPrescription(data.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;
    if (!prescription) return <div className="card text-center py-12 text-slate-400">Prescription not found.</div>;

    return (
        <div className="space-y-5 animate-fade-in">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="btn-ghost">← Back</button>
                <h1 className="page-title">Prescription</h1>
            </div>
            <PrescriptionCard prescription={prescription} />
        </div>
    );
};

export default PrescriptionPage;
