'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductVariant, CartItem } from '@/types';
import { BRAND_CONFIG } from '@/config/brand';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, variant: ProductVariant, quantity?: number, openDrawer?: boolean) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  subtotal: number;
  freeShippingThreshold: number;
  codHandlingFee: number;
  freeShippingProgress: number;
  amountNeededForFreeShipping: number;
  discountCode: string;
  discountPercent: number;
  discountAmount: number;
  applyDiscount: (code: string) => { success: boolean; message: string };
  removeDiscount: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('vl_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('vl_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch {
      // ignore SSR or storage errors
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vl_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('vl_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  const addToCart = (product: Product, variant: ProductVariant, quantity = 1, openDrawer = true) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.variant.id === variant.id
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, variant, quantity }];
      }
    });

    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (productId: string, variantId: string) => {
    setCart((prev) => prev.filter(
      (item) => !(item.product.id === productId && item.variant.id === variantId)
    ));
  };

  const updateQuantity = (productId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.variant.id === variantId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setDiscountCode('');
    setDiscountPercent(0);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const freeShippingThreshold = BRAND_CONFIG.freeShippingThreshold;
  const codHandlingFee = BRAND_CONFIG.codHandlingFee;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const applyDiscount = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'WELCOME10' || clean === 'FIRST10') {
      setDiscountCode(clean);
      setDiscountPercent(10);
      return { success: true, message: '10% First Order Discount Applied!' };
    }
    if (clean === 'UPI5' || clean === 'PREPAID5') {
      setDiscountCode(clean);
      setDiscountPercent(BRAND_CONFIG.upiDiscountPercent);
      return { success: true, message: '5% Instant UPI Discount Applied!' };
    }
    if (clean === 'VL200' && subtotal >= 1999) {
      setDiscountCode(clean);
      setDiscountPercent(12);
      return { success: true, message: 'Festive Voucher Applied!' };
    }
    return { success: false, message: 'Invalid or expired coupon code. Try WELCOME10 or UPI5' };
  };

  const removeDiscount = () => {
    setDiscountCode('');
    setDiscountPercent(0);
  };

  const discountAmount = Math.round((subtotal * discountPercent) / 100);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        subtotal,
        freeShippingThreshold,
        codHandlingFee,
        freeShippingProgress,
        amountNeededForFreeShipping,
        discountCode,
        discountPercent,
        discountAmount,
        applyDiscount,
        removeDiscount,
        wishlist,
        toggleWishlist,
        isWishlisted,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
