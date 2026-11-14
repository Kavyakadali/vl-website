import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, Award, PhoneCall, Mail, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#14261C] text-[#FAF8F5] pt-16 pb-12 border-t border-[#234231]">
      {/* 4 Pillars Trust Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#234231]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 rounded-xl bg-[#1D3B2B] text-[#C29B38] border border-[#2E5842]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wide text-white">Loom-to-Wardrobe</h4>
              <p className="text-xs text-[#B2BDB6] mt-0.5">Authentic pure natural fabrics crafted with artisan care.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 rounded-xl bg-[#1D3B2B] text-[#C29B38] border border-[#2E5842]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wide text-white">Free Express Delivery</h4>
              <p className="text-xs text-[#B2BDB6] mt-0.5">Fast tracked delivery across India for orders above ₹999.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 rounded-xl bg-[#1D3B2B] text-[#C29B38] border border-[#2E5842]">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wide text-white">Easy 7-Day Exchange</h4>
              <p className="text-xs text-[#B2BDB6] mt-0.5">Hassle-free size or design exchange if not 100% satisfied.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 rounded-xl bg-[#1D3B2B] text-[#C29B38] border border-[#2E5842]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wide text-white">100% Safe Payments</h4>
              <p className="text-xs text-[#B2BDB6] mt-0.5">Encrypted UPI (GPay/PhonePe), Cards, Netbanking &amp; COD.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <span className="font-serif text-2xl tracking-widest font-bold text-white">
              VL DESIGNS
            </span>
            <span className="block text-xs tracking-[0.25em] uppercase text-[#C29B38] font-semibold mt-0.5">
              for you • Handcrafted Textiles
            </span>
            <p className="text-xs text-[#B2BDB6] mt-4 leading-relaxed max-w-sm">
              We specialize in creating pure cotton unstitched suit materials, breathable sarees, and artisanal tailored dresses. By sourcing natural loom textiles directly, we bring you unmatched fabric authenticity without middleman markups.
            </p>
            
            <div className="mt-6 flex items-center space-x-3">
              <a
                href="https://wa.me/919876543210?text=Hello%20VL%20Designs!%20I%20have%20an%20inquiry%20about%20your%20clothing%20collection."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 bg-[#25D366] text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#1EBE5D] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h5 className="text-xs uppercase tracking-wider font-bold text-[#E7C875] mb-4">Shop Categories</h5>
            <ul className="space-y-2.5 text-xs text-[#D8D2C5]">
              <li><Link href="/shop?type=own_design" className="hover:text-white transition-colors">✨ In-House Crafted Designs</Link></li>
              <li><Link href="/shop?type=resold" className="hover:text-white transition-colors">🛍️ Curated Resale Trends</Link></li>
              <li><Link href="/shop?category=Unstitched+Suit+Material" className="hover:text-white transition-colors">Unstitched Cotton Suits</Link></li>
              <li><Link href="/shop?category=Cotton+Sarees" className="hover:text-white transition-colors">Traditional Cotton Sarees</Link></li>
              <li><Link href="/shop?category=Kurtis+%26+Sets" className="hover:text-white transition-colors">Kurtis &amp; Co-ord Sets</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h5 className="text-xs uppercase tracking-wider font-bold text-[#E7C875] mb-4">Customer Care</h5>
            <ul className="space-y-2.5 text-xs text-[#D8D2C5]">
              <li><Link href="/policies/shipping" className="hover:text-white transition-colors">Shipping &amp; Delivery</Link></li>
              <li><Link href="/policies/returns" className="hover:text-white transition-colors">Returns &amp; Exchange Policy</Link></li>
              <li><Link href="/policies/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/policies/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors text-[#C29B38]">Store Admin Portal</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h5 className="text-xs uppercase tracking-wider font-bold text-[#E7C875] mb-4">Studio Contact</h5>
            <div className="space-y-3 text-xs text-[#D8D2C5]">
              <p className="flex items-center space-x-2">
                <PhoneCall className="w-4 h-4 text-[#C29B38]" />
                <span>+91 98765 43210</span>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#C29B38]" />
                <span>care@vldesigns.com</span>
              </p>
              <p className="text-[11px] text-[#A0AAA4] leading-relaxed pt-2">
                VL Designs Textile Studio<br />
                Salem &amp; Coimbatore Weaving Clusters, India
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright & payment icons */}
        <div className="mt-12 pt-6 border-t border-[#234231] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8E9B93]">
          <p>© {new Date().getFullYear()} VL Designs for you. All rights reserved. Handcrafted in India.</p>
          <div className="flex items-center space-x-3 mt-3 sm:mt-0">
            <span className="bg-[#1D3B2B] px-2.5 py-1 rounded text-white border border-[#2E5842]">UPI (GPay / PhonePe / Paytm)</span>
            <span className="bg-[#1D3B2B] px-2.5 py-1 rounded text-white border border-[#2E5842]">Credit / Debit Cards</span>
            <span className="bg-[#1D3B2B] px-2.5 py-1 rounded text-white border border-[#2E5842]">COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
