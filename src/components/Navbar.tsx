'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Stethoscope,
  LayoutDashboard,
  Tag,
  CreditCard,
  Lock,
  LogOut,
  ShieldCheck,
  Activity,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/auth')
      .then((res) => res.json())
      .then((data) => setAuthenticated(data.authenticated === true))
      .catch(() => setAuthenticated(false));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    setAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo Left */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-sky-500 p-0.5 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-white">
                Cite<span className="text-teal-400">Med</span>
              </span>
              <span className="text-slate-500 font-normal text-sm">//</span>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Healthcare GEO Suite
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium block -mt-1">
              AI Visibility & Infrastructure Platform
            </span>
          </div>
        </Link>

        {/* Center Navigation Links (Exact Order: Workspace -> White-Label Suite -> Pricing) */}
        <nav className="hidden md:flex items-center gap-1.5">
          <Link
            href="/"
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              pathname === '/'
                ? 'bg-slate-800 text-teal-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-teal-400" />
            Workspace
          </Link>

          <Link
            href="/white-label"
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              pathname === '/white-label'
                ? 'bg-slate-800 text-teal-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Tag className="w-4 h-4 text-teal-400" />
            White-Label Suite
          </Link>

          <Link
            href="/pricing"
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              pathname === '/pricing'
                ? 'bg-slate-800 text-teal-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4 text-teal-400" />
            Pricing
          </Link>
        </nav>

        {/* Right Status & Auth Lock Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 rounded-full text-[11px] font-semibold text-slate-300 border border-slate-800">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>AHPRA & NPI Engine Active</span>
          </div>

          {authenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-rose-400 border border-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock Workspace</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-sky-600 hover:from-teal-400 hover:to-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-teal-500/20 transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Login Gate</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
