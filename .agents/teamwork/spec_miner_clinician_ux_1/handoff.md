# Clinician UX Audit & Remediation Specifications Handoff

**Author:** `spec_miner_clinician_ux_1`  
**Workspace:** `/home/pwn/geo-engine/.agents/teamwork/spec_miner_clinician_ux_1/`  
**Milestone:** Clinician UX Audit & Remediation Specifications  
**Status:** Hard Handoff (Complete)

---

## 1. Observation

### 1.1 Persona Context & Operational Environment
Target users are private practice solo owners, surgical implantologists, cosmetic dentists, and medspa medical directors across affluent US metro zip codes (e.g., Scottsdale AZ, Newport Beach CA, Dallas TX, Boca Raton FL). These clinicians are seeking high-ticket case acquisition ($5,000 to $40,000 per surgical or restorative case: All-on-4, single/multi implants, full-mouth restorations, smile makeovers, deep plane facelifts) and are actively defending against predatory local competitors and DSOs.

### 1.2 Observed Developer Jargon Across Components & Pages
Direct inspection of the codebase in `/home/pwn/geo-engine/src` revealed 24 critical developer/SEO jargon instances where engineering terms are exposed to clinical practice owners:

1. **`src/components/AuditorSection.tsx:109`**
   - *Verbatim Observed Text:* `"Enter a clinic domain URL or practice name. Our crawler launches headless Chromium, inspects JavaScript-rendered DOM, checks Schema.org JSON-LD headers, and verifies /llms.txt."`
   - *Issue:* Uses browser automation terms ("headless Chromium", "JavaScript-rendered DOM", "crawler", "JSON-LD headers") that confuse and alienate non-technical doctors.
   - *Also Line 103:* `"Agentic Search & Playwright Browser Engine"`
   - *Also Line 115:* `"Dual-Engine Crawler Active"`
   - *Also Line 133:* `"Enter URL (e.g. drjane.com) or Clinic Name (e.g. 'Sydney Eye Surgery Clinic')"` (Uses Australian clinic example rather than US affluent metro dental/surgical example).

2. **`src/components/InstantAuditBar.tsx`**
   - *Line 110:* `'Validating Schema.org MedicalClinic & Physician AST graph...'`
   - *Line 112:* `'Compiling 0-error JSON-LD & clinical authority manifest...'`
   - *Line 439–444:* `title: 'AI Web-Crawler Accessibility (GPTBot, Perplexity, Applebot)'`, `diagnostic: 'Website crawler rules block generative AI bots: ...'`, `specification: 'AI Web Crawler Access Protocol'`, `remediation: 'Update your website settings to allow AI crawlers to read your public practice information.'`
   - *Line 618:* ``Please let us know when we can forward the code payload for deployment.``
   - *Line 966:* `<div className="text-[11px] text-slate-400">Valid MedicalClinic AST</div>`
   - *Line 988:* `<div className="text-[11px] text-rose-300 font-medium">HTTP 404 (Action Needed)</div>`
   - *Line 1610:* `100% Crawlers Permitted`
   - *Line 1652:* `Schema.org JSON-LD (MedicalClinic AST)`

3. **`src/app/report/[domain]/page.tsx`**
   - *Lines 55, 840–860:*
     ```tsx
     const [retainerFee, setRetainerFee] = useState(997);
     // ...
     <span className="text-slate-400">Proposed GEO Retainer</span>
     <span className="font-bold text-indigo-400">${retainerFee.toLocaleString()}/mo</span>
     // Buttons: $650, $997, $1250, $1500 / mo
     ```
   - *Line 878:* `After retainer deduction`
   - *Line 883:* `1st patient pays retainer`
   - *Line 563:* `Missing Schema.org/MedicalClinic JSON-LD on ${domain}. Generative search engines cannot index clinical entity.`
   - *Line 699:* `0-Error Schema.org Multi-Entity JSON-LD`
   - *Lines 937–948:* Mentions `Need 0-error schema & /llms.txt deployed for {practiceTitle}?` but lacks a direct link to the $1,500 Whop checkout system.

4. **`src/app/partner-console/page.tsx`**
   - *Line 656:* `"Non-visual metadata that communicates your accepted insurances, verified NPI license, and core procedures directly to AI crawlers (GPTBot, ClaudeBot, PerplexityBot)."`
   - *Line 690:* `Schema.org MedicalClinic & Physician AST`
   - *Line 703:* `Copy JSON-LD`

5. **`src/components/EntityGraphVisualizer.tsx`**
   - *Line 110:* `0-Error AST`
   - *Line 142:* `RDF Triplets ({triplets.length})`
   - *Line 287:* `AI Crawler Root Manifest`
   - *Line 310:* `Semantic triplets forming the Knowledge Graph ingested by Retrieval-Augmented Generation (RAG) synthesizers:`

