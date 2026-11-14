'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Heart, Search, Menu, X, Sparkles, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { INITIAL_PRODUCTS } from '@/data/products';

export default function Header() {
  const router = useRouter();
  const { totalItems, openCart, wishlist } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = searchQuery.trim()
    ? INITIAL_PRODUCTS.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.fabric.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      {/* Top Announcement Bar */}
      <aside aria-label="Store Announcements" className="bg-[#1A3B2B] text-[#FAF8F5] text-xs py-2 px-4 border-b border-[#2A5A43]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C29B38] animate-pulse"></span>
            <p className="font-medium tracking-wide">
              Direct from Loom to Wardrobe: <span className="text-[#E7C875]">100% Pure Natural Cottons</span>
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-[11px] text-[#D8D2C5]">
            <span>✨ Free Express Shipping across India &gt; ₹999</span>
            <span>⚡ 5% Instant UPI Discount: Code <strong className="text-white">UPI5</strong></span>
            <Link href="/admin" className="text-[#C29B38] hover:underline font-semibold">Store Admin</Link>
          </div>
        </div>
      </aside>

      {/* Main Header */}
      <header className="sticky top-0 z-40 glass-header border-b border-[#E8E2D8] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#1C201D] hover:text-[#1A3B2B]"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex flex-col items-center sm:items-start group">
                <span className="font-serif text-2xl sm:text-3xl tracking-widest font-bold text-[#1A3B2B] group-hover:text-[#2A5A43] transition-colors">
                  VL DESIGNS
                </span>
                <span className="text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-[#C29B38] font-semibold -mt-1">
                  for you • Handcrafted
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#1C201D]">
              <Link href="/" className="hover:text-[#1A3B2B] transition-colors">
                Home
              </Link>
              <Link href="/shop" className="hover:text-[#1A3B2B] transition-colors">
                All Collections
              </Link>
              <Link 
                href="/shop?type=own_design" 
                className="flex items-center space-x-1 text-[#1A3B2B] font-semibold hover:text-[#C29B38] transition-colors bg-[#FBF7EE] px-3 py-1 rounded-full border border-[#E8DFC9]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C29B38]" />
                <span>Our Own Designs</span>
              </Link>
              <Link href="/shop?type=resold" className="hover:text-[#1A3B2B] transition-colors text-[#5F6762]">
                Curated Resale
              </Link>
              <Link href="/shop?category=Unstitched+Suit+Material" className="hover:text-[#1A3B2B] transition-colors">
                Suit Materials
              </Link>
              <Link href="/shop?category=Cotton+Sarees" className="hover:text-[#1A3B2B] transition-colors">
                Cotton Sarees
              </Link>
            </nav>

            {/* Header Action Icons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 text-[#1C201D] hover:text-[#1A3B2B] hover:bg-[#F2ECE1] rounded-full transition-colors"
                aria-label="Search clothing and fabrics"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Link */}
              <Link
                href="/shop?filter=wishlist"
                className="relative p-2.5 text-[#1C201D] hover:text-[#1A3B2B] hover:bg-[#F2ECE1] rounded-full transition-colors"
                aria-label="View wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 bg-[#C29B38] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={openCart}
                className="relative flex items-center space-x-2 bg-[#1A3B2B] text-white px-3.5 py-2 rounded-full hover:bg-[#2A5A43] transition-all shadow-sm"
                aria-label="Open shopping cart"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline text-xs font-semibold">Bag</span>
                <span className="bg-[#C29B38] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {totalItems}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FAF8F5] border-b border-[#E8E2D8] px-4 pt-3 pb-6 space-y-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-[#1C201D] border-b border-[#E8E2D8]"
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-[#1C201D] border-b border-[#E8E2D8]"
            >
              All Collections
            </Link>
            <Link
              href="/shop?type=own_design"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 text-base font-semibold text-[#1A3B2B] bg-[#FBF7EE] px-3 rounded-lg border border-[#E8DFC9]"
            >
              <span className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#C29B38]" />
                <span>Our Own Designs (Pure Loom)</span>
              </span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/shop?type=resold"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-[#5F6762] border-b border-[#E8E2D8]"
            >
              Curated Resale Trends
            </Link>
            <Link
              href="/shop?category=Unstitched+Suit+Material"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-[#1C201D] border-b border-[#E8E2D8]"
            >
              Suit Materials & Cuts
            </Link>
            <Link
              href="/shop?category=Cotton+Sarees"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-[#1C201D] border-b border-[#E8E2D8]"
            >
              Traditional Cotton Sarees
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-[#C29B38]"
            >
              ⚙️ Store Admin Portal
            </Link>
          </div>
        )}
      </header>

      {/* Interactive Search Overlay Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#E8E2D8] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
              <div className="flex items-center space-x-3 w-full">
                <Search className="w-6 h-6 text-[#1A3B2B]" />
                <input
                  type="text"
                  placeholder="Search pure cotton suits, sarees, linen, fabrics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full text-lg outline-none text-[#1C201D] placeholder:text-[#9BA19D]"
                />
              </div>
              <button
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                className="p-1.5 text-[#5F6762] hover:text-[#1C201D] rounded-full hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Search Quick Results */}
            <div className="mt-4 max-h-96 overflow-y-auto">
              {searchQuery.trim() === '' ? (
                <div className="py-6 text-center text-sm text-[#5F6762]">
                  <p className="font-semibold text-[#1C201D] mb-2">Popular Searches:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['Kalyani Cotton', 'Unstitched Suit Set', 'Cham Cham Saree', 'Pure Linen', 'In-House Designs'].map((term) => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="text-xs bg-[#FAF8F5] border border-[#E8E2D8] px-3 py-1.5 rounded-full hover:border-[#1A3B2B] hover:text-[#1A3B2B]"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="divide-y divide-[#E8E2D8]">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery('');
                        router.push(`/product/${product.slug}`);
                      }}
                      className="py-3 flex items-center justify-between hover:bg-[#FAF8F5] px-2 rounded-lg cursor-pointer transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-12 h-14 object-cover rounded-md border border-[#E8E2D8]"
                        />
                        <div>
                          <p className="text-sm font-semibold text-[#1C201D]">{product.title}</p>
                          <p className="text-xs text-[#5F6762]">{product.fabric} • {product.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-[#1A3B2B]">₹{product.price}</span>
                        <span className="block text-[11px] text-neutral-400 line-through">₹{product.mrp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-[#5F6762]">
                  No matching designs or fabrics found for &quot;{searchQuery}&quot;. Try &quot;cotton&quot; or &quot;suit&quot;.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
