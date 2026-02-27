import { useState, useEffect } from 'react';
import api from '@/services/api';

const AuditLogTable = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const limit = 20;

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const { data } = await api.get('/admin/logs', { params: { page, limit, search } });
                setLogs(data.data || []);
                setTotal(data.total || 0);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetch();
    }, [page, search]);

    const pages = Math.ceil(total / limit);

    return (
        <div className="card space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="section-title mb-0">Audit Logs</h3>
                <input
                    className="input w-60"
                    placeholder="Search action or resource..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
            </div>

            <div className="table-wrapper">
                <table className="table">
                    <thead><tr>
                        <th>Timestamp</th><th>User</th><th>Role</th><th>Action</th><th>Resource</th><th>IP Address</th><th>Status</th>
                    </tr></thead>
                    <tbody>
                        {loading && [...Array(5)].map((_, i) => (
                            <tr key={i}><td colSpan={7}><div className="h-8 shimmer rounded" /></td></tr>
                        ))}
                        {!loading && logs.map((log) => (
                            <tr key={log._id}>
                                <td className="text-xs">{new Date(log.createdAt).toLocaleString('en-IN')}</td>
                                <td className="font-medium max-w-[120px] truncate">{log.user?.name || '—'}</td>
                                <td><span className="badge badge-blue capitalize">{log.user?.role || '—'}</span></td>
                                <td className="font-mono text-xs">{log.action}</td>
                                <td className="text-xs">{log.resource}</td>
                                <td className="text-xs text-slate-400">{log.ipAddress}</td>
                                <td>
                                    <span className={`badge ${log.status === 'success' ? 'badge-green' : 'badge-red'}`}>
                                        {log.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {!loading && logs.length === 0 && (
                            <tr><td colSpan={7} className="text-center text-slate-400 py-8">No logs found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary text-xs px-3 py-1.5">
                        ← Prev
                    </button>
                    <span className="text-sm text-slate-500">{page} / {pages}</span>
                    <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages} className="btn-secondary text-xs px-3 py-1.5">
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
};

export default AuditLogTable;
