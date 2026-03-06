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
    MessageSquareHeart, Sparkles, Loader2, MessageCircle, HeartHandshake
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
        <main className="min-h-screen bg-gradient-to-b from-white via-[#FDF8F0] to-white">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-20 md:pt-28 pb-10 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#874B61]/10 rounded-full text-[#874B61] text-sm font-medium mb-6">
                        <MessageSquareHeart className="h-4 w-4" />
                        Patient Testimonials
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-[#874B61] mb-6">
                        What Our Patients Say
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
                        Real experiences from patients who trusted Dr. Anusha B with their care.
                        Read their stories and share your own experience.
                    </p>
                    <button
                        onClick={() => {
                            if (isAuthenticated && role === 'patient') {
                                document.getElementById('feedback-form-section')?.scrollIntoView({ behavior: 'smooth' });
                            } else {
                                router.push('/login?redirect=/testimonials');
                            }
                        }}
                        className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-lg"
                    >
                        <HeartHandshake className="h-5 w-5" />
                        Share Your Feedback
                    </button>
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
                            <div className="w-20 h-20 bg-[#F6EEDE] rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <MessageCircle className="h-10 w-10 text-[#874B61]/40" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-600">No testimonials yet</h3>
                            <p className="text-gray-400 mt-1 text-sm">Be the first to share your experience!</p>
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
