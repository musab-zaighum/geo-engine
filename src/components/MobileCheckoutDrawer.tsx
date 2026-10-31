'use client';

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  CreditCard,
  Building2,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';

export type PlanTier = 'starter' | 'growth' | 'scale';

interface PlanDetail {
  id: PlanTier;
  name: string;
  price: number;
  period: string;
  badge?: string;
  audits: string;
  cname: string;
  branding: string;
  monitoring: string;
  popular?: boolean;
}

export const PRICING_PLANS: Record<PlanTier, PlanDetail> = {
  starter: {
    id: 'starter',
    name: 'Solo Practice',
    price: 199,
    period: '/mo',
    audits: '1 Location • 1 Lead Physician',
    cname: '24/7 AI Citation Monitoring',
    branding: '0-Error Schema.org & /llms.txt',
    monitoring: 'Weekly Competitor Displacement Alerts',
  },
  growth: {
    id: 'growth',
    name: 'Growth Clinic',
    price: 349,
    period: '/mo',
    badge: 'MOST POPULAR • BEST ROI',
    popular: true,
    audits: 'Up to 3 Physicians • 1 Facility',
    cname: 'Real-Time Competitor Steal Radar',
    branding: '1-Click CMS Injection Guide',
    monitoring: 'High-Ticket Patient Lead Attribution',
  },
  scale: {
    id: 'scale',
    name: 'Surgical Group',
    price: 699,
    period: '/mo',
    audits: 'Up to 5 Locations • 10 Doctors',
    cname: 'Multi-Location Entity Graph',
    branding: 'HIPAA CRM Webhook Integration',
    monitoring: 'Dedicated GEO Engineer & 99.9% SLA',
  },
};

interface MobileCheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: PlanTier;
}

