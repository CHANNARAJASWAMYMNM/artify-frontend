import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-clay-900 text-clay-100 border-t border-clay-950 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Brand */}
          <div className="md:col-span-2">
            <span className="text-3xl font-bold tracking-tight text-white font-serif">Artify</span>
            <p className="mt-4 text-sm text-clay-300 max-w-sm leading-relaxed">
              Empowering local street artisans, pottery makers, clay sculptors, and handloom weavers. 
              We bring their beautiful creations and incredible stories straight to your home.
            </p>
            <div className="mt-6 text-xs text-clay-400">
              © {new Date().getFullYear()} Artify Inc. Supporting handmade creators everywhere.
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Marketplace</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-clay-300">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  All Handmade Crafts
                </Link>
              </li>
              <li>
                <Link href="/products?category=Pottery" className="hover:text-white transition-colors">
                  Earthenware & Pottery
                </Link>
              </li>
              <li>
                <Link href="/products?category=Textiles" className="hover:text-white transition-colors">
                  Handloom Textiles
                </Link>
              </li>
              <li>
                <Link href="/products?category=Clay Art" className="hover:text-white transition-colors">
                  Terracotta Figurines
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform info */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Join Us</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-clay-300">
              <li>
                <Link href="/auth/register" className="hover:text-white transition-colors">
                  Register as an Artisan
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-white transition-colors">
                  Log In to Shop
                </Link>
              </li>
              <li>
                <span className="block text-xs text-clay-400 mt-2 font-medium">10% Platform Commission</span>
                <span className="block text-xs text-clay-400">90% Direct Seller Payouts</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
