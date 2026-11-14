'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, ProductVariant, CartItem } from '@/types';
import { BRAND_CONFIG } from '@/config/brand';
import { cartApi, getOrInitToken } from '@/services/api';

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

  // 1. Load from localStorage and sync with backend MySQL DB on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('vl_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }

      const savedWishlist = localStorage.getItem('vl_wishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }

      // Sync with backend Cart API if token is available
      const token = localStorage.getItem('vl_token');
      if (token) {
        cartApi.getCart(token).then((res) => {
          if (res.success && Array.isArray(res.data?.items) && res.data.items.length > 0) {
            // Backend has DB cart items: map them into frontend cart
            const dbCart: CartItem[] = res.data.items.map((item: any) => {
              const p = item.product;
              return {
                product: {
                  id: String(p?.id || item.productId),
                  title: p?.title || p?.name || 'Handcrafted Design',
                  slug: (p?.title || p?.name || `product-${item.productId}`).toLowerCase().replace(/\s+/g, '-'),
                  description: p?.description || 'Authentic designer wear from VL Designs.',
                  price: Number(p?.price || 0),
                  mrp: Math.round(Number(p?.price || 0) * 1.5),
                  category: p?.category || 'Kurtis & Sets',
                  images: p?.image ? [p.image] : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1000'],
                  productType: 'own_design',
                  fabric: '100% Pure Cotton',
                  fabricDetails: {
                    material: '100% Pure Cotton',
                    weave: 'Artisan Loom Finish',
                    care: 'Hand wash cold',
                  },
                  variants: [
                    {
                      id: `v-${item.productId}-1`,
                      size: 'Standard Set',
                      color: 'Original',
                      colorHex: '#1A3B2B',
                      stock: p?.stock || 10,
                    },
                  ],
                  rating: 4.8,
                  reviewCount: 15,
                },
                variant: {
                  id: `v-${item.productId}-1`,
                  size: 'Standard Set',
                  color: 'Original',
                  colorHex: '#1A3B2B',
                  stock: p?.stock || 10,
                },
                quantity: item.quantity,
              };
            });

            if (dbCart.length > 0) {
              setCart(dbCart);
            }
          }
        }).catch(() => {
          // ignore network errors, use localStorage fallback
        });
      }
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

  /**
   * ADD TO CART:
   * 1. Updates local React state immediately for instant responsive UX.
   * 2. Asynchronously calls the backend API (POST /api/cart) using the JWT token
   *    (or auto-initialized guest token), persisting the item in MySQL.
   */
  const addToCart = (product: Product, variant: ProductVariant, quantity = 1, openDrawer = true) => {
    // Immediate UI update
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

    // Call Backend API: POST /api/cart
    getOrInitToken()
      .then((token) => {
        if (!token) return;

        // Resolve product identifier (numeric ID or title)
        const rawNumeric = parseInt(product.id.replace(/\D/g, ''), 10);
        const targetProductId = !isNaN(rawNumeric) && rawNumeric > 0 ? rawNumeric : product.title;

        return cartApi.addToCart(token, targetProductId, quantity, {
          productTitle: product.title,
          price: product.price,
          category: product.category,
          image: product.images && product.images[0] ? product.images[0] : undefined,
        });
      })
      .then((res) => {
        if (res) {
          console.log('✓ [POST /api/cart] Item added to backend MySQL database:', res);
        }
      })
      .catch((err) => {
        console.warn('Backend cart API notice (local state maintained):', err);
      });
  };

  /**
   * REMOVE FROM CART:
   * Updates local state and triggers DELETE /api/cart/:id in backend MySQL.
   */
  const removeFromCart = (productId: string, variantId: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.variant.id === variantId))
    );

    getOrInitToken()
      .then((token) => {
        if (!token) return;
        const rawNumeric = parseInt(productId.replace(/\D/g, ''), 10);
        const targetId = !isNaN(rawNumeric) && rawNumeric > 0 ? rawNumeric : productId;
        return cartApi.removeCartItem(token, targetId);
      })
      .then((res) => {
        if (res) {
          console.log('✓ [DELETE /api/cart/:id] Item removed from backend MySQL database:', res);
        }
      })
      .catch((err) => {
        console.warn('Backend remove item notice:', err);
      });
  };

  /**
   * UPDATE QUANTITY:
   * Updates local state and triggers PUT /api/cart/:id in backend MySQL.
   */
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

    getOrInitToken()
      .then((token) => {
        if (!token) return;
        const rawNumeric = parseInt(productId.replace(/\D/g, ''), 10);
        const targetId = !isNaN(rawNumeric) && rawNumeric > 0 ? rawNumeric : productId;
        return cartApi.updateCartItem(token, targetId, quantity);
      })
      .then((res) => {
        if (res) {
          console.log('✓ [PUT /api/cart/:id] Item quantity updated in backend MySQL database:', res);
        }
      })
      .catch((err) => {
        console.warn('Backend update quantity notice:', err);
      });
  };

  /**
   * CLEAR CART:
   * Clears local state and triggers DELETE /api/cart in backend MySQL.
   */
  const clearCart = () => {
    setCart([]);
    setDiscountCode('');
    setDiscountPercent(0);

    getOrInitToken()
      .then((token) => {
        if (!token) return;
        return cartApi.clearCart(token);
      })
      .then((res) => {
        if (res) {
          console.log('✓ [DELETE /api/cart] Cart cleared in backend MySQL database:', res);
        }
      })
      .catch((err) => {
        console.warn('Backend clear cart notice:', err);
      });
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
