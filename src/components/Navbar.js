'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Bell, User, LogOut, Shield, Store, LayoutDashboard, Menu, X, Star } from 'lucide-react';

export default function Navbar() {
  const { user, loading, logout, notifications, unreadCount, markNotificationRead } = useAuth();
  const { cart } = useCart();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      await markNotificationRead(notif._id);
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/auth/login';
    if (user.role === 'admin') return '/dashboard/admin';
    if (user.role === 'seller') return '/dashboard/seller';
    return '/dashboard/customer';
  };

  return (
    <nav className="sticky top-0 z-50 bg-sand-50/90 backdrop-blur-md border-b border-sand-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight text-clay-600 font-serif">Artify</span>
              <span className="hidden sm:inline-block text-xs uppercase tracking-widest bg-clay-100 text-clay-700 px-2 py-0.5 rounded font-medium border border-clay-200">Artisan Market</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-sm font-medium text-gray-600 hover:text-clay-600 transition-colors">
              Browse Crafts
            </Link>
            <Link href="/" className="#artisan-spotlight" className="text-sm font-medium text-gray-600 hover:text-clay-600 transition-colors">
              Artisan Stories
            </Link>
          </div>

          {/* Right Side Icons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Cart Icon */}
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-clay-600 transition-colors rounded-full hover:bg-sand-100">
              <ShoppingCart className="h-6 w-6 stroke-[1.5]" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-clay-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-sand-50">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Notifications */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-clay-600 transition-colors rounded-full hover:bg-sand-100"
                >
                  <Bell className="h-6 w-6 stroke-[1.5]" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-clay-500 h-2.5 w-2.5 rounded-full ring-2 ring-sand-50 animate-pulse" />
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-sand-200 rounded-lg shadow-xl py-2 z-50 max-h-96 overflow-y-auto">
                    <div className="px-4 py-2 border-b border-sand-100 flex justify-between items-center bg-sand-50">
                      <span className="text-xs font-semibold text-gray-700">Notifications ({unreadCount})</span>
                    </div>
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-gray-500">No notifications yet.</div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif._id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`px-4 py-3 hover:bg-sand-50 border-b border-sand-100 cursor-pointer transition-colors ${!notif.isRead ? 'bg-clay-50/50' : ''}`}
                        >
                          <p className="text-xs font-bold text-gray-800">{notif.title}</p>
                          <p className="text-[11px] text-gray-600 mt-0.5">{notif.message}</p>
                          <p className="text-[9px] text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleDateString()}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Profile Dropdown */}
            {loading ? (
              <div className="h-7 w-7 rounded-full bg-sand-200 animate-pulse border border-sand-300" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 p-1 text-gray-600 hover:text-clay-600 transition-colors rounded-full hover:bg-sand-100 border border-sand-300"
                >
                  <div className="bg-sand-200 h-7 w-7 rounded-full flex items-center justify-center text-clay-700 text-xs font-bold font-serif uppercase">
                    {user.email.charAt(0)}
                  </div>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-sand-200 rounded-lg shadow-xl py-1 z-50">
                    <div className="px-4 py-2 border-b border-sand-100">
                      <p className="text-xs font-bold text-gray-800 truncate">{user.email}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mt-0.5">{user.role}</p>
                    </div>
                    
                    <Link
                      href={getDashboardLink()}
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-sand-50 hover:text-clay-600"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      My Dashboard
                    </Link>

                    {user.role === 'admin' && (
                      <span className="flex items-center gap-2 px-4 py-1 text-[9px] text-clay-600 font-bold uppercase tracking-wider bg-clay-50 border-y border-clay-100 my-0.5">
                        <Shield className="h-3 w-3" />
                        Admin Access
                      </span>
                    )}

                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        logout();
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="text-xs font-medium text-gray-700 hover:text-clay-600 px-3 py-1.5 rounded-md hover:bg-sand-100 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/register"
                  className="text-xs font-medium text-white bg-clay-600 hover:bg-clay-700 px-3.5 py-1.5 rounded-md shadow-sm transition-all"
                >
                  Join as Artisan
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link href="/cart" className="relative p-2 text-gray-600">
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 bg-clay-600 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 rounded-md hover:bg-sand-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-sand-200 bg-sand-50 py-3 px-4 flex flex-col gap-3">
          <Link
            href="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-gray-700 py-1"
          >
            Browse Crafts
          </Link>
          
          {loading ? (
            <div className="h-8 bg-sand-200 animate-pulse rounded mt-2" />
          ) : user ? (
            <>
              <Link
                href={getDashboardLink()}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-gray-700 py-1"
              >
                Dashboard ({user.role})
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="text-sm font-medium text-red-600 py-1 text-left"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-sand-200">
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-center text-gray-700 py-2 border border-sand-300 rounded"
              >
                Log In
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-center text-white bg-clay-600 py-2 rounded"
              >
                Join as Artisan
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
