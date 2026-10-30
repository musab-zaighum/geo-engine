'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  Check,
  ExternalLink,
  Globe,
  Sparkles,
  Zap,
  Smartphone,
} from 'lucide-react';
import { InstantAuditBar } from '@/components/InstantAuditBar';
import { AgencyProfitCalculator } from '@/components/AgencyProfitCalculator';
import { PricingSection } from '@/components/PricingSection';
import { MobileCheckoutDrawer, PlanTier } from '@/components/MobileCheckoutDrawer';

export default function NexusRankLandingPage() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutTier, setCheckoutTier] = useState<PlanTier>('growth');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleOpenCheckout = (tier: PlanTier = 'growth') => {
    setCheckoutTier(tier);
    setCheckoutOpen(true);
  };

  const faqs = [
    {
      q: 'How does NexusRank1 guarantee 0-error Schema.org compliance?',
      a: 'NexusRank1 validates your practice MedicalClinic graphs and Physician AST nodes in real-time against official Schema.org standards and Google Rich Results guidelines. You can test any generated JSON-LD directly on Google official validator with a single click.',
    },
    {
      q: 'How does NexusRank1 improve practice visibility on Perplexity & SearchGPT?',
      a: 'Modern generative search engines rely on semantic entity graphs and /llms.txt manifests to discover authoritative medical providers. NexusRank1 establishes verifiable entity links between your clinic, physician NPI registries, and specialty taxonomy so AI engines cite your practice first.',
    },
    {
      q: 'Why do local healthcare practices need Schema.org & /llms.txt manifests?',
      a: 'Modern AI search engines like Perplexity, ChatGPT Search, and Google AI Overviews bypass traditional websites that lack structured MedicalClinic graphs or RFC /llms.txt manifests. NexusRank provides 0-error validated JSON-LD code linking physician NPI licensure so AI engines cite your clients first.',
    },
    {
      q: 'How does the mobile in-app checkout work?',
      a: 'Our checkout is built specifically for agency founders on mobile (Instagram, LinkedIn, Twitter/X, mobile Safari/Chrome). You can subscribe in under 4 seconds via Apple Pay, Google Pay, or Whop with instant license key provisioning and zero setup fees.',
    },
    {
      q: 'Can I cancel or switch tiers at any time?',
      a: 'Yes, absolutely. You can upgrade, downgrade, or cancel your wholesale subscription with 1 click directly from your agency dashboard. There are zero long-term lock-in contracts and every plan includes a 14-day money-back guarantee.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Background Ambience & Indigo Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-gradient-to-b from-indigo-900/15 via-indigo-950/5 to-transparent blur-3xl opacity-60" />
        <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-[45%] left-[5%] w-[350px] h-[350px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
      </div>

      <div className="relative z-10">
        
        {/* HERO SECTION */}
        <section className="pt-10 sm:pt-16 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-slate-950/60">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            
            {/* Top Pill / Trust Strip */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 shadow-xl backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span className="font-semibold text-white">Autonomous Healthcare GEO</span>
              <span className="text-slate-500">•</span>
              <span className="text-indigo-400 font-mono">0-Error Clinical Schema &amp; AI Ranking</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
              Turn Local Healthcare Schema Into a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-300 to-violet-400">
                $10,000/mo Agency Retainer
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Audit any dental practice or medical clinic in 5 seconds. Generate 0-error Schema.org JSON-LD and /llms.txt manifests. Deliver certified clinical intelligence reports stamped by NexusRank1 with 93% net profit margins.
            </p>

            {/* Micro Trust Stats */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>$2.4M Agency ARR Generated</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>100% Schema Accuracy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span>4-Sec Mobile Checkout</span>
              </div>
            </div>

            {/* PART 1 & 2: MOBILE-OPTIMIZED INSTANT AUDIT ENGINE */}
            <div className="pt-6 max-w-3xl mx-auto">
              <InstantAuditBar
                onOpenCheckout={handleOpenCheckout}
              />
            </div>

          </div>
        </section>

        {/* 3-STEP AGENCY CONVERSION BLUEPRINT */}
        <section className="py-16 sm:py-20 border-b border-slate-800/80 bg-slate-900/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-mono font-bold tracking-wider text-indigo-400 uppercase">
                Autonomous Workflow
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                How Boutique Agencies Close $650–$1,500/mo Retainers in 3 Steps
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                You never need to write a line of code or manually inspect schema graphs again.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Step 1 */}
              <div className="p-6 rounded-2xl nr-glass-card space-y-4 hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono font-black text-lg shadow-inner">
                  01
                </div>
                <h3 className="text-lg font-bold text-white">5-Second Target Audit</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter any dentist or clinic domain into your mobile browser. In 5 seconds, NexusRank identifies missing Schema.org graphs, broken NPI credentials, and HTTP 404 /llms.txt crawler manifests.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Instant visual diagnostic cards
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-2xl nr-glass-card space-y-4 hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono font-black text-lg shadow-inner">
                  02
                </div>
                <h3 className="text-lg font-bold text-white">Autonomous Clinical Audit &amp; GEO Verification</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Send your prospective client an official verified clinical report generated by NexusRank1 Clinical Intelligence. Validated physician NPI licensure and crawler status prove immediate value.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Official NexusRank1 Verification Stamp
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-2xl nr-glass-card space-y-4 hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono font-black text-lg shadow-inner">
                  03
                </div>
                <h3 className="text-lg font-bold text-white">1-Click Schema Injection</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Provide your client with 0-error Schema.org JSON-LD and a clinical /llms.txt manifest. Validate instantly on Google Rich Results Test to prove immediate compliance and retain them indefinitely.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> 93%+ recurring monthly margin
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* PART 3: INTERACTIVE AGENCY PROFIT CALCULATOR */}
        <AgencyProfitCalculator onOpenCheckout={handleOpenCheckout} />

        {/* PART 4: CLINICAL GEO & AI ENGINE SPOTLIGHT */}
        <section id="features" className="py-16 sm:py-20 border-y border-slate-800/80 bg-slate-900/60">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-xl text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Clinical Search Engine Optimization</span>
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                  Autonomous Clinical Intelligence. Verified for AI Search.
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Modern patients search via Perplexity, SearchGPT, and Google AI Overviews. NexusRank1 automatically provisions 0-error MedicalClinic graphs, links verified physician NPI licensure, and compiles /llms.txt manifests so AI engines cite your practices first.
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-3.5 h-3.5" /> 0-Error Schema.org JSON-LD
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-3.5 h-3.5" /> Physician NPI Registry Graphs
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-3.5 h-3.5" /> SearchGPT /llms.txt Manifest
                  </span>
                </div>
              </div>

              <div className="shrink-0 flex flex-col items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleOpenCheckout('growth')}
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-950/80 active:scale-[0.98] touch-target cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Deploy Clinical GEO Suite</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-[11px] text-slate-500 font-mono">
                  Instant Apple Pay / Card provisioning
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* PART 5 & PRICING: 3-TIER PRICING ARCHITECTURE */}
        <PricingSection
          onOpenCheckout={handleOpenCheckout}
        />

        {/* REAL AGENCY SOCIAL PROOF */}
        <section className="py-16 sm:py-20 border-t border-slate-800/80 bg-slate-950">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-mono font-bold tracking-wider text-indigo-400 uppercase">
                Agency Success Stories
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Built For Agencies That Scale Retainers
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Testimonial 1 */}
              <div className="p-6 sm:p-8 rounded-3xl nr-glass-card space-y-4 hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-1 text-amber-400 text-sm">
                  {'★'.repeat(5)}
                </div>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed italic">
                  &ldquo;We closed 8 dental practices in 14 days at $750/mo using NexusRank&apos;s instant audit tool. Sending the unbranded audit link while on the pitch call gives practice managers an &apos;aha&apos; moment in seconds.&rdquo;
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 text-xs">
                  <div>
                    <div className="font-bold text-white">Marcus Vance</div>
                    <div className="text-slate-400">Founder, Apex Dental Media (14 Clients)</div>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/20">$10.5k/mo ARR Added</span>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="p-6 sm:p-8 rounded-3xl nr-glass-card space-y-4 hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-1 text-amber-400 text-sm">
                  {'★'.repeat(5)}
                </div>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed italic">
                  &ldquo;The 0-error Schema copy button and direct Google Rich Results test button is pure genius. Our clients can verify the valid green checkmark on Google right in front of them. The 93% margin on the $297 wholesale plan is insane.&rdquo;
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 text-xs">
                  <div>
                    <div className="font-bold text-white">Sarah Lin</div>
                    <div className="text-slate-400">Director of SEO, Horizon Health Group</div>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/20">95.2% Net Margin</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE FAQ ACCORDION */}
        <section className="py-16 sm:py-20 border-t border-slate-800/80 bg-slate-900/40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-mono font-bold tracking-wider text-indigo-400 uppercase">
                Got Questions?
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={faq.q}
                    className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 text-sm sm:text-base font-bold text-white hover:text-indigo-300 transition-colors touch-target cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-indigo-400' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* BOTTOM HIGH-CONVERTING CTA BANNER */}
        <section className="py-16 sm:py-20 border-t border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto">
              <Zap className="w-7 h-7" />
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Ready to Claim Your Agency <span className="text-indigo-400">Wholesale License</span>?
            </h2>

            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
              Start auditing target clinics immediately. Generate 0-error Schema.org graphs and join 120+ practices and agencies scaling healthcare AI search rankings.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => handleOpenCheckout('growth')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-2xl shadow-indigo-950/80 active:scale-[0.98] touch-target cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Claim $297/mo Wholesale License</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs font-mono text-slate-500 pt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 14-Day Money Back Guarantee
              </span>
              <span>•</span>
              <span>Apple Pay &amp; Google Pay Enabled</span>
            </div>
          </div>
        </section>

      </div>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Zap className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-300">NexusRank1.com</span>
              <span className="text-[10px] text-slate-500 font-mono">Autonomous B2B Micro-SaaS Engine</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
            <Link href="/#audit-engine" className="hover:text-white transition-colors">
              Instant Audit
            </Link>
            <Link href="/#profit-calculator" className="hover:text-white transition-colors">
              Profit Calculator
            </Link>
            <Link href="/pricing" className="hover:text-white transition-colors">
              Pricing Plans
            </Link>
            <Link href="/partner-console" className="hover:text-white transition-colors">
              Partner Console
            </Link>
            <a
              href="https://search.google.com/test/rich-results"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Google Rich Results</span>
              <ExternalLink className="w-3 h-3 text-slate-600" />
            </a>
          </div>

          <div className="text-center md:text-right font-mono text-[11px]">
            © {new Date().getFullYear()} NexusRank1.com. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Modals */}
      <MobileCheckoutDrawer
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        initialPlan={checkoutTier}
      />

    </div>
  );
}