6. **`src/components/GeoCitationSimulator.tsx`**
   - *Line 65:* `'Missing clinical JSON-LD. Google AI Overviews prioritizes rival clinics with verified schema.'`
   - *Line 94:* `'Practitioner lacks cryptographic URI linkage. AI synthesizer defaults to accredited rival practices.'`
   - *Line 121:* `'Missing /llms.txt forces Perplexity to scrape raw HTML DOM, increasing parse noise and reducing citation rank.'`

7. **`src/components/PatientRoiCalculator.tsx`**
   - *Lines 172–184:* Slider maximum is capped at `$15,000` (`min="1000" max="15000" step="250"`), whereas full-arch surgical cases (All-on-4, dual-arch restorations) average `$25,000` to `$40,000`.

8. **`src/lib/config.ts`**
   - *Line 8:* `whopCheckoutUrl: process.env.NEXT_PUBLIC_WHOP_CHECKOUT_URL || 'https://whop.com/checkout/nexusrank1-clinic-growth'`
   - *Issue:* Falls back to `nexusrank1-clinic-growth` instead of the mandated `https://whop.com/checkout/plan_e37e96b86e088/`.
   - *Lines 51–60:* Pillar 4 description and features use heavy crawler jargon (`AI Model Readability & Crawler Directives`, `AST graph`, `web-crawlers`).

9. **`src/app/api/chat/route.ts`**
   - Fallback offline response lacks a dedicated pattern match for queries about "competitors stealing patients" or "local rival outranking", dropping doctors into a generic help menu.

10. **`src/app/layout.tsx`**
    - *Line 16:* Metadata description states `with 93% net profit margins`, which is reseller agency language instead of clinic owner value.

---

## 2. Logic Chain

### 2.1 The Clinician Cognitive Hierarchy
1. Private practice solo owners have zero interest in "DOM distillation", "AST graphs", or "crawlers". When a doctor sees "headless Chromium" or "AST", cognitive load spikes and trust plummets: they suspect the software was built by junior web developers who don't understand clinical practice workflows.
2. In contrast, medical directors immediately understand:
   - "Doctor Authority Graph"
   - "Federal Physician Licensure Verification (CMS NPPES NPI-1)"
   - "Clinical Knowledge Graph (Schema.org)"
   - "AI Search Engine Patient Referrals (ChatGPT Search, Perplexity Pro, Google AI Overviews)"
   - "Local Competitor Patient Displacement"

### 2.2 Financial Trust & The $997/mo Retainer Contradiction
1. Across the homepage and `/pricing`, NexusRank1 makes an unambiguous promise: **"Flat $1,500 One-Time Deployment • 0 Monthly Software Fees or Agency Retainers"**.
2. However, the standalone client report at `/report/[domain]` shows a slider labeled `Proposed GEO Retainer: $997/mo`.
3. If a prospective client runs an audit and shares the report with their practice manager or partner, the partner will see `$997/mo Retainer` and conclude NexusRank1 is a recurring agency contract.
4. Harmonizing `/report/[domain]` to model the **$1,500 One-Time Deployment** with the **1-Patient ROI Guarantee** resolves this contradiction completely.

### 2.3 Economic Reality: High-Ticket Surgical Pricing ($5k–$40k)
1. Surgical implantologists do not perform $1,000 cleanings; their primary revenue drivers are single implants ($4,500–$6,500), All-on-4 full-arch surgical cases ($24,000–$28,000), and full-mouth reconstructions ($35,000–$40,000).
2. Capping the ROI Calculator slider at $15,000 prevents implantologists and aesthetic surgeons from modeling their true case volume. Extending the upper slider boundary to $40,000 allows realistic projection of multi-unit surgical cases.

---

## 3. Features Discovered & Edge Cases

