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
import { ZipCodeAuditIntake } from '@/components/ZipCodeAuditIntake';
import { CLINIC_OFFER_CONFIG } from '@/lib/config';

export default function NexusRankLandingPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const clinicFaqs = [
    {
      q: 'How does NexusRank1 ensure compliance with State Medical & Dental Board advertising regulations?',
      a: 'We adhere strictly to AMA, ADA, and state medical board advertising regulations. Our systems syndicate only verified factual provider credentials from the CMS NPPES NPI Registry, state licensure boards, and accredited procedure classifications (CPT/CDT). We strictly avoid deceptive outcome claims or prohibited fee inducements, keeping your practice in 100% regulatory good standing.',
    },
    {
      q: 'Is our practice data and patient privacy safe under HIPAA regulations?',
      a: '100% HIPAA compliant with Zero-PHI architecture. NexusRank1 never touches, accesses, or processes Protected Health Information (PHI). We do not integrate with your EHR, practice management database, or patient charts. Our system operates entirely on public, authoritative clinical credentials, W3C Schema.org entity graphs, and /llms.txt manifest protocols.',
    },
    {
      q: 'How fast is deployment and does our front-desk or webmaster have to do any work?',
      a: '100% Done-For-You within 48 hours. Our clinical deployment engineers handle all technical integration directly with your webmaster (WordPress, Webflow, Squarespace, Shopify, or custom stack). Zero coding or technical burden is placed on doctors or clinic staff, and your complete zip code defense is live within 48 hours.',
    },
    {
      q: 'How does Strict Zip Code Exclusivity work for elective clinics?',
      a: 'To guarantee dominant AI search positioning and eliminate conflicts of interest, NexusRank1 enforces strict territory exclusivity. Once an elective surgeon, cosmetic dentist, or medical director reserves a zip code territory, we permanently lock out local rivals within that territory. We only partner with 1 practice per medical specialty per zip code.',
    },
    {
      q: 'What ROI can our clinic expect from high-ticket elective procedures?',
      a: 'Because full-arch implant cases produce $20,000 to $50,000 and surgical procedures produce $15,000 to $30,000+, securing just a single patient consultation through AI search covers the entire system deployment multiple times over with immediate positive ROI.',
    },
    {
      q: 'Will NexusRank1 interfere with our existing website, EHR, or booking system?',
      a: 'Not at all. NexusRank1 deploys clean, non-visual JSON-LD metadata and an RFC-compliant /llms.txt manifest. It integrates seamlessly with WordPress, Webflow, Squarespace, Shopify, and custom sites without touching your visual layout, booking widgets, or EHR patient records.',
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
              <span className="text-emerald-400 font-mono">CMS NPPES Licensure &amp; Schema.org Verified</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
              Ensure AI Search Recommends Your Clinic{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">
                Over Local Competitors
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              The complete, automated local growth &amp; AI audit system engineered exclusively for medical, dental, and aesthetic clinic owners. Dominate local search proximity on ChatGPT, Perplexity, and Google AI Overviews.
            </p>

            {/* Primary CTA Button & Free Scan Buttons in Hero */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="#audit-intake"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById('audit-intake');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                    const firstInput = el.querySelector('input') as HTMLInputElement | null;
                    firstInput?.focus();
                  }
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:via-teal-400 hover:to-indigo-500 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-2xl shadow-emerald-950/80 hover:shadow-emerald-900/90 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-center group"
              >
                <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                <span>Request Your Zip Code Audit</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#audit-bar"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-sm font-semibold border border-slate-800 transition-colors text-center cursor-pointer"
              >
                Run Free 5-Second Clinic Scan
              </a>
            </div>

            {/* Done-For-You Reassurance Badge */}
            <div className="text-xs text-emerald-400/90 font-mono bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl max-w-xl mx-auto flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Done-For-You: Deployed with your webmaster in under 48 hours. Zero coding required.</span>
            </div>

            {/* Micro Trust Stats */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Medical Board &amp; Google Verified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Direct CMS NPPES NPI-1 Licensure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span>1-Click Activation (WordPress, Webflow, Squarespace)</span>
              </div>
            </div>

            {/* INSTANT PRACTICE AUDIT BAR */}
            <div id="audit-bar" className="pt-6 max-w-3xl mx-auto">
              <InstantAuditBar />
            </div>

          </div>
        </section>

        {/* COMPETITOR PATIENT STEAL VISUALIZER */}
        <section className="py-16 sm:py-20 border-b border-slate-800/80 bg-slate-900/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-mono font-bold tracking-wider text-rose-400 uppercase flex items-center justify-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                The Silent Patient Bleed
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                What Happens When Nearby Patients Ask AI for Recommendations?
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                AI engines synthesize live neighborhood data before recommending a doctor. If your clinic lacks verified machine-readable credentials, your local rivals capture the consult.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Without NexusRank1 */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-rose-900/40 space-y-5 relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-rose-950/60">
                  <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Without NexusRank1
                  </span>
                  <span className="text-xs font-mono text-slate-500">Unprotected Clinic</span>
                </div>

                <div className="space-y-4 text-xs font-mono">
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                    <div className="text-slate-400 text-[11px]">Patient Prompt:</div>
                    <div className="text-slate-200 font-sans italic">
                      &ldquo;Best surgical implant clinic near me with board-certified doctors?&rdquo;
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/40 text-rose-200/90 space-y-2">
                    <div className="text-[11px] font-bold text-rose-400 flex items-center gap-1.5">
                      <span>ChatGPT &amp; Perplexity Output:</span>
                    </div>
                    <div className="text-slate-300 font-sans text-xs">
                      &ldquo;Based on local directory citations and reviews, I recommend <strong>Metro Implant Specialists</strong> (your local rival 1.2 miles away)...&rdquo;
                    </div>
                    <div className="text-[10px] text-rose-400 pt-1 border-t border-rose-900/40 flex items-center gap-1">
                      <span>Result: $25,000 Full-Arch Case Lost to Competitor</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2 pt-2">
                  <span>Cause: Missing /llms.txt manifest &amp; schema ambiguities</span>
                </div>
              </div>

              {/* With NexusRank1 */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-emerald-500/40 space-y-5 relative overflow-hidden shadow-xl shadow-emerald-950/20">
                <div className="flex items-center justify-between pb-4 border-b border-emerald-950/60">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    With NexusRank1 Clinical Defense
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">#1 AI Recommendation</span>
                </div>

                <div className="space-y-4 text-xs font-mono">
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                    <div className="text-slate-400 text-[11px]">Patient Prompt:</div>
                    <div className="text-slate-200 font-sans italic">
                      &ldquo;Best surgical implant clinic near me with board-certified doctors?&rdquo;
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/40 text-emerald-200 space-y-2">
                    <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>ChatGPT &amp; Perplexity Output:</span>
                    </div>
                    <div className="text-slate-200 font-sans text-xs">
                      &ldquo;The top verified clinical provider in your area is <strong>Your Practice</strong>. They feature verified CMS NPPES NPI credentials, board-certified surgeons, and 5-star patient satisfaction...&rdquo;
                    </div>
                    <div className="text-[10px] text-emerald-400 font-bold pt-1 border-t border-emerald-900/40 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Result: Direct High-Ticket Consultation Booked</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-2 pt-2">
                  <span>Engine: 0-Error MedicalClinic Graph + Proximity Radar</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 CORE DONE-FOR-YOU CLINICAL GROWTH PILLARS */}
        <section id="features" className="py-16 sm:py-20 border-b border-slate-800/80 bg-slate-950">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
                Done-For-You Practice Growth Infrastructure
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                The 4 Pillars of Clinic Local Growth &amp; AI Dominance
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Everything medical, dental, and aesthetic clinic owners need to dominate local search proximity and secure high-ticket elective procedure bookings.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Pillar 1: Geo-Visibility Grid Tracking */}
              <div className="p-6 rounded-2xl nr-glass-card space-y-4 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-inner">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Geo-Visibility Grid Tracking &amp; Zip Code Benchmarking</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Weekly mapping of your exact 5-mile radius to eliminate local blind spots and benchmark your visibility against top competing clinics in your zip code.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 pt-2 border-t border-slate-800/80">
                  <Check className="w-3.5 h-3.5" /> 5-Mile Proximity Radar
                </div>
              </div>

              {/* Pillar 2: 0-Error Schema ASTs */}
              <div className="p-6 rounded-2xl nr-glass-card space-y-4 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shadow-inner">
                    <FileCode2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">0-Error MedicalClinic Schema ASTs</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Enterprise technical code so AI engines recognize your clinical credentials and recommend your clinic first when nearby patients query high-ticket procedures.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-teal-400 flex items-center gap-1 pt-2 border-t border-slate-800/80">
                  <Check className="w-3.5 h-3.5" /> 100% Validated W3C Graph
                </div>
              </div>

              {/* Pillar 3: Automated Review Loops */}
              <div className="p-6 rounded-2xl nr-glass-card space-y-4 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-inner">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Automated Review Loops &amp; Front-Desk Engine</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Seamless capture of 5-star Google reviews from patients right at the clinic via automated front-desk SMS sequences and reception check-out QR codes.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-indigo-400 flex items-center gap-1 pt-2 border-t border-slate-800/80">
                  <Check className="w-3.5 h-3.5" /> Front-Desk SMS &amp; QR Engine
                </div>
              </div>

              {/* Pillar 4: Strict Zip Code Exclusivity */}
              <div className="p-6 rounded-2xl nr-glass-card space-y-4 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center shadow-inner">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Strict Zip Code Exclusivity</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Locking out your local rivals permanently with territory protection. We only partner with 1 practice per specialty per zip code to ensure monopoly positioning.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-violet-400 flex items-center gap-1 pt-2 border-t border-slate-800/80">
                  <Check className="w-3.5 h-3.5" /> 1 Practice Per Zip Code
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

        {/* SECTION 3: INTAKE FORM SECTION (CONTACT FOR AUDIT) */}
        <ZipCodeAuditIntake />

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
              Ready to Secure Your Clinic&apos;s <span className="text-emerald-400">Exclusive Zip Code Territory</span>?
            </h2>

            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
              Ensure ChatGPT, Perplexity, and Google AI Overviews cite your clinic first. Protect high-ticket procedure bookings with strict 1-clinic zip code exclusivity.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <a
                href="#audit-intake"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById('audit-intake');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                    const firstInput = el.querySelector('input') as HTMLInputElement | null;
                    firstInput?.focus();
                  }
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:via-teal-400 hover:to-indigo-500 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-2xl shadow-emerald-950/80 active:scale-[0.98] touch-target cursor-pointer group"
              >
                <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                <span>Request Your Zip Code Audit</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-slate-500 pt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Strict Zip Code Exclusivity
              </span>
              <span>•</span>
              <span>100% HIPAA Safe (Zero PHI)</span>
              <span>•</span>
              <span>CMS NPPES NPI Registry Verified</span>
              <span>•</span>
              <span>48-Hour Deployment</span>
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
            <Link href="/#audit-intake" className="hover:text-white transition-colors">
              Zip Code Audit
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
