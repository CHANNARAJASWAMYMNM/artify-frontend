'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EarthyCard from '@/components/EarthyCard';
import { apiRequest } from '@/utils/api';
import { Store, MapPin, Feather, BadgeCheck, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ArtisanProfilePage() {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtisanDetails = async () => {
      setLoading(true);
      // Fetch seller profile details
      const profileRes = await apiRequest(`/sellers/${id}`);
      if (profileRes.success) {
        setSeller(profileRes.data.seller);
        
        // Fetch products created by this seller
        const productsRes = await apiRequest(`/sellers/${id}/products`);
        if (productsRes.success) {
          setProducts(productsRes.data.products);
        }
      }
      setLoading(false);
    };

    if (id) {
      fetchArtisanDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-clay-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow max-w-2xl mx-auto py-16 px-4 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h1 className="mt-4 text-xl font-bold font-serif text-gray-800">Artisan Profile Not Found</h1>
          <p className="text-gray-500 mt-2">The artisan profile might be pending approval or doesn't exist.</p>
          <Link href="/" className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-white bg-clay-600 px-4 py-2 rounded-lg">
            Back to Home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Artisan Banner Header */}
      <header className="relative bg-sand-100 border-b border-sand-200 py-16 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1200"
            alt="Art studio"
            className="w-full h-full object-cover filter blur-[1px]"
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          {/* Portrait Photo */}
          <div className="h-32 w-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-sand-200 shrink-0">
            <img
              src={seller.profileImage || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=400'}
              alt={seller.shopName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Bio overview */}
          <div className="flex-grow">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <h1 className="text-3xl font-extrabold font-serif text-gray-900">{seller.shopName}</h1>
              {seller.isApproved && (
                <span className="inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                  <BadgeCheck className="h-3.5 w-3.5 fill-current text-green-600" />
                  Verified Creator
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3 text-xs text-gray-500">
              <span className="font-semibold text-clay-700 flex items-center gap-0.5">
                <Store className="h-4 w-4" /> {seller.craftType}
              </span>
              <span className="hidden sm:inline text-gray-300">•</span>
              <span className="flex items-center gap-0.5">
                <MapPin className="h-4 w-4 text-gray-400" /> {seller.location}
              </span>
              <span className="hidden sm:inline text-gray-300">•</span>
              <span>Joined Artify {new Date(seller.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Details */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-grow flex flex-col gap-16">
        
        {/* Story biography Section */}
        <section className="bg-white border border-sand-200 rounded-3xl p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-widest font-bold text-clay-700 bg-clay-50 border border-clay-200/50 px-3 py-1 rounded-full self-start">
              Meet the artisan
            </span>
            <h2 className="text-2xl font-bold font-serif text-gray-900 mt-2">
              Our Journey & Tradition
            </h2>
            <div className="h-1.5 w-16 bg-clay-600 rounded mt-3" />
          </div>

          <div className="lg:col-span-8">
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line font-sans font-medium">
              {seller.story}
            </p>
            
            <div className="mt-8 flex items-center gap-3 bg-sand-100/60 rounded-xl p-4 border border-sand-200/50 max-w-md">
              <Feather className="h-5 w-5 text-clay-600" />
              <p className="text-xs text-gray-500 font-medium">
                By purchasing from this studio, you directly fund local heritage preservation and provide immediate family income.
              </p>
            </div>
          </div>
        </section>

        {/* Creator's catalog */}
        <section>
          <div className="border-b border-sand-200 pb-5 mb-8">
            <h2 className="text-2xl font-bold font-serif text-gray-900">
              Creations from {seller.shopName} ({products.length})
            </h2>
            <p className="text-xs text-gray-500 mt-1">Explore custom works hand-molded and shipped from their studio.</p>
          </div>

          {products.length === 0 ? (
            <div className="bg-white border border-sand-200 rounded-2xl p-16 text-center text-xs text-gray-500 shadow-sm">
              This artisan hasn't uploaded any products to their studio catalog yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <EarthyCard
                  key={product._id}
                  product={{
                    ...product,
                    shopName: seller.shopName,
                    location: seller.location
                  }}
                />
              ))}
            </div>
          )}
        </section>

      </main>

      <Footer />
    </div>
  );
}
