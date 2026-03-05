'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { doctorLogin } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Stethoscope, Lock, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function DoctorLoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#874B61]/5 via-white to-[#874B61]/10">
      <Navbar />
      <div className="pt-24 pb-16 px-4 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <div className="card !p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#874B61] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Doctor Login</h1>
              <p className="text-sm text-gray-500 mt-1">Access your admin dashboard</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4 border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Doctor phone number"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="input-field"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-5 w-5" />}
                Login to Dashboard
              </button>
            </form>

            <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                <strong>Dev credentials:</strong> Phone: 9999999999 | Password: admin123
              </p>
            </div>

            <div className="mt-6 text-center border-t border-[#874B61]/10 pt-4">
              <p className="text-xs text-gray-400">
                Are you a patient?{' '}
                <Link href="/login" className="text-[#874B61] hover:underline font-medium">
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
