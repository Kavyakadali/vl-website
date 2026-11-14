import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center space-x-2 text-xs text-[#5F6762] hover:text-[#1A3B2B] mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </Link>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8E2D8] shadow-xs space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C29B38]">
            Legal &amp; Business Terms
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1A3B2B]">
            Terms of Service
          </h1>
          <p className="text-xs text-[#7A8580]">Last Updated: November 2026</p>

          <div className="space-y-4 text-xs text-[#1C201D] leading-relaxed">
            <p>
              Welcome to <strong>VL Designs for you</strong> (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;). By browsing or purchasing through this website, you agree to comply with and be bound by the following terms and conditions.
            </p>
            <h4 className="font-bold text-sm text-[#1A3B2B] pt-2">Product Authenticity &amp; Handcrafting Variations</h4>
            <p className="text-[#5F6762]">
              Because our pieces are crafted from natural cotton yarns and artisan block-prints, subtle variations in weave texture, buti placement, or shade are inherent hallmarks of handloom craftsmanship and are not considered defects.
            </p>
            <h4 className="font-bold text-sm text-[#1A3B2B] pt-2">Pricing &amp; Payments</h4>
            <p className="text-[#5F6762]">
              All prices listed on the website are in Indian Rupees (₹ INR) inclusive of GST. We reserve the right to revise promotional coupon codes or pricing without prior notice.
            </p>
            <h4 className="font-bold text-sm text-[#1A3B2B] pt-2">Governing Law</h4>
            <p className="text-[#5F6762]">
              These terms are governed by and construed in accordance with the laws of India, subject to the jurisdiction of the courts of Salem / Coimbatore, Tamil Nadu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
