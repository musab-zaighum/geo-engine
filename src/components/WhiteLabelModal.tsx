'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  Building2,
  Globe,
  Upload,
  Check,
  ExternalLink,
  Laptop,
  Smartphone,
  Eye,
  Lock,
  ArrowRight,
  Palette,
  CheckCircle2,
  Copy,
  Image as ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';

interface WhiteLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout?: () => void;
}

const COLOR_OPTIONS = [
  { name: 'Indigo Pulse', hex: '#6366f1', class: 'bg-indigo-500' },
  { name: 'Emerald Trust', hex: '#10b981', class: 'bg-emerald-500' },
  { name: 'Cyan Modern', hex: '#06b6d4', class: 'bg-cyan-500' },
  { name: 'Violet Enterprise', hex: '#8b5cf6', class: 'bg-violet-500' },
  { name: 'Rose Authority', hex: '#f43f5e', class: 'bg-rose-500' },
];

export function WhiteLabelModal({
  isOpen,
  onClose,
  onOpenCheckout,
}: WhiteLabelModalProps) {
  const [agencyName, setAgencyName] = useState('Apex Health Digital');
  const [cnameDomain, setCnameDomain] = useState('audit.apexhealthmarketing.com');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [customLogoText, setCustomLogoText] = useState('APEX');
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);
  const [debrandedActive, setDebrandedActive] = useState(true);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Sync to localStorage so live report page uses this exact branding
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('agencyConfig');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.agencyName) setAgencyName(parsed.agencyName);
          if (parsed.agencySlug) setCnameDomain(parsed.agencySlug);
          if (parsed.customHexColor) {
            const found = COLOR_OPTIONS.find((c) => c.hex === parsed.customHexColor);
            if (found) setSelectedColor(found);
          }
          if (parsed.agencyLogoUrl) setCustomLogoUrl(parsed.agencyLogoUrl);
        }
      } catch {
        // Fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`https://${cnameDomain}`);
    setCopiedUrl(true);
    toast.success('CNAME subdomain copied to clipboard');
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (loadEvent.target?.result) {
          const resultStr = loadEvent.target.result as string;
          setCustomLogoUrl(resultStr);
          toast.success('Custom agency logo uploaded to preview!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveToLocalStorage = () => {
    try {
      const config = {
        agencyName,
        agencySlug: cnameDomain,
        agencyLogoUrl: customLogoUrl || '/logo.png',
        primaryColor: 'indigo',
        customHexColor: selectedColor.hex,
        supportUrl: `https://${cnameDomain}`,
        badgeTitle: 'Official Agency Partner',
        contactEmail: `growth@${cnameDomain.replace(/^audit\./, '')}`,
        debranded: debrandedActive,
      };
      localStorage.setItem('agencyConfig', JSON.stringify(config));
    } catch {
      // Ignored
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-800 bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <Globe className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">White-Label &amp; Custom CNAME Engine</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold font-mono">
                  100% Debranded
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Strict zero-mention architecture for Growth &amp; Scale tiers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors touch-target"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            {/* Agency Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Agency Brand Name
              </label>
              <input
                type="text"
                value={agencyName}
                onChange={(e) => {
                  setAgencyName(e.target.value);
                  const firstWord = e.target.value.split(' ')[0] || 'AGENCY';
                  setCustomLogoText(firstWord.toUpperCase().slice(0, 5));
                  setCnameDomain(`audit.${firstWord.toLowerCase().replace(/[^a-z0-9]/g, '')}media.com`);
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-indigo-500 focus:outline-none transition-colors"
                placeholder="Your Agency Name"
              />
            </div>

            {/* Custom CNAME Subdomain */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Custom CNAME Subdomain
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cnameDomain}
                  onChange={(e) => setCnameDomain(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm font-mono text-indigo-300 focus:border-indigo-500 focus:outline-none transition-colors"
                  placeholder="audit.youragency.com"
                />
              </div>
            </div>

            {/* Accent Theme Color & Logo Upload */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Brand Accent &amp; Logo
                </label>
                <label className="text-[10px] text-indigo-400 hover:text-indigo-300 cursor-pointer flex items-center gap-1">
                  <Upload className="w-3 h-3" />
                  <span>Upload Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex items-center gap-2 pt-0.5">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`w-8 h-8 rounded-lg ${c.class} transition-all flex items-center justify-center ${
                      selectedColor.hex === c.hex ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-105' : 'opacity-70 hover:opacity-100'
                    }`}
                    title={c.name}
                  >
                    {selectedColor.hex === c.hex && <Check className="w-4 h-4 text-white stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Strict Branding Rule Banner & Interactive Debranding Toggle */}
          <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-indigo-200">
              <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <span className="font-bold text-white">Strict White-Label Architecture: </span>
                Zero mentions of NexusRank appear anywhere in your audits, reports, or HTML meta tags.
              </div>
            </div>
            
            <label className="flex items-center gap-2 cursor-pointer bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-indigo-500/30 shrink-0">
              <input
                type="checkbox"
                checked={debrandedActive}
                onChange={(e) => setDebrandedActive(e.target.checked)}
                className="w-3.5 h-3.5 rounded accent-indigo-500 cursor-pointer"
              />
              <span className="text-[11px] font-bold text-white">
                {debrandedActive ? '100% Debranding Active' : 'Debranding Off'}
              </span>
            </label>
          </div>

          {/* Mockup Preview Device Canvas */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Live Client-Facing Mockup</span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {debrandedActive ? '• Strict Zero Vendor Footprint' : '• Standard Mode'}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setViewMode('desktop')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                    viewMode === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" /> Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('mobile')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                    viewMode === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" /> Mobile
                </button>
              </div>
            </div>

            {/* Browser Device Frame */}
            <div className={`mx-auto rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl transition-all ${
              viewMode === 'mobile' ? 'max-w-sm' : 'w-full'
            }`}>
              {/* Simulated Browser URL bar */}
              <div className="px-3.5 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex-1 max-w-md bg-slate-950 px-3 py-1 rounded-lg text-[11px] font-mono text-slate-300 border border-slate-800 flex items-center justify-between truncate">
                  <div className="flex items-center gap-1.5 truncate">
                    <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">https://{cnameDomain}/report/dentalpractice.com</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    className="text-slate-500 hover:text-white transition-colors ml-2 shrink-0"
                    title="Copy URL"
                  >
                    {copiedUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <div className="w-6" />
              </div>

              {/* Simulated Client Page Body */}
              <div className="p-4 sm:p-6 bg-slate-950 text-slate-100 space-y-4">
                {/* Agency Navbar inside Mockup */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    {customLogoUrl ? (
                      <img
                        src={customLogoUrl}
                        alt={agencyName}
                        className="w-8 h-8 rounded-lg object-contain bg-slate-900 border border-slate-700 p-0.5"
                      />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs shadow-md"
                        style={{ backgroundColor: selectedColor.hex }}
                      >
                        {customLogoText}
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-bold text-white">{agencyName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Healthcare Intelligence Unit</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                      Client Portal Active
                    </span>
                  </div>
                </div>

                {/* Audit Title Card */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold font-mono">
                        Prepared exclusively for:
                      </span>
                      <h4 className="text-base font-extrabold text-white">Austin Dental Care &amp; Specialists</h4>
                      <p className="text-xs text-slate-400 font-mono">Target: https://dentalpractice.com</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center">
                        <div className="text-lg font-black font-mono leading-none">84/100</div>
                        <div className="text-[9px] font-bold uppercase tracking-wider">GEO Score B+</div>
                      </div>
                    </div>
                  </div>

                  {/* 3 Metric Pills */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
                    <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Schema Depth</div>
                      <div className="text-xs font-bold text-emerald-400 font-mono">94% Valid</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Physician NPI</div>
                      <div className="text-xs font-bold text-emerald-400 font-mono">Active (TX)</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                      <div className="text-[10px] text-slate-400">/llms.txt AI Bot</div>
                      <div className="text-xs font-bold text-rose-400 font-mono">Action Needed</div>
                    </div>
                  </div>
                </div>

                {/* Footer of Mockup */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Audit certified by {agencyName}</span>
                  <span className="font-mono text-indigo-400">100% Zero Vendor Footprint</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-5 sm:px-6 py-4 border-t border-slate-800 bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            Ready to deploy your agency custom CNAME like <code className="text-indigo-300 font-mono">{cnameDomain}</code>?
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href="/report/dentalpractice.com?unbranded=true"
              target="_blank"
              onClick={handleSaveToLocalStorage}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors touch-target"
            >
              <span>Test Live Client View</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <button
              type="button"
              onClick={() => {
                handleSaveToLocalStorage();
                onClose();
                if (onOpenCheckout) onOpenCheckout();
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-950/50 touch-target cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Unlock CNAME on Growth ($297/mo)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
