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
} from 'lucide-react';

export type UnifiedTab = 'overview' | 'brand' | 'economics' | 'cname';

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
  const [customHex, setCustomHex] = useState('#0284C7');
  const [debrandedToggle, setDebrandedToggle] = useState(true);
  const [customSubdomain, setCustomSubdomain] = useState('audit.apexhealthpartners.com');

  // Interaction Feedback States
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [dnsTesting, setDnsTesting] = useState(false);
  const [dnsVerified, setDnsVerified] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Add Practice Form State
  const [newPracticeName, setNewPracticeName] = useState('Austin Cosmetic Dentistry');
  const [newSpecialty, setNewSpecialty] = useState('Cosmetic & Restorative Dentistry');
  const [newDomain, setNewDomain] = useState('austincosmetic.com');
  const [newNpi, setNewNpi] = useState('NPI-1928374650');

  // Sub-accounts Table Data (High-Density)
  const [practices, setPractices] = useState([
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
      citations: 'Perplexity, Applebot',
    },
    {
      id: 'pr-103',
      name: 'Precision Dermatology Group',
      specialty: 'Dermatology & Skin Oncology',
      domain: 'precisionderm.com',
      npiAhpra: 'NPI-1736482910',
      schemaHealth: 96,
      status: 'Active',
      mrr: '$650',
      citations: 'Perplexity, SearchGPT',
    },
    {
      id: 'pr-104',
      name: 'Bayside Family Medicine',
      specialty: 'Primary Care & Pediatrics',
      domain: 'baysidehealth.org',
      npiAhpra: 'NPI-1049586720',
      schemaHealth: 91,
      status: 'Active',
      mrr: '$500',
      citations: 'Perplexity, ChatGPT',
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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (loadEvent.target?.result) {
          setAgencyLogoUrl(loadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    const agencyConfig = {
      agencyName: portalName,
      agencySlug: customSubdomain,
      agencyLogoUrl: agencyLogoUrl || '/logo.png',
      primaryColor: 'blue',
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
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 500);
  };

  const handleDiscard = () => {
    setPortalName('Apex Health Growth');
    setAgencyLogoUrl('/logo.png');
    setSupportEmail('growth@apexhealthpartners.com');
    setCustomHex('#0284C7');
    setDebrandedToggle(true);
    setCustomSubdomain('audit.apexhealthpartners.com');
  };

  const handleTestDns = () => {
    setDnsTesting(true);
    setTimeout(() => {
      setDnsTesting(false);
      setDnsVerified(true);
    }, 1000);
  };

  const handleAddPractice = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDomain = newDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const newEntry = {
      id: `pr-${Date.now()}`,
      name: newPracticeName,
      specialty: newSpecialty,
      domain: cleanDomain,
      npiAhpra: newNpi,
      schemaHealth: 96,
      status: 'Active',
      mrr: `$${agencyBillRate}`,
      citations: 'Perplexity, ChatGPT Search',
    };
    setPractices([newEntry, ...practices]);
    setClinicCount((prev) => prev + 1);
    setIsAddModalOpen(false);
    setNewPracticeName('');
    setNewSpecialty('');
    setNewDomain('');
    setNewNpi('');
  };

  const copyPracticeReportLink = (domain: string) => {
    const fullUrl = `${window.location.origin}/report/${domain}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(domain);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const filteredPractices = practices.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-[#0284C7]/20 selection:text-[#0284C7]">
      {/* 1. Sleek Linear/Stripe Enterprise Top Bar */}
      <header className="bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sticky top-16 z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Link href="/" className="hover:text-slate-800 transition-colors">VeloGEO</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-900 font-bold font-sans">Command Center</span>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Agency Badge */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800">
            <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
            <span className="font-bold text-slate-900">{portalName}</span>
            <span className="text-[10px] font-mono text-slate-400">({practices.length} Practices)</span>
          </div>
        </div>

        {/* Global Save / Discard Bar */}
        <div className="flex items-center gap-2.5">
          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Saved to Edge</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleDiscard}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-all active:scale-95 shadow-2xs"
          >
            Discard
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-3.5 py-1.5 rounded-lg bg-[#0284C7] hover:bg-[#0369a1] text-white text-xs font-bold transition-all shadow-xs active:scale-95 flex items-center gap-1.5 disabled:opacity-50"
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

      {/* 2. Unified Enterprise Navigation Tabs (Stripe/Linear Style) */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 pt-6">
        <div className="flex items-center gap-1.5 border-b border-slate-200/90 pb-px overflow-x-auto">
          {/* TAB 1: Overview & Practice Sub-Accounts */}
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#0284C7] text-[#0284C7] bg-white shadow-2xs font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Overview &amp; Practice Sub-Accounts</span>
            <span className="ml-1 text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">
              {practices.length}
            </span>
          </button>

          {/* TAB 2: White-Label Engine */}
          <button
            type="button"
            onClick={() => setActiveTab('brand')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'brand'
                ? 'border-[#0284C7] text-[#0284C7] bg-white shadow-2xs font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>White-Label Engine</span>
            {debrandedToggle && (
              <span className="ml-1 text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full border border-emerald-200">
                Zero-Trace
              </span>
            )}
          </button>

          {/* TAB 3: Economics & P&L Calculator */}
          <button
            type="button"
            onClick={() => setActiveTab('economics')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'economics'
                ? 'border-[#0284C7] text-[#0284C7] bg-white shadow-2xs font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Economics &amp; P&amp;L Calculator</span>
            <span className="ml-1 text-[10px] font-mono font-bold bg-sky-50 text-[#0284C7] px-1.5 py-0.5 rounded-full">
              {marginPercentage}% Margin
            </span>
          </button>

          {/* TAB 4: CNAME & DNS Mapping */}
          <button
            type="button"
            onClick={() => setActiveTab('cname')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'cname'
                ? 'border-[#0284C7] text-[#0284C7] bg-white shadow-2xs font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>CNAME &amp; DNS Mapping</span>
            {dnsVerified && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            )}
          </button>
        </div>
      </div>

      {/* 3. Main Command Center Viewport */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 flex-1">
        {/* ======================================================== */}
        {/* TAB 1: OVERVIEW & PRACTICE SUB-ACCOUNTS                  */}
        {/* ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick KPI Ribbon */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-1">
                <div className="text-[11px] font-mono font-bold uppercase text-slate-400">Total Practice Accounts</div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black font-mono text-slate-900">{practices.length}</span>
                  <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">100% Active</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Unlimited capacity on Wholesale</div>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-1">
                <div className="text-[11px] font-mono font-bold uppercase text-slate-400">Active Monthly MRR</div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black font-mono text-slate-900">${monthlyRevenue.toLocaleString()}</span>
                  <span className="text-xs font-mono font-bold text-emerald-600">+{marginPercentage}% Margin</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Wholesale deduction: -$297/mo</div>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-1">
                <div className="text-[11px] font-mono font-bold uppercase text-slate-400">Average GEO Health</div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black font-mono text-[#0284C7]">95.2%</span>
                  <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">Tier 1</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Verified @graph + /llms.txt</div>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-1">
                <div className="text-[11px] font-mono font-bold uppercase text-slate-400">Branded Subdomain</div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold font-mono text-slate-800 truncate">{customSubdomain}</span>
                </div>
                <div className="text-[10px] text-emerald-600 font-mono flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Cloudflare SSL Active</span>
                </div>
              </div>
            </div>

            {/* Practices Table Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden space-y-4 p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-0.5">
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">Active Medical Practice Sub-Accounts</h2>
                  <p className="text-xs text-slate-500">Each clinic has a dedicated zero-trace diagnostic report URL under your agency domain.</p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter clinics or domains..."
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-[#0284C7] hover:bg-[#0369a1] text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Practice</span>
                  </button>
                </div>
              </div>

              {/* High-Density Table */}
              <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 text-slate-500 font-mono text-[10px] uppercase border-b border-slate-200/80">
                    <tr>
                      <th className="px-4 py-3">Practice Name</th>
                      <th className="px-4 py-3">Specialty</th>
                      <th className="px-4 py-3">Domain</th>
                      <th className="px-4 py-3">Registry ID</th>
                      <th className="px-4 py-3">GEO Score</th>
                      <th className="px-4 py-3">Retainer</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredPractices.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">{p.name}</td>
                        <td className="px-4 py-3 text-slate-600">{p.specialty}</td>
                        <td className="px-4 py-3 font-mono font-semibold text-[#0284C7]">{p.domain}</td>
                        <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{p.npiAhpra}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {p.schemaHealth}/100
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-slate-800">{p.mrr}/mo</td>
                        <td className="px-4 py-3 text-right space-x-1.5">
                          <button
                            type="button"
                            onClick={() => copyPracticeReportLink(p.domain)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedLink === p.domain ? 'Copied!' : 'Copy Link'}</span>
                          </button>

                          <Link
                            href={`/report/${p.domain}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#0284C7]/10 hover:bg-[#0284C7]/20 text-[#0284C7] text-[11px] font-bold transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>View Report</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: WHITE-LABEL ENGINE                                */}
        {/* ======================================================== */}
        {activeTab === 'brand' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Custom Branding Settings */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-5">
              <div className="border-b border-slate-100 pb-3 space-y-0.5">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">White-Label Identity Configuration</h2>
                <p className="text-xs text-slate-500">All customer reports, schema exports, and client portals reflect these settings.</p>
              </div>

              <div className="space-y-4 text-xs">
                {/* Agency Brand Name */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Agency Brand Name</label>
                  <input
                    type="text"
                    value={portalName}
                    onChange={(e) => setPortalName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
                  />
                  <p className="text-[11px] text-slate-400">Replaces all references to VeloGEO across client views.</p>
                </div>

                {/* Agency Logo Upload */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-700">Agency Brand Logo</label>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-300 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                      <img
                        src={agencyLogoUrl}
                        alt="Agency Logo Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/logo.svg';
                        }}
                      />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors shadow-2xs">
                        <Upload className="w-3.5 h-3.5 text-[#0284C7]" />
                        <span>Upload Logo File (PNG/SVG)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        value={agencyLogoUrl}
                        onChange={(e) => setAgencyLogoUrl(e.target.value)}
                        placeholder="Or enter logo image URL (e.g. /logo.png)"
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Client Support Email */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Client Support Email</label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
                  />
                </div>

                {/* Primary Accent Hex with Live Swatches */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-700">Primary Brand Accent Hex Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={customHex}
                      onChange={(e) => setCustomHex(e.target.value)}
                      className="w-10 h-10 rounded-xl border border-slate-300 cursor-pointer p-0.5 bg-white shrink-0"
                    />
                    <input
                      type="text"
                      value={customHex}
                      onChange={(e) => setCustomHex(e.target.value)}
                      className="w-28 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-xs"
                    />
                    {/* Preset Palette Swatches */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[
                        { hex: '#0284C7', label: 'Sky' },
                        { hex: '#059669', label: 'Emerald' },
                        { hex: '#2563EB', label: 'Ahrefs Blue' },
                        { hex: '#D97706', label: 'Amber' },
                        { hex: '#0F172A', label: 'Slate' },
                      ].map((swatch) => (
                        <button
                          key={swatch.hex}
                          type="button"
                          onClick={() => setCustomHex(swatch.hex)}
                          className="w-6 h-6 rounded-lg border border-slate-200 shadow-2xs hover:scale-110 transition-transform"
                          style={{ backgroundColor: swatch.hex }}
                          title={swatch.label}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Zero-Trace Debranding Toggle */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/90 cursor-pointer hover:bg-slate-100/70 transition-colors">
                    <input
                      type="checkbox"
                      checked={debrandedToggle}
                      onChange={(e) => setDebrandedToggle(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-[#0284C7] focus:ring-[#0284C7]"
                    />
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span>100% Zero-Trace Debranding Active</span>
                        <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                          Active
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 leading-relaxed">
                        Suppresses every mention of VeloGEO in report headers, schema JSON-LD creator nodes, client URLs, and PDFs.
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Live Interactive Client Preview */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#0284C7]" />
                    <span>Live Client View Simulation</span>
                  </h3>
                  <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                    Zero Platform Trace
                  </span>
                </div>

                {/* Browser Shell */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-2xs">
                  <div className="bg-slate-200/70 px-3 py-2 flex items-center gap-2 border-b border-slate-300">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <div className="flex-1 max-w-xs mx-auto bg-white rounded px-2.5 py-0.5 text-[10px] text-slate-600 font-mono text-center border border-slate-200">
                      https://{customSubdomain}/report/aspendental.com
                    </div>
                  </div>

                  <div className="p-4 bg-white space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center overflow-hidden border border-slate-200">
                          <img
                            src={agencyLogoUrl}
                            alt={portalName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/logo.svg';
                            }}
                          />
                        </div>
                        <span className="font-bold text-slate-900 text-xs">{portalName}</span>
                      </div>
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white font-mono"
                        style={{ backgroundColor: customHex }}
                      >
                        Client Portal Active
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-800">Aspen Dental Specialists</div>
                      <div className="text-[10px] text-slate-500 font-mono">Verified NPI: NPI-1928374650 &bull; DentalClinic @graph</div>
                      <div className="text-[10px] text-emerald-600 font-bold font-mono">Regular GEO Readiness: 98/100</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-500 font-mono">
                Click &ldquo;View Report&rdquo; in the Practices tab to inspect full public report pages.
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: ECONOMICS & P&L CALCULATOR                         */}
        {/* ======================================================== */}
        {activeTab === 'economics' && (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-0.5">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">Agency Cashflow, Margins &amp; Unit Economics</h2>
                <p className="text-xs text-slate-500">Simulate retail monthly retainer rates against the fixed VeloGEO wholesale license.</p>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setWholesaleModel('flat')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    wholesaleModel === 'flat'
                      ? 'bg-white text-[#0284C7] shadow-2xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Flat Wholesale ($297/mo)
                </button>
                <button
                  type="button"
                  onClick={() => setWholesaleModel('per_clinic')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    wholesaleModel === 'per_clinic'
                      ? 'bg-white text-[#0284C7] shadow-2xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Setup + Retainer ($199 + $89/mo)
                </button>
              </div>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#F8FAFC] p-6 rounded-2xl border border-slate-200/80">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Managed Practice Clients:</span>
                  <span className="font-mono text-sm font-black text-[#0284C7] bg-white px-3 py-1 rounded-lg border border-slate-200">
                    {clinicCount} Clinics
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={clinicCount}
                  onChange={(e) => setClinicCount(Number(e.target.value))}
                  className="w-full accent-[#0284C7] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>1 Clinic</span>
                  <span>10 Clinics (Typical)</span>
                  <span>25 Clinics</span>
                  <span>50 Clinics</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Retainer Billed per Clinic:</span>
                  <span className="font-mono text-sm font-black text-emerald-600 bg-white px-3 py-1 rounded-lg border border-slate-200">
                    ${agencyBillRate} / clinic / mo
                  </span>
                </div>
                <input
                  type="range"
                  min="450"
                  max="1500"
                  step="50"
                  value={agencyBillRate}
                  onChange={(e) => setAgencyBillRate(Number(e.target.value))}
                  className="w-full accent-[#0284C7] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>$450/mo (Basic)</span>
                  <span>$650/mo (Standard)</span>
                  <span>$1,000/mo (Specialist)</span>
                  <span>$1,500/mo (Enterprise)</span>
                </div>
              </div>
            </div>

            {/* Financial Ledger Output */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Gross Monthly Invoiced</div>
                <div className="text-xl font-black font-mono text-slate-900">${monthlyRevenue.toLocaleString()}</div>
                <div className="text-[10px] text-slate-500 font-mono">{clinicCount} &times; ${agencyBillRate}/mo</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-[10px] font-mono font-bold uppercase text-slate-400">VeloGEO Wholesale Cost</div>
                <div className="text-xl font-black font-mono text-slate-700">${wholesaleCost.toLocaleString()}</div>
                <div className="text-[10px] text-slate-500 font-mono">Fixed wholesale license</div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                <div className="text-[10px] font-mono font-bold uppercase text-emerald-800">Net Monthly Profit</div>
                <div className="text-xl font-black font-mono text-emerald-700">${netMonthlyProfit.toLocaleString()}</div>
                <div className="text-[10px] font-mono font-bold text-emerald-800">{marginPercentage}% Net Margin</div>
              </div>

              <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200 space-y-1">
                <div className="text-[10px] font-mono font-bold uppercase text-[#0284C7]">Annualized Run Rate (ARR)</div>
                <div className="text-xl font-black font-mono text-[#0284C7]">${annualRunRate.toLocaleString()}</div>
                <div className="text-[10px] font-mono text-sky-800">12-Month Projected Net</div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: CNAME & DNS MAPPING                               */}
        {/* ======================================================== */}
        {activeTab === 'cname' && (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="border-b border-slate-100 pb-4 space-y-0.5">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Custom CNAME Subdomain Proxy Configuration</h2>
              <p className="text-xs text-slate-500">Point your own subdomain to proxy.velogeo.com with automatic TLS 1.3 certificates.</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Agency Custom Subdomain</label>
                  <input
                    type="text"
                    value={customSubdomain}
                    onChange={(e) => setCustomSubdomain(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
                  />
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono flex items-center justify-between">
                  <span className="text-slate-500">Proxy Target:</span>
                  <span className="font-bold text-[#0284C7]">proxy.velogeo.com</span>
                </div>
              </div>

              {/* DNS Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-3">Record Type</th>
                      <th className="p-3">Host Name</th>
                      <th className="p-3">Target Value</th>
                      <th className="p-3">TTL</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-slate-800">
                    <tr>
                      <td className="p-3 font-bold text-[#0284C7]">CNAME</td>
                      <td className="p-3">audit</td>
                      <td className="p-3 font-bold">proxy.velogeo.com</td>
                      <td className="p-3 text-slate-500">Auto (300s)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex items-center gap-4 flex-wrap pt-2">
                <button
                  type="button"
                  onClick={handleTestDns}
                  disabled={dnsTesting}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2"
                >
                  {dnsTesting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0284C7]" />
                      <span>Checking DNS Records...</span>
                    </>
                  ) : (
                    <>
                      <Server className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>Verify DNS Propagation</span>
                    </>
                  )}
                </button>

                {dnsVerified && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>CNAME Verified &bull; proxy.velogeo.com active with TLS 1.3</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: Add Practice Sub-Account */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#0284C7]" />
                <span>Add Medical Clinic Account</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddPractice} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Practice Name</label>
                <input
                  type="text"
                  required
                  value={newPracticeName}
                  onChange={(e) => setNewPracticeName(e.target.value)}
                  placeholder="Austin Cosmetic Dentistry"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Clinical Specialty</label>
                <input
                  type="text"
                  required
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  placeholder="Cosmetic & Restorative Dentistry"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Practice Domain</label>
                <input
                  type="text"
                  required
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="austincosmetic.com"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Registry NPI Identifier</label>
                <input
                  type="text"
                  required
                  value={newNpi}
                  onChange={(e) => setNewNpi(e.target.value)}
                  placeholder="NPI-1928374650"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369a1] text-white font-bold shadow-xs"
                >
                  Save Practice Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
