'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  UserCheck,
  Plus,
  Minus,
  Stethoscope,
  Briefcase,
} from 'lucide-react';

export default function PricingPage() {
  const [audienceMode, setAudienceMode] = useState<'clinic' | 'agency'>('clinic');

  // Agency mode counter states
  const [soloCount, setSoloCount] = useState(4);
  const [clinicCount, setClinicCount] = useState(3);

  const soloRetail = 1497;
  const soloWholesale = 497;
  const soloProfit = soloRetail - soloWholesale; // $1,000
  const soloRetainer = 197;

  const clinicRetail = 2497;
  const clinicWholesale = 897;
  const clinicProfit = clinicRetail - clinicWholesale; // $1,600
  const clinicRetainer = 349;

  const totalRevenue = soloCount * soloRetail + clinicCount * clinicRetail;
  const totalWholesale = soloCount * soloWholesale + clinicCount * clinicWholesale;
  const totalNetProfit = soloCount * soloProfit + clinicCount * clinicProfit;
  const totalMonthlyMrr = soloCount * soloRetainer + clinicCount * clinicRetainer;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header Banner */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900 border border-teal-500/30 text-teal-300 text-xs font-bold shadow-md">
          <DollarSign className="w-4 h-4 text-teal-400" />
          CiteMed Pricing & Deployment Infrastructure
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Clear, Transparent Deployment for <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-sky-400">Clinics & Agencies</span>
        </h1>
        <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
          Select your organization type below to view direct practice packages or wholesale agency partner margins.
        </p>
      </div>

      {/* Target Audience Switcher */}
      <div className="max-w-xl mx-auto flex justify-center">
        <div className="p-1.5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-2 shadow-2xl w-full">
          <button
            type="button"
            onClick={() => setAudienceMode('clinic')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
              audienceMode === 'clinic'
                ? 'bg-gradient-to-r from-teal-500 to-sky-600 text-white shadow-lg shadow-teal-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            🏥 I Am a Medical Clinic / Doctor
          </button>

          <button
            type="button"
            onClick={() => setAudienceMode('agency')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
              audienceMode === 'agency'
                ? 'bg-gradient-to-r from-teal-500 to-sky-600 text-white shadow-lg shadow-teal-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            🏢 I Am a Marketing Agency
          </button>
        </div>
      </div>

      {/* VIEW 1: RETAIL MEDICAL CLINIC / DOCTOR PRICING */}
      {audienceMode === 'clinic' ? (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
          {/* Card 1: Solo Specialist Practice */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold">
                Solo Specialist Tier
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-white">Solo Specialist Practice</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Targeted for: Solo Plastic Surgeons, Dermatologists, Orthopedic Specialists, Dentists.
                </p>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black text-white">
                  $1,497 <span className="text-xs text-slate-400 font-normal">one-time (or $197/mo)</span>
                </div>
                <p className="text-xs text-emerald-400 font-bold">
                  Includes full GEO infrastructure setup & verification
                </p>
              </div>

              <div className="pt-2 space-y-3 border-t border-slate-800">
                <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wider block">
                  Included Technical Deliverables:
                </span>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>Verified <code className="text-teal-300 font-mono">Physician</code> Schema.org JSON-LD architecture</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>AHPRA / NPI registration & specialty qualification indexing</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>Direct <code className="text-teal-300 font-mono">/llms.txt</code> integration file for Perplexity, ChatGPT Search, and Siri</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>Google Business Profile (GBP) entity citation alignment</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>Google Rich Results test & validation pass</span>
                  </li>
                </ul>
              </div>
            </div>

            <Link
              href="/login"
              className="w-full py-4 bg-gradient-to-r from-teal-500 to-sky-600 hover:from-teal-400 hover:to-sky-500 text-white font-bold text-sm rounded-xl text-center block shadow-lg shadow-teal-500/20 transition-all mt-6"
            >
              Onboard Solo Practice
            </Link>
          </div>

          {/* Card 2: Multi-Doctor Medical Clinic */}
          <div className="bg-slate-900 border-2 border-teal-500 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative flex flex-col justify-between">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-teal-500 text-white text-[11px] font-black uppercase tracking-wider rounded-full shadow-lg">
              Recommended for Medical Clinics
            </div>

            <div className="space-y-4 pt-2">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold">
                Multi-Doctor Clinic Tier
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-white">Multi-Doctor Clinic & Center</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Targeted for: Multi-practitioner clinics, day surgeries, medical centers, dental groups.
                </p>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black text-teal-400">
                  $2,497 <span className="text-xs text-slate-400 font-normal">one-time (or $349/mo)</span>
                </div>
                <p className="text-xs text-emerald-400 font-bold">
                  Includes full practice ontology & multi-doctor graph
                </p>
              </div>

              <div className="pt-2 space-y-3 border-t border-slate-800">
                <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wider block">
                  Included Technical Deliverables:
                </span>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>Full <code className="text-teal-300 font-mono">MedicalClinic</code> @graph ontology with all doctor nodes connected</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>Department & clinical procedures taxonomy mapping</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>Dedicated practice <code className="text-teal-300 font-mono">/llms.txt</code> directory</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>Emergency triage directives & operating schedules</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>Cross-platform AI search citation syndication</span>
                  </li>
                </ul>
              </div>
            </div>

            <Link
              href="/login"
              className="w-full py-4 bg-gradient-to-r from-teal-500 to-sky-600 hover:from-teal-400 hover:to-sky-500 text-white font-bold text-sm rounded-xl text-center block shadow-lg shadow-teal-500/20 transition-all mt-6"
            >
              Onboard Medical Clinic
            </Link>
          </div>
        </div>
      ) : (
        /* VIEW 2: AGENCY WHOLESALE PARTNER & MARGIN CALCULATOR */
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-teal-400" /> Agency Wholesale Profit Ledger & Calculator
                </h2>
                <p className="text-xs text-slate-400">Use the profit counters to calculate client billing revenue and net agency margins.</p>
              </div>
            </div>

            {/* Counters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Solo Doctor Counter */}
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-teal-400" /> Solo Doctors ($497 Wholesale)
                  </span>
                </div>

                <div className="flex items-center justify-between bg-slate-900 border border-slate-700/80 p-2 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setSoloCount(Math.max(0, soloCount - 1))}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-black text-white px-4">{soloCount}</span>
                  <button
                    type="button"
                    onClick={() => setSoloCount(soloCount + 1)}
                    className="p-2 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-lg transition-colors shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-[11px] text-emerald-400 font-bold flex justify-between">
                  <span>Billed: $1,497 | Cost: $497</span>
                  <span className="text-emerald-300 font-extrabold">$1,000 Net Margin / doc</span>
                </div>
              </div>

              {/* Multi-Doctor Clinic Counter */}
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-sky-400" /> Clinics ($897 Wholesale)
                  </span>
                </div>

                <div className="flex items-center justify-between bg-slate-900 border border-slate-700/80 p-2 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setClinicCount(Math.max(0, clinicCount - 1))}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-black text-white px-4">{clinicCount}</span>
                  <button
                    type="button"
                    onClick={() => setClinicCount(clinicCount + 1)}
                    className="p-2 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-lg transition-colors shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-[11px] text-emerald-400 font-bold flex justify-between">
                  <span>Billed: $2,497 | Cost: $897</span>
                  <span className="text-emerald-300 font-extrabold">$1,600 Net Margin / clinic</span>
                </div>
              </div>
            </div>

            {/* Live Wholesale Profit Ledger Card */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-teal-950 via-slate-900 to-slate-950 border border-teal-500/30 rounded-3xl space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-400" />
                  <span className="text-sm font-extrabold text-white uppercase tracking-wider">
                    Live Wholesale Agency Profit Ledger
                  </span>
                </div>
                <span className="px-3.5 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black rounded-full">
                  Verified Margin Structure
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase">Client Billed Gross Revenue</span>
                  <div className="text-3xl font-black text-white">${totalRevenue.toLocaleString()}</div>
                </div>

                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase">CiteMed Wholesale Cost</span>
                  <div className="text-2xl font-bold text-slate-300">${totalWholesale.toLocaleString()}</div>
                </div>

                <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl space-y-1">
                  <span className="text-xs font-bold text-emerald-300 uppercase">Agency Net Profit</span>
                  <div className="text-3xl font-black text-emerald-400">${totalNetProfit.toLocaleString()}</div>
                </div>
              </div>

              <div className="pt-3 text-xs text-sky-300 font-bold flex items-center justify-between border-t border-slate-800">
                <span>Recurring Monthly Retainer MRR:</span>
                <span className="text-base font-black text-sky-400">${totalMonthlyMrr.toLocaleString()}/mo</span>
              </div>
            </div>

            <Link
              href="/white-label"
              className="w-full py-4 bg-gradient-to-r from-teal-500 to-sky-600 hover:from-teal-400 hover:to-sky-500 text-white font-bold text-sm rounded-xl text-center block shadow-lg shadow-teal-500/20 transition-all"
            >
              Access Agency Wholesale API & White-Label Suite
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
