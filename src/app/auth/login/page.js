'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, ShieldAlert, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    if (!res.success) {
      setError(res.error || 'Invalid credentials. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-16 px-4 bg-sand-100">
        <div className="w-full max-w-md bg-white border border-sand-200 rounded-3xl p-8 shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center justify-center p-2.5 rounded-full bg-clay-100 text-clay-700 mb-4">
              <Sparkles className="h-6 w-6 stroke-[1.5]" />
            </span>
            <h1 className="text-2xl font-bold font-serif text-gray-900">Welcome Back</h1>
            <p className="text-xs text-gray-500 mt-1">Sign in to browse, buy, or manage your creations.</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 flex items-center gap-2 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-sand-50 border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-clay-600 focus:border-transparent text-xs text-gray-700"
                  required
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-sand-50 border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-clay-600 focus:border-transparent text-xs text-gray-700"
                  required
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-clay-600 hover:bg-clay-700 disabled:bg-clay-400 text-white text-xs font-bold rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-clay-600"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Footer link */}
          <div className="mt-8 text-center text-xs text-gray-500">
            Don't have an account?{' '}
            <Link href="/auth/register" className="font-bold text-clay-600 hover:underline">
              Sign up as customer or seller
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
