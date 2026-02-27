import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { toggleSymptom, analyzeSymptoms, clearResult } from '@/store/slices/symptomSlice';
import { useEffect } from 'react';
import { fetchCommonSymptoms } from '@/store/slices/symptomSlice';

const SEVERITY_COLOR = { low: '#10b981', medium: '#f59e0b', high: '#ef4444', critical: '#7c3aed' };

const SymptomSelector = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { commonList, selected, result, analyzing } = useSelector((s) => s.symptoms);

    useEffect(() => { dispatch(fetchCommonSymptoms()); }, [dispatch]);

    const chartData = (result?.conditions || []).map((c) => ({
        name: c.name,
        score: Math.round((c.probability || 0) * 100),
    }));

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Symptom chips */}
            <div className="card">
                <h3 className="section-title">{t('symptoms.select')}</h3>
                <div className="flex flex-wrap gap-2">
                    {(commonList.length ? commonList : FALLBACK_SYMPTOMS).map((sym) => {
                        const symName = typeof sym === 'string' ? sym : sym.name;
                        const active = selected.includes(symName);
                        return (
                            <button
                                key={symName}
                                onClick={() => dispatch(toggleSymptom(symName))}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${active
                                        ? 'bg-primary-600 text-white border-primary-600 shadow'
                                        : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-primary-400'
                                    }`}
                            >
                                {symName}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-4 flex items-center gap-3">
                    <button
                        onClick={() => dispatch(analyzeSymptoms(selected))}
                        disabled={selected.length === 0 || analyzing}
                        className="btn-primary"
                    >
                        {analyzing ? '🔬 Analyzing...' : `🔍 ${t('symptoms.analyze')} (${selected.length})`}
                    </button>
                    {result && (
                        <button onClick={() => dispatch(clearResult())} className="btn-secondary">
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Results */}
            {result && (
                <div className="card animate-slide-up space-y-4">
                    <h3 className="section-title">{t('symptoms.results')}</h3>

                    {/* Emergency flag */}
                    {result.emergencyFlag && (
                        <div className="rounded-xl bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 p-4 text-danger-600 dark:text-danger-400 font-semibold text-sm emergency-ring">
                            {t('symptoms.emergency')}
                        </div>
                    )}

                    {/* Severity */}
                    <div className="flex items-center gap-3">
                        <span className="label mb-0">{t('symptoms.severity')}:</span>
                        <span
                            className="badge font-semibold capitalize"
                            style={{
                                backgroundColor: `${SEVERITY_COLOR[result.severity] || '#6366f1'}22`,
                                color: SEVERITY_COLOR[result.severity] || '#6366f1',
                            }}
                        >
                            {result.severity}
                        </span>
                    </div>

                    {/* Chart */}
                    {chartData.length > 0 && (
                        <div>
                            <p className="label">{t('symptoms.conditions')}</p>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={chartData} layout="vertical" barSize={18}>
                                    <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                                    <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11 }} />
                                    <Tooltip formatter={(v) => `${v}%`} />
                                    <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                                        {chartData.map((_, i) => (
                                            <Cell key={i} fill={['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i % 5]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const FALLBACK_SYMPTOMS = [
    'Fever', 'Cough', 'Headache', 'Fatigue', 'Nausea', 'Vomiting', 'Chest Pain',
    'Shortness of Breath', 'Dizziness', 'Diarrhea', 'Sore Throat', 'Body Ache',
    'Loss of Appetite', 'Abdominal Pain', 'Back Pain', 'Rash', 'Swelling',
    'Blurred Vision', 'Joint Pain', 'Palpitations',
];

export default SymptomSelector;
