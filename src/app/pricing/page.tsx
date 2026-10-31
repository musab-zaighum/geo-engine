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
  Stethoscope,
  Activity,
  HelpCircle,
} from 'lucide-react';
import { PricingSection } from '@/components/PricingSection';
import { PatientRoiCalculator } from '@/components/PatientRoiCalculator';
import { MobileCheckoutDrawer, PlanTier } from '@/components/MobileCheckoutDrawer';

export default function PricingPage() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutTier, setCheckoutTier] = useState<PlanTier>('growth');

  const handleOpenCheckout = (tier: PlanTier = 'growth') => {
    setCheckoutTier(tier);
    setCheckoutOpen(true);
  };

  const clinicFaqs = [
    {
      q: 'Will NexusRank1 interfere with our existing website or web developer?',
      a: 'Not at all. NexusRank1 deploys clean, non-visual JSON-LD metadata and an RFC-compliant /llms.txt manifest. It does not alter your visual website layout, booking widgets, or analytics in any way.',
    },
    {
      q: 'How fast do AI search engines (ChatGPT, Perplexity, Google) recognize the updates?',
      a: 'Most modern generative search engines recrawl healthcare websites every 24 to 72 hours. Once our 0-error Schema.org MedicalClinic graph and /llms.txt manifest are live, practice citations typically reflect in generative search within 3 to 7 days.',
    },
    {
      q: 'Is this compliant with HIPAA and Medical Board advertising rules?',
      a: '100% compliant. We only syndicate public clinical credentials, NPI registrations, state medical board licenses, and accredited procedure descriptions. We never process protected health information (PHI) or patient records.',
    },
    {
      q: 'Can we cancel our subscription if we fill our patient booking capacity?',
      a: 'Yes, anytime. There are zero multi-year lock-in contracts. You can pause, upgrade, or cancel with 1 click directly from your practice dashboard.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Header Banner */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold shadow-xl">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Direct Practice Protection &amp; Patient Acquisition</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">
          Ensure AI Search Recommends Your Clinic{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">
            Over Local Competitors
          </span>
        </h1>
        
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Automated Generative Engine Optimization (GEO) engineered for dental practices, cosmetic clinics, and medical specialists. Gain predictable new patient inquiries from ChatGPT, Perplexity, and Google AI Overviews.
        </p>
      </div>

      {/* 3-Tier Direct Practice Pricing Architecture */}
      <div className="max-w-6xl mx-auto">
        <PricingSection onOpenCheckout={handleOpenCheckout} />
      </div>

      {/* Embedded Practice Patient ROI Calculator */}
      <div className="max-w-6xl mx-auto border-t border-slate-800/80 pt-10">
        <PatientRoiCalculator onOpenCheckout={handleOpenCheckout} />
      </div>

      {/* Clinic FAQ Section */}
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Frequently Asked Questions by Practice Owners</span>
          </div>
          <h3 className="text-2xl font-bold text-white">Everything You Need to Know</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clinicFaqs.map((faq, idx) => (
            <div key={idx} className="p-6 rounded-2xl nr-glass-card border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-white flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Callout */}
      <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl nr-glass-card text-center space-y-4 shadow-2xl">
        <h3 className="text-xl font-bold text-white">Need multi-location enterprise onboarding or custom procedure taxonomies?</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Our clinical GEO engineering team assists with multi-facility entity cross-linking, custom CRM lead webhooks, and private crawler testing.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => handleOpenCheckout('growth')}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all touch-target cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Protect Practice for $349/mo</span>
          </button>
          <Link
            href="/#audit-engine"
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-colors touch-target"
          >
            Run Free Practice AI Diagnostic
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
