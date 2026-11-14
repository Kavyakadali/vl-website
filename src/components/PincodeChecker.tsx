'use client';

import React, { useState } from 'react';
import { MapPin, CheckCircle2, Clock, Truck } from 'lucide-react';

export default function PincodeChecker() {
  const [pincode, setPincode] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState<{
    tested: boolean;
    valid: boolean;
    city?: string;
    date?: string;
    codAvailable?: boolean;
  } | null>(null);

  const checkPincode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pincode.trim();
    if (clean.length !== 6 || isNaN(Number(clean))) {
      setDeliveryInfo({ tested: true, valid: false });
      return;
    }

    // Calculate realistic delivery date (3-4 days from today)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 4);
    const dateFormatted = deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    // Metro & major state mappings
    let city = 'Your Area';
    const prefix = clean.substring(0, 2);
    if (['56', '57', '58', '59'].includes(prefix)) city = 'Karnataka (Bengaluru/Mysuru)';
    else if (['60', '61', '62', '63', '64'].includes(prefix)) city = 'Tamil Nadu (Chennai/Salem/CBE)';
    else if (['50', '51', '52', '53'].includes(prefix)) city = 'Telangana & AP (Hyderabad)';
    else if (['40', '41', '42', '43', '44'].includes(prefix)) city = 'Maharashtra (Mumbai/Pune)';
    else if (['11'].includes(prefix)) city = 'Delhi NCR';
    else if (['70', '71', '72'].includes(prefix)) city = 'West Bengal (Kolkata)';
    else city = 'Direct Express Hub';

    setDeliveryInfo({
      tested: true,
      valid: true,
      city,
      date: dateFormatted,
      codAvailable: true,
    });
  };

  return (
    <div className="bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl p-4 my-4">
      <div className="flex items-center space-x-2 text-xs font-semibold text-[#1C201D] mb-2">
        <MapPin className="w-4 h-4 text-[#1A3B2B]" />
        <span>Check Delivery &amp; COD Availability for Your Pincode</span>
      </div>

      <form onSubmit={checkPincode} className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit Pincode (e.g. 560001)"
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
          className="flex-1 bg-white border border-[#D8D2C5] rounded-lg px-3 py-2 text-xs text-[#1C201D] outline-none focus:border-[#1A3B2B]"
        />
        <button
          type="submit"
          className="bg-[#1A3B2B] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#2A5A43] transition-colors"
        >
          Check
        </button>
      </form>

      {deliveryInfo && deliveryInfo.tested && (
        <div className="mt-3 pt-3 border-t border-[#E8E2D8] text-xs">
          {deliveryInfo.valid ? (
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2 text-[#1E6B35] font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Express Delivery available to {deliveryInfo.city}!</span>
              </div>
              <div className="flex items-center space-x-4 text-[#5F6762] text-[11px] pt-1">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-[#C29B38]" />
                  <span>Expected by <strong>{deliveryInfo.date}</strong></span>
                </span>
                <span className="flex items-center space-x-1">
                  <Truck className="w-3.5 h-3.5 text-[#1A3B2B]" />
                  <span>Cash on Delivery (COD) <strong>Active</strong></span>
                </span>
              </div>
            </div>
          ) : (
            <p className="text-[#9C3B24]">Please enter a valid 6-digit Indian pincode.</p>
          )}
        </div>
      )}
    </div>
  );
}
