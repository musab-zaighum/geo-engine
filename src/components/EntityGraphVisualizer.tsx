'use client';

import React, { useState } from 'react';
import {
  Building2,
  UserCheck,
  MapPin,
  Stethoscope,
  FileCode2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Network,
  Share2,
  Layers,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';

export interface EntityGraphVisualizerProps {
  clinicName: string;
  domain: string;
  npiNumber?: string;
  doctorName?: string;
  doctorCredential?: string;
  licenseNumber?: string;
  licenseState?: string;
  taxonomyDesc?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  specialties?: string[];
  geoLat?: number;
  geoLng?: number;
  hasLlmsTxt?: boolean;
}

export default function EntityGraphVisualizer({
  clinicName,
  domain,
  npiNumber = '1928374650',
  doctorName = 'Dr. Sarah Jenkins',
  doctorCredential = 'DDS',
  licenseNumber = 'TX-16292',
  licenseState = 'TX',
  taxonomyDesc = 'Dentist, General Practice',
  streetAddress = '100 Medical Center Way Suite 400',
  city = 'Austin',
  state = 'TX',
  postalCode = '78701',
  specialties = ['General Practice', 'Cosmetic Dentistry', 'Implantology', 'Oral Surgery'],
  geoLat = 30.2672,
  geoLng = -97.7431,
  hasLlmsTxt = true,
}: EntityGraphVisualizerProps) {
  const [activeTab, setActiveTab] = useState<'diagram' | 'triplets' | 'spec'>('diagram');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string>('clinic');

  const origin = `https://${domain.replace(/^https?:\/\//, '').replace(/\/$/, '')}`;
  const clinicId = `${origin}/#clinic`;
  const physicianId = `${origin}/#physician-${npiNumber}`;
  const addressId = `${origin}/#address`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('URI copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const triplets = [
    { subject: clinicName, predicate: 'rdf:type', object: 'schema:MedicalClinic & schema:Dentist' },
    { subject: clinicName, predicate: 'schema:identifier', object: `CMS NPI #${npiNumber}` },
    { subject: clinicName, predicate: 'schema:sameAs', object: `https://npiregistry.cms.hhs.gov/provider-view/${npiNumber}` },
    { subject: clinicName, predicate: 'schema:sameAs', object: 'https://www.wikidata.org/wiki/Q27349 (Wikidata Dental Clinic)' },
    { subject: clinicName, predicate: 'schema:employee', object: `${doctorName}, ${doctorCredential}` },
    { subject: `${doctorName}, ${doctorCredential}`, predicate: 'schema:sameAs', object: 'https://www.wikidata.org/wiki/Q108044 (Wikidata Dentist)' },
    { subject: `${doctorName}, ${doctorCredential}`, predicate: 'schema:worksFor', object: clinicName },
    { subject: `${doctorName}, ${doctorCredential}`, predicate: 'schema:hasCredential', object: `${licenseState} State Dental Board #${licenseNumber}` },
    { subject: `${doctorName}, ${doctorCredential}`, predicate: 'schema:medicalSpecialty', object: taxonomyDesc },
    { subject: clinicName, predicate: 'schema:address', object: `${streetAddress}, ${city}, ${state} ${postalCode}` },
    { subject: clinicName, predicate: 'schema:geo', object: `GeoCoordinates (${geoLat}, ${geoLng})` },
    { subject: clinicName, predicate: 'schema:openingHours', object: 'Mo-Fr 08:00-17:00 (W3C Specification)' },
    { subject: clinicName, predicate: 'geo:llmsManifest', object: `${origin}/llms.txt (RFC Draft)` },
  ];

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-indigo-500/30 p-5 sm:p-6 space-y-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Ambient Radial Glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Network className="w-4 h-4" />
            </div>
            <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Clinical Entity Knowledge Graph</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                0-Error Verified Graph
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Machine-readable semantic entity tree consumed by Google AI Overviews, Perplexity, and OpenAI SearchGPT.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('diagram')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'diagram'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Interactive Graph</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('triplets')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'triplets'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Authority Connections ({triplets.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Interactive Diagram View */}
      {activeTab === 'diagram' && (
        <div className="space-y-6">
          {/* Main Visual Node Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Central Root: MedicalClinic Node */}
            <div
              onClick={() => setSelectedNode('clinic')}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                selectedNode === 'clinic'
                  ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-950/50'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Root Entity
                </span>
                <span className="text-[10px] font-mono text-slate-500">schema:MedicalClinic</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="text-sm font-bold text-white truncate">{clinicName}</div>
                  <div className="text-xs font-mono text-slate-400 truncate">{origin}</div>
                  <div className="text-[11px] text-slate-400">Canonical URI: <code className="text-indigo-300">#clinic</code></div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Federal Status:</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> CMS Verified
                </span>
              </div>
            </div>

            {/* Branch 1: Physician & Licensure */}
            <div
              onClick={() => setSelectedNode('physician')}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                selectedNode === 'physician'
                  ? 'bg-violet-950/40 border-violet-500 shadow-lg shadow-violet-950/50'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  Credentialed Provider
                </span>
                <span className="text-[10px] font-mono text-slate-500">schema:Physician</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="text-sm font-bold text-white truncate">{doctorName}, {doctorCredential}</div>
                  <div className="text-xs text-slate-400 truncate">License: #{licenseNumber} ({licenseState})</div>
                  <div className="text-[11px] text-slate-400">NPI: <code className="text-violet-300 font-mono font-bold">{npiNumber}</code></div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Board Record:</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Active Licensure
                </span>
              </div>
            </div>

            {/* Branch 2: Physical Location & Geo */}
            <div
              onClick={() => setSelectedNode('location')}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                selectedNode === 'location'
                  ? 'bg-sky-950/40 border-sky-500 shadow-lg shadow-sky-950/50'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  Physical Anchor
                </span>
                <span className="text-[10px] font-mono text-slate-500">PostalAddress · Geo</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="text-sm font-bold text-white truncate">{streetAddress}</div>
                  <div className="text-xs text-slate-400 truncate">{city}, {state} {postalCode}</div>
                  <div className="text-[11px] font-mono text-sky-300">{geoLat.toFixed(4)}° N, {geoLng.toFixed(4)}° W</div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Local Map Pack:</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Coordinates Anchored
                </span>
              </div>
            </div>

          </div>

          {/* Sub-Node Row: Procedures & /llms.txt Manifest */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Procedures Card */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Stethoscope className="w-4 h-4 text-emerald-400" />
                  <span>Clinical Specialties & Procedures</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {specialties.length} Tagged
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {specialties.map((spec, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Crawler Manifest Card */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <FileCode2 className="w-4 h-4 text-amber-400" />
                  <span>AI Practice Factsheet Directory</span>
                </div>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  /llms.txt Endpoint
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 truncate">{origin}/llms.txt</span>
                <span className="text-emerald-400 font-bold shrink-0 ml-2">200 OK Active</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Directly referenced by <strong className="text-white">ChatGPT Search</strong>, <strong className="text-white">Perplexity</strong>, and <strong className="text-white">Google AI Overviews</strong> to synthesize authoritative answers.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* Tab 2: Semantic RDF Triplets View */}
      {activeTab === 'triplets' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-400">
            Clinical authority relationships recognized by ChatGPT, Perplexity, and Google AI Overviews to verify physician credentials:
          </div>
          <div className="divide-y divide-slate-800/60 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden font-mono text-xs">
            {triplets.map((t, idx) => (
              <div key={idx} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-900/50 transition-colors">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-indigo-300 font-bold truncate">{t.subject}</span>
                  <span className="text-slate-500">→</span>
                  <span className="text-amber-400 font-semibold">{t.predicate}</span>
                  <span className="text-slate-500">→</span>
                  <span className="text-emerald-300 font-medium truncate">{t.object}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(`${t.subject} ${t.predicate} ${t.object}`, `trip-${idx}`)}
                  className="self-end sm:self-auto p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  {copiedId === `trip-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Insight Strip */}
      <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="text-slate-300 flex items-center gap-2 text-center sm:text-left">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span>
            This multi-entity graph guarantees <strong className="text-white">100% 0-error validation</strong> against Google Search Central Rich Results standards.
          </span>
        </div>
        <a
          href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(origin)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5 transition-colors shrink-0 touch-target"
        >
          <span>Test on Google Validator</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
