'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useReliableStore } from '@/lib/store';
import { 
  LayoutDashboard, ShoppingCart, FileText, PackageCheck, 
  FileSearch, CheckCheck, BarChart3, Shield, Users, 
  Building2, Truck, ChevronDown, ChevronRight, Layers,
  Boxes, BadgeCheck, AlertOctagon, Receipt, Sparkles,
  ClipboardList, Sliders, ExternalLink, HelpCircle
} from 'lucide-react';

interface SubmenuItem {
  label: string;
  href: string;
  badge?: string;
  badgeColor?: string;
}

interface MenuItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
  submenus: SubmenuItem[];
}

function EnterpriseSidebarInner({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || searchParams.get('view') || '';
  const { currentRole, requisitions, purchaseOrders, rfqs, matches } = useReliableStore();

  const pendingPrCount = requisitions.filter(r => r.status === 'PENDING_APPROVAL').length;
  const activePoCount = purchaseOrders.filter(po => po.status === 'ISSUED' || po.status === 'IN_TRANSIT').length;
  const varianceCount = matches.filter(m => m.matchStatus === 'VARIANCE_FLAGGED').length;

  // Track expanded menu sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    dashboard: true,
    catalog: true,
    procurement: true,
    rfq: true,
    buydesk: true,
    suppliers: true,
    grn: true,
    finance: true,
    analytics: true,
    admin: true
  });

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: LayoutDashboard,
      submenus: [
        { label: 'Executive Overview', href: '/dashboard' },
        { label: 'Live Sourcing Monitor', href: '/dashboard?tab=monitor' },
        { label: 'System Audit Trail', href: '/dashboard?tab=audit' }
      ]
    },
    {
      id: 'catalog',
      title: 'Catalog & Inventory',
      icon: ShoppingCart,
      badge: '13 Cat',
      badgeColor: 'bg-blue-100 text-blue-700',
      submenus: [
        { label: 'All Sourcing Catalog', href: '/catalog' },
        { label: 'Category Master (L0-L2)', href: '/catalog?view=categories' },
        { label: 'Brand Directory', href: '/catalog?view=brands' },
        { label: 'Bulk CSV Price Tiers', href: '/catalog?view=bulk-upload' },
        { label: 'Spot Sale & Deals', href: '/spot-sale' }
      ]
    },
    {
      id: 'procurement',
      title: 'Procurement & Orders',
      icon: PackageCheck,
      badge: `${pendingPrCount + activePoCount}`,
      badgeColor: 'bg-amber-100 text-amber-800',
      submenus: [
        { label: 'Requisitions (PR)', href: '/requisitions', badge: pendingPrCount > 0 ? `${pendingPrCount}` : undefined, badgeColor: 'bg-amber-500 text-white' },
        { label: 'Purchase Orders (PO)', href: '/purchase-orders', badge: `${activePoCount}`, badgeColor: 'bg-blue-500 text-white' },
        { label: 'Order Tracking & Logistics', href: '/order-tracking' },
        { label: 'Delivery Schedules', href: '/purchase-orders?tab=backorders' }
      ]
    },
    {
      id: 'rfq',
      title: 'Sourcing & RFQ Desk',
      icon: FileSearch,
      badge: `${rfqs.length}`,
      badgeColor: 'bg-indigo-100 text-indigo-700',
      submenus: [
        { label: 'Active RFQs', href: '/rfq' },
        { label: 'Quotation Matrix (L1)', href: '/rfq?tab=quotes' },
        { label: 'Create Buy Request', href: '/rfq?tab=create' },
        { label: 'Awarded Contracts', href: '/rfq?tab=contracts' }
      ]
    },
    {
      id: 'buydesk',
      title: 'Enterprise Buydesk',
      icon: Building2,
      submenus: [
        { label: 'Entities & Cost Centers', href: '/buydesk' },
        { label: 'Approval Threshold Rules', href: '/buydesk?tab=rules' },
        { label: 'Hierarchies & DoA', href: '/buydesk?tab=hierarchies' },
        { label: 'Department Budgets', href: '/buydesk?tab=budgets' }
      ]
    },
    {
      id: 'suppliers',
      title: 'Supplier Desk (SRM)',
      icon: Truck,
      submenus: [
        { label: 'Vendor Directory', href: '/suppliers' },
        { label: 'KYC & GSTIN Verification', href: '/suppliers?tab=kyc' },
        { label: 'Performance Scorecards', href: '/suppliers?tab=scorecards' },
        { label: 'Onboard New Vendor', href: '/suppliers?tab=onboard' }
      ]
    },
    {
      id: 'grn',
      title: 'Warehouse & GRN Desk',
      icon: Boxes,
      badge: varianceCount > 0 ? `${varianceCount} Flag` : undefined,
      badgeColor: 'bg-red-100 text-red-700',
      submenus: [
        { label: '3-Way Reconciliation', href: '/grn-matching' },
        { label: 'GRN Intake & Receipts', href: '/grn-matching?tab=grn-intake' },
        { label: 'QC & Discrepancies', href: '/grn-matching?tab=discrepancy', badge: varianceCount > 0 ? `${varianceCount}` : undefined, badgeColor: 'bg-red-500 text-white' },
        { label: 'Stock Inventory Ledger', href: '/grn-matching?tab=ledger' }
      ]
    },
    {
      id: 'finance',
      title: 'Finance & Settlement',
      icon: Receipt,
      submenus: [
        { label: 'GST Tax Invoices', href: '/grn-matching?tab=invoices' },
        { label: 'Payment Terms & Net-60', href: '/grn-matching?tab=payments' },
        { label: 'ITC Tax Reconciliation', href: '/grn-matching?tab=itc' }
      ]
    },
    {
      id: 'analytics',
      title: 'Spend Analytics',
      icon: BarChart3,
      submenus: [
        { label: 'Spend by Category', href: '/analytics' },
        { label: 'Budget Gauges', href: '/analytics?tab=budgets' },
        { label: 'Savings Realization', href: '/analytics?tab=savings' },
        { label: 'Compliance Audit Export', href: '/analytics?tab=compliance' }
      ]
    },
    {
      id: 'admin',
      title: 'Administration',
      icon: Shield,
      submenus: [
        { label: 'User Roles & RBAC', href: '/admin/users' },
        { label: 'Platform Margins (2.5%)', href: '/admin/users?tab=margins' },
        { label: 'Security & Webhooks', href: '/admin/users?tab=notifications' },
        { label: 'Admin Portal Login', href: '/admin/login' }
      ]
    }
  ];

  const isLinkActive = (href: string) => {
    const [path, query] = href.split('?');
    if (pathname !== path) return false;
    if (!query) {
      return !currentTab;
    }
    const params = new URLSearchParams(query);
    const targetTab = params.get('tab') || params.get('view');
    return currentTab === targetTab;
  };

  return (
    <aside className={`
      w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col transition-all duration-300
      ${isOpen ? 'fixed inset-y-0 left-0 z-50 shadow-2xl block' : 'hidden lg:flex'}
    `}>
      {/* Sidebar Top Header */}
      <div className="h-16 px-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
            R
          </div>
          <div className="leading-tight">
            <span className="text-xs font-black tracking-tight text-slate-900 block">RELIABLE BUYDESK</span>
            <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Enterprise P2P</span>
          </div>
        </div>

        {onClose && (
          <button 
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200 cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* Role Pill Banner */}
      <div className="px-4 py-2.5 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between text-xs">
        <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Role View:</span>
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
          currentRole === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800 border-purple-300' :
          currentRole === 'BUYER' ? 'bg-blue-100 text-blue-800 border-blue-300' :
          currentRole === 'APPROVER' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
          'bg-amber-100 text-amber-800 border-amber-300'
        }`}>
          {currentRole.replace('_', ' ')}
        </span>
      </div>

      {/* Navigation Modules & Submenus */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
        {menuItems.map((module) => {
          const Icon = module.icon;
          const isExpanded = !!expandedSections[module.id];
          const hasActiveChild = module.submenus.some(sub => isLinkActive(sub.href));

          return (
            <div key={module.id} className="rounded-xl overflow-hidden mb-1">
              {/* Module Header Button */}
              <button
                onClick={() => toggleSection(module.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-lg transition text-left cursor-pointer ${
                  hasActiveChild 
                    ? 'bg-blue-50/70 text-blue-900 font-extrabold' 
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${hasActiveChild ? 'text-blue-600' : 'text-slate-500'}`} />
                  <span className="truncate">{module.title}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-1">
                  {module.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${module.badgeColor || 'bg-slate-200 text-slate-700'}`}>
                      {module.badge}
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Submenus List */}
              {isExpanded && (
                <div className="pl-6 pr-1 py-1 space-y-0.5 border-l-2 border-slate-200 ml-4 my-1">
                  {module.submenus.map((sub) => {
                    const active = isLinkActive(sub.href);
                    return (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        onClick={onClose}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] font-medium transition ${
                          active
                            ? 'bg-blue-600 text-white font-bold shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <span className="truncate">{sub.label}</span>
                        {sub.badge && (
                          <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ml-1 shrink-0 ${
                            active ? 'bg-white text-blue-700' : sub.badgeColor || 'bg-slate-200 text-slate-700'
                          }`}>
                            {sub.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Footer Info */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/60 text-[11px] text-slate-500 space-y-1">
        <div className="flex items-center justify-between text-[10px] font-semibold text-slate-600">
          <span>Reliable P2P v2.4</span>
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Server
          </span>
        </div>
        <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
          <Link href="/catalog" className="hover:text-blue-600 transition">Storefront</Link>
          <span>&bull;</span>
          <Link href="/order-tracking" className="hover:text-blue-600 transition">Track Order</Link>
          <span>&bull;</span>
          <Link href="/admin/login" className="hover:text-purple-600 transition">Admin</Link>
        </div>
      </div>
    </aside>
  );
}

export function EnterpriseSidebar(props: { isOpen?: boolean; onClose?: () => void }) {
  return (
    <Suspense fallback={<aside className="w-64 shrink-0 bg-white border-r border-slate-200 hidden lg:block" />}>
      <EnterpriseSidebarInner {...props} />
    </Suspense>
  );
}
