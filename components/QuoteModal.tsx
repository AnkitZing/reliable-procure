'use client';

import React, { useState, useEffect } from 'react';
import { useReliableStore } from '@/lib/store';
import { RACKNSELL_CATEGORIES } from '@/lib/categories-data';
import { Product } from '@/lib/types';
import { 
  X, FileText, CheckCircle2, UploadCloud, 
  Building2, Phone, Mail, MapPin, Calendar, 
  DollarSign, ArrowRight, ShieldCheck, Clock
} from 'lucide-react';
import Link from 'next/link';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledProduct?: Product | null;
}

export function QuoteModal({ isOpen, onClose, prefilledProduct }: QuoteModalProps) {
  const { createRFQ, currentUser } = useReliableStore();

  const [productName, setProductName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Safety & PPE');
  const [quantity, setQuantity] = useState(25);
  const [unit, setUnit] = useState('Pieces');
  const [targetPrice, setTargetPrice] = useState('');
  const [deliveryPincode, setDeliveryPincode] = useState('411018');
  const [requiredDate, setRequiredDate] = useState('2026-09-30');
  const [notes, setNotes] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 98201 44520');
  const [fileName, setFileName] = useState<string | null>(null);

  // Success state
  const [generatedRfqNo, setGeneratedRfqNo] = useState<string | null>(null);

  useEffect(() => {
    if (prefilledProduct) {
      setProductName(prefilledProduct.name);
      setSku(prefilledProduct.sku);
      setCategory(prefilledProduct.category);
      setQuantity(prefilledProduct.moq || 10);
      setUnit(prefilledProduct.unit || 'Pieces');
      setTargetPrice(prefilledProduct.contractPrice ? String(prefilledProduct.contractPrice) : String(prefilledProduct.basePrice));
    } else {
      setProductName('');
      setSku('');
      setTargetPrice('');
    }

    if (currentUser) {
      setBuyerName(currentUser.name || 'Ankit Jain');
      setCompanyName(currentUser.companyName || 'Tata Advanced Systems Ltd');
      setEmail(currentUser.email || 'ankit.jain@tataadvanced.com');
    }
  }, [prefilledProduct, currentUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = createRFQ({
      title: productName || 'Industrial Sourcing Quotation',
      category: category,
      description: `${notes ? notes + ' | ' : ''}Target Unit Price: ₹${targetPrice || 'Market Rate'} | Delivery Pincode: ${deliveryPincode} | Contact: ${buyerName} (${phone})`,
      quantity: Number(quantity),
      unit: unit,
      targetDate: requiredDate,
      companyName: companyName || currentUser.companyName || 'Tata Advanced Systems Ltd',
      department: currentUser.department || 'Central Procurement Desk'
    });

    setGeneratedRfqNo(created.rfqNumber);
  };

  const handleResetAndClose = () => {
    setGeneratedRfqNo(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex items-center justify-between rounded-t-3xl sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">
                Request For Quotation (RFQ)
              </h2>
              <p className="text-xs text-blue-200">
                Get competitive L1 quotes from verified OEM suppliers & distributors
              </p>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {generatedRfqNo ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  RFQ Successfully Broadcasted
                </span>
                <h3 className="text-2xl font-black text-slate-900 font-mono">
                  {generatedRfqNo}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Your sourcing requisition has been dispatched to <strong>verified OEM suppliers</strong> in the <strong>{category}</strong> category. Bids and L1 comparison matrix will be updated on your RFQ desk.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Product / Specification:</span>
                  <strong className="text-slate-900 truncate max-w-[200px]">{productName}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Required Quantity:</span>
                  <strong className="text-slate-900 font-mono">{quantity} {unit}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Target Delivery Date:</span>
                  <strong className="text-slate-900 font-mono">{requiredDate}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Destination:</span>
                  <strong className="text-slate-900 font-mono">Pincode {deliveryPincode}</strong>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-center gap-3">
                <Link
                  href="/rfq"
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
                >
                  <span>Open RFQ Sourcing Desk</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Product Info Block */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  1. Product & Requirement Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Product Name / Generic Description *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Karam Safety Helmet or Fire Extinguisher MAP90"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      SKU / Model (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. RS077134"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Procurement Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    >
                      {RACKNSELL_CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Required Quantity *
                    </label>
                    <div className="flex gap-2">
                      <input
                        required
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                        className="w-24 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                      />
                      <select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="flex-1 px-2 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                      >
                        <option value="Pieces">Pieces</option>
                        <option value="Nos">Nos</option>
                        <option value="Sets">Sets</option>
                        <option value="Boxes">Boxes</option>
                        <option value="Rolls">Rolls</option>
                        <option value="Drums">Drums</option>
                        <option value="Pairs">Pairs</option>
                        <option value="Meters">Meters</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Target Price / Unit (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 850"
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Technical Specifications / Custom Requirements
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Provide ISI standards, material grades, tolerance, brand preferences, or scope of work..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Delivery & Schedule Block */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  2. Logistics & Delivery Timeline
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>Delivery Site Pincode *</span>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. 411018, 110020, 560001"
                      value={deliveryPincode}
                      onChange={(e) => setDeliveryPincode(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Required By Date *</span>
                    </label>
                    <input
                      required
                      type="date"
                      value={requiredDate}
                      onChange={(e) => setRequiredDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>

              {/* Enterprise Buyer Info Block */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  3. Corporate Buyer Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Company Name *</label>
                    <input
                      required
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Contact Officer *</label>
                    <input
                      required
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Phone / WhatsApp *</label>
                    <input
                      required
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>

              {/* BOM / Drawing Upload Simulation */}
              <div className="pt-2">
                <div 
                  onClick={() => setFileName('procurement_bom_schedule.xlsx')}
                  className="border border-dashed border-slate-300 hover:border-blue-400 rounded-xl p-3 bg-slate-50 text-center cursor-pointer transition flex items-center justify-center gap-2"
                >
                  <UploadCloud className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-slate-600">
                    {fileName ? (
                      <span className="font-bold text-blue-700">{fileName} (Attached)</span>
                    ) : (
                      <span>Attach BOM Sheet / Engineering Drawing (.pdf, .xlsx, .zip)</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Trust Badge & Submit */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified OEM Sellers &bull; B2B GST Invoicing &bull; 0% Platform Fee</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Broadcast RFQ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}
