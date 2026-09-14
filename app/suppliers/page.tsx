'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { EnterpriseSidebar } from '@/components/EnterpriseSidebar';
import { useReliableStore } from '@/lib/store';
import { 
  Truck, Shield, CheckCircle2, Award, Plus, 
  FileCheck, AlertTriangle, ExternalLink, Star, 
  Clock, Package, Building2, Search
} from 'lucide-react';

function SuppliersContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'directory';

  const [activeTab, setActiveTab] = useState(initialTab);
  const { companies, purchaseOrders } = useReliableStore();

  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [newVendorName, setNewVendorName] = useState('');
  const [newVendorGstin, setNewVendorGstin] = useState('');
  const [newVendorCategory, setNewVendorCategory] = useState('Safety & PPE');

  const vendors = companies.filter(c => c.type === 'VENDOR');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <EnterpriseSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
                <Truck className="w-4 h-4" />
                <span>Supplier Relationship Management (SRM)</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                Vendor Master & Compliance Desk
              </h1>
              <p className="text-xs text-slate-500">
                Verified manufacturers, MSME suppliers, On-Time In-Full (OTIF) ratings, and GST compliance.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOnboardModalOpen(true)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Onboard Supplier</span>
              </button>
            </div>
          </div>

          {/* Submenu Navigation Tabs */}
          <div className="flex border-b border-slate-200 space-x-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('directory')}
              className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'directory'
                  ? 'border-amber-600 text-amber-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Vendor Directory</span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 font-bold">
                {vendors.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('kyc')}
              className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'kyc'
                  ? 'border-amber-600 text-amber-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>KYC & GSTIN Verification</span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                100% Verified
              </span>
            </button>

            <button
              onClick={() => setActiveTab('scorecards')}
              className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'scorecards'
                  ? 'border-amber-600 text-amber-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>OTIF & Performance Scorecards</span>
            </button>
          </div>

          {/* TAB 1: Vendor Directory */}
          {activeTab === 'directory' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vendors.map((v) => (
                <div key={v.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Contracted Vendor</span>
                      <h3 className="text-base font-black text-slate-900">{v.name}</h3>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">GSTIN: {v.gstin}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{v.status}</span>
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Registered Hub Address</div>
                    <div className="text-slate-700">{v.billingAddress}</div>
                    <div className="text-[11px] font-semibold text-slate-500">State: {v.state} &bull; Terms: {v.paymentTerms}</div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-bold">Rating</div>
                      <div className="text-sm font-black text-slate-900 flex items-center justify-center gap-0.5">
                        <span>4.9</span>
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-bold">On-Time</div>
                      <div className="text-sm font-black text-emerald-700 font-mono">98.2%</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-bold">Quality</div>
                      <div className="text-sm font-black text-blue-700 font-mono">99.5%</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                    <Link href="/catalog" className="text-blue-600 hover:text-blue-700">
                      View Cataloged Items &rarr;
                    </Link>
                    <Link href="/rfq" className="text-slate-600 hover:text-slate-900">
                      Invite to RFQ Bids
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: KYC & GSTIN Verification */}
          {activeTab === 'kyc' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Mandatory Vendor Compliance & Statutory Verification
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Vendor Name</th>
                      <th className="p-3.5">GSTIN Status</th>
                      <th className="p-3.5">PAN Validation</th>
                      <th className="p-3.5">MSME Classification</th>
                      <th className="p-3.5">Bank Mandate</th>
                      <th className="p-3.5 text-center">Audit Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {vendors.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50">
                        <td className="p-3.5 font-bold text-slate-900">{v.name}</td>
                        <td className="p-3.5 font-mono text-emerald-700 font-semibold">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            {v.gstin} (Active)
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-slate-800">{v.pan}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">
                            Udyam Medium Enterprise
                          </span>
                        </td>
                        <td className="p-3.5 text-emerald-700 font-semibold">HDFC CMS Verified</td>
                        <td className="p-3.5 text-center">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            APPROVED
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: OTIF Scorecards */}
          {activeTab === 'scorecards' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-base font-black text-slate-900">
                  On-Time In-Full (OTIF) Supplier Performance Matrix
                </h3>
                <p className="text-xs text-slate-500">
                  Automated service-level agreement (SLA) calculations derived from Gate Inward GRN timestamps and physical count reconciliations.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-sm text-slate-900">Industrial Supply Hub LLP</span>
                      <span className="text-xs font-bold text-emerald-700 font-mono">98.2% OTIF</span>
                    </div>
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>Dispatch Lead Time:</span>
                        <strong className="text-slate-900 font-mono">1.8 Days avg</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>3-Way Match Clean Rate:</span>
                        <strong className="text-emerald-700 font-mono">100% (No invoice discrepancies)</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Defect / Rejection Ratio:</span>
                        <strong className="text-slate-900 font-mono">0.05%</strong>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-sm text-slate-900">Karam Safety Solutions</span>
                      <span className="text-xs font-bold text-emerald-700 font-mono">99.1% OTIF</span>
                    </div>
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>Dispatch Lead Time:</span>
                        <strong className="text-slate-900 font-mono">1.2 Days avg</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>3-Way Match Clean Rate:</span>
                        <strong className="text-emerald-700 font-mono">99.8%</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Defect / Rejection Ratio:</span>
                        <strong className="text-slate-900 font-mono">0.02% (ISI Certified)</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Onboard Supplier Modal */}
          {isOnboardModalOpen && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                <h3 className="text-lg font-black text-slate-900">Onboard New Supplier</h3>
                <p className="text-xs text-slate-500">Initiate automated GSTIN verification and digital KYC invitation.</p>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Company / Firm Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Bosch Power Tools Distribution"
                      value={newVendorName}
                      onChange={(e) => setNewVendorName(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">GSTIN (15 Digits)</label>
                    <input
                      type="text"
                      placeholder="27AABC..."
                      value={newVendorGstin}
                      onChange={(e) => setNewVendorGstin(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Primary Product Category</label>
                    <select
                      value={newVendorCategory}
                      onChange={(e) => setNewVendorCategory(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl"
                    >
                      <option value="Safety Equipment & Gear">Safety Equipment & Gear</option>
                      <option value="Power Tools">Power Tools</option>
                      <option value="Electrical Components">Electrical Components</option>
                      <option value="Cleaning Supplies">Cleaning Supplies</option>
                      <option value="Office Supplies">Office Supplies</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setIsOnboardModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      alert(`Vendor onboarding invitation sent to ${newVendorName || 'New Supplier'}! KYC verification queued.`);
                      setIsOnboardModalOpen(false);
                    }}
                    className="px-4 py-2 bg-amber-600 text-white font-bold rounded-xl text-xs"
                  >
                    Send Invitation
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default function SuppliersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 p-8 text-xs text-slate-500">Loading Supplier Management Desk...</div>}>
      <SuppliersContent />
    </Suspense>
  );
}
