'use client';

import React, { useState } from 'react';
import { useReliableStore } from '@/lib/store';
import { X, Trash2, Plus, Minus, ShieldCheck, ArrowRight, Building, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, updateCartQuantity, removeFromCart, createRequisitionFromCart, currentUser } = useReliableStore();
  const [selectedDept, setSelectedDept] = useState('Plant Operations & MRO');
  const [successPR, setSuccessPR] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + (item.effectiveUnitPrice * item.quantity), 0);
  const estimatedTax = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + estimatedTax;
  const isAutoApprovable = grandTotal < 15000;

  const handleCheckout = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const pr = createRequisitionFromCart(selectedDept);
      setIsSubmitting(false);
      if (pr) {
        setSuccessPR(pr.prNumber);
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-all duration-300">
      <div className="w-full max-w-lg bg-white border-l border-slate-200 text-slate-900 flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-wide">Procurement Cart</h2>
            <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-200">
              {cart.length} {cart.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            onClick={() => { setSuccessPR(null); onClose(); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {successPR ? (
            <div className="py-12 px-4 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Requisition Submitted!</h3>
              <p className="text-sm text-slate-600">
                Requisition <span className="font-mono text-emerald-700 font-bold">{successPR}</span> has been generated successfully.
              </p>

              {isAutoApprovable ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-left text-xs text-emerald-800">
                  <div className="font-bold flex items-center gap-1.5 mb-1 text-emerald-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Auto-Approval Triggered
                  </div>
                  Order value is below the ₹15,000 threshold. A formal Purchase Order (PO) has been generated instantly and dispatched to the supplier.
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-900">
                  <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-950">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    Approval Workflow Initiated
                  </div>
                  Order value exceeds ₹15,000. It has been routed to the Department Manager / Finance Approver for verification.
                </div>
              )}

              <div className="pt-4 flex gap-3 justify-center">
                <Link
                  href="/requisitions"
                  onClick={() => { setSuccessPR(null); onClose(); }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition shadow-sm"
                >
                  View in Requisitions
                </Link>
                <Link
                  href="/purchase-orders"
                  onClick={() => { setSuccessPR(null); onClose(); }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition border border-slate-300"
                >
                  Check Purchase Orders
                </Link>
              </div>
            </div>
          ) : cart.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Building className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium">Your procurement requisition cart is empty.</p>
              <p className="text-xs text-slate-400">Browse the enterprise catalog to add MRO, safety, and operational items.</p>
            </div>
          ) : (
            <>
              {/* Department Selector */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-blue-600" />
                  Charging Department / Cost Center:
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="Plant Operations & MRO">Plant Operations & MRO (Budget: ₹4.5L)</option>
                  <option value="Health & Safety (EHS)">Health & Safety EHS (Budget: ₹2.2L)</option>
                  <option value="Electrical & Power Systems">Electrical & Power Systems (Budget: ₹6.0L)</option>
                  <option value="Corporate IT & Infrastructure">Corporate IT & Infrastructure (Budget: ₹3.8L)</option>
                  <option value="Facilities & General Admin">Facilities & General Admin (Budget: ₹1.5L)</option>
                </select>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex gap-3 items-start"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-14 h-14 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-900 truncate">
                        {item.product.name}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        SKU: <span className="font-mono text-slate-700">{item.product.sku}</span> | HSN: {item.product.hsnCode}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs font-extrabold text-emerald-700 font-mono">
                          ₹{item.effectiveUnitPrice.toLocaleString('en-IN')} <span className="text-[10px] text-slate-500 font-normal">/{item.product.unit}</span>
                        </div>
                        {/* Quantity controller */}
                        <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-lg px-2 py-0.5">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="text-slate-500 hover:text-slate-900 p-0.5 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono font-bold text-slate-900 px-1">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="text-slate-500 hover:text-slate-900 p-0.5 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && !successPR && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            {/* Logic notification banner */}
            <div className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
              isAutoApprovable 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-blue-50 border-blue-200 text-blue-950'
            }`}>
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
              <div>
                <span className="font-bold">Business Logic Check: </span>
                {isAutoApprovable ? (
                  <span>Total &lt; ₹15,000 threshold. Will generate direct <strong>Auto-Approved PO</strong> instantly.</span>
                ) : (
                  <span>Total &ge; ₹15,000 threshold. Will be sent for <strong>Finance Approver Authorization</strong>.</span>
                )}
              </div>
            </div>

            {/* Calculations */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal (Net Price):</span>
                <span className="text-slate-900 font-mono font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated GST (Avg 18%):</span>
                <span className="text-slate-900 font-mono font-semibold">₹{estimatedTax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Estimated Requisition Total:</span>
                <span className="text-emerald-700 font-mono font-black">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Generating Requisition...</span>
              ) : (
                <>
                  <span>Raise Purchase Requisition (PR)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <div className="text-[11px] text-center text-slate-500 font-medium">
              Authorized by: {currentUser.name} ({currentUser.role})
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
