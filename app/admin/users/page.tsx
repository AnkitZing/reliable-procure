'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { EnterpriseSidebar } from '@/components/EnterpriseSidebar';
import { useReliableStore } from '@/lib/store';
import { DEMO_USERS } from '@/lib/mock-data';
import { Role } from '@/lib/types';
import { 
  Shield, Users, KeyRound, CheckCircle2, 
  DollarSign, Sliders, Bell, ArrowRight,
  UserCheck, ShoppingBag, Truck, Lock
} from 'lucide-react';

function AdminUsersContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'users';

  const [activeTab, setActiveTab] = useState(initialTab);
  const { currentRole, setRole, currentUser, purchaseOrders } = useReliableStore();

  const totalSpend = purchaseOrders.reduce((acc, po) => acc + po.totalAmount, 0);
  const platformFee = Math.round(totalSpend * 0.025);

  const usersList = Object.entries(DEMO_USERS).map(([roleKey, usr]) => ({
    ...usr,
    roleKey: roleKey as Role
  }));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <EnterpriseSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-purple-600 uppercase tracking-wider">
                <Shield className="w-4 h-4" />
                <span>Administration & Governance</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                RBAC Access Control & Commercial Take-Rates
              </h1>
              <p className="text-xs text-slate-500">
                Manage user permissions, security policies, and platform monetization margins.
              </p>
            </div>

            <Link
              href="/admin/login"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5"
            >
              <Lock className="w-4 h-4" />
              <span>Admin Login Portal</span>
            </Link>
          </div>

          {/* Submenu Navigation Tabs */}
          <div className="flex border-b border-slate-200 space-x-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('users')}
              className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'users'
                  ? 'border-purple-600 text-purple-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>User Roles & RBAC</span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-purple-100 text-purple-800 font-bold">
                4 Active
              </span>
            </button>

            <button
              onClick={() => setActiveTab('margins')}
              className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'margins'
                  ? 'border-purple-600 text-purple-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Platform Take-Rates (2.5%)</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'notifications'
                  ? 'border-purple-600 text-purple-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Security & Webhook Logs</span>
            </button>
          </div>

          {/* TAB 1: User Roles & RBAC */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Authorized Stakeholder Accounts & Live Session Switch
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Click &quot;Switch Session&quot; to test that perspective instantly
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3.5">Role</th>
                        <th className="p-3.5">User Name</th>
                        <th className="p-3.5">Email & Password</th>
                        <th className="p-3.5">Company / Entity</th>
                        <th className="p-3.5">Core Permissions</th>
                        <th className="p-3.5 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {usersList.map((usr) => {
                        const isCurrent = currentRole === usr.roleKey;
                        return (
                          <tr key={usr.id} className={isCurrent ? 'bg-purple-50/60' : 'hover:bg-slate-50'}>
                            <td className="p-3.5">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                                usr.roleKey === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                                usr.roleKey === 'BUYER' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                                usr.roleKey === 'APPROVER' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                                'bg-amber-100 text-amber-800 border-amber-300'
                              }`}>
                                {usr.roleKey.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="p-3.5 font-bold text-slate-900">
                              {usr.name}
                              {isCurrent && (
                                <span className="ml-1.5 text-[9px] bg-purple-600 text-white font-bold px-1.5 py-0.2 rounded">
                                  ACTIVE
                                </span>
                              )}
                            </td>
                            <td className="p-3.5 font-mono text-slate-600">
                              <div>{usr.email}</div>
                              <div className="text-slate-400 text-[10px]">Pass: {usr.password}</div>
                            </td>
                            <td className="p-3.5">
                              <div className="font-semibold text-slate-800">{usr.companyName}</div>
                              <div className="text-slate-400 text-[10px]">{usr.department}</div>
                            </td>
                            <td className="p-3.5 text-[11px] text-slate-600">
                              {usr.roleKey === 'SUPER_ADMIN' && 'Full Operations & KYC Audit'}
                              {usr.roleKey === 'BUYER' && 'Volume Cart, Contract Sourcing & PR'}
                              {usr.roleKey === 'APPROVER' && 'Threshold Sign-Off (> ₹15k) & PO Gen'}
                              {usr.roleKey === 'VENDOR' && 'PO Dispatch, AWB Logistics & Invoices'}
                            </td>
                            <td className="p-3.5 text-center">
                              {isCurrent ? (
                                <span className="text-emerald-700 font-bold flex items-center justify-center gap-1">
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>Current</span>
                                </span>
                              ) : (
                                <button
                                  onClick={() => setRole(usr.roleKey)}
                                  className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg text-xs font-bold transition shadow-2xs cursor-pointer"
                                >
                                  Switch
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Platform Margins */}
          {activeTab === 'margins' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900">Commercial Platform Take-Rate (Take-Rate Economics)</h3>
                  <p className="text-xs text-slate-500">RacknSell B2B marketplace monetizes via a 2.5% transaction commission on settled Purchase Orders</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-right">
                  <span className="text-[10px] text-purple-800 uppercase font-bold block">Current Revenue Generated</span>
                  <span className="text-2xl font-black text-purple-900 font-mono">₹{platformFee.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Standard Take Rate</span>
                  <div className="text-2xl font-black text-slate-900 font-mono">2.50%</div>
                  <div className="text-[11px] text-slate-500 mt-1">Deducted from vendor payment clearance</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Total Processed GMV</span>
                  <div className="text-2xl font-black text-slate-900 font-mono">₹{totalSpend.toLocaleString('en-IN')}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Gross merchandise volume across all POs</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Settlement Cycle</span>
                  <div className="text-2xl font-black text-slate-900">Net-30 Days</div>
                  <div className="text-[11px] text-slate-500 mt-1">Auto cleared upon 3-way GRN match</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Security & Webhook Logs */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
              <h3 className="text-base font-black text-slate-900">System Security & Audit Trail Webhooks</h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between">
                  <span>[2026-09-14 17:15:22] - WEBHOOK: Cloudflare Edge Tunnel Handshake OK (Port 3000)</span>
                  <span className="text-emerald-600 font-bold">200 OK</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between">
                  <span>[2026-09-14 16:40:10] - EVENT: PO-2026-0941 AWB Status Dispatched (BlueDart BLUEDART-8829104)</span>
                  <span className="text-blue-600 font-bold">DISPATCHED</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between">
                  <span>[2026-09-14 15:20:00] - EVENT: PR-2026-0189 Flagged for Multi-Level Approval (&gt; ₹15,000 threshold)</span>
                  <span className="text-amber-600 font-bold">PENDING</span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 p-8 text-xs text-slate-500">Loading Administration Portal...</div>}>
      <AdminUsersContent />
    </Suspense>
  );
}
