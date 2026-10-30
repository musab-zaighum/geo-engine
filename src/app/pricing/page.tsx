'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
  Zap,
  Sparkles,
  Lock,
  Globe,
  Coins,
} from 'lucide-react';
import { PricingSection } from '@/components/PricingSection';
import { AgencyProfitCalculator } from '@/components/AgencyProfitCalculator';
import { MobileCheckoutDrawer, PlanTier } from '@/components/MobileCheckoutDrawer';

export default function PricingPage() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutTier, setCheckoutTier] = useState<PlanTier>('growth');

  const handleOpenCheckout = (tier: PlanTier = 'growth') => {
    setCheckoutTier(tier);
    setCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Header Banner */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold shadow-xl">
          <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
          <span>NexusRank1 Wholesale Agency Infrastructure</span>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">
          Transparent Wholesale Pricing Built for <span className="text-indigo-400">93% Agency Margins</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Deploy 0-error healthcare schema audits and clinical /llms.txt manifests. Scale recurring patient rankings and agency retainers with zero technical overhead.
        </p>
      </div>

      {/* 3-Tier Pricing Architecture */}
      <div className="max-w-6xl mx-auto">
        <PricingSection
          onOpenCheckout={handleOpenCheckout}
        />
      </div>

      {/* Embedded Agency Profit Calculator */}
      <div className="max-w-6xl mx-auto border-t border-slate-800/80 pt-10">
        <AgencyProfitCalculator onOpenCheckout={handleOpenCheckout} />
      </div>

      {/* FAQ Callout */}
      <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl nr-glass-card text-center space-y-4 shadow-2xl">
        <h3 className="text-xl font-bold text-white">Have custom enterprise volume or multi-seat agency questions?</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Our partner engineering team assists with bulk CSV domain imports, custom CRM webhooks, and private routing.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => handleOpenCheckout('growth')}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all touch-target cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Claim $297/mo Growth License</span>
          </button>
          <Link
            href="/#audit-engine"
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-colors touch-target"
          >
            Run Instant Clinical Audit
          </Link>
        </div>
      </div>

      {/* Modals */}
      <MobileCheckoutDrawer
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        initialPlan={checkoutTier}
      />

    </div>
  );
}
