'use client';

import React, { useState } from 'react';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Coins,
  Percent,
} from 'lucide-react';

interface AgencyProfitCalculatorProps {
  onOpenCheckout?: (tier?: 'starter' | 'growth' | 'scale') => void;
}

export function AgencyProfitCalculator({ onOpenCheckout }: AgencyProfitCalculatorProps) {
  const [clientCount, setClientCount] = useState<number>(10);
  const [monthlyRetainer, setMonthlyRetainer] = useState<number>(650);

  // Financial calculations
  const wholesaleCost = 297; // Growth Tier Wholesale License ($297/mo)
  const grossMonthlyRevenue = clientCount * monthlyRetainer;
  const netMonthlyProfit = Math.max(0, grossMonthlyRevenue - wholesaleCost);
  const annualNetProfit = netMonthlyProfit * 12;
  const netMarginPercent = grossMonthlyRevenue > 0
    ? ((netMonthlyProfit / grossMonthlyRevenue) * 100).toFixed(1)
    : '0';

  return (
    <section id="profit-calculator" className="py-16 sm:py-20 relative">
      {/* Background glow & accents */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent pointer-events-none" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
            <Coins className="w-3.5 h-3.5 text-indigo-400" />
            <span>Interactive B2B Agency Unit Economics</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Calculate Your Agency <span className="text-indigo-400">93%+ Net Margin</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            See how boutique marketing agencies turn 5-minute healthcare schema audits into recurring monthly retainers without hiring a single technical engineer.
          </p>
        </div>

        {/* Calculator Main Grid Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 rounded-3xl nr-glass-card p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-2xl">
          
          {/* Left Column: Interactive Sliders */}
          <div className="lg:col-span-7 space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Slider 1: Number of Clients */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <label className="text-sm font-bold text-slate-200">
                      How many local clients do you manage?
                    </label>
                  </div>
                  <span className="text-lg font-black font-mono text-indigo-400 bg-indigo-950/80 border border-indigo-500/40 px-3.5 py-1 rounded-xl shadow-inner">
                    {clientCount} {clientCount === 1 ? 'Client' : 'Clients'}
                  </span>
                </div>
                
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={clientCount}
                  onChange={(e) => setClientCount(Number(e.target.value))}
                  className="w-full h-3 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-400 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 touch-target"
                />
                
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>1 Client</span>
                  <span className="text-indigo-400/80 font-bold">10 Clients (Typical)</span>
                  <span>25 Clients</span>
                  <span>50 Clients</span>
                </div>
              </div>

              {/* Slider 2: Retainer Price */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <label className="text-sm font-bold text-slate-200">
                      Monthly GEO Retainer per Client
                    </label>
                  </div>
                  <span className="text-lg font-black font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-3.5 py-1 rounded-xl shadow-inner">
                    ${monthlyRetainer} <span className="text-xs font-normal text-slate-400">/mo</span>
                  </span>
                </div>

                <input
                  type="range"
                  min="300"
                  max="1500"
                  step="50"
                  value={monthlyRetainer}
                  onChange={(e) => setMonthlyRetainer(Number(e.target.value))}
                  className="w-full h-3 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-400 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 touch-target"
                />

                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>$300/mo (Basic)</span>
                  <span className="text-emerald-400/80 font-bold">$650/mo (Standard Schema + /llms.txt)</span>
                  <span>$1,500/mo (Full GEO)</span>
                </div>
              </div>
            </div>

            {/* Micro Benchmark Indicators */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2.5 text-xs text-slate-300 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Total Client Revenue:</span>
                <span className="font-bold text-white font-mono text-sm">${grossMonthlyRevenue.toLocaleString()} / mo</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">NexusRank Growth Wholesale License:</span>
                <span className="font-bold text-rose-400 font-mono text-sm">-${wholesaleCost} / mo (Flat)</span>
              </div>
              <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-sm font-bold">
                <span className="text-indigo-300">Your Calculated Net Margin:</span>
                <span className="font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/40 shadow-sm">
                  {netMarginPercent}% Net
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Impact Output Display */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-xl space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Net Agency Profit
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold font-mono">
                  93%+ Margin
                </span>
              </div>

              {/* Big Monthly Number */}
              <div className="mt-3">
                <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                  ${netMonthlyProfit.toLocaleString()}
                  <span className="text-sm font-medium text-slate-400 ml-1">/ month</span>
                </div>
                <div className="text-sm font-semibold text-slate-400 mt-1">
                  or <span className="text-emerald-400 font-mono font-bold">${annualNetProfit.toLocaleString()}</span> annual run-rate profit
                </div>
              </div>
            </div>

            {/* Value checklist */}
            <div className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100 audits/month on Growth Tier</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Automated daily SearchGPT &amp; Perplexity re-indexing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified 0-error MedicalClinic Schema &amp; /llms.txt</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Automated weekly schema change monitoring</span>
              </div>
            </div>

            {/* Dynamic CTA Button */}
            <div>
              <button
                type="button"
                onClick={() => onOpenCheckout && onOpenCheckout('growth')}
                className="w-full h-13 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:via-indigo-500 hover:to-violet-500 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-950/60 active:scale-[0.98] touch-target cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Claim Your $297/mo Wholesale License</span>
                <ArrowRight className="w-4 h-4 text-indigo-200 shrink-0" />
              </button>
              <div className="mt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>4-Second Mobile Checkout via Apple Pay / Google Pay / Whop</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
