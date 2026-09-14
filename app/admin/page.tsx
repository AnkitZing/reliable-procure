'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useReliableStore } from '@/lib/store';
import { RACKNSELL_CATEGORIES } from '@/lib/categories-data';
import { 
  Menu, X, Bell, Phone, MessageCircle, 
  ChevronDown, ChevronRight, User, ShoppingCart, 
  Layers, Truck, Building2, FileText, CheckCircle2, 
  Clock, AlertTriangle, AlertCircle, RotateCcw, 
  BarChart3, Shield, LogOut, Search, Plus, 
  ExternalLink, Check, Eye, Package, Boxes, Printer,
  Sliders, ArrowRight, DollarSign, Award, FileCheck,
  TrendingUp, Download, UploadCloud, RefreshCw, Activity,
  Scale, ShieldAlert, Cpu, Hash, Landmark, FileSpreadsheet
} from 'lucide-react';

// Order Details mock data matching user's exact screenshot
interface AdminOrderItem {
  sku: string;
  name: string;
  description: string;
  image: string;
  unitPriceExclGst: number;
  taxRate: number;
  unitPriceInclGst: number;
  quantity: number;
  unit: string;
  totalAmountInclGst: number;
  status: 'Cancelled' | 'Delivered' | 'In Transit' | 'Pending';
}

interface AdminOrder {
  masterOrderId: string;
  orderId: string;
  buyerName: string;
  supplierName: string;
  orderDate: string;
  carrier?: string;
  awbNumber?: string;
  status: 'Cancelled' | 'Delivered' | 'In Transit' | 'Pending';
  items: AdminOrderItem[];
}

const SAMPLE_ADMIN_ORDERS: AdminOrder[] = [
  {
    masterOrderId: 'PO004931',
    orderId: 'PO0049310',
    buyerName: 'Concentrix',
    supplierName: 'Om Fire Services',
    orderDate: '2026-09-12',
    status: 'Cancelled',
    items: [
      {
        sku: 'RS077134',
        name: 'Fire Extinguisher Refilling ABC MAP90 6kg With HP Testing, Nos',
        description: 'Fire Extinguisher refilling ABC MAP90 6kg With HP Testing, ',
        image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80',
        unitPriceExclGst: 850.00,
        taxRate: 18.00,
        unitPriceInclGst: 1003.00,
        quantity: 11,
        unit: 'Nos',
        totalAmountInclGst: 11033.00,
        status: 'Cancelled'
      },
      {
        sku: 'RS077146',
        name: 'Fire Extinguisher Refilling Clean Agent FE36 Modular 5kg With HP Testing, Nos',
        description: 'Fire Extinguisher refilling Clean Agent FE36 Modular 5kg With HP Testing, ',
        image: 'https://images.unsplash.com/photo-1603555501671-8f96b3fce8b4?auto=format&fit=crop&w=400&q=80',
        unitPriceExclGst: 12609.00,
        taxRate: 18.00,
        unitPriceInclGst: 14878.62,
        quantity: 3,
        unit: 'Nos',
        totalAmountInclGst: 44635.86,
        status: 'Cancelled'
      }
    ]
  },
  {
    masterOrderId: 'PO004932',
    orderId: 'PO0049321',
    buyerName: 'Tata Advanced Systems Ltd',
    supplierName: 'Industrial Supply Hub LLP',
    orderDate: '2026-09-13',
    carrier: 'BlueDart Express',
    awbNumber: 'BLUEDART-8829104',
    status: 'In Transit',
    items: [
      {
        sku: 'ELE-MCB-004',
        name: 'Schneider Electric Acti9 32A Triple Pole MCB (C-Curve)',
        description: '10kA breaking capacity miniature circuit breaker for plant distribution board',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80',
        unitPriceExclGst: 1016.95,
        taxRate: 18.00,
        unitPriceInclGst: 1200.00,
        quantity: 35,
        unit: 'Pieces',
        totalAmountInclGst: 42000.00,
        status: 'In Transit'
      }
    ]
  },
  {
    masterOrderId: 'PO004933',
    orderId: 'PO0049332',
    buyerName: 'Larsen & Toubro Infra',
    supplierName: 'Karam Safety Solutions',
    orderDate: '2026-09-14',
    carrier: 'Delhivery Surface',
    awbNumber: 'DELHIVERY-992144',
    status: 'Delivered',
    items: [
      {
        sku: 'SAF-HLM-001',
        name: 'Karam Industrial Safety Helmet (ISI Certified)',
        description: 'High density polymer safety helmet with 4-point suspension harness',
        image: 'https://images.unsplash.com/photo-1578873375972-00b86a87747e?auto=format&fit=crop&w=400&q=80',
        unitPriceExclGst: 207.63,
        taxRate: 18.00,
        unitPriceInclGst: 245.00,
        quantity: 80,
        unit: 'Pieces',
        totalAmountInclGst: 19600.00,
        status: 'Delivered'
      }
    ]
  },
  {
    masterOrderId: 'PO004934',
    orderId: 'PO0049343',
    buyerName: 'Siemens India Ltd',
    supplierName: 'Industrial Supply Hub LLP',
    orderDate: '2026-09-14',
    status: 'Pending',
    items: [
      {
        sku: 'MRO-DRL-002',
        name: 'Bosch GSB 500W Professional Impact Drill Kit',
        description: 'Heavy duty 500W corded impact drill with 100-accessory maintenance toolbox kit',
        image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=400&q=80',
        unitPriceExclGst: 2923.73,
        taxRate: 18.00,
        unitPriceInclGst: 3450.00,
        quantity: 10,
        unit: 'Sets',
        totalAmountInclGst: 34500.00,
        status: 'Pending'
      }
    ]
  }
];

function AdminPortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialModule = searchParams.get('mod') || 'order-details';

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeModule, setActiveModule] = useState(initialModule);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedPoForPrint, setSelectedPoForPrint] = useState<string>('');

  // Search and filters for tables
  const [filterQuery, setFilterQuery] = useState('');

  // Interactive Form States
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierGstin, setNewSupplierGstin] = useState('');
  const [newSupplierPan, setNewSupplierPan] = useState('');
  const [newSupplierState, setNewSupplierState] = useState('Maharashtra');
  const [newSupplierTerms, setNewSupplierTerms] = useState('Net 30');
  const [newSupplierCredit, setNewSupplierCredit] = useState(2500000);
  const [supplierSuccessMsg, setSupplierSuccessMsg] = useState('');

  const [bulkCsvText, setBulkCsvText] = useState('');
  const [bulkSuccessMsg, setBulkSuccessMsg] = useState('');
  const [bulkParsedItems, setBulkParsedItems] = useState<any[]>([]);

  const [stockAdjustMap, setStockAdjustMap] = useState<Record<string, number>>({});
  const [stockSuccessMsg, setStockSuccessMsg] = useState('');

  const [simAmount, setSimAmount] = useState(18500);

  const [rejectionModal, setRejectionModal] = useState<{ prId: string; prNumber: string; reason: string } | null>(null);

  // Live Telemetry Event Stream State
  const [telemetryEvents, setTelemetryEvents] = useState([
    { id: 'EV-101', time: '12 seconds ago', type: 'AWB_PING', msg: 'BlueDart BLUEDART-8829104 scanned at Bhiwandi Sorting Hub. Estimated delivery: Tomorrow 14:00.', status: 'SUCCESS' },
    { id: 'EV-102', time: '3 mins ago', type: 'AUTO_PO', msg: 'Threshold Rule 1 executed: PO-2026-4934 auto-generated (< ₹15,000) for Tata Advanced Systems.', status: 'SUCCESS' },
    { id: 'EV-103', time: '12 mins ago', type: '3WAY_MATCH', msg: 'Automated 3-Way Match cleared for Tata Advanced Systems PO-2026-1049 (₹42,000 zero variance).', status: 'SUCCESS' },
    { id: 'EV-104', time: '26 mins ago', type: 'WEBHOOK', msg: 'SAP ERP S/4HANA PO sync webhook dispatched to Concentrix API endpoint (HTTP 200 OK).', status: 'DISPATCHED' },
    { id: 'EV-105', time: '38 mins ago', type: 'GATE_INWARD', msg: 'Vehicle MH-12-QE-4921 gate security clearance issued at Plant Gate 2, MIDC Industrial Area.', status: 'VERIFIED' }
  ]);

  // Collapsible Submenus State (Exact 12 modules from screenshot)
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    dashboard: true,
    catalogue: true,
    supplier: true,
    buydesk: true,
    buyer: true,
    orders: true, // open by default to match screenshot
    po: true,
    logistics: true,
    inventory: true,
    reports: true,
    escalation: true,
    returnOrder: true
  });

  const toggleSubmenu = (key: string) => {
    setOpenSubmenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const { 
    currentUser, products, requisitions, purchaseOrders, 
    companies, matches, addProduct, bulkAddProducts, 
    adjustProductStock, clearMatchSettlement, addCompany, 
    toggleCompanyStatus, approveRequisition, rejectRequisition 
  } = useReliableStore();

  // Merge static screenshot orders with dynamic store purchase orders
  const allAdminOrders: AdminOrder[] = [
    ...SAMPLE_ADMIN_ORDERS,
    ...purchaseOrders
      .filter(po => !SAMPLE_ADMIN_ORDERS.some(so => so.orderId === po.poNumber))
      .map(po => ({
        masterOrderId: po.prId || po.poNumber.replace('-', ''),
        orderId: po.poNumber,
        buyerName: po.companyName,
        supplierName: po.vendorName,
        orderDate: po.issuedAt ? po.issuedAt.slice(0, 10) : '2026-09-14',
        carrier: po.carrierName || 'BlueDart Express',
        awbNumber: po.trackingNumber || `BLUEDART-${Math.floor(1000000 + Math.random() * 9000000)}`,
        status: (po.status === 'DELIVERED' ? 'Delivered' : po.status === 'IN_TRANSIT' ? 'In Transit' : 'Pending') as AdminOrder['status'],
        items: po.items.map(item => ({
          sku: item.sku,
          name: item.productName,
          description: item.productName,
          image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
          unitPriceExclGst: item.unitPrice,
          taxRate: item.gstRate,
          unitPriceInclGst: Math.round(item.unitPrice * (1 + item.gstRate / 100)),
          quantity: item.quantity,
          unit: item.unit,
          totalAmountInclGst: item.totalAmount,
          status: (po.status === 'DELIVERED' ? 'Delivered' : po.status === 'IN_TRANSIT' ? 'In Transit' : 'Pending') as AdminOrderItem['status']
        }))
      }))
  ];

  const selectedOrder = allAdminOrders[selectedOrderIndex] || allAdminOrders[0];

  // Active Formal PO for Digital Print
  const digitalPo = purchaseOrders.find(p => p.poNumber === selectedPoForPrint) || purchaseOrders[0];

  // Handler for Onboarding Supplier
  const handleOnboardSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplierName || !newSupplierGstin) return;
    addCompany({
      name: newSupplierName,
      gstin: newSupplierGstin.toUpperCase(),
      pan: newSupplierPan.toUpperCase() || newSupplierGstin.substring(2, 12).toUpperCase(),
      type: 'VENDOR',
      creditLimit: Number(newSupplierCredit),
      creditUsed: 0,
      paymentTerms: newSupplierTerms,
      status: 'ACTIVE',
      billingAddress: `Plot 102, Industrial Estate, ${newSupplierState}`,
      state: newSupplierState
    });
    setSupplierSuccessMsg(`Supplier "${newSupplierName}" onboarded successfully with verified GSTIN!`);
    setNewSupplierName('');
    setNewSupplierGstin('');
    setNewSupplierPan('');
    setTimeout(() => {
      setSupplierSuccessMsg('');
      setActiveModule('supplier-list');
    }, 1800);
  };

  // Handler for CSV Ingestion
  const handleProcessBulkCsv = () => {
    if (!bulkCsvText.trim()) return;
    const lines = bulkCsvText.trim().split('\n');
    const newItems: any[] = [];

    lines.forEach(line => {
      const parts = line.split(',').map(s => s.trim());
      if (parts.length >= 4 && !parts[0].toLowerCase().includes('sku')) {
        const [sku, name, category, price, moq, brand] = parts;
        const basePrice = Number(price) || 500;
        newItems.push({
          name: name || 'Industrial MRO Item',
          sku: sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
          category: category || 'Safety Equipment & Gear',
          description: 'Factory certified commercial standard procurement item.',
          brand: brand || 'Reliable Certified',
          basePrice,
          contractPrice: Math.round(basePrice * 0.9),
          hsnCode: '850440',
          gstRate: 18,
          unit: 'Pieces',
          moq: Number(moq) || 5,
          stock: 450,
          image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
          tiers: [
            { minQty: Number(moq) || 5, price: Math.round(basePrice * 0.9) },
            { minQty: (Number(moq) || 5) * 5, price: Math.round(basePrice * 0.8) }
          ],
          vendorId: 'comp-ven-01',
          vendorName: 'Industrial Supply Hub LLP'
        });
      }
    });

    if (newItems.length > 0) {
      bulkAddProducts(newItems);
      setBulkParsedItems(newItems);
      setBulkSuccessMsg(`Successfully ingested ${newItems.length} SKUs into live catalog master!`);
      setBulkCsvText('');
    } else {
      alert('Could not parse rows. Please check comma-separated format: SKU, Product Name, Category, Price, MOQ, Brand');
    }
  };

  const handleLoadSampleCsv = () => {
    setBulkCsvText(
      `FLK-101, Fluke 101 Pocket Digital Multimeter 600V CAT III, Test & Measuring Instruments, 3450, 2, Fluke\n` +
      `3M-SEC-92, 3M SecureFit 400 Protective Eyewear Anti-Fog Clear, Safety Equipment & Gear, 380, 20, 3M Industrial\n` +
      `PLY-CBL-4C, Polycab 4-Core 4 Sq.mm Armoured Copper Power Cable (100m Drum), Electrical, 14800, 1, Polycab`
    );
  };

  const handleSimulateTelemetryPing = () => {
    const newEvent = {
      id: `EV-${Date.now().toString().slice(-4)}`,
      time: 'Just now',
      type: 'TELEMETRY_PING',
      msg: `Gate Pass GP-2026-${Math.floor(1000 + Math.random() * 9000)} generated for Vehicle MH-${Math.floor(10 + Math.random() * 89)}-AZ-${Math.floor(1000 + Math.random() * 9000)}.`,
      status: 'VERIFIED'
    };
    setTelemetryEvents(prev => [newEvent, ...prev.slice(0, 7)]);
  };

  const handleStockUpdate = (productId: string) => {
    const newQty = stockAdjustMap[productId];
    if (newQty !== undefined) {
      adjustProductStock(productId, newQty);
      setStockSuccessMsg(`Stock for product updated to ${newQty} units.`);
      setTimeout(() => setStockSuccessMsg(''), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-[#333333] flex flex-col font-sans">
      
      {/* 1. TOP HEADER (Steel Blue matching RacknSell Admin #20638f) */}
      <header className="h-12 bg-[#20638f] text-white flex items-center justify-between px-3 sm:px-4 z-50 sticky top-0 shadow-sm border-b border-[#1b547a]">
        
        {/* Left: Brand & Hamburger Toggle */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-sm tracking-wide text-white uppercase">
              Admin Reliable
            </span>
            <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.2 rounded font-mono hidden sm:inline">
              (RacknSell Portal)
            </span>
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 text-white/90 hover:text-white hover:bg-white/10 rounded transition cursor-pointer"
            title="Toggle Sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        {/* Right: WhatsApp, Notifications, User Name */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs">
          
          {/* Back to Public Web Store */}
          <Link
            href="/"
            className="hidden md:flex items-center gap-1 text-[11px] text-white/80 hover:text-white transition"
          >
            <span>&larr; Web Store</span>
          </Link>

          {/* WhatsApp Support Icon */}
          <a
            href="https://wa.me/917290090309"
            target="_blank"
            rel="noreferrer"
            className="w-7 h-7 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition shadow-xs"
            title="WhatsApp Support +91 7290090309"
          >
            <MessageCircle className="w-4 h-4" />
          </a>

          {/* Notification Bell with Badge */}
          <div className="relative cursor-pointer p-1">
            <Bell className="w-4 h-4 text-white/90 hover:text-white" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 text-slate-900 font-bold text-[9px] rounded-full flex items-center justify-center shadow-xs">
              4
            </span>
          </div>

          {/* User Profile Capsule */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-white/20">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-xs text-white max-w-[120px] truncate">
              {currentUser.name || 'Pankaj Sinha'}
            </span>
          </div>

        </div>
      </header>

      {/* 2. MAIN LAYOUT WITH 12-MODULE SIDEBAR */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT SIDEBAR (Dark Steel Blue #225b82 matching screenshot) */}
        <aside className={`
          bg-[#225b82] text-white/90 w-64 shrink-0 transition-all duration-200 z-40 flex flex-col border-r border-[#1a4461]
          ${sidebarOpen ? 'block' : 'hidden lg:block'}
        `}>
          
          {/* Sidebar Menu Items */}
          <div className="flex-1 overflow-y-auto py-2 space-y-0.5 text-xs font-medium scrollbar-thin scrollbar-thumb-white/20">
            
            {/* 1. Dashboard */}
            <div>
              <button
                onClick={() => { setActiveModule('dashboard-overview'); toggleSubmenu('dashboard'); }}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#1b4968] transition cursor-pointer ${
                  activeModule.startsWith('dashboard') ? 'bg-[#1b4968] text-white font-bold border-l-4 border-emerald-400' : ''
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BarChart3 className="w-4 h-4 opacity-80" />
                  <span>Dashboard</span>
                </div>
                <span className="text-[10px] text-white/60 font-mono">
                  {openSubmenus.dashboard ? 'v' : '<'}
                </span>
              </button>
              {openSubmenus.dashboard && (
                <div className="bg-[#1a4461] py-1 pl-8 pr-2 space-y-1 text-[11px] text-white/80">
                  <button onClick={() => setActiveModule('dashboard-overview')} className={`block hover:text-white text-left w-full py-0.5 ${activeModule === 'dashboard-overview' ? 'text-emerald-300 font-bold' : ''}`}>&bull; Overview & KPIs</button>
                  <button onClick={() => setActiveModule('dashboard-live')} className={`block hover:text-white text-left w-full py-0.5 ${activeModule === 'dashboard-live' ? 'text-emerald-300 font-bold' : ''}`}>&bull; Live Operations Monitor</button>
                </div>
              )}
            </div>

            {/* 2. Catalogue management */}
            <div>
              <button
                onClick={() => { setActiveModule('catalogue-products'); toggleSubmenu('catalogue'); }}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#1b4968] transition cursor-pointer ${
                  activeModule.startsWith('catalogue') ? 'bg-[#1b4968] text-white font-bold border-l-4 border-emerald-400' : ''
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 opacity-80" />
                  <span>Catalogue management</span>
                </div>
                <span className="text-[10px] text-white/60 font-mono">
                  {openSubmenus.catalogue ? 'v' : '<'}
                </span>
              </button>
              {openSubmenus.catalogue && (
                <div className="bg-[#1a4461] py-1 pl-8 pr-2 space-y-1 text-[11px] text-white/80">
                  <button onClick={() => setActiveModule('catalogue-products')} className={`block hover:text-white text-left w-full py-0.5 ${activeModule === 'catalogue-products' ? 'text-emerald-300 font-bold' : ''}`}>&bull; Products Master</button>
                  <button onClick={() => setActiveModule('catalogue-categories')} className={`block hover:text-white text-left w-full py-0.5 ${activeModule === 'catalogue-categories' ? 'text-emerald-300 font-bold' : ''}`}>&bull; 13 Categories (L0-L2)</button>
                  <button onClick={() => setActiveModule('catalogue-brands')} className={`block hover:text-white text-left w-full py-0.5 ${activeModule === 'catalogue-brands' ? 'text-emerald-300 font-bold' : ''}`}>&bull; Brand Master</button>
                  <button onClick={() => setActiveModule('catalogue-bulk')} className={`block hover:text-white text-left w-full py-0.5 ${activeModule === 'catalogue-bulk' ? 'text-emerald-300 font-bold' : ''}`}>&bull; Bulk CSV Price Upload</button>
                </div>
              )}
            </div>

            {/* 3. Supplier */}
            <div>
              <button
                onClick={() => { setActiveModule('supplier-list'); toggleSubmenu('supplier'); }}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#1b4968] transition cursor-pointer ${
                  activeModule.startsWith('supplier') ? 'bg-[#1b4968] text-white font-bold border-l-4 border-emerald-400' : ''
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 opacity-80" />
                  <span>Supplier</span>
                </div>
                <span className="text-[10px] text-white/60 font-mono">
                  {openSubmenus.supplier ? 'v' : '<'}
                </span>
              </button>
              {openSubmenus.supplier && (
                <div className="bg-[#1a4461] py-1 pl-8 pr-2 space-y-1 text-[11px] text-white/80">
                  <button onClick={() => setActiveModule('supplier-list')} className={`block hover:text-white text-left w-full py-0.5 ${activeModule === 'supplier-list' ? 'text-emerald-300 font-bold' : ''}`}>&bull; Supplier List Master</button>
                  <button onClick={() => setActiveModule('supplier-kyc')} className={`block hover:text-white text-left w-full py-0.5 ${activeModule === 'supplier-kyc' ? 'text-emerald-300 font-bold' : ''}`}>&bull; KYC & GSTIN Verification</button>
                  <button onClick={() => setActiveModule('supplier-add')} className={`block hover:text-white text-left w-full py-0.5 ${activeModule === 'supplier-add' ? 'text-emerald-300 font-bold' : ''}`}>&bull; Onboard New Supplier</button>
                </div>
              )}
            </div>

            {/* 4. Corporate buydesk */}
            <div>
              <button
                onClick={() => { setActiveModule('buydesk-enterprises'); toggleSubmenu('buydesk'); }}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#1b4968] transition cursor-pointer ${
                  activeModule.startsWith('buydesk') ? 'bg-[#1b4968] text-white font-bold border-l-4 border-emerald-400' : ''
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 opacity-80" />
                  <span>Corporate buydesk</span>
                </div>
                <span className="text-[10px] text-white/60 font-mono">
                  {openSubmenus.buydesk ? 'v' : '<'}
                </span>
              </button>
              {openSubmenus.buydesk && (
                <div className="bg-[#1a4461] py-1 pl-8 pr-2 space-y-1 text-[11px] text-white/80">
                  <button onClick={() => setActiveModule('buydesk-enterprises')} className={`block hover:text-white text-left w-full py-0.5 ${activeModule === 'buydesk-enterprises' ? 'text-emerald-300 font-bold' : ''}`}>&bull; Enterprises (Concentrix/Tata/L&T)</button>
                  <button onClick={() => setActiveModule('buydesk-departments')} className={`block hover:text-white text-left w-full py-0.5 ${activeModule === 'buydesk-departments' ? 'text-emerald-300 font-bold' : ''}`}>&bull; Cost Centers & Budgets</button>
                  <button onClick={() => setActiveModule('buydesk-rules')} className={`block hover:text-white text-left w-full py-0.5 ${activeModule === 'buydesk-rules' ? 'text-emerald-300 font-bold' : ''}`}>&bull; Threshold Rules (&lt; ₹15k Auto PO)</button>
                </div>
              )}
            </div>

            {/* 5. Buyer */}
            <div>
              <button
                onClick={() => { setActiveModule('buyer-list'); toggleSubmenu('buyer'); }}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#1b4968] transition cursor-pointer ${
                  activeModule.startsWith('buyer') ? 'bg-[#1b4968] text-white font-bold border-l-4 border-emerald-400' : ''
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 opacity-80" />
                  <span>Buyer</span>
                </div>
                <span className="text-[10px] text-white/60 font-mono">
                  {openSubmenus.buyer ? 'v' : '<'}
                </span>
              </button>
              {openSubmenus.buyer && (
                <div className="bg-[#1a4461] py-1 pl-8 pr-2 space-y-1 text-[11px] text-white/80">
                  <button onClick={() => setActiveModule('buyer-list')} className={`block hover:text-white text-left w-full py-0.5 ${activeModule === 'buyer-list' ? 'text-emerald-300 font-bold' : ''}`}>&bull; Corporate Buyers List</button>
                  <button onClick={() => setActiveModule('buyer-requisitions')} className={`block hover:text-white text-left w-full py-0.5 ${activeModule === 'buyer-requisitions' ? 'text-emerald-300 font-bold' : ''}`}>&bull; Requisitions (PR Desk)</button>
                </div>
              )}
            </div>

            {/* 6. Order Management (THE SCREENSHOT MODULE) */}
            <div>
              <button
                onClick={() => { setActiveModule('order-details'); toggleSubmenu('orders'); }}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#1b4968] transition cursor-pointer ${
                  activeModule.startsWith('order') ? 'bg-[#1b4968] text-white font-bold border-l-4 border-emerald-400' : ''
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingCart className="w-4 h-4 opacity-80" />
                  <span>Order Management</span>
                </div>
                <span className="text-[10px] text-white/60 font-mono">
                  {openSubmenus.orders ? 'v' : '<'}
                </span>
              </button>
              {openSubmenus.orders && (
                <div className="bg-[#1a4461] py-1 pl-8 pr-2 space-y-1 text-[11px] text-white/80">
                  <button onClick={() => setActiveModule('orders-all')} className={`block hover:text-white text-left w-full py-0.5 ${activeModule === 'orders-all' ? 'text-emerald-300 font-bold' : ''}`}>&bull; All Orders Master List</button>
                  <button onClick={() => { setActiveModule('order-details'); setSelectedOrderIndex(0); }} className={`block hover:text-white text-left w-full py-0.5 ${activeModule === 'order-details' && selectedOrderIndex === 0 ? 'text-emerald-300 font-bold' : ''}`}>&bull; Order Details (Concentrix / Om Fire)</button>
                  <button onClick={() => setActiveModule('orders-in-transit')} className={`block hover:text-white text-left w-full py-0.5 ${activeModule === 'orders-in-transit' ? 'text-emerald-300 font-bold' : ''}`}>&bull; In-Transit Dispatches</button>
                  <button onClick={() => setActiveModule('orders-delivered')} className={`block hover:text-white text-left w-full py-0.5 ${activeModule === 'orders-delivered' ? 'text-emerald-300 font-bold' : ''}`}>&bull; Delivered Orders</button>
                  <button onClick={() => setActiveModule('orders-cancelled')} className={`block hover:text-white text-left w-full py-0.5 ${activeModule === 'orders-cancelled' ? 'text-emerald-300 font-bold' : ''}`}>&bull; Cancelled Orders</button>
                </div>
              )}
            </div>

            {/* 7. PO Management */}
            <div>
              <button
                onClick={() => { setActiveModule('po-list'); toggleSubmenu('po'); }}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#1b4968] transition cursor-pointer ${
                  activeModule.startsWith('po') ? 'bg-[#1b4968] text-white font-bold border-l-4 border-emerald-400' : ''
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 opacity-80" />
                  <span>PO Management</span>
                </div>
                <span className="text-[10px] text-white/60 font-mono">
                  {openSubmenus.po ? 'v' : '<'}
                </span>
              </button>
              {openSubmenus.po && (
                <div className="bg-[#1a4461] py-1 pl-8 pr-2 space-y-1 text-[11px] text-white/80">
                  <button onClick={() => setActiveModule('po-list')} className={`block hover:text-white text-left w-full py-0.5 ${activeModule === 'po-list' ? 'text-emerald-300 font-bold' : ''}`}>&bull; Purchase Orders (PO List)</button>
                  <button onClick={() => setActiveModule('po-approvals')} className={`block hover:text-white text-left w-full py-0.5 ${activeModule === 'po-approvals' ? 'text-emerald-300 font-bold' : ''}`}>&bull; PO Approval Desk</button>
                  <button onClick={() => setActiveModule('po-view')} className={`block hover:text-white text-left w-full py-0.5 ${activeModule === 'po-view' ? 'text-emerald-300 font-bold' : ''}`}>&bull; Formal Digital PO Print</button>
                </div>
              )}
            </div>

            {/* 8. Logistics Planning */}
            <div>
              <button
                onClick={() => { setActiveModule('logistics-tracking'); toggleSubmenu('logistics'); }}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#1b4968] transition cursor-pointer ${
                  activeModule.startsWith('logistics') ? 'bg-[#1b4968] text-white font-bold border-l-4 border-emerald-400' : ''
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 opacity-80" />
                  <span>Logistics Planning</span>
                </div>
                <span className="text-[10px] text-white/60 font-mono">
                  {openSubmenus.logistics ? 'v' : '<'}
                </span>
              </button>
              {openSubmenus.logistics && (
                <div className="bg-[#1a4461] py-1 pl-8 pr-2 space-y-1 text-[11px] text-white/80">
                  <button onClick={() => setActiveModule('logistics-tracking')} className={`block hover:text-white text-left w-full py-0.5 ${activeModule === 'logistics-tracking' ? 'text-emerald-300 font-bold' : ''}`}>&bull; BlueDart/Delhivery AWB</button>
                  <button onClick={() => setActiveModule('logistics-gate')} className={`block hover:text-white text-left w-full py-0.5 ${activeModule === 'logistics-gate' ? 'text-emerald-300 font-bold' : ''}`}>&bull; Gate Inward Register</button>
                </div>
              )}
            </div>

            {/* 9. Inventory Management */}
            <div>
              <button
                onClick={() => { setActiveModule('inventory-stocks'); toggleSubmenu('inventory'); }}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#1b4968] transition cursor-pointer ${
                  activeModule.startsWith('inventory') ? 'bg-[#1b4968] text-white font-bold border-l-4 border-emerald-400' : ''
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Boxes className="w-4 h-4 opacity-80" />
                  <span>Inventory Management</span>
                </div>
                <span className="text-[10px] text-white/60 font-mono">
                  {openSubmenus.inventory ? 'v' : '<'}
                </span>
              </button>
              {openSubmenus.inventory && (
                <div className="bg-[#1a4461] py-1 pl-8 pr-2 space-y-1 text-[11px] text-white/80">
                  <button onClick={() => setActiveModule('inventory-stocks')} className={`block hover:text-white text-left w-full py-0.5 ${activeModule === 'inventory-stocks' ? 'text-emerald-300 font-bold' : ''}`}>&bull; Warehouse Stock Ledger</button>
                  <button onClick={() => setActiveModule('inventory-grn')} className={`block hover:text-white text-left w-full py-0.5 ${activeModule === 'inventory-grn' ? 'text-emerald-300 font-bold' : ''}`}>&bull; GRN Intake Receipts</button>
                  <button onClick={() => setActiveModule('inventory-match')} className={`block hover:text-white text-left w-full py-0.5 ${activeModule === 'inventory-match' ? 'text-emerald-300 font-bold' : ''}`}>&bull; 3-Way Match Verification</button>
                </div>
              )}
            </div>

            {/* 10. Reports */}
            <div>
              <button
                onClick={() => { setActiveModule('reports-spend'); toggleSubmenu('reports'); }}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#1b4968] transition cursor-pointer ${
                  activeModule.startsWith('reports') ? 'bg-[#1b4968] text-white font-bold border-l-4 border-emerald-400' : ''
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 opacity-80" />
                  <span>Reports</span>
                </div>
                <span className="text-[10px] text-white/60 font-mono">
                  {openSubmenus.reports ? 'v' : '<'}
                </span>
              </button>
              {openSubmenus.reports && (
                <div className="bg-[#1a4461] py-1 pl-8 pr-2 space-y-1 text-[11px] text-white/80">
                  <button onClick={() => setActiveModule('reports-spend')} className={`block hover:text-white text-left w-full py-0.5 ${activeModule === 'reports-spend' ? 'text-emerald-300 font-bold' : ''}`}>&bull; Spend by Buyer/Enterprise</button>
                  <button onClick={() => setActiveModule('reports-gst')} className={`block hover:text-white text-left w-full py-0.5 ${activeModule === 'reports-gst' ? 'text-emerald-300 font-bold' : ''}`}>&bull; GST ITC Compliance Report</button>
                  <button onClick={() => setActiveModule('reports-savings')} className={`block hover:text-white text-left w-full py-0.5 ${activeModule === 'reports-savings' ? 'text-emerald-300 font-bold' : ''}`}>&bull; Savings Realization</button>
                </div>
              )}
            </div>

            {/* 11. Escalation Management */}
            <div>
              <button
                onClick={() => { setActiveModule('escalation-tickets'); toggleSubmenu('escalation'); }}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#1b4968] transition cursor-pointer ${
                  activeModule.startsWith('escalation') ? 'bg-[#1b4968] text-white font-bold border-l-4 border-emerald-400' : ''
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 opacity-80" />
                  <span>Escalation Management</span>
                </div>
                <span className="text-[10px] text-white/60 font-mono">
                  {openSubmenus.escalation ? 'v' : '<'}
                </span>
              </button>
              {openSubmenus.escalation && (
                <div className="bg-[#1a4461] py-1 pl-8 pr-2 space-y-1 text-[11px] text-white/80">
                  <button onClick={() => setActiveModule('escalation-tickets')} className={`block hover:text-white text-left w-full py-0.5 ${activeModule === 'escalation-tickets' ? 'text-emerald-300 font-bold' : ''}`}>&bull; Open Support Tickets</button>
                  <button onClick={() => setActiveModule('escalation-sla')} className={`block hover:text-white text-left w-full py-0.5 ${activeModule === 'escalation-sla' ? 'text-emerald-300 font-bold' : ''}`}>&bull; Vendor SLA Violations</button>
                </div>
              )}
            </div>

            {/* 12. Return Order Management */}
            <div>
              <button
                onClick={() => { setActiveModule('return-orders'); toggleSubmenu('returnOrder'); }}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#1b4968] transition cursor-pointer ${
                  activeModule.startsWith('return') ? 'bg-[#1b4968] text-white font-bold border-l-4 border-emerald-400' : ''
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <RotateCcw className="w-4 h-4 opacity-80" />
                  <span>Return Order Management</span>
                </div>
                <span className="text-[10px] text-white/60 font-mono">
                  {openSubmenus.returnOrder ? 'v' : '<'}
                </span>
              </button>
              {openSubmenus.returnOrder && (
                <div className="bg-[#1a4461] py-1 pl-8 pr-2 space-y-1 text-[11px] text-white/80">
                  <button onClick={() => setActiveModule('return-orders')} className={`block hover:text-white text-left w-full py-0.5 ${activeModule === 'return-orders' ? 'text-emerald-300 font-bold' : ''}`}>&bull; RTO Rejection Manifest</button>
                  <button onClick={() => setActiveModule('return-credits')} className={`block hover:text-white text-left w-full py-0.5 ${activeModule === 'return-credits' ? 'text-emerald-300 font-bold' : ''}`}>&bull; Credit Notes & Adjustments</button>
                </div>
              )}
            </div>

            {/* 13. Logout */}
            <div className="pt-2 border-t border-white/10 mt-2">
              <Link
                href="/admin/login"
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-red-300 hover:text-white hover:bg-red-600/30 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Link>
            </div>

          </div>

          {/* Sidebar Footer */}
          <div className="p-2.5 bg-[#1a4461] text-[10px] text-white/60 border-t border-white/10 flex items-center justify-between">
            <span>RacknSell Engine 2.0</span>
            <span className="text-emerald-400 font-bold">&bull; Verified</span>
          </div>

        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto bg-white p-4 sm:p-6 lg:p-8">
          
          {/* ========================================================================= */}
          {/* MODULE 6 / SUBMENU 2: ORDER DETAILS (THE EXACT VIEW FROM USER SCREENSHOT) */}
          {/* ========================================================================= */}
          {activeModule === 'order-details' && (
            <div className="space-y-6 max-w-6xl">
              
              {/* Order Selection Pill Tabs */}
              <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-2 gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Switch Order:</span>
                  {allAdminOrders.map((ord, idx) => (
                    <button
                      key={ord.orderId}
                      onClick={() => setSelectedOrderIndex(idx)}
                      className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition cursor-pointer ${
                        selectedOrderIndex === idx
                          ? 'bg-[#20638f] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {ord.orderId} ({ord.buyerName.split(' ')[0]})
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsInvoiceModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-[#20638f] text-white hover:bg-[#1b547a] rounded text-xs font-bold transition cursor-pointer shadow-xs"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View GST Tax Invoice</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs font-bold text-slate-700"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Details</span>
                  </button>
                </div>
              </div>

              {/* Title Matching Screenshot */}
              <div className="border-b-2 border-[#20638f] pb-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Order Details
                </h1>
              </div>

              {/* Top Key-Value Metadata Block (Exact format from screenshot) */}
              <div className="space-y-1.5 text-xs text-slate-800 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-slate-700 min-w-[130px]">Master Order Id:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedOrder.masterOrderId}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-slate-700 min-w-[130px]">Order Id:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedOrder.orderId}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-slate-700 min-w-[130px]">Buyer Name:</span>
                  <span className="font-bold text-slate-900">{selectedOrder.buyerName}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-slate-700 min-w-[130px]">Supplier Name:</span>
                  <span className="font-bold text-slate-900">{selectedOrder.supplierName}</span>
                </div>
              </div>

              {/* Main Products Table (Exact Columns & Data from Screenshot) */}
              <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-xs">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-[#f8fafc] text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3 border-r border-slate-200 min-w-[280px]">Product Name</th>
                      <th className="p-3 border-r border-slate-200 text-right">Unit Price (excl GST)</th>
                      <th className="p-3 border-r border-slate-200 text-center">Tax Rate</th>
                      <th className="p-3 border-r border-slate-200 text-right">Unit Price (incl GST)</th>
                      <th className="p-3 border-r border-slate-200 text-center">Quantity</th>
                      <th className="p-3 border-r border-slate-200 text-right">Total Amount (incl GST)</th>
                      <th className="p-3 text-center">Order Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {selectedOrder.items.map((item, idx) => {
                      const matchedProduct = products.find(p => p.sku === item.sku || p.name.toLowerCase().includes(item.name.slice(0, 15).toLowerCase()));
                      const productHref = matchedProduct ? `/product/${matchedProduct.id}` : `/product/${item.sku}`;

                      return (
                        <tr key={idx} className="hover:bg-slate-50 transition">
                          
                          {/* Product Name with Thumbnail & SKU */}
                          <td className="p-3 border-r border-slate-200">
                            <div className="flex items-start gap-3">
                              <Link href={productHref} target="_blank" className="shrink-0 group" title="Open product detail page">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-12 h-14 object-contain bg-slate-50 p-1 border border-slate-200 rounded group-hover:border-blue-500 transition"
                                />
                              </Link>
                              <div className="space-y-0.5">
                                <Link 
                                  href={productHref} 
                                  target="_blank"
                                  className="font-mono text-[11px] font-bold text-blue-700 hover:underline inline-flex items-center gap-1"
                                >
                                  <span>{item.sku}</span>
                                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                                </Link>
                                <Link 
                                  href={productHref} 
                                  target="_blank"
                                  className="font-bold text-slate-900 hover:text-blue-600 leading-snug block transition"
                                >
                                  {item.name}
                                </Link>
                                <div className="text-[10px] text-slate-500 italic">
                                  {item.description}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Unit Price (excl GST) */}
                          <td className="p-3 border-r border-slate-200 text-right font-mono text-slate-900">
                            {item.unitPriceExclGst.toFixed(2)}
                          </td>

                          {/* Tax Rate */}
                          <td className="p-3 border-r border-slate-200 text-center font-mono text-slate-900">
                            {item.taxRate.toFixed(2)}
                          </td>

                          {/* Unit Price (incl GST) */}
                          <td className="p-3 border-r border-slate-200 text-right font-mono font-bold text-slate-900">
                            {item.unitPriceInclGst.toFixed(2)}/{item.unit}
                          </td>

                          {/* Quantity */}
                          <td className="p-3 border-r border-slate-200 text-center font-mono font-bold text-slate-900">
                            {item.quantity} {item.unit}
                          </td>

                          {/* Total Amount (incl GST) */}
                          <td className="p-3 border-r border-slate-200 text-right font-mono font-black text-slate-900">
                            {item.totalAmountInclGst.toFixed(2)}
                          </td>

                          {/* Order Status */}
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              item.status === 'Cancelled' ? 'text-red-600 bg-red-50 border border-red-200' :
                              item.status === 'Delivered' ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' :
                              'text-blue-700 bg-blue-50 border border-blue-200'
                            }`}>
                              {item.status}
                            </span>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Order Summary Total Card */}
              <div className="flex justify-end pt-2">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 w-72 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Taxable Subtotal:</span>
                    <span className="font-mono">
                      ₹{selectedOrder.items.reduce((acc, it) => acc + (it.unitPriceExclGst * it.quantity), 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Total GST (18%):</span>
                    <span className="font-mono">
                      ₹{selectedOrder.items.reduce((acc, it) => acc + (it.totalAmountInclGst - (it.unitPriceExclGst * it.quantity)), 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-slate-200 pt-1.5 flex justify-between font-black text-sm text-slate-900">
                    <span>Grand Total:</span>
                    <span className="font-mono text-blue-700">
                      ₹{selectedOrder.items.reduce((acc, it) => acc + it.totalAmountInclGst, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* MODULE 6: ORDERS ALL, IN-TRANSIT, DELIVERED, CANCELLED */}
          {/* ========================================================================= */}
          {(activeModule === 'orders-all' || activeModule === 'orders-in-transit' || activeModule === 'orders-delivered' || activeModule === 'orders-cancelled') && (
            <div className="space-y-4 max-w-6xl">
              <div className="flex justify-between items-center pb-2 border-b-2 border-[#20638f]">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    {activeModule === 'orders-in-transit' ? 'In-Transit Orders' :
                     activeModule === 'orders-delivered' ? 'Delivered Orders' :
                     activeModule === 'orders-cancelled' ? 'Cancelled Orders' : 'All Orders Master Register'}
                  </h2>
                  <p className="text-xs text-slate-500">Live operational registry merging pre-seeded enterprise orders & real-time store POs</p>
                </div>
                <button
                  onClick={() => { setSelectedOrderIndex(0); setActiveModule('order-details'); }}
                  className="px-3 py-1.5 bg-[#20638f] text-white rounded-lg text-xs font-bold"
                >
                  View Screenshot Order (PO004931)
                </button>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-xs">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-[#f8fafc] text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Master Order ID</th>
                      <th className="p-3">Buyer Enterprise</th>
                      <th className="p-3">Supplier Name</th>
                      <th className="p-3 text-center">Date</th>
                      <th className="p-3 text-right">Total (incl GST)</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {allAdminOrders
                      .filter(o => {
                        if (activeModule === 'orders-in-transit') return o.status === 'In Transit';
                        if (activeModule === 'orders-delivered') return o.status === 'Delivered';
                        if (activeModule === 'orders-cancelled') return o.status === 'Cancelled';
                        return true;
                      })
                      .map((ord) => (
                        <tr key={ord.orderId} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-blue-700">{ord.orderId}</td>
                          <td className="p-3 font-mono text-slate-600">{ord.masterOrderId}</td>
                          <td className="p-3 font-bold text-slate-900">{ord.buyerName}</td>
                          <td className="p-3 text-slate-700">{ord.supplierName}</td>
                          <td className="p-3 text-center text-slate-500">{ord.orderDate}</td>
                          <td className="p-3 text-right font-mono font-bold text-slate-900">
                            ₹{ord.items.reduce((sum, i) => sum + i.totalAmountInclGst, 0).toLocaleString('en-IN')}
                          </td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              ord.status === 'Cancelled' ? 'bg-red-50 text-red-600 border border-red-200' :
                              ord.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}>
                              {ord.status}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => {
                                const matchedIdx = allAdminOrders.findIndex(o => o.orderId === ord.orderId);
                                setSelectedOrderIndex(matchedIdx >= 0 ? matchedIdx : 0);
                                setActiveModule('order-details');
                              }}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-[#20638f] hover:text-white text-slate-700 rounded text-xs font-bold transition cursor-pointer"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODULE 1: DASHBOARD OVERVIEW & LIVE OPERATIONS MONITOR */}
          {/* ========================================================================= */}
          {activeModule === 'dashboard-overview' && (
            <div className="space-y-6 max-w-6xl">
              <div className="pb-2 border-b-2 border-[#20638f] flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Operations Overview & Executive KPIs</h2>
                  <p className="text-xs text-slate-500">Consolidated enterprise procurement metrics and high-volume order flows</p>
                </div>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                  <button onClick={() => setActiveModule('dashboard-overview')} className="px-3 py-1 rounded text-xs font-bold bg-white text-blue-700 shadow-xs">KPI Summary</button>
                  <button onClick={() => setActiveModule('dashboard-live')} className="px-3 py-1 rounded text-xs font-bold text-slate-600 hover:text-slate-900">Live Telemetry</button>
                </div>
              </div>

              {/* Top 4 KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Total Master Orders</span>
                  <div className="text-2xl font-black text-slate-900 font-mono">{allAdminOrders.length + 1488}</div>
                  <div className="text-[10px] text-emerald-600 font-bold">+18 today &bull; 99.4% OTIF</div>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Total GMV Spend</span>
                  <div className="text-2xl font-black text-slate-900 font-mono">₹1,84,20,500</div>
                  <div className="text-[10px] text-blue-600 font-bold">12.4% contract savings</div>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Client Enterprises</span>
                  <div className="text-2xl font-black text-slate-900 font-mono">{companies.filter(c => c.type === 'ENTERPRISE').length}</div>
                  <div className="text-[10px] text-slate-500">Concentrix, Tata, L&T, Siemens</div>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Verified Suppliers</span>
                  <div className="text-2xl font-black text-slate-900 font-mono">{companies.filter(c => c.type === 'VENDOR').length}</div>
                  <div className="text-[10px] text-emerald-600 font-bold">100% GSTR-2B Validated</div>
                </div>
              </div>

              {/* Spend Distribution Bars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Top Sourcing Categories (Spend)</h3>
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between font-medium text-slate-700 mb-1">
                        <span>Safety Equipment & Gear</span>
                        <span className="font-mono font-bold">₹48.2 Lakhs (32%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '32%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between font-medium text-slate-700 mb-1">
                        <span>Electrical & Circuit Protection</span>
                        <span className="font-mono font-bold">₹36.5 Lakhs (24%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '24%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between font-medium text-slate-700 mb-1">
                        <span>Power & Hand Tools (MRO)</span>
                        <span className="font-mono font-bold">₹28.4 Lakhs (19%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: '19%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">P2P Processing Health</h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                      <div className="text-[10px] font-bold text-emerald-800 uppercase">Fast-Track Auto POs</div>
                      <div className="text-xl font-black text-emerald-900 font-mono mt-1">91.4%</div>
                      <div className="text-[10px] text-emerald-700">Orders &lt; ₹15k zero delay</div>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                      <div className="text-[10px] font-bold text-purple-800 uppercase">3-Way Match Rate</div>
                      <div className="text-xl font-black text-purple-900 font-mono mt-1">98.2%</div>
                      <div className="text-[10px] text-purple-700">Zero variance settlements</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveModule('dashboard-live')} 
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs transition"
                  >
                    Open Live Telemetry Operations Stream &rarr;
                  </button>
                </div>
              </div>

              {/* Recent Orders Feed */}
              <div className="border border-slate-200 rounded-xl bg-white p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Recent Procurement Feed</h3>
                  <button onClick={() => setActiveModule('orders-all')} className="text-xs text-blue-700 font-bold hover:underline">View All Orders &rarr;</button>
                </div>
                <div className="space-y-2">
                  {allAdminOrders.slice(0, 4).map((ord) => (
                    <div key={ord.orderId} className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-blue-700">{ord.orderId}</span> &bull; <strong>{ord.buyerName}</strong> &rarr; <span className="text-slate-600">{ord.supplierName}</span>
                        <div className="text-[11px] text-slate-500">{ord.items.length} items &bull; ₹{ord.items.reduce((s, it) => s + it.totalAmountInclGst, 0).toLocaleString('en-IN')}</div>
                      </div>
                      <button
                        onClick={() => {
                          const idx = allAdminOrders.findIndex(o => o.orderId === ord.orderId);
                          setSelectedOrderIndex(idx >= 0 ? idx : 0);
                          setActiveModule('order-details');
                        }}
                        className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-blue-50 text-blue-700 rounded text-xs font-bold"
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODULE 1 / SUBMENU 2: LIVE OPERATIONS MONITOR (TELEMETRY STREAM) */}
          {/* ========================================================================= */}
          {activeModule === 'dashboard-live' && (
            <div className="space-y-6 max-w-6xl">
              <div className="pb-2 border-b-2 border-[#20638f] flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Live Operations Telemetry Stream</h2>
                  <p className="text-xs text-slate-500">Real-time carrier AWB tracking events, threshold PO approvals, and webhook dispatches</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSimulateTelemetryPing} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition">
                    <Activity className="w-3.5 h-3.5" />
                    <span>Trigger Telemetry Ping</span>
                  </button>
                  <button onClick={() => setActiveModule('dashboard-overview')} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold">
                    &larr; Overview
                  </button>
                </div>
              </div>

              {/* Operational Status Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-slate-800">Core P2P Engine</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">Status: 100% Operational (14ms)</div>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="font-bold text-slate-800">GSTN E-Way API</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">Response: 42ms (Connected)</div>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="font-bold text-slate-800">BlueDart Webhook</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">Heartbeat: Active (Socket OK)</div>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="font-bold text-slate-800">Auto PO Evaluator</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">Listening (&lt; ₹15,000 rules)</div>
                </div>
              </div>

              {/* Event Stream Log */}
              <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-xs">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Event Telemetry Buffer</span>
                  <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">STREAM ACTIVE</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {telemetryEvents.map((evt) => (
                    <div key={evt.id} className="p-3.5 hover:bg-slate-50 transition flex items-center justify-between text-xs">
                      <div className="flex items-start gap-3">
                        <span className="font-mono text-[10px] font-bold text-slate-400 shrink-0 w-16">{evt.time}</span>
                        <div>
                          <div className="font-mono font-bold text-blue-700 text-[11px]">{evt.id} &bull; <span className="text-slate-900 font-sans">{evt.type}</span></div>
                          <p className="text-slate-700 mt-0.5">{evt.msg}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                        {evt.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODULE 2: CATALOGUE (PRODUCTS, CATEGORIES, BRANDS, BULK CSV) */}
          {/* ========================================================================= */}
          {activeModule.startsWith('catalogue') && (
            <div className="space-y-4 max-w-6xl">
              <div className="pb-2 border-b-2 border-[#20638f] flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    {activeModule === 'catalogue-categories' ? 'Category Taxonomy Master (L0-L2)' :
                     activeModule === 'catalogue-brands' ? 'Brand Master Directory' :
                     activeModule === 'catalogue-bulk' ? 'Bulk CSV Pricing & SKU Upload' : 'Catalogue Products Master'}
                  </h2>
                  <p className="text-xs text-slate-500">13 Industrial Procurement Taxonomy Categories & Pre-negotiated Rates</p>
                </div>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                  <button onClick={() => setActiveModule('catalogue-products')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'catalogue-products' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>Products ({products.length})</button>
                  <button onClick={() => setActiveModule('catalogue-categories')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'catalogue-categories' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>13 Categories</button>
                  <button onClick={() => setActiveModule('catalogue-brands')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'catalogue-brands' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>Brands</button>
                  <button onClick={() => setActiveModule('catalogue-bulk')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'catalogue-bulk' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>Bulk CSV</button>
                </div>
              </div>

              {/* Products Master */}
              {activeModule === 'catalogue-products' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center gap-3">
                    <input
                      type="text"
                      placeholder="Search SKU or product..."
                      value={filterQuery}
                      onChange={(e) => setFilterQuery(e.target.value)}
                      className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs w-72"
                    />
                    <Link href="/catalog" className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold">
                      Open Public Catalog Desk &rarr;
                    </Link>
                  </div>
                  <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-xs">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead className="bg-[#f8fafc] text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3">SKU</th>
                          <th className="p-3">Product Name</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Brand</th>
                          <th className="p-3 text-right">Base Price</th>
                          <th className="p-3 text-right">Contract Price</th>
                          <th className="p-3 text-center">Stock</th>
                          <th className="p-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {products
                          .filter(p => !filterQuery || p.name.toLowerCase().includes(filterQuery.toLowerCase()) || p.sku.toLowerCase().includes(filterQuery.toLowerCase()))
                          .map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50">
                              <td className="p-3 font-mono font-bold text-slate-700">{p.sku}</td>
                              <td className="p-3 font-bold text-slate-900">{p.name}</td>
                              <td className="p-3 text-slate-600">{p.category}</td>
                              <td className="p-3 font-semibold text-blue-700">{p.brand}</td>
                              <td className="p-3 text-right font-mono text-slate-500">₹{p.basePrice}</td>
                              <td className="p-3 text-right font-mono font-bold text-emerald-700">₹{p.contractPrice}</td>
                              <td className="p-3 text-center font-mono font-bold text-slate-800">{p.stock}</td>
                              <td className="p-3 text-center">
                                <Link href={`/product/${p.id}`} target="_blank" className="text-blue-700 font-bold hover:underline">
                                  View Item &rarr;
                                </Link>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 13 Categories */}
              {activeModule === 'catalogue-categories' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {RACKNSELL_CATEGORIES.map((c) => (
                    <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] text-blue-600 font-bold uppercase">Level-0 Category</span>
                          <h4 className="text-sm font-black text-slate-900">{c.name}</h4>
                        </div>
                        <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded">{c.productCount} SKUs</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{c.description}</p>
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                        {c.subcategories.map(s => (
                          <span key={s.id} className="text-[10px] px-2 py-0.5 rounded bg-slate-50 border border-slate-200 font-medium">
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Brands */}
              {activeModule === 'catalogue-brands' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  {['Schneider Electric', 'Bosch Professional', '3M Industrial', 'Karam Safety', 'Havells', 'Fluke', 'Polycab', 'Berger Paints', 'Unbrako', 'Loctite Henkel', 'Roots Multiclean', 'Brady'].map((b) => (
                    <div key={b} className="p-4 rounded-xl border border-slate-200 bg-white hover:shadow-sm">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 font-black text-sm flex items-center justify-center mx-auto mb-2">
                        {b.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="text-xs font-bold text-slate-900">{b}</div>
                      <div className="text-[10px] text-emerald-600 font-bold mt-1">Authorized OEM Channel</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bulk CSV Upload Engine */}
              {activeModule === 'catalogue-bulk' && (
                <div className="space-y-4">
                  <div className="p-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UploadCloud className="w-5 h-5 text-blue-600" />
                        <h3 className="text-sm font-bold text-slate-900">Direct CSV Catalog Ingest Engine</h3>
                      </div>
                      <button onClick={handleLoadSampleCsv} className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-bold">
                        Paste Sample 3-SKU Batch
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">Format: <code>SKU, Product Name, Category, Price, MOQ, Brand</code> (1 row per SKU)</p>
                    <textarea
                      rows={5}
                      value={bulkCsvText}
                      onChange={(e) => setBulkCsvText(e.target.value)}
                      placeholder="Paste comma-separated CSV lines here..."
                      className="w-full p-3 font-mono text-xs border border-slate-300 rounded-lg bg-white"
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setBulkCsvText('')} className="px-4 py-2 border border-slate-300 text-slate-600 rounded text-xs font-bold">
                        Clear
                      </button>
                      <button onClick={handleProcessBulkCsv} className="px-4 py-2 bg-[#20638f] text-white rounded text-xs font-bold shadow-xs">
                        Process & Ingest CSV Into Live Catalog
                      </button>
                    </div>
                  </div>

                  {bulkSuccessMsg && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{bulkSuccessMsg}</span>
                    </div>
                  )}

                  {bulkParsedItems.length > 0 && (
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <div className="p-3 bg-slate-50 font-bold text-xs text-slate-700">Preview Ingested Items</div>
                      <table className="w-full text-xs text-left border-collapse">
                        <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-600">
                          <tr>
                            <th className="p-2.5">SKU</th>
                            <th className="p-2.5">Name</th>
                            <th className="p-2.5">Category</th>
                            <th className="p-2.5 text-right">Base Price</th>
                            <th className="p-2.5 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono">
                          {bulkParsedItems.map((it, idx) => (
                            <tr key={idx}>
                              <td className="p-2.5 font-bold text-blue-700">{it.sku}</td>
                              <td className="p-2.5 font-sans font-medium text-slate-800">{it.name}</td>
                              <td className="p-2.5 font-sans text-slate-600">{it.category}</td>
                              <td className="p-2.5 text-right font-bold text-slate-900">₹{it.basePrice}</td>
                              <td className="p-2.5 text-center text-emerald-600 font-sans font-bold">LIVE IN STORE</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODULE 3: SUPPLIER (LIST, KYC, ONBOARD) */}
          {/* ========================================================================= */}
          {activeModule.startsWith('supplier') && (
            <div className="space-y-4 max-w-6xl">
              <div className="pb-2 border-b-2 border-[#20638f] flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    {activeModule === 'supplier-kyc' ? 'Supplier Statutory KYC & GSTIN Desk' :
                     activeModule === 'supplier-add' ? 'Onboard New Verified Supplier' : 'Supplier Master Directory'}
                  </h2>
                  <p className="text-xs text-slate-500">Verified OEM channels, MSME manufacturers, and fulfillment hubs</p>
                </div>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                  <button onClick={() => setActiveModule('supplier-list')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'supplier-list' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>Suppliers ({companies.filter(c => c.type === 'VENDOR').length})</button>
                  <button onClick={() => setActiveModule('supplier-kyc')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'supplier-kyc' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>KYC Verification</button>
                  <button onClick={() => setActiveModule('supplier-add')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'supplier-add' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>+ Onboard</button>
                </div>
              </div>

              {supplierSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{supplierSuccessMsg}</span>
                </div>
              )}

              {/* Dynamic Supplier List Master */}
              {activeModule === 'supplier-list' && (
                <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-xs">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-[#f8fafc] text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Supplier Name</th>
                        <th className="p-3">GSTIN</th>
                        <th className="p-3">PAN</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">Payment Terms</th>
                        <th className="p-3 text-right">Credit Limit</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {companies.filter(c => c.type === 'VENDOR').map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{s.name}</td>
                          <td className="p-3 font-mono text-slate-700">{s.gstin}</td>
                          <td className="p-3 font-mono text-slate-600">{s.pan}</td>
                          <td className="p-3 text-slate-600">{s.state}</td>
                          <td className="p-3 font-medium text-slate-800">{s.paymentTerms}</td>
                          <td className="p-3 text-right font-mono font-bold text-slate-900">₹{s.creditLimit.toLocaleString('en-IN')}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              s.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {s.status}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => toggleCompanyStatus(s.id)}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-bold transition"
                            >
                              {s.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Dedicated Supplier KYC Verification Desk */}
              {activeModule === 'supplier-kyc' && (
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
                    <strong>Statutory Verification Desk:</strong> Cross-checks 15-digit GSTIN with the GSTN central portal, validates PAN linkage, and confirms bank account penny-drop mandate verification.
                  </div>
                  <div className="space-y-2 text-xs">
                    {companies.filter(c => c.type === 'VENDOR').map((c) => (
                      <div key={c.id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <strong className="text-slate-900 text-sm">{c.name}</strong>
                            <span className="font-mono text-slate-600 text-xs">GSTIN: {c.gstin}</span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            PAN: <strong>{c.pan}</strong> &bull; Bank Mandate: <strong>HDFC Corporate CMS (Penny-Drop Verified)</strong> &bull; State: {c.state}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                            c.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}>
                            {c.status === 'ACTIVE' ? 'KYC VERIFIED' : 'PENDING ACTION'}
                          </span>
                          <button
                            onClick={() => toggleCompanyStatus(c.id)}
                            className="px-3 py-1 bg-slate-100 hover:bg-[#20638f] hover:text-white rounded text-xs font-bold transition"
                          >
                            Toggle KYC Status
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Onboard Supplier Form */}
              {activeModule === 'supplier-add' && (
                <div className="p-6 bg-white border border-slate-200 rounded-xl max-w-xl space-y-4">
                  <h3 className="text-sm font-black text-slate-900">Enter Legal Vendor Credentials</h3>
                  <form onSubmit={handleOnboardSupplier} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Legal Entity / Firm Name</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Paramount Industrial Solutions Ltd"
                        value={newSupplierName}
                        onChange={(e) => setNewSupplierName(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">15-Digit GSTIN</label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. 27AABCP1234M1Z8"
                          value={newSupplierGstin}
                          onChange={(e) => setNewSupplierGstin(e.target.value)}
                          className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-mono uppercase"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">10-Digit PAN</label>
                        <input
                          type="text"
                          placeholder="e.g. AABCP1234M"
                          value={newSupplierPan}
                          onChange={(e) => setNewSupplierPan(e.target.value)}
                          className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-mono uppercase"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">State</label>
                        <input
                          type="text"
                          value={newSupplierState}
                          onChange={(e) => setNewSupplierState(e.target.value)}
                          className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Payment Terms</label>
                        <select
                          value={newSupplierTerms}
                          onChange={(e) => setNewSupplierTerms(e.target.value)}
                          className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                        >
                          <option value="Net 30">Net 30</option>
                          <option value="Net 45">Net 45</option>
                          <option value="Immediate">Immediate</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Credit Limit (₹)</label>
                        <input
                          type="number"
                          value={newSupplierCredit}
                          onChange={(e) => setNewSupplierCredit(Number(e.target.value))}
                          className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-mono"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => setActiveModule('supplier-list')}
                        className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#20638f] text-white rounded-lg text-xs font-bold shadow-xs"
                      >
                        Save & Authorize Supplier
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODULE 4: BUYDESK (ENTERPRISES, COST CENTERS, RULES) */}
          {/* ========================================================================= */}
          {activeModule.startsWith('buydesk') && (
            <div className="space-y-4 max-w-6xl">
              <div className="pb-2 border-b-2 border-[#20638f] flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    {activeModule === 'buydesk-departments' ? 'Cost Centers & Department Budgets' :
                     activeModule === 'buydesk-rules' ? 'Threshold Rules Engine (< ₹15k Auto PO)' : 'Corporate Buydesk Master'}
                  </h2>
                  <p className="text-xs text-slate-500">Enterprise Clients, Cost Centers, and Spend Hierarchy</p>
                </div>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                  <button onClick={() => setActiveModule('buydesk-enterprises')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'buydesk-enterprises' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>Enterprises</button>
                  <button onClick={() => setActiveModule('buydesk-departments')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'buydesk-departments' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>Cost Centers</button>
                  <button onClick={() => setActiveModule('buydesk-rules')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'buydesk-rules' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>Threshold Rules</button>
                </div>
              </div>

              {/* Dynamic Enterprises Table */}
              {activeModule === 'buydesk-enterprises' && (
                <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-xs">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-[#f8fafc] text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Enterprise Client</th>
                        <th className="p-3">GSTIN</th>
                        <th className="p-3">State</th>
                        <th className="p-3">Credit Facility</th>
                        <th className="p-3">Credit Utilized</th>
                        <th className="p-3">Payment Terms</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {companies.filter(c => c.type === 'ENTERPRISE').map((e) => (
                        <tr key={e.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{e.name}</td>
                          <td className="p-3 font-mono text-slate-700">{e.gstin}</td>
                          <td className="p-3 text-slate-600">{e.state}</td>
                          <td className="p-3 font-mono text-slate-900 font-semibold">₹{e.creditLimit.toLocaleString('en-IN')}</td>
                          <td className="p-3 font-mono text-blue-700 font-bold">₹{e.creditUsed.toLocaleString('en-IN')}</td>
                          <td className="p-3 text-slate-700">{e.paymentTerms}</td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {e.status}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => toggleCompanyStatus(e.id)}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-bold"
                            >
                              Toggle
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Dedicated Cost Centers & Budgets */}
              {activeModule === 'buydesk-departments' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { code: 'CC-101', dept: 'Plant Operations & MRO', allocated: 5000000, spent: 1450000, head: 'Ankit Jain', util: 29 },
                    { code: 'CC-102', dept: 'Health & Safety (EHS)', allocated: 1500000, spent: 420000, head: 'Pankaj Sinha', util: 28 },
                    { code: 'CC-103', dept: 'Heavy Machinery & CNC', allocated: 6000000, spent: 3850000, head: 'Sanjay Deshmukh', util: 64 },
                    { code: 'CC-104', dept: 'Electrical & Automation', allocated: 3500000, spent: 1280000, head: 'Ramesh Nair', util: 36 },
                    { code: 'CC-105', dept: 'IT Infrastructure & Admin', allocated: 2000000, spent: 650000, head: 'Vikramaditya Rao', util: 32 },
                  ].map((d) => (
                    <div key={d.code} className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">{d.code}</span>
                          <h4 className="font-bold text-slate-900 mt-1">{d.dept}</h4>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-700">{d.util}%</span>
                      </div>
                      <div className="text-xl font-black text-slate-900 font-mono">₹{d.spent.toLocaleString('en-IN')}</div>
                      <div className="text-[11px] text-slate-500">Allocated Budget: ₹{d.allocated.toLocaleString('en-IN')}</div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${d.util}%` }} />
                      </div>
                      <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                        Authorized HOD: <strong className="text-slate-700">{d.head}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Dedicated Threshold Rules Engine & Interactive Simulator */}
              {activeModule === 'buydesk-rules' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <strong className="text-emerald-900 text-xs uppercase tracking-wide">Rule 1: Fast-Track Auto PO (&lt; ₹15,000)</strong>
                      </div>
                      <p className="text-xs text-emerald-800">
                        Requisitions submitted below ₹15,000 completely bypass managerial bottleneck. The system generates an issued PO instantly with pre-negotiated volume contract prices.
                      </p>
                      <div className="text-[10px] text-emerald-700 font-mono font-bold">Auto-Execution SLA: &lt; 2 seconds</div>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <strong className="text-amber-900 text-xs uppercase tracking-wide">Rule 2: Manager Sign-Off (&ge; ₹15,000)</strong>
                      </div>
                      <p className="text-xs text-amber-800">
                        Orders equal to or exceeding ₹15,000 require Department Head or Finance Manager sign-off before being transmitted to the vendor hub.
                      </p>
                      <div className="text-[10px] text-amber-700 font-mono font-bold">Approval Queue SLA: 4 hours</div>
                    </div>
                  </div>

                  {/* Interactive Threshold Simulator */}
                  <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-3">
                    <h3 className="text-xs font-bold text-slate-900 uppercase">Live Threshold Evaluation Simulator</h3>
                    <div className="flex items-center gap-3">
                      <label className="text-xs text-slate-600 font-bold">Test Order Amount (₹):</label>
                      <input
                        type="number"
                        value={simAmount}
                        onChange={(e) => setSimAmount(Number(e.target.value))}
                        className="p-2 border border-slate-300 rounded-lg text-xs font-mono font-bold w-40"
                      />
                    </div>
                    <div className={`p-4 rounded-xl border text-xs ${
                      simAmount < 15000 ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}>
                      <div className="font-bold text-sm">
                        {simAmount < 15000 ? 'RESULT: Fast-Track Auto PO Granted!' : 'RESULT: Manager Multi-Tier Sign-Off Required!'}
                      </div>
                      <p className="text-xs mt-1">
                        {simAmount < 15000 
                          ? `Total ₹${simAmount.toLocaleString('en-IN')} is below the ₹15,000 threshold. Will generate digital PO immediately with zero manual intervention.`
                          : `Total ₹${simAmount.toLocaleString('en-IN')} requires approval from Department Approver (Vikramaditya Rao) prior to PO issuance.`}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODULE 5: BUYER (LIST, REQUISITIONS) */}
          {/* ========================================================================= */}
          {activeModule.startsWith('buyer') && (
            <div className="space-y-4 max-w-6xl">
              <div className="pb-2 border-b-2 border-[#20638f] flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    {activeModule === 'buyer-requisitions' ? 'Purchase Requisitions (PR) Desk' : 'Corporate Buyers Master List'}
                  </h2>
                  <p className="text-xs text-slate-500">Authorized corporate procurement officers & departmental PR audit</p>
                </div>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                  <button onClick={() => setActiveModule('buyer-list')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'buyer-list' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>Buyers</button>
                  <button onClick={() => setActiveModule('buyer-requisitions')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'buyer-requisitions' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>Requisitions ({requisitions.length})</button>
                </div>
              </div>

              {/* Corporate Buyers List */}
              {activeModule === 'buyer-list' && (
                <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-xs">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-[#f8fafc] text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Buyer Name</th>
                        <th className="p-3">Company</th>
                        <th className="p-3">Department</th>
                        <th className="p-3">Official Email</th>
                        <th className="p-3 font-mono text-right">PR Limit</th>
                        <th className="p-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {[
                        { name: 'Pankaj Sinha', comp: 'Concentrix Technologies', dept: 'Facilities & Infrastructure', email: 'pankaj.sinha@concentrix.com', limit: '₹10,00,000' },
                        { name: 'Ankit Jain', comp: 'Tata Advanced Systems', dept: 'Plant Operations & MRO', email: 'ankit.jain@tataadvanced.com', limit: '₹5,00,000' },
                        { name: 'Vikramaditya Rao', comp: 'Tata Advanced Systems', dept: 'Finance & Approvals', email: 'v.rao@tataadvanced.com', limit: '₹25,00,000' },
                        { name: 'Sanjay Deshmukh', comp: 'Larsen & Toubro Infra', dept: 'Procurement Cell', email: 's.deshmukh@ltinfra.com', limit: '₹50,00,000' },
                        { name: 'Ramesh Nair', comp: 'Siemens India Ltd', dept: 'Electrical Engineering', email: 'r.nair@siemens.com', limit: '₹15,00,000' },
                      ].map((b, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{b.name}</td>
                          <td className="p-3 font-semibold text-slate-800">{b.comp}</td>
                          <td className="p-3 text-slate-600">{b.dept}</td>
                          <td className="p-3 font-mono text-slate-600">{b.email}</td>
                          <td className="p-3 font-mono font-bold text-blue-700 text-right">{b.limit}</td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">ACTIVE</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Purchase Requisitions Desk */}
              {activeModule === 'buyer-requisitions' && (
                <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-xs">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-[#f8fafc] text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">PR Number</th>
                        <th className="p-3">Buyer</th>
                        <th className="p-3">Department</th>
                        <th className="p-3 text-right">Subtotal</th>
                        <th className="p-3 text-right">Tax (GST)</th>
                        <th className="p-3 text-right">Total Amount</th>
                        <th className="p-3 text-center">Threshold Rule</th>
                        <th className="p-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {requisitions.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-blue-700">{r.prNumber}</td>
                          <td className="p-3 font-bold text-slate-900">{r.buyerName}</td>
                          <td className="p-3 text-slate-600">{r.department}</td>
                          <td className="p-3 text-right font-mono text-slate-600">₹{r.subtotal.toLocaleString('en-IN')}</td>
                          <td className="p-3 text-right font-mono text-slate-600">₹{r.totalTax.toLocaleString('en-IN')}</td>
                          <td className="p-3 text-right font-mono font-bold text-slate-900">₹{r.totalAmount.toLocaleString('en-IN')}</td>
                          <td className="p-3 text-center">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${r.totalAmount >= 15000 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                              {r.totalAmount >= 15000 ? '>= ₹15k (Approval Req)' : '< ₹15k (Auto PO)'}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              r.status === 'PO_GENERATED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODULE 7: PO MANAGEMENT (LIST, APPROVALS, DIGITAL PO PRINT) */}
          {/* ========================================================================= */}
          {activeModule.startsWith('po') && (
            <div className="space-y-4 max-w-6xl">
              <div className="pb-2 border-b-2 border-[#20638f] flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    {activeModule === 'po-approvals' ? 'PO Approval Desk (Manager Sign-Off)' :
                     activeModule === 'po-view' ? 'Formal Legal Digital Purchase Order (Print / PDF)' : 'Purchase Order (PO) Master Desk'}
                  </h2>
                  <p className="text-xs text-slate-500">Authorized Legal Digital Purchase Orders with Statutory GST</p>
                </div>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                  <button onClick={() => setActiveModule('po-list')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'po-list' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>All POs ({purchaseOrders.length})</button>
                  <button onClick={() => setActiveModule('po-approvals')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'po-approvals' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>Approvals ({requisitions.filter(r => r.status === 'PENDING_APPROVAL').length})</button>
                  <button onClick={() => setActiveModule('po-view')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'po-view' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>Digital PO Form</button>
                </div>
              </div>

              {/* PO List Master */}
              {activeModule === 'po-list' && (
                <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-xs">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-[#f8fafc] text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">PO Number</th>
                        <th className="p-3">Buyer Enterprise</th>
                        <th className="p-3">Supplier Name</th>
                        <th className="p-3 text-right">Taxable Amt</th>
                        <th className="p-3 text-right">GST Total</th>
                        <th className="p-3 text-right">Total (incl GST)</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {purchaseOrders.map((po) => (
                        <tr key={po.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-blue-700">{po.poNumber}</td>
                          <td className="p-3 font-bold text-slate-900">{po.companyName}</td>
                          <td className="p-3 text-slate-700">{po.vendorName}</td>
                          <td className="p-3 text-right font-mono text-slate-600">₹{po.subtotal.toLocaleString('en-IN')}</td>
                          <td className="p-3 text-right font-mono text-slate-600">₹{(po.cgst + po.sgst + po.igst).toLocaleString('en-IN')}</td>
                          <td className="p-3 text-right font-mono font-bold text-slate-900">₹{po.totalAmount.toLocaleString('en-IN')}</td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                              {po.status}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => {
                                setSelectedPoForPrint(po.poNumber);
                                setActiveModule('po-view');
                              }}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-[#20638f] hover:text-white rounded text-xs font-bold transition"
                            >
                              Digital PO
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Dedicated PO Approvals Desk */}
              {activeModule === 'po-approvals' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                    <strong>Pending Requisitions Awaiting Sign-Off:</strong> Requisitions equal to or exceeding ₹15,000 routed to Finance & Plant Head for commercial audit.
                  </div>
                  {requisitions.filter(r => r.status === 'PENDING_APPROVAL').length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                      <div className="font-bold text-slate-800 text-sm">All Requisitions Approved!</div>
                      <p className="text-xs text-slate-500">No pending orders in the approval queue.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {requisitions.filter(r => r.status === 'PENDING_APPROVAL').map((pr) => (
                        <div key={pr.id} className="p-5 bg-white border border-slate-200 rounded-xl space-y-3 shadow-xs">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{pr.prNumber}</span>
                              <h3 className="text-sm font-bold text-slate-900 mt-1">{pr.buyerName} &bull; {pr.department}</h3>
                              <div className="text-xs text-slate-500">{pr.companyName}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-black text-slate-900 font-mono">₹{pr.totalAmount.toLocaleString('en-IN')}</div>
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">PENDING SIGN-OFF</span>
                            </div>
                          </div>

                          <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Items Manifest:</span>
                            {pr.items.map((it, idx) => (
                              <div key={idx} className="flex justify-between text-slate-700">
                                <span>{it.productName} (x{it.quantity} {it.unit})</span>
                                <span className="font-mono font-bold">₹{it.totalAmount.toLocaleString('en-IN')}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                            <button
                              onClick={() => {
                                const reason = prompt('Please enter rejection reason:', 'Budget allocation exceeded for current quarter');
                                if (reason) rejectRequisition(pr.id, reason);
                              }}
                              className="px-4 py-1.5 border border-red-300 text-red-700 hover:bg-red-50 rounded-lg text-xs font-bold"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => approveRequisition(pr.id)}
                              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs"
                            >
                              Approve & Issue PO
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Dedicated Formal Digital Legal Purchase Order View */}
              {activeModule === 'po-view' && digitalPo && (
                <div className="bg-white border border-slate-300 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <div>
                      <span className="px-2.5 py-1 rounded bg-blue-100 text-[#20638f] text-xs font-black uppercase">
                        Legal Purchase Order &bull; Buyer Direct
                      </span>
                      <h2 className="text-xl font-black text-slate-900 mt-1">Purchase Order: {digitalPo.poNumber}</h2>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => window.print()} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5">
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Document</span>
                      </button>
                      <button onClick={() => alert('Official Signed PO PDF downloaded.')} className="px-3 py-1.5 bg-[#20638f] text-white rounded-lg text-xs font-bold flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </button>
                    </div>
                  </div>

                  {/* Letterhead */}
                  <div className="grid grid-cols-2 gap-6 pb-4 border-b border-slate-200 text-xs">
                    <div>
                      <span className="font-bold text-slate-400 uppercase text-[10px] block">ISSUED BY (BUYER):</span>
                      <h3 className="text-base font-black text-slate-900">{digitalPo.companyName}</h3>
                      <p className="text-slate-600 mt-1">
                        Gate 2, Plant Operations, MIDC Industrial Area, Pune 411018<br />
                        GSTIN: <strong className="font-mono text-slate-900">{digitalPo.buyerGstin}</strong><br />
                        Authorized Officer: {digitalPo.buyerName}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-400 uppercase text-[10px] block">ISSUED TO (VENDOR):</span>
                      <h3 className="text-base font-black text-slate-900">{digitalPo.vendorName}</h3>
                      <p className="text-slate-600 mt-1">
                        GSTIN: <strong className="font-mono text-slate-900">{digitalPo.vendorGstin}</strong><br />
                        Delivery Gateway: {digitalPo.shippingAddress}<br />
                        Committed Delivery: <strong className="font-mono text-slate-900">{digitalPo.deliveryDate}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-[#f8fafc] text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-2.5">#</th>
                          <th className="p-2.5">Item Description</th>
                          <th className="p-2.5">HSN Code</th>
                          <th className="p-2.5 text-center">Qty</th>
                          <th className="p-2.5 text-right">Unit Rate (₹)</th>
                          <th className="p-2.5 text-right">Taxable (₹)</th>
                          <th className="p-2.5 text-right">GST</th>
                          <th className="p-2.5 text-right">Total (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                        {digitalPo.items.map((it, idx) => (
                          <tr key={idx}>
                            <td className="p-2.5 text-slate-500">{idx + 1}</td>
                            <td className="p-2.5 font-sans font-bold text-slate-900">{it.productName}</td>
                            <td className="p-2.5 text-slate-600">{it.hsnCode}</td>
                            <td className="p-2.5 text-center">{it.quantity} {it.unit}</td>
                            <td className="p-2.5 text-right">{it.unitPrice.toFixed(2)}</td>
                            <td className="p-2.5 text-right font-bold">{(it.unitPrice * it.quantity).toFixed(2)}</td>
                            <td className="p-2.5 text-right">{it.taxAmount.toFixed(2)}</td>
                            <td className="p-2.5 text-right font-black text-slate-900">{it.totalAmount.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* PO Footer & Signature Block */}
                  <div className="grid grid-cols-2 gap-6 text-xs pt-2">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <span className="text-[10px] font-black uppercase text-slate-400">Terms & Commercial Conditions:</span>
                      <p className="text-[11px] text-slate-600">
                        1. Material subject to physical inspection & GRN clearance.<br />
                        2. GST e-invoice barcode mandatory on shipping manifest.<br />
                        3. Payment terms: Net 30 days upon automated 3-Way Match.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-right">
                      <div className="flex justify-between font-bold text-sm">
                        <span>Total PO Commercial Value:</span>
                        <span className="font-mono text-blue-700">₹{digitalPo.totalAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="pt-3 border-t border-slate-200">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Authorized Digital Signatory</div>
                        <div className="font-script text-slate-800 text-sm mt-1 italic">Digitally Signed &bull; Reliable P2P Authority</div>
                        <div className="text-[10px] font-mono text-slate-500">DSC-CERT-{digitalPo.poNumber}-2026</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODULE 8: LOGISTICS (TRACKING, GATE INWARD) */}
          {/* ========================================================================= */}
          {activeModule.startsWith('logistics') && (
            <div className="space-y-4 max-w-6xl">
              <div className="pb-2 border-b-2 border-[#20638f] flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    {activeModule === 'logistics-gate' ? 'Gate Inward Register & Material Entry' : 'Logistics Planning & Consignment Telemetry'}
                  </h2>
                  <p className="text-xs text-slate-500">Live Carrier Airway Bills (AWB) & Material Gate Inward Manifest</p>
                </div>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                  <button onClick={() => setActiveModule('logistics-tracking')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'logistics-tracking' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>AWB Telemetry</button>
                  <button onClick={() => setActiveModule('logistics-gate')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'logistics-gate' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>Gate Inward Register</button>
                </div>
              </div>

              {/* AWB Tracking Cards */}
              {activeModule === 'logistics-tracking' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                      <div className="font-bold text-sm text-slate-900 flex items-center justify-between">
                        <span>BlueDart Express (BLUEDART-8829104)</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">IN TRANSIT</span>
                      </div>
                      <p className="text-xs text-slate-600">Route: Bhiwandi Logistics Park &rarr; Tata Advanced Systems (Plant Gate 2, Pune)</p>
                      <div className="text-[11px] text-slate-500 font-mono">Consignment: 35 Pcs Triple Pole MCBs &bull; Weight: 14.2 Kg</div>
                      <Link href="/order-tracking?q=BLUEDART-8829104" className="text-xs font-bold text-blue-700 hover:underline inline-block pt-1">
                        View Live Map & Milestone Timeline &rarr;
                      </Link>
                    </div>

                    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                      <div className="font-bold text-sm text-slate-900 flex items-center justify-between">
                        <span>Delhivery Surface (DELHIVERY-992144)</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">DELIVERED</span>
                      </div>
                      <p className="text-xs text-slate-600">Route: Mumbai Central &rarr; L&T Infra (Knowledge City, Vadodara)</p>
                      <div className="text-[11px] text-slate-500 font-mono">Consignment: 80 Pcs Safety Helmets &bull; Gate Pass #GP-8819</div>
                      <Link href="/order-tracking?q=DELHIVERY-992144" className="text-xs font-bold text-blue-700 hover:underline inline-block pt-1">
                        View Delivery Manifest &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Dedicated Gate Inward Register */}
              {activeModule === 'logistics-gate' && (
                <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-xs">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-[#f8fafc] text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Gate Pass #</th>
                        <th className="p-3">PO Reference</th>
                        <th className="p-3">Vehicle No</th>
                        <th className="p-3">Driver Name & Phone</th>
                        <th className="p-3">Security Officer</th>
                        <th className="p-3 text-center">Physical Seal</th>
                        <th className="p-3 text-center">Gate Status</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {[
                        { pass: 'GP-2026-0491', po: 'PO004932', vehicle: 'MH-12-QE-4921', driver: 'Rajesh Shinde (+91 9822019481)', guard: 'Subedar S. Patil', seal: 'INTACT (Seal #4829)', status: 'ENTRY CLEARED' },
                        { pass: 'GP-2026-0492', po: 'PO004933', vehicle: 'DL-01-AB-8819', driver: 'Mohammad Tariq (+91 9811048291)', guard: 'Officer V. Deshmukh', seal: 'INTACT (Seal #4830)', status: 'UNLOADED' },
                        { pass: 'GP-2026-0493', po: 'PO004934', vehicle: 'MH-14-GH-2041', driver: 'Sunil Jadhav (+91 9890124982)', guard: 'Subedar S. Patil', seal: 'PENDING VERIFICATION', status: 'GATE HOLD' },
                      ].map((g, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-blue-700">{g.pass}</td>
                          <td className="p-3 font-mono text-slate-800">{g.po}</td>
                          <td className="p-3 font-mono font-bold text-slate-900">{g.vehicle}</td>
                          <td className="p-3 text-slate-700">{g.driver}</td>
                          <td className="p-3 text-slate-600">{g.guard}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${g.seal.includes('INTACT') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                              {g.seal}
                            </span>
                          </td>
                          <td className="p-3 text-center font-bold text-slate-800">{g.status}</td>
                          <td className="p-3 text-center">
                            <button onClick={() => alert(`Gate Pass ${g.pass} printed.`)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-bold">
                              Print Pass
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODULE 9: INVENTORY (STOCKS, GRN, 3-WAY MATCH) */}
          {/* ========================================================================= */}
          {activeModule.startsWith('inventory') && (
            <div className="space-y-4 max-w-6xl">
              <div className="pb-2 border-b-2 border-[#20638f] flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    {activeModule === 'inventory-stocks' ? 'Warehouse Stock Ledger & Bin Locations' :
                     activeModule === 'inventory-grn' ? 'Goods Received Notes (GRN) Intake Register' : '3-Way Match Verification Desk'}
                  </h2>
                  <p className="text-xs text-slate-500">Warehouse Stocks, Physical Inward Inspection, and Automated Reconciliation</p>
                </div>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                  <button onClick={() => setActiveModule('inventory-stocks')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'inventory-stocks' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>Stock Ledger</button>
                  <button onClick={() => setActiveModule('inventory-grn')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'inventory-grn' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>GRN Receipts</button>
                  <button onClick={() => setActiveModule('inventory-match')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'inventory-match' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>3-Way Match</button>
                </div>
              </div>

              {stockSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{stockSuccessMsg}</span>
                </div>
              )}

              {/* Warehouse Stock Ledger */}
              {activeModule === 'inventory-stocks' && (
                <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-xs">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-[#f8fafc] text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">SKU</th>
                        <th className="p-3">Product Name</th>
                        <th className="p-3">Warehouse Hub</th>
                        <th className="p-3">Bin Location</th>
                        <th className="p-3">Batch #</th>
                        <th className="p-3 text-center font-mono">On-Hand</th>
                        <th className="p-3 text-center font-mono">Reserved</th>
                        <th className="p-3 text-center font-mono">Reorder Pt</th>
                        <th className="p-3 text-center">Adjust Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {products.map((p, idx) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-blue-700">{p.sku}</td>
                          <td className="p-3 font-bold text-slate-900">{p.name}</td>
                          <td className="p-3 text-slate-600">{idx % 2 === 0 ? 'Bhiwandi Central Hub' : 'MIDC Pune Hub'}</td>
                          <td className="p-3 font-mono text-slate-700">BIN-{(idx + 1).toString().padStart(2, '0')}-A</td>
                          <td className="p-3 font-mono text-slate-500">BATCH-2026-{(idx + 101)}</td>
                          <td className="p-3 text-center font-mono font-bold text-slate-900">{p.stock}</td>
                          <td className="p-3 text-center font-mono text-slate-500">{Math.round(p.stock * 0.15)}</td>
                          <td className="p-3 text-center font-mono text-amber-700 font-bold">{p.moq * 5}</td>
                          <td className="p-3 text-center">
                            <div className="inline-flex items-center gap-1">
                              <input
                                type="number"
                                defaultValue={p.stock}
                                onChange={(e) => setStockAdjustMap(prev => ({ ...prev, [p.id]: Number(e.target.value) }))}
                                className="w-16 p-1 border border-slate-300 rounded text-center text-xs font-mono"
                              />
                              <button
                                onClick={() => handleStockUpdate(p.id)}
                                className="px-2 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white rounded text-[11px] font-bold"
                              >
                                Save
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Dedicated GRN Intake Receipts Table */}
              {activeModule === 'inventory-grn' && (
                <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-xs">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-[#f8fafc] text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">GRN #</th>
                        <th className="p-3">PO Reference</th>
                        <th className="p-3">Inward Date</th>
                        <th className="p-3">Inspected By</th>
                        <th className="p-3 text-center">Ordered</th>
                        <th className="p-3 text-center">Received</th>
                        <th className="p-3 text-center">Accepted</th>
                        <th className="p-3 text-center">Rejected</th>
                        <th className="p-3 text-center">Inspection Stamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {[
                        { grn: 'GRN-2026-0081', po: 'PO004932', date: '2026-09-14', inspector: 'S. Patil (QA Officer)', ord: 35, rec: 35, acc: 35, rej: 0, stamp: '100% QA PASSED' },
                        { grn: 'GRN-2026-0082', po: 'PO004933', date: '2026-09-14', inspector: 'D. Shinde (EHS Lead)', ord: 80, rec: 80, acc: 80, rej: 0, stamp: '100% QA PASSED' },
                        { grn: 'GRN-2026-0083', po: 'PO004931', date: '2026-09-12', inspector: 'Gate Inward Security', ord: 14, rec: 0, acc: 0, rej: 14, stamp: 'RTO REJECTED (Cancelled)' },
                      ].map((g, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-blue-700">{g.grn}</td>
                          <td className="p-3 font-mono text-slate-800">{g.po}</td>
                          <td className="p-3 text-slate-600">{g.date}</td>
                          <td className="p-3 text-slate-700">{g.inspector}</td>
                          <td className="p-3 text-center font-mono">{g.ord}</td>
                          <td className="p-3 text-center font-mono font-bold text-slate-800">{g.rec}</td>
                          <td className="p-3 text-center font-mono text-emerald-700 font-bold">{g.acc}</td>
                          <td className="p-3 text-center font-mono text-red-600 font-bold">{g.rej}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${g.rej > 0 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                              {g.stamp}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 3-Way Match Verification */}
              {activeModule === 'inventory-match' && (
                <div className="space-y-3">
                  <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-xs">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead className="bg-[#f8fafc] text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3">PO Reference</th>
                          <th className="p-3">Vendor</th>
                          <th className="p-3 text-right">PO Amount</th>
                          <th className="p-3 text-center">GRN Physical Receipt</th>
                          <th className="p-3 text-right">Invoice Amount</th>
                          <th className="p-3 text-center">3-Way Match</th>
                          <th className="p-3 text-center">Settlement Status</th>
                          <th className="p-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {matches.map((m, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-3 font-mono font-bold text-blue-700">{m.poNumber}</td>
                            <td className="p-3 font-bold text-slate-900">{m.vendorName}</td>
                            <td className="p-3 text-right font-mono font-semibold text-slate-900">₹{m.poAmount.toLocaleString('en-IN')}</td>
                            <td className="p-3 text-center">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                {m.grnStatus}
                              </span>
                            </td>
                            <td className="p-3 text-right font-mono font-semibold text-slate-900">₹{m.invoiceAmount.toLocaleString('en-IN')}</td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                m.matchStatus === 'MATCHED' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {m.matchStatus}
                              </span>
                            </td>
                            <td className="p-3 text-center font-bold text-emerald-700">{m.paymentSettlementStatus}</td>
                            <td className="p-3 text-center">
                              {m.paymentSettlementStatus !== 'CLEARED' ? (
                                <button
                                  onClick={() => clearMatchSettlement(m.poNumber)}
                                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold shadow-xs"
                                >
                                  Clear Settlement
                                </button>
                              ) : (
                                <span className="text-[11px] text-slate-400 font-bold">Settled</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODULE 10: REPORTS (SPEND, GST ITC, SAVINGS) */}
          {/* ========================================================================= */}
          {activeModule.startsWith('reports') && (
            <div className="space-y-4 max-w-6xl">
              <div className="pb-2 border-b-2 border-[#20638f] flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    {activeModule === 'reports-gst' ? 'GSTR-2B Input Tax Credit (ITC) Reconciliation Desk' :
                     activeModule === 'reports-savings' ? 'Contract Volume Savings Realization Report' : 'Procurement Spend & Tax Compliance Reports'}
                  </h2>
                  <p className="text-xs text-slate-500">Spend Analytics, GST Input Tax Credit (ITC), and Volume Savings Realization</p>
                </div>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                  <button onClick={() => setActiveModule('reports-spend')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'reports-spend' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>Spend Analytics</button>
                  <button onClick={() => setActiveModule('reports-gst')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'reports-gst' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>GST ITC</button>
                  <button onClick={() => setActiveModule('reports-savings')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'reports-savings' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>Savings Realized</button>
                </div>
              </div>

              {/* Spend Analytics Overview */}
              {activeModule === 'reports-spend' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Total ITC Validated</span>
                      <div className="text-2xl font-black text-slate-900 font-mono">₹28,14,350</div>
                      <div className="text-[10px] text-emerald-600 font-bold">100% GSTR-2B reconciled</div>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Contract Savings Realized</span>
                      <div className="text-2xl font-black text-slate-900 font-mono">₹22,80,000</div>
                      <div className="text-[10px] text-blue-600 font-bold">Volume tier price benefit</div>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Active Rate Contracts</span>
                      <div className="text-2xl font-black text-slate-900 font-mono">14 ARC</div>
                      <div className="text-[10px] text-purple-600 font-bold">Annual locked pricing</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Dedicated GSTR-2B Input Tax Credit Table */}
              {activeModule === 'reports-gst' && (
                <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-xs">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-[#f8fafc] text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Invoice #</th>
                        <th className="p-3">Vendor Legal Name</th>
                        <th className="p-3">Vendor GSTIN</th>
                        <th className="p-3 text-right">Taxable Value</th>
                        <th className="p-3 text-right">CGST (9%)</th>
                        <th className="p-3 text-right">SGST (9%)</th>
                        <th className="p-3 text-center">ITC Eligibility</th>
                        <th className="p-3 text-center">GSTR-2B Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {[
                        { inv: 'INV-2026-OM-PO004931', vendor: 'Om Fire Services', gstin: '07AABCO4829K1Z5', val: 47166.00, cgst: 4244.94, sgst: 4244.94, elig: 'Eligible u/s 16', status: 'RECONCILED' },
                        { inv: 'INV-2026-ISH-PO004932', vendor: 'Industrial Supply Hub', gstin: '27AABFI9876P1ZR', val: 35593.22, cgst: 3203.39, sgst: 3203.39, elig: 'Eligible u/s 16', status: 'RECONCILED' },
                        { inv: 'INV-2026-KRM-PO004933', vendor: 'Karam Safety Solutions', gstin: '07AAACK4321D1ZN', val: 16610.17, cgst: 1494.92, sgst: 1494.92, elig: 'Eligible u/s 16', status: 'RECONCILED' },
                        { inv: 'INV-2026-SCH-PO004934', vendor: 'Schneider Electric Direct', gstin: '29AABCS1234K1ZV', val: 29237.28, cgst: 2631.36, sgst: 2631.36, elig: 'Eligible u/s 16', status: 'PENDING_PORTAL' },
                      ].map((g, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-blue-700">{g.inv}</td>
                          <td className="p-3 font-bold text-slate-900">{g.vendor}</td>
                          <td className="p-3 font-mono text-slate-700">{g.gstin}</td>
                          <td className="p-3 text-right font-mono font-bold text-slate-900">₹{g.val.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td className="p-3 text-right font-mono text-slate-600">₹{g.cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td className="p-3 text-right font-mono text-slate-600">₹{g.sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td className="p-3 text-center font-medium text-emerald-700">{g.elig}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${g.status === 'RECONCILED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                              {g.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Dedicated Savings Realization Table */}
              {activeModule === 'reports-savings' && (
                <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-xs">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-[#f8fafc] text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">SKU</th>
                        <th className="p-3">Product Name</th>
                        <th className="p-3 text-right">Benchmark MRP</th>
                        <th className="p-3 text-right">Reliable Rate</th>
                        <th className="p-3 text-center">Savings / Unit</th>
                        <th className="p-3 text-center">Volume Bought</th>
                        <th className="p-3 text-right">Cost Avoidance Realized</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {products.slice(0, 6).map((p) => {
                        const mrp = p.basePrice;
                        const contract = p.contractPrice || Math.round(mrp * 0.9);
                        const diff = mrp - contract;
                        const bought = 80;
                        const savedTotal = diff * bought;

                        return (
                          <tr key={p.id} className="hover:bg-slate-50">
                            <td className="p-3 font-mono font-bold text-blue-700">{p.sku}</td>
                            <td className="p-3 font-bold text-slate-900">{p.name}</td>
                            <td className="p-3 text-right font-mono text-slate-500">₹{mrp}</td>
                            <td className="p-3 text-right font-mono font-bold text-emerald-700">₹{contract}</td>
                            <td className="p-3 text-center font-mono font-bold text-emerald-700">₹{diff} (10%)</td>
                            <td className="p-3 text-center font-mono">{bought} {p.unit}</td>
                            <td className="p-3 text-right font-mono font-black text-slate-900">₹{savedTotal.toLocaleString('en-IN')}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODULE 11: ESCALATION (TICKETS, SLA VIOLATIONS) */}
          {/* ========================================================================= */}
          {activeModule.startsWith('escalation') && (
            <div className="space-y-4 max-w-6xl">
              <div className="pb-2 border-b-2 border-[#20638f] flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    {activeModule === 'escalation-sla' ? 'Vendor SLA Breach & Liquidated Damages Tracker' : 'Escalation & Dispute Desk'}
                  </h2>
                  <p className="text-xs text-slate-500">Service Level Agreement (SLA) Violations and Support Tickets</p>
                </div>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                  <button onClick={() => setActiveModule('escalation-tickets')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'escalation-tickets' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>Support Tickets</button>
                  <button onClick={() => setActiveModule('escalation-sla')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'escalation-sla' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>SLA Violations</button>
                </div>
              </div>

              {/* Tickets Table */}
              {activeModule === 'escalation-tickets' && (
                <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-xs">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-[#f8fafc] text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Ticket ID</th>
                        <th className="p-3">Related Order</th>
                        <th className="p-3">Enterprise Buyer</th>
                        <th className="p-3">Supplier Involved</th>
                        <th className="p-3">Issue Summary</th>
                        <th className="p-3 text-center">Priority</th>
                        <th className="p-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-red-600">#ESC-1092</td>
                        <td className="p-3 font-mono text-blue-700">PO004931</td>
                        <td className="p-3 font-bold text-slate-900">Concentrix</td>
                        <td className="p-3 text-slate-700">Om Fire Services</td>
                        <td className="p-3 text-slate-600">Dispatch delay on 11 Nos Fire Extinguishers &bull; Resolved via cancellation & RTO</td>
                        <td className="p-3 text-center"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">MEDIUM</span></td>
                        <td className="p-3 text-center"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">RESOLVED</span></td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-blue-600">#ESC-1088</td>
                        <td className="p-3 font-mono text-blue-700">PO004932</td>
                        <td className="p-3 font-bold text-slate-900">Tata Advanced Systems</td>
                        <td className="p-3 text-slate-700">Industrial Supply Hub</td>
                        <td className="p-3 text-slate-600">Plant gate entry pass barcode reissue &bull; Delivered via BlueDart</td>
                        <td className="p-3 text-center"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">LOW</span></td>
                        <td className="p-3 text-center"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">CLOSED</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Dedicated SLA Violations Matrix */}
              {activeModule === 'escalation-sla' && (
                <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-xs">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-[#f8fafc] text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Supplier Name</th>
                        <th className="p-3">Order ID</th>
                        <th className="p-3">Committed Date</th>
                        <th className="p-3">Actual Date</th>
                        <th className="p-3 text-center">Delay Days</th>
                        <th className="p-3">Root Cause</th>
                        <th className="p-3 text-right">Liquidated Penalty (0.5%/wk)</th>
                        <th className="p-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {[
                        { supplier: 'Om Fire Services', order: 'PO004931', commit: '2026-09-08', actual: '2026-09-12', delay: 4, cause: 'Hydrostatic pressure testing queue delay', penalty: 278.34, status: 'ORDER CANCELLED' },
                        { supplier: 'Industrial Supply Hub', order: 'PO004932', commit: '2026-09-13', actual: '2026-09-13', delay: 0, cause: 'Nil (Dispatched on time)', penalty: 0.00, status: 'NO BREACH' },
                      ].map((s, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{s.supplier}</td>
                          <td className="p-3 font-mono font-bold text-blue-700">{s.order}</td>
                          <td className="p-3 text-slate-600">{s.commit}</td>
                          <td className="p-3 text-slate-600">{s.actual}</td>
                          <td className="p-3 text-center font-mono font-bold text-red-600">{s.delay > 0 ? `+${s.delay} Days` : 'On Time'}</td>
                          <td className="p-3 text-slate-600">{s.cause}</td>
                          <td className="p-3 text-right font-mono font-bold text-slate-900">{s.penalty > 0 ? `₹${s.penalty.toFixed(2)}` : '₹0.00'}</td>
                          <td className="p-3 text-center font-bold text-xs">{s.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODULE 12: RETURN ORDER MANAGEMENT (RTO, CREDIT NOTES) */}
          {/* ========================================================================= */}
          {activeModule.startsWith('return') && (
            <div className="space-y-4 max-w-6xl">
              <div className="pb-2 border-b-2 border-[#20638f] flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    {activeModule === 'return-credits' ? 'GST Statutory Credit Notes Register' : 'Return Order Management (RTO)'}
                  </h2>
                  <p className="text-xs text-slate-500">Material Rejection, Gate Turnbacks, and GST Credit Notes</p>
                </div>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                  <button onClick={() => setActiveModule('return-orders')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'return-orders' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>RTO Manifest</button>
                  <button onClick={() => setActiveModule('return-credits')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'return-credits' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>Credit Notes</button>
                </div>
              </div>

              {/* RTO Manifest */}
              {activeModule === 'return-orders' && (
                <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-xs">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-[#f8fafc] text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">RTO Return ID</th>
                        <th className="p-3">Order ID</th>
                        <th className="p-3">Buyer Enterprise</th>
                        <th className="p-3">Supplier Name</th>
                        <th className="p-3">Return Reason</th>
                        <th className="p-3 text-right">Credit Note Total</th>
                        <th className="p-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-purple-700">RTO-2026-081</td>
                        <td className="p-3 font-mono text-blue-700">PO0049310</td>
                        <td className="p-3 font-bold text-slate-900">Concentrix</td>
                        <td className="p-3 text-slate-700">Om Fire Services</td>
                        <td className="p-3 text-slate-600">Order cancelled prior to physical gate inward</td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900">₹55,668.86</td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            CREDIT NOTE ISSUED
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Dedicated GST Credit Notes Register */}
              {activeModule === 'return-credits' && (
                <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-xs">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-[#f8fafc] text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Credit Note #</th>
                        <th className="p-3">Original Invoice #</th>
                        <th className="p-3">Enterprise Buyer</th>
                        <th className="p-3">Vendor</th>
                        <th className="p-3 text-right">Taxable Amount</th>
                        <th className="p-3 text-right">GST Adjustment</th>
                        <th className="p-3 text-right">Total Credit</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {[
                        { cn: 'CN-2026-0042', inv: 'INV-2026-OM-PO004931', buyer: 'Concentrix', vendor: 'Om Fire Services', taxable: 47166.00, gst: 8502.86, total: 55668.86 },
                      ].map((c, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-purple-700">{c.cn}</td>
                          <td className="p-3 font-mono text-slate-700">{c.inv}</td>
                          <td className="p-3 font-bold text-slate-900">{c.buyer}</td>
                          <td className="p-3 text-slate-700">{c.vendor}</td>
                          <td className="p-3 text-right font-mono">₹{c.taxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td className="p-3 text-right font-mono text-emerald-700 font-semibold">₹{c.gst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td className="p-3 text-right font-mono font-black text-slate-900">₹{c.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td className="p-3 text-center">
                            <button onClick={() => alert(`Credit Note ${c.cn} printed.`)} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs font-bold text-slate-700">
                              Print Credit Note
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: OFFICIAL GST TAX INVOICE & PO RECEIPT (Concentrix & Om Fire) */}
      {/* ========================================================================= */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-slate-300 p-6 sm:p-8 space-y-6 text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Toolbar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-blue-100 text-[#20638f] text-xs font-black uppercase">
                  GST Tax Invoice &bull; Original for Recipient
                </span>
                <span className="text-xs text-slate-500 font-mono">Invoice #{selectedOrder.masterOrderId}-INV</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Letterhead */}
            <div className="grid grid-cols-2 gap-6 pb-4 border-b border-slate-200 text-xs">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  {selectedOrder.supplierName}
                </h2>
                <p className="text-slate-600 mt-1">
                  Plot 48, Sector 18, Electronic City, Udyog Vihar<br />
                  Gurugram, Haryana &bull; 122015<br />
                  GSTIN: <strong className="font-mono text-slate-900">07AABCO4829K1Z5</strong> &bull; PAN: <strong className="font-mono text-slate-900">AABCO4829K</strong><br />
                  State: <strong>Haryana (Code 07)</strong>
                </p>
              </div>

              <div className="text-right space-y-1">
                <div className="font-mono text-xs">
                  <span className="text-slate-500">Invoice No:</span> <strong className="text-slate-900">INV-2026-OM-{selectedOrder.masterOrderId}</strong>
                </div>
                <div className="font-mono text-xs">
                  <span className="text-slate-500">Invoice Date:</span> <strong className="text-slate-900">{selectedOrder.orderDate}</strong>
                </div>
                <div className="font-mono text-xs">
                  <span className="text-slate-500">Buyer PO Ref:</span> <strong className="text-blue-700">{selectedOrder.masterOrderId}</strong>
                </div>
                <div className="font-mono text-xs">
                  <span className="text-slate-500">Order ID:</span> <strong className="text-slate-700">{selectedOrder.orderId}</strong>
                </div>
                <div className="text-[10px] text-slate-500">
                  Place of Supply: <strong>Haryana (07) &bull; Intra-State</strong>
                </div>
              </div>
            </div>

            {/* Bill To & Ship To */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="font-black text-slate-400 uppercase text-[10px] tracking-wider block mb-1">
                  Billed To (Enterprise Buyer):
                </span>
                <strong className="text-slate-900 text-sm">{selectedOrder.buyerName}</strong>
                <p className="text-slate-600 mt-0.5">
                  Building 14, Tower C, DLF Cyber City, Phase 2<br />
                  Gurugram, Haryana &bull; 122002<br />
                  GSTIN: <strong className="font-mono text-slate-900">07AAACC2389P1ZM</strong>
                </p>
              </div>

              <div>
                <span className="font-black text-slate-400 uppercase text-[10px] tracking-wider block mb-1">
                  Shipped To / Consignee:
                </span>
                <strong className="text-slate-900 text-sm">{selectedOrder.buyerName} - Facilities & Safety</strong>
                <p className="text-slate-600 mt-0.5">
                  Gate No. 2, Security & EHS Store, DLF Cyber City<br />
                  Gurugram, Haryana &bull; 122002<br />
                  Delivery Contact: Facilities Manager (+91 7290090309)
                </p>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#f8fafc] text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5 border-r border-slate-200 w-10 text-center">#</th>
                    <th className="p-2.5 border-r border-slate-200">Description of Goods / Services</th>
                    <th className="p-2.5 border-r border-slate-200 text-center">HSN/SAC</th>
                    <th className="p-2.5 border-r border-slate-200 text-center">Qty</th>
                    <th className="p-2.5 border-r border-slate-200 text-right">Rate (₹)</th>
                    <th className="p-2.5 border-r border-slate-200 text-right">Taxable (₹)</th>
                    <th className="p-2.5 border-r border-slate-200 text-right">CGST (9%)</th>
                    <th className="p-2.5 border-r border-slate-200 text-right">SGST (9%)</th>
                    <th className="p-2.5 text-right font-black">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                  {selectedOrder.items.map((it, i) => {
                    const taxable = it.unitPriceExclGst * it.quantity;
                    const cgst = taxable * 0.09;
                    const sgst = taxable * 0.09;
                    return (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-2.5 border-r border-slate-200 text-center text-slate-500">{i + 1}</td>
                        <td className="p-2.5 border-r border-slate-200 font-sans">
                          <strong className="text-slate-900 block">{it.name}</strong>
                          <span className="text-[10px] text-slate-500">SKU: {it.sku} &bull; {it.description}</span>
                        </td>
                        <td className="p-2.5 border-r border-slate-200 text-center">842410</td>
                        <td className="p-2.5 border-r border-slate-200 text-center font-bold">{it.quantity} {it.unit}</td>
                        <td className="p-2.5 border-r border-slate-200 text-right">{it.unitPriceExclGst.toFixed(2)}</td>
                        <td className="p-2.5 border-r border-slate-200 text-right font-bold">{taxable.toFixed(2)}</td>
                        <td className="p-2.5 border-r border-slate-200 text-right text-slate-600">{cgst.toFixed(2)}</td>
                        <td className="p-2.5 border-r border-slate-200 text-right text-slate-600">{sgst.toFixed(2)}</td>
                        <td className="p-2.5 text-right font-black text-slate-900">{it.totalAmountInclGst.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Calculations & Bank Summary */}
            <div className="grid grid-cols-2 gap-6 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                  Bank Transfer & Statutory Declarations:
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Bank: <strong>HDFC Bank Ltd &bull; Corporate Branch</strong><br />
                  A/C Name: <strong>Om Fire Services Operating A/C</strong><br />
                  A/C No: <strong className="font-mono">50200049318291</strong> &bull; IFSC: <strong className="font-mono">HDFC0001234</strong><br />
                  Terms: Net 30 Days from date of invoice submission.
                </p>
                <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 italic">
                  &ldquo;Certified that the particulars given above are true and correct and the amount indicated represents the price actually charged.&rdquo;
                </div>
              </div>

              <div className="space-y-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Total Taxable Value:</span>
                    <span className="font-mono font-bold">
                      ₹{selectedOrder.items.reduce((s, it) => s + (it.unitPriceExclGst * it.quantity), 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Central GST (CGST 9%):</span>
                    <span className="font-mono">
                      ₹{(selectedOrder.items.reduce((s, it) => s + (it.unitPriceExclGst * it.quantity), 0) * 0.09).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>State GST (SGST 9%):</span>
                    <span className="font-mono">
                      ₹{(selectedOrder.items.reduce((s, it) => s + (it.unitPriceExclGst * it.quantity), 0) * 0.09).toFixed(2)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-black text-slate-900">
                    <span>Invoice Value (INR):</span>
                    <span className="font-mono text-[#20638f]">
                      ₹{selectedOrder.items.reduce((s, it) => s + it.totalAmountInclGst, 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="text-right pt-2">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">For {selectedOrder.supplierName}</div>
                  <div className="h-10 flex items-center justify-end font-script text-slate-700 italic text-sm">
                    Authorized Signatory &bull; Digitally Signed
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">DSC-07-2026-OM-9041</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function AdminPortalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#225b82] text-white p-8 text-xs flex items-center justify-center">Loading Admin Portal...</div>}>
      <AdminPortalContent />
    </Suspense>
  );
}
