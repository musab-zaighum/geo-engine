'use client';

import React, { useState, useEffect } from 'react';
import {
  Palette,
  Building,
  Image as ImageIcon,
  Sparkles,
  Check,
  Eye,
  Globe,
  RefreshCw,
} from 'lucide-react';
import { WhiteLabelConfig } from '@/lib/types';

export default function WhiteLabelPage() {
  const [mounted, setMounted] = useState(false);
  const [config, setConfig] = useState<WhiteLabelConfig>({
    agencyName: 'Apex Healthcare Growth Partners',
    agencySlug: 'geo.apexmarketing.com',
    agencyLogoUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=120&auto=format&fit=crop&q=80',
    primaryColor: 'blue',
    customHexColor: '#0284C7',
    supportUrl: 'https://cal.com/apex-health-audit',
    badgeTitle: 'Official Agency Partner',
    contactEmail: 'contact@apexhealthmarketing.com',
    customReportFooter: 'This confidential GEO audit report is prepared exclusively for practice evaluation. All Schema.org @graph specifications and practitioner credentials are independently verified against published AHPRA and NPI standards.',
  });

  const [saved, setSaved] = useState(false);
  const [polishing, setPolishing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#0284C7]">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm font-semibold">Loading White-Label Suite...</span>
        </div>
      </div>
    );
  }


  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAiPolish = async () => {
    if (!config.customReportFooter.trim() || polishing) return;
    setPolishing(true);

    try {
      const res = await fetch('/api/ai-polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: config.customReportFooter }),
      });

      const data = await res.json();
      if (res.ok && data.polishedText) {
        setConfig({ ...config, customReportFooter: data.polishedText });
      }
    } catch {
      // Catch network errors
    } finally {
      setPolishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-2xs">
          <Palette className="w-3.5 h-3.5 text-blue-600" />
          <span>Agency White-Label Suite</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          White-Label Agency Portal
        </h1>
        <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
          Generate unbranded or co-branded GEO audit reports, configure custom domains, and set client disclaimer footers.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Controls */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-600" />
            <span>Agency Customization Controls</span>
          </h2>

          <div className="space-y-4">
            {/* 1. Agency Name & Custom Domain Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Agency Name</label>
                <input
                  type="text"
                  value={config.agencyName}
                  onChange={(e) => setConfig({ ...config, agencyName: e.target.value })}
                  placeholder="Apex Healthcare Marketing"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Custom Domain Slug</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={config.agencySlug}
                    onChange={(e) => setConfig({ ...config, agencySlug: e.target.value })}
                    placeholder="geo.apexmarketing.com"
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* 2. Agency Logo URL */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Agency Logo Image URL</label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={config.agencyLogoUrl}
                  onChange={(e) => setConfig({ ...config, agencyLogoUrl: e.target.value })}
                  placeholder="https://your-agency.com/logo.png"
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>

            {/* 3. Report Partner Badge */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Report Partner Badge Title</label>
              <select
                value={config.badgeTitle}
                onChange={(e) => setConfig({ ...config, badgeTitle: e.target.value as any })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              >
                <option value="Official Partner">Official Partner</option>
                <option value="Verified Specialist">Verified Specialist</option>
                <option value="Certified Technical Auditor">Certified Technical Auditor</option>
              </select>
            </div>

            {/* 4. Brand Primary Accent Color */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Brand Accent Palette &amp; Custom HEX</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {[
                    { id: 'blue', hex: '#2563eb', bg: 'bg-blue-600' },
                    { id: 'sky', hex: '#0284c7', bg: 'bg-sky-600' },
                    { id: 'indigo', hex: '#4f46e5', bg: 'bg-indigo-600' },
                    { id: 'emerald', hex: '#059669', bg: 'bg-emerald-600' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setConfig({ ...config, primaryColor: c.id, customHexColor: c.hex })}
                      className={`w-7 h-7 rounded-full ${c.bg} flex items-center justify-center transition-transform ${
                        config.customHexColor === c.hex ? 'ring-2 ring-offset-2 ring-blue-600 scale-110' : ''
                      }`}
                    >
                      {config.customHexColor === c.hex && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>

                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">Hex</span>
                  <input
                    type="text"
                    value={config.customHexColor}
                    onChange={(e) => setConfig({ ...config, customHexColor: e.target.value })}
                    placeholder="#2563eb"
                    className="w-full pl-10 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* 5. Custom Report Footer Disclaimer */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">Custom Report Footer Disclaimer</label>
                <button
                  type="button"
                  onClick={handleAiPolish}
                  disabled={polishing || !config.customReportFooter.trim()}
                  className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold border border-blue-200 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {polishing ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin text-blue-600" />
                      <span>Polishing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 text-blue-600" />
                      <span>Polish Disclaimer</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                value={config.customReportFooter}
                onChange={(e) => setConfig({ ...config, customReportFooter: e.target.value })}
                rows={3}
                placeholder="Custom footer disclaimer..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 leading-relaxed font-sans"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Configuration Saved</span>
              </>
            ) : (
              <>
                <span>Save White-Label Profile</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Real-Time Live Report Preview Card */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-blue-600" />
              <span>Real-Time Live Report Preview</span>
            </span>
            <span className="text-blue-600 font-mono">{config.agencySlug}</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            {/* Header Preview */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-bold text-lg shadow-2xs"
                  style={{ backgroundColor: config.customHexColor || '#2563eb' }}
                >
                  {config.agencyName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{config.agencyName}</h4>
                  <p className="text-xs text-slate-500 font-mono">{config.agencySlug}</p>
                </div>
              </div>

              <div
                className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase border shadow-2xs"
                style={{
                  color: config.customHexColor || '#2563eb',
                  borderColor: config.customHexColor || '#2563eb',
                  backgroundColor: 'rgba(37, 99, 235, 0.08)',
                }}
              >
                {config.badgeTitle}
              </div>
            </div>

            {/* Sample Audit Report */}
            <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Practice: Sydney Plastic Surgery Centre</span>
                <span style={{ color: config.customHexColor || '#2563eb' }} className="font-mono font-bold">
                  GEO Score: 100/100
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                This practice has deployed Schema.org <code className="text-blue-700 bg-white px-1 py-0.5 rounded border border-slate-200 font-mono">@graph</code> JSON-LD and a domain <code className="text-blue-700 bg-white px-1 py-0.5 rounded border border-slate-200 font-mono">/llms.txt</code> file containing Ahpra registration credentials.
              </p>
            </div>

            {/* Custom Disclaimer Footer */}
            <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 italic text-center leading-relaxed">
              {config.customReportFooter}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
