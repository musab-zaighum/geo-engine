'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Sparkles,
  Award,
  Globe,
  CheckCircle2,
  Stethoscope,
  Code,
  TrendingUp,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  XCircle,
  AlertTriangle,
  FileText,
  Bot,
  Zap,
  ChevronDown,
  Layers,
  FileCode,
  Check,
  ExternalLink,
  BarChart3,
  PieChart as PieChartIcon,
  DollarSign,
  Briefcase,
  Users,
  Activity,
  Clock,
  ArrowUpRight,
  Building2,
  SlidersHorizontal,
  ChevronRight,
} from 'lucide-react';
import { AuditResponse } from '@/lib/types';
import { PageIllustration } from '@/components/PageIllustration';
import { GeneratorSection } from '@/components/GeneratorSection';
import { PasteGuideModal } from '@/components/PasteGuideModal';
import { PricingCalculatorModal } from '@/components/PricingCalculatorModal';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'auditor' | 'generator'>('auditor');
  const [generatorInitialUrl, setGeneratorInitialUrl] = useState<string>('');

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  // Hero Audit Form State (wired directly to /api/audit)
  const [heroInput, setHeroInput] = useState('');
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<AuditResponse | null>(null);
  const [auditStep, setAuditStep] = useState<string>('');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#070A11] text-slate-100 flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#38BDF8]">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm font-semibold tracking-wide">Initializing AI NEXUS Workspace...</span>
        </div>
      </div>
    );
  }

  const sampleQueries = [
    { name: 'Mayo Clinic', query: 'https://mayoclinic.org' },
    { name: 'Sydney Cosmetic Surgery', query: 'Sydney Cosmetic Surgery Clinic' },
    { name: 'Dr. Jane Smith Specialist', query: 'Dr. Jane Smith Specialist Orthopedic Sydney' },
  ];

  const handleAudit = async (targetQuery?: string) => {
    const queryToTest = targetQuery || heroInput;
    if (!queryToTest.trim()) {
      setAuditError('Please enter a valid clinic domain URL or practice name.');
      return;
    }

    setAuditLoading(true);
    setAuditError(null);
    setAuditStep('Agentic Web Search & Practice Discovery executing...');

    try {
      setTimeout(() => {
        setAuditStep('Launching Playwright Headless Chromium Engine...');
      }, 1200);

      setTimeout(() => {
        setAuditStep('Parsing DOM, Schema.org @graph & /llms.txt endpoints...');
      }, 2500);

      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: queryToTest.trim(), query: queryToTest.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete clinic audit.');
      }

      setAuditResult(data);
      setActiveTab('auditor');
      if (targetQuery) {
        setHeroInput(targetQuery);
      }

      setTimeout(() => {
        const el = document.getElementById('audit-results');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } catch (err: any) {
      setAuditError(err?.message || 'An error occurred during domain audit.');
    } finally {
      setAuditLoading(false);
      setAuditStep('');
    }
  };

  const handleFixWithGenerator = (urlToFix: string) => {
    setGeneratorInitialUrl(urlToFix);
    setActiveTab('generator');
    setTimeout(() => {
      const el = document.getElementById('workspace-view');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', ring: 'stroke-emerald-400' };
    if (score >= 50) return { text: 'text-[#38BDF8]', bg: 'bg-sky-500/10', border: 'border-sky-500/20', ring: 'stroke-[#38BDF8]' };
    return { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', ring: 'stroke-rose-400' };
  };

  const projectsData = [
    { name: 'S00004 - ClearView Hotels - Strategy Consulting', hours: '0.06', tasks: 5 },
    { name: 'Strategy Consulting', hours: '0.00', tasks: 5 },
    { name: 'ESG Reporting', hours: '0h00m', tasks: 4 },
    { name: 'S00002 - FoodNest Group - ESG Reporting', hours: '3h00m', tasks: 4 },
    { name: 'Prospective Studies', hours: '0h00m', tasks: 3 },
    { name: 'S00001 - GreenCity Municipality - Prospective Studies', hours: '0h00m', tasks: 3 },
    { name: 'Internal', hours: '0h00m', tasks: 2 },
    { name: 'Carbon Footprint', hours: '2h00m', tasks: 1 },
    { name: 'Decarbonization Plan', hours: '5h00m', tasks: 1 },
  ];

  const faqs = [
    {
      q: 'Why do AI search engines ignore healthcare websites without Schema.org?',
      a: 'Large Language Models (LLMs) like Perplexity, ChatGPT Search, and Claude do not parse raw HTML like legacy keyword crawlers. They require explicit entity knowledge graphs. Without Schema.org MedicalClinic and Physician definitions, AI models cannot verify whether a practitioner is licensed, leading to omission or hallucinations.',
    },
    {
      q: 'What is /llms.txt and why is it essential for SearchGPT and Perplexity?',
      a: '/llms.txt is the emerging web standard for AI crawlers. Much like robots.txt guides search engines, /llms.txt provides a high-density, authoritative markdown index that LLMs can ingest in a single request. CiteMed generates spec-compliant /llms.txt manifests containing your clinical specialties, accepted insurances, and provider credentials.',
    },
    {
      q: 'How do AHPRA and NPI credentials influence AI recommendations?',
      a: 'AI search models operate under strict Healthcare E-E-A-T (Experience, Expertise, Authoritativeness, and Trustworthiness) safety guardrails. When CiteMed binds official medical registry numbers (such as Australian AHPRA or US NPI identifiers) directly into your JSON-LD, search models recognize your practitioners as verified medical authorities.',
    },
    {
      q: 'Can our clinic deploy this without an in-house development team?',
      a: 'Yes. CiteMed produces production-ready <script type="application/ld+json"> code snippets and static /llms.txt files. Using our CMS Code Insertion Guide, practice managers can deploy the code into WordPress, Squarespace, Webflow, or Shopify in under 3 minutes.',
    },
    {
      q: 'How does CiteMed compare to generic SEO plugins like Yoast or RankMath?',
      a: 'Standard SEO plugins generate basic WebSite and Organization schema that lack clinical depth. CiteMed generates comprehensive medical @graph schemas specifically modeling MedicalSpecialty, MedicalCondition, Physician, MedicalBusiness, and GBP geo-coordinates, paired with /llms.txt infrastructure.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#070A11] text-slate-100 overflow-hidden font-sans selection:bg-[#0284C7]/30 selection:text-[#38BDF8]">
      {/* Modals */}
      <PasteGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <PricingCalculatorModal isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} />

      {/* Hero Header Section */}
      <section className="relative pt-14 pb-12 px-4 sm:px-6 max-w-7xl mx-auto text-center space-y-6">
        <PageIllustration />

        {/* Top Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0284C7]/10 border border-[#0284C7]/30 text-[#38BDF8] text-xs font-semibold shadow-lg backdrop-blur-sm">
          <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
          <span>AI NEXUS Healthcare GEO &amp; Enterprise Analytics Suite</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight max-w-5xl mx-auto leading-[1.12]">
          Audit Your Practice for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] via-[#0284C7] to-cyan-400">AI Search &amp; LLM Citations</span>
        </h1>

        {/* Value Proposition */}
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
          Ensure Perplexity, SearchGPT, and Claude recommend your medical practice. Audit medical Schema.org JSON-LD integrity, verify provider credentials, and inspect enterprise financial performance metrics in real time.
        </p>

        {/* Domain Audit Bar */}
        <div id="audit-bar" className="max-w-2xl mx-auto pt-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAudit();
            }}
            className="bg-[#0B0F19]/90 backdrop-blur-md p-2 rounded-2xl border border-slate-800 shadow-2xl focus-within:border-[#38BDF8] focus-within:ring-2 focus-within:ring-[#0284C7]/30 flex flex-col sm:flex-row items-center gap-2 transition-all"
          >
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={heroInput}
                onChange={(e) => setHeroInput(e.target.value)}
                placeholder="Enter clinic domain (e.g. drjane.com) or practice name..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-transparent border-0 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-0"
              />
            </div>
            <button
              type="submit"
              disabled={auditLoading}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-md shadow-sky-950/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
            >
              {auditLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Auditing...</span>
                </>
              ) : (
                <>
                  <span>Audit Practice</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Query Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs text-slate-400">
            <span className="font-medium text-slate-500">Quick Test:</span>
            {sampleQueries.map((sq, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setHeroInput(sq.query);
                  handleAudit(sq.query);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors text-[11px] font-medium"
              >
                {sq.name}
              </button>
            ))}
          </div>

          {/* Loading Execution Banner */}
          {auditLoading && (
            <div className="mt-4 p-4 rounded-xl bg-[#0B0F19] border border-sky-500/30 text-sky-400 text-xs font-mono flex items-center gap-3 animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin text-[#38BDF8]" />
              <span>{auditStep || 'Analyzing clinical domain graph structure...'}</span>
            </div>
          )}

          {auditError && (
            <div className="mt-4 p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{auditError}</span>
            </div>
          )}
        </div>
      </section>

      {/* Main Workspace Body */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
        {/* KPI Top Counter Cards Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Tasks</div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-white">28</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                12 in progress
              </span>
            </div>
            <div className="text-[10px] text-slate-500">↑∞% since last period</div>
          </div>

          <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Solvency Debt Ratio</div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-[#38BDF8]">740.71</span>
              <span className="text-xs font-bold text-emerald-400">108%</span>
            </div>
            <div className="text-[10px] text-slate-500">687.84 last period</div>
          </div>

          <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Short Term Cash Forecast</div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black text-slate-100">-Rs.91,448.36</span>
              <span className="text-xs font-bold text-emerald-400">233%</span>
            </div>
            <div className="text-[10px] text-slate-500">-Rs.39,207.00 in 2025</div>
          </div>

          <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">LLM Citation Score</div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-emerald-400">94.8%</span>
              <span className="text-xs font-bold text-emerald-400">Verified</span>
            </div>
            <div className="text-[10px] text-slate-500">Schema.org &amp; /llms.txt ready</div>
          </div>
        </div>

        {/* Section 1: Tasks by Stage & State (Direct Dashboard Visuals) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tasks by Stage Bar Chart Widget */}
          <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#38BDF8]" />
                <span>Tasks by Stage</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">28 Total Tasks</span>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="relative pt-6 pb-2">
              <div className="flex items-end justify-around h-48 border-b border-slate-800 px-4">
                {/* Bar 1: To Do */}
                <div className="flex flex-col items-center gap-2 w-20 group relative">
                  <div className="absolute -top-8 bg-slate-900 text-[#38BDF8] border border-slate-700 px-2 py-0.5 rounded text-[10px] font-bold shadow opacity-0 group-hover:opacity-100 transition-opacity">
                    In Progress 24
                  </div>
                  <div className="w-full bg-[#0284C7] rounded-t-md h-36 transition-all group-hover:bg-[#38BDF8]" />
                  <span className="text-xs font-medium text-slate-300">To Do</span>
                </div>

                {/* Bar 2: Internal */}
                <div className="flex flex-col items-center gap-2 w-20 group relative">
                  <div className="w-full bg-[#0284C7]/60 rounded-t-md h-6 transition-all group-hover:bg-[#0284C7]" />
                  <span className="text-xs font-medium text-slate-300">Internal</span>
                </div>

                {/* Bar 3: In Progress */}
                <div className="flex flex-col items-center gap-2 w-20 group relative">
                  <div className="w-full bg-[#0284C7]/80 rounded-t-md h-6 transition-all group-hover:bg-[#38BDF8]" />
                  <span className="text-xs font-medium text-slate-300">In Progress</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks by State Pie/Donut Chart Widget */}
          <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-[#38BDF8]" />
                <span>Tasks by State</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">Active State Pipeline</span>
            </div>

            <div className="flex items-center justify-center h-48 relative">
              {/* Donut Chart Visualization */}
              <div className="w-40 h-40 rounded-full border-8 border-[#0284C7] flex items-center justify-center shadow-lg relative">
                <div className="w-28 h-28 rounded-full bg-[#070A11] border border-slate-800 flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-white">24</span>
                  <span className="text-[10px] text-[#38BDF8] font-semibold">In Progress</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Top Assignees & Top Projects Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Assignees Card */}
          <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#38BDF8]" />
              <span>Top Assignees</span>
            </h2>

            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Assignee</th>
                    <th className="px-4 py-3">Hours Logged</th>
                    <th className="px-4 py-3 text-right">Tasks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-bold text-white">Total</td>
                    <td className="px-4 py-3 text-slate-400 font-mono">0h00m</td>
                    <td className="px-4 py-3 text-right text-slate-400 font-mono">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Projects Card */}
          <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#38BDF8]" />
              <span>Top Projects</span>
            </h2>

            <div className="border border-slate-800 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px] sticky top-0">
                  <tr>
                    <th className="px-4 py-3">Project Name</th>
                    <th className="px-4 py-3 text-right">Hours Logged</th>
                    <th className="px-4 py-3 text-right">Tasks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {projectsData.map((proj, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-2.5 font-medium text-slate-200">{proj.name}</td>
                      <td className="px-4 py-2.5 text-right font-mono text-slate-400">{proj.hours}</td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold text-[#38BDF8]">{proj.tasks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section 3: Enterprise Financial & Solvency Metrics (From Screenshot) */}
        <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <span>Financial Solvency &amp; Liquidity Statement</span>
              </h2>
              <p className="text-xs text-slate-400">Comparison of 2026 vs 2025 financial metrics and balance sheet permanence.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs text-slate-300 font-mono">
              Currency: PKR (Rs.)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            {/* Table 1: Cash & Profitability */}
            <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div className="font-bold text-[#38BDF8] border-b border-slate-800 pb-2">Profitability &amp; Cash</div>
              <div className="space-y-2 text-slate-300 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Income:</span>
                  <span>Rs.0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cost of revenue:</span>
                  <span>Rs.0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Gross profit:</span>
                  <span>Rs.0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Expenses:</span>
                  <span className="text-rose-400">Rs.52,174.90</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-1 font-bold">
                  <span className="text-slate-200">Net profit:</span>
                  <span className="text-rose-400">-Rs.52,174.90</span>
                </div>
              </div>
            </div>

            {/* Table 2: Performance */}
            <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div className="font-bold text-[#38BDF8] border-b border-slate-800 pb-2">Performance Ratios</div>
              <div className="space-y-2 text-slate-300 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Gross profit margin:</span>
                  <span>0.0%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Net profit margin:</span>
                  <span>0.0%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Return on investments:</span>
                  <span className="text-rose-400">-42260.6%</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-1 font-bold">
                  <span className="text-slate-200">Financial independence:</span>
                  <span>0.0</span>
                </div>
              </div>
            </div>

            {/* Table 3: Balance Sheet & Solvency */}
            <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div className="font-bold text-[#38BDF8] border-b border-slate-800 pb-2">Solvency &amp; Payables</div>
              <div className="space-y-2 text-slate-300 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Payables (2026):</span>
                  <span className="text-emerald-400">Rs.91,448.36</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payables (2025):</span>
                  <span>Rs.39,207.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Debt ratio:</span>
                  <span className="text-emerald-400 font-bold">740.71 (108%)</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-1 font-bold">
                  <span className="text-slate-200">Net assets:</span>
                  <span className="text-rose-400">-Rs.91,324.90</span>
                </div>
              </div>
            </div>

            {/* Table 4: Liquidity & Position */}
            <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div className="font-bold text-[#38BDF8] border-b border-slate-800 pb-2">Position &amp; Liquidity</div>
              <div className="space-y-2 text-slate-300 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Avg debtors days:</span>
                  <span>0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Avg creditors days:</span>
                  <span className="text-[#38BDF8]">639.75</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Working capital:</span>
                  <span className="text-emerald-400">-Rs.91,324.90</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-1 font-bold">
                  <span className="text-slate-200">Cash forecast:</span>
                  <span className="text-emerald-400">-Rs.91,448.36</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Practice GEO Auditor Results & Generator Tabs */}
        <div id="workspace-view" className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('auditor')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'auditor'
                    ? 'bg-[#0284C7] text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Search className="w-4 h-4" />
                <span>GEO Practice Auditor</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('generator')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'generator'
                    ? 'bg-[#0284C7] text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Code className="w-4 h-4" />
                <span>Schema &amp; /llms.txt Generator</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className="text-xs font-semibold text-[#38BDF8] hover:underline flex items-center gap-1.5"
            >
              <FileCode className="w-4 h-4" />
              <span>CMS Integration Guide</span>
            </button>
          </div>

          {activeTab === 'auditor' && auditResult && (
            <div id="audit-results" className="bg-[#0B0F19] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Domain Audit Summary</div>
                  <h3 className="text-xl font-bold text-white">{auditResult.url}</h3>
                  <div className="text-xs text-slate-400">Scanned just now &bull; Live Audit Engine</div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-slate-400 font-semibold">AI Readiness Score</span>
                    <span className={`text-3xl font-black ${getScoreColor(auditResult.readinessScore).text}`}>
                      {auditResult.readinessScore}/100
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleFixWithGenerator(auditResult.url)}
                    className="px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                  >
                    <span>Fix with Generator</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Issues & Recommendations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Critical Issues Found ({auditResult.criticalIssues.length})</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {auditResult.criticalIssues.map((issue, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Actionable Recommendations ({auditResult.recommendations.length})</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {auditResult.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'generator' && (
            <GeneratorSection initialUrl={generatorInitialUrl} />
          )}
        </div>

        {/* Section 5: FAQ Accordion */}
        <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions (FAQ)
            </h2>
            <p className="text-xs text-slate-400">
              Learn how Healthcare Generative Engine Optimization (GEO) ensures your clinic is indexed by AI models.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-slate-200 hover:text-white"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[#38BDF8] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#0B0F19] py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">AI NEXUS Healthcare GEO Engine</span>
            <span>&bull;</span>
            <span>INTELLIGENCE SIMPLIFIED</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} AI NEXUS Platform. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
