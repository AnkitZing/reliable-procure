'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { RoleSwitcher } from './RoleSwitcher';
import { CartDrawer } from './CartDrawer';
import { useReliableStore } from '@/lib/store';
import { 
  LayoutDashboard, ShoppingCart, FileText, PackageCheck, 
  FileSearch, CheckCheck, BarChart3, Shield, Menu, X, User
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { cart, currentUser } = useReliableStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/catalog', label: 'Catalog', icon: ShoppingCart },
    { href: '/requisitions', label: 'Requisitions', icon: FileText },
    { href: '/purchase-orders', label: 'Purchase Orders', icon: PackageCheck },
    { href: '/rfq', label: 'RFQ & Quotes', icon: FileSearch },
    { href: '/grn-matching', label: '3-Way Match', icon: CheckCheck },
    { href: '/analytics', label: 'Spend Analytics', icon: BarChart3 },
  ];

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Brand Logo */}
            <div className="flex items-center gap-6">
              <Link href="/" className="hover:opacity-90 transition">
                <Logo size="sm" />
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden xl:flex items-center gap-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right: Role Switcher & Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:block">
                <RoleSwitcher />
              </div>

              {/* Admin Portal Quick Link */}
              <Link
                href="/admin/login"
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                  pathname.startsWith('/admin')
                    ? 'bg-purple-100 text-purple-800 border-purple-300'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400 hover:text-slate-900 shadow-2xs'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-purple-600" />
                <span>Admin Login</span>
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 p-2 bg-slate-100 border border-slate-200 hover:border-blue-400 hover:bg-blue-50 rounded-xl text-slate-700 transition group cursor-pointer"
                title="Procurement Requisition Cart"
              >
                <ShoppingCart className="w-4 h-4 text-blue-600 group-hover:scale-110 transition" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold text-[10px] rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {totalCartCount}
                  </span>
                )}
              </button>

              {/* User Profile Capsule */}
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="text-left leading-tight hidden md:block">
                  <div className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium truncate max-w-[120px]">
                    {currentUser.companyName}
                  </div>
                </div>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 bg-white p-4 space-y-3 shadow-md">
            <div className="pb-2 border-b border-slate-100">
              <RoleSwitcher />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Cart Drawer Modal */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
