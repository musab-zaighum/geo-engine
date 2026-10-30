'use client';

import React, { useState } from 'react';
import Image from "next/image";
import PageIllustration from "@/components/page-illustration";
import Avatar01 from "@/public/images/avatar-01.jpg";
import Avatar02 from "@/public/images/avatar-02.jpg";
import Avatar03 from "@/public/images/avatar-03.jpg";
import Avatar04 from "@/public/images/avatar-04.jpg";
import Avatar05 from "@/public/images/avatar-05.jpg";
import Avatar06 from "@/public/images/avatar-06.jpg";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  FileText,
  Stethoscope,
  Globe,
  RefreshCw,
} from 'lucide-react';
import { AuditResponse } from '@/lib/types';

export default function HeroHome() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [auditData, setAuditData] = useState<AuditResponse | null>(null);

  const sampleClinics = [
    { name: 'Mayo Clinic', url: 'https://mayoclinic.org' },
    { name: 'Sydney Cosmetic Surgery', url: 'https://sydneycosmeticsurgery.com.au' },
    { name: 'Cleveland Clinic', url: 'https://clevelandclinic.org' },
  ];

  const handleAnalyze = async (e?: React.FormEvent, targetUrl?: string) => {
    if (e) e.preventDefault();
    const queryUrl = (targetUrl || url).trim();
    if (!queryUrl) {
      setError('Please enter a valid clinic domain URL.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: queryUrl, query: queryUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze practice website.');
      }

      setAuditData(data);
      if (targetUrl) {
        setUrl(targetUrl);
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred during practice analysis.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    if (score >= 50) return { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
    return { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' };
  };

  return (
    <section className="relative">
      <PageIllustration />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero content */}
        <div className="pb-12 pt-32 md:pb-20 md:pt-40">
          {/* Section header */}
          <div className="pb-12 text-center md:pb-16">
            <div
              className="mb-6 border-y [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-300/.8),transparent)1]"
              data-aos="zoom-y-out"
            >
              <div className="-mx-0.5 flex justify-center -space-x-3">
                <Image
                  className="box-content rounded-full border-2 border-gray-50"
                  src={Avatar01}
                  width={32}
                  height={32}
                  alt="Avatar 01"
                />
                <Image
                  className="box-content rounded-full border-2 border-gray-50"
                  src={Avatar02}
                  width={32}
                  height={32}
                  alt="Avatar 02"
                />
                <Image
                  className="box-content rounded-full border-2 border-gray-50"
                  src={Avatar03}
                  width={32}
                  height={32}
                  alt="Avatar 03"
                />
                <Image
                  className="box-content rounded-full border-2 border-gray-50"
                  src={Avatar04}
                  width={32}
                  height={32}
                  alt="Avatar 04"
                />
                <Image
                  className="box-content rounded-full border-2 border-gray-50"
                  src={Avatar05}
                  width={32}
                  height={32}
                  alt="Avatar 05"
                />
                <Image
                  className="box-content rounded-full border-2 border-gray-50"
                  src={Avatar06}
                  width={32}
                  height={32}
                  alt="Avatar 06"
                />
              </div>
            </div>
            <h1
              className="mb-6 border-y text-5xl font-bold [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-300/.8),transparent)1] md:text-6xl text-gray-900"
              data-aos="zoom-y-out"
              data-aos-delay={150}
            >
              Audit Your Practice for <br className="max-lg:hidden" />
              <span className="text-blue-600">AI Search</span> &amp; LLM Citations
            </h1>
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-8 text-lg text-gray-700"
                data-aos="zoom-y-out"
                data-aos-delay={300}
              >
                Ensure Perplexity, ChatGPT Search, and Claude recommend your medical practice.
                Audit Schema.org JSON-LD integrity, verify practitioner credentials, and validate /llms.txt AI crawler indexing.
              </p>

              {/* Clean Input Form (Replacing Demo CTA Buttons) */}
              <div className="relative before:absolute before:inset-0 before:border-y before:[border-image:linear-gradient(to_right,transparent,--theme(--color-slate-300/.8),transparent)1]">
                <form
                  onSubmit={(e) => handleAnalyze(e)}
                  className="mx-auto max-w-md sm:flex sm:max-w-xl sm:justify-center gap-3 py-4"
                  data-aos="zoom-y-out"
                  data-aos-delay={450}
                >
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://yourclinic.com"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:flex-1"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn group mt-3 w-full bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-sm hover:bg-[length:100%_150%] sm:mt-0 sm:w-auto shrink-0 disabled:opacity-60"
                  >
                    <span className="relative inline-flex items-center font-medium">
                      {loading ? (
                        <>
                          <RefreshCw className="mr-1.5 h-4 w-4 animate-spin" />
                          Analyzing Practice...
                        </>
                      ) : (
                        <>
                          Analyze Practice{" "}
                          <span className="ml-1 tracking-normal text-blue-200 transition-transform group-hover:translate-x-0.5">
                            -&gt;
                          </span>
                        </>
                      )}
                    </span>
                  </button>
                </form>
              </div>

              {/* Sample Queries */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs text-gray-500">
                <span className="font-medium">Try sample clinics:</span>
                {sampleClinics.map((clinic) => (
                  <button
                    key={clinic.name}
                    type="button"
                    onClick={() => {
                      setUrl(clinic.url);
                      handleAnalyze(undefined, clinic.url);
                    }}
                    className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors font-medium"
                  >
                    {clinic.name}
                  </button>
                ))}
              </div>

              {error && (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-left text-xs text-rose-700">
                  <div className="flex items-center gap-2 font-medium">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
                    <span>{error}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Audit Results Container (Cruip Clean Cards) */}
          {auditData && (
            <div
              id="audit-results"
              className="mt-8 space-y-6 text-left"
              data-aos="zoom-y-out"
            >
              {/* Domain & Crawler Engine Header Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <Globe className="h-4 w-4 text-blue-600 shrink-0" />
                  <span className="text-xs font-semibold text-gray-700">
                    Audited Practice:{" "}
                    <a
                      href={auditData.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-blue-600 underline hover:text-blue-700"
                    >
                      {auditData.url}
                    </a>
                  </span>
                </div>
                {auditData.discoveredTitle && (
                  <span className="text-xs text-gray-500 truncate max-w-sm font-medium">
                    {auditData.discoveredTitle}
                  </span>
                )}
              </div>

              {/* 3-Column Cruip Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Readiness Score Card */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                    GEO Readiness Score
                  </span>
                  <div className="my-2 flex items-baseline gap-1">
                    <span className={`text-4xl font-extrabold ${getScoreColor(auditData.readinessScore).text}`}>
                      {auditData.readinessScore}
                    </span>
                    <span className="text-xs text-gray-400 font-semibold">/100</span>
                  </div>
                  <div
                    className={`mt-2 rounded-full border px-3 py-1 text-xs font-semibold ${getScoreColor(auditData.readinessScore).bg} ${getScoreColor(auditData.readinessScore).text} ${getScoreColor(auditData.readinessScore).border}`}
                  >
                    {auditData.readinessScore >= 80
                      ? 'High AI Search Readiness'
                      : auditData.readinessScore >= 50
                      ? 'Moderate Optimization Needed'
                      : 'Critical AI Blindspot'}
                  </div>
                </div>

                {/* 2. /llms.txt Card */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span>/llms.txt Status</span>
                      </div>
                      {auditData.hasLlmsTxt ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" /> 200 OK
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                          <XCircle className="h-3.5 w-3.5" /> 404 Missing
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {auditData.hasLlmsTxt
                        ? 'Practice root provides an active /llms.txt markdown index for Perplexity and SearchGPT.'
                        : 'Missing root /llms.txt file. LLM crawlers cannot ingest your clinical procedures and physician specialties.'}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-gray-100 text-xs text-gray-500 font-mono">
                    {auditData.url}/llms.txt
                  </div>
                </div>

                {/* 3. Medical Schema Integrity Card */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                        <Stethoscope className="h-4 w-4 text-blue-600" />
                        <span>Medical JSON-LD</span>
                      </div>
                      {auditData.hasMedicalSchema ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                          <ShieldCheck className="h-3.5 w-3.5" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                          <ShieldAlert className="h-3.5 w-3.5" /> Missing
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {auditData.hasMedicalSchema
                        ? 'Detected specialized Schema.org Healthcare ontology (MedicalClinic or Physician).'
                        : 'No specialized medical schema found. AI engines lack verified practitioner credentials.'}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                      Detected Schemas ({auditData.detectedSchemas.length})
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {auditData.detectedSchemas.length > 0 ? (
                        auditData.detectedSchemas.map((schema) => (
                          <span
                            key={schema}
                            className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 font-mono text-[11px] text-blue-700"
                          >
                            {schema}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400 italic">None detected</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2-Column Bento: Critical Issues & Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Critical Issues Card */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-rose-700">
                    <AlertTriangle className="h-4 w-4 text-rose-600" />
                    <span>Critical Schema &amp; Visibility Issues ({auditData.criticalIssues.length})</span>
                  </div>
                  <ul className="space-y-2.5">
                    {auditData.criticalIssues.map((issue, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 rounded-xl border border-rose-200/80 bg-rose-50/70 p-3 text-xs text-rose-800 leading-relaxed"
                      >
                        <XCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations Card */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-800">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Actionable Recommendations ({auditData.recommendations.length})</span>
                  </div>
                  <ul className="space-y-2.5">
                    {auditData.recommendations.map((rec, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 rounded-xl border border-emerald-200/80 bg-emerald-50/70 p-3 text-xs text-emerald-900 leading-relaxed"
                      >
                        <Sparkles className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Hero image / terminal preview (Cruip original asset container preserved) */}
          {!auditData && (
            <div
              className="mx-auto max-w-3xl"
              data-aos="zoom-y-out"
              data-aos-delay={600}
            >
              <div className="relative aspect-video rounded-2xl bg-gray-900 px-5 py-3 shadow-xl before:pointer-events-none before:absolute before:-inset-5 before:border-y before:[border-image:linear-gradient(to_right,transparent,--theme(--color-slate-300/.8),transparent)1] after:absolute after:-inset-5 after:-z-10 after:border-x after:[border-image:linear-gradient(to_bottom,transparent,--theme(--color-slate-300/.8),transparent)1]">
                <div className="relative mb-8 flex items-center justify-between before:block before:h-[9px] before:w-[41px] before:bg-[length:16px_9px] before:[background-image:radial-gradient(circle_at_4.5px_4.5px,var(--color-gray-600)_4.5px,transparent_0)] after:w-[41px]">
                  <span className="text-[13px] font-medium text-white">
                    nexusrank1.com/geo-engine
                  </span>
                </div>
                <div className="font-mono text-xs text-gray-500 [&_span]:opacity-0">
                  <span className="animate-[code-1_10s_infinite] text-gray-200">
                    GET /llms.txt HTTP/1.1
                  </span>{" "}
                  <span className="animate-[code-2_10s_infinite]">
                    User-Agent: PerplexityBot/1.0
                  </span>
                  <br />
                  <span className="animate-[code-3_10s_infinite] text-blue-400">
                    Status: 200 OK — Clinical Schema Verified
                  </span>
                  <br />
                  <span className="animate-[code-4_10s_infinite] text-emerald-400">
                    AHPRA / NPI: Practitioner Credentials Mapped
                  </span>
                  <br />
                  <br />
                  <span className="animate-[code-5_10s_infinite] text-gray-200">
                    Injecting Schema.org @graph JSON-LD...
                  </span>
                  <br />
                  <span className="animate-[code-6_10s_infinite] text-blue-300">
                    Ready for AI Search &amp; LLM Citations.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
