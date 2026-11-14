'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Star, Sparkles, ShoppingBag, Layers, Scissors, ArrowUpRight } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const wishlisted = isWishlisted(product.id);

  const defaultVariant = product.variants[0] || {
    id: `${product.id}-default`,
    size: 'Standard',
    color: 'Standard',
    colorHex: '#000',
    stock: 10,
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, defaultVariant, 1, true);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, defaultVariant, 1, false);
    router.push('/checkout');
  };

  return (
    <div
      className="group relative bg-white rounded-2xl border border-[#E8E2D8] overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        {/* Product Image Area */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F2ECE1]">
          <Link href={`/product/${product.slug}`} className="block w-full h-full">
            <img
              src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105"
            />
          </Link>

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.productType === 'own_design' ? (
              <span className="inline-flex items-center space-x-1.5 bg-[#1A3B2B] text-[#FAF8F5] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md backdrop-blur-xs">
                <Scissors className="w-3 h-3 text-[#C29B38]" />
                <span>VL Designed</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1.5 bg-[#3B4856] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                <Layers className="w-3 h-3 text-neutral-300" />
                <span>Curated Trend</span>
              </span>
            )}
          </div>

          {/* Discount Pill */}
          {discountPercent > 0 && (
            <span className="absolute top-3 right-3 bg-[#9C3B24] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
              {discountPercent}% OFF
            </span>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`absolute bottom-3 right-3 p-2.5 rounded-full shadow-lg transition-all duration-200 z-10 ${
              wishlisted
                ? 'bg-[#9C3B24] text-white scale-110'
                : 'bg-white/90 text-[#1C201D] hover:bg-white hover:text-[#9C3B24]'
            }`}
            aria-label="Add to Wishlist"
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Product Details */}
        <div className="p-4 sm:p-5">
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] text-[#5F6762] mb-1.5">
            <span className="font-semibold text-[#C29B38] uppercase tracking-wider">
              {product.fabric}
            </span>
            <div className="flex items-center space-x-1 text-amber-500 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.rating}</span>
              <span className="text-neutral-400 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-[#1C201D] line-clamp-2 hover:text-[#1A3B2B] transition-colors leading-snug">
            <Link href={`/product/${product.slug}`} className="flex items-start justify-between">
              <span>{product.title}</span>
            </Link>
          </h3>

          {/* Price Breakdown */}
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-lg font-black text-[#1A3B2B]">₹{product.price}</span>
            <span className="text-xs text-neutral-400 line-through">₹{product.mrp}</span>
            <span className="text-[11px] font-semibold text-[#9C3B24]">
              Save ₹{product.mrp - product.price}
            </span>
          </div>

          {/* Sizing description */}
          <p className="mt-1 text-[11px] text-[#78827C] truncate">
            {product.fabricDetails.topCut ? `Cut: ${product.fabricDetails.topCut}` : `Sizes: S, M, L, XL`}
          </p>
        </div>
      </div>

      {/* Action Buttons: Quick Add & Buy Now */}
      <div className="px-3.5 pb-4 sm:px-4 sm:pb-4.5 pt-0 flex items-center gap-2">
        <button
          onClick={handleQuickAdd}
          className="flex-1 min-w-0 flex items-center justify-center space-x-1.5 py-2.5 px-2.5 text-xs font-bold rounded-xl border border-[#1A3B2B] text-[#1A3B2B] hover:bg-[#1A3B2B] hover:text-white transition-colors whitespace-nowrap"
          title="Add to Shopping Bag"
        >
          <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Add to Bag</span>
        </button>

        <button
          onClick={handleBuyNow}
          className="flex-1 min-w-0 flex items-center justify-center space-x-1 py-2.5 px-2.5 text-xs font-bold rounded-xl bg-[#C29B38] text-white hover:bg-[#A9842A] transition-colors shadow-xs whitespace-nowrap"
        >
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
}
