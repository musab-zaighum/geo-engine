'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Palette,
  Tag,
  LogOut,
  ArrowRight,
  ShieldCheck,
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

  return (
    <header className="sticky top-0 z-50 bg-[#F8FAFC]/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo Left */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            {/* Standard <img> tag with graceful SVG fallback */}
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700/50 flex items-center justify-center overflow-hidden shadow-sm group-hover:border-[#0284C7] transition-colors">
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
              <span className="text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase -mt-0.5">
                INTELLIGENCE SIMPLIFIED
              </span>
            </div>
          </Link>

          {/* Status Badge */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-[#0284C7] border border-sky-200/70">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] animate-pulse" />
            <span className="font-mono text-[11px]">Regular GEO Active</span>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === '/'
                ? 'text-[#0284C7] bg-sky-50/80 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            Workspace
          </Link>

          <Link
            href="/partner-console"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === '/partner-console'
                ? 'text-[#0284C7] bg-sky-50/80 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            Partner Console
          </Link>

          <Link
            href="/licensing"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === '/licensing'
                ? 'text-[#0284C7] bg-sky-50/80 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            Licensing &amp; P&amp;L
          </Link>

          <Link
            href="/white-label"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === '/white-label'
                ? 'text-[#0284C7] bg-sky-50/80 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            White-Label Suite
          </Link>

          <Link
            href="/pricing"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === '/pricing'
                ? 'text-[#0284C7] bg-sky-50/80 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            Pricing
          </Link>
        </nav>

        {/* Right CTA Action Button & Auth Controls */}
        <div className="flex items-center gap-3">
          <Link
            href="/signup"
            className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-[#0284C7] transition-colors hidden sm:inline-block"
          >
            Sign Up
          </Link>

          {authenticated && (
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-lg transition-colors flex items-center gap-1.5 bg-slate-50"
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
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#0284C7] hover:bg-[#0369a1] text-white text-sm font-medium shadow-sm transition-all active:scale-[0.98]"
          >
            <span>Run Audit</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