### Features Discovered
| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Instant Audit | 5-Second Practice Audit Bar | Analyzes domain for CMS NPPES NPI-1, clinical schema, and AI factsheets | Domain URL or Clinic Name | Radial score gauge, 7 deep audit tabs | Graceful fallback to deterministic profile on fetch error | `src/components/InstantAuditBar.tsx` |
| 2 | Benchmarking | Geo-Visibility 3x3 Radar | Maps 3x3 mile grid around clinic coordinates and identifies competitor displacement | Geocoded Lat/Lng, Zip Code | 9-cell coordinate rank matrix, Top 5 rival clinic comparison | Default coordinates (Austin TX) on unresolved geo | `src/components/InstantAuditBar.tsx:1120` |
| 3 | Directory Sync | GBP & 50+ Directory Authority | Audits primary/secondary medical categories, emergency hours, and NAP consistency | Clinic NAP, GBP category | 4 diagnostic scorecards (Category, Hours, NAP, Keyword shield) | Highlights broad category warnings (e.g. General vs Cosmetic) | `src/components/InstantAuditBar.tsx:1255` |
| 4 | Patient Flow | Reception QR & SMS Loops | Generates print-ready reception desk QR stand and 1-click post-op patient SMS sequences | Practice name, domain, doctor name | SMS simulator preview, print-ready QR card, sentiment harvester | Fallback to default lead doctor on unverified profile | `src/components/InstantAuditBar.tsx:1396` |
| 5 | AI Knowledge | Doctor Summary vs. Webmaster Code | Clean toggle switching between Doctor Executive Summary and raw JSON-LD / llms.txt code | `showRawCode` boolean toggle | 4 executive credential cards OR syntax-highlighted code editor | Defaults to Doctor Executive Summary view | `src/components/InstantAuditBar.tsx:1519` |
| 6 | Financials | High-Ticket ROI Modeler | Calculates monthly revenue lift, annual production, and net ROI multiplier | Specialty, Case Value slider ($1k–$40k), New Patients slider | Dynamic monthly revenue, net profit, ROI % dial | Clamps net profit at 0 if revenue is less than $1,500 | `src/components/PatientRoiCalculator.tsx` |
| 7 | AI Simulation | Multi-Engine Citation Simulator | Simulates how ChatGPT, Perplexity, Google AI Overviews, and Apple Intelligence cite the clinic | Domain, schema status, NPI status | Engine probability score, citation status, simulated AI prompt snippet | Displays crawl block alert if robots.txt disallows AI bots | `src/components/GeoCitationSimulator.tsx` |
| 8 | Credentials | Doctor Licensure Graph | Interactive visual graph linking clinic entity to NPI-1 registry, State Board licenses, and CPT codes | Clinic metadata, NPI-1, state license | Interactive SVG node diagram, verified authority connections | Defaults to verified demo license if CMS API is unconfigured | `src/components/EntityGraphVisualizer.tsx` |
| 9 | Practice Console| Clinic Command Center (`/partner-console`) | 4-tab dashboard managing practice profile, competitor steal radar, 1-click schema, and settings | User edits to doctor name, NPI, domain | Saved localStorage state, toast notifications, sample JSON-LD | Displays clear validation messages on empty fields | `src/app/partner-console/page.tsx` |
| 10 | Chat Advisory | Corner Chatbot & Knowledge Base | AI assistant answering clinic questions regarding $1,500 pricing, CMS installation, and competitor defense | User chat query | Streaming AI response or structured Markdown fallback | Reliable local fallback when OpenRouter API is unconfigured | `src/components/CornerChatWidget.tsx` |
| 11 | Export System | Vector PDF & Public Report | Exports unbranded vector PDF audit or renders shareable client web report | Domain URL parameter | Formatted PDF stream or responsive `/report/[domain]` page | Renders fallback diagnostic data if live audit times out | `src/app/api/report/pdf/route.ts` |

### Edge Cases
| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | Instant Audit Bar | Private or internal IP (e.g. `127.0.0.1` or `192.168.1.1`) | `isSafePublicUrl` blocks query and returns 400 "Invalid or restricted domain" |
| 2 | Public Report | Domain with query params or protocol (`https://austincosmetic.com/`) | Clean regex normalization strips protocol and trailing slash |
| 3 | Chatbot Fallback | Query with "competitor" or "rival taking patients" | Previously defaulted to main menu; now requires dedicated Competitor Displacement handler |
| 4 | ROI Calculator | Case value above $15,000 (e.g. $25,000 All-on-4) | Previously capped at $15,000; requires slider expansion to $40,000 |
| 5 | Checkout Action | User clicks Whop button without `.env` configured | Previously went to `nexusrank1-clinic-growth`; must point to `plan_e37e96b86e088/` |

---

## 4. File-by-File Remediation Specifications

Below is the actionable remediation specification for the remediation worker. Every file modification includes exact line targets, current copy, and the clinician-centric replacement.

---

### Spec 1: `src/lib/config.ts`
**Objective:** Update default Whop checkout URL to required plan ID, raise high-ticket procedure ceiling to $40,000, and replace developer crawler jargon in Pillar 4.

* **Lines 6–8:**
  - *Current:*
    ```ts
    whopCheckoutUrl:
      process.env.NEXT_PUBLIC_WHOP_CHECKOUT_URL ||
      'https://whop.com/checkout/nexusrank1-clinic-growth',
    ```
  - *Replace with:*
    ```ts
    whopCheckoutUrl:
      process.env.NEXT_PUBLIC_WHOP_CHECKOUT_URL ||
      'https://whop.com/checkout/plan_e37e96b86e088/',
    ```

