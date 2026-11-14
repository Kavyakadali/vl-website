import React from 'react';
import Link from 'next/link';
import { RotateCcw, ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center space-x-2 text-xs text-[#5F6762] hover:text-[#1A3B2B] mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </Link>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8E2D8] shadow-xs space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C29B38]">
            Hassle-Free Shopping
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1A3B2B]">
            Returns &amp; 7-Day Exchange Policy
          </h1>
          <p className="text-xs text-[#7A8580]">Last Updated: November 2026</p>

          <div className="space-y-6 text-xs text-[#1C201D] leading-relaxed divide-y divide-[#E8E2D8]">
            <div className="pt-4 first:pt-0">
              <h3 className="font-bold text-sm text-[#1A3B2B] mb-2 flex items-center space-x-2">
                <RotateCcw className="w-4 h-4 text-[#C29B38]" />
                <span>1. 7-Day Easy Exchange Guarantee</span>
              </h3>
              <p>
                At <strong>VL Designs for you</strong>, we take utmost pride in the quality of our natural loom cottons and handcrafted tailoring. If you receive a product with any sizing issue or fabric defect, you may request an exchange within <strong>7 days of delivery</strong>.
              </p>
            </div>

            <div className="pt-4">
              <h3 className="font-bold text-sm text-[#1A3B2B] mb-2 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#C29B38]" />
                <span>2. Eligibility for Exchange / Return</span>
              </h3>
              <ul className="list-disc pl-5 space-y-1.5 text-[#5F6762]">
                <li>The item must be unused, unwashed, and in the original condition with brand tags intact.</li>
                <li>For unstitched fabric materials, the cut must remain intact and uncut.</li>
                <li>Please share a clear unboxing video or parcel photo over our WhatsApp support at +91 98765 43210.</li>
              </ul>
            </div>

            <div className="pt-4">
              <h3 className="font-bold text-sm text-[#1A3B2B] mb-2 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#C29B38]" />
                <span>3. Refunds &amp; Store Credits</span>
              </h3>
              <p>
                In cases of manufacturing defects or verified transit damage, we offer an immediate replacement or full refund to your original payment method (Bank Account / UPI) within 3-5 business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
