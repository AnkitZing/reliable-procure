'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useReliableStore } from '@/lib/store';
import { 
  Menu, X, Bell, Phone, MessageCircle, 
  ChevronDown, ChevronRight, User, ShoppingCart, 
  Layers, Truck, Building2, FileText, CheckCircle2, 
  Clock, AlertTriangle, AlertCircle, RotateCcw, 
  BarChart3, Shield, LogOut, Search, Plus, 
  ExternalLink, Check, Eye, Package, Boxes, Printer
} from 'lucide-react';

// Order Details mock data matching the user's exact screenshot
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
  items: AdminOrderItem[];
}

const SAMPLE_ADMIN_ORDERS: AdminOrder[] = [
  {
    masterOrderId: 'PO004931',
    orderId: 'PO0049310',
    buyerName: 'Concentrix',
    supplierName: 'Om Fire Services',
    orderDate: '2026-09-12',
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
  }
];

function AdminPortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialModule = searchParams.get('mod') || 'order-details';

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeModule, setActiveModule] = useState(initialModule);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);

  // Collapsible Submenus State
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    dashboard: false,
    catalogue: false,
    supplier: false,
    buydesk: false,
    buyer: false,
    orders: true, // open by default to match screenshot
    po: false,
    logistics: false,
    inventory: false,
    reports: false,
    escalation: false,
    returnOrder: false
  });

  const toggleSubmenu = (key: string) => {
    setOpenSubmenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const { currentUser, setRole } = useReliableStore();

  const selectedOrder = SAMPLE_ADMIN_ORDERS[selectedOrderIndex] || SAMPLE_ADMIN_ORDERS[0];

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-[#333333] flex flex-col font-sans">
      
      {/* 1. TOP HEADER (Steel Blue matching RacknSell Admin #20638f / #2471a3) */}
      <header className="h-12 bg-[#20638f] text-white flex items-center justify-between px-3 sm:px-4 z-50 sticky top-0 shadow-sm border-b border-[#1b547a]">
        
        {/* Left: Brand & Hamburger Toggle */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-sm tracking-wide text-white uppercase">
              Admin Reliable
            </span>
            <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.2 rounded font-mono hidden sm:inline">
              (RacknSell Engine)
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
          bg-[#225b82] text-white/90 w-64 shrink-0 transition-all duration-200 z-40 flex flex-col
          ${sidebarOpen ? 'block' : 'hidden lg:block'}
        `}>
          
          {/* Sidebar Menu Items */}
          <div className="flex-1 overflow-y-auto py-2 space-y-0.5 text-xs font-medium scrollbar-thin scrollbar-thumb-white/20">
            
            {/* 1. Dashboard */}
            <div>
              <button
                onClick={() => { setActiveModule('dashboard'); toggleSubmenu('dashboard'); }}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#1b4968] transition cursor-pointer ${
                  activeModule === 'dashboard' ? 'bg-[#1b4968] text-white font-bold border-l-4 border-emerald-400' : ''
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
                  <button onClick={() => setActiveModule('dashboard')} className="block hover:text-white text-left w-full py-0.5">&bull; Overview & KPI Gauges</button>
                  <button onClick={() => setActiveModule('dashboard')} className="block hover:text-white text-left w-full py-0.5">&bull; Live Operations Monitor</button>
                </div>
              )}
            </div>

            {/* 2. Catalogue management */}
            <div>
              <button
                onClick={() => { setActiveModule('catalogue'); toggleSubmenu('catalogue'); }}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#1b4968] transition cursor-pointer ${
                  activeModule === 'catalogue' ? 'bg-[#1b4968] text-white font-bold border-l-4 border-emerald-400' : ''
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
                  <button onClick={() => setActiveModule('catalogue')} className="block hover:text-white text-left w-full py-0.5">&bull; Products Master</button>
                  <button onClick={() => setActiveModule('catalogue')} className="block hover:text-white text-left w-full py-0.5">&bull; 13 Categories (L0-L2)</button>
                  <button onClick={() => setActiveModule('catalogue')} className="block hover:text-white text-left w-full py-0.5">&bull; Brand Master</button>
                  <button onClick={() => setActiveModule('catalogue')} className="block hover:text-white text-left w-full py-0.5">&bull; Bulk CSV Upload</button>
                </div>
              )}
            </div>

            {/* 3. Supplier */}
            <div>
              <button
                onClick={() => { setActiveModule('supplier'); toggleSubmenu('supplier'); }}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#1b4968] transition cursor-pointer ${
                  activeModule === 'supplier' ? 'bg-[#1b4968] text-white font-bold border-l-4 border-emerald-400' : ''
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
                  <button onClick={() => setActiveModule('supplier')} className="block hover:text-white text-left w-full py-0.5">&bull; Supplier List</button>
                  <button onClick={() => setActiveModule('supplier')} className="block hover:text-white text-left w-full py-0.5">&bull; KYC & GSTIN Verification</button>
                  <button onClick={() => setActiveModule('supplier')} className="block hover:text-white text-left w-full py-0.5">&bull; Add New Supplier</button>
                </div>
              )}
            </div>

            {/* 4. Corporate buydesk */}
            <div>
              <button
                onClick={() => { setActiveModule('buydesk'); toggleSubmenu('buydesk'); }}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#1b4968] transition cursor-pointer ${
                  activeModule === 'buydesk' ? 'bg-[#1b4968] text-white font-bold border-l-4 border-emerald-400' : ''
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
                  <button onClick={() => setActiveModule('buydesk')} className="block hover:text-white text-left w-full py-0.5">&bull; Concentrix / Tata / L&T</button>
                  <button onClick={() => setActiveModule('buydesk')} className="block hover:text-white text-left w-full py-0.5">&bull; Cost Centers & Budgets</button>
                  <button onClick={() => setActiveModule('buydesk')} className="block hover:text-white text-left w-full py-0.5">&bull; Threshold Rules (&lt; ₹15k)</button>
                </div>
              )}
            </div>

            {/* 5. Buyer */}
            <div>
              <button
                onClick={() => { setActiveModule('buyer'); toggleSubmenu('buyer'); }}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#1b4968] transition cursor-pointer ${
                  activeModule === 'buyer' ? 'bg-[#1b4968] text-white font-bold border-l-4 border-emerald-400' : ''
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
                  <button onClick={() => setActiveModule('buyer')} className="block hover:text-white text-left w-full py-0.5">&bull; Corporate Buyers List</button>
                  <button onClick={() => setActiveModule('buyer')} className="block hover:text-white text-left w-full py-0.5">&bull; Purchase Requisitions (PR)</button>
                </div>
              )}
            </div>

            {/* 6. Order Management (THE SCREENSHOT MODULE) */}
            <div>
              <button
                onClick={() => { setActiveModule('order-details'); toggleSubmenu('orders'); }}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#1b4968] transition cursor-pointer ${
                  activeModule === 'order-details' ? 'bg-[#1b4968] text-white font-bold border-l-4 border-emerald-400' : ''
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
                  <button onClick={() => { setActiveModule('order-details'); setSelectedOrderIndex(0); }} className="block hover:text-white text-left w-full py-0.5 text-emerald-300 font-bold">&bull; PO004931 (Concentrix)</button>
                  <button onClick={() => { setActiveModule('order-details'); setSelectedOrderIndex(1); }} className="block hover:text-white text-left w-full py-0.5">&bull; PO004932 (Tata Adv)</button>
                  <button onClick={() => { setActiveModule('order-details'); setSelectedOrderIndex(2); }} className="block hover:text-white text-left w-full py-0.5">&bull; PO004933 (L&T Infra)</button>
                </div>
              )}
            </div>

            {/* 7. PO Management */}
            <div>
              <button
                onClick={() => { setActiveModule('po'); toggleSubmenu('po'); }}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#1b4968] transition cursor-pointer ${
                  activeModule === 'po' ? 'bg-[#1b4968] text-white font-bold border-l-4 border-emerald-400' : ''
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
                  <Link href="/purchase-orders" className="block hover:text-white text-left w-full py-0.5">&bull; Digital PO Viewer</Link>
                  <button onClick={() => setActiveModule('po')} className="block hover:text-white text-left w-full py-0.5">&bull; PO Issuance & Tax Invoices</button>
                </div>
              )}
            </div>

            {/* 8. Logistics Planning */}
            <div>
              <button
                onClick={() => { setActiveModule('logistics'); toggleSubmenu('logistics'); }}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#1b4968] transition cursor-pointer ${
                  activeModule === 'logistics' ? 'bg-[#1b4968] text-white font-bold border-l-4 border-emerald-400' : ''
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
                  <Link href="/order-tracking" className="block hover:text-white text-left w-full py-0.5">&bull; BlueDart / Delhivery AWB</Link>
                  <button onClick={() => setActiveModule('logistics')} className="block hover:text-white text-left w-full py-0.5">&bull; Gate Inward Manifest</button>
                </div>
              )}
            </div>

            {/* 9. Inventory Management */}
            <div>
              <button
                onClick={() => { setActiveModule('inventory'); toggleSubmenu('inventory'); }}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#1b4968] transition cursor-pointer ${
                  activeModule === 'inventory' ? 'bg-[#1b4968] text-white font-bold border-l-4 border-emerald-400' : ''
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
                  <Link href="/grn-matching" className="block hover:text-white text-left w-full py-0.5">&bull; 3-Way Reconciliation</Link>
                  <button onClick={() => setActiveModule('inventory')} className="block hover:text-white text-left w-full py-0.5">&bull; GRN Intake & Inspection</button>
                </div>
              )}
            </div>

            {/* 10. Reports */}
            <div>
              <button
                onClick={() => { setActiveModule('reports'); toggleSubmenu('reports'); }}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#1b4968] transition cursor-pointer ${
                  activeModule === 'reports' ? 'bg-[#1b4968] text-white font-bold border-l-4 border-emerald-400' : ''
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
                  <Link href="/analytics" className="block hover:text-white text-left w-full py-0.5">&bull; Spend Analysis</Link>
                  <button onClick={() => setActiveModule('reports')} className="block hover:text-white text-left w-full py-0.5">&bull; GST ITC Compliance Report</button>
                </div>
              )}
            </div>

            {/* 11. Escalation Management */}
            <div>
              <button
                onClick={() => { setActiveModule('escalation'); toggleSubmenu('escalation'); }}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#1b4968] transition cursor-pointer ${
                  activeModule === 'escalation' ? 'bg-[#1b4968] text-white font-bold border-l-4 border-emerald-400' : ''
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
                  <button onClick={() => setActiveModule('escalation')} className="block hover:text-white text-left w-full py-0.5">&bull; Open Support Tickets</button>
                  <button onClick={() => setActiveModule('escalation')} className="block hover:text-white text-left w-full py-0.5">&bull; Vendor SLA Violations</button>
                </div>
              )}
            </div>

            {/* 12. Return Order Management */}
            <div>
              <button
                onClick={() => { setActiveModule('returnOrder'); toggleSubmenu('returnOrder'); }}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#1b4968] transition cursor-pointer ${
                  activeModule === 'returnOrder' ? 'bg-[#1b4968] text-white font-bold border-l-4 border-emerald-400' : ''
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
                  <button onClick={() => setActiveModule('returnOrder')} className="block hover:text-white text-left w-full py-0.5">&bull; RTO Rejections</button>
                  <button onClick={() => setActiveModule('returnOrder')} className="block hover:text-white text-left w-full py-0.5">&bull; Credit Notes</button>
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
          {/* VIEW: ORDER DETAILS (THE EXACT VIEW FROM THE USER'S PHOTO) */}
          {/* ========================================================================= */}
          {activeModule === 'order-details' && (
            <div className="space-y-6 max-w-6xl">
              
              {/* Order Selection Pill Tabs */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
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

                <button
                  onClick={() => window.print()}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs font-bold text-slate-700"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Details</span>
                </button>
              </div>

              {/* Title Matching Screenshot */}
              <div className="border-b-2 border-[#20638f] pb-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Order Details
                </h1>
              </div>

              {/* Top Key-Value Metadata Block (Exact format from screenshot) */}
              <div className="space-y-1.5 text-xs text-slate-800">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-slate-700 min-w-[120px]">Master Order Id:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedOrder.masterOrderId}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-slate-700 min-w-[120px]">Order Id:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedOrder.orderId}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-slate-700 min-w-[120px]">Buyer Name:</span>
                  <span className="font-bold text-slate-900">{selectedOrder.buyerName}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-slate-700 min-w-[120px]">Supplier Name:</span>
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
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition">
                        
                        {/* Product Name with Thumbnail & SKU */}
                        <td className="p-3 border-r border-slate-200">
                          <div className="flex items-start gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-14 object-contain bg-slate-50 p-1 border border-slate-200 rounded shrink-0"
                            />
                            <div className="space-y-0.5">
                              <div className="font-mono text-[11px] font-bold text-slate-700">
                                {item.sku}
                              </div>
                              <div className="font-bold text-slate-900 leading-snug">
                                {item.name}
                              </div>
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
                    ))}
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
          {/* OTHER MODULES VIEWS */}
          {/* ========================================================================= */}
          {activeModule === 'dashboard' && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 pb-2 border-b-2 border-[#20638f]">
                Admin Operations Dashboard
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
                  <span className="text-slate-400 font-bold block uppercase">Total Master Orders</span>
                  <span className="text-2xl font-black text-slate-900 font-mono">1,492</span>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
                  <span className="text-slate-400 font-bold block uppercase">Pending Orders</span>
                  <span className="text-2xl font-black text-amber-600 font-mono">18</span>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
                  <span className="text-slate-400 font-bold block uppercase">Active Enterprises</span>
                  <span className="text-2xl font-black text-blue-600 font-mono">42</span>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
                  <span className="text-slate-400 font-bold block uppercase">Verified Suppliers</span>
                  <span className="text-2xl font-black text-emerald-600 font-mono">185</span>
                </div>
              </div>
            </div>
          )}

          {activeModule === 'catalogue' && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 pb-2 border-b-2 border-[#20638f]">
                Catalogue Management Master
              </h2>
              <p className="text-xs text-slate-500">
                Manage 13 industrial categories, SKUs, pricing tiers, and OEM manufacturer channels.
              </p>
              <div className="flex gap-2">
                <Link href="/catalog" className="px-4 py-2 bg-[#20638f] text-white rounded-lg text-xs font-bold">
                  Open Live Catalog &rarr;
                </Link>
                <Link href="/catalog?view=categories" className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">
                  Category Master (L0-L2)
                </Link>
              </div>
            </div>
          )}

          {activeModule === 'supplier' && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 pb-2 border-b-2 border-[#20638f]">
                Supplier Master & KYC Verification
              </h2>
              <div className="flex gap-2">
                <Link href="/suppliers" className="px-4 py-2 bg-[#20638f] text-white rounded-lg text-xs font-bold">
                  Open Supplier Desk (SRM) &rarr;
                </Link>
              </div>
            </div>
          )}

          {activeModule === 'buydesk' && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 pb-2 border-b-2 border-[#20638f]">
                Corporate Buydesk & Enterprise Entities
              </h2>
              <div className="flex gap-2">
                <Link href="/buydesk" className="px-4 py-2 bg-[#20638f] text-white rounded-lg text-xs font-bold">
                  Manage Enterprise Buydesk &rarr;
                </Link>
              </div>
            </div>
          )}

          {activeModule === 'buyer' && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 pb-2 border-b-2 border-[#20638f]">
                Corporate Buyers & Requisitions (PR)
              </h2>
              <div className="flex gap-2">
                <Link href="/requisitions" className="px-4 py-2 bg-[#20638f] text-white rounded-lg text-xs font-bold">
                  View Requisitions Desk &rarr;
                </Link>
              </div>
            </div>
          )}

          {activeModule === 'po' && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 pb-2 border-b-2 border-[#20638f]">
                PO Management Desk
              </h2>
              <div className="flex gap-2">
                <Link href="/purchase-orders" className="px-4 py-2 bg-[#20638f] text-white rounded-lg text-xs font-bold">
                  Open Purchase Orders (PO) &rarr;
                </Link>
              </div>
            </div>
          )}

          {activeModule === 'logistics' && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 pb-2 border-b-2 border-[#20638f]">
                Logistics Planning & Consignment AWB
              </h2>
              <div className="flex gap-2">
                <Link href="/order-tracking" className="px-4 py-2 bg-[#20638f] text-white rounded-lg text-xs font-bold">
                  Track Airway Bills & Logistics &rarr;
                </Link>
              </div>
            </div>
          )}

          {activeModule === 'inventory' && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 pb-2 border-b-2 border-[#20638f]">
                Inventory Management & 3-Way Match
              </h2>
              <div className="flex gap-2">
                <Link href="/grn-matching" className="px-4 py-2 bg-[#20638f] text-white rounded-lg text-xs font-bold">
                  Open 3-Way Match & GRN &rarr;
                </Link>
              </div>
            </div>
          )}

          {activeModule === 'reports' && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 pb-2 border-b-2 border-[#20638f]">
                Reports & Analytics
              </h2>
              <div className="flex gap-2">
                <Link href="/analytics" className="px-4 py-2 bg-[#20638f] text-white rounded-lg text-xs font-bold">
                  Open Spend Analytics &rarr;
                </Link>
              </div>
            </div>
          )}

          {activeModule === 'escalation' && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 pb-2 border-b-2 border-[#20638f]">
                Escalation Management
              </h2>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                <div className="font-bold text-slate-800">Active Escalation Tickets (0 Critical, 2 In-Review)</div>
                <div className="text-slate-600">&bull; Ticket #ESC-1092: Supplier Om Fire Services - Delivery delay on PO004931 (Resolved via RTO)</div>
                <div className="text-slate-600">&bull; Ticket #ESC-1088: Concentrix plant gate address update request</div>
              </div>
            </div>
          )}

          {activeModule === 'returnOrder' && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 pb-2 border-b-2 border-[#20638f]">
                Return Order Management (RTO)
              </h2>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                <div className="font-bold text-slate-800">Return Orders Log</div>
                <div className="text-slate-600">&bull; RTO-2026-081: Concentrix - 11 Nos Fire Extinguishers (PO004931) - Cancelled before gate inward. Credit note generated.</div>
              </div>
            </div>
          )}

        </main>
      </div>

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
