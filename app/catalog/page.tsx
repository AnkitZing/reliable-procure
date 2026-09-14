'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { EnterpriseSidebar } from '@/components/EnterpriseSidebar';
import { useReliableStore } from '@/lib/store';
import { Product } from '@/lib/types';
import { RACKNSELL_CATEGORIES } from '@/lib/categories-data';
import { 
  Search, Filter, ShoppingBag, Plus, 
  ShieldCheck, ArrowRight, Check, Tag, Sparkles,
  Layers, UploadCloud, Building2, CheckCircle2, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

function CatalogContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const searchParams = useSearchParams();

  const initialCat = searchParams.get('cat') || 'ALL';
  const initialQ = searchParams.get('q') || '';
  const initialBrand = searchParams.get('brand') || '';
  const activeView = searchParams.get('view') || 'products';

  const { products, addToCart, currentRole, addProduct, bulkAddProducts } = useReliableStore();

  const [searchQuery, setSearchQuery] = useState(initialQ);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  // Sync state when URL params change
  useEffect(() => {
    if (searchParams.get('cat')) setSelectedCategory(searchParams.get('cat')!);
    if (searchParams.get('q')) setSearchQuery(searchParams.get('q')!);
    if (searchParams.get('brand')) setSelectedBrand(searchParams.get('brand')!);
  }, [searchParams]);

  // New product modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Safety Equipment & Gear');
  const [newProdPrice, setNewProdPrice] = useState(500);
  const [newProdMoq, setNewProdMoq] = useState(5);
  const [newProdHsn, setNewProdHsn] = useState('650610');
  const [newProdUnit, setNewProdUnit] = useState('Pieces');

  // Bulk Upload State
  const [csvUploaded, setCsvUploaded] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'ALL' || 
      product.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      selectedCategory.toLowerCase().includes(product.category.toLowerCase());

    const matchesBrand = !selectedBrand || product.brand.toLowerCase() === selectedBrand.toLowerCase();

    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesBrand && matchesSearch;
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

  // Extract all unique brands
  const allBrands = Array.from(new Set(products.map(p => p.brand)));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <EnterpriseSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Header & Submenu Navigation Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
                <ShoppingBag className="w-4 h-4" />
                <span>Enterprise Sourcing Catalog</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                Pre-Negotiated Industrial MRO & Supplies
              </h1>
              <p className="text-xs text-slate-500">
                13 Full Categories &bull; Automated Volume Tiers &bull; Instant Requisition PR Generation
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/catalog"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeView === 'products' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                All Products
              </Link>
              <Link
                href="/catalog?view=categories"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeView === 'categories' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Category Master (L0-L2)
              </Link>
              <Link
                href="/catalog?view=brands"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeView === 'brands' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Brand Directory
              </Link>
              <Link
                href="/catalog?view=bulk-upload"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeView === 'bulk-upload' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Bulk CSV Tiers
              </Link>

              {(currentRole === 'SUPER_ADMIN' || currentRole === 'VENDOR') && (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add SKU</span>
                </button>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SUB-VIEW 1: CATEGORY MASTER (L0 / L1 / L2 Taxonomy) */}
          {/* ========================================================================= */}
          {activeView === 'categories' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h2 className="text-base font-black text-slate-900">
                  RacknSell 13-Category Master Taxonomy Hierarchy
                </h2>
                <p className="text-xs text-slate-500">
                  Standardized industrial procurement taxonomy mapped across Level-0 (Division), Level-1 (Sub-segment), and Level-2 (Line Items).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {RACKNSELL_CATEGORIES.map((cat) => (
                  <div key={cat.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider">Level 0 Category</span>
                        <h3 className="text-base font-black text-slate-900">{cat.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{cat.description}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-mono font-bold">
                        {cat.productCount} SKUs
                      </span>
                    </div>

                    {/* L1 & L2 subcategories breakdown */}
                    <div className="space-y-3">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        L1 Subcategories & L2 Specifications:
                      </span>
                      <div className="space-y-2">
                        {cat.subcategories.map((sub) => (
                          <div key={sub.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                            <div className="font-bold text-slate-800 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                              <span>{sub.name}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 pl-3">
                              {sub.items.map((item, i) => (
                                <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-[11px] text-slate-500 font-medium">
                        Brands: {cat.featuredBrands.join(', ')}
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCategory(cat.name);
                          window.location.href = `/catalog?cat=${encodeURIComponent(cat.name)}`;
                        }}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Filter Catalog</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUB-VIEW 2: BRAND DIRECTORY */}
          {/* ========================================================================= */}
          {activeView === 'brands' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h2 className="text-base font-black text-slate-900">
                  Authorized Industrial Brands & Direct Manufacturer Desks
                </h2>
                <p className="text-xs text-slate-500">
                  OEM-authorized distribution channels with factory test reports and genuine manufacturer warranty.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {allBrands.map((brand) => {
                  const brandCount = products.filter(p => p.brand === brand).length;
                  return (
                    <button
                      key={brand}
                      onClick={() => {
                        setSelectedBrand(brand);
                        window.location.href = `/catalog?brand=${encodeURIComponent(brand)}`;
                      }}
                      className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition text-center space-y-2 cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-black text-sm mx-auto group-hover:bg-blue-600 group-hover:text-white transition">
                        {brand.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">
                        {brand}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {brandCount} Verified SKUs
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUB-VIEW 3: BULK CSV PRICE TIERS UPLOAD */}
          {/* ========================================================================= */}
          {activeView === 'bulk-upload' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h2 className="text-base font-black text-slate-900">
                  Bulk CSV Pricing & Volume Tier Upload
                </h2>
                <p className="text-xs text-slate-500">
                  Upload standard RacknSell-formatted CSV catalog files to update contract rates, MOQ thresholds, and multi-tier quantity discounts across all 13 categories.
                </p>

                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center space-y-3 bg-slate-50/50">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Drag & Drop CSV / Excel Catalog Master File
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Supports .csv, .xlsx up to 50MB (Headers: SKU, Name, Category, BasePrice, ContractPrice, MOQ, Tier1, Tier2)
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      bulkAddProducts([
                        {
                          name: 'Fluke 101 Pocket Digital Multimeter 600V CAT III',
                          sku: 'FLK-101',
                          category: 'Test & Measuring Instruments',
                          description: 'Factory calibrated CAT III 600V safety rated compact digital multimeter.',
                          brand: 'Fluke',
                          basePrice: 3450,
                          contractPrice: 3105,
                          hsnCode: '903031',
                          gstRate: 18,
                          unit: 'Pieces',
                          moq: 2,
                          stock: 120,
                          image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
                          tiers: [
                            { minQty: 2, price: 3105 },
                            { minQty: 10, price: 2890 }
                          ],
                          vendorId: 'comp-ven-01',
                          vendorName: 'Industrial Supply Hub LLP'
                        },
                        {
                          name: '3M SecureFit 400 Protective Eyewear Anti-Fog Clear',
                          sku: '3M-SEC-92',
                          category: 'Safety Equipment & Gear',
                          description: 'Pressure diffusion temple technology for self-adjusting comfort.',
                          brand: '3M Industrial',
                          basePrice: 380,
                          contractPrice: 342,
                          hsnCode: '900490',
                          gstRate: 18,
                          unit: 'Pieces',
                          moq: 20,
                          stock: 800,
                          image: 'https://images.unsplash.com/photo-1578873375972-00b86a87747e?auto=format&fit=crop&w=600&q=80',
                          tiers: [
                            { minQty: 20, price: 342 },
                            { minQty: 100, price: 299 }
                          ],
                          vendorId: 'comp-ven-01',
                          vendorName: 'Industrial Supply Hub LLP'
                        }
                      ]);
                      setCsvUploaded(true);
                      setTimeout(() => setCsvUploaded(false), 5000);
                    }}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                  >
                    Simulate Upload & Ingest Batch
                  </button>
                </div>

                {csvUploaded && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Success! Verified SKUs and pre-negotiated volume discount pricing rules ingested into catalog master.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUB-VIEW 4: DEFAULT PRODUCTS VIEW WITH 13 CATEGORY CHIPS & SEARCH */}
          {/* ========================================================================= */}
          {activeView === 'products' && (
            <div className="space-y-6">
              
              {/* Category Filter Pills (All 13 RacknSell Categories) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                <button
                  onClick={() => { setSelectedCategory('ALL'); setSelectedBrand(''); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
                    selectedCategory === 'ALL' && !selectedBrand
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  All Categories ({products.length})
                </button>

                {RACKNSELL_CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat.name;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.name); setSelectedBrand(''); }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>

              {/* Search & Active Filter Indicators */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by SKU, product name, brand, specifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 transition"
                  />
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-slate-500 font-medium">
                  <span>Showing <strong>{filteredProducts.length}</strong> items</span>
                  {(selectedCategory !== 'ALL' || selectedBrand || searchQuery) && (
                    <button
                      onClick={() => { setSelectedCategory('ALL'); setSelectedBrand(''); setSearchQuery(''); }}
                      className="text-blue-600 font-bold hover:underline cursor-pointer ml-2"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Products Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => {
                  const qty = getQty(product.id, product.moq);
                  const effectivePrice = product.contractPrice || product.basePrice;
                  const itemTotal = effectivePrice * qty;

                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden group"
                    >
                      {/* Product Image */}
                      <div className="relative h-44 bg-slate-100 overflow-hidden">
                        <Link href={`/product/${product.id}`} className="w-full h-full block">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        </Link>
                        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-blue-600/90 backdrop-blur-md text-white font-bold text-[10px]">
                          {product.category}
                        </div>
                        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white font-mono text-[10px]">
                          MOQ: {product.moq} {product.unit}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
                            <span>{product.brand}</span>
                            <span className="font-mono text-[10px]">{product.sku}</span>
                          </div>
                          <Link href={`/product/${product.id}`}>
                            <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-2 leading-snug">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                            {product.description}
                          </p>
                        </div>

                        {/* Volume Discount Tiers Strip */}
                        {product.tiers && product.tiers.length > 0 && (
                          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                            <span className="text-[9px] font-bold uppercase text-slate-400 block tracking-wider">
                              Volume Discount Tiers:
                            </span>
                            <div className="flex items-center justify-between text-[10px] font-mono">
                              {product.tiers.map((t, idx) => (
                                <span key={idx} className="text-slate-600">
                                  {t.minQty}+: <strong className="text-blue-600">₹{t.price}</strong>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Price Breakdown */}
                        <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                          <div>
                            <span className="text-base font-black text-slate-900 font-mono">
                              ₹{effectivePrice.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-slate-500 ml-1">/{product.unit}</span>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                            + {product.gstRate}% GST
                          </span>
                        </div>

                        {/* Quantity & Add to PR Button */}
                        <div className="flex items-center gap-2 pt-1">
                          <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden shrink-0">
                            <button
                              onClick={() => handleQtyChange(product.id, qty - 1, product.moq)}
                              className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 text-xs font-bold cursor-pointer"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-bold font-mono text-slate-800">
                              {qty}
                            </span>
                            <button
                              onClick={() => handleQtyChange(product.id, qty + 1, product.moq)}
                              className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 text-xs font-bold cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => handleAddToCart(product)}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                              addedNotice === product.id
                                ? 'bg-emerald-600 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs'
                            }`}
                          >
                            {addedNotice === product.id ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Added!</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Add to PR</span>
                              </>
                            )}
                          </button>

                          <Link
                            href={`/product/${product.id}`}
                            className="px-2.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition"
                            title="View Specs & Volume Tiers"
                          >
                            View
                          </Link>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* Add SKU Modal */}
          {isAddModalOpen && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
                <h3 className="text-base font-black text-slate-900">Add New SKU to Catalog</h3>
                <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Product Name</label>
                    <input
                      required
                      type="text"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                      placeholder="e.g. Industrial High Bay 150W LED"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Category</label>
                      <select
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                      >
                        {RACKNSELL_CATEGORIES.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Base Price (₹)</label>
                      <input
                        required
                        type="number"
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                    >
                      Save Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 p-8 text-xs text-slate-500">Loading Sourcing Catalog...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
