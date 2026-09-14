'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { useReliableStore } from '@/lib/store';
import { 
  TrendingUp, ShieldCheck 
} from 'lucide-react';

export default function AnalyticsPage() {
  const { purchaseOrders } = useReliableStore();

  const totalSpend = purchaseOrders.reduce((acc, po) => acc + po.totalAmount, 0);
  const estimatedSavings = Math.round(totalSpend * 0.142); // 14.2% average savings via contracted rates

  const departmentBudgets = [
    { name: 'Plant Operations & MRO', allocated: 450000, spent: 312000, color: 'bg-blue-600' },
    { name: 'Health & Safety (EHS)', allocated: 220000, spent: 145000, color: 'bg-emerald-600' },
    { name: 'Electrical & Power Systems', allocated: 600000, spent: 480000, color: 'bg-amber-600' },
    { name: 'Corporate IT & Hardware', allocated: 380000, spent: 198000, color: 'bg-purple-600' },
    { name: 'Facilities & Cleaning', allocated: 150000, spent: 89000, color: 'bg-teal-600' }
  ];

  const categorySpend = [
    { category: 'Safety & PPE', percent: 34, amount: '₹2,45,000' },
    { category: 'Industrial Tools & MRO', percent: 28, amount: '₹2,02,000' },
    { category: 'Electrical & Automation', percent: 22, amount: '₹1,58,000' },
    { category: 'Office & IT Supplies', percent: 10, amount: '₹72,000' },
    { category: 'Facility Management', percent: 6, amount: '₹43,000' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Spend Analytics & Buydesk Intelligence
            </h1>
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
              Enterprise Insights
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time corporate procurement analytics, departmental budget consumption, and contractual cost savings
          </p>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
              Total Managed Spend
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              ₹{(totalSpend + 720000).toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">YTD Corporate Procurement</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
              Negotiated Savings
            </div>
            <div className="text-2xl font-black text-emerald-700 font-mono">
              ₹{estimatedSavings.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <span>14.2% below open-market MRP</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
              Consolidated Suppliers
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              14 Partners
            </div>
            <div className="text-[11px] text-blue-700 font-semibold mt-1">
              Down from 82 scattered local vendors
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
              P2P Cycle Time
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              2.4 Days
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">
              Reduced from traditional 18-day manual PO
            </div>
          </div>
        </div>

        {/* Section 1: Department Budget Consumption */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Departmental Budget Allocation vs Actual Spend</h2>
              <p className="text-xs text-slate-500">Quarterly budget utilization across operational units</p>
            </div>
          </div>

          <div className="space-y-4">
            {departmentBudgets.map((dept) => {
              const percentUsed = Math.round((dept.spent / dept.allocated) * 100);

              return (
                <div key={dept.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-800">{dept.name}</span>
                    <div className="space-x-2">
                      <span className="text-slate-500 font-mono">
                        ₹{dept.spent.toLocaleString('en-IN')} / ₹{dept.allocated.toLocaleString('en-IN')}
                      </span>
                      <span className={`font-bold font-mono ${percentUsed > 80 ? 'text-amber-700' : 'text-emerald-700'}`}>
                        ({percentUsed}%)
                      </span>
                    </div>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className={`h-full ${dept.color} transition-all duration-500 rounded-full`}
                      style={{ width: `${percentUsed}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Category Spend Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Spend by Product Category</h3>
            <div className="space-y-3">
              {categorySpend.map((cat) => (
                <div key={cat.category} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">{cat.category}</div>
                    <div className="text-[10px] text-slate-500">Total: {cat.amount}</div>
                  </div>
                  <div className="text-xs font-mono font-black text-emerald-700">
                    {cat.percent}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Sourcing Efficiency & ROI</h3>
              <p className="text-xs text-slate-500 mt-1">
                How Reliable&apos;s Procure-to-Pay automation eliminates leakages
              </p>

              <div className="mt-4 space-y-3 text-xs text-slate-700">
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Zero Maverick Spend:</strong> 100% of purchases follow pre-set threshold rules (&lt;₹15k auto-approved, &ge;₹15k manager signed).
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Automated 3-Way Match:</strong> Invoices are matched against physical warehouse GRN receipts before payment release, preventing overbilling.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">GST Compliance Guaranteed:</strong> Every vendor on Reliable is verified with active GSTIN, enabling 100% Input Tax Credit (ITC) claim.
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-xs text-slate-500 font-medium">Net Estimated Quarterly Savings:</div>
              <div className="text-xl font-black text-emerald-700 font-mono mt-1">
                ₹3,84,200
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
