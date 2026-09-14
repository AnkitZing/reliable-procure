'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { useReliableStore } from '@/lib/store';
import { 
  FileSearch, Plus, Award, Calendar 
} from 'lucide-react';

export default function RFQPage() {
  const { rfqs, createRFQ, awardRFQQuote, currentUser } = useReliableStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Industrial Tools & MRO');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('Units');
  const [targetDate, setTargetDate] = useState('2026-09-30');

  const handleCreateRFQ = (e: React.FormEvent) => {
    e.preventDefault();
    createRFQ({
      title,
      category,
      description,
      quantity: Number(quantity),
      unit,
      targetDate,
      companyName: currentUser.companyName || 'Tata Advanced Systems Ltd',
      department: currentUser.department || 'Plant Operations & MRO'
    });
    setIsCreateModalOpen(false);
    setTitle('');
    setDescription('');
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
                Request for Quote (RFQ) & Sourcing Desk
              </h1>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                {rfqs.length} Active Bids
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Multi-vendor bidding engine with quote comparison matrix and 1-click PO conversion
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New RFQ</span>
          </button>
        </div>

        {/* RFQ List */}
        <div className="space-y-6">
          {rfqs.map((rfq) => {
            const isAwarded = rfq.status === 'AWARDED';

            return (
              <div
                key={rfq.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5"
              >
                {/* RFQ Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-700">{rfq.rfqNumber}</span>
                      <span className="text-xs text-slate-500">&bull; Category: <strong className="text-slate-800">{rfq.category}</strong></span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isAwarded 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}>
                        {rfq.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900">{rfq.title}</h2>
                    <p className="text-xs text-slate-600">{rfq.description}</p>
                  </div>

                  <div className="text-left md:text-right space-y-1 shrink-0">
                    <div className="text-xs text-slate-700">
                      Required: <strong className="text-slate-900 font-mono">{rfq.quantity} {rfq.unit}</strong>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center md:justify-end gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Target Date: {rfq.targetDate}
                    </div>
                  </div>
                </div>

                {/* Vendor Quotes Comparison Matrix */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <FileSearch className="w-3.5 h-3.5 text-blue-600" />
                      Vendor Quotation Matrix ({rfq.quotes.length} bids submitted)
                    </h3>
                  </div>

                  {rfq.quotes.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                      No supplier bids submitted yet. Suppliers on Reliable have been notified.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {rfq.quotes.map((quote) => {
                        const isWinning = quote.status === 'ACCEPTED';

                        return (
                          <div
                            key={quote.id}
                            className={`p-4 rounded-xl border transition ${
                              isWinning
                                ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-400/20 shadow-xs'
                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="text-xs font-bold text-slate-900">{quote.vendorName}</div>
                                <div className="text-[11px] text-slate-500 mt-0.5">
                                  Lead time: <strong>{quote.leadTimeDays} days</strong> &bull; Valid till: {quote.validUntil}
                                </div>
                              </div>
                              {isWinning ? (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300 flex items-center gap-1">
                                  <Award className="w-3 h-3 text-emerald-600" /> Winning Quote
                                </span>
                              ) : isAwarded ? (
                                <span className="text-[10px] text-slate-400 font-medium">Declined</span>
                              ) : null}
                            </div>

                            <div className="mt-3 p-2.5 bg-white rounded-lg border border-slate-200 flex items-baseline justify-between">
                              <div>
                                <span className="text-[10px] text-slate-500 font-medium">Unit Bid Price:</span>
                                <div className="font-mono text-xs text-slate-900 font-bold">₹{quote.unitPrice.toLocaleString('en-IN')}</div>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] text-slate-500 font-medium">Total (Incl {quote.taxRate}% GST):</span>
                                <div className="font-mono text-sm font-black text-emerald-700">₹{quote.totalPrice.toLocaleString('en-IN')}</div>
                              </div>
                            </div>

                            {quote.notes && (
                              <p className="text-[11px] text-slate-600 italic mt-2">
                                &ldquo;{quote.notes}&rdquo;
                              </p>
                            )}

                            {!isAwarded && (
                              <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end">
                                <button
                                  onClick={() => awardRFQQuote(rfq.id, quote.id)}
                                  className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                                >
                                  <Award className="w-3.5 h-3.5" />
                                  <span>Award Bid & Generate PO</span>
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </main>

      {/* Create RFQ Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Raise Sourcing RFQ</h3>
            <form onSubmit={handleCreateRFQ} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Requirement Title / Technical Item</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 500kVA Industrial Servo Voltage Stabilizer"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  >
                    <option value="Electrical & Electronics">Electrical & Electronics</option>
                    <option value="Industrial Tools & MRO">Industrial Tools & MRO</option>
                    <option value="Safety & PPE">Safety & PPE</option>
                    <option value="Facility & Cleaning">Facility & Cleaning</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Delivery Date</label>
                  <input
                    type="date"
                    required
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Required Quantity</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unit of Measurement</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="Units, Sets, Pieces"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Technical Specifications & Terms</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Input voltage range, copper winding specs, onsite warranty requirements..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Publish RFQ to Suppliers
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
