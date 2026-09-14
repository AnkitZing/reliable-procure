'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from './Logo';
import { RoleSwitcher } from './RoleSwitcher';
import { CartDrawer } from './CartDrawer';
import { useReliableStore } from '@/lib/store';
import { RACKNSELL_CATEGORIES } from '@/lib/categories-data';
import { 
  Phone, Mail, Truck, Zap, FileSearch, Shield, 
  ShoppingCart, Search, ChevronDown, Menu, X, 
  User, Sparkles, Building2, Layers, ArrowRight,
  ExternalLink, PanelLeftOpen
} from 'lucide-react';

export function Navbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, currentUser } = useReliableStore();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [searchCategory, setSearchCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const megaMenuRef = useRef<HTMLDivElement>(null);

  // Close mega menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setIsMegaMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() || searchCategory !== 'ALL') {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('q', searchQuery.trim());
      if (searchCategory !== 'ALL') params.set('cat', searchCategory);
      router.push(`/catalog?${params.toString()}`);
    } else {
      router.push('/catalog');
    }
  };

  const selectedCategory = RACKNSELL_CATEGORIES[activeCategoryIndex] || RACKNSELL_CATEGORIES[0];

  return (
    <>
      {/* 1. TOP UTILITY BAR (RacknSell Style) */}
      <div className="bg-slate-900 text-slate-300 text-[11px] font-medium border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between">
          
          {/* Left: Contact Helpline & Email */}
          <div className="flex items-center gap-4">
            <a 
              href="tel:+917290090309" 
              className="flex items-center gap-1.5 hover:text-white transition"
              title="Enterprise Procurement Helpline"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>+91 7290090309</span>
            </a>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <a 
              href="mailto:care@reliableprocure.com" 
              className="hidden sm:flex items-center gap-1.5 hover:text-white transition"
            >
              <Mail className="w-3 h-3 text-blue-400" />
              <span>care@reliableprocure.com</span>
            </a>
          </div>

          {/* Right: Quick Portals & Links */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link 
              href="/order-tracking" 
              className="flex items-center gap-1 text-slate-300 hover:text-white transition"
            >
              <Truck className="w-3 h-3 text-amber-400" />
              <span>Track Order</span>
            </Link>

            <span className="text-slate-700">|</span>

            <Link 
              href="/spot-sale" 
              className="hidden md:flex items-center gap-1 text-amber-300 hover:text-amber-200 font-bold transition"
            >
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>Spot Sale</span>
            </Link>

            <span className="text-slate-700 hidden md:inline">|</span>

            <Link 
              href="/rfq?tab=create" 
              className="hidden md:flex items-center gap-1 text-slate-300 hover:text-white transition"
            >
              <FileSearch className="w-3 h-3 text-indigo-400" />
              <span>Submit RFQ</span>
            </Link>

            <span className="text-slate-700 hidden md:inline">|</span>

            <Link 
              href="/list-as-supplier" 
              className="text-slate-300 hover:text-white transition"
            >
              <span>List as Supplier</span>
            </Link>

            <span className="text-slate-700">|</span>

            <Link 
              href="/admin/login" 
              className="text-purple-300 hover:text-purple-200 font-bold flex items-center gap-1 transition"
            >
              <Shield className="w-3 h-3 text-purple-400" />
              <span>Admin Portal</span>
            </Link>
          </div>

        </div>
      </div>

      {/* 2. MAIN HEADER & SEARCH BAR */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            
            {/* Left: Sidebar Toggle + Brand Logo */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {onToggleSidebar && (
                <button
                  onClick={onToggleSidebar}
                  className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                  title="Toggle Full Enterprise Modules Sidebar"
                >
                  <PanelLeftOpen className="w-5 h-5" />
                </button>
              )}

              <Link href="/" className="hover:opacity-90 transition">
                <Logo size="sm" />
              </Link>
            </div>

            {/* Middle: Category Search Bar (RacknSell Style) */}
            <form 
              onSubmit={handleSearchSubmit}
              className="hidden md:flex flex-1 max-w-2xl items-center bg-slate-100 rounded-xl border border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition overflow-hidden"
            >
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="h-10 pl-3 pr-2 text-xs font-semibold text-slate-700 bg-slate-50 border-r border-slate-300 focus:outline-none cursor-pointer hover:bg-slate-100 transition max-w-[150px] truncate"
              >
                <option value="ALL">All Categories</option>
                {RACKNSELL_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>

              <div className="relative flex-1 flex items-center">
                <input
                  type="text"
                  placeholder="Search products, SKUs, brands (Bosch, Schneider, 3M, Karam...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 px-3 text-xs text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="h-10 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Search</span>
              </button>
            </form>

            {/* Right: Actions & Profile */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* Role Switcher Pill */}
              <div className="hidden lg:block">
                <RoleSwitcher />
              </div>

              {/* RFQ / Sourcing Desk Direct Button */}
              <Link
                href="/rfq"
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition"
              >
                <FileSearch className="w-3.5 h-3.5 text-blue-600" />
                <span>RFQ Desk</span>
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 p-2 bg-slate-100 border border-slate-200 hover:border-blue-400 hover:bg-blue-50 rounded-xl text-slate-700 transition group cursor-pointer"
                title="Procurement Requisition Cart"
              >
                <ShoppingCart className="w-4.5 h-4.5 text-blue-600 group-hover:scale-110 transition" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold text-[10px] rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {totalCartCount}
                  </span>
                )}
              </button>

              {/* User Capsule */}
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="text-left leading-tight hidden xl:block">
                  <div className="text-xs font-bold text-slate-900 truncate max-w-[110px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium truncate max-w-[110px]">
                    {currentUser.companyName}
                  </div>
                </div>
              </div>

              {/* Mobile Drawer Toggle */}
              <button
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
              >
                {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>

          </div>
        </div>

        {/* 3. MEGA MENU & SECONDARY NAVIGATION STRIP */}
        <div className="bg-slate-50 border-t border-slate-200/80 hidden md:block" ref={megaMenuRef}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between text-xs">
            
            {/* Shop By Category Mega Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs shadow-xs hover:bg-blue-700 transition cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Shop By Category</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* THE MEGA MENU DROPDOWN PANEL */}
              {isMegaMenuOpen && (
                <div 
                  className="absolute top-full left-0 mt-1 w-[860px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setIsMegaMenuOpen(false)}
                >
                  {/* Left Column: 13 Primary L0 Categories */}
                  <div className="w-72 bg-slate-50 border-r border-slate-200 p-2 max-h-[480px] overflow-y-auto scrollbar-thin">
                    <div className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      RacknSell Catalog Categories
                    </div>
                    {RACKNSELL_CATEGORIES.map((cat, idx) => {
                      const isSelected = activeCategoryIndex === idx;
                      return (
                        <button
                          key={cat.id}
                          onMouseEnter={() => setActiveCategoryIndex(idx)}
                          onClick={() => {
                            router.push(`/catalog?cat=${encodeURIComponent(cat.name)}`);
                            setIsMegaMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold transition cursor-pointer ${
                            isSelected 
                              ? 'bg-blue-600 text-white shadow-xs font-bold' 
                              : 'text-slate-700 hover:bg-slate-200/70 hover:text-slate-900'
                          }`}
                        >
                          <span className="truncate">{cat.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                            isSelected ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {cat.productCount}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Column: L1 & L2 Subcategories for Selected Category */}
                  <div className="flex-1 p-6 max-h-[480px] overflow-y-auto space-y-5 bg-white">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                          <span>{selectedCategory.name}</span>
                          <span className="text-xs font-medium text-slate-400">({selectedCategory.productCount} items)</span>
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">{selectedCategory.description}</p>
                      </div>

                      <Link
                        href={`/catalog?cat=${encodeURIComponent(selectedCategory.name)}`}
                        onClick={() => setIsMegaMenuOpen(false)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
                      >
                        <span>View All</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                      </Link>
                    </div>

                    {/* Subcategories Grid */}
                    <div className="grid grid-cols-2 gap-6">
                      {selectedCategory.subcategories.map((sub) => (
                        <div key={sub.id} className="space-y-2">
                          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                            <span>{sub.name}</span>
                          </h4>
                          <ul className="space-y-1.5 pl-3 border-l border-slate-100">
                            {sub.items.map((item, itemIdx) => (
                              <li key={itemIdx}>
                                <Link
                                  href={`/catalog?q=${encodeURIComponent(item)}&cat=${encodeURIComponent(selectedCategory.name)}`}
                                  onClick={() => setIsMegaMenuOpen(false)}
                                  className="text-[11px] text-slate-600 hover:text-blue-600 hover:underline transition block truncate"
                                >
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* Featured Brands in Category */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Top Brands:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedCategory.featuredBrands.map((brand) => (
                          <Link
                            key={brand}
                            href={`/catalog?brand=${encodeURIComponent(brand)}`}
                            onClick={() => setIsMegaMenuOpen(false)}
                            className="px-2 py-0.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded text-[10px] font-bold text-slate-600 transition"
                          >
                            {brand}
                          </Link>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* Horizontal Module Quick Links */}
            <div className="flex items-center gap-1 overflow-x-auto py-1">
              <Link
                href="/dashboard"
                className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                  pathname === '/dashboard' ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/catalog"
                className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                  pathname === '/catalog' ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Catalog
              </Link>
              <Link
                href="/requisitions"
                className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                  pathname === '/requisitions' ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Requisitions
              </Link>
              <Link
                href="/purchase-orders"
                className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                  pathname === '/purchase-orders' ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Purchase Orders
              </Link>
              <Link
                href="/rfq"
                className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                  pathname === '/rfq' ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                RFQ Desk
              </Link>
              <Link
                href="/grn-matching"
                className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                  pathname === '/grn-matching' ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3-Way Match
              </Link>
              <Link
                href="/buydesk"
                className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                  pathname === '/buydesk' ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Buydesk
              </Link>
              <Link
                href="/suppliers"
                className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                  pathname === '/suppliers' ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Suppliers
              </Link>
              <Link
                href="/analytics"
                className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                  pathname === '/analytics' ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Analytics
              </Link>
            </div>

            {/* Right: Quick Action Pill */}
            <div className="flex items-center gap-2">
              <Link
                href="/spot-sale"
                className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-black flex items-center gap-1 shadow-2xs hover:opacity-95 transition"
              >
                <Zap className="w-3 h-3 fill-white" />
                <span>Spot Deals</span>
              </Link>
            </div>

          </div>
        </div>

        {/* MOBILE NAVIGATION DRAWER */}
        {isMobileNavOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-4 shadow-xl">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search products, SKUs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
              <button type="submit" className="p-2 bg-blue-600 text-white rounded-lg">
                <Search className="w-4 h-4" />
              </button>
            </form>

            <div className="border-t border-slate-100 pt-3">
              <RoleSwitcher />
            </div>

            {/* Quick Links Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <Link href="/dashboard" onClick={() => setIsMobileNavOpen(false)} className="p-2.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-700">Dashboard</Link>
              <Link href="/catalog" onClick={() => setIsMobileNavOpen(false)} className="p-2.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-700">Catalog (13 Cat)</Link>
              <Link href="/requisitions" onClick={() => setIsMobileNavOpen(false)} className="p-2.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-700">Requisitions (PR)</Link>
              <Link href="/purchase-orders" onClick={() => setIsMobileNavOpen(false)} className="p-2.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-700">Purchase Orders</Link>
              <Link href="/rfq" onClick={() => setIsMobileNavOpen(false)} className="p-2.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-700">RFQ Desk</Link>
              <Link href="/grn-matching" onClick={() => setIsMobileNavOpen(false)} className="p-2.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-700">3-Way Match</Link>
              <Link href="/buydesk" onClick={() => setIsMobileNavOpen(false)} className="p-2.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-700">Enterprise Buydesk</Link>
              <Link href="/suppliers" onClick={() => setIsMobileNavOpen(false)} className="p-2.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-700">Supplier Desk</Link>
              <Link href="/order-tracking" onClick={() => setIsMobileNavOpen(false)} className="p-2.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-700">Track Order</Link>
              <Link href="/spot-sale" onClick={() => setIsMobileNavOpen(false)} className="p-2.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-amber-700 font-bold">Spot Sale</Link>
              <Link href="/admin/login" onClick={() => setIsMobileNavOpen(false)} className="p-2.5 rounded-lg bg-purple-50 text-purple-700 font-bold col-span-2 text-center">Admin Portal Login</Link>
            </div>
          </div>
        )}
      </header>

      {/* Cart Drawer Modal */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
