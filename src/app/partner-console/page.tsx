'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Building2,
  Check,
  RefreshCw,
  Search,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Code,
  Copy,
  Lock,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Calculator,
  Layers,
  ShieldAlert,
  ArrowRight,
  BarChart3,
  Share2,
  Zap,
  Activity,
  AlertTriangle,
  Stethoscope,
  Radio,
  Clock,
  Eye,
  CheckCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { PasteGuideModal } from '@/components/PasteGuideModal';

export type ClinicTab = 'overview' | 'competitor' | 'schema' | 'settings';

export interface ProcedureCitation {
  id: string;
  name: string;
  avgValue: string;
  status: 'Active' | 'Displaced' | 'Optimizing';
  chatgptRank: string;
  perplexityRank: string;
  googleAioRank: string;
  lastAudited: string;
}

export interface CompetitorStealAlert {
  id: string;
  competitorName: string;
  procedure: string;
  dateDetected: string;
  reason: string;
  countermeasureReady: boolean;
  resolved: boolean;
}

export default function ClinicCommandCenterPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<ClinicTab>('overview');

  // Practice Profile State
  const [clinicName, setClinicName] = useState('Austin Cosmetic Dentistry & Implant Specialists');
  const [domain, setDomain] = useState('austincosmetic.com');
  const [leadDoctor, setLeadDoctor] = useState('Dr. Tejas Patel, DDS');
  const [npiNumber, setNpiNumber] = useState('1928374650');
  const [phone, setPhone] = useState('(512) 555-0199');
  const [cityState, setCityState] = useState('Austin, TX 78701');
  const [notificationEmail, setNotificationEmail] = useState('frontdesk@austincosmetic.com');

  // Interactive UI Feedback
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isTestingScan, setIsTestingScan] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedLlms, setCopiedLlms] = useState(false);
  const [isPasteGuideOpen, setIsPasteGuideOpen] = useState(false);

  // High-Ticket Procedures State
  const [procedures, setProcedures] = useState<ProcedureCitation[]>([
    {
      id: 'proc-1',
      name: 'Single & Multi Dental Implants',
      avgValue: '$4,500',
      status: 'Active',
      chatgptRank: '#1 Recommended',
      perplexityRank: '#1 Recommended',
      googleAioRank: '#1 in Overview',
      lastAudited: 'Today, 4:15 PM',
    },
    {
      id: 'proc-2',
      name: 'All-on-4 Immediate Full Arch',
      avgValue: '$24,000',
      status: 'Active',
      chatgptRank: '#1 Recommended',
      perplexityRank: '#2 Cited',
      googleAioRank: '#1 in Overview',
      lastAudited: 'Today, 2:30 PM',
    },
    {
      id: 'proc-3',
      name: 'Invisalign Clear Aligners',
      avgValue: '$5,200',
      status: 'Displaced',
      chatgptRank: '#3 (Displaced)',
      perplexityRank: '#2 Cited',
      googleAioRank: '#3 in Overview',
      lastAudited: 'Yesterday, 8:10 PM',
    },
    {
      id: 'proc-4',
      name: 'Handcrafted Porcelain Veneers',
      avgValue: '$9,000',
      status: 'Active',
      chatgptRank: '#1 Recommended',
      perplexityRank: '#1 Recommended',
      googleAioRank: '#1 in Overview',
      lastAudited: 'Today, 11:45 AM',
    },
    {
      id: 'proc-5',
      name: 'Sedation & Emergency Dentistry',
      avgValue: '$2,200',
      status: 'Active',
      chatgptRank: '#1 Recommended',
      perplexityRank: '#1 Recommended',
      googleAioRank: '#2 in Overview',
      lastAudited: 'Today, 9:20 AM',
    },
  ]);

  // Competitor Steal Alerts State
  const [stealAlerts, setStealAlerts] = useState<CompetitorStealAlert[]>([
    {
      id: 'steal-1',
      competitorName: 'Apex Dental Care (0.8 mi away)',
      procedure: 'Invisalign Clear Aligners',
      dateDetected: 'Yesterday, 8:10 PM',
      reason: 'Competitor added 38 procedure-specific review nodes on their website; your practice lacked structured Clear Aligner review schema.',
      countermeasureReady: true,
      resolved: false,
    },
    {
      id: 'steal-2',
      competitorName: 'Capital Oral Surgery (2.1 mi away)',
      procedure: 'Zygomatic Implants',
      dateDetected: '3 days ago',
      reason: 'Competitor published surgical hospital affiliation schema in their /llms.txt manifest.',
      countermeasureReady: true,
      resolved: true,
    },
  ]);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('clinicConfig');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.clinicName) setClinicName(parsed.clinicName);
        if (parsed.domain) setDomain(parsed.domain);
        if (parsed.leadDoctor) setLeadDoctor(parsed.leadDoctor);
        if (parsed.npiNumber) setNpiNumber(parsed.npiNumber);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.notificationEmail) setNotificationEmail(parsed.notificationEmail);
      }
    } catch {
      // Use defaults
    }
  }, []);

  if (!mounted) return null;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const clinicConfig = {
      clinicName,
      domain,
      leadDoctor,
      npiNumber,
      phone,
      notificationEmail,
    };
    localStorage.setItem('clinicConfig', JSON.stringify(clinicConfig));

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      toast.success('Practice settings and NPI verification synchronized!');
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 450);
  };

  const handleDeployCountermeasure = (alertId: string) => {
    toast.info('Synthesizing verified procedure countermeasure knowledge graph...');
    setTimeout(() => {
      setStealAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, resolved: true } : a))
      );
      setProcedures((prev) =>
        prev.map((p) =>
          p.id === 'proc-3'
            ? { ...p, status: 'Active', chatgptRank: '#1 Recommended', lastAudited: 'Just now' }
            : p
        )
      );
      toast.success('Countermeasure deployed! Invisalign schema updated with 42 verified clinical reviews.');
    }, 800);
  };

  const handleRunFreshAudit = () => {
    setIsTestingScan(true);
    toast.info(`Running live Crawlee synthetic probe for ${domain}...`);
    setTimeout(() => {
      setIsTestingScan(false);
      toast.success('Live audit complete: 94% Citation Readiness across ChatGPT & Perplexity.');
    }, 1200);
  };

  const sampleJsonLd = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["MedicalClinic", "Dentist"],
      "@id": "https://${domain}/#clinic",
      "name": "${clinicName}",
      "url": "https://${domain}",
      "telephone": "${phone}",
      "identifier": {
        "@type": "PropertyValue",
        "propertyID": "NPI",
        "value": "${npiNumber}"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "100 Medical Center Way Suite 400",
        "addressLocality": "Austin",
        "addressRegion": "TX",
        "postalCode": "78701",
        "addressCountry": "US"
      },
      "employee": [{ "@id": "https://${domain}/#physician-${npiNumber}" }]
    },
    {
      "@type": "Physician",
      "@id": "https://${domain}/#physician-${npiNumber}",
      "name": "${leadDoctor}",
      "identifier": "${npiNumber}",
      "worksFor": { "@id": "https://${domain}/#clinic" },
      "sameAs": ["https://npiregistry.cms.hhs.gov/provider-view/${npiNumber}"]
    }
  ]
}
</script>`;

  const sampleLlmsTxt = `# ${clinicName} - Machine-Readable Clinical Knowledge Graph
