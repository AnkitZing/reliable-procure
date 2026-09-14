'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { EnterpriseSidebar } from '@/components/EnterpriseSidebar';
import { useReliableStore } from '@/lib/store';
import { Role } from '@/lib/types';
import { 
  Building2, TrendingUp, PackageCheck, FileText, 
  Clock, ArrowUpRight, CheckCircle2, 
  XCircle, Truck, DollarSign, Plus, Sparkles, 
  Shield, ShoppingBag, UserCheck, KeyRound, AlertTriangle, 
  Eye, Check, ExternalLink, RefreshCw
} from 'lucide-react';

function DashboardContent() {
  const { 
    currentRole, currentUser, setRole, requisitions, 
    purchaseOrders, rfqs, approveRequisition, rejectRequisition,
    matches, updatePOStatus, companies, toggleCompanyStatus, resetDemoData 
  } = useReliableStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [rejectingPrId, setRejectingPrId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [vendorAwbModalPoId, setVendorAwbModalPoId] = useState<string | null>(null);
  const [awbCarrier, setAwbCarrier] = useState('BlueDart Express');
  const [awbTrackingNumber, setAwbTrackingNumber] = useState('');

  // Calculations
  const pendingApprovals = requisitions.filter(r => r.status === 'PENDING_APPROVAL');
  const activePOs = purchaseOrders.filter(po => po.status === 'ISSUED' || po.status === 'IN_TRANSIT');
  const totalSpend = purchaseOrders.reduce((acc, po) => acc + po.totalAmount, 0);
  const platformCommission = Math.round(totalSpend * 0.025); // 2.5% platform take-rate

  const handleApprove = (prId: string) => {
    approveRequisition(prId);
  };

  const handleConfirmReject = () => {
    if (rejectingPrId && rejectReason.trim()) {
      rejectRequisition(rejectingPrId, rejectReason);
      setRejectingPrId(null);
      setRejectReason('');
    }
  };

  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vendorAwbModalPoId && awbTrackingNumber.trim()) {
      updatePOStatus(vendorAwbModalPoId, 'IN_TRANSIT', awbTrackingNumber, awbCarrier);
      setVendorAwbModalPoId(null);
      setAwbTrackingNumber('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <EnterpriseSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Dynamic Role Status Bar with 1-Click Switcher */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Active Live Session:
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  currentRole === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                  currentRole === 'BUYER' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                  currentRole === 'APPROVER' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                  'bg-amber-100 text-amber-800 border-amber-300'
                }`}>
                  {currentRole.replace('_', ' ')}
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                {currentUser.name}
              </h1>
              <p className="text-xs text-slate-600 flex items-center gap-2 mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentUser.companyName}</span>
                <span>&bull;</span>
                <span className="text-slate-500">{currentUser.department}</span>
                <span>&bull;</span>
                <span className="font-mono text-slate-500">{currentUser.email}</span>
              </p>
            </div>

            {/* Quick Live Role Tabs */}
            <div className="bg-slate-100 p-1.5 rounded-xl border border-slate-200 flex flex-wrap gap-1 self-start md:self-auto">
              <button
                onClick={() => setRole('SUPER_ADMIN')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  currentRole === 'SUPER_ADMIN'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Super Admin</span>
              </button>

              <button
                onClick={() => setRole('BUYER')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  currentRole === 'BUYER'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Buyer</span>
              </button>

              <button
                onClick={() => setRole('APPROVER')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  currentRole === 'APPROVER'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Approver</span>
              </button>

              <button
                onClick={() => setRole('VENDOR')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  currentRole === 'VENDOR'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Vendor</span>
              </button>
            </div>
          </div>

          {/* Role Permissions Notification Bar */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Active Permissions:</span>
              {currentRole === 'SUPER_ADMIN' && (
                <span className="text-purple-700 font-semibold">Full Operations Control, Client KYC Verification, Margin Revenue & Global PO Audit</span>
              )}
              {currentRole === 'BUYER' && (
                <span className="text-blue-700 font-semibold">Catalog Contract Pricing, Cart Management, Raise Purchase Requisitions (PR)</span>
              )}
              {currentRole === 'APPROVER' && (
                <span className="text-emerald-700 font-semibold">Authorize Orders &gt; ₹15,000 Threshold, Department Budget Sign-off, PO Generation</span>
              )}
              {currentRole === 'VENDOR' && (
                <span className="text-amber-800 font-semibold">Receive Digital POs, Dispatch with AWB & Courier Carrier, Fulfill Orders</span>
              )}
            </div>

            <button
              onClick={resetDemoData}
              className="text-[11px] text-slate-400 hover:text-slate-700 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
              title="Reset all dummy data to default state"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>

        {/* Global Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">Total Managed Spend</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              ₹{totalSpend.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <span>12.4% savings via contracted rates</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">Pending Approvals</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {pendingApprovals.length}
            </div>
            <div className="text-[11px] text-amber-700 font-medium mt-1">
              Requisitions above ₹15,000 threshold
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">Active POs</span>
              <PackageCheck className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {activePOs.length}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Fulfillment & logistics in progress
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">3-Way Verification</span>
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {matches.filter(m => m.matchStatus === 'MATCHED').length}/{matches.length}
            </div>
            <div className="text-[11px] text-purple-700 font-medium mt-1">
              PO $\leftrightarrow$ GRN $\leftrightarrow$ Tax Invoice matched
            </div>
          </div>
        </div>

        {/* SUBMENU TAB 1: LIVE SOURCING MONITOR */}
        {activeTab === 'monitor' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-black text-slate-900">Live Procurement & Logistics Sourcing Monitor</h2>
                <p className="text-xs text-slate-500">Real-time telemetry of PR creation, threshold authorizations, carrier dispatches, and 3-way GRN matches</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Feed Active
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">PO</div>
                  <div>
                    <div className="font-bold text-slate-900">PO-2026-0941 &bull; BlueDart AWB BLUEDART-8829104</div>
                    <div className="text-[11px] text-slate-500">Karam Safety Solutions &rarr; Tata Advanced Systems (Plant Gate 2, Pune)</div>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">
                  IN TRANSIT
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">PR</div>
                  <div>
                    <div className="font-bold text-slate-900">PR-2026-0189 &bull; Value ₹69,384 (Threshold Exceeded &ge; ₹15k)</div>
                    <div className="text-[11px] text-slate-500">Requester: Ankit Jain &bull; Awaiting Sign-off: Vikramaditya Rao</div>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                  PENDING APPROVAL
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">3W</div>
                  <div>
                    <div className="font-bold text-slate-900">PO-2026-0895 &bull; 3-Way Reconciliation Perfect Match</div>
                    <div className="text-[11px] text-slate-500">PO ₹49,560 == Physical GRN (35 Pcs) == GST Invoice ₹49,560</div>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  PAYMENT CLEARED
                </span>
              </div>
            </div>
          </div>
        )}

        {/* SUBMENU TAB 2: SYSTEM AUDIT TRAIL */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-black text-slate-900">Enterprise P2P Compliance & Audit Trail</h2>
                <p className="text-xs text-slate-500">Immutable ledger of procurement actions, threshold bypasses, and tax verifications</p>
              </div>
              <button 
                onClick={() => alert('Audit logs downloaded in CSV format!')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Export Audit Log
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Event Type</th>
                    <th className="p-3">Entity / Cost Center</th>
                    <th className="p-3">Initiating User</th>
                    <th className="p-3">Audit Details</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 text-slate-500">2026-09-14 17:15:10</td>
                    <td className="p-3 font-bold text-slate-900">PR_EVALUATE</td>
                    <td className="p-3">Tata Advanced Systems</td>
                    <td className="p-3">ankit.jain@tataadvanced.com</td>
                    <td className="p-3">PR-2026-0189 routed to Finance Approver (&gt; ₹15,000 threshold)</td>
                    <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">ROUTED</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 text-slate-500">2026-09-10 14:20:00</td>
                    <td className="p-3 font-bold text-slate-900">PO_AUTO_GEN</td>
                    <td className="p-3">Tata Advanced Systems</td>
                    <td className="p-3">P2P Autonomous Engine</td>
                    <td className="p-3">PO-2026-0941 generated via &lt; ₹15k threshold fast-track rule</td>
                    <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">AUTHORIZED</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 text-slate-500">2026-09-10 14:15:00</td>
                    <td className="p-3 font-bold text-slate-900">AWB_DISPATCH</td>
                    <td className="p-3">Industrial Supply Hub</td>
                    <td className="p-3">sales@industrialsupplyhub.in</td>
                    <td className="p-3">Assigned carrier BlueDart Express (BLUEDART-8829104)</td>
                    <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">DISPATCHED</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 1: SUPER ADMIN OPERATIONS DESK */}
        {/* ========================================================================= */}
        {currentRole === 'SUPER_ADMIN' && (
          <div className="bg-white rounded-2xl border border-purple-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">Super Admin Operations & Platform Governance</h2>
                  <p className="text-xs text-slate-500">Manage corporate enterprise clients, supplier verifications, and platform take-rate revenue</p>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-right">
                <span className="text-[10px] text-purple-800 uppercase font-bold block">Platform Fee Earned (2.5%):</span>
                <span className="text-sm font-black text-purple-900 font-mono">₹{platformCommission.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Enterprise Client Verification List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Corporate Enterprise Onboardings & Credit Limits:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {companies.filter(c => c.type === 'ENTERPRISE').map(comp => (
                  <div key={comp.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{comp.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">GSTIN: {comp.gstin} &bull; PAN: {comp.pan}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        comp.status === 'ACTIVE' 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                          : 'bg-rose-100 text-rose-800 border-rose-300'
                      }`}>
                        {comp.status}
                      </span>
                    </div>

                    <div className="p-2.5 bg-white rounded-lg border border-slate-200 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Credit Limit:</span>
                        <span className="font-mono font-bold text-slate-900">₹{(comp.creditLimit / 100000).toFixed(1)} Lakhs</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Payment Terms:</span>
                        <span className="font-bold text-blue-700">{comp.paymentTerms}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-500">{comp.state} Facility</span>
                      <button
                        onClick={() => toggleCompanyStatus(comp.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer border ${
                          comp.status === 'ACTIVE'
                            ? 'bg-white hover:bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-emerald-600 text-white border-emerald-600'
                        }`}
                      >
                        {comp.status === 'ACTIVE' ? 'Suspend Access' : 'Activate Client'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Global Overrides */}
            <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-purple-900">Global Admin Override Authority:</div>
                <div className="text-[11px] text-purple-800">You have full permission to override approvals or add items to the master catalog.</div>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/catalog"
                  className="px-3 py-1.5 bg-white border border-purple-300 text-purple-900 hover:bg-purple-100 rounded-lg text-xs font-bold transition"
                >
                  Manage Master Catalog
                </Link>
                <Link
                  href="/requisitions"
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition"
                >
                  Review All PRs
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 2: CORPORATE BUYER SOURCING DESK */}
        {/* ========================================================================= */}
        {currentRole === 'BUYER' && (
          <div className="bg-white rounded-2xl border border-blue-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">Corporate Buyer Requisition Desk</h2>
                  <p className="text-xs text-slate-500">Browse contract rates, check departmental budget allocation, and raise PRs</p>
                </div>
              </div>
              <Link
                href="/catalog"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Items from Catalog</span>
              </Link>
            </div>

            {/* Department Budget & Threshold Box */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase">My Department:</span>
                <div className="text-xs font-bold text-slate-900">{currentUser.department}</div>
                <div className="text-xs text-slate-600 mt-1">Allocated Budget: <span className="font-mono font-bold text-slate-900">₹4,50,000</span></div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Auto-Approval Threshold:</span>
                <div className="text-xs font-bold text-emerald-700">₹15,000 per Requisition</div>
                <div className="text-[11px] text-slate-500">Orders &lt; ₹15k convert into PO instantly.</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Client Contract Status:</span>
                <div className="text-xs font-bold text-blue-700">Enterprise Fixed-Rates Active</div>
                <div className="text-[11px] text-slate-500">100% genuine supplies with ITC GST claim.</div>
              </div>
            </div>

            {/* My Active Requisitions Tracker */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  My Recent Purchase Requisitions (PR):
                </h3>
                <Link href="/requisitions" className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1">
                  <span>View full history</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-2.5">
                {requisitions.slice(0, 3).map((pr) => (
                  <div key={pr.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">{pr.prNumber}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          pr.status === 'PO_GENERATED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                          pr.status === 'PENDING_APPROVAL' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                          'bg-rose-100 text-rose-800 border-rose-300'
                        }`}>
                          {pr.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-slate-700 mt-1">
                        {pr.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-xs font-mono font-black text-emerald-700">₹{pr.totalAmount.toLocaleString('en-IN')}</div>
                      <div className="text-[10px] text-slate-500">{pr.createdAt}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 3: FINANCE APPROVER AUTHORIZATION DESK */}
        {/* ========================================================================= */}
        {currentRole === 'APPROVER' && (
          <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">Finance & Department Approver Authorization Desk</h2>
                  <p className="text-xs text-slate-500">Sign off on requisitions exceeding ₹15,000 and verify budget compliance</p>
                </div>
              </div>
              <span className="text-xs px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full font-bold self-start sm:self-auto">
                {pendingApprovals.length} Awaiting Your Signature
              </span>
            </div>

            {pendingApprovals.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                All purchase requisitions are authorized or below auto-approval limits.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingApprovals.map((pr) => (
                  <div
                    key={pr.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-600">{pr.prNumber}</span>
                        <span className="text-xs text-slate-600 font-medium">&bull; Requester: <strong>{pr.buyerName}</strong></span>
                        <span className="text-[10px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">
                          {pr.department}
                        </span>
                      </div>
                      <div className="text-xs text-slate-800">
                        {pr.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Submitted: {pr.createdAt} &bull; Policy Threshold: ₹{pr.approvalThreshold.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-black text-slate-900 font-mono">
                          ₹{pr.totalAmount.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-slate-500">(Incl. GST)</div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(pr.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Generate PO</span>
                        </button>
                        <button
                          onClick={() => setRejectingPrId(pr.id)}
                          className="px-3 py-1.5 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 4: SUPPLIER / VENDOR DISPATCH DESK */}
        {/* ========================================================================= */}
        {currentRole === 'VENDOR' && (
          <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">Supplier Order Fulfillment & Logistics Desk</h2>
                  <p className="text-xs text-slate-500">Manage incoming Purchase Orders, dispatch shipments with AWB tracking, and monitor delivery</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {purchaseOrders.map((po) => (
                <div
                  key={po.id}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">{po.poNumber}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        po.status === 'DELIVERED' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : po.status === 'IN_TRANSIT'
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {po.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-800 mt-1">
                      Client: <strong>{po.companyName}</strong> (Buyer: {po.buyerName})
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Destination: {po.shippingAddress} &bull; Expected by: {po.deliveryDate}
                    </div>
                    {po.trackingNumber && (
                      <div className="text-[11px] text-blue-700 font-mono font-semibold mt-1">
                        Tracking: {po.trackingNumber} ({po.carrierName})
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-black text-slate-900 font-mono">
                        ₹{po.totalAmount.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-slate-500">{po.items.length} line items</div>
                    </div>

                    {po.status === 'ISSUED' && (
                      <button
                        onClick={() => {
                          setVendorAwbModalPoId(po.id);
                          setAwbTrackingNumber(`BLUEDART-${Math.floor(100000 + Math.random() * 900000)}`);
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Dispatch with AWB</span>
                      </button>
                    )}

                    {po.status === 'IN_TRANSIT' && (
                      <button
                        onClick={() => updatePOStatus(po.id, 'DELIVERED')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Delivered</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Global Summary Streams */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Purchase Orders Stream */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Recent Purchase Orders (PO)</h3>
              </div>
              <Link href="/purchase-orders" className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
                <span>View all</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {purchaseOrders.slice(0, 3).map((po) => (
                <div
                  key={po.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">{po.poNumber}</span>
                      <span className="text-[10px] text-slate-500">&bull; {po.vendorName}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Issued: {po.issuedAt}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-700 font-mono">
                      ₹{po.totalAmount.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full font-bold">
                      {po.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sourcing & RFQ Stream */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">Active Sourcing RFQs</h3>
              </div>
              <Link href="/rfq" className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
                <span>View all</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {rfqs.map((rfq) => (
                <div
                  key={rfq.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-700">{rfq.rfqNumber}</span>
                      <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold">
                        {rfq.quotes.length} Quotes
                      </span>
                    </div>
                    <div className="text-xs text-slate-900 font-semibold truncate mt-0.5">
                      {rfq.title}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Req: {rfq.quantity} {rfq.unit} &bull; Target: {rfq.targetDate}
                    </div>
                  </div>

                  <Link
                    href="/rfq"
                    className="px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-bold shrink-0 transition"
                  >
                    Compare Quotes
                  </Link>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>
      </div>

      {/* Reject Modal */}
      {rejectingPrId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Reject Requisition</h3>
            <p className="text-xs text-slate-600">
              Please provide a compliance or budgetary reason for rejecting this purchase requisition. The requester will be notified.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Exceeds Q3 allocated departmental budget. Please resubmit with revised quantities."
              rows={3}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectingPrId(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vendor Dispatch with AWB Modal */}
      {vendorAwbModalPoId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Dispatch Order with AWB Tracking</h3>
            <form onSubmit={handleDispatchSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Logistics Carrier</label>
                <select
                  value={awbCarrier}
                  onChange={(e) => setAwbCarrier(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                >
                  <option value="BlueDart Express">BlueDart Express</option>
                  <option value="Delhivery Surface">Delhivery Surface</option>
                  <option value="DTDC Priority">DTDC Priority</option>
                  <option value="TCI Freight (Heavy Cargo)">TCI Freight (Heavy Cargo)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Airway Bill / Tracking Number (AWB)</label>
                <input
                  type="text"
                  required
                  value={awbTrackingNumber}
                  onChange={(e) => setAwbTrackingNumber(e.target.value)}
                  placeholder="e.g. BLUEDART-8829104"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setVendorAwbModalPoId(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Confirm Shipment Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 p-8 text-xs text-slate-500">Loading Enterprise Operations Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
