'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { 
  Shield, ShoppingBag, CheckCircle2, Truck, 
  ArrowRight, Sparkles, ChevronRight 
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/">
            <Logo size="md" />
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/catalog"
              className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 transition hidden sm:block"
            >
              Catalog
            </Link>
            <Link
              href="/dashboard"
              className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 transition hidden sm:block"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/login"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin / Enterprise Portal</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-16 md:pt-24 md:pb-24">
        {/* Background ambient gradient */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-200/50 via-sky-100/40 to-emerald-100/50 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Next-Gen B2B Procure-to-Pay (P2P) Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Industrial Procurement, Built with Absolute <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">Reliability</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Digitize your entire supply chain lifecycle. From volume-tiered MRO catalog sourcing and automated approval hierarchies to digital PO issuance and 3-way invoice matching.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:opacity-95 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-500/20 transition flex items-center gap-2"
            >
              <span>Explore Live Platform</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/admin/login"
              className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold rounded-xl text-sm shadow-2xs transition flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-purple-600" />
              <span>Sign In with Demo Roles</span>
            </Link>
          </div>

          {/* Quick Role Tester Cards */}
          <div className="pt-10 max-w-5xl mx-auto">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
              Switch & Experience All 4 Enterprise Stakeholder Views:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              
              <Link
                href="/admin/login"
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-md transition group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Shield className="w-4 h-4" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition" />
                </div>
                <div className="text-xs font-bold text-slate-900">1. Super Admin</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Enterprise onboardings, vendor KYC, margins, master catalog & platform audit.
                </div>
              </Link>

              <Link
                href="/catalog"
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
                </div>
                <div className="text-xs font-bold text-slate-900">2. Corporate Buyer</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Contracted price catalog, volume tiers, cart, raising requisitions (PR).
                </div>
              </Link>

              <Link
                href="/requisitions"
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
                </div>
                <div className="text-xs font-bold text-slate-900">3. Finance Approver</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Threshold checks (&gt;₹15k), budget compliance sign-off & 1-click PO generation.
                </div>
              </Link>

              <Link
                href="/purchase-orders"
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-md transition group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition" />
                </div>
                <div className="text-xs font-bold text-slate-900">4. Supplier / Vendor</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Receive digital POs, dispatch with AWB carrier tracking, invoice upload.
                </div>
              </Link>

            </div>
          </div>

        </div>
      </section>

      {/* Interactive Business Logic Workflow Breakdown */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-slate-900">The Reliable Procure-to-Pay (P2P) Engine</h2>
            <p className="text-xs text-slate-500 max-w-xl mx-auto">
              Automating fragmented manual purchases into a transparent, compliant, digital pipeline
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-black">1</div>
              <h3 className="text-xs font-bold text-slate-900">Catalog Sourcing</h3>
              <p className="text-[11px] text-slate-600">
                Pre-negotiated contract rates, volume discount tiers (10+, 50+, 200+ units) across MRO & industrial supplies.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-black">2</div>
              <h3 className="text-xs font-bold text-slate-900">Requisition (PR)</h3>
              <p className="text-[11px] text-slate-600">
                Department-tagged purchase demand raised by verified employee with budget limit validation.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black">3</div>
              <h3 className="text-xs font-bold text-slate-900">Threshold Approval</h3>
              <p className="text-[11px] text-slate-600">
                &lt; ₹15,000 orders auto-approved into PO. Orders &ge; ₹15,000 routed to Manager / Finance head.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-black">4</div>
              <h3 className="text-xs font-bold text-slate-900">Digital PO & Dispatch</h3>
              <p className="text-[11px] text-slate-600">
                Legally compliant PO auto-generated with buyer & supplier GSTIN, line-item taxes, and AWB tracking.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-black">5</div>
              <h3 className="text-xs font-bold text-slate-900">3-Way Match & Pay</h3>
              <p className="text-[11px] text-slate-600">
                Cross-matches PO quantity, warehouse physical GRN, and vendor GST invoice for error-free settlements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size="sm" showSubtitle={false} />
            <span className="text-xs text-slate-500">&copy; 2026 Reliable Technologies. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
            <Link href="/catalog" className="hover:text-slate-900 transition">Catalog</Link>
            <Link href="/purchase-orders" className="hover:text-slate-900 transition">POs</Link>
            <Link href="/rfq" className="hover:text-slate-900 transition">RFQ Bidding</Link>
            <Link href="/admin/login" className="hover:text-blue-600 transition text-blue-600">Admin Login</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
