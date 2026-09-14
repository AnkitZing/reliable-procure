'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { 
  Truck, CheckCircle2, Shield, Building2, 
  FileText, ArrowRight, Sparkles, Award
} from 'lucide-react';
import { RACKNSELL_CATEGORIES } from '@/lib/categories-data';

export default function ListAsSupplierPage() {
  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCat, setSelectedCat] = useState('Safety Equipment & Gear');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <Truck className="w-3.5 h-3.5 text-amber-600" />
            <span>Reliable Supplier Network</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Supply Directly to India&apos;s Top Enterprise Enterprises
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Join verified OEMs, authorized distributors, and MSME manufacturers fulfilling purchase orders for Tata Advanced Systems, L&T, Siemens, and more.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Direct Corporate Access</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Skip traditional middlemen. Receive confirmed POs directly from enterprise buydesks with verified budgets.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Guaranteed Timely Settlements</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Automated 3-way matching clears your GST invoices within Net-30 or Net-45 credit cycles with zero reconciliation friction.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Volume Rate Contracts</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Participate in long-term Annual Rate Contracts (ARC) and bulk e-bidding with high predictable order volume.
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 max-w-3xl mx-auto">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Application Submitted Successfully!</h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Thank you, <strong>{contactName}</strong>. Our enterprise supplier verification team has received <strong>{companyName}</strong>&apos;s credentials. We will verify your GSTIN (<code>{gstin}</code>) and activate your vendor portal within 24 hours.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <Link
                  href="/admin/login"
                  className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Test Vendor Portal Demo
                </Link>
                <Link
                  href="/catalog"
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Explore Sourcing Catalog
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-black text-slate-900">Register as an Enterprise Supplier</h2>
                <p className="text-xs text-slate-500">Provide legal statutory information for automated KYC verification.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company / Entity Legal Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Apex Engineering Solutions Pvt Ltd"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">GSTIN (15 Alpha-Numeric) *</label>
                  <input
                    required
                    type="text"
                    maxLength={15}
                    placeholder="27AABCA1234F1Z5"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600 font-mono font-bold uppercase"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Authorized Contact Person *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Suresh Patel (Sales Director)"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Business Official Email *</label>
                  <input
                    required
                    type="email"
                    placeholder="sales@apexengineering.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Helpline / Mobile Number *</label>
                  <input
                    required
                    type="tel"
                    placeholder="+91 98200 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Primary Product Taxonomy *</label>
                  <select
                    value={selectedCat}
                    onChange={(e) => setSelectedCat(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600 font-medium cursor-pointer"
                  >
                    {RACKNSELL_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="font-bold text-slate-800">Required Document Checklist for Fast Activation:</div>
                <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-500">
                  <div>&bull; GST Registration Certificate (Form REG-06)</div>
                  <div>&bull; Cancelled Cheque / Mandate</div>
                  <div>&bull; PAN Card of Entity</div>
                  <div>&bull; MSME / Udyam Certificate (Optional)</div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Submit Supplier Onboarding Application</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

      </main>
    </div>
  );
}