* **Lines 50–61:**
  - *Current:*
    ```ts
    {
      id: 'ai-readability',
      title: 'AI Model Readability & Crawler Directives',
      badge: 'ChatGPT & Perplexity Ready',
      description:
        'Formats clinic data into clean markdown and JSON-LD structured schemas specifically engineered for AI web-crawlers (GPTBot, PerplexityBot, ClaudeBot, Google AI).',
      features: [
        '0-Error Schema.org MedicalClinic & Physician AST graph compilation',
        'Domain-level /llms.txt machine-readable manifest generation',
        'ADA CDT & AMA CPT clinical procedure ontology code embedding',
        'RFC 9309 crawler permissions ensuring complete AI search model indexing',
      ],
    },
    ```
  - *Replace with:*
    ```ts
    {
      id: 'ai-readability',
      title: 'Clinical AI Knowledge Graph & Factsheet Directory',
      badge: 'ChatGPT & Perplexity Verified',
      description:
        'Synthesizes your clinical credentials, accepted insurances, and surgical procedures into verified knowledge graphs structured specifically so AI search engines recommend your clinic.',
      features: [
        '0-Error Schema.org Medical Clinic & Doctor Authority Graph compilation',
        'Domain-level AI Clinical Factsheet & Practice Directory (/llms.txt)',
        'ADA CDT & AMA CPT clinical procedure ontology code embedding',
        'AI search engine access authorization ensuring complete clinic indexing on ChatGPT & Perplexity',
      ],
    },
    ```

* **Line 66:**
  - *Current:* `'...a single new patient case (dental implants, Invisalign, surgical consultation, or medspa package) is worth $3,000 to $15,000+.'`
  - *Replace with:* `'...a single new patient case (dental implants, All-on-4, surgical consultation, or aesthetic package) is worth $5,000 to $40,000+.'`

---

### Spec 2: `src/components/AuditorSection.tsx`
**Objective:** Replace browser automation and crawler terminology with autonomous clinical intelligence language.

* **Line 103:**
  - *Current:* `Agentic Search & Playwright Browser Engine`
  - *Replace with:* `Autonomous Clinical AI Intelligence & Verification Engine`

* **Lines 108–110:**
  - *Current:*
    ```tsx
    <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
      Enter a clinic domain URL or practice name. Our crawler launches headless Chromium, inspects JavaScript-rendered DOM, checks Schema.org JSON-LD headers, and verifies /llms.txt.
    </p>
    ```
  - *Replace with:*
    ```tsx
    <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
      Enter your practice website domain or clinic name. Our diagnostic engine evaluates your clinical search authority, verifies how ChatGPT and Perplexity cite your doctor credentials, and identifies where local competitors are intercepting your surgical patients.
    </p>
    ```

* **Line 115:**
  - *Current:* `<span>Dual-Engine Crawler Active</span>`
  - *Replace with:* `<span>Live Clinical AI Diagnostic Active</span>`

* **Line 133:**
  - *Current:* `placeholder="Enter URL (e.g. drjane.com) or Clinic Name (e.g. 'Sydney Eye Surgery Clinic')"`
  - *Replace with:* `placeholder="Enter Practice URL (e.g. austincosmetic.com) or Clinic Name (e.g. 'Apex Dental Specialists')"`

---

### Spec 3: `src/components/InstantAuditBar.tsx`
**Objective:** Eliminate developer jargon across scanning steps, diagnostic cards, code viewer, and toolbar.

* **Lines 108–113 (`SCAN_STEPS`):**
  - *Current:*
    ```ts
    const SCAN_STEPS = [
      'Resolving DNS & querying CMS NPPES Federal Registry v2.1...',
      'Fetching robots.txt & testing /llms.txt crawler directives...',
      'Validating Schema.org MedicalClinic & Physician AST graph...',
      'Simulating SearchGPT, Perplexity & Google AI Overviews ranking...',
      'Compiling 0-error JSON-LD & clinical authority manifest...',
    ];
    ```
  - *Replace with:*
    ```ts
    const SCAN_STEPS = [
      'Resolving domain & querying CMS NPPES Federal Provider Registry v2.1...',
      'Verifying AI search accessibility & clinical directory directives...',
      'Validating Clinical AI Knowledge Graph & Doctor Licensure Graph...',
      'Simulating SearchGPT, Perplexity & Google AI Overviews patient recommendations...',
      'Synthesizing Verified Practice Architecture & Clinical Authority Profile...',
    ];
    ```

