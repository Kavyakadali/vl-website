'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircle2, Package, Truck, MessageCircle, ArrowRight, Printer, MapPin, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = (params?.orderId as string) || 'VL-DEMO';
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#1A3B2B', '#C29B38', '#9C3B24', '#FAF8F5'],
      });
    } catch {
      // ignore
    }

    // Load order from localStorage if available
    try {
      const saved = localStorage.getItem(`vl_order_${orderId}`);
      if (saved) {
        setOrder(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, [orderId]);

  // Estimated delivery date (4 days from now)
  const estDate = new Date();
  estDate.setDate(estDate.getDate() + 4);
  const formattedDate = estDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Card */}
        <div className="bg-white rounded-3xl border border-[#E8E2D8] shadow-xl overflow-hidden">
          {/* Top Banner */}
          <div className="bg-[#1A3B2B] text-white p-8 sm:p-10 text-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-white/10 text-[#E7C875] border border-white/20 flex items-center justify-center mx-auto mb-4 animate-in zoom-in-75">
              <CheckCircle2 className="w-10 h-10 text-[#E7C875]" />
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold">
              Order Confirmed!
            </h1>
            <p className="text-xs sm:text-sm text-[#D8D2C5] mt-1">
              Thank you for choosing VL Designs for you. Your piece is being hand-prepared.
            </p>

            <div className="mt-4 inline-block bg-white/10 backdrop-blur-xs px-4 py-1.5 rounded-full border border-white/20 text-xs font-mono font-semibold tracking-wider text-[#E7C875]">
              Order ID: {orderId}
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Timeline Progress */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A8580] mb-4">
                Delivery Timeline &amp; Progress
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-[#FAF8F5] border-2 border-[#1A3B2B] p-4 rounded-xl">
                  <div className="flex items-center space-x-2 text-[#1A3B2B] font-bold mb-1">
                    <CheckCircle2 className="w-4 h-4 text-[#1E6B35]" />
                    <span>1. Order Placed</span>
                  </div>
                  <p className="text-[11px] text-[#5F6762]">Verified &amp; assigned to loom studio</p>
                </div>

                <div className="bg-[#FAF8F5] border border-[#E8E2D8] p-4 rounded-xl">
                  <div className="flex items-center space-x-2 text-[#1C201D] font-bold mb-1">
                    <Package className="w-4 h-4 text-[#C29B38]" />
                    <span>2. Quality Check</span>
                  </div>
                  <p className="text-[11px] text-[#5F6762]">Fabric inspection &amp; packaging</p>
                </div>

                <div className="bg-[#FAF8F5] border border-[#E8E2D8] p-4 rounded-xl">
                  <div className="flex items-center space-x-2 text-[#1C201D] font-bold mb-1">
                    <Truck className="w-4 h-4 text-[#1A3B2B]" />
                    <span>3. Express Dispatch</span>
                  </div>
                  <p className="text-[11px] text-[#5F6762]">Arriving by {formattedDate.split(',')[0]}</p>
                </div>
              </div>
            </div>

            {/* Delivery Estimation Box */}
            <div className="bg-[#FBF7EE] border border-[#E8DFC9] p-4 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-[#C29B38]" />
                <div>
                  <span className="text-[#5F6762] block">Estimated Arrival Date</span>
                  <strong className="text-sm text-[#1A3B2B] font-serif">{formattedDate}</strong>
                </div>
              </div>

              {order && order.shippingAddress && (
                <div className="text-right text-[11px] text-[#5F6762]">
                  <span className="block font-semibold text-[#1C201D]">{order.shippingAddress.city}</span>
                  <span>PIN: {order.shippingAddress.pincode}</span>
                </div>
              )}
            </div>

            {/* WhatsApp Integration Button */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-emerald-950 flex items-center space-x-1.5">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Get Live WhatsApp Parcel Tracking</span>
                </h4>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  We will send your courier tracking link and dispatch photos directly on WhatsApp.
                </p>
              </div>

              <a
                href={`https://wa.me/919876543210?text=Hello%20VL%20Designs,%20I%20just%20placed%20order%20${orderId}%20on%20the%20website.%20Please%20share%20tracking%20updates!`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 bg-[#25D366] text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-[#1EBE5D] transition-colors shrink-0 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirm on WhatsApp</span>
              </a>
            </div>

            {/* Itemized Order Details */}
            {order && (
              <div className="border-t border-[#E8E2D8] pt-6 space-y-3 text-xs">
                <h4 className="font-bold text-[#1C201D] uppercase tracking-wider">
                  Ordered Items
                </h4>

                <div className="divide-y divide-[#E8E2D8]">
                  {order.items?.map((item: any, i: number) => (
                    <div key={i} className="py-2.5 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-[#1C201D]">{item.product.title}</p>
                        <p className="text-[11px] text-[#5F6762]">
                          {item.variant.size} • Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-bold text-[#1A3B2B]">₹{item.product.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-[#FAF8F5] p-3 rounded-xl space-y-1.5 text-xs border border-[#E8E2D8]">
                  <div className="flex justify-between text-[#5F6762]">
                    <span>Payment Method</span>
                    <span className="font-semibold text-[#1C201D] uppercase">
                      {order.paymentMethod === 'upi_razorpay' ? 'UPI / Prepaid (Paid)' : 'Cash on Delivery'}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-[#1C201D] pt-1 border-t border-[#E8E2D8]">
                    <span>Total Paid / Payable</span>
                    <span className="text-[#1A3B2B] text-sm">₹{order.total}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Link
                href="/shop"
                className="flex-1 bg-[#1A3B2B] hover:bg-[#2A5A43] text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider text-center flex items-center justify-center space-x-2 transition-all shadow-md"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => window.print()}
                className="bg-white border border-[#D8D2C5] text-[#1C201D] hover:bg-[#FAF8F5] font-semibold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all"
              >
                <Printer className="w-4 h-4 text-[#5F6762]" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
