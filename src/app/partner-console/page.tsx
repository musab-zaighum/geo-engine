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
  Share2,
  TrendingUp,
  DollarSign,
  Calculator,
  Sliders,
  Layers,
  ShieldAlert,
} from 'lucide-react';

export type EnterpriseTab = 'economics' | 'brand' | 'cname' | 'practices' | 'preview' | 'billing';

export default function PartnerConsolePage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<EnterpriseTab>('economics');

  // Economics Calculator State
  const [clinicCount, setClinicCount] = useState(10);
  const [agencyBillRate, setAgencyBillRate] = useState(650);
  const [wholesaleModel, setWholesaleModel] = useState<'flat' | 'per_clinic'>('flat');

  // Agency Brand Config State (Default: Apex Health Partners)
  const [portalName, setPortalName] = useState('Apex Health Growth');
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

  // Sub-accounts Table Data
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
    },
    {
      id: 'pr-104',
      name: 'Bayside Family Medicine',
      specialty: 'Primary Care & Pediatrics',
      domain: 'baysidehealth.org',
      npiAhpra: 'NPI-1049586720',
      schemaHealth: 90,
      status: 'Active',
      mrr: '$500',
    },
  ]);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('agencyConfig');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.agencyName) setPortalName(parsed.agencyName);
        if (parsed.contactEmail) setSupportEmail(parsed.contactEmail);
        if (parsed.customHexColor) setCustomHex(parsed.customHexColor);
        if (parsed.agencySlug) setCustomSubdomain(parsed.agencySlug);
      }
    } catch {
      // Use defaults
    }
  }, []);

  if (!mounted) return null;

  // Economics Math
  const monthlyRevenue = clinicCount * agencyBillRate;
  const wholesaleCost = wholesaleModel === 'flat' ? 297 : 199 + (clinicCount * 89);
  const netMonthlyProfit = Math.max(0, monthlyRevenue - wholesaleCost);
  const annualRunRate = netMonthlyProfit * 12;
  const marginPercentage = monthlyRevenue > 0 ? ((netMonthlyProfit / monthlyRevenue) * 100).toFixed(1) : '0';

  const handleSave = () => {
    setIsSaving(true);
    const agencyConfig = {
      agencyName: portalName,
      agencySlug: customSubdomain,
      agencyLogoUrl: '/logo.png',
      primaryColor: 'blue',
      customHexColor: customHex,
      supportUrl: `https://${customSubdomain}`,
      badgeTitle: 'Official Agency Partner',
      contactEmail: supportEmail,
      debranded: debrandedToggle,
      customReportFooter: 'This confidential GEO audit report is prepared exclusively for practice evaluation. All Schema.org @graph specifications and practitioner credentials are independently verified.',
    };
    localStorage.setItem('agencyConfig', JSON.stringify(agencyConfig));

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 600);
  };

  const handleDiscard = () => {
    setPortalName('Apex Health Growth');
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
    }, 1200);
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
      {/* 1. Top Enterprise Control Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-2xs">
        {/* Left: Breadcrumbs & Agency Multi-Clinic Selector */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-slate-900 transition-colors font-mono">VeloGEO</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-slate-900 text-sm">White-Label Partner Console</span>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Agency Badge Indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800">
            <Building2 className="w-4 h-4 text-[#0284C7]" />
            <span className="font-bold text-slate-900">{portalName}</span>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-sky-50 text-[#0284C7] border border-sky-200">
              {practices.length} Active Accounts
            </span>
          </div>
        </div>

        {/* Right: Save / Discard Controls */}
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Branding Saved Locally</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleDiscard}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs active:scale-95 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Discard</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369a1] text-white text-xs font-bold transition-all shadow-xs active:scale-95 flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* 2. Main Two-Column Console Canvas */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto my-6 px-4 sm:px-6 gap-6">
        {/* Navigation Sidebar Drawer */}
        <aside className="w-full md:w-64 bg-white border border-slate-200 rounded-2xl p-3 shrink-0 shadow-2xs h-fit space-y-1">
          <div className="px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
            Console Navigation
          </div>

          {/* Tab 1: Economics */}
          <button
            type="button"
            onClick={() => setActiveTab('economics')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
              activeTab === 'economics'
                ? 'bg-sky-50 text-[#0284C7] font-bold border-l-4 border-[#0284C7]'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Calculator className={`w-4 h-4 ${activeTab === 'economics' ? 'text-[#0284C7]' : 'text-slate-400'}`} />
              <span>Economics &amp; MRR</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
              +{marginPercentage}%
            </span>
          </button>

          {/* Tab 2: Brand Identity */}
          <button
            type="button"
            onClick={() => setActiveTab('brand')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2.5 ${
              activeTab === 'brand'
                ? 'bg-sky-50 text-[#0284C7] font-bold border-l-4 border-[#0284C7]'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent'
            }`}
          >
            <Palette className={`w-4 h-4 ${activeTab === 'brand' ? 'text-[#0284C7]' : 'text-slate-400'}`} />
            <span>Brand &amp; Debranding</span>
          </button>

          {/* Tab 3: CNAME & SSL */}
          <button
            type="button"
            onClick={() => setActiveTab('cname')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2.5 ${
              activeTab === 'cname'
                ? 'bg-sky-50 text-[#0284C7] font-bold border-l-4 border-[#0284C7]'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent'
            }`}
          >
            <Globe className={`w-4 h-4 ${activeTab === 'cname' ? 'text-[#0284C7]' : 'text-slate-400'}`} />
            <span>Subdomain CNAME</span>
          </button>

          {/* Tab 4: Practice Sub-Accounts */}
          <button
            type="button"
            onClick={() => setActiveTab('practices')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
              activeTab === 'practices'
                ? 'bg-sky-50 text-[#0284C7] font-bold border-l-4 border-[#0284C7]'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Building2 className={`w-4 h-4 ${activeTab === 'practices' ? 'text-[#0284C7]' : 'text-slate-400'}`} />
              <span>Practices Directory</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
              {practices.length}
            </span>
          </button>

          {/* Tab 5: Client Portal Preview */}
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2.5 ${
              activeTab === 'preview'
                ? 'bg-sky-50 text-[#0284C7] font-bold border-l-4 border-[#0284C7]'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent'
            }`}
          >
            <Eye className={`w-4 h-4 ${activeTab === 'preview' ? 'text-[#0284C7]' : 'text-slate-400'}`} />
            <span>Zero-Trace Preview</span>
          </button>

          {/* Tab 6: Billing & Plans */}
          <button
            type="button"
            onClick={() => setActiveTab('billing')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2.5 ${
              activeTab === 'billing'
                ? 'bg-sky-50 text-[#0284C7] font-bold border-l-4 border-[#0284C7]'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent'
            }`}
          >
            <CreditCard className={`w-4 h-4 ${activeTab === 'billing' ? 'text-[#0284C7]' : 'text-slate-400'}`} />
            <span>Wholesale Billing</span>
          </button>
        </aside>

        {/* 3. Main Viewport Panel */}
        <main className="flex-1 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-8">
          {/* TAB 1: ECONOMICS */}
          {activeTab === 'economics' && (
            <section id="section-economics" className="space-y-6">
              <div className="border-b border-slate-100 pb-4 space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0284C7] uppercase">
                  <TrendingUp className="w-4 h-4" />
                  <span>Wholesale Margins &amp; Run-Rate Calculator</span>
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Agency Cashflow &amp; Enterprise Unit Economics</h2>
                <p className="text-xs text-slate-500">
                  Model your agency monthly recurring revenue (MRR), gross margin percentage, and annual net run rate based on active clinic rosters.
                </p>
              </div>

              {/* Metric Cards Top Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1">
                  <div className="text-[11px] font-mono font-bold uppercase text-slate-500">Gross Monthly MRR</div>
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    ${monthlyRevenue.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">{clinicCount} clinics &times; ${agencyBillRate}/mo</div>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1">
                  <div className="text-[11px] font-mono font-bold uppercase text-slate-500">Wholesale VeloGEO Fee</div>
                  <div className="text-2xl font-black text-slate-700 font-mono">
                    ${wholesaleCost.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">Flat $297 wholesale tier</div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-1">
                  <div className="text-[11px] font-mono font-bold uppercase text-emerald-800">Net Monthly Profit</div>
                  <div className="text-2xl font-black text-emerald-600 font-mono">
                    ${netMonthlyProfit.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-mono">{marginPercentage}% Net Margin</div>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1">
                  <div className="text-[11px] font-mono font-bold uppercase text-slate-500">Annual Run Rate (ARR)</div>
                  <div className="text-2xl font-black text-[#0284C7] font-mono">
                    ${annualRunRate.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">Projected 12-month net profit</div>
                </div>
              </div>

              {/* Interactive Sliders */}
              <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#0284C7]" />
                    <span>Real-Time Parameter Simulation</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-500">Dynamic Calculation</span>
                </div>

                {/* Slider 1: Clinic Count */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-700">Managed Clinic Clients:</span>
                    <span className="font-mono text-base font-black text-[#0284C7] bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-2xs">
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
                    <span>10 Clinics (Typical Small Agency)</span>
                    <span>25 Clinics</span>
                    <span>50 Clinics</span>
                  </div>
                </div>

                {/* Slider 2: Agency Bill Rate */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-700">Monthly Retail Retainer Billed per Clinic:</span>
                    <span className="font-mono text-base font-black text-emerald-600 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-2xs">
                      ${agencyBillRate} / month
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
                    <span>$450/mo (Basic GEO)</span>
                    <span>$650/mo (Recommended Standard)</span>
                    <span>$1,000/mo (Multi-Specialist)</span>
                    <span>$1,500/mo (Enterprise)</span>
                  </div>
                </div>

                {/* Breakdown Summary Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white text-xs">
                  <div className="p-3 bg-slate-50 border-b border-slate-200 font-bold text-slate-700 flex justify-between items-center">
                    <span>Cashflow Breakdown Ledger</span>
                    <span className="font-mono text-[11px] text-slate-500">Formula: (Clinics &times; Retainer) - Wholesale</span>
                  </div>
                  <div className="divide-y divide-slate-100 font-mono text-slate-700">
                    <div className="p-3 flex justify-between">
                      <span className="text-slate-500">Gross Monthly Invoiced:</span>
                      <span className="font-bold">{clinicCount} &times; ${agencyBillRate} = ${monthlyRevenue.toLocaleString()} / mo</span>
                    </div>
                    <div className="p-3 flex justify-between">
                      <span className="text-slate-500">VeloGEO Wholesale Cost:</span>
                      <span className="text-slate-600 font-bold">-${wholesaleCost.toLocaleString()} / mo</span>
                    </div>
                    <div className="p-3 flex justify-between bg-emerald-50/50 text-emerald-800 font-bold">
                      <span>Agency Net Retained Cashflow:</span>
                      <span className="text-emerald-700 text-sm">${netMonthlyProfit.toLocaleString()} / month (${annualRunRate.toLocaleString()} ARR)</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* TAB 2: BRAND & DEBRANDING */}
          {activeTab === 'brand' && (
            <section id="section-brand" className="space-y-6">
              <div className="border-b border-slate-100 pb-4 space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0284C7] uppercase">
                  <Palette className="w-4 h-4" />
                  <span>White-Label Customization</span>
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Agency Brand Identity &amp; Zero-Trace Parameters</h2>
                <p className="text-xs text-slate-500">
                  Configure custom agency branding, primary hex accents, and zero-trace debranding to eliminate all platform references.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Agency Portal Title</label>
                  <input
                    type="text"
                    value={portalName}
                    onChange={(e) => setPortalName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7]"
                  />
                  <p className="text-[11px] text-slate-400">Displayed in client reports, portal navbar, and PDF metadata.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Agency Support &amp; Dispatch Email</label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7]"
                  />
                  <p className="text-[11px] text-slate-400">All client audit notifications will dispatch from this address.</p>
                </div>
              </div>

              {/* Logo Asset */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Agency Brand Asset</label>
                <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-200 flex items-center justify-center overflow-hidden shadow-2xs">
                      <img
                        src="/logo.png"
                        alt="Agency Logo"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/logo.svg';
                        }}
                      />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-900">Current Logo Asset (/logo.png)</div>
                      <div className="text-[11px] text-slate-500 font-mono">512x512 Transparent PNG recommended &bull; Active</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => alert('Brand asset updated!')}
                    className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                  >
                    Replace Asset
                  </button>
                </div>
              </div>

              {/* Hex Swatch */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Primary Brand Accent Hex Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={customHex}
                    onChange={(e) => setCustomHex(e.target.value)}
                    className="w-10 h-10 rounded-xl border border-slate-300 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={customHex}
                    onChange={(e) => setCustomHex(e.target.value)}
                    className="w-32 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
                  />
                  <span
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-2xs font-mono"
                    style={{ backgroundColor: customHex }}
                  >
                    Live Preview Swatch
                  </span>
                </div>
              </div>

              {/* 100% Zero-Trace Toggle */}
              <div className="pt-2">
                <label className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={debrandedToggle}
                    onChange={(e) => setDebrandedToggle(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-[#0284C7] focus:ring-[#0284C7]"
                  />
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900">
                      100% Zero-Trace Debranding Active
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Suppresses every mention of VeloGEO across client reports, schema headers, and email alerts. Your client sees only your agency name.
                    </div>
                  </div>
                </label>
              </div>
            </section>
          )}

          {/* TAB 3: CNAME & SSL */}
          {activeTab === 'cname' && (
            <section id="section-cname" className="space-y-6">
              <div className="border-b border-slate-100 pb-4 space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0284C7] uppercase">
                  <Globe className="w-4 h-4" />
                  <span>Custom Subdomain Routing</span>
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">CNAME Subdomain Mapping &amp; SSL Proxy Guide</h2>
                <p className="text-xs text-slate-500">
                  Map your own custom subdomain (e.g. audit.youragency.com) to point to proxy.velogeo.com with automatic TLS encryption.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Agency Custom Subdomain</label>
                    <input
                      type="text"
                      value={customSubdomain}
                      onChange={(e) => setCustomSubdomain(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7]"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono flex items-center justify-between">
                    <span className="text-slate-500">CNAME target:</span>
                    <span className="font-bold text-[#0284C7]">proxy.velogeo.com</span>
                  </div>
                </div>

                {/* DNS Instructions Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase border-b border-slate-200">
                      <tr>
                        <th className="p-3">Type</th>
                        <th className="p-3">Host / Name</th>
                        <th className="p-3">Points To</th>
                        <th className="p-3">TTL</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono text-slate-800">
                      <tr>
                        <td className="p-3 font-bold text-[#0284C7]">CNAME</td>
                        <td className="p-3">audit</td>
                        <td className="p-3 font-bold">proxy.velogeo.com</td>
                        <td className="p-3 text-slate-500">Auto / 300s</td>
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
                        <span>Verifying DNS Records...</span>
                      </>
                    ) : (
                      <>
                        <Server className="w-3.5 h-3.5 text-[#0284C7]" />
                        <span>Test DNS Propagation</span>
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
            </section>
          )}

          {/* TAB 4: PRACTICES DIRECTORY */}
          {activeTab === 'practices' && (
            <section id="section-practices" className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0284C7] uppercase">
                    <Building2 className="w-4 h-4" />
                    <span>Client Roster Management</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Practice Sub-Accounts Directory</h2>
                  <p className="text-xs text-slate-500">Manage individual clinic accounts, generate dedicated report links, and inspect schema integrity.</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative w-48 sm:w-56">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter clinics..."
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#0284C7] hover:bg-[#0369a1] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Clinic</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Practice Entity</th>
                      <th className="px-4 py-3">Clinical Specialty</th>
                      <th className="px-4 py-3">Domain</th>
                      <th className="px-4 py-3">Registry ID</th>
                      <th className="px-4 py-3">GEO Score</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPractices.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">{p.name}</td>
                        <td className="px-4 py-3 text-slate-600">{p.specialty}</td>
                        <td className="px-4 py-3 font-mono text-[#0284C7] font-semibold">{p.domain}</td>
                        <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{p.npiAhpra}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {p.schemaHealth}/100
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right space-x-1.5">
                          <button
                            type="button"
                            onClick={() => copyPracticeReportLink(p.domain)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0284C7]/10 hover:bg-[#0284C7]/20 text-[#0284C7] text-[11px] font-bold transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedLink === p.domain ? 'Copied!' : 'Copy Link'}</span>
                          </button>

                          <Link
                            href={`/report/${p.domain}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-colors"
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
            </section>
          )}

          {/* TAB 5: ZERO-TRACE PREVIEW */}
          {activeTab === 'preview' && (
            <section id="section-preview" className="space-y-6">
              <div className="border-b border-slate-100 pb-4 space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0284C7] uppercase">
                  <Eye className="w-4 h-4" />
                  <span>Browser Emulation</span>
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Live Zero-Trace Client Report Mockup</h2>
                <p className="text-xs text-slate-500">
                  Preview exactly how the end-client experiences their clinical report under your agency branding.
                </p>
              </div>

              {/* Browser Window Mockup */}
              <div className="border border-slate-300 rounded-2xl overflow-hidden shadow-sm bg-slate-50">
                {/* Browser Address Bar */}
                <div className="bg-slate-200/80 px-4 py-2.5 flex items-center gap-3 border-b border-slate-300">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex-1 max-w-md mx-auto bg-white rounded-md px-3 py-1 text-[11px] text-slate-600 font-mono text-center border border-slate-300 flex items-center justify-center gap-1.5">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    <span>https://{customSubdomain}/report/aspendental.com</span>
                  </div>
                </div>

                {/* Browser Content */}
                <div className="p-6 bg-white space-y-6">
                  {/* Agency Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center overflow-hidden">
                        <img
                          src="/logo.png"
                          alt="Agency Logo"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/logo.svg';
                          }}
                        />
                      </div>
                      <span className="font-bold text-slate-900 text-sm">{portalName}</span>
                    </div>

                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-2xs font-mono"
                      style={{ backgroundColor: customHex }}
                    >
                      Verified Client View
                    </span>
                  </div>

                  {/* Sample Mock Report Content */}
                  <div className="p-5 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs font-mono text-emerald-600 font-bold">NPI-1928374650 Verified</div>
                        <h4 className="text-base font-bold text-slate-900">Aspen Dental Specialists</h4>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 font-mono uppercase">Readiness</div>
                        <div className="text-xl font-black text-emerald-600 font-mono">98/100</div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600">
                      Notice: Zero references to VeloGEO. 100% white-labeled under {portalName}. Your clients see only your agency identity.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* TAB 6: BILLING & PLANS */}
          {activeTab === 'billing' && (
            <section id="section-billing" className="space-y-6">
              <div className="border-b border-slate-100 pb-4 space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0284C7] uppercase">
                  <CreditCard className="w-4 h-4" />
                  <span>Wholesale License</span>
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Agency Wholesale Tier &amp; Subscription Safeguard</h2>
                <p className="text-xs text-slate-500">Manage wholesale pricing plans and secure cancellation safeguard.</p>
              </div>

              <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-md">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Active Enterprise License
                    </span>
                    <h3 className="text-xl font-black text-white">Agency Wholesale Partner ($297/mo)</h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Unlimited Client Audits &bull; Next billing date: November 15, 2026 &bull; Visa ending 4821
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsCancelModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all"
                  >
                    Manage / Cancel Plan
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                    <div className="text-slate-400 font-sans">Active Sub-Accounts</div>
                    <div className="text-xl font-black text-white">{practices.length} Practices</div>
                    <div className="text-[10px] text-emerald-400">Unlimited quota enabled</div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                    <div className="text-slate-400 font-sans">Monthly Wholesale Cost</div>
                    <div className="text-xl font-black text-[#0284C7]">$297.00</div>
                    <div className="text-[10px] text-slate-400">Fixed rate &bull; 0% audit fee</div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                    <div className="text-slate-400 font-sans">14-Day Assurance</div>
                    <div className="text-xl font-black text-emerald-400">Protected</div>
                    <div className="text-[10px] text-slate-400">100% money-back guarantee</div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* MODAL 1: Add Practice Sub-Account */}
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

            <form onSubmit={handleAddPractice} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Practice Name</label>
                <input
                  type="text"
                  required
                  value={newPracticeName}
                  onChange={(e) => setNewPracticeName(e.target.value)}
                  placeholder="Austin Cosmetic Dentistry"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Clinical Specialty</label>
                <input
                  type="text"
                  required
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  placeholder="Cosmetic & Restorative Dentistry"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Practice Domain</label>
                <input
                  type="text"
                  required
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="austincosmetic.com"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Registry NPI Identifier</label>
                <input
                  type="text"
                  required
                  value={newNpi}
                  onChange={(e) => setNewNpi(e.target.value)}
                  placeholder="NPI-1928374650"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-xs"
                >
                  Save Practice Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Cancellation Safeguard */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <span>Subscription Management Safeguard</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Your wholesale agency plan includes 14-day assurance. Deactivating will disable CNAME routing across all {practices.length} client domains.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Reason for Modification</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Optional feedback for partner support..."
                rows={3}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800"
              >
                Keep Active
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Cancellation request submitted to support. 14-day assurance applied.');
                  setIsCancelModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                Confirm Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