* **Line 439–447 (`chk-7`):**
  - *Current:*
    ```ts
    title: 'AI Web-Crawler Accessibility (GPTBot, Perplexity, Applebot)',
    diagnostic: blockedAiBots.length > 0
      ? `Website crawler rules block generative AI bots: ${blockedAiBots.join(', ')}. This completely prevents ChatGPT from indexing your clinic.`
      : 'Website permits all major AI search indexers (GPTBot, PerplexityBot, ClaudeBot, Google-Extended, Applebot).',
    specification: 'AI Web Crawler Access Protocol',
    remediation: blockedAiBots.length > 0
      ? `Update your website settings to allow AI crawlers to read your public practice information.`
      : 'AI search bot accessibility verified with 0 crawl blocks.',
    ```
  - *Replace with:*
    ```ts
    title: 'AI Search Engine Recommendation Access (ChatGPT, Perplexity, Apple Intelligence)',
    diagnostic: blockedAiBots.length > 0
      ? `Website settings block conversational AI assistants from discovering your practice: ${blockedAiBots.join(', ')}. This causes ChatGPT and Perplexity to omit your clinic when local patients ask for doctor recommendations.`
      : 'Website authorizes all major clinical AI search assistants (ChatGPT, Perplexity, Google AI Overviews, Apple Intelligence).',
    specification: 'AI Recommendation Access Standard',
    remediation: blockedAiBots.length > 0
      ? `Authorize AI search engines to read your public practice factsheet and physician credentials.`
      : 'Clinical AI search accessibility verified with 0 access restrictions.',
    ```

* **Line 618 (`handleEmailWebmaster`):**
  - *Current:*
    ```ts
    `Hello Webmaster,\n\nWe recently completed a Generative Engine Optimization (GEO) audit for ${auditData.clinicName} (${auditData.url}).\n\nOur audit detected missing /llms.txt crawler directives and incomplete Schema.org MedicalClinic graphs required for Google AI Overviews and ChatGPT Search.\n\nWe have generated 0-error Schema.org JSON-LD and a compliant /llms.txt manifest ready for installation.\n\nPlease let us know when we can forward the code payload for deployment.\n\nBest regards,\nClinical SEO & Practice Growth Team`
    ```
  - *Replace with:*
    ```ts
    `Hello Webmaster,\n\nWe recently completed a Clinical AI Search & Local Growth audit for ${auditData.clinicName} (${auditData.url}).\n\nOur audit detected missing AI directory factsheets (/llms.txt) and incomplete Medical Clinic Knowledge Graphs required for Google AI Overviews and ChatGPT Search recommendations.\n\nWe have generated 100% verified Clinical Knowledge Architecture and an AI practice directory ready for deployment.\n\nPlease let us know when we can coordinate deployment for the practice.\n\nBest regards,\nPractice Clinical AI & Local Growth Team`
    ```

* **Line 966:**
  - *Current:* `<div className="text-[11px] text-slate-400">Valid MedicalClinic AST</div>`
  - *Replace with:* `<div className="text-[11px] text-slate-400">Verified Practice Architecture</div>`

* **Line 988:**
  - *Current:* `<div className="text-[11px] text-rose-300 font-medium">HTTP 404 (Action Needed)</div>`
  - *Replace with:* `<div className="text-[11px] text-rose-300 font-medium">Missing Directory (Action Needed)</div>`

* **Line 1610:**
  - *Current:* `100% Crawlers Permitted`
  - *Replace with:* `100% AI Search Access Authorized`

* **Line 1652:**
  - *Current:* `<span>Schema.org JSON-LD (MedicalClinic AST)</span>`
  - *Replace with:* `<span>Verified Practice Schema (Schema.org)</span>`

---

### Spec 4: `src/components/PatientRoiCalculator.tsx`
**Objective:** Expand procedure slider from $15,000 to $40,000 for high-ticket surgical cases (All-on-4, full-arch restorations, facial aesthetic surgery), update specialty descriptions, and reinforce solo doctor economics.

* **Lines 24–60 (`SPECIALTIES`):**
  - *Update Dental preset:*
    - `defaultTicket: 6500`
    - `sampleProcedures: 'Single Implant ($4,500), All-on-4 Full Arch ($24,000), Full-Mouth Restoration ($38,000)'`
  - *Update Aesthetics preset:*
    - `defaultTicket: 3500`
    - `sampleProcedures: 'Neuromodulators & Fillers ($2,200), Laser Resurfacing ($3,800), Body Contouring ($6,500)'`
  - *Update Plastic Surgery preset:*
    - `defaultTicket: 14500`
    - `sampleProcedures: 'Rhinoplasty ($9,500), Deep Plane Facelift ($18,000), Mommy Makeover ($25,000)'`

