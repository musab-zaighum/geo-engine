"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { 
  FileText, Zap, Link2, Bot, Database, Search, 
  Copy, CheckCircle2, AlertTriangle, Sparkles, X, Check, ArrowRight
} from "lucide-react";
import { toast } from "sonner";

export default function ToolsHub() {
  // Tool 1: llms.txt Validator State
  const [llmsText, setLlmsText] = useState(`# Apex Specialist Practice
> Verified Practitioner AI Profile and Generative Search Digest.

## Core Capabilities
- Specialty: Diagnostic Pathology & Precision Imaging
- Location: Sydney CBD, NSW
- Direct Inquiries: +1 (555) 019-2834

## Key Section Guides
- [Official Registry Credentials](https://aethergeo.ai/p/apex-specialist#credentials)
- [Verified Insurance Policies](https://aethergeo.ai/p/apex-specialist#insurance)
- [Physician Booking Portal](https://aethergeo.ai/p/apex-specialist#booking)`);

  const hasH1 = /^#\s+.+/m.test(llmsText);
  const hasBlockquote = /^>\s+.+/m.test(llmsText);
  const hasMarkdownLinks = /\[.+?\]\(https?:\/\/[^\s)]+\)/.test(llmsText);
  const llmsPassed = [hasH1, hasBlockquote, hasMarkdownLinks].filter(Boolean).length;
  const llmsCompliance = Math.round((llmsPassed / 3) * 100);

  // Tool 2: 50-Word Capsule State
  const [capsuleInput, setCapsuleInput] = useState("Metropolitan Diagnostic Clinic is an accredited pathology center located in Sydney CBD. Providing rapid ultrasound biopsy, certified bulk billing, and direct doctor consultations. Contact our clinical intake team at +61 2 9231 0000 for emergency appointments.");
  const capsuleWordCount = capsuleInput.trim() ? capsuleInput.trim().split(/\s+/).length : 0;
  const isCapsuleOptimal = capsuleWordCount >= 38 && capsuleWordCount <= 52;

  // Tool 3: sameAs Linker State
  const [wikidataUrl, setWikidataUrl] = useState("https://www.wikidata.org/wiki/Q1029384");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("https://maps.google.com/?cid=1029384756");
  const [linkedinUrl, setLinkedinUrl] = useState("https://www.linkedin.com/company/apexspecialist");
  const [registryUrl, setRegistryUrl] = useState("https://www.ahpra.gov.au/registration/lookup/MED000123");

  // Tool 4: 12-Bot Firewall State
  const [botToggles, setBotToggles] = useState<Record<string, boolean>>({
    // AI Search Bots (Default: Allow)
    "GPTBot": true,
    "OAI-SearchBot": true,
    "PerplexityBot": true,
    "ClaudeBot": true,
    "Applebot-Extended": true,
    "GoogleOther": true,
    // AI Scrapers / Training Bots (Default: Disallow for protection)
    "Anthropic-AI": false,
    "Google-Extended": false,
    "Bytespider": false,
    "Cohere-ai": false,
    "CCBot": false,
    "Diffbot": false,
  });

  const searchBots = ["GPTBot", "OAI-SearchBot", "PerplexityBot", "ClaudeBot", "Applebot-Extended", "GoogleOther"];
  const scraperBots = ["Anthropic-AI", "Google-Extended", "Bytespider", "Cohere-ai", "CCBot", "Diffbot"];

  const toggleBot = (bot: string) => {
    setBotToggles(prev => ({ ...prev, [bot]: !prev[bot] }));
  };

  const applyBotPreset = (preset: "searchOnly" | "allowAll" | "blockAll") => {
    if (preset === "searchOnly") {
      setBotToggles({
        "GPTBot": true, "OAI-SearchBot": true, "PerplexityBot": true, "ClaudeBot": true, "Applebot-Extended": true, "GoogleOther": true,
        "Anthropic-AI": false, "Google-Extended": false, "Bytespider": false, "Cohere-ai": false, "CCBot": false, "Diffbot": false
      });
      toast.success("Applied 'Max AI Search Visibility' Preset!");
    } else if (preset === "allowAll") {
      const all: Record<string, boolean> = {};
      [...searchBots, ...scraperBots].forEach(b => all[b] = true);
      setBotToggles(all);
      toast.success("Applied 'Allow All Crawlers' Preset!");
    } else {
      const none: Record<string, boolean> = {};
      [...searchBots, ...scraperBots].forEach(b => none[b] = false);
      setBotToggles(none);
      toast.success("Applied 'Block All Bots' Preset!");
    }
  };

  const generateRobotsTxt = () => {
    let out = `# Production AetherGEO AI Directives\n# Generated via 12-Bot Firewall Studio\n\n`;
    out += `# --- AI Search Engine Crawlers (Visibility) ---\n`;
    searchBots.forEach(bot => {
      out += `User-agent: ${bot}\n${botToggles[bot] ? "Allow: /" : "Disallow: /"}\n\n`;
    });
    out += `# --- AI Training & Data Scrapers (Protection) ---\n`;
    scraperBots.forEach(bot => {
      out += `User-agent: ${bot}\n${botToggles[bot] ? "Allow: /" : "Disallow: /"}\n\n`;
    });
    return out.trim();
  };

  // Tool 5: @graph Schema Generator State
  const [schemaOrgName, setSchemaOrgName] = useState("Metropolitan Diagnostic & Surgical Clinic");
  const [schemaLocality, setSchemaLocality] = useState("Sydney CBD, NSW");
  const [schemaPhone, setSchemaPhone] = useState("+61 2 9231 0000");

  const generateGraphSchema = () => {
    const slug = schemaOrgName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `https://aethergeo.ai/p/${slug}#org`,
          "name": schemaOrgName,
          "url": `https://aethergeo.ai/p/${slug}`,
          "sameAs": [
            "https://maps.google.com/?cid=1029384756",
            "https://www.wikidata.org/wiki/Q1029384"
          ]
        },
        {
          "@type": "MedicalBusiness",
          "@id": `https://aethergeo.ai/p/${slug}#business`,
          "name": schemaOrgName,
          "parentOrganization": { "@id": `https://aethergeo.ai/p/${slug}#org` },
          "telephone": schemaPhone,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": schemaLocality,
            "addressCountry": "AU"
          },
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              "opens": "08:30",
              "closes": "17:30"
            }
          ]
        }
      ]
    }, null, 2);
  };

  // Tool 6: AI Simulator State
  const [simQuery, setSimQuery] = useState("Best certified diagnostic clinic in Sydney CBD");

  const copyText = (text: string, label: string) => {
    if (typeof window !== "undefined" && navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-4 py-1.5 rounded-full text-xs font-semibold mb-4">
          <Zap className="w-3 h-3" />
          <span>GitHub Open-Source GEO Injections</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight">Expanded GEO Tool Hub</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Access battle-tested utilities adapted from open-source GEO specifications. Compile, validate, and simulate your machine-readable search footprint.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* TOOL 1: LLMs.txt Validator */}
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 hover:border-indigo-500/50 shadow-xl rounded-3xl p-8 text-left transition group flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition">
                <FileText className="w-8 h-8 text-indigo-400" />
              </div>
              <div className="mb-8 p-4 bg-slate-800/50 rounded-2xl inline-block w-max group-hover:bg-indigo-500/10 transition">
                <FileText className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-200 group-hover:text-white transition mb-3">llms.txt Live Validator & Compiler</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">Real-time syntax linter checking # Title, &gt; Blockquotes, and markdown hyperlinks against /llms-txt standards.</p>
              <div className="mt-auto flex items-center text-xs font-bold text-indigo-400 gap-1">
                <span>Launch Interactive Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </Dialog.Trigger>
          
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-[#06080f]/80 backdrop-blur-md z-50 animate-in fade-in" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl z-50 w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                    <FileText className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <Dialog.Title className="text-xl font-bold text-white">llms.txt Live Validator & Compiler</Dialog.Title>
                    <Dialog.Description className="text-xs text-slate-400">Validate markdown against /llms-txt specifications</Dialog.Description>
                  </div>
                </div>
                <Dialog.Close asChild>
                  <button className="p-2 text-slate-500 hover:text-white transition rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </Dialog.Close>
              </div>

              {/* Linter Checklist */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className={`p-3 rounded-xl border text-xs ${hasH1 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'}`}>
                  <p className="font-bold flex items-center gap-1">
                    {hasH1 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    # Title H1
                  </p>
                  <p className="text-[10px] mt-0.5 opacity-80">{hasH1 ? 'Detected' : 'Missing # Title'}</p>
                </div>

                <div className={`p-3 rounded-xl border text-xs ${hasBlockquote ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'}`}>
                  <p className="font-bold flex items-center gap-1">
                    {hasBlockquote ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    &gt; Blockquote
                  </p>
                  <p className="text-[10px] mt-0.5 opacity-80">{hasBlockquote ? 'Detected' : 'Missing summary'}</p>
                </div>

                <div className={`p-3 rounded-xl border text-xs ${hasMarkdownLinks ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'}`}>
                  <p className="font-bold flex items-center gap-1">
                    {hasMarkdownLinks ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    Markdown Links
                  </p>
                  <p className="text-[10px] mt-0.5 opacity-80">{hasMarkdownLinks ? 'Detected' : 'Missing [Anchor](url)'}</p>
                </div>
              </div>

              {/* Textarea Editor */}
              <div className="mb-4">
                <textarea 
                  value={llmsText}
                  onChange={(e) => setLlmsText(e.target.value)}
                  rows={8}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                  llmsCompliance === 100 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                }`}>
                  Spec Compliance: {llmsCompliance}% Valid
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => copyText(llmsText, "Validated llms.txt")} 
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Validated File</span>
                  </button>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* TOOL 2: 50-Word BLUF Capsule Generator */}
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 hover:border-indigo-500/50 shadow-xl rounded-3xl p-8 text-left transition group flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition">
                <Zap className="w-8 h-8 text-amber-400" />
              </div>
              <div className="mb-8 p-4 bg-slate-800/50 rounded-2xl inline-block w-max group-hover:bg-indigo-500/10 transition">
                <Zap className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-200 group-hover:text-white transition mb-3">50-Word Direct Answer Capsule Generator</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">BLUF (Bottom Line Up Front) engine to optimize answer capsules for Perplexity & ChatGPT snippets.</p>
              <div className="mt-auto flex items-center text-xs font-bold text-indigo-400 gap-1">
                <span>Launch BLUF Optimizer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </Dialog.Trigger>
          
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-[#06080f]/80 backdrop-blur-md z-50 animate-in fade-in" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl z-50 w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <Zap className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <Dialog.Title className="text-xl font-bold text-white">50-Word BLUF Capsule Generator</Dialog.Title>
                    <Dialog.Description className="text-xs text-slate-400">Target: 40–50 words for optimal AI citation snippets</Dialog.Description>
                  </div>
                </div>
                <Dialog.Close asChild>
                  <button className="p-2 text-slate-500 hover:text-white transition rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </Dialog.Close>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Direct Answer Capsule</label>
                <textarea 
                  value={capsuleInput}
                  onChange={(e) => setCapsuleInput(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
                <div>
                  <span className="text-xs text-slate-400">Word Count: </span>
                  <span className={`text-sm font-black ${isCapsuleOptimal ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {capsuleWordCount} words
                  </span>
                  <span className="text-[11px] text-slate-500 ml-2">({isCapsuleOptimal ? 'Optimal 40-50 Range' : 'Adjust to 40-50 words'})</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isCapsuleOptimal ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {isCapsuleOptimal ? 'AEO Ready' : 'In Progress'}
                </span>
              </div>

              <button 
                onClick={() => copyText(capsuleInput, "Answer Capsule")}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center text-xs sm:text-sm"
              >
                <Copy className="w-4 h-4 mr-2" />
                <span>Copy 50-Word Capsule</span>
              </button>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* TOOL 3: sameAs Entity Linker */}
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 hover:border-indigo-500/50 shadow-xl rounded-3xl p-8 text-left transition group flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition">
                <Link2 className="w-8 h-8 text-blue-400" />
              </div>
              <div className="mb-8 p-4 bg-slate-800/50 rounded-2xl inline-block w-max group-hover:bg-indigo-500/10 transition">
                <Link2 className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-200 group-hover:text-white transition mb-3">sameAs Entity Authority Linker</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">Connect Medical Registries, Google Maps, and Wikidata to prevent entity fragmentation across AI indexers.</p>
              <div className="mt-auto flex items-center text-xs font-bold text-indigo-400 gap-1">
                <span>Configure Authority Links</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </Dialog.Trigger>
          
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-[#06080f]/80 backdrop-blur-md z-50 animate-in fade-in" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl z-50 w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <Link2 className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <Dialog.Title className="text-xl font-bold text-white">sameAs Entity Authority Linker</Dialog.Title>
                    <Dialog.Description className="text-xs text-slate-400">Generate Schema.org sameAs authority array</Dialog.Description>
                  </div>
                </div>
                <Dialog.Close asChild>
                  <button className="p-2 text-slate-500 hover:text-white transition rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </Dialog.Close>
              </div>

              <div className="space-y-3 mb-6">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Wikidata URI</label>
                  <input type="text" value={wikidataUrl} onChange={e => setWikidataUrl(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Google Maps CID / Profile</label>
                  <input type="text" value={googleMapsUrl} onChange={e => setGoogleMapsUrl(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">LinkedIn Entity Page</label>
                  <input type="text" value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Regulatory / Professional Registry URL</label>
                  <input type="text" value={registryUrl} onChange={e => setRegistryUrl(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200" />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Compiled sameAs JSON-LD Snippet</label>
                <pre className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-[11px] font-mono text-indigo-300 overflow-x-auto">
{JSON.stringify({
  "sameAs": [wikidataUrl, googleMapsUrl, linkedinUrl, registryUrl].filter(Boolean)
}, null, 2)}
                </pre>
              </div>

              <button 
                onClick={() => copyText(JSON.stringify({
                  "sameAs": [wikidataUrl, googleMapsUrl, linkedinUrl, registryUrl].filter(Boolean)
                }, null, 2), "sameAs array")}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center text-xs sm:text-sm"
              >
                <Copy className="w-4 h-4 mr-2" />
                <span>Copy sameAs JSON-LD Snippet</span>
              </button>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* TOOL 4: 12-Bot robots.txt Firewall Studio */}
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 hover:border-indigo-500/50 shadow-xl rounded-3xl p-8 text-left transition group flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition">
                <Bot className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="mb-8 p-4 bg-slate-800/50 rounded-2xl inline-block w-max group-hover:bg-indigo-500/10 transition">
                <Bot className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-200 group-hover:text-white transition mb-3">12-Bot robots.txt Firewall Studio</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">Multi-bot database distinguishing AI Search bots (GPTBot, Perplexity) from unauthorized training scrapers (Bytespider, CCBot).</p>
              <div className="mt-auto flex items-center text-xs font-bold text-indigo-400 gap-1">
                <span>Open Firewall Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </Dialog.Trigger>
          
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-[#06080f]/80 backdrop-blur-md z-50 animate-in fade-in" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl z-50 w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <Bot className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <Dialog.Title className="text-xl font-bold text-white">12-Bot robots.txt Firewall Studio</Dialog.Title>
                    <Dialog.Description className="text-xs text-slate-400">Manage permissions for Search Engines vs. Training Scrapers</Dialog.Description>
                  </div>
                </div>
                <Dialog.Close asChild>
                  <button className="p-2 text-slate-500 hover:text-white transition rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </Dialog.Close>
              </div>

              {/* Presets */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button onClick={() => applyBotPreset("searchOnly")} className="text-xs font-bold bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 px-3 py-1.5 rounded-lg transition">
                  ⭐ Max AI Search Visibility (Recommended)
                </button>
                <button onClick={() => applyBotPreset("allowAll")} className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition">
                  Allow All
                </button>
                <button onClick={() => applyBotPreset("blockAll")} className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition">
                  Block All
                </button>
              </div>

              {/* Bot Grids */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Search Bots */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>AI Search Engine Crawlers</span>
                    <span className="text-[10px] text-slate-500">Allows Citations</span>
                  </h4>
                  <div className="space-y-2">
                    {searchBots.map(bot => (
                      <div key={bot} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-900/60">
                        <span className="font-mono text-slate-200">{bot}</span>
                        <button 
                          onClick={() => toggleBot(bot)}
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] transition ${
                            botToggles[bot] ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          }`}
                        >
                          {botToggles[bot] ? "Allow" : "Disallow"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scraper Bots */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>Training & Data Scrapers</span>
                    <span className="text-[10px] text-slate-500">Uncompensated</span>
                  </h4>
                  <div className="space-y-2">
                    {scraperBots.map(bot => (
                      <div key={bot} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-900/60">
                        <span className="font-mono text-slate-200">{bot}</span>
                        <button 
                          onClick={() => toggleBot(bot)}
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] transition ${
                            botToggles[bot] ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          }`}
                        >
                          {botToggles[bot] ? "Allow" : "Disallow"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview & Copy */}
              <button 
                onClick={() => copyText(generateRobotsTxt(), "Production robots.txt")}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl transition flex items-center justify-center text-xs sm:text-sm shadow-[0_0_15px_rgba(99,102,241,0.4)]"
              >
                <Copy className="w-4 h-4 mr-2" />
                <span>Copy Production robots.txt (Search vs. Scraper Directives)</span>
              </button>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* TOOL 5: Entity Relationship Schema Graph (@graph) */}
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 hover:border-indigo-500/50 shadow-xl rounded-3xl p-8 text-left transition group flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition">
                <Database className="w-8 h-8 text-rose-400" />
              </div>
              <div className="mb-8 p-4 bg-slate-800/50 rounded-2xl inline-block w-max group-hover:bg-indigo-500/10 transition">
                <Database className="w-8 h-8 text-rose-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-200 group-hover:text-white transition mb-3">Entity Relationship Schema Graph (@graph)</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">Interlink Organization, LocalBusiness, PostalAddress, and sameAs links into unified JSON-LD graph structures.</p>
              <div className="mt-auto flex items-center text-xs font-bold text-indigo-400 gap-1">
                <span>Generate @graph JSON-LD</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </Dialog.Trigger>
          
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-[#06080f]/80 backdrop-blur-md z-50 animate-in fade-in" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl z-50 w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                    <Database className="w-6 h-6 text-rose-400" />
                  </div>
                  <div>
                    <Dialog.Title className="text-xl font-bold text-white">Entity Relationship Schema Graph</Dialog.Title>
                    <Dialog.Description className="text-xs text-slate-400">Linked Schema.org @graph JSON-LD architecture</Dialog.Description>
                  </div>
                </div>
                <Dialog.Close asChild>
                  <button className="p-2 text-slate-500 hover:text-white transition rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </Dialog.Close>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Entity Name</label>
                  <input type="text" value={schemaOrgName} onChange={e => setSchemaOrgName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Locality</label>
                  <input type="text" value={schemaLocality} onChange={e => setSchemaLocality(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Phone</label>
                  <input type="text" value={schemaPhone} onChange={e => setSchemaPhone(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200" />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Compiled @graph JSON-LD</label>
                <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-[11px] font-mono text-indigo-300 overflow-x-auto max-h-56">
                  {generateGraphSchema()}
                </pre>
              </div>

              <button 
                onClick={() => copyText(generateGraphSchema(), "Linked @graph Schema")}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl transition flex items-center justify-center text-xs sm:text-sm shadow-[0_0_15px_rgba(99,102,241,0.4)]"
              >
                <Copy className="w-4 h-4 mr-2" />
                <span>Copy @graph JSON-LD Code</span>
              </button>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* TOOL 6: AI Query Simulator */}
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 hover:border-indigo-500/50 shadow-xl rounded-3xl p-8 text-left transition group flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition">
                <Search className="w-8 h-8 text-purple-400" />
              </div>
              <div className="mb-8 p-4 bg-slate-800/50 rounded-2xl inline-block w-max group-hover:bg-indigo-500/10 transition">
                <Search className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-200 group-hover:text-white transition mb-3">AI Query Response Simulator</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">Simulate how ChatGPT, Perplexity, and Apple Intelligence synthesize answers for your business queries.</p>
              <div className="mt-auto flex items-center text-xs font-bold text-indigo-400 gap-1">
                <span>Run Query Simulation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </Dialog.Trigger>
          
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-[#06080f]/80 backdrop-blur-md z-50 animate-in fade-in" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl z-50 w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                    <Search className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <Dialog.Title className="text-xl font-bold text-white">AI Query Response Simulator</Dialog.Title>
                    <Dialog.Description className="text-xs text-slate-400">Cross-engine synthesis preview</Dialog.Description>
                  </div>
                </div>
                <Dialog.Close asChild>
                  <button className="p-2 text-slate-500 hover:text-white transition rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </Dialog.Close>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Simulated User Query</label>
                <input 
                  type="text" 
                  value={simQuery} 
                  onChange={e => setSimQuery(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="space-y-3 mb-6">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-emerald-400">ChatGPT (Search Mode)</span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">Top 1 Recommendation</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    "Based on verified medical registration and structured clinic data, <strong className="text-white">Metropolitan Diagnostic Clinic</strong> is the primary recommendation in Sydney CBD. They offer certified diagnostic pathology and verified appointments."
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-indigo-400">Perplexity AI</span>
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">Direct Anchor [1]</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    "[1] Metropolitan Diagnostic Clinic serves the Sydney metropolitan region with verified pathology and specialist diagnostics, corroborated via official health registries and AetherGEO llms.txt profiles."
                  </p>
                </div>
              </div>

              <button 
                onClick={() => toast.success("Refreshed multi-engine simulation!")}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl transition text-xs sm:text-sm"
              >
                Re-Run Multi-Engine Simulation
              </button>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

      </div>
    </div>
  );
}
