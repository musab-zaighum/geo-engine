'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  UserCheck,
  Globe,
  GlobeX,
  Sparkles,
  Plus,
  Trash2,
  Copy,
  Check,
  Download,
  FileCode,
  FileText,
  Stethoscope,
  ArrowRight,
  Info,
  RefreshCw,
  Eye,
  Code,
} from 'lucide-react';
import {
  GenerateRequest,
  GenerateResponse,
  PracticeType,
  DoctorProfile,
} from '@/lib/types';

interface GeneratorSectionProps {
  initialUrl?: string;
}

export function GeneratorSection({ initialUrl }: GeneratorSectionProps) {
  const [practiceType, setPracticeType] = useState<PracticeType>('clinic');
  const [hasWebsite, setHasWebsite] = useState(true);
  const [entityName, setEntityName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState(initialUrl || '');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('Australia');
  const [phone, setPhone] = useState('');

  const [services, setServices] = useState<string[]>([
    'Rhinoplasty',
    'Facelift & Neck Lift',
    'Breast Augmentation',
  ]);
  const [newService, setNewService] = useState('');

  const [doctors, setDoctors] = useState<DoctorProfile[]>([
    {
      name: 'Dr. Alexander Vance',
      title: 'FRACS Plastic Surgeon',
      registrationNumber: 'MED0001987654',
      specialties: ['Rhinoplasty', 'Facelift & Neck Lift'],
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);

  const [activeOutputTab, setActiveOutputTab] = useState<'schema' | 'llmstxt' | 'profile'>('schema');
  const [profileViewMode, setProfileViewMode] = useState<'rendered' | 'raw'>('rendered');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (initialUrl && !websiteUrl) {
      setWebsiteUrl(initialUrl);
    }
  }, [initialUrl]);

  const handleAutoFillDemo = (mode: PracticeType = practiceType) => {
    setError(null);
    if (mode === 'clinic') {
      setPracticeType('clinic');
      setHasWebsite(true);
      setEntityName('Sydney Cosmetic & Plastic Surgery Centre');
      setWebsiteUrl('https://sydneycosmeticsurgery.com.au');
      setStreetAddress('Level 7, 135 Macquarie Street');
      setCity('Sydney');
      setState('NSW');
      setPostalCode('2000');
      setCountry('Australia');
      setPhone('+61 2 9252 0000');
      setServices([
        'Rhinoplasty (Nose Reshaping)',
        'Deep Plane Facelift',
        'Breast Reconstruction & Augmentation',
        'Blepharoplasty (Eyelid Surgery)',
        'Liposuction & Body Contouring',
      ]);
      setDoctors([
        {
          name: 'Dr. William Townley',
          title: 'FRACS Specialist Plastic Surgeon',
          registrationNumber: 'AHPRA-MED0001882910',
          specialties: ['Rhinoplasty', 'Deep Plane Facelift'],
        },
        {
          name: 'Dr. Sarah Jenkins',
          title: 'MD Specialist Plastic & Reconstructive Surgeon',
          registrationNumber: 'AHPRA-MED0002104938',
          specialties: ['Breast Reconstruction', 'Body Contouring'],
        },
      ]);
    } else {
      setPracticeType('solo_practitioner');
      setHasWebsite(false);
      setEntityName('Dr. Marcus Vance, MD');
      setWebsiteUrl('https://maps.google.com/?cid=1029384756102');
      setStreetAddress('Suite 402, St Vincent Specialist Medical Centre, 438 Victoria St');
      setCity('Darlinghurst');
      setState('NSW');
      setPostalCode('2010');
      setCountry('Australia');
      setPhone('+61 2 8382 1111');
      setServices([
        'Total Knee Arthroplasty',
        'Anterior Hip Replacement',
        'Arthroscopic Shoulder Stabilization',
        'Sports Injury Rehabilitation Evaluation',
      ]);
      setDoctors([
        {
          name: 'Dr. Marcus Vance',
          title: 'MD FRACS Orthopedic Specialist',
          registrationNumber: 'AHPRA-MED0000994821',
          specialties: [
            'Total Knee Arthroplasty',
            'Anterior Hip Replacement',
            'Arthroscopic Shoulder Surgery',
          ],
        },
      ]);
    }
  };

  const handleAddService = () => {
    if (newService.trim()) {
      setServices([...services, newService.trim()]);
      setNewService('');
    }
  };

  const handleRemoveService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleAddDoctor = () => {
    setDoctors([
      ...doctors,
      {
        name: '',
        title: 'Specialist Medical Practitioner',
        registrationNumber: '',
        specialties: [],
      },
    ]);
  };

  const handleRemoveDoctor = (index: number) => {
    if (doctors.length > 1) {
      setDoctors(doctors.filter((_, i) => i !== index));
    }
  };

  const handleDoctorChange = (index: number, field: keyof DoctorProfile, value: any) => {
    const updated = [...doctors];
    updated[index] = { ...updated[index], [field]: value };
    setDoctors(updated);
  };

  const handleGenerate = async () => {
    if (!entityName.trim()) {
      setError('Please provide an Entity or Practitioner Name.');
      return;
    }
    if (!phone.trim()) {
      setError('Please provide a contact phone number.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload: GenerateRequest = {
      practiceType,
      entityName,
      hasWebsite,
      websiteOrProfileUrl: websiteUrl,
      streetAddress,
      city,
      state,
      postalCode,
      country,
      phone,
      services,
      doctors: practiceType === 'solo_practitioner' ? [doctors[0]] : doctors,
    };

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate GEO artifacts.');
      }

      setResult(data);
      setActiveOutputTab('schema');
    } catch (err: any) {
      setError(err?.message || 'Failed to generate medical GEO artifacts.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadFile = (filename: string, content: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              GEO Infrastructure Generator
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Synthesize Medical AI Index Files
            </h2>
            <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
              Generate Schema.org <code className="text-teal-700 bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">@graph</code> JSON-LD, <code className="text-teal-700 bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">/llms.txt</code> files, and Raw Markdown Profiles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleAutoFillDemo('clinic')}
              className="px-4 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all"
            >
              <Building2 className="w-4 h-4 text-teal-600" />
              1-Click Demo (Clinic)
            </button>
            <button
              type="button"
              onClick={() => handleAutoFillDemo('solo_practitioner')}
              className="px-4 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all"
            >
              <UserCheck className="w-4 h-4 text-sky-600" />
              1-Click Demo (Solo Dr)
            </button>
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              1. Practice Mode
            </label>
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 border border-slate-200 rounded-2xl">
              <button
                type="button"
                onClick={() => setPracticeType('clinic')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  practiceType === 'clinic'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4" /> Specialist Clinic
              </button>
              <button
                type="button"
                onClick={() => setPracticeType('solo_practitioner')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  practiceType === 'solo_practitioner'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-4 h-4" /> Solo Practitioner
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              2. Website Status
            </label>
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 border border-slate-200 rounded-2xl">
              <button
                type="button"
                onClick={() => setHasWebsite(true)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  hasWebsite
                    ? 'bg-white text-teal-700 border border-slate-300 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Globe className="w-4 h-4 text-teal-600" /> Has Website
              </button>
              <button
                type="button"
                onClick={() => setHasWebsite(false)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  !hasWebsite
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GlobeX className="w-4 h-4" /> No Website / GBP Only
              </button>
            </div>
          </div>
        </div>

        {!hasWebsite && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>No-Website Fallback Mode Active:</strong> For practice listings without a custom domain, CiteMed generates a standalone <strong>Raw Markdown Profile</strong> to anchor your Google Business Profile into Perplexity and ChatGPT Search.
            </span>
          </div>
        )}
      </div>

      {/* Generator Form */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-teal-600" />
          Practice Identity & Canonical Address
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              {practiceType === 'clinic' ? 'Clinic / Practice Name *' : 'Doctor Full Name *'}
            </label>
            <input
              type="text"
              value={entityName}
              onChange={(e) => setEntityName(e.target.value)}
              placeholder={practiceType === 'clinic' ? 'e.g. Sydney Plastic Surgery Centre' : 'e.g. Dr. Marcus Vance, MD'}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              {hasWebsite ? 'Website Domain' : 'Google Maps / Healthshare Link (Optional)'}
            </label>
            <input
              type="text"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder={hasWebsite ? 'e.g. https://sydneycosmeticsurgery.com.au' : 'e.g. https://maps.google.com/?cid=123'}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Street Address</label>
            <input
              type="text"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              placeholder="Level 7, 135 Macquarie Street"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Sydney"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-teal-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="NSW"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-teal-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Postal Code</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="2000"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Australia"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Phone Number *</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+61 2 9252 0000"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Doctor Profiles Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-teal-600" />
                Medical Practitioners & Ahpra/NPI License IDs
              </h3>
              <p className="text-xs text-slate-500">
                Medical licensing numbers establish high E-E-A-T trust signals required by LLMs.
              </p>
            </div>
            {practiceType === 'clinic' && (
              <button
                type="button"
                onClick={handleAddDoctor}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-teal-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Doctor
              </button>
            )}
          </div>

          <div className="space-y-3">
            {doctors.map((doc, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-700 uppercase">Practitioner #{idx + 1}</span>
                  {practiceType === 'clinic' && doctors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDoctor(idx)}
                      className="text-rose-600 hover:text-rose-700 text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={doc.name}
                    onChange={(e) => handleDoctorChange(idx, 'name', e.target.value)}
                    placeholder="Doctor Name (e.g. Dr. Jane Doe)"
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs"
                  />
                  <input
                    type="text"
                    value={doc.title}
                    onChange={(e) => handleDoctorChange(idx, 'title', e.target.value)}
                    placeholder="Title (e.g. FRACS Plastic Surgeon)"
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs"
                  />
                  <input
                    type="text"
                    value={doc.registrationNumber}
                    onChange={(e) => handleDoctorChange(idx, 'registrationNumber', e.target.value)}
                    placeholder="Ahpra / NPI License ID"
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-mono"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Services */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-teal-600" /> Core Medical Procedures & Treatments Catalog
          </h3>

          <div className="flex gap-2">
            <input
              type="text"
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddService();
                }
              }}
              placeholder="e.g. Deep Plane Facelift or Total Knee Arthroplasty"
              className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-teal-500"
            />
            <button
              type="button"
              onClick={handleAddService}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-teal-700 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {services.map((s, idx) => (
              <span key={idx} className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-700 flex items-center gap-2">
                {s}
                <button type="button" onClick={() => handleRemoveService(idx)} className="text-slate-400 hover:text-rose-600">
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white font-bold text-base rounded-2xl shadow-lg shadow-teal-500/20 disabled:opacity-50 flex items-center justify-center gap-3 transition-all"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" /> Synthesizing Medical Schemas & AI Profiles...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" /> Generate Production GEO Artifacts
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

      {/* Output Results */}
      {result && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-600" /> Generated Healthcare GEO Artifacts
              </h3>
              <p className="text-xs text-slate-500">Download or copy these structured files for immediate deployment.</p>
            </div>

            <button
              type="button"
              onClick={() =>
                downloadFile(
                  `${entityName.toLowerCase().replace(/\s+/g, '-')}-citemed-bundle.md`,
                  `# CITEMED GEO BUNDLE FOR ${entityName}\n\n## 1. JSON-LD SCHEMA\n\`\`\`json\n${result.schemaJsonLd}\n\`\`\`\n\n## 2. LLMS.TXT\n${result.llmsTxt}\n\n## 3. RAW MARKDOWN PROFILE\n${result.rawMarkdownProfile}`,
                  'text/markdown'
                )
              }
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4 text-teal-600" /> Download Bundle (.md)
            </button>
          </div>

          {/* Output Tabs */}
          <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveOutputTab('schema')}
              className={`py-3 px-4 font-bold text-xs rounded-t-xl border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
                activeOutputTab === 'schema'
                  ? 'border-teal-600 text-teal-700 bg-teal-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileCode className="w-4 h-4" /> 1. JSON-LD Schema (.json)
            </button>
            <button
              type="button"
              onClick={() => setActiveOutputTab('llmstxt')}
              className={`py-3 px-4 font-bold text-xs rounded-t-xl border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
                activeOutputTab === 'llmstxt'
                  ? 'border-teal-600 text-teal-700 bg-teal-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" /> 2. /llms.txt File
            </button>
            <button
              type="button"
              onClick={() => setActiveOutputTab('profile')}
              className={`py-3 px-4 font-bold text-xs rounded-t-xl border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
                activeOutputTab === 'profile'
                  ? 'border-teal-600 text-teal-700 bg-teal-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-4 h-4" /> 3. Raw Markdown Profile (.md)
            </button>
          </div>

          {/* Output Tab 1: JSON-LD */}
          {activeOutputTab === 'schema' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Embed inside website's <code className="text-teal-700">&lt;head&gt;</code> HTML script tag.</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(result.schemaJsonLd, 'schema')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold flex items-center gap-1"
                  >
                    {copiedKey === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-teal-600" />}
                    {copiedKey === 'schema' ? 'Copied!' : 'Copy JSON'}
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadFile('medical-schema.json', result.schemaJsonLd, 'application/json')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5 text-teal-600" /> Download
                  </button>
                </div>
              </div>

              <pre className="p-4 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto text-teal-300 font-mono text-xs max-h-[400px]">
                {result.schemaJsonLd}
              </pre>
            </div>
          )}

          {/* Output Tab 2: llms.txt */}
          {activeOutputTab === 'llmstxt' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Publish as <code className="text-teal-700">/llms.txt</code> at domain root.</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(result.llmsTxt, 'llms')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold flex items-center gap-1"
                  >
                    {copiedKey === 'llms' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-teal-600" />}
                    {copiedKey === 'llms' ? 'Copied!' : 'Copy llms.txt'}
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadFile('llms.txt', result.llmsTxt, 'text/plain')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5 text-teal-600" /> Download
                  </button>
                </div>
              </div>

              <pre className="p-4 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto text-slate-200 font-mono text-xs max-h-[400px] whitespace-pre-wrap">
                {result.llmsTxt}
              </pre>
            </div>
          )}

          {/* Output Tab 3: Markdown Profile */}
          {activeOutputTab === 'profile' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Standalone markdown profile for GBP fallback and AI indexing.</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center p-1 bg-slate-100 border border-slate-200 rounded-lg mr-2">
                    <button
                      type="button"
                      onClick={() => setProfileViewMode('rendered')}
                      className={`px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1 ${
                        profileViewMode === 'rendered' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      <Eye className="w-3 h-3" /> Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfileViewMode('raw')}
                      className={`px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1 ${
                        profileViewMode === 'raw' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      <Code className="w-3 h-3" /> Raw
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(result.rawMarkdownProfile, 'profile')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold flex items-center gap-1"
                  >
                    {copiedKey === 'profile' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-teal-600" />}
                    {copiedKey === 'profile' ? 'Copied!' : 'Copy Profile'}
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadFile('medical-profile.md', result.rawMarkdownProfile, 'text/markdown')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5 text-teal-600" /> Download
                  </button>
                </div>
              </div>

              {profileViewMode === 'raw' ? (
                <pre className="p-4 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto text-emerald-300 font-mono text-xs max-h-[450px] whitespace-pre-wrap">
                  {result.rawMarkdownProfile}
                </pre>
              ) : (
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-xs leading-relaxed max-h-[450px] overflow-y-auto whitespace-pre-wrap font-sans">
                  {result.rawMarkdownProfile}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
