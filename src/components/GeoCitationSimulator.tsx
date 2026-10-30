'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Cpu,
  Bot,
  Zap,
  Globe,
  Radio,
  Share2,
} from 'lucide-react';

export interface GeoCitationSimulatorProps {
  clinicName: string;
  domain: string;
  overallScore?: number;
  npiVerified?: boolean;
  hasMedicalSchema?: boolean;
  hasLlmsTxt?: boolean;
}

export default function GeoCitationSimulator({
  clinicName,
  domain,
  overallScore = 88,
  npiVerified = true,
  hasMedicalSchema = true,
  hasLlmsTxt = true,
}: GeoCitationSimulatorProps) {
  const [selectedEngine, setSelectedEngine] = useState<'google' | 'openai' | 'perplexity' | 'apple'>('google');

  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');

  const engines = [
    {
      id: 'google' as const,
      name: 'Google AI Overviews',
      poweredBy: 'Gemini 2.5 Pro / Flash',
      badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
      probability: hasMedicalSchema ? 94 : 24,
      status: hasMedicalSchema ? 'Prime Source Candidate' : 'High Risk of Omission',
      statusColor: hasMedicalSchema ? 'text-emerald-400' : 'text-rose-400',
      reasoning: hasMedicalSchema
        ? 'Google AI Overviews ingests schema:MedicalClinic @graph and anchors clinic entity in the Knowledge Graph.'
        : 'Missing clinical JSON-LD. Google AI Overviews prioritizes rival clinics with verified schema.',
      sampleSnippet: `According to verified clinical records, **${clinicName}** is recognized for comprehensive dental procedures with verified board credentials and emergency patient protocols.`,
      citedSources: [
        `https://${cleanDomain}`,
        'https://npiregistry.cms.hhs.gov/provider-view/1928374650',
        'https://health.usnews.com/dentists',
      ],
      queries: [
        `best cosmetic dentist near ${cleanDomain}`,
        `emergency dental clinic open Sunday`,
        `verified dental implant specialist`,
      ],
    },
    {
      id: 'openai' as const,
      name: 'OpenAI SearchGPT',
      poweredBy: 'ChatGPT Search (OAI-SearchBot)',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      probability: npiVerified && hasMedicalSchema ? 91 : 32,
      status: npiVerified ? 'Verified Entity Node' : 'Unverified Licensure',
      statusColor: npiVerified ? 'text-emerald-400' : 'text-amber-400',
      reasoning: npiVerified
        ? 'SearchGPT matches practitioner credentials against state licensing databases, establishing strict E-E-A-T.'
        : 'Practitioner lacks cryptographic URI linkage. AI synthesizer defaults to accredited rival practices.',
      sampleSnippet: `**${clinicName}** is an accredited practice holding verified state licensure. They provide restorative and cosmetic procedures with documented patient guidelines.`,
      citedSources: [
        `https://${cleanDomain}/services`,
        `https://${cleanDomain}/llms.txt`,
      ],
      queries: [
        `who is the top dentist for porcelain veneers in this area`,
        `find licensed dental surgeon with verified NPI`,
      ],
    },
    {
      id: 'perplexity' as const,
      name: 'Perplexity Pro',
      poweredBy: 'Sonar Pro & Hybrid Vector RAG',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      probability: hasLlmsTxt ? 89 : 38,
      status: hasLlmsTxt ? 'Direct Footnote Grounding' : 'No /llms.txt Manifest',
      statusColor: hasLlmsTxt ? 'text-cyan-400' : 'text-rose-400',
      reasoning: hasLlmsTxt
        ? 'PerplexityBot directly crawls /llms.txt in single-digit ms, injecting verified facts into RAG vector context.'
        : 'Missing /llms.txt forces Perplexity to scrape raw HTML DOM, increasing parse noise and reducing citation rank.',
      sampleSnippet: `Based on clinical data from **${cleanDomain}** [1] and federal registry archives [2], the practice operates modern surgical facilities with published emergency protocols.`,
      citedSources: [
        `https://${cleanDomain}/llms.txt`,
        `https://${cleanDomain}`,
      ],
      queries: [
        `dental clinic in-network insurance list`,
        `pain management protocols at ${clinicName}`,
      ],
    },
    {
      id: 'apple' as const,
      name: 'Apple Intelligence & Siri',
      poweredBy: 'Private Cloud Compute & On-Device Models',
      badgeColor: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
      probability: hasMedicalSchema ? 86 : 28,
      status: hasMedicalSchema ? 'Local Intent Ready' : 'Semantic Blind Spot',
      statusColor: hasMedicalSchema ? 'text-violet-400' : 'text-slate-400',
      reasoning: hasMedicalSchema
        ? 'Apple Intelligence parses structured PostalAddress and GeoCoordinates directly from the web semantic layer.'
        : 'Lacks structured GeoCoordinates; Siri defaults to Apple Maps directory listings without procedure highlights.',
      sampleSnippet: `Here is **${clinicName}** near you, offering verified dental services with active clinic operating hours.`,
      citedSources: [
        `https://${cleanDomain}`,
      ],
      queries: [
        `Siri, find emergency dentist nearby`,
        `show me dental clinics with highest clinical accreditation`,
      ],
    },
  ];

  const current = engines.find((e) => e.id === selectedEngine) || engines[0];

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 space-y-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Radio className="w-4 h-4" />
            </div>
            <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Generative Search Citation Simulator</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                Multi-Engine RAG
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Real-time projection of how generative AI engines synthesize, cite, and rank {clinicName}.
          </p>
        </div>

        {/* Engine Tabs */}
        <div className="grid grid-cols-2 sm:flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold">
          {engines.map((eng) => (
            <button
              key={eng.id}
              type="button"
              onClick={() => setSelectedEngine(eng.id)}
              className={`px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                selectedEngine === eng.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{eng.name.split(' ')[0]}</span>
              <span className="text-[10px] opacity-75 font-mono">{eng.probability}%</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Active Engine Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left Column: Probability Dial & Diagnostics */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${current.badgeColor}`}>
              {current.name}
            </span>
            <span className="text-[10px] font-mono text-slate-400">{current.poweredBy}</span>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-400 font-medium">Citation Share of Voice</div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white font-mono">{current.probability}%</span>
              <span className="text-xs text-emerald-400 font-bold">Likelihood</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${current.probability}%` }}
            />
          </div>

          <div className="pt-2 border-t border-slate-900 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Synthesis Status:</span>
              <span className={`font-bold ${current.statusColor}`}>{current.status}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {current.reasoning}
            </p>
          </div>
        </div>

        {/* Right Column: AI Synthesized Mock Answer Box */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Bot className="w-4 h-4 text-indigo-400" />
                <span>Simulated {current.name} Answer Box</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Grounded Citation
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 font-sans text-xs text-slate-200 leading-relaxed space-y-2">
              <p dangerouslySetInnerHTML={{ __html: current.sampleSnippet.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>') }} />
            </div>

            {/* Cited Footnotes Bar */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-500">Cited Attribution Footnotes:</span>
              <div className="flex flex-wrap gap-2">
                {current.citedSources.map((src, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-[11px] font-mono text-indigo-300 flex items-center gap-1.5"
                  >
                    <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[9px] font-bold">
                      {i + 1}
                    </span>
                    <span className="truncate max-w-[200px]">{src}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Trigger Queries */}
          <div className="pt-3 border-t border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400">
            <span>Primary Query Trigger:</span>
            <div className="flex flex-wrap gap-1.5">
              {current.queries.map((q, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[10px]">
                  &ldquo;{q}&rdquo;
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
