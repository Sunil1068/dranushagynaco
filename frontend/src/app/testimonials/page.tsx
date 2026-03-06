'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getPublicFeedback } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TestimonialCard from '@/components/TestimonialCard';
import FeedbackForm from '@/components/FeedbackForm';
import {
    MessageSquareHeart, Sparkles, Loader2, MessageCircle, HeartHandshake, Send
} from 'lucide-react';

interface PublicFeedback {
    id: string;
    patient_name: string;
    condition: string;
    improvement_level: number;
    satisfaction_score: number;
    comments?: string;
    created_at: string;
}

export default function TestimonialsPage() {
    const { isAuthenticated, role } = useAuth();
    const router = useRouter();
    const [testimonials, setTestimonials] = useState<PublicFeedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadTestimonials();
    }, []);

    useEffect(() => {
        if (isAuthenticated && role === 'patient') {
            setShowForm(true);
        } else {
            setShowForm(false);
        }
    }, [isAuthenticated, role]);

    const loadTestimonials = async () => {
        try {
            const data = await getPublicFeedback();
            setTestimonials(data);
        } catch (err) {
            console.error('Failed to load testimonials:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#FDF8F0]">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-24 md:pt-32 pb-12 px-4 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#874B61]/20 to-transparent" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#874B61]/10 rounded-full text-[#874B61] text-xs font-bold uppercase tracking-widest mb-8 shadow-sm">
                        <MessageSquareHeart className="h-4 w-4" />
                        Patient Testimonials
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-[#874B61] mb-8 tracking-tight">
                        What Our Patients Say
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                        Real experiences from patients who trusted Dr. Anusha B with their care.
                        Read their stories and share your own experience.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => {
                                if (isAuthenticated && role === 'patient') {
                                    document.getElementById('feedback-form-section')?.scrollIntoView({ behavior: 'smooth' });
                                } else {
                                    router.push('/login?redirect=/testimonials#feedback-form-section');
                                }
                            }}
                            className="btn-primary flex items-center gap-3 px-10 py-4 text-lg shadow-xl hover:shadow-[#874B61]/20"
                        >
                            <Send className="h-6 w-6" />
                            Submit Feedback
                        </button>
                    </div>
                </div>
            </section>

            {/* Section 1: Public Testimonials */}
            <section className="px-4 pb-20">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="text-center py-16">
                            <Loader2 className="h-10 w-10 animate-spin text-[#874B61] mx-auto" />
                            <p className="text-gray-400 mt-3 text-sm">Loading testimonials...</p>
                        </div>
                    ) : testimonials.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-white border border-[#874B61]/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <MessageCircle className="h-10 w-10 text-[#874B61]/30" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#874B61]">No testimonials yet</h3>
                            <p className="text-gray-500 mt-2 text-lg font-light">Be the first to share your experience!</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {testimonials.map((t) => (
                                <TestimonialCard
                                    key={t.id}
                                    patientName={t.patient_name}
                                    condition={t.condition}
                                    improvementLevel={t.improvement_level}
                                    satisfactionScore={t.satisfaction_score}
                                    comments={t.comments}
                                    createdAt={t.created_at}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Section 2: Feedback Form (Only shown if logged in) */}
            {showForm && (
                <section id="feedback-form-section" className="px-4 pb-20">
                    <div className="max-w-3xl mx-auto">
                        <div className="space-y-6">
                            <FeedbackForm onSubmitSuccess={loadTestimonials} />
                        </div>
                    </div>
                </section>
            )}

            <Footer />
        </main>
    );
}
