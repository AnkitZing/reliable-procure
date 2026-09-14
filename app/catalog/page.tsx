'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { useReliableStore } from '@/lib/store';
import { Product } from '@/lib/types';
import { 
  Search, Filter, ShoppingBag, Plus, 
  ShieldCheck, ArrowRight, Check, Tag, Sparkles
} from 'lucide-react';
import Link from 'next/link';

export function CatalogPage() {
  const { products, addToCart, currentRole, addProduct } = useReliableStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  // New product modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<Product['category']>('Safety & PPE');
  const [newProdPrice, setNewProdPrice] = useState(500);
  const [newProdMoq, setNewProdMoq] = useState(5);
  const [newProdHsn, setNewProdHsn] = useState('650610');
  const [newProdUnit, setNewProdUnit] = useState('Pieces');

  const categories = [
    'ALL',
    'Safety & PPE',
    'Industrial Tools & MRO',
    'Electrical & Electronics',
    'Office & IT Supplies',
    'Facility & Cleaning'
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'ALL' || product.category === selectedCategory;
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getQty = (productId: string, defaultMoq: number) => {
    return quantities[productId] || defaultMoq || 1;
  };

  const handleQtyChange = (productId: string, qty: number, moq: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(moq, qty)
    }));
  };

  const handleAddToCart = (product: Product) => {
    const qty = getQty(product.id, product.moq);
    addToCart(product, qty);
    setAddedNotice(product.id);
    setTimeout(() => setAddedNotice(null), 2000);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      name: newProdName,
      sku: newProdSku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      category: newProdCategory,
      description: 'Standard industrial grade procurement item.',
      brand: 'Reliable Certified',
      basePrice: Number(newProdPrice),
      contractPrice: Math.round(Number(newProdPrice) * 0.9),
      hsnCode: newProdHsn,
      gstRate: 18,
      unit: newProdUnit,
      moq: Number(newProdMoq),
      stock: 500,
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      tiers: [
        { minQty: Number(newProdMoq), price: Math.round(Number(newProdPrice) * 0.9) },
        { minQty: Number(newProdMoq) * 5, price: Math.round(Number(newProdPrice) * 0.8) }
      ],
      vendorId: 'comp-ven-01',
      vendorName: 'Industrial Supply Hub LLP'
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Enterprise Sourcing Catalog
              </h1>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" /> Contract Rates Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Volume-tiered commercial pricing with guaranteed GST invoicing & manufacturer warranty
            </p>
          </div>

          {(currentRole === 'SUPER_ADMIN' || currentRole === 'VENDOR') && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Catalog Item</span>
            </button>
          )}
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by product name, SKU, brand, or category..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-1" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const currentSelectedQty = getQty(product.id, product.moq);
            const isAdded = addedNotice === product.id;

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col hover:border-slate-300 hover:shadow-md transition duration-200 group"
              >
                {/* Product Image & Badges */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs border border-slate-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-slate-700 shadow-xs">
                    {product.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-emerald-100/95 backdrop-blur-xs border border-emerald-300 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold">
                    GST {product.gstRate}%
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span>Brand: <strong className="text-slate-800">{product.brand}</strong></span>
                      <span>SKU: <strong className="font-mono text-slate-700">{product.sku}</strong></span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Pricing & Volume Discount Tiers */}
                    <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-semibold text-slate-600">Enterprise Rate:</span>
                        <div className="text-right">
                          <span className="text-base font-black text-emerald-700 font-mono">
                            ₹{(product.contractPrice || product.basePrice).toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] text-slate-500">/{product.unit}</span>
                        </div>
                      </div>

                      {product.tiers && product.tiers.length > 0 && (
                        <div className="pt-2 border-t border-slate-200">
                          <div className="text-[10px] font-bold text-slate-600 flex items-center gap-1 mb-1">
                            <Tag className="w-3 h-3 text-blue-600" />
                            Volume Tier Savings:
                          </div>
                          <div className="grid grid-cols-3 gap-1 text-[10px] text-center">
                            {product.tiers.map((t, idx) => (
                              <div
                                key={idx}
                                className={`p-1 rounded bg-white border ${
                                  currentSelectedQty >= t.minQty 
                                    ? 'border-emerald-400 bg-emerald-50 text-emerald-800 font-bold' 
                                    : 'border-slate-200 text-slate-600'
                                }`}
                              >
                                {t.minQty}+ {product.unit}: ₹{t.price}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Add Action */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-slate-500 font-medium block">MOQ: {product.moq} {product.unit}</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <input
                          type="number"
                          min={product.moq}
                          value={currentSelectedQty}
                          onChange={(e) => handleQtyChange(product.id, parseInt(e.target.value) || product.moq, product.moq)}
                          className="w-16 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-900 font-mono text-center focus:outline-none focus:border-blue-500"
                        />
                        <span className="text-xs text-slate-600">{product.unit}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add to PR</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* RFQ Callout Banner */}
        <div className="p-6 bg-gradient-to-r from-blue-50 via-indigo-50/50 to-emerald-50 rounded-2xl border border-blue-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              Need custom machinery, heavy consumables, or unlisted MRO parts?
            </h3>
            <p className="text-xs text-slate-600">
              Raise a customized Request for Quote (RFQ). Verified suppliers on Reliable will submit transparent competitive bids.
            </p>
          </div>
          <Link
            href="/rfq"
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:opacity-90 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 shrink-0 transition"
          >
            <span>Create RFQ Requisition</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </main>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Add Item to Reliable Catalog</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Industrial Safety Gloves Cut-Resistant Level 5"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  >
                    <option value="Safety & PPE">Safety & PPE</option>
                    <option value="Industrial Tools & MRO">Industrial Tools & MRO</option>
                    <option value="Electrical & Electronics">Electrical & Electronics</option>
                    <option value="Office & IT Supplies">Office & IT Supplies</option>
                    <option value="Facility & Cleaning">Facility & Cleaning</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">SKU</label>
                  <input
                    type="text"
                    value={newProdSku}
                    onChange={(e) => setNewProdSku(e.target.value)}
                    placeholder="e.g. SAF-GLV-008"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">MOQ</label>
                  <input
                    type="number"
                    value={newProdMoq}
                    onChange={(e) => setNewProdMoq(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unit</label>
                  <input
                    type="text"
                    value={newProdUnit}
                    onChange={(e) => setNewProdUnit(e.target.value)}
                    placeholder="Pieces, Boxes, Sets"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default CatalogPage;
