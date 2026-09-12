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
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { AuditResponse } from '@/lib/types';

interface AuditorTabProps {
  onFixWithGenerator?: (url: string) => void;
}

export function AuditorTab({ onFixWithGenerator }: AuditorTabProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<AuditResponse | null>(null);

  const sampleUrls = [
    { name: 'Mayo Clinic', url: 'https://mayoclinic.org' },
    { name: 'Sydney Cosmetic Surgery', url: 'https://sydneycosmeticsurgery.com.au' },
    { name: 'Healthshare Medical', url: 'https://healthshare.com.au' },
  ];

  const handleAudit = async (targetUrl?: string) => {
    const urlToTest = targetUrl || url;
    if (!urlToTest.trim()) {
      setError('Please enter a valid website URL or domain.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToTest }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete website audit.');
      }

      setAuditResult(data);
      if (targetUrl) {
        setUrl(targetUrl);
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred during audit.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', ring: 'stroke-emerald-500' };
    if (score >= 50) return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', ring: 'stroke-amber-500' };
    return { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', ring: 'stroke-rose-500' };
  };

  return (
    <div className="space-y-8">
      {/* Search Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-0 pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Search className="w-3.5 h-3.5" />
            Live Healthcare GEO Readiness Inspector
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Audit Your Practice's AI Search Engine Visibility
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Enter your practice domain or doctor profile URL. CiteMed analyzes your <code className="text-cyan-300 bg-slate-800 px-1.5 py-0.5 rounded text-xs">/llms.txt</code> compliance, medical JSON-LD schema depth, and practitioner registration signals required by Perplexity, SearchGPT, and Claude.
          </p>

          {/* Audit Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAudit();
            }}
            className="pt-2 flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g. sydneycosmeticsurgery.com.au or drjane.com"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-sm transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all min-w-[140px]"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Auditing...
                </>
              ) : (
                <>
                  Run Audit
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sample quick button presets */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-400">
            <span>Try sample websites:</span>
            {sampleUrls.map((s) => (
              <button
                key={s.url}
                type="button"
                onClick={() => handleAudit(s.url)}
                className="px-2.5 py-1 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 rounded-lg border border-slate-700/50 transition-colors flex items-center gap-1"
              >
                {s.name}
              </button>
            ))}
          </div>

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}
        </div>
      </div>

      {/* Audit Results Section */}
      {auditResult && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Readiness Score Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Score Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                GEO AI Readiness Score
              </span>
              
              {/* Circular Gauge */}
              <div className="relative w-32 h-32 flex items-center justify-center my-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-slate-800"
                    strokeWidth="8"
                    fill="transparent"
                  />
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
                  <span className={`text-3xl font-extrabold ${getScoreColor(auditResult.readinessScore).text}`}>
                    {auditResult.readinessScore}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">out of 100</span>
                </div>
              </div>

              <div className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold border ${getScoreColor(auditResult.readinessScore).bg} ${getScoreColor(auditResult.readinessScore).text} ${getScoreColor(auditResult.readinessScore).border}`}>
                {auditResult.readinessScore >= 80
                  ? 'High AI Search Readiness'
                  : auditResult.readinessScore >= 50
                  ? 'Moderate GEO Optimization Required'
                  : 'Critical AI Search Blindspot'}
              </div>
            </div>

            {/* Status 1: llms.txt */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    /llms.txt Crawler File
                  </div>
                  {auditResult.hasLlmsTxt ? (
                    <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-full font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Detected (200 OK)
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-full font-semibold flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      Missing ({auditResult.llmsTxtStatus || 404})
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {auditResult.hasLlmsTxt
                    ? 'Your domain provides an official llms.txt file to guide Perplexity, SearchGPT, and Claude crawlers.'
                    : 'AI engines searching for your practice cannot find a standardized /llms.txt document at your domain root.'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
                <span>Domain Status:</span>
                <span className="font-mono text-slate-300">{auditResult.url}</span>
              </div>
            </div>

            {/* Status 2: Medical JSON-LD Schema */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
                    <Stethoscope className="w-4 h-4 text-cyan-400" />
                    Medical JSON-LD Schema
                  </div>
                  {auditResult.hasMedicalSchema ? (
                    <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-full font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-full font-semibold flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Not Found
                    </span>
                  )}
                </div>

                <p className="text-slate-400 text-xs leading-relaxed">
                  {auditResult.hasMedicalSchema
                    ? 'Specialized Healthcare JSON-LD schema (MedicalClinic or Physician) detected on homepage.'
                    : 'No MedicalClinic or Physician schema detected. Generic or missing schemas hurt medical authority.'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <div className="text-[11px] text-slate-500 font-semibold mb-1.5 uppercase">
                  Detected Schemas ({auditResult.detectedSchemas.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {auditResult.detectedSchemas.length > 0 ? (
                    auditResult.detectedSchemas.map((schema) => (
                      <span
                        key={schema}
                        className="px-2 py-0.5 bg-slate-800 text-cyan-300 border border-slate-700/60 rounded text-[11px] font-mono"
                      >
                        {schema}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 text-xs italic">No schema nodes detected</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostics: Critical Issues & Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Critical Issues */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-base">
                <AlertTriangle className="w-5 h-5" />
                Critical GEO Issues ({auditResult.criticalIssues.length})
              </div>
              <ul className="space-y-3">
                {auditResult.criticalIssues.map((issue, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 bg-rose-500/5 border border-rose-500/15 rounded-xl text-xs text-rose-300">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{issue}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-base">
                <CheckCircle2 className="w-5 h-5" />
                Actionable Optimization Steps
              </div>
              <ul className="space-y-3">
                {auditResult.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl text-xs text-emerald-300">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Action: Fix with Generator Banner */}
          <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/60 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
            <div className="space-y-2 text-center sm:text-left">
              <div className="text-cyan-400 font-bold text-lg flex items-center justify-center sm:justify-start gap-2">
                <Sparkles className="w-5 h-5" />
                Fix These Issues Instantly with CiteMed Generator
              </div>
              <p className="text-slate-300 text-sm max-w-xl">
                Generate production-ready Medical JSON-LD, <code className="text-cyan-300 bg-slate-800/80 px-1.5 py-0.5 rounded">/llms.txt</code>, and a Standalone Markdown Profile in under 10 seconds.
              </p>
            </div>

            {onFixWithGenerator && (
              <button
                type="button"
                onClick={() => onFixWithGenerator(auditResult.url)}
                className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/25 shrink-0 flex items-center gap-2 transition-all"
              >
                Auto-Fix with Generator
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
