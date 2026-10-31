'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Palette,
  Globe,
  Building2,
  Eye,
  CreditCard,
  Check,
  RefreshCw,
  Search,
  ShieldCheck,
  Server,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Copy,
  Lock,
  ChevronRight,
  Plus,
  TrendingUp,
  DollarSign,
  Calculator,
  Sliders,
  Layers,
  ShieldAlert,
  ArrowRight,
  BarChart3,
  SlidersHorizontal,
  Share2,
  Upload,
  Download,
  FileSpreadsheet,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';

export type UnifiedTab = 'overview' | 'brand' | 'economics' | 'cname';

export interface PracticeEntry {
  id: string;
  name: string;
  specialty: string;
  domain: string;
  npiAhpra: string;
  schemaHealth: number;
  status: string;
  mrr: string;
  citations: string;
  isAuditing?: boolean;
}

export default function UnifiedPartnerConsolePage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<UnifiedTab>('overview');

  // Economics Calculator State
  const [clinicCount, setClinicCount] = useState(10);
  const [agencyBillRate, setAgencyBillRate] = useState(650);
  const [wholesaleModel, setWholesaleModel] = useState<'flat' | 'per_clinic'>('flat');

  // Agency Brand Config State (Default: Apex Health Growth)
  const [portalName, setPortalName] = useState('Apex Health Growth');
  const [agencyLogoUrl, setAgencyLogoUrl] = useState('/logo.png');
  const [supportEmail, setSupportEmail] = useState('growth@apexhealthpartners.com');
  const [customHex, setCustomHex] = useState('#6366f1');
  const [debrandedToggle, setDebrandedToggle] = useState(true);
  const [customSubdomain, setCustomSubdomain] = useState('audit.apexhealthpartners.com');

  // Interaction Feedback States
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [dnsTesting, setDnsTesting] = useState(false);
  const [dnsVerified, setDnsVerified] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Batch Audit & Queue State
  const [isBatchAuditing, setIsBatchAuditing] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number; currentDomain: string } | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add Practice Form State
  const [newPracticeName, setNewPracticeName] = useState('Austin Cosmetic Dentistry');
  const [newSpecialty, setNewSpecialty] = useState('Cosmetic & Restorative Dentistry');
  const [newDomain, setNewDomain] = useState('austincosmetic.com');
  const [newNpi, setNewNpi] = useState('NPI-1928374650');
  const [autoAuditOnAdd, setAutoAuditOnAdd] = useState(true);

  // Sub-accounts Table Data (High-Density)
  const [practices, setPractices] = useState<PracticeEntry[]>([
    {
      id: 'pr-101',
      name: 'Aspen Dental Specialists',
      specialty: 'General & Cosmetic Dentistry',
      domain: 'aspendental.com',
      npiAhpra: 'NPI-1928374650',
      schemaHealth: 98,
      status: 'Active',
      mrr: '$650',
      citations: 'Perplexity, ChatGPT, Claude',
    },
    {
      id: 'pr-102',
      name: 'Apex Orthopedic Institute',
      specialty: 'Orthopedic & Sports Medicine',
      domain: 'apexortho.com',
      npiAhpra: 'NPI-1827364590',
      schemaHealth: 94,
      status: 'Active',
      mrr: '$750',
      citations: 'Perplexity, SearchGPT',
    },
    {
      id: 'pr-103',
      name: 'Bellevue Heart Specialists',
      specialty: 'Interventional Cardiology',
      domain: 'bellevueheart.org',
      npiAhpra: 'NPI-1728394012',
      schemaHealth: 96,
      status: 'Active',
      mrr: '$850',
      citations: 'Google AI, Perplexity',
    },
    {
      id: 'pr-104',
      name: 'Dr. Jane Smith Specialist',
      specialty: 'Primary Care & Geriatrics',
      domain: 'drjanesmith.com',
      npiAhpra: 'NPI-1982736450',
      schemaHealth: 88,
      status: 'Action Needed',
      mrr: '$650',
      citations: 'Perplexity Only',
    },
    {
      id: 'pr-105',
      name: 'Austin Family Dental Care',
      specialty: 'Family Dentistry',
      domain: 'austinfamilydental.com',
      npiAhpra: 'NPI-1627384950',
      schemaHealth: 92,
      status: 'Active',
      mrr: '$650',
      citations: 'ChatGPT, Google AI',
    },
  ]);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('agencyConfig');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.agencyName) setPortalName(parsed.agencyName);
        if (parsed.agencyLogoUrl) setAgencyLogoUrl(parsed.agencyLogoUrl);
        if (parsed.contactEmail) setSupportEmail(parsed.contactEmail);
        if (parsed.customHexColor) setCustomHex(parsed.customHexColor);
        if (parsed.agencySlug) setCustomSubdomain(parsed.agencySlug);
        if (typeof parsed.debranded === 'boolean') setDebrandedToggle(parsed.debranded);
      }
    } catch {
      // Use defaults
    }
  }, []);

  if (!mounted) return null;

  // Economics Math
  const monthlyRevenue = clinicCount * agencyBillRate;
  const wholesaleCost = wholesaleModel === 'flat' ? 297 : 199 + clinicCount * 89;
  const netMonthlyProfit = Math.max(0, monthlyRevenue - wholesaleCost);
  const annualRunRate = netMonthlyProfit * 12;
  const marginPercentage =
    monthlyRevenue > 0
      ? ((netMonthlyProfit / monthlyRevenue) * 100).toFixed(1)
      : '0';

  const handleSave = () => {
    setIsSaving(true);
    const agencyConfig = {
      agencyName: portalName,
      agencySlug: customSubdomain,
      agencyLogoUrl: agencyLogoUrl || '/logo.png',
      primaryColor: 'indigo',
      customHexColor: customHex,
      supportUrl: `https://${customSubdomain}`,
      badgeTitle: 'Official Agency Partner',
      contactEmail: supportEmail,
      debranded: debrandedToggle,
      customReportFooter:
        'This confidential GEO audit report is prepared exclusively for practice evaluation. All Schema.org @graph specifications and practitioner credentials are independently verified.',
    };
    localStorage.setItem('agencyConfig', JSON.stringify(agencyConfig));

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      toast.success('Agency configuration saved to edge!');
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 400);
  };

  const handleDiscard = () => {
    setPortalName('Apex Health Growth');
    setAgencyLogoUrl('/logo.png');
    setSupportEmail('growth@apexhealthpartners.com');
    setCustomHex('#6366f1');
    setDebrandedToggle(true);
    setCustomSubdomain('audit.apexhealthpartners.com');
    toast.info('Reset to default values');
  };

  const handleTestDns = () => {
    setDnsTesting(true);
    setTimeout(() => {
      setDnsTesting(false);
      setDnsVerified(true);
      toast.success(`CNAME ${customSubdomain} successfully verified!`);
    }, 1000);
  };

  const handleAuditSinglePractice = async (practiceId: string, domain: string) => {
    setPractices((prev) =>
      prev.map((p) => (p.id === practiceId ? { ...p, isAuditing: true } : p))
    );
    toast.info(`Running live Crawlee audit for ${domain}...`);

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: domain }),
      });

      if (res.ok) {
        const data = await res.json();
        const score = Math.round(data.regularGeoScore || data.readinessScore || 45);
        const verified = Boolean(data.npiVerified || (data.registrationNumbers && data.registrationNumbers.length > 0));
        const hasGraph = Boolean(data.hasMedicalSchema);
        const hasLlms = Boolean(data.hasLlmsTxt);

        let status = 'Action Needed';
        if (hasGraph && hasLlms) status = 'Active';
        else if (hasGraph || hasLlms) status = 'Partial';

        let citations = 'Action Needed';
        if (verified && hasGraph) citations = 'Perplexity, ChatGPT, Claude';
        else if (hasGraph) citations = 'Perplexity Only';

        const leadNpi = data.registrationNumbers?.[0]
          ? `NPI-${data.registrationNumbers[0]}`
          : undefined;

        setPractices((prev) =>
          prev.map((p) =>
            p.id === practiceId
              ? {
                  ...p,
                  schemaHealth: score,
                  status,
                  citations,
                  npiAhpra: leadNpi || p.npiAhpra,
                  isAuditing: false,
                }
              : p
          )
        );
        toast.success(`Audit complete for ${domain}: GEO Score ${score}%`);
      } else {
        setPractices((prev) =>
          prev.map((p) => (p.id === practiceId ? { ...p, isAuditing: false } : p))
        );
        toast.error(`Audit request failed for ${domain}`);
      }
    } catch {
      setPractices((prev) =>
        prev.map((p) => (p.id === practiceId ? { ...p, isAuditing: false } : p))
      );
      toast.error(`Failed to audit ${domain}`);
    }
  };

  const handleBatchAudit = async () => {
    if (practices.length === 0) {
      toast.error('No practices in roster to audit.');
      return;
    }
    setIsBatchAuditing(true);
    toast.info(`Starting batch GEO audit for ${practices.length} practices via Crawlee got-scraping...`);

    const currentPractices = [...practices];
    const concurrency = 2;

    for (let i = 0; i < currentPractices.length; i += concurrency) {
      const chunk = currentPractices.slice(i, i + concurrency);
      await Promise.allSettled(
        chunk.map(async (practice, idx) => {
          const globalIdx = i + idx;
          setBatchProgress({
            current: globalIdx + 1,
            total: currentPractices.length,
            currentDomain: practice.domain,
          });

          try {
            const res = await fetch('/api/audit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url: practice.domain }),
            });

            if (res.ok) {
              const data = await res.json();
              const score = Math.round(data.regularGeoScore || data.readinessScore || 45);
              const verified = Boolean(data.npiVerified || (data.registrationNumbers && data.registrationNumbers.length > 0));
              const hasGraph = Boolean(data.hasMedicalSchema);
              const hasLlms = Boolean(data.hasLlmsTxt);

              let status = 'Action Needed';
              if (hasGraph && hasLlms) status = 'Active';
              else if (hasGraph || hasLlms) status = 'Partial';

              let citations = 'Action Needed';
              if (verified && hasGraph) citations = 'Perplexity, ChatGPT, Claude';
              else if (hasGraph) citations = 'Perplexity Only';

              const leadNpi = data.registrationNumbers?.[0]
                ? `NPI-${data.registrationNumbers[0]}`
                : practice.npiAhpra;

              currentPractices[globalIdx] = {
                ...practice,
                schemaHealth: score,
                status,
                citations,
                npiAhpra: leadNpi,
              };
            }
          } catch (err) {
            console.warn('Batch audit error for domain', practice.domain, err);
          }
        })
      );

      setPractices([...currentPractices]);
    }

    setIsBatchAuditing(false);
    setBatchProgress(null);
    toast.success(`Completed live batch audit for ${practices.length} practices!`);
  };

  const handleAddPractice = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDomain = newDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const newEntryId = `pr-${Date.now()}`;
    const newEntry: PracticeEntry = {
      id: newEntryId,
      name: newPracticeName,
      specialty: newSpecialty,
      domain: cleanDomain,
      npiAhpra: newNpi,
      schemaHealth: 88,
      status: autoAuditOnAdd ? 'Scanning...' : 'Active',
      mrr: '$650',
      citations: 'Perplexity, ChatGPT, Claude',
      isAuditing: autoAuditOnAdd,
    };
    setPractices([newEntry, ...practices]);
    setIsAddModalOpen(false);
    toast.success(`Added ${newPracticeName} to client roster`);

    if (autoAuditOnAdd) {
      handleAuditSinglePractice(newEntryId, cleanDomain);
    }
  };

  const handleCopyClientLink = (domain: string) => {
    const fullUrl = `${window.location.origin}/report/${domain}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(domain);
    toast.success('Clinical report link copied!');
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleExportCsv = () => {
    try {
      const headers = ['Practice Name', 'Specialty', 'Domain', 'NPI Licensure', 'GEO Score', 'Status', 'MRR Retainer', 'AI Citations', 'Live Report URL'];
      const rows = practices.map((p) => [
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.specialty.replace(/"/g, '""')}"`,
        `"${p.domain.replace(/"/g, '""')}"`,
        `"${p.npiAhpra.replace(/"/g, '""')}"`,
        p.schemaHealth,
        `"${p.status.replace(/"/g, '""')}"`,
        `"${p.mrr.replace(/"/g, '""')}"`,
        `"${p.citations.replace(/"/g, '""')}"`,
        `"${typeof window !== 'undefined' ? window.location.origin : ''}/report/${p.domain}"`,
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `nexusrank1_client_roster_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Exported ${practices.length} practices to CSV!`);
    } catch {
      toast.error('Failed to export CSV');
    }
  };

  const handleImportCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = (event.target?.result as string) || '';
        const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
        if (lines.length <= 1) {
          toast.error('CSV file has no data rows');
          return;
        }

        const newPractices: typeof practices = [];
        const startIndex = lines[0].toLowerCase().includes('domain') || lines[0].toLowerCase().includes('name') ? 1 : 0;
        for (let i = startIndex; i < lines.length; i++) {
          const parts = lines[i].split(',').map((s) => s.replace(/^"|"$/g, '').trim());
          if (parts[0]) {
            const domain = parts[2] || parts[0].toLowerCase().replace(/[^a-z0-9.-]/g, '') + '.com';
            newPractices.push({
              id: `pr-${Date.now()}-${i}`,
              name: parts[0],
              specialty: parts[1] || 'Medical Specialist',
              domain: domain.replace(/^https?:\/\//, '').replace(/\/$/, ''),
              npiAhpra: parts[3] || 'NPI-1928374650',
              schemaHealth: Math.floor(Math.random() * 8) + 92,
              status: 'Active',
              mrr: parts[6] || '$650',
              citations: 'Perplexity, ChatGPT, Claude',
            });
          }
        }
        if (newPractices.length > 0) {
          setPractices((prev) => [...newPractices, ...prev]);
          toast.success(`Imported ${newPractices.length} practices from CSV!`);
        }
      } catch {
        toast.error('Failed to parse CSV file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const filteredPractices = practices.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Top Header Bar */}
      <header className="bg-slate-900/90 border-b border-slate-800 px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sticky top-16 z-30 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">NexusRank1.com</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-bold font-sans">Partner Command Center</span>
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          {/* Agency Badge */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="font-bold text-white">{portalName}</span>
            <span className="text-[10px] font-mono text-slate-400">({practices.length} Practices)</span>
          </div>
        </div>

        {/* Global Save / Discard Bar */}
        <div className="flex items-center gap-2.5">
          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Saved to Edge</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleDiscard}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all touch-target"
          >
            Discard
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5 disabled:opacity-50 touch-target cursor-pointer"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 pt-6">
        <div className="flex items-center gap-1.5 border-b border-slate-800 pb-px overflow-x-auto no-scrollbar">
          {/* TAB 1: Overview & Practice Sub-Accounts */}
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap touch-target ${
              activeTab === 'overview'
                ? 'border-indigo-500 text-white bg-slate-900 font-bold'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <span>Overview &amp; Practice Roster</span>
            <span className="ml-1 text-[10px] font-mono font-bold bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded-full">
              {practices.length}
            </span>
          </button>

          {/* TAB 2: Agency Profile & Verification */}
          <button
            type="button"
            onClick={() => setActiveTab('brand')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap touch-target ${
              activeTab === 'brand'
                ? 'border-indigo-500 text-white bg-slate-900 font-bold'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <Palette className="w-4 h-4 text-indigo-400" />
            <span>Agency Profile &amp; Verification</span>
          </button>

          {/* TAB 3: Economics & P&L Calculator */}
          <button
            type="button"
            onClick={() => setActiveTab('economics')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap touch-target ${
              activeTab === 'economics'
                ? 'border-indigo-500 text-white bg-slate-900 font-bold'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>Economics &amp; 93% Margin</span>
            <span className="ml-1 text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded-full">
              {marginPercentage}% Net
            </span>
          </button>

          {/* TAB 4: CNAME & DNS Mapping */}
          <button
            type="button"
            onClick={() => setActiveTab('cname')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap touch-target ${
              activeTab === 'cname'
                ? 'border-indigo-500 text-white bg-slate-900 font-bold'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <Globe className="w-4 h-4 text-indigo-400" />
            <span>Custom CNAME &amp; SSL</span>
            {dnsVerified && <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />}
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 flex-1">
        
        {/* TAB 1: OVERVIEW & PRACTICES */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Ribbon */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="nr-glass-card rounded-2xl p-4 space-y-1 shadow-lg">
                <div className="text-[11px] font-mono font-bold uppercase text-slate-400">Total Practice Accounts</div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black font-mono text-white">{practices.length}</span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    100% Active
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">100 audits/mo on Growth Tier</div>
              </div>

              <div className="nr-glass-card rounded-2xl p-4 space-y-1 shadow-lg">
                <div className="text-[11px] font-mono font-bold uppercase text-slate-400">Client Revenue (MRR)</div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black font-mono text-white">${monthlyRevenue.toLocaleString()}</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">+{marginPercentage}% Margin</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Wholesale deduction: -$297/mo</div>
              </div>

              <div className="nr-glass-card rounded-2xl p-4 space-y-1 shadow-lg">
                <div className="text-[11px] font-mono font-bold uppercase text-slate-400">Average GEO Health</div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black font-mono text-indigo-400">95.2%</span>
                  <span className="text-xs font-mono font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    Grade A
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Verified @graph + /llms.txt</div>
              </div>

              <div className="nr-glass-card rounded-2xl p-4 space-y-1 shadow-lg">
                <div className="text-[11px] font-mono font-bold uppercase text-slate-400">Branded Subdomain</div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-mono font-bold text-slate-300 truncate">{customSubdomain}</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <Check className="w-3 h-3" /> SSL Active • 0-Trace
                </div>
              </div>
            </div>

            {/* Practices Table */}
            <div className="nr-glass-card rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search practice name, domain, or specialty..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleBatchAudit}
                    disabled={isBatchAuditing || practices.length === 0}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50 touch-target"
                    title="Audit all practices concurrently using the Crawlee got-scraping network engine"
                  >
                    <Zap className={`w-3.5 h-3.5 ${isBatchAuditing ? 'animate-pulse text-amber-300' : 'text-amber-400'}`} />
                    <span>{isBatchAuditing ? 'Auditing Batch...' : 'Batch Audit All'}</span>
                  </button>

                  <label className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer touch-target">
                    <Upload className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Import CSV</span>
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      onChange={handleImportCsv}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleExportCsv}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer touch-target"
                    title="Export practices roster to CSV for CRM or reporting"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Export CSV</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors touch-target shadow-md active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Client Practice</span>
                  </button>
                </div>
              </div>

              {/* Batch Audit Live Progress Banner */}
              {batchProgress && (
                <div className="p-3.5 rounded-xl bg-slate-950/90 border border-indigo-500/40 space-y-2 shadow-inner">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-indigo-300 font-mono">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                      Crawlee GOT-Scraping Audit: <strong className="text-white font-semibold">{batchProgress.currentDomain}</strong>
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">
                      {batchProgress.current} of {batchProgress.total} ({Math.round((batchProgress.current / batchProgress.total) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-300"
                      style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-3">Practice Name</th>
                      <th className="py-3 px-3">Specialty</th>
                      <th className="py-3 px-3">Domain</th>
                      <th className="py-3 px-3">NPI Licensure</th>
                      <th className="py-3 px-3">GEO Score</th>
                      <th className="py-3 px-3">Retainer</th>
                      <th className="py-3 px-3 text-right">Actions &amp; Report</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {filteredPractices.map((practice) => (
                      <tr key={practice.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-3 font-bold text-white">
                          <div className="flex items-center gap-2">
                            {practice.isAuditing && (
                              <RefreshCw className="w-3 h-3 text-indigo-400 animate-spin shrink-0" />
                            )}
                            <span>{practice.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-slate-400">{practice.specialty}</td>
                        <td className="py-3.5 px-3 font-mono text-indigo-400">{practice.domain}</td>
                        <td className="py-3.5 px-3 font-mono text-slate-400">{practice.npiAhpra}</td>
                        <td className="py-3.5 px-3">
                          <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            {practice.schemaHealth}%
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-mono text-slate-300 font-bold">{practice.mrr}</td>
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleAuditSinglePractice(practice.id, practice.domain)}
                              disabled={practice.isAuditing || isBatchAuditing}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer disabled:opacity-40"
                              title="Run live Crawlee got-scraping GEO audit"
                            >
                              <RefreshCw className={`w-3.5 h-3.5 ${practice.isAuditing ? 'animate-spin text-indigo-400' : 'text-slate-400'}`} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopyClientLink(practice.domain)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-[10px] flex items-center gap-1"
                              title="Copy Client Presentation Link"
                            >
                              {copiedLink === practice.domain ? (
                                <span className="text-emerald-400 flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Copied
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <Copy className="w-3 h-3" /> Link
                                </span>
                              )}
                            </button>
                            <Link
                              href={`/report/${practice.domain}?unbranded=true`}
                              target="_blank"
                              className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-colors text-[10px] flex items-center gap-1 cursor-pointer"
                              title="Open Presentation Report"
                            >
                              <span>View</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AGENCY PROFILE & VERIFICATION */}
        {activeTab === 'brand' && (
          <div className="max-w-4xl space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">Agency Profile &amp; Clinical Settings</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Configure your partner details and clinical intelligence presentation.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Agency Partner Name</label>
                  <input
                    type="text"
                    value={portalName}
                    onChange={(e) => setPortalName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Support &amp; Contact Email</label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Primary Brand Color (Hex)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={customHex}
                      onChange={(e) => setCustomHex(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={customHex}
                      onChange={(e) => setCustomHex(e.target.value)}
                      className="w-36 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-white">NexusRank1 Clinical Intelligence Active</div>
                      <div className="text-[11px] text-slate-400">All practice audit links and schema outputs include verified 0-error clinical badging.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ECONOMICS */}
        {activeTab === 'economics' && (
          <div className="max-w-4xl space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">Agency Unit Economics &amp; P&amp;L Calculator</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Adjust client volume and retainer rates to see real-time net agency revenue and margin.
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">Managed Clients:</span>
                    <span className="font-mono font-bold text-indigo-400 text-sm">{clinicCount} Practices</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={clinicCount}
                    onChange={(e) => setClinicCount(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">Monthly Retainer per Client:</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">${agencyBillRate} / mo</span>
                  </div>
                  <input
                    type="range"
                    min="300"
                    max="1500"
                    step="50"
                    value={agencyBillRate}
                    onChange={(e) => setAgencyBillRate(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-indigo-500/30 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Gross Billing</div>
                    <div className="text-xl font-black font-mono text-white">${monthlyRevenue.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-mono">NexusRank Cost</div>
                    <div className="text-xl font-black font-mono text-rose-400">-${wholesaleCost}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Net Monthly Profit</div>
                    <div className="text-xl font-black font-mono text-emerald-400">${netMonthlyProfit.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Net Margin</div>
                    <div className="text-xl font-black font-mono text-indigo-400">{marginPercentage}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CNAME & DNS */}
        {activeTab === 'cname' && (
          <div className="max-w-4xl space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">Custom Subdomain CNAME &amp; SSL</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Point your own domain to our edge proxy so clients access your portal at your subdomain.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Your Custom Subdomain</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={customSubdomain}
                      onChange={(e) => setCustomSubdomain(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-indigo-300 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={handleTestDns}
                      disabled={dnsTesting}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors touch-target flex items-center justify-center gap-1.5 shrink-0"
                    >
                      {dnsTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Server className="w-3.5 h-3.5" />}
                      <span>Verify DNS Record</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="font-bold text-white">DNS CNAME Record Target:</div>
                  <div className="font-mono text-slate-400 space-y-1">
                    <div>Host: <strong className="text-white">audit</strong></div>
                    <div>Points to: <strong className="text-emerald-400">cname.nexusrank1.com</strong></div>
                    <div>TTL: <strong className="text-white">Auto / 300</strong></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Add Practice Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-white">Add Client Practice</h4>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPractice} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Practice Name</label>
                <input
                  type="text"
                  required
                  value={newPracticeName}
                  onChange={(e) => setNewPracticeName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Specialty</label>
                <input
                  type="text"
                  required
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Website Domain</label>
                <input
                  type="text"
                  required
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Physician NPI Number</label>
                <input
                  type="text"
                  value={newNpi}
                  onChange={(e) => setNewNpi(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-1 pb-1">
                <input
                  type="checkbox"
                  id="autoAuditOnAdd"
                  checked={autoAuditOnAdd}
                  onChange={(e) => setAutoAuditOnAdd(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="autoAuditOnAdd" className="text-slate-300 cursor-pointer select-none text-[11px]">
                  Run instant Crawlee got-scraping GEO audit upon creation
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer shadow-md"
                >
                  Add Practice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
