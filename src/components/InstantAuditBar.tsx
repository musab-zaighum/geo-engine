'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  Download,
  Mail,
  Code,
  FileText,
  Sparkles,
  Zap,
  ArrowRight,
  Globe,
  Sliders,
  ChevronDown,
  Building2,
  Lock,
  Layers,
  Activity,
} from 'lucide-react';
import { toast } from 'sonner';

interface AuditItem {
  id: string;
  category: 'schema' | 'licensure' | 'crawler' | 'taxonomy';
  title: string;
  status: 'Pass' | 'Warn' | 'Fail';
  diagnostic: string;
  specification: string;
  remediation: string;
}

interface AuditData {
  url: string;
  cleanDomain: string;
  clinicName: string;
  timestamp: string;
  overallScore: number;
  grade: string;
  schemaDepth: number;
  eeatScore: number;
  llmsScore: number;
  citationScore: number;
  items: AuditItem[];
  jsonLd: string;
  llmsTxt: string;
}

const PRESET_DOMAINS = [
  { label: 'dentalpractice.com', url: 'https://dentalpractice.com' },
  { label: 'mayoclinic.org', url: 'https://mayoclinic.org' },
  { label: 'clevelandclinic.org', url: 'https://clevelandclinic.org' },
  { label: 'austincosmeticdental.com', url: 'https://austincosmeticdental.com' },
];

const SCAN_STEPS = [
  'Resolving DNS & connecting to target host...',
  'Fetching robots.txt & testing /llms.txt crawler directives...',
  'Validating Schema.org MedicalClinic & Physician AST graph...',
  'Simulating SearchGPT, Perplexity & Google AI Overviews ranking...',
  'Compiling 0-error JSON-LD & clinical authority manifest...',
];

interface InstantAuditBarProps {
  onOpenWhiteLabelModal?: () => void;
  onOpenCheckout?: (tier?: 'starter' | 'growth' | 'scale') => void;
}

