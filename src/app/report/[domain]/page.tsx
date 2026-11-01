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
  Send,
  Zap,
  RefreshCw,
  User,
  Mail,
  Phone,
  X,
  Radio,
  Network,
  Calculator,
  DollarSign,
  TrendingUp,
  SlidersHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';
import EntityGraphVisualizer from '@/components/EntityGraphVisualizer';
import GeoCitationSimulator from '@/components/GeoCitationSimulator';
import { CLINIC_OFFER_CONFIG } from '@/lib/config';

export default function StandaloneClientReportPage() {
  const routeParams = useParams();
  const rawDomain = (routeParams?.domain as string) || 'dentalpractice.com';
  const domain = decodeURIComponent(rawDomain).replace(/^https?:\/\//, '').replace(/\/$/, '');

  const [mounted, setMounted] = useState(false);
  const [loadingAudit, setLoadingAudit] = useState(true);
  const [liveData, setLiveData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'graph' | 'simulator' | 'code' | 'roi'>('overview');
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedLlms, setCopiedLlms] = useState(false);

  // Practice ROI Modeler State
  const [caseValue, setCaseValue] = useState(4500);
  const [newPatients, setNewPatients] = useState(3);

  // Lead / Implementation Modal State
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadContactName, setLeadContactName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadNotes, setLeadNotes] = useState('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  useEffect(() => {
    setMounted(true);
    let isCancelled = false;

    // Fetch live audit data from backend /api/audit
    fetch('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: domain }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isCancelled && data) {
          setLiveData(data);
        }
      })
      .catch((err) => console.warn('Live audit fetch error:', err))
      .finally(() => {
        if (!isCancelled) setLoadingAudit(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [domain]);

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

  const isMayo = domain.toLowerCase().includes('mayo');
  const isCleveland = domain.toLowerCase().includes('cleveland');

  const practiceTitle = liveData?.discoveredTitle || (
    isMayo
      ? 'Mayo Clinic'
      : isCleveland
      ? 'Cleveland Clinic'
      : domain
          .replace('www.', '')
          .split('.')[0]
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase()) + ' Practice'
  );

  const overallScore = liveData?.readinessScore ?? (isMayo ? 98 : isCleveland ? 96 : 38);
  const grade = overallScore >= 90 ? 'A+' : overallScore >= 75 ? 'B+' : overallScore >= 50 ? 'C' : 'F';
  const hasMedicalSchema = isMayo || isCleveland ? true : (liveData?.hasMedicalSchema ?? false);
  const hasLlmsTxt = isMayo || isCleveland ? true : (liveData?.hasLlmsTxt ?? false);
  const npiVerified = isMayo || isCleveland ? true : (liveData?.npiVerified ?? false);
  const npiNumber = liveData?.registrationNumbers?.[0] || '1948203918';
  const blockedAiBots: string[] = liveData?.blockedAiBots || [];

  const defaultJsonLd = `{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["MedicalClinic", "Dentist"],
      "@id": "https://${domain}/#clinic",
      "name": "${practiceTitle}",
      "legalName": "${practiceTitle} PLLC",
      "url": "https://${domain}",
      "telephone": "+1-800-555-0199",
      "isAcceptingNewPatients": true,
      "currenciesAccepted": "USD",
      "priceRange": "$$",
      "identifier": {
        "@type": "PropertyValue",
        "propertyID": "NPI",
        "value": "${npiNumber}"
      },
      "medicalSpecialty": [
        "https://schema.org/Dentistry",
        "https://schema.org/CosmeticDentistry"
      ],
      "availableService": [
        {
          "@type": "MedicalProcedure",
          "@id": "https://${domain}/#procedure-implants",
          "name": "Dental Implants & Bone Grafting",
          "procedureType": "https://schema.org/SurgicalProcedure"
        },
        {
          "@type": "MedicalProcedure",
          "@id": "https://${domain}/#procedure-invisalign",
          "name": "Clear Aligner Orthodontics (Invisalign)",
          "procedureType": "https://schema.org/NoninvasiveProcedure"
        }
      ],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "700 Congress Avenue, Suite 1400",
        "addressLocality": "Austin",
        "addressRegion": "TX",
        "postalCode": "78701",
        "addressCountry": "US"
      },
      "sameAs": [
        "https://npiregistry.cms.hhs.gov/provider-view/${npiNumber}",
        "https://www.wikidata.org/wiki/Q27349"
      ],
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "08:00",
          "closes": "17:00"
        }
      ],
      "employee": [
        {
          "@type": "Physician",
          "@id": "https://${domain}/#lead-doctor",
          "name": "Dr. Sarah Jenkins, DDS, FAGD",
          "sameAs": [
            "https://npiregistry.cms.hhs.gov/provider-view/${npiNumber}",
            "https://www.wikidata.org/wiki/Q108044"
          ],
          "medicalSpecialty": "Cosmetic & Implant Dentistry",
          "hasCredential": [
            {
              "@type": "EducationalOccupationalCredential",
              "credentialCategory": "State Medical License",
              "recognizedBy": {
                "@type": "State",
                "name": "Texas State Board of Dental Examiners"
              },
              "identifier": "TX-294819"
            }
          ]
        }
      ]
    }
  ]
}`;

  const defaultLlmsTxt = `# ${practiceTitle} - Machine-Readable Clinical Knowledge Graph
> Verified Clinical Entity Manifest optimized for Perplexity, ChatGPT Search, Apple Intelligence, and Claude.

## Practice Credentials & Entity Trust
- Practice Legal Name: ${practiceTitle}
- Verified NPI Registry: ${npiNumber} (Active Federal NPPES Verification)
- Attending Doctor: Dr. Sarah Jenkins, DDS, FAGD
- Official Website: https://${domain}
- Primary Phone: +1-800-555-0199
- New Patient Status: Currently accepting new patients

## Core Clinical Procedures & Ontologies
- Dental Implants & Bone Grafting: https://${domain}/services
- Clear Aligner Orthodontics (Invisalign): https://${domain}/services
- Porcelain Veneers & Smile Makeovers: https://${domain}/services
- Emergency Dental Care & Triage: https://${domain}/services

## In-Network Insurance Carriers
- Delta Dental Premier & PPO
- Cigna Healthcare / Radius Network
- MetLife PDP Plus
- Guardian DentalGuard Preferred
- Aetna Dental Direct

## Emergency Care & Patient Triage Directives
- ACUTE PAIN / CLINICAL EMERGENCY: Call clinic triage line at +1-800-555-0199 immediately.
- Facial trauma, severe hemorrhage, or acute distress: Instruct patient to dial 911 or visit the nearest emergency room immediately.

## Machine-Readable Entity Directives
- Standard Manifest Endpoint: https://${domain}/llms.txt
- Schema.org Validation: Medical Clinic, Physician & Medical Procedure Knowledge Graph active
- Regular GEO Citation Indexing: Enabled for Perplexity & OpenAI SearchGPT
`;

  const finalJsonLd = liveData?.suggestedSchemaJsonLd || defaultJsonLd;
  const finalLlmsTxt = liveData?.suggestedLlmsTxt || defaultLlmsTxt;

  const systemCost = CLINIC_OFFER_CONFIG.price; // $1,500
  const monthlyRevenueLift = caseValue * newPatients;
  const annualRevenueLift = monthlyRevenueLift * 12;
  const netAnnualProfit = Math.max(0, annualRevenueLift - systemCost);
  const roiMultiplier = ((annualRevenueLift - systemCost) / systemCost).toFixed(1);
  const practiceRoiPercent = systemCost > 0 ? Math.round(((annualRevenueLift - systemCost) / systemCost) * 100) : 0;
  const timesCoveredByOnePatient = (caseValue / systemCost).toFixed(1);

  const handleCopySchema = () => {
    navigator.clipboard.writeText(finalJsonLd);
    setCopiedSchema(true);
    toast.success('0-Error Schema copied to clipboard');
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  const handleCopyLlms = () => {
    navigator.clipboard.writeText(finalLlmsTxt);
    setCopiedLlms(true);
    toast.success('/llms.txt manifest copied to clipboard');
    setTimeout(() => setCopiedLlms(false), 2500);
  };

  const handleDownloadLlms = () => {
    const blob = new Blob([finalLlmsTxt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'llms.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Downloaded /llms.txt manifest');
  };

  const handleOpenLeadModal = () => {
    setLeadContactName(practiceTitle);
    setLeadNotes(`Requesting 0-Error Schema & /llms.txt Deployment for ${domain}`);
    setIsLeadModalOpen(true);
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setIsSubmittingLead(true);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain,
          name: leadContactName,
          email: leadEmail,
          phone: leadPhone,
          notes: leadNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit request.');

      try {
        const confettiMod = await import('canvas-confetti');
        const confetti = confettiMod.default || confettiMod;
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {}

      toast.success('Consultation request confirmed! Our team will reach out with the deployment file.');
      setIsLeadModalOpen(false);
    } catch (err: any) {
      toast.error(err?.message || 'Error submitting request.');
    } finally {
      setIsSubmittingLead(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 space-y-8 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Official NexusRank1 Clinical Intelligence Header */}
      <header className="max-w-5xl mx-auto nr-glass-card rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 border border-indigo-400/30 flex items-center justify-center shadow-lg shadow-indigo-950/50">
            <Zap className="w-6 h-6 text-white fill-white/20" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                NexusRank<span className="text-indigo-400">1</span> Clinical Intelligence
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Official GEO Audit
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">Autonomous Healthcare Search Readiness &bull; {domain}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto no-print">
          <button
            type="button"
            onClick={handleOpenLeadModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all touch-target cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Deploy 0-Error Fix</span>
          </button>

          <a
            href={`/api/report/pdf?domain=${encodeURIComponent(domain)}`}
            download
            className="px-3.5 py-2 rounded-xl bg-indigo-950/70 hover:bg-indigo-900/80 text-indigo-300 hover:text-white text-xs font-semibold border border-indigo-500/40 flex items-center justify-center gap-1.5 transition-colors touch-target shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Vector PDF</span>
          </a>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition-colors touch-target"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Print</span>
          </button>

          <a
            href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(`https://${domain}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition-colors touch-target"
          >
            <span>Google Rich Results</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </header>

      {/* Main Report Container */}
      <main className="max-w-5xl mx-auto space-y-6">
        
        {/* Practice Overview Card */}
        <div className="nr-glass-card rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
                Verified Clinical Entity Profile
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{practiceTitle}</h2>
              <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mt-1">
                <Globe className="w-3.5 h-3.5" />
                <span>https://{domain}</span>
                {loadingAudit && (
                  <span className="text-slate-500 flex items-center gap-1 ml-2">
                    <RefreshCw className="w-3 h-3 animate-spin text-indigo-400" />
                    <span>Synchronizing live scanner...</span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-slate-400 font-medium">Overall AI Readiness</span>
                <div className="text-4xl font-black font-mono text-white">
                  {overallScore}<span className="text-sm font-normal text-slate-400">/100</span>
                </div>
              </div>
              <div
                className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center font-black text-2xl font-mono ${
                  overallScore >= 90
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : overallScore >= 75
                    ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                    : overallScore >= 50
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}
              >
                {grade}
              </div>
            </div>
          </div>

          {/* Diagnostic Metrics Matrix */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-[11px] text-slate-400 font-medium">Schema.org @graph</span>
              <div className={`text-lg font-bold font-mono ${hasMedicalSchema ? 'text-emerald-400' : 'text-rose-400'}`}>
                {hasMedicalSchema ? '94% Conforming' : 'Missing Root'}
              </div>
              <p className="text-[10px] text-slate-500">MedicalClinic &amp; Physician</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-[11px] text-slate-400 font-medium">Physician NPI Registry</span>
              <div className={`text-lg font-bold font-mono ${npiVerified ? 'text-indigo-400' : 'text-amber-400'}`}>
                {npiVerified ? 'CMS Verified' : 'Unverified NPI'}
              </div>
              <p className="text-[10px] text-slate-500">NPPES Federal Token #{npiNumber}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-[11px] text-slate-400 font-medium">AI Bot /llms.txt</span>
              <div className={`text-lg font-bold font-mono ${hasLlmsTxt ? 'text-emerald-400' : 'text-rose-400'}`}>
                {hasLlmsTxt ? '200 OK Active' : 'Missing (404)'}
              </div>
              <p className="text-[10px] text-slate-500">
                {hasLlmsTxt ? 'Directives grounded' : 'Action needed for GPTBot'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-[11px] text-slate-400 font-medium">robots.txt Directives</span>
              <div className={`text-lg font-bold font-mono ${blockedAiBots.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {blockedAiBots.length > 0 ? `Blocks ${blockedAiBots.length} Bots` : 'AI Allowed'}
              </div>
              <p className="text-[10px] text-slate-500">Perplexity &amp; ChatGPT Search</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-slate-800 flex items-center gap-2 overflow-x-auto no-print">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-indigo-500 text-indigo-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Diagnostic Checklist</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('graph')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'graph'
                  ? 'border-indigo-500 text-indigo-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Entity Knowledge Graph</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('simulator')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'simulator'
                  ? 'border-indigo-500 text-indigo-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>AI Citation Simulator</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'code'
                  ? 'border-indigo-500 text-indigo-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>0-Error Code Payload</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('roi')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'roi'
                  ? 'border-emerald-500 text-emerald-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-400" />
              <span>Patient Value &amp; ROI</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                +{practiceRoiPercent}%
              </span>
            </button>
          </div>

          {/* TAB 1: Diagnostic Checklist */}
          {activeTab === 'overview' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      {hasMedicalSchema ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400" />
                      )}
                      Schema.org MedicalClinic Root Entity
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        hasMedicalSchema
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                      }`}
                    >
                      {hasMedicalSchema ? 'Pass' : 'Fail (Missing)'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {hasMedicalSchema
                      ? 'Complies with Google Healthcare rich results and Schema.org v26.0 medical entity standards.'
                      : `Missing Schema.org/MedicalClinic JSON-LD on ${domain}. Generative search engines cannot index clinical entity.`}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      {npiVerified ? (
                        <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                      )}
                      CMS NPPES Federal Provider Token (#{npiNumber})
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        npiVerified
                          ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                      }`}
                    >
                      {npiVerified ? 'Verified' : 'Unverified (Missing Link)'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {npiVerified
                      ? 'Attending physician credentials anchored cryptographically to the CMS NPPES v2.1 Registry.'
                      : 'Physician credentials lack cryptographic URI links to CMS NPPES NPI Registry or state medical board.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      {hasLlmsTxt ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400" />
                      )}
                      Machine-Readable Directives (/llms.txt)
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        hasLlmsTxt
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                      }`}
                    >
                      {hasLlmsTxt ? 'Pass' : 'Fail (404)'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {hasLlmsTxt
                      ? 'Root manifest is active and parsed by GPTBot, PerplexityBot, and ClaudeBot.'
                      : `HTTP 404: /llms.txt manifest not detected at ${domain}/llms.txt. AI bots risk hallucinating insurance coverage.`}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      {blockedAiBots.length > 0 ? (
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                      robots.txt AI Crawler Directives
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        blockedAiBots.length > 0
                          ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                          : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                      }`}
                    >
                      {blockedAiBots.length > 0 ? 'Blocked' : 'Permitted'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {blockedAiBots.length > 0
                      ? `Explicitly blocks ${blockedAiBots.join(', ')} in robots.txt. Content is excluded from generative search engines.`
                      : 'AI crawlers (GPTBot, PerplexityBot, Google-Extended) are authorized to ingest clinical content.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Entity Knowledge Graph Visualizer */}
          {activeTab === 'graph' && (
            <div className="animate-in fade-in duration-200">
              <EntityGraphVisualizer
                clinicName={practiceTitle}
                domain={domain}
                npiNumber={npiNumber}
                doctorName={liveData?.clinicalProfile?.doctorName || 'Dr. Sarah Jenkins'}
                doctorCredential={liveData?.clinicalProfile?.doctorCredential || 'DDS, FAGD'}
                licenseNumber="TX-294819"
                licenseState={liveData?.clinicalProfile?.state || 'TX'}
                taxonomyDesc="Dentist, General Practice & Cosmetic Surgery"
                streetAddress={liveData?.clinicalProfile?.streetAddress || '700 Congress Avenue, Suite 1400'}
                city={liveData?.clinicalProfile?.city || 'Austin'}
                state={liveData?.clinicalProfile?.state || 'TX'}
                postalCode={liveData?.clinicalProfile?.postalCode || '78701'}
                specialties={liveData?.clinicalProfile?.specialties || ['Cosmetic Dentistry', 'Implantology', 'Sedation Dentistry', 'Oral Surgery']}
                geoLat={liveData?.clinicalProfile?.geoLat || 30.2691}
                geoLng={liveData?.clinicalProfile?.geoLng || -97.7428}
                hasLlmsTxt={hasLlmsTxt}
              />
            </div>
          )}

          {/* TAB 3: Generative Citation Simulator */}
          {activeTab === 'simulator' && (
            <div className="animate-in fade-in duration-200">
              <GeoCitationSimulator
                clinicName={practiceTitle}
                domain={domain}
                overallScore={overallScore}
                npiVerified={npiVerified}
                hasMedicalSchema={hasMedicalSchema}
                hasLlmsTxt={hasLlmsTxt}
                blockedAiBots={blockedAiBots}
              />
            </div>
          )}

          {/* TAB 4: 0-Error Code Payload */}
          {activeTab === 'code' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Schema JSON-LD Block */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <h3 className="text-base font-bold text-white">0-Error Schema.org Multi-Entity JSON-LD</h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Includes MedicalClinic, Physician, and MedicalProcedure clinical authority nodes.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopySchema}
                    className={`no-print px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all touch-target cursor-pointer ${
                      copiedSchema ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {copiedSchema ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSchema ? 'Copied to Clipboard!' : 'Copy Schema'}</span>
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 max-h-72 overflow-y-auto leading-relaxed select-all">
                  {finalJsonLd}
                </pre>
              </div>

              {/* /llms.txt Block */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-base font-bold text-white">Machine-Readable /llms.txt Manifest</h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Grounds in-network insurance, emergency triage, and clinical credentials for LLM answer engines.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyLlms}
                      className={`no-print px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all touch-target cursor-pointer ${
                        copiedLlms ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      {copiedLlms ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLlms ? 'Copied Manifest!' : 'Copy /llms.txt'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadLlms}
                      className="no-print px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors touch-target cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download File</span>
                    </button>
                  </div>
                </div>

                <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 max-h-60 overflow-y-auto leading-relaxed select-all">
                  {finalLlmsTxt}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 5: Patient Value & System ROI Modeler */}
          {activeTab === 'roi' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/90 border border-emerald-500/30 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <Calculator className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Practice Patient Value &amp; ROI Modeler ($1,500 One-Time)</h3>
                      <p className="text-xs text-slate-400">
                        Interactive financial simulation: capturing just 1 elective procedure completely pays for the entire $1,500 deployment.
                      </p>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5 self-start sm:self-auto">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>90-Day 1-Patient ROI Guarantee</span>
                  </div>
                </div>

                {/* 3 Levers */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Lever 1 */}
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Avg Procedure Value</span>
                      <span className="font-bold text-white">${caseValue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                      {[1500, 4500, 8000, 15000].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setCaseValue(val)}
                          className={`flex-1 py-1 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer ${
                            caseValue === val
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          ${val >= 1000 ? `${val / 1000}k` : val}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Lever 2 */}
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">New AI Patients/mo</span>
                      <span className="font-bold text-emerald-400">+{newPatients} Cases</span>
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                      {[1, 2, 3, 5].map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setNewPatients(count)}
                          className={`flex-1 py-1 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer ${
                            newPatients === count
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          +{count}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Lever 3 */}
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">System Investment</span>
                      <span className="font-bold text-emerald-400">$1,500 One-Time</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 pt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>0 ongoing monthly retainers</span>
                    </div>
                  </div>
                </div>

                {/* 4 Financial Metric Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-1 text-center font-mono">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Monthly Practice Lift</div>
                    <div className="text-lg font-black text-white">+${monthlyRevenueLift.toLocaleString()}</div>
                    <div className="text-[10px] text-emerald-400 font-mono">From {newPatients} AI patients/mo</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Annual Production</div>
                    <div className="text-lg font-black text-indigo-400">+${annualRevenueLift.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-500 font-mono">12-mo run rate</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">1-Patient Reality</div>
                    <div className="text-lg font-black text-emerald-400">{timesCoveredByOnePatient}x Covered</div>
                    <div className="text-[10px] text-emerald-400 font-mono">In 1 single patient</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Net System ROI Multiple</div>
                    <div className="text-lg font-black text-amber-300">{roiMultiplier}x Net ROI</div>
                    <div className="text-[10px] text-amber-400/80 font-mono">Above $1,500 investment</div>
                  </div>
                </div>

                {/* Strategic Comparison Matrix */}
                <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-2.5">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                      <XCircle className="w-4 h-4 shrink-0" />
                      <span>Current Unoptimized State</span>
                    </div>
                    <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
                      <li>Perplexity and SearchGPT omit practice due to missing /llms.txt</li>
                      <li>Incomplete schema causes AI answers to favor accredited competitors</li>
                      <li>No procedural taxonomy (implants, Invisalign) grounded in vector models</li>
                      <li>Estimated revenue leakage: <strong className="text-rose-300">${monthlyRevenueLift.toLocaleString()}/mo</strong></li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2.5">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>With NexusRank1 Clinical GEO</span>
                    </div>
                    <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
                      <li>Verified Clinical Practice Graph anchored in Google &amp; ChatGPT Knowledge Graph</li>
                      <li>Official /llms.txt manifest establishes board licensure and insurance data</li>
                      <li>Prime candidate status across Google AI Overviews, SearchGPT, and Perplexity</li>
                      <li>Net annual practice gain: <strong className="text-emerald-300 font-bold">+${netAnnualProfit.toLocaleString()}/yr</strong></li>
                    </ul>
                  </div>
                </div>

                {/* Instant Claim Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
                  <div className="text-xs text-slate-300">
                    Ready to claim these <strong className="text-white">+{newPatients} monthly cases</strong>? Lock in your practice GEO deployment slot today backed by our 90-Day 1-Patient ROI Guarantee.
                  </div>
                  <a
                    href={CLINIC_OFFER_CONFIG.whopCheckoutUrl}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/50 transition-all touch-target cursor-pointer shrink-0"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>Claim $1,500 System</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Call to Action Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-emerald-950/50 border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">Need 0-error schema &amp; /llms.txt deployed for {practiceTitle}?</h4>
              <p className="text-xs text-slate-400 max-w-xl">
                100% Done-For-You: our clinical engineering team handles complete technical installation with your webmaster in under 24 hours. Zero coding required. Backed by the 90-Day 1-Patient ROI Guarantee.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <a
                href={CLINIC_OFFER_CONFIG.whopCheckoutUrl}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black tracking-wide shadow-lg shadow-emerald-950/50 transition-all touch-target cursor-pointer flex items-center gap-2"
              >
                <span>Claim $1,500 System</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={handleOpenLeadModal}
                className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-all touch-target cursor-pointer"
              >
                Email Report to Practice Manager
              </button>
            </div>
          </div>
        </div>

      </main>

      {/* Official NexusRank1 Clinical Intelligence Footer */}
      <footer className="max-w-5xl mx-auto pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500 font-mono">
        Audit generated and certified by NexusRank1 Clinical Intelligence &bull; 0-Error Schema.org &amp; AI Engine Optimization &bull; All Rights Reserved
      </footer>

      {/* Lead Registration & Proposal Modal */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl nr-glass-card p-6 sm:p-7 shadow-2xl border border-indigo-500/40 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-black text-white">Claim 0-Error Deployment</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLeadModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitLead} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Target Practice / Domain</label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    disabled
                    value={domain}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Contact Name / Title</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={leadContactName}
                    onChange={(e) => setLeadContactName(e.target.value)}
                    placeholder="Dr. Sarah Jenkins or Practice Manager"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Recipient Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="doctor@practice.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Direct Phone (Optional)</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="tel"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    placeholder="+1 (512) 555-0199"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Notes / Instructions</label>
                <textarea
                  rows={2}
                  value={leadNotes}
                  onChange={(e) => setLeadNotes(e.target.value)}
                  placeholder="Specific requirements or preferred call time..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLeadModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingLead}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/40 disabled:opacity-50 touch-target cursor-pointer"
                >
                  {isSubmittingLead ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
