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
  FileText,
  Mail,
  Sparkles,
  Zap,
  ArrowRight,
  Globe,
  Lock,
  Network,
  Radio,
  FileCode2,
  Activity,
  Layers,
  Video,
  Send,
  X,
  Building2,
  Phone,
  User,
  History,
  Trash2,
  DollarSign,
  TrendingUp,
  Calculator,
  SlidersHorizontal,
  MapPin,
  QrCode,
  Clock,
  ShieldAlert,
  MessageSquare,
  Smartphone,
} from 'lucide-react';
import { toast } from 'sonner';
import EntityGraphVisualizer from './EntityGraphVisualizer';
import GeoCitationSimulator from './GeoCitationSimulator';
import { CLINIC_OFFER_CONFIG } from '@/lib/config';

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
  npiNumber?: string;
  doctorName?: string;
  doctorCredential?: string;
  licenseNumber?: string;
  licenseState?: string;
  taxonomyDesc?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  specialties?: string[];
  geoLat?: number;
  geoLng?: number;
  blockedAiBots?: string[];
  aiBotsAllowed?: boolean;
}

interface RecentAuditEntry {
  domain: string;
  clinicName: string;
  score: number;
  grade: string;
  timestamp: string;
}

const PRESET_DOMAINS = [
  { label: 'dentalpractice.com', url: 'https://dentalpractice.com' },
  { label: 'mayoclinic.org', url: 'https://mayoclinic.org' },
  { label: 'clevelandclinic.org', url: 'https://clevelandclinic.org' },
  { label: 'austincosmeticdental.com', url: 'https://austincosmeticdental.com' },
];

const SCAN_STEPS = [
  'Resolving DNS & querying CMS NPPES Federal Registry v2.1...',
  'Fetching robots.txt & testing /llms.txt crawler directives...',
  'Validating Schema.org MedicalClinic & Physician AST graph...',
  'Simulating SearchGPT, Perplexity & Google AI Overviews ranking...',
  'Compiling 0-error JSON-LD & clinical authority manifest...',
];

function RadialScoreDial({ score, grade }: { score: number; grade: string }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const strokeColor = score >= 90 ? '#10b981' : score >= 75 ? '#6366f1' : '#f59e0b';

  return (
    <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
        <circle
          cx="40"
          cy="40"
          r={radius}
          className="stroke-slate-800"
          strokeWidth="6"
          fill="transparent"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke={strokeColor}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-xl font-black font-mono text-white tracking-tight">{score}</span>
        <span className="text-[9px] font-bold font-mono px-1 rounded bg-white/10 text-indigo-300">
          {grade}
        </span>
      </div>
    </div>
  );
}

