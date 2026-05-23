'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { apiRequest, formatCurrency } from '@/utils/api';
import { Store, Plus, Edit2, Trash2, IndianRupee, ShoppingBag, Eye, RefreshCw, BadgeAlert, BadgeCheck, FileCode, CheckCircle, Package, Truck } from 'lucide-react';

export default function SellerDashboard() {
  const { user, sellerProfile, updateSeller, logout } = useAuth();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tabs: 'creations' | 'orders' | 'payout'
  const [activeTab, setActiveTab] = useState('creations');

  // Modal / Form state for Product Creation
  const [showProductModal, setShowProductModal] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productStock, setProductStock] = useState('10');
  const [productCategory, setProductCategory] = useState('Pottery');
  const [productDescription, setProductDescription] = useState('');
  const [productStory, setProductStory] = useState('');
  const [productImageBase64, setProductImageBase64] = useState('');
  const [formError, setFormError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Payout Form States
  const [upiId, setUpiId] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [bankName, setBankName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [payoutSuccess, setPayoutSuccess] = useState('');
  const [payoutError, setPayoutError] = useState('');

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    
    // Fetch products
    const prodRes = await apiRequest(`/sellers/${user._id}/products`);
    if (prodRes.success) {
      setProducts(prodRes.data.products);
    }

    // Fetch orders
    const ordRes = await apiRequest('/orders/seller');
    if (ordRes.success) {
      setOrders(ordRes.data.orders);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  // Load bank details on mount
  useEffect(() => {
    if (sellerProfile?.bankDetails) {
      setUpiId(sellerProfile.bankDetails.upiId || '');
      setAccountNo(sellerProfile.bankDetails.accountNo || '');
      setBankName(sellerProfile.bankDetails.bankName || '');
      setIfscCode(sellerProfile.bankDetails.ifscCode || '');
    }
  }, [sellerProfile]);

  const handlePayoutUpdate = async (e) => {
    e.preventDefault();
    setPayoutError('');
    setPayoutSuccess('');

    const res = await updateSeller({
      bankDetails: { upiId, accountNo, bankName, ifscCode }
    });

    if (res.success) {
      setPayoutSuccess('Payout configuration saved successfully!');
    } else {
      setPayoutError(res.error || 'Failed to save settings.');
    }
  };

  // Convert uploaded image file to Base64
  const handleImageFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setProductImageBase64(reader.result);
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleProductCreate = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!productName || !productPrice || !productStock || !productDescription || !productStory) {
      setFormError('Please fill in all required fields.');
      return;
    }

    setUploadingImage(true);

    // Call mock upload to process base64 image or fetch category stock image
    const uploadRes = await apiRequest('/upload', {
      method: 'POST',
      body: {
        imageBase64: productImageBase64,
        category: productCategory
      }
    });

    if (!uploadRes.success) {
      setFormError('Image processing failed.');
      setUploadingImage(false);
      return;
    }

    const imageUrl = uploadRes.data.url;

    // Create product
    const createRes = await apiRequest('/products', {
      method: 'POST',
      body: {
        name: productName,
        price: Number(productPrice),
        stock: Number(productStock),
        category: productCategory,
        description: productDescription,
        story: productStory,
        images: [imageUrl]
      }
    });

    if (createRes.success) {
      setShowProductModal(false);
      // Reset form
      setProductName('');
      setProductPrice('');
      setProductStock('10');
      setProductDescription('');
      setProductStory('');
      setProductImageBase64('');
      await fetchData();
    } else {
      setFormError(createRes.error || 'Failed to upload product.');
    }
    setUploadingImage(false);
  };

  const handleProductDelete = async (id) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      const res = await apiRequest(`/products/${id}`, { method: 'DELETE' });
      if (res.success) {
        await fetchData();
      }
    }
  };

  const handleShippingUpdate = async (orderId, newStatus) => {
    const res = await apiRequest(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: { shippingStatus: newStatus }
    });
    if (res.success) {
      await fetchData();
    } else {
      alert(res.error || 'Failed to update shipping status');
    }
  };

  // Calculations
  const completedOrders = orders.filter(o => o.paymentStatus === 'Paid');
  const totalSellerEarnings = completedOrders.reduce((sum, o) => sum + o.sellerSubtotal, 0);
  const platformCommissions = totalSellerEarnings * 0.10;
  const netSellerPayout = totalSellerEarnings - platformCommissions;

  if (!user || !sellerProfile) {
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
        
        {/* Verification banner */}
        {!sellerProfile.isApproved && (
          <div className="mb-8 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-xs font-semibold shadow-sm animate-pulse">
            <BadgeAlert className="h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <p className="font-bold text-[13px]">Artisan Profile Pending Verification</p>
              <p className="mt-1 text-amber-600 font-light">
                An Admin is currently reviewing your details. Once approved, your products will display publicly and you can begin uploading crafts.
              </p>
            </div>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="bg-white border border-sand-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-gray-900">{sellerProfile.shopName}</h1>
              {sellerProfile.isApproved ? (
                <span className="bg-green-50 text-green-700 border border-green-200 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <BadgeCheck className="h-3.5 w-3.5 fill-current text-green-600" /> Approved Studio
                </span>
              ) : (
                <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-bold px-2 py-0.5 rounded-full">
                  Pending Review
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Artisan Profile Studio • {sellerProfile.craftType} • {sellerProfile.location}</p>
          </div>
          <button
            onClick={logout}
            className="text-xs font-bold text-red-655 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl border border-red-200/50 transition-colors"
          >
            Sign Out Studio
          </button>
        </div>

        {/* Analytics stats row */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-white border border-sand-200 p-5 rounded-2xl shadow-sm">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Gross Sales</span>
            <div className="text-xl sm:text-2xl font-black text-gray-900 mt-1 flex items-center">
              <IndianRupee className="h-5.5 w-5.5 text-gray-400 shrink-0" />
              {totalSellerEarnings}
            </div>
          </div>
          <div className="bg-white border border-sand-200 p-5 rounded-2xl shadow-sm">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Platform Commission (10%)</span>
            <div className="text-xl sm:text-2xl font-black text-gray-900 mt-1 flex items-center">
              <IndianRupee className="h-5.5 w-5.5 text-gray-400 shrink-0" />
              {platformCommissions.toFixed(0)}
            </div>
          </div>
          <div className="bg-white border border-sand-200 p-5 rounded-2xl shadow-sm">
            <span className="text-[10px] uppercase font-bold text-clay-700 tracking-wider font-semibold">Net Payout (90%)</span>
            <div className="text-xl sm:text-2xl font-black text-clay-600 mt-1 flex items-center">
              <IndianRupee className="h-5.5 w-5.5 text-clay-400 shrink-0" />
              {netSellerPayout.toFixed(0)}
            </div>
          </div>
          <div className="bg-white border border-sand-200 p-5 rounded-2xl shadow-sm">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Creations Listed</span>
            <div className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
              {products.length}
            </div>
          </div>
        </section>

        {/* Dashboard Tabs Selector */}
        <div className="flex border-b border-sand-200 mb-8 gap-6">
          <button
            onClick={() => setActiveTab('creations')}
            className={`pb-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'creations' ? 'border-clay-650 text-clay-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
          >
            My Creations ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'orders' ? 'border-clay-650 text-clay-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
          >
            Orders Received ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('payout')}
            className={`pb-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'payout' ? 'border-clay-650 text-clay-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
          >
            Payout Credentials
          </button>
        </div>

        {/* TAB 1: Creations list */}
        {activeTab === 'creations' && (
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold font-serif text-gray-900">Manage Studio Listings</h3>
              
              {sellerProfile.isApproved && (
                <button
                  onClick={() => setShowProductModal(true)}
                  className="inline-flex items-center gap-1 bg-clay-600 hover:bg-clay-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
                >
                  <Plus className="h-4 w-4" /> Upload Creation
                </button>
              )}
            </div>

            {products.length === 0 ? (
              <div className="bg-white border border-sand-200 rounded-2xl p-16 text-center text-xs text-gray-500">
                You haven't uploaded any products yet. Click "Upload Creation" above to list your first craft.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((prod) => (
                  <div key={prod._id} className="bg-white border border-sand-200 rounded-2xl overflow-hidden shadow-sm flex flex-col group">
                    <div className="aspect-video bg-sand-100 overflow-hidden relative">
                      <img src={prod.images?.[0]} alt={prod.name} className="w-full h-full object-cover" />
                      <span className="absolute top-2.5 left-2.5 bg-white text-[9px] uppercase tracking-wider font-bold text-clay-600 px-2 py-0.5 rounded border border-sand-250">
                        {prod.category}
                      </span>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h4 className="font-serif font-bold text-gray-800 text-sm line-clamp-1">{prod.name}</h4>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">Stock: {prod.stock} items left</p>
                      
                      <div className="mt-4 pt-3 border-t border-sand-100 flex items-center justify-between">
                        <span className="text-sm font-extrabold text-gray-900">{formatCurrency(prod.price)}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleProductDelete(prod._id)}
                            className="p-2 text-gray-400 hover:text-red-650 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 2: Orders Received */}
        {activeTab === 'orders' && (
          <section className="space-y-6">
            <h3 className="text-base font-bold font-serif text-gray-900">Ordered Crafts Checklist</h3>
            
            {orders.length === 0 ? (
              <div className="bg-white border border-sand-200 rounded-2xl p-16 text-center text-xs text-gray-500">
                No orders received for your crafts yet.
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white border border-sand-200 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-sand-100 pb-3">
                      <div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Order Ref</span>
                        <p className="text-xs font-bold text-gray-850 mt-0.5">{order.trackingNumber}</p>
                      </div>

                      {/* Shipment controls selector */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-500">Ship Status:</span>
                        <select
                          value={order.shippingStatus}
                          onChange={(e) => handleShippingUpdate(order._id, e.target.value)}
                          className="bg-sand-50 border border-sand-300 rounded-lg text-xs font-semibold px-2 py-1 focus:ring-2 focus:ring-clay-600 text-gray-700"
                        >
                          <option value="Processing">📦 Processing</option>
                          <option value="Shipped">🚚 Shipped</option>
                          <option value="Delivered">✓ Delivered</option>
                        </select>
                      </div>
                    </div>

                    {/* Line items belonging to this seller */}
                    <div className="divide-y divide-sand-100">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-2 flex justify-between text-xs font-medium">
                          <span className="text-gray-700">{item.product?.name} (Qty: {item.quantity})</span>
                          <span className="font-bold text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Financial summary and address */}
                    <div className="border-t border-sand-100 pt-3 flex flex-col sm:flex-row justify-between gap-4 text-xs">
                      <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Ship To</p>
                        <p className="font-bold text-gray-700 mt-0.5">{order.shippingAddress?.name}</p>
                        <p className="text-[10px] text-gray-500 leading-normal">
                          {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Payout Subtotal</p>
                        <p className="font-extrabold text-gray-900 mt-0.5">{formatCurrency(order.sellerSubtotal)}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">Commission due: {formatCurrency(order.sellerCommission)}</p>
                        <p className="text-[10px] text-clay-600 font-bold mt-0.5">Net Payout: {formatCurrency(order.sellerPayout)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 3: Payout Settings */}
        {activeTab === 'payout' && (
          <section className="bg-white border border-sand-200 rounded-3xl p-6 sm:p-8 shadow-sm max-w-xl">
            <h3 className="text-base font-bold font-serif text-gray-900 border-b border-sand-150 pb-3 mb-6">
              Bank Disbursal Configuration
            </h3>

            {payoutSuccess && <p className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl font-medium">{payoutSuccess}</p>}
            {payoutError && <p className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">{payoutError}</p>}

            <form onSubmit={handlePayoutUpdate} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">UPI ID for Payouts</label>
                <input
                  type="text"
                  placeholder="e.g. name@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl text-xs focus:ring-2 focus:ring-clay-600 focus:outline-none"
                />
              </div>

              <div className="border-t border-sand-100 pt-4 mt-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Or Direct Bank Transfer details</p>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Bank Name</label>
                    <input
                      type="text"
                      placeholder="e.g. State Bank of India"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-sand-50 border border-sand-300 rounded-lg text-xs focus:ring-2 focus:ring-clay-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Account Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 1234567890"
                      value={accountNo}
                      onChange={(e) => setAccountNo(e.target.value)}
                      className="w-full px-3 py-1.5 bg-sand-50 border border-sand-300 rounded-lg text-xs focus:ring-2 focus:ring-clay-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">IFSC Code</label>
                    <input
                      type="text"
                      placeholder="e.g. SBIN0001234"
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value)}
                      className="w-full px-3 py-1.5 bg-sand-50 border border-sand-300 rounded-lg text-xs focus:ring-2 focus:ring-clay-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-6 py-2.5 bg-clay-600 hover:bg-clay-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all focus:outline-none"
              >
                Save Payout Config
              </button>
            </form>
          </section>
        )}

      </main>

      {/* Product Upload Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-sand-200 rounded-3xl w-full max-w-xl p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative animate-scaleIn">
            <h3 className="text-xl font-bold font-serif text-gray-900 border-b border-sand-150 pb-3.5 mb-6">
              Upload New Craft Creation
            </h3>

            {formError && (
              <p className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                {formError}
              </p>
            )}

            <form onSubmit={handleProductCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Craft Name *</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. Clay Cookware Pot"
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl text-xs focus:ring-2 focus:ring-clay-600 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Craft Category *</label>
                  <select
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl text-xs focus:ring-2 focus:ring-clay-600 focus:outline-none text-gray-750 font-medium"
                  >
                    <option value="Pottery">Pottery</option>
                    <option value="Clay Art">Clay Art</option>
                    <option value="Woodwork">Woodwork</option>
                    <option value="Textiles">Textiles</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Selling Price *</label>
                  <input
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    placeholder="₹ INR Amount"
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl text-xs focus:ring-2 focus:ring-clay-600 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Inventory Stock *</label>
                  <input
                    type="number"
                    value={productStock}
                    onChange={(e) => setProductStock(e.target.value)}
                    placeholder="Available stock count"
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl text-xs focus:ring-2 focus:ring-clay-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Upload image inputs */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Select Craft Photo *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="w-full px-3 py-2 border border-dashed border-sand-350 bg-sand-50 rounded-xl text-xs text-gray-500 focus:outline-none"
                />
                {productImageBase64 && (
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-[10px] text-green-600 font-bold border border-green-200 bg-green-50 px-2.5 py-1 rounded-full">✓ Photo Attached</span>
                    <button
                      type="button"
                      onClick={() => setProductImageBase64('')}
                      className="text-[10px] text-red-500 underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Item Specifications & Description *</label>
                <textarea
                  rows="3"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="Material specs, size measurements, slow cooking guidelines, or weaving care instructions..."
                  className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl text-xs focus:ring-2 focus:ring-clay-600 focus:outline-none leading-relaxed"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">The Creation Story Behind this item *</label>
                <textarea
                  rows="3"
                  value={productStory}
                  onChange={(e) => setProductStory(e.target.value)}
                  placeholder="Tell customers the specific history of this piece: the day you molded it, the mud source, the kiln firing temperature, or loom weaving patterns..."
                  className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl text-xs focus:ring-2 focus:ring-clay-600 focus:outline-none leading-relaxed"
                  required
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex gap-4 border-t border-sand-150">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 py-2.5 border border-sand-300 hover:bg-sand-50 text-gray-600 font-bold text-xs rounded-xl focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="flex-1 py-2.5 bg-clay-600 hover:bg-clay-700 disabled:bg-clay-400 text-white font-bold text-xs rounded-xl focus:outline-none"
                >
                  {uploadingImage ? 'Uploading...' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
