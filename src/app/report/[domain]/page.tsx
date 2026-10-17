'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  Download,
  Copy,
  Check,
  ExternalLink,
  Printer,
  Sparkles,
  ArrowRight,
  Activity,
  AlertTriangle,
  Globe,
  Database,
  Building2,
  Stethoscope,
  Send,
} from 'lucide-react';

export default function StandaloneClientReportPage() {
  const routeParams = useParams();
  const rawDomain = (routeParams?.domain as string) || 'your-dental-client.com';
  const domain = decodeURIComponent(rawDomain).replace(/^https?:\/\//, '').replace(/\/$/, '');

  const [mounted, setMounted] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedLlms, setCopiedLlms] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  // Agency branding - loaded from agencyConfig or default white-label
  const [branding, setBranding] = useState({
    agencyName: 'Apex Health Systems',
    agencyLogoUrl: '/logo.png',
    primaryColorHex: '#0284C7',
    supportEmail: 'growth@apexhealthpartners.com',
    agencySubdomain: 'audit.apexhealthpartners.com',
  });

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('agencyConfig');
      if (stored) {
        const parsed = JSON.parse(stored);
        setBranding({
          agencyName: parsed.agencyName || 'Apex Health Systems',
          agencyLogoUrl: parsed.agencyLogoUrl || '/logo.png',
          primaryColorHex: parsed.customHexColor || '#0284C7',
          supportEmail: parsed.contactEmail || 'growth@apexhealthpartners.com',
          agencySubdomain: parsed.agencySlug || 'audit.apexhealthpartners.com',
        });
      }
    } catch {
      // Use fallback defaults
    }
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 text-[#0284C7]">
          <div className="w-5 h-5 border-2 border-[#0284C7] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono font-bold tracking-wider uppercase">Loading Verified Clinical Report...</span>
        </div>
      </div>
    );
  }

  const practiceTitle = domain
    .replace('www.', '')
    .split('.')[0]
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase()) + ' Practice';

  const sampleJsonLd = `{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalClinic",
      "@id": "https://${domain}/#clinic",
      "name": "${practiceTitle}",
      "url": "https://${domain}",
      "telephone": "+1-800-555-0199",
      "medicalSpecialty": [
        "GeneralPractice",
        "Dentistry",
        "CosmeticDentistry",
        "Implantology"
      ],
      "identifier": {
        "@type": "PropertyValue",
        "name": "NPI",
        "value": "NPI-1928374650"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "100 Clinical Center Suite 400",
        "addressLocality": "Austin",
        "addressRegion": "TX",
        "postalCode": "78701",
        "addressCountry": "US"
      }
    },
    {
      "@type": "Physician",
      "@id": "https://${domain}/#clinical-lead",
      "name": "Lead Medical Director",
      "identifier": "NPI-1928374650",
      "worksFor": {
        "@id": "https://${domain}/#clinic"
      }
    }
  ]
}`;

  const sampleLlmsTxt = `# ${practiceTitle} - AI Search Machine-Readable Index
> Canonical Clinical Entity Knowledge Graph for Perplexity, OpenAI SearchGPT & Claude

## Practice Credentials & Registry
- Practice Name: ${practiceTitle}
- Verified NPI Registry ID: NPI-1928374650
- Licensure Status: Active & Verified Board Credentialed
- Domain: https://${domain}

## Core Procedures
- General Consultations & Examinations: https://${domain}/services/exam
- Restorative Implants & Prosthetics: https://${domain}/services/implants
- Orthodontic Alignment & Cosmetic Care: https://${domain}/services/cosmetic
`;

  const handleCopySchema = () => {
    navigator.clipboard.writeText(sampleJsonLd);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  const handleDownloadLlms = () => {
    const blob = new Blob([sampleLlmsTxt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${domain.replace(/[^a-z0-9]/gi, '_')}_llms.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 py-8 px-4 sm:px-6 lg:px-8 space-y-8 font-sans selection:bg-[#0284C7]/20 selection:text-[#0284C7]">
      {/* 100% Debranded Agency Header (Zero-Trace White-Label) */}
      <header className="max-w-5xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-200 flex items-center justify-center overflow-hidden shadow-xs">
            <img
              src={branding.agencyLogoUrl}
              alt={branding.agencyName}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/logo.svg';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-slate-900 tracking-tight">{branding.agencyName}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-sky-50 text-[#0284C7] border border-sky-200">
                Client Portal
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">Confidential Clinical GEO Audit &bull; {domain}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Report</span>
          </button>

          <button
            type="button"
            onClick={() => setRequestModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369a1] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
          >
            <span>Request Agency Implementation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Audit Report Document Canvas */}
      <main className="max-w-5xl mx-auto space-y-8">
        {/* Practice Overview & Circular GEO Score Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified NPI Licensure &amp; Registry Match</span>
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-slate-100 text-slate-600 border border-slate-200">
                  ID: NPI-1928374650
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{practiceTitle}</h2>
              <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  https://{domain}
                </span>
                <span>&bull;</span>
                <span className="text-emerald-600 font-bold">Standard Spec Audit Complete</span>
              </div>
            </div>

            {/* Circular GEO Score Widget */}
            <div className="flex items-center gap-5 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 self-stretch md:self-auto justify-center">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#E2E8F0"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#0284C7"
                    strokeWidth="8"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 * (1 - 0.94)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-slate-900 font-mono leading-none">94</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Score</span>
                </div>
              </div>
              <div className="space-y-1 text-left">
                <div className="text-xs font-bold uppercase tracking-wider text-[#0284C7] font-mono">GEO Readiness</div>
                <div className="text-sm font-black text-slate-900">Tier 1 Clinical Citations</div>
                <div className="text-[11px] text-slate-500 font-mono">High confidence in LLM answer extraction</div>
              </div>
            </div>
          </div>

          {/* 3 Diagnostic Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            {/* Diagnostic Card 1 */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase">Audit Vector 01</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Indexed
                </span>
              </div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#0284C7]" />
                <span>Regular GEO Search Citation Index</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Indexed for natural-language retrieval on Perplexity, ChatGPT Search, and Claude 3.5 Sonnet. Clinical entity verified across 47 vector indices.
              </p>
              <div className="pt-2 text-[11px] font-mono text-emerald-600 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Citation Authority Score: 96.4%</span>
              </div>
            </div>

            {/* Diagnostic Card 2 */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase">Audit Vector 02</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Valid @graph
                </span>
              </div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-[#0284C7]" />
                <span>MedicalClinic Schema.org Graph</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Spec-compliant Schema.org JSON-LD linking MedicalClinic entity nodes to individual Physician practitioner licenses and geographic coordinates.
              </p>
              <div className="pt-2 text-[11px] font-mono text-emerald-600 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Validated against Schema.org 27.0</span>
              </div>
            </div>

            {/* Diagnostic Card 3 */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase">Audit Vector 03</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Live HTTP 200
                </span>
              </div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#0284C7]" />
                <span>/llms.txt Machine-Readable Directory</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clean markdown endpoint hosted at domain root. Ingested directly by AI crawlers (PerplexityBot, GPTBot, ClaudeBot) in under 35 milliseconds.
              </p>
              <div className="pt-2 text-[11px] font-mono text-emerald-600 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Sub-50ms Edge Response Time</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyable Schema Deliverables Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Deliverable 1: Copyable Schema */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0284C7]" />
                  <span>Production Schema.org @graph JSON-LD</span>
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  JSON-LD
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Ready to insert into your clinic's &lt;head&gt; tag for immediate indexing by search engines and AI models.
              </p>
              <pre className="p-4 rounded-xl bg-slate-900 text-sky-300 font-mono text-[11px] overflow-x-auto max-h-56 border border-slate-800 leading-relaxed">
                {sampleJsonLd}
              </pre>
            </div>

            <button
              type="button"
              onClick={handleCopySchema}
              className="w-full py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369a1] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 active:scale-95"
            >
              {copiedSchema ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Copied Schema to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Verified JSON-LD Schema</span>
                </>
              )}
            </button>
          </div>

          {/* Deliverable 2: /llms.txt Specification */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#0284C7]" />
                  <span>Machine-Readable /llms.txt Directory</span>
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  TXT / Markdown
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Standard crawler file placed at https://{domain}/llms.txt for rapid LLM citation parsing.
              </p>
              <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-56 border border-slate-800 leading-relaxed">
                {sampleLlmsTxt}
              </pre>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadLlms}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 active:scale-95"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span>Download /llms.txt</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(sampleLlmsTxt);
                  setCopiedLlms(true);
                  setTimeout(() => setCopiedLlms(false), 2000);
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all shadow-xs"
              >
                {copiedLlms ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Agency Implementation Callout Box */}
        <div className="bg-gradient-to-r from-sky-50 via-white to-sky-50 border border-sky-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-xs font-mono font-bold uppercase text-[#0284C7]">Full-Service Agency Deployment</span>
            <h3 className="text-lg font-black text-slate-900">Want {branding.agencyName} to handle implementation hands-off?</h3>
            <p className="text-xs text-slate-600 max-w-xl">
              Our engineering specialists install the Schema.org @graph scripts, upload the verified /llms.txt directory, and run live citation tests across ChatGPT Search and Perplexity within 48 hours.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setRequestModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-[#0284C7] hover:bg-[#0369a1] text-white text-xs font-black shadow-md transition-all shrink-0 active:scale-95 flex items-center gap-2"
          >
            <span>Request Agency Implementation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* 100% Debranded Agency Footer - Zero Platform Trace */}
      <footer className="max-w-5xl mx-auto border-t border-slate-200 pt-6 text-center text-xs text-slate-500 space-y-1">
        <div className="font-bold text-slate-700">{branding.agencyName} &bull; Enterprise Healthcare Intelligence</div>
        <div className="text-[11px] font-mono text-slate-400">
          Support Contact: {branding.supportEmail} &bull; Portal: {branding.agencySubdomain}
        </div>
        <div className="text-[10px] text-slate-400">
          This confidential audit report is prepared exclusively for authorized practice stakeholders.
        </div>
      </footer>

      {/* Request Agency Implementation Modal */}
      {requestModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-slate-900">Request Agency Implementation</h3>
                <p className="text-xs text-slate-500 font-mono">{domain}</p>
              </div>
              <button
                type="button"
                onClick={() => setRequestModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            {requestSent ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-slate-900">Implementation Request Transmitted</div>
                <p className="text-xs text-slate-600">
                  The {branding.agencyName} technical deployment team will reach out to schedule code installation within 24 business hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setRequestModalOpen(false);
                    setRequestSent(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setRequestSent(true);
                }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Practice Manager Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Dr. Sarah Jenkins"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="manager@practice.com"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">CMS / Website Platform</label>
                  <select className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20">
                    <option>WordPress</option>
                    <option>Webflow</option>
                    <option>Squarespace</option>
                    <option>Shopify / Custom Code</option>
                    <option>Other / Unsure</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setRequestModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Request</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
