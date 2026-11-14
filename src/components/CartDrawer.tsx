'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Truck, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { BRAND_CONFIG } from '@/config/brand';

export default function CartDrawer() {
  const router = useRouter();
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    freeShippingThreshold,
    freeShippingProgress,
    amountNeededForFreeShipping,
    discountCode,
    discountAmount,
    applyDiscount,
    removeDiscount,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success?: boolean; message?: string } | null>(null);

  if (!isCartOpen) return null;

  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : BRAND_CONFIG.standardShippingFee;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyDiscount(inputCode);
    setCouponFeedback(res);
  };

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
      />

      {/* Slide-in Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="px-5 py-4 border-b border-[#E8E2D8] flex items-center justify-between bg-[#FAF8F5]">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#1A3B2B]" />
              <h2 className="text-base font-bold text-[#1C201D]">
                Shopping Bag ({cart.length})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-[#5F6762] hover:text-[#1C201D] hover:bg-neutral-200/60 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-5 py-3.5 bg-[#FBF7EE] border-b border-[#E8DFC9]">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <div className="flex items-center space-x-1.5 text-[#1A3B2B]">
                <Truck className="w-4 h-4 text-[#C29B38]" />
                {amountNeededForFreeShipping > 0 ? (
                  <span>
                    Add <strong className="text-[#9C3B24]">₹{amountNeededForFreeShipping}</strong> more for <strong className="text-[#1A3B2B]">FREE Shipping</strong>
                  </span>
                ) : (
                  <span className="font-semibold text-[#1A3B2B] flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1E6B35]" />
                    <span>Unlocked FREE Express Shipping across India!</span>
                  </span>
                )}
              </div>
              <span className="text-[#7D6B42] text-[11px] font-bold">
                {freeShippingProgress}%
              </span>
            </div>
            <div className="w-full bg-[#E5DDCB] h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#C29B38] to-[#1A3B2B] h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 divide-y divide-[#E8E2D8]">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF8F5] flex items-center justify-center border border-[#E8E2D8]">
                  <ShoppingBag className="w-8 h-8 text-[#9BA19D]" />
                </div>
                <div>
                  <p className="text-base font-semibold text-[#1C201D]">Your bag is empty</p>
                  <p className="text-xs text-[#5F6762] mt-1 max-w-xs mx-auto">
                    Explore our exclusive women&apos;s designer dresses, co-ords, and pure cotton fabrics.
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="mt-2 inline-flex items-center space-x-2 bg-[#1A3B2B] text-white text-xs font-semibold px-5 py-2.5 rounded-xl hover:bg-[#2A5A43]"
                >
                  <span>Start Shopping</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={`${item.product.id}-${item.variant.id}`} className="pt-4 first:pt-0 flex space-x-3.5">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-20 h-24 object-cover rounded-xl border border-[#E8E2D8] shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/product/${item.product.slug}`}
                          onClick={closeCart}
                          className="text-xs font-semibold text-[#1C201D] hover:text-[#1A3B2B] line-clamp-1"
                        >
                          {item.product.title}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.variant.id)}
                          className="text-[#9BA19D] hover:text-[#9C3B24] p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-[#5F6762] mt-0.5">
                        {item.variant.size} • {item.variant.color}
                      </p>
                      <p className="text-[10px] text-[#C29B38] font-medium">
                        {item.product.fabric}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[#D8D2C5] rounded-lg bg-[#FAF8F5]">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity - 1)}
                          className="p-1 hover:bg-[#EBE5DA] text-[#1C201D] rounded-l"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-2.5 text-[#1C201D]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity + 1)}
                          className="p-1 hover:bg-[#EBE5DA] text-[#1C201D] rounded-r"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-[#1A3B2B]">
                          ₹{item.product.price * item.quantity}
                        </span>
                        <span className="block text-[10px] text-neutral-400 line-through">
                          ₹{item.product.mrp * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#E8E2D8] bg-[#FAF8F5] space-y-3">
              {/* Coupon Code Input */}
              <div>
                {discountCode ? (
                  <div className="flex items-center justify-between bg-[#EBF7EE] border border-[#BBE3C4] px-3 py-2 rounded-lg text-xs">
                    <div className="flex items-center space-x-1.5 text-[#1E6B35]">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Code <strong>{discountCode}</strong> applied (-₹{discountAmount})</span>
                    </div>
                    <button
                      onClick={removeDiscount}
                      className="text-[#1E6B35] hover:text-[#9C3B24] font-semibold text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 text-[#9BA19D] absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Discount code (try WELCOME10 or UPI5)"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        className="w-full text-xs bg-white border border-[#D8D2C5] rounded-xl pl-9 pr-3 py-2 outline-none focus:border-[#1A3B2B]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-[#1A3B2B] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#2A5A43]"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponFeedback && !discountCode && (
                  <p className={`text-[11px] mt-1 ${couponFeedback.success ? 'text-green-700' : 'text-[#9C3B24]'}`}>
                    {couponFeedback.message}
                  </p>
                )}
              </div>

              {/* Price Calculation breakdown */}
              <div className="space-y-1.5 text-xs text-[#5F6762] pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1C201D]">₹{subtotal}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#1E6B35]">
                    <span>Discount ({discountCode})</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping across India</span>
                  <span className="font-semibold text-[#1C201D]">
                    {shippingFee === 0 ? <strong className="text-[#1E6B35]">FREE</strong> : `₹${shippingFee}`}
                  </span>
                </div>

                <p className="text-[10px] text-[#7A8580] pt-0.5">
                  * Note: Pay via UPI for FREE shipping (final amount = cart amount). Cash on Delivery (COD) charges ₹45 for courier shipping.
                </p>

                <div className="flex justify-between text-sm font-bold text-[#1C201D] pt-2 border-t border-[#E8E2D8]">
                  <span>Total Amount</span>
                  <span className="text-[#1A3B2B]">₹{grandTotal}</span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <button
                onClick={handleCheckout}
                className="w-full bg-[#1A3B2B] hover:bg-[#2A5A43] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-between shadow-lg transition-all"
              >
                <span className="text-xs uppercase tracking-wider">Proceed to Checkout</span>
                <span className="flex items-center space-x-1 text-sm font-extrabold text-[#E7C875]">
                  <span>₹{grandTotal}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </button>

              {/* Trust disclaimer */}
              <div className="flex items-center justify-center space-x-4 text-[10px] text-[#7A8580] pt-1">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-[#C29B38]" />
                  <span>UPI Direct &amp; COD Available</span>
                </span>
                <span>•</span>
                <span>Easy 7-Day Exchange</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
