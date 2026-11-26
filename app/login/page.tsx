'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, Loader2 } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      router.push(redirect);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message || 'ইমেইল বা পাসওয়ার্ড সঠিক নয় (Invalid email or password)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-3 sm:px-4 py-8 sm:py-12">
      <div className="w-full max-w-md bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-xl space-y-5 sm:space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl overflow-hidden mx-auto shadow-md border border-[#F48721]/30">
            <img src="/epsr-icon.svg" alt="EPSR" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-2xl font-black text-[#221E1F]">লগইন করুন</h2>
          <p className="text-xs text-gray-500">
            EPSR — Easy Product Service Rajshahi এ স্বাগতম
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">ইমেইল ঠিকানা</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-3 sm:py-2.5 text-base sm:text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#F48721] focus:ring-1 focus:ring-[#F48721]"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 sm:top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">পাসওয়ার্ড</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-3 sm:py-2.5 text-base sm:text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#F48721] focus:ring-1 focus:ring-[#F48721]"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 sm:top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#F48721] hover:bg-[#e07515] text-white font-extrabold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>লগইন হচ্ছে...</span>
              </>
            ) : (
              <span>সাইন ইন করুন</span>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          অ্যাকাউন্ট নেই?{' '}
          <Link href="/register" className="font-bold text-[#F48721] hover:underline">
            নতুন অ্যাকাউন্ট তৈরি করুন
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400 font-bold">লোড হচ্ছে...</div>}>
      <LoginContent />
    </Suspense>
  );
}
