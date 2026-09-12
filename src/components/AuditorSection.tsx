'use client';

import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCode,
  FileText,
  Stethoscope,
  Sparkles,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  Globe,
  Bot,
  Zap,
} from 'lucide-react';
import { AuditResponse } from '@/lib/types';

interface AuditorSectionProps {
  onFixWithGenerator?: (url: string) => void;
}

export function AuditorSection({ onFixWithGenerator }: AuditorSectionProps) {
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<AuditResponse | null>(null);
  const [statusStep, setStatusStep] = useState<string>('');

  const sampleQueries = [
    { name: 'Mayo Clinic', query: 'https://mayoclinic.org' },
    { name: 'Sydney Cosmetic Surgery', query: 'Sydney Cosmetic Surgery Clinic' },
    { name: 'Dr. Jane Smith Specialist', query: 'Dr. Jane Smith Specialist Orthopedic Sydney' },
  ];

  const handleAudit = async (targetInput?: string) => {
    const queryToTest = targetInput || inputQuery;
    if (!queryToTest.trim()) {
      setError('Please enter a valid website domain URL or business search query.');
      return;
    }

    setLoading(true);
    setError(null);
    setStatusStep('🔍 Agentic Web Search Discovery executing...');

    try {
      setTimeout(() => {
        setStatusStep('🎭 Launching Playwright Headless Chromium...');
      }, 1200);

      setTimeout(() => {
        setStatusStep('📜 Parsing JS-Rendered DOM & Schema.org JSON-LD...');
      }, 2500);

      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryToTest, url: queryToTest }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to audit website.');
      }

      setAuditResult(data);
      if (targetInput) {
        setInputQuery(targetInput);
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred during domain audit.');
    } finally {
      setLoading(false);
      setStatusStep('');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', ring: 'stroke-emerald-500' };
    if (score >= 50) return { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', ring: 'stroke-amber-500' };
    return { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', ring: 'stroke-rose-500' };
  };

  return (
    <div className="space-y-8">
      {/* Search Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold">
              <Bot className="w-3.5 h-3.5 text-teal-600" />
              Agentic Search & Playwright Browser Engine
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Audit Practice AI Search Visibility
            </h2>
            <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
              Enter a website domain or search query (e.g. <code className="text-teal-700 bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">"Bondi Dental Surgery"</code>). Our local agent launches headless Chromium, renders JavaScript, and probes <code className="text-teal-700 bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">/llms.txt</code> & Schema.org <code className="text-teal-700 bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">@graph</code> JSON-LD.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600">
            <Zap className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Crawl4AI Engine & Agentic Search Active</span>
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAudit();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Enter URL (e.g. drjane.com) or Business Query (e.g. 'Sydney Eye Surgery Clinic')"
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3.5 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white font-bold text-sm rounded-2xl shadow-md shadow-teal-500/20 disabled:opacity-50 flex items-center justify-center gap-2 transition-all shrink-0 min-w-[160px]"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Agentic Audit...
              </>
            ) : (
              <>
                Run Agent Audit
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Status Step Indicator */}
        {loading && statusStep && (
          <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-2xl text-teal-800 text-xs font-semibold flex items-center gap-2.5 animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin text-teal-600 shrink-0" />
            <span>{statusStep}</span>
          </div>
        )}

        {/* Quick Sample Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-1">
          <span>Try sample queries:</span>
          {sampleQueries.map((s) => (
            <button
              key={s.query}
              type="button"
              onClick={() => handleAudit(s.query)}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition-colors font-medium"
            >
              {s.name}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
            <div>{error}</div>
          </div>
        )}
      </div>

      {/* Audit Results */}
      {auditResult && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Agentic Discovery Info Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-teal-400 shrink-0" />
              <span>
                Audited Domain:{' '}
                <a
                  href={auditResult.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-teal-300 font-bold underline hover:text-teal-200"
                >
                  {auditResult.url}
                </a>
              </span>
            </div>

            <div className="flex items-center gap-2 font-medium text-slate-300">
              {auditResult.isPlaywrightRendered ? (
                <span className="px-2.5 py-0.5 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-full font-mono text-[11px]">
                  🌐 Crawl4AI AsyncWebCrawler Rendered
                </span>
              ) : (
                <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full font-mono text-[11px]">
                  ⚡ Fast HTTP Fetch Rendered
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Score Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                GEO AI Readiness Score
              </span>

              <div className="relative w-32 h-32 flex items-center justify-center my-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" className="stroke-slate-100" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className={`transition-all duration-1000 ease-out ${getScoreColor(auditResult.readinessScore).ring}`}
                    strokeWidth="8"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * auditResult.readinessScore) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-black ${getScoreColor(auditResult.readinessScore).text}`}>
                    {auditResult.readinessScore}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">out of 100</span>
                </div>
              </div>

              <div className={`mt-2 px-3 py-1 rounded-full text-xs font-bold border ${getScoreColor(auditResult.readinessScore).bg} ${getScoreColor(auditResult.readinessScore).text} ${getScoreColor(auditResult.readinessScore).border}`}>
                {auditResult.readinessScore >= 80
                  ? 'High AI Search Readiness'
                  : auditResult.readinessScore >= 50
                  ? 'Moderate Optimization Needed'
                  : 'Critical AI Blindspot'}
              </div>
            </div>

            {/* /llms.txt Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                    <FileText className="w-4 h-4 text-teal-600" />
                    /llms.txt Status
                  </div>
                  {auditResult.hasLlmsTxt ? (
                    <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-full font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 200 OK
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-full font-bold flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> 404 Missing
                    </span>
                  )}
                </div>

                <p className="text-slate-600 text-xs leading-relaxed">
                  {auditResult.hasLlmsTxt
                    ? 'Your domain provides an official llms.txt index file for Perplexity, SearchGPT, and Claude.'
                    : 'Missing standard /llms.txt file at domain root. AI search engines cannot index your practice credentials.'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
                <span>Target Host:</span>
                <span className="font-mono text-slate-700 font-semibold truncate max-w-[180px]">{auditResult.url}</span>
              </div>
            </div>

            {/* Schema Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                    <Stethoscope className="w-4 h-4 text-teal-600" />
                    Medical JSON-LD
                  </div>
                  {auditResult.hasMedicalSchema ? (
                    <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-full font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-full font-bold flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" /> Missing
                    </span>
                  )}
                </div>

                <p className="text-slate-600 text-xs leading-relaxed">
                  {auditResult.hasMedicalSchema
                    ? 'Specialized Healthcare schema (MedicalClinic or Physician) detected.'
                    : 'No MedicalClinic or Physician schema detected. AI models require explicit practitioner credentials.'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="text-[11px] text-slate-400 font-bold uppercase mb-1">
                  Detected Schemas ({auditResult.detectedSchemas.length})
                </div>
                <div className="flex flex-wrap gap-1">
                  {auditResult.detectedSchemas.length > 0 ? (
                    auditResult.detectedSchemas.map((s) => (
                      <span key={s} className="px-2 py-0.5 bg-slate-100 text-teal-800 rounded text-[11px] font-mono border border-slate-200">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 text-xs italic">None detected</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Issues & Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Critical Issues */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-base">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                Critical GEO Issues ({auditResult.criticalIssues.length})
              </div>
              <ul className="space-y-3">
                {auditResult.criticalIssues.map((issue, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Actionable Optimization Steps
              </div>
              <ul className="space-y-3">
                {auditResult.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Action: Fix in Generator */}
          {onFixWithGenerator && (
            <div className="bg-gradient-to-r from-teal-700 to-sky-700 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-1 text-center sm:text-left">
                <div className="font-bold text-lg flex items-center justify-center sm:justify-start gap-2">
                  <Sparkles className="w-5 h-5 text-teal-300" />
                  Fix These Audit Issues Instantly
                </div>
                <p className="text-teal-100 text-xs sm:text-sm max-w-xl">
                  Generate production-grade Medical JSON-LD, <code className="text-teal-200 bg-white/10 px-1 py-0.5 rounded font-mono">/llms.txt</code>, and a Standalone Profile in 10 seconds.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onFixWithGenerator(auditResult.url)}
                className="px-6 py-3.5 bg-white hover:bg-slate-100 text-teal-800 font-bold text-sm rounded-2xl shadow-lg shrink-0 flex items-center gap-2 transition-all"
              >
                Auto-Fix in Generator
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
