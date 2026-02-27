import { useState, useRef } from 'react';
import api from '@/services/api';
import { toast } from 'react-toastify';

const LabReportUpload = ({ patientId, onUploaded }) => {
    const inputRef = useRef();
    const [dragging, setDragging] = useState(false);
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [notes, setNotes] = useState('');

    const addFiles = (incoming) => {
        const allowed = Array.from(incoming).filter((f) =>
            /\.(jpg|jpeg|png|pdf|doc|docx)$/i.test(f.name)
        );
        if (allowed.length !== incoming.length) toast.warn('Some file types are not supported');
        setFiles((prev) => [...prev, ...allowed]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        addFiles(e.dataTransfer.files);
    };

    const removeFile = (i) => setFiles((f) => f.filter((_, idx) => idx !== i));

    const upload = async () => {
        if (!files.length) return;
        setUploading(true);
        try {
            for (const file of files) {
                const fd = new FormData();
                fd.append('labReport', file);
                fd.append('notes', notes);
                await api.post(`/lab-reports/patient/${patientId}/upload`, fd, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            toast.success(`${files.length} file(s) uploaded successfully`);
            setFiles([]);
            setNotes('');
            if (onUploaded) onUploaded();
        } catch (e) {
            toast.error(e.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="card space-y-4 max-w-lg">
            <h3 className="font-semibold text-slate-800 dark:text-white">📎 Upload Lab Report</h3>

            {/* Drop zone */}
            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${dragging
                        ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/10'
                        : 'border-slate-200 dark:border-slate-600 hover:border-primary-300'
                    }`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => addFiles(e.target.files)}
                />
                <div className="text-4xl mb-2">{dragging ? '📂' : '📁'}</div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {dragging ? 'Drop files here' : 'Click or drag & drop files'}
                </p>
                <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG, DOC up to 10 MB</p>
            </div>

            {/* File list */}
            {files.length > 0 && (
                <div className="space-y-2">
                    {files.map((f, i) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                            <span className="text-lg">{f.type.includes('pdf') ? '📄' : '🖼️'}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{f.name}</p>
                                <p className="text-[10px] text-slate-400">{(f.size / 1024).toFixed(1)} KB</p>
                            </div>
                            <button onClick={() => removeFile(i)} className="text-danger-400 hover:text-danger-600 text-sm">✕</button>
                        </div>
                    ))}
                </div>
            )}

            <div>
                <label className="label">Notes (optional)</label>
                <textarea
                    className="input resize-none"
                    rows={2}
                    placeholder="e.g. CBC report, 27 Feb 2025"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </div>

            <button
                onClick={upload}
                disabled={uploading || !files.length}
                className="btn-primary w-full"
            >
                {uploading ? '⏳ Uploading...' : `⬆️ Upload ${files.length} File(s)`}
            </button>
        </div>
    );
};

export default LabReportUpload;
