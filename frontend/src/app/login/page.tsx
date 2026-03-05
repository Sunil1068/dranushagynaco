'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { sendOTP, verifyOTP } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Phone, Shield, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function PatientLoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
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
      router.push('/patient');
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
          <div className="card !p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#874B61] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Login</h1>
              <p className="text-sm text-gray-500 mt-1">
                {step === 'phone' ? 'Enter your phone number to receive an OTP' : 'Enter the OTP sent to your phone'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name (for new patients)</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
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
                  Verify & Login
                </button>
                <button
                  type="button"
                  onClick={() => { setStep('phone'); setOtp(''); setDevOtp(''); }}
                  className="w-full text-sm text-pink-500 hover:text-pink-600"
                >
                  Change phone number
                </button>
              </form>
            )}

            <div className="mt-6 text-center border-t border-[#874B61]/10 pt-4">
              <p className="text-xs text-gray-400">
                Are you the doctor?{' '}
                <Link href="/doctor-login" className="text-[#874B61] hover:underline font-medium">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
