'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { EnterpriseSidebar } from '@/components/EnterpriseSidebar';
import { QuoteModal } from '@/components/QuoteModal';
import { useReliableStore } from '@/lib/store';
import { RACKNSELL_CATEGORIES, Category } from '@/lib/categories-data';
import { Product } from '@/lib/types';
import { 
  Layers, Filter, Search, ArrowUpDown, Grid, List, 
  ChevronRight, Check, ShoppingBag, Star, ShieldCheck, 
  HelpCircle, Sliders, ArrowRight, Tag, Sparkles, Building2
} from 'lucide-react';

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { products, addToCart } = useReliableStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedProductForQuote, setSelectedProductForQuote] = useState<Product | null>(null);

  // Find category definition
  const category: Category | undefined = useMemo(() => {
    return RACKNSELL_CATEGORIES.find(c => 
      c.slug.toLowerCase() === slug?.toLowerCase() ||
      c.id.toLowerCase() === slug?.toLowerCase() ||
      c.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === slug?.toLowerCase()
    );
  }, [slug]);

  // Faceted filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('ALL');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<'ALL' | 'UNDER_1000' | '1000_5000' | 'ABOVE_5000'>('ALL');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'FEATURED' | 'PRICE_ASC' | 'PRICE_DESC' | 'BRAND_ASC'>('FEATURED');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  // Filter products for this category
  const filteredProducts = useMemo(() => {
    if (!category) return [];

    let list = products.filter(p => {
      // Category match
      const catMatches = 
        p.category.toLowerCase().includes(category.name.toLowerCase()) ||
        category.name.toLowerCase().includes(p.category.toLowerCase()) ||
        (category.slug === 'safety-ppe' && (p.category.includes('Safety') || p.name.includes('Fire') || p.brand.includes('Ceasefire'))) ||
        (category.slug === 'industrial-tools-mro' && p.category.includes('Tools'));

      if (!catMatches && category.name !== 'All Categories') return false;

      // Subcategory match
      if (selectedSubcategory !== 'ALL') {
        const matchesSub = 
          p.name.toLowerCase().includes(selectedSubcategory.toLowerCase()) ||
          p.description.toLowerCase().includes(selectedSubcategory.toLowerCase()) ||
          p.category.toLowerCase().includes(selectedSubcategory.toLowerCase());
        if (!matchesSub) return false;
      }

      // Brand filter
      if (selectedBrands.length > 0) {
        if (!selectedBrands.includes(p.brand)) return false;
      }

      // Price filter
      const effectivePrice = p.contractPrice || p.basePrice;
      if (priceRange === 'UNDER_1000' && effectivePrice >= 1000) return false;
      if (priceRange === '1000_5000' && (effectivePrice < 1000 || effectivePrice > 5000)) return false;
      if (priceRange === 'ABOVE_5000' && effectivePrice <= 5000) return false;

      // In stock
      if (inStockOnly && p.stock <= 0) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQ = 
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q);
        if (!matchesQ) return false;
      }

      return true;
    });

    // Sorting
    if (sortBy === 'PRICE_ASC') {
      list.sort((a, b) => (a.contractPrice || a.basePrice) - (b.contractPrice || b.basePrice));
    } else if (sortBy === 'PRICE_DESC') {
      list.sort((a, b) => (b.contractPrice || b.basePrice) - (a.contractPrice || a.basePrice));
    } else if (sortBy === 'BRAND_ASC') {
      list.sort((a, b) => a.brand.localeCompare(b.brand));
    }

    return list;
  }, [category, products, selectedSubcategory, selectedBrands, priceRange, inStockOnly, searchQuery, sortBy]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const getQty = (productId: string, defaultMoq: number) => {
    return quantities[productId] || defaultMoq || 1;
  };

  const handleQtyChange = (productId: string, qty: number, moq: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(moq, qty)
    }));
  };

  const handleAddToCart = (product: Product) => {
    const qty = getQty(product.id, product.moq);
    addToCart(product, qty);
    setAddedNotice(product.id);
    setTimeout(() => setAddedNotice(null), 2000);
  };

  const handleOpenQuote = (product?: Product) => {
    setSelectedProductForQuote(product || null);
    setIsQuoteModalOpen(true);
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
            <Layers className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Category Not Found</h1>
          <p className="text-sm text-slate-500">
            The requested industrial category slug &ldquo;{slug}&rdquo; is not part of the active 13 taxonomy modules.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <Link
              href="/catalog"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              Browse Full Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <EnterpriseSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* 1. BREADCRUMBS */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="hover:text-blue-600 transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/catalog" className="hover:text-blue-600 transition">Catalog</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold">{category.name}</span>
          </nav>

          {/* 2. CATEGORY BANNER HERO */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-sm">
            <div className="relative z-10 space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-bold">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>RacknSell Module &bull; {category.productCount} Registered SKUs</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {category.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {category.description}
              </p>

              {/* Subcategories pill strip */}
              <div className="pt-2 flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedSubcategory('ALL')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                    selectedSubcategory === 'ALL'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white/10 text-slate-200 hover:bg-white/20'
                  }`}
                >
                  All Subcategories
                </button>
                {category.subcategories.map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubcategory(sub.name)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                      selectedSubcategory === sub.name
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white/10 text-slate-200 hover:bg-white/20'
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. MAIN FACETED BROWSING LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* LEFT: FACETED FILTERS SIDEBAR */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Search Within Category */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <label className="text-xs font-black uppercase text-slate-400 tracking-wider block">
                  Search in {category.name}
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search SKU, specs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Brand Filter */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-wider">
                    Featured OEM Brands
                  </label>
                  {selectedBrands.length > 0 && (
                    <button
                      onClick={() => setSelectedBrands([])}
                      className="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin">
                  {category.featuredBrands.map(brand => {
                    const isChecked = selectedBrands.includes(brand);
                    return (
                      <label 
                        key={brand} 
                        className="flex items-center gap-2 text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleBrand(brand)}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="truncate">{brand}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <label className="text-xs font-black uppercase text-slate-400 tracking-wider block">
                  Contract Price Slab
                </label>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={priceRange === 'ALL'}
                      onChange={() => setPriceRange('ALL')}
                      className="text-blue-600 cursor-pointer"
                    />
                    <span>All Prices</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={priceRange === 'UNDER_1000'}
                      onChange={() => setPriceRange('UNDER_1000')}
                      className="text-blue-600 cursor-pointer"
                    />
                    <span>Under ₹1,000</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={priceRange === '1000_5000'}
                      onChange={() => setPriceRange('1000_5000')}
                      className="text-blue-600 cursor-pointer"
                    />
                    <span>₹1,000 - ₹5,000</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={priceRange === 'ABOVE_5000'}
                      onChange={() => setPriceRange('ABOVE_5000')}
                      className="text-blue-600 cursor-pointer"
                    />
                    <span>Above ₹5,000</span>
                  </label>
                </div>
              </div>

              {/* In Stock & Fast Dispatch Toggle */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <label className="flex items-center justify-between cursor-pointer select-none">
                  <span className="text-xs font-bold text-slate-800">In-Stock Only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </label>
              </div>

              {/* Sourcing Assistance Card */}
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-xs text-blue-900">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <span>Looking for Custom Specs?</span>
                </div>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  Submit an RFQ to verified suppliers across India for tender lots, custom branding, or high-volume enterprise rate agreements.
                </p>
                <button
                  onClick={() => handleOpenQuote()}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  Request Bulk Quotation
                </button>
              </div>

            </div>

            {/* RIGHT: PRODUCTS GRID & CONTROLS */}
            <div className="lg:col-span-3 space-y-4">
              
              {/* Controls Bar (Sorting & View Mode) */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="font-semibold text-slate-600">
                  Showing <strong>{filteredProducts.length}</strong> items in <strong>{category.name}</strong>
                </div>

                <div className="flex items-center gap-3">
                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-medium hidden sm:inline">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-600 cursor-pointer"
                    >
                      <option value="FEATURED">Featured Contract Items</option>
                      <option value="PRICE_ASC">Price: Low to High</option>
                      <option value="PRICE_DESC">Price: High to Low</option>
                      <option value="BRAND_ASC">Brand (A-Z)</option>
                    </select>
                  </div>

                  {/* View Mode */}
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 transition ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
                      title="Grid View"
                    >
                      <Grid className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 transition ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
                      title="List View"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">No products match your filters</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try clearing your brand selections or search query, or submit an RFQ to request this specific item.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedBrands([]);
                      setSearchQuery('');
                      setPriceRange('ALL');
                      setSelectedSubcategory('ALL');
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4' 
                  : 'space-y-3'
                }>
                  {filteredProducts.map(prod => {
                    const qty = getQty(prod.id, prod.moq);
                    const effectivePrice = prod.contractPrice || prod.basePrice;

                    return (
                      <div
                        key={prod.id}
                        className={`bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition flex overflow-hidden group ${
                          viewMode === 'list' ? 'flex-col sm:flex-row' : 'flex-col justify-between'
                        }`}
                      >
                        {/* Image */}
                        <div className={`relative bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center ${
                          viewMode === 'list' ? 'w-full sm:w-48 h-44' : 'h-44'
                        }`}>
                          <Link href={`/product/${prod.id}`} className="w-full h-full block">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                          </Link>
                          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-blue-600 text-white font-bold text-[10px]">
                            {prod.brand}
                          </div>
                          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white font-mono text-[10px]">
                            MOQ: {prod.moq} {prod.unit}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                              <span>SKU: {prod.sku}</span>
                              <span>HSN: {prod.hsnCode}</span>
                            </div>

                            <Link href={`/product/${prod.id}`}>
                              <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-2 leading-snug">
                                {prod.name}
                              </h3>
                            </Link>

                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                              {prod.description}
                            </p>
                          </div>

                          {/* Volume Tier Strip */}
                          {prod.tiers && prod.tiers.length > 0 && (
                            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[10px] font-mono">
                              <span className="text-slate-400 font-bold uppercase text-[9px]">Tiers:</span>
                              {prod.tiers.map((t, idx) => (
                                <span key={idx} className="text-slate-600">
                                  {t.minQty}+: <strong className="text-blue-600">₹{t.price}</strong>
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Price & Actions */}
                          <div className="pt-2 border-t border-slate-100 space-y-2">
                            <div className="flex items-baseline justify-between">
                              <div>
                                <span className="text-base font-black text-slate-900 font-mono">
                                  ₹{effectivePrice.toLocaleString('en-IN')}
                                </span>
                                <span className="text-[10px] text-slate-500 ml-1">/{prod.unit}</span>
                              </div>
                              <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                                + {prod.gstRate}% GST
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden shrink-0">
                                <button
                                  onClick={() => handleQtyChange(prod.id, qty - 1, prod.moq)}
                                  className="px-2 py-1 text-slate-600 hover:bg-slate-200 text-xs font-bold cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="px-2 text-xs font-bold font-mono text-slate-800">
                                  {qty}
                                </span>
                                <button
                                  onClick={() => handleQtyChange(prod.id, qty + 1, prod.moq)}
                                  className="px-2 py-1 text-slate-600 hover:bg-slate-200 text-xs font-bold cursor-pointer"
                                >
                                  +
                                </button>
                              </div>

                              <button
                                onClick={() => handleAddToCart(prod)}
                                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                                  addedNotice === prod.id
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs'
                                }`}
                              >
                                {addedNotice === prod.id ? (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Added!</span>
                                  </>
                                ) : (
                                  <>
                                    <ShoppingBag className="w-3.5 h-3.5" />
                                    <span>Add to PR</span>
                                  </>
                                )}
                              </button>

                              <Link
                                href={`/product/${prod.id}`}
                                className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition"
                                title="View Specifications"
                              >
                                View
                              </Link>
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

          </div>

        </main>
      </div>

      {/* Sourcing RFQ Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        prefilledProduct={selectedProductForQuote}
      />
    </div>
  );
}
