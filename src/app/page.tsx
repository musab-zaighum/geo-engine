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
  AlertTriangle,
  Stethoscope,
  Activity,
  Award,
  Lock,
  UserCheck,
  Search,
} from 'lucide-react';
import { InstantAuditBar } from '@/components/InstantAuditBar';
import { PatientRoiCalculator } from '@/components/PatientRoiCalculator';
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

  const clinicFaqs = [
    {
      q: 'Will NexusRank1 interfere with our existing website, EHR, or booking system?',
      a: 'Not at all. NexusRank1 deploys clean, non-visual JSON-LD metadata and an RFC-compliant /llms.txt manifest. It integrates seamlessly with WordPress, Webflow, Squarespace, Shopify, and custom sites without touching your visual layout, booking widgets, or EHR patient records.',
    },
    {
      q: 'How does NexusRank1 prevent AI hallucinations about our doctors or fees?',
      a: 'Generative AI search engines hallucinate when a clinic lacks unambiguous, machine-readable facts. NexusRank1 establishes authoritative W3C Schema.org entity graphs linked directly to the CMS NPPES NPI Registry, anchoring your accepted insurance plans, active physician credentials, and core procedures in strict verifiable data.',
    },
    {
      q: 'How fast will our clinic see improved citations in ChatGPT & Perplexity?',
      a: 'Modern generative search engines recrawl healthcare websites every 24 to 72 hours. Once our 0-error Schema.org MedicalClinic graph and /llms.txt manifest are live, practice citations typically reflect in generative search within 3 to 7 days.',
    },
    {
      q: 'What is a "Competitor Steal Alert" and how does it protect our clinic?',
      a: 'Our autonomous probing engines continuously simulate local patient queries (e.g., "best dental implant surgeon in Dallas" or "top medspa for Morpheus8 in Miami"). If ChatGPT or Perplexity recommends a local competitor instead of your clinic, you receive an immediate alert detailing why they outranked you, with a 1-click countermeasure.',
    },
    {
      q: 'Is this compliant with HIPAA and Medical Board advertising regulations?',
      a: '100% compliant. We only syndicate public clinical credentials, NPI registrations, state medical board licenses, and accredited procedure descriptions. We never process protected health information (PHI) or private patient health records.',
    },
    {
      q: 'What is the "1 High-Ticket Patient" ROI Guarantee?',
      a: 'If your practice does not receive at least 1 verified patient consultation inquiry driven by AI search within your first 90 days, we will refund 100% of your subscription fees AND keep your platform active for free until you do.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Background Ambience & Glowing Accents */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-gradient-to-b from-emerald-950/20 via-indigo-950/10 to-transparent blur-3xl opacity-70" />
        <div className="absolute top-[20%] right-[10%] w-[450px] h-[450px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-[45%] left-[5%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <div className="relative z-10">
        
        {/* HERO SECTION */}
        <section className="pt-10 sm:pt-16 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-slate-950/70">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            
            {/* Top Pill / Trust Strip */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 shadow-xl backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white">Direct Healthcare Practice GEO</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 font-mono">CMS NPPES &amp; Schema.org Verified</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
              When Patients Ask ChatGPT for the Best Clinic in Town...{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">
                Are They Finding You, Or Your Competitor?
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Over 42% of high-ticket dental, cosmetic, and surgical patients now consult AI search before scheduling consultations. NexusRank1 establishes verified clinical entity graphs, NPI credentials, and machine-readable manifests so ChatGPT, Perplexity, and Google AI Overviews recommend your practice first.
            </p>

            {/* Micro Trust Stats */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Schema.org Accuracy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Direct CMS NPPES Verification</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span>1-Click CMS Injection</span>
              </div>
            </div>

            {/* INSTANT PRACTICE AUDIT BAR */}
            <div className="pt-6 max-w-3xl mx-auto">
              <InstantAuditBar onOpenCheckout={handleOpenCheckout} />
            </div>

          </div>
        </section>

        {/* COMPETITOR PATIENT STEAL VISUALIZER (INTERACTIVE BEFORE/AFTER SIMULATION) */}
        <section className="py-16 sm:py-20 border-b border-slate-800/80 bg-slate-900/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
                The Generative Search Reality
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                See How AI Search Either Recommends You or Hands Patients to Your Competitors
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                When prospective patients ask conversational AI for treatment recommendations, there are no blue links or Google map packs. The AI engine picks the winner with verified structured clinical data.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              
              {/* Left Screen: WITHOUT NexusRank1 (Red Accent) */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-red-500/30 space-y-5 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span>Without Structured Clinical GEO</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-mono">
                    Patient Lost
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
                  <span className="text-slate-500 block text-[10px] uppercase">Patient Prompt on ChatGPT Search:</span>
                  <span className="text-white">&ldquo;Who is the top specialist for All-on-4 dental implants in Austin with verified credentials?&rdquo;</span>
                </div>

                <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20 text-xs text-slate-300 leading-relaxed space-y-3">
                  <div className="flex items-center gap-2 text-red-400 font-bold">
                    <span>❌ ChatGPT Recommends Your Rival Across Town:</span>
                  </div>
                  <p className="text-slate-300">
                    &ldquo;I recommend <strong>Apex Implant Specialists</strong> because their clinical procedures and board certifications are structured on medical registries. <em>(Your practice was omitted because AI crawlers found no machine-readable procedure schema or active NPI graph.)</em>&rdquo;
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Estimated Revenue Lost:</span>
                  <span className="text-red-400 font-bold font-mono">-$24,000 (Full Arch Case)</span>
                </div>
              </div>

              {/* Right Screen: WITH NexusRank1 (Emerald Accent) */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-emerald-950/30 via-slate-900 to-slate-950 border-2 border-emerald-500 space-y-5 shadow-2xl shadow-emerald-950/50 relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>With NexusRank1 Clinical Defense</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
                    Patient Booked
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
                  <span className="text-slate-500 block text-[10px] uppercase">Patient Prompt on ChatGPT Search:</span>
                  <span className="text-white">&ldquo;Who is the top specialist for All-on-4 dental implants in Austin with verified credentials?&rdquo;</span>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-slate-200 leading-relaxed space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <span>✅ ChatGPT Directly Cites YOUR Practice:</span>
                  </div>
                  <p className="text-slate-200">
                    &ldquo;The premier verified provider in Austin is <strong>[Your Practice Name]</strong>, led by <strong>Dr. [Lead Doctor], DDS</strong> (Verified Federal NPI #1928374650). They specialize in accredited All-on-4 bone grafting and have 100% verified clinical schema.&rdquo;
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Gross Practice Revenue Captured:</span>
                  <span className="text-emerald-400 font-bold font-mono">+$24,000 (Consult Scheduled)</span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 4 PILLARS OF CLINICAL PRACTICE GEO DEFENSE */}
        <section className="py-16 sm:py-20 border-b border-slate-800/80 bg-slate-950">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
                Autonomous Defense Suite
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                The 4 Pillars of Generative Engine Optimization
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Everything required to establish undeniable authority across ChatGPT, Perplexity, Claude, and Google AI.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Pillar 1 */}
              <div className="p-6 rounded-2xl nr-glass-card space-y-4 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-black text-lg shadow-inner">
                  01
                </div>
                <h3 className="text-base font-bold text-white">24/7 AI Citation Monitoring</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Continuous synthetic probing across ChatGPT Search, Perplexity Pro, Google AI Overviews, and Apple Intelligence tracks your practice&apos;s live share of voice.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Real-time visibility scores
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="p-6 rounded-2xl nr-glass-card space-y-4 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-black text-lg shadow-inner">
                  02
                </div>
                <h3 className="text-base font-bold text-white">0-Error Medical Schema &amp; /llms.txt</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Generates W3C-compliant Schema.org MedicalClinic graphs and machine-readable /llms.txt manifests so AI crawlers parse your accepted insurances, hours, and treatments.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> 100% Google Rich Results green
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="p-6 rounded-2xl nr-glass-card space-y-4 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-black text-lg shadow-inner">
                  03
                </div>
                <h3 className="text-base font-bold text-white">Competitor Steal Alerts™</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Instant SMS &amp; email alerts trigger whenever a local clinic out-cites you for high-ticket procedures, providing 1-click countermeasures to reclaim your patient recommendations.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Immediate loss prevention
                </div>
              </div>

              {/* Pillar 4 */}
              <div className="p-6 rounded-2xl nr-glass-card space-y-4 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-black text-lg shadow-inner">
                  04
                </div>
                <h3 className="text-base font-bold text-white">Verified NPI &amp; Medical Board Shield</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Synchronizes your official CMS NPPES National Provider Identifier and State Medical Board license directly into search graphs to eliminate dangerous AI hallucinations.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Official federal verification
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* HIGH-TICKET PATIENT ROI CALCULATOR */}
        <section className="py-16 sm:py-20 border-b border-slate-800/80 bg-slate-900/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <PatientRoiCalculator onOpenCheckout={handleOpenCheckout} />
          </div>
        </section>

        {/* PRICING SECTION: 3 DIRECT-TO-CLINIC TIERS */}
        <PricingSection onOpenCheckout={handleOpenCheckout} />

        {/* REAL CLINIC CASE STUDIES & SOCIAL PROOF */}
        <section className="py-16 sm:py-20 border-t border-slate-800/80 bg-slate-950">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
                Practice Success Proof
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Verified Outcomes from Leading Clinics
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Testimonial 1 */}
              <div className="p-6 sm:p-8 rounded-3xl nr-glass-card space-y-4 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-1 text-amber-400 text-sm">
                  {'★'.repeat(5)}
                </div>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed italic">
                  &ldquo;Within 2 weeks of deploying our /llms.txt manifest and 0-error DentalClinic schema, three new All-on-4 dental implant patients told us they discovered our clinic through Perplexity and ChatGPT Search. That alone added over $65,000 in scheduled treatment.&rdquo;
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 text-xs">
                  <div>
                    <div className="font-bold text-white">Dr. Tejas Patel, DDS</div>
                    <div className="text-slate-400">Austin Cosmetic Dentistry • Lead Clinical Director</div>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/20">+$65k Revenue Added</span>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="p-6 sm:p-8 rounded-3xl nr-glass-card space-y-4 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-1 text-amber-400 text-sm">
                  {'★'.repeat(5)}
                </div>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed italic">
                  &ldquo;Traditional SEO agencies charged us $4,500/month for blog posts that didn&apos;t move the needle on our surgical calendar. NexusRank1&apos;s competitor steal alert warned us when a rival surgeon was being cited for deep plane facelifts. We deployed the 1-click schema countermeasure and regained our top recommendation within 5 days.&rdquo;
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 text-xs">
                  <div>
                    <div className="font-bold text-white">Dr. Sarah Kensington, MD, FACS</div>
                    <div className="text-slate-400">Scottsdale Aesthetic Surgery Center</div>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/20">100% AI Share of Voice</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* INTERACTIVE FAQ ACCORDION */}
        <section className="py-16 sm:py-20 border-t border-slate-800/80 bg-slate-900/40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
                Got Questions?
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Frequently Asked Questions by Practice Owners
              </h2>
            </div>

            <div className="space-y-3">
              {clinicFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={faq.q}
                    className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 text-sm sm:text-base font-bold text-white hover:text-emerald-300 transition-colors touch-target cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-emerald-400' : ''
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
            <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Ready to Secure Your Clinic&apos;s <span className="text-emerald-400">AI Search Defense</span>?
            </h2>

            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
              Ensure ChatGPT, Perplexity, and Google AI Overviews cite your clinic first. Start with our 14-day zero-risk practice guarantee and protect high-ticket procedure bookings today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => handleOpenCheckout('growth')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-2xl shadow-emerald-950/80 active:scale-[0.98] touch-target cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Protect Practice for $349/mo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs font-mono text-slate-500 pt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 14-Day Money Back Guarantee
              </span>
              <span>•</span>
              <span>Apple Pay &amp; Google Pay Enabled</span>
              <span>•</span>
              <span>Zero IT Overhead</span>
            </div>
          </div>
        </section>

      </div>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-300">NexusRank1.com</span>
              <span className="text-[10px] text-slate-500 font-mono">Autonomous Healthcare GEO Defense Platform</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
            <Link href="/#audit-engine" className="hover:text-white transition-colors">
              Practice Audit
            </Link>
            <Link href="/#patient-roi-calculator" className="hover:text-white transition-colors">
              Patient ROI Modeler
            </Link>
            <Link href="/pricing" className="hover:text-white transition-colors">
              Pricing Plans
            </Link>
            <Link href="/partner-console" className="hover:text-white transition-colors">
              Clinic Command Center
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