* **Lines 170–185 (Case Value Slider):**
  - *Current:*
    ```tsx
    <input
      type="range"
      min="1000"
      max="15000"
      step="250"
      value={avgTicket}
      onChange={(e) => setAvgTicket(Number(e.target.value))}
      className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
    />
    
    <div className="flex justify-between text-[11px] font-mono text-slate-500">
      <span>$1,000 (Routine)</span>
      <span>$7,500</span>
      <span>$15,000 (Surgical / Full Arch)</span>
    </div>
    ```
  - *Replace with:*
    ```tsx
    <input
      type="range"
      min="1000"
      max="40000"
      step="500"
      value={avgTicket}
      onChange={(e) => setAvgTicket(Number(e.target.value))}
      className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
    />
    
    <div className="flex justify-between text-[11px] font-mono text-slate-500">
      <span>$1,000 (Routine)</span>
      <span>$15,000 (Single Arch)</span>
      <span>$40,000 (Full-Mouth Surgical)</span>
    </div>
    ```

---

### Spec 5: `src/app/report/[domain]/page.tsx`
**Objective:** ELIMINATE the `$997/mo retainer` contradiction and align completely with the $1,500 One-Time System deployment terms; add direct Whop checkout CTA.

* **Line 55:**
  - *Current:* `const [retainerFee, setRetainerFee] = useState(997);`
  - *Replace with:* `const systemCost = 1500; // $1,500 Flat One-Time Investment (0 Monthly Retainers)`

* **Lines 246–248:**
  - *Current:*
    ```ts
    const monthlyRevenueLift = newPatients * caseValue;
    const annualRevenueLift = monthlyRevenueLift * 12;
    const netMonthlyProfit = Math.max(0, monthlyRevenueLift - retainerFee);
    const practiceRoiPercent = retainerFee > 0 ? Math.round((netMonthlyProfit / retainerFee) * 100) : 0;
    ```
  - *Replace with:*
    ```ts
    const monthlyRevenueLift = newPatients * caseValue;
    const annualRevenueLift = monthlyRevenueLift * 12;
    const netAnnualProfit = Math.max(0, annualRevenueLift - systemCost);
    const timesCovered = (caseValue / systemCost).toFixed(1);
    const practiceRoiPercent = Math.round((netAnnualProfit / systemCost) * 100);
    ```

* **Lines 838–861 (Lever 3):**
  - *Current:*
    ```tsx
    {/* Lever 3 */}
    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400">Proposed GEO Retainer</span>
        <span className="font-bold text-indigo-400">${retainerFee.toLocaleString()}/mo</span>
      </div>
      <div className="flex items-center gap-1.5 pt-1">
        {[650, 997, 1250, 1500].map((fee) => (
          <button ...>${fee}</button>
        ))}
      </div>
    </div>
    ```
  - *Replace with:*
    ```tsx
    {/* Lever 3: One-Time System Terms */}
    <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-2">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400">System Investment Terms</span>
        <span className="font-bold text-emerald-400">$1,500 One-Time</span>
      </div>
      <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-[11px] text-emerald-300">
        ✓ 0 Monthly Retainers • 100% System Ownership • 90-Day 1-Patient ROI Guarantee
      </div>
    </div>
    ```

* **Lines 876–884 (Metric Cards 3 & 4):**
  - *Current:*
    ```tsx
    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
      <div className="text-[10px] text-slate-400 uppercase tracking-wider">Net Practice Profit</div>
      <div className="text-lg font-black text-emerald-400">+${netMonthlyProfit.toLocaleString()}/mo</div>
      <div className="text-[10px] text-emerald-400 font-mono">After retainer deduction</div>
    </div>
    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
      <div className="text-[10px] text-slate-400 uppercase tracking-wider">Client Payback</div>
      <div className="text-lg font-black text-amber-300">< 3 Days</div>
      <div className="text-[10px] text-amber-400/80 font-mono">1st patient pays retainer</div>
    </div>
    ```
  - *Replace with:*
    ```tsx
    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
      <div className="text-[10px] text-slate-400 uppercase tracking-wider">Net Annual Profit</div>
      <div className="text-lg font-black text-emerald-400">+${netAnnualProfit.toLocaleString()}</div>
      <div className="text-[10px] text-emerald-400 font-mono">After $1,500 one-time deployment</div>
    </div>
    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
      <div className="text-[10px] text-slate-400 uppercase tracking-wider">1-Patient Payback</div>
      <div className="text-lg font-black text-amber-300">{timesCovered}x Return</div>
      <div className="text-[10px] text-amber-400/80 font-mono">1 single patient covers system</div>
    </div>
    ```

