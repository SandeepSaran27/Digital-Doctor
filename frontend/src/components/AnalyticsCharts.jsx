import { useEffect, useState } from 'react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import api from '@/services/api';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const AnalyticsCharts = () => {
    const [daily, setDaily] = useState(null);
    const [trends, setTrends] = useState([]);
    const [diseases, setDiseases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [d, t, dis] = await Promise.all([
                    api.get('/analytics/daily'),
                    api.get('/analytics/appointments/trends'),
                    api.get('/analytics/diseases'),
                ]);
                setDaily(d.data.data);
                // transform trends: [{_id:{year,month}, count}] → [{date, count}]
                const rawTrends = t.data.data || [];
                const formattedTrends = rawTrends.map((item) => ({
                    date: item._id
                        ? `${item._id.year}-${String(item._id.month).padStart(2, '0')}`
                        : item.date || '',
                    count: item.count || 0,
                }));
                setTrends(formattedTrends);
                // diseases: [{_id, total}] → [{condition, count}]
                const rawDis = dis.data.data || [];
                setDiseases(rawDis.map((x) => ({ condition: x._id || x.condition, count: x.total ?? x.count ?? 0 })));
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => <div key={i} className="h-64 rounded-2xl shimmer" />)}
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Stat row */}
            {daily && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: "Today's Appointments", value: daily.today?.total || 0, icon: '📅', clr: 'text-primary-600' },
                        { label: 'Patients Seen', value: daily.today?.completed || 0, icon: '👥', clr: 'text-accent-600' },
                        { label: 'New Patients (30d)', value: daily.newPatientsThisMonth || 0, icon: '📄', clr: 'text-warning-500' },
                        { label: 'Emergencies (30d)', value: daily.emergenciesThisMonth || 0, icon: '🚨', clr: 'text-danger-500' },
                    ].map(({ label, value, icon, clr }) => (
                        <div key={label} className="stat-card">
                            <span className="text-3xl">{icon}</span>
                            <div>
                                <p className={`text-2xl font-extrabold ${clr}`}>{value}</p>
                                <p className="text-xs text-slate-500">{label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Appointment Trends — Line Chart */}
                <div className="card">
                    <h3 className="section-title">Appointment Trends</h3>
                    {trends.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={trends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} name="Appointments" />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-40 flex items-center justify-center text-slate-400 text-sm">No trend data yet</div>
                    )}
                </div>

                {/* Disease Distribution — Pie Chart */}
                <div className="card">
                    <h3 className="section-title">Disease Distribution</h3>
                    {diseases.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie
                                    data={diseases}
                                    dataKey="count"
                                    nameKey="condition"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label={({ condition, percent }) => `${condition} ${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {diseases.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-40 flex items-center justify-center text-slate-400 text-sm">No disease data yet</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsCharts;
