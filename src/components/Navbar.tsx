'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Zap,
  Building2,
  Lock,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import { CLINIC_OFFER_CONFIG } from '@/lib/config';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Hide Navbar on standalone unbranded reports if needed
  if (
    pathname?.startsWith('/report/') &&
    typeof window !== 'undefined' &&
    window.location.search.includes('unbranded=true')
  ) {
    return null;
  }

  const handleScrollTo = (id: string) => {
    setMobileMenuOpen(false);
    if (pathname !== '/') {
      window.location.href = `/#${id}`;
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 border border-emerald-400/30 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-white">
                  NexusRank<span className="text-emerald-400">1</span>
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                  CLINIC LOCAL GROWTH
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 tracking-wider hidden sm:block">
                Geo-Grid &amp; AI Citation Defense
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => handleScrollTo('features')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors flex items-center gap-1"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>The 4 Growth Pillars</span>
          </button>

          <button
            type="button"
            onClick={() => handleScrollTo('audit-bar')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Live Clinic Scan</span>
          </button>

          <Link
            href="/pricing"
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
          >
            $1,500 System
          </Link>

          <Link
            href="/partner-console"
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors flex items-center gap-1"
          >
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Clinic Command Center</span>
          </Link>
        </nav>

        {/* Right CTA Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Desktop Practice Login */}
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Clinic Login</span>
          </Link>

          {/* Direct $1,500 Whop CTA */}
          <a
            href={CLINIC_OFFER_CONFIG.whopCheckoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-emerald-950/60 transition-all duration-200 active:scale-[0.98] touch-target cursor-pointer group"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0 group-hover:rotate-12 transition-transform" />
            <span className="hidden xs:inline">Claim $1,500 System</span>
            <span className="xs:hidden">Get System</span>
          </a>

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors touch-target"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-2xl animate-in slide-in-from-top duration-200 px-4 py-4 space-y-3">
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => handleScrollTo('features')}
              className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-900 transition-colors flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>The 4 Growth Pillars</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </button>

            <button
              type="button"
              onClick={() => handleScrollTo('audit-bar')}
              className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-900 transition-colors flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Live Clinic Scan</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </button>

            <Link
              href="/pricing"
              className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-900 transition-colors flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>$1,500 System &amp; ROI</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>

            <Link
              href="/partner-console"
              className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-900 transition-colors flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span>Clinic Command Center</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>

            <Link
              href="/login"
              className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-900 transition-colors flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-400" />
                <span>Clinic Login</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-2">
            <a
              href={CLINIC_OFFER_CONFIG.whopCheckoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 text-white text-xs font-black shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 text-center"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Claim Your Clinic Growth System — $1,500</span>
            </a>

            <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified Whop Checkout
              </span>
              <span>•</span>
              <span>1-Patient ROI Guarantee</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
