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
  Sparkles,
  Zap,
  Smartphone,
  AlertTriangle,
  Stethoscope,
  Activity,
  Award,
  Lock,
  Search,
  MapPin,
  MessageSquare,
  FileCode2,
} from 'lucide-react';
import { InstantAuditBar } from '@/components/InstantAuditBar';
import { PatientRoiCalculator } from '@/components/PatientRoiCalculator';
import { PricingSection } from '@/components/PricingSection';
import { CLINIC_OFFER_CONFIG } from '@/lib/config';

export default function NexusRankLandingPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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
      q: 'What is Geo-Visibility Grid Tracking & Zip-Code Benchmarking?',
      a: 'Our autonomous probing engines map a 3x3 mile coordinate grid across your clinic neighborhood and benchmark your visibility against the top rival practices in your exact zip code. If ChatGPT or Perplexity recommends a local competitor instead of your clinic, you receive an immediate alert detailing the exact citation gap.',
    },
    {
      q: 'Is this compliant with HIPAA and Medical Board advertising regulations?',
      a: '100% compliant. We only syndicate public clinical credentials, NPI registrations, state medical board licenses, and accredited procedure descriptions. We never process protected health information (PHI) or private patient health records.',
    },
    {
      q: 'What is the "1 High-Ticket Patient" ROI Guarantee?',
      a: 'A single new patient case (dental implants, Invisalign, surgical consultation, medspa package) is worth $3,000 to $15,000+. Acquiring just 1 new patient through generative search completely pays for the entire $1,500 system immediately. If you do not acquire a verified patient consultation within 90 days, we issue a 100% full refund.',
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
              <span className="font-semibold text-white">Direct Healthcare Practice Growth</span>
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
              Over 42% of high-ticket dental, cosmetic, and surgical patients now consult AI search before scheduling consultations. NexusRank1 trains ChatGPT, Perplexity, and Google AI Overviews to recognize your surgical credentials and recommend your clinic first when nearby patients search.
            </p>

            {/* Direct Whop CTA & Free Scan Buttons in Hero */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={CLINIC_OFFER_CONFIG.whopCheckoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:via-teal-400 hover:to-indigo-500 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-2xl shadow-emerald-950/80 hover:shadow-emerald-900/90 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-center group"
              >
                <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                <span>{CLINIC_OFFER_CONFIG.ctaLabel}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#audit-bar"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-sm font-semibold border border-slate-800 transition-colors text-center"
              >
                Run Free 5-Second Clinic Scan
              </a>
            </div>

            {/* Done-For-You Reassurance Badge */}
            <div className="text-xs text-emerald-400/90 font-mono bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl max-w-xl mx-auto flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Done-For-You: We handle complete technical setup with your webmaster in under 24 hours. Zero coding required.</span>
            </div>

            {/* Micro Trust Stats */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Medical Board &amp; Google Verified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Direct CMS NPPES NPI-1 Verification</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span>1-Click Website Activation (WordPress, Webflow, Squarespace)</span>
              </div>
            </div>

            {/* INSTANT PRACTICE AUDIT BAR */}
            <div id="audit-bar" className="pt-6 max-w-3xl mx-auto">
              <InstantAuditBar />
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
                    &ldquo;I recommend <strong>Apex Implant Specialists</strong> because their clinical procedures and board certifications are structured on medical registries. <em>(Your practice was omitted because AI search engines found no verified procedure schema or active NPI graph.)</em>&rdquo;
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
                    &ldquo;The premier verified provider in Austin is <strong>[Your Practice Name]</strong>, led by <strong>Dr. [Lead Doctor], DDS</strong> (Verified Federal NPI #1928374650). They specialize in accredited All-on-4 bone grafting with verified surgical credentials and 140+ 5-star patient reviews.&rdquo;
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

        {/* 4 CORE PILLARS OF CLINICAL LOCAL GROWTH & AI DOMINANCE */}
        <section id="features" className="py-16 sm:py-20 border-b border-slate-800/80 bg-slate-950">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
                The $1,500 Complete Clinic Blueprint
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                The 4 Pillars of Clinic Local Growth &amp; AI Dominance
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Everything medical, dental, and aesthetic clinic owners need to dominate local zip code search and conversational AI citations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Pillar 1: Geo-Visibility Grid Tracking */}
              <div className="p-6 rounded-2xl nr-glass-card space-y-4 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-inner">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Geo-Visibility Grid Tracking</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Maps hyper-local neighborhood grids (3x3 and 5x5 mile radius) and pulls top competing clinics in your exact zip code to pinpoint where your practice is displaced.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 pt-2 border-t border-slate-800/80">
                  <Check className="w-3.5 h-3.5" /> Zip-Code Benchmarking
                </div>
              </div>

              {/* Pillar 2: Google Business Profile (GBP) & Citation Cleanup */}
              <div className="p-6 rounded-2xl nr-glass-card space-y-4 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shadow-inner">
                    <Search className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">GBP &amp; Citation Cleanup</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Audits primary and secondary medical categories, operating hours, and ensures strict Name-Address-Phone (NAP) consistency across 50+ health directories.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-teal-400 flex items-center gap-1 pt-2 border-t border-slate-800/80">
                  <Check className="w-3.5 h-3.5" /> 50+ Directory NAP Sync
                </div>
              </div>

              {/* Pillar 3: Automated Review Loops */}
              <div className="p-6 rounded-2xl nr-glass-card space-y-4 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-inner">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Automated Review Loops</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Front-desk automated text (SMS) and email review generation engine with reception QR codes and sentiment filtering that feeds fresh 5-star citations into AI engines.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-indigo-400 flex items-center gap-1 pt-2 border-t border-slate-800/80">
                  <Check className="w-3.5 h-3.5" /> Front-Desk SMS &amp; QR Engine
                </div>
              </div>

              {/* Pillar 4: AI Model Readability */}
              <div className="p-6 rounded-2xl nr-glass-card space-y-4 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center shadow-inner">
                    <FileCode2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Clinical AI Knowledge Graph</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Synthesizes your clinical credentials, accepted insurances, and surgical procedures into verified knowledge graphs structured specifically so AI search engines recommend your clinic.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-violet-400 flex items-center gap-1 pt-2 border-t border-slate-800/80">
                  <Check className="w-3.5 h-3.5" /> 0-Error Clinical Graph &amp; /llms.txt
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* HIGH-TICKET PATIENT ROI CALCULATOR */}
        <section className="py-16 sm:py-20 border-b border-slate-800/80 bg-slate-900/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <PatientRoiCalculator />
          </div>
        </section>

        {/* PRICING SECTION: THE $1,500 CLINIC SYSTEM */}
        <PricingSection />

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
            <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Ready to Secure Your Clinic&apos;s <span className="text-emerald-400">Local Growth &amp; AI Defense</span>?
            </h2>

            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
              Ensure ChatGPT, Perplexity, and Google AI Overviews cite your clinic first. Protect high-ticket procedure bookings with the 1-patient ROI guarantee.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <a
                href={CLINIC_OFFER_CONFIG.whopCheckoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:via-teal-400 hover:to-indigo-500 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-2xl shadow-emerald-950/80 active:scale-[0.98] touch-target cursor-pointer group"
              >
                <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                <span>{CLINIC_OFFER_CONFIG.ctaLabel}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs font-mono text-slate-500 pt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 1-Patient ROI Guarantee
              </span>
              <span>•</span>
              <span>Whop Verified Checkout</span>
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
              <span className="text-[10px] text-slate-500 font-mono">Autonomous Healthcare Local Growth &amp; GEO Defense Platform</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
            <Link href="/#audit-bar" className="hover:text-white transition-colors">
              Practice Audit
            </Link>
            <Link href="/#patient-roi-calculator" className="hover:text-white transition-colors">
              Patient ROI Modeler
            </Link>
            <Link href="/pricing" className="hover:text-white transition-colors">
              $1,500 System
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

    </div>
  );
}
