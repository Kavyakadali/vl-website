import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center space-x-2 text-xs text-[#5F6762] hover:text-[#1A3B2B] mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </Link>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8E2D8] shadow-xs space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C29B38]">
            Data Privacy
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1A3B2B]">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#7A8580]">Last Updated: November 2026</p>

          <div className="space-y-4 text-xs text-[#1C201D] leading-relaxed">
            <p>
              Your privacy is of utmost importance to <strong>VL Designs for you</strong>. This policy outlines how we collect, store, and safeguard your details when you place an order.
            </p>
            <h4 className="font-bold text-sm text-[#1A3B2B] pt-2">Information We Collect</h4>
            <p className="text-[#5F6762]">
              When placing an order, we collect your name, shipping address, 6-digit pincode, phone number, and email strictly for parcel fulfillment, shipping label creation via Shiprocket/courier partners, and automated order updates.
            </p>
            <h4 className="font-bold text-sm text-[#1A3B2B] pt-2">Payment Security</h4>
            <p className="text-[#5F6762]">
              We never store your credit card numbers, debit card PINs, or UPI passwords. All transactions are securely processed directly through Razorpay under PCI-DSS Level 1 compliance.
            </p>
            <h4 className="font-bold text-sm text-[#1A3B2B] pt-2">No Third-Party Sharing</h4>
            <p className="text-[#5F6762]">
              We will never sell or rent your personal contact information to any third-party marketing agency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