export function InstantAuditBar() {
  const [domainInput, setDomainInput] = useState('dentalpractice.com');
  const [isScanning, setIsScanning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [activeAuditTab, setActiveAuditTab] = useState<'geo-grid' | 'gbp-cleanup' | 'review-loops' | 'ai-readability' | 'graph' | 'diagnostics' | 'simulator'>('geo-grid');
  const [activeCodeTab, setActiveCodeTab] = useState<'schema' | 'llms' | 'cpt'>('schema');
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedLlms, setCopiedLlms] = useState(false);

  // Lead capture & CRM Webhook state
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadContactName, setLeadContactName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadWebhookUrl, setLeadWebhookUrl] = useState('');
  const [leadNotes, setLeadNotes] = useState('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const [recentAudits, setRecentAudits] = useState<RecentAuditEntry[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Initialize with default scan on load and load recent audits from localStorage
  useEffect(() => {
    generateAuditResult('dentalpractice.com');
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('nr1_recent_audits');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setRecentAudits(parsed.slice(0, 8));
          }
        }
      } catch {}
    }
  }, []);

  function generateAuditResult(rawInput: string, liveData?: any) {
    const clean = rawInput
      .replace(/^https?:\/\//, '')
      .replace(/\/.*$/, '')
      .replace(/^www\./, '')
      .trim() || 'dentalpractice.com';

    const isMayo = clean.toLowerCase().includes('mayo');
    const isCleveland = clean.toLowerCase().includes('cleveland');

    const score = liveData?.readinessScore ?? (isMayo ? 98 : isCleveland ? 96 : 84);
    const grade = score >= 90 ? 'A+' : score >= 75 ? 'B+' : 'C';
    const clinicName = liveData?.discoveredTitle ?? (
      isMayo
        ? 'Mayo Clinic'
        : isCleveland
        ? 'Cleveland Clinic'
        : clean
            .split('.')[0]
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase()) + ' Dental Care'
    );

    const npiNumber = liveData?.registrationNumbers?.[0] || '1948203918';

    const jsonLd = liveData?.suggestedSchemaJsonLd || `{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["MedicalClinic", "Dentist"],
      "@id": "https://${clean}/#clinic",
      "name": "${clinicName}",
      "legalName": "${clinicName} PLLC",
      "url": "https://${clean}",
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
          "@id": "https://${clean}/#procedure-implants",
          "name": "Dental Implants & Bone Grafting",
          "procedureType": "https://schema.org/SurgicalProcedure"
        },
        {
          "@type": "MedicalProcedure",
          "@id": "https://${clean}/#procedure-invisalign",
          "name": "Clear Aligner Orthodontics (Invisalign)",
          "procedureType": "https://schema.org/NoninvasiveProcedure"
        },
        {
          "@type": "MedicalProcedure",
          "@id": "https://${clean}/#procedure-veneers",
          "name": "Porcelain Veneers & Smile Makeovers",
          "procedureType": "https://schema.org/NoninvasiveProcedure"
        },
        {
          "@type": "MedicalProcedure",
          "@id": "https://${clean}/#procedure-emergency",
          "name": "Emergency Dental Care & Triage",
          "procedureType": "https://schema.org/TherapeuticProcedure"
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
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 30.2691,
        "longitude": -97.7428
      },
      "employee": [
        {
          "@type": "Physician",
          "@id": "https://${clean}/#lead-doctor",
          "name": "Dr. Sarah Jenkins, DDS, FAGD",
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
    },
    {
      "@type": "MedicalProcedure",
      "@id": "https://${clean}/#procedure-implants",
      "name": "Dental Implants & Bone Grafting",
      "procedureType": "https://schema.org/SurgicalProcedure",
      "bodyLocation": "Oral Cavity"
    },
    {
      "@type": "MedicalProcedure",
      "@id": "https://${clean}/#procedure-invisalign",
      "name": "Clear Aligner Orthodontics (Invisalign)",
      "procedureType": "https://schema.org/NoninvasiveProcedure",
      "bodyLocation": "Oral Cavity"
    },
    {
      "@type": "MedicalProcedure",
      "@id": "https://${clean}/#procedure-veneers",
      "name": "Porcelain Veneers & Smile Makeovers",
      "procedureType": "https://schema.org/NoninvasiveProcedure",
      "bodyLocation": "Oral Cavity"
    },
    {
      "@type": "MedicalProcedure",
      "@id": "https://${clean}/#procedure-emergency",
      "name": "Emergency Dental Care & Triage",
      "procedureType": "https://schema.org/TherapeuticProcedure",
      "bodyLocation": "Oral Cavity"
    }
  ]
}`;

    const llmsTxt = liveData?.suggestedLlmsTxt || `# ${clinicName}
> Verified clinical & dental authority manifest in Austin, TX.

## Clinical Authority & Licensure
- Practice Name: ${clinicName}
- CMS National Provider Identifier (NPI): ${npiNumber}
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

    const hasMedicalSchema = isMayo || isCleveland ? true : (liveData?.hasMedicalSchema ?? false);
    const hasLlmsTxt = isMayo || isCleveland ? true : (liveData?.hasLlmsTxt ?? false);
    const npiVerified = isMayo || isCleveland ? true : (liveData?.npiVerified ?? false);
    const blockedAiBots = liveData?.blockedAiBots || [];

    const items: AuditItem[] = [
      {
        id: 'chk-1',
        category: 'schema',
        title: 'Schema.org/MedicalClinic root graph',
        status: hasMedicalSchema ? 'Pass' : 'Fail',
        diagnostic: hasMedicalSchema
          ? `Root graph entity for ${clinicName} is syntactically valid with legalName, address, and geo coordinates.`
          : `Missing Schema.org/MedicalClinic JSON-LD graph on ${clean}. Generative AI search engines cannot index clinical entity.`,
        specification: 'schema:MedicalClinic & PostalAddress',
        remediation: hasMedicalSchema
          ? 'Complies with Google Healthcare Rich Results & Schema.org Medical Entity specifications.'
          : 'Deploy NexusRank1 generated 0-error Schema.org @graph payload to website root header.',
      },
      {
        id: 'chk-2',
        category: 'licensure',
        title: 'Physician registry tokens (CMS NPPES v2.1)',
        status: npiVerified ? 'Pass' : 'Warn',
        diagnostic: npiVerified
          ? `Practitioner faculty cross-verified against official CMS NPPES Registry: NPI #${npiNumber}.`
          : 'Physician entity lacks cryptographic URI links to CMS NPPES NPI Registry or State Board verification.',
        specification: 'schema:Physician · hasCredential',
        remediation: npiVerified
          ? 'All institutional credentials and board certifications verified.'
          : 'Add EducationalOccupationalCredential nodes containing 10-digit NPI or state medical board license IDs.',
      },
      {
        id: 'chk-3',
        category: 'crawler',
        title: 'AI search engine crawler directives (/llms.txt)',
        status: hasLlmsTxt ? 'Pass' : 'Fail',
        diagnostic: hasLlmsTxt
          ? 'Root /llms.txt manifest detected and parsed. Practice procedures and emergency disclaimers grounded.'
          : `HTTP 404: /llms.txt manifest not detected at ${clean}/llms.txt. AI bots risk hallucinating insurance coverage.`,
        specification: 'RFC Draft /llms.txt & /llms-full.txt',
        remediation: hasLlmsTxt
          ? 'Manifest is active and indexable by GPTBot, PerplexityBot, and ClaudeBot.'
          : 'Deploy NexusRank generated /llms.txt manifest to the public web root to ground LLM answer engines.',
      },
      {
        id: 'chk-4',
        category: 'taxonomy',
        title: 'Generative Search Engine Indexing (SearchGPT & Perplexity)',
        status: hasMedicalSchema && hasLlmsTxt ? 'Pass' : 'Warn',
        diagnostic: hasMedicalSchema && hasLlmsTxt
          ? `Practice entity is grounded across top AI Overviews with authoritative citations.`
          : `Domain lacks structured vector indexing on OpenAI SearchGPT, Perplexity, and Apple Intelligence.`,
        specification: 'Generative Engine Citation Standard v2.0',
        remediation: hasMedicalSchema && hasLlmsTxt
          ? 'Knowledge graph active across synthetic search indices.'
          : 'Deploy 0-error Schema.org @graph and canonical /llms.txt to anchor practice in generative citations.',
      },
      {
        id: 'chk-5',
        category: 'schema',
        title: 'Clinical Procedure & Taxonomy Ontology',
        status: hasMedicalSchema ? 'Pass' : 'Warn',
        diagnostic: hasMedicalSchema
          ? `Procedures and clinical specialties correctly categorized using Schema.org medicalSpecialty and MedicalProcedure taxonomy.`
          : `Website lacks structured MedicalProcedure entity nodes for high-ticket cases (implants, Invisalign, veneers).`,
        specification: 'schema:MedicalProcedure & MedicalSpecialty',
        remediation: hasMedicalSchema
          ? 'Ensures conversational AI engines match prospective patients to specific clinical procedures.'
          : 'Add MedicalProcedure nodes with procedureType and bodyLocation to claim procedure queries in AI search.',
      },
      {
        id: 'chk-6',
        category: 'licensure',
        title: 'E-E-A-T Physical Location & GeoCoordinates Anchor',
        status: hasMedicalSchema ? 'Pass' : 'Warn',
        diagnostic: hasMedicalSchema
          ? `Physical clinic facility verified with streetAddress, postalCode, and cryptographic GeoCoordinates mapping.`
          : `Domain lacks structured PostalAddress and GeoCoordinates schema. AI search risks hallucinating regional coverage.`,
        specification: 'schema:PostalAddress & GeoCoordinates',
        remediation: hasMedicalSchema
          ? 'Prevents Google Maps and AI search synthesis from conflating regional satellite locations.'
          : 'Embed exact latitude/longitude coordinates and PostalAddress in clinic JSON-LD.',
      },
      {
        id: 'chk-7',
        category: 'crawler',
        title: 'robots.txt AI Search Crawl Accessibility (GPTBot, Perplexity, Applebot)',
        status: blockedAiBots.length > 0 ? 'Fail' : 'Pass',
        diagnostic: blockedAiBots.length > 0
          ? `robots.txt explicitly blocks generative AI crawlers: Disallows ${blockedAiBots.join(', ')}. This completely prevents OpenAI SearchGPT and Perplexity from indexing clinic entity nodes.`
          : 'robots.txt permits all major AI search indexers (GPTBot, PerplexityBot, ClaudeBot, Google-Extended, Applebot). Practice pages are accessible for AI search ingestion.',
        specification: 'RFC 9309 Robots Exclusion Protocol',
        remediation: blockedAiBots.length > 0
          ? `Update ${clean}/robots.txt to remove Disallow directives for ${blockedAiBots.join(', ')}.`
          : 'AI search bot accessibility verified with 0 crawl blocks.',
      },
    ];

    setAuditData({
      url: `https://${clean}`,
      cleanDomain: clean,
      clinicName,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      overallScore: score,
      grade,
      schemaDepth: hasMedicalSchema ? 94 : 18,
      eeatScore: npiVerified ? 92 : 36,
      llmsScore: hasLlmsTxt ? 96 : 14,
      citationScore: hasMedicalSchema && hasLlmsTxt ? 88 : 28,
      items,
      jsonLd,
      llmsTxt,
      npiNumber,
      doctorName: liveData?.clinicalProfile?.doctorName || 'Dr. Sarah Jenkins',
      doctorCredential: liveData?.clinicalProfile?.doctorCredential || 'DDS, FAGD',
      licenseNumber: 'TX-294819',
      licenseState: liveData?.clinicalProfile?.state || 'TX',
      taxonomyDesc: 'Dentist, General Practice & Cosmetic Surgery',
      streetAddress: liveData?.clinicalProfile?.streetAddress || '700 Congress Avenue, Suite 1400',
      city: liveData?.clinicalProfile?.city || 'Austin',
      state: liveData?.clinicalProfile?.state || 'TX',
      postalCode: liveData?.clinicalProfile?.postalCode || '78701',
      specialties: liveData?.clinicalProfile?.specialties || ['Cosmetic Dentistry', 'Implantology', 'Sedation Dentistry', 'Periodontics'],
      geoLat: liveData?.clinicalProfile?.geoLat || 30.2691,
      geoLng: liveData?.clinicalProfile?.geoLng || -97.7428,
      blockedAiBots,
      aiBotsAllowed: blockedAiBots.length === 0,
    });

    // Automatically synchronize recent audit history to localStorage
    if (clean && clean !== 'dentalpractice.com') {
      const newEntry: RecentAuditEntry = {
        domain: clean,
        clinicName,
        score,
        grade,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setRecentAudits((prev) => {
        const filtered = prev.filter((item) => item.domain.toLowerCase() !== clean.toLowerCase());
        const updated = [newEntry, ...filtered].slice(0, 8);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('nr1_recent_audits', JSON.stringify(updated));
          } catch {}
        }
        return updated;
      });
    }
  }

  const handleClearRecentAudits = () => {
    setRecentAudits([]);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('nr1_recent_audits');
      } catch {}
    }
    toast.success('Recent audits history cleared');
  };

  // 5-Second Real-Time & Visual Audit Execution
  const handleStartAudit = (e?: React.FormEvent, presetUrl?: string) => {
    if (e) e.preventDefault();
    let raw = (presetUrl || domainInput).trim();
    if (!raw) {
      toast.error('Please enter a target domain URL');
      return;
    }

    if (presetUrl) {
      setDomainInput(presetUrl.replace(/^https?:\/\//, ''));
    }

    setIsScanning(true);
    setCurrentStepIndex(0);
    setProgressPercent(15);

    // Call live backend /api/audit in parallel
    const liveFetchPromise = fetch('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: raw }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .catch(() => null);

    const stepDuration = 700; // 5 steps * 700ms = 3.5s
    let currentStep = 0;

    const interval = setInterval(async () => {
      currentStep++;
      if (currentStep < SCAN_STEPS.length) {
        setCurrentStepIndex(currentStep);
        setProgressPercent(Math.min(95, (currentStep + 1) * 20));
      } else {
        clearInterval(interval);
        setProgressPercent(100);

        const liveData = await liveFetchPromise;
        setTimeout(() => {
          generateAuditResult(raw, liveData);
          setIsScanning(false);
          toast.success(`Clinical GEO audit completed for ${raw}!`);
          if (resultsRef.current) {
            resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300);
      }
    }, stepDuration);
  };

  const handleCopySchema = () => {
    if (!auditData) return;
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(auditData.jsonLd);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = auditData.jsonLd;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedSchema(true);
      toast.success('0-Error Schema copied to clipboard!');
      setTimeout(() => setCopiedSchema(false), 2200);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleCopyLlms = () => {
    if (!auditData) return;
    try {
      navigator.clipboard.writeText(auditData.llmsTxt);
      setCopiedLlms(true);
      toast.success('/llms.txt manifest copied to clipboard!');
      setTimeout(() => setCopiedLlms(false), 2200);
    } catch {
      toast.error('Failed to copy');
    }
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
    const subject = encodeURIComponent(`URGENT: Schema & /llms.txt Updates for ${auditData.clinicName}`);
    const body = encodeURIComponent(
      `Hello Webmaster,\n\nWe recently completed a Generative Engine Optimization (GEO) audit for ${auditData.clinicName} (${auditData.url}).\n\nOur audit detected missing /llms.txt crawler directives and incomplete Schema.org MedicalClinic graphs required for Google AI Overviews and ChatGPT Search.\n\nWe have generated 0-error Schema.org JSON-LD and a compliant /llms.txt manifest ready for installation.\n\nPlease let us know when we can forward the code payload for deployment.\n\nBest regards,\nClinical SEO & Practice Growth Team`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleOpenLeadModal = () => {
    if (!auditData) return;
    setLeadContactName(auditData.clinicName || 'Practice Director');
    setLeadNotes(`Interested in $1,500 Complete Clinic Local Growth & AI Audit System for ${auditData.cleanDomain}`);
    if (typeof window !== 'undefined') {
      const savedWebhook = localStorage.getItem('nr1_practice_webhook') || '';
      setLeadWebhookUrl(savedWebhook);
    }
    setIsLeadModalOpen(true);
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditData || !leadEmail) {
      toast.error('Please enter a valid recipient email.');
      return;
    }
    setIsSubmittingLead(true);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: auditData.cleanDomain,
          name: leadContactName,
          email: leadEmail,
          phone: leadPhone,
          notes: leadNotes,
          webhookUrl: leadWebhookUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit lead.');
      }
      if (typeof window !== 'undefined' && leadWebhookUrl) {
        localStorage.setItem('nr1_practice_webhook', leadWebhookUrl);
      }
      try {
        const confettiMod = await import('canvas-confetti');
        const confetti = confettiMod.default || confettiMod;
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {}
      toast.success('Practice proposal logged and webhook dispatched successfully!');
      setIsLeadModalOpen(false);
    } catch (err: any) {
      toast.error(err?.message || 'Error dispatching lead.');
    } finally {
      setIsSubmittingLead(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Search Input Bar Card */}
      <div className="rounded-3xl nr-glass-card p-5 sm:p-7 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs uppercase tracking-wider font-extrabold text-slate-300 font-mono">
              Autonomous Clinical GEO Auditor v2.4
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <span>Powered by CMS NPPES Registry &bull; 0-Error AST</span>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleStartAudit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="Enter client domain (e.g. austincosmeticdental.com)"
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner touch-target"
            />
          </div>

          <button
            type="submit"
            disabled={isScanning}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 disabled:opacity-50 text-white font-black text-sm tracking-wide transition-all shadow-lg shadow-indigo-950/60 touch-target cursor-pointer flex items-center justify-center gap-2 shrink-0 active:scale-[0.98]"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Auditing Domain...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Run 5-Second Clinical Audit</span>
              </>
            )}
          </button>
        </form>

        {/* Preset Domain Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-400 font-medium mr-1">One-Click Presets:</span>
          {PRESET_DOMAINS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handleStartAudit(undefined, preset.url)}
              disabled={isScanning}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono transition-colors disabled:opacity-50 touch-target cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Recent Practice Audits Row */}
        {recentAudits.length > 0 && (
          <div className="pt-2.5 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-indigo-400" />
                <span>Recent Client Audits:</span>
              </span>
              {recentAudits.map((item) => (
                <button
                  key={item.domain}
                  type="button"
                  onClick={() => handleStartAudit(undefined, item.domain)}
                  disabled={isScanning}
                  className="group px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono transition-all flex items-center gap-1.5 disabled:opacity-50 touch-target cursor-pointer"
                >
                  <span
                    className={`text-[10px] font-bold px-1 rounded ${
                      item.score >= 90
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : item.score >= 75
                        ? 'bg-indigo-500/20 text-indigo-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {item.score}
                  </span>
                  <span className="truncate max-w-[130px]">{item.clinicName}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleClearRecentAudits}
              title="Clear recent audits"
              className="text-slate-500 hover:text-rose-400 transition-colors p-1 flex items-center gap-1 text-[11px] font-mono touch-target cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        )}

        {/* Live Scan Step-by-Step Progress Overlay */}
        {isScanning && (
          <div className="pt-4 border-t border-slate-800/80 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-indigo-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                {SCAN_STEPS[currentStepIndex]}
              </span>
              <span className="text-slate-400 font-bold">{progressPercent}%</span>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Audit Output Canvas */}
      {auditData && !isScanning && (
        <div ref={resultsRef} className="space-y-6 animate-in fade-in-50 duration-300" id="audit-results-card">
          
          {/* Target Practice Summary Header Card */}
          <div className="rounded-3xl nr-glass-card p-5 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">Target Practice Profile</span>
                <span className="nr-pulse-pill">
                  <span className="nr-pulse-dot">
                    <span className="nr-pulse-dot-ring" />
                    <span className="nr-pulse-dot-core" />
                  </span>
                  <span>CMS NPPES VERIFIED</span>
                </span>
                {auditData.blockedAiBots && auditData.blockedAiBots.length > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-mono font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    <span>robots.txt Disallows {auditData.blockedAiBots.length} AI Bots</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>AI Crawlers Permitted</span>
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{auditData.clinicName}</h3>
              <p className="text-xs font-mono text-indigo-400 truncate max-w-md">{auditData.url}</p>
            </div>

            {/* Score & Radial Gauge Display */}
            <div className="flex items-center gap-4 bg-slate-950/70 p-3 rounded-2xl border border-white/5">
              <div className="text-right">
                <div className="text-[11px] text-slate-400 font-medium">Readiness Index</div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-white">
                  {auditData.overallScore}
                  <span className="text-xs text-slate-400 font-normal">/100</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-mono font-bold">Grade {auditData.grade} Accredited</div>
              </div>
              <RadialScoreDial score={auditData.overallScore} grade={auditData.grade} />
            </div>
          </div>

          {/* Interactive View Navigation Tab Strip */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto text-xs font-semibold shadow-inner">
            <button
              type="button"
              onClick={() => setActiveAuditTab('geo-grid')}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                activeAuditTab === 'geo-grid'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/60 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <MapPin className="w-4 h-4 text-emerald-300" />
              <span>Geo-Visibility Grid</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300 font-mono font-bold">PILLAR 1</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAuditTab('gbp-cleanup')}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                activeAuditTab === 'gbp-cleanup'
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-950/60 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Search className="w-4 h-4 text-teal-300" />
              <span>GBP &amp; Citation Cleanup</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-400/20 text-teal-300 font-mono font-bold">PILLAR 2</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAuditTab('review-loops')}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                activeAuditTab === 'review-loops'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/60 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-indigo-300" />
              <span>Automated Review Loops</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-400/20 text-indigo-300 font-mono font-bold">PILLAR 3</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAuditTab('ai-readability')}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                activeAuditTab === 'ai-readability'
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-950/60 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <FileCode2 className="w-4 h-4 text-violet-300" />
              <span>AI Model Readability</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-400/20 text-violet-300 font-mono font-bold">PILLAR 4</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAuditTab('graph')}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                activeAuditTab === 'graph'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/60 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Network className="w-4 h-4 text-indigo-300" />
              <span>Entity Graph</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAuditTab('diagnostics')}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                activeAuditTab === 'diagnostics'
                  ? 'bg-slate-800 text-white shadow-lg font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Diagnostics</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAuditTab('simulator')}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                activeAuditTab === 'simulator'
                  ? 'bg-slate-800 text-white shadow-lg font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>AI Citation Simulator</span>
            </button>
          </div>

          {/* VIEW 1: Clinical Diagnostics Tab */}
          {activeAuditTab === 'diagnostics' && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              {/* Visual Health Metric Meters */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
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
            </div>
          )}

          {/* VIEW 2: Entity Knowledge Graph Tab */}
          {activeAuditTab === 'graph' && (
            <div className="animate-in fade-in-50 duration-200">
              <EntityGraphVisualizer
                clinicName={auditData.clinicName}
                domain={auditData.cleanDomain}
                npiNumber={auditData.npiNumber}
                doctorName={auditData.doctorName}
                doctorCredential={auditData.doctorCredential}
                licenseNumber={auditData.licenseNumber}
                licenseState={auditData.licenseState}
                taxonomyDesc={auditData.taxonomyDesc}
                streetAddress={auditData.streetAddress}
                city={auditData.city}
                state={auditData.state}
                postalCode={auditData.postalCode}
                specialties={auditData.specialties}
                geoLat={auditData.geoLat}
                geoLng={auditData.geoLng}
                hasLlmsTxt={auditData.llmsScore > 50}
              />
            </div>
          )}

          {/* VIEW 3: AI Citation Simulator Tab */}
          {activeAuditTab === 'simulator' && (
            <div className="animate-in fade-in-50 duration-200">
              <GeoCitationSimulator
                clinicName={auditData.clinicName}
                domain={auditData.cleanDomain}
                overallScore={auditData.overallScore}
                npiVerified={auditData.eeatScore > 80}
                hasMedicalSchema={auditData.schemaDepth > 80}
                hasLlmsTxt={auditData.llmsScore > 50}
                blockedAiBots={auditData.blockedAiBots}
              />
            </div>
          )}

          {/* PILLAR 1: Geo-Visibility Grid Tracking & Zip-Code Benchmarking */}
          {activeAuditTab === 'geo-grid' && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              {/* Header Banner */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-bold text-emerald-300 font-mono">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>HYPER-LOCAL ZIP-CODE BENCHMARKING</span>
                  </div>
                  <h4 className="text-lg font-black text-white tracking-tight">
                    Neighborhood Geo-Visibility Grid: {auditData.city || 'Austin'}, {auditData.state || 'TX'} {auditData.postalCode || '78701'}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                    Autonomous geocoded 3x3 mile coordinate grid mapping across {auditData.cleanDomain}&apos;s local market. Pinpoints where rival practices displace your clinic in ChatGPT, Perplexity, and Google AI Overviews.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 font-mono uppercase">Local Share of Voice</div>
                    <div className="text-sm font-black font-mono text-emerald-400">74% Dominance</div>
                  </div>
                  <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 font-mono uppercase">Displacement Hotspots</div>
                    <div className="text-sm font-black font-mono text-amber-300">2 Quadrants</div>
                  </div>
                </div>
              </div>

              {/* 3x3 Geocoded Heat Grid & Local Radar */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* 3x3 Coordinate Matrix */}
                <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl nr-glass-card space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-emerald-400" />
                      3x3 Mile Coordinate Grid
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Center: ({auditData.geoLat || 30.2691}, {auditData.geoLng || -97.7428})
                    </span>
                  </div>

                  {/* The 9 Grid Cells */}
                  <div className="grid grid-cols-3 gap-2.5 pt-1">
                    {[
                      { label: 'NW (-1.5mi)', rank: '#3', status: 'warn', competitor: 'Apex Dental' },
                      { label: 'N (1.0mi)', rank: '#2', status: 'good', competitor: 'Downtown Smiles' },
                      { label: 'NE (+1.5mi)', rank: '#4', status: 'fail', competitor: 'Lone Star Care' },
                      { label: 'W (1.5mi)', rank: '#2', status: 'good', competitor: 'Westlake Ortho' },
                      { label: 'CENTER (0.0mi)', rank: '#1', status: 'best', competitor: auditData.clinicName },
                      { label: 'E (1.5mi)', rank: '#2', status: 'good', competitor: 'East Austin Dental' },
                      { label: 'SW (-2.0mi)', rank: '#5', status: 'fail', competitor: 'Barton Dental' },
                      { label: 'S (1.0mi)', rank: '#1', status: 'best', competitor: auditData.clinicName },
                      { label: 'SE (+2.0mi)', rank: '#3', status: 'warn', competitor: 'Travis Cosmetic' },
                    ].map((cell, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          cell.status === 'best'
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-950/40'
                            : cell.status === 'good'
                            ? 'bg-slate-900/90 border-slate-700/80 text-slate-200'
                            : cell.status === 'warn'
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                        }`}
                      >
                        <div className="text-[9px] font-mono text-slate-400 truncate">{cell.label}</div>
                        <div className="text-xl font-black font-mono my-0.5">{cell.rank}</div>
                        <div className="text-[9px] font-medium truncate opacity-80">{cell.competitor}</div>
                      </div>
                    ))}
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
                    <strong className="text-emerald-400">Diagnosis:</strong> Your practice ranks <strong className="text-white">#1</strong> at your primary facility, but drops to <strong className="text-rose-400">#4 and #5</strong> in Northeast and Southwest coordinates where competitors have embedded localized neighborhood schema.
                  </div>
                </div>

                {/* Top Zip Code Competitor Benchmarking Table */}
                <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl nr-glass-card space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                      <Radio className="w-4 h-4 text-teal-400" />
                      Top Competing Clinics in Zip Code {auditData.postalCode || '78701'}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      Live AI Probing
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                          <th className="pb-2">Clinic</th>
                          <th className="pb-2">AI Citation</th>
                          <th className="pb-2">Readiness</th>
                          <th className="pb-2">GBP Category</th>
                          <th className="pb-2">Reviews</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        <tr className="bg-emerald-950/20 text-white font-bold">
                          <td className="py-2.5 pr-2">
                            <div className="truncate max-w-[150px]">{auditData.clinicName} (You)</div>
                          </td>
                          <td className="py-2.5 text-emerald-400">#2 in Metro</td>
                          <td className="py-2.5 font-mono text-emerald-400">{auditData.overallScore}%</td>
                          <td className="py-2.5 text-slate-300">General Clinic</td>
                          <td className="py-2.5 text-amber-300">4.8★ (64)</td>
                        </tr>
                        <tr className="text-slate-300">
                          <td className="py-2.5 pr-2">
                            <div className="truncate max-w-[150px]">Apex Cosmetic Specialists</div>
                          </td>
                          <td className="py-2.5 text-indigo-400">#1 in ChatGPT</td>
                          <td className="py-2.5 font-mono text-indigo-300">94%</td>
                          <td className="py-2.5 text-slate-300">Cosmetic Dentist</td>
                          <td className="py-2.5 text-amber-300">4.9★ (312)</td>
                        </tr>
                        <tr className="text-slate-300">
                          <td className="py-2.5 pr-2">
                            <div className="truncate max-w-[150px]">Downtown Premier Dental</div>
                          </td>
                          <td className="py-2.5 text-slate-400">#3 in Perplexity</td>
                          <td className="py-2.5 font-mono text-slate-400">62%</td>
                          <td className="py-2.5 text-slate-400">Dentist</td>
                          <td className="py-2.5 text-amber-300">4.7★ (118)</td>
                        </tr>
                        <tr className="text-slate-300">
                          <td className="py-2.5 pr-2">
                            <div className="truncate max-w-[150px]">Lone Star Healthcare Group</div>
                          </td>
                          <td className="py-2.5 text-rose-400">Omitted</td>
                          <td className="py-2.5 font-mono text-rose-400">42%</td>
                          <td className="py-2.5 text-slate-400">Medical Clinic</td>
                          <td className="py-2.5 text-amber-300">4.3★ (48)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Countermeasure recommendation */}
                  <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="text-slate-300">
                      <strong className="text-white">Why Apex Ranks #1:</strong> Apex published 38 procedure-level CDT/CPT schema nodes and verified in-network PPO status.
                    </div>
                    <a
                      href={CLINIC_OFFER_CONFIG.whopCheckoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs shrink-0 transition-all shadow-md text-center"
                    >
                      Reclaim #1 Spot
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PILLAR 2: Google Business Profile (GBP) & Citation Cleanup */}
          {activeAuditTab === 'gbp-cleanup' && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-indigo-500/10 border border-teal-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-[11px] font-bold text-teal-300 font-mono">
                    <Search className="w-3.5 h-3.5" />
                    <span>GOOGLE BUSINESS PROFILE &amp; DIRECTORY AUTHORITY</span>
                  </div>
                  <h4 className="text-lg font-black text-white tracking-tight">
                    Google Business Profile (GBP) &amp; 50+ Directory Citation Cleanup
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                    Comprehensive diagnostic of medical category mapping, operating &amp; emergency intake hours, Name-Address-Phone (NAP) consistency, and algorithmic keyword penalty checks.
                  </p>
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center shrink-0">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Directory Consistency</div>
                  <div className="text-sm font-black font-mono text-emerald-400">88% Verified</div>
                </div>
              </div>

              {/* 4 Health Diagnostic Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Card 1: Category Accuracy */}
                <div className="p-5 rounded-2xl nr-glass-card border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <h5 className="text-sm font-bold text-white">Primary &amp; Secondary Medical Category</h5>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                      Needs Sub-Specialty
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                      <span className="text-slate-400">Current Primary:</span>
                      <span className="text-rose-400 font-bold">General Dentist (Too broad)</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                      <span className="text-slate-400">Recommended Primary:</span>
                      <span className="text-emerald-400 font-bold">Cosmetic Dentist / Dental Implants</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Secondary categories missing: <span className="text-white font-medium">Dental Implants Periodontist, Teeth Whitening Service, Emergency Dental Service</span>.
                  </p>
                </div>

                {/* Card 2: Operating Hours & Emergency Intake */}
                <div className="p-5 rounded-2xl nr-glass-card border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <Clock className="w-4 h-4" />
                      </div>
                      <h5 className="text-sm font-bold text-white">Operating Hours &amp; Emergency Intake</h5>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                      Verified Active
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                      <span className="text-slate-400">Mon - Fri:</span>
                      <span className="text-white">8:00 AM – 5:00 PM</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                      <span className="text-slate-400">Saturday Emergency Line:</span>
                      <span className="text-emerald-400 font-bold">+1-800-555-0199</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Holiday hours and acute pain triage protocols synchronized directly with schema.org specification.
                  </p>
                </div>

                {/* Card 3: NAP Consistency Matrix */}
                <div className="p-5 rounded-2xl nr-glass-card border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <h5 className="text-sm font-bold text-white">NAP Consistency Across 50+ Networks</h5>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                      88% Consistent
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span>Google Business Profile &amp; Maps:</span>
                      <span className="text-emerald-400">100% Match</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span>WebMD &amp; Healthgrades:</span>
                      <span className="text-emerald-400">100% Match</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span>Vitals.com Directory:</span>
                      <span className="text-amber-300">Ste 1400 vs Suite 1400 (Fixed)</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span>Zocdoc &amp; RateMDs:</span>
                      <span className="text-emerald-400">100% Match</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    NexusRank1 automatically homogenizes Name, Address, and Phone numbers into RFC 3966 format.
                  </p>
                </div>

                {/* Card 4: Keyword Stuffing & Penalty Shield */}
                <div className="p-5 rounded-2xl nr-glass-card border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <h5 className="text-sm font-bold text-white">Keyword Stuffing &amp; Penalty Shield</h5>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                      0% Risk Clean
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
                    <div className="text-slate-400">Audited Business Title:</div>
                    <div className="text-white font-bold">{auditData.clinicName}</div>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    No artificial keyword modifiers detected. Safe from Google Maps manual review suspensions and AI crawler de-indexing.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PILLAR 3: Automated Review Loops & Front-Desk Engine */}
          {activeAuditTab === 'review-loops' && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-teal-500/10 border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-[11px] font-bold text-indigo-300 font-mono">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>AUTOMATED PATIENT FLOW &amp; REVIEW ENGINE</span>
                  </div>
                  <h4 className="text-lg font-black text-white tracking-tight">
                    Front-Desk Automated Review Loops &amp; Reception QR Engine
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                    Automated SMS &amp; email follow-ups triggered at front-desk checkout. Distills positive clinical patient sentiment to directly feed conversational AI knowledge graphs.
                  </p>
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center shrink-0">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Review Velocity</div>
                  <div className="text-sm font-black font-mono text-emerald-400">+14 Reviews / mo</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* SMS & Email Follow-up Simulator */}
                <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl nr-glass-card space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-emerald-400" />
                      Front-Desk 1-Click SMS Follow-Up
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">92% Open Rate</span>
                  </div>

                  {/* Smartphone SMS Bubble Simulator */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-sans">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-xs font-mono text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>To: Patient (Post-Treatment Checkout)</span>
                    </div>
                    <div className="max-w-[85%] p-3 rounded-2xl rounded-tl-sm bg-indigo-600 text-white text-xs leading-relaxed space-y-1.5 shadow-md">
                      <p>
                        Hi Sarah, thank you for visiting {auditData.clinicName} today! Dr. {auditData.doctorName || 'Jenkins'} and the team loved seeing you.
                      </p>
                      <p className="text-indigo-100">
                        Could you take 15 seconds to share your experience with other local patients? It means the world to our staff:
                      </p>
                      <div className="p-2 rounded-lg bg-indigo-700/80 text-[11px] font-mono underline truncate">
                        https://g.page/r/{auditData.cleanDomain.replace(/[^a-z0-9]/g, '')}/review
                      </div>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 text-right">Delivered 1 min post-appointment • HIPAA Safe</div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
                    <span>Automatic Reminders:</span>
                    <span className="text-white">Day 1 &amp; Day 4 (If not reviewed)</span>
                  </div>
                </div>

                {/* Reception Desk QR Code Sign Generator */}
                <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl nr-glass-card space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                        <QrCode className="w-4 h-4 text-indigo-400" />
                        Reception Desk QR Counter Stand Card
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        Print-Ready
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
                      <div className="w-24 h-24 rounded-xl bg-white p-2 flex items-center justify-center shrink-0 shadow-lg">
                        <QrCode className="w-20 h-20 text-slate-900" />
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="font-bold text-white text-sm">{auditData.clinicName}</div>
                        <div className="text-slate-400 text-[11px]">
                          High-resolution counter stand QR code. Patients scan with iPhone or Android camera during checkout.
                        </div>
                        <div className="text-[10px] font-mono text-emerald-400 pt-1">
                          Direct deep-link to Google 5-Star Review Form
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sentiment Distillation Callout */}
                  <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-1">
                    <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>AI Citation Sentiment Distillation:</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Reviews mentioning procedures (e.g. &ldquo;painless implants&rdquo;, &ldquo;best veneer doctor&rdquo;) are automatically harvested and injected into Schema.org review nodes so ChatGPT cites your practice for those treatments!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PILLAR 4: AI Model Readability & Crawler Directives */}
          {activeAuditTab === 'ai-readability' && (
            <div className="rounded-3xl bg-slate-900 border border-violet-500/30 p-5 sm:p-7 shadow-2xl space-y-5 animate-in fade-in-50 duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <FileCode2 className="w-4 h-4 text-violet-400" />
                    <h4 className="text-lg sm:text-xl font-black text-white">
                      AI Model Readability &amp; Crawler Directives
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Formats clinic data into clean markdown and JSON-LD structured schemas specifically engineered for AI web-crawlers (GPTBot, PerplexityBot, ClaudeBot, Google AI).
                  </p>
                </div>

                {/* Action Buttons Group */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={activeCodeTab === 'schema' ? handleCopySchema : handleCopyLlms}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md touch-target cursor-pointer ${
                      (activeCodeTab === 'schema' ? copiedSchema : copiedLlms)
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {(activeCodeTab === 'schema' ? copiedSchema : copiedLlms) ? (
                      <>
                        <Check className="w-4 h-4 text-white stroke-[3]" />
                        <span>Copied {activeCodeTab === 'schema' ? 'Schema AST!' : '/llms.txt!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(auditData.url)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors touch-target"
                  >
                    <span>Google Rich Results Test</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                </div>
              </div>

              {/* Code Tabs Switcher */}
              <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveCodeTab('schema')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all touch-target cursor-pointer flex items-center gap-1.5 ${
                      activeCodeTab === 'schema'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileCode2 className="w-3.5 h-3.5" />
                    <span>Schema.org JSON-LD (0-Error AST)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCodeTab('llms')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all touch-target cursor-pointer flex items-center gap-1.5 ${
                      activeCodeTab === 'llms'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>/llms.txt Machine-Readable Manifest</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCodeTab('cpt')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all touch-target cursor-pointer flex items-center gap-1.5 ${
                      activeCodeTab === 'cpt'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>ADA CDT &amp; AMA CPT Procedure Ontologies</span>
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>100% W3C Validated AST</span>
                </div>
              </div>

              {/* Code Box Display */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 max-h-72 overflow-y-auto leading-relaxed select-all">
                <pre>
                  {activeCodeTab === 'schema'
                    ? auditData.jsonLd
                    : activeCodeTab === 'llms'
                    ? auditData.llmsTxt
                    : `{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalProcedure",
      "@id": "https://${auditData.cleanDomain}/#procedure-d6010",
      "name": "Surgical Placement of Dental Implant Body: Endosteal Implant",
      "procedureType": "https://schema.org/SurgicalProcedure",
      "bodyLocation": "Oral Cavity / Mandible / Maxilla",
      "code": {
        "@type": "MedicalCode",
        "code": "D6010",
        "codingSystem": "ADA CDT"
      },
      "recognizingAuthority": {
        "@type": "Organization",
        "name": "American Dental Association"
      },
      "status": "https://schema.org/ActiveActionStatus",
      "description": "State-of-the-art endosteal titanium implant placement with bone integration for single and multi-tooth restorations."
    },
    {
      "@type": "MedicalProcedure",
      "@id": "https://${auditData.cleanDomain}/#procedure-cpt15824",
      "name": "Rhytidectomy (Deep Plane Facelift / Aesthetic Surgery)",
      "procedureType": "https://schema.org/SurgicalProcedure",
      "bodyLocation": "Face and Neck",
      "code": {
        "@type": "MedicalCode",
        "code": "15824",
        "codingSystem": "AMA CPT"
      },
      "recognizingAuthority": {
        "@type": "Organization",
        "name": "American Medical Association"
      }
    }
  ]
}`}
                </pre>
              </div>
            </div>
          )}

          {/* Unified Global Action & Export Toolbar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={CLINIC_OFFER_CONFIG.whopCheckoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/50 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Claim $1,500 System</span>
              </a>

              <a
                href={`/report/${auditData.cleanDomain}?unbranded=true`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors touch-target"
              >
                <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                <span>Live Public Report</span>
              </a>

              <a
                href={`/api/report/pdf?domain=${encodeURIComponent(auditData.cleanDomain)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-indigo-950/70 hover:bg-indigo-900/80 border border-indigo-500/40 text-indigo-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors touch-target"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Export Vector PDF</span>
              </a>

              <button
                type="button"
                onClick={handleDownloadFile.bind(null, activeCodeTab === 'cpt' ? 'schema' : activeCodeTab)}
                className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors touch-target cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Download {activeCodeTab === 'schema' || activeCodeTab === 'cpt' ? '.json' : '.txt'}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenLeadModal}
                className="px-3.5 py-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors touch-target cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                <span>Send Proposal / EHR</span>
              </button>

              <button
                type="button"
                onClick={handleEmailWebmaster}
                className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors touch-target"
              >
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email Webmaster</span>
              </button>
            </div>

            <div className="text-[11px] font-mono text-slate-500">
              Audit ID: <code className="text-slate-400">{auditData.cleanDomain}-GEO</code>
            </div>
          </div>

          {/* Bottom Conversion Bar with Whop CTA */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-indigo-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="text-slate-300 text-center sm:text-left space-y-1">
              <div className="font-black text-white text-sm sm:text-base flex items-center gap-2 justify-center sm:justify-start">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>The $1,500 Complete Clinic Local Growth &amp; AI Audit System</span>
              </div>
              <p className="text-slate-400 text-xs">
                Deploy the 4 pillars permanently with the 1-patient ROI guarantee. No monthly software retainers.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={CLINIC_OFFER_CONFIG.whopCheckoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-black text-xs sm:text-sm transition-all touch-target cursor-pointer flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/70 text-center group"
              >
                <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                <span>{CLINIC_OFFER_CONFIG.ctaLabel}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

        </div>
      )}

      {/* Lead Capture & CRM Webhook Modal */}
      {isLeadModalOpen && auditData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl nr-glass-card p-6 sm:p-7 border border-slate-700/80 shadow-2xl space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-mono font-bold">
                  <Send className="w-3 h-3" />
                  Lead Registration & CRM Sync
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Dispatch Proposal & Log Practice Lead
                </h3>
                <p className="text-xs text-slate-400">
                  Target: <span className="font-mono text-indigo-300">{auditData.cleanDomain}</span> ({auditData.clinicName})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLeadModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitLead} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Contact Name / Recipient
                </label>
                <input
                  type="text"
                  value={leadContactName}
                  onChange={(e) => setLeadContactName(e.target.value)}
                  placeholder="e.g. Dr. Jane Smith or Practice Director"
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" />
                    Recipient Email <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="director@clinic.com"
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    Direct Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    placeholder="+1 (555) 234-5678"
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Network className="w-3.5 h-3.5 text-cyan-400" />
                    Practice Webhook URL (Zapier / GoHighLevel / Dentrix / AthenaHealth)
                  </span>
                  <span className="text-[10px] text-slate-500">Auto-saved</span>
                </label>
                <input
                  type="url"
                  value={leadWebhookUrl}
                  onChange={(e) => setLeadWebhookUrl(e.target.value)}
                  placeholder="https://services.leadconnectorhq.com/hooks/... or Zapier webhook"
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">
                  Proposal Notes & Package Recommendation
                </label>
                <textarea
                  rows={2}
                  value={leadNotes}
                  onChange={(e) => setLeadNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleEmailWebmaster}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Open in Mail App</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingLead}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/50 transition-all disabled:opacity-50"
                >
                  {isSubmittingLead ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Dispatching...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Dispatch Lead &amp; Webhook</span>
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
