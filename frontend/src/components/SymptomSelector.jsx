/*import { useDispatch, useSelector } from 'react-redux';
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

            {result && (
                <div className="card animate-slide-up space-y-4">
                    <h3 className="section-title">{t('symptoms.results')}</h3>

                    {result.emergencyFlag && (
                        <div className="rounded-xl bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 p-4 text-danger-600 dark:text-danger-400 font-semibold text-sm emergency-ring">
                            {t('symptoms.emergency')}
                        </div>
                    )}

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
*/

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { toggleSymptom, analyzeSymptoms, clearResult, fetchCommonSymptoms } from '@/store/slices/symptomSlice';
import { FiPlus, FiAlertTriangle, FiActivity, FiX, FiCheckCircle } from 'react-icons/fi';

const SEVERITY_COLOR = { low: '#10b981', medium: '#f59e0b', high: '#ef4444', critical: '#7c3aed' };

const SymptomSelector = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { commonList, selected, result, analyzing } = useSelector((s) => s.symptoms);

    const [customSymptom, setCustomSymptom] = useState('');

    useEffect(() => { dispatch(fetchCommonSymptoms()); }, [dispatch]);

    const chartData = (result?.conditions || []).map((c) => ({
        name: c.name,
        score: Math.round((c.probability || 0) * 100),
    }));

    const topCondition = result?.conditions?.[0]; // The "Expected Disease"

    const handleAddCustom = (e) => {
        e.preventDefault();
        const symptom = customSymptom.trim().toLowerCase();
        if (symptom && !selected.includes(symptom)) {
            dispatch(toggleSymptom(symptom));
        }
        setCustomSymptom('');
    };

    // Combine standard common list with any custom symptoms already selected
    const displaySymptoms = Array.from(new Set([
        ...(commonList.length ? commonList : FALLBACK_SYMPTOMS),
        ...selected
    ]));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in relative">

            {/* Left Column: Symptom Selection */}
            <div className="lg:col-span-7 space-y-6">

                <div className="card shadow-md shadow-indigo-500/5 border-t-4 border-t-indigo-500 rounded-b-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-400">
                            <FiActivity size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">How are you feeling?</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Select your symptoms or add new ones to get AI-powered insights.</p>
                        </div>
                    </div>

                    {/* Custom Symptom Input */}
                    <form onSubmit={handleAddCustom} className="flex gap-2 mb-6">
                        <input
                            type="text"
                            className="input flex-1 bg-slate-50 focus:bg-white dark:bg-slate-900/50 dark:focus:bg-slate-800 transition-colors"
                            placeholder="Type a new symptom (e.g. Sharp pain in left toe)..."
                            value={customSymptom}
                            onChange={(e) => setCustomSymptom(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={!customSymptom.trim()}
                            className="btn-primary shrink-0 transition-transform active:scale-95"
                        >
                            <FiPlus /> Add
                        </button>
                    </form>

                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Common Symptoms</h3>

                    {/* Chips */}
                    <div className="flex flex-wrap gap-2.5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {displaySymptoms.map((sym) => {
                            const symName = typeof sym === 'string' ? sym : sym.name;
                            const isActive = selected.includes(symName);
                            // Highlight custom symptoms slightly differently
                            const isCustom = !((commonList.length ? commonList : FALLBACK_SYMPTOMS).includes(symName));

                            return (
                                <button
                                    key={symName}
                                    onClick={() => dispatch(toggleSymptom(symName))}
                                    className={`
                                        group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border
                                        ${isActive
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20 scale-105'
                                            : isCustom
                                                ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400 hover:border-amber-400 dark:hover:border-amber-600'
                                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10'
                                        }
                                    `}
                                >
                                    <span className="capitalize">{symName}</span>
                                    {isActive && <FiCheckCircle className="animate-fade-in" />}
                                </button>
                            );
                        })}
                    </div>

                    {/* Action Bar */}
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                        <div className="text-sm font-medium text-slate-500">
                            {selected.length} symptom{selected.length !== 1 && 's'} selected
                        </div>
                        <div className="flex items-center gap-3">
                            {selected.length > 0 && (
                                <button onClick={() => dispatch(clearResult())} className="btn-ghost text-slate-500 hover:text-slate-800 hover:bg-slate-100">
                                    <FiX /> Clear
                                </button>
                            )}
                            <button
                                onClick={() => dispatch(analyzeSymptoms(selected))}
                                disabled={selected.length === 0 || analyzing}
                                className="btn-primary shadow-lg shadow-indigo-600/20 relative overflow-hidden group"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {analyzing ? (
                                        <>
                                            <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>✨ Analyze Symptoms</>
                                    )}
                                </span>
                                {/* Hover beam effect */}
                                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: AI Analysis Results */}
            <div className="lg:col-span-5 space-y-6">
                {!result ? (
                    <div className="card h-full flex flex-col items-center justify-center text-center p-10 bg-slate-50/50 dark:bg-slate-800/20 border-dashed">
                        <div className="w-20 h-20 mb-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500 opacity-50">
                            <FiActivity size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Awaiting Symptoms</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
                            Select or add symptoms on the left to generate an AI-powered health analysis and see expected diseases.
                        </p>
                    </div>
                ) : (
                    <div className="card shadow-xl shadow-slate-200/50 dark:shadow-none animate-slide-up bg-white dark:bg-slate-800 border-t-4 border-t-emerald-500">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <span>📊</span> Analysis Report
                            </h3>
                            <span
                                className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                                style={{
                                    backgroundColor: `${SEVERITY_COLOR[result.severity] || '#6366f1'}22`,
                                    color: SEVERITY_COLOR[result.severity] || '#6366f1',
                                    border: `1px solid ${SEVERITY_COLOR[result.severity]}40`
                                }}
                            >
                                {result.severity} Severity
                            </span>
                        </div>

                        {/* Emergency flag */}
                        {result.emergencyFlag && (
                            <div className="mb-6 rounded-xl bg-red-50 dark:bg-red-900/10 border-2 border-red-500/20 p-4 text-red-600 dark:text-red-400 emergency-ring flex gap-3">
                                <FiAlertTriangle className="shrink-0 text-red-500" size={24} />
                                <div>
                                    <h4 className="font-bold">Critical Warning</h4>
                                    <p className="text-sm mt-1">{result.emergencyReason || 'These symptoms require immediate emergency medical attention.'}</p>
                                </div>
                            </div>
                        )}

                        {/* Expected Disease / Top Condition */}
                        {topCondition && (
                            <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10" />
                                <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1">Expected Condition</h4>
                                <div className="flex items-baseline gap-3 mb-2">
                                    <h2 className="text-2xl font-black text-slate-800 dark:text-white capitalize">{topCondition.name}</h2>
                                    <span className="text-sm font-semibold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded">
                                        {Math.round(topCondition.probability * 100)}% Match
                                    </span>
                                </div>
                                {topCondition.description && (
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{topCondition.description}</p>
                                )}
                            </div>
                        )}

                        {/* Chart */}
                        {chartData.length > 1 && (
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-4">Other Possible Conditions</h4>
                                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                                    <ResponsiveContainer width="100%" height={180}>
                                        <BarChart data={chartData.slice(1)} layout="vertical" barSize={12} margin={{ left: -20, right: 10 }}>
                                            <XAxis type="number" domain={[0, 100]} hide />
                                            <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                            <Tooltip
                                                cursor={{ fill: 'transparent' }}
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                                formatter={(v) => [`${v}% Match`, 'Probability']}
                                            />
                                            <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                                                {chartData.slice(1).map((_, i) => (
                                                    <Cell key={i} fill={['#818cf8', '#34d399', '#fbbf24', '#f87171'][i % 4]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        {/* AI Suggestions */}
                        {result.aiSuggestions && (
                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                    <span className="text-indigo-500">🤖</span> AI Doctor Notes
                                </h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                                    {result.aiSuggestions}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const FALLBACK_SYMPTOMS = [
    'fever', 'cough', 'headache', 'fatigue', 'nausea', 'vomiting', 'chest pain',
    'shortness of breath', 'dizziness', 'diarrhea', 'sore throat', 'body ache',
    'loss of appetite', 'abdominal pain', 'back pain', 'rash', 'swelling',
    'blurred vision', 'joint pain', 'palpitations',
];

export default SymptomSelector;
