import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import QRScanner from '@/components/QRScanner';
import { toast } from 'react-toastify';

const QRCheckinPage = () => {
    const { t } = useTranslation();
    const [verified, setVerified] = useState(null);

    const handleScan = (data) => {
        setVerified(data);
        toast.success('Patient checked in via QR!');
    };

    return (
        <div className="space-y-5 animate-fade-in">
            <h1 className="page-title">{t('nav.qrCheckin')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <QRScanner onScan={handleScan} />
                {verified && (
                    <div className="card animate-slide-up space-y-3">
                        <h3 className="section-title">✓ Verified Prescription</h3>
                        <div className="space-y-2 text-sm">
                            <p><span className="text-slate-400">Patient: </span><span className="font-medium">{verified.patient?.firstName} {verified.patient?.lastName}</span></p>
                            <p><span className="text-slate-400">Doctor: </span><span className="font-medium">{verified.doctor?.name}</span></p>
                            <p><span className="text-slate-400">Diagnosis: </span>{verified.diagnosis}</p>
                            <p><span className="text-slate-400">Medicines: </span>{verified.medicines?.length} prescribed</p>
                        </div>
                        <button onClick={() => setVerified(null)} className="btn-secondary text-sm">Clear</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QRCheckinPage;
