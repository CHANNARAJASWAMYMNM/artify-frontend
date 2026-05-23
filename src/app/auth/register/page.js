'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, User, Store, MapPin, Feather, Sparkles, ShieldAlert } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function RegisterPage() {
  const { register } = useAuth();
  const [role, setRole] = useState('customer'); // 'customer' or 'seller'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Seller specific states
  const [shopName, setShopName] = useState('');
  const [location, setLocation] = useState('');
  const [craftType, setCraftType] = useState('Pottery');
  const [story, setStory] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in email and password.');
      return;
    }

    const payload = {
      email,
      password,
      role,
    };

    if (role === 'seller') {
      if (!shopName || !location || !story || !craftType) {
        setError('Please fill in all seller details (Shop Name, Location, Story, and Craft Type).');
        return;
      }
      payload.shopName = shopName;
      payload.location = location;
      payload.story = story;
      payload.craftType = craftType;
    }

    setLoading(true);
    const res = await register(payload);
    if (!res.success) {
      setError(res.error || 'Registration failed. Please check your inputs.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-16 px-4 bg-sand-100">
        <div className="w-full max-w-xl bg-white border border-sand-200 rounded-3xl p-8 shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center justify-center p-2.5 rounded-full bg-clay-100 text-clay-700 mb-4">
              <Feather className="h-6 w-6 stroke-[1.5]" />
            </span>
            <h1 className="text-2xl font-bold font-serif text-gray-900">Create an Account</h1>
            <p className="text-xs text-gray-500 mt-1">Join the Artify marketplace to support or sell handcrafted goods.</p>
          </div>

          {/* Role selector */}
          <div className="flex bg-sand-100 rounded-xl p-1 mb-8 border border-sand-200">
            <button
              type="button"
              onClick={() => { setRole('customer'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all ${role === 'customer' ? 'bg-white text-clay-600 shadow-sm border border-sand-200/50' : 'text-gray-500 hover:text-gray-800'}`}
            >
              <User className="h-4 w-4" />
              I am a Customer
            </button>
            <button
              type="button"
              onClick={() => { setRole('seller'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all ${role === 'seller' ? 'bg-white text-clay-600 shadow-sm border border-sand-200/50' : 'text-gray-500 hover:text-gray-800'}`}
            >
              <Store className="h-4 w-4" />
              I am an Artisan / Seller
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 flex items-center gap-2 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-sand-50 border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-clay-600 focus:border-transparent text-xs text-gray-700"
                    required
                  />
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Seller Info Fields */}
            {role === 'seller' && (
              <div className="space-y-4 border-t border-sand-200 pt-6">
                <h3 className="text-sm font-bold font-serif text-clay-700 flex items-center gap-1">
                  <Feather className="h-4 w-4" /> Artisan Shop & Craft Details
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Shop/Studio Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. Ramu Clay Creations"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-sand-50 border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-clay-600"
                        required
                      />
                      <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Studio Location</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. Khurja, Uttar Pradesh"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-sand-50 border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-clay-600"
                        required
                      />
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Craft Category</label>
                  <select
                    value={craftType}
                    onChange={(e) => setCraftType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-sand-50 border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-clay-600 text-xs text-gray-700 font-medium"
                  >
                    <option value="Pottery">🏺 Pottery & Earthenware</option>
                    <option value="Clay Art">🗿 Terracotta & Sculptures</option>
                    <option value="Woodwork">🪵 Wooden Handcrafts</option>
                    <option value="Textiles">🧵 Handloom Weaving</option>
                    <option value="Other">🎨 Other Custom Crafts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Artisan Story & Biography</label>
                  <textarea
                    rows="3"
                    placeholder="Tell us about yourself, your family history with the craft, and the process you use to build your products. We show this story to customers!"
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-sand-50 border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-clay-600 text-xs text-gray-700 leading-relaxed"
                    required
                  ></textarea>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-clay-600 hover:bg-clay-700 disabled:bg-clay-400 text-white text-xs font-bold rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-clay-600"
            >
              {loading ? 'Creating Account...' : (role === 'seller' ? 'Register as Artisan' : 'Register Account')}
            </button>
          </form>

          {/* Footer link */}
          <div className="mt-8 text-center text-xs text-gray-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-bold text-clay-600 hover:underline">
              Log in here
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
