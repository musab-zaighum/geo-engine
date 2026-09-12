'use client';

import React, { useState } from 'react';
import {
  Palette,
  Building,
  Image as ImageIcon,
  Mail,
  FileText,
  Sparkles,
  Check,
  Eye,
  Globe,
  Calendar,
  Award,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { WhiteLabelConfig } from '@/lib/types';

export function WhiteLabelCustomizer() {
  const [config, setConfig] = useState<WhiteLabelConfig>({
    agencyName: 'Apex Healthcare Growth Partners',
    agencySlug: 'audit.apexhealthmarketing.com',
    agencyLogoUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=120&auto=format&fit=crop&q=80',
    primaryColor: 'teal',
    customHexColor: '#0d9488',
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
      // Ignore network errors
    } finally {
      setPolishing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold">
          <Palette className="w-3.5 h-3.5 text-teal-600" />
          Agency White-Label Suite
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          White-Label Branding & Client Report Customizer
        </h2>
        <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
          Brand CiteMed audits and generated GEO artifacts with your agency name, custom domain slug, color palette, booking link, and AI-polished report footers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Settings Form */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-5 h-5 text-teal-600" /> Agency Customization Controls
          </h3>

          <div className="space-y-4">
            {/* Agency Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Agency Name</label>
              <input
                type="text"
                value={config.agencyName}
                onChange={(e) => setConfig({ ...config, agencyName: e.target.value })}
                placeholder="e.g. Apex Healthcare Marketing"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-teal-500 font-medium"
              />
            </div>

            {/* Custom Domain Slug */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Custom Domain Slug</label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={config.agencySlug}
                  onChange={(e) => setConfig({ ...config, agencySlug: e.target.value })}
                  placeholder="audit.apexhealthmarketing.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-teal-500 font-mono text-xs"
                />
              </div>
            </div>

            {/* Custom Support / Booking URL */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Custom Booking / Consultation Link</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={config.supportUrl}
                  onChange={(e) => setConfig({ ...config, supportUrl: e.target.value })}
                  placeholder="https://cal.com/apex-health"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Report Header Badge Title */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Report Header Badge Title</label>
              <select
                value={config.badgeTitle}
                onChange={(e) => setConfig({ ...config, badgeTitle: e.target.value as any })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-bold focus:outline-none focus:border-teal-500"
              >
                <option value="Official Agency Partner">Official Agency Partner</option>
                <option value="Verified GEO Consultant">Verified GEO Consultant</option>
                <option value="Healthcare Growth Specialist">Healthcare Growth Specialist</option>
              </select>
            </div>

            {/* Accent Color & Custom Hex Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Primary Brand Color & Custom Hex Code</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {[
                    { id: 'teal', hex: '#0d9488', bg: 'bg-teal-600' },
                    { id: 'blue', hex: '#0284c7', bg: 'bg-sky-600' },
                    { id: 'indigo', hex: '#4f46e5', bg: 'bg-indigo-600' },
                    { id: 'emerald', hex: '#059669', bg: 'bg-emerald-600' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setConfig({ ...config, primaryColor: c.id, customHexColor: c.hex })}
                      className={`w-7 h-7 rounded-full ${c.bg} flex items-center justify-center transition-transform ${
                        config.customHexColor === c.hex ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : ''
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
                    placeholder="#0d9488"
                    className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* Custom Report Disclaimer with AI Grammar Fixer */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Custom Report Footer Disclaimer</label>
                {/* AI Polish Button */}
                <button
                  type="button"
                  onClick={handleAiPolish}
                  disabled={polishing || !config.customReportFooter.trim()}
                  className="px-3 py-1 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white rounded-lg text-[11px] font-bold shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
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
                placeholder="Custom footer text..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-teal-500 leading-relaxed font-sans"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" /> Branding Profile Saved!
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-teal-400" /> Save White-Label Profile
              </>
            )}
          </button>
        </div>

        {/* Live Client Report Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-teal-600" /> Live Client PDF & Report Header Preview
            </span>
            <span className="text-teal-700 font-mono">{config.agencySlug}</span>
          </div>

          <div className="bg-white border-2 border-slate-300 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
            {/* Header Preview */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-black text-lg shadow-md"
                  style={{ backgroundColor: config.customHexColor || '#0d9488' }}
                >
                  {config.agencyName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{config.agencyName}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">{config.agencySlug}</p>
                </div>
              </div>

              <div
                className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border shadow-sm"
                style={{
                  color: config.customHexColor || '#0d9488',
                  borderColor: config.customHexColor || '#0d9488',
                  backgroundColor: '#f0fdf4',
                }}
              >
                {config.badgeTitle}
              </div>
            </div>

            {/* Sample Body */}
            <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Target Practice: Sydney Plastic Surgery Centre</span>
                <span style={{ color: config.customHexColor || '#0d9488' }} className="font-mono font-bold">
                  Score: 100/100
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                This practice has deployed Schema.org <code className="text-teal-700 font-mono">@graph</code> JSON-LD and a domain <code className="text-teal-700 font-mono">/llms.txt</code> file containing Ahpra registration credentials.
              </p>

              {config.supportUrl && (
                <div className="pt-2 text-right">
                  <a
                    href={config.supportUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 hover:underline"
                  >
                    Book Audit Review Call <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Custom Footer */}
            <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-500 italic text-center leading-relaxed">
              {config.customReportFooter}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
