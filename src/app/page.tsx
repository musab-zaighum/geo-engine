'use client';

import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Activity,
  Award,
  Globe,
  CheckCircle,
  Stethoscope,
  Code,
  TrendingUp,
} from 'lucide-react';
import { AuditorSection } from '@/components/AuditorSection';
import { GeneratorSection } from '@/components/GeneratorSection';
import { PasteGuideModal } from '@/components/PasteGuideModal';
import { PricingCalculatorModal } from '@/components/PricingCalculatorModal';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'auditor' | 'generator'>('auditor');
  const [generatorInitialUrl, setGeneratorInitialUrl] = useState<string>('');

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  const handleFixWithGenerator = (urlToFix: string) => {
    setGeneratorInitialUrl(urlToFix);
    setActiveTab('generator');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Modals */}
      <PasteGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <PricingCalculatorModal isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} />

      {/* Hero Header */}
      <section className="pt-10 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-teal-500/30 text-teal-300 text-xs font-bold shadow-md">
          <Activity className="w-4 h-4 text-teal-400 animate-pulse" />
          <span>Healthcare Generative Engine Optimization (GEO) Infrastructure Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
          Ensure AI Search Engines Recommend Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-blue-400 to-sky-300">Medical Practice</span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
          Audit medical websites, synthesize Schema.org <code className="text-teal-300 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-xs font-mono">@graph</code> JSON-LD, deploy <code className="text-teal-300 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-xs font-mono">/llms.txt</code> files, and scale practice citations across Perplexity, ChatGPT Search, and Claude.
        </p>

        {/* Action Trigger Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-md transition-all"
          >
            <Code className="w-4 h-4 text-teal-400" />
            CMS Code Insertion Guide
          </button>

          <button
            type="button"
            onClick={() => setIsCalcOpen(true)}
            className="px-4 py-2.5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-md transition-all"
          >
            <TrendingUp className="w-4 h-4 text-teal-400" />
            Pricing & Margin Calculator
          </button>
        </div>

        {/* Feature Stat Pills */}
        <div className="pt-2 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-900/60 border border-slate-800 rounded-3xl text-xs shadow-md">
            <div className="flex items-center justify-center gap-2 p-2">
              <Award className="w-4 h-4 text-teal-400 shrink-0" />
              <span className="text-slate-300 font-bold">AHPRA & NPI Credentials</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-2 border-t sm:border-t-0 sm:border-l border-slate-800">
              <Globe className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="text-slate-300 font-bold">GBP & No-Website Fallback</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-2 border-t sm:border-t-0 sm:border-l border-slate-800">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-300 font-bold">$1.5k Solo / $2.5k Clinic Retail</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace Navigation (Streamlined 2 Tabs) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <div className="flex justify-center">
          <div className="p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center gap-2 shadow-2xl backdrop-blur-xl max-w-md w-full">
            <button
              type="button"
              onClick={() => setActiveTab('auditor')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'auditor'
                  ? 'bg-gradient-to-r from-teal-500 to-sky-600 text-white shadow-lg shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Search className="w-4 h-4" />
              1. Live Clinic Auditor
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('generator')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'generator'
                  ? 'bg-gradient-to-r from-teal-500 to-sky-600 text-white shadow-lg shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              2. GEO Infrastructure Generator
            </button>
          </div>
        </div>

        {/* Tab Display */}
        {activeTab === 'auditor' ? (
          <AuditorSection onFixWithGenerator={handleFixWithGenerator} />
        ) : (
          <GeneratorSection initialUrl={generatorInitialUrl} />
        )}
      </main>

      {/* Enterprise Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 mt-16 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-teal-400" />
            <span className="font-bold text-slate-300">CiteMed Enterprise GEO Platform</span>
          </div>

          <div className="text-slate-400 font-medium">
            &copy; 2026 CiteMed Enterprise GEO Platform. Verified AHPRA & NPI Standard Schema Engine.
          </div>
        </div>
      </footer>
    </div>
  );
}
