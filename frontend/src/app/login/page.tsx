'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { sendOTP, verifyOTP, doctorLogin } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Phone, Shield, ArrowRight, Loader2, Stethoscope, Lock } from 'lucide-react';

const DOCTOR_PHONE = "9999999999"; // Doctor's official number

export default function UnifiedLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FDF8F0] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#874B61]" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/testimonials';
  const { login } = useAuth();

  const [step, setStep] = useState<'phone' | 'password' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devOtp, setDevOtp] = useState('');

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (phone === DOCTOR_PHONE) {
      setStep('password');
      return;
    }

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

  const handleDoctorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await doctorLogin(phone, password);
      login(res.access_token, res.role);
      router.push('/dashboard');
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
      router.push(redirectPath);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#874B61]/5 via-white to-[#874B61]/10">
      <Navbar />
      <div className="pt-24 pb-16 px-4 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <div className="card !p-8 shadow-2xl border-2 border-[#874B61]/5">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-[#874B61] rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl">
                {step === 'password' ? (
                  <Stethoscope className="h-10 w-10 text-white" />
                ) : (
                  <Phone className="h-10 w-10 text-white" />
                )}
              </div>
              <h1 className="text-3xl font-bold text-[#874B61]">
                {step === 'password' ? 'Doctor Login' : 'Portal Login'}
              </h1>
              <p className="text-gray-500 mt-2">
                {step === 'phone' && 'Enter your phone number to continue'}
                {step === 'password' && 'Enter your secure administrator password'}
                {step === 'otp' && 'Enter the 4-digit verification code'}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-4 rounded-2xl mb-6 border border-red-100 animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            {step === 'phone' && (
              <form onSubmit={handlePhoneSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter 10-digit number"
                    className="input-field !bg-white !rounded-2xl"
                    required
                    minLength={10}
                    maxLength={15}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-3 !rounded-2xl py-4 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ArrowRight className="h-6 w-6" />}
                  Continue
                </button>
              </form>
            )}

            {step === 'password' && (
              <form onSubmit={handleDoctorLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="input-field !bg-white !rounded-2xl pl-12"
                      required
                      autoFocus
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-3 !rounded-2xl py-4 shadow-[#874B61]/30"
                >
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Shield className="h-6 w-6" />}
                  Login to Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="w-full text-sm text-gray-400 hover:text-[#874B61]"
                >
                  Use a different number
                </button>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleVerifyOTP} className="space-y-5">
                {devOtp && (
                  <div className="bg-[#874B61]/5 text-[#874B61] text-sm p-4 rounded-2xl border border-[#874B61]/20 mb-4">
                    <Shield className="h-4 w-4 inline mr-2" />
                    Dev Mode OTP: <strong>{devOtp}</strong>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Verify OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="0000"
                    className="input-field text-center text-3xl font-bold tracking-[1rem] !bg-white !rounded-2xl"
                    required
                    minLength={4}
                    maxLength={6}
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="For our records"
                    className="input-field !bg-white !rounded-2xl"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-3 !rounded-2xl py-4 shadow-[#874B61]/30"
                >
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <CheckCircle className="h-6 w-6" />}
                  Confirm & Continue
                </button>
                <button
                  type="button"
                  onClick={() => { setStep('phone'); setOtp(''); setDevOtp(''); }}
                  className="w-full text-sm text-gray-400 hover:text-[#874B61]"
                >
                  Resend code or change number
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

import { CheckCircle } from 'lucide-react';
