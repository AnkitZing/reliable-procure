'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Logo } from '@/components/Logo';
import { RACKNSELL_CATEGORIES } from '@/lib/categories-data';
import { INITIAL_PRODUCTS } from '@/lib/mock-data';
import { 
  Shield, ShoppingBag, CheckCircle2, Truck, 
  ArrowRight, Sparkles, ChevronRight, Zap,
  Search, FileSearch, Building2, Layers,
  Phone, Mail, Check, Star, Lock, Package
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [quickTrackInput, setQuickTrackInput] = useState('');
  const [quickRfqTitle, setQuickRfqTitle] = useState('');
  const [quickRfqQty, setQuickRfqQty] = useState('');
  const [quickRfqCat, setQuickRfqCat] = useState('Safety Equipment & Gear');
  const [rfqSubmitted, setRfqSubmitted] = useState(false);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTrackInput.trim()) {
      router.push(`/order-tracking?q=${encodeURIComponent(quickTrackInput.trim())}`);
    } else {
      router.push('/order-tracking');
    }
  };

  const handleRfqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRfqSubmitted(true);
    setTimeout(() => {
      setRfqSubmitted(false);
      setQuickRfqTitle('');
      setQuickRfqQty('');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* 1. Full RacknSell Style Navbar */}
      <Navbar />

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-24 border-b border-slate-200 bg-white">
        {/* Ambient Gradient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-gradient-to-tr from-blue-200/50 via-sky-100/40 to-emerald-100/50 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>India&apos;s Leading B2B Procure-to-Pay (P2P) Enterprise Portal</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Enterprise Procurement, Engineered for Complete <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">Reliability</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              Replicating the full RacknSell industrial supply chain engine. Pre-negotiated contract catalog, volume tiers, automated approval hierarchies, digital PO issuance, and automated 3-way invoice matching.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:opacity-95 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-500/20 transition flex items-center gap-2"
              >
                <span>Launch Enterprise Buydesk</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/catalog"
                className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold rounded-xl text-sm shadow-2xs transition flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-blue-600" />
                <span>Browse 13 Categories</span>
              </Link>
              <Link
                href="/admin/login"
                className="px-6 py-3.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-bold rounded-xl text-sm shadow-2xs transition flex items-center gap-2"
              >
                <Shield className="w-4 h-4 text-purple-600" />
                <span>Admin Login</span>
              </Link>
            </div>
          </div>

          {/* Quick Order Tracking & Quick RFQ Combined Strip */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl mx-auto pt-6">
            
            {/* Widget 1: Quick Track Consignment */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Quick Consignment & PO Tracker</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Enter your PO Number or BlueDart/Delhivery AWB code to track dispatch status.
              </p>
              <form onSubmit={handleTrackSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. PO-2026-0941 or BLUEDART-8829104"
                  value={quickTrackInput}
                  onChange={(e) => setQuickTrackInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition shrink-0 cursor-pointer"
                >
                  Track Order
                </button>
              </form>
              <div className="text-[10px] text-slate-400 flex items-center gap-2">
                <span>Try Demo PO:</span>
                <button 
                  type="button"
                  onClick={() => setQuickTrackInput('PO-2026-0941')}
                  className="text-blue-600 font-mono font-bold hover:underline cursor-pointer"
                >
                  PO-2026-0941
                </button>
              </div>
            </div>

            {/* Widget 2: Submit Buy Request / Quick RFQ */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <FileSearch className="w-4 h-4 text-indigo-600" />
                <span>Submit Quick Buy Request (RFQ)</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Source non-catalog or bulk custom items with verified OEM competitive bids.
              </p>

              {rfqSubmitted ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>RFQ Submitted! Our sourcing desk will publish bids within 2 hours.</span>
                </div>
              ) : (
                <form onSubmit={handleRfqSubmit} className="flex flex-col sm:flex-row gap-2">
                  <input
                    required
                    type="text"
                    placeholder="Item Name / Specs (e.g. 500kVA Stabilizer)"
                    value={quickRfqTitle}
                    onChange={(e) => setQuickRfqTitle(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                  <input
                    required
                    type="number"
                    placeholder="Qty"
                    value={quickRfqQty}
                    onChange={(e) => setQuickRfqQty(e.target.value)}
                    className="w-20 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition shrink-0 cursor-pointer"
                  >
                    Post RFQ
                  </button>
                </form>
              )}
              <div className="text-[10px] text-slate-400">
                100% Free &bull; Competitive L1 Supplier Quotes &bull; Rate Contracts
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. The 13 Full RacknSell Categories Visual Showcase */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>Complete Taxonomy Catalog</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                Shop By Industrial Category (All 13 Modules)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Explore standardized L0, L1, and L2 subcategories modeled after the full RacknSell catalog architecture.
              </p>
            </div>

            <Link
              href="/catalog?view=categories"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 shrink-0"
            >
              <span>Explore Taxonomy Master</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Categories Grid (13 Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {RACKNSELL_CATEGORIES.map((cat, idx) => (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-400 transition flex flex-col justify-between p-5 space-y-3 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs group-hover:bg-blue-600 group-hover:text-white transition">
                      {idx + 1}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {cat.productCount} SKUs
                    </span>
                  </div>

                  <Link href={`/category/${cat.slug}`}>
                    <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition">
                      {cat.name}
                    </h3>
                  </Link>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {cat.description}
                  </p>

                  {/* Subcategories preview pills */}
                  <div className="flex flex-wrap gap-1 pt-3">
                    {cat.subcategories.slice(0, 2).map((sub) => (
                      <span key={sub.id} className="text-[10px] px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-100 font-medium">
                        {sub.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-semibold truncate max-w-[120px]">
                    {cat.featuredBrands.slice(0, 2).join(', ')}
                  </span>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>View SKUs</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Featured Industrial Products Showcase */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Pre-Negotiated Rate Contracts</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                High-Volume MRO & Industrial Supplies
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Direct OEM dispatch with factory test certificates, volume tier discounts, and automated 3-way matching.
              </p>
            </div>

            <Link
              href="/catalog"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 shrink-0"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INITIAL_PRODUCTS.slice(0, 8).map((product) => {
              const effectivePrice = product.contractPrice || product.basePrice;
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between overflow-hidden group"
                >
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <Link href={`/product/${product.id}`} className="w-full h-full block">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </Link>
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-blue-600/90 backdrop-blur-md text-white font-bold text-[10px]">
                      {product.brand}
                    </div>
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white font-mono text-[10px]">
                      MOQ: {product.moq} {product.unit}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                        <span>{product.sku}</span>
                        <span>{product.category}</span>
                      </div>
                      <Link href={`/product/${product.id}`}>
                        <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-2 leading-snug">
                          {product.name}
                        </h3>
                      </Link>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                      <div>
                        <span className="text-base font-black text-slate-900 font-mono">
                          ₹{effectivePrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-500 ml-1">/{product.unit}</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                        +{product.gstRate}% GST
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Link
                        href={`/product/${product.id}`}
                        className="w-full py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold text-center transition flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <span>View Details & Tiers</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. Spot Sale & Surplus Clearance Spotlight Banner */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white p-8 sm:p-10 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase">
                <Zap className="w-3.5 h-3.5 fill-amber-200 text-amber-200" />
                <span>Live Spot Buy Clearance</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                Factory Surplus Lots at up to 35% Discount
              </h3>
              <p className="text-xs sm:text-sm text-white/90">
                Direct from verified manufacturers: Surplus safety footwear, impact drill sets, high-bay lights, and threadlockers with immediate dispatch.
              </p>
            </div>

            <div className="shrink-0">
              <Link
                href="/spot-sale"
                className="px-6 py-3.5 bg-white text-orange-700 hover:bg-slate-50 font-bold rounded-xl text-xs shadow-md transition flex items-center gap-2"
              >
                <span>Browse Spot Deals</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 4-Stakeholder Live Role Explorer */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl font-black text-slate-900">Experience All 4 Enterprise Stakeholder Views</h2>
            <p className="text-xs text-slate-500">
              Reliable provides specialized roles with tailored desks, approval thresholds, and statutory GST verification.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <Link
              href="/admin/login"
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-md transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Shield className="w-4 h-4" />
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900">1. Super Admin</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Enterprise onboarding, vendor KYC, margins (2.5%), master catalog & platform audits.
                </div>
              </div>
            </Link>

            <Link
              href="/catalog"
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900">2. Corporate Buyer</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Contracted price catalog, volume tiers, cart, raising requisitions (PR).
                </div>
              </div>
            </Link>

            <Link
              href="/requisitions"
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900">3. Finance Approver</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Threshold checks (&gt; ₹15k), budget compliance sign-off & 1-click PO generation.
                </div>
              </div>
            </Link>

            <Link
              href="/purchase-orders"
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-md transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Truck className="w-4 h-4" />
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900">4. Supplier / Vendor</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Receive digital POs, dispatch with AWB carrier tracking, invoice upload.
                </div>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* 6. Comprehensive RacknSell Multi-Column Footer with all modules */}
      <footer className="mt-auto border-t border-slate-200 bg-white text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-10 border-b border-slate-200">
            
            {/* Col 1: Brand & Contact */}
            <div className="space-y-4 md:col-span-1">
              <Logo size="md" />
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Next-generation industrial B2B procurement & e-bidding platform. Powering end-to-end P2P compliance.
              </p>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>+91 7290090309</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  <span>care@reliableprocure.com</span>
                </div>
              </div>
            </div>

            {/* Col 2: Top Sourcing Categories */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Top Categories</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><Link href="/catalog?cat=Safety%20Equipment%20%26%20Gear" className="hover:text-blue-600 transition">Safety Equipment & Gear</Link></li>
                <li><Link href="/catalog?cat=Power%20Tools" className="hover:text-blue-600 transition">Power Tools</Link></li>
                <li><Link href="/catalog?cat=Hand%20Tools" className="hover:text-blue-600 transition">Hand Tools</Link></li>
                <li><Link href="/catalog?cat=Electrical%20Components" className="hover:text-blue-600 transition">Electrical Components</Link></li>
                <li><Link href="/catalog?cat=Cleaning%20Supplies" className="hover:text-blue-600 transition">Cleaning Supplies</Link></li>
                <li><Link href="/catalog?cat=Office%20Supplies" className="hover:text-blue-600 transition">Office Supplies</Link></li>
              </ul>
            </div>

            {/* Col 3: Industrial Sub-Categories */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">MRO & Hardware</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><Link href="/catalog?cat=Lighting" className="hover:text-blue-600 transition">Industrial Lighting</Link></li>
                <li><Link href="/catalog?cat=Signages%20%26%20Labels" className="hover:text-blue-600 transition">Signages & Labels</Link></li>
                <li><Link href="/catalog?cat=Paint%20%26%20Polish" className="hover:text-blue-600 transition">Paint & Polish</Link></li>
                <li><Link href="/catalog?cat=Cable%20and%20Cable%20Accessories" className="hover:text-blue-600 transition">Cables & Accessories</Link></li>
                <li><Link href="/catalog?cat=Hardware" className="hover:text-blue-600 transition">Hardware & Fasteners</Link></li>
                <li><Link href="/catalog?cat=Test%20and%20Measuring%20Instruments" className="hover:text-blue-600 transition">Test & Measuring</Link></li>
                <li><Link href="/catalog?cat=Adhesive%2C%20Sealants%2C%20Tapes" className="hover:text-blue-600 transition">Adhesives & Sealants</Link></li>
              </ul>
            </div>

            {/* Col 4: Procurement Modules */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">P2P Modules</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><Link href="/dashboard" className="hover:text-blue-600 transition">Operations Dashboard</Link></li>
                <li><Link href="/requisitions" className="hover:text-blue-600 transition">Requisitions (PR)</Link></li>
                <li><Link href="/purchase-orders" className="hover:text-blue-600 transition">Purchase Orders (PO)</Link></li>
                <li><Link href="/order-tracking" className="hover:text-blue-600 transition">Order Tracking & Logistics</Link></li>
                <li><Link href="/rfq" className="hover:text-blue-600 transition">RFQ & E-Bidding</Link></li>
                <li><Link href="/grn-matching" className="hover:text-blue-600 transition">3-Way Reconciliation</Link></li>
                <li><Link href="/analytics" className="hover:text-blue-600 transition">Spend Analytics</Link></li>
              </ul>
            </div>

            {/* Col 5: Portals & Suppliers */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Portals & Access</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><Link href="/buydesk" className="hover:text-blue-600 transition">Enterprise Buydesk</Link></li>
                <li><Link href="/suppliers" className="hover:text-blue-600 transition">Supplier Desk (SRM)</Link></li>
                <li><Link href="/list-as-supplier" className="hover:text-blue-600 transition">List as Supplier</Link></li>
                <li><Link href="/spot-sale" className="hover:text-blue-600 transition">Spot Clearance Deals</Link></li>
                <li><Link href="/admin/users" className="hover:text-purple-600 transition">RBAC User Management</Link></li>
                <li><Link href="/admin/login" className="hover:text-purple-600 transition text-purple-700 font-bold">Super Admin Login</Link></li>
              </ul>
            </div>

          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
            <div>
              &copy; 2026 Reliable Technologies & B2B Solutions. All rights reserved. GSTIN Compliance Certified.
            </div>
            <div className="flex items-center gap-4 font-semibold">
              <Link href="/buydesk?tab=rules" className="hover:text-slate-900">Procurement Policy</Link>
              <span>&bull;</span>
              <Link href="/grn-matching?tab=invoices" className="hover:text-slate-900">GST Invoice Standards</Link>
              <span>&bull;</span>
              <Link href="/order-tracking" className="hover:text-slate-900">AWB Tracking</Link>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
