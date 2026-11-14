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
  User as UserIcon,
  Zap,
  Loader2,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { BRAND_CONFIG } from '@/config/brand';
import { orderApi } from '@/services/api';
import RazorpayModal from '@/components/RazorpayModal';

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
  const { user, token, isAuthenticated, login, signup, logout, updateProfile, openAuthModal } = useAuth();

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

  // Inline checkout authentication state
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Quick signup form state
  const [signupForm, setSignupForm] = useState({
    name: '',
    phone: '',
    email: '',
    username: '',
    password: '',
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
      setAuthError('');
    }
  }, [user]);

  // Payment method selection: UPI (Free Shipping) or COD (+₹45 Shipping)
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod'>('upi');
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pricing Rule:
  // - If payment type is UPI: shipping fee = 0, final amount == cart amount
  // - If order is COD: shipping fee = 45, final amount == cart amount + 45
  const cartAmount = Math.max(0, subtotal - discountAmount);
  const shippingFee = paymentMethod === 'cod' ? 45 : 0;
  const finalPayable = paymentMethod === 'upi' ? cartAmount : cartAmount + shippingFee;

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

  const handleCheckoutLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const res = await login(authUsername, authPassword);
      setAuthLoading(false);

      if (!res.success) {
        setAuthError(res.error || 'Invalid credentials. Please verify your username and password.');
      }
    } catch {
      setAuthLoading(false);
      setAuthError('Login failed. Please verify your credentials.');
    }
  };

  const handleCheckoutSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const res = await signup({
        name: signupForm.name,
        phone: signupForm.phone,
        email: signupForm.email,
        username: signupForm.username,
        password: signupForm.password,
      });
      setAuthLoading(false);

      if (!res.success) {
        setAuthError(res.error || 'Failed to create account. Please check your inputs.');
      }
    } catch {
      setAuthLoading(false);
      setAuthError('Registration failed. Please check your inputs.');
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

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError(null);

    // Mandatory Real-Time Auth check: No order without an authenticated customer
    if (!isAuthenticated || !user) {
      setAuthError('Please sign in or create an account in Step 1 to place and track your order in real time.');
      const el = document.getElementById('step-1-auth');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (!validateForm()) return;

    if (paymentMethod === 'upi') {
      // Trigger instant UPI payment modal
      setIsRazorpayOpen(true);
    } else {
      // Cash on Delivery
      await handleCompleteOrder('cod');
    }
  };

  const handleCompleteOrder = async (method: 'upi' | 'cod', paymentId?: string) => {
    setIsPlacingOrder(true);
    setOrderError(null);

    const fee = method === 'cod' ? 45 : 0;
    const currentFinalPayable = method === 'upi' ? cartAmount : cartAmount + fee;

    // Attempt backend DB order placement
    let backendOrderId: string | null = null;
    if (token) {
      try {
        const orderItems = cart
          .map((item) => ({
            productId: parseInt(item.product.id.replace(/\D/g, ''), 10) || 1,
            quantity: item.quantity,
          }))
          .filter((i) => !isNaN(i.productId) && i.productId > 0);

        const apiRes = await orderApi.createOrder(
          token,
          orderItems.length > 0 ? orderItems : undefined,
          {
            paymentType: method,
            paymentMethod: method,
            totalAmount: currentFinalPayable,
            shippingAddress: {
              ...formData,
              fullName: formData.fullName || user?.name,
              phone: formData.phone || user?.phone,
              email: formData.email || user?.email,
            },
          }
        );

        if (apiRes.success && apiRes.data?.order?.id) {
          backendOrderId = String(apiRes.data.order.id);
        } else if (!apiRes.success && apiRes.message) {
          setOrderError(apiRes.message);
          setIsPlacingOrder(false);
          setIsRazorpayOpen(false);
          return;
        }
      } catch (err: any) {
        console.warn('Backend order placement error, using fallback:', err);
      }
    }

    // Generate Order Record with UUID
    const orderId = backendOrderId || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `ord-${Date.now()}`);
    
    const newOrder = {
      id: orderId,
      orderNumber: orderId,
      userId: user?.id,
      userUsername: user?.username,
      customerName: formData.fullName || user?.name,
      customerPhone: formData.phone || user?.phone,
      customerEmail: formData.email || user?.email,
      shippingAddress: {
        ...formData,
        fullName: formData.fullName || user?.name,
        phone: formData.phone || user?.phone,
        email: formData.email || user?.email,
      },
      items: cart,
      subtotal,
      discount: discountAmount,
      cartAmount,
      shippingFee: fee,
      codFee: fee,
      total: currentFinalPayable,
      paymentMethod: method,
      paymentStatus: method === 'upi' ? 'paid' : 'pending',
      paymentId: paymentId || (method === 'upi' ? `pay_${Date.now()}` : undefined),
      orderStatus: 'Confirmed',
      createdAt: new Date().toISOString(),
    };

    // Update user profile address so next time it is remembered
    updateProfile({
      name: formData.fullName || user?.name,
      phone: formData.phone || user?.phone,
      email: formData.email || user?.email,
      address: {
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
    });

    try {
      const existingOrders = JSON.parse(localStorage.getItem('vl_orders') || '[]');
      existingOrders.unshift(newOrder);
      localStorage.setItem('vl_orders', JSON.stringify(existingOrders));
      localStorage.setItem(`vl_order_${orderId}`, JSON.stringify(newOrder));
    } catch {
      // ignore
    }

    clearCart();
    setIsRazorpayOpen(false);
    setIsPlacingOrder(false);
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

            {/* Step 1: Account Authentication (Mandatory to Place Order) */}
            <div id="step-1-auth" className="bg-white p-6 rounded-2xl border border-[#E8E2D8] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D8]">
                <h3 className="text-xs font-bold text-[#1C201D] uppercase tracking-wider flex items-center space-x-2">
                  <span className={`w-5 h-5 rounded-full text-white text-[11px] flex items-center justify-center font-bold ${isAuthenticated ? 'bg-[#1E6B35]' : 'bg-[#1A3B2B]'}`}>
                    {isAuthenticated ? '✓' : '1'}
                  </span>
                  <span>Step 1: Customer Account &amp; Identity</span>
                </h3>
                {isAuthenticated && user && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Verified Account
                  </span>
                )}
              </div>

              {/* If Authenticated: Display verified customer details */}
              {isAuthenticated && user ? (
                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E8E2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1A3B2B] text-[#E7C875] flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1C201D]">
                        {user.name} <span className="font-normal text-[#5F6762]">(@{user.username})</span>
                      </p>
                      <p className="text-[11px] text-[#5F6762]">
                        {user.email} • Ph: +91 {user.phone || '9876543210'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={logout}
                      className="text-[11px] text-[#9C3B24] hover:underline font-semibold"
                    >
                      Sign Out / Switch Account
                    </button>
                  </div>
                </div>
              ) : (
                /* If Not Logged In: Real-time Inline Sign In / Register Flow */
                <div className="space-y-4">
                  <div className="bg-[#FBF7EE] p-3.5 rounded-xl border border-[#E8DFC9] text-xs text-[#7A6B42] flex items-start space-x-2">
                    <Lock className="w-4 h-4 text-[#C29B38] shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-relaxed">
                      <strong>Login Required:</strong> To link this order directly to your account and track parcel dispatch in real time, please sign in or create an account.
                    </p>
                  </div>

                  {authError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center space-x-2 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  {/* Auth Tabs */}
                  <div className="grid grid-cols-2 bg-[#FAF8F5] p-1 rounded-xl border border-[#E8E2D8] text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => { setAuthTab('signin'); setAuthError(''); }}
                      className={`py-2 rounded-lg transition-all ${
                        authTab === 'signin'
                          ? 'bg-white text-[#1A3B2B] shadow-xs font-bold'
                          : 'text-[#5F6762] hover:text-[#1C201D]'
                      }`}
                    >
                      Sign In to Account
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAuthTab('signup'); setAuthError(''); }}
                      className={`py-2 rounded-lg transition-all ${
                        authTab === 'signup'
                          ? 'bg-white text-[#1A3B2B] shadow-xs font-bold'
                          : 'text-[#5F6762] hover:text-[#1C201D]'
                      }`}
                    >
                      New Customer? Register
                    </button>
                  </div>

                  {/* Sign In Form */}
                  {authTab === 'signin' && (
                    <div className="space-y-3 pt-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#1C201D] mb-1">
                            Username or Email *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. kavya or priya"
                            value={authUsername}
                            onChange={(e) => setAuthUsername(e.target.value)}
                            className="w-full text-xs border border-[#D8D2C5] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#1A3B2B]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#1C201D] mb-1">
                            Password *
                          </label>
                          <input
                            type="password"
                            required
                            placeholder="Enter password"
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            className="w-full text-xs border border-[#D8D2C5] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#1A3B2B]"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleCheckoutLogin}
                          disabled={authLoading}
                          className="w-full sm:w-auto bg-[#1A3B2B] hover:bg-[#2A5A43] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm"
                        >
                          {authLoading ? 'Signing In...' : 'Sign In & Continue Checkout'}
                        </button>
                        <span className="text-[11px] text-[#7A8580]">
                          Customer accounts: <strong>kavya</strong> / <strong>priya</strong>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Quick Register Form */}
                  {authTab === 'signup' && (
                    <div className="space-y-3 pt-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#1C201D] mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Ananya Rao"
                            value={signupForm.name}
                            onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                            className="w-full text-xs border border-[#D8D2C5] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#1A3B2B]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#1C201D] mb-1">
                            WhatsApp / Mobile Number *
                          </label>
                          <input
                            type="tel"
                            maxLength={10}
                            required
                            placeholder="10-digit mobile"
                            value={signupForm.phone}
                            onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value.replace(/\D/g, '') })}
                            className="w-full text-xs border border-[#D8D2C5] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#1A3B2B]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#1C201D] mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="name@example.com"
                            value={signupForm.email}
                            onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                            className="w-full text-xs border border-[#D8D2C5] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#1A3B2B]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#1C201D] mb-1">
                            Pick a Username *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. ananya"
                            value={signupForm.username}
                            onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value.toLowerCase().replace(/\s+/g, '') })}
                            className="w-full text-xs border border-[#D8D2C5] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#1A3B2B]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-[#1C201D] mb-1">
                            Create Password (min. 6 characters) *
                          </label>
                          <input
                            type="password"
                            required
                            placeholder="At least 6 characters"
                            value={signupForm.password}
                            onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                            className="w-full text-xs border border-[#D8D2C5] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#1A3B2B]"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleCheckoutSignup}
                        disabled={authLoading}
                        className="w-full bg-[#1A3B2B] hover:bg-[#2A5A43] text-white text-xs font-bold py-3 rounded-xl transition-all shadow-sm"
                      >
                        {authLoading ? 'Creating Account...' : 'Create Account & Continue Checkout'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Step 2: Delivery Contact & Address */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8E2D8] shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-[#1C201D] uppercase tracking-wider flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-[#1A3B2B] text-white text-[11px] flex items-center justify-center font-bold">2</span>
                <span>Delivery Address &amp; Recipient</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1C201D] mb-1">Recipient Name *</label>
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

                <div className="sm:col-span-2">
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

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#1C201D] mb-1">
                    Landmark / Colony (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Opposite City Park"
                    value={formData.addressLine2}
                    onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                    className="w-full text-xs border border-[#D8D2C5] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#1A3B2B]"
                  />
                </div>

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

                <div className="sm:col-span-2">
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

            {/* Step 3: Transparent Payment Options & Pricing Validation */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8E2D8] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D8]">
                <h3 className="text-xs font-bold text-[#1C201D] uppercase tracking-wider flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-[#1A3B2B] text-white text-[11px] flex items-center justify-center font-bold">3</span>
                  <span>Payment Options</span>
                </h3>
                <span className="text-[10px] text-[#5F6762] font-semibold">
                  Select payment type
                </span>
              </div>

              <div className="space-y-3">
                {/* Method 1: Instant Online UPI (FREE Shipping - final amount == cart amount) */}
                <label
                  onClick={() => setPaymentMethod('upi')}
                  className={`block p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'upi'
                      ? 'border-[#1A3B2B] bg-[#FAF8F5] shadow-xs'
                      : 'border-[#E8E2D8] bg-white hover:border-[#D8D2C5]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="accent-[#1A3B2B] w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <Smartphone className="w-4 h-4 text-[#1E6B35]" />
                          <span className="text-xs font-bold text-[#1C201D]">
                            Instant Online UPI (Google Pay / PhonePe / Paytm / QR)
                          </span>
                          <span className="bg-[#EBF7EE] text-[#1E6B35] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#BBE3C4]">
                            Recommended
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5F6762] mt-0.5">
                          Instant payment via any UPI App or QR code. <strong>₹0 Shipping</strong> — Final amount strictly equals cart amount (₹{cartAmount}).
                        </p>
                      </div>
                    </div>
                    <span className="bg-[#EBF7EE] text-[#1E6B35] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#BBE3C4] shrink-0">
                      FREE Shipping (₹0 Extra)
                    </span>
                  </div>
                </label>

                {/* Method 2: Cash on Delivery (+₹45 Shipping Fee) */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`block p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-[#1A3B2B] bg-[#FAF8F5] shadow-xs'
                      : 'border-[#E8E2D8] bg-white hover:border-[#D8D2C5]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="accent-[#1A3B2B] w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <Truck className="w-4 h-4 text-[#C29B38]" />
                          <span className="text-xs font-bold text-[#1C201D]">
                            Cash on Delivery (COD)
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5F6762] mt-0.5">
                          Pay cash or scan courier QR on doorstep arrival (+₹45 shipping fee applied).
                        </p>
                      </div>
                    </div>
                    <span className="bg-[#FFF4E5] text-[#D9480F] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#FFD8A8] shrink-0">
                      +₹45 Shipping Fee
                    </span>
                  </div>
                </label>

                {/* Pricing Rule Info Banner */}
                <div className="bg-[#FBF7EE] border border-[#E8DFC9] rounded-xl p-3 flex items-start space-x-2 text-xs text-[#7A6B42]">
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#C29B38]" />
                  <p className="leading-relaxed text-[11px]">
                    <strong>Pricing Validation:</strong> For <strong>UPI</strong> orders, the final payable amount strictly equals the cart amount (₹{cartAmount}) with ₹0 shipping. For <strong>COD</strong> orders, ₹45 shipping fee is charged (₹{cartAmount} + ₹45 = ₹{cartAmount + 45}).
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
                  <span>Cart Amount</span>
                  <span className="font-semibold text-[#1C201D]">₹{cartAmount}</span>
                </div>

                {/* Shipping Fee Line based on Payment Type */}
                <div className="flex justify-between items-center text-[#5F6762]">
                  <span>Shipping Fee ({paymentMethod === 'upi' ? 'UPI Free Shipping' : 'COD Shipping'})</span>
                  {shippingFee === 0 ? (
                    <span className="bg-[#EBF7EE] text-[#1E6B35] font-bold text-xs px-2 py-0.5 rounded border border-[#BBE3C4]">
                      FREE (₹0)
                    </span>
                  ) : (
                    <span className="font-bold text-[#D9480F]">
                      +₹{shippingFee}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-baseline pt-3 border-t border-[#E8E2D8]">
                  <span className="text-sm font-bold text-[#1C201D]">Total Amount to Pay</span>
                  <span className="text-2xl font-black text-[#1A3B2B]">₹{finalPayable}</span>
                </div>
                <p className="text-[10px] text-[#7A8580] text-right">
                  {paymentMethod === 'upi'
                    ? 'Final amount strictly equals cart amount (₹0 delivery charges)'
                    : 'Cart amount + ₹45 courier shipping fee for Cash on Delivery'}
                </p>
              </div>

              {/* Order Error Alert if any */}
              {orderError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{orderError}</span>
                </div>
              )}

              {/* Final Submit Button with Dynamic Label */}
              {isAuthenticated && user ? (
                <button
                  type="submit"
                  disabled={isPlacingOrder}
                  className="w-full bg-[#1A3B2B] hover:bg-[#2A5A43] text-white font-bold py-4 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-xl hover:-translate-y-0.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPlacingOrder ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#E7C875]" />
                      <span>Placing Order in Database...</span>
                    </>
                  ) : paymentMethod === 'upi' ? (
                    <>
                      <Zap className="w-4 h-4 text-[#E7C875]" />
                      <span>Pay via UPI (₹{finalPayable})</span>
                    </>
                  ) : (
                    <>
                      <Truck className="w-4 h-4 text-[#C29B38]" />
                      <span>Confirm Cash on Delivery Order (₹{finalPayable})</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setAuthError('Please sign in or create an account in Step 1 to place your order.');
                    const el = document.getElementById('step-1-auth');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full bg-[#9C3B24] hover:bg-[#802F1C] text-white font-bold py-4 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-[#E7C875]" />
                  <span>Sign In in Step 1 to Place Order</span>
                </button>
              )}

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

      {/* Razorpay Online UPI Modal */}
      <RazorpayModal
        isOpen={isRazorpayOpen}
        onClose={() => setIsRazorpayOpen(false)}
        onSuccess={(paymentId) => handleCompleteOrder('upi', paymentId)}
        amount={finalPayable}
        customerName={formData.fullName || user?.name || ''}
        customerEmail={formData.email || user?.email || ''}
        customerPhone={formData.phone || user?.phone || ''}
      />
    </div>
  );
}
