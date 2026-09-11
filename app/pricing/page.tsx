"use client";

import React, { useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { toast } from "sonner";
import { CheckCircle2, Zap } from "lucide-react";

export default function Pricing() {
  const [sliderVal, setSliderVal] = useState([2]);

  const tiers = [
    { clients: 1, label: "1 Practice", price: "$79", subtext: "/mo per practice", name: "Solo Pro", features: ["1 Verified Entity Passport", "Basic schema generation", "Monthly audits"] },
    { clients: 5, label: "5 Practices", price: "$99", subtext: "/mo flat", name: "Agency Starter", features: ["5 Verified Entity Passports", "Deep Schema.org structured data", "Weekly threat audits", "White-label reports"] },
    { clients: 15, label: "15 Practices", price: "$199", subtext: "/mo flat", name: "Agency Growth", features: ["15 Verified Entity Passports", "Priority GPTBot Indexing", "Real-time AI query simulation", "API Access"] },
    { clients: 50, label: "50 Practices", price: "$399", subtext: "/mo flat", name: "Scale", features: ["50+ Verified Entity Passports", "Dedicated Support", "Custom integrations", "Volume discounts"] }
  ];

  const currentTier = tiers[sliderVal[0]];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 lg:py-24 text-center">
      <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-1.5 rounded-full text-xs font-semibold mb-6">
        <Zap className="w-3 h-3 text-blue-600" />
        <span>Transparent Volume Pricing</span>
      </div>
      
      <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
        Simple pricing for any scale.
      </h1>
      <p className="text-slate-600 text-lg mb-16 max-w-2xl mx-auto">
        Whether you are a solo medical practitioner or an SEO agency with 50+ local clients, our dynamic infrastructure scales with your needs.
      </p>

      {/* Pricing Card */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 sm:p-12 relative">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Zap className="w-48 h-48 text-blue-600" />
        </div>
        
        <div className="max-w-xl mx-auto mb-16 relative z-10">
          <Slider.Root 
            className="relative flex items-center select-none touch-none w-full h-5" 
            value={sliderVal} 
            max={3} 
            step={1} 
            onValueChange={setSliderVal}
          >
            <Slider.Track className="bg-slate-200 relative grow rounded-full h-2">
              <Slider.Range className="absolute bg-blue-600 rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb className="block w-6 h-6 bg-white shadow-md rounded-full border-2 border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-shadow cursor-grab active:cursor-grabbing" />
          </Slider.Root>
          <div className="flex justify-between mt-6 text-xs sm:text-sm font-semibold text-slate-500">
            {tiers.map((t, idx) => (
              <span key={idx} className={sliderVal[0] === idx ? "text-blue-600 font-bold" : ""}>{t.label}</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10 text-left items-center">
          <div>
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">{currentTier.name}</h3>
            <div className="flex items-baseline space-x-2 mb-6">
              <span className="text-5xl font-black text-slate-900">{currentTier.price}</span>
              <span className="text-slate-500 font-semibold">{currentTier.subtext}</span>
            </div>
            
            <button onClick={() => toast.success("Redirecting to checkout...")} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-md shadow-blue-500/20 flex items-center justify-center text-base mb-4">
              Start 14-Day Free Trial
            </button>
            <p className="text-xs text-center text-slate-500 font-medium">No credit card required for the first 14 days.</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
            <h4 className="text-slate-900 font-bold mb-6">What's included in {currentTier.name}:</h4>
            <ul className="space-y-4">
              {currentTier.features.map((feature, idx) => (
                <li key={idx} className="flex items-start text-slate-700 font-medium text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-3 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