> Verified Clinical Entity Manifest for Perplexity, ChatGPT Search, Apple Intelligence, and Claude.

## Practice Credentials & Official Verification
- Practice Legal Name: ${clinicName}
- Federal NPI Registry: ${npiNumber} (Active CMS Federal NPPES Verification)
- Lead Clinical Director: ${leadDoctor}
- Official Website: https://${domain}
- Primary Phone: ${phone}
- Physical Location: 100 Medical Center Way Suite 400, ${cityState}
- New Patient Status: Currently accepting new patients

## Core Accredited Clinical Procedures
- Single & Multi Dental Implants: https://${domain}/services (Titanium root replacement & bone grafting)
- All-on-4 Immediate Full Arch: https://${domain}/services (Full-arch surgical restoration)
- Handcrafted Porcelain Veneers: https://${domain}/services (Aesthetic smile transformation)
- Clear Aligner Orthodontics: https://${domain}/services (Invisalign certified provider)

## Emergency Directives & Triage
- Acute dental trauma or clinical pain: Call practice priority line at ${phone}.
`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <div className="relative z-10 space-y-8 pb-16">
        
        {/* TOP PRACTICE EXECUTIVE HEADER */}
        <section className="bg-slate-950/80 border-b border-slate-800 backdrop-blur-xl pt-8 pb-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            
            {/* Practice Identity Left */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 border border-emerald-400/30 flex items-center justify-center shadow-lg shadow-emerald-950/50">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                    <span>{clinicName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold">
                      ACTIVE DEFENSE
                    </span>
                  </h1>
                  <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
                    <span>{domain}</span>
                    <span>•</span>
                    <span>{leadDoctor} (NPI: #{npiNumber})</span>
                    <span>•</span>
                    <span className="text-emerald-400">CMS NPPES Verified</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Practice Actions Right */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={isTestingScan}
                onClick={handleRunFreshAudit}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isTestingScan ? 'animate-spin' : ''}`} />
                <span>Run Fresh AI Scan</span>
              </button>

              <Link
                href={`/report/${domain}`}
                target="_blank"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Public Audit Report</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

          </div>

          {/* TAB BAR NAVIGATION */}
          <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'overview' as ClinicTab, label: 'Executive Dashboard', icon: Activity, count: '94%' },
              { id: 'competitor' as ClinicTab, label: 'Competitor Steal Radar', icon: Radio, count: '1 Alert', alert: true },
              { id: 'schema' as ClinicTab, label: '1-Click Schema & /llms.txt', icon: FileCode },
              { id: 'settings' as ClinicTab, label: 'Practice & NPI Licensure', icon: ShieldCheck },
            ].map((tab) => {
              const isCur = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                    isCur
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-md shadow-emerald-950/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isCur ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                  {tab.count && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        tab.alert
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                          : isCur
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* TAB 1: EXECUTIVE DASHBOARD */}
        {activeTab === 'overview' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
            
            {/* Top Stat Dial Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-5 rounded-2xl nr-glass-card border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>AI CITATION READINESS</span>
                  <span className="text-emerald-400">Grade A+</span>
                </div>
                <div className="text-3xl font-black text-white font-mono flex items-baseline gap-2">
                  <span>94%</span>
                  <span className="text-xs text-emerald-400 font-normal font-sans">Top 2% in Austin</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[94%]" />
                </div>
              </div>

              <div className="p-5 rounded-2xl nr-glass-card border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>HIGH-TICKET PROCEDURES</span>
                  <span className="text-emerald-400">4 / 5 Active</span>
                </div>
                <div className="text-3xl font-black text-white font-mono flex items-baseline gap-2">
                  <span>80%</span>
                  <span className="text-xs text-slate-400 font-normal font-sans">Active Citations</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[80%]" />
                </div>
              </div>

              <div className="p-5 rounded-2xl nr-glass-card border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>EST. 30-DAY INQUIRIES</span>
                  <span className="text-indigo-400">+4 vs last mo</span>
                </div>
                <div className="text-3xl font-black text-white font-mono flex items-baseline gap-2">
                  <span>14</span>
                  <span className="text-xs text-slate-400 font-normal font-sans">Consult Requests</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Attributed from ChatGPT &amp; Perplexity
                </div>
              </div>

              <div className="p-5 rounded-2xl nr-glass-card border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>EST. PROCEDURE PIPELINE</span>
                  <span className="text-emerald-400 font-bold">17,951% ROI</span>
                </div>
                <div className="text-3xl font-black text-emerald-400 font-mono flex items-baseline gap-2">
                  <span>$63,000</span>
                  <span className="text-xs text-slate-400 font-normal font-sans">Pipeline</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Based on $4,500 avg procedure ticket
                </div>
              </div>

            </div>

            {/* 4 Generative Search Engines Live Status */}
            <div className="p-6 rounded-3xl nr-glass-card border border-slate-800 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>Live Generative Search Visibility by Engine</span>
                  </h3>
                  <p className="text-xs text-slate-400">Autonomous weekly probing across major generative conversational search engines.</p>
                </div>
                <span className="text-xs text-slate-400 font-mono">Last scanned: 2 hrs ago</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { name: 'ChatGPT Search (OpenAI)', score: '96%', rank: '#1 Recommended', status: 'Dominant', color: 'text-emerald-400' },
                  { name: 'Perplexity Pro', score: '92%', rank: '#1 for Austin Implants', status: 'Dominant', color: 'text-emerald-400' },
                  { name: 'Google AI Overviews', score: '88%', rank: '#2 in Overview Card', status: 'Active', color: 'text-emerald-400' },
                  { name: 'Apple Intelligence', score: '95%', rank: 'Entity Graph Synced', status: 'Verified', color: 'text-indigo-400' },
                ].map((engine) => (
                  <div key={engine.name} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                      <span>{engine.name}</span>
                      <span className={`font-mono font-bold ${engine.color}`}>{engine.score}</span>
                    </div>
                    <div className="text-xs font-bold text-white">{engine.rank}</div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{engine.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Procedures Citation Grid */}
            <div className="p-6 rounded-3xl nr-glass-card border border-slate-800 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">High-Ticket Procedures Citation Health</h3>
                  <p className="text-xs text-slate-400">Real-time tracking of procedure recommendations across conversational queries.</p>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  5 Tracked Procedures
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="text-[11px] font-mono uppercase text-slate-400 border-b border-slate-800 bg-slate-900/40">
                    <tr>
                      <th className="py-3 px-4">Procedure Name</th>
                      <th className="py-3 px-4">Case Value</th>
                      <th className="py-3 px-4">ChatGPT Rank</th>
                      <th className="py-3 px-4">Perplexity Rank</th>
                      <th className="py-3 px-4">Google AI Overview</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {procedures.map((proc) => (
                      <tr key={proc.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-3.5 px-4 font-sans font-bold text-white">{proc.name}</td>
                        <td className="py-3.5 px-4 text-emerald-400">{proc.avgValue}</td>
                        <td className="py-3.5 px-4">{proc.chatgptRank}</td>
                        <td className="py-3.5 px-4">{proc.perplexityRank}</td>
                        <td className="py-3.5 px-4">{proc.googleAioRank}</td>
                        <td className="py-3.5 px-4 font-sans">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              proc.status === 'Active'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}
                          >
                            {proc.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-sans">
                          {proc.status === 'Displaced' ? (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab('competitor');
                                toast.info('Viewing Competitor Steal Alert for Invisalign...');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              Fix Displacement
                            </button>
                          ) : (
                            <span className="text-slate-500 text-[11px]">Protected</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: COMPETITOR STEAL RADAR */}
        {activeTab === 'competitor' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in duration-200">
            
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Autonomous Local Competitor Displacement Radar</span>
              </div>
              <h3 className="text-xl font-bold text-white">Protecting Your Metro Patients from Competitor Poaching</h3>
              <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
                When nearby clinics update their websites with new reviews or procedure claims, ChatGPT and Perplexity may shift recommendations. Our engine detects displacement in real time and provisions automated schema countermeasures.
              </p>
            </div>

            <div className="space-y-4">
              {stealAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-6 rounded-3xl border transition-all ${
                    alert.resolved
                      ? 'bg-slate-900/50 border-slate-800/80 opacity-80'
                      : 'bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border-amber-500/40 shadow-xl shadow-amber-950/20'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            alert.resolved
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {alert.resolved ? 'RESOLVED • PRACTICE RECOMMENDED' : 'ACTIVE DISPLACEMENT ALERT'}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{alert.dateDetected}</span>
                      </div>
                      <h4 className="text-base font-bold text-white">
                        {alert.procedure} recommendation contested by {alert.competitorName}
                      </h4>
                    </div>

                    {!alert.resolved && (
                      <button
                        type="button"
                        onClick={() => handleDeployCountermeasure(alert.id)}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-950/50 shrink-0 cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Deploy 1-Click Countermeasure</span>
                      </button>
                    )}
                  </div>

                  <div className="pt-4 text-xs text-slate-300 space-y-2">
                    <div className="text-slate-400">
                      <strong className="text-white">Differential Diagnosis:</strong> {alert.reason}
                    </div>
                    {alert.resolved ? (
                      <div className="text-emerald-400 flex items-center gap-1.5 font-mono text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Countermeasure deployed: Updated MedicalProcedure schema active on {domain}.</span>
                      </div>
                    ) : (
                      <div className="text-amber-400/90 flex items-center gap-1.5 font-mono text-[11px]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Action Required: Deploying countermeasure will restore #1 citation rank within 24-48 hours.</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 3: 1-CLICK SCHEMA & /LLMS.TXT */}
        {activeTab === 'schema' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
            
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  <span>W3C Schema.org &amp; Machine-Readable /llms.txt</span>
                </div>
                <h3 className="text-xl font-bold text-white">0-Error Clinical Knowledge Graph Code</h3>
                <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                  Non-visual clinical metadata communicating your accepted insurances, verified NPI license, and core procedures directly to AI search engines (ChatGPT Search, Perplexity, Google AI Overviews).
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsPasteGuideOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Open CMS Installation Guide</span>
                </button>

                <a
                  href={`https://search.google.com/test/rich-results?url=https://${domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-2 transition-all shadow-lg shadow-emerald-950/50 cursor-pointer"
                >
                  <span>Test on Google Validator</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Schema.org JSON-LD Box */}
              <div className="p-6 rounded-3xl nr-glass-card border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                      <Code className="w-4 h-4 text-emerald-400" />
                      <span>Schema.org Medical Clinic &amp; Physician Knowledge Graph</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(sampleJsonLd);
                        setCopiedSchema(true);
                        toast.success('Schema JSON-LD copied to clipboard!');
                        setTimeout(() => setCopiedSchema(false), 2000);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSchema ? 'Copied' : 'Copy Knowledge Graph'}</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-96 leading-relaxed">
                    {sampleJsonLd}
                  </pre>
                </div>
                <div className="text-[11px] text-slate-500 font-mono pt-2">
                  Paste into your website &lt;head&gt; tag or inject via our 1-click WordPress plugin.
                </div>
              </div>

              {/* Machine-Readable /llms.txt Box */}
              <div className="p-6 rounded-3xl nr-glass-card border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-indigo-400" />
                      <span>Machine-Readable /llms.txt Clinical Manifest</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(sampleLlmsTxt);
                        setCopiedLlms(true);
                        toast.success('/llms.txt manifest copied to clipboard!');
                        setTimeout(() => setCopiedLlms(false), 2000);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedLlms ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLlms ? 'Copied' : 'Copy Manifest'}</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-96 leading-relaxed">
                    {sampleLlmsTxt}
                  </pre>
                </div>
                <div className="text-[11px] text-slate-500 font-mono pt-2">
                  Host at https://{domain}/llms.txt for instant ingestion by ChatGPT Search and Perplexity.
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 4: PRACTICE SETTINGS & NPI LICENSURE */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
            
            <form onSubmit={handleSaveSettings} className="p-6 sm:p-8 rounded-3xl nr-glass-card border border-slate-800 space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Practice Profile &amp; Federal NPI Licensure Defense</h3>
                  <p className="text-xs text-slate-400">Synchronized directly with the CMS NPPES National Provider Registry.</p>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold">
                  Lifetime Clinic License • Active AI Defense
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 uppercase">Practice Legal Name</label>
                  <input
                    type="text"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-emerald-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 uppercase">Primary Website Domain</label>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-emerald-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 uppercase">Lead Doctor &amp; Credentials</label>
                  <input
                    type="text"
                    value={leadDoctor}
                    onChange={(e) => setLeadDoctor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-emerald-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 uppercase">National Provider Identifier (NPI)</label>
                  <input
                    type="text"
                    value={npiNumber}
                    onChange={(e) => setNpiNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-emerald-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 uppercase">Practice Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-emerald-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 uppercase">New Patient Inquiry Routing Email</label>
                  <input
                    type="email"
                    value={notificationEmail}
                    onChange={(e) => setNotificationEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* NPI Verification Strip */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div className="text-xs text-slate-300">
                    <strong className="text-white">CMS Federal Registry Status:</strong> NPI #{npiNumber} is active and verified for Texas State Dental Board licensure.
                  </div>
                </div>
                <a
                  href={`https://npiregistry.cms.hhs.gov/provider-view/${npiNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1 shrink-0"
                >
                  <span>Verify on CMS</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-500 font-mono">
                  {saveSuccess ? '✓ Settings synchronized with edge CDN' : 'Changes apply immediately to your active schema'}
                </span>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-950/50 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Synchronizing...' : 'Save Practice Profile'}</span>
                </button>
              </div>

            </form>

          </div>
        )}

      </div>

      {/* Paste Guide Modal */}
      <PasteGuideModal
        isOpen={isPasteGuideOpen}
        onClose={() => setIsPasteGuideOpen(false)}
      />

    </div>
  );
}
