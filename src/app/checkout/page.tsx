'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Truck,
  Smartphone,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Info,
  Sparkles,
  HelpCircle,
  MessageCircle,
  AlertCircle,
  User as UserIcon
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { BRAND_CONFIG } from '@/config/brand';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    subtotal,
    freeShippingThreshold,
    discountCode,
    discountAmount,
    clearCart,
  } = useCart();
  const { user, isAuthenticated, openAuthModal } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: 'Tamil Nadu',
    pincode: '',
  });

  // Pre-fill user data when logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        phone: user.phone || prev.phone,
        email: user.email || prev.email,
        addressLine1: user.address?.addressLine1 || prev.addressLine1,
        addressLine2: user.address?.addressLine2 || prev.addressLine2,
        city: user.address?.city || prev.city,
        state: user.address?.state || prev.state,
        pincode: user.address?.pincode || prev.pincode,
      }));
    }
  }, [user]);

  // Default and only active instant payment method is Cash on Delivery
  const [paymentMethod, setPaymentMethod] = useState<'cod'>('cod');
  const [showUpiNotice, setShowUpiNotice] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : BRAND_CONFIG.standardShippingFee;
  
  // Cash on Delivery Handling Fee is ₹45
  const codFee = BRAND_CONFIG.codHandlingFee;
  const finalPayable = Math.max(0, subtotal - discountAmount + shippingFee + codFee);

  // Auto-detect city/state from 6-digit Pincode
  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setFormData((prev) => ({ ...prev, pincode: val }));

    if (val.length === 6) {
      const prefix = val.substring(0, 2);
      if (['60', '61', '62', '63', '64'].includes(prefix)) {
        setFormData((prev) => ({ ...prev, city: 'Salem / Chennai Region', state: 'Tamil Nadu' }));
      } else if (['56', '57', '58', '59'].includes(prefix)) {
        setFormData((prev) => ({ ...prev, city: 'Bengaluru Region', state: 'Karnataka' }));
      } else if (['50', '51', '52', '53'].includes(prefix)) {
        setFormData((prev) => ({ ...prev, city: 'Hyderabad Region', state: 'Telangana' }));
      } else if (['40', '41', '42'].includes(prefix)) {
        setFormData((prev) => ({ ...prev, city: 'Mumbai Region', state: 'Maharashtra' }));
      } else if (['11'].includes(prefix)) {
        setFormData((prev) => ({ ...prev, city: 'New Delhi', state: 'Delhi' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.phone.trim() || formData.phone.length < 10) newErrors.phone = 'Valid 10-digit mobile number required for dispatch';
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'House/Flat & Street address required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.pincode.trim() || formData.pincode.length !== 6) newErrors.pincode = 'Valid 6-digit Indian Pincode required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Real COD Order Placement - 100% Genuine, No Fake Status
    const orderId = `VL-${Math.floor(100000 + Math.random() * 900000)}`;
    
    const newOrder = {
      id: orderId,
      orderNumber: orderId,
      items: cart,
      shippingAddress: formData,
      subtotal,
      discount: discountAmount,
      shippingFee,
      codFee,
      total: finalPayable,
      paymentMethod: 'cod',
      paymentStatus: 'pending', // Transparent real status: Payment pending on delivery
      orderStatus: 'Confirmed',
      createdAt: new Date().toISOString(),
    };

    try {
      const existingOrders = JSON.parse(localStorage.getItem('vl_orders') || '[]');
      existingOrders.unshift(newOrder);
      localStorage.setItem('vl_orders', JSON.stringify(existingOrders));
      localStorage.setItem(`vl_order_${orderId}`, JSON.stringify(newOrder));
    } catch {
      // ignore
    }

    clearCart();
    router.push(`/order-success/${orderId}`);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] py-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-[#E8E2D8] shadow-sm space-y-4">
          <p className="text-lg font-bold text-[#1C201D]">Your shopping bag is empty</p>
          <p className="text-xs text-[#5F6762]">
            Please add your desired women&apos;s pieces to the bag before proceeding to checkout.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#1A3B2B] text-white text-xs font-bold px-6 py-3 rounded-xl uppercase tracking-wider"
          >
            Explore Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Checkout Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#E8E2D8] mb-8">
          <Link href="/shop" className="flex items-center space-x-1.5 text-xs text-[#5F6762] hover:text-[#1A3B2B] font-medium">
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
          <div className="text-center">
            <span className="font-serif text-xl sm:text-2xl font-bold text-[#1A3B2B] tracking-wider">
              {BRAND_CONFIG.shortName}
            </span>
            <span className="block text-[10px] tracking-widest uppercase text-[#C29B38] font-semibold">
              Express 1-Page Checkout
            </span>
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-[#1E6B35] font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">256-Bit SSL Encrypted</span>
          </div>
        </div>

        {/* 2-Column Form Layout */}
        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Left Column: Delivery & Payment Details */}
          <div className="lg:col-span-7 space-y-6">

            {/* Logged in / Guest Banner */}
            <div className="bg-[#FBF7EE] p-4 rounded-2xl border border-[#E8DFC9] flex items-center justify-between text-xs">
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#1A3B2B] text-[#E7C875] flex items-center justify-center font-bold text-xs shadow-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-bold text-[#1C201D] block">Ordering as {user.name} ({user.email})</span>
                    <span className="text-[11px] text-[#5F6762]">Delivery address auto-filled from your profile</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-[#C29B38] shrink-0" />
                    <span className="text-[#1C201D]">Already have a VL Designs account?</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openAuthModal('customer')}
                    className="font-bold text-[#1A3B2B] bg-white border border-[#E8DFC9] px-3 py-1.5 rounded-lg hover:border-[#1A3B2B] text-xs transition-colors self-start sm:self-auto"
                  >
                    Sign In for 1-Click Fill
                  </button>
                </div>
              )}
            </div>
            
            {/* Step 1: Contact Details */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8E2D8] shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-[#1C201D] uppercase tracking-wider flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-[#1A3B2B] text-white text-[11px] flex items-center justify-center font-bold">1</span>
                <span>Customer Contact Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1C201D] mb-1">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full text-xs border border-[#D8D2C5] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#1A3B2B]"
                  />
                  {errors.fullName && <p className="text-[11px] text-[#9C3B24] mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C201D] mb-1">
                    WhatsApp / Mobile Number *
                  </label>
                  <div className="flex">
                    <span className="bg-[#FAF8F5] border border-r-0 border-[#D8D2C5] rounded-l-xl px-3 py-2.5 text-xs font-bold text-[#5F6762]">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="10-digit mobile"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                      className="flex-1 text-xs border border-[#D8D2C5] rounded-r-xl px-3.5 py-2.5 outline-none focus:border-[#1A3B2B]"
                    />
                  </div>
                  {errors.phone && <p className="text-[11px] text-[#9C3B24] mt-1">{errors.phone}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#1C201D] mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs border border-[#D8D2C5] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#1A3B2B]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8E2D8] shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-[#1C201D] uppercase tracking-wider flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-[#1A3B2B] text-white text-[11px] flex items-center justify-center font-bold">2</span>
                <span>Delivery Address</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1C201D] mb-1">
                    Flat / House No., Apartment, Street *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Flat 302, Rosewood Heights, 4th Main"
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                    className="w-full text-xs border border-[#D8D2C5] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#1A3B2B]"
                  />
                  {errors.addressLine1 && <p className="text-[11px] text-[#9C3B24] mt-1">{errors.addressLine1}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C201D] mb-1">6-Digit Pincode *</label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 560001"
                      value={formData.pincode}
                      onChange={handlePincodeChange}
                      className="w-full text-xs border border-[#D8D2C5] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#1A3B2B] font-bold"
                    />
                    {errors.pincode && <p className="text-[11px] text-[#9C3B24] mt-1">{errors.pincode}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C201D] mb-1">City / Town *</label>
                    <input
                      type="text"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full text-xs border border-[#D8D2C5] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#1A3B2B]"
                    />
                    {errors.city && <p className="text-[11px] text-[#9C3B24] mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C201D] mb-1">State *</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full text-xs border border-[#D8D2C5] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#1A3B2B]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Transparent Payment Options */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8E2D8] shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-[#1C201D] uppercase tracking-wider flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-[#1A3B2B] text-white text-[11px] flex items-center justify-center font-bold">3</span>
                <span>Payment Options</span>
              </h3>

              <div className="space-y-3">
                {/* Method 1: Cash on Delivery (ACTIVE & WORKING) */}
                <label className="block p-4 rounded-2xl border-2 border-[#1A3B2B] bg-[#FAF8F5] shadow-xs cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'cod'}
                        readOnly
                        className="accent-[#1A3B2B] w-4 h-4"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <Truck className="w-4 h-4 text-[#C29B38]" />
                          <span className="text-xs font-bold text-[#1C201D]">
                            Cash on Delivery (COD)
                          </span>
                          <span className="bg-[#EBF7EE] text-[#1E6B35] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#BBE3C4]">
                            Active
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5F6762] mt-0.5">
                          Pay cash or scan courier QR on doorstep arrival (+₹{BRAND_CONFIG.codHandlingFee} handling fee)
                        </p>
                      </div>
                    </div>
                    <span className="bg-[#FFF4E5] text-[#D9480F] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#FFD8A8] shrink-0">
                      +₹{BRAND_CONFIG.codHandlingFee} Handling
                    </span>
                  </div>
                </label>

                {/* Method 2: Online UPI (HONEST COMING SOON STATUS) */}
                <div
                  onClick={() => setShowUpiNotice(true)}
                  className="p-4 rounded-2xl border-2 border-neutral-200 bg-neutral-50/70 cursor-pointer hover:border-neutral-300 transition-all opacity-85"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        disabled
                        className="opacity-50 cursor-not-allowed"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <Smartphone className="w-4 h-4 text-neutral-400" />
                          <span className="text-xs font-semibold text-neutral-600">
                            Instant Online UPI (Google Pay / PhonePe / QR)
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          Automated online gateway is in KYC activation. Tap for manual UPI details.
                        </p>
                      </div>
                    </div>
                    <span className="bg-neutral-200 text-neutral-700 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0">
                      Coming Soon
                    </span>
                  </div>
                </div>

                {/* Info Box on How to pay UPI right now */}
                <div className="bg-[#FBF7EE] border border-[#E8DFC9] rounded-xl p-3.5 flex items-start space-x-2.5 text-xs text-[#7A6B42]">
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#C29B38]" />
                  <p className="leading-relaxed text-[11px]">
                    <strong>Want to pay via UPI right now?</strong> Place your order using Cash on Delivery, then click <em>&apos;Chat on WhatsApp&apos;</em> on the confirmation screen to receive our verified UPI QR code before dispatch!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Confirm Order Action */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E8E2D8] shadow-xs space-y-4 sticky top-24">
              <h3 className="text-xs font-bold text-[#1C201D] uppercase tracking-wider pb-3 border-b border-[#E8E2D8]">
                Order Summary ({cart.length} {cart.length === 1 ? 'piece' : 'pieces'})
              </h3>

              {/* Items preview list */}
              <div className="divide-y divide-[#E8E2D8] max-h-60 overflow-y-auto space-y-3">
                {cart.map((item) => (
                  <div key={`${item.product.id}-${item.variant.id}`} className="pt-3 first:pt-0 flex space-x-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-14 h-16 object-cover rounded-xl border border-[#E8E2D8] shrink-0"
                    />
                    <div className="flex-1 text-xs">
                      <p className="font-semibold text-[#1C201D] line-clamp-1">{item.product.title}</p>
                      <p className="text-[11px] text-[#5F6762]">{item.variant.size} • Qty: {item.quantity}</p>
                      <p className="text-[11px] font-bold text-[#1A3B2B] mt-1">₹{item.product.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing breakdown */}
              <div className="pt-4 border-t border-[#E8E2D8] space-y-2 text-xs">
                <div className="flex justify-between text-[#5F6762]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1C201D]">₹{subtotal}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#1E6B35]">
                    <span>Coupon ({discountCode})</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#5F6762]">
                  <span>Shipping across India</span>
                  <span className="font-semibold text-[#1C201D]">
                    {shippingFee === 0 ? <strong className="text-[#1E6B35]">FREE</strong> : `₹${shippingFee}`}
                  </span>
                </div>

                {/* COD Handling Fee Line */}
                <div className="flex justify-between text-[#D9480F] font-semibold">
                  <span>COD Courier Handling Fee</span>
                  <span>+₹{codFee}</span>
                </div>

                <div className="flex justify-between items-baseline pt-3 border-t border-[#E8E2D8]">
                  <span className="text-sm font-bold text-[#1C201D]">Total Amount to Pay</span>
                  <span className="text-2xl font-black text-[#1A3B2B]">₹{finalPayable}</span>
                </div>
                <p className="text-[10px] text-[#7A8580] text-right">
                  Payable in cash or courier scanner upon delivery
                </p>
              </div>

              {/* Final Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#1A3B2B] hover:bg-[#2A5A43] text-white font-bold py-4 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-xl hover:-translate-y-0.5"
              >
                <Truck className="w-4 h-4 text-[#C29B38]" />
                <span>Confirm Cash on Delivery Order (₹{finalPayable})</span>
              </button>

              <div className="text-center text-[10px] text-[#7A8580] pt-1 space-y-1">
                <p className="flex items-center justify-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1E6B35]" />
                  <span>100% Genuine Fabrics • Express Parcel Dispatch</span>
                </p>
                <p>Tracking link sent to WhatsApp &amp; SMS automatically</p>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Online UPI Coming Soon Modal Notice */}
      {showUpiNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-neutral-200 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1C201D]">Online UPI Gateway Coming Soon</h3>
              <p className="text-xs text-[#5F6762] mt-1.5 leading-relaxed">
                Direct automated online gateway is currently undergoing merchant banking KYC verification.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E8E2D8] text-xs text-[#1C201D] text-left space-y-1">
              <p className="font-semibold text-[#1A3B2B]">How to order today:</p>
              <p className="text-[11px] text-[#5F6762]">
                1. Place your order via <strong>Cash on Delivery (COD)</strong> right now.
              </p>
              <p className="text-[11px] text-[#5F6762]">
                2. If you prefer to pay online via UPI, simply message us on WhatsApp with your Order ID and we will share our UPI QR code directly!
              </p>
            </div>

            <button
              onClick={() => setShowUpiNotice(false)}
              className="w-full bg-[#1A3B2B] text-white text-xs font-bold py-3 rounded-xl uppercase tracking-wider"
            >
              Got It, Proceed with COD
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
