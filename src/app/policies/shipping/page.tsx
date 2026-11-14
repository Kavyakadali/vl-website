import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, Clock, MapPin, ArrowLeft } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center space-x-2 text-xs text-[#5F6762] hover:text-[#1A3B2B] mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </Link>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8E2D8] shadow-xs space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C29B38]">
            Customer Care &amp; Transparency
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1A3B2B]">
            Shipping &amp; Delivery Policy
          </h1>
          <p className="text-xs text-[#7A8580]">Last Updated: November 2026</p>

          <div className="space-y-6 text-xs text-[#1C201D] leading-relaxed divide-y divide-[#E8E2D8]">
            <div className="pt-4 first:pt-0">
              <h3 className="font-bold text-sm text-[#1A3B2B] mb-2 flex items-center space-x-2">
                <Truck className="w-4 h-4 text-[#C29B38]" />
                <span>1. Free Express Shipping Threshold</span>
              </h3>
              <p>
                We offer <strong>Free Express Shipping across all Indian states and Union Territories</strong> on every order of ₹999 and above. For orders under ₹999, a nominal flat express shipping charge of ₹80 is applied at checkout.
              </p>
            </div>

            <div className="pt-4">
              <h3 className="font-bold text-sm text-[#1A3B2B] mb-2 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#C29B38]" />
                <span>2. Dispatch &amp; Delivery Timelines</span>
              </h3>
              <p>
                All our in-house crafted cotton pieces and curated fabrics are inspected and dispatched within <strong>24 to 48 business hours</strong> from our weaving studio hubs.
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-[#5F6762]">
                <li><strong>South India (Tamil Nadu, Karnataka, Telangana, AP, Kerala):</strong> Delivered in 2 to 4 business days.</li>
                <li><strong>Metro Cities (Mumbai, Delhi NCR, Kolkata, Pune):</strong> Delivered in 3 to 5 business days.</li>
                <li><strong>Rest of India:</strong> Delivered in 4 to 7 business days.</li>
              </ul>
            </div>

            <div className="pt-4">
              <h3 className="font-bold text-sm text-[#1A3B2B] mb-2 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#C29B38]" />
                <span>3. Real-Time Tracking &amp; WhatsApp Notifications</span>
              </h3>
              <p>
                Immediately upon parcel dispatch through our logistics partners (Shiprocket, Delhivery, BlueDart), you will receive an automated tracking link and SMS/WhatsApp notification with live AWB status.
              </p>
            </div>

            <div className="pt-4">
              <h3 className="font-bold text-sm text-[#1A3B2B] mb-2 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#C29B38]" />
                <span>4. Cash on Delivery (COD) Rules</span>
              </h3>
              <p>
                Cash on Delivery is available across 19,000+ Indian pincodes. Please ensure your mobile number is reachable, as our courier partner may send an OTP confirmation before final delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
