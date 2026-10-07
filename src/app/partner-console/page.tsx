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
  Sliders,
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
  AlertTriangle,
} from 'lucide-react';

export type CategoryTab = 'brand' | 'cname' | 'practices' | 'preview' | 'billing';

export default function PartnerConsolePage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<CategoryTab>('brand');

  // Form & Config State (Horizon Health Growth Debranding Model)
  const [portalName, setPortalName] = useState('Horizon Health Growth');
  const [supportEmail, setSupportEmail] = useState('contact@horizonhealth.io');
  const [customHex, setCustomHex] = useState('#0284C7');
  const [debrandedToggle, setDebrandedToggle] = useState(true);
  const [customSubdomain, setCustomSubdomain] = useState('audit.horizonhealth.io');

  // Interaction feedback states
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [dnsTesting, setDnsTesting] = useState(false);
  const [dnsVerified, setDnsVerified] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCompany, setActiveCompany] = useState('Horizon Health Growth');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Add Practice Form state
  const [newPracticeName, setNewPracticeName] = useState('Aspen Dental Clinic');
  const [newSpecialty, setNewSpecialty] = useState('General & Cosmetic Dentistry');
  const [newDomain, setNewDomain] = useState('aspendental.com');
  const [newNpi, setNewNpi] = useState('NPI-1928374650');

  // Sub-accounts data
  const [practices, setPractices] = useState([
    {
      id: 'pr-101',
      name: 'Aspen Dental Clinic',
      specialty: 'General & Cosmetic Dentistry',
      domain: 'aspendental.com',
      slug: 'aspen-dental',
      npiAhpra: 'NPI-1928374650',
      schemaHealth: 96,
      status: 'Active',
    },
    {
      id: 'pr-102',
      name: 'Apex Orthopedic Surgery',
      specialty: 'Orthopedic & Sports Medicine',
      domain: 'apexortho.com',
      slug: 'apex-ortho',
      npiAhpra: 'NPI-1827364590',
      schemaHealth: 94,
      status: 'Active',
    },
    {
      id: 'pr-103',
      name: 'Dr. Jane Smith Specialist',
      specialty: 'Dermatology & Plastic Surgery',
      domain: 'drjanesmith.com.au',
      slug: 'dr-jane-smith',
      npiAhpra: 'AHPRA-MED0002938',
      schemaHealth: 92,
      status: 'Active',
    },
    {
      id: 'pr-104',
      name: 'Bayside Family Practice',
      specialty: 'General Practice & Pediatrics',
      domain: 'baysidehealth.org',
      slug: 'bayside-health',
      npiAhpra: 'NPI-1049586720',
      schemaHealth: 88,
      status: 'Active',
    },
  ]);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('agencyConfig');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.agencyName) setPortalName(parsed.agencyName);
        if (parsed.agencyName) setActiveCompany(parsed.agencyName);
        if (parsed.contactEmail) setSupportEmail(parsed.contactEmail);
        if (parsed.customHexColor) setCustomHex(parsed.customHexColor);
      }
    } catch {
      // Fallback defaults
    }
  }, []);

  if (!mounted) return null;

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
    setPortalName('Horizon Health Growth');
    setSupportEmail('contact@horizonhealth.io');
    setCustomHex('#0284C7');
    setDebrandedToggle(true);
    setCustomSubdomain('audit.horizonhealth.io');
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
    const slug = newPracticeName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newEntry = {
      id: `pr-${Date.now()}`,
      name: newPracticeName,
      specialty: newSpecialty,
      domain: newDomain,
      slug: slug,
      npiAhpra: newNpi,
      schemaHealth: 96,
      status: 'Active',
    };
    setPractices([newEntry, ...practices]);
    setIsAddModalOpen(false);
    setNewPracticeName('');
    setNewSpecialty('');
    setNewDomain('');
    setNewNpi('');
  };

  const filteredPractices = practices.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 flex flex-col font-sans selection:bg-[#0284C7]/20 selection:text-[#0284C7]">
      {/* 1. Top Control Bar (Odoo ControlPanel) */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-2xs">
        {/* Left: Breadcrumbs & Multi-Company Selector */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-slate-800 transition-colors">Settings</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-slate-900 text-sm">White-Label Partner Console</span>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Odoo Multi-Company Selector */}
          <div className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 hover:border-slate-300 transition-colors cursor-pointer">
            <Building2 className="w-4 h-4 text-[#0284C7]" />
            <span>{activeCompany}</span>
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#0284C7]/10 text-[#0284C7] border border-[#0284C7]/20">
              {practices.length} Practices
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Right: Save / Discard Controls */}
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Changes Saved to Enterprise Edge</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleDiscard}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs active:scale-95 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Discard</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-lg bg-[#0284C7] hover:bg-[#0369a1] text-white text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-2 disabled:opacity-50"
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

      {/* 2. Two-Column Settings Canvas */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto my-6 px-4 sm:px-6 gap-6">
        {/* Sidebar Navigation Drawer */}
        <aside className="w-full md:w-64 bg-white border border-slate-200 rounded-2xl p-3 shrink-0 shadow-2xs h-fit space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Console Categories
          </div>

          {/* Tab 1: Brand Identity & Debranding */}
          <button
            type="button"
            onClick={() => setActiveTab('brand')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2.5 ${
              activeTab === 'brand'
                ? 'bg-sky-50 text-sky-700 font-semibold border-l-4 border-sky-600'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-l-4 border-transparent'
            }`}
          >
            <Palette className={`w-4 h-4 ${activeTab === 'brand' ? 'text-sky-600' : 'text-slate-500'}`} />
            <span>Brand Identity &amp; Debranding</span>
          </button>

          {/* Tab 2: Custom CNAME & SSL */}
          <button
            type="button"
            onClick={() => setActiveTab('cname')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2.5 ${
              activeTab === 'cname'
                ? 'bg-sky-50 text-sky-700 font-semibold border-l-4 border-sky-600'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-l-4 border-transparent'
            }`}
          >
            <Globe className={`w-4 h-4 ${activeTab === 'cname' ? 'text-sky-600' : 'text-slate-500'}`} />
            <span>Custom CNAME &amp; SSL</span>
          </button>

          {/* Tab 3: Practice Sub-Accounts */}
          <button
            type="button"
            onClick={() => setActiveTab('practices')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2.5 ${
              activeTab === 'practices'
                ? 'bg-sky-50 text-sky-700 font-semibold border-l-4 border-sky-600'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-l-4 border-transparent'
            }`}
          >
            <Building2 className={`w-4 h-4 ${activeTab === 'practices' ? 'text-sky-600' : 'text-slate-500'}`} />
            <span>Practice Sub-Accounts</span>
          </button>

          {/* Tab 4: Client Portal Preview */}
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2.5 ${
              activeTab === 'preview'
                ? 'bg-sky-50 text-sky-700 font-semibold border-l-4 border-sky-600'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-l-4 border-transparent'
            }`}
          >
            <Eye className={`w-4 h-4 ${activeTab === 'preview' ? 'text-sky-600' : 'text-slate-500'}`} />
            <span>Client Portal Preview</span>
          </button>

          {/* Tab 5: Billing & Subscription */}
          <button
            type="button"
            onClick={() => setActiveTab('billing')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2.5 ${
              activeTab === 'billing'
                ? 'bg-sky-50 text-sky-700 font-semibold border-l-4 border-sky-600'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-l-4 border-transparent'
            }`}
          >
            <CreditCard className={`w-4 h-4 ${activeTab === 'billing' ? 'text-sky-600' : 'text-slate-500'}`} />
            <span>Billing &amp; Subscription</span>
          </button>
        </aside>

        {/* 3. Dynamic Main Content Viewport */}
        <main className="flex-1 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-8">
          {/* TAB 1: Brand Identity & Debranding */}
          {activeTab === 'brand' && (
            <section id="section-brand" className="space-y-6">
              <div className="border-b border-slate-200 pb-4 space-y-1">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-[#0284C7]" />
                  <span>Brand Identity &amp; White-Label Portal</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Configure white-label agency branding, primary accent swatches, custom logo assets, and debranding parameters.
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
                  <p className="text-[11px] text-slate-400">Displayed in browser headers, agency report PDFs, and client emails.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Support &amp; Dispatch Email</label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7]"
                  />
                  <p className="text-[11px] text-slate-400">All practice audit alerts and client PDF reports send from this email address.</p>
                </div>
              </div>

              {/* Logo Preview */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Agency Brand Logo Asset</label>
                <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden shadow-xs">
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
                      <div className="text-xs font-bold text-slate-900">Current Logo (/logo.png)</div>
                      <div className="text-[11px] text-slate-500">Vector SVG fallback active &bull; Recommended 512x512 PNG</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => alert('Logo asset updated!')}
                    className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
                  >
                    Change Asset
                  </button>
                </div>
              </div>

              {/* Accent Color Swatch */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Primary Theme Accent Swatch</label>
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
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-2xs"
                    style={{ backgroundColor: customHex }}
                  >
                    Live Accent Swatch
                  </span>
                </div>
              </div>

              {/* Debranded Toggle */}
              <div className="pt-2">
                <label className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/80 transition-colors">
                  <input
                    type="checkbox"
                    checked={debrandedToggle}
                    onChange={(e) => setDebrandedToggle(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-[#0284C7] focus:ring-[#0284C7]"
                  />
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900">
                      Remove all AI NEXUS system footers and attribution (100% Debranded)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Ensures your clients see zero reference to AI NEXUS. All reports and portals present exclusively as your proprietary agency solution.
                    </div>
                  </div>
                </label>
              </div>
            </section>
          )}

          {/* TAB 2: Custom CNAME & SSL */}
          {activeTab === 'cname' && (
            <section id="section-cname" className="space-y-6">
              <div className="border-b border-slate-200 pb-4 space-y-1">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#0284C7]" />
                  <span>Custom CNAME &amp; SSL Proxy</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Route client GEO audit portals through your custom domain with edge SSL encryption.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Custom Domain Subdomain</label>
                    <input
                      type="text"
                      value={customSubdomain}
                      onChange={(e) => setCustomSubdomain(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7]"
                    />
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-600 flex items-center justify-between">
                    <span>CNAME points to:</span>
                    <span className="font-bold text-[#0284C7]">proxy.ainexus.engine</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <button
                    type="button"
                    onClick={handleTestDns}
                    disabled={dnsTesting}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-2xs transition-all flex items-center gap-2"
                  >
                    {dnsTesting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#38BDF8]" />
                        <span>Checking DNS Records...</span>
                      </>
                    ) : (
                      <>
                        <Server className="w-3.5 h-3.5 text-[#38BDF8]" />
                        <span>Test DNS Propagation</span>
                      </>
                    )}
                  </button>

                  {dnsVerified && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>SSL Certificate Active &bull; Cloudflare Edge Proxy Live</span>
                    </span>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* TAB 3: Practice Sub-Accounts */}
          {activeTab === 'practices' && (
            <section id="section-practices" className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#0284C7]" />
                    <span>Medical Practice Sub-Accounts</span>
                  </h2>
                  <p className="text-xs text-slate-500">Manage client practice accounts, NPI/AHPRA verification status, and Schema health scores.</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative w-48 sm:w-56">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter practice..."
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#0284C7] hover:bg-[#0369a1] text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Practice</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Practice Name</th>
                      <th className="px-4 py-3">Specialty</th>
                      <th className="px-4 py-3">Assigned Domain</th>
                      <th className="px-4 py-3">Registry ID</th>
                      <th className="px-4 py-3">Schema Score</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {filteredPractices.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">{p.name}</td>
                        <td className="px-4 py-3 text-slate-600">{p.specialty}</td>
                        <td className="px-4 py-3 font-mono text-[#0284C7] font-semibold">{p.domain}</td>
                        <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{p.npiAhpra}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {p.schemaHealth}% Healthy
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right space-x-1.5">
                          <Link
                            href={`/report/${p.slug}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0284C7]/10 hover:bg-[#0284C7]/20 text-[#0284C7] text-[11px] font-bold transition-colors"
                          >
                            <Share2 className="w-3 h-3" />
                            <span>Share Link</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => alert(`GEO Audit launched for ${p.domain}`)}
                            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-colors"
                          >
                            Run GEO Audit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* TAB 4: Client Portal Preview */}
          {activeTab === 'preview' && (
            <section id="section-preview" className="space-y-6">
              <div className="border-b border-slate-200 pb-4 space-y-1">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-[#0284C7]" />
                  <span>Live Unbranded Client Preview</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Mock preview showing how end-clients interact with your customized white-label portal.
                </p>
              </div>

              <div className="border border-slate-300 rounded-2xl overflow-hidden shadow-lg bg-slate-50">
                <div className="bg-slate-200 px-4 py-2 flex items-center gap-2 border-b border-slate-300">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex-1 max-w-sm mx-auto bg-white rounded-md px-3 py-0.5 text-[11px] text-slate-600 font-mono text-center border border-slate-300">
                    https://{customSubdomain}/report/aspen-dental
                  </div>
                </div>

                <div className="p-6 bg-white space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center overflow-hidden">
                        <img
                          src="/logo.png"
                          alt="Agency Preview Logo"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/logo.svg';
                          }}
                        />
                      </div>
                      <span className="font-bold text-slate-900 text-sm">{portalName}</span>
                    </div>

                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-2xs"
                      style={{ backgroundColor: customHex }}
                    >
                      Client Workspace Active
                    </span>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="text-xs font-bold text-slate-900">Client Audit Summary &bull; Aspen Dental Clinic</div>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      Schema.org DentalClinic @graph structure and NPI-1928374650 verified. 100% debranded view with zero platform attribution.
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* TAB 5: Billing & Subscription */}
          {activeTab === 'billing' && (
            <section id="section-billing" className="space-y-6">
              <div className="border-b border-slate-200 pb-4 space-y-1">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#0284C7]" />
                  <span>Agency Billing &amp; Subscription Panel</span>
                </h2>
                <p className="text-xs text-slate-500">Manage wholesale subscription tier, payment cycle, and sub-account limits.</p>
              </div>

              <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-6 shadow-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Active Wholesale Tier</div>
                    <div className="text-xl font-black">Agency Wholesale Partner License ($297/mo)</div>
                    <div className="text-xs text-slate-400">Next billing cycle: November 7, 2026 &bull; Billed to Visa ending 4821</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsCancelModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all"
                  >
                    Cancel / Manage Subscription
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div className="text-slate-400 font-sans">Active Sub-Accounts</div>
                    <div className="text-lg font-black text-white">{practices.length} / Unlimited</div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div className="text-slate-400 font-sans">Wholesale Monthly Rate</div>
                    <div className="text-lg font-black text-[#38BDF8]">$297.00 / mo</div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div className="text-slate-400 font-sans">Debranded CNAME Domain</div>
                    <div className="text-lg font-black text-emerald-400">Active</div>
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
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#0284C7]" />
                <span>Add New Medical Practice</span>
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
                  placeholder="Aspen Dental Clinic"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Specialty</label>
                <input
                  type="text"
                  required
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  placeholder="General & Cosmetic Dentistry"
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
                  placeholder="aspendental.com"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Registry NPI / AHPRA ID</label>
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
                  className="px-5 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-md"
                >
                  Save Practice Sub-Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Cancel / Manage Subscription */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Subscription Management</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                You are currently on the <strong className="text-slate-900">Agency Wholesale Partner Tier ($297/mo)</strong>. Canceling will downgrade your CNAME custom domain routing and disable client report debranding at the end of your billing cycle (Nov 7, 2026).
              </p>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Reason for Downgrade / Cancellation</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                >
                  <option value="">Select a reason...</option>
                  <option value="too_expensive">Consolidating agency software stack</option>
                  <option value="fewer_clients">Decreasing client practice volume</option>
                  <option value="temporary">Pausing agency operations temporarily</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
              >
                Keep Active Subscription
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Subscription cancellation request submitted. Your plan remains active through Nov 7, 2026.');
                  setIsCancelModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
