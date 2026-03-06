'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
    getDashboardMetrics, getAllFeedback,
    getLowSatisfaction, getComplications
} from '@/lib/api';
import Navbar from '@/components/Navbar';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
    Users, ClipboardList, Star, TrendingUp, AlertTriangle,
    Filter, Loader2, Heart, ChevronDown, RefreshCw, ShieldAlert
} from 'lucide-react';

interface Metrics {
    total_patients: number;
    total_feedback: number;
    avg_satisfaction: number;
    treatment_success_rate: number;
    top_conditions: { name: string; count: number }[];
    monthly_growth: { month: string; count: number }[];
    satisfaction_distribution: { score: number; count: number }[];
}

interface FeedbackItem {
    id: string;
    patient_id: string;
    patient_name?: string;
    condition: string;
    diagnosis: string;
    treatment_type: string;
    duration: string;
    improvement_level: number;
    satisfaction_score: number;
    complications: boolean;
    recommend: boolean;
    comments?: string;
    created_at: string;
}

const CHART_COLORS = ['#874B61', '#B06E87', '#D4919F', '#ec4899', '#f472b6', '#f9a8d4'];
const PIE_COLORS = ['#D4919F', '#C47A8E', '#B06E87', '#9A5C73', '#874B61'];
const CONDITIONS = ['', 'PCOS', 'Pregnancy', 'Infertility', 'Menstrual Disorder', 'High-Risk Pregnancy', 'Other'];
const TREATMENTS = ['', 'Medication', 'Surgery', 'Therapy', 'Lifestyle', 'IVF', 'Other'];

