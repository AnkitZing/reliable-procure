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
  TrendingUp, Download, UploadCloud, RefreshCw
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

  // Search and filters for tables
  const [filterQuery, setFilterQuery] = useState('');

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

  const { currentUser, products, requisitions, purchaseOrders, companies, matches } = useReliableStore();

  const selectedOrder = SAMPLE_ADMIN_ORDERS[selectedOrderIndex] || SAMPLE_ADMIN_ORDERS[0];

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
          {/* SUBMENU 1: ORDER DETAILS (THE EXACT VIEW FROM USER'S SCREENSHOT) */}
          {/* ========================================================================= */}
          {activeModule === 'order-details' && (
            <div className="space-y-6 max-w-6xl">
              
              {/* Order Selection Pill Tabs */}
              <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-2 gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Switch Order:</span>
                  {SAMPLE_ADMIN_ORDERS.map((ord, idx) => (
                    <button
                      key={ord.orderId}
                      onClick={() => setSelectedOrderIndex(idx)}
                      className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition cursor-pointer ${
                        selectedOrderIndex === idx
                          ? 'bg-[#20638f] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {ord.orderId} ({ord.buyerName})
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
          {/* SUBMENU 2: ALL ORDERS MASTER LIST */}
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
                  <p className="text-xs text-slate-500">Full lifecycle monitoring across enterprises and supplier hubs</p>
                </div>
                <button
                  onClick={() => setActiveModule('order-details')}
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
                    {SAMPLE_ADMIN_ORDERS
                      .filter(o => {
                        if (activeModule === 'orders-in-transit') return o.status === 'In Transit';
                        if (activeModule === 'orders-delivered') return o.status === 'Delivered';
                        if (activeModule === 'orders-cancelled') return o.status === 'Cancelled';
                        return true;
                      })
                      .map((ord, idx) => (
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
                                setSelectedOrderIndex(SAMPLE_ADMIN_ORDERS.indexOf(ord));
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
          {/* SUBMENU 3: DASHBOARD OVERVIEW & LIVE MONITOR */}
          {/* ========================================================================= */}
          {(activeModule === 'dashboard-overview' || activeModule === 'dashboard-live') && (
            <div className="space-y-6 max-w-6xl">
              <div className="pb-2 border-b-2 border-[#20638f] flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Operations Overview & Live Telemetry</h2>
                  <p className="text-xs text-slate-500">RacknSell Enterprise B2B KPI Summary</p>
                </div>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                  <button 
                    onClick={() => setActiveModule('dashboard-overview')}
                    className={`px-3 py-1 rounded text-xs font-bold transition ${activeModule === 'dashboard-overview' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}
                  >
                    KPI Summary
                  </button>
                  <button 
                    onClick={() => setActiveModule('dashboard-live')}
                    className={`px-3 py-1 rounded text-xs font-bold transition ${activeModule === 'dashboard-live' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}
                  >
                    Live Telemetry
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Total Master Orders</span>
                  <div className="text-2xl font-black text-slate-900 font-mono">1,492</div>
                  <div className="text-[10px] text-emerald-600 font-bold">+18 today</div>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Total GMV Spend</span>
                  <div className="text-2xl font-black text-slate-900 font-mono">₹1,84,20,500</div>
                  <div className="text-[10px] text-blue-600 font-bold">12.4% avg savings</div>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Client Enterprises</span>
                  <div className="text-2xl font-black text-slate-900 font-mono">42</div>
                  <div className="text-[10px] text-slate-500">Concentrix, Tata, L&T, Siemens</div>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Verified Suppliers</span>
                  <div className="text-2xl font-black text-slate-900 font-mono">185</div>
                  <div className="text-[10px] text-emerald-600 font-bold">100% GST Validated</div>
                </div>
              </div>

              {/* Recent Orders Stream */}
              <div className="border border-slate-200 rounded-xl bg-white p-4 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Live Procurement Feed</h3>
                <div className="space-y-2">
                  {SAMPLE_ADMIN_ORDERS.map((ord) => (
                    <div key={ord.orderId} className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-blue-700">{ord.orderId}</span> &bull; <strong>{ord.buyerName}</strong> &rarr; <span className="text-slate-600">{ord.supplierName}</span>
                        <div className="text-[11px] text-slate-500">{ord.items.length} items &bull; ₹{ord.items.reduce((s, it) => s + it.totalAmountInclGst, 0).toLocaleString('en-IN')}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ord.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                        ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {ord.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUBMENU 4: CATALOGUE MANAGEMENT (PRODUCTS, CATEGORIES, BRANDS, BULK) */}
          {/* ========================================================================= */}
          {activeModule.startsWith('catalogue') && (
            <div className="space-y-4 max-w-6xl">
              <div className="pb-2 border-b-2 border-[#20638f] flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    {activeModule === 'catalogue-categories' ? 'Category Taxonomy Master (L0-L2)' :
                     activeModule === 'catalogue-brands' ? 'Brand Master Directory' :
                     activeModule === 'catalogue-bulk' ? 'Bulk CSV Pricing Upload' : 'Catalogue Products Master'}
                  </h2>
                  <p className="text-xs text-slate-500">13 Industrial Procurement Taxonomy Categories</p>
                </div>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                  <button onClick={() => setActiveModule('catalogue-products')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'catalogue-products' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>Products</button>
                  <button onClick={() => setActiveModule('catalogue-categories')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'catalogue-categories' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>13 Categories</button>
                  <button onClick={() => setActiveModule('catalogue-brands')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'catalogue-brands' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>Brands</button>
                  <button onClick={() => setActiveModule('catalogue-bulk')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'catalogue-bulk' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>Bulk CSV</button>
                </div>
              </div>

              {activeModule === 'catalogue-products' && (
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
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-slate-700">{p.sku}</td>
                          <td className="p-3 font-bold text-slate-900">{p.name}</td>
                          <td className="p-3 text-slate-600">{p.category}</td>
                          <td className="p-3 font-semibold text-blue-700">{p.brand}</td>
                          <td className="p-3 text-right font-mono text-slate-500">₹{p.basePrice}</td>
                          <td className="p-3 text-right font-mono font-bold text-emerald-700">₹{p.contractPrice}</td>
                          <td className="p-3 text-center font-mono font-bold text-slate-800">{p.stock}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

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

              {activeModule === 'catalogue-bulk' && (
                <div className="p-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 text-center space-y-3">
                  <UploadCloud className="w-10 h-10 text-blue-600 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-800">Drag and drop RacknSell-formatted CSV catalog files</h3>
                  <button onClick={() => alert('CSV file uploaded successfully! 1,400 SKUs updated.')} className="px-4 py-2 bg-[#20638f] text-white rounded text-xs font-bold">
                    Upload Sample File
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUBMENU 5: SUPPLIER MANAGEMENT */}
          {/* ========================================================================= */}
          {activeModule.startsWith('supplier') && (
            <div className="space-y-4 max-w-6xl">
              <div className="pb-2 border-b-2 border-[#20638f] flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    {activeModule === 'supplier-kyc' ? 'Supplier KYC & Statutory Verification' :
                     activeModule === 'supplier-add' ? 'Onboard New Supplier' : 'Supplier Master Directory'}
                  </h2>
                  <p className="text-xs text-slate-500">Verified OEM channels, MSME manufacturers, and fulfillment hubs</p>
                </div>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                  <button onClick={() => setActiveModule('supplier-list')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'supplier-list' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>Suppliers</button>
                  <button onClick={() => setActiveModule('supplier-kyc')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'supplier-kyc' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>KYC Status</button>
                  <button onClick={() => setActiveModule('supplier-add')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'supplier-add' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>+ Onboard</button>
                </div>
              </div>

              {activeModule === 'supplier-list' && (
                <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-xs">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-[#f8fafc] text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Supplier Name</th>
                        <th className="p-3">GSTIN</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">Payment Terms</th>
                        <th className="p-3 text-center">Rating</th>
                        <th className="p-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {[
                        { name: 'Om Fire Services', gstin: '27AAAFO1234M1Z2', loc: 'Pune, MH', terms: 'Immediate', rating: '4.8', status: 'ACTIVE' },
                        { name: 'Industrial Supply Hub LLP', gstin: '27AABFI9876P1ZR', loc: 'Bhiwandi, MH', terms: 'Net 30', rating: '4.9', status: 'ACTIVE' },
                        { name: 'Karam Safety Solutions', gstin: '07AAACK4321D1ZN', loc: 'Okhla, Delhi', terms: 'Net 30', rating: '4.9', status: 'ACTIVE' },
                        { name: 'Schneider Electric Direct', gstin: '29AABCS1234K1ZV', loc: 'Bengaluru, KA', terms: 'Net 45', rating: '5.0', status: 'ACTIVE' },
                        { name: 'Berger Protective Coatings', gstin: '19AABCB5678J1Z9', loc: 'Kolkata, WB', terms: 'Net 45', rating: '4.7', status: 'ACTIVE' },
                      ].map((s, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{s.name}</td>
                          <td className="p-3 font-mono text-slate-700">{s.gstin}</td>
                          <td className="p-3 text-slate-600">{s.loc}</td>
                          <td className="p-3 font-medium text-slate-800">{s.terms}</td>
                          <td className="p-3 text-center font-bold text-amber-600">{s.rating} ★</td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {s.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeModule === 'supplier-kyc' && (
                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Statutory Verification Desk</h3>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
                      <div>
                        <strong>Om Fire Services</strong> &bull; GSTIN: <code>27AAAFO1234M1Z2</code>
                        <div className="text-[11px] text-slate-500">Bank Mandate: HDFC Bank (Verified) &bull; MSME: Micro Enterprise</div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">KYC APPROVED</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
                      <div>
                        <strong>Industrial Supply Hub LLP</strong> &bull; GSTIN: <code>27AABFI9876P1ZR</code>
                        <div className="text-[11px] text-slate-500">Bank Mandate: ICICI CMS (Verified) &bull; MSME: Small Enterprise</div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">KYC APPROVED</span>
                    </div>
                  </div>
                </div>
              )}

              {activeModule === 'supplier-add' && (
                <div className="p-6 bg-white border border-slate-200 rounded-xl max-w-lg space-y-3">
                  <h3 className="text-sm font-bold text-slate-900">Onboard Supplier Form</h3>
                  <input type="text" placeholder="Vendor Legal Firm Name" className="w-full p-2 border border-slate-300 rounded text-xs" />
                  <input type="text" placeholder="15-digit GSTIN" className="w-full p-2 border border-slate-300 rounded text-xs font-mono" />
                  <input type="email" placeholder="Official Email" className="w-full p-2 border border-slate-300 rounded text-xs" />
                  <button onClick={() => { alert('Supplier invitation queued!'); setActiveModule('supplier-list'); }} className="px-4 py-2 bg-[#20638f] text-white rounded text-xs font-bold">
                    Submit Supplier Onboarding
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUBMENU 6: CORPORATE BUYDESK */}
          {/* ========================================================================= */}
          {activeModule.startsWith('buydesk') && (
            <div className="space-y-4 max-w-6xl">
              <div className="pb-2 border-b-2 border-[#20638f] flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Corporate Buydesk Master</h2>
                  <p className="text-xs text-slate-500">Enterprise Clients, Cost Centers, and Spend Hierarchy</p>
                </div>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                  <button onClick={() => setActiveModule('buydesk-enterprises')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'buydesk-enterprises' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>Enterprises</button>
                  <button onClick={() => setActiveModule('buydesk-departments')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'buydesk-departments' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>Cost Centers</button>
                  <button onClick={() => setActiveModule('buydesk-rules')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'buydesk-rules' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>Threshold Rules</button>
                </div>
              </div>

              {activeModule === 'buydesk-enterprises' && (
                <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-xs">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-[#f8fafc] text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Enterprise Client</th>
                        <th className="p-3">GSTIN</th>
                        <th className="p-3">Credit Facility</th>
                        <th className="p-3">Credit Utilized</th>
                        <th className="p-3">Payment Terms</th>
                        <th className="p-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {[
                        { name: 'Concentrix Technologies India', gstin: '06AABCC1234F1Z8', limit: 8000000, used: 2150000, terms: 'Net 45', status: 'ACTIVE' },
                        { name: 'Tata Advanced Systems Ltd', gstin: '27AABCT2345M1ZV', limit: 5000000, used: 1420000, terms: 'Net 45', status: 'ACTIVE' },
                        { name: 'Larsen & Toubro Infra', gstin: '24AABCL1234N1ZT', limit: 10000000, used: 3850000, terms: 'Net 60', status: 'ACTIVE' },
                        { name: 'Siemens Healthcare & Energy', gstin: '27AABCS9876Q1Z3', limit: 6000000, used: 980000, terms: 'Net 30', status: 'ACTIVE' },
                      ].map((e, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{e.name}</td>
                          <td className="p-3 font-mono text-slate-700">{e.gstin}</td>
                          <td className="p-3 font-mono text-slate-900 font-semibold">₹{e.limit.toLocaleString('en-IN')}</td>
                          <td className="p-3 font-mono text-blue-700 font-bold">₹{e.used.toLocaleString('en-IN')}</td>
                          <td className="p-3 text-slate-700">{e.terms}</td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {e.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeModule === 'buydesk-departments' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { dept: 'Plant Operations & MRO', allocated: '₹50,00,000', spent: '₹14,50,000', util: '29%' },
                    { dept: 'Health & Safety (EHS)', allocated: '₹15,00,000', spent: '₹4,20,000', util: '28%' },
                    { dept: 'Heavy Machinery & CNC', allocated: '₹60,00,000', spent: '₹38,50,000', util: '64%' },
                  ].map((d, idx) => (
                    <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                      <div className="font-bold text-slate-900">{d.dept}</div>
                      <div className="text-xl font-black text-slate-900 font-mono">{d.spent}</div>
                      <div className="text-[11px] text-slate-500">Allocated: {d.allocated} ({d.util} used)</div>
                    </div>
                  ))}
                </div>
              )}

              {activeModule === 'buydesk-rules' && (
                <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase">Automated Threshold Sign-Off Rules</h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded bg-emerald-50 border border-emerald-200">
                      <strong className="text-emerald-900">Rule 1: Fast-Track Auto PO (&lt; ₹15,000)</strong>
                      <p className="text-[11px] text-emerald-700 mt-1">Autonomous PO generation without manager bottleneck.</p>
                    </div>
                    <div className="p-3 rounded bg-amber-50 border border-amber-200">
                      <strong className="text-amber-900">Rule 2: Manager Sign-off (&ge; ₹15,000)</strong>
                      <p className="text-[11px] text-amber-700 mt-1">Routed to Finance Approver for departmental audit.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUBMENU 7: BUYER & REQUISITIONS */}
          {/* ========================================================================= */}
          {activeModule.startsWith('buyer') && (
            <div className="space-y-4 max-w-6xl">
              <div className="pb-2 border-b-2 border-[#20638f] flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    {activeModule === 'buyer-requisitions' ? 'Purchase Requisitions (PR) Desk' : 'Corporate Buyers List'}
                  </h2>
                  <p className="text-xs text-slate-500">Authorized corporate procurement officers</p>
                </div>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                  <button onClick={() => setActiveModule('buyer-list')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'buyer-list' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>Buyers</button>
                  <button onClick={() => setActiveModule('buyer-requisitions')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'buyer-requisitions' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>Requisitions (PR)</button>
                </div>
              </div>

              {activeModule === 'buyer-list' && (
                <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-xs">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-[#f8fafc] text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Buyer Name</th>
                        <th className="p-3">Company</th>
                        <th className="p-3">Department</th>
                        <th className="p-3">Official Email</th>
                        <th className="p-3">Max Order Limit</th>
                        <th className="p-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {[
                        { name: 'Pankaj Sinha', comp: 'Concentrix Technologies', dept: 'Facilities & Infrastructure', email: 'pankaj.sinha@concentrix.com', limit: '₹10,00,000' },
                        { name: 'Ankit Jain', comp: 'Tata Advanced Systems', dept: 'Plant Operations & MRO', email: 'ankit.jain@tataadvanced.com', limit: '₹5,00,000' },
                        { name: 'Vikramaditya Rao', comp: 'Tata Advanced Systems', dept: 'Finance & Approvals', email: 'v.rao@tataadvanced.com', limit: '₹25,00,000' },
                        { name: 'Sanjay Deshmukh', comp: 'Larsen & Toubro Infra', dept: 'Procurement Cell', email: 's.deshmukh@ltinfra.com', limit: '₹50,00,000' },
                      ].map((b, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{b.name}</td>
                          <td className="p-3 font-semibold text-slate-800">{b.comp}</td>
                          <td className="p-3 text-slate-600">{b.dept}</td>
                          <td className="p-3 font-mono text-slate-600">{b.email}</td>
                          <td className="p-3 font-mono font-bold text-blue-700">{b.limit}</td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">ACTIVE</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

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
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${r.totalAmount >= 15000 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
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
          {/* SUBMENU 8: PO MANAGEMENT */}
          {/* ========================================================================= */}
          {activeModule.startsWith('po') && (
            <div className="space-y-4 max-w-6xl">
              <div className="pb-2 border-b-2 border-[#20638f] flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Purchase Order (PO) Desk</h2>
                  <p className="text-xs text-slate-500">Authorized Legal Digital Purchase Orders with Statutory GST</p>
                </div>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                  <button onClick={() => setActiveModule('po-list')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'po-list' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>All POs</button>
                  <button onClick={() => setActiveModule('po-approvals')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'po-approvals' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>Approvals</button>
                  <button onClick={() => setActiveModule('po-view')} className={`px-2.5 py-1 text-xs font-bold rounded ${activeModule === 'po-view' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}>Digital PO Form</button>
                </div>
              </div>

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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUBMENU 9: LOGISTICS PLANNING */}
          {/* ========================================================================= */}
          {activeModule.startsWith('logistics') && (
            <div className="space-y-4 max-w-6xl">
              <div className="pb-2 border-b-2 border-[#20638f] flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Logistics Planning & Consignment Telemetry</h2>
                  <p className="text-xs text-slate-500">Live Carrier Airway Bills (AWB) & Material Inward Manifest</p>
                </div>
                <Link href="/order-tracking" className="px-3 py-1.5 bg-[#20638f] text-white rounded text-xs font-bold">
                  Open Live AWB Tracker &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                  <div className="font-bold text-sm text-slate-900 flex items-center justify-between">
                    <span>BlueDart Express (BLUEDART-8829104)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">IN TRANSIT</span>
                  </div>
                  <p className="text-xs text-slate-600">Route: Bhiwandi Logistics Park &rarr; Tata Advanced Systems (Plant Gate 2, Pune)</p>
                  <div className="text-[11px] text-slate-500 font-mono">Consignment: 10 Boxes N95 Respirators &bull; Weight: 12.4 Kg</div>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                  <div className="font-bold text-sm text-slate-900 flex items-center justify-between">
                    <span>Delhivery Surface (DELHIVERY-992144)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">DELIVERED</span>
                  </div>
                  <p className="text-xs text-slate-600">Route: Mumbai Central &rarr; L&T Infra (Knowledge City, Vadodara)</p>
                  <div className="text-[11px] text-slate-500 font-mono">Consignment: 35 Pcs Triple Pole MCBs &bull; Gate Pass #GP-8819</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUBMENU 10: INVENTORY MANAGEMENT */}
          {/* ========================================================================= */}
          {activeModule.startsWith('inventory') && (
            <div className="space-y-4 max-w-6xl">
              <div className="pb-2 border-b-2 border-[#20638f] flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Inventory & 3-Way Match Desk</h2>
                  <p className="text-xs text-slate-500">Warehouse Stocks, Material Inward Receipts (GRN), and Reconciliation</p>
                </div>
                <Link href="/grn-matching" className="px-3 py-1.5 bg-[#20638f] text-white rounded text-xs font-bold">
                  Open 3-Way Engine &rarr;
                </Link>
              </div>

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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUBMENU 11: REPORTS */}
          {/* ========================================================================= */}
          {activeModule.startsWith('reports') && (
            <div className="space-y-4 max-w-6xl">
              <div className="pb-2 border-b-2 border-[#20638f] flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Procurement & Tax Compliance Reports</h2>
                  <p className="text-xs text-slate-500">Spend Analytics, GST Input Tax Credit (ITC), and Savings Realization</p>
                </div>
                <button onClick={() => alert('Report exported successfully!')} className="px-3 py-1.5 bg-[#20638f] text-white rounded text-xs font-bold">
                  Export GST & Spend Report
                </button>
              </div>

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

          {/* ========================================================================= */}
          {/* SUBMENU 12: ESCALATION MANAGEMENT */}
          {/* ========================================================================= */}
          {activeModule.startsWith('escalation') && (
            <div className="space-y-4 max-w-6xl">
              <div className="pb-2 border-b-2 border-[#20638f]">
                <h2 className="text-xl font-black text-slate-900">Escalation & Dispute Desk</h2>
                <p className="text-xs text-slate-500">Service Level Agreement (SLA) Violations and Support Tickets</p>
              </div>

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
                      <td className="p-3 text-slate-600">Plant gate entry pass barcode reissue</td>
                      <td className="p-3 text-center"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">LOW</span></td>
                      <td className="p-3 text-center"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">CLOSED</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUBMENU 13: RETURN ORDER MANAGEMENT (RTO) */}
          {/* ========================================================================= */}
          {activeModule.startsWith('return') && (
            <div className="space-y-4 max-w-6xl">
              <div className="pb-2 border-b-2 border-[#20638f]">
                <h2 className="text-xl font-black text-slate-900">Return Order Management (RTO) & Credit Notes</h2>
                <p className="text-xs text-slate-500">Material Rejection, Gate Turnbacks, and GST Credit Notes</p>
              </div>

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
