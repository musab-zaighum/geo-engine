'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Search,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe,
  Building2,
  Lock,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Smartphone,
} from 'lucide-react';
import { MobileCheckoutDrawer, PlanTier } from './MobileCheckoutDrawer';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutTier, setCheckoutTier] = useState<PlanTier>('growth');

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Hide Navbar on standalone debranded client reports if needed
  if (pathname?.startsWith('/report/') && typeof window !== 'undefined' && window.location.search.includes('unbranded=true')) {
    return null;
  }

  const handleOpenCheckout = (tier: PlanTier = 'growth') => {
    setCheckoutTier(tier);
    setCheckoutOpen(true);
    setMobileMenuOpen(false);
  };

  const handleScrollTo = (id: string) => {
    setMobileMenuOpen(false);
    if (pathname !== '/') {
      window.location.href = `/#${id}`;
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo Left */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 border border-indigo-400/30 flex items-center justify-center shadow-lg shadow-indigo-950/50 group-hover:scale-105 transition-all">
                <Zap className="w-5 h-5 text-white fill-white/20" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black tracking-tight text-white font-sans">
                    NexusRank<span className="text-indigo-400">1</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono font-bold">
                    PRO
                  </span>
                </div>
                <span className="text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase -mt-0.5">
                  AUTONOMOUS HEALTHCARE GEO
                </span>
              </div>
            </Link>

            {/* Status Pill */}
            <div className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono">Direct Practice GEO Defense</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 shadow-inner">
            <button
              type="button"
              onClick={() => handleScrollTo('audit-engine')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
            >
              Practice Audit
            </button>

            <button
              type="button"
              onClick={() => handleScrollTo('features')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Clinical GEO</span>
            </button>

            <button
              type="button"
              onClick={() => handleScrollTo('patient-roi-calculator')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors flex items-center gap-1"
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Patient ROI Modeler</span>
            </button>

            <button
              type="button"
              onClick={() => handleScrollTo('pricing')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
            >
              Pricing ($199-$699)
            </button>

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
              href="/partner-console"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Practice Login</span>
            </Link>

            {/* Claim Clinic License Button (Desktop & Mobile) */}
            <button
              type="button"
              onClick={() => handleOpenCheckout('growth')}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-950/60 transition-all duration-200 active:scale-[0.98] touch-target cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="hidden xs:inline">Protect Practice ($349/mo)</span>
              <span className="xs:hidden">Protect ($349)</span>
            </button>

            {/* Mobile Hamburger Menu Toggle Button (Touch Target >= 44px) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors touch-target cursor-pointer ml-1"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open mobile menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-indigo-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950/98 backdrop-blur-2xl px-4 py-5 space-y-4 animate-in slide-in-from-top-4 duration-200">
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => handleScrollTo('audit-engine')}
                className="w-full py-3 px-3 rounded-xl text-left text-sm font-semibold text-slate-200 hover:bg-slate-900 hover:text-white flex items-center justify-between touch-target"
              >
                <div className="flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-indigo-400" />
                  <span>Instant Practice Audit Bar</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600" />
              </button>

              <button
                type="button"
                onClick={() => handleScrollTo('patient-roi-calculator')}
                className="w-full py-3 px-3 rounded-xl text-left text-sm font-semibold text-slate-200 hover:bg-slate-900 hover:text-white flex items-center justify-between touch-target"
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Patient ROI Modeler</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600" />
              </button>

              <button
                type="button"
                onClick={() => handleScrollTo('features')}
                className="w-full py-3 px-3 rounded-xl text-left text-sm font-semibold text-slate-200 hover:bg-slate-900 hover:text-white flex items-center justify-between touch-target"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Clinical GEO Architecture</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600" />
              </button>

              <button
                type="button"
                onClick={() => handleScrollTo('pricing')}
                className="w-full py-3 px-3 rounded-xl text-left text-sm font-semibold text-slate-200 hover:bg-slate-900 hover:text-white flex items-center justify-between touch-target"
              >
                <div className="flex items-center gap-2.5">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  <span>Practice Pricing ($199-$699)</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600" />
              </button>

              <Link
                href="/partner-console"
                className="w-full py-3 px-3 rounded-xl text-left text-sm font-semibold text-slate-200 hover:bg-slate-900 hover:text-white flex items-center justify-between touch-target"
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span>Clinic Command Center</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600" />
              </Link>
            </div>

            {/* Mobile In-App Checkout Banner */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <button
                type="button"
                onClick={() => handleOpenCheckout('growth')}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/80 touch-target"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Protect Practice ($349/mo)</span>
              </button>

              <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 4-Sec Apple Pay / GPay
                </span>
                <span>•</span>
                <span>Verified 0-Error Schema</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Modals Mounted with Navbar */}
      <MobileCheckoutDrawer
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        initialPlan={checkoutTier}
      />
    </>
  );
}
