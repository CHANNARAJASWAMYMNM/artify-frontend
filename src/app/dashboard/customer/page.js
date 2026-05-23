'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { apiRequest, formatCurrency } from '@/utils/api';
import { ShoppingBag, Bell, Package, CheckCircle2, Truck, RefreshCw, Star, MapPin, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function CustomerDashboard() {
  const { user, notifications, markNotificationRead, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await apiRequest('/orders/customer');
    if (res.success) {
      setOrders(res.data.orders);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleNotificationRead = async (id) => {
    await markNotificationRead(id);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Processing':
        return <Package className="h-5 w-5 text-amber-500" />;
      case 'Shipped':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'Delivered':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Shipped': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Delivered': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-20 bg-sand-100">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-clay-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        {/* Welcome Banner */}
        <div className="bg-white border border-sand-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-gray-900">My Dashboard</h1>
            <p className="text-xs text-gray-500 mt-1">Logged in as {user.email} (Customer)</p>
          </div>
          <button
            onClick={logout}
            className="text-xs font-bold text-red-650 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl border border-red-200/50 transition-colors"
          >
            Sign Out Session
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Order History */}
          <section className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center border-b border-sand-200 pb-3 mb-4">
              <h2 className="text-base font-bold font-serif text-gray-900 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-clay-600" /> Order History & Tracking
              </h2>
              <button onClick={fetchOrders} className="p-1 hover:bg-sand-100 rounded text-gray-400 hover:text-gray-700">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white border border-sand-200 rounded-2xl h-44" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white border border-sand-200 rounded-2xl p-12 text-center text-xs text-gray-500">
                You haven't ordered any handcrafted goods yet.{' '}
                <Link href="/products" className="font-bold text-clay-600 hover:underline">
                  Start browsing
                </Link>.
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white border border-sand-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-sand-100 pb-3.5">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tracking Reference</p>
                        <p className="text-xs font-bold text-gray-800 mt-0.5">{order.trackingNumber}</p>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border shadow-sm flex items-center gap-1.5 ${getStatusColor(order.shippingStatus)}`}>
                        {getStatusIcon(order.shippingStatus)}
                        {order.shippingStatus}
                      </span>
                    </div>

                    {/* Ordered Items */}
                    <div className="divide-y divide-sand-150">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-3 flex justify-between items-center gap-4 text-xs">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-gray-400 bg-sand-100 border border-sand-200 rounded px-1.5 py-0.5">{item.quantity}x</span>
                            <div>
                              <p className="font-bold text-gray-800 line-clamp-1">{item.product?.name || 'Handcrafted Craft'}</p>
                              <p className="text-[9px] text-gray-400 mt-0.5">Purchased at {formatCurrency(item.price)} each</p>
                            </div>
                          </div>
                          
                          {/* Details and review buttons */}
                          <div className="flex items-center gap-3 shrink-0">
                            {order.shippingStatus === 'Delivered' && item.product && (
                              <Link
                                href={`/products/${item.product._id || item.product}`}
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-clay-650 bg-clay-50 hover:bg-clay-100 px-2.5 py-1.5 rounded-lg border border-clay-200"
                              >
                                <Star className="h-3 w-3 text-clay-600 fill-current" />
                                Review
                              </Link>
                            )}
                            <span className="font-extrabold text-gray-850">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer Address and Summary */}
                    <div className="border-t border-sand-100 pt-4 flex flex-col sm:flex-row justify-between gap-4 text-xs">
                      {/* Shipping details */}
                      <div className="flex gap-1 text-gray-500">
                        <MapPin className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-gray-700">{order.shippingAddress?.name}</p>
                          <p className="text-[11px] leading-relaxed mt-0.5">
                            {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
                          </p>
                        </div>
                      </div>
                      
                      {/* Price split totals */}
                      <div className="flex flex-col items-end shrink-0">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Total Paid ({order.paymentMethod})</span>
                        <span className="text-base font-extrabold text-gray-900 mt-0.5">{formatCurrency(order.totalAmount)}</span>
                        <span className={`text-[10px] font-bold mt-1 ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-amber-600'}`}>
                          ● Payment: {order.paymentStatus}
                        </span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Right Column: In-App Notifications */}
          <section className="bg-white border border-sand-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
            <h2 className="text-base font-bold font-serif text-gray-900 border-b border-sand-100 pb-3 flex items-center gap-2">
              <Bell className="h-5 w-5 text-clay-600" /> Notifications Inbox
            </h2>

            {notifications.length === 0 ? (
              <p className="text-center text-xs text-gray-400 py-6">No notifications yet.</p>
            ) : (
              <div className="space-y-3.5 max-h-96 overflow-y-auto pr-1">
                {notifications.map((notif) => (
                  <div
                    key={notif._id}
                    className={`p-3.5 border rounded-xl flex flex-col gap-1 transition-all relative group cursor-pointer ${!notif.isRead ? 'bg-clay-50/50 border-clay-200' : 'border-sand-200'}`}
                    onClick={() => handleNotificationRead(notif._id)}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-xs font-bold text-gray-800">{notif.title}</p>
                      {!notif.isRead && (
                        <span className="h-1.5 w-1.5 rounded-full bg-clay-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 leading-relaxed">{notif.message}</p>
                    <p className="text-[9px] text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
