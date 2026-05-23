'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { apiRequest, formatCurrency } from '@/utils/api';
import { ShieldCheck, MapPin, CreditCard, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();

  // Address fields
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');

  // Payment fields
  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' or 'Online'
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Status fields
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Check auth
  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !street || !city || !state || !postalCode || !phone) {
      setError('Please fill in all shipping address fields.');
      return;
    }

    if (paymentMethod === 'Online') {
      if (!cardNumber || !expiry || !cvv) {
        setError('Please enter your simulated credit card details.');
        return;
      }
    }

    setLoading(true);

    // Map cart items for backend
    const items = cart.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
    }));

    // Mock payment details
    const paymentDetails = {
      transactionId: paymentMethod === 'COD' 
        ? 'COD-PAY-' + Math.random().toString(36).substring(2, 9).toUpperCase()
        : 'STRIPE-PAY-' + Math.random().toString(36).substring(2, 9).toUpperCase()
    };

    const res = await apiRequest('/orders', {
      method: 'POST',
      body: {
        items,
        paymentMethod,
        shippingAddress: {
          name,
          street,
          city,
          state,
          postalCode,
          phone,
          country: 'India'
        },
        paymentDetails
      }
    });

    if (res.success) {
      setSuccess(true);
      clearCart();
      setTimeout(() => {
        router.push('/dashboard/customer');
      }, 3000);
    } else {
      setError(res.error || 'Failed to place order.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow max-w-xl mx-auto py-24 px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-green-100 text-green-600 mb-6">
            <CheckCircle2 className="h-14 w-14 stroke-[1.25]" />
          </div>
          <h1 className="text-3xl font-bold font-serif text-gray-800">Order Placed Successfully!</h1>
          <p className="text-gray-500 mt-3 text-xs leading-relaxed max-w-md mx-auto">
            Your payment reference has been processed and notifications were dispatched to the artisan studios. Redirecting you to your order tracking dashboard...
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow max-w-xl mx-auto py-24 px-4 text-center">
          <AlertCircle className="h-12 w-12 text-clay-600 mx-auto" />
          <h1 className="mt-4 text-xl font-bold font-serif text-gray-850">Your Cart is Empty</h1>
          <p className="text-gray-500 text-xs mt-1">Add crafts before attempting to checkout.</p>
          <Link href="/products" className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-white bg-clay-600 px-4 py-2 rounded-lg">
            Back to Shop
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-gray-900 border-b border-sand-200 pb-5 mb-8">
          Checkout Gateway
        </h1>

        {error && (
          <div className="mb-6 flex items-center gap-2 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Shipping & Payment Fields */}
          <section className="lg:col-span-8 space-y-8">
            
            {/* Address */}
            <div className="bg-white border border-sand-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-bold font-serif text-gray-900 flex items-center gap-1.5 mb-5 uppercase tracking-wide">
                <MapPin className="h-4.5 w-4.5 text-clay-600" /> Shipping Destination
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl text-xs focus:ring-2 focus:ring-clay-600 focus:outline-none"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Street Address</label>
                  <input
                    type="text"
                    placeholder="e.g. Flat 104, Sunrise Residency, Sector 62"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl text-xs focus:ring-2 focus:ring-clay-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">City</label>
                  <input
                    type="text"
                    placeholder="e.g. Noida"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl text-xs focus:ring-2 focus:ring-clay-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">State</label>
                  <input
                    type="text"
                    placeholder="e.g. Uttar Pradesh"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl text-xs focus:ring-2 focus:ring-clay-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Pin Code</label>
                  <input
                    type="text"
                    placeholder="e.g. 201301"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl text-xs focus:ring-2 focus:ring-clay-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl text-xs focus:ring-2 focus:ring-clay-600 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white border border-sand-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-bold font-serif text-gray-900 flex items-center gap-1.5 mb-5 uppercase tracking-wide">
                <CreditCard className="h-4.5 w-4.5 text-clay-600" /> Payment Selection
              </h2>

              {/* Toggles */}
              <div className="flex gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 border rounded-xl text-left transition-all ${paymentMethod === 'COD' ? 'border-clay-600 bg-clay-50/50 text-clay-700 shadow-sm' : 'border-sand-200 text-gray-500 hover:bg-sand-50'}`}
                >
                  <span className="font-bold text-xs">Cash on Delivery (COD)</span>
                  <span className="text-[10px] text-gray-400">Pay cash upon home delivery</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Online')}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 border rounded-xl text-left transition-all ${paymentMethod === 'Online' ? 'border-clay-600 bg-clay-50/50 text-clay-700 shadow-sm' : 'border-sand-200 text-gray-500 hover:bg-sand-50'}`}
                >
                  <span className="font-bold text-xs">Simulated Credit Card</span>
                  <span className="text-[10px] text-gray-400">Mock Stripe gateway transaction</span>
                </button>
              </div>

              {/* Credit card inputs */}
              {paymentMethod === 'Online' && (
                <div className="space-y-4 bg-sand-50 border border-sand-200 rounded-xl p-4 animate-fadeIn">
                  <p className="text-[10px] text-clay-600 font-semibold mb-2">💡 Note: Enter dummy numbers to test payment confirmation.</p>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-sand-300 rounded-lg text-xs focus:ring-2 focus:ring-clay-600 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM / YY"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-sand-300 rounded-lg text-xs focus:ring-2 focus:ring-clay-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">CVV</label>
                      <input
                        type="password"
                        placeholder="123"
                        maxLength="3"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-sand-300 rounded-lg text-xs focus:ring-2 focus:ring-clay-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Pricing Column */}
          <section className="lg:col-span-4 bg-white border border-sand-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
            <h2 className="text-base font-bold font-serif text-gray-900 border-b border-sand-100 pb-3">
              Summary
            </h2>

            {/* Cart summary preview */}
            <div className="max-h-60 overflow-y-auto divide-y divide-sand-100 pr-1">
              {cart.map(item => (
                <div key={item.product._id} className="py-2.5 flex justify-between gap-4 text-xs">
                  <div>
                    <p className="font-bold text-gray-800 line-clamp-1">{item.product.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Qty: {item.quantity} • {item.shopName}</p>
                  </div>
                  <span className="font-bold text-gray-700 shrink-0">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total check */}
            <div className="border-t border-sand-200 pt-4 flex justify-between items-baseline">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Grand Total</span>
              <span className="text-2xl font-black text-gray-900">{formatCurrency(total)}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-clay-600 hover:bg-clay-700 disabled:bg-clay-400 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-clay-600 focus:ring-offset-2"
            >
              <ShieldCheck className="h-4.5 w-4.5" />
              {loading ? 'Processing Order...' : `Pay & Place Order`}
            </button>
          </section>

        </form>
      </main>

      <Footer />
    </div>
  );
}
