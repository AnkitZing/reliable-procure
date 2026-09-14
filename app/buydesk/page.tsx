'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { EnterpriseSidebar } from '@/components/EnterpriseSidebar';
import { useReliableStore } from '@/lib/store';
import { 
  Building2, Shield, Users, Layers, DollarSign, 
  CheckCircle2, Plus, Sliders, AlertTriangle, ArrowRight,
  TrendingUp, Award, Settings, Check, X
} from 'lucide-react';

function BuydeskContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'entities';

  const [activeTab, setActiveTab] = useState(initialTab);
  const { companies, toggleCompanyStatus, currentRole, currentUser } = useReliableStore();

  const [isNewEntityModalOpen, setIsNewEntityModalOpen] = useState(false);
  const [newEntityName, setNewEntityName] = useState('');
  const [newEntityGstin, setNewEntityGstin] = useState('');
  const [newEntityLimit, setNewEntityLimit] = useState('5000000');

  // Enterprise Client entities
  const enterprises = companies.filter(c => c.type === 'ENTERPRISE');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <EnterpriseSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                <span>Enterprise Buydesk Management</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                Corporate Governance & Approval Hierarchies
              </h1>
              <p className="text-xs text-slate-500">
                Manage client entities, department cost centers, Delegation of Authority (DoA), and spend threshold limits.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsNewEntityModalOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Onboard Enterprise</span>
              </button>
            </div>
          </div>

          {/* Submenu Navigation Tabs */}
          <div className="flex border-b border-slate-200 space-x-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('entities')}
              className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'entities'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Entities & Cost Centers</span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-blue-100 text-blue-800">
                {enterprises.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('rules')}
              className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'rules'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Spend & Approval Rules</span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                ₹15k Active
              </span>
            </button>

            <button
              onClick={() => setActiveTab('hierarchies')}
              className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'hierarchies'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Approval Hierarchies (DoA)</span>
            </button>

            <button
              onClick={() => setActiveTab('budgets')}
              className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'budgets'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Department Budgets</span>
            </button>
          </div>

          {/* TAB 1: Entities & Cost Centers */}
          {activeTab === 'entities' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {enterprises.map((ent) => {
                  const percentUsed = Math.round((ent.creditUsed / ent.creditLimit) * 100);
                  return (
                    <div key={ent.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">Enterprise Entity</span>
                          <h3 className="text-base font-black text-slate-900">{ent.name}</h3>
                          <div className="text-xs text-slate-500 font-mono mt-0.5">GSTIN: {ent.gstin}</div>
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          ent.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {ent.status}
                        </span>
                      </div>

                      {/* Credit Limit Meter */}
                      <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-600">Contract Credit Facility</span>
                          <span className="text-slate-900 font-mono">{percentUsed}% utilized</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              percentUsed > 80 ? 'bg-red-500' : percentUsed > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`} 
                            style={{ width: `${percentUsed}%` }} 
                          />
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-500 font-mono pt-1">
                          <span>Used: ₹{ent.creditUsed.toLocaleString('en-IN')}</span>
                          <span>Limit: ₹{ent.creditLimit.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="text-[10px] text-slate-400 font-bold block">Payment Terms</span>
                          <span className="font-bold text-slate-800">{ent.paymentTerms}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="text-[10px] text-slate-400 font-bold block">State Jurisdiction</span>
                          <span className="font-bold text-slate-800">{ent.state}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => toggleCompanyStatus(ent.id)}
                          className="text-xs font-bold text-slate-600 hover:text-slate-900 underline cursor-pointer"
                        >
                          Toggle Status ({ent.status === 'ACTIVE' ? 'Suspend' : 'Activate'})
                        </button>
                        <Link 
                          href="/requisitions"
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <span>View Requisitions</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Spend & Approval Rules */}
          {activeTab === 'rules' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Procure-to-Pay Automated Approval Matrix</h3>
                    <p className="text-xs text-slate-500">Autonomous purchase order generation vs multi-level manager sign-off</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tier 1: Auto-PO */}
                  <div className="p-5 rounded-xl border-2 border-emerald-300 bg-emerald-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Rule #1: Fast-Track Auto PO
                      </span>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="text-xl font-black text-slate-900 font-mono">
                      Order Value &lt; ₹15,000
                    </div>
                    <p className="text-xs text-slate-600">
                      Orders under ₹15,000 bypass manual managerial delays. When a corporate buyer submits a cart or PR, the system instantly validates catalog contract rates and automatically generates an authorized digital Purchase Order (PO).
                    </p>
                    <div className="pt-2 text-[11px] font-mono text-emerald-800 font-semibold">
                      Status: ACTIVE &bull; Zero Approval Friction
                    </div>
                  </div>

                  {/* Tier 2: Manager Sign-off */}
                  <div className="p-5 rounded-xl border-2 border-amber-300 bg-amber-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                        Rule #2: Multi-Level Approval
                      </span>
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="text-xl font-black text-slate-900 font-mono">
                      Order Value &ge; ₹15,000
                    </div>
                    <p className="text-xs text-slate-600">
                      Requisitions equal to or exceeding ₹15,000 are automatically held in <code>PENDING_APPROVAL</code>. Routed to Plant Head / Finance Approver (e.g. Vikramaditya Rao) for budget audit and formal 1-click authorization.
                    </p>
                    <div className="pt-2 text-[11px] font-mono text-amber-800 font-semibold">
                      Status: ACTIVE &bull; Compliance Guardrails Enabled
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Approval Hierarchies (DoA) */}
          {activeTab === 'hierarchies' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Delegation of Authority (DoA) Matrix
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Level / Tier</th>
                      <th className="p-3.5">Designation</th>
                      <th className="p-3.5">Assigned Approver</th>
                      <th className="p-3.5">Max PO Limit</th>
                      <th className="p-3.5">Auto-Route Rule</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">Level 0</td>
                      <td className="p-3.5">Autonomous System</td>
                      <td className="p-3.5 text-blue-600 font-bold">Reliable P2P Auto-Engine</td>
                      <td className="p-3.5 font-mono font-bold">Up to ₹15,000</td>
                      <td className="p-3.5 text-emerald-700 font-semibold">Instant PO Generation</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">Level 1</td>
                      <td className="p-3.5">Department Head</td>
                      <td className="p-3.5 font-bold text-slate-900">Vikramaditya Rao (Finance Head)</td>
                      <td className="p-3.5 font-mono font-bold">Up to ₹5,00,000</td>
                      <td className="p-3.5 text-amber-700 font-semibold">Pending Approver Sign-off</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">Level 2</td>
                      <td className="p-3.5">VP Operations</td>
                      <td className="p-3.5 font-bold text-slate-900">Rajesh Sharma (Central Operations)</td>
                      <td className="p-3.5 font-mono font-bold">Above ₹5,00,000</td>
                      <td className="p-3.5 text-purple-700 font-semibold">Executive Board Review</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Department Budgets */}
          {activeTab === 'budgets' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900">Plant Operations & MRO</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Healthy</span>
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">₹14,50,000</div>
                <div className="text-[11px] text-slate-500">Allocated Annual: ₹50,00,000 (29% utilized)</div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '29%' }} />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900">Health & Safety (EHS)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">Optimal</span>
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">₹4,20,000</div>
                <div className="text-[11px] text-slate-500">Allocated Annual: ₹15,00,000 (28% utilized)</div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '28%' }} />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900">Heavy Machinery & Electrical</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">High Spend</span>
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">₹38,50,000</div>
                <div className="text-[11px] text-slate-500">Allocated Annual: ₹60,00,000 (64% utilized)</div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '64%' }} />
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default function BuydeskPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 p-8 text-xs text-slate-500">Loading Enterprise Buydesk...</div>}>
      <BuydeskContent />
    </Suspense>
  );
}
