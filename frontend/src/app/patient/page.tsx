'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { submitFeedback, getMyFeedback } from '@/lib/api';
import Navbar from '@/components/Navbar';
import {
  ClipboardList, Send, Loader2, Star, AlertCircle,
  CheckCircle, ChevronDown, Calendar
} from 'lucide-react';

const CONDITIONS = ['PCOS', 'Pregnancy', 'Infertility', 'Menstrual Disorder', 'High-Risk Pregnancy', 'Other'];
const TREATMENTS = ['Medication', 'Surgery', 'Therapy', 'Lifestyle', 'IVF', 'Other'];

interface FeedbackItem {
  id: string;
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

export default function PatientPage() {
  const router = useRouter();
  const { isAuthenticated, role, token, name } = useAuth();

  const [tab, setTab] = useState<'form' | 'history'>('form');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [form, setForm] = useState({
    condition: '',
    diagnosis: '',
    treatment_type: '',
    duration: '',
    improvement_level: 3,
    satisfaction_score: 3,
    complications: false,
    recommend: true,
    comments: '',
  });

  useEffect(() => {
    if (!isAuthenticated || role !== 'patient') {
      router.push('/login');
    }
  }, [isAuthenticated, role, router]);

  useEffect(() => {
    if (tab === 'history' && token) {
      loadHistory();
    }
  }, [tab, token]);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await getMyFeedback(token!);
      setFeedbackList(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await submitFeedback(token!, form);
      setSuccess('Feedback submitted successfully! Thank you.');
      setForm({
        condition: '',
        diagnosis: '',
        treatment_type: '',
        duration: '',
        improvement_level: 3,
        satisfaction_score: 3,
        complications: false,
        recommend: true,
        comments: '',
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || role !== 'patient') return null;

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 pb-12 px-4 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, <span className="text-pink-500">{name || 'Patient'}</span>
          </h1>
          <p className="text-gray-500 mt-1">Manage your medical feedback and treatment history</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('form')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              tab === 'form'
                ? 'bg-pink-500 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-pink-50'
            }`}
          >
            <Send className="h-4 w-4" />
            Submit Feedback
          </button>
          <button
            onClick={() => setTab('history')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              tab === 'history'
                ? 'bg-pink-500 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-pink-50'
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            My History
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm p-4 rounded-xl mb-4 border border-red-200">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 bg-green-50 text-green-600 text-sm p-4 rounded-xl mb-4 border border-green-200">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            {success}
          </div>
        )}

        {/* Feedback Form */}
        {tab === 'form' && (
          <form onSubmit={handleSubmit} className="card !p-8 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-pink-500" />
              Medical Feedback Form
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condition / Disease *</label>
                <div className="relative">
                  <select
                    value={form.condition}
                    onChange={(e) => setForm({ ...form, condition: e.target.value })}
                    className="input-field appearance-none pr-10"
                    required
                  >
                    <option value="">Select condition</option>
                    {CONDITIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Type *</label>
                <div className="relative">
                  <select
                    value={form.treatment_type}
                    onChange={(e) => setForm({ ...form, treatment_type: e.target.value })}
                    className="input-field appearance-none pr-10"
                    required
                  >
                    <option value="">Select treatment</option>
                    {TREATMENTS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis Provided *</label>
              <input
                type="text"
                value={form.diagnosis}
                onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                placeholder="Brief diagnosis from the doctor"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Duration *</label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                placeholder="e.g., 3 months, 6 weeks"
                className="input-field"
                required
              />
            </div>

            {/* Scales */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Improvement Level: <span className="text-pink-500 font-bold">{form.improvement_level}/5</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setForm({ ...form, improvement_level: n })}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                        form.improvement_level >= n
                          ? 'bg-pink-500 text-white shadow-md'
                          : 'bg-pink-100 text-pink-400'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Satisfaction Score: <span className="text-pink-500 font-bold">{form.satisfaction_score}/5</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setForm({ ...form, satisfaction_score: n })}
                      className={`w-10 h-10 rounded-xl transition-all ${
                        form.satisfaction_score >= n
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    >
                      <Star className={`h-8 w-8 ${form.satisfaction_score >= n ? 'fill-yellow-400' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Toggles */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Any Complications?</span>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, complications: !form.complications })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    form.complications ? 'bg-red-400' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      form.complications ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Would Recommend Doctor?</span>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, recommend: !form.recommend })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    form.recommend ? 'bg-green-400' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      form.recommend ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Comments</label>
              <textarea
                value={form.comments}
                onChange={(e) => setForm({ ...form, comments: e.target.value })}
                placeholder="Share your experience..."
                className="input-field min-h-[100px] resize-y"
                rows={4}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              Submit Feedback
            </button>
          </form>
        )}

        {/* History */}
        {tab === 'history' && (
          <div className="space-y-4">
            {loadingHistory ? (
              <div className="card text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-pink-400 mx-auto" />
                <p className="text-sm text-gray-400 mt-2">Loading your history...</p>
              </div>
            ) : feedbackList.length === 0 ? (
              <div className="card text-center py-12">
                <ClipboardList className="h-12 w-12 text-pink-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No feedback submitted yet</p>
                <p className="text-sm text-gray-400 mt-1">Submit your first feedback to see it here</p>
              </div>
            ) : (
              feedbackList.map((fb) => (
                <div key={fb.id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="inline-block px-3 py-1 bg-pink-100 text-pink-600 text-xs font-semibold rounded-full">
                        {fb.condition}
                      </span>
                      <span className="inline-block ml-2 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                        {fb.treatment_type}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="h-3 w-3" />
                      {new Date(fb.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2"><strong>Diagnosis:</strong> {fb.diagnosis}</p>
                  <p className="text-sm text-gray-700 mb-3"><strong>Duration:</strong> {fb.duration}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-pink-50 p-2 rounded-xl">
                      <p className="text-lg font-bold text-pink-500">{fb.improvement_level}/5</p>
                      <p className="text-xs text-gray-500">Improvement</p>
                    </div>
                    <div className="bg-yellow-50 p-2 rounded-xl">
                      <p className="text-lg font-bold text-yellow-500">{fb.satisfaction_score}/5</p>
                      <p className="text-xs text-gray-500">Satisfaction</p>
                    </div>
                    <div className={`p-2 rounded-xl ${fb.complications ? 'bg-red-50' : 'bg-green-50'}`}>
                      <p className={`text-lg font-bold ${fb.complications ? 'text-red-500' : 'text-green-500'}`}>
                        {fb.complications ? 'Yes' : 'No'}
                      </p>
                      <p className="text-xs text-gray-500">Complications</p>
                    </div>
                    <div className={`p-2 rounded-xl ${fb.recommend ? 'bg-green-50' : 'bg-red-50'}`}>
                      <p className={`text-lg font-bold ${fb.recommend ? 'text-green-500' : 'text-red-500'}`}>
                        {fb.recommend ? 'Yes' : 'No'}
                      </p>
                      <p className="text-xs text-gray-500">Recommend</p>
                    </div>
                  </div>
                  {fb.comments && (
                    <p className="mt-3 text-sm text-gray-500 italic border-t border-gray-100 pt-3">
                      &ldquo;{fb.comments}&rdquo;
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}
