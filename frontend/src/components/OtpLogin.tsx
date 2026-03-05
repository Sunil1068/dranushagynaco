'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { sendOTP, verifyOTP } from '@/lib/api';
import { Phone, Shield, ArrowRight, Loader2, CheckCircle } from 'lucide-react';

interface OtpLoginProps {
    onLoginSuccess: () => void;
}

export default function OtpLogin({ onLoginSuccess }: OtpLoginProps) {
    const { login } = useAuth();

    const [step, setStep] = useState<'phone' | 'otp' | 'done'>('phone');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [devOtp, setDevOtp] = useState('');

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await sendOTP(phone);
            const match = res.message.match(/OTP is (\d+)/);
            if (match) setDevOtp(match[1]);
            setStep('otp');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await verifyOTP(phone, otp, name || undefined);
            login(res.access_token, res.role, res.patient_id, res.name);
            setStep('done');
            onLoginSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (step === 'done') {
        return (
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200 text-green-700">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium text-sm">Logged in successfully! You can now submit your feedback below.</span>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-md border border-[#874B61]/10 p-6 sm:p-8 max-w-md mx-auto">
            <div className="text-center mb-6">
                <div className="w-14 h-14 bg-[#874B61] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Phone className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Verify Your Identity</h3>
                <p className="text-sm text-gray-500 mt-1">
                    {step === 'phone'
                        ? 'Enter your phone number to receive an OTP'
                        : 'Enter the OTP sent to your phone'}
                </p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4 border border-red-200">
                    {error}
                </div>
            )}

            {step === 'phone' ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter 10-digit phone number"
                            className="input-field"
                            required
                            minLength={10}
                            maxLength={15}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            className="input-field"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
                        Send OTP
                    </button>
                </form>
            ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                    {devOtp && (
                        <div className="bg-blue-50 text-blue-700 text-sm p-3 rounded-xl border border-blue-200">
                            <Shield className="h-4 w-4 inline mr-1" />
                            Dev Mode OTP: <strong>{devOtp}</strong>
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter 4-digit OTP"
                            className="input-field text-center text-2xl tracking-widest"
                            required
                            minLength={4}
                            maxLength={6}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Shield className="h-5 w-5" />}
                        Verify & Continue
                    </button>
                    <button
                        type="button"
                        onClick={() => { setStep('phone'); setOtp(''); setDevOtp(''); }}
                        className="w-full text-sm text-[#874B61] hover:text-[#6B3A4D]"
                    >
                        Change phone number
                    </button>
                </form>
            )}
        </div>
    );
}
