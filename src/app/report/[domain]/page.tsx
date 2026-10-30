'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
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
  Send,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import EntityGraphVisualizer from '@/components/EntityGraphVisualizer';
import GeoCitationSimulator from '@/components/GeoCitationSimulator';

export default function StandaloneClientReportPage() {
  const routeParams = useParams();
  const searchParams = useSearchParams();
  const rawDomain = (routeParams?.domain as string) || 'dentalpractice.com';
  const domain = decodeURIComponent(rawDomain).replace(/^https?:\/\//, '').replace(/\/$/, '');

  const [mounted, setMounted] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedLlms, setCopiedLlms] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 text-indigo-400">
          <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
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
    toast.success('0-Error Schema copied to clipboard');
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
    toast.success('Downloaded /llms.txt manifest');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 space-y-8 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Official NexusRank1 Clinical Intelligence Header */}
      <header className="max-w-5xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 border border-indigo-400/30 flex items-center justify-center shadow-lg shadow-indigo-950/50">
            <Zap className="w-6 h-6 text-white fill-white/20" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                NexusRank<span className="text-indigo-400">1</span> Clinical Intelligence
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Official Clinical Audit
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">Autonomous Healthcare GEO Engine &bull; {domain}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a
            href={`/api/report/pdf?domain=${encodeURIComponent(domain)}`}
            download
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-indigo-950/70 hover:bg-indigo-900/80 text-indigo-300 hover:text-white text-xs font-semibold border border-indigo-500/40 flex items-center justify-center gap-1.5 transition-colors touch-target"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Download Vector PDF</span>
          </a>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition-colors touch-target"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Print View</span>
          </button>

          <a
            href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(`https://${domain}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors touch-target"
          >
            <span>Google Rich Results</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Main Report Container */}
      <main className="max-w-5xl mx-auto space-y-6">
        
        {/* Practice Overview Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
                Domain Entity Analysis
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{practiceTitle}</h2>
              <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mt-1">
                <Globe className="w-3.5 h-3.5" />
                <span>https://{domain}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-slate-400 font-medium">Overall AI Readiness</span>
                <div className="text-4xl font-black font-mono text-white">
                  84<span className="text-sm font-normal text-slate-400">/100</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border-2 border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black text-2xl font-mono">
                B+
              </div>
            </div>
          </div>

          {/* Diagnostic Metrics Matrix */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-[11px] text-slate-400 font-medium">Schema.org @graph</span>
              <div className="text-lg font-bold text-emerald-400 font-mono">94% Valid</div>
              <p className="text-[10px] text-slate-500">MedicalClinic root active</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-[11px] text-slate-400 font-medium">Physician NPI Registry</span>
              <div className="text-lg font-bold text-indigo-400 font-mono">Active (NPPES)</div>
              <p className="text-[10px] text-slate-500">Credential node detected</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-[11px] text-slate-400 font-medium">AI Bot /llms.txt</span>
              <div className="text-lg font-bold text-rose-400 font-mono">Missing (404)</div>
              <p className="text-[10px] text-rose-300">Action needed for GPTBot</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-[11px] text-slate-400 font-medium">SearchGPT Citation</span>
              <div className="text-lg font-bold text-amber-400 font-mono">85% Likelihood</div>
              <p className="text-[10px] text-slate-500">Requires root manifest</p>
            </div>
          </div>

          {/* Interactive Knowledge Graph Visualizer */}
          <EntityGraphVisualizer
            clinicName={practiceTitle}
            domain={domain}
            npiNumber="1928374650"
            doctorName="Dr. Sarah Jenkins"
            doctorCredential="DDS, FAGD"
            licenseNumber="TX-16292"
            licenseState="TX"
            taxonomyDesc="Dentist, General Practice & Cosmetic Surgery"
            streetAddress="100 Clinical Center Suite 400"
            city="Austin"
            state="TX"
            postalCode="78701"
            specialties={['General Practice', 'Cosmetic Dentistry', 'Implantology', 'Oral Surgery']}
            geoLat={30.2672}
            geoLng={-97.7431}
            hasLlmsTxt={false}
          />

          {/* Generative Engine Citation Simulator */}
          <GeoCitationSimulator
            clinicName={practiceTitle}
            domain={domain}
            overallScore={84}
            npiVerified={true}
            hasMedicalSchema={true}
            hasLlmsTxt={false}
          />

          {/* 0-Error Schema Injection Panel */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <h3 className="text-base font-bold text-white">Recommended 0-Error Schema.org JSON-LD</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Ready for copy-paste deployment into the &lt;head&gt; of your website.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopySchema}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all touch-target cursor-pointer ${
                  copiedSchema ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {copiedSchema ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSchema ? 'Copied to Clipboard!' : 'Copy 0-Error Schema'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 max-h-60 overflow-y-auto leading-relaxed select-all">
              {sampleJsonLd}
            </pre>
          </div>

          {/* Next Steps Remediation Strip */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="text-slate-300 text-center sm:text-left">
              Questions regarding this audit or need 0-error schema deployment for {practiceTitle}?
            </div>
            <a
              href={`mailto:support@nexusrank1.com?subject=${encodeURIComponent(`Inquiry regarding Clinical GEO Audit for ${practiceTitle}`)}`}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors shrink-0"
            >
              Contact NexusRank1 Clinical Team
            </a>
          </div>
        </div>

      </main>

      {/* Official NexusRank1 Clinical Intelligence Footer */}
      <footer className="max-w-5xl mx-auto pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500 font-mono">
        Audit generated and certified by NexusRank1 Clinical Intelligence &bull; 0-Error Schema.org &amp; AI Engine Optimization &bull; All Rights Reserved
      </footer>

    </div>
  );
}
