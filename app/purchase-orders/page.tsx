'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { useReliableStore } from '@/lib/store';
import { PurchaseOrder } from '@/lib/types';
import { 
  Printer, Truck, FileCheck, Eye, CheckCircle2 
} from 'lucide-react';

export default function PurchaseOrdersPage() {
  const { purchaseOrders, currentRole, updatePOStatus } = useReliableStore();
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

  const handlePrint = () => {
    window.print();
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
                Digital Purchase Orders (PO)
              </h1>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                {purchaseOrders.length} Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Automated legally binding digital purchase contracts with PAN/GST verification and carrier tracking
            </p>
          </div>
        </div>

        {/* PO Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">PO Number</th>
                  <th className="p-4">Buyer Enterprise</th>
                  <th className="p-4">Assigned Supplier</th>
                  <th className="p-4">Total Value</th>
                  <th className="p-4">Fulfillment Status</th>
                  <th className="p-4">Logistics / AWB</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {purchaseOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-mono font-bold text-slate-900">
                      {po.poNumber}
                      <div className="text-[10px] text-slate-500 font-normal font-sans">
                        Ref: {po.prId} &bull; {po.issuedAt}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-slate-900">{po.companyName}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        GST: {po.buyerGstin}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-slate-900">{po.vendorName}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        GST: {po.vendorGstin}
                      </div>
                    </td>

                    <td className="p-4 font-mono font-black text-emerald-700">
                      ₹{po.totalAmount.toLocaleString('en-IN')}
                      <div className="text-[10px] text-slate-500 font-normal">
                        Subtotal: ₹{po.subtotal.toLocaleString('en-IN')}
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        po.status === 'DELIVERED'
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                          : po.status === 'IN_TRANSIT'
                          ? 'bg-blue-50 text-blue-900 border-blue-300'
                          : 'bg-amber-50 text-amber-900 border-amber-300'
                      }`}>
                        {po.status === 'DELIVERED' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {po.status === 'IN_TRANSIT' && <Truck className="w-3 h-3 text-blue-600" />}
                        {po.status === 'ISSUED' && <FileCheck className="w-3 h-3 text-amber-600" />}
                        <span>{po.status}</span>
                      </span>
                    </td>

                    <td className="p-4 text-slate-500">
                      {po.trackingNumber ? (
                        <div className="text-xs">
                          <span className="font-mono text-slate-900 font-bold block">{po.trackingNumber}</span>
                          <span className="text-[10px] text-slate-500">{po.carrierName}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Awaiting Dispatch</span>
                      )}
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedPO(po)}
                        className="px-2.5 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-bold inline-flex items-center gap-1 transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View PO</span>
                      </button>

                      {currentRole === 'VENDOR' && po.status === 'ISSUED' && (
                        <button
                          onClick={() => updatePOStatus(po.id, 'IN_TRANSIT', 'DELHIVERY-774921', 'Delhivery Express')}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1 transition cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Dispatch</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Formal Purchase Order Document Viewer Modal */}
      {selectedPO && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl max-w-3xl w-full p-8 space-y-6 shadow-2xl my-8 border border-slate-200">
            
            {/* Action Bar (Not printed) */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Formal Enterprise Purchase Order (PO)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / PDF</span>
                </button>
                <button
                  onClick={() => setSelectedPO(null)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-wide">
                    PURCHASE ORDER
                  </h2>
                  <div className="text-xs text-slate-600 font-mono mt-1">
                    PO Number: <strong>{selectedPO.poNumber}</strong>
                  </div>
                  <div className="text-xs text-slate-500">
                    Date of Issue: {selectedPO.issuedAt} &bull; Delivery Target: {selectedPO.deliveryDate}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-black text-blue-600 tracking-wider">RELIABLE</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    Procurement Exchange
                  </div>
                </div>
              </div>

              {/* Parties */}
              <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <div className="font-bold text-slate-600 uppercase tracking-wider text-[10px] mb-1">
                    BUYER DETAILS:
                  </div>
                  <div className="font-bold text-slate-900">{selectedPO.companyName}</div>
                  <div className="text-slate-600 mt-0.5">Attn: {selectedPO.buyerName}</div>
                  <div className="text-slate-600 mt-0.5">GSTIN: <span className="font-mono font-bold text-slate-800">{selectedPO.buyerGstin}</span></div>
                  <div className="text-slate-500 mt-1">{selectedPO.shippingAddress}</div>
                </div>

                <div>
                  <div className="font-bold text-slate-600 uppercase tracking-wider text-[10px] mb-1">
                    SUPPLIER / VENDOR:
                  </div>
                  <div className="font-bold text-slate-900">{selectedPO.vendorName}</div>
                  <div className="text-slate-600 mt-0.5">GSTIN: <span className="font-mono font-bold text-slate-800">{selectedPO.vendorGstin}</span></div>
                  <div className="text-slate-500 mt-1">Gala 12, Logistics Hub, Bhiwandi, Maharashtra 421302</div>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Description of Goods</th>
                      <th className="p-3">HSN Code</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Unit Price (₹)</th>
                      <th className="p-3 text-right">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedPO.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-3 text-slate-500">{idx + 1}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{item.productName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">SKU: {item.sku}</div>
                        </td>
                        <td className="p-3 font-mono text-slate-600">{item.hsnCode}</td>
                        <td className="p-3 text-center font-mono font-bold">{item.quantity} {item.unit}</td>
                        <td className="p-3 text-right font-mono">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900">₹{item.totalAmount.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Taxes & Totals */}
              <div className="flex justify-end">
                <div className="w-72 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Taxable Value:</span>
                    <span className="font-mono text-slate-900 font-bold">₹{selectedPO.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {selectedPO.cgst > 0 && (
                    <div className="flex justify-between">
                      <span>CGST (9%):</span>
                      <span className="font-mono text-slate-900 font-semibold">₹{selectedPO.cgst.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {selectedPO.sgst > 0 && (
                    <div className="flex justify-between">
                      <span>SGST (9%):</span>
                      <span className="font-mono text-slate-900 font-semibold">₹{selectedPO.sgst.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {selectedPO.igst > 0 && (
                    <div className="flex justify-between">
                      <span>IGST (18% Inter-state):</span>
                      <span className="font-mono text-slate-900 font-semibold">₹{selectedPO.igst.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-300">
                    <span>Total PO Value:</span>
                    <span className="text-emerald-700 font-mono">₹{selectedPO.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Legal Terms & Digital Signature */}
              <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-500 space-y-1">
                <div><strong>Standard Purchase Terms:</strong> Payment within Net 45 days against compliant GST Tax Invoice and verified GRN. Materials subject to quality inspection upon delivery.</div>
                <div className="flex justify-between items-end pt-4">
                  <div>
                    <div>Generated automatically via <strong>Reliable Enterprise Procurement Engine</strong></div>
                    <div>Digital Verification Hash: <span className="font-mono">REL-PO-SEC-9984128</span></div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-800">Authorized Signatory</div>
                    <div className="text-slate-500">Procurement & Finance Desk</div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
