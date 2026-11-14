'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, QrCode, Smartphone, CreditCard, Building2, CheckCircle, Loader2 } from 'lucide-react';

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
  customerName,
  customerEmail,
  customerPhone,
  isOpen,
  onClose,
  onSuccess,
}: RazorpayModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
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
        {/* Razorpay Authentic Blue Header */}
        <div className="bg-[#0C2340] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center font-serif text-lg font-bold text-[#E7C875] border border-white/20">
              VL
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wide">VL Designs for you</h3>
              <p className="text-[11px] text-blue-200">Razorpay Trusted Merchant (Test Mode)</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-blue-200 block">Amount to Pay</span>
            <span className="text-lg font-black text-[#58A6FF]">₹{amount}</span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 text-xs">
          <button
            onClick={() => setSelectedMethod('upi')}
            className={`flex-1 py-3 font-semibold flex items-center justify-center space-x-1.5 transition-colors ${
              selectedMethod === 'upi'
                ? 'border-b-2 border-[#0C2340] text-[#0C2340] bg-white'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>UPI / QR</span>
          </button>
          <button
            onClick={() => setSelectedMethod('card')}
            className={`flex-1 py-3 font-semibold flex items-center justify-center space-x-1.5 transition-colors ${
              selectedMethod === 'card'
                ? 'border-b-2 border-[#0C2340] text-[#0C2340] bg-white'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <CreditCard className="w-4 h-4 text-blue-600" />
            <span>Cards</span>
          </button>
          <button
            onClick={() => setSelectedMethod('netbanking')}
            className={`flex-1 py-3 font-semibold flex items-center justify-center space-x-1.5 transition-colors ${
              selectedMethod === 'netbanking'
                ? 'border-b-2 border-[#0C2340] text-[#0C2340] bg-white'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-amber-600" />
            <span>Netbanking</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {selectedMethod === 'upi' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-900">
                <span className="font-medium">⚡ Extra 5% Prepaid Discount Applied!</span>
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  Instant
                </span>
              </div>

              {/* Supported UPI Apps */}
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-medium text-neutral-600">
                <div className="p-2 border border-neutral-200 rounded-lg bg-neutral-50 hover:border-emerald-600 cursor-pointer">
                  <div className="w-6 h-6 mx-auto bg-white rounded-full flex items-center justify-center font-bold text-blue-600 shadow-xs mb-1">G</div>
                  <span>Google Pay</span>
                </div>
                <div className="p-2 border border-neutral-200 rounded-lg bg-neutral-50 hover:border-emerald-600 cursor-pointer">
                  <div className="w-6 h-6 mx-auto bg-purple-600 rounded-full flex items-center justify-center font-bold text-white shadow-xs mb-1">P</div>
                  <span>PhonePe</span>
                </div>
                <div className="p-2 border border-neutral-200 rounded-lg bg-neutral-50 hover:border-emerald-600 cursor-pointer">
                  <div className="w-6 h-6 mx-auto bg-sky-500 rounded-full flex items-center justify-center font-bold text-white shadow-xs mb-1">P</div>
                  <span>Paytm</span>
                </div>
                <div className="p-2 border border-neutral-200 rounded-lg bg-neutral-50 hover:border-emerald-600 cursor-pointer">
                  <div className="w-6 h-6 mx-auto bg-orange-500 rounded-full flex items-center justify-center font-bold text-white shadow-xs mb-1">B</div>
                  <span>BHIM</span>
                </div>
              </div>

              {/* UPI ID entry */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Pay via UPI ID (VPA)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. yourname@okhdfcbank"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="flex-1 text-xs border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#0C2340]"
                  />
                </div>
              </div>

              {/* Simulated QR option */}
              <div className="border border-dashed border-neutral-300 rounded-xl p-3 text-center flex items-center justify-center space-x-3 bg-neutral-50">
                <QrCode className="w-8 h-8 text-neutral-700" />
                <div className="text-left text-xs">
                  <span className="font-bold text-neutral-800 block">Scan QR Code from any UPI App</span>
                  <span className="text-[11px] text-neutral-500">Supports GPay, PhonePe, Paytm &amp; Cred</span>
                </div>
              </div>
            </div>
          )}

          {selectedMethod === 'card' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="4532 •••• •••• 8921"
                  defaultValue="4532 8765 4321 8921"
                  className="w-full text-xs border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#0C2340]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    defaultValue="12/28"
                    className="w-full text-xs border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#0C2340]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">CVV</label>
                  <input
                    type="password"
                    maxLength={3}
                    placeholder="•••"
                    defaultValue="829"
                    className="w-full text-xs border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#0C2340]"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedMethod === 'netbanking' && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((bank) => (
                <div key={bank} className="p-2.5 border border-neutral-200 rounded-lg hover:border-[#0C2340] cursor-pointer flex items-center space-x-2">
                  <Building2 className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="font-medium text-neutral-800">{bank}</span>
                </div>
              ))}
            </div>
          )}

          {/* Action Button */}
          <div className="mt-6 pt-3 border-t border-neutral-200">
            <button
              onClick={handleSimulatePayment}
              disabled={isProcessing}
              className="w-full bg-[#0C2340] hover:bg-[#153A66] text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg transition-all"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-blue-300" />
                  <span>Authorizing via Bank &amp; Razorpay...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Simulate Payment (₹{amount})</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              disabled={isProcessing}
              className="w-full mt-2 text-center text-xs text-neutral-500 hover:text-neutral-800 py-1"
            >
              Cancel Payment &amp; Return to Cart
            </button>
          </div>
        </div>

        {/* Razorpay Footer */}
        <div className="bg-neutral-100 px-5 py-2.5 flex items-center justify-between text-[10px] text-neutral-500 border-t border-neutral-200">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encrypted Razorpay Gateway</span>
          </div>
          <span>PCI-DSS Level 1 Compliant</span>
        </div>
      </div>
    </div>
  );
}
