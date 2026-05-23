'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EarthyCard from '@/components/EarthyCard';
import { apiRequest } from '@/utils/api';
import { Sparkles, Search, Store, ArrowRight, Heart, HeartHandshake } from 'lucide-react';

export default function HomePage() {
  const [latestProducts, setLatestProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      const res = await apiRequest('/products');
      if (res.success) {
        // Show top 4 latest products
        setLatestProducts(res.data.products.slice(0, 4));
      }
      setLoading(false);
    };
    fetchLatest();
  }, []);

  const categories = [
    { name: 'Pottery', count: '50+ Items', icon: '🏺', desc: 'Clay Cookware, Plates & Pots' },
    { name: 'Clay Art', count: '30+ Items', icon: '🗿', desc: 'Terracotta Sculptures & Decor' },
    { name: 'Woodwork', count: '20+ Items', icon: '🪵', desc: 'Hand-Carved Shelves & Boxes' },
    { name: 'Textiles', count: '40+ Items', icon: '🧵', desc: 'Handloom Sarees & Rugs' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <header className="relative bg-sand-100 overflow-hidden py-20 border-b border-sand-200">
        <div className="absolute inset-0 z-0 opacity-15">
          <img
            src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=1600"
            alt="Terracotta background"
            className="w-full h-full object-cover filter blur-[2px]"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-clay-100 text-clay-700 text-xs font-semibold mb-6 border border-clay-200">
            <Heart className="h-3 w-3 text-clay-600 fill-current animate-pulse" /> Direct-to-Artisan Fair Trade
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 font-serif leading-tight max-w-4xl mx-auto">
            Connecting You to the <span className="text-clay-600 italic">Soul of Earth</span> & Human Hands
          </h1>
          
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-sans leading-relaxed">
            Artify is a storytelling marketplace where you buy directly from street potters, local handloom weavers, and clay sculptors. 100% authentic, 90% goes to the creator.
          </p>

          {/* Search bar */}
          <div className="mt-8 max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search clay pots, handwoven sarees, wooden toys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-28 py-3.5 bg-white border border-sand-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-clay-600 focus:border-transparent text-sm text-gray-700"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Link
              href={`/products?search=${searchQuery}`}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-clay-600 hover:bg-clay-700 text-white text-xs font-bold px-5 py-2 rounded-full transition-all shadow-sm"
            >
              Search
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-20">
        
        {/* Categories Section */}
        <section>
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-3xl font-bold font-serif text-gray-900">Browse by Craft</h2>
            <p className="text-sm text-gray-500 mt-2">Explore the traditional styles and handiwork of verified sellers.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/products?category=${cat.name}`}
                className="bg-white border border-sand-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-md hover:border-sand-300 transition-all group"
              >
                <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
                <h3 className="font-serif text-lg font-bold text-gray-800">{cat.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{cat.desc}</p>
                <span className="inline-block mt-4 text-[10px] uppercase font-bold tracking-wider text-clay-600 bg-clay-50 px-2.5 py-0.5 rounded border border-clay-150">
                  {cat.count}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Artisan Spotlight (Storytelling banner) */}
        <section id="artisan-spotlight" className="bg-sand-100 border border-sand-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-5 relative h-80 lg:h-auto min-h-[300px]">
              <img
                src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800"
                alt="Artisan Ramu at his wheel"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            
            <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
              <span className="text-[10px] uppercase tracking-widest font-bold text-clay-700 bg-clay-150 px-3 py-1 rounded-full border border-clay-250 self-start mb-6">
                🔥 Artisan Spotlight
              </span>
              
              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-gray-900 leading-tight">
                Ramu Clay Creations
              </h2>
              
              <p className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">
                Khurja, Uttar Pradesh • Craft: Terracotta Pottery
              </p>
              
              <blockquote className="mt-6 text-sm text-gray-600 italic leading-relaxed border-l-2 border-clay-500 pl-4">
                "Ramu has been practicing clay pottery for over 35 years. Carrying forward his father's legacy, Ramu gathers natural clay from regional river beds, refines it manually, and bakes it in traditional wood-fired kilns. Each piece tells the story of earth, smoke, and sweat."
              </blockquote>
              
              <div className="mt-8 flex flex-wrap gap-4 items-center">
                <Link
                  href="/artisan/sita@artify.com" /* fallback mapping or ID */
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-clay-600 hover:bg-clay-700 px-5 py-2.5 rounded-xl shadow-sm transition-all"
                >
                  <Store className="h-4 w-4" />
                  Visit Ramu's Studio
                </Link>
                <Link
                  href="/products?seller=ramu"
                  className="inline-flex items-center gap-1 text-xs font-bold text-clay-700 hover:text-clay-800"
                >
                  Explore Ramu's Clay Products <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold font-serif text-gray-900">Latest Creations</h2>
              <p className="text-sm text-gray-500 mt-1">Freshly hand-molded and spun art pieces available now.</p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-xs font-bold text-clay-600 hover:text-clay-700 border-b border-clay-500 pb-0.5"
            >
              Browse all {latestProducts.length > 0 ? '' : 'crafts'} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white border border-sand-200 rounded-2xl h-80" />
              ))}
            </div>
          ) : latestProducts.length === 0 ? (
            <div className="bg-white border border-sand-200 rounded-2xl p-12 text-center text-gray-500 text-sm">
              No products found. Make sure the backend server is running and seeded.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestProducts.map((product) => (
                <EarthyCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Fair Trade Pledge banner */}
        <section className="bg-clay-600 rounded-3xl p-8 sm:p-10 text-white text-center shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-5 select-none text-9xl">🏺</div>
          <div className="max-w-2xl mx-auto flex flex-col items-center">
            <HeartHandshake className="h-10 w-10 text-clay-100 stroke-[1.5]" />
            <h2 className="mt-4 text-2xl sm:text-3xl font-bold font-serif">The Artify Fair-Trade Promise</h2>
            <p className="mt-4 text-sm text-clay-100 leading-relaxed font-light">
              We stand against high intermediary fees that exploit grass-root creators. 
              Artify retains a flat 10% platform commission to maintain servers, handle payment gateways, and promote marketing. 
              The remaining 90% is routed directly to the artisan's bank account or UPI ID.
            </p>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
