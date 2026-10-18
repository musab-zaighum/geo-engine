'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Globe,
  ShieldCheck,
  Check,
  Sparkles,
  ArrowRight,
  Laptop,
  Smartphone,
  Lock,
  Copy,
  Building2,
  Server,
  Zap,
} from 'lucide-react';
import { WhiteLabelModal } from '@/components/WhiteLabelModal';
import { MobileCheckoutDrawer, PlanTier } from '@/components/MobileCheckoutDrawer';

export default function WhiteLabelPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutTier, setCheckoutTier] = useState<PlanTier>('growth');

  const handleOpenCheckout = (tier: PlanTier = 'growth') => {
    setCheckoutTier(tier);
    setCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          <Globe className="w-3.5 h-3.5" />
          <span>Strict White-Label &amp; Custom CNAME Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Your Brand. Your CNAME. <span className="text-indigo-400">Zero NexusRank Mentions</span>.
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Provide your local clients with unbranded audit portals and PDF exports under <code className="text-indigo-300 font-mono bg-slate-900 px-1 py-0.5 rounded">audit.youragency.com</code>. Strictly gated on Growth ($297/mo) &amp; Scale ($697/mo) tiers.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xl shadow-indigo-950/70 touch-target"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Launch Live CNAME Customizer</span>
          </button>
          <button
            type="button"
            onClick={() => handleOpenCheckout('growth')}
            className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors touch-target"
          >
            <span>Claim $297/mo Growth License</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3 Value Pillars */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Custom Subdomain CNAME</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Point your DNS CNAME to our high-availability edge proxy. Automated 256-bit SSL certificate issued and renewed automatically.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">100% Strict Debranding</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Zero vendor footprints. No NexusRank watermarks, back-links, or mentions on client reports, audit URLs, or PDF summaries.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Automated Weekly Monitoring</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Continuously monitors client Schema.org graphs and sends unbranded white-label alerts if a client website changes or breaks schema.
          </p>
        </div>
      </div>

      {/* DNS Configuration Guide Card */}
      <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-indigo-400">
          <Server className="w-5 h-5" />
          <h3 className="text-base font-bold text-white">Quick 60-Second DNS Setup</h3>
        </div>
        <p className="text-xs text-slate-400">
          Add the following CNAME record inside your DNS provider (Cloudflare, GoDaddy, Route53, Namecheap):
        </p>
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-slate-300">
          <div>
            <span className="text-slate-500">Type:</span> <span className="text-indigo-400 font-bold">CNAME</span> |{' '}
            <span className="text-slate-500">Host:</span> <span className="text-white font-bold">audit</span> |{' '}
            <span className="text-slate-500">Value:</span> <span className="text-emerald-400 font-bold">cname.nexusrank1.com</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
            Auto-SSL Active
          </span>
        </div>
      </div>

      {/* Modals */}
      <WhiteLabelModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onOpenCheckout={() => handleOpenCheckout('growth')}
      />

      <MobileCheckoutDrawer
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        initialPlan={checkoutTier}
      />
    </div>
  );
}
