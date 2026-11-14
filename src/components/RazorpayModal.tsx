'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, QrCode, Smartphone, CheckCircle2, Loader2, Zap } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';

interface RazorpayModalProps {
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentId: string) => void;
}

export default function RazorpayModal({
  amount,
  isOpen,
  onClose,
  onSuccess,
}: RazorpayModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState('');

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const dummyPaymentId = `pay_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
      setIsProcessing(false);
      onSuccess(dummyPaymentId);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200 animate-in zoom-in-95 duration-200">
        {/* Razorpay Authentic Header */}
        <div className="bg-[#0C2340] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-serif text-lg font-bold text-[#E7C875] border border-white/20">
              VL
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wide">{BRAND_CONFIG.shortName}</h3>
              <p className="text-[11px] text-blue-200">Direct UPI Gateway (Test Mode)</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-blue-200 block">Total Amount</span>
            <span className="text-xl font-black text-[#58A6FF]">₹{amount}</span>
          </div>
        </div>

        {/* UPI Sub-header badge */}
        <div className="bg-emerald-50 px-5 py-2.5 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
          <span className="flex items-center space-x-1 font-semibold">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>₹0 Shipping Fee • Final Amount == Cart Amount</span>
          </span>
          <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
            UPI Active
          </span>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="text-xs text-[#5F6762] font-medium">
            Select your preferred UPI app to complete payment:
          </div>

          {/* Supported UPI Apps */}
          <div className="grid grid-cols-4 gap-2.5 text-center text-[10px] font-semibold text-neutral-700">
            <div
              onClick={handleSimulatePayment}
              className="p-3 border border-neutral-200 rounded-xl bg-neutral-50 hover:border-emerald-600 hover:bg-emerald-50/40 cursor-pointer transition-colors shadow-xs"
            >
              <div className="w-7 h-7 mx-auto bg-white rounded-full flex items-center justify-center font-black text-blue-600 shadow-xs mb-1">G</div>
              <span>Google Pay</span>
            </div>
            <div
              onClick={handleSimulatePayment}
              className="p-3 border border-neutral-200 rounded-xl bg-neutral-50 hover:border-emerald-600 hover:bg-emerald-50/40 cursor-pointer transition-colors shadow-xs"
            >
              <div className="w-7 h-7 mx-auto bg-purple-600 rounded-full flex items-center justify-center font-black text-white shadow-xs mb-1">P</div>
              <span>PhonePe</span>
            </div>
            <div
              onClick={handleSimulatePayment}
              className="p-3 border border-neutral-200 rounded-xl bg-neutral-50 hover:border-emerald-600 hover:bg-emerald-50/40 cursor-pointer transition-colors shadow-xs"
            >
              <div className="w-7 h-7 mx-auto bg-sky-500 rounded-full flex items-center justify-center font-black text-white shadow-xs mb-1">P</div>
              <span>Paytm</span>
            </div>
            <div
              onClick={handleSimulatePayment}
              className="p-3 border border-neutral-200 rounded-xl bg-neutral-50 hover:border-emerald-600 hover:bg-emerald-50/40 cursor-pointer transition-colors shadow-xs"
            >
              <div className="w-7 h-7 mx-auto bg-orange-500 rounded-full flex items-center justify-center font-black text-white shadow-xs mb-1">B</div>
              <span>BHIM UPI</span>
            </div>
          </div>

          {/* Enter VPA */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Or Pay via UPI ID / VPA
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="yourname@okhdfcbank"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="flex-1 text-xs border border-neutral-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#0C2340]"
              />
              <button
                type="button"
                onClick={handleSimulatePayment}
                className="bg-[#0C2340] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#153A66]"
              >
                Verify &amp; Pay
              </button>
            </div>
          </div>

          {/* QR Code Scan Option */}
          <div className="border border-dashed border-neutral-300 rounded-xl p-3.5 text-center flex items-center justify-center space-x-3 bg-neutral-50">
            <QrCode className="w-8 h-8 text-neutral-700" />
            <div className="text-left text-xs">
              <span className="font-bold text-neutral-800 block">Scan Dynamic QR Code</span>
              <span className="text-[11px] text-neutral-500">Open any scanner on your phone to approve ₹{amount}</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={handleSimulatePayment}
              disabled={isProcessing}
              className="w-full bg-[#0C2340] hover:bg-[#153A66] text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg transition-all"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-blue-300" />
                  <span>Approving UPI Payment with Bank...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Simulate Successful UPI Pay (₹{amount})</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              disabled={isProcessing}
              className="w-full mt-2.5 text-center text-xs text-neutral-500 hover:text-neutral-800 py-1"
            >
              Cancel &amp; Return
            </button>
          </div>
        </div>

        {/* Razorpay Footer */}
        <div className="bg-neutral-100 px-5 py-2.5 flex items-center justify-between text-[10px] text-neutral-500 border-t border-neutral-200">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted UPI Payment Direct</span>
          </div>
          <span>Instant Settlement</span>
        </div>
      </div>
    </div>
  );
}
