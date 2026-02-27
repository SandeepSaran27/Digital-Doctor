import { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import api from '@/services/api';
import { toast } from 'react-toastify';

const PrescriptionCard = ({ prescription }) => {
    const printRef = useRef();

    if (!prescription) return null;

    const { patient, doctor, medicines, instructions, diagnosis, followUpDate, qrHash, _id } = prescription;

    const handlePrint = () => {
        const content = printRef.current.innerHTML;
        const w = window.open('', '_blank');
        w.document.write(`
      <html><head><title>Prescription</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; font-size: 13px; }
        h2  { color: #4f46e5; margin-bottom: 4px; }
        hr  { border: none; border-top: 1px solid #e2e8f0; margin: 12px 0; }
        table { width: 100%; border-collapse: collapse; }
        th,td { text-align: left; padding: 6px 8px; border: 1px solid #e2e8f0; font-size: 12px; }
        th { background: #f1f5f9; }
        .qr { margin-top: 16px; }
      </style>
      </head><body>${content}</body></html>
    `);
        w.document.close();
        w.print();
    };

    const handleDownloadPDF = async () => {
        try {
            const res = await api.get(`/prescriptions/${_id}/pdf`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
            const a = document.createElement('a');
            a.href = url;
            a.download = `prescription-${_id}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch {
            toast.error('Failed to download PDF');
        }
    };

    return (
        <div className="card space-y-4 max-w-2xl">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Prescription</h2>
                    <p className="text-xs text-slate-400">#{_id?.slice(-8).toUpperCase()}</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handlePrint} className="btn-secondary text-xs">🖨️ Print</button>
                    <button onClick={handleDownloadPDF} className="btn-primary text-xs">⬇️ PDF</button>
                </div>
            </div>

            {/* Printable content */}
            <div ref={printRef} className="space-y-4">
                <h2 style={{ color: '#4f46e5' }}>Digital Doctor — RMP Clinic</h2>
                <hr />

                {/* Patient & Doctor */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">Patient</p>
                        <p className="font-semibold text-slate-800 dark:text-white">{patient?.firstName} {patient?.lastName}</p>
                        <p className="text-slate-500 text-xs">{patient?.phone}</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">Doctor</p>
                        <p className="font-semibold text-slate-800 dark:text-white">{doctor?.name}</p>
                        <p className="text-slate-500 text-xs">{doctor?.specialization}</p>
                    </div>
                </div>

                <div className="text-sm">
                    <span className="text-slate-400 text-xs">Diagnosis: </span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{diagnosis}</span>
                </div>

                {/* Medicines table */}
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                    <table className="table">
                        <thead><tr>
                            <th>Medicine</th><th>Dosage</th><th>Frequency</th><th>Duration</th><th>Instructions</th>
                        </tr></thead>
                        <tbody>
                            {medicines?.map((m, i) => (
                                <tr key={i}>
                                    <td className="font-medium">{m.name}</td>
                                    <td>{m.dosage}</td>
                                    <td>{m.frequency}</td>
                                    <td>{m.duration}</td>
                                    <td>{m.instructions}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {instructions && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-3 text-sm text-indigo-700 dark:text-indigo-300">
                        <span className="font-semibold">Instructions: </span>{instructions}
                    </div>
                )}

                {followUpDate && (
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        <span className="font-semibold">Follow-up: </span>
                        {new Date(followUpDate).toLocaleDateString('en-IN')}
                    </p>
                )}

                {/* QR Code */}
                {qrHash && (
                    <div className="flex items-center gap-4 pt-2 qr">
                        <QRCodeCanvas value={qrHash} size={80} level="M" includeMargin />
                        <div className="text-xs text-slate-400">
                            <p className="font-semibold text-slate-600 dark:text-slate-400">QR Verification</p>
                            <p>Scan to verify prescription authenticity</p>
                            <p className="font-mono mt-1 break-all">{qrHash?.slice(0, 20)}...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrescriptionCard;
