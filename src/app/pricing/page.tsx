'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
  UserCheck,
  Plus,
  Minus,
  Stethoscope,
  Briefcase,
  RefreshCw,
} from 'lucide-react';

export default function PricingPage() {
  const [mounted, setMounted] = useState(false);
  const [audienceMode, setAudienceMode] = useState<'clinic' | 'agency'>('clinic');

  // Agency mode counter states
  const [soloCount, setSoloCount] = useState(4);
  const [clinicCount, setClinicCount] = useState(3);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#0284C7]">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm font-semibold">Loading Pricing Matrix...</span>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header Banner */}
      <div className="max-w-4xl mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-2xs">
          <DollarSign className="w-3.5 h-3.5 text-blue-600" />
          <span>CiteMed Pricing &amp; Deployment Infrastructure</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Clear, Transparent Deployment for <span className="text-blue-600">Clinics &amp; Agencies</span>
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Select your organization type below to view direct practice packages or wholesale agency partner margins.
        </p>
      </div>

      {/* Target Audience Switcher */}
      <div className="max-w-md mx-auto flex justify-center">
        <div className="p-1 bg-white border border-slate-200 rounded-xl flex items-center gap-1 shadow-sm w-full">
          <button
            type="button"
            onClick={() => setAudienceMode('clinic')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              audienceMode === 'clinic'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Medical Clinic / Doctor</span>
          </button>

          <button
            type="button"
            onClick={() => setAudienceMode('agency')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              audienceMode === 'agency'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Marketing Agency</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: RETAIL MEDICAL CLINIC / DOCTOR PRICING */}
      {audienceMode === 'clinic' ? (
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Solo Specialist Practice */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                Solo Specialist Tier
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Solo Specialist Practice</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Targeted for: Solo Plastic Surgeons, Dermatologists, Orthopedic Specialists, Dentists.
                </p>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-extrabold text-slate-900">
                  $1,497 <span className="text-xs text-slate-500 font-normal">one-time (or $197/mo)</span>
                </div>
                <p className="text-xs text-emerald-600 font-semibold">
                  Includes full GEO infrastructure setup &amp; verification
                </p>
              </div>

              <div className="pt-3 space-y-3 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  Included Technical Deliverables:
                </span>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Verified <code className="text-blue-700 bg-slate-50 px-1 py-0.5 rounded font-mono">Physician</code> Schema.org JSON-LD architecture</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>AHPRA / NPI registration &amp; specialty qualification indexing</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Direct <code className="text-blue-700 bg-slate-50 px-1 py-0.5 rounded font-mono">/llms.txt</code> integration file for Perplexity &amp; ChatGPT Search</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Google Business Profile (GBP) entity citation alignment</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Google Rich Results test &amp; validation pass</span>
                  </li>
                </ul>
              </div>
            </div>

            <Link
              href="/login"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl text-center block shadow-sm transition-all active:scale-[0.98] mt-6"
            >
              Onboard Solo Practice
            </Link>
          </div>

          {/* Card 2: Multi-Doctor Medical Clinic */}
          <div className="bg-white border-2 border-blue-600 rounded-2xl p-6 sm:p-8 space-y-6 shadow-md relative flex flex-col justify-between">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider rounded-full shadow-sm">
              Recommended for Medical Clinics
            </div>

            <div className="space-y-4 pt-1">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                Multi-Doctor Clinic Tier
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Multi-Doctor Clinic &amp; Center</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Targeted for: Multi-practitioner clinics, day surgeries, medical centers, dental groups.
                </p>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-extrabold text-blue-600">
                  $2,497 <span className="text-xs text-slate-500 font-normal">one-time (or $349/mo)</span>
                </div>
                <p className="text-xs text-emerald-600 font-semibold">
                  Includes full practice ontology &amp; multi-doctor graph
                </p>
              </div>

              <div className="pt-3 space-y-3 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  Included Technical Deliverables:
                </span>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Full <code className="text-blue-700 bg-slate-50 px-1 py-0.5 rounded font-mono">MedicalClinic</code> @graph ontology with all doctor nodes connected</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Department &amp; clinical procedures taxonomy mapping</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Dedicated practice <code className="text-blue-700 bg-slate-50 px-1 py-0.5 rounded font-mono">/llms.txt</code> directory</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Emergency triage directives &amp; operating schedules</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Cross-platform AI search citation syndication</span>
                  </li>
                </ul>
              </div>
            </div>

            <Link
              href="/login"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl text-center block shadow-sm transition-all active:scale-[0.98] mt-6"
            >
              Onboard Medical Clinic
            </Link>
          </div>
        </div>
      ) : (
        /* VIEW 2: AGENCY WHOLESALE PARTNER & MARGIN CALCULATOR */
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span>Agency Wholesale Profit Ledger &amp; Calculator</span>
                </h2>
                <p className="text-xs text-slate-500">Calculate client billing revenue and net agency margins.</p>
              </div>
            </div>

            {/* Counters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Solo Doctor Counter */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-blue-600" /> Solo Doctors ($497 Wholesale)
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white border border-slate-200 p-2 rounded-lg shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setSoloCount(Math.max(0, soloCount - 1))}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-bold text-slate-900 px-4">{soloCount}</span>
                  <button
                    type="button"
                    onClick={() => setSoloCount(soloCount + 1)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition-colors shadow-2xs"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-slate-500 space-y-1 pt-1">
                  <div className="flex justify-between">
                    <span>Retail ($1,497 ea):</span>
                    <span className="font-semibold text-slate-800">${(soloCount * soloRetail).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wholesale Cost ($497 ea):</span>
                    <span className="font-semibold text-slate-500">-${(soloCount * soloWholesale).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Agency Net Profit:</span>
                    <span>+${(soloCount * soloProfit).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Clinic Counter */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-blue-600" /> Medical Clinics ($897 Wholesale)
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white border border-slate-200 p-2 rounded-lg shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setClinicCount(Math.max(0, clinicCount - 1))}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-bold text-slate-900 px-4">{clinicCount}</span>
                  <button
                    type="button"
                    onClick={() => setClinicCount(clinicCount + 1)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition-colors shadow-2xs"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-slate-500 space-y-1 pt-1">
                  <div className="flex justify-between">
                    <span>Retail ($2,497 ea):</span>
                    <span className="font-semibold text-slate-800">${(clinicCount * clinicRetail).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wholesale Cost ($897 ea):</span>
                    <span className="font-semibold text-slate-500">-${(clinicCount * clinicWholesale).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Agency Net Profit:</span>
                    <span>+${(clinicCount * clinicProfit).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-6 bg-slate-900 rounded-xl text-white space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-semibold text-slate-400">Total Client Invoicing</span>
                <span className="text-base font-bold text-white">${totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-semibold text-slate-400">CiteMed Wholesale Cost</span>
                <span className="text-base font-bold text-slate-400">-${totalWholesale.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-sm font-bold text-emerald-400">Agency Upfront Net Profit</span>
                <span className="text-2xl font-extrabold text-emerald-400">+${totalNetProfit.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-blue-400">Recurring Monthly Maintenance Retainer MRR</span>
                <span className="text-lg font-bold text-blue-400">+${totalMonthlyMrr.toLocaleString()}/mo</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Link
                href="/white-label"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl shadow-sm flex items-center gap-2 transition-all active:scale-[0.98]"
              >
                <span>Launch Agency White-Label Suite</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
