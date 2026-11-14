'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Smartphone,
  Lock,
  ArrowLeft,
  CheckCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
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

  const [paymentMethod, setPaymentMethod] = useState<'upi_razorpay' | 'cod'>('upi_razorpay');
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 80;
  
  // Extra 5% instant discount when choosing UPI/Prepaid
  const upiPrepaidDiscount = paymentMethod === 'upi_razorpay' ? Math.round(subtotal * 0.05) : 0;
  const finalPayable = Math.max(0, subtotal - discountAmount - upiPrepaidDiscount + shippingFee);

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
    if (!formData.phone.trim() || formData.phone.length < 10) newErrors.phone = 'Valid 10-digit mobile number required';
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'House/Flat & Street required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.pincode.trim() || formData.pincode.length !== 6) newErrors.pincode = 'Valid 6-digit Pincode required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (paymentMethod === 'upi_razorpay') {
      setIsRazorpayOpen(true);
    } else {
      // Direct Cash on Delivery placement
      completeOrderPlacement('COD_PAYMENT_PENDING');
    }
  };

  const completeOrderPlacement = (paymentId: string) => {
    const orderId = `VL-${Math.floor(100000 + Math.random() * 900000)}`;
    
    const newOrder = {
      id: orderId,
      orderNumber: orderId,
      items: cart,
      shippingAddress: formData,
      subtotal,
      discount: discountAmount + upiPrepaidDiscount,
      shippingFee,
      total: finalPayable,
      paymentMethod,
      paymentStatus: paymentMethod === 'upi_razorpay' ? 'paid' : 'pending',
      orderStatus: 'Confirmed',
      createdAt: new Date().toISOString(),
      paymentId,
    };

    // Save in localStorage for order success screen & admin viewing
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
            You cannot proceed to checkout without adding handcrafted pieces to your bag.
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
              VL DESIGNS
            </span>
            <span className="block text-[10px] tracking-widest uppercase text-[#C29B38] font-semibold">
              Express 1-Page Checkout
            </span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-[#1E6B35] font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">256-Bit SSL Secure</span>
          </div>
        </div>

        {/* 2-Column Layout */}
        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Delivery & Payment Details */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Contact Details */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8E2D8] shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#1C201D] uppercase tracking-wider flex items-center space-x-2">
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
                    Email Address (for order tracking &amp; GST receipt)
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
              <h3 className="text-sm font-bold text-[#1C201D] uppercase tracking-wider flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-[#1A3B2B] text-white text-[11px] flex items-center justify-center font-bold">2</span>
                <span>Shipping Address in India</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1C201D] mb-1">
                    House / Flat No., Apartment, Building *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Flat 302, Rosewood Heights"
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                    className="w-full text-xs border border-[#D8D2C5] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#1A3B2B]"
                  />
                  {errors.addressLine1 && <p className="text-[11px] text-[#9C3B24] mt-1">{errors.addressLine1}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C201D] mb-1">
                    Street, Area, Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Near Gandhi Circle, 4th Main"
                    value={formData.addressLine2}
                    onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                    className="w-full text-xs border border-[#D8D2C5] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#1A3B2B]"
                  />
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

            {/* Step 3: Payment Method Selection */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8E2D8] shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#1C201D] uppercase tracking-wider flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-[#1A3B2B] text-white text-[11px] flex items-center justify-center font-bold">3</span>
                <span>Select Payment Method</span>
              </h3>

              <div className="space-y-3">
                {/* Method 1: UPI / Razorpay (with 5% discount incentive) */}
                <label
                  onClick={() => setPaymentMethod('upi_razorpay')}
                  className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'upi_razorpay'
                      ? 'border-[#1A3B2B] bg-[#FAF8F5]'
                      : 'border-[#E8E2D8] hover:border-[#D8D2C5]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'upi_razorpay'}
                        onChange={() => setPaymentMethod('upi_razorpay')}
                        className="accent-[#1A3B2B]"
                      />
                      <div>
                        <span className="text-xs font-bold text-[#1C201D] flex items-center space-x-1.5">
                          <span>UPI / Google Pay / PhonePe / Cards / Netbanking</span>
                        </span>
                        <p className="text-[11px] text-[#5F6762] mt-0.5">
                          Instant confirmation via Razorpay Gateway (Test Mode active)
                        </p>
                      </div>
                    </div>
                    <span className="bg-[#EBF7EE] text-[#1E6B35] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#BBE3C4]">
                      ⚡ Save 5% Extra
                    </span>
                  </div>
                </label>

                {/* Method 2: Cash on Delivery (COD) */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#1A3B2B] bg-[#FAF8F5]'
                      : 'border-[#E8E2D8] hover:border-[#D8D2C5]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-[#1A3B2B]"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#1C201D] block">
                        Cash on Delivery (COD)
                      </span>
                      <p className="text-[11px] text-[#5F6762] mt-0.5">
                        Pay cash or UPI directly to the courier executive upon doorstep arrival.
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order Action */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E8E2D8] shadow-xs space-y-4 sticky top-24">
              <h3 className="text-sm font-bold text-[#1C201D] uppercase tracking-wider pb-3 border-b border-[#E8E2D8]">
                Order Summary ({cart.length} {cart.length === 1 ? 'item' : 'items'})
              </h3>

              {/* Items preview list */}
              <div className="divide-y divide-[#E8E2D8] max-h-60 overflow-y-auto space-y-3">
                {cart.map((item) => (
                  <div key={`${item.product.id}-${item.variant.id}`} className="pt-3 first:pt-0 flex space-x-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-14 h-16 object-cover rounded-lg border border-[#E8E2D8] shrink-0"
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
                    <span>Coupon Discount ({discountCode})</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                {upiPrepaidDiscount > 0 && (
                  <div className="flex justify-between text-[#1E6B35] font-semibold">
                    <span>⚡ Instant 5% UPI / Prepaid Discount</span>
                    <span>-₹{upiPrepaidDiscount}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#5F6762]">
                  <span>Express Shipping across India</span>
                  <span className="font-semibold text-[#1C201D]">
                    {shippingFee === 0 ? <strong className="text-[#1E6B35]">FREE</strong> : `₹${shippingFee}`}
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-3 border-t border-[#E8E2D8]">
                  <span className="text-sm font-bold text-[#1C201D]">Total Amount to Pay</span>
                  <span className="text-2xl font-black text-[#1A3B2B]">₹{finalPayable}</span>
                </div>
              </div>

              {/* Final Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#1A3B2B] hover:bg-[#2A5A43] text-white font-bold py-4 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-xl"
              >
                {paymentMethod === 'upi_razorpay' ? (
                  <>
                    <Sparkles className="w-4 h-4 text-[#C29B38]" />
                    <span>Pay with UPI / Cards (₹{finalPayable})</span>
                  </>
                ) : (
                  <>
                    <Truck className="w-4 h-4 text-[#C29B38]" />
                    <span>Confirm COD Order (₹{finalPayable})</span>
                  </>
                )}
              </button>

              <div className="text-center text-[10px] text-[#7A8580] pt-1 space-y-1">
                <p>🔒 100% Buyer Protection • Direct from Master Weavers</p>
                <p>Tracked parcel delivery with SMS &amp; WhatsApp updates</p>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Razorpay Simulation Modal */}
      <RazorpayModal
        isOpen={isRazorpayOpen}
        onClose={() => setIsRazorpayOpen(false)}
        amount={finalPayable}
        customerName={formData.fullName}
        customerEmail={formData.email}
        customerPhone={formData.phone}
        onSuccess={(payId) => completeOrderPlacement(payId)}
      />
    </div>
  );
}
