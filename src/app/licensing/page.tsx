'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Calculator,
  Building2,
  Users,
  Zap,
  RefreshCw,
  HelpCircle,
  CreditCard,
  Lock,
} from 'lucide-react';

export default function LicensingPage() {
  const [mounted, setMounted] = useState(false);

  // Interactive ROI Calculator States
  const [subAccountCount, setSubAccountCount] = useState<number>(10);
  const [clientBillingRate, setClientBillingRate] = useState<number>(499);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#0284C7]">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm font-semibold">Loading Licensing &amp; Unit Economics...</span>
        </div>
      </div>
    );
  }

  // P&L Unit Economics Math
  const wholesaleCost = 297;
  const grossMonthlyRevenue = subAccountCount * clientBillingRate;
  const netMonthlyProfit = Math.max(0, grossMonthlyRevenue - wholesaleCost);
  const profitMarginPercent = grossMonthlyRevenue > 0 ? Math.round((netMonthlyProfit / grossMonthlyRevenue) * 100) : 0;
  const annualProfit = netMonthlyProfit * 12;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 py-12 px-4 sm:px-6 lg:px-8 space-y-12 selection:bg-[#0284C7]/20 selection:text-[#0284C7]">
      {/* Header Banner */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-[#0284C7] text-xs font-semibold shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
          <span>Agency Licensing &amp; Wholesale Unit Economics</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Scale Your Agency to <span className="text-[#0284C7]">94%+ Net Margins</span>
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Compare practice direct pricing against wholesale agency sub-account licensing. Predict your recurring net revenue with our interactive P&amp;L calculator.
        </p>
      </div>

      {/* Tier Comparison Cards: Direct vs Wholesale */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tier 1: Practice Direct ($79/mo) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                Single Practice
              </span>
              <span className="text-xs font-semibold text-slate-500">Direct Retail</span>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Practice Direct License</h2>
              <p className="text-xs text-slate-500 mt-1">For single medical clinics managing internal GEO optimization.</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-slate-900">$79</span>
              <span className="text-xs text-slate-500 font-semibold">/ month</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />
                <span>1 Active Medical Domain Endpoint</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />
                <span>Schema.org MedicalClinic &amp; Physician JSON-LD</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />
                <span>Edge Hosted /llms.txt File</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px]">&times;</span>
                <span>No White-Label CNAME or Custom Branding</span>
              </li>
            </ul>
          </div>

          <Link
            href="/signup?plan=direct"
            className="w-full py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold text-center transition-all block"
          >
            Get Practice Direct ($79/mo)
          </Link>
        </div>

        {/* Tier 2: Agency Wholesale ($297/mo) */}
        <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-8 space-y-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 bg-[#0284C7] text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider">
            Most Popular for Agencies
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0284C7]/20 text-[#38BDF8] border border-[#0284C7]/40">
                Unlimited Sub-Accounts
              </span>
              <span className="text-xs font-semibold text-emerald-400">94% Profit Margin</span>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-white">Agency Wholesale Partner</h2>
              <p className="text-xs text-slate-400 mt-1">Flat wholesale rate for marketing agencies, consultants, and MSPs.</p>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white">$297</span>
              <span className="text-xs text-slate-400 font-semibold">/ month flat</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0" />
                <span className="font-bold text-white">100% Debranded Client Portals</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0" />
                <span>Custom CNAME Domain Setup (audit.youragency.com)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0" />
                <span>Unlimited Client Medical Practice Sub-Accounts</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0" />
                <span>Client Shareable Unbranded PDF &amp; Web Reports</span>
              </li>
            </ul>
          </div>

          <Link
            href="/signup?plan=agency"
            className="w-full py-3 rounded-xl bg-[#0284C7] hover:bg-[#0369a1] text-white text-xs font-bold text-center shadow-lg transition-all block active:scale-95"
          >
            Claim Agency Wholesale License ($297/mo)
          </Link>
        </div>
      </div>

      {/* Interactive ROI & Profit Calculator Widget */}
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#0284C7]" />
              <span>Interactive Agency P&amp;L &amp; Unit Economics Calculator</span>
            </h2>
            <p className="text-xs text-slate-500">Calculate net recurring monthly profit based on wholesale agency margins.</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            {profitMarginPercent}% Net Margin
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            {/* Control 1: Sub-Account Count */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>Client Practice Sub-Accounts</span>
                <span className="text-[#0284C7] font-mono text-sm">{subAccountCount} Clinics</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={subAccountCount}
                onChange={(e) => setSubAccountCount(parseInt(e.target.value) || 1)}
                className="w-full accent-[#0284C7] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1 Clinic</span>
                <span>25 Clinics</span>
                <span>50 Clinics</span>
              </div>
            </div>

            {/* Control 2: Client Billing Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>Monthly Price Billed Per Clinic</span>
                <span className="text-[#0284C7] font-mono text-sm">${clientBillingRate}/mo</span>
              </div>
              <input
                type="range"
                min="199"
                max="999"
                step="50"
                value={clientBillingRate}
                onChange={(e) => setClientBillingRate(parseInt(e.target.value) || 199)}
                className="w-full accent-[#0284C7] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>$199/mo</span>
                <span>$499/mo</span>
                <span>$999/mo</span>
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Monthly Financial Breakdown
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Gross Client Revenue ({subAccountCount} &times; ${clientBillingRate}):</span>
                  <span className="font-bold text-white text-sm">${grossMonthlyRevenue.toLocaleString()}/mo</span>
                </div>

                <div className="flex justify-between items-center text-slate-400">
                  <span>AI NEXUS Wholesale Cost:</span>
                  <span className="text-rose-400">-${wholesaleCost}/mo</span>
                </div>

                <div className="border-t border-slate-800 pt-3 flex justify-between items-baseline">
                  <span className="text-xs font-sans font-bold text-slate-200">Net Monthly Profit:</span>
                  <span className="text-2xl font-black text-emerald-400">${netMonthlyProfit.toLocaleString()}/mo</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Annualized Profit: <strong className="text-white">${annualProfit.toLocaleString()}/yr</strong></span>
              <span className="text-[#38BDF8] font-bold">94% Margin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
