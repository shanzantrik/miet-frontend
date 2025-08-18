'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: string | number;
  title: string;
  price: string | number;
  thumbnail?: string;
  instructor_name?: string;
  type: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string | number) => void;
  clearCart: () => void;
  isInCart: (id: string | number) => boolean;
  cartTotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      // Check if item is already in cart
      if (prev.find(cartItem => cartItem.id === item.id)) {
        return prev; // Item already exists
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string | number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const isInCart = (id: string | number) => {
    return cartItems.some(item => item.id === id);
  };

  const cartTotal = cartItems.reduce((total, item) => {
    const price = typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : Number(item.price);
    return total + (isNaN(price) ? 0 : price);
  }, 0);

  const itemCount = cartItems.length;

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
    cartTotal,
    itemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
