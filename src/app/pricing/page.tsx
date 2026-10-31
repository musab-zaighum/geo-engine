'use client';

import React from 'react';
import Link from 'next/link';
import {
  DollarSign,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
  Zap,
  Sparkles,
  MapPin,
  Search,
  MessageSquare,
  FileCode2,
  HelpCircle,
  Activity,
} from 'lucide-react';
import { PricingSection } from '@/components/PricingSection';
import { CLINIC_OFFER_CONFIG } from '@/lib/config';

export default function PricingPage() {
  const clinicFaqs = [
    {
      q: 'Why a flat $1,500 fee instead of an ongoing monthly agency retainer?',
      a: 'Traditional marketing agencies charge $1,500 to $3,500 EVERY month to manually fiddle with blog posts. We deploy an autonomous, permanent local growth and AI defense infrastructure once for $1,500, with zero ongoing retainer fees or software traps.',
    },
    {
      q: 'Will this interfere with our existing website or web developer?',
      a: 'Not at all. NexusRank1 deploys clean, non-visual JSON-LD metadata, Google Business Profile corrections, and an RFC-compliant /llms.txt manifest. It does not alter your visual layout, booking widgets, or analytics.',
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
      q: 'What is the 1-Patient ROI Guarantee?',
      a: 'Elective treatments (dental implants, Invisalign, surgical consultations, medspa treatments) average $3,000 to $15,000 in case production. If our system delivers just ONE single patient inquiry, your entire $1,500 investment is immediately paid for with 100% to 500%+ net profit.',
    },
    {
      q: 'How do we access the system after purchasing?',
      a: 'Immediately after completing your Whop checkout, you will receive your practice license key and instant access to your Clinic Command Center to activate Geo-Grid Tracking, GBP Cleanup, Review Loops, and AI Readability.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Header Banner */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold shadow-xl">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>The $1,500 Clinic-Focused Blueprint</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">
          Ensure AI Search Recommends Your Clinic{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">
            Over Local Competitors
          </span>
        </h1>
        
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          The complete, autonomous Local Growth &amp; AI Audit System engineered exclusively for medical, dental, and aesthetic clinic owners. Dominate local zip code queries on ChatGPT, Perplexity, and Google AI Overviews.
        </p>

        {/* Direct Whop CTA in Hero */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={CLINIC_OFFER_CONFIG.whopCheckoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm shadow-xl shadow-emerald-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span>{CLINIC_OFFER_CONFIG.ctaLabel}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          <Link
            href="/#audit-bar"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-sm font-semibold border border-slate-800 transition-colors text-center"
          >
            Run Free 5-Second Clinic Scan
          </Link>
        </div>
      </div>

      {/* Main $1,500 Master Offer Section with 4 Pillars */}
      <div className="max-w-6xl mx-auto">
        <PricingSection />
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
              <p className="text-xs text-slate-400 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        {/* Final CTA Strip */}
        <div className="p-6 sm:p-8 rounded-3xl nr-glass-card border border-emerald-500/30 text-center space-y-4 bg-gradient-to-r from-emerald-950/20 via-slate-950 to-indigo-950/20">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Ready to Lock In Your Clinic&apos;s AI Defense?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Join leading dental, aesthetic, and surgical clinics securing top citations in ChatGPT, Perplexity, and Google AI Overviews.
            </p>
          </div>
          <div>
            <a
              href={CLINIC_OFFER_CONFIG.whopCheckoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm shadow-xl shadow-emerald-950/70 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{CLINIC_OFFER_CONFIG.ctaLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
