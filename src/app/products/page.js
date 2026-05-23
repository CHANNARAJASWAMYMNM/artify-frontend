'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EarthyCard from '@/components/EarthyCard';
import { apiRequest } from '@/utils/api';
import { SlidersHorizontal, Search, Star, RefreshCw, X } from 'lucide-react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialSeller = searchParams.get('seller') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rating, setRating] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    const queryParts = [];
    if (category) queryParts.push(`category=${category}`);
    if (search) queryParts.push(`search=${search}`);
    if (minPrice) queryParts.push(`minPrice=${minPrice}`);
    if (maxPrice) queryParts.push(`maxPrice=${maxPrice}`);
    if (rating) queryParts.push(`rating=${rating}`);
    if (initialSeller) queryParts.push(`seller=${initialSeller}`);

    const query = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    const res = await apiRequest(`/products${query}`);
    
    if (res.success) {
      setProducts(res.data.products);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [category, search, rating, initialSeller]); // Fetch automatically on fast changes

  const handleReset = () => {
    setCategory('');
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setRating('');
    // Remove query params by reloading without query
    window.history.replaceState(null, '', '/products');
    setTimeout(() => fetchProducts(), 50);
  };

  const categoriesList = ['Pottery', 'Clay Art', 'Woodwork', 'Textiles', 'Other'];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Header Banner */}
      <header className="bg-sand-100 border-b border-sand-200 py-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 font-serif">
          The Handcrafted Gallery
        </h1>
        <p className="text-sm text-gray-500 mt-2 max-w-lg mx-auto">
          Filter through authentic earthenware, traditional sculptures, and handcrafted textiles.
        </p>
      </header>

      {/* Catalog Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Filters Sidebar */}
          <section className="lg:col-span-3 bg-white border border-sand-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6 sticky top-20">
            <div className="flex items-center justify-between border-b border-sand-100 pb-3">
              <span className="flex items-center gap-1.5 text-xs font-bold text-gray-800 uppercase tracking-wider">
                <SlidersHorizontal className="h-4 w-4 text-clay-600" /> Filters
              </span>
              <button
                onClick={handleReset}
                className="text-[10px] font-bold text-clay-600 hover:text-clay-700 underline"
              >
                Clear All
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Keyword</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 bg-sand-50 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-600 text-xs text-gray-700"
                />
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              </div>
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Category</label>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setCategory('')}
                  className={`text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${category === '' ? 'bg-clay-50 text-clay-700 border border-clay-200/50' : 'text-gray-600 hover:bg-sand-50'}`}
                >
                  All Categories
                </button>
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${category === cat ? 'bg-clay-50 text-clay-700 border border-clay-200/50' : 'text-gray-600 hover:bg-sand-50'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Inputs */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Price Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-2 py-1.5 bg-sand-50 border border-sand-300 rounded-lg text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-clay-600"
                />
                <span className="text-gray-400 text-xs">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-2 py-1.5 bg-sand-50 border border-sand-300 rounded-lg text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-clay-600"
                />
              </div>
              <button
                onClick={fetchProducts}
                className="w-full mt-3 py-1.5 bg-sand-100 hover:bg-sand-200 text-gray-700 font-bold rounded-lg text-[10px] uppercase tracking-wider transition-all"
              >
                Apply Price
              </button>
            </div>

            {/* Rating Selector */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Minimum Rating</label>
              <div className="flex flex-col gap-1.5">
                {[4, 3, 2].map((num) => (
                  <button
                    key={num}
                    onClick={() => setRating(num.toString())}
                    className={`flex items-center gap-1.5 text-xs py-1.5 px-2 rounded-lg font-medium transition-all ${rating === num.toString() ? 'bg-clay-50 text-clay-700 border border-clay-200/50' : 'text-gray-600 hover:bg-sand-50'}`}
                  >
                    <div className="flex text-amber-500"><Star className="h-3.5 w-3.5 fill-current" /></div>
                    <span>{num} Stars & above</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Catalog list */}
          <section className="lg:col-span-9">
            {/* Summary */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-semibold text-gray-500">
                Found {products.length} {products.length === 1 ? 'craft' : 'crafts'}
              </span>
              
              {initialSeller && (
                <div className="inline-flex items-center gap-1.5 bg-clay-50 border border-clay-200 text-clay-700 px-3 py-1 rounded-full text-xs font-semibold">
                  Artisan Store Filter Active
                  <button onClick={() => window.location.href = '/products'} className="hover:text-clay-800"><X className="h-3 w-3" /></button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white border border-sand-200 rounded-2xl h-80" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white border border-sand-200 rounded-2xl p-16 text-center shadow-sm">
                <p className="text-sm font-semibold text-gray-500">No products match your filters.</p>
                <button
                  onClick={handleReset}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-white bg-clay-600 hover:bg-clay-700 px-4 py-2 rounded-lg"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <EarthyCard key={product._id} product={product} />
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

export default function ProductsPage() {
  return (
    <React.Suspense fallback={
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center bg-sand-50 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-clay-600 mx-auto"></div>
            <p className="mt-4 text-xs font-semibold text-gray-500">Loading Handcrafted Gallery...</p>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <ProductsContent />
    </React.Suspense>
  );
}

