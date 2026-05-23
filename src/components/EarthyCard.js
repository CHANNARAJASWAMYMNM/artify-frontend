'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Star, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/utils/api';

export default function EarthyCard({ product }) {
  const { _id, name, price, category, images, averageRating, reviewsCount, shopName, location } = product;
  const image = images && images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=600';

  return (
    <div className="bg-white border border-sand-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-sand-300 transition-all duration-300 flex flex-col group">
      {/* Product Image */}
      <div className="relative aspect-square bg-sand-100 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[10px] uppercase tracking-wider font-bold text-clay-700 px-2.5 py-1 rounded-full border border-sand-200/50 shadow-sm">
          {category}
        </span>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Artisan Metadata */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
          <span className="font-semibold text-clay-700 hover:underline">
            <Link href={`/artisan/${product.seller._id || product.seller}`}>
              {shopName}
            </Link>
          </span>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-0.5 truncate">
            <MapPin className="h-3 w-3 text-gray-400 shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        {/* Product Name */}
        <h3 className="font-serif text-base font-bold text-gray-800 line-clamp-1 group-hover:text-clay-600 transition-colors">
          <Link href={`/products/${_id}`}>{name}</Link>
        </h3>

        {/* Rating Row */}
        <div className="flex items-center gap-1 mt-1.5 mb-4">
          <div className="flex items-center text-amber-500">
            <Star className="h-3.5 w-3.5 fill-current" />
          </div>
          <span className="text-xs font-bold text-gray-700">{averageRating || '0.0'}</span>
          <span className="text-[10px] text-gray-400">({reviewsCount || 0} reviews)</span>
        </div>

        {/* Bottom pricing row */}
        <div className="mt-auto pt-3 border-t border-sand-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Price</span>
            <span className="text-lg font-extrabold text-gray-900">{formatCurrency(price)}</span>
          </div>
          <Link
            href={`/products/${_id}`}
            className="flex items-center gap-1 text-xs font-bold text-white bg-clay-600 hover:bg-clay-700 px-4 py-2 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300"
          >
            <Sparkles className="h-3.5 w-3.5" />
            View Story
          </Link>
        </div>
      </div>
    </div>
  );
}
