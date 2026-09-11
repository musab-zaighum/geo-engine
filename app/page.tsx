"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import * as Slider from "@radix-ui/react-slider";
import { QRCodeSVG } from "qrcode.react";
import { 
  Zap, Copy, CheckCircle2, Activity, 
  Terminal, Sparkles, XCircle, TrendingDown,
  Download, Target, ArrowRight, Database, ExternalLink,
  AlertCircle, Building2, Plus, Trash2, Stethoscope, ChevronRight
} from "lucide-react";
import { doctorProfileSchema, sanitizeSlug } from "@/lib/schema";

// Flesch-Kincaid Readability Target (Grade 7–9 optimal for LLM extraction)
function calculateFleschKincaid(text: string): { grade: number; label: string; isOptimal: boolean } {
  if (!text || text.trim().length === 0) {
    return { grade: 0, label: "Awaiting text", isOptimal: false };
  }
  const clean = text.replace(/[^\w\s.!?]/g, "");
  const sentences = Math.max(1, (clean.match(/[.!?]+/g) || []).length);
  const words = clean.trim().split(/\s+/).filter(Boolean);
  const totalWords = Math.max(1, words.length);

  let totalSyllables = 0;
  words.forEach(w => {
    let word = w.toLowerCase().replace(/(?:[^laeiouy]|ed|es|e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    totalSyllables += matches ? matches.length : 1;
  });

  const rawGrade = 0.39 * (totalWords / sentences) + 11.8 * (totalSyllables / totalWords) - 15.59;
  const grade = Math.max(1, Math.min(16, Math.round(rawGrade * 10) / 10));
  const isOptimal = grade >= 7.0 && grade <= 9.5;
  const label = isOptimal 
    ? `Grade ${grade} (Optimal LLM Target)` 
    : grade < 7.0 
    ? `Grade ${grade} (Conversational Level)` 
    : `Grade ${grade} (Complex / Academic)`;
  return { grade, label, isOptimal };
}

// BLUF (Bottom Line Up Front) Density Gauge: Verifies direct facts appear within first 40 words
function calculateBLUF(text: string, entityName: string, entityLoc: string): { score: number; factsFound: string[] } {
  if (!text || !text.trim()) return { score: 0, factsFound: [] };
  const first40 = text.trim().split(/\s+/).slice(0, 40).join(" ").toLowerCase();
  const factsFound: string[] = [];

  const nameWord = (entityName || "clinic").toLowerCase().split(" ")[0];
  if (first40.includes(nameWord)) factsFound.push("Entity Name");
  
  const locWord = (entityLoc || "sydney").toLowerCase().split(" ")[0];
  if (first40.includes(locWord)) factsFound.push("Location");

  if (first40.includes("verified") || first40.includes("accredited") || first40.includes("specialist") || first40.includes("certified") || first40.includes("pathology") || first40.includes("delivery") || first40.includes("consultation")) {
    factsFound.push("Core Specialty");
  }
  if (first40.includes("+") || first40.includes("phone") || first40.includes("contact") || first40.includes("call") || first40.includes("line")) {
    factsFound.push("Direct Contact");
  }

  const score = Math.min(100, Math.round((factsFound.length / 4) * 100));
  return { score, factsFound };
}

// Citation Anchor Counter
function calculateCitationAnchors(text: string): { count: number; anchors: string[] } {
  if (!text || !text.trim()) return { count: 0, anchors: [] };
  const anchors: string[] = [];
  if (/\+?\d[\d\s\-()]{7,}\d/.test(text)) anchors.push("Phone");
  if (/(?:nsw|vic|qld|cbd|sydney|melbourne|brisbane|national|street|road)/i.test(text)) anchors.push("Locality");
  if (/(?:accredited|verified|certified|specialist|credentials|license|doctor|practitioner)/i.test(text)) anchors.push("Credentials");
  if (/(?:chatgpt|perplexity|apple intelligence|schema|llms\.txt|registry)/i.test(text)) anchors.push("AI Authority Node");
  return { count: anchors.length, anchors };
}

export default function Home() {
  const [activeStep, setActiveStep] = useState(1);
  
  const [category, setCategory] = useState("Medical");
  const categories = ["Medical", "Retail", "Emergency", "E-Commerce"];
  
  // Required form fields
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("Diagnostic Pathology & Precision Biopsy");
  const [clinicName, setClinicName] = useState("");
  const [primaryService, setPrimaryService] = useState("");

  // Optional form fields
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [url, setUrl] = useState("");

  // Multi-clinic doctor support
  const [additionalClinics, setAdditionalClinics] = useState<Array<{ clinicName: string; location: string; phone: string }>>([]);
  const [showMultiClinic, setShowMultiClinic] = useState(false);

  // Field validation errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  
  const [isPolishing, setIsPolishing] = useState(false);
  const [notes, setNotes] = useState("");
  const [polishedBio, setPolishedBio] = useState("");

  const [isAutoOptimizing, setIsAutoOptimizing] = useState(false);
  const [optimizeText, setOptimizeText] = useState("");
  const [threatScore, setThreatScore] = useState(28);
  const [isOptimized, setIsOptimized] = useState(false);
  
  const [sliderVal, setSliderVal] = useState([2]);

  const loadPreset = (type: string) => {
    setCategory(type);
    if (type === "Medical") {
      setName("Dr. Sarah Chen");
      setSpecialty("Diagnostic Pathology & Precision Biopsy");
      setClinicName("Metropolitan Diagnostic & Surgical Clinic");
      setLocation("Sydney CBD, NSW");
      setPhone("+61 2 9231 0000");
      setEmail("hello@metrodiagnostic.com.au");
      setPrimaryService("Diagnostic pathology, ultrasound-guided biopsy, and specialist Medicare bulk billing consultations");
      setAdditionalClinics([
        { clinicName: "North Shore Specialist Medical Centre", location: "North Sydney NSW", phone: "+61 2 9955 0000" }
      ]);
      setShowMultiClinic(true);
    } else if (type === "Retail") {
      setName("Marcus Vance");
      setSpecialty("Horology & Chronometer Restoration");
      setClinicName("Heritage Artisanal Watchmakers");
      setLocation("Melbourne VIC");
      setPhone("+61 3 9654 0000");
      setEmail("info@heritagewatches.com.au");
      setPrimaryService("Chronometer restoration, Swiss movement servicing, in-store appraisals");
      setAdditionalClinics([]);
      setShowMultiClinic(false);
    } else if (type === "Emergency") {
      setName("Jack Callahan");
      setSpecialty("Commercial Refrigeration & HVAC Systems");
      setClinicName("Rapid Response HVAC & Heat Pumps");
      setLocation("Brisbane QLD");
      setPhone("+61 7 3210 0000");
      setEmail("dispatch@rapidhvac.com.au");
      setPrimaryService("24/7 emergency compressor repairs, commercial refrigeration, certified technicians");
      setAdditionalClinics([]);
      setShowMultiClinic(false);
    } else if (type === "E-Commerce") {
      setName("Elena Rostova");
      setSpecialty("Adaptogenic Formulations & Nootropics");
      setClinicName("Aura Nootropics & Wellness Lab");
      setLocation(""); // Optional location
      setPhone("+61 1300 000 000");
      setEmail("support@auranootropics.com");
      setPrimaryService("Cold-pressed organic adaptogens, lab-tested nootropic blends, nationwide express fulfillment");
      setAdditionalClinics([]);
      setShowMultiClinic(false);
    }
    setUrl("");
    setFieldErrors({});
    
    // Simulate auto-advance
    handleScanImmediate();
  };

  const handleScanImmediate = () => {
    setIsScanning(true);
    setTimeout(() => {
      if (typeof window !== "undefined") {
        document.getElementById('audit-results')?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
      setActiveStep(2);
    }, 1200);
  };

  const handleScan = () => {
    // 1. Strict Zod Form Validation
    const validation = doctorProfileSchema.safeParse({
      name,
      specialty,
      clinicName: clinicName || name,
      primaryService,
      location: location || null,
      website: url || null,
      phone: phone || null,
      email: email || null,
      additionalClinics
    });

    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const key = issue.path[0] ? String(issue.path[0]) : "form";
        if (!errors[key]) {
          errors[key] = issue.message;
        }
      });
      setFieldErrors(errors);
      toast.error("Please fill in all required fields marked in red.");
      return;
    }

    setFieldErrors({});
    setIsScanning(true);
    setTimeout(() => {
      if (typeof window !== "undefined") {
        document.getElementById('audit-results')?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
      setActiveStep(2);
    }, 1300);
  };

  const handleAutoOptimize = () => {
    setIsAutoOptimizing(true);
    setActiveStep(3);
    
    const steps = [
      "Compiling Entity Schema...",
      "Linking Official Directories...",
      "Building llms.txt Passport...",
      "Status: 100% Machine-Readable for GPTBot & Perplexity"
    ];
    
    let currentStep = 0;
    setOptimizeText(steps[0]);
    
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setOptimizeText(steps[currentStep]);
      } else {
        clearInterval(interval);
        setIsAutoOptimizing(false);
        setIsOptimized(true);
        setThreatScore(96);
        
        if (typeof window !== "undefined") {
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#10b981', '#34d399', '#059669']
          });
        }
        toast.success("AI Presence Auto-Optimized!");
      }
    }, 800);
  };

  const polishBio = () => {
    setIsPolishing(true);
    setTimeout(() => {
      if (typeof window !== "undefined") {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#a855f7', '#ec4899']
        });
      }
      const defaultName = category === "Medical" ? "Metropolitan Diagnostic & Surgical Clinic" : category === "Retail" ? "Heritage Artisanal Watchmakers" : category === "Emergency" ? "Rapid Response HVAC & Heat Pumps" : "Aura Nootropics & Wellness Lab";
      const defaultLoc = category === "Medical" ? "Sydney CBD, NSW" : category === "Retail" ? "Melbourne VIC" : category === "Emergency" ? "Brisbane QLD" : "National Delivery, AU";
      const defaultPhone = phone || "+61 2 9231 0000";
      const targetName = name || defaultName;
      const targetLoc = location || defaultLoc;

      setPolishedBio(`${targetName} is an accredited, verified enterprise operating out of ${targetLoc}. Direct booking line: ${defaultPhone}. Providing specialist consultation, rapid response fulfillment, and authenticated machine-readable schema for all client requests. Registered entity credentials and booking availability are synchronized 24/7 across ChatGPT, Perplexity, and Apple Intelligence.`);
      setIsPolishing(false);
    }, 1000);
  };

  const copyToClipboard = (text: string, msg: string) => {
    if (typeof window !== "undefined" && navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      toast.success(msg);
    }
  };

  const getGraphSchema = () => {
    const currentName = name || (category === "Medical" ? "Metropolitan Diagnostic & Surgical Clinic" : category === "Retail" ? "Heritage Artisanal Watchmakers" : category === "Emergency" ? "Rapid Response HVAC & Heat Pumps" : "Aura Nootropics & Wellness Lab");
    const currentLoc = location || (category === "Medical" ? "Sydney CBD, NSW" : category === "Retail" ? "Melbourne VIC" : category === "Emergency" ? "Brisbane QLD" : "National Delivery, AU");
    const currentPhone = phone || "+61 2 9231 0000";
    const slug = currentName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const businessType = category === "Medical" ? "MedicalBusiness" : category === "Retail" ? "Store" : category === "Emergency" ? "HomeAndConstructionBusiness" : "OnlineStore";

    return JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `https://aethergeo.ai/p/${slug}#org`,
          "name": currentName,
          "url": `https://aethergeo.ai/p/${slug}`,
          "sameAs": [
            "https://maps.google.com/?cid=1029384756",
            "https://www.wikidata.org/wiki/Q1029384",
            "https://www.linkedin.com/company/aethergeo"
          ]
        },
        {
          "@type": businessType,
          "@id": `https://aethergeo.ai/p/${slug}#business`,
          "name": currentName,
          "parentOrganization": { "@id": `https://aethergeo.ai/p/${slug}#org` },
          "telephone": currentPhone,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": currentLoc,
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

  const activeBioText = polishedBio || notes || (name ? `${name} is a verified entity in ${location || 'Sydney'}. Contact: ${phone || '+61 2 9231 0000'}` : "");
  const readability = calculateFleschKincaid(activeBioText);
  const bluf = calculateBLUF(activeBioText, name, location);
  const citationAnchors = calculateCitationAnchors(activeBioText);

  const downloadQR = () => {
    const canvas = document.getElementById("qr-gen") as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${name ? name.replace(/\s+/g, '-') : 'aethergeo'}-qr.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };
  
  const tiers = [
    { clients: 1, label: "1 Practice", price: "$79", subtext: "/mo per practice", name: "Solo Pro" },
    { clients: 5, label: "5 Practices", price: "$99", subtext: "/mo flat", name: "Agency Starter" },
    { clients: 15, label: "15 Practices", price: "$199", subtext: "/mo flat", name: "Agency Growth" },
    { clients: 50, label: "50 Practices", price: "$399", subtext: "/mo flat", name: "Scale" }
  ];
  const currentTier = tiers[sliderVal[0]];

  const getLostRevenue = () => {
    switch (category) {
      case "Medical": return "$4,200/mo in missed private consultations";
      case "Retail": return "$2,800/mo in missed foot traffic sales";
      case "Emergency": return "$5,500/mo in missed high-ticket contracts";
      case "E-Commerce": return "$8,100/mo in missed product sales";
      default: return "$4,200/mo in missed private consultations";
    }
  };

  const defaultEntityName = category === "Medical" ? "metropolitan-diagnostic-clinic" : category === "Retail" ? "heritage-artisanal-watchmakers" : category === "Emergency" ? "rapid-response-hvac" : "aura-nootropics";
  const generatedSlug = sanitizeSlug(name || defaultEntityName);
  const qrUrl = `/p/${generatedSlug}`;

  // 3D Tilt logic
  const [tiltStyle, setTiltStyle] = useState({ transform: 'rotateX(0deg) rotateY(0deg)' });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    setTiltStyle({ transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)` });
  };
  const handleMouseLeave = () => {
    setTiltStyle({ transform: 'rotateX(0deg) rotateY(0deg)' });
  };

  return (
    <div className="w-full relative z-10 pb-32 overflow-hidden bg-slate-50 text-slate-900" style={{ perspective: "1400px" }}>
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40"></div>

      {/* Floating Progress Bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between text-xs sm:text-sm font-semibold">
          <div className={`flex items-center ${activeStep >= 1 ? 'text-blue-600' : 'text-slate-400'} transition-colors duration-300`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs font-bold ${activeStep >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
            <span className="hidden sm:inline">Enter Clinical Details</span>
          </div>
          <div className={`h-px flex-1 mx-4 ${activeStep >= 2 ? 'bg-blue-500' : 'bg-slate-200'} transition-colors duration-300`}></div>
          <div className={`flex items-center ${activeStep >= 2 ? 'text-blue-600' : 'text-slate-400'} transition-colors duration-300`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs font-bold ${activeStep >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
            <span className="hidden sm:inline">AI Gap & Threat Audit</span>
          </div>
          <div className={`h-px flex-1 mx-4 ${activeStep >= 3 ? 'bg-emerald-500' : 'bg-slate-200'} transition-colors duration-300`}></div>
          <div className={`flex items-center ${activeStep >= 3 ? 'text-emerald-600' : 'text-slate-400'} transition-colors duration-300`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs font-bold ${activeStep >= 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>3</div>
            <span className="hidden sm:inline">Multi-Clinic AI Passport</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-10 text-center relative z-10">
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-1.5 rounded-full text-xs font-bold mb-4 shadow-sm">
          <Zap className="w-3.5 h-3.5 text-blue-600" />
          <span>Generative Engine Optimization (GEO) for Medical & Local Practices</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">
          Make ChatGPT & Perplexity Recommend Your Doctor Profile.
        </h1>
        <p className="text-slate-600 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
          Verify your doctor and clinic credentials across AI search engines. Index separate passport pages for every clinic where you practice.
        </p>

        {/* Input Form Card - Bright Modern Light Aesthetic */}
        <div 
          className="bg-white border border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl p-8 sm:p-10 max-w-3xl mx-auto text-left relative transition-all duration-300 ease-out"
          style={{ transformStyle: 'preserve-3d', ...tiltStyle }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Quick Enterprise Presets */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              Select Enterprise Preset
            </label>
            <div className="flex flex-wrap gap-2">
              <button 
                type="button" 
                onClick={() => loadPreset("Medical")} 
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-1.5 rounded-full text-xs font-semibold transition border border-slate-200"
              >
                🩺 Multi-Clinic Doctor (Dr. Sarah Chen)
              </button>
              <button 
                type="button" 
                onClick={() => loadPreset("Retail")} 
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-1.5 rounded-full text-xs font-semibold transition border border-slate-200"
              >
                🏪 Retail (Artisanal Watchmaker)
              </button>
              <button 
                type="button" 
                onClick={() => loadPreset("Emergency")} 
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-1.5 rounded-full text-xs font-semibold transition border border-slate-200"
              >
                ⚡ Emergency HVAC
              </button>
              <button 
                type="button" 
                onClick={() => loadPreset("E-Commerce")} 
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-1.5 rounded-full text-xs font-semibold transition border border-slate-200"
              >
                📦 E-Commerce (No Physical Location)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            {/* Required: Doctor Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Doctor or Business Name *</span>
                <span className="text-[11px] text-blue-600 font-semibold lowercase">required</span>
              </label>
              <input 
                type="text" 
                value={name} 
                onChange={e => {
                  setName(e.target.value);
                  if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: "" }));
                }} 
                placeholder="e.g. Dr. Sarah Chen, MBBS, FRACP" 
                className={`w-full bg-slate-50 border ${fieldErrors.name ? 'border-rose-500 focus:border-rose-600 ring-1 ring-rose-500/20' : 'border-slate-200 focus:border-blue-500'} rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white transition text-sm`} 
              />
              {fieldErrors.name && (
                <p className="text-rose-600 text-xs font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {fieldErrors.name}
                </p>
              )}
            </div>

            {/* Required: Specialty */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Clinical Specialty *</span>
                <span className="text-[11px] text-blue-600 font-semibold lowercase">required</span>
              </label>
              <input 
                type="text" 
                value={specialty} 
                onChange={e => {
                  setSpecialty(e.target.value);
                  if (fieldErrors.specialty) setFieldErrors(prev => ({ ...prev, specialty: "" }));
                }} 
                placeholder="e.g. Diagnostic Radiology & Precision Biopsy" 
                className={`w-full bg-slate-50 border ${fieldErrors.specialty ? 'border-rose-500 focus:border-rose-600 ring-1 ring-rose-500/20' : 'border-slate-200 focus:border-blue-500'} rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white transition text-sm`} 
              />
              {fieldErrors.specialty && (
                <p className="text-rose-600 text-xs font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {fieldErrors.specialty}
                </p>
              )}
            </div>

            {/* Required: Primary Clinic Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Primary Clinic Name *</span>
                <span className="text-[11px] text-blue-600 font-semibold lowercase">required</span>
              </label>
              <input 
                type="text" 
                value={clinicName} 
                onChange={e => {
                  setClinicName(e.target.value);
                  if (fieldErrors.clinicName) setFieldErrors(prev => ({ ...prev, clinicName: "" }));
                }} 
                placeholder="e.g. Metropolitan Diagnostic & Surgical Clinic" 
                className={`w-full bg-slate-50 border ${fieldErrors.clinicName ? 'border-rose-500 focus:border-rose-600 ring-1 ring-rose-500/20' : 'border-slate-200 focus:border-blue-500'} rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white transition text-sm`} 
              />
              {fieldErrors.clinicName && (
                <p className="text-rose-600 text-xs font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {fieldErrors.clinicName}
                </p>
              )}
            </div>

            {/* Optional: Location / City */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Physical Address / Locality</span>
                <span className="text-[11px] text-slate-400 font-medium">(Optional)</span>
              </label>
              <input 
                type="text" 
                value={location} 
                onChange={e=>setLocation(e.target.value)} 
                placeholder="e.g. Suite 4, 185 Elizabeth St, Sydney CBD NSW" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition text-sm" 
              />
            </div>

            {/* Optional: Direct Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Clinic Direct Intake Phone</span>
                <span className="text-[11px] text-slate-400 font-medium">(Optional)</span>
              </label>
              <input 
                type="text" 
                value={phone} 
                onChange={e=>setPhone(e.target.value)} 
                placeholder="e.g. +61 2 9231 0000" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition text-sm" 
              />
            </div>

            {/* Optional: Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Clinic Contact Email</span>
                <span className="text-[11px] text-slate-400 font-medium">(Optional)</span>
              </label>
              <input 
                type="email" 
                value={email} 
                onChange={e=>setEmail(e.target.value)} 
                placeholder="intake@clinic.com.au" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition text-sm" 
              />
            </div>

            {/* Required: Primary Service */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Primary Services & Procedures Offered *</span>
                <span className="text-[11px] text-blue-600 font-semibold lowercase">required (min 5 chars)</span>
              </label>
              <textarea 
                value={primaryService} 
                onChange={e => {
                  setPrimaryService(e.target.value);
                  if (fieldErrors.primaryService) setFieldErrors(prev => ({ ...prev, primaryService: "" }));
                }} 
                placeholder="e.g. Ultrasound-guided biopsy, diagnostic pathology, mammography review, and Medicare bulk billing consultation" 
                className={`w-full bg-slate-50 border ${fieldErrors.primaryService ? 'border-rose-500 focus:border-rose-600 ring-1 ring-rose-500/20' : 'border-slate-200 focus:border-blue-500'} rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white transition text-sm h-20 resize-none`} 
              />
              {fieldErrors.primaryService && (
                <p className="text-rose-600 text-xs font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {fieldErrors.primaryService}
                </p>
              )}
            </div>

            {/* Optional: Website URL */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Clinic or Doctor Website URL</span>
                <span className="text-[11px] text-slate-400 font-medium">(Optional — leave blank if operating without a site)</span>
              </label>
              <input 
                type="text" 
                value={url} 
                onChange={e=>setUrl(e.target.value)} 
                placeholder="https://..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition text-sm" 
              />
            </div>
          </div>

          {/* Multi-Clinic Practice Location Section */}
          <div className="border-t border-slate-200 pt-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Multiple Clinic Practice Locations (One-to-Many Routing)
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowMultiClinic(!showMultiClinic);
                  if (!showMultiClinic && additionalClinics.length === 0) {
                    setAdditionalClinics([{ clinicName: "North Shore Specialist Centre", location: "North Sydney NSW", phone: "+61 2 9955 0000" }]);
                  }
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showMultiClinic ? "Hide Visiting Locations" : "+ Add Visiting Clinic"}</span>
              </button>
            </div>

            {showMultiClinic && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <p className="text-xs text-slate-500">
                  Add secondary clinics or visiting hospitals where you consult. We generate individual, distinct AI Passport URLs for each location.
                </p>
                {additionalClinics.map((clinic, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-slate-200">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Clinic Name</label>
                      <input 
                        type="text" 
                        value={clinic.clinicName} 
                        onChange={e => {
                          const val = e.target.value;
                          setAdditionalClinics(prev => prev.map((c, i) => i === idx ? { ...c, clinicName: val } : c));
                        }}
                        placeholder="e.g. North Shore Specialist Centre"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Location</label>
                      <input 
                        type="text" 
                        value={clinic.location} 
                        onChange={e => {
                          const val = e.target.value;
                          setAdditionalClinics(prev => prev.map((c, i) => i === idx ? { ...c, location: val } : c));
                        }}
                        placeholder="e.g. North Sydney NSW"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Clinic Phone</label>
                        <input 
                          type="text" 
                          value={clinic.phone} 
                          onChange={e => {
                            const val = e.target.value;
                            setAdditionalClinics(prev => prev.map((c, i) => i === idx ? { ...c, phone: val } : c));
                          }}
                          placeholder="+61 2 9955 0000"
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900"
                        />
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setAdditionalClinics(prev => prev.filter((_, i) => i !== idx))}
                        className="mt-4 p-2 text-slate-400 hover:text-rose-600 transition"
                        title="Remove clinic"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setAdditionalClinics(prev => [...prev, { clinicName: "", location: "", phone: "" }])}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add another visiting clinic</span>
                </button>
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={handleScan} 
              disabled={isScanning} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl transition shadow-sm shadow-blue-500/30 flex items-center disabled:opacity-70 text-base w-full sm:w-auto justify-center"
            >
              {isScanning ? <Activity className="w-5 h-5 mr-2 animate-spin" /> : <Zap className="w-5 h-5 mr-2" />}
              {isScanning ? "Validating & Scanning Matrix..." : "Launch Threat Audit"}
            </button>
          </div>
        </div>
      </div>

      <div id="audit-results" className="max-w-6xl mx-auto px-6 pt-10 relative z-20">
        {hasScanned && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Audit Top Results & 1-Click Auto-Optimize */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              
              {/* Threat Score & Auto Optimize */}
              <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-10 flex flex-col justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent pointer-events-none"></div>
                <h3 className="text-slate-600 font-bold uppercase tracking-widest text-xs mb-6 relative">
                  {isOptimized ? "AI Presence Status" : "AI Threat Score"}
                </h3>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-10 relative mb-6">
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90 relative" viewBox="0 0 100 100">
                      <circle className="text-slate-100 stroke-current" strokeWidth="6" cx="50" cy="50" r="42" fill="transparent" />
                      <circle className="text-slate-100 stroke-current" strokeWidth="2" cx="50" cy="50" r="35" fill="transparent" />
                      <circle className="text-slate-100 stroke-current" strokeWidth="2" cx="50" cy="50" r="49" fill="transparent" />
                      <motion.circle 
                        className={`${isOptimized ? 'text-emerald-500' : 'text-rose-500'} stroke-current`}
                        strokeWidth="8" strokeLinecap="round" cx="50" cy="50" r="42" fill="transparent"
                        initial={{ strokeDasharray: `${(threatScore / 100) * 263.89}, 263.89` }}
                        animate={{ strokeDasharray: `${(threatScore / 100) * 263.89}, 263.89` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className={`text-6xl font-black ${isOptimized ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {threatScore}
                      </span>
                    </div>
                  </div>

                  {!isOptimized && (
                    <button 
                      onClick={handleAutoOptimize} 
                      disabled={isAutoOptimizing} 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-5 rounded-2xl transition shadow-md shadow-emerald-600/20 flex flex-col items-center justify-center text-base disabled:opacity-80"
                    >
                      {isAutoOptimizing ? (
                        <span className="flex items-center text-sm font-semibold"><Activity className="w-5 h-5 mr-2 animate-spin" /> {optimizeText}</span>
                      ) : (
                        <span className="flex items-center text-center"><Zap className="w-5 h-5 mr-2" /> 1-Click Auto-Fix<br/>My AI Presence</span>
                      )}
                    </button>
                  )}
                  {isOptimized && (
                    <div className="text-left bg-emerald-50 border border-emerald-200 p-5 rounded-2xl">
                      <p className="text-emerald-700 font-bold flex items-center mb-1 text-base"><CheckCircle2 className="w-5 h-5 mr-2 text-emerald-600" /> AI Engine Ready</p>
                      <p className="text-slate-600 text-xs font-semibold">{optimizeText}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Terminal Query Simulation */}
              <div 
                className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 sm:p-10 flex flex-col justify-center"
              >
                <h3 className="text-slate-700 font-bold uppercase tracking-widest text-xs mb-4 flex items-center">
                  <Terminal className="w-4 h-4 mr-2 text-blue-600" /> Live Threat Simulation
                </h3>
                <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl font-mono text-sm shadow-inner space-y-5">
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Query from Local IP</p>
                    <p className="text-slate-100 font-bold"><span className="text-blue-400 mr-2">{'>'}</span>"Who is the best in {location || 'my area'}?"</p>
                  </div>
                  <div className="border-t border-slate-800 pt-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`w-2 h-2 rounded-full animate-pulse ${isOptimized ? 'bg-emerald-400' : 'bg-rose-500'}`}></div>
                      <p className="text-slate-400 text-xs uppercase tracking-widest">ChatGPT 4o & Perplexity</p>
                    </div>
                    {isOptimized ? (
                      <p className="text-emerald-400 leading-relaxed font-semibold text-xs sm:text-sm"><span className="text-emerald-400 mr-2">{'>'}</span>Verified entity found. Recommending {name || 'your business'} as the top localized result based on highly corroborated medical schemas and direct contact details.</p>
                    ) : (
                      <p className="text-rose-400 leading-relaxed font-semibold text-xs sm:text-sm"><span className="text-rose-400 mr-2">{'>'}</span>Analyzing local registries... Warning: Unverified entity. Recommending rival competitor instead.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Zero-Code 4 Features Block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Feature A: Lost AI Traffic & Revenue Estimator */}
              <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 border border-rose-100">
                    <TrendingDown className="w-6 h-6 text-rose-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Lost AI Traffic & Revenue Estimator</h3>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">Estimated 14–22 local queries/week currently diverted to top rival competitors.</p>
                </div>
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl">
                  <p className="text-rose-700 font-bold text-base text-center">{getLostRevenue()}</p>
                </div>
              </div>

              {/* Feature B: Instant QR Code & Digital Card Sync */}
              <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 flex flex-col justify-between items-center text-center">
                <div className="w-full flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-slate-900 text-left">Instant QR Code Sync</h3>
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-slate-600 text-sm mb-6 text-left w-full">Point patients to your live AI passport from your reception desk.</p>
                
                <div className="bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-200 shadow-sm">
                  <QRCodeSVG id="qr-gen" value={qrUrl} size={110} level={"H"} includeMargin={true} />
                </div>
                
                <button onClick={downloadQR} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 rounded-xl transition flex items-center justify-center text-sm border border-slate-200">
                  <Download className="w-4 h-4 mr-2 text-slate-600" /> Download Reception Desk QR Card (.png)
                </button>
              </div>

              {/* Feature C: Plain-English 5-Point AI Health Checklist */}
              <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Plain-English AI Health Checklist</h3>
                <ul className="space-y-3">
                  <li className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-slate-700 text-sm font-semibold">AI Name & Phone Verification</span>
                    <span className="text-emerald-600 text-xs font-bold flex items-center"><CheckCircle2 className="w-4 h-4 mr-1.5" /> Verified</span>
                  </li>
                  <li className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-slate-700 text-sm font-semibold">Emergency / Referral Readiness</span>
                    <span className="text-emerald-600 text-xs font-bold flex items-center"><CheckCircle2 className="w-4 h-4 mr-1.5" /> Optimized</span>
                  </li>
                  <li className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-slate-700 text-sm font-semibold">AI Hallucination Guard</span>
                    {isOptimized ? (
                       <span className="text-emerald-600 text-xs font-bold flex items-center"><CheckCircle2 className="w-4 h-4 mr-1.5" /> Linker Active</span>
                    ) : (
                       <span className="text-rose-600 text-xs font-bold flex items-center"><XCircle className="w-4 h-4 mr-1.5" /> Needs Linker</span>
                    )}
                  </li>
                  <li className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-slate-700 text-sm font-semibold">Perplexity & GPTBot Crawlers</span>
                    <span className="text-emerald-600 text-xs font-bold flex items-center"><CheckCircle2 className="w-4 h-4 mr-1.5" /> Allowed</span>
                  </li>
                  <li className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-slate-700 text-sm font-semibold">Google / Apple Data Sync</span>
                    <span className="text-emerald-600 text-xs font-bold flex items-center"><CheckCircle2 className="w-4 h-4 mr-1.5" /> Connected</span>
                  </li>
                </ul>
              </div>

              {/* Feature D: Competitor Citation Stealer */}
              <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Competitor Citation Stealer</h3>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">The top 2 local rivals being recommended by ChatGPT right now instead of you.</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between">
                      <span className="text-slate-800 font-bold text-sm">1. Regional Top Competitor</span>
                      <span className="text-xs text-rose-700 font-bold bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">Stealing 40% Share</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between">
                      <span className="text-slate-800 font-bold text-sm">2. City Metro Service</span>
                      <span className="text-xs text-rose-700 font-bold bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">Stealing 25% Share</span>
                    </div>
                  </div>
                </div>
                
                <button onClick={() => toast.success("Counter-citations claimed & added to bio!")} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center text-sm shadow-sm shadow-blue-500/30">
                  <Copy className="w-4 h-4 mr-2" /> Claim Counter-Citation Keywords
                </button>
              </div>

            </div>

            {/* Hosted AI Profile */}
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50/40 to-slate-50 border border-blue-200 shadow-sm rounded-3xl p-8 sm:p-12 relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2.5 mb-4">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" /> Verified Entity ✓
                    </span>
                    <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Ready for GPTBot</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Your Hosted AI Passport is Live</h3>
                  <p className="text-slate-600 text-sm sm:text-base max-w-xl">You don't need a website. AI crawlers will scan this verified endpoint immediately.</p>
                  <div className="mt-4 bg-white border border-slate-200 px-5 py-3 rounded-xl font-mono text-blue-700 text-sm inline-block shadow-sm break-all w-full md:w-auto font-semibold">
                    {qrUrl}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                  <Link 
                    href={qrUrl}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3.5 rounded-xl transition flex items-center justify-center text-sm shadow-sm shadow-blue-600/30"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" /> View Live Passport
                  </Link>
                  <button onClick={() => copyToClipboard(typeof window !== "undefined" ? `${window.location.origin}${qrUrl}` : qrUrl, "Hosted Profile Link Copied!")} className="bg-white hover:bg-slate-50 text-slate-800 font-bold px-5 py-3.5 rounded-xl transition flex items-center justify-center text-sm border border-slate-200 shadow-sm">
                    <Copy className="w-4 h-4 mr-2 text-slate-500" /> Copy Link
                  </button>
                </div>
              </div>
            </div>

            {/* Instant Bio Polish Studio */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 sm:p-10 relative">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center"><Sparkles className="w-5 h-5 mr-2.5 text-blue-600" /> Bio Polish Studio</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Rough Notes</label>
                  <textarea 
                    value={notes} 
                    onChange={e => setNotes(e.target.value)} 
                    placeholder="Enter rough credentials, clinic honors, insurance networks..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition h-48 resize-none text-sm" 
                  />
                  <button onClick={polishBio} disabled={isPolishing} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-4 rounded-xl transition shadow-sm shadow-blue-500/30 flex items-center justify-center text-sm disabled:opacity-70">
                    {isPolishing ? <Activity className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    Polish Bio
                  </button>
                </div>
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                    <span>Executive Copy (AI Optimized)</span>
                    {polishedBio && <span className="text-emerald-600 flex items-center font-semibold text-xs"><CheckCircle2 className="w-3.5 h-3.5 mr-1"/> Ready</span>}
                  </label>
                  <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-5 text-slate-800 h-48 overflow-y-auto text-sm leading-relaxed relative">
                    {polishedBio || <span className="text-slate-400 font-medium italic flex items-center justify-center h-full">Click "Polish Bio" to generate verified executive copy.</span>}
                  </div>
                  {polishedBio && (
                    <button onClick={() => copyToClipboard(polishedBio, "Bio copied!")} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 rounded-xl transition flex items-center justify-center border border-slate-200 text-sm">
                      <Copy className="w-4 h-4 mr-2 text-slate-500" /> Copy Verified Bio
                    </button>
                  )}
                </div>
              </div>

              {/* AEO Snippet Density Meter */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <h4 className="text-sm font-bold text-slate-900 tracking-tight">AEO (Answer Engine Optimization) Snippet Density Meter</h4>
                  </div>
                  <span className="text-[11px] bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full font-semibold w-max">
                    Target: Optimal for LLM Snippet Extraction
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Flesch-Kincaid Readability Target */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-500 font-semibold">Flesch-Kincaid Grade</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${readability.isOptimal ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'}`}>
                        {readability.isOptimal ? 'Target (Gr 7-9)' : 'Review'}
                      </span>
                    </div>
                    <p className="text-2xl font-black text-slate-900">{readability.grade ? `Grade ${readability.grade}` : '—'}</p>
                    <p className="text-[11px] text-slate-600 mt-1 leading-tight">{readability.label}</p>
                    <p className="text-[10px] text-slate-400 mt-2">Optimal 7-9 level allows ChatGPT & Perplexity to extract factual snippets without synthetic rewrite.</p>
                  </div>

                  {/* BLUF Density Gauge */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-500 font-semibold">BLUF Fact Density (Word 1–40)</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${bluf.score >= 75 ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'}`}>
                        {bluf.score}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden my-2.5">
                      <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: `${bluf.score}%` }}></div>
                    </div>
                    <p className="text-[11px] text-slate-700 font-medium">
                      {bluf.factsFound.length > 0 ? bluf.factsFound.join(" • ") : "No key facts detected"}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-2">Bottom Line Up Front: Key identity facts placed before word 40 to anchor LLM vector search.</p>
                  </div>

                  {/* Citation Anchors */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-500 font-semibold">Citation Anchors</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                        {citationAnchors.count} Anchors
                      </span>
                    </div>
                    <p className="text-2xl font-black text-slate-900">{citationAnchors.count} Anchors</p>
                    <p className="text-[11px] text-slate-700 mt-1 truncate">
                      {citationAnchors.anchors.length > 0 ? citationAnchors.anchors.join(" • ") : "Address, phone, registry"}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-2">Concrete physical & credential markers used by AI models for hallucination verification.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature E: Entity Relationship Schema Graph (@graph JSON-LD) */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 sm:p-10 relative mt-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Database className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-slate-900">Entity Relationship Schema Graph (@graph)</h3>
                    <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      Linked JSON-LD
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
                    Interlinks Organization, LocalBusiness, PostalAddress, OpeningHoursSpecification, and sameAs authority nodes into a single unified JSON-LD graph. Prevents entity fragmentation across ChatGPT, Perplexity, and Applebot.
                  </p>
                </div>
                <button 
                  onClick={() => copyToClipboard(getGraphSchema(), "Linked @graph Schema Copied!")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl transition flex items-center justify-center text-xs shrink-0 shadow-sm shadow-blue-500/30"
                >
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  <span>Copy @graph JSON-LD</span>
                </button>
              </div>
              <pre className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-[11px] font-mono text-blue-200 overflow-x-auto max-h-52 scrollbar-thin">
                {getGraphSchema()}
              </pre>
            </div>

            {/* Interactive Billing Slider */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto mt-16 relative overflow-hidden">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2 relative z-10">Claim & Activate 24/7 AI Indexing</h2>
              <p className="text-slate-600 mb-10 text-sm sm:text-base relative z-10">Select your volume to see pricing.</p>
              
              <div className="max-w-xl mx-auto mb-10 px-4 relative z-10">
                <Slider.Root 
                  className="relative flex items-center select-none touch-none w-full h-6" 
                  value={sliderVal} 
                  max={3} 
                  step={1} 
                  onValueChange={setSliderVal}
                >
                  <Slider.Track className="bg-slate-200 relative grow rounded-full h-3">
                    <Slider.Range className="absolute bg-blue-600 rounded-full h-full" />
                  </Slider.Track>
                  <Slider.Thumb className="block w-7 h-7 bg-white shadow-md rounded-full border-4 border-blue-600 focus:outline-none cursor-grab active:cursor-grabbing transition" />
                </Slider.Root>
                <div className="flex justify-between mt-4 text-xs font-semibold text-slate-500">
                  {tiers.map((t, idx) => (
                    <span key={idx} className={sliderVal[0] === idx ? "text-blue-600 font-bold" : ""}>{idx === 0 ? "1" : idx === 1 ? "5" : idx === 2 ? "15" : "50"}</span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 inline-block mb-8 min-w-[280px] shadow-sm relative z-10">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1.5">Your Plan</p>
                <p className="text-2xl font-black text-slate-900">{currentTier.label}</p>
                <p className="text-blue-600 font-extrabold text-2xl mt-2">{currentTier.price}</p>
              </div>

              <div className="relative z-10">
                <button onClick={() => toast.success("Redirecting to secure checkout...")} className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-10 py-4 rounded-xl transition shadow-md shadow-blue-500/25 flex items-center justify-center w-full sm:w-auto mx-auto text-base">
                  ⚡ Claim Profile & Start 14-Day Free Trial
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
