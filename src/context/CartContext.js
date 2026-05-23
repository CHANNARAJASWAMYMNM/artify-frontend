'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('artify_cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (error) {
        console.error('Failed to parse cart data:', error);
      }
    }
    setIsInitialized(true);
  }, []);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('artify_cart', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.product._id === product._id);
      
      if (existingItemIndex > -1) {
        // Update quantity
        const newCart = [...prevCart];
        const newQty = newCart[existingItemIndex].quantity + quantity;
        // Limit to available stock
        newCart[existingItemIndex].quantity = Math.min(newQty, product.stock);
        return newCart;
      } else {
        // Add new item
        return [...prevCart, {
          product,
          quantity: Math.min(quantity, product.stock),
          shopName: product.shopName || 'Artisan Shop',
          seller: product.seller._id || product.seller
        }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.product._id === productId) {
          return {
            ...item,
            quantity: Math.min(quantity, item.product.stock),
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const platformCommissionRate = 0.10;
  const platformCommission = subtotal * platformCommissionRate;
  const sellerPayout = subtotal - platformCommission;
  
  // Free shipping above ₹500, else flat ₹50
  const shippingFee = subtotal === 0 ? 0 : (subtotal >= 500 ? 0 : 50);
  const total = subtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        subtotal,
        platformCommission,
        sellerPayout,
        shippingFee,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
