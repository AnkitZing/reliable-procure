'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { useReliableStore } from '@/lib/store';
import { 
  CheckCheck, AlertTriangle, CheckCircle2 
} from 'lucide-react';

export default function ThreeWayMatchingPage() {
  const { matches } = useReliableStore();
  const [localMatches, setLocalMatches] = useState(matches);

  const handleClearPayment = (poNumber: string) => {
    setLocalMatches(prev => prev.map(m => 
      m.poNumber === poNumber 
        ? { ...m, paymentSettlementStatus: 'CLEARED' as const } 
        : m
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Automated 3-Way Matching & Invoicing Engine
            </h1>
            <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
              P2P Compliance
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated verification cross-matching Purchase Orders (PO), Goods Received Notes (GRN), and Vendor GST Tax Invoices
          </p>
        </div>

        {/* Informative Logic Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Step 1: Purchase Order</div>
            <div className="text-xs font-bold text-slate-900">Agreed Items & Price</div>
            <p className="text-[11px] text-slate-500">Locked commercial quantities and authorized HSN tax rates.</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Step 2: Physical GRN</div>
            <div className="text-xs font-bold text-slate-900">Warehouse Delivery Check</div>
            <p className="text-[11px] text-slate-500">Verifies actual physical intake, deducting shortages or damages.</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="text-[10px] text-purple-600 font-bold uppercase tracking-wider">Step 3: Tax Invoice</div>
            <div className="text-xs font-bold text-slate-900">Vendor GST Billing Match</div>
            <p className="text-[11px] text-slate-500">Checks for variance. If $0 discrepancy, settlement is auto-cleared.</p>
          </div>
        </div>

        {/* Matching Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">PO Reference</th>
                  <th className="p-4">Supplier</th>
                  <th className="p-4">PO Value</th>
                  <th className="p-4">Warehouse GRN Status</th>
                  <th className="p-4">Supplier Invoice</th>
                  <th className="p-4">3-Way Match Verification</th>
                  <th className="p-4">Payment Settlement</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {localMatches.map((m) => {
                  const isMatched = m.matchStatus === 'MATCHED';

                  return (
                    <tr key={m.poNumber} className="hover:bg-slate-50/80 transition">
                      <td className="p-4 font-mono font-bold text-slate-900">
                        {m.poNumber}
                      </td>

                      <td className="p-4 font-bold text-slate-900">
                        {m.vendorName}
                      </td>

                      <td className="p-4 font-mono font-bold text-slate-800">
                        ₹{m.poAmount.toLocaleString('en-IN')}
                      </td>

                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          m.grnStatus === 'FULLY_RECEIVED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}>
                          {m.grnStatus.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="p-4 font-mono font-bold text-slate-800">
                        ₹{m.invoiceAmount.toLocaleString('en-IN')}
                      </td>

                      <td className="p-4">
                        {isMatched ? (
                          <div className="inline-flex items-center gap-1 text-emerald-700 text-xs font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>100% Matched (Zero Variance)</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 text-rose-700 text-xs font-bold">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                            <span>Variance: ₹{m.varianceAmount.toLocaleString('en-IN')}</span>
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          m.paymentSettlementStatus === 'CLEARED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}>
                          {m.paymentSettlementStatus}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        {m.paymentSettlementStatus !== 'CLEARED' ? (
                          <button
                            onClick={() => handleClearPayment(m.poNumber)}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1 transition cursor-pointer"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span>Clear Settlement</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-medium">Disbursed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
