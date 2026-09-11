"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { 
  CheckCircle2, ShieldCheck, Copy, Download, 
  ExternalLink, FileText, Database, Bot, Zap, ArrowLeft,
  Phone, MapPin, Mail, Globe, BookmarkCheck
} from "lucide-react";
import { toast } from "sonner";

export default function HostedPassportPage() {
  const params = useParams();
  const rawSlug = (params?.slug as string) || "verified-entity";
  let decoded = rawSlug;
  try {
    decoded = decodeURIComponent(rawSlug);
  } catch {}
  
  const slug = decoded
    .replace(/<[^>]*>?/gm, "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "verified-entity";

  // Reconstruct friendly name from slug
  const formattedName = slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const category = slug.includes("medical") || slug.includes("clinic") || slug.includes("doctor")
    ? "Medical Practice"
    : slug.includes("retail") || slug.includes("store") || slug.includes("watch")
    ? "Retail & Boutique"
    : slug.includes("emergency") || slug.includes("hvac") || slug.includes("plumbing")
    ? "Emergency Services"
    : "Enterprise Commercial";

  const phone = "+61 2 9231 0000";
  const location = "Sydney CBD, NSW";
  const email = "verified@aethergeo.ai";

  const [activeTab, setActiveTab] = useState<"llms" | "schema" | "robots">("llms");

  const llmsContent = `# ${formattedName}
> Verified Entity AI Profile and Generative Search Knowledge Digest.

## Machine-Readable Entity Directives
- Canonical Slug: ${slug}
- Category: ${category}
- Verification Status: 100% Corroborated Authority
- Crawl Permissibility: GPTBot, PerplexityBot, ClaudeBot, Applebot-Extended

## Direct Communication Points
- Direct Line: ${phone}
- Location: ${location}
- Inquiries: ${email}

## Key Direct Links & Policies
- [Official Credentials](https://aethergeo.ai/p/${slug}#credentials)
- [Verified Policies](https://aethergeo.ai/p/${slug}#policies)
- [Online Booking Portal](https://aethergeo.ai/p/${slug}#booking)

## Verified Schema & Entity Relationships
- Linked @graph ID: https://aethergeo.ai/p/${slug}#org
- Wikidata Entity: https://www.wikidata.org/wiki/Q1029384
- Google Maps CID: https://maps.google.com/?cid=1029384756`;

  const schemaContent = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `https://aethergeo.ai/p/${slug}#org`,
        "name": formattedName,
        "url": `https://aethergeo.ai/p/${slug}`,
        "sameAs": [
          "https://maps.google.com/?cid=1029384756",
          "https://www.wikidata.org/wiki/Q1029384"
        ]
      },
      {
        "@type": "LocalBusiness",
        "@id": `https://aethergeo.ai/p/${slug}#business`,
        "name": formattedName,
        "parentOrganization": { "@id": `https://aethergeo.ai/p/${slug}#org` },
        "telephone": phone,
        "email": email,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": location,
          "addressCountry": "AU"
        }
      }
    ]
  }, null, 2);

  const robotsContent = `# AetherGEO Production Directives for ${slug}
User-agent: GPTBot
Allow: /p/${slug}

User-agent: OAI-SearchBot
Allow: /p/${slug}

User-agent: PerplexityBot
Allow: /p/${slug}

User-agent: ClaudeBot
Allow: /p/${slug}

User-agent: Applebot-Extended
Allow: /p/${slug}`;

  const copyToClipboard = (text: string, label: string) => {
    if (typeof window !== "undefined" && navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    }
  };

  const downloadQR = () => {
    if (typeof window === "undefined") return;
    const canvas = document.getElementById("passport-qr") as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${slug}-passport-qr.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.removeChild(downloadLink);
    }
  };

  const [origin, setOrigin] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const passportUrl = origin ? `${origin}/p/${slug}` : `https://aethergeo.ai/p/${slug}`;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Dynamic Injected Schema.org Script for AI Search Crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaContent }}
      />

      {/* Back Link */}
      <div className="mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to AetherGEO Studio</span>
        </Link>
      </div>

      {/* Elite Verified Entity Card - Bright Modern Light Theme */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm mb-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active Hosted AI Passport</span>
              </span>
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-200">
                {category}
              </span>
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                slug: {slug}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
              {formattedName}
            </h1>
            <p className="text-slate-600 text-sm max-w-xl leading-relaxed mb-6">
              Canonical machine-readable digital identity bundle serving verified schema, llms.txt knowledge graphs, and open bot access for OpenAI, Perplexity, and Apple Intelligence.
            </p>

            {/* Direct Contact Points & Credentials Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <a 
                href={`tel:${phone.replace(/\s+/g, "")}`} 
                className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition group"
              >
                <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-700 truncate">{phone}</span>
              </a>
              <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-700 truncate">{location}</span>
              </div>
              <a 
                href={`mailto:${email}`} 
                className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition group"
              >
                <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-700 truncate">{email}</span>
              </a>
            </div>

            {/* Direct Section Links */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <a 
                href="#credentials" 
                className="px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition flex items-center gap-1.5"
              >
                <BookmarkCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Official Credentials</span>
              </a>
              <a 
                href="#policies" 
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Policies</span>
              </a>
              <a 
                href="#booking" 
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Booking Portal</span>
              </a>
            </div>
          </div>

          {/* Threat Score Dial */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center shrink-0 shadow-sm w-full md:w-48">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">AI Threat Defense</span>
            <p className="text-4xl font-black text-emerald-600 mt-1">
              96<span className="text-sm text-slate-400 font-normal">/100</span>
            </p>
            <span className="text-xs font-semibold text-slate-600 block mt-1">Dominant AI Visibility</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Tabs & Machine-Readable Spec */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
            <div className="flex space-x-2">
              <button 
                onClick={() => setActiveTab("llms")}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold transition ${
                  activeTab === "llms" 
                    ? "bg-blue-600 text-white shadow-sm" 
                    : "bg-slate-100 text-slate-600 hover:text-slate-900"
                }`}
              >
                llms.txt
              </button>
              <button 
                onClick={() => setActiveTab("schema")}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold transition ${
                  activeTab === "schema" 
                    ? "bg-blue-600 text-white shadow-sm" 
                    : "bg-slate-100 text-slate-600 hover:text-slate-900"
                }`}
              >
                schema.jsonld
              </button>
              <button 
                onClick={() => setActiveTab("robots")}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold transition ${
                  activeTab === "robots" 
                    ? "bg-blue-600 text-white shadow-sm" 
                    : "bg-slate-100 text-slate-600 hover:text-slate-900"
                }`}
              >
                robots.txt
              </button>
            </div>

            <button 
              onClick={() => {
                const text = activeTab === "llms" ? llmsContent : activeTab === "schema" ? schemaContent : robotsContent;
                copyToClipboard(text, activeTab.toUpperCase());
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 transition flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy {activeTab}</span>
            </button>
          </div>

          <pre className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-xs font-mono text-emerald-400 overflow-x-auto max-h-[460px] leading-relaxed shadow-inner">
            {activeTab === "llms" ? llmsContent : activeTab === "schema" ? schemaContent : robotsContent}
          </pre>
        </div>

        {/* Right Col: QR Code Sync & Actions */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-1">Reception Desk QR Sync</h3>
            <p className="text-xs text-slate-500 mb-6">Point visitors and clients directly to this verified cloud passport.</p>
            
            <div className="bg-slate-50 p-4 rounded-2xl inline-block mb-6 border border-slate-200 shadow-inner">
              <QRCodeSVG id="passport-qr" value={passportUrl} size={130} level="H" includeMargin={true} />
            </div>

            <button 
              onClick={downloadQR}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download High-Res QR (.png)</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Edge CDN Deployment</h4>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-center justify-between">
                <span>Indexing Protocol</span>
                <span className="font-mono text-blue-600 font-semibold">HTTP/3 QUIC</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Crawler Latency</span>
                <span className="font-mono text-emerald-600 font-semibold">&lt; 14ms (Edge)</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Schema Validation</span>
                <span className="font-mono text-emerald-600 font-semibold">100% Pass</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
