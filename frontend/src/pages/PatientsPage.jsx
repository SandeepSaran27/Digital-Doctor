import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchPatients } from '@/store/slices/patientSlice';

const PatientsPage = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { list, total, loading } = useSelector((s) => s.patients);

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const limit = 15;

    useEffect(() => {
        dispatch(fetchPatients({ search, page, limit }));
    }, [dispatch, search, page]);

    const pages = Math.ceil(total / limit);

    return (
        <div className="space-y-5 animate-fade-in">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="page-title">{t('patients.title')} <span className="text-slate-400 text-lg font-normal">({total})</span></h1>
                <Link to="/patients/new" className="btn-primary">+ {t('patients.addNew')}</Link>
            </div>

            {/* Search */}
            <div className="card py-3">
                <input
                    className="input max-w-sm"
                    placeholder={t('patients.search')}
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
            </div>

            {/* Table */}
            <div className="table-wrapper">
                <table className="table">
                    <thead><tr>
                        <th>Name</th><th>Phone</th><th>DOB</th><th>Gender</th><th>Blood</th><th>Actions</th>
                    </tr></thead>
                    <tbody>
                        {loading && [...Array(5)].map((_, i) => (
                            <tr key={i}><td colSpan={6}><div className="h-8 shimmer rounded" /></td></tr>
                        ))}
                        {!loading && list.map((p) => (
                            <tr key={p._id}>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                                            {p.firstName?.[0]}{p.lastName?.[0]}
                                        </div>
                                        <span className="font-medium">{p.firstName} {p.lastName}</span>
                                    </div>
                                </td>
                                <td>{p.phone}</td>
                                <td className="text-xs">{p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString('en-IN') : '—'}</td>
                                <td className="capitalize">{p.gender}</td>
                                <td><span className="badge badge-red">{p.bloodGroup || '—'}</span></td>
                                <td>
                                    <button onClick={() => navigate(`/patients/${p._id}`)} className="text-primary-600 hover:underline text-sm">
                                        View →
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {!loading && list.length === 0 && (
                            <tr><td colSpan={6} className="text-center text-slate-400 py-10">{t('common.noData')}</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary text-xs px-3 py-1.5">← Prev</button>
                    <span className="text-sm text-slate-500">{page} / {pages}</span>
                    <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages} className="btn-secondary text-xs px-3 py-1.5">Next →</button>
                </div>
            )}
        </div>
    );
};

export default PatientsPage;
