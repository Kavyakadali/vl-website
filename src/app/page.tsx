'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Feather,
  Truck,
  RotateCcw,
  Star,
  Scissors,
  Layers,
  Zap,
  CheckCircle2,
  Heart
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { INITIAL_PRODUCTS } from '@/data/products';
import { Product } from '@/types';
import { BRAND_CONFIG } from '@/config/brand';
import { fetchProductsFromApi } from '@/services/api';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'all' | 'own_design' | 'resold'>('all');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  // Fetch original data from backend DB with fallback to INITIAL_PRODUCTS
  useEffect(() => {
    fetchProductsFromApi()
      .then((data) => {
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(INITIAL_PRODUCTS);
        }
      })
      .catch(() => {
        setProducts(INITIAL_PRODUCTS);
      });
  }, []);

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'all') return true;
    return p.productType === activeTab;
  });

  const categories = [
    {
      title: "Women's Dresses & Co-Ords",
      subtitle: 'Tailored from Breathable Handpicked Cottons',
      slug: 'Kurtis+%26+Sets',
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800',
      tag: 'VL Designed',
    },
    {
      title: 'Unstitched Suit Materials',
      subtitle: '3-Piece Cotton Sets with Pure Mal Mal Dupatta',
      slug: 'Unstitched+Suit+Material',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
      tag: 'Best Seller',
    },
    {
      title: 'Traditional Cotton Sarees',
      subtitle: 'Kalyani, Cham Cham & Kasavu Zari Weaves',
      slug: 'Cotton+Sarees',
      image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=800',
      tag: 'Pure Cotton',
    },
    {
      title: 'Linen Women’s Essentials',
      subtitle: 'Relaxed Fit Two-Piece Outfits & Tunics',
      slug: 'Linen+Essentials',
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=800',
      tag: 'All-Day Wear',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Responsive Full-Viewport Immersion */}
      <section className="relative overflow-hidden bg-[#FAF8F5] border-b border-[#E8E2D8] min-h-[calc(100vh-112px)] flex items-center py-10 lg:py-16">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-20 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6 lg:space-y-8">
              <div className="inline-flex items-center space-x-2 bg-[#FBF7EE] border border-[#E8DFC9] text-[#1A3B2B] px-4 py-2 rounded-full text-xs sm:text-sm font-semibold shadow-xs">
                <Scissors className="w-4 h-4 text-[#C29B38]" />
                <span>Handpicked Fabrics • Styled into Signature Women&apos;s Outfits</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-[4.25rem] 2xl:text-[4.75rem] font-bold text-[#1A3B2B] leading-[1.12] tracking-tight">
                Curated Fabrics. <br />
                <span className="italic font-normal text-[#C29B38]">Styled for You</span>, Tailored with Precision.
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-[#5F6762] max-w-2xl leading-relaxed">
                We source pure loom cottons and fine linen fabrics, then design and tailor them into flattering women&apos;s dresses, unstitched suit materials, and contemporary co-ord sets. Pure comfort, direct craft value, and verified authenticity.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/shop?type=own_design"
                  className="bg-[#1A3B2B] hover:bg-[#2A5A43] text-white text-xs sm:text-sm lg:text-base font-bold px-7 py-4 rounded-xl flex items-center space-x-2.5 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-[#C29B38]" />
                  <span>Shop Our In-House Designs</span>
                </Link>

                <Link
                  href="/shop"
                  className="bg-white hover:bg-[#F2ECE1] text-[#1C201D] border border-[#D8D2C5] text-xs sm:text-sm lg:text-base font-semibold px-7 py-4 rounded-xl flex items-center space-x-2.5 transition-all shadow-xs hover:border-[#1A3B2B]"
                >
                  <span>Explore Women&apos;s Catalog</span>
                  <ArrowRight className="w-4 h-4 text-[#1A3B2B]" />
                </Link>
              </div>

              {/* Trust Micro-Bullets with Clean SVGs */}
              <div className="pt-6 lg:pt-8 grid grid-cols-3 gap-4 lg:gap-8 border-t border-[#E8E2D8] text-xs sm:text-sm text-[#1C201D]">
                <div className="flex items-center space-x-2.5">
                  <Feather className="w-4 h-4 sm:w-5 sm:h-5 text-[#C29B38] shrink-0" />
                  <span className="font-medium">100% Breathable Cotton</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Scissors className="w-4 h-4 sm:w-5 sm:h-5 text-[#1A3B2B] shrink-0" />
                  <span className="font-medium">Generous 2.5m Cuts</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#C29B38] shrink-0" />
                  <span className="font-medium">Direct Sourced Value</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md sm:max-w-lg lg:max-w-none w-full">
                <div className="aspect-[4/5] max-h-[580px] lg:max-h-[640px] xl:max-h-[700px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-neutral-100">
                  <img
                    src="https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=1200"
                    alt="VL Designs Women's Cotton Dress Collection"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>

                {/* Floating Authentic Badge Card */}
                <div className="absolute -bottom-5 -left-4 sm:-bottom-6 sm:-left-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-xl border border-[#E8E2D8] max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1A3B2B] text-[#C29B38] flex items-center justify-center font-bold shrink-0">
                      <Scissors className="w-5 h-5 text-[#C29B38]" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-[#1C201D]">VL Studio Tailoring</p>
                      <p className="text-[11px] sm:text-xs text-[#5F6762]">Pure Fabric • Bespoke Cuts</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-[#1A3B2B] font-bold">From ₹1,150</span>
                    <span className="text-[#1E6B35] font-semibold text-[11px] sm:text-xs">Free Shipping &gt; ₹{BRAND_CONFIG.freeShippingThreshold}</span>
                  </div>
                </div>

                {/* Floating Guarantee Badge */}
                <div className="absolute -top-4 -right-3 sm:-top-5 sm:-right-5 bg-[#1A3B2B] text-white rounded-2xl px-4 py-2.5 shadow-lg border border-[#2A5A43] flex items-center space-x-2 text-xs sm:text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C29B38] animate-ping"></span>
                  <span className="font-semibold">Women&apos;s Exclusive</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="py-16 lg:py-24 w-full max-w-[1680px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#C29B38]">
            Curated Categories
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A3B2B] mt-2">
            Shop Women&apos;s Silhouettes &amp; Fabrics
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-[#5F6762] mt-3">
            Every piece is created for daily breathability, skin-friendly softness, and timeless grace.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              href={`/shop?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-neutral-900 border border-[#E8E2D8] shadow-sm hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-75 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute top-3.5 right-3.5">
                <span className="bg-white/90 text-[#1A3B2B] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs shadow-xs">
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

      {/* Featured Drops with Distinction Switcher */}
      <section className="py-16 lg:py-24 bg-[#FBF7EE] border-y border-[#E8DFC9]">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 lg:mb-14 gap-6">
            <div>
              <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#C29B38]">
                Authentic Catalog
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A3B2B] mt-2">
                Explore Featured Drops
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-[#5F6762] mt-2">
                Filter between our custom designed dresses and curated regional trends.
              </p>
            </div>

            {/* Interactive Tab Switcher */}
            <div className="flex bg-white p-1.5 rounded-2xl border border-[#D8D2C5] shadow-xs">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'all'
                    ? 'bg-[#1A3B2B] text-white shadow-sm'
                    : 'text-[#5F6762] hover:text-[#1C201D]'
                }`}
              >
                All Outfits ({INITIAL_PRODUCTS.length})
              </button>
              <button
                onClick={() => setActiveTab('own_design')}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'own_design'
                    ? 'bg-[#1A3B2B] text-white shadow-sm'
                    : 'text-[#1A3B2B] hover:text-[#C29B38]'
                }`}
              >
                <Scissors className="w-4 h-4 text-[#C29B38]" />
                <span>Our In-House Designs</span>
              </button>
              <button
                onClick={() => setActiveTab('resold')}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'resold'
                    ? 'bg-[#1A3B2B] text-white shadow-sm'
                    : 'text-[#5F6762] hover:text-[#1C201D]'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Curated Trends</span>
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* View All Button */}
          <div className="mt-14 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center space-x-2 bg-white hover:bg-[#FAF8F5] text-[#1A3B2B] border border-[#1A3B2B] px-9 py-4 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase transition-all shadow-sm hover:shadow-md"
            >
              <span>View Complete Shop Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* The Direct Website Advantage */}
      <section className="py-16 lg:py-24 w-full max-w-[1680px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="bg-[#1A3B2B] rounded-3xl p-8 sm:p-12 lg:p-16 xl:p-20 text-white relative overflow-hidden">
          <div className="max-w-3xl relative z-10 space-y-6 lg:space-y-8">
            <span className="text-xs font-bold tracking-widest uppercase text-[#C29B38] bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20">
              Direct Website Advantage
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              Why Buying On Our Website Is Your Best Choice
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-[#D8D2C5] leading-relaxed">
              No waiting for DM replies. Get immediate order confirmation, live courier tracking, verified fabric measurements, and an instant 5% prepaid discount.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 pt-2">
              <div className="bg-[#132C20] p-5 rounded-2xl border border-[#244E39]">
                <h4 className="text-sm sm:text-base font-bold text-[#E7C875] flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>5% Instant UPI Discount</span>
                </h4>
                <p className="text-[11px] sm:text-xs text-[#A6B5AD] mt-1.5 leading-relaxed">
                  Pay via Google Pay, PhonePe or Paytm using code <strong>UPI5</strong> at checkout.
                </p>
              </div>

              <div className="bg-[#132C20] p-5 rounded-2xl border border-[#244E39]">
                <h4 className="text-sm sm:text-base font-bold text-[#E7C875] flex items-center space-x-2">
                  <Scissors className="w-4 h-4" />
                  <span>Custom Fabric Cut Guarantee</span>
                </h4>
                <p className="text-[11px] sm:text-xs text-[#A6B5AD] mt-1.5 leading-relaxed">
                  Generous 2.5m cuts so your tailor can craft any custom style up to 3XL.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center space-x-2 bg-[#C29B38] hover:bg-[#A9842A] text-white text-xs sm:text-sm font-bold px-7 py-4 rounded-xl uppercase tracking-wider transition-colors shadow-md"
              >
                <span>Browse Women&apos;s Catalog Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Trust Reviews */}
      <section className="py-16 lg:py-24 bg-[#FAF8F5] border-t border-[#E8E2D8]">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
            <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#C29B38]">
              Customer Experiences
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A3B2B] mt-2">
              Loved by Women Across India
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
                &quot;The floral tiered cotton dress fits like a dream! You can feel that the material is pure combed cotton and not synthetic polyester. Very breathable for daytime outings.&quot;
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
                &quot;The Kalyani cotton suit material was stitched into a straight cut kurti with cigarette pants by my boutique. The fabric didn&apos;t shrink after washing and colors remained crisp.&quot;
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
                &quot;The linen co-ord set is my favorite office wear outfit now. Excellent craftsmanship and the instant UPI discount made it very affordable compared to retail malls.&quot;
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
