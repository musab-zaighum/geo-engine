'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LogOut,
  ArrowRight,
  ShieldCheck,
  Search,
  Building2,
  Lock,
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

  const handleScrollToAudit = () => {
    if (pathname !== '/') {
      window.location.href = '/#audit-bar';
    } else {
      const el = document.getElementById('audit-bar');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const input = el.querySelector('input');
        if (input) input.focus();
      }
    }
  };

  // Hide VeloGEO global navigation bar on standalone debranded client reports
  if (pathname?.startsWith('/report/')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-[#F8FAFC]/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo Left */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-center overflow-hidden shadow-2xs group-hover:border-[#0284C7] transition-all">
              <img
                src="/logo.png"
                alt="VeloGEO"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/logo.svg';
                }}
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-base font-black tracking-tight text-slate-900 font-sans">
                  Velo<span className="text-[#0284C7]">GEO</span>
                </span>
              </div>
              <span className="text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase -mt-0.5">
                INTELLIGENCE SIMPLIFIED
              </span>
            </div>
          </Link>

          {/* Engine Status Pill */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[10px] tracking-tight">Regular GEO Active</span>
          </div>
        </div>

        {/* Clean Center Navigation Links (Linear-style minimalism) */}
        <nav className="hidden md:flex items-center gap-1 bg-white/70 p-1 rounded-xl border border-slate-200/70 shadow-2xs">
          <Link
            href="/"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              pathname === '/'
                ? 'text-[#0284C7] bg-sky-50/80 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            Audit Engine
          </Link>

          <Link
            href="/partner-console"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
              pathname === '/partner-console'
                ? 'text-[#0284C7] bg-sky-50/80 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>Partner Console</span>
          </Link>

          <Link
            href="/pricing"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              pathname === '/pricing'
                ? 'text-[#0284C7] bg-sky-50/80 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            Wholesale Pricing
          </Link>
        </nav>

        {/* Right CTA Action Button & Auth Controls */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/partner-console"
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-[#0284C7] transition-colors hidden sm:inline-flex items-center gap-1"
          >
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Agency Login</span>
          </Link>

          {authenticated && (
            <button
              type="button"
              onClick={handleLogout}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-lg transition-colors flex items-center gap-1.5 bg-white shadow-2xs"
              title="Lock Workspace"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock</span>
            </button>
          )}

          {/* Primary Action Button: Run Audit */}
          <button
            type="button"
            onClick={handleScrollToAudit}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-xs shadow-sky-900/10 transition-all duration-200 active:scale-[0.98]"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Audit Domain</span>
          </button>
        </div>
      </div>
    </header>
  );
}
