'use client';

import React, { useState } from 'react';
import {
  Palette,
  Building,
  Image as ImageIcon,
  Mail,
  Sparkles,
  Check,
  Eye,
  Globe,
  Calendar,
  Award,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { WhiteLabelConfig } from '@/lib/types';

export default function WhiteLabelPage() {
  const [config, setConfig] = useState<WhiteLabelConfig>({
    agencyName: 'Apex Healthcare Growth Partners',
    agencySlug: 'geo.apexmarketing.com',
    agencyLogoUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=120&auto=format&fit=crop&q=80',
    primaryColor: 'teal',
    customHexColor: '#14b8a6',
    supportUrl: 'https://cal.com/apex-health-audit',
    badgeTitle: 'Official Agency Partner',
    contactEmail: 'contact@apexhealthmarketing.com',
    customReportFooter: 'This confidential GEO audit report is prepared exclusively for practice evaluation. All Schema.org @graph specifications and practitioner credentials are independently verified against published AHPRA and NPI standards.',
  });

  const [saved, setSaved] = useState(false);
  const [polishing, setPolishing] = useState(false);

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
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold uppercase tracking-wider">
          <Palette className="w-3.5 h-3.5" />
          Agency White-Label Suite
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          White-Label Agency Portal
        </h1>
        <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
          Generate unbranded or co-branded GEO audit reports, configure custom domains, and set client disclaimer footers.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Controls */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-teal-400" /> Agency Customization Controls
          </h2>

          <div className="space-y-4">
            {/* 1. Agency Name & Custom Domain Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Agency Name</label>
                <input
                  type="text"
                  value={config.agencyName}
                  onChange={(e) => setConfig({ ...config, agencyName: e.target.value })}
                  placeholder="Apex Healthcare Marketing"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Custom Domain Slug</label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={config.agencySlug}
                    onChange={(e) => setConfig({ ...config, agencySlug: e.target.value })}
                    placeholder="geo.apexmarketing.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* 2. Agency Logo URL */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Agency Logo Image URL</label>
              <div className="relative">
                <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={config.agencyLogoUrl}
                  onChange={(e) => setConfig({ ...config, agencyLogoUrl: e.target.value })}
                  placeholder="https://your-agency.com/logo.png"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* 3. Report Partner Badge */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Report Partner Badge Title</label>
              <select
                value={config.badgeTitle}
                onChange={(e) => setConfig({ ...config, badgeTitle: e.target.value as any })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-teal-500"
              >
                <option value="Official Partner">Official Partner</option>
                <option value="Verified Specialist">Verified Specialist</option>
                <option value="Certified Technical Auditor">Certified Technical Auditor</option>
              </select>
            </div>

            {/* 4. Brand Primary Accent Color */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Brand Accent Palette & Custom HEX</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {[
                    { id: 'teal', hex: '#14b8a6', bg: 'bg-teal-500' },
                    { id: 'blue', hex: '#0284c7', bg: 'bg-sky-500' },
                    { id: 'indigo', hex: '#6366f1', bg: 'bg-indigo-500' },
                    { id: 'emerald', hex: '#10b981', bg: 'bg-emerald-500' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setConfig({ ...config, primaryColor: c.id, customHexColor: c.hex })}
                      className={`w-7 h-7 rounded-full ${c.bg} flex items-center justify-center transition-transform ${
                        config.customHexColor === c.hex ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-white scale-110' : ''
                      }`}
                    >
                      {config.customHexColor === c.hex && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>

                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">Hex</span>
                  <input
                    type="text"
                    value={config.customHexColor}
                    onChange={(e) => setConfig({ ...config, customHexColor: e.target.value })}
                    placeholder="#14b8a6"
                    className="w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* 5. Custom Report Footer Disclaimer with AI Grammar Polish Button */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300">Custom Report Footer Disclaimer</label>
                <button
                  type="button"
                  onClick={handleAiPolish}
                  disabled={polishing || !config.customReportFooter.trim()}
                  className="px-3 py-1 bg-gradient-to-r from-teal-500 to-sky-600 hover:from-teal-400 hover:to-sky-500 text-white rounded-lg text-[11px] font-bold shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {polishing ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" /> Polishing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3" /> ✨ Polish with AI / Fix Grammar
                    </>
                  )}
                </button>
              </div>

              <textarea
                value={config.customReportFooter}
                onChange={(e) => setConfig({ ...config, customReportFooter: e.target.value })}
                rows={3}
                placeholder="Custom footer disclaimer..."
                className="w-full p-3 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500 leading-relaxed font-sans"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-sky-600 hover:from-teal-400 hover:to-sky-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-white" /> White-Label Profile Saved!
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-teal-200" /> Save White-Label Configuration
              </>
            )}
          </button>
        </div>

        {/* Right Column: Real-Time Live Report Preview Card */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-teal-400" /> Real-Time Live Report Preview
            </span>
            <span className="text-teal-400 font-mono">{config.agencySlug}</span>
          </div>

          <div className="bg-slate-900 border-2 border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Header Preview */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-black text-lg shadow-md"
                  style={{ backgroundColor: config.customHexColor || '#14b8a6' }}
                >
                  {config.agencyName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-sm">{config.agencyName}</h4>
                  <p className="text-[11px] text-slate-400 font-mono">{config.agencySlug}</p>
                </div>
              </div>

              <div
                className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border shadow-sm"
                style={{
                  color: config.customHexColor || '#14b8a6',
                  borderColor: config.customHexColor || '#14b8a6',
                  backgroundColor: 'rgba(20, 184, 166, 0.1)',
                }}
              >
                {config.badgeTitle}
              </div>
            </div>

            {/* Sample Audit Report */}
            <div className="space-y-3 p-4 bg-slate-950 border border-slate-800 rounded-2xl">
              <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                <span>Practice: Sydney Plastic Surgery Centre</span>
                <span style={{ color: config.customHexColor || '#14b8a6' }} className="font-mono font-bold">
                  GEO Score: 100/100
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                This practice has deployed Schema.org <code className="text-teal-300 font-mono">@graph</code> JSON-LD and a domain <code className="text-teal-300 font-mono">/llms.txt</code> file containing Ahpra registration credentials.
              </p>
            </div>

            {/* Custom Disclaimer Footer */}
            <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-400 italic text-center leading-relaxed">
              {config.customReportFooter}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
