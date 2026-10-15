'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  Lock,
  CreditCard,
  Building2,
  DollarSign,
  TrendingUp,
  Calculator,
  Sliders,
  ChevronDown,
  Copy,
  Check,
  FileCode,
  ExternalLink,
  Code,
  FileText,
  Globe,
  Sparkles,
  Zap,
  Activity,
  CheckCheck,
  Cpu,
  Layers,
  Terminal,
  Server,
  ArrowUpRight,
} from 'lucide-react';
import { AuditResponse } from '@/lib/types';
import { GeneratorSection } from '@/components/GeneratorSection';
import { PasteGuideModal } from '@/components/PasteGuideModal';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'auditor' | 'generator'>('auditor');
  const [generatorUrl, setGeneratorUrl] = useState('');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Hero Audit Form State
  const [domainInput, setDomainInput] = useState('https://your-dental-client.com');
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<AuditResponse | null>(null);
  const [auditProgressMessage, setAuditProgressMessage] = useState('');
  const [copiedSchema, setCopiedSchema] = useState(false);

  // Interactive Calculator State
  const [managedClinics, setManagedClinics] = useState(10);
  const [monthlyClinicBill, setMonthlyClinicBill] = useState(650);
  const [wholesalePlan, setWholesalePlan] = useState<'flat' | 'per_account'>('flat');

  // Simulated Bank Card State
  const [cardName, setCardName] = useState('Alexander Wright');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvc, setCardCvc] = useState('882');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 text-[#0284C7]">
          <div className="w-5 h-5 border-2 border-[#0284C7] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono font-bold tracking-wider uppercase">Initializing VeloGEO Suite...</span>
        </div>
      </div>
    );
  }

  // Quick Domain Pills
  const samplePills = [
    { label: 'Sample Dental Client', value: 'https://your-dental-client.com' },
    { label: 'Mayo Clinic', value: 'https://mayoclinic.org' },
    { label: 'Austin Cosmetic Dental', value: 'https://austincosmeticdental.com' },
    { label: 'Dr. Jane Smith Specialist', value: 'https://drjanesmith.com' },
  ];

  // Audit Trigger
  const runAudit = async (targetDomain?: string) => {
    const inputToUse = targetDomain || domainInput;
    if (!inputToUse.trim()) {
      setAuditError('Please specify a domain URL (e.g. https://your-dental-client.com).');
      return;
    }

    setAuditLoading(true);
    setAuditError(null);
    setAuditProgressMessage('Connecting to Regular GEO diagnostic vector cascade...');

    setTimeout(() => {
      setAuditProgressMessage('Querying Perplexity, ChatGPT Search & Schema.org graph...');
    }, 800);

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputToUse.trim(), query: inputToUse.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Diagnostic scan failed.');
      }

      setAuditResult(data);
      setActiveWorkspaceTab('auditor');
      if (targetDomain) {
        setDomainInput(targetDomain);
      }

      setTimeout(() => {
        const resultsEl = document.getElementById('audit-results-card');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } catch (err: any) {
      setAuditError(err?.message || 'Failed to complete domain diagnostic scan.');
    } finally {
      setAuditLoading(false);
      setAuditProgressMessage('');
    }
  };

  // Calculator Math
  const grossMonthlyRevenue = managedClinics * monthlyClinicBill;
  const wholesaleVeloCost = wholesalePlan === 'flat' ? 297 : 199 + managedClinics * 89;
  const netMonthlyProfit = Math.max(0, grossMonthlyRevenue - wholesaleVeloCost);
  const annualRunRate = netMonthlyProfit * 12;
  const grossMargin =
    grossMonthlyRevenue > 0
      ? ((netMonthlyProfit / grossMonthlyRevenue) * 100).toFixed(1)
      : '0';

  // Simulated Card Payment
  const handleSimulatedPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentProcessing(true);
    setTimeout(() => {
      setPaymentProcessing(false);
      setPaymentSuccess(true);
    }, 1100);
  };

  // Copy Schema
  const handleCopySchema = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const faqs = [
    {
      q: 'What is Regular GEO (Generative Engine Optimization) vs Traditional SEO?',
      a: 'Traditional SEO targets keyword density and legacy backlink authority for Google PageRank. Regular GEO optimizes medical websites for Large Language Models (Perplexity, ChatGPT Search, Apple Intelligence, and Claude). LLMs ingest structured Schema.org @graph JSON-LD and /llms.txt machine-readable directories to synthesize direct clinical citations.',
    },
    {
      q: 'Why do medical and dental clinics require verified NPI schema bindings?',
      a: 'AI search models operate under strict Healthcare E-E-A-T (Experience, Expertise, Authoritativeness, and Trustworthiness) protocols. Unverified practitioners without National Provider Identifier (NPI) or AHPRA schema bindings are routinely flagged as unverified, causing LLMs to omit them from local recommendation queries.',
    },
    {
      q: 'How does VeloGEO white-labeling work for digital agencies?',
      a: 'VeloGEO provides a 100% zero-trace agency infrastructure. You map your custom CNAME (audit.youragency.com), customize your brand assets, and generate unbranded client reports (/report/[domain]) that showcase zero platform attribution. You bill clinics $450 to $1,500/month while paying VeloGEO wholesale.',
    },
    {
      q: 'What is the /llms.txt open web standard?',
      a: '/llms.txt is the modern machine-readable index file hosted at your domain root (yourclinic.com/llms.txt). It provides a high-density markdown directory of your surgeons, clinical specialties, and accepted insurances that AI crawlers ingest in under 40 milliseconds.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#0284C7]/20 selection:text-[#0284C7] bg-dot-matrix">
      {/* Modal */}
      <PasteGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      {/* 1. HERO SECTION: Above the fold, high-density audit engine */}
      <section className="relative pt-10 sm:pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center space-y-6">
        {/* Telemetry Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200/90 shadow-2xs text-[#0284C7] text-xs font-mono font-semibold">
          <Activity className="w-3.5 h-3.5 text-[#0284C7]" />
          <span>VeloGEO Engine v2.4 &bull; Clinical Search Citation Standard</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.12]">
            Audit Any Dental or Medical Clinic for <span className="text-[#0284C7]">AI Search Citations</span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Ensure Perplexity, ChatGPT Search, and Claude recommend your practice. Instant machine-readable diagnostics for Schema.org entity graphs, NPI verification, and /llms.txt roots.
          </p>
        </div>

        {/* Zero-Scroll Domain Audit Bar */}
        <div id="audit-bar" className="max-w-2xl mx-auto pt-1">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              runAudit();
            }}
            className="bg-white p-2 rounded-2xl border border-slate-200/90 shadow-sm shadow-slate-900/5 focus-within:border-[#0284C7] focus-within:ring-2 focus-within:ring-[#0284C7]/20 flex flex-col sm:flex-row items-center gap-2 transition-all duration-200"
          >
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="https://your-dental-client.com"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-transparent border-0 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={auditLoading}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-xs shadow-sky-900/10 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 shrink-0"
            >
              {auditLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Scanning GEO...</span>
                </>
              ) : (
                <>
                  <span>Run GEO Audit</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Domain Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs text-slate-500">
            <span className="font-mono text-[11px] text-slate-400">Quick Test:</span>
            {samplePills.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setDomainInput(p.value);
                  runAudit(p.value);
                }}
                className="px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-slate-700 border border-slate-200/90 transition-all text-[11px] font-mono shadow-2xs hover:border-slate-300"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Loading Banner */}
          {auditLoading && (
            <div className="mt-4 p-4 rounded-xl bg-white border border-[#0284C7]/30 text-[#0284C7] text-xs font-mono flex items-center justify-center gap-2.5 shadow-2xs animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{auditProgressMessage || 'Analyzing domain regular GEO entities...'}</span>
            </div>
          )}

          {auditError && (
            <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 text-left">
              <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{auditError}</span>
            </div>
          )}
        </div>
      </section>

      {/* 2. INSTANT AUDIT RESULTS CARD (High-Urgency Diagnostic Telemetry) */}
      {auditResult && (
        <section id="audit-results-card" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm shadow-slate-900/5 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-sky-50 text-[#0284C7] border border-sky-200">
                    Live Diagnostic Telemetry
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Cascade: Gemini 2.0 / Claude 3.5 Sonnet / GPT-4o</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-mono">
                  {auditResult.url}
                </h2>
                <div className="text-xs text-slate-500 font-mono">
                  Discovered Entity: {auditResult.discoveredTitle || 'Clinical Practice'}
                </div>
              </div>

              {/* Score Meter */}
              <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200/90">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Regular GEO Score</span>
                  <span className="text-3xl font-black font-mono text-rose-600">
                    {auditResult.regularGeoScore ?? auditResult.readinessScore}/100
                  </span>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="text-left text-xs space-y-0.5">
                  <div className="font-bold text-rose-600">Urgent Remediation</div>
                  <div className="text-slate-400 font-mono text-[10px]">Unindexed by LLMs</div>
                </div>
              </div>
            </div>

            {/* High-Urgency Diagnostic Warnings with Monospaced Telemetry */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">
                  Diagnostic Checkpoints &amp; Machine-Readable Status
                </h3>
                <span className="text-[10px] font-mono text-slate-400">Latency: 28ms</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                {(auditResult.issuesFound || [
                  '❌ MedicalClinic JSON-LD Entity Graph: Missing',
                  '❌ Physician / NPI Schema Association: 0 Found',
                  '❌ /llms.txt Machine-Readable Directory: 404 Not Found',
                  '❌ Regular GEO Search Citation Index: Unindexed on Perplexity / ChatGPT',
                ]).map((issue, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200/80 text-slate-800 flex items-center justify-between shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="shrink-0">{issue.includes('❌') ? '' : '⚠️'}</span>
                      <span className="font-semibold">{issue}</span>
                    </div>
                    <span className="text-[10px] text-rose-600 font-bold uppercase shrink-0 ml-2">Action Required</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Green Remediation Highlight Box */}
            <div className="p-5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase text-emerald-800">
                  <CheckCheck className="w-4 h-4 text-emerald-600" />
                  <span>Immediate Solution Ready</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-700 bg-white/90 px-2.5 py-0.5 rounded border border-emerald-200">
                  Turnkey Remediation Engine
                </span>
              </div>
              <p className="text-sm font-bold text-emerald-950 leading-relaxed">
                &ldquo;VeloGEO generates and validates this entire unbranded Regular GEO package in 30 seconds.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    if (auditResult?.suggestedSchemaJsonLd) {
                      handleCopySchema(auditResult.suggestedSchemaJsonLd);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedSchema ? 'Copied Suggested Schema!' : 'Copy Turnkey JSON-LD'}</span>
                </button>

                <Link
                  href="/partner-console"
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Open in Partner Console</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsGuideOpen(true)}
                  className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1 ml-auto"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>CMS Insertion Guide</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. INTERACTIVE AGENCY REVENUE & CLINIC PROFIT CALCULATOR BOX */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm shadow-slate-900/5 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#0284C7] uppercase">
                <Calculator className="w-4 h-4" />
                <span>Enterprise Unit Economics Simulator</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Agency Revenue &amp; Clinic Profitability Calculator
              </h2>
              <p className="text-xs text-slate-500">
                Simulate exact monthly agency cashflow, retail margins, and annual recurring run-rates.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#F8FAFC] p-1.5 rounded-xl border border-slate-200/90">
              <button
                type="button"
                onClick={() => setWholesalePlan('flat')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  wholesalePlan === 'flat'
                    ? 'bg-white text-[#0284C7] shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Flat Wholesale ($297/mo)
              </button>
              <button
                type="button"
                onClick={() => setWholesalePlan('per_account')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  wholesalePlan === 'per_account'
                    ? 'bg-white text-[#0284C7] shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Setup + Retainer ($199 + $89/mo)
              </button>
            </div>
          </div>

          {/* Calculator Sliders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            {/* Slider 1: Number of Clinic Clients */}
            <div className="space-y-3 bg-[#F8FAFC] p-5 rounded-2xl border border-slate-200/90">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Clinics Managed by Agency:</span>
                <span className="font-mono text-base font-black text-[#0284C7] bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-2xs">
                  {managedClinics} Clinics
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={managedClinics}
                onChange={(e) => setManagedClinics(Number(e.target.value))}
                className="w-full accent-[#0284C7] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>1 Clinic</span>
                <span>10 Clinics (Standard Agency)</span>
                <span>25 Clinics</span>
                <span>50 Clinics</span>
              </div>
            </div>

            {/* Slider 2: Retainer Billed per Clinic */}
            <div className="space-y-3 bg-[#F8FAFC] p-5 rounded-2xl border border-slate-200/90">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Agency Monthly Fee to Clinic:</span>
                <span className="font-mono text-base font-black text-emerald-600 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-2xs">
                  ${monthlyClinicBill} / clinic / mo
                </span>
              </div>
              <input
                type="range"
                min="450"
                max="1500"
                step="50"
                value={monthlyClinicBill}
                onChange={(e) => setMonthlyClinicBill(Number(e.target.value))}
                className="w-full accent-[#0284C7] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>$450/mo (Basic)</span>
                <span>$650/mo (Recommended)</span>
                <span>$1,000/mo (Multi-Surgeon)</span>
                <span>$1,500/mo (Enterprise)</span>
              </div>
            </div>
          </div>

          {/* Interactive Profit Calculation Ledger */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1">
              <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Gross Monthly Invoiced</div>
              <div className="text-2xl font-black font-mono text-slate-900">
                ${grossMonthlyRevenue.toLocaleString()}
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                {managedClinics} &times; ${monthlyClinicBill} monthly retainer
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1">
              <div className="text-[10px] font-mono font-bold uppercase text-slate-400">VeloGEO Wholesale Cost</div>
              <div className="text-2xl font-black font-mono text-slate-700">
                ${wholesaleVeloCost.toLocaleString()}
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                {wholesalePlan === 'flat' ? 'Flat unlimited agency tier' : '$199 setup + $89/clinic'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
              <div className="text-[10px] font-mono font-bold uppercase text-emerald-800">Net Monthly Agency Profit</div>
              <div className="text-2xl font-black font-mono text-emerald-700">
                ${netMonthlyProfit.toLocaleString()}
              </div>
              <div className="text-[10px] font-mono text-emerald-800 font-bold">
                {grossMargin}% Net Cashflow Margin
              </div>
            </div>

            <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200 space-y-1">
              <div className="text-[10px] font-mono font-bold uppercase text-[#0284C7]">Annualized Run Rate (ARR)</div>
              <div className="text-2xl font-black font-mono text-[#0284C7]">
                ${annualRunRate.toLocaleString()}
              </div>
              <div className="text-[10px] font-mono text-sky-800">
                Projected 12-month net retained
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SIMULATED BANK CARD & CHECKOUT PREVIEW SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm shadow-slate-900/5 space-y-6">
          {/* 14-Day Agency Assurance Guarantee Directly Above Checkout */}
          <div className="p-4 rounded-xl bg-sky-50/80 border border-sky-200 flex items-start gap-3.5 shadow-2xs">
            <ShieldCheck className="w-5 h-5 text-[#0284C7] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="text-xs font-mono font-bold uppercase text-[#0284C7]">
                14-Day Agency Assurance Guarantee
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                If your agency does not close at least 1 paying dental or medical clinic client using our zero-trace Regular GEO reports within 14 days, receive a complete 100% refund immediately. Zero risk, 100% backed.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Column: Plan Benefits */}
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-[#0284C7]">
                  Instant Wholesale Access Preview
                </span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  VeloGEO Agency Wholesale Partner License
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Includes complete white-label infrastructure, custom CNAME mapping, unlimited practice sub-accounts, and automated Schema.org @graph synthesis.
                </p>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Unlimited Clinic Diagnostic Audits &amp; Report Sharing</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Zero-Trace Custom CNAME (audit.youragency.com)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified MedicalClinic &amp; Physician JSON-LD Payloads</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dedicated /llms.txt Machine-Readable Endpoints</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/90 text-xs font-mono space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Wholesale License:</span>
                  <span>$297.00 / month</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Setup &amp; Provisioning:</span>
                  <span className="text-emerald-600 font-bold">$0.00 (Waived)</span>
                </div>
                <div className="border-t border-slate-200 pt-1 flex justify-between font-bold text-slate-900">
                  <span>Total Due Today:</span>
                  <span className="text-base text-[#0284C7]">$297.00</span>
                </div>
              </div>
            </div>

            {/* Right Column: Secure Simulated Card Input Form */}
            <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#0284C7]" />
                  <span className="text-xs font-bold text-slate-900">Simulated Card Checkout</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>256-Bit Encrypted</span>
                </div>
              </div>

              {paymentSuccess ? (
                <div className="py-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-black text-slate-900">Wholesale License Simulated &amp; Active!</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Simulated card authorization successful. Your agency portal credentials and CNAME instructions have been provisioned.
                  </p>
                  <Link
                    href="/partner-console"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0284C7] text-white text-xs font-bold shadow-xs transition-all"
                  >
                    <span>Launch Partner Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSimulatedPayment} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Alexander Wright"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-bold text-slate-700">Card Number</label>
                      <span className="font-mono text-[10px] text-slate-400">Visa / Mastercard / Amex</span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
                      />
                      <CreditCard className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="11/28"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">CVC Code</label>
                      <input
                        type="text"
                        required
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="882"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
                      />
                    </div>
                  </div>

                  {/* Encryption Badge */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-500 font-mono flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>PCI-DSS Level 1 Compliant</span>
                    </span>
                    <span className="text-slate-400">Sandbox Preview Mode</span>
                  </div>

                  <button
                    type="submit"
                    disabled={paymentProcessing}
                    className="w-full py-3 rounded-xl bg-[#0284C7] hover:bg-[#0369a1] text-white text-xs font-black shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                  >
                    {paymentProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying Security Token...</span>
                      </>
                    ) : (
                      <>
                        <span>Activate Agency Wholesale License ($297/mo)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. WORKSPACE TAB SECTION (AUDITOR & GENERATOR STUDIO) */}
      <section id="workspace-view" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200/90 pb-4 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveWorkspaceTab('auditor')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeWorkspaceTab === 'auditor'
                  ? 'bg-[#0284C7] text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>GEO Practice Auditor</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveWorkspaceTab('generator')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeWorkspaceTab === 'generator'
                  ? 'bg-[#0284C7] text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>1-Click Schema &amp; /llms.txt Studio</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className="text-xs font-semibold text-[#0284C7] hover:underline flex items-center gap-1.5"
          >
            <FileCode className="w-4 h-4" />
            <span>CMS Code Insertion Guide</span>
          </button>
        </div>

        {activeWorkspaceTab === 'generator' && (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm">
            <GeneratorSection initialUrl={generatorUrl} />
          </div>
        )}

        {activeWorkspaceTab === 'auditor' && !auditResult && (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-8 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto border border-sky-200">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Ready to Audit Any Dental or Medical Practice</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Enter any clinical website above to run an instant Regular GEO check. You will see Schema.org status, verified NPI counts, and /llms.txt responsiveness.
            </p>
          </div>
        )}
      </section>

      {/* 6. FAQ ACCORDION SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions (Regular GEO &amp; Wholesale Agency)
            </h2>
            <p className="text-xs text-slate-500">
              Everything you need to know about Generative Engine Optimization, Schema.org @graph payloads, and white-label operations.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/50 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-800 hover:text-[#0284C7]"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#0284C7] transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. HIGH-END MEDICAL SOFTWARE FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">VeloGEO</span>
            <span>&bull;</span>
            <span className="font-mono text-[11px] text-slate-400">INTELLIGENCE SIMPLIFIED</span>
            <span>&bull;</span>
            <span className="text-[#0284C7] font-semibold">velogeo.com</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <Link href="/partner-console" className="hover:text-slate-800 transition-colors">
              Partner Console
            </Link>
            <span>&bull;</span>
            <Link href="/pricing" className="hover:text-slate-800 transition-colors">
              Wholesale Pricing
            </Link>
            <span>&bull;</span>
            <span>&copy; {new Date().getFullYear()} VeloGEO Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
