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
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center">
              <Code className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                CMS Code Paste & Deployment Guide
              </h2>
              <p className="text-xs text-slate-500">
                Step-by-step instructions for non-technical users to install Schema JSON-LD & /llms.txt.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
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
              className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeCmsId === g.id
                  ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-500/20'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
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
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Code className="w-4 h-4 text-teal-600" />
                1. Where to Paste Schema.org JSON-LD Code
              </span>
              <button
                type="button"
                onClick={handleCopySampleTag}
                className="text-xs text-teal-700 font-bold hover:underline flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-teal-600" />}
                {copied ? 'Copied Tag!' : 'Copy <script> Tag'}
              </button>
            </h3>

            {/* Method 1 */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="text-xs font-bold text-teal-800">{currentGuide.schemaInstructions.method1Title}</div>
              <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700 leading-relaxed">
                {currentGuide.schemaInstructions.method1Steps.map((step, idx) => (
                  <li key={idx} className="pl-1">{step}</li>
                ))}
              </ol>
            </div>

            {/* Method 2 if available */}
            {currentGuide.schemaInstructions.method2Title && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="text-xs font-bold text-slate-800">{currentGuide.schemaInstructions.method2Title}</div>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700 leading-relaxed">
                  {currentGuide.schemaInstructions.method2Steps?.map((step, idx) => (
                    <li key={idx} className="pl-1">{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          <hr className="border-slate-100" />

          {/* Section 2: /llms.txt */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600" />
              2. {currentGuide.llmsTxtInstructions.title}
            </h3>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
                {currentGuide.llmsTxtInstructions.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">
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
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Need help? Ask our embedded Master CiteMed AI Advisor.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors"
          >
            Got It! Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
