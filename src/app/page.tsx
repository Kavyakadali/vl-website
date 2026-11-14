'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, Feather, Truck, RefreshCw, Star, Layers, Scissors } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { INITIAL_PRODUCTS } from '@/data/products';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'all' | 'own_design' | 'resold'>('all');

  const filteredProducts = INITIAL_PRODUCTS.filter((p) => {
    if (activeTab === 'all') return true;
    return p.productType === activeTab;
  });

  const categories = [
    {
      title: 'Unstitched Suit Material',
      subtitle: '3-Piece Cotton Sets with Mal Mal Dupatta',
      slug: 'Unstitched+Suit+Material',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
      tag: 'Most Popular',
    },
    {
      title: 'Traditional Cotton Sarees',
      subtitle: 'Kalyani, Cham Cham & Kasavu Zari Weaves',
      slug: 'Cotton+Sarees',
      image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=800',
      tag: 'Pure Handloom',
    },
    {
      title: 'Kurtis & Co-ord Sets',
      subtitle: 'Artisan Tailored Everyday Elegance',
      slug: 'Kurtis+%26+Sets',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800',
      tag: 'Handcrafted',
    },
    {
      title: 'Linen Essentials',
      subtitle: 'Breathable Organic Flax Blends',
      slug: 'Linen+Essentials',
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
      tag: 'All-Day Comfort',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#FAF8F5] border-b border-[#E8E2D8] py-12 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-[#FBF7EE] border border-[#E8DFC9] text-[#1A3B2B] px-3.5 py-1.5 rounded-full text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-[#C29B38]" />
                <span>Handcrafted Loom Cottons • Direct from Designer</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1A3B2B] leading-[1.15] tracking-tight">
                Pure Weaves. <br />
                <span className="italic font-normal text-[#C29B38]">Crafted for You</span>, Directly from the Loom.
              </h1>

              <p className="text-sm sm:text-base text-[#5F6762] max-w-xl leading-relaxed">
                Experience authentic South Indian Kalyani cottons, breathable unstitched suit materials, and curated ethnic wear. Handpicked fabrics, bespoke master tailoring, and direct craft pricing without retail markups.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/shop?type=own_design"
                  className="bg-[#1A3B2B] hover:bg-[#2A5A43] text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-xl flex items-center space-x-2 shadow-lg transition-all"
                >
                  <Sparkles className="w-4 h-4 text-[#C29B38]" />
                  <span>Shop Our In-House Designs</span>
                </Link>

                <Link
                  href="/shop"
                  className="bg-white hover:bg-[#F2ECE1] text-[#1C201D] border border-[#D8D2C5] text-xs sm:text-sm font-semibold px-6 py-3.5 rounded-xl flex items-center space-x-2 transition-all"
                >
                  <span>Explore All Collections</span>
                  <ArrowRight className="w-4 h-4 text-[#1A3B2B]" />
                </Link>
              </div>

              {/* Trust Micro-Bullets */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#E8E2D8] text-xs text-[#1C201D]">
                <div className="flex items-center space-x-2">
                  <Feather className="w-4 h-4 text-[#C29B38]" />
                  <span className="font-medium">100% Pure Natural Cotton</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Scissors className="w-4 h-4 text-[#1A3B2B]" />
                  <span className="font-medium">Generous 2.5m Fabric Cuts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#C29B38]" />
                  <span className="font-medium">Direct Weave Pricing</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1200"
                    alt="VL Designs In-House Kalyani Cotton Collection"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating Authentic Badge Card */}
                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-[#E8E2D8] max-w-xs animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#1A3B2B] text-[#C29B38] flex items-center justify-center font-bold">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1C201D]">VL Studio Original</p>
                      <p className="text-[11px] text-[#5F6762]">Unstitched 3-Piece Material</p>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <span className="text-[#1A3B2B] font-bold">From ₹1,150</span>
                    <span className="text-[#1E6B35] font-semibold text-[11px]">Free Shipping &gt; ₹999</span>
                  </div>
                </div>

                {/* Floating Guarantee Badge */}
                <div className="absolute -top-4 -right-4 bg-[#1A3B2B] text-white rounded-xl px-3.5 py-2 shadow-lg border border-[#2A5A43] flex items-center space-x-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-[#C29B38]"></span>
                  <span className="font-semibold">Pure Cotton Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-[#C29B38]">
            Loom-Curated Categories
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A3B2B] mt-1">
            Shop by Weave &amp; Silhouettes
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6762] mt-2">
            From unstitched daily-wear dress materials to festive pure cotton sarees, each piece is crafted for breathability and elegance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              href={`/shop?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-neutral-900 border border-[#E8E2D8] shadow-sm hover:shadow-xl transition-all"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-75 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute top-3 right-3">
                <span className="bg-white/90 text-[#1A3B2B] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
                  {cat.tag}
                </span>
              </div>

              <div className="absolute bottom-5 left-5 right-5 text-white">
                <h3 className="font-serif text-lg font-bold leading-tight group-hover:text-[#E7C875] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-[11px] text-neutral-300 mt-1 line-clamp-1">
                  {cat.subtitle}
                </p>
                <div className="mt-3 inline-flex items-center space-x-1.5 text-xs font-semibold text-[#E7C875]">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Collection with "Our Design" vs "Curated" Distinction Switcher */}
      <section className="py-16 bg-[#FBF7EE] border-y border-[#E8DFC9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-[#C29B38]">
                Authentic Catalog
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A3B2B] mt-1">
                Explore Our Featured Drops
              </h2>
              <p className="text-xs sm:text-sm text-[#5F6762] mt-1">
                Filter between our exclusive in-house crafted designs and handpicked curated trends.
              </p>
            </div>

            {/* Interactive Tab Switcher */}
            <div className="flex bg-white p-1 rounded-xl border border-[#D8D2C5] shadow-xs">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'all'
                    ? 'bg-[#1A3B2B] text-white shadow-sm'
                    : 'text-[#5F6762] hover:text-[#1C201D]'
                }`}
              >
                All Products ({INITIAL_PRODUCTS.length})
              </button>
              <button
                onClick={() => setActiveTab('own_design')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'own_design'
                    ? 'bg-[#1A3B2B] text-white shadow-sm'
                    : 'text-[#1A3B2B] hover:text-[#C29B38]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C29B38]" />
                <span>Our In-House Designs</span>
              </button>
              <button
                onClick={() => setActiveTab('resold')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'resold'
                    ? 'bg-[#1A3B2B] text-white shadow-sm'
                    : 'text-[#5F6762] hover:text-[#1C201D]'
                }`}
              >
                Curated Resale
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* View All Button */}
          <div className="mt-12 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center space-x-2 bg-white hover:bg-[#FAF8F5] text-[#1A3B2B] border border-[#1A3B2B] px-8 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-sm"
            >
              <span>View Complete Shop Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* The "Buy Directly on Our Website" Value Guarantee */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1A3B2B] rounded-3xl p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-6">
            <span className="text-xs font-bold tracking-widest uppercase text-[#C29B38] bg-white/10 px-3 py-1 rounded-full border border-white/20">
              The VL Designs Direct Advantage
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Why Ordering Directly On Our Website Is Your Best Choice
            </h2>
            <p className="text-xs sm:text-sm text-[#D8D2C5] leading-relaxed">
              No middleman platforms, no waiting hours for Instagram DM confirmations. When you order directly through our official website, you receive guaranteed loom freshness, real-time tracking, and exclusive discounts.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#132C20] p-4 rounded-xl border border-[#244E39]">
                <h4 className="text-sm font-bold text-[#E7C875] flex items-center space-x-2">
                  <span>⚡ Extra 5% Instant UPI Discount</span>
                </h4>
                <p className="text-[11px] text-[#A6B5AD] mt-1">
                  Pay via Google Pay, PhonePe or Paytm using code <strong>UPI5</strong> at checkout.
                </p>
              </div>

              <div className="bg-[#132C20] p-4 rounded-xl border border-[#244E39]">
                <h4 className="text-sm font-bold text-[#E7C875] flex items-center space-x-2">
                  <span>📦 Full 2.5m Fabric Guarantee</span>
                </h4>
                <p className="text-[11px] text-[#A6B5AD] mt-1">
                  Generous measurements to stitch custom patterns up to 3XL without shortage.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center space-x-2 bg-[#C29B38] hover:bg-[#A9842A] text-white text-xs font-bold px-6 py-3.5 rounded-xl uppercase tracking-wider transition-colors shadow-md"
              >
                <span>Browse Cotton Collections Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Trust Testimonials */}
      <section className="py-16 bg-[#FAF8F5] border-t border-[#E8E2D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-widest uppercase text-[#C29B38]">
              Customer Reviews
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#1A3B2B] mt-1">
              Loved by Cotton Connoisseurs Across India
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E8E2D8] shadow-xs">
              <div className="flex text-amber-500 space-x-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#1C201D] leading-relaxed italic">
                &quot;The Kalyani cotton suit material is outstanding! The fabric feels breathable even in 38-degree heat, and the top length was more than enough for my tailor to design a Pakistani-style long kurti.&quot;
              </p>
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#1A3B2B]">Dr. Priya Ramanathan</p>
                  <p className="text-[10px] text-[#5F6762]">Chennai, Tamil Nadu</p>
                </div>
                <span className="text-[10px] bg-[#EBF7EE] text-[#1E6B35] font-semibold px-2 py-0.5 rounded">
                  Verified Buyer
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8E2D8] shadow-xs">
              <div className="flex text-amber-500 space-x-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#1C201D] leading-relaxed italic">
                &quot;I used to buy from Reenatex and local Elampillai weavers, but VL Designs has the cleanest stitching and fastest delivery. The UPI 5% discount works instantly and I received tracking on WhatsApp immediately.&quot;
              </p>
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#1A3B2B]">Ananya Kulkarni</p>
                  <p className="text-[10px] text-[#5F6762]">Bengaluru, Karnataka</p>
                </div>
                <span className="text-[10px] bg-[#EBF7EE] text-[#1E6B35] font-semibold px-2 py-0.5 rounded">
                  Verified Buyer
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8E2D8] shadow-xs">
              <div className="flex text-amber-500 space-x-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#1C201D] leading-relaxed italic">
                &quot;The Cham Cham cotton saree is feather-light and easy to pleat. Genuine South Indian weaving craftsmanship. Will definitely order again for festive gifting!&quot;
              </p>
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#1A3B2B]">Meera Sharma</p>
                  <p className="text-[10px] text-[#5F6762]">Hyderabad, Telangana</p>
                </div>
                <span className="text-[10px] bg-[#EBF7EE] text-[#1E6B35] font-semibold px-2 py-0.5 rounded">
                  Verified Buyer
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
