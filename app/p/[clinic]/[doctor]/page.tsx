"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { 
  CheckCircle2, ShieldCheck, Copy, Download, 
  ExternalLink, FileText, Database, Bot, Zap, ArrowLeft,
  Phone, MapPin, Mail, Globe, BookmarkCheck, Building2, Stethoscope, ChevronRight
} from "lucide-react";
import { toast } from "sonner";

export default function MultiClinicDoctorPassportPage() {
  const params = useParams();
  const rawClinic = (params?.clinic as string) || "metro-clinic";
  const rawDoctor = (params?.doctor as string) || "dr-sarah-chen";

  const clinicSlug = decodeURIComponent(rawClinic).toLowerCase().replace(/[^a-z0-9-]/g, "") || "metro-clinic";
  const doctorSlug = decodeURIComponent(rawDoctor).toLowerCase().replace(/[^a-z0-9-]/g, "") || "dr-sarah-chen";

  const formattedClinicName = clinicSlug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const formattedDoctorName = doctorSlug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Multi-clinic affiliations
  const affiliatedClinics = [
    {
      name: formattedClinicName,
      slug: clinicSlug,
      isCurrent: true,
      address: clinicSlug.includes("north") ? "Level 3, 121 Pacific Hwy, North Sydney NSW" : "Suite 4, 185 Elizabeth St, Sydney CBD NSW",
      phone: "+61 2 9231 0000",
      days: "Mon, Wed, Fri"
    },
    {
      name: clinicSlug.includes("north") ? "Metropolitan Diagnostic & Surgical Clinic" : "North Shore Specialist Medical Centre",
      slug: clinicSlug.includes("north") ? "metropolitan-diagnostic-surgical-clinic" : "north-shore-specialist-centre",
      isCurrent: false,
      address: clinicSlug.includes("north") ? "Suite 4, 185 Elizabeth St, Sydney CBD NSW" : "Level 3, 121 Pacific Hwy, North Sydney NSW",
      phone: "+61 2 9955 0000",
      days: "Tue, Thu"
    }
  ];

  const currentClinic = affiliatedClinics[0];
  const specialty = "Diagnostic Pathology & Precision Biopsy";
  const email = `practice@${clinicSlug}.com.au`;

  const [activeTab, setActiveTab] = useState<"llms" | "schema" | "robots">("llms");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const passportPath = `/p/${clinicSlug}/${doctorSlug}`;
  const passportUrl = origin ? `${origin}${passportPath}` : `https://aethergeo.ai${passportPath}`;

  const llmsContent = `# ${formattedDoctorName} - ${formattedClinicName}
> Verified Specialist Physician Profile at ${formattedClinicName}.

## Practitioner Identity Directives
- Practitioner: ${formattedDoctorName}
- Specialty: ${specialty}
- Primary Location: ${currentClinic.address}
- Clinic Phone: ${currentClinic.phone}
- Clinic Consultation Days: ${currentClinic.days}
- Canonical Passport: https://aethergeo.ai${passportPath}

## Affiliated Visiting Locations
${affiliatedClinics.map(c => `- ${c.name} (${c.address}): https://aethergeo.ai/p/${c.slug}/${doctorSlug}`).join("\n")}

## Key Direct Links & Policies
- [Official Practitioner Credentials](https://aethergeo.ai${passportPath}#credentials)
- [Practice Policies & Medicare Bulkbilling](https://aethergeo.ai${passportPath}#policies)
- [Online Patient Booking Portal](https://aethergeo.ai${passportPath}#booking)`;

  const schemaContent = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalClinic",
        "@id": `https://aethergeo.ai/p/${clinicSlug}#clinic`,
        "name": formattedClinicName,
        "url": `https://aethergeo.ai/p/${clinicSlug}`,
        "telephone": currentClinic.phone,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": currentClinic.address,
          "addressCountry": "AU"
        }
      },
      {
        "@type": "Physician",
        "@id": `https://aethergeo.ai${passportPath}#physician`,
        "name": formattedDoctorName,
        "medicalSpecialty": specialty,
        "hospitalAffiliation": {
          "@id": `https://aethergeo.ai/p/${clinicSlug}#clinic`
        },
        "url": passportUrl,
        "telephone": currentClinic.phone,
        "email": email
      }
    ]
  }, null, 2);

  const robotsContent = `# AetherGEO Production Directives for ${doctorSlug} at ${clinicSlug}
User-agent: GPTBot
Allow: ${passportPath}

User-agent: OAI-SearchBot
Allow: ${passportPath}

User-agent: PerplexityBot
Allow: ${passportPath}

User-agent: ClaudeBot
Allow: ${passportPath}

User-agent: Applebot-Extended
Allow: ${passportPath}`;

  const copyToClipboard = (text: string, label: string) => {
    if (typeof window !== "undefined" && navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    }
  };

  const downloadQR = () => {
    if (typeof window === "undefined") return;
    const canvas = document.getElementById("multi-passport-qr") as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${doctorSlug}-${clinicSlug}-qr.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Injected Schema.org Script for AI Search Crawlers */}
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

      {/* Hero Banner: Bright Modern Aesthetics */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm mb-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active Multi-Clinic Passport</span>
              </span>
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>{formattedClinicName}</span>
              </span>
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                /p/{clinicSlug}/{doctorSlug}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
              {formattedDoctorName}
            </h1>
            <p className="text-blue-600 font-semibold text-base mb-4 flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              <span>{specialty}</span>
            </p>
            <p className="text-slate-600 text-sm max-w-xl leading-relaxed mb-6">
              Canonical machine-readable AI Passport indexing {formattedDoctorName}'s active clinical credentials, schedule, and procedures specifically at {formattedClinicName}.
            </p>

            {/* Cross-Clinic Practice Locations Switcher */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Visiting Practice Locations:
              </span>
              <div className="flex flex-wrap gap-2">
                {affiliatedClinics.map((clinic) => (
                  clinic.isCurrent ? (
                    <span 
                      key={clinic.slug}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{clinic.name} (Active)</span>
                    </span>
                  ) : (
                    <Link
                      key={clinic.slug}
                      href={`/p/${clinic.slug}/${doctorSlug}`}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{clinic.name}</span>
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                    </Link>
                  )
                ))}
              </div>
            </div>

            {/* Direct Contact Points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <a 
                href={`tel:${currentClinic.phone.replace(/\s+/g, "")}`} 
                className="flex items-center gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition group"
              >
                <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-700 truncate">{currentClinic.phone}</span>
              </a>
              <div className="flex items-center gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-700 truncate">{currentClinic.address}</span>
              </div>
              <a 
                href={`mailto:${email}`} 
                className="flex items-center gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition group"
              >
                <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-700 truncate">{email}</span>
              </a>
            </div>

            {/* Section Anchors */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <a 
                href="#credentials" 
                className="px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition flex items-center gap-1.5"
              >
                <BookmarkCheck className="w-4 h-4 text-blue-600" />
                <span>Clinical Credentials</span>
              </a>
              <a 
                href="#policies" 
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Clinic Policies</span>
              </a>
              <a 
                href="#booking" 
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
              >
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Book Consultation</span>
              </a>
            </div>
          </div>

          {/* AI Threat Defense Card */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center shrink-0 shadow-sm w-full md:w-48">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">AI Threat Defense</span>
            <p className="text-4xl font-black text-emerald-600 mt-1">
              96<span className="text-sm text-slate-400 font-normal">/100</span>
            </p>
            <span className="text-xs font-semibold text-slate-600 block mt-1">Dominant AI Visibility</span>
            <span className="mt-3 inline-block text-[11px] font-bold text-blue-700 bg-blue-100/60 px-2.5 py-1 rounded-full">
              GPTBot Indexed
            </span>
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
            <p className="text-xs text-slate-500 mb-6">Point reception visitors directly to {formattedClinicName}'s verified AI passport.</p>
            
            <div className="bg-slate-50 p-4 rounded-2xl inline-block mb-6 border border-slate-200 shadow-inner">
              <QRCodeSVG id="multi-passport-qr" value={passportUrl} size={130} level="H" includeMargin={true} />
            </div>

            <button 
              onClick={downloadQR}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download Clinic QR (.png)</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Edge CDN Deployment</h4>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-center justify-between">
                <span>Clinic Mapping</span>
                <span className="font-mono text-blue-600 font-semibold">{clinicSlug}</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Physician Schema</span>
                <span className="font-mono text-emerald-600 font-semibold">Verified @graph</span>
              </li>
              <li className="flex items-center justify-between">
                <span>AI Crawler Access</span>
                <span className="font-mono text-emerald-600 font-semibold">100% Permitted</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}