'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { EnterpriseSidebar } from '@/components/EnterpriseSidebar';
import { useReliableStore } from '@/lib/store';
import { 
  Zap, ShoppingCart, Clock, TrendingDown, 
  CheckCircle2, ArrowRight, Shield, Sparkles,
  Percent, AlertCircle
} from 'lucide-react';

export default function SpotSalePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { products, addToCart } = useReliableStore();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  // Feature products with spot buy discount
  const spotDeals = products.slice(0, 8).map((p, idx) => ({
    ...p,
    spotDiscount: [25, 30, 20, 35, 22, 28, 18, 32][idx % 8],
    spotPrice: Math.round(p.basePrice * (1 - [0.25, 0.30, 0.20, 0.35, 0.22, 0.28, 0.18, 0.32][idx % 8])),
    stockRemaining: Math.floor(p.stock * 0.25)
  }));

  const handleAddToCart = (product: typeof spotDeals[0]) => {
    addToCart({
      ...product,
      contractPrice: product.spotPrice
    }, product.moq);
    setAddedIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <EnterpriseSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Hero Banner for Spot Deals */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white p-6 sm:p-8 shadow-md">
            <div className="relative z-10 space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span>Verified Factory Surplus & Spot Clearance</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                Bulk Industrial Spot Buy Desk
              </h1>
              <p className="text-xs sm:text-sm text-white/90">
                Pre-inspected surplus lots and high-volume manufacturer clearances at up to 35% below contracted rates. Instant digital PO dispatch.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs font-bold text-white/90">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-amber-200" />
                  <span>Limited Factory Inventory Lots</span>
                </div>
                <span>&bull;</span>
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-emerald-300" />
                  <span>100% Genuine & GST Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Deals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {spotDeals.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col overflow-hidden group"
              >
                {/* Image & Discount Badge */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-red-600 text-white font-black text-xs flex items-center gap-1 shadow-md">
                    <Percent className="w-3 h-3" />
                    <span>{item.spotDiscount}% OFF</span>
                  </div>
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-mono font-bold">
                    MOQ: {item.moq} {item.unit}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
                      <span>{item.brand}</span>
                      <span className="font-mono text-[10px]">{item.sku}</span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                      {item.name}
                    </h3>
                  </div>

                  {/* Stock Meter */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-amber-700">Surplus Remaining:</span>
                      <span className="text-slate-700 font-mono">{item.stockRemaining} {item.unit}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full" style={{ width: '38%' }} />
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                    <div>
                      <span className="text-base font-black text-slate-900 font-mono">
                        ₹{item.spotPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-400 line-through ml-1.5 font-mono">
                        ₹{item.basePrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold">
                      Save ₹{(item.basePrice - item.spotPrice).toLocaleString('en-IN')}/unit
                    </span>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      addedIds[item.id]
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:opacity-95 text-white shadow-xs'
                    }`}
                  >
                    {addedIds[item.id] ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add Spot Lot (Qty: {item.moq})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
