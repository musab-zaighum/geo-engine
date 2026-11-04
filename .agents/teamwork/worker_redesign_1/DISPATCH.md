## 2026-11-04T12:12:48Z
You are Worker Redesign 1.
Your working directory is /home/pwn/geo-engine/.agents/teamwork/worker_redesign_1.

DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

You MUST read /home/pwn/geo-engine/.agents/teamwork/ORIGINAL_REQUEST.md first (especially the section starting at line 149).
Also read the detailed survey handoff reports which contain exact tested code snippets and architectural specifications:
- /home/pwn/geo-engine/.agents/teamwork/explorer_survey_1/handoff.md (Frontend UI & 5-section architecture)
- /home/pwn/geo-engine/.agents/teamwork/explorer_survey_2/handoff.md (Backend Lead API & ZipCodeAuditIntake component)
- /home/pwn/geo-engine/.agents/teamwork/explorer_survey_3/handoff.md (Build-Netlify script & static export)

Your exclusive file ownership:
- `src/app/api/lead/route.ts`
- `src/lib/types.ts`
- `src/components/ZipCodeAuditIntake.tsx`
- `src/app/page.tsx`
- `src/components/Navbar.tsx`
- `src/components/PatientRoiCalculator.tsx`
- `scripts/build-netlify.mjs`
- `package.json`

Implementation Tasks:
1. R1. Hero Header (Above the Fold) in `src/app/page.tsx`:
   - Exact Headline: "Ensure AI Search Recommends Your Clinic Over Local Competitors"
   - Exact Subheadline: "The complete, automated local growth & AI audit system engineered exclusively for medical, dental, and aesthetic clinic owners. Dominate local search proximity on ChatGPT, Perplexity, and Google AI Overviews."
   - Primary CTA button text: "[ Request Your Zip Code Audit ]" scrolling smoothly to `#audit-intake` and focusing the first input (`practiceName`).
   - High-trust clinical badges, CMS NPPES licensure tags, and authority indicators.
2. R2. Core Done-For-You Features in `src/app/page.tsx`:
   - Update the 4 clinical growth pillars:
     1. Geo-Visibility Grid Tracking & Zip Code Benchmarking (Weekly mapping of 5-mile radius)
     2. 0-Error MedicalClinic Schema ASTs (Enterprise technical code)
     3. Automated Review Loops & Front-Desk Engine (Seamless capture of 5-star Google reviews)
     4. Strict Zip Code Exclusivity (Locking out local rivals permanently)
3. R3. Intake Form Section & Lead Dispatch:
   - Create `src/components/ZipCodeAuditIntake.tsx` mounted at `<section id="audit-intake">` in `src/app/page.tsx` (replacing the fixed $1,500 `<PricingSection />` on line 330).
   - Sleek doctor-tailored card collecting: Practice Name, Doctor / Surgeon Name, Website Domain & City/Zip Code, Direct Email / Phone.
   - Button text: "[ Submit Audit Request ]".
   - Success state: In-card confirmation receipt displaying territory review status and dispatch notification to `name@nexusrank1.com`, plus immediate `sonner` toast notification.
   - Update `src/app/api/lead/route.ts`: Zod validation schema supporting all 6 fields, persist to `leads/captured_leads.json`, configure email dispatch forwarding to `name@nexusrank1.com`, and return `{ success: true, dispatch: { forwardedTo: 'name@nexusrank1.com', ... }, lead: ... }`. Preserve backwards compatibility with existing test suites.
   - Update `src/components/Navbar.tsx` desktop and mobile CTAs to point to `/#audit-intake` ("Request Zip Code Audit").
   - Update bottom CTA banner in `src/app/page.tsx` to point to `#audit-intake`.
4. R4. The ROI Proof & Math Section in `src/components/PatientRoiCalculator.tsx`:
   - Highlight full-arch case values ($20,000 to $50,000 per case).
   - 4 interactive specialty toggles: All-on-4 Implants, Facial Plastic Surgery, Orthopedics, MedSpa.
   - Extend slider to $50,000.
   - Explicit callout: Securing just a single patient consultation covers the system deployment multiple times over.
   - Point secondary CTA button to `#audit-intake`.
5. R5. Clinical FAQ Section in `src/app/page.tsx`:
   - Medical Board Compliance (AMA/ADA guidelines).
   - HIPAA Safety (Zero PHI processed; public credentials only).
   - Fast Deployment (100% done-for-you in 48 hours).
   - Strict Zip Code Exclusivity and ROI questions.
6. R6. Dual Deployment:
   - Implement `scripts/build-netlify.mjs` to copy pre-rendered HTML (`index.html`, etc.), `_next/static/`, `public/` assets, `_redirects`, and `_headers` into `dist-netlify/` ready for Netlify Drop.
   - Update `package.json` scripts: `"build": "next build && node scripts/build-netlify.mjs"`, `"export:netlify": "node scripts/build-netlify.mjs"`.

Verification:
- Run `npx tsc --noEmit` and confirm 0 errors.
- Run `npm run build` and confirm all 15 routes build cleanly and `dist-netlify/` is generated.
- Verify `POST /api/lead` returns HTTP 200 with dispatch to `name@nexusrank1.com`.
- Document all changes, exact commands run, and verification outputs in `/home/pwn/geo-engine/.agents/teamwork/worker_redesign_1/handoff.md`.
- Send a message back to the orchestrator when completed.