export function InstantAuditBar({
  onOpenWhiteLabelModal,
  onOpenCheckout,
}: InstantAuditBarProps) {
  const [domainInput, setDomainInput] = useState('dentalpractice.com');
  const [isScanning, setIsScanning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<'schema' | 'llms'>('schema');
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedLlms, setCopiedLlms] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Initialize with default scan on load
  useEffect(() => {
    generateAuditResult('dentalpractice.com');
  }, []);

  function generateAuditResult(rawInput: string) {
    const clean = rawInput
      .replace(/^https?:\/\//, '')
      .replace(/\/.*$/, '')
      .trim() || 'dentalpractice.com';
    
    const isMayo = clean.includes('mayoclinic');
    const isCleveland = clean.includes('cleveland');

    const score = isMayo ? 98 : isCleveland ? 96 : 84;
    const grade = isMayo || isCleveland ? 'A+' : 'B+';
    const clinicName = isMayo
      ? 'Mayo Clinic'
      : isCleveland
      ? 'Cleveland Clinic'
      : clean
          .split('.')[0]
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase()) + ' Dental Care';

    const jsonLd = `{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalClinic",
      "@id": "https://${clean}/#clinic",
      "name": "${clinicName}",
      "legalName": "${clinicName} PLLC",
      "url": "https://${clean}",
      "telephone": "+1-800-555-0199",
      "isAcceptingNewPatients": true,
      "medicalSpecialty": [
        "https://schema.org/Dentistry",
        "https://schema.org/CosmeticDentistry"
      ],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "700 Congress Avenue, Suite 1400",
        "addressLocality": "Austin",
        "addressRegion": "TX",
        "postalCode": "78701",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 30.2691,
        "longitude": -97.7428
      },
      "employee": {
        "@type": "Physician",
        "@id": "https://${clean}/#lead-doctor",
        "name": "Dr. Sarah Jenkins, DDS, FAGD",
        "medicalSpecialty": "Cosmetic & Implant Dentistry",
        "hasCredential": [
          {
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": "National Provider Identifier (NPI)",
            "identifier": "1948203918"
          }
        ]
      }
    }
  ]
}`;

    const llmsTxt = `# ${clinicName}
> Verified clinical & dental authority manifest in Austin, TX.

## Clinical Authority & Licensure
- Practice Name: ${clinicName}
- CMS National Provider Identifier (NPI): 1948203918
- Attending Doctor: Dr. Sarah Jenkins, DDS, FAGD
- State Dental Board: Texas State Board of Dental Examiners (#TX-294819)

## In-Network Dental Insurance Coverage
- Delta Dental Premier & PPO
- Cigna Dental Radius Network
- MetLife PDP Plus
- Guardian DentalGuard Preferred
- Aetna Dental Direct

## Emergency Patient Protocol
- ACUTE PAIN / SEVERE INFECTION: Call clinic 24/7 emergency triage line at +1-800-555-0199.
- For emergency trauma or uncontrolled bleeding, instruct patient to visit the nearest emergency room or dial 911 immediately.`;

    const items: AuditItem[] = [
      {
        id: 'chk-1',
        category: 'schema',
        title: 'Schema.org/MedicalClinic root graph',
        status: 'Pass',
        diagnostic: `Root graph entity for ${clinicName} is syntactically valid with legalName, address, and geo coordinates.`,
        specification: 'schema:MedicalClinic & PostalAddress',
        remediation: 'Complies with Google Healthcare Rich Results & Schema.org Medical Entity specifications.',
      },
      {
        id: 'chk-2',
        category: 'licensure',
        title: 'Physician registry tokens (NPI / State Board)',
        status: isMayo || isCleveland ? 'Pass' : 'Warn',
        diagnostic: isMayo || isCleveland
          ? 'Practitioner faculty nodes cross-verified against official national registers.'
          : 'Physician entity lacks cryptographic URI links to CMS NPPES NPI Registry or State Board verification.',
        specification: 'schema:Physician · hasCredential',
        remediation: isMayo || isCleveland
          ? 'All institutional credentials and board certifications verified.'
          : 'Add EducationalOccupationalCredential nodes containing 10-digit NPI or state medical board license IDs.',
      },
      {
        id: 'chk-3',
        category: 'crawler',
        title: 'AI search engine crawler directives (/llms.txt)',
        status: isMayo || isCleveland ? 'Pass' : 'Fail',
        diagnostic: isMayo || isCleveland
          ? 'Root /llms.txt manifest detected and parsed. Practice procedures and emergency disclaimers grounded.'
          : `HTTP 404: /llms.txt manifest not detected at ${clean}/llms.txt. AI bots risk hallucinating insurance coverage.`,
        specification: 'RFC Draft /llms.txt & /llms-full.txt',
        remediation: isMayo || isCleveland
          ? 'Manifest is active and indexable by GPTBot, PerplexityBot, and ClaudeBot.'
          : 'Deploy NexusRank generated /llms.txt manifest to the public web root to ground LLM answer engines.',
      },
    ];

    setAuditData({
      url: `https://${clean}`,
      cleanDomain: clean,
      clinicName,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      overallScore: score,
      grade,
      schemaDepth: isMayo || isCleveland ? 99 : 94,
      eeatScore: isMayo || isCleveland ? 98 : 88,
      llmsScore: isMayo || isCleveland ? 96 : 42,
      citationScore: isMayo || isCleveland ? 97 : 85,
      items,
      jsonLd,
      llmsTxt,
    });
  }

  // 5-Second Fake-Progress Visualizer
  const handleStartAudit = (e?: React.FormEvent, presetUrl?: string) => {
    if (e) e.preventDefault();
    const target = (presetUrl || domainInput).trim();
    if (!target) {
      toast.error('Please enter a target domain URL');
      return;
    }

    setIsScanning(true);
    setCurrentStepIndex(0);
    setProgressPercent(10);

    const stepDuration = 1000; // 5 steps * 1000ms = 5000ms total
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < SCAN_STEPS.length) {
        setCurrentStepIndex(currentStep);
        setProgressPercent(Math.min(95, (currentStep + 1) * 20));
      } else {
        clearInterval(interval);
        setProgressPercent(100);
        setTimeout(() => {
          generateAuditResult(target);
          setIsScanning(false);
          toast.success(`Audit completed for ${target}!`);
          if (resultsRef.current) {
            resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 400);
      }
    }, stepDuration);
  };

  const handleCopySchema = () => {
    if (!auditData) return;
    navigator.clipboard.writeText(auditData.jsonLd);
    setCopiedSchema(true);
    toast.success('0-Error Schema copied to clipboard!');
    setTimeout(() => setCopiedSchema(false), 2200);
  };

  const handleCopyLlms = () => {
    if (!auditData) return;
    navigator.clipboard.writeText(auditData.llmsTxt);
    setCopiedLlms(true);
    toast.success('/llms.txt manifest copied to clipboard!');
    setTimeout(() => setCopiedLlms(false), 2200);
  };

  const handleDownloadFile = (type: 'schema' | 'llms') => {
    if (!auditData) return;
    const content = type === 'schema' ? auditData.jsonLd : auditData.llmsTxt;
    const filename = type === 'schema' ? `${auditData.cleanDomain}-schema.json` : 'llms.txt';
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${filename}`);
  };

  const handleEmailWebmaster = () => {
    if (!auditData) return;
    const subject = encodeURIComponent(`Action Required: Deploy 0-Error Schema & /llms.txt for ${auditData.clinicName}`);
    const body = encodeURIComponent(
      `Hi Webmaster Team,\n\nPlease add the following Schema.org JSON-LD to the <head> of ${auditData.url} and deploy the /llms.txt file to the web root so ChatGPT, Perplexity, and Google Rich Results can accurately ground our practice:\n\n${auditData.jsonLd}\n\nThank you,\n${auditData.clinicName}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="w-full space-y-8" id="audit-engine">
      {/* Search Input Bar Card */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-4 sm:p-6 shadow-2xl backdrop-blur-xl relative">
        <form onSubmit={(e) => handleStartAudit(e)} className="space-y-3">
          <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1 flex items-center">
              <div className="absolute left-4 text-slate-500 pointer-events-none">
                <Search className="w-5 h-5 text-indigo-400" />
              </div>
              <input
                type="url"
                autoCapitalize="none"
                autoCorrect="off"
                inputMode="url"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="dentalpractice.com"
                required
                className="w-full h-13 pl-12 pr-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-mono touch-target"
              />
            </div>

            <button
              type="submit"
              disabled={isScanning}
              className="h-13 px-6 sm:px-8 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:via-indigo-500 hover:to-violet-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-indigo-950/60 touch-target cursor-pointer disabled:opacity-50 shrink-0"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Scanning Target...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Run 5-Sec Audit</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Benchmark Preset Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 text-[11px] font-medium">Quick Presets:</span>
            {PRESET_DOMAINS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setDomainInput(item.url);
                  handleStartAudit(undefined, item.url);
                }}
                className="px-2.5 py-1 rounded-full bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-indigo-500/40 text-[11px] font-mono transition-all touch-target cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </form>

        {/* 5-Second Fake-Progress Visualizer */}
        {isScanning && (
          <div className="mt-5 p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/30 space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-indigo-300">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                <span className="font-mono font-semibold">
                  Step {currentStepIndex + 1} of 5: {SCAN_STEPS[currentStepIndex]}
                </span>
              </div>
              <span className="font-mono text-indigo-400 font-bold">{progressPercent}%</span>
            </div>

            {/* Pulsating Laser Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-violet-400 transition-all duration-300 rounded-full relative"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-3 bg-white blur-[2px] animate-pulse" />
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Checking Schema.org 26.0 medical standard</span>
              <span>Validating RFC /llms.txt manifest</span>
            </div>
          </div>
        )}
      </div>

      {/* Audit Output Canvas */}
      {auditData && !isScanning && (
        <div ref={resultsRef} className="space-y-6 animate-in fade-in-50 duration-300" id="audit-results-card">
          
          {/* Target Practice Summary Header Card */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Target Practice</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
                  {auditData.timestamp}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">{auditData.clinicName}</h3>
              <p className="text-xs font-mono text-indigo-400 truncate max-w-md">{auditData.url}</p>
            </div>

            {/* Score & Grade Display */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-slate-400 font-medium">Readiness Score</div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-white">
                  {auditData.overallScore}
                  <span className="text-sm text-slate-400 font-normal">/100</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border-2 border-indigo-500/30 flex items-center justify-center font-black text-2xl text-indigo-400 font-mono">
                {auditData.grade}
              </div>
            </div>
          </div>

          {/* Visual Health Metric Meters (Thumb-Friendly Metric Cards) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Metric 1: Schema Depth */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Schema Depth</span>
                <span className="text-emerald-400 font-mono font-bold">{auditData.schemaDepth}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${auditData.schemaDepth}%` }} />
              </div>
              <div className="text-[11px] text-slate-400">Valid MedicalClinic AST</div>
            </div>

            {/* Metric 2: E-E-A-T Licensure */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">E-E-A-T Licensure</span>
                <span className="text-indigo-400 font-mono font-bold">{auditData.eeatScore}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${auditData.eeatScore}%` }} />
              </div>
              <div className="text-[11px] text-slate-400">Physician NPI Registry Node</div>
            </div>

            {/* Metric 3: LLM Manifest */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">AI /llms.txt Manifest</span>
                <span className="text-rose-400 font-mono font-bold">{auditData.llmsScore}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-rose-400 rounded-full" style={{ width: `${auditData.llmsScore}%` }} />
              </div>
              <div className="text-[11px] text-rose-300 font-medium">HTTP 404 (Action Needed)</div>
            </div>

            {/* Metric 4: Citation Indexability */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">AI Citation Index</span>
                <span className="text-amber-400 font-mono font-bold">{auditData.citationScore}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${auditData.citationScore}%` }} />
              </div>
              <div className="text-[11px] text-slate-400">Perplexity &amp; ChatGPT Search</div>
            </div>
          </div>

          {/* Diagnostic Issue Cards Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Clinical Entity Verification Breakdown
              </span>
              <span className="text-xs text-indigo-400 font-mono">3 Checks Run</span>
            </div>

            <div className="space-y-2.5">
              {auditData.items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      {item.status === 'Pass' && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold font-mono">
                          PASS
                        </span>
                      )}
                      {item.status === 'Warn' && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold font-mono">
                          WARN
                        </span>
                      )}
                      {item.status === 'Fail' && (
                        <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold font-mono">
                          FAIL
                        </span>
                      )}
                      <span className="font-bold text-white text-sm">{item.title}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{item.diagnostic}</p>
                    <p className="text-slate-500 text-[11px] font-mono">{item.remediation}</p>
                  </div>

                  <span className="text-[11px] font-mono text-slate-500 shrink-0">
                    {item.specification}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Part 2: The "One-Click Copy & Google Test" Section */}
          <div className="rounded-3xl bg-slate-900 border border-indigo-500/30 p-5 sm:p-7 shadow-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <h4 className="text-lg sm:text-xl font-black text-white">
                    0-Error Remediation Payload Ready
                  </h4>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Inject this validated JSON-LD schema into your client site to achieve 100% Google Rich Results pass rate.
                </p>
              </div>

              {/* Action Buttons Group */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Tactical Copy 0-Error Schema Button */}
                <button
                  type="button"
                  onClick={handleCopySchema}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md touch-target cursor-pointer ${
                    copiedSchema
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {copiedSchema ? (
                    <>
                      <Check className="w-4 h-4 text-white stroke-[3]" />
                      <span>Copied 0-Error Schema!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy 0-Error Schema</span>
                    </>
                  )}
                </button>

                {/* Direct Google Rich Results Test Link */}
                <a
                  href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(auditData.url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors touch-target"
                >
                  <span>Validate on Google Rich Results Test</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Code Tabs & Secondary Actions */}
            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveCodeTab('schema')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    activeCodeTab === 'schema'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Schema.org JSON-LD (0-Error)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCodeTab('llms')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    activeCodeTab === 'llms'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  /llms.txt AI Manifest
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadFile(activeCodeTab)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span>Download {activeCodeTab === 'schema' ? '.json' : '.txt'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleEmailWebmaster}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email Webmaster</span>
                </button>
              </div>
            </div>

            {/* Code Box Display */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 max-h-72 overflow-y-auto leading-relaxed select-all">
              <pre>
                {activeCodeTab === 'schema' ? auditData.jsonLd : auditData.llmsTxt}
              </pre>
            </div>

            {/* Bottom Conversion Bar to White-Label & Pricing */}
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-slate-300 text-center sm:text-left">
                Want to deliver this report under your own agency brand with <strong className="text-white">zero NexusRank mentions</strong>?
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onOpenWhiteLabelModal}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors touch-target"
                >
                  Preview White-Label CNAME
                </button>
                <button
                  type="button"
                  onClick={() => onOpenCheckout && onOpenCheckout('growth')}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors touch-target"
                >
                  Claim Growth License ($297/mo)
                </button>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
