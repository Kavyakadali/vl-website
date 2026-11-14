'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound, useRouter, useParams } from 'next/navigation';
import {
  Sparkles,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  Heart,
  Check,
  ChevronRight,
  Share2,
  Info,
  Clock,
  Scissors,
  Zap,
  MessageCircle
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { BRAND_CONFIG } from '@/config/brand';
import PincodeChecker from '@/components/PincodeChecker';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const product = INITIAL_PRODUCTS.find((p) => p.slug === slug);

  const { addToCart, toggleWishlist, isWishlisted } = useCart();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showShareNotification, setShowShareNotification] = useState(false);

  if (!product) {
    return notFound();
  }

  const selectedVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity, true);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity, false);
    router.push('/checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShowShareNotification(true);
      setTimeout(() => setShowShareNotification(false), 2000);
    }
  };

  // Related products from the same category or brand
  const relatedProducts = INITIAL_PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.productType === product.productType)
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24 lg:pb-16">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-xs text-[#5F6762] flex items-center space-x-2">
        <Link href="/" className="hover:text-[#1A3B2B]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-[#1A3B2B]">Collections</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-[#1A3B2B]">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#1C201D] font-medium truncate max-w-[200px] sm:max-w-none">
          {product.title}
        </span>
      </nav>

      {/* Main PDP Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Left Column: Image Gallery with Zoom Preview */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnail Row / Column */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[580px] shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-[#1A3B2B] shadow-md scale-102'
                      : 'border-[#E8E2D8] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main High-Res Image View */}
            <div className="flex-1 relative aspect-[3/4] rounded-2xl overflow-hidden bg-white border border-[#E8E2D8] shadow-sm group">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Wishlist floating toggle */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all ${
                  wishlisted
                    ? 'bg-[#9C3B24] text-white'
                    : 'bg-white/90 text-[#1C201D] hover:bg-white'
                }`}
                aria-label="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
              </button>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="absolute top-4 left-4 p-3 rounded-full bg-white/90 text-[#1C201D] hover:bg-white shadow-lg transition-all"
                aria-label="Share product"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {showShareNotification && (
                <div className="absolute top-16 left-4 bg-[#1A3B2B] text-white text-xs px-3 py-1.5 rounded-lg shadow-lg">
                  Link copied to clipboard!
                </div>
              )}

              {/* Brand Stamp */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-full border border-[#E8E2D8] text-[11px] font-bold text-[#1A3B2B] flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C29B38]" />
                <span>100% Genuine Loom Fabric</span>
              </div>
            </div>
          </div>

          {/* Right Column: Specifications & Purchasing Controls */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Origin & Badge Label */}
            <div className="flex items-center space-x-2">
              {product.productType === 'own_design' ? (
                <span className="inline-flex items-center space-x-1.5 bg-[#1A3B2B] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#C29B38]" />
                  <span>In-House Original Design</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1.5 bg-[#4A5568] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                  <span>Curated Collection</span>
                </span>
              )}
              <span className="text-xs text-[#C29B38] font-bold uppercase tracking-wider bg-[#FBF7EE] px-2.5 py-1 rounded-full border border-[#E8DFC9]">
                {product.fabric}
              </span>
            </div>

            {/* Title & Star Rating */}
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C201D] leading-snug">
                {product.title}
              </h1>
              
              <div className="mt-2 flex items-center space-x-3 text-xs">
                <div className="flex items-center space-x-1 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-bold text-amber-800">{product.rating}</span>
                </div>
                <span className="text-[#5F6762]">Based on {product.reviewCount} customer reviews</span>
                <span className="text-emerald-700 font-semibold">• In Stock</span>
              </div>
            </div>

            {/* Price Banner */}
            <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E8E2D8] flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-extrabold text-[#1A3B2B]">₹{product.price}</span>
                  <span className="text-sm text-neutral-400 line-through">₹{product.mrp}</span>
                  <span className="bg-[#9C3B24] text-white text-xs font-bold px-2 py-0.5 rounded">
                    {discountPercent}% OFF
                  </span>
                </div>
                <p className="text-[11px] text-[#5F6762] mt-1">
                  Inclusive of all taxes &amp; GST • <strong>Save ₹{product.mrp - product.price}</strong>
                </p>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center space-x-1 bg-[#EBF7EE] text-[#1E6B35] text-[11px] font-bold px-2.5 py-1 rounded-full border border-[#BBE3C4]">
                  <Zap className="w-3 h-3 text-emerald-600" />
                  <span>5% UPI Off with &quot;UPI5&quot;</span>
                </span>
              </div>
            </div>

            {/* Scarcity Urgency Banner */}
            {selectedVariant.stock <= 5 && (
              <div className="bg-[#FFF4E5] border border-[#FFD8A8] text-[#D9480F] text-xs font-semibold p-3 rounded-xl flex items-center space-x-2">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Hurry! Only {selectedVariant.stock} sets left in this batch.</span>
              </div>
            )}

            {/* Size / Cut Selection */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-bold text-[#1C201D] uppercase tracking-wider">
                  Select Size / Cut:
                </span>
                <span className="text-[#1A3B2B] font-semibold">{selectedVariant.size}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {product.variants.map((v, i) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantIndex(i)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-medium border text-left transition-all ${
                      selectedVariantIndex === i
                        ? 'border-[#1A3B2B] bg-[#1A3B2B] text-white shadow-sm'
                        : 'border-[#D8D2C5] bg-white text-[#1C201D] hover:border-[#1A3B2B]'
                    }`}
                  >
                    <span className="font-bold block">{v.size}</span>
                    <span className={`text-[10px] block ${selectedVariantIndex === i ? 'text-neutral-200' : 'text-[#7A8580]'}`}>
                      {v.color}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Action Buttons (Desktop) */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-white hover:bg-[#FAF8F5] text-[#1A3B2B] border-2 border-[#1A3B2B] font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full bg-[#1A3B2B] hover:bg-[#2A5A43] text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4 text-[#C29B38]" />
                  <span>Buy It Now</span>
                </button>
              </div>

              {/* Direct WhatsApp Inquiry Backup (Using BRAND_CONFIG) */}
              <a
                href={`https://wa.me/${BRAND_CONFIG.whatsappNumber}?text=Hi%20VL%20Designs,%20I%20am%20looking%20at%20${encodeURIComponent(product.title)}%20(₹${product.price})%20on%20your%20website.`}
                target="_blank"
                rel="noreferrer"
                className="w-full text-center flex items-center justify-center space-x-1.5 text-xs text-[#5F6762] hover:text-[#1A3B2B] py-1 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Questions about fabric cut or sizing? <u>Ask directly on WhatsApp</u></span>
              </a>
            </div>

            {/* Instant Pincode Checker Component */}
            <PincodeChecker />

            {/* Fabric & Measurements Technical Table (Reenatex Model) */}
            <div className="bg-white rounded-2xl border border-[#E8E2D8] p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A3B2B] mb-3 flex items-center space-x-1.5">
                <Scissors className="w-4 h-4 text-[#C29B38]" />
                <span>Fabric &amp; Measurement Specifications</span>
              </h3>
              
              <div className="divide-y divide-[#E8E2D8] text-xs">
                {product.fabricDetails.topCut && (
                  <div className="py-2 flex justify-between">
                    <span className="text-[#5F6762]">Top / Kurti Cut</span>
                    <span className="font-semibold text-[#1C201D] text-right">{product.fabricDetails.topCut}</span>
                  </div>
                )}
                {product.fabricDetails.bottomCut && (
                  <div className="py-2 flex justify-between">
                    <span className="text-[#5F6762]">Bottom / Salwar Cut</span>
                    <span className="font-semibold text-[#1C201D] text-right">{product.fabricDetails.bottomCut}</span>
                  </div>
                )}
                {product.fabricDetails.dupattaCut && (
                  <div className="py-2 flex justify-between">
                    <span className="text-[#5F6762]">Dupatta Length</span>
                    <span className="font-semibold text-[#1C201D] text-right">{product.fabricDetails.dupattaCut}</span>
                  </div>
                )}
                <div className="py-2 flex justify-between">
                  <span className="text-[#5F6762]">Material Composition</span>
                  <span className="font-semibold text-[#1C201D] text-right">{product.fabricDetails.material}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#5F6762]">Weave Finish</span>
                  <span className="font-semibold text-[#1C201D] text-right">{product.fabricDetails.weave}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#5F6762]">Wash &amp; Care</span>
                  <span className="font-semibold text-[#1C201D] text-right">{product.fabricDetails.care}</span>
                </div>
              </div>
            </div>

            {/* Description & Styling Tips */}
            <div className="bg-white rounded-2xl border border-[#E8E2D8] p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A3B2B] mb-2">
                Designer Notes
              </h3>
              <p className="text-xs text-[#5F6762] leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Related Designs Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#E8E2D8]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold tracking-widest uppercase text-[#C29B38]">
                  Complete The Collection
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A3B2B] mt-1">
                  You May Also Admire
                </h2>
              </div>
              <Link href="/shop" className="text-xs font-bold text-[#1A3B2B] hover:underline">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Persistent Mobile Bottom Action Bar (Reenatex Style) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E8E2D8] p-3 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <span className="text-xs text-neutral-400 line-through">₹{product.mrp}</span>
          <div className="text-lg font-black text-[#1A3B2B] leading-none">
            ₹{product.price}
          </div>
        </div>

        <div className="flex gap-2 flex-1">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-white border border-[#1A3B2B] text-[#1A3B2B] py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase"
          >
            Add to Bag
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 bg-[#1A3B2B] text-white py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase shadow-md"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
