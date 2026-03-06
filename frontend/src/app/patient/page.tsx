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

  const [tab] = useState<'history'>('history');
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
    <main className="min-h-screen bg-[#FDF8F0]">
      <Navbar />
      <div className="pt-28 pb-12 px-4 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#874B61]">
            Welcome, {name || 'Patient'}
          </h1>
          <p className="text-gray-500 mt-1">Manage your medical feedback and treatment history</p>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#874B61] rounded-2xl flex items-center justify-center shadow-lg shadow-[#874B61]/20">
              <ClipboardList className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#874B61]">Medical History</h2>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="flex items-center gap-3 bg-[#874B61]/5 text-[#874B61] text-sm p-4 rounded-2xl mb-6 border border-[#874B61]/10 animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-3 bg-[#874B61]/5 text-[#874B61] text-sm p-4 rounded-2xl mb-6 border border-[#874B61]/10 animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <p className="font-medium">{success}</p>
          </div>
        )}



        {/* History */}
        {tab === 'history' && (
          <div className="space-y-4">
            {loadingHistory ? (
              <div className="card text-center py-12">
                <Loader2 className="h-10 w-10 animate-spin text-[#874B61] mx-auto" />
                <p className="text-sm text-gray-500 mt-3 font-light">Loading your history...</p>
              </div>
            ) : feedbackList.length === 0 ? (
              <div className="bg-white/40 backdrop-blur-[2px] border border-[#874B61]/5 rounded-[2rem] p-8 text-center max-w-sm mx-auto shadow-sm">
                <div className="w-14 h-14 bg-white border border-[#874B61]/5 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <ClipboardList className="h-6 w-6 text-[#874B61]/20" />
                </div>
                <h3 className="text-base font-bold text-[#874B61]">No feedback yet</h3>
                <p className="text-gray-500 mt-1 text-xs font-light">Submit your first feedback to see it here</p>
              </div>
            ) : (
              feedbackList.map((fb) => (
                <div key={fb.id} className="card !p-7 hover:shadow-xl transition-all duration-300 border-[#874B61]/5 group">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                    <div className="flex gap-2">
                      <span className="inline-block px-4 py-1.5 bg-[#874B61]/10 text-[#874B61] text-xs font-bold uppercase tracking-wider rounded-full">
                        {fb.condition}
                      </span>
                      <span className="inline-block px-4 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider rounded-full">
                        {fb.treatment_type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 font-light">
                      <Calendar className="h-4 w-4" />
                      {new Date(fb.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="space-y-1 mb-6">
                    <p className="text-lg text-gray-800 font-medium leading-tight">{fb.diagnosis}</p>
                    <p className="text-sm text-gray-500 font-light">{fb.duration}</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-[#874B61]/5 p-4 rounded-2xl border border-[#874B61]/5 group-hover:bg-[#874B61]/10 transition-colors">
                      <p className="text-xl font-bold text-[#874B61]">{fb.improvement_level}/5</p>
                      <p className="text-[10px] uppercase font-bold text-[#874B61]/60 tracking-widest mt-1">Improvement</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100 group-hover:bg-yellow-100/50 transition-colors">
                      <p className="text-xl font-bold text-yellow-600">{fb.satisfaction_score}/5</p>
                      <p className="text-[10px] uppercase font-bold text-yellow-600/60 tracking-widest mt-1">Satisfaction</p>
                    </div>
                    <div className={`p-4 rounded-2xl border transition-colors ${fb.complications ? 'bg-[#874B61]/5 border-[#874B61]/10' : 'bg-gray-50 border-gray-100'}`}>
                      <p className={`text-xl font-bold ${fb.complications ? 'text-[#874B61]' : 'text-gray-400'}`}>
                        {fb.complications ? 'Yes' : 'No'}
                      </p>
                      <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mt-1">Complications</p>
                    </div>
                    <div className={`p-4 rounded-2xl border transition-colors ${fb.recommend ? 'bg-[#874B61]/5 border-[#874B61]/10' : 'bg-gray-50 border-gray-100'}`}>
                      <p className={`text-xl font-bold ${fb.recommend ? 'text-[#874B61]' : 'text-gray-400'}`}>
                        {fb.recommend ? 'Yes' : 'No'}
                      </p>
                      <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mt-1">Recommend</p>
                    </div>
                  </div>
                  {fb.comments && (
                    <p className="mt-6 text-base text-gray-600 font-light italic border-t border-[#874B61]/5 pt-5 leading-relaxed">
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
