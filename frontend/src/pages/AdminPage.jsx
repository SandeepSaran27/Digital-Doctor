import { useTranslation } from 'react-i18next';
import AuditLogTable from '@/components/AuditLogTable';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { toast } from 'react-toastify';

const AdminPage = () => {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('users');

    useEffect(() => {
        api.get('/admin/users').then(({ data }) => setUsers(data.data || [])).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const toggleStatus = async (id) => {
        try {
            const { data } = await api.put(`/admin/users/${id}/toggle-status`);
            setUsers((u) => u.map((x) => x._id === id ? { ...x, isActive: data.data.isActive } : x));
            toast.success('User status updated');
        } catch { toast.error('Failed to update user'); }
    };

    return (
        <div className="space-y-5 animate-fade-in">
            <h1 className="page-title">{t('nav.admin')}</h1>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 w-fit">
                {['users', 'logs'].map((k) => (
                    <button
                        key={k}
                        onClick={() => setTab(k)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition ${tab === k ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm' : 'text-slate-500'
                            }`}
                    >
                        {k === 'users' ? '👥 Users' : '📋 Audit Logs'}
                    </button>
                ))}
            </div>

            {tab === 'users' && (
                <div className="table-wrapper">
                    <table className="table">
                        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                            {loading && [...Array(5)].map((_, i) => <tr key={i}><td colSpan={5}><div className="h-8 shimmer rounded" /></td></tr>)}
                            {!loading && users.map((u) => (
                                <tr key={u._id}>
                                    <td className="font-medium">{u.name}</td>
                                    <td>{u.email}</td>
                                    <td><span className="badge badge-blue capitalize">{u.role}</span></td>
                                    <td>
                                        <span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'}`}>
                                            {u.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <button onClick={() => toggleStatus(u._id)} className="text-xs text-primary-600 hover:underline">
                                            {u.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {tab === 'logs' && <AuditLogTable />}
        </div>
    );
};

export default AdminPage;