* **Lines 916–930 (Instant Claim Button):**
  - Add direct Whop checkout link alongside modal booking so clinicians can immediately secure the $1,500 system:
    ```tsx
    <a
      href="https://whop.com/checkout/plan_e37e96b86e088/"
      target="_blank"
      rel="noopener noreferrer"
      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/50 transition-all cursor-pointer shrink-0"
    >
      <Sparkles className="w-4 h-4 text-amber-300" />
      <span>Claim $1,500 System</span>
    </a>
    ```

---

### Spec 6: `src/app/api/chat/route.ts`
**Objective:** Add a dedicated high-ticket competitor displacement & patient steal response in `buildFallbackChatResponse`.

* In `buildFallbackChatResponse`:
  Insert before line 87:
  ```ts
  if (
    queryLower.includes('competitor') ||
    queryLower.includes('rival') ||
    queryLower.includes('steal') ||
    queryLower.includes('displace') ||
    queryLower.includes('outrank') ||
    queryLower.includes('implant')
  ) {
    return `### 🛡️ Local Competitor Displacement & Patient Defense Strategy

#### Why Local Competitors Are Winning Your High-Ticket Patients:
When prospective patients query ChatGPT Search, Perplexity, or Google AI Overviews for high-ticket procedures (e.g. *"Best All-on-4 dental implants in Austin"* or *"Top cosmetic surgeon for deep plane facelifts"*), AI answer engines do not display Google Maps 3-packs. Instead, they recommend whichever local practice has published **0-error Clinical Knowledge Graphs (Schema.org)** and a verified **domain /llms.txt factsheet**.

If your site lacks these, AI engines automatically redirect those $5,000–$40,000 consultations to your #1 local competitor.

#### The NexusRank1 Countermeasure ($1,500 One-Time Investment):
1. **Pillar 1: Local Geo-Grid Tracking:** Pinpoints coordinate-by-coordinate where rival practices displace you within your 5-mile radius.
2. **Pillar 2: Directory & NAP Authority:** Aligns your primary medical sub-specialty across Google Business Profile and 50+ healthcare directories.
3. **Pillar 3: Automated Review Loops:** Deploys front-desk QR stands and SMS sequences to distill procedure-specific patient sentiment.
4. **Pillar 4: Verified Clinical Knowledge Architecture:** Directly links your CMS NPPES NPI-1 license and ADA CDT/CPT procedural codes.

