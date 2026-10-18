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
import { WhiteLabelModal } from './WhiteLabelModal';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutTier, setCheckoutTier] = useState<PlanTier>('growth');
  const [whiteLabelOpen, setWhiteLabelOpen] = useState(false);

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
                  B2B WHITE-LABEL SAAS
                </span>
              </div>
            </Link>

            {/* Status Pill */}
            <div className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono">Autonomous Sales Engine</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 shadow-inner">
            <button
              type="button"
              onClick={() => handleScrollTo('audit-engine')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
            >
              Instant Audit
            </button>

            <button
              type="button"
              onClick={() => handleScrollTo('profit-calculator')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors flex items-center gap-1"
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>93% Margin Calc</span>
            </button>

            <button
              type="button"
              onClick={() => setWhiteLabelOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>White-Label CNAME</span>
            </button>

            <button
              type="button"
              onClick={() => handleScrollTo('pricing')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
            >
              Pricing ($97-$697)
            </button>

            <Link
              href="/partner-console"
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors flex items-center gap-1"
            >
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Partner Console</span>
            </Link>
          </nav>

          {/* Right CTA Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Desktop Agency Login */}
            <Link
              href="/partner-console"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Agency Login</span>
            </Link>

            {/* Claim Wholesale License Button (Desktop & Mobile) */}
            <button
              type="button"
              onClick={() => handleOpenCheckout('growth')}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-950/60 transition-all duration-200 active:scale-[0.98] touch-target cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="hidden xs:inline">Claim $297/mo License</span>
              <span className="xs:hidden">Claim $297</span>
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
                  <span>Instant Domain Audit Bar</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600" />
              </button>

              <button
                type="button"
                onClick={() => handleScrollTo('profit-calculator')}
                className="w-full py-3 px-3 rounded-xl text-left text-sm font-semibold text-slate-200 hover:bg-slate-900 hover:text-white flex items-center justify-between touch-target"
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Agency Profit Calculator (93% Net)</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setWhiteLabelOpen(true);
                }}
                className="w-full py-3 px-3 rounded-xl text-left text-sm font-semibold text-slate-200 hover:bg-slate-900 hover:text-white flex items-center justify-between touch-target"
              >
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-indigo-400" />
                  <span>White-Label CNAME Preview</span>
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
                  <span>3-Tier Agency Pricing ($97-$697)</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600" />
              </button>

              <Link
                href="/partner-console"
                className="w-full py-3 px-3 rounded-xl text-left text-sm font-semibold text-slate-200 hover:bg-slate-900 hover:text-white flex items-center justify-between touch-target"
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span>Partner Console &amp; DNS Management</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600" />
              </Link>
            </div>

            {/* Mobile In-App Checkout Banner */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <button
                type="button"
                onClick={() => handleOpenCheckout('growth')}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/80 touch-target"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Claim $297/mo Wholesale License</span>
              </button>

              <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 4-Sec Apple Pay / GPay
                </span>
                <span>•</span>
                <span>100% Unbranded CNAME</span>
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

      <WhiteLabelModal
        isOpen={whiteLabelOpen}
        onClose={() => setWhiteLabelOpen(false)}
        onOpenCheckout={() => handleOpenCheckout('growth')}
      />
    </>
  );
}
