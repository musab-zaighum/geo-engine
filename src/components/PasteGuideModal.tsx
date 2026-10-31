'use client';

import React, { useState } from 'react';
import { X, Code, FileText, Globe, ShoppingBag, Layout, Layers, Check, Copy, HelpCircle, Download } from 'lucide-react';
import { CMS_GUIDES } from '@/lib/cms-instructions';

interface PasteGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PasteGuideModal({ isOpen, onClose }: PasteGuideModalProps) {
  const [activeCmsId, setActiveCmsId] = useState('wordpress');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentGuide = CMS_GUIDES.find((g) => g.id === activeCmsId) || CMS_GUIDES[0];

  const handleCopySampleTag = () => {
    navigator.clipboard.writeText('<script type="application/ld+json">\n// Paste your generated schema JSON here\n</script>');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="nr-glass-card border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto bg-slate-900/95 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
              <Code className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">
                CMS Code Paste &amp; Deployment Guide
              </h2>
              <p className="text-xs text-slate-400">
                Step-by-step instructions for non-technical users to install Schema JSON-LD &amp; /llms.txt.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CMS Platform Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CMS_GUIDES.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setActiveCmsId(g.id)}
              className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeCmsId === g.id
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {g.id === 'wordpress' && <Globe className="w-4 h-4" />}
              {g.id === 'shopify' && <ShoppingBag className="w-4 h-4" />}
              {g.id === 'webflow' && <Layout className="w-4 h-4" />}
              {g.id === 'squarespace' && <Layers className="w-4 h-4" />}
              <span>{g.name}</span>
            </button>
          ))}
        </div>

        {/* Instructions Body */}
        <div className="space-y-6 pt-2">
          {/* Section 1: Schema JSON-LD */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-indigo-400" />
                <span>1. Where to Paste Schema.org JSON-LD Code</span>
              </h3>
              <button
                type="button"
                onClick={handleCopySampleTag}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
                <span>{copied ? 'Copied Tag!' : 'Copy <script> Tag'}</span>
              </button>
            </div>

            {/* Method 1 */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
              <div className="text-xs font-bold text-indigo-300">{currentGuide.schemaInstructions.method1Title}</div>
              <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300 leading-relaxed font-sans">
                {currentGuide.schemaInstructions.method1Steps.map((step, idx) => (
                  <li key={idx} className="pl-1">{step}</li>
                ))}
              </ol>
            </div>

            {/* Method 2 if available */}
            {currentGuide.schemaInstructions.method2Title && (
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
                <div className="text-xs font-bold text-slate-300">{currentGuide.schemaInstructions.method2Title}</div>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300 leading-relaxed font-sans">
                  {currentGuide.schemaInstructions.method2Steps?.map((step, idx) => (
                    <li key={idx} className="pl-1">{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          <hr className="border-slate-800" />

          {/* Section 2: /llms.txt */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>2. {currentGuide.llmsTxtInstructions.title}</span>
            </h3>

            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
              <ul className="space-y-2 text-xs text-slate-300 leading-relaxed font-sans">
                {currentGuide.llmsTxtInstructions.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span>Need help? Ask our embedded Master NexusRank1 AI Advisor.</span>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors cursor-pointer shadow-md"
          >
            Got It! Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
