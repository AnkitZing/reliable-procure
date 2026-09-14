'use client';

import React from 'react';
import { useReliableStore } from '@/lib/store';
import { Role } from '@/lib/types';
import { DEMO_USERS } from '@/lib/mock-data';
import { Shield, UserCheck, ShoppingBag, Truck } from 'lucide-react';

export function RoleSwitcher() {
  const { currentRole, setRole } = useReliableStore();

  const roles: { role: Role; label: string; icon: React.ReactNode; desc: string; badgeColor: string }[] = [
    {
      role: 'SUPER_ADMIN',
      label: 'Admin Portal',
      icon: <Shield className="w-3.5 h-3.5" />,
      desc: 'Central Platform Operations & KYC',
      badgeColor: 'text-purple-700 bg-purple-100 border-purple-300 shadow-sm'
    },
    {
      role: 'BUYER',
      label: 'Corporate Buyer',
      icon: <ShoppingBag className="w-3.5 h-3.5" />,
      desc: 'Catalog, Volume Tiers & PR',
      badgeColor: 'text-blue-700 bg-blue-100 border-blue-300 shadow-sm'
    },
    {
      role: 'APPROVER',
      label: 'Finance Approver',
      icon: <UserCheck className="w-3.5 h-3.5" />,
      desc: 'PR Review & Threshold Control',
      badgeColor: 'text-emerald-700 bg-emerald-100 border-emerald-300 shadow-sm'
    },
    {
      role: 'VENDOR',
      label: 'Supplier / Vendor',
      icon: <Truck className="w-3.5 h-3.5" />,
      desc: 'PO Fulfillment & Dispatch',
      badgeColor: 'text-amber-800 bg-amber-100 border-amber-300 shadow-sm'
    }
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 border border-slate-200 rounded-xl">
      <span className="text-[11px] font-bold text-slate-500 px-2 uppercase tracking-wider hidden md:inline">
        Live Role:
      </span>
      <div className="flex gap-1">
        {roles.map((item) => {
          const isActive = currentRole === item.role;
          return (
            <button
              key={item.role}
              onClick={() => setRole(item.role)}
              title={`${DEMO_USERS[item.role].name} - ${item.desc}`}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? `${item.badgeColor} font-bold border`
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 border border-transparent'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
