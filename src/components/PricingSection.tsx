'use client';

import React from 'react';
import {
  Check,
  CheckCircle2,
  X,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  Globe,
  Lock,
  Building2,
  Users,
  Smartphone,
} from 'lucide-react';
import { PlanTier } from './MobileCheckoutDrawer';

interface PricingSectionProps {
  onOpenCheckout: (tier: PlanTier) => void;
}

export function PricingSection({
  onOpenCheckout,
}: PricingSectionProps) {
  return (
    <section id="pricing" className="py-16 sm:py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>3-Tier Wholesale Agency Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Wholesale Pricing Built for <span className="text-indigo-400">Agency Margins</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Choose the right tier to automate your healthcare client audits. Upgrade, downgrade, or cancel anytime with zero friction.
          </p>
        </div>

        {/* 3-Tier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          
          {/* Tier 1: Starter Agency ($97 / mo) */}
          <div className="rounded-3xl nr-glass-card p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
                  Solo Marketers
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  Standard Queue
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">Starter Agency</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Perfect for boutique freelancers auditing and pitching local practices.
                </p>
              </div>

              <div className="flex items-baseline gap-1 pt-2">
                <span className="text-4xl sm:text-5xl font-black text-white font-mono">$97</span>
                <span className="text-slate-400 text-sm font-medium">/ month</span>
              </div>

              {/* Features List */}
              <ul className="space-y-3 pt-4 border-t border-slate-800 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>15 client audits</strong> per month</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>PDF audit reports with <strong>agency logo</strong></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Clinical JSON-LD &amp; /llms.txt generator</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Standard diagnostic scan queue</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Official NexusRank1 Verified Audit Badging</span>
                </li>
                <li className="flex items-start gap-2.5 text-slate-500">
                  <Lock className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  <span>Continuous 24/7 Schema Monitoring (Growth+)</span>
                </li>
              </ul>
            </div>

            <div>
              <button
                type="button"
                onClick={() => onOpenCheckout('starter')}
                className="w-full h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all touch-target cursor-pointer"
              >
                <span>Select Starter ($97)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <div className="mt-2 text-center text-[10px] text-slate-500 font-mono">
                Instant Apple Pay / Card checkout
              </div>
            </div>
          </div>

          {/* Tier 2: Growth Agency ($297 / mo) - MOST POPULAR */}
          <div className="rounded-3xl bg-gradient-to-b from-indigo-950/70 via-slate-900 to-slate-950 border-2 border-indigo-500 p-6 sm:p-8 flex flex-col justify-between space-y-6 relative shadow-2xl shadow-indigo-950/60 lg:-translate-y-2">
            {/* Most popular badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-extrabold text-[10px] sm:text-xs uppercase tracking-wider shadow-md">
              Most Popular • 93% Net Margin
            </div>

            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold tracking-wider text-indigo-400 uppercase">
                  Growing Agencies
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono font-bold">
                  Priority Scan Queue
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">Growth Agency</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Autonomous clinical search engine optimization for practices and agencies managing 5 to 25 clients.
                </p>
              </div>

              <div className="flex items-baseline gap-1 pt-2">
                <span className="text-4xl sm:text-5xl font-black text-white font-mono">$297</span>
                <span className="text-slate-400 text-sm font-medium">/ month</span>
              </div>

              {/* Features List */}
              <ul className="space-y-3 pt-4 border-t border-slate-800 text-xs text-slate-200">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>100 client audits</strong> per month</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span><strong>Automated Daily AI Re-indexing</strong> (SearchGPT, Perplexity &amp; Claude)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span><strong>Official Clinical Intelligence Stamping</strong> &amp; PDF certification</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Automated <strong>weekly schema change monitoring</strong></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Priority fast diagnostic scan queue</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Client proposal generator &amp; verified clinical PDF exporter</span>
                </li>
              </ul>
            </div>

            <div>
              <button
                type="button"
                onClick={() => onOpenCheckout('growth')}
                className="w-full h-13 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:via-indigo-500 hover:to-violet-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-950/80 active:scale-[0.98] touch-target cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Claim $297/mo Wholesale License</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="mt-2 text-center text-[10px] text-indigo-300 font-mono">
                14-day zero-risk guarantee • 4-sec mobile closure
              </div>
            </div>
          </div>

          {/* Tier 3: Scale / Enterprise ($697 / mo) */}
          <div className="rounded-3xl nr-glass-card p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-violet-500/40 hover:-translate-y-1 transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
                  Scale &amp; Multi-Location
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20 font-mono">
                  Full REST API
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">Scale / Enterprise</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Built for high-volume marketing agencies with large rosters and dev teams.
                </p>
              </div>

              <div className="flex items-baseline gap-1 pt-2">
                <span className="text-4xl sm:text-5xl font-black text-white font-mono">$697</span>
                <span className="text-slate-400 text-sm font-medium">/ month</span>
              </div>

              {/* Features List */}
              <ul className="space-y-3 pt-4 border-t border-slate-800 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Unlimited audits</strong> &amp; continuous checks</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Full REST API access</strong> &amp; webhooks</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Bulk CSV upload</strong> &amp; parallel scanning</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Unlimited team seats</strong> &amp; agency sub-accounts</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Dedicated high-throughput clinical worker nodes &amp; custom domain routing</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Dedicated priority engineer support &amp; SLA</span>
                </li>
              </ul>
            </div>

            <div>
              <button
                type="button"
                onClick={() => onOpenCheckout('scale')}
                className="w-full h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all touch-target cursor-pointer"
              >
                <span>Select Scale ($697)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <div className="mt-2 text-center text-[10px] text-slate-500 font-mono">
                Full API key delivered instantly
              </div>
            </div>
          </div>

        </div>

        {/* Enterprise Healthcare Compliance Strip */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Guaranteed 0-Error Schema.org &amp; /llms.txt Compliance</h4>
              <p className="text-xs text-slate-400">All generated graphs pass official Google Rich Results and schema.org validators with 100% precision.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenCheckout('growth')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors touch-target shrink-0 cursor-pointer"
          >
            <span>Get Started with Growth</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
}
