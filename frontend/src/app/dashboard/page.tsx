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
  Filter, Loader2, Heart, ChevronDown, Calendar, Search,
  BarChart3, MessageSquareText, Bell, CheckCircle
} from 'lucide-react';

interface Metrics {
  total_patients: number;
  total_feedback: number;
  avg_satisfaction: number;
  treatment_success_rate: number;
  top_conditions: { name: string; count: number }[];
  monthly_growth: { month: string; count: number }[];
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

const COLORS = ['#874B61', '#9A5C73', '#B06E87', '#C47A8E', '#D4919F', '#E4AAB4'];
const CONDITIONS = ['', 'PCOS', 'Pregnancy', 'Infertility', 'Menstrual Disorder', 'High-Risk Pregnancy', 'Other'];
const TREATMENTS = ['', 'Medication', 'Surgery', 'Therapy', 'Lifestyle', 'IVF', 'Other'];

export default function DashboardPage() {
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
        <div className="pt-32 flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#874B61] mx-auto" />
            <p className="text-gray-500 mt-4">Loading dashboard...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-[#FDF8F0] to-white">
      <Navbar />
      <div className="pt-32 pb-12 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#874B61]">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Clinical analytics and patient management</p>
          </div>
          <button
            onClick={loadDashboard}
            className="btn-secondary !py-2 !px-5 text-sm self-start"
          >
            Refresh Data
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {(['overview', 'feedback', 'alerts'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeTab === t
                ? 'bg-[#874B61] text-white shadow-lg shadow-[#874B61]/25'
                : 'bg-white text-gray-600 border border-[#874B61]/15 hover:bg-[#F6EEDE]'
                }`}
            >
              {t === 'overview' && <><BarChart3 className="h-4 w-4" /> Overview</>}
              {t === 'feedback' && <><MessageSquareText className="h-4 w-4" /> Feedback</>}
              {t === 'alerts' && <><Bell className="h-4 w-4" /> Alerts ({lowSat.length + complications.length})</>}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && metrics && (
          <div className="space-y-8">
            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card !p-5">
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
              <div className="card !p-5">
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
              <div className="card !p-5">
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
              <div className="card !p-5">
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

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Top Conditions Bar Chart */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Conditions</h3>
                {metrics.top_conditions.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={metrics.top_conditions}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ee" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} domain={[0, 'dataMax + 1']} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '12px',
                          border: '1px solid #f3e8ee',
                          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Bar dataKey="count" fill="#874B61" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">
                    No data available yet
                  </div>
                )}
              </div>

              {/* Monthly Growth Line Chart */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Patient Growth</h3>
                {metrics.monthly_growth.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={metrics.monthly_growth} margin={{ top: 15, right: 10, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ee" />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 11 }}
                        tickFormatter={(val: string) => {
                          const [y, m] = val.split('-');
                          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                          return `${months[parseInt(m, 10) - 1]} ${y}`;
                        }}
                      />
                      <YAxis allowDecimals={false} domain={[0, 'dataMax + 1']} />
                      <Tooltip
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
                        dot={{ fill: '#874B61', r: 5 }}
                        activeDot={{ r: 7 }}
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
          </div>
        )}

        {/* FEEDBACK TAB */}
        {activeTab === 'feedback' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="card">
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
            <div className="card overflow-x-auto">
              <h3 className="font-semibold text-gray-800 mb-4">
                Feedback Entries ({feedback.length}) - UPDATED
              </h3>
              {feedback.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <ClipboardList className="h-12 w-12 mx-auto mb-3 text-[#874B61]/30" />
                  <p>No feedback entries found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {feedback.map((fb) => (
                    <div key={fb.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div className="flex-1 min-w-[200px]">
                          <h4 className="font-semibold text-gray-900 text-lg mb-1">{fb.patient_name || 'Unknown Patient'}</h4>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-3 py-1 bg-[#F6EEDE] text-[#874B61] text-sm font-medium rounded-full">
                              {fb.condition}
                            </span>
                            <span className="text-sm text-gray-500">
                              {fb.treatment_type}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {new Date(fb.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Improvement</p>
                          <p className="text-lg font-bold text-gray-900">{fb.improvement_level}/5</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Satisfaction</p>
                          <p className="text-lg font-bold text-gray-900">{fb.satisfaction_score}/5</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Complications</p>
                          <p className={`text-sm font-medium ${fb.complications ? 'text-red-600' : 'text-green-600'}`}>
                            {fb.complications ? 'Yes' : 'No'}
                          </p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Recommend</p>
                          <p className={`text-sm font-medium ${fb.recommend ? 'text-green-600' : 'text-red-600'}`}>
                            {fb.recommend ? 'Yes' : 'No'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ALERTS TAB */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            {/* Low Satisfaction Alerts */}
            <div className="bg-white rounded-xl border border-red-200 shadow-sm">
              <div className="p-6 border-b border-red-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Low Satisfaction Alert</h3>
                    <p className="text-sm text-gray-500">Score &lt; 2 — {lowSat.length} cases</p>
                  </div>
                </div>
              </div>
              {lowSat.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-500">No low satisfaction cases found. Great job!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {lowSat.map((fb) => (
                    <div key={fb.id} className="p-6 hover:bg-red-50 transition-colors">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{fb.patient_name || 'Unknown Patient'}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                              Satisfaction: {fb.satisfaction_score}/5
                            </span>
                            <span className="text-sm text-gray-500">{fb.condition}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(fb.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Diagnosis:</span>
                          <span className="ml-2 text-gray-900">{fb.diagnosis}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Treatment:</span>
                          <span className="ml-2 text-gray-900">{fb.treatment_type}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Complication Alerts */}
            <div className="bg-white rounded-xl border border-orange-200 shadow-sm">
              <div className="p-6 border-b border-orange-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Heart className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Complication Alert</h3>
                    <p className="text-sm text-gray-500">Cases with complications — {complications.length} cases</p>
                  </div>
                </div>
              </div>
              {complications.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-500">No complication cases found.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {complications.map((fb) => (
                    <div key={fb.id} className="p-6 hover:bg-orange-50 transition-colors">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{fb.patient_name || 'Unknown Patient'}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                              Complications
                            </span>
                            <span className="text-sm text-gray-500">{fb.condition}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(fb.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">Diagnosis:</span>
                          <span className="ml-2 text-gray-900">{fb.diagnosis}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Treatment:</span>
                          <span className="ml-2 text-gray-900">{fb.treatment_type}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Duration:</span>
                          <span className="ml-2 text-gray-900">{fb.duration}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Improvement:</span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                          {fb.improvement_level}/5
                        </span>
                      </div>
                      {fb.comments && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 italic">&ldquo;{fb.comments}&rdquo;</p>
                        </div>
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
