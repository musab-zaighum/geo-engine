'use client';

import React from 'react';
import {
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  Globe,
  Lock,
  Building2,
  Users,
  MapPin,
  Check,
  Search,
  MessageSquare,
  FileCode2,
  Star,
  Activity,
  Award,
  DollarSign,
} from 'lucide-react';
import { CLINIC_OFFER_CONFIG } from '@/lib/config';

interface PricingSectionProps {
  onOpenCheckout?: (tier?: any) => void;
}

export function PricingSection({ onOpenCheckout }: PricingSectionProps) {
  return (
    <section id="pricing" className="py-16 sm:py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold shadow-xl">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>CLINIC-FOCUSED LOCAL GROWTH &amp; AI DEFENSE</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            The Complete Clinic Local Growth &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">
              AI Audit System
            </span>
          </h2>
          
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Everything medical, dental, and aesthetic clinic owners need to dominate local zip code search and ensure ChatGPT, Perplexity, and Google AI Overviews cite your practice over competitors.
          </p>
        </div>

        {/* Master Offer Card */}
        <div className="relative rounded-3xl nr-glass-card border border-emerald-500/40 p-6 sm:p-10 shadow-2xl overflow-hidden bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-slate-950">
          
          {/* Ambient Corner Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Offer Overview & Direct Whop CTA */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>ALL-IN-ONE CLINIC LICENSE</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Full Practice Deployment
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Permanent implementation of the 4 core clinical growth engines. Hosted directly on NexusRank1 with 0 monthly agency retainers.
                </p>
              </div>

              {/* Price Tag */}
              <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white font-mono tracking-tight">
                    {CLINIC_OFFER_CONFIG.priceFormatted}
                  </span>
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    One-Time Investment
                  </span>
                </div>
                <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>No monthly software fees • Complete system ownership</span>
                </div>
              </div>

              {/* Single High-Converting Whop CTA Button */}
              <div className="space-y-3">
                <a
                  href={CLINIC_OFFER_CONFIG.whopCheckoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:via-teal-400 hover:to-indigo-500 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-2xl shadow-emerald-950/80 hover:shadow-emerald-900/90 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-center group"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 shrink-0 group-hover:rotate-12 transition-transform" />
                  <span>{CLINIC_OFFER_CONFIG.ctaLabel}</span>
                  <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
                </a>

                <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Whop Verified Checkout
                  </span>
                  <span>•</span>
                  <span>Instant Access</span>
                  <span>•</span>
                  <span>HIPAA Safe</span>
                </div>
              </div>

              {/* The 1-Patient ROI Guarantee */}
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>{CLINIC_OFFER_CONFIG.guarantee.title}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {CLINIC_OFFER_CONFIG.guarantee.description}
                </p>
              </div>

            </div>

            {/* Right Column: The 4 Core Pillars Breakdown */}
            <div className="lg:col-span-7 space-y-4">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>The 4 Pillars of Clinic Local Growth &amp; AI Dominance</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CLINIC_OFFER_CONFIG.pillars.map((pillar, idx) => {
                  const icons = [
                    <MapPin key="1" className="w-5 h-5 text-emerald-400" />,
                    <Search key="2" className="w-5 h-5 text-teal-400" />,
                    <MessageSquare key="3" className="w-5 h-5 text-indigo-400" />,
                    <FileCode2 key="4" className="w-5 h-5 text-violet-400" />,
                  ];

                  return (
                    <div
                      key={pillar.id}
                      className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 transition-colors space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                            {icons[idx]}
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 font-bold">
                            {pillar.badge}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-white leading-snug">
                          {pillar.title}
                        </h4>

                        <p className="text-xs text-slate-400 leading-relaxed">
                          {pillar.description}
                        </p>
                      </div>

                      <ul className="space-y-1.5 pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 font-medium">
                        {pillar.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Practice Value Matrix: Why 1 Patient Covers Everything */}
        <div className="rounded-3xl nr-glass-card p-6 sm:p-8 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              The Math Behind the $1,500 Investment
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Compare the cost of the system against typical elective procedure revenues across clinical specialties:
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center font-mono">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Dental Implants</div>
              <div className="text-xl font-black text-emerald-400">$4,500</div>
              <div className="text-[10px] text-slate-500">300% ROI in 1 Patient</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Invisalign / Ortho</div>
              <div className="text-xl font-black text-emerald-400">$5,000</div>
              <div className="text-[10px] text-slate-500">333% ROI in 1 Patient</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Plastic Surgery</div>
              <div className="text-xl font-black text-emerald-400">$11,500</div>
              <div className="text-[10px] text-slate-500">766% ROI in 1 Patient</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">MedSpa Packages</div>
              <div className="text-xl font-black text-emerald-400">$2,800</div>
              <div className="text-[10px] text-slate-500">186% ROI in 1 Patient</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 col-span-2 md:col-span-1">
              <div className="text-xs text-slate-400">Orthopedic Consult</div>
              <div className="text-xl font-black text-emerald-400">$8,500</div>
              <div className="text-[10px] text-slate-500">566% ROI in 1 Patient</div>
            </div>
          </div>

          {/* Secondary CTA */}
          <div className="pt-2 text-center">
            <a
              href={CLINIC_OFFER_CONFIG.whopCheckoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-400 hover:text-emerald-300 text-xs sm:text-sm font-bold transition-all shadow-lg"
            >
              <span>Secure Your Clinic&apos;s Exclusive Zip Code Allocation</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
