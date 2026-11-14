'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon,
  ShoppingBag,
  MapPin,
  LogOut,
  ShieldCheck,
  Package,
  Clock,
  Sparkles,
  ArrowRight,
  Truck,
  CheckCircle2,
  Lock,
  Phone,
  Mail,
  Edit2,
  Save,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { BRAND_CONFIG } from '@/config/brand';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout, updateProfile, openAuthModal } = useAuth();
  const { wishlist } = useCart();

  const [activeTab, setActiveTab] = useState<'orders' | 'address' | 'profile'>('orders');
  const [orders, setOrders] = useState<any[]>([]);

  // Address edit state
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: 'Tamil Nadu',
    pincode: '',
  });

  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const [saveMessage, setSaveMessage] = useState('');

  // Load orders strictly for the currently logged in customer
  useEffect(() => {
    try {
      const allOrders = JSON.parse(localStorage.getItem('vl_orders') || '[]');
      if (user) {
        // Filter orders belonging to this user (by userId, username, email, phone, or recipient name)
        const userOrders = allOrders.filter(
          (o: any) =>
            o.userId === user.id ||
            (user.username && o.userUsername?.toLowerCase() === user.username.toLowerCase()) ||
            (user.email && (o.customerEmail?.toLowerCase() === user.email.toLowerCase() || o.shippingAddress?.email?.toLowerCase() === user.email.toLowerCase())) ||
            (user.phone && (o.customerPhone === user.phone || o.shippingAddress?.phone === user.phone)) ||
            (user.name && o.customerName?.toLowerCase() === user.name.toLowerCase())
        );
        setOrders(userOrders);
      }
    } catch {
      // Ignore
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setAddressForm({
        addressLine1: user.address?.addressLine1 || '',
        addressLine2: user.address?.addressLine2 || '',
        city: user.address?.city || '',
        state: user.address?.state || 'Tamil Nadu',
        pincode: user.address?.pincode || '',
      });
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
      });
    }
  }, [user]);

  // If not logged in, show real-world sign-in gate
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF8F5] px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E8E2D8] shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-[#FBF7EE] text-[#1A3B2B] flex items-center justify-center mx-auto border border-[#E8DFC9]">
            <Lock className="w-8 h-8 text-[#C29B38]" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#1A3B2B]">Sign In to Your Account</h2>
            <p className="text-xs text-[#5F6762] mt-1.5 leading-relaxed">
              Sign in with your registered account to view your past orders, delivery tracking, and saved address.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <button
              onClick={() => openAuthModal('customer')}
              className="w-full bg-[#1A3B2B] text-white py-3 rounded-xl text-xs font-bold hover:bg-[#2A5A43] transition-all shadow-md"
            >
              Sign In to Continue
            </button>
            <button
              onClick={() => openAuthModal('signup')}
              className="w-full bg-white border border-[#D8D2C5] text-[#1C201D] py-2.5 rounded-xl text-xs font-semibold hover:border-[#1A3B2B] transition-colors"
            >
              New Customer? Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ address: addressForm });
    setIsEditingAddress(false);
    setSaveMessage('Delivery address saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name: profileForm.name, phone: profileForm.phone, email: profileForm.email });
    setIsEditingProfile(false);
    setSaveMessage('Profile information updated successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleCancelOrder = (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      const allOrders = JSON.parse(localStorage.getItem('vl_orders') || '[]');
      const updated = allOrders.map((o: any) =>
        o.id === orderId ? { ...o, orderStatus: 'Cancelled' } : o
      );
      localStorage.setItem('vl_orders', JSON.stringify(updated));

      const single = localStorage.getItem(`vl_order_${orderId}`);
      if (single) {
        const parsed = JSON.parse(single);
        parsed.orderStatus = 'Cancelled';
        localStorage.setItem(`vl_order_${orderId}`, JSON.stringify(parsed));
      }

      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, orderStatus: 'Cancelled' } : o)));
    } catch {
      // Ignore
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Account Header Hero */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-[#1A3B2B] text-[#E7C875] flex items-center justify-center font-serif text-2xl font-black shadow-md border-2 border-[#2A5A43]">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A3B2B]">
                  {user.name}
                </h1>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                  user.role === 'admin'
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : 'bg-[#FBF7EE] text-[#1A3B2B] border border-[#E8DFC9]'
                }`}>
                  {user.role === 'admin' ? '👑 Store Admin' : '👤 Customer'}
                </span>
              </div>
              <p className="text-xs text-[#5F6762] mt-0.5">
                @{user.username} • {user.email} • {user.phone || 'No phone added'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isAdmin && (
              <Link
                href="/admin"
                className="bg-[#9C3B24] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#802F1C] transition-colors shadow-sm flex items-center space-x-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Go to Admin Portal</span>
              </Link>
            )}

            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="bg-white border border-[#D8D2C5] text-[#5F6762] hover:text-[#9C3B24] hover:border-[#9C3B24] px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {saveMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{saveMessage}</span>
          </div>
        )}

        {/* Main Content Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl border border-[#E8E2D8] p-3 shadow-xs space-y-1">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'orders'
                    ? 'bg-[#1A3B2B] text-white shadow-xs'
                    : 'text-[#1C201D] hover:bg-[#FAF8F5]'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>My Orders ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('address')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'address'
                    ? 'bg-[#1A3B2B] text-white shadow-xs'
                    : 'text-[#1C201D] hover:bg-[#FAF8F5]'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Delivery Address</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'profile'
                    ? 'bg-[#1A3B2B] text-white shadow-xs'
                    : 'text-[#1C201D] hover:bg-[#FAF8F5]'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span>Personal Info</span>
              </button>

              <Link
                href="/shop?filter=wishlist"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#1C201D] hover:bg-[#FAF8F5]"
              >
                <span className="flex items-center space-x-3">
                  <Sparkles className="w-4 h-4 text-[#C29B38]" />
                  <span>My Wishlist</span>
                </span>
                <span className="bg-[#C29B38] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {wishlist.length}
                </span>
              </Link>
            </div>
          </div>

          {/* Right Main Content Area */}
          <div className="lg:col-span-3">
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 border border-[#E8E2D8] shadow-sm">
                  <h2 className="font-serif text-xl font-bold text-[#1A3B2B] mb-1">
                    Your Orders
                  </h2>
                  <p className="text-xs text-[#5F6762] mb-6">
                    Track your current orders and view past purchase receipts.
                  </p>

                  {orders.length === 0 ? (
                    <div className="text-center py-12 text-[#5F6762]">
                      <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-[#1C201D]">No orders placed yet</p>
                      <p className="text-xs mt-1">Explore our handcrafted collection and place your first order!</p>
                      <Link
                        href="/shop"
                        className="mt-4 inline-block bg-[#1A3B2B] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#2A5A43]"
                      >
                        Browse Collections
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((ord: any) => (
                        <div
                          key={ord.id}
                          className="border border-[#E8E2D8] rounded-2xl p-5 hover:border-[#1A3B2B] transition-all bg-[#FAF8F5]"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8E2D8] gap-3">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-mono text-xs font-bold text-[#1A3B2B]">{ord.orderNumber}</span>
                                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                                  ord.orderStatus === 'Cancelled'
                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                    : ord.orderStatus === 'Delivered'
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                    : ord.orderStatus === 'Dispatched'
                                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                                    : ord.orderStatus === 'Packed & Quality Checked'
                                    ? 'bg-amber-50 text-amber-900 border-amber-200'
                                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                }`}>
                                  {ord.orderStatus || 'Confirmed'}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#5F6762] mt-0.5">
                                Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) || 'Recent'} • {ord.paymentMethod === 'cod' ? 'Cash on Delivery (+₹45)' : 'Online Payment'}
                              </p>
                            </div>

                            <div className="text-left sm:text-right">
                              <span className="text-base font-bold text-[#1A3B2B]">₹{ord.total}</span>
                              <span className="block text-[11px] text-[#5F6762]">
                                {ord.orderStatus === 'Cancelled' ? 'Order Cancelled' : ord.paymentStatus === 'paid' ? 'Payment Completed' : 'Payment Due at Doorstep'}
                              </span>
                            </div>
                          </div>

                          {/* Items Preview */}
                          <div className="py-4 space-y-3">
                            {ord.items?.map((it: any, idx: number) => (
                              <div key={idx} className="flex items-center space-x-3 text-xs">
                                <img
                                  src={it.product?.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=400'}
                                  alt={it.product?.title || 'Product'}
                                  className="w-12 h-14 object-cover rounded-lg border border-[#E8E2D8]"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-[#1C201D] truncate">{it.product?.title}</p>
                                  <p className="text-[11px] text-[#5F6762]">
                                    {it.variant?.size} {it.variant?.color ? `• ${it.variant.color}` : ''} × {it.quantity}
                                  </p>
                                </div>
                                <span className="font-bold text-[#1A3B2B]">
                                  ₹{(it.product?.price || 0) * (it.quantity || 1)}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Footer Actions */}
                          <div className="pt-3 border-t border-[#E8E2D8] flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
                            <div className="text-[11px] text-[#5F6762]">
                              Ship to: <strong className="text-[#1C201D]">{ord.shippingAddress?.city}, {ord.shippingAddress?.state} ({ord.shippingAddress?.pincode})</strong>
                            </div>

                            <div className="flex items-center space-x-2">
                              {ord.orderStatus === 'Confirmed' && (
                                <button
                                  type="button"
                                  onClick={() => handleCancelOrder(ord.id)}
                                  className="text-[11px] text-rose-700 hover:text-rose-900 border border-rose-200 bg-rose-50 px-3 py-1.5 rounded-lg font-semibold transition-colors"
                                >
                                  Cancel Order
                                </button>
                              )}

                              <a
                                href={`https://wa.me/${BRAND_CONFIG.whatsappNumber}?text=${encodeURIComponent(`Hi VL Designs, I want to track my order #${ord.orderNumber}.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-1.5 text-[#1E6B35] bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-semibold hover:bg-emerald-100 transition-colors"
                              >
                                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                                <span>Track via WhatsApp</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'address' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[#1A3B2B]">
                      Saved Delivery Address
                    </h2>
                    <p className="text-xs text-[#5F6762] mt-0.5">
                      This address auto-fills automatically during checkout.
                    </p>
                  </div>

                  {!isEditingAddress && (
                    <button
                      onClick={() => setIsEditingAddress(true)}
                      className="flex items-center space-x-1.5 text-xs font-semibold text-[#1A3B2B] bg-[#FBF7EE] border border-[#E8DFC9] px-3.5 py-1.5 rounded-xl hover:border-[#C29B38]"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#C29B38]" />
                      <span>Edit Address</span>
                    </button>
                  )}
                </div>

                {isEditingAddress ? (
                  <form onSubmit={handleSaveAddress} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1C201D] mb-1">
                        House / Flat / Building &amp; Street Address
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.addressLine1}
                        onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                        placeholder="e.g. Flat 402, Lotus Greens, Anna Nagar"
                        className="w-full bg-white border border-[#D8D2C5] rounded-xl px-3.5 py-2 text-xs text-[#1C201D] outline-none focus:border-[#1A3B2B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1C201D] mb-1">
                        Landmark / Locality (Optional)
                      </label>
                      <input
                        type="text"
                        value={addressForm.addressLine2}
                        onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                        placeholder="e.g. Near Roundtana"
                        className="w-full bg-white border border-[#D8D2C5] rounded-xl px-3.5 py-2 text-xs text-[#1C201D] outline-none focus:border-[#1A3B2B]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#1C201D] mb-1">City</label>
                        <input
                          type="text"
                          required
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          placeholder="Chennai"
                          className="w-full bg-white border border-[#D8D2C5] rounded-xl px-3.5 py-2 text-xs text-[#1C201D] outline-none focus:border-[#1A3B2B]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1C201D] mb-1">State</label>
                        <select
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          className="w-full bg-white border border-[#D8D2C5] rounded-xl px-3.5 py-2 text-xs text-[#1C201D] outline-none focus:border-[#1A3B2B]"
                        >
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Telangana">Telangana</option>
                          <option value="Andhra Pradesh">Andhra Pradesh</option>
                          <option value="Kerala">Kerala</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Delhi">Delhi</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1C201D] mb-1">Pincode</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={addressForm.pincode}
                          onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                          placeholder="600040"
                          className="w-full bg-white border border-[#D8D2C5] rounded-xl px-3.5 py-2 text-xs text-[#1C201D] outline-none focus:border-[#1A3B2B]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 pt-3">
                      <button
                        type="submit"
                        className="bg-[#1A3B2B] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#2A5A43] flex items-center space-x-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Address</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingAddress(false)}
                        className="bg-white border border-[#D8D2C5] text-[#5F6762] px-4 py-2 rounded-xl text-xs font-semibold hover:border-[#1A3B2B]"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8E2D8] space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-[#1A3B2B] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-[#1C201D]">{user.name}</p>
                        <p className="text-xs text-[#5F6762] mt-1 leading-relaxed">
                          {user.address?.addressLine1 || 'No address line added yet'}
                          {user.address?.addressLine2 ? `, ${user.address.addressLine2}` : ''}
                          <br />
                          {user.address?.city || 'City'}, {user.address?.state || 'State'} - {user.address?.pincode || 'Pincode'}
                        </p>
                        <p className="text-xs text-[#1A3B2B] font-semibold mt-2">
                          Phone: {user.phone || 'No phone number linked'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[#1A3B2B]">
                      Personal Profile Details
                    </h2>
                    <p className="text-xs text-[#5F6762] mt-0.5">
                      Your identity and contact information.
                    </p>
                  </div>

                  {!isEditingProfile && (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="flex items-center space-x-1.5 text-xs font-semibold text-[#1A3B2B] bg-[#FBF7EE] border border-[#E8DFC9] px-3.5 py-1.5 rounded-xl hover:border-[#C29B38]"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#C29B38]" />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>

                {isEditingProfile ? (
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1C201D] mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full bg-white border border-[#D8D2C5] rounded-xl px-3.5 py-2 text-xs text-[#1C201D] outline-none focus:border-[#1A3B2B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1C201D] mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full bg-white border border-[#D8D2C5] rounded-xl px-3.5 py-2 text-xs text-[#1C201D] outline-none focus:border-[#1A3B2B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1C201D] mb-1">Mobile Number</label>
                      <input
                        type="tel"
                        maxLength={10}
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                        className="w-full bg-white border border-[#D8D2C5] rounded-xl px-3.5 py-2 text-xs text-[#1C201D] outline-none focus:border-[#1A3B2B]"
                      />
                    </div>

                    <div className="flex items-center space-x-3 pt-3">
                      <button
                        type="submit"
                        className="bg-[#1A3B2B] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#2A5A43] flex items-center space-x-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Changes</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="bg-white border border-[#D8D2C5] text-[#5F6762] px-4 py-2 rounded-xl text-xs font-semibold hover:border-[#1A3B2B]"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8E2D8] space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-[#7D8882] block text-[11px]">Full Name</span>
                        <span className="font-bold text-[#1C201D] text-sm">{user.name}</span>
                      </div>
                      <div>
                        <span className="text-[#7D8882] block text-[11px]">Username</span>
                        <span className="font-mono font-bold text-[#1A3B2B]">@{user.username}</span>
                      </div>
                      <div>
                        <span className="text-[#7D8882] block text-[11px]">Email Address</span>
                        <span className="font-semibold text-[#1C201D]">{user.email}</span>
                      </div>
                      <div>
                        <span className="text-[#7D8882] block text-[11px]">Mobile Number</span>
                        <span className="font-semibold text-[#1C201D]">{user.phone || 'Not added'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
