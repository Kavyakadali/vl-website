'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  Truck,
  Zap,
  Settings,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { INITIAL_PRODUCTS } from '@/data/products';
import { BRAND_CONFIG } from '@/config/brand';

function HeaderContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { totalItems, openCart, wishlist } = useCart();
  const { user, isAuthenticated, isAdmin, openAuthModal, logout } = useAuth();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Active route/tab tracking to give customer crystal-clear visual feedback
  const currentType = searchParams.get('type');
  const currentCategory = searchParams.get('category');
  const currentFilter = searchParams.get('filter');

  const isHomeActive = pathname === '/';
  const isAllCollectionsActive = pathname === '/shop' && !currentType && !currentCategory && !currentFilter;
  const isOurDesignsActive = pathname === '/shop' && currentType === 'own_design';
  const isDressesActive = pathname === '/shop' && currentCategory === 'Kurtis & Sets';
  const isSuitsActive = pathname === '/shop' && currentCategory === 'Unstitched Suit Material';
  const isCuratedActive = pathname === '/shop' && currentType === 'resold';
  const isWishlistActive = pathname === '/shop' && currentFilter === 'wishlist';

  const searchResults = searchQuery.trim()
    ? INITIAL_PRODUCTS.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.fabric.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      {/* Top Announcement Bar - Pixel-Perfect Alignment */}
      <aside aria-label="Store Announcements" className="bg-[#1A3B2B] text-[#FAF8F5] text-xs py-2 border-b border-[#2A5A43]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#C29B38] animate-pulse"></span>
            <p className="font-medium text-[11px] sm:text-xs">
              Handpicked Loom Fabrics Styled into <span className="text-[#E7C875] font-semibold">Women&apos;s Signature Outfits</span>
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-[11px] text-[#D8D2C5]">
            <span className="flex items-center space-x-1.5">
              <Truck className="w-3.5 h-3.5 text-[#C29B38]" />
              <span>Free Delivery &gt; ₹{BRAND_CONFIG.freeShippingThreshold}</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-[#E7C875]" />
              <span>5% Off on UPI (Code: <strong className="text-white">UPI5</strong>)</span>
            </span>
            
            {isAdmin ? (
              <Link href="/admin" className="text-[#E7C875] hover:underline font-bold flex items-center space-x-1">
                <Settings className="w-3 h-3" />
                <span>Admin Portal</span>
              </Link>
            ) : (
              <button
                onClick={() => openAuthModal('admin')}
                className="text-[#C29B38] hover:underline font-semibold flex items-center space-x-1 cursor-pointer"
              >
                <Settings className="w-3 h-3" />
                <span>Admin Login</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Header Navbar - Active Route Highlighting, Zero Overlap */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5] border-b border-[#E8E2D8] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-3 sm:gap-6">
            
            {/* Left: Mobile Menu Toggle + Brand Logo + Seamless Desktop Nav */}
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 xl:gap-8 shrink-0">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 -ml-2 text-[#1C201D] hover:text-[#1A3B2B] rounded-lg transition-colors lg:hidden"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <Link href="/" className="flex items-center space-x-3 shrink-0 group">
                <div className="w-10 h-10 rounded-xl bg-[#1A3B2B] text-[#E7C875] flex items-center justify-center font-serif text-xl font-black shadow-md border border-[#2A5A43] group-hover:scale-105 transition-transform">
                  VL
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-xl sm:text-2xl font-black tracking-wider text-[#1A3B2B] group-hover:text-[#2A5A43] transition-colors leading-tight whitespace-nowrap">
                    VL DESIGNS
                  </span>
                  <span className="text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-[#C29B38] font-bold -mt-0.5 whitespace-nowrap">
                    for you • Women&apos;s Fashion
                  </span>
                </div>
              </Link>

              {/* Elegant Accent Divider */}
              <div className="hidden xl:block h-6 w-px bg-[#E8E2D8]" />

              {/* Primary Navigation Links with Clear Active Tab Highlighting */}
              <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-xs xl:text-[13px] font-semibold whitespace-nowrap">
                {/* Home */}
                <Link
                  href="/"
                  className={`relative py-1.5 transition-colors ${
                    isHomeActive ? 'text-[#1A3B2B] font-bold' : 'text-[#5F6762] hover:text-[#1A3B2B]'
                  }`}
                >
                  <span>Home</span>
                  {isHomeActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#C29B38] rounded-full animate-in fade-in duration-200" />
                  )}
                </Link>
                
                {/* All Collections */}
                <Link
                  href="/shop"
                  className={`relative py-1.5 transition-colors ${
                    isAllCollectionsActive ? 'text-[#1A3B2B] font-bold' : 'text-[#5F6762] hover:text-[#1A3B2B]'
                  }`}
                >
                  <span>All Collections</span>
                  {isAllCollectionsActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#C29B38] rounded-full animate-in fade-in duration-200" />
                  )}
                </Link>

                {/* Our Designs - Special Badge with Active State */}
                <Link 
                  href="/shop?type=own_design" 
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-full transition-all ${
                    isOurDesignsActive
                      ? 'bg-[#1A3B2B] text-[#E7C875] border border-[#1A3B2B] shadow-sm font-bold ring-2 ring-[#C29B38]/30'
                      : 'text-[#1A3B2B] hover:text-[#C29B38] bg-[#FBF7EE] border border-[#E8DFC9] shadow-xs hover:border-[#C29B38]'
                  }`}
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isOurDesignsActive ? 'text-[#E7C875]' : 'text-[#C29B38]'}`} />
                  <span>Our Designs</span>
                </Link>

                {/* Dresses & Co-Ords */}
                <Link
                  href="/shop?category=Kurtis+%26+Sets"
                  className={`relative py-1.5 transition-colors ${
                    isDressesActive ? 'text-[#1A3B2B] font-bold' : 'text-[#5F6762] hover:text-[#1A3B2B]'
                  }`}
                >
                  <span>Dresses &amp; Co-Ords</span>
                  {isDressesActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#C29B38] rounded-full animate-in fade-in duration-200" />
                  )}
                </Link>

                {/* Suit Materials */}
                <Link
                  href="/shop?category=Unstitched+Suit+Material"
                  className={`relative py-1.5 transition-colors ${
                    isSuitsActive ? 'text-[#1A3B2B] font-bold' : 'text-[#5F6762] hover:text-[#1A3B2B]'
                  }`}
                >
                  <span>Suit Materials</span>
                  {isSuitsActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#C29B38] rounded-full animate-in fade-in duration-200" />
                  )}
                </Link>

                {/* Curated Trends */}
                <Link
                  href="/shop?type=resold"
                  className={`relative py-1.5 transition-colors ${
                    isCuratedActive ? 'text-[#1A3B2B] font-bold' : 'text-[#5F6762] hover:text-[#1A3B2B]'
                  }`}
                >
                  <span>Curated Trends</span>
                  {isCuratedActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#C29B38] rounded-full animate-in fade-in duration-200" />
                  )}
                </Link>
              </nav>
            </div>

            {/* Right: Actions (Search, Wishlist, User Account, Cart Bag) - Anchored cleanly */}
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-[#1C201D] hover:text-[#1A3B2B] hover:bg-[#F2ECE1] rounded-full transition-colors"
                aria-label="Search clothing and fabrics"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Link - Shows active highlight when on /shop?filter=wishlist */}
              <Link
                href="/shop?filter=wishlist"
                className={`relative p-2 rounded-full transition-colors ${
                  isWishlistActive
                    ? 'text-[#C29B38] bg-[#FBF7EE] border border-[#E8DFC9] shadow-xs'
                    : 'text-[#1C201D] hover:text-[#1A3B2B] hover:bg-[#F2ECE1]'
                }`}
                aria-label="View wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlistActive ? 'fill-[#C29B38] text-[#C29B38]' : ''}`} />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 bg-[#C29B38] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* User Account Dropdown */}
              <div className="relative">
                {isAuthenticated && user ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className={`flex items-center space-x-1.5 py-1.5 px-2.5 sm:px-3 rounded-full text-xs font-bold transition-all border shadow-xs ${
                        isAdmin
                          ? 'bg-rose-50 border-rose-300 text-rose-900 hover:bg-rose-100'
                          : 'bg-[#FBF7EE] border-[#E8DFC9] text-[#1A3B2B] hover:border-[#C29B38]'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-[#1A3B2B] text-[#E7C875] flex items-center justify-center text-[10px] font-black">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden md:inline max-w-[70px] truncate">
                        {user.name.split(' ')[0]}
                      </span>
                    </button>

                    {userMenuOpen && (
                      <div 
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-[#E8E2D8] p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <div className="p-3 border-b border-[#E8E2D8]">
                          <p className="text-xs font-bold text-[#1C201D] truncate">{user.name}</p>
                          <p className="text-[11px] text-[#5F6762] truncate">@{user.username}</p>
                          <span className={`inline-block mt-1 text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            isAdmin ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {isAdmin ? '👑 Store Admin' : '👤 Boutique Customer'}
                          </span>
                        </div>

                        <div className="py-1">
                          {isAdmin ? (
                            <Link
                              href="/admin"
                              className="flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-[#1C201D] hover:bg-[#FAF8F5] rounded-xl"
                            >
                              <Settings className="w-4 h-4 text-[#C29B38]" />
                              <span>Store Admin Portal</span>
                            </Link>
                          ) : (
                            <Link
                              href="/account"
                              className="flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-[#1C201D] hover:bg-[#FAF8F5] rounded-xl"
                            >
                              <UserIcon className="w-4 h-4 text-[#C29B38]" />
                              <span>My Account &amp; Orders</span>
                            </Link>
                          )}

                          <Link
                            href="/shop?filter=wishlist"
                            className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-[#1C201D] hover:bg-[#FAF8F5] rounded-xl"
                          >
                            <span className="flex items-center space-x-2">
                              <Heart className="w-4 h-4 text-[#C29B38]" />
                              <span>My Wishlist</span>
                            </span>
                            <span className="text-[10px] bg-[#FAF8F5] border border-[#E8E2D8] px-1.5 py-0.5 rounded-full">
                              {wishlist.length}
                            </span>
                          </Link>
                        </div>

                        <div className="pt-1 border-t border-[#E8E2D8]">
                          <button
                            onClick={logout}
                            className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-[#9C3B24] hover:bg-rose-50 rounded-xl text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => openAuthModal('customer')}
                    className="flex items-center space-x-1.5 py-1.5 px-3 rounded-full text-xs font-bold text-[#1A3B2B] bg-[#FBF7EE] border border-[#E8DFC9] hover:border-[#C29B38] transition-colors shadow-xs"
                    aria-label="Sign in to your account"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-[#C29B38]" />
                    <span className="hidden sm:inline">Sign In</span>
                  </button>
                )}
              </div>

              {/* Cart Drawer Trigger */}
              <button
                onClick={openCart}
                className="relative flex items-center space-x-2 bg-[#1A3B2B] text-white px-3.5 py-2 rounded-full hover:bg-[#2A5A43] transition-all shadow-md group whitespace-nowrap"
                aria-label="Open shopping cart"
              >
                <ShoppingBag className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline text-xs font-semibold">Bag</span>
                <span className="bg-[#C29B38] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {totalItems}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer with Active Route Highlighting & User Info */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF8F5] border-b border-[#E8E2D8] px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
            {/* Mobile Account Card */}
            <div className="bg-white p-3 rounded-2xl border border-[#E8E2D8] mb-3 flex items-center justify-between">
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-[#1A3B2B] text-[#E7C875] flex items-center justify-center font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1C201D]">{user.name}</p>
                    <p className="text-[10px] text-[#5F6762]">@{user.username} • {user.role === 'admin' ? 'Store Admin' : 'Customer'}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-xs">
                  <UserIcon className="w-4 h-4 text-[#C29B38]" />
                  <span className="font-semibold text-[#1C201D]">Guest Shopper</span>
                </div>
              )}

              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Link
                    href={isAdmin ? '/admin' : '/account'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[11px] font-bold text-[#1A3B2B] bg-[#FBF7EE] border border-[#E8DFC9] px-2.5 py-1 rounded-lg"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="text-[11px] font-bold text-rose-700 hover:underline"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { openAuthModal('customer'); setMobileMenuOpen(false); }}
                  className="bg-[#1A3B2B] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xs"
                >
                  Sign In
                </button>
              )}
            </div>

            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors ${
                isHomeActive ? 'bg-[#1A3B2B] text-white' : 'text-[#1C201D] hover:bg-neutral-100'
              }`}
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors ${
                isAllCollectionsActive ? 'bg-[#1A3B2B] text-white' : 'text-[#1C201D] hover:bg-neutral-100'
              }`}
            >
              All Collections
            </Link>
            <Link
              href="/shop?type=own_design"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between py-2.5 px-3.5 rounded-xl border transition-colors ${
                isOurDesignsActive
                  ? 'bg-[#1A3B2B] text-white border-[#1A3B2B] font-bold'
                  : 'text-[#1A3B2B] bg-[#FBF7EE] border-[#E8DFC9] font-semibold'
              }`}
            >
              <span className="flex items-center space-x-2">
                <Sparkles className={`w-4 h-4 ${isOurDesignsActive ? 'text-[#E7C875]' : 'text-[#C29B38]'}`} />
                <span>Our Designed Outfits</span>
              </span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/shop?category=Kurtis+%26+Sets"
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors ${
                isDressesActive ? 'bg-[#1A3B2B] text-white' : 'text-[#1C201D] hover:bg-neutral-100'
              }`}
            >
              Women&apos;s Dresses &amp; Co-Ords
            </Link>
            <Link
              href="/shop?category=Unstitched+Suit+Material"
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors ${
                isSuitsActive ? 'bg-[#1A3B2B] text-white' : 'text-[#1C201D] hover:bg-neutral-100'
              }`}
            >
              Suit Materials &amp; Cuts
            </Link>
            <Link
              href="/shop?category=Cotton+Sarees"
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors ${
                pathname === '/shop' && currentCategory === 'Cotton Sarees'
                  ? 'bg-[#1A3B2B] text-white'
                  : 'text-[#1C201D] hover:bg-neutral-100'
              }`}
            >
              Traditional Cotton Sarees
            </Link>
            <Link
              href="/shop?type=resold"
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors ${
                isCuratedActive ? 'bg-[#1A3B2B] text-white' : 'text-[#5F6762] hover:bg-neutral-100'
              }`}
            >
              Curated Trends
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-1.5 py-2.5 px-3 text-sm font-semibold text-[#C29B38] hover:bg-[#FBF7EE] rounded-xl"
              >
                <Settings className="w-4 h-4" />
                <span>Store Admin Portal</span>
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Interactive Search Overlay Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#E8E2D8] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
              <div className="flex items-center space-x-3 w-full">
                <Search className="w-6 h-6 text-[#1A3B2B]" />
                <input
                  type="text"
                  placeholder="Search dresses, cotton suits, co-ords, sarees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full text-base outline-none text-[#1C201D] placeholder:text-[#9BA19D]"
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
                <div className="py-6 text-center text-xs text-[#5F6762]">
                  <p className="font-semibold text-[#1C201D] mb-2">Popular Searches:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['Tiered Maxi Dress', 'Cotton Co-Ord Set', 'Kalyani Suit', 'Cham Cham Saree', 'Our Designs'].map((term) => (
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
                <div className="py-8 text-center text-xs text-[#5F6762]">
                  No matching designs found for &quot;{searchQuery}&quot;. Try &quot;dress&quot; or &quot;cotton&quot;.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function Header() {
  return (
    <Suspense fallback={
      <header className="sticky top-0 z-40 bg-[#FAF8F5] border-b border-[#E8E2D8] h-20 shadow-xs" />
    }>
      <HeaderContent />
    </Suspense>
  );
}
