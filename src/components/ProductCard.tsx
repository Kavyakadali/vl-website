'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Star, Sparkles, ShoppingBag, Eye } from 'lucide-react';
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

  // default variant is first variant
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
      className="group relative bg-white rounded-xl border border-[#E8E2D8] overflow-hidden card-hover-effect flex flex-col justify-between"
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
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {product.productType === 'own_design' ? (
              <span className="inline-flex items-center space-x-1 bg-[#1A3B2B] text-[#FAF8F5] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                <Sparkles className="w-3 h-3 text-[#C29B38]" />
                <span>Our Design</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 bg-[#4A5568] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                <span>Curated</span>
              </span>
            )}

            {product.badge && product.badge !== 'VL Original Design' && (
              <span className="inline-block bg-[#FBF7EE] text-[#1A3B2B] border border-[#E8DFC9] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                {product.badge}
              </span>
            )}
          </div>

          {/* Discount Pill */}
          {discountPercent > 0 && (
            <span className="absolute top-2.5 right-2.5 bg-[#9C3B24] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
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
            className={`absolute bottom-3 right-3 p-2 rounded-full shadow-md transition-all z-10 ${
              wishlisted
                ? 'bg-[#9C3B24] text-white'
                : 'bg-white/90 text-[#1C201D] hover:bg-white hover:text-[#9C3B24]'
            }`}
            aria-label="Add to Wishlist"
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Product Details */}
        <div className="p-4">
          {/* Category & Fabric tag */}
          <div className="flex items-center justify-between text-[11px] text-[#5F6762] mb-1">
            <span className="font-medium text-[#C29B38] uppercase tracking-wider">
              {product.fabric}
            </span>
            <div className="flex items-center space-x-1 text-amber-500 font-semibold">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.rating}</span>
              <span className="text-neutral-400 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-[#1C201D] line-clamp-2 hover:text-[#1A3B2B] transition-colors leading-snug">
            <Link href={`/product/${product.slug}`}>
              {product.title}
            </Link>
          </h3>

          {/* Price Breakdown */}
          <div className="mt-2.5 flex items-baseline space-x-2">
            <span className="text-base font-bold text-[#1A3B2B]">₹{product.price}</span>
            <span className="text-xs text-neutral-400 line-through">₹{product.mrp}</span>
            <span className="text-[11px] font-semibold text-[#9C3B24]">
              Save ₹{product.mrp - product.price}
            </span>
          </div>

          {/* Cut & Specs indicator */}
          {product.fabricDetails.topCut && (
            <p className="mt-1.5 text-[11px] text-[#78827C] truncate">
              Cut: {product.fabricDetails.topCut.split(' ')[0]} {product.fabricDetails.topCut.split(' ')[1]}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons: Quick Add & Buy Now */}
      <div className="px-4 pb-4 pt-1 grid grid-cols-2 gap-2">
        <button
          onClick={handleQuickAdd}
          className="w-full flex items-center justify-center space-x-1.5 py-2 px-2.5 text-xs font-semibold rounded-lg border border-[#1A3B2B] text-[#1A3B2B] hover:bg-[#1A3B2B] hover:text-white transition-colors"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add to Bag</span>
        </button>

        <button
          onClick={handleBuyNow}
          className="w-full flex items-center justify-center space-x-1 py-2 px-2.5 text-xs font-bold rounded-lg bg-[#C29B38] text-white hover:bg-[#A9842A] transition-colors shadow-sm"
        >
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
}
