'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { EnterpriseSidebar } from '@/components/EnterpriseSidebar';
import { QuoteModal } from '@/components/QuoteModal';
import { useReliableStore } from '@/lib/store';
import { Product } from '@/lib/types';
import { 
  ShieldCheck, Truck, ShoppingCart, FileText, CheckCircle2, 
  Clock, MapPin, Download, Star, ChevronRight, Copy, 
  Check, ArrowRight, Building2, AlertCircle, RefreshCw,
  Package, Award, HelpCircle, Share2, Sparkles, Layers
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const { products, addToCart, companies, currentUser } = useReliableStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Find product from store or fallback
  const product: Product | undefined = useMemo(() => {
    return products.find(p => p.id === productId || p.sku.toLowerCase() === productId?.toLowerCase());
  }, [products, productId]);

  // Product interactive states
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(product?.moq || 1);
  const [activeTab, setActiveTab] = useState<'specs' | 'tax' | 'docs' | 'reviews'>('specs');
  const [pincodeInput, setPincodeInput] = useState('411018');
  const [pincodeChecked, setPincodeChecked] = useState(true);
  const [copiedSku, setCopiedSku] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);
  const [prCreatedNotice, setPrCreatedNotice] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Update initial quantity when product loads
  React.useEffect(() => {
    if (product) {
      setQuantity(product.moq || 1);
      setSelectedImage(product.image);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Product Not Found</h1>
          <p className="text-sm text-slate-500">
            The requested industrial SKU or product identifier does not exist in the active catalog.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <Link
              href="/catalog"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              Back to Catalog
            </Link>
            <Link
              href="/"
              className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition"
            >
              Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate dynamic volume tier price
  const activePrice = useMemo(() => {
    if (!product.tiers || product.tiers.length === 0) {
      return product.contractPrice || product.basePrice;
    }
    // Find best tier for current quantity
    const sortedTiers = [...product.tiers].sort((a, b) => b.minQty - a.minQty);
    const matchedTier = sortedTiers.find(t => quantity >= t.minQty);
    return matchedTier ? matchedTier.price : (product.contractPrice || product.basePrice);
  }, [product, quantity]);

  const unitPriceInclGst = Math.round((activePrice * (1 + (product.gstRate / 100))) * 100) / 100;
  const subtotalExclGst = Math.round((activePrice * quantity) * 100) / 100;
  const gstAmount = Math.round((subtotalExclGst * (product.gstRate / 100)) * 100) / 100;
  const totalAmountInclGst = Math.round((subtotalExclGst + gstAmount) * 100) / 100;

  const handleCopySku = () => {
    navigator.clipboard.writeText(product.sku);
    setCopiedSku(true);
    setTimeout(() => setCopiedSku(false), 2000);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleRaiseImmediatePR = () => {
    addToCart(product, quantity);
    setPrCreatedNotice(true);
    setTimeout(() => {
      setPrCreatedNotice(false);
      router.push('/requisitions');
    }, 1200);
  };

  // Gallery items
  const galleryImages = product.gallery && product.gallery.length > 0 
    ? [product.image, ...product.gallery.filter(img => img !== product.image)]
    : [product.image];

  // Related products from same category
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <EnterpriseSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
          
          {/* 1. BREADCRUMBS */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto pb-1">
            <Link href="/" className="hover:text-blue-600 transition shrink-0">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link href="/catalog" className="hover:text-blue-600 transition shrink-0">Catalog</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link 
              href={`/catalog?cat=${encodeURIComponent(product.category)}`}
              className="hover:text-blue-600 transition shrink-0 font-medium text-slate-700"
            >
              {product.category}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-900 font-bold truncate max-w-[280px]">
              {product.name}
            </span>
          </nav>

          {/* 2. MAIN PRODUCT HERO: 2-COLUMN DISPLAY */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT: IMAGE GALLERY VIEWER (5 Columns) */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* Main Large Display Image */}
                <div className="relative aspect-4/3 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center p-4 group">
                  <img
                    src={selectedImage || product.image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                  />
                  
                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-blue-600/90 backdrop-blur-md text-white font-bold text-xs shadow-xs">
                    {product.category}
                  </div>

                  {/* Stock Status Badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-emerald-600/90 backdrop-blur-md text-white font-bold text-xs flex items-center gap-1 shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>In Stock ({product.stock} {product.unit})</span>
                  </div>
                </div>

                {/* Thumbnail Strip */}
                {galleryImages.length > 1 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-1">
                    {galleryImages.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(imgUrl)}
                        className={`w-18 h-18 rounded-xl border-2 overflow-hidden shrink-0 bg-slate-50 transition cursor-pointer p-1 ${
                          (selectedImage === imgUrl || (!selectedImage && idx === 0))
                            ? 'border-blue-600 shadow-xs ring-2 ring-blue-100'
                            : 'border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Industrial Assurance Callouts */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px] font-bold text-slate-600">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto" />
                    <div>100% Genuine OEM</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <Truck className="w-4 h-4 text-blue-600 mx-auto" />
                    <div>Direct Plant Dispatch</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <Award className="w-4 h-4 text-amber-600 mx-auto" />
                    <div>Factory Warranty</div>
                  </div>
                </div>

              </div>

              {/* RIGHT: BUY BOX & COMMERCIAL SPECIFICATIONS (7 Columns) */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                
                {/* Header Information */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-xs">
                      {product.brand}
                    </span>

                    {/* Copyable SKU */}
                    <button
                      onClick={handleCopySku}
                      className="px-2.5 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 font-mono text-xs flex items-center gap-1 transition cursor-pointer"
                      title="Click to copy SKU"
                    >
                      <span>SKU: <strong>{product.sku}</strong></span>
                      {copiedSku ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                    </button>

                    <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono text-xs font-semibold">
                      HSN: {product.hsnCode}
                    </span>

                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-mono text-xs font-bold">
                      {product.gstRate}% GST ITC
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                    {product.name}
                  </h1>

                  {/* Rating & Reviews */}
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>4.8</span>
                    </div>
                    <span className="text-slate-300">|</span>
                    <span className="text-slate-500 font-medium">142 Enterprise Buyer Reviews</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Verified Sourcing Contract</span>
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                    {product.description}
                  </p>
                </div>

                {/* PRICING & VOLUME DISCOUNT MATRIX */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200 space-y-4">
                  
                  {/* Price Row */}
                  <div className="flex flex-wrap items-baseline justify-between gap-2 pb-3 border-b border-slate-200">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                          ₹{activePrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          excl. GST / {product.unit}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        <span className="font-semibold text-slate-700 font-mono">₹{unitPriceInclGst.toLocaleString('en-IN')}</span> incl. {product.gstRate}% GST
                        {product.basePrice > activePrice && (
                          <span className="ml-2 line-through text-slate-400 font-mono">
                            MRP ₹{product.basePrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 text-xs font-bold">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>Reliable Rate Contract</span>
                      </span>
                    </div>
                  </div>

                  {/* Volume Tier Discount Cards */}
                  {product.tiers && product.tiers.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center justify-between">
                        <span>Volume Wholesale Tiers:</span>
                        <span className="text-blue-600 font-semibold normal-case">
                          Order larger lots for automatic discount
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {product.tiers.map((tier, idx) => {
                          const isTierActive = activePrice === tier.price;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setQuantity(tier.minQty)}
                              className={`p-2.5 rounded-xl border text-center transition cursor-pointer space-y-0.5 ${
                                isTierActive 
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                              }`}
                            >
                              <div className={`text-[10px] font-bold ${isTierActive ? 'text-blue-100' : 'text-slate-500'}`}>
                                {tier.minQty}+ {product.unit}
                              </div>
                              <div className="text-xs sm:text-sm font-black font-mono">
                                ₹{tier.price.toLocaleString('en-IN')}
                              </div>
                              <div className={`text-[9px] font-medium ${isTierActive ? 'text-blue-200' : 'text-emerald-600'}`}>
                                {Math.round(((product.basePrice - tier.price) / product.basePrice) * 100)}% Savings
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quantity Stepper & Calculation */}
                  <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">
                        Order Quantity (MOQ: {product.moq} {product.unit})
                      </label>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-2xs">
                          <button
                            onClick={() => setQuantity(prev => Math.max(product.moq, prev - 1))}
                            className="px-3.5 py-2 text-slate-700 hover:bg-slate-100 text-sm font-bold cursor-pointer transition"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min={product.moq}
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(product.moq, Number(e.target.value)))}
                            className="w-16 text-center text-xs font-bold font-mono text-slate-900 focus:outline-none"
                          />
                          <button
                            onClick={() => setQuantity(prev => prev + 1)}
                            className="px-3.5 py-2 text-slate-700 hover:bg-slate-100 text-sm font-bold cursor-pointer transition"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-xs font-medium text-slate-500">{product.unit}</span>
                      </div>
                    </div>

                    {/* Live Subtotal */}
                    <div className="sm:text-right space-y-0.5">
                      <div className="text-[11px] text-slate-500 font-medium">
                        Subtotal (Incl. {product.gstRate}% GST):
                      </div>
                      <div className="text-xl font-black text-slate-900 font-mono">
                        ₹{totalAmountInclGst.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        (Base: ₹{subtotalExclGst.toLocaleString('en-IN')} + GST: ₹{gstAmount.toLocaleString('en-IN')})
                      </div>
                    </div>
                  </div>

                </div>

                {/* ACTION BUTTONS (Add to Cart, Raise PR, RFQ) */}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Add to Cart / PR Drawer */}
                    <button
                      onClick={handleAddToCart}
                      className={`py-3.5 px-4 rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer ${
                        addedNotice 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                      }`}
                    >
                      {addedNotice ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Added {quantity} {product.unit} to Cart!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          <span>Add to Requisition Cart</span>
                        </>
                      )}
                    </button>

                    {/* Immediate PR Generation */}
                    <button
                      onClick={handleRaiseImmediatePR}
                      className="py-3.5 px-4 rounded-xl text-xs font-bold bg-slate-900 hover:bg-black text-white shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {prCreatedNotice ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Creating PR & Redirecting...</span>
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4 text-blue-400" />
                          <span>Raise Immediate PR (Buy Now)</span>
                        </>
                      )}
                    </button>

                  </div>

                  {/* Request Custom Bulk Quote (RFQ) Modal Trigger */}
                  <button
                    onClick={() => setIsQuoteModalOpen(true)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition flex items-center justify-center gap-2 cursor-pointer group"
                  >
                    <HelpCircle className="w-4 h-4 text-indigo-600" />
                    <span>Need Custom High Volume Pricing? <strong>Request Bulk RFQ</strong></span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition" />
                  </button>
                </div>

                {/* PINCODE DELIVERY CHECKER & FULFILLMENT CREDENTIALS */}
                <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  
                  {/* Pincode Checker */}
                  <div className="space-y-2">
                    <label className="font-bold text-slate-700 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>Delivery Availability</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={pincodeInput}
                        onChange={(e) => setPincodeInput(e.target.value)}
                        placeholder="Enter 6-digit Pincode"
                        className="w-36 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                      />
                      <button
                        onClick={() => setPincodeChecked(true)}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg text-xs transition cursor-pointer"
                      >
                        Check
                      </button>
                    </div>

                    {pincodeChecked && (
                      <div className="text-[11px] text-emerald-700 font-medium space-y-0.5">
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Delivery available to Pincode <strong>{pincodeInput}</strong></span>
                        </div>
                        <div className="text-slate-500 pl-4">
                          Dispatched in <strong>{product.leadTimeDays || 1}-2 days</strong> via BlueDart Cargo / Delhivery
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Supplier Info Card */}
                  <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                      Fulfilled & Supplied By:
                    </div>
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>{product.vendorName}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 space-y-0.5">
                      <div>GSTIN: <span className="font-mono font-bold text-slate-700">07AABCO4829K1Z5</span> (Verified)</div>
                      <div className="text-emerald-700 font-bold">98.4% On-Time In-Full (OTIF) Delivery Rating</div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>

          {/* 3. TABBED SPECIFICATIONS & TECHNICAL COMPLIANCE */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            
            {/* Tab Headers */}
            <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-200 bg-slate-50/50 overflow-x-auto">
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-3 px-3 text-xs font-bold border-b-2 transition cursor-pointer shrink-0 ${
                  activeTab === 'specs'
                    ? 'border-blue-600 text-blue-600 font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Technical Specifications
              </button>

              <button
                onClick={() => setActiveTab('tax')}
                className={`pb-3 px-3 text-xs font-bold border-b-2 transition cursor-pointer shrink-0 ${
                  activeTab === 'tax'
                    ? 'border-blue-600 text-blue-600 font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Tax & Commercial Terms
              </button>

              <button
                onClick={() => setActiveTab('docs')}
                className={`pb-3 px-3 text-xs font-bold border-b-2 transition cursor-pointer shrink-0 ${
                  activeTab === 'docs'
                    ? 'border-blue-600 text-blue-600 font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Compliance & Datasheets (PDF)
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 px-3 text-xs font-bold border-b-2 transition cursor-pointer shrink-0 ${
                  activeTab === 'reviews'
                    ? 'border-blue-600 text-blue-600 font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Enterprise Customer Reviews (142)
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-6">
              
              {/* TAB 1: TECHNICAL SPECIFICATIONS */}
              {activeTab === 'specs' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 mb-3">
                      Standard Industrial Specifications Table
                    </h3>
                    
                    <div className="border border-slate-200 rounded-2xl overflow-hidden">
                      <table className="w-full text-left text-xs border-collapse">
                        <tbody>
                          <tr className="border-b border-slate-100 bg-slate-50/50">
                            <td className="py-2.5 px-4 font-bold text-slate-500 w-1/3">Brand / Manufacturer</td>
                            <td className="py-2.5 px-4 font-bold text-slate-900">{product.brand}</td>
                          </tr>
                          <tr className="border-b border-slate-100">
                            <td className="py-2.5 px-4 font-bold text-slate-500">Manufacturer SKU / Part No</td>
                            <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{product.sku}</td>
                          </tr>
                          <tr className="border-b border-slate-100 bg-slate-50/50">
                            <td className="py-2.5 px-4 font-bold text-slate-500">Product Category</td>
                            <td className="py-2.5 px-4 text-slate-900">{product.category}</td>
                          </tr>
                          <tr className="border-b border-slate-100">
                            <td className="py-2.5 px-4 font-bold text-slate-500">Packaging Unit</td>
                            <td className="py-2.5 px-4 text-slate-900">{product.unit} (MOQ: {product.moq} {product.unit})</td>
                          </tr>
                          <tr className="border-b border-slate-100 bg-slate-50/50">
                            <td className="py-2.5 px-4 font-bold text-slate-500">Country of Origin</td>
                            <td className="py-2.5 px-4 text-slate-900">{product.origin || 'India (Make in India Compliant)'}</td>
                          </tr>
                          <tr className="border-b border-slate-100">
                            <td className="py-2.5 px-4 font-bold text-slate-500">Standard Warranty</td>
                            <td className="py-2.5 px-4 text-slate-900">{product.warranty || '12 Months Manufacturer Warranty against manufacturing defects'}</td>
                          </tr>

                          {/* Dynamic specifications from product data */}
                          {product.specifications && Object.entries(product.specifications).map(([key, val], idx) => (
                            <tr key={key} className={idx % 2 === 0 ? 'border-b border-slate-100 bg-slate-50/50' : 'border-b border-slate-100'}>
                              <td className="py-2.5 px-4 font-bold text-slate-500">{key}</td>
                              <td className="py-2.5 px-4 text-slate-900 font-medium">{val}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Standards & Certifications */}
                  {product.standards && product.standards.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                        Statutory Certifications & Testing Standards
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {product.standards.map((std, idx) => (
                          <span key={idx} className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{std}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Functional Highlights */}
                  {product.features && product.features.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                        Key Engineering Highlights
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
                        {product.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: TAX & COMMERCIAL TERMS */}
              {activeTab === 'tax' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-slate-900">
                    B2B Commercial, Invoicing & Tax Compliance
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="font-bold text-slate-800 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span>GST & Input Tax Credit (ITC)</span>
                      </div>
                      <p className="text-slate-600">
                        Every transaction is accompanied by a compliant GST Tax Invoice. The HSN code for this item is <strong>{product.hsnCode}</strong> with an applicable GST rate of <strong>{product.gstRate}%</strong>.
                      </p>
                      <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                        100% Eligible for B2B Input Tax Credit (ITC)
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="font-bold text-slate-800 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-purple-600" />
                        <span>Corporate Credit & Payment Terms</span>
                      </div>
                      <p className="text-slate-600">
                        Enterprise accounts onboarded under Reliable master rate contracts can utilize <strong>Net 30 / Net 45</strong> corporate credit limits upon 3-way matching of GRN and digital PO.
                      </p>
                      <div className="text-slate-500 font-mono text-[11px]">
                        Payment Modes: RTGS / NEFT / Corporate Credit Line / Digital Mandate
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DATASHEETS & PDF DOWNLOADS */}
              {activeTab === 'docs' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-slate-900">
                    OEM Documentation, Test Certificates & Manuals
                  </h3>
                  <p className="text-xs text-slate-500">
                    Download authentic technical literature and test reports approved by plant safety officers.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition space-y-2">
                      <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                        PDF
                      </div>
                      <div className="font-bold text-xs text-slate-900">
                        Technical Data Sheet (TDS)
                      </div>
                      <div className="text-[10px] text-slate-400">PDF &bull; 1.4 MB &bull; Rev 2026</div>
                      <button 
                        onClick={() => alert(`Downloading TDS for ${product.name}`)}
                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download TDS</span>
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition space-y-2">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                        PDF
                      </div>
                      <div className="font-bold text-xs text-slate-900">
                        Material Safety Data Sheet (MSDS)
                      </div>
                      <div className="text-[10px] text-slate-400">PDF &bull; 890 KB &bull; REACH Compliant</div>
                      <button 
                        onClick={() => alert(`Downloading MSDS for ${product.name}`)}
                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download MSDS</span>
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition space-y-2">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        PDF
                      </div>
                      <div className="font-bold text-xs text-slate-900">
                        BIS / ISI Test Certificate
                      </div>
                      <div className="text-[10px] text-slate-400">PDF &bull; 2.1 MB &bull; NABL Lab Certified</div>
                      <button 
                        onClick={() => alert(`Downloading Test Certificate for ${product.name}`)}
                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Certificate</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: REVIEWS */}
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        Verified Corporate Customer Feedback
                      </h3>
                      <p className="text-xs text-slate-500">
                        Ratings collected from certified enterprise procurement managers & safety officers.
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-slate-900">4.8 / 5.0</div>
                      <div className="text-[10px] text-slate-400">Based on 142 orders</div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                          <span>Tata Advanced Systems Ltd &bull; Plant Operations</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Verified Buyer</span>
                        </div>
                        <span className="text-[10px] text-slate-400">Ordered 200 Units &bull; 2 weeks ago</span>
                      </div>
                      <div className="flex text-amber-400 text-xs">★★★★★</div>
                      <p className="text-xs text-slate-600">
                        Excellent OEM build quality. Material arrived with full test certificates, batch numbers, and factory packaging. Direct integration with our SAP PO workflow was seamless.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                          <span>Larsen & Toubro Infra &bull; EHS Dept</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Verified Buyer</span>
                        </div>
                        <span className="text-[10px] text-slate-400">Ordered 50 Units &bull; 1 month ago</span>
                      </div>
                      <div className="flex text-amber-400 text-xs">★★★★★</div>
                      <p className="text-xs text-slate-600">
                        Delivered on schedule to our site warehouse. Strict compliance with IS specifications. Volume tier discount helped us save almost 18% over open-market retail quotes.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* 4. FREQUENTLY BOUGHT TOGETHER / RELATED ITEMS */}
          {relatedProducts.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Related Industrial Equipment in {product.category}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Frequently procured together under common enterprise rate contracts
                  </p>
                </div>
                <Link
                  href={`/catalog?cat=${encodeURIComponent(product.category)}`}
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <span>View Full Category</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedProducts.map(rel => (
                  <Link
                    key={rel.id}
                    href={`/product/${rel.id}`}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between p-4 space-y-3 group"
                  >
                    <div className="aspect-4/3 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center p-2">
                      <img src={rel.image} alt={rel.name} className="w-full h-full object-contain group-hover:scale-105 transition" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">{rel.brand}</div>
                      <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 line-clamp-2 transition mt-0.5">
                        {rel.name}
                      </h3>
                      <div className="text-xs font-black text-slate-900 font-mono mt-2">
                        ₹{(rel.contractPrice || rel.basePrice).toLocaleString('en-IN')}
                        <span className="text-[10px] text-slate-400 font-normal ml-1">/{rel.unit}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Global Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        prefilledProduct={product}
      />
    </div>
  );
}
