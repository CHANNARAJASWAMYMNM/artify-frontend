'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { apiRequest, formatCurrency } from '@/utils/api';
import { Shield, Sparkles, UserCheck, Users, ShoppingBag, Trash2, IndianRupee, RefreshCw, BadgeHelp, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { user, loading: authLoading, logout } = useAuth();

  const [analytics, setAnalytics] = useState(null);
  const [pendingSellers, setPendingSellers] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tabs: 'pending' | 'users' | 'products'
  const [activeTab, setActiveTab] = useState('pending');

  const fetchAdminData = async () => {
    if (!user) return;
    setLoading(true);

    // 1. Fetch Analytics
    const anaRes = await apiRequest('/admin/analytics');
    if (anaRes.success) {
      setAnalytics(anaRes.data.analytics);
    }

    // 2. Fetch Pending Sellers
    const pendRes = await apiRequest('/admin/sellers/pending');
    if (pendRes.success) {
      setPendingSellers(pendRes.data.sellers);
    }

    // 3. Fetch Users
    const usrRes = await apiRequest('/admin/users');
    if (usrRes.success) {
      setUsers(usrRes.data.users);
    }

    // 4. Fetch Products (Public endpoint, admin can moderate)
    const prodRes = await apiRequest('/products');
    if (prodRes.success) {
      setProducts(prodRes.data.products);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchAdminData();
    }
  }, [user]);

  const handleApproveSeller = async (profileId, approve) => {
    const res = await apiRequest(`/admin/sellers/${profileId}/approve`, {
      method: 'PUT',
      body: { approve }
    });

    if (res.success) {
      alert(approve ? 'Artisan profile approved successfully!' : 'Artisan profile status updated.');
      await fetchAdminData();
    } else {
      alert(res.error || 'Operation failed');
    }
  };

  const handleProductDelete = async (prodId) => {
    if (confirm('Are you sure you want to delete this product globally from the platform?')) {
      const res = await apiRequest(`/products/${prodId}`, { method: 'DELETE' });
      if (res.success) {
        alert('Product deleted successfully.');
        await fetchAdminData();
      }
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    const res = await apiRequest(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: { role: newRole }
    });

    if (res.success) {
      alert(`User role updated successfully to ${newRole}!`);
      await fetchAdminData();
    } else {
      alert(res.error || 'Failed to update user role');
    }
  };

  if (authLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-sand-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-clay-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow max-w-xl mx-auto py-16 px-4 text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto" />
          <h1 className="mt-4 text-xl font-bold font-serif text-gray-800">Access Denied</h1>
          <p className="text-gray-500 mt-2">Only administrator accounts can view this dashboard panel.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        {/* Header */}
        <div className="bg-white border border-sand-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-gray-900">Admin Control Center</h1>
              <span className="bg-clay-650 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Shield className="h-3 w-3" /> System Admin
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Platform analytics, street artisan verification, and product moderation.</p>
          </div>
          <button
            onClick={logout}
            className="text-xs font-bold text-red-655 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl border border-red-200/50 transition-colors"
          >
            Sign Out Admin
          </button>
        </div>

        {/* Global Financial Metrics */}
        {analytics && (
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="bg-white border border-sand-200 p-5 rounded-2xl shadow-sm">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Gross Platform Sales</span>
              <div className="text-xl sm:text-2xl font-black text-gray-900 mt-1 flex items-center">
                <IndianRupee className="h-5.5 w-5.5 text-gray-400" />
                {analytics.financials.totalRevenue}
              </div>
            </div>
            <div className="bg-white border border-sand-200 p-5 rounded-2xl shadow-sm">
              <span className="text-[10px] uppercase font-bold text-clay-700 tracking-wider font-semibold">Commissions Collected (10%)</span>
              <div className="text-xl sm:text-2xl font-black text-clay-600 mt-1 flex items-center">
                <IndianRupee className="h-5.5 w-5.5 text-clay-400" />
                {analytics.financials.totalCommissions}
              </div>
            </div>
            <div className="bg-white border border-sand-200 p-5 rounded-2xl shadow-sm">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Artisan Payouts (90%)</span>
              <div className="text-xl sm:text-2xl font-black text-gray-900 mt-1 flex items-center">
                <IndianRupee className="h-5.5 w-5.5 text-gray-400" />
                {analytics.financials.totalPayouts}
              </div>
            </div>
            <div className="bg-white border border-sand-200 p-5 rounded-2xl shadow-sm">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Orders</span>
              <div className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                {analytics.counts.orders}
              </div>
            </div>
          </section>
        )}

        {/* Tab Controls */}
        <div className="flex border-b border-sand-200 mb-8 gap-6">
          <button
            onClick={() => setActiveTab('pending')}
            className={`pb-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'pending' ? 'border-clay-650 text-clay-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
          >
            Artisan Approvals ({pendingSellers.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'users' ? 'border-clay-650 text-clay-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
          >
            Accounts Manager ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'products' ? 'border-clay-650 text-clay-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
          >
            Global Moderation ({products.length})
          </button>
        </div>

        {/* TAB 1: Pending Sellers */}
        {activeTab === 'pending' && (
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold font-serif text-gray-900">Artisan Applications Checklist</h3>
              <button onClick={fetchAdminData} className="p-1.5 hover:bg-sand-100 rounded text-gray-400 hover:text-gray-700">
                <RefreshCw className="h-4.5 w-4.5" />
              </button>
            </div>

            {pendingSellers.length === 0 ? (
              <div className="bg-white border border-sand-200 rounded-2xl p-16 text-center text-xs text-gray-500 shadow-sm">
                No pending seller registrations found. All artisans are currently approved.
              </div>
            ) : (
              <div className="space-y-6">
                {pendingSellers.map((seller) => (
                  <div key={seller._id} className="bg-white border border-sand-200 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      {/* Artisan Summary */}
                      <div className="flex gap-4 items-center">
                        <div className="h-12 w-12 rounded-full bg-sand-200 overflow-hidden shrink-0">
                          <img src={seller.profileImage} alt={seller.shopName} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-gray-850 text-base">{seller.shopName}</h4>
                          <p className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">Email: {seller.user?.email || 'N/A'}</p>
                          <p className="text-[10px] text-gray-400 font-semibold uppercase">Craft: {seller.craftType} • Location: {seller.location}</p>
                        </div>
                      </div>

                      {/* Approval triggers */}
                      <div className="flex gap-2 shrink-0 w-full sm:w-auto">
                        <button
                          onClick={() => handleApproveSeller(seller._id, false)}
                          className="flex-1 sm:flex-initial py-2 px-4 border border-sand-300 hover:bg-sand-50 text-gray-600 font-bold text-xs rounded-xl"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleApproveSeller(seller._id, true)}
                          className="flex-1 sm:flex-initial py-2 px-5 bg-clay-600 hover:bg-clay-700 text-white font-bold text-xs rounded-xl shadow-sm"
                        >
                          Approve Artisan
                        </button>
                      </div>
                    </div>

                    {/* Story summary */}
                    <div className="bg-sand-50 border border-sand-200 rounded-xl p-4">
                      <h5 className="text-[9px] uppercase font-bold text-gray-400 tracking-widest mb-1.5">Artisan Heritage Biography</h5>
                      <p className="text-xs text-gray-600 leading-relaxed font-sans">{seller.story}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 2: Accounts list */}
        {activeTab === 'users' && (
          <section className="space-y-6">
            <h3 className="text-base font-bold font-serif text-gray-900">Platform Accounts Directory</h3>
            
            <div className="bg-white border border-sand-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="min-w-full divide-y divide-sand-200 text-left text-xs">
                <thead className="bg-sand-100 font-bold text-gray-500 uppercase tracking-wider text-[9px]">
                  <tr>
                    <th className="px-6 py-3">Account Email</th>
                    <th className="px-6 py-3">Account Role</th>
                    <th className="px-6 py-3">Artisan Shop</th>
                    <th className="px-6 py-3">Joined Date</th>
                    <th className="px-6 py-3 text-right">Adjust Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-200 text-gray-700">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-sand-50/50">
                      <td className="px-6 py-4 font-semibold">{u.email}</td>
                      <td className="px-6 py-4 uppercase font-bold text-[10px] tracking-wide">
                        <span className={`px-2.5 py-0.5 rounded border ${u.role === 'admin' ? 'bg-clay-50 border-clay-200 text-clay-700' : u.role === 'seller' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-medium">
                        {u.role === 'seller' ? (u.sellerProfile?.shopName || 'Profile Pending') : '—'}
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right font-medium">
                        {u._id !== user._id && u.email !== 'admin@artify.com' ? (
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleUpdate(u._id, e.target.value)}
                            className="bg-sand-50 border border-sand-300 rounded-lg text-xs font-semibold px-2 py-1 focus:ring-2 focus:ring-clay-600 text-gray-750"
                          >
                            <option value="customer">Customer</option>
                            <option value="seller">Seller</option>
                            <option value="admin">Admin</option>
                          </select>
                        ) : (
                          <span className="text-[10px] text-gray-400 italic">Primary Admin</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 3: Global Moderation */}
        {activeTab === 'products' && (
          <section className="space-y-6">
            <h3 className="text-base font-bold font-serif text-gray-900">Product Moderation Checklist</h3>

            <div className="bg-white border border-sand-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="min-w-full divide-y divide-sand-200 text-left text-xs">
                <thead className="bg-sand-100 font-bold text-gray-500 uppercase tracking-wider text-[9px]">
                  <tr>
                    <th className="px-6 py-3">Craft Details</th>
                    <th className="px-6 py-3">Artisan Shop</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Stock</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-200 text-gray-700">
                  {products.map((prod) => (
                    <tr key={prod._id} className="hover:bg-sand-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={prod.images?.[0]} alt={prod.name} className="h-9 w-9 rounded-lg object-cover bg-sand-100 border border-sand-200" />
                          <span className="font-bold text-gray-850">{prod.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-medium">{prod.shopName}</td>
                      <td className="px-6 py-4 uppercase font-bold text-[10px] text-clay-700">{prod.category}</td>
                      <td className="px-6 py-4 font-bold">{formatCurrency(prod.price)}</td>
                      <td className="px-6 py-4 text-gray-400 font-medium">{prod.stock} items</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleProductDelete(prod._id)}
                          className="p-1.5 text-gray-400 hover:text-red-655 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
}