export default function AdminDashboardPage() {
    const router = useRouter();
    const { isAuthenticated, role, token } = useAuth();

    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
    const [lowSat, setLowSat] = useState<FeedbackItem[]>([]);
    const [complications, setComplications] = useState<FeedbackItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'feedback' | 'alerts'>('overview');

    // Filters
    const [filterCondition, setFilterCondition] = useState('');
    const [filterTreatment, setFilterTreatment] = useState('');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');

    useEffect(() => {
        if (!isAuthenticated || role !== 'doctor') {
            router.push('/doctor-login');
            return;
        }
        loadDashboard();
    }, [isAuthenticated, role, router]);

    const loadDashboard = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const [m, f, ls, c] = await Promise.all([
                getDashboardMetrics(token),
                getAllFeedback(token),
                getLowSatisfaction(token),
                getComplications(token),
            ]);
            setMetrics(m);
            setFeedback(f);
            setLowSat(ls);
            setComplications(c);
        } catch (err) {
            console.error('Dashboard load error:', err);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = async () => {
        if (!token) return;
        const params: Record<string, string> = {};
        if (filterCondition) params.condition = filterCondition;
        if (filterTreatment) params.treatment_type = filterTreatment;
        if (filterStartDate) params.start_date = filterStartDate;
        if (filterEndDate) params.end_date = filterEndDate;
        try {
            const f = await getAllFeedback(token, params);
            setFeedback(f);
        } catch (err) {
            console.error('Filter error:', err);
        }
    };

    const clearFilters = () => {
        setFilterCondition('');
        setFilterTreatment('');
        setFilterStartDate('');
        setFilterEndDate('');
        if (token) getAllFeedback(token).then(setFeedback);
    };

    if (!isAuthenticated || role !== 'doctor') return null;

    if (loading) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-white via-[#FDF8F0] to-white">
                <Navbar />
                <div className="pt-24 flex items-center justify-center h-[60vh]">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-[#874B61] mx-auto" />
                        <p className="text-gray-500 mt-4">Loading dashboard...</p>
                    </div>
                </div>
            </main>
        );
    }

    const alertCount = lowSat.length + complications.length;

    return (
        <main className="min-h-screen bg-gradient-to-b from-white via-[#FDF8F0] to-white">
            <Navbar />
            <div className="pt-32 pb-12 px-4 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#874B61]/10 rounded-full text-[#874B61] text-xs font-medium mb-3">
                            <ShieldAlert className="h-3.5 w-3.5" />
                            Admin Access
                        </div>
                        <h1 className="text-3xl font-bold text-[#874B61]">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm">Clinical analytics and patient management</p>
                    </div>
                    <button
                        onClick={loadDashboard}
                        className="btn-secondary !py-2.5 !px-5 text-sm self-start flex items-center gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh Data
                    </button>
                </div>

                <div className="flex gap-2 mb-8 overflow-x-auto pb-1 no-scrollbar">
                    {(['overview', 'feedback', 'alerts'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setActiveTab(t)}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeTab === t
                                ? 'bg-gradient-to-r from-[#874B61] to-[#B06E87] text-white shadow-lg shadow-[#874B61]/25'
                                : 'bg-white text-gray-600 border border-[#874B61]/15 hover:bg-[#F6EEDE]'
                                }`}
                        >
                            {t === 'overview' && '📊 Overview'}
                            {t === 'feedback' && '📋 Feedback'}
                            {t === 'alerts' && `⚠️ Alerts (${alertCount})`}
                        </button>
                    ))}
                </div>

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && metrics && (
                    <div className="space-y-8">
                        {/* Metric Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white rounded-2xl shadow-md border border-[#874B61]/10 p-5 hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-[#874B61]/10 rounded-xl flex items-center justify-center">
                                        <Users className="h-6 w-6 text-[#874B61]" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-800">{metrics.total_patients}</p>
                                        <p className="text-xs text-gray-500">Total Patients</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-md border border-[#874B61]/10 p-5 hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-[#874B61]/15 rounded-xl flex items-center justify-center">
                                        <ClipboardList className="h-6 w-6 text-[#874B61]" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-800">{metrics.total_feedback}</p>
                                        <p className="text-xs text-gray-500">Feedback Entries</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-md border border-[#874B61]/10 p-5 hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-[#874B61]/20 rounded-xl flex items-center justify-center">
                                        <Star className="h-6 w-6 text-[#874B61]" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-800">{metrics.avg_satisfaction}</p>
                                        <p className="text-xs text-gray-500">Avg Satisfaction</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-md border border-[#874B61]/10 p-5 hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-[#874B61]/25 rounded-xl flex items-center justify-center">
                                        <TrendingUp className="h-6 w-6 text-[#874B61]" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-800">{metrics.treatment_success_rate}%</p>
                                        <p className="text-xs text-gray-500">Success Rate</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Charts Row 1 */}
                        <div className="grid lg:grid-cols-2 gap-6">
                            {/* Top Conditions Bar Chart */}
                            <div className="bg-white rounded-2xl shadow-md border border-[#874B61]/10 p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Conditions</h3>
                                {metrics.top_conditions.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart
                                            data={metrics.top_conditions}
                                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ee" vertical={false} />
                                            <XAxis
                                                dataKey="name"
                                                tick={{ fontSize: 11, fill: '#6B7280' }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 11, fill: '#6B7280' }}
                                                domain={[0, 'dataMax']}
                                                tickFormatter={(value) => Math.round(value).toString()}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <Tooltip
                                                cursor={{ fill: 'transparent' }}
                                                contentStyle={{
                                                    borderRadius: '12px',
                                                    border: '1px solid #f3e8ee',
                                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                                                }}
                                            />
                                            <Bar dataKey="count" fill="#874B61" radius={[6, 6, 0, 0]} barSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">
                                        No data available yet
                                    </div>
                                )}
                            </div>

                            {/* Monthly Growth Line Chart */}
                            <div className="bg-white rounded-2xl shadow-md border border-[#874B61]/10 p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Patient Growth</h3>
                                {metrics.monthly_growth.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart
                                            data={metrics.monthly_growth}
                                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ee" vertical={false} />
                                            <XAxis
                                                dataKey="month"
                                                tick={{ fontSize: 11, fill: '#6B7280' }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 11, fill: '#6B7280' }}
                                                domain={[0, 'dataMax']}
                                                tickFormatter={(value) => Math.round(value).toString()}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <Tooltip
                                                cursor={{ stroke: '#B06E87', strokeWidth: 1 }}
                                                contentStyle={{
                                                    borderRadius: '12px',
                                                    border: '1px solid #f3e8ee',
                                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                                                }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="count"
                                                stroke="#874B61"
                                                strokeWidth={3}
                                                dot={{ fill: '#874B61', r: 4 }}
                                                activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">
                                        No data available yet
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Satisfaction Distribution Pie Chart */}
                        <div className="bg-white rounded-2xl shadow-md border border-[#874B61]/10 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Satisfaction Distribution</h3>
                            {metrics.satisfaction_distribution.length > 0 ? (
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={metrics.satisfaction_distribution}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={120}
                                                paddingAngle={3}
                                                dataKey="count"
                                                nameKey="score"
                                                label={({ score, count }) => `${score}★ (${count})`}
                                            >
                                                {metrics.satisfaction_distribution.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={PIE_COLORS[entry.score - 1] || PIE_COLORS[4]}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: '12px',
                                                    border: '1px solid #f3e8ee',
                                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                                                }}
                                                formatter={(value: number, name: string) => [`${value} patients`, `Score: ${name}`]}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="flex flex-wrap md:flex-col gap-2">
                                        {metrics.satisfaction_distribution.map((d) => (
                                            <div key={d.score} className="flex items-center gap-2 text-sm">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: PIE_COLORS[d.score - 1] || PIE_COLORS[4] }}
                                                />
                                                <span className="text-gray-600">{d.score} Star — {d.count} patients</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">
                                    No data available yet
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* FEEDBACK TAB */}
                {activeTab === 'feedback' && (
                    <div className="space-y-6">
                        {/* Filters */}
                        <div className="bg-white rounded-2xl shadow-md border border-[#874B61]/10 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Filter className="h-5 w-5 text-[#874B61]" />
                                <h3 className="font-semibold text-gray-800">Filters</h3>
                            </div>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                <div className="relative">
                                    <select
                                        value={filterCondition}
                                        onChange={(e) => setFilterCondition(e.target.value)}
                                        className="input-field !py-2 text-sm appearance-none pr-8"
                                    >
                                        <option value="">All Conditions</option>
                                        {CONDITIONS.filter(Boolean).map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>
                                <div className="relative">
                                    <select
                                        value={filterTreatment}
                                        onChange={(e) => setFilterTreatment(e.target.value)}
                                        className="input-field !py-2 text-sm appearance-none pr-8"
                                    >
                                        <option value="">All Treatments</option>
                                        {TREATMENTS.filter(Boolean).map((t) => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>
                                <input
                                    type="date"
                                    value={filterStartDate}
                                    onChange={(e) => setFilterStartDate(e.target.value)}
                                    className="input-field !py-2 text-sm"
                                    placeholder="Start date"
                                />
                                <input
                                    type="date"
                                    value={filterEndDate}
                                    onChange={(e) => setFilterEndDate(e.target.value)}
                                    className="input-field !py-2 text-sm"
                                    placeholder="End date"
                                />
                            </div>
                            <div className="flex gap-2 mt-3">
                                <button onClick={applyFilters} className="btn-primary !py-2 !px-5 text-sm">
                                    Apply Filters
                                </button>
                                <button onClick={clearFilters} className="btn-secondary !py-2 !px-5 text-sm">
                                    Clear
                                </button>
                            </div>
                        </div>

                        {/* Feedback Table */}
                        <div className="bg-white rounded-2xl shadow-md border border-[#874B61]/10 p-6 overflow-x-auto">
                            <h3 className="font-semibold text-gray-800 mb-4">
                                Feedback Entries ({feedback.length})
                            </h3>
                            {feedback.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">
                                    <ClipboardList className="h-12 w-12 mx-auto mb-3 text-[#874B61]/30" />
                                    <p>No feedback entries found</p>
                                </div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-[#874B61]/10">
                                            <th className="text-left py-3 px-2 text-gray-500 font-medium">Patient</th>
                                            <th className="text-left py-3 px-2 text-gray-500 font-medium">Condition</th>
                                            <th className="text-left py-3 px-2 text-gray-500 font-medium">Treatment</th>
                                            <th className="text-center py-3 px-2 text-gray-500 font-medium">Improvement</th>
                                            <th className="text-center py-3 px-2 text-gray-500 font-medium">Satisfaction</th>
                                            <th className="text-center py-3 px-2 text-gray-500 font-medium">Complications</th>
                                            <th className="text-center py-3 px-2 text-gray-500 font-medium">Recommend</th>
                                            <th className="text-left py-3 px-2 text-gray-500 font-medium">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {feedback.map((fb) => (
                                            <tr key={fb.id} className="border-b border-gray-50 hover:bg-[#F6EEDE]/30 transition-colors">
                                                <td className="py-3 px-2 font-medium text-gray-700">{fb.patient_name || 'Unknown'}</td>
                                                <td className="py-3 px-2">
                                                    <span className="px-2 py-1 bg-[#874B61]/10 text-[#874B61] text-xs rounded-full font-medium">
                                                        {fb.condition}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-2 text-gray-600">{fb.treatment_type}</td>
                                                <td className="py-3 px-2 text-center">
                                                    <span className={`font-bold ${fb.improvement_level >= 4 ? 'text-green-500' : fb.improvement_level >= 3 ? 'text-yellow-500' : 'text-red-500'}`}>
                                                        {fb.improvement_level}/5
                                                    </span>
                                                </td>
                                                <td className="py-3 px-2 text-center">
                                                    <span className={`font-bold ${fb.satisfaction_score >= 4 ? 'text-green-500' : fb.satisfaction_score >= 3 ? 'text-yellow-500' : 'text-red-500'}`}>
                                                        {fb.satisfaction_score}/5
                                                    </span>
                                                </td>
                                                <td className="py-3 px-2 text-center">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${fb.complications ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                        {fb.complications ? 'Yes' : 'No'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-2 text-center">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${fb.recommend ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                        {fb.recommend ? 'Yes' : 'No'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-2 text-gray-400 text-xs">
                                                    {new Date(fb.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                {/* ALERTS TAB */}
                {activeTab === 'alerts' && (
                    <div className="space-y-6">
                        {/* Low Satisfaction Alerts */}
                        <div className="bg-white rounded-2xl shadow-md border border-[#874B61]/10 p-6 border-l-4 border-l-red-400">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                <h3 className="font-semibold text-gray-800">
                                    Low Satisfaction (Score &lt; 2) — {lowSat.length} cases
                                </h3>
                            </div>
                            {lowSat.length === 0 ? (
                                <p className="text-sm text-gray-400">No low satisfaction cases found. Great job! 🎉</p>
                            ) : (
                                <div className="space-y-3">
                                    {lowSat.map((fb) => (
                                        <div key={fb.id} className="bg-red-50 rounded-xl p-4 border border-red-100">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <span className="font-medium text-gray-800">{fb.patient_name || 'Unknown'}</span>
                                                <span className="px-2 py-0.5 bg-red-200 text-red-700 text-xs rounded-full">
                                                    Satisfaction: {fb.satisfaction_score}/5
                                                </span>
                                                <span className="px-2 py-0.5 bg-[#874B61]/10 text-[#874B61] text-xs rounded-full">
                                                    {fb.condition}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                <strong>Diagnosis:</strong> {fb.diagnosis} | <strong>Treatment:</strong> {fb.treatment_type}
                                            </p>
                                            {fb.comments && (
                                                <p className="text-sm text-gray-500 mt-1 italic">&ldquo;{fb.comments}&rdquo;</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Complication Alerts */}
                        <div className="bg-white rounded-2xl shadow-md border border-[#874B61]/10 p-6 border-l-4 border-l-orange-400">
                            <div className="flex items-center gap-2 mb-4">
                                <Heart className="h-5 w-5 text-orange-500" />
                                <h3 className="font-semibold text-gray-800">
                                    Cases with Complications — {complications.length} cases
                                </h3>
                            </div>
                            {complications.length === 0 ? (
                                <p className="text-sm text-gray-400">No complication cases found. ✅</p>
                            ) : (
                                <div className="space-y-3">
                                    {complications.map((fb) => (
                                        <div key={fb.id} className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <span className="font-medium text-gray-800">{fb.patient_name || 'Unknown'}</span>
                                                <span className="px-2 py-0.5 bg-orange-200 text-orange-700 text-xs rounded-full">
                                                    Complications
                                                </span>
                                                <span className="px-2 py-0.5 bg-[#874B61]/10 text-[#874B61] text-xs rounded-full">
                                                    {fb.condition}
                                                </span>
                                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                    Improvement: {fb.improvement_level}/5
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                <strong>Diagnosis:</strong> {fb.diagnosis} | <strong>Treatment:</strong> {fb.treatment_type} | <strong>Duration:</strong> {fb.duration}
                                            </p>
                                            {fb.comments && (
                                                <p className="text-sm text-gray-500 mt-1 italic">&ldquo;{fb.comments}&rdquo;</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
