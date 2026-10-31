'use client';

import React, { useState } from 'react';
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
  Stethoscope,
  Activity,
  Award,
} from 'lucide-react';
import { PlanTier } from './MobileCheckoutDrawer';

interface PricingSectionProps {
  onOpenCheckout: (tier: PlanTier) => void;
}

export function PricingSection({ onOpenCheckout }: PricingSectionProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  // 20% discount on annual billing
  const prices = {
    starter: billingCycle === 'monthly' ? 199 : 159,
    growth: billingCycle === 'monthly' ? 349 : 279,
    scale: billingCycle === 'monthly' ? 699 : 559,
  };

  return (
    <section id="pricing" className="py-16 sm:py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold shadow-xl">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Direct Healthcare Practice GEO Defense</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Transparent Practice Pricing Built for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">
              Predictable Patient Acquisition
            </span>
          </h2>
          
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Choose the right GEO defense tier for your clinic. Ensure ChatGPT, Perplexity, and Google AI Overviews recommend your practice over local competitors for high-value procedures.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
              Monthly Billing
            </span>
            <button
              type="button"
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="relative w-12 h-6 bg-slate-800 rounded-full p-1 transition-colors border border-slate-700 cursor-pointer"
              aria-label="Toggle annual billing"
            >
              <div
                className={`w-4 h-4 rounded-full bg-emerald-400 transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-semibold ${billingCycle === 'annual' ? 'text-white' : 'text-slate-400'}`}>
                Annual Billing
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                Save 20%
              </span>
            </div>
          </div>
        </div>

        {/* 3-Tier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          
          {/* Tier 1: Solo Practice ($199 / mo) */}
          <div className="rounded-3xl nr-glass-card p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
                  Solo Practitioners
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  1 Location • 1 Doctor
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">Solo Practice</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Essential 24/7 AI search defense and citation monitoring for individual clinics.
                </p>
              </div>

              <div className="flex items-baseline gap-1 pt-2">
                <span className="text-4xl sm:text-5xl font-black text-white font-mono">${prices.starter}</span>
                <span className="text-slate-400 text-sm font-medium">/ month</span>
                {billingCycle === 'annual' && (
                  <span className="text-[11px] text-slate-500 font-mono ml-1">billed annually</span>
                )}
              </div>

              {/* Features List */}
              <ul className="space-y-3 pt-4 border-t border-slate-800 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>1 Clinical Facility &amp; 1 Lead Physician</strong></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>24/7 AI Citation Monitoring</strong> across ChatGPT, Perplexity &amp; Google AI</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>0-Error W3C Schema.org</strong> MedicalClinic &amp; Physician JSON-LD AST</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Official /llms.txt</strong> Machine-Readable Clinical Manifest</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Weekly Local Competitor</strong> Displacement &amp; Steal Alerts</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>No-Code CMS Installation Guide (WordPress, Webflow, Squarespace)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Verified Federal NPI Registry &amp; State Licensure Badging</span>
                </li>
                <li className="flex items-start gap-2.5 text-slate-500">
                  <Lock className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  <span>Real-Time Competitor Radar (Growth+)</span>
                </li>
              </ul>
            </div>

            <div>
              <button
                type="button"
                onClick={() => onOpenCheckout('starter')}
                className="w-full h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all touch-target cursor-pointer"
              >
                <span>Select Solo Practice (${prices.starter})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <div className="mt-2 text-center text-[10px] text-slate-500 font-mono">
                14-day money-back guarantee • Instant setup
              </div>
            </div>
          </div>

          {/* Tier 2: Growth Clinic ($349 / mo) - MOST POPULAR */}
          <div className="rounded-3xl bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-950 border-2 border-emerald-500 p-6 sm:p-8 flex flex-col justify-between space-y-6 relative shadow-2xl shadow-emerald-950/60 lg:-translate-y-2">
            {/* Most popular badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold text-[10px] sm:text-xs uppercase tracking-wider shadow-md">
              Most Popular • Highest Practice ROI
            </div>

            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
                  Growing Practices
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
                  1-3 Doctors • 1 Facility
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">Growth Clinic</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Complete clinical GEO dominance, automated CMS injection, and real-time competitor displacement radar.
                </p>
              </div>

              <div className="flex items-baseline gap-1 pt-2">
                <span className="text-4xl sm:text-5xl font-black text-white font-mono">${prices.growth}</span>
                <span className="text-slate-400 text-sm font-medium">/ month</span>
                {billingCycle === 'annual' && (
                  <span className="text-[11px] text-emerald-400 font-mono ml-1">billed annually</span>
                )}
              </div>

              {/* Features List */}
              <ul className="space-y-3 pt-4 border-t border-slate-800 text-xs text-slate-200">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Up to 3 Physicians &amp; 1 Clinical Facility</strong></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Everything in Solo Practice</strong> plus:</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Real-Time Competitor Steal Radar</strong> (Alerts when a local clinic out-cites you)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Automated 1-Click CMS Injection Guide</strong> (WordPress, Webflow, Squarespace, Shopify)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>High-Ticket Patient Lead Attribution</strong> &amp; Search Inquiry Tracking</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>RFC 9309 AI Bot Crawler Defense</strong> (Unblocks GPTBot, PerplexityBot, ClaudeBot)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Priority 4-Hour Support</strong> &amp; Quarterly Clinical GEO Strategy Review</span>
                </li>
              </ul>
            </div>

            <div>
              <button
                type="button"
                onClick={() => onOpenCheckout('growth')}
                className="w-full h-13 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-950/80 active:scale-[0.98] touch-target cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Protect Practice with Growth (${prices.growth})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="mt-2 text-center text-[10px] text-emerald-300 font-mono">
                14-day zero-risk guarantee • 4-sec instant checkout
              </div>
            </div>
          </div>

          {/* Tier 3: Surgical Group / Multi-Location ($699 / mo) */}
          <div className="rounded-3xl nr-glass-card p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
                  Multi-Location Groups
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                  Up to 5 Locations
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">Surgical Group</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Multi-facility cross-linked entity graphs, custom procedure ontologies, and dedicated account engineering.
                </p>
              </div>

              <div className="flex items-baseline gap-1 pt-2">
                <span className="text-4xl sm:text-5xl font-black text-white font-mono">${prices.scale}</span>
                <span className="text-slate-400 text-sm font-medium">/ month</span>
                {billingCycle === 'annual' && (
                  <span className="text-[11px] text-slate-500 font-mono ml-1">billed annually</span>
                )}
              </div>

              {/* Features List */}
              <ul className="space-y-3 pt-4 border-t border-slate-800 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Up to 5 Practice Locations &amp; 10 Physicians</strong></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Everything in Growth Clinic</strong> plus:</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Multi-Location Cross-Linked Entity Knowledge Graph</strong></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Custom Clinical Procedure Ontologies</strong> (Implants, Mohs, Surgery)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Dedicated Healthcare GEO Account Engineer</strong></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>HIPAA-Compliant Lead Webhooks</strong> (Dentrix, ModMed, Athena, Kareo)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>99.9% AI Indexing &amp; Crawler Uptime SLA</strong></span>
                </li>
              </ul>
            </div>

            <div>
              <button
                type="button"
                onClick={() => onOpenCheckout('scale')}
                className="w-full h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all touch-target cursor-pointer"
              >
                <span>Select Surgical Group (${prices.scale})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <div className="mt-2 text-center text-[10px] text-slate-500 font-mono">
                Multi-location onboarding &amp; dedicated support
              </div>
            </div>
          </div>

        </div>

        {/* Enterprise Healthcare Compliance Strip */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Guaranteed 0-Error Clinical Schema.org Compliance</h4>
              <p className="text-xs text-slate-400">All practice graphs pass official Google Rich Results, Schema.org, and CMS NPPES federal registry standards with 100% precision.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenCheckout('growth')}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors touch-target shrink-0 cursor-pointer"
          >
            <span>Protect My Practice</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
}
