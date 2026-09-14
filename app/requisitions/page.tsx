'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { useReliableStore } from '@/lib/store';
import { Requisition } from '@/lib/types';
import { 
  FileText, CheckCircle2, XCircle, 
  Clock, Eye, Building2, UserCheck, ArrowRight 
} from 'lucide-react';
import Link from 'next/link';

export default function RequisitionsPage() {
  const { requisitions, currentRole, approveRequisition, rejectRequisition } = useReliableStore();
  const [selectedPR, setSelectedPR] = useState<Requisition | null>(null);
  const [rejectingPrId, setRejectingPrId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = (prId: string) => {
    approveRequisition(prId);
    if (selectedPR && selectedPR.id === prId) {
      setSelectedPR(null);
    }
  };

  const handleRejectConfirm = () => {
    if (rejectingPrId && rejectReason) {
      rejectRequisition(rejectingPrId, rejectReason);
      setRejectingPrId(null);
      setRejectReason('');
      setSelectedPR(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Purchase Requisitions (PR)
              </h1>
              <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                {requisitions.length} Total
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Internal demand requisitions with automated threshold routing & multi-level corporate approval
            </p>
          </div>

          <Link
            href="/catalog"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition self-start sm:self-auto"
          >
            <span>+ Create New Requisition</span>
          </Link>
        </div>

        {/* PR List Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">PR Number</th>
                  <th className="p-4">Requester & Dept</th>
                  <th className="p-4">Line Items</th>
                  <th className="p-4">Total Amount (₹)</th>
                  <th className="p-4">Status & Logic</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requisitions.map((pr) => {
                  const isPending = pr.status === 'PENDING_APPROVAL';
                  const isApproved = pr.status === 'PO_GENERATED';
                  const isRejected = pr.status === 'REJECTED';

                  return (
                    <tr key={pr.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4 font-mono font-bold text-slate-900">
                        {pr.prNumber}
                        <div className="text-[10px] text-slate-500 font-normal font-sans">
                          {pr.createdAt}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-slate-900">{pr.buyerName}</div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          {pr.department}
                        </div>
                      </td>

                      <td className="p-4 text-slate-700 max-w-xs truncate font-medium">
                        {pr.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                      </td>

                      <td className="p-4 font-mono font-black text-emerald-700">
                        ₹{pr.totalAmount.toLocaleString('en-IN')}
                        <div className="text-[10px] text-slate-500 font-normal">
                          (GST: ₹{pr.totalTax.toLocaleString('en-IN')})
                        </div>
                      </td>

                      <td className="p-4">
                        {isPending && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-[10px] font-bold">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Pending Sign-off (&gt; ₹15k)</span>
                          </div>
                        )}
                        {isApproved && (
                          <div className="space-y-1">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-300 text-[10px] font-bold">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>PO Issued: {pr.poNumber}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-medium">
                              By: {pr.approvedBy}
                            </div>
                          </div>
                        )}
                        {isRejected && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-900 border border-rose-300 text-[10px] font-bold">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>Rejected</span>
                          </div>
                        )}
                      </td>

                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedPR(pr)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>

                        {isPending && (currentRole === 'APPROVER' || currentRole === 'SUPER_ADMIN') && (
                          <button
                            onClick={() => handleApprove(pr.id)}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1 transition cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
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

      {/* Inspect PR Modal */}
      {selectedPR && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900">Purchase Requisition Details</h3>
                  <span className="font-mono text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded border border-blue-200">
                    {selectedPR.prNumber}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Raised on {selectedPR.createdAt} by {selectedPR.buyerName} ({selectedPR.department})
                </p>
              </div>
              <button
                onClick={() => setSelectedPR(null)}
                className="text-slate-400 hover:text-slate-800 p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Line Items List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Itemized Breakdown:</h4>
              <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Item & SKU</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Unit Rate</th>
                      <th className="p-3 text-right">Tax (GST)</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {selectedPR.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{item.productName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">SKU: {item.sku} | HSN: {item.hsnCode}</div>
                        </td>
                        <td className="p-3 text-center font-mono font-semibold">{item.quantity} {item.unit}</td>
                        <td className="p-3 text-right font-mono">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-right font-mono text-slate-600">₹{item.taxAmount.toLocaleString('en-IN')} ({item.gstRate}%)</td>
                        <td className="p-3 text-right font-mono font-black text-emerald-700">₹{item.totalAmount.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (Excl. Taxes):</span>
                <span className="font-mono text-slate-900 font-bold">₹{selectedPR.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total GST Applicable:</span>
                <span className="font-mono text-slate-900 font-bold">₹{selectedPR.totalTax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Grand Total:</span>
                <span className="font-mono text-emerald-700 font-black">₹{selectedPR.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedPR(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold cursor-pointer"
              >
                Close
              </button>

              {selectedPR.status === 'PENDING_APPROVAL' && (currentRole === 'APPROVER' || currentRole === 'SUPER_ADMIN') && (
                <>
                  <button
                    onClick={() => { setRejectingPrId(selectedPR.id); }}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(selectedPR.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve & Generate PO</span>
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Reject Reason Dialog */}
      {rejectingPrId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Specify Rejection Reason</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Needs revised budget allocation from corporate finance."
              rows={3}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectingPrId(null)}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={!rejectReason.trim()}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold disabled:opacity-50 cursor-pointer"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
