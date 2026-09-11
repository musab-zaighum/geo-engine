"use client";

import React, { useState } from "react";
import { Link2, ArrowRight, X, Copy, Check, Activity, ShieldCheck, Zap } from "lucide-react";

interface Integration {
  name: string;
  desc: string;
  instructions: string;
  snippet: string;
}

export default function IntegrationsPage() {
  const [activeIntegration, setActiveIntegration] = useState<Integration | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  const integrationCategories = [
    {
      title: "E-Commerce & Website Platforms",
      items: [
        { 
          name: "Shopify", 
          desc: "1-Click App for automatic Product Schema and llms.txt generation.",
          instructions: "Shopify Admin -> Online Store -> Themes -> Edit Code -> theme.liquid (paste just before </head>)",
          snippet: "<!-- GEO Engine Shopify Connector -->\n<script src=\"https://cdn.geoengine.io/shopify.js\" async></script>"
        },
        { 
          name: "WooCommerce", 
          desc: "Native plugin to sync your entire product catalog to AI engines.",
          instructions: "WordPress Admin -> Plugins -> Add New -> Search 'GEO Engine' -> Install & Activate",
          snippet: "define('GEO_ENGINE_KEY', 'sk_test_12345');\n// Automatically injects AI hooks"
        },
        { 
          name: "Amazon Storefronts", 
          desc: "Extract and format your Amazon listings for AI search visibility.",
          instructions: "Seller Central -> Storefront Settings -> External Identifiers",
          snippet: "AMZ-GEO-TOKEN: 8A9B2C-12"
        },
        { 
          name: "Webflow", 
          desc: "Native embedded snippet for dynamic AI search optimization.",
          instructions: "Project Settings -> Custom Code -> Head Code (Paste snippet)",
          snippet: "<!-- GEO Engine Webflow Connector -->\n<script src=\"https://cdn.geoengine.io/webflow.js\" async></script>"
        },
        { 
          name: "Squarespace", 
          desc: "Code injection integration for header scripts.",
          instructions: "Settings -> Advanced -> Code Injection -> Header",
          snippet: "<!-- GEO Engine Squarespace Connector -->\n<script src=\"https://cdn.geoengine.io/sqsp.js\" async></script>"
        },
        { 
          name: "WordPress", 
          desc: "Universal plugin for Local Services, Clinics, and Stores.",
          instructions: "WP Admin -> Plugins -> Add New -> 'GEO Engine Connect'",
          snippet: "add_action('wp_head', 'geo_engine_inject_meta');"
        }
      ]
    },
    {
      title: "Local Directories & Maps",
      items: [
        { 
          name: "Google Business Profile", 
          desc: "Sync your reviews and hours directly into your AI feeds.",
          instructions: "GEO Dashboard -> Integrations -> Google Business -> Authenticate via OAuth",
          snippet: "// No code needed. OAuth handles connection."
        },
        { 
          name: "Trustpilot", 
          desc: "Pull verified brand reviews directly into your AI schema.",
          instructions: "Trustpilot Business -> Integrations -> API Keys -> Create Key",
          snippet: "TRUSTPILOT_API_KEY=tp_live_987654321"
        }
      ]
    },
    {
      title: "Agency Automation & CRM",
      items: [
        { 
          name: "GoHighLevel", 
          desc: "Automatically send white-label GEO audits to your leads.",
          instructions: "GHL Agency Settings -> Custom Menus -> Add App URL",
          snippet: "https://app.geoengine.io/ghl-connect?agencyId=YOUR_ID"
        },
        { 
          name: "Zapier", 
          desc: "Connect GEO Engine to over 5,000+ apps.",
          instructions: "Zapier Dashboard -> Create Zap -> Trigger: GEO Engine Webhook",
          snippet: "https://api.geoengine.io/v1/webhooks/zapier"
        }
      ]
    }
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleTestConnection = () => {
    setIsTesting(true);
    setTestSuccess(false);
    setTimeout(() => {
      setIsTesting(false);
      setTestSuccess(true);
    }, 1500);
  };

  const openModal = (item: Integration) => {
    setActiveIntegration(item);
    setCopiedCode(false);
    setIsTesting(false);
    setTestSuccess(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
      <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6 tracking-tight">
          Integrate with your favorite tools
        </h1>
        <p className="text-lg text-slate-600 font-medium">
          Connect GEO Engine natively to your storefront, directories, and CRMs. Easy 1-click setups.
        </p>
      </div>

      <div className="space-y-16 relative z-10">
        {integrationCategories.map((cat, i) => (
          <div key={i}>
            <h2 className="text-2xl font-black text-slate-900 mb-8 border-b border-slate-200 pb-4">{cat.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cat.items.map((item, j) => (
                <div 
                  key={j} 
                  onClick={() => openModal(item)}
                  className="vibrant-card p-6 flex flex-col group cursor-pointer"
                >
                  <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                    <Link2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.name}</h3>
                  <p className="text-sm text-slate-600 flex-1 font-medium leading-relaxed">{item.desc}</p>
                  <div className="mt-6 flex items-center text-sm font-black text-indigo-600 group-hover:text-indigo-700">
                    Connect Integration <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* INTEGRATION MODAL */}
      {activeIntegration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setActiveIntegration(null)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200 flex flex-col max-h-[90vh]">
            
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-8 text-white relative flex-shrink-0">
              <button onClick={() => setActiveIntegration(null)} className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="absolute right-0 top-0 opacity-20"><Zap className="w-48 h-48 transform translate-x-10 -translate-y-10" /></div>
              <h2 className="text-3xl font-black mb-2 relative z-10 flex items-center">
                <Link2 className="w-8 h-8 mr-3 text-indigo-200" />
                Connect {activeIntegration.name}
              </h2>
              <p className="text-indigo-200 font-medium relative z-10">Follow the 3 simple steps below to authenticate.</p>
            </div>

            <div className="p-8 overflow-y-auto flex-1 space-y-8">
              
              {/* Step 1 */}
              <div>
                <h4 className="flex items-center text-lg font-black text-slate-900 mb-3">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mr-3 text-sm">1</span>
                  Where to navigate
                </h4>
                <div className="ml-11 bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-700 font-medium">
                  {activeIntegration.instructions}
                </div>
              </div>

              {/* Step 2 */}
              <div>
                <h4 className="flex items-center text-lg font-black text-slate-900 mb-3">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mr-3 text-sm">2</span>
                  Copy the Integration Code
                </h4>
                <div className="ml-11 bg-slate-900 p-4 rounded-xl relative border border-slate-800 shadow-inner">
                  <button 
                    onClick={() => handleCopy(activeIntegration.snippet)}
                    className="absolute top-3 right-3 bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-lg transition text-xs font-bold flex items-center"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-400 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                    {copiedCode ? "Copied" : "Copy"}
                  </button>
                  <pre className="text-indigo-300 font-mono text-sm overflow-x-auto whitespace-pre-wrap pr-16">{activeIntegration.snippet}</pre>
                </div>
              </div>

              {/* Step 3 */}
              <div>
                <h4 className="flex items-center text-lg font-black text-slate-900 mb-3">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mr-3 text-sm">3</span>
                  Test Connection
                </h4>
                <div className="ml-11 flex items-center space-x-4">
                  <button 
                    onClick={handleTestConnection}
                    disabled={isTesting || testSuccess}
                    className={`font-bold px-8 py-4 rounded-xl transition shadow-md flex items-center justify-center min-w-[200px] ${testSuccess ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20 hover:-translate-y-0.5 active:scale-95'}`}
                  >
                    {isTesting ? (
                      <><Activity className="w-5 h-5 animate-spin mr-2" /> Testing...</>
                    ) : testSuccess ? (
                      <><ShieldCheck className="w-5 h-5 mr-2" /> Verified Active</>
                    ) : (
                      "Test Connection"
                    )}
                  </button>
                  {testSuccess && (
                    <span className="text-emerald-600 font-bold animate-in fade-in slide-in-from-left-4 text-sm bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100">
                      Successfully connected to {activeIntegration.name}!
                    </span>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