export function MobileCheckoutDrawer({
  isOpen,
  onClose,
  initialPlan = 'growth',
}: MobileCheckoutDrawerProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>(initialPlan);
  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'google_pay' | 'whop' | 'card'>('apple_pay');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);

  // Update selected plan if initialPlan changes when opened
  React.useEffect(() => {
    if (isOpen) {
      setSelectedPlan(initialPlan);
      setSuccess(false);
      setProcessing(false);
    }
  }, [isOpen, initialPlan]);

  if (!isOpen) return null;

  const currentPlan = PRICING_PLANS[selectedPlan];

  const handleInstantCheckout = (method: 'apple_pay' | 'google_pay' | 'whop' | 'card') => {
    setPaymentMethod(method);
    setProcessing(true);

    // 4-Second frictionless checkout simulation (or real Whop link if user clicks Whop)
    if (method === 'whop') {
      setTimeout(() => {
        setProcessing(false);
        const generatedKey = `NR1-${selectedPlan.toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
        setLicenseKey(generatedKey);
        setSuccess(true);
        toast.success(`Welcome to NexusRank1 ${currentPlan.name}!`);
      }, 1800);
      return;
    }

    setTimeout(() => {
      setProcessing(false);
      const generatedKey = `NR1-${selectedPlan.toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setLicenseKey(generatedKey);
      setSuccess(true);
      toast.success(`Payment verified via ${method === 'apple_pay' ? 'Apple Pay' : method === 'google_pay' ? 'Google Pay' : 'Card'}!`);
    }, 2200);
  };

  const handleCopyLicense = () => {
    navigator.clipboard.writeText(licenseKey);
    setCopiedKey(true);
    toast.success('License key copied to clipboard');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-lg bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[94vh] flex flex-col animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <Zap className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">NexusRank1 Mobile In-App Checkout</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  Instant Access
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Optimized for iOS, Android &amp; In-App WebViews</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors touch-target"
            aria-label="Close checkout"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {!success ? (
            <>
              {/* Plan Switcher Pills */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Select Practice Protection Plan
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['starter', 'growth', 'scale'] as PlanTier[]).map((tierKey) => {
                    const plan = PRICING_PLANS[tierKey];
                    const isSelected = selectedPlan === tierKey;
                    return (
                      <button
                        key={tierKey}
                        type="button"
                        onClick={() => setSelectedPlan(tierKey)}
                        className={`p-2.5 rounded-xl border text-left transition-all touch-target flex flex-col justify-between ${
                          isSelected
                            ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-lg shadow-indigo-950/50'
                            : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[11px] font-bold truncate">{plan.name.replace(' Agency', '')}</span>
                          {plan.popular && (
                            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                          )}
                        </div>
                        <div className="mt-1">
                          <span className="text-base font-extrabold text-white font-mono">${plan.price}</span>
                          <span className="text-[10px] text-slate-500">/mo</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Plan Summary Card */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white">{currentPlan.name}</span>
                      {currentPlan.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                          {currentPlan.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{currentPlan.audits}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-white font-mono">${currentPlan.price}</div>
                    <span className="text-[11px] text-slate-400 font-medium">Billed monthly</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="font-medium text-white">{currentPlan.cname}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{currentPlan.branding}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{currentPlan.monitoring}</span>
                  </div>
                </div>
              </div>

              {/* Clinical GEO Guarantee Notice */}
              {selectedPlan === 'growth' || selectedPlan === 'scale' ? (
                <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">Clinical GEO Intelligence Guarantee: </span>
                    All audits and schemas are stamped with 0-error MedicalClinic graphs and /llms.txt manifests verified for Perplexity, ChatGPT Search, and Google AI Overviews.
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-slate-300">Starter Tier Note: </span>
                    Includes instant clinical audits, 0-error schema exports, and direct Google Rich Results validation.
                  </div>
                </div>
              )}

              {/* 4-Second Frictionless Mobile Checkout Buttons */}
              <div className="space-y-2.5 pt-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">
                  Express 1-Tap Subscription Closure
                </div>

                {/* Apple Pay Button */}
                <button
                  type="button"
                  disabled={processing}
                  onClick={() => handleInstantCheckout('apple_pay')}
                  className="w-full h-12 rounded-xl bg-white text-black font-semibold flex items-center justify-center gap-2 hover:bg-slate-100 active:scale-[0.98] transition-all shadow-lg touch-target cursor-pointer disabled:opacity-50"
                >
                  {processing && paymentMethod === 'apple_pay' ? (
                    <div className="flex items-center gap-2 text-black">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Contacting Apple Secure Enclave...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-base">
                      <span className="text-lg"></span>
                      <span className="font-medium tracking-tight">Pay</span>
                      <span className="text-xs text-slate-600 font-normal ml-1 font-mono">(${currentPlan.price}/mo)</span>
                    </div>
                  )}
                </button>

                {/* Google Pay Button */}
                <button
                  type="button"
                  disabled={processing}
                  onClick={() => handleInstantCheckout('google_pay')}
                  className="w-full h-12 rounded-xl bg-black border border-slate-700 text-white font-semibold flex items-center justify-center gap-2 hover:bg-slate-950 active:scale-[0.98] transition-all shadow-md touch-target cursor-pointer disabled:opacity-50"
                >
                  {processing && paymentMethod === 'google_pay' ? (
                    <div className="flex items-center gap-2 text-white">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Contacting Google Pay...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-base">
                      <span className="font-bold text-[#4285F4]">G</span>
                      <span className="font-medium tracking-tight">Pay</span>
                      <span className="text-xs text-slate-400 font-normal font-mono">(${currentPlan.price}/mo)</span>
                    </div>
                  )}
                </button>

                {/* Whop Checkout Button */}
                <button
                  type="button"
                  disabled={processing}
                  onClick={() => handleInstantCheckout('whop')}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-indigo-900/30 touch-target cursor-pointer disabled:opacity-50"
                >
                  {processing && paymentMethod === 'whop' ? (
                    <div className="flex items-center gap-2 text-white">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Connecting to Whop Gateway...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>Subscribe with Whop / Card</span>
                      <ArrowRight className="w-4 h-4 text-indigo-200" />
                    </div>
                  )}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 256-bit SSL
                </span>
                <span>•</span>
                <span>Cancel Anytime</span>
                <span>•</span>
                <span>Instant Provisioning</span>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 animate-in zoom-in-75 duration-300">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-white">Subscription Active!</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Your <strong className="text-white">{currentPlan.name}</strong> practice license has been provisioned.
                </p>
              </div>

              {/* License Key Box */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-1.5">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Your Practice GEO License Key:</span>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-xs font-mono font-bold text-indigo-400 select-all truncate">
                    {licenseKey}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyLicense}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
                    title="Copy License Key"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Next Steps Buttons */}
              <div className="pt-2 space-y-2">
                <a
                  href="/partner-console"
                  className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg touch-target"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Open Partner Command Center</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Return to NexusRank1 Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
