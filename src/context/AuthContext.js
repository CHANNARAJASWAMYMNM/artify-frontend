'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sellerProfile, setSellerProfile] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();

  // Load user from localStorage on mount
  useEffect(() => {
    const loadSession = async () => {
      const storedToken = localStorage.getItem('artify_token');
      if (storedToken) {
        setToken(storedToken);
        const res = await apiRequest('/auth/me');
        if (res.success) {
          setUser(res.data.user);
          setSellerProfile(res.data.sellerProfile);
          
          // Load notifications after user details
          fetchNotifications();
        } else if (res.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('artify_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadSession();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password },
    });

    if (res.success) {
      const { token, user: userData, sellerProfile: sellerData } = res.data;
      localStorage.setItem('artify_token', token);
      setToken(token);
      setUser(userData);
      setSellerProfile(sellerData);
      
      // Load notifications
      await fetchNotifications();

      // Route depending on role
      if (userData.role === 'admin') {
        router.push('/dashboard/admin');
      } else if (userData.role === 'seller') {
        router.push('/dashboard/seller');
      } else {
        router.push('/dashboard/customer');
      }
      setLoading(false);
      return { success: true };
    } else {
      setLoading(false);
      return { success: false, error: res.error };
    }
  };

  const register = async (formData) => {
    setLoading(true);
    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: formData,
    });

    if (res.success) {
      const { token, user: userData, sellerProfile: sellerData } = res.data;
      localStorage.setItem('artify_token', token);
      setToken(token);
      setUser(userData);
      setSellerProfile(sellerData);

      // Route depending on role
      if (userData.role === 'seller') {
        router.push('/dashboard/seller'); // Redirect to dashboard to wait for admin approval
      } else {
        router.push('/products');
      }
      setLoading(false);
      return { success: true };
    } else {
      setLoading(false);
      return { success: false, error: res.error };
    }
  };

  const logout = () => {
    localStorage.removeItem('artify_token');
    setToken(null);
    setUser(null);
    setSellerProfile(null);
    setNotifications([]);
    router.push('/auth/login');
  };

  const verifyEmail = async () => {
    const res = await apiRequest('/auth/verify-email', { method: 'POST' });
    if (res.success) {
      setUser(res.data.user);
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const fetchProfile = async () => {
    const res = await apiRequest('/auth/me');
    if (res.success) {
      setUser(res.data.user);
      setSellerProfile(res.data.sellerProfile);
    }
  };

  const updateSeller = async (profileData) => {
    const res = await apiRequest('/sellers/profile', {
      method: 'PUT',
      body: profileData,
    });
    if (res.success) {
      setSellerProfile(res.data.sellerProfile);
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const fetchNotifications = async () => {
    const res = await apiRequest('/notifications');
    if (res.success) {
      setNotifications(res.data.notifications);
    }
  };

  const markNotificationRead = async (id) => {
    const res = await apiRequest(`/notifications/${id}/read`, { method: 'PUT' });
    if (res.success) {
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AuthContext.Provider
      value={{
        user,
        sellerProfile,
        token,
        loading,
        notifications,
        unreadCount,
        login,
        register,
        logout,
        verifyEmail,
        fetchProfile,
        updateSeller,
        fetchNotifications,
        markNotificationRead,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
