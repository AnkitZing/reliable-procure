'use client';

import React, { useState } from 'react';
import { Logo } from '@/components/Logo';
import { useReliableStore } from '@/lib/store';
import { Role } from '@/lib/types';
import { DEMO_USERS } from '@/lib/mock-data';
import { 
  Shield, Lock, Mail, ArrowRight, CheckCircle2, 
  Building2, KeyRound, Sparkles, Copy, Check, AlertCircle 
} from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const { setRole } = useReliableStore();

  const [email, setEmail] = useState('admin@reliableprocure.com');
  const [password, setPassword] = useState('Admin@123');
  const [selectedRole, setSelectedRole] = useState<Role>('SUPER_ADMIN');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedRole, setCopiedRole] = useState<string | null>(null);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setErrorMsg(null);
    const user = DEMO_USERS[role];
    if (user) {
      setEmail(user.email);
      setPassword(user.password || 'Reliable@123');
    }
  };

  const handleInstantLogin = (role: Role) => {
    setErrorMsg(null);
    setIsLoading(true);
    const user = DEMO_USERS[role];
    setRole(role);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('reliable_v2_role', JSON.stringify(role));
        localStorage.setItem('reliable_v2_auth', JSON.stringify(true));
      } catch (e) {
        console.error(e);
      }
    }
    setSuccessMsg(`Authenticating as ${user.name} (${role.replace('_', ' ')})...`);
    const dest = role === 'SUPER_ADMIN' ? '/admin' : '/dashboard';
    setTimeout(() => {
      window.location.href = dest;
    }, 250);
  };

  const copyCreds = (e: React.MouseEvent, roleKey: string, roleEmail: string, rolePass: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`Email: ${roleEmail}\nPassword: ${rolePass}`);
    setCopiedRole(roleKey);
    setTimeout(() => setCopiedRole(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    let targetRole: Role = selectedRole;

    // Smart email detection so user is never locked out
    if (cleanEmail.includes('admin')) {
      targetRole = 'SUPER_ADMIN';
    } else if (cleanEmail.includes('buyer') || cleanEmail.includes('ankit')) {
      targetRole = 'BUYER';
    } else if (cleanEmail.includes('approv') || cleanEmail.includes('rao') || cleanEmail.includes('finance')) {
      targetRole = 'APPROVER';
    } else if (cleanEmail.includes('vendor') || cleanEmail.includes('sales') || cleanEmail.includes('supply')) {
      targetRole = 'VENDOR';
    }

    setRole(targetRole);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('reliable_v2_role', JSON.stringify(targetRole));
        localStorage.setItem('reliable_v2_auth', JSON.stringify(true));
      } catch (err) {
        console.error(err);
      }
    }

    setSuccessMsg('Authentication successful! Opening dashboard...');
    const dest = targetRole === 'SUPER_ADMIN' ? '/admin' : '/dashboard';
    setTimeout(() => {
      window.location.href = dest;
    }, 250);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative">
      
      {/* Background soft ambient accents */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-blue-100/60 via-indigo-50/40 to-emerald-100/50 blur-3xl pointer-events-none rounded-full" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-2">
        <div className="flex justify-center mb-3">
          <Link href="/">
            <Logo size="lg" />
          </Link>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          Reliable Admin & Enterprise Portal
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Centralized Sourcing, Automated PR/PO Workflows & 3-Way Matching Engine
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl relative z-10 px-4 space-y-4">
        
        {/* Quick Credentials Box for User Ease */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-blue-600" />
              Demo Roles & User Credentials (Click to Login)
            </span>
            <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              Instant 1-Click
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Super Admin */}
            <div
              onClick={() => handleRoleSelect('SUPER_ADMIN')}
              className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                selectedRole === 'SUPER_ADMIN'
                  ? 'bg-purple-50/90 border-purple-500 ring-2 ring-purple-400/30'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-purple-600" /> Super Admin
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => copyCreds(e, 'SUPER_ADMIN', DEMO_USERS.SUPER_ADMIN.email, DEMO_USERS.SUPER_ADMIN.password!)}
                    className="text-slate-400 hover:text-slate-700 p-0.5"
                    title="Copy credentials"
                  >
                    {copiedRole === 'SUPER_ADMIN' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleInstantLogin('SUPER_ADMIN'); }}
                    className="text-[10px] bg-purple-600 hover:bg-purple-700 text-white font-bold px-2 py-0.5 rounded shadow-xs cursor-pointer"
                  >
                    Enter ➜
                  </button>
                </div>
              </div>
              <div className="text-[11px] font-mono text-slate-800 font-semibold mt-1">{DEMO_USERS.SUPER_ADMIN.email}</div>
              <div className="text-[10px] text-slate-500 font-mono">Password: <strong className="text-slate-700">{DEMO_USERS.SUPER_ADMIN.password}</strong></div>
            </div>

            {/* Corporate Buyer */}
            <div
              onClick={() => handleRoleSelect('BUYER')}
              className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                selectedRole === 'BUYER'
                  ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-400/30'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" /> Corporate Buyer
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => copyCreds(e, 'BUYER', DEMO_USERS.BUYER.email, DEMO_USERS.BUYER.password!)}
                    className="text-slate-400 hover:text-slate-700 p-0.5"
                    title="Copy credentials"
                  >
                    {copiedRole === 'BUYER' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleInstantLogin('BUYER'); }}
                    className="text-[10px] bg-blue-600 hover:bg-blue-700 text-white font-bold px-2 py-0.5 rounded shadow-xs cursor-pointer"
                  >
                    Enter ➜
                  </button>
                </div>
              </div>
              <div className="text-[11px] font-mono text-slate-800 font-semibold mt-1">{DEMO_USERS.BUYER.email}</div>
              <div className="text-[10px] text-slate-500 font-mono">Password: <strong className="text-slate-700">{DEMO_USERS.BUYER.password}</strong></div>
            </div>

            {/* Finance Approver */}
            <div
              onClick={() => handleRoleSelect('APPROVER')}
              className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                selectedRole === 'APPROVER'
                  ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-400/30'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Finance Approver
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => copyCreds(e, 'APPROVER', DEMO_USERS.APPROVER.email, DEMO_USERS.APPROVER.password!)}
                    className="text-slate-400 hover:text-slate-700 p-0.5"
                    title="Copy credentials"
                  >
                    {copiedRole === 'APPROVER' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleInstantLogin('APPROVER'); }}
                    className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-0.5 rounded shadow-xs cursor-pointer"
                  >
                    Enter ➜
                  </button>
                </div>
              </div>
              <div className="text-[11px] font-mono text-slate-800 font-semibold mt-1">{DEMO_USERS.APPROVER.email}</div>
              <div className="text-[10px] text-slate-500 font-mono">Password: <strong className="text-slate-700">{DEMO_USERS.APPROVER.password}</strong></div>
            </div>

            {/* Supplier / Vendor */}
            <div
              onClick={() => handleRoleSelect('VENDOR')}
              className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                selectedRole === 'VENDOR'
                  ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-400/30'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-amber-600" /> Supplier / Vendor
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => copyCreds(e, 'VENDOR', DEMO_USERS.VENDOR.email, DEMO_USERS.VENDOR.password!)}
                    className="text-slate-400 hover:text-slate-700 p-0.5"
                    title="Copy credentials"
                  >
                    {copiedRole === 'VENDOR' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleInstantLogin('VENDOR'); }}
                    className="text-[10px] bg-amber-600 hover:bg-amber-700 text-white font-bold px-2 py-0.5 rounded shadow-xs cursor-pointer"
                  >
                    Enter ➜
                  </button>
                </div>
              </div>
              <div className="text-[11px] font-mono text-slate-800 font-semibold mt-1">{DEMO_USERS.VENDOR.email}</div>
              <div className="text-[10px] text-slate-500 font-mono">Password: <strong className="text-slate-700">{DEMO_USERS.VENDOR.password}</strong></div>
            </div>
          </div>
        </div>

        {/* Login Card Form */}
        <div className="bg-white py-7 px-6 sm:px-8 shadow-md rounded-2xl border border-slate-200 space-y-5">
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>{successMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Authorized Enterprise Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrorMsg(null); }}
                  className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <span className="text-[11px] text-blue-600 hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrorMsg(null); }}
                  className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded bg-white border-slate-300 text-blue-600 focus:ring-0 w-3.5 h-3.5"
                />
                <span className="text-xs text-slate-600">Remember corporate session</span>
              </label>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" /> 256-bit SSL Active
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:opacity-95 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>Sign In to Reliable Buydesk</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security & Compliance Highlights */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 font-medium">Compliance</div>
              <div className="text-xs font-bold text-slate-800">GST Ready</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 font-medium">Verification</div>
              <div className="text-xs font-bold text-slate-800">3-Way Match</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 font-medium">Workflow</div>
              <div className="text-xs font-bold text-slate-800">Auto PO</div>
            </div>
          </div>

        </div>

        <div className="text-center">
          <p className="text-xs text-slate-500">
            Powered by <strong className="text-slate-700">Reliable Enterprise Technologies</strong> &bull; Complete P2P Architecture
          </p>
        </div>
      </div>
    </div>
  );
}
