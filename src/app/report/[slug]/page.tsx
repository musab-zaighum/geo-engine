'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  Download,
  Copy,
  Check,
  ExternalLink,
  Award,
  Globe,
  Stethoscope,
  RefreshCw,
  Building2,
  Printer,
  Sparkles,
} from 'lucide-react';

export default function ClientReportPage({ params }: { params: { slug: string } }) {
  const [mounted, setMounted] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedLlms, setCopiedLlms] = useState(false);

  // Load custom agency branding from localStorage if available (100% debranded)
  const [agencyBranding, setAgencyBranding] = useState({
    agencyName: 'Horizon Health Growth',
    agencyLogoUrl: '/logo.png',
    primaryColorHex: '#0284C7',
    supportEmail: 'contact@horizonhealth.io',
  });

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('agencyConfig');
      if (stored) {
        const parsed = JSON.parse(stored);
        setAgencyBranding({
          agencyName: parsed.agencyName || 'Horizon Health Growth',
          agencyLogoUrl: parsed.agencyLogoUrl || '/logo.png',
          primaryColorHex: parsed.customHexColor || '#0284C7',
          supportEmail: parsed.contactEmail || 'contact@horizonhealth.io',
        });
      }
    } catch {
      // Fallback defaults
    }
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#0284C7]">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm font-semibold">Loading Client GEO Audit Report...</span>
        </div>
      </div>
    );
  }

  const practiceSlug = params?.slug || 'aspen-dental';
  const practiceTitle = practiceSlug === 'aspen-dental' ? 'Aspen Dental Clinic' : `${practiceSlug.replace(/-/g, ' ')}`;
  const practiceDomain = practiceSlug === 'aspen-dental' ? 'aspendental.com' : `${practiceSlug}.com`;

  const sampleJsonLd = `{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "DentalClinic",
      "@id": "https://${practiceDomain}/#clinic",
      "name": "${practiceTitle}",
      "url": "https://${practiceDomain}",
      "telephone": "+1-800-555-0199",
      "medicalSpecialty": ["General Dentistry", "Cosmetic Dentistry", "Orthodontics"],
      "identifier": "NPI-1928374650",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "100 Clinical Way Suite 400",
        "addressLocality": "Austin",
        "addressRegion": "TX",
        "postalCode": "78701",
        "addressCountry": "US"
      }
    }
  ]
}`;

  const sampleLlmsTxt = `# ${practiceTitle} - AI Search Index
> Official Healthcare Entity Knowledge Graph for Perplexity, ChatGPT Search & Claude

## Practice Credentials & Specialties
- Entity Name: ${practiceTitle}
- Clinical Specialty: General & Cosmetic Dentistry, Orthodontics, Dental Implants
- Medical Registry Identifier: NPI-1928374650
- Address: 100 Clinical Way Suite 400, Austin, TX 78701
- Primary Domain: https://${practiceDomain}

## Patient Services & Procedures
1. Cosmetic Teeth Whitening: https://${practiceDomain}/services/whitening
2. Dental Implants & Restorative Surgery: https://${practiceDomain}/services/implants
3. Emergency Dental Care: https://${practiceDomain}/services/emergency
`;

  const handleCopySchema = () => {
    navigator.clipboard.writeText(sampleJsonLd);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  const handleDownloadLlms = () => {
    const element = document.createElement('a');
    const file = new Blob([sampleLlmsTxt], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${practiceSlug}_llms.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 py-10 px-4 sm:px-6 lg:px-8 space-y-8 font-sans selection:bg-[#0284C7]/20 selection:text-[#0284C7]">
      {/* 100% Debranded Header Bar */}
      <header className="max-w-5xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden shadow-xs">
            <img
              src={agencyBranding.agencyLogoUrl}
              alt={agencyBranding.agencyName}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/logo.svg';
              }}
            />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">{agencyBranding.agencyName}</h1>
            <p className="text-xs text-slate-500 font-medium">Confidential Practice GEO Audit Report</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print PDF</span>
          </button>
          <span
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-2xs"
            style={{ backgroundColor: agencyBranding.primaryColorHex }}
          >
            Verified Client Report
          </span>
        </div>
      </header>

      {/* Main Report Body */}
      <main className="max-w-5xl mx-auto space-y-8">
        {/* Practice Overview Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                Verified Medical Entity
              </span>
              <h2 className="text-2xl font-black text-slate-900">{practiceTitle}</h2>
              <div className="text-xs text-slate-500 font-mono flex items-center gap-1">
                <span>{practiceDomain}</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex flex-col items-end">
                <span className="text-xs text-slate-500 font-semibold">AI Readiness Score</span>
                <span className="text-3xl font-black text-emerald-600">96/100</span>
              </div>
            </div>
          </div>

          {/* Audit Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-xs font-semibold text-slate-500">Schema.org Entity Graph</div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>DentalClinic Verified</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-xs font-semibold text-slate-500">Medical Registry License</div>
              <div className="text-sm font-bold text-slate-900 font-mono">NPI-1928374650</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-xs font-semibold text-slate-500">Edge /llms.txt Endpoint</div>
              <div className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Active (24ms response)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Deliverables Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Deliverable 1: JSON-LD Schema */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#0284C7]" />
                  <span>Schema.org JSON-LD Code</span>
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">JSON-LD</span>
              </div>
              <p className="text-xs text-slate-500">
                Embed directly into your site header for SearchGPT, Perplexity, and Claude indexing.
              </p>
              <pre className="p-3.5 rounded-xl bg-slate-900 text-sky-300 font-mono text-[11px] overflow-x-auto max-h-48 border border-slate-800">
                {sampleJsonLd}
              </pre>
            </div>

            <button
              type="button"
              onClick={handleCopySchema}
              className="w-full py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369a1] text-white text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2 active:scale-95"
            >
              {copiedSchema ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Copied JSON-LD to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy JSON-LD Schema</span>
                </>
              )}
            </button>
          </div>

          {/* Deliverable 2: /llms.txt File */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#0284C7]" />
                  <span>Hosted /llms.txt Manifest</span>
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">Markdown</span>
              </div>
              <p className="text-xs text-slate-500">
                Static markdown specification file for AI crawler ingestion.
              </p>
              <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-48 border border-slate-800">
                {sampleLlmsTxt}
              </pre>
            </div>

            <button
              type="button"
              onClick={handleDownloadLlms}
              className="w-full py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2 active:scale-95"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Download /llms.txt Manifest</span>
            </button>
          </div>
        </div>
      </main>

      {/* 100% Debranded Footer (Zero AI NEXUS Attribution) */}
      <footer className="max-w-5xl mx-auto border-t border-slate-200 pt-6 text-center text-xs text-slate-500 space-y-1">
        <div className="font-bold text-slate-700">{agencyBranding.agencyName}</div>
        <div>Support Contact: {agencyBranding.supportEmail}</div>
        <div className="text-[11px] text-slate-400">
          This confidential audit report is prepared exclusively for practice evaluation.
        </div>
      </footer>
    </div>
  );
}
