'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { EnterpriseSidebar } from '@/components/EnterpriseSidebar';
import { useReliableStore } from '@/lib/store';
import { 
  Truck, PackageCheck, CheckCircle2, Clock, 
  MapPin, Shield, ExternalLink, Search, ArrowRight,
  Building2, Calendar, FileText, AlertCircle
} from 'lucide-react';

export default function OrderTrackingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { purchaseOrders } = useReliableStore();

  const [searchQuery, setSearchQuery] = useState('PO-2026-0941');
  const [searchedPO, setSearchedPO] = useState(
    purchaseOrders.find(po => po.poNumber === 'PO-2026-0941') || purchaseOrders[0]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toUpperCase();
    const found = purchaseOrders.find(
      po => po.poNumber.toUpperCase() === query || 
            (po.trackingNumber && po.trackingNumber.toUpperCase().includes(query))
    );
    if (found) {
      setSearchedPO(found);
    } else {
      alert(`No purchase order found matching "${searchQuery}". Try searching "PO-2026-0941" or "PO-2026-0895".`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <EnterpriseSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
                <Truck className="w-4 h-4" />
                <span>Logistics & Order Tracking</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                Real-Time Consignment & PO Tracker
              </h1>
              <p className="text-xs text-slate-500">
                Live dispatch telemetry, carrier AWB status, and gate inward delivery milestones.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Quick Test POs:</span>
              <button
                onClick={() => { setSearchQuery('PO-2026-0941'); setSearchedPO(purchaseOrders[0]); }}
                className="px-2.5 py-1 text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition cursor-pointer"
              >
                PO-2026-0941 (In-Transit)
              </button>
              {purchaseOrders[1] && (
                <button
                  onClick={() => { setSearchQuery(purchaseOrders[1].poNumber); setSearchedPO(purchaseOrders[1]); }}
                  className="px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition cursor-pointer"
                >
                  {purchaseOrders[1].poNumber} (Delivered)
                </button>
              )}
            </div>
          </div>

          {/* Search Lookup Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter PO Number (e.g. PO-2026-0941) or Carrier AWB (e.g. BLUEDART-8829104)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Truck className="w-4 h-4" />
                <span>Track Consignment</span>
              </button>
            </form>
          </div>

          {/* Active PO Status Card */}
          {searchedPO && (
            <div className="space-y-6">
              
              {/* Top Overview Details */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-black text-slate-900 font-mono">
                        {searchedPO.poNumber}
                      </h2>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        searchedPO.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                        searchedPO.status === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                        'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        {searchedPO.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                      <span>Issued: {searchedPO.issuedAt}</span>
                      <span>&bull;</span>
                      <span>Target Delivery: {searchedPO.deliveryDate}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Consignment Total</span>
                      <span className="text-xl font-black text-slate-900 font-mono">₹{searchedPO.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <Link
                      href={`/purchase-orders`}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>View PO Form</span>
                    </Link>
                  </div>
                </div>

                {/* Tracking Milestones Visual Progress Bar */}
                <div className="py-4">
                  <div className="text-xs font-bold text-slate-700 mb-6 uppercase tracking-wider">
                    Shipment Checkpoints & Milestones:
                  </div>

                  <div className="relative">
                    {/* Horizontal connector line */}
                    <div className="absolute top-5 left-8 right-8 h-1 bg-slate-200 -z-0 hidden md:block" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                      
                      {/* Step 1: PO Issued */}
                      <div className="flex md:flex-col items-center md:text-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md ring-4 ring-emerald-50">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900">1. PO Approved & Issued</div>
                          <div className="text-[11px] text-slate-500">Auto generated with GSTIN</div>
                          <div className="text-[10px] font-mono text-emerald-600 mt-0.5">{searchedPO.issuedAt}</div>
                        </div>
                      </div>

                      {/* Step 2: Vendor Acknowledged & Packed */}
                      <div className="flex md:flex-col items-center md:text-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md ring-4 ring-emerald-50">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900">2. Packed & Barcoded</div>
                          <div className="text-[11px] text-slate-500">{searchedPO.vendorName}</div>
                          <div className="text-[10px] font-mono text-emerald-600 mt-0.5">QC Verification Passed</div>
                        </div>
                      </div>

                      {/* Step 3: Dispatched & In-Transit */}
                      <div className="flex md:flex-col items-center md:text-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md ring-4 ${
                          searchedPO.status === 'IN_TRANSIT' || searchedPO.status === 'DELIVERED'
                            ? 'bg-blue-600 text-white ring-blue-50 animate-pulse'
                            : 'bg-slate-200 text-slate-500 ring-slate-50'
                        }`}>
                          <Truck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900">3. In-Transit with Carrier</div>
                          <div className="text-[11px] text-slate-500">
                            {searchedPO.carrierName || 'BlueDart Express Logistics'}
                          </div>
                          <div className="text-[10px] font-mono text-blue-600 font-bold mt-0.5">
                            AWB: {searchedPO.trackingNumber || 'BLUEDART-8829104'}
                          </div>
                        </div>
                      </div>

                      {/* Step 4: Gate Inward & GRN */}
                      <div className="flex md:flex-col items-center md:text-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md ring-4 ${
                          searchedPO.status === 'DELIVERED'
                            ? 'bg-emerald-600 text-white ring-emerald-50'
                            : 'bg-slate-100 text-slate-400 ring-slate-50'
                        }`}>
                          <PackageCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900">4. Gate Inward & 3-Way GRN</div>
                          <div className="text-[11px] text-slate-500">Plant Gate 2 Material Inward</div>
                          <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                            {searchedPO.status === 'DELIVERED' ? 'GRN Verified' : 'Expected: ' + searchedPO.deliveryDate}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Courier Carrier Telemetry Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Logistics Partner</span>
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <span>{searchedPO.carrierName || 'BlueDart Express Logistics'}</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-600 mt-1">
                      AWB Airway Bill: <strong className="text-blue-600">{searchedPO.trackingNumber || 'BLUEDART-8829104'}</strong>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Origin (Supplier Dispatch)</span>
                    <div className="font-bold text-slate-900">{searchedPO.vendorName}</div>
                    <div className="text-[11px] text-slate-500 mt-1 font-mono">GSTIN: {searchedPO.vendorGstin}</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Destination (Plant Gate)</span>
                    <div className="font-bold text-slate-900">{searchedPO.companyName}</div>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{searchedPO.shippingAddress}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Items in Consignment Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Consignment Manifest Line Items ({searchedPO.items.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3.5">SKU & Item Name</th>
                        <th className="p-3.5 text-center">HSN Code</th>
                        <th className="p-3.5 text-center">Shipped Qty</th>
                        <th className="p-3.5 text-right">Unit Rate</th>
                        <th className="p-3.5 text-right">GST Rate</th>
                        <th className="p-3.5 text-right">Line Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {searchedPO.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition">
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900">{item.productName}</div>
                            <div className="text-[10px] font-mono text-slate-400">{item.sku}</div>
                          </td>
                          <td className="p-3.5 text-center font-mono">{item.hsnCode}</td>
                          <td className="p-3.5 text-center font-bold text-slate-900">
                            {item.quantity} {item.unit}
                          </td>
                          <td className="p-3.5 text-right font-mono">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                          <td className="p-3.5 text-right font-mono text-slate-500">{item.gstRate}%</td>
                          <td className="p-3.5 text-right font-mono font-bold text-slate-900">
                            ₹{item.totalAmount.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}
