'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, SlidersHorizontal, Sparkles, X, ChevronDown, Check, Loader2 } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { INITIAL_PRODUCTS } from '@/data/products';
import { Product, ProductType } from '@/types';
import { useCart } from '@/context/CartContext';
import { fetchProductsFromApi } from '@/services/api';

function ShopContent() {
  const { wishlist } = useCart();
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') as ProductType | null;
  const initialCategory = searchParams.get('category');
  const initialFilter = searchParams.get('filter');

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string>(initialType || 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [isWishlistOnly, setIsWishlistOnly] = useState<boolean>(initialFilter === 'wishlist');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(3500);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch original data from backend DB with fallback to INITIAL_PRODUCTS
  useEffect(() => {
    setIsLoading(true);
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
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Sync state whenever URL query params change (from navbar clicks or browser navigation)
  useEffect(() => {
    const typeParam = searchParams.get('type') as ProductType | null;
    const catParam = searchParams.get('category');
    const filterParam = searchParams.get('filter');

    setSelectedType(typeParam || 'all');
    setSelectedCategory(catParam || 'all');
    setIsWishlistOnly(filterParam === 'wishlist');
  }, [searchParams]);

  const categories = [
    'All Categories',
    'Unstitched Suit Material',
    'Cotton Sarees',
    'Kurtis & Sets',
    'Linen Essentials',
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Wishlist filter
      if (isWishlistOnly && !wishlist.includes(product.id)) {
        return false;
      }
      // Type filter
      if (selectedType !== 'all' && product.productType !== selectedType) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && selectedCategory !== 'All Categories' && product.category !== selectedCategory) {
        return false;
      }
      // Price filter
      if (product.price > maxPrice) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // default featured
    });
  }, [products, selectedType, selectedCategory, isWishlistOnly, wishlist, maxPrice, sortBy]);

  const resetFilters = () => {
    setSelectedType('all');
    setSelectedCategory('all');
    setIsWishlistOnly(false);
    setMaxPrice(3500);
    setSortBy('featured');
  };

  // Dynamic titles to give clear customer feedback on active view
  let pageTitle = "All Collections";
  let pageSubtitle = `Showing ${filteredProducts.length} handcrafted pieces and curated selections`;

  if (isWishlistOnly) {
    pageTitle = "My Saved Wishlist";
    pageSubtitle = `Showing ${filteredProducts.length} items you loved and saved for later`;
  } else if (selectedType === 'own_design') {
    pageTitle = "In-House Handcrafted Outfits";
    pageSubtitle = `Showing ${filteredProducts.length} original pieces designed and tailored by VL Studio`;
  } else if (selectedType === 'resold') {
    pageTitle = "Curated Trends";
    pageSubtitle = `Showing ${filteredProducts.length} handpicked trending cuts and loom materials`;
  } else if (selectedCategory === 'Kurtis & Sets') {
    pageTitle = "Dresses & Co-Ords";
    pageSubtitle = `Showing ${filteredProducts.length} breathable tiered dresses and daily wear sets`;
  } else if (selectedCategory === 'Unstitched Suit Material') {
    pageTitle = "Unstitched Suit Materials";
    pageSubtitle = `Showing ${filteredProducts.length} pure Kalyani cotton sets with Mal Mal dupatta`;
  } else if (selectedCategory === 'Cotton Sarees') {
    pageTitle = "Traditional Cotton Sarees";
    pageSubtitle = `Showing ${filteredProducts.length} temple border and Cham Cham cotton sarees`;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 sm:py-12">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Page Header */}
        <div className="border-b border-[#E8E2D8] pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-[#C29B38] font-bold tracking-widest uppercase mb-1">
              <span>VL Catalog</span>
              <span>•</span>
              <span>Authentic Indian Weaves</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A3B2B]">
              {pageTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#5F6762] mt-1">
              {pageSubtitle}
            </p>
          </div>

          {/* Sort selector & Mobile filter toggle */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden flex items-center space-x-2 bg-white border border-[#D8D2C5] px-4 py-2 rounded-xl text-xs font-semibold text-[#1C201D]"
            >
              <Filter className="w-4 h-4 text-[#1A3B2B]" />
              <span>Filters</span>
            </button>

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-[#5F6762] hidden sm:inline">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-[#D8D2C5] rounded-xl px-3 py-2 text-xs font-medium text-[#1C201D] outline-none focus:border-[#1A3B2B]"
              >
                <option value="featured">Featured Collections</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden md:block bg-white p-6 rounded-2xl border border-[#E8E2D8] shadow-xs space-y-6 sticky top-24">
            <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
              <h3 className="text-sm font-bold text-[#1C201D] flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-[#1A3B2B]" />
                <span>Filter By</span>
              </h3>
              {(selectedType !== 'all' || selectedCategory !== 'all' || maxPrice < 3500) && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-[#9C3B24] hover:underline font-semibold"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Collection Type Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#7D8882] mb-3">
                Design Origin
              </h4>
              <div className="space-y-2 text-xs">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    checked={selectedType === 'all'}
                    onChange={() => setSelectedType('all')}
                    className="accent-[#1A3B2B]"
                  />
                  <span>All Pieces ({INITIAL_PRODUCTS.length})</span>
                </label>

                <label className="flex items-center space-x-2.5 cursor-pointer text-[#1A3B2B] font-semibold">
                  <input
                    type="radio"
                    name="type"
                    checked={selectedType === 'own_design'}
                    onChange={() => setSelectedType('own_design')}
                    className="accent-[#1A3B2B]"
                  />
                  <span className="flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#C29B38]" />
                    <span>In-House Handcrafted</span>
                  </span>
                </label>

                <label className="flex items-center space-x-2.5 cursor-pointer text-[#5F6762]">
                  <input
                    type="radio"
                    name="type"
                    checked={selectedType === 'resold'}
                    onChange={() => setSelectedType('resold')}
                    className="accent-[#1A3B2B]"
                  />
                  <span>Curated Resale Trends</span>
                </label>
              </div>
            </div>

            {/* Category Filter */}
            <div className="pt-4 border-t border-[#E8E2D8]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#7D8882] mb-3">
                Product Category
              </h4>
              <div className="space-y-2 text-xs">
                {categories.map((cat) => {
                  const val = cat === 'All Categories' ? 'all' : cat;
                  return (
                    <label key={cat} className="flex items-center space-x-2.5 cursor-pointer text-[#1C201D]">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === val}
                        onChange={() => setSelectedCategory(val)}
                        className="accent-[#1A3B2B]"
                      />
                      <span>{cat}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Max Price Slider */}
            <div className="pt-4 border-t border-[#E8E2D8]">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7D8882]">
                  Max Price
                </h4>
                <span className="text-xs font-bold text-[#1A3B2B]">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="3500"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#1A3B2B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                <span>₹1,000</span>
                <span>₹3,500</span>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="md:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-[#E8E2D8] space-y-4">
                <p className="text-base font-bold text-[#1C201D]">No pieces found matching your criteria</p>
                <p className="text-xs text-[#5F6762]">
                  Try adjusting your price filter or selecting another category.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-[#1A3B2B] text-white text-xs font-semibold px-5 py-2.5 rounded-xl hover:bg-[#2A5A43]"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileFilterOpen(false)} />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-sm font-bold text-[#1C201D]">Filters</h3>
              <button onClick={() => setMobileFilterOpen(false)}>
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#7D8882] mb-3">Origin</h4>
              <div className="space-y-2 text-xs">
                {['all', 'own_design', 'resold'].map((t) => (
                  <label key={t} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="m-type"
                      checked={selectedType === t}
                      onChange={() => setSelectedType(t)}
                    />
                    <span>{t === 'all' ? 'All' : t === 'own_design' ? 'Our Own Designs' : 'Curated Resale'}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#7D8882] mb-3">Category</h4>
              <div className="space-y-2 text-xs">
                {categories.map((cat) => {
                  const val = cat === 'All Categories' ? 'all' : cat;
                  return (
                    <label key={cat} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="m-cat"
                        checked={selectedCategory === val}
                        onChange={() => setSelectedCategory(val)}
                      />
                      <span>{cat}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full bg-[#1A3B2B] text-white py-3 rounded-xl text-xs font-bold uppercase"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-[#5F6762]">Loading collection...</div>}>
      <ShopContent />
    </Suspense>
  );
}
