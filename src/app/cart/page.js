'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/utils/api';
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function CartPage() {
  const { cart, subtotal, platformCommission, sellerPayout, shippingFee, total, updateQuantity, removeFromCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow max-w-xl mx-auto py-24 px-4 text-center">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-sand-100 text-clay-600 mb-6">
            <ShoppingBag className="h-12 w-12 stroke-[1.25]" />
          </div>
          <h1 className="text-2xl font-bold font-serif text-gray-800">Your Shopping Cart is Empty</h1>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto text-xs leading-relaxed">
            Support street potters, weavers, and artists by filling your cart with handcrafts.
          </p>
          <Link href="/products" className="mt-8 inline-flex items-center gap-1.5 text-xs font-bold text-white bg-clay-600 hover:bg-clay-700 px-6 py-3 rounded-xl shadow-sm transition-all">
            Browse Handcrafted Goods <ArrowRight className="h-4 w-4" />
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
          Shopping Cart ({cart.length} item{cart.length === 1 ? '' : 's'})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart Items List */}
          <section className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div
                key={item.product._id}
                className="bg-white border border-sand-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between"
              >
                {/* Photo and Name */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="h-16 w-16 rounded-xl bg-sand-150 overflow-hidden shrink-0 border border-sand-200">
                    <img
                      src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=200'}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-1 hover:text-clay-600 transition-colors">
                      <Link href={`/products/${item.product._id}`}>{item.product.name}</Link>
                    </h3>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">{item.shopName}</p>
                    <span className="text-xs font-bold text-clay-700 mt-1 block">{formatCurrency(item.product.price)} each</span>
                  </div>
                </div>

                {/* Quantity Controls and Actions */}
                <div className="flex items-center justify-between sm:justify-start gap-6 w-full sm:w-auto border-t sm:border-t-0 border-sand-100 pt-3 sm:pt-0">
                  {/* Quantity picker */}
                  <div className="flex items-center border border-sand-300 rounded-lg bg-white p-0.5">
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      className="p-1 hover:bg-sand-50 rounded text-gray-500 hover:text-gray-800"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-2.5 text-xs font-bold text-gray-800 w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      className="p-1 hover:bg-sand-50 rounded text-gray-500 hover:text-gray-800"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Row Total */}
                  <span className="text-sm font-extrabold text-gray-800 min-w-[70px] text-right">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            ))}
          </section>

          {/* Pricing Summary Sidepanel */}
          <section className="lg:col-span-4 bg-white border border-sand-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
            <h2 className="text-base font-bold font-serif text-gray-900 border-b border-sand-100 pb-3">
              Order Summary
            </h2>

            {/* Price breakdown details */}
            <div className="space-y-3.5 border-b border-sand-100 pb-5 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Items Subtotal</span>
                <span className="font-bold text-gray-800">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping Fee</span>
                <span className="font-bold text-gray-800">
                  {shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}
                </span>
              </div>
              {shippingFee > 0 && (
                <p className="text-[10px] text-clay-600 font-semibold bg-clay-50 border border-clay-100 p-2 rounded-lg">
                  💡 Free delivery on orders above ₹500! Add {formatCurrency(500 - subtotal)} more to qualify.
                </p>
              )}
            </div>

            {/* Artisan Fair Split details */}
            <div className="bg-sand-100 border border-sand-200 rounded-xl p-3.5 flex flex-col gap-1 text-[11px]">
              <div className="flex items-center gap-1.5 text-clay-700 font-bold mb-1">
                <HeartHandshake className="h-4 w-4" />
                Artisan Split Check
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Platform Support (10%)</span>
                <span>{formatCurrency(platformCommission)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Direct Payout (90%)</span>
                <span className="font-bold text-gray-700">{formatCurrency(sellerPayout)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Total</span>
              <span className="text-2xl font-black text-gray-900">{formatCurrency(total)}</span>
            </div>

            <Link
              href="/checkout"
              className="w-full py-3.5 bg-clay-600 hover:bg-clay-700 text-white text-center text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="h-4.5 w-4.5" />
              Proceed to Checkout
            </Link>

            <Link
              href="/products"
              className="text-center text-xs font-bold text-clay-600 hover:text-clay-700 underline"
            >
              Continue Shopping
            </Link>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
