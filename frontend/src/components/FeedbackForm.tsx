'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { submitFeedback } from '@/lib/api';
import StarRating from './StarRating';
import {
    Send, Loader2, CheckCircle, AlertCircle,
    ChevronDown, ClipboardList, Heart
} from 'lucide-react';

const CONDITIONS = ['PCOS', 'Pregnancy', 'Infertility', 'Menstrual Disorder', 'High-Risk Pregnancy', 'Other'];
const TREATMENTS = ['Medication', 'Surgery', 'Therapy', 'Lifestyle', 'IVF', 'Other'];

interface FeedbackFormProps {
    onSubmitSuccess?: () => void;
}

export default function FeedbackForm({ onSubmitSuccess }: FeedbackFormProps) {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        name: '',
        age: '',
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            await submitFeedback(token, {
                ...form,
                age: form.age ? parseInt(form.age) : undefined,
                name: form.name || undefined,
            });
            setSuccess('Thank you for your feedback! Your experience helps other patients make informed decisions.');
            setForm({
                name: '',
                age: '',
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
            onSubmitSuccess?.();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md border border-[#874B61]/10 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[#874B61] to-[#B06E87] rounded-xl flex items-center justify-center">
                    <ClipboardList className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-800">Medical Feedback Form</h3>
                    <p className="text-xs text-gray-500">All fields marked * are required</p>
                </div>
            </div>

            {/* Messages */}
            {error && (
                <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-200">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" /> {error}
                </div>
            )}
            {success && (
                <div className="flex items-center gap-2 bg-green-50 text-green-700 text-sm p-4 rounded-xl border border-green-200">
                    <CheckCircle className="h-5 w-5 flex-shrink-0" /> {success}
                </div>
            )}

            {/* Personal Details */}
            <div>
                <h4 className="text-sm font-semibold text-[#874B61] uppercase tracking-wide mb-3">Personal Details</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Your full name"
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                        <input
                            type="number"
                            value={form.age}
                            onChange={(e) => setForm({ ...form, age: e.target.value })}
                            placeholder="Your age"
                            className="input-field"
                            min={1}
                            max={120}
                        />
                    </div>
                </div>
            </div>

            {/* Medical Details */}
            <div>
                <h4 className="text-sm font-semibold text-[#874B61] uppercase tracking-wide mb-3">Medical Information</h4>
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

                <div className="mt-4">
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
                <div className="mt-4">
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
            </div>

            {/* Rating Scales */}
            <div>
                <h4 className="text-sm font-semibold text-[#874B61] uppercase tracking-wide mb-3">Your Rating</h4>
                <div className="grid sm:grid-cols-2 gap-6">
                    <StarRating
                        value={form.improvement_level}
                        onChange={(v) => setForm({ ...form, improvement_level: v })}
                        label="Improvement Level"
                        size="lg"
                        interactive
                    />
                    <StarRating
                        value={form.satisfaction_score}
                        onChange={(v) => setForm({ ...form, satisfaction_score: v })}
                        label="Satisfaction Score"
                        size="lg"
                        interactive
                    />
                </div>
            </div>

            {/* Toggles */}
            <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-[#F6EEDE]/50 rounded-xl border border-[#874B61]/10">
                    <span className="text-sm font-medium text-gray-700">Any Complications?</span>
                    <button
                        type="button"
                        onClick={() => setForm({ ...form, complications: !form.complications })}
                        className={`relative w-12 h-6 rounded-full transition-colors ${form.complications ? 'bg-red-400' : 'bg-gray-300'
                            }`}
                    >
                        <span
                            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.complications ? 'translate-x-6' : 'translate-x-0.5'
                                }`}
                        />
                    </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-[#F6EEDE]/50 rounded-xl border border-[#874B61]/10">
                    <span className="text-sm font-medium text-gray-700">Would Recommend Doctor?</span>
                    <button
                        type="button"
                        onClick={() => setForm({ ...form, recommend: !form.recommend })}
                        className={`relative w-12 h-6 rounded-full transition-colors ${form.recommend ? 'bg-green-400' : 'bg-gray-300'
                            }`}
                    >
                        <span
                            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.recommend ? 'translate-x-6' : 'translate-x-0.5'
                                }`}
                        />
                    </button>
                </div>
            </div>

            {/* Comments */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Comments</label>
                <textarea
                    value={form.comments}
                    onChange={(e) => setForm({ ...form, comments: e.target.value })}
                    placeholder="Share your experience with us..."
                    className="input-field min-h-[120px] resize-y"
                    rows={4}
                />
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 text-lg !py-4"
            >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                Submit Feedback
            </button>
        </form>
    );
}