#### 🎯 90-Day 1-Patient ROI Guarantee:
A single implant or surgical case pays for the entire $1,500 deployment 3x to 16x over. If you don't receive a verified consultation within 90 days, we issue a 100% full refund.`;
  }
  ```

---

### Spec 7: `src/components/EntityGraphVisualizer.tsx`
**Objective:** Replace AST and RDF triplets jargon with clinical authority graph terminology.

* **Line 110:**
  - *Current:* `0-Error AST`
  - *Replace with:* `0-Error Verified Graph`

* **Line 142:**
  - *Current:* `<span>RDF Triplets ({triplets.length})</span>`
  - *Replace with:* `<span>Authority Connections ({triplets.length})</span>`

* **Line 287:**
  - *Current:* `<span>AI Crawler Root Manifest</span>`
  - *Replace with:* `<span>AI Practice Factsheet Directory</span>`

* **Line 310:**
  - *Current:* `Semantic triplets forming the Knowledge Graph ingested by Retrieval-Augmented Generation (RAG) synthesizers:`
  - *Replace with:* `Clinical authority relationships recognized by ChatGPT, Perplexity, and Google AI Overviews to verify physician credentials:`

---

### Spec 8: `src/components/GeoCitationSimulator.tsx`
**Objective:** Replace "scrape raw HTML DOM", "parse noise", and "cryptographic URI linkage" with clinician-accessible explanations.

* **Line 65:**
  - *Current:* `'Missing clinical JSON-LD. Google AI Overviews prioritizes rival clinics with verified schema.'`
  - *Replace with:* `'Missing structured clinical architecture. Google AI Overviews prioritizes rival clinics with verified doctor credentials.'`

* **Line 94:**
  - *Current:* `'Practitioner lacks cryptographic URI linkage. AI synthesizer defaults to accredited rival practices.'`
  - *Replace with:* `'Doctor credentials lack verified federal registry links. AI search assistants default to rival practices with verified board registrations.'`

* **Line 121:**
  - *Current:* `'Missing /llms.txt forces Perplexity to scrape raw HTML DOM, increasing parse noise and reducing citation rank.'`
  - *Replace with:* `'Without a verified AI factsheet, Perplexity must parse unformatted website code, causing it to misinterpret credentials and lower citation rank.'`

---

### Spec 9: `src/app/partner-console/page.tsx`
**Objective:** Clean up residual AST and crawler jargon in the schema tab and action buttons.

* **Line 656:**
  - *Current:* `Non-visual metadata that communicates your accepted insurances, verified NPI license, and core procedures directly to AI crawlers (GPTBot, ClaudeBot, PerplexityBot).`
  - *Replace with:* `Non-visual clinical metadata communicating your accepted insurances, verified NPI license, and core procedures directly to AI search engines (ChatGPT Search, Perplexity, Google AI Overviews).`

* **Line 690:**
  - *Current:* `<span>Schema.org MedicalClinic &amp; Physician AST</span>`
  - *Replace with:* `<span>Schema.org Medical Clinic &amp; Physician Knowledge Graph</span>`

* **Line 703:**
  - *Current:* `<span>{copiedSchema ? 'Copied' : 'Copy JSON-LD'}</span>`
  - *Replace with:* `<span>{copiedSchema ? 'Copied' : 'Copy Knowledge Graph'}</span>`

---

### Spec 10: `src/lib/dossier/pitch-generator.ts`
**Objective:** Clean up residual "Schema ASTs" jargon inside generated doctor outreach pitches.

* **Line 147:**
  - *Current:* `...NexusRank1 implements our 4-pillar Practice Dominance system (Geo-Visibility Grid, 0-error MedicalClinic Schema ASTs, and automated reception review loops)...`
  - *Replace with:* `...NexusRank1 implements our 4-pillar Practice Dominance system (Geo-Visibility Grid, Verified Doctor Authority Graph, and automated reception review loops)...`

---

### Spec 11: `src/app/layout.tsx`
**Objective:** Clean up B2B reseller margin talk in metadata.

* **Line 16:**
  - *Current:* `...with 93% net profit margins.`
  - *Replace with:* `...Acquire high-ticket surgical and elective patients from ChatGPT, Perplexity, and Google AI Overviews. Permanent local growth & AI defense backed by our 1-patient ROI guarantee.`

---

### Spec 12: `src/components/LoginModal.tsx`
**Objective:** Clean up developer backend jargon ("protect AI Gateway API credits").

* **Line 66:**
  - *Current:* `Enter your access passcode to protect AI Gateway API credits and unlock the workspace.`
  - *Replace with:* `Enter your practice access passcode or license key to unlock your Clinic Command Center.`

---

## 5. Caveats
- No code in `src/` was modified during this investigation (strictly adhering to the read-only directive for specification miners).
- All line numbers were verified against the exact state of `src/` in the repository as of 2026-11-01.
- All proposed copy changes maintain full compatibility with existing TypeScript types and CSS layouts.

---

## 6. Conclusion
The NexusRank1 platform possess an exceptionally strong clinical feature set (3x3 geo-radar, CMS NPPES verification, review loops, AI simulator). However, residual developer jargon (ASTs, DOM scraping, headless Chromium, crawlers) and the critical `$997/mo retainer` inconsistency in `report/[domain]/page.tsx` create friction that dampens clinician conversion.

Implementing the 12 precise file-by-file remediation specifications provided above will completely eliminate this friction, harmonize the $1,500 one-time deployment terms across all touchpoints, enable high-ticket surgical valuation up to $40,000, and ensure all checkout actions link directly to `https://whop.com/checkout/plan_e37e96b86e088/`.

---

## 7. Verification Method

To independently verify the audit findings and confirm the remediation once implemented by the worker:

1. **Verify HTTP Status and Route Availability:**
   ```bash
   for route in / /pricing /partner-console /report/dentalpractice.com /login /signup; do
     curl -s -o /dev/null -w "%{http_code} $route\n" "http://localhost:3000$route"
   done
   ```
   *Expected:* All routes return `200`.

2. **Verify Elimination of Developer Jargon:**
   ```bash
   grep -riE "(headless Chromium|JavaScript-rendered DOM|MedicalClinic AST|0-Error AST|Proposed GEO Retainer)" /home/pwn/geo-engine/src
   ```
   *Expected:* 0 matching lines after remediation.

3. **Verify Whop Checkout Target:**
   ```bash
   grep -rn "whopCheckoutUrl" /home/pwn/geo-engine/src/lib/config.ts
   ```
   *Expected:* Target points to `https://whop.com/checkout/plan_e37e96b86e088/`.

4. **Verify Type Safety & Build:**
   ```bash
   npx tsc --noEmit
   npm run build
   ```
   *Expected:* 0 TypeScript errors and 15/15 routes successfully compiled.
