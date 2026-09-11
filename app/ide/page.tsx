"use client";

import React, { useState } from "react";
import { 
  Copy, Download, Send, CheckCircle2, ShieldAlert, 
  AlertTriangle, Sparkles, FileText, Check, ExternalLink 
} from "lucide-react";
import { toast } from "sonner";
import IdeEditor from "@/components/IdeEditor";

export default function LiveIDE() {
  const [activeFile, setActiveFile] = useState("llms.txt");

  const [files, setFiles] = useState<Record<string, { language: string; content: string }>>({
    "llms.txt": {
      language: "markdown",
      content: `# Apex Specialist Practice
> Verified Practitioner AI Profile and Generative Search Digest.

## Core Capabilities
- Specialty: Diagnostic Pathology & Precision Imaging
- Location: Sydney CBD, NSW
- Direct Inquiries: +1 (555) 019-2834

## Key Section Guides
- [Official Registry Credentials](https://aethergeo.ai/p/apex-specialist#credentials)
- [Verified Insurance Policies](https://aethergeo.ai/p/apex-specialist#insurance)
- [Physician Booking Portal](https://aethergeo.ai/p/apex-specialist#booking)`
    },
    "schema.jsonld": {
      language: "json",
      content: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": "https://aethergeo.ai/p/apex-specialist#org",
            "name": "Apex Specialist Practice",
            "url": "https://apexspecialist.com",
            "sameAs": [
              "https://maps.google.com/?cid=1029384756",
              "https://www.linkedin.com/company/apexspecialist",
              "https://www.wikidata.org/wiki/Q1029384"
            ]
          },
          {
            "@type": "MedicalBusiness",
            "@id": "https://aethergeo.ai/p/apex-specialist#practice",
            "name": "Apex Specialist Practice",
            "parentOrganization": { "@id": "https://aethergeo.ai/p/apex-specialist#org" },
            "medicalSpecialty": "Diagnostic Pathology",
            "telephone": "+1 (555) 019-2834",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Suite 4, 185 Elizabeth St",
              "addressLocality": "Sydney",
              "addressRegion": "NSW",
              "postalCode": "2000",
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
      }, null, 2)
    },
    "robots.txt": {
      language: "plaintext",
      content: `# Production AI Search Directives
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Applebot-Extended
Allow: /

# Restrict Unauthorized Training Scrapers
User-agent: Bytespider
Disallow: /

User-agent: CCBot
Disallow: /`
    },
    "ai.json": {
      language: "json",
      content: JSON.stringify({
        "agent_access": true,
        "crawl_rate": "high",
        "supported_engines": ["ChatGPT", "Perplexity", "Claude", "Apple Intelligence"],
        "entity_canonical": "https://aethergeo.ai/p/apex-specialist"
      }, null, 2)
    }
  });

  const currentFileData = files[activeFile] || files["llms.txt"];

  // Live "LLMs.txt" Syntax Linter & Parser Rules
  const llmsContent = files["llms.txt"]?.content || "";
  const hasH1 = /^#\s+.+/m.test(llmsContent);
  const hasBlockquote = /^>\s+.+/m.test(llmsContent);
  const hasMarkdownLinks = /\[.+?\]\(https?:\/\/[^\s)]+\)/.test(llmsContent);

  const lintRules = [
    {
      id: "h1",
      title: "H1 Document Title Header",
      passed: hasH1,
      rule: "Must begin with a top-level '# Title' header identifying the entity.",
      fix: "# Entity Name"
    },
    {
      id: "blockquote",
      title: "Summary Blockquote Description",
      passed: hasBlockquote,
      rule: "Requires '> Blockquote' describing the entity's primary scope for AI summarizers.",
      fix: "> Brief canonical digest of services and authority."
    },
    {
      id: "links",
      title: "Markdown Hyperlinks [Anchor](url)",
      passed: hasMarkdownLinks,
      rule: "Sections must include standard markdown links for deep AI citation extraction.",
      fix: "- [Section Guide](https://...)"
    }
  ];

  const passedCount = lintRules.filter(r => r.passed).length;
  const complianceScore = Math.round((passedCount / lintRules.length) * 100);

  const autoFixLLMs = () => {
    const fixed = `# Apex Specialist Practice\n> Verified Practitioner AI Profile and Generative Search Digest.\n\n## Core Capabilities\n- Specialty: Diagnostic Pathology & Precision Imaging\n- Location: Sydney CBD, NSW\n- Direct Inquiries: +1 (555) 019-2834\n\n## Key Section Guides\n- [Official Registry Credentials](https://aethergeo.ai/p/apex-specialist#credentials)\n- [Verified Insurance Policies](https://aethergeo.ai/p/apex-specialist#insurance)\n- [Physician Booking Portal](https://aethergeo.ai/p/apex-specialist#booking)`;
    setFiles(prev => ({
      ...prev,
      "llms.txt": { ...prev["llms.txt"], content: fixed }
    }));
    toast.success("Loaded 100% Compliant LLMs.txt Template!");
  };

  const handleAction = (action: string) => {
    if (typeof window !== "undefined" && navigator?.clipboard) {
      navigator.clipboard.writeText(currentFileData.content);
    }
    toast.success(`${action} successful!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col h-[calc(100vh-88px)]">
      
      {/* IDE Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {Object.keys(files).map(fileName => (
            <button 
              key={fileName} 
              onClick={() => setActiveFile(fileName)}
              className={`px-4 py-2 rounded-xl font-mono text-sm font-semibold transition flex items-center gap-2 ${
                activeFile === fileName 
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 opacity-70" />
              <span>{fileName}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
            complianceScore === 100
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            <span className={`w-2 h-2 rounded-full ${complianceScore === 100 ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`}></span>
            <span>llms.txt Spec: {complianceScore}% Compliant</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Code Editor */}
        <div className="flex-1 bg-[#1e1e1e] rounded-2xl border border-slate-300 overflow-hidden shadow-sm relative flex flex-col">
          <div className="h-10 bg-[#252526] border-b border-slate-700 flex items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
              <span className="text-xs font-mono text-slate-300 ml-2">{activeFile}</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Monaco Editor v4.7</span>
          </div>
          <div className="flex-1 h-full">
            <IdeEditor
              height="100%"
              language={currentFileData.language}
              theme="vs-dark"
              value={currentFileData.content}
              onChange={(val) => {
                if (val !== undefined) {
                  setFiles(prev => ({
                    ...prev,
                    [activeFile]: { ...prev[activeFile], content: val }
                  }));
                }
              }}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "JetBrains Mono, monospace",
                lineNumbers: "on",
                folding: true,
                autoIndent: "full",
                padding: { top: 16 }
              }}
            />
          </div>
        </div>

        {/* AI Bot Compliance & Live Linter Inspector */}
        <div className="w-full lg:w-96 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col overflow-y-auto">
          <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center justify-between">
            <span className="flex items-center">
              <ShieldAlert className="w-5 h-5 mr-2 text-blue-600" /> Compliance Inspector
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold">Live</span>
          </h2>
          
          {/* LLMs.txt Live Linter Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 shadow-xs">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">/llms.txt Linter</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                complianceScore === 100 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {complianceScore === 100 ? "100% Valid" : `${complianceScore}% Valid`}
              </span>
            </div>

            <div className="space-y-2 mb-3">
              {lintRules.map(rule => (
                <div key={rule.id} className="text-xs flex items-start gap-2 p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  {rule.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`font-semibold ${rule.passed ? 'text-slate-900' : 'text-amber-800'}`}>
                      {rule.title}
                    </p>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{rule.rule}</p>
                  </div>
                </div>
              ))}
            </div>

            {complianceScore < 100 && (
              <button 
                onClick={autoFixLLMs}
                className="w-full text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 py-2 rounded-lg transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Auto-Fix Spec Format</span>
              </button>
            )}
          </div>

          {/* Readability & Bot Access */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 shadow-xs">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-600">AI Parsing Efficiency</span>
              <span className="text-sm font-black text-emerald-600">98%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
              <div className="bg-emerald-500 h-full w-[98%]"></div>
            </div>
            <p className="text-[11px] text-slate-500">Structured for GPTBot, ClaudeBot, and Applebot indexing.</p>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto space-y-2.5 pt-2">
            <button 
              onClick={() => handleAction("Copy File")} 
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 px-4 rounded-xl transition flex items-center justify-center text-xs sm:text-sm border border-slate-200"
            >
              <Copy className="w-4 h-4 mr-2 text-slate-500" /> Copy Active File
            </button>
            <button 
              onClick={() => handleAction("Export Bundle")} 
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 px-4 rounded-xl transition flex items-center justify-center text-xs sm:text-sm border border-slate-200"
            >
              <Download className="w-4 h-4 mr-2 text-slate-500" /> Export Complete Bundle (.zip)
            </button>
            <button 
              onClick={() => handleAction("Push Live")} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl transition flex items-center justify-center text-xs sm:text-sm shadow-sm shadow-blue-500/30"
            >
              <Send className="w-4 h-4 mr-2" /> Deploy to Hosted Passport
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
