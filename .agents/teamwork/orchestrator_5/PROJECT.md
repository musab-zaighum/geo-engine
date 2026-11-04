# Project: NexusRank1 Platform Redesign & Deployment

## Architecture
- **Framework**: Next.js 16.3.4 (App Router, Turbopack, standalone mode), React 19, TypeScript 5.4.
- **Frontend**:
  - `src/app/page.tsx`: Master 5-section landing page.
  - `src/components/ZipCodeAuditIntake.tsx`: Doctor-tailored intake card collecting clinical credentials for territory audits.
  - `src/components/PatientRoiCalculator.tsx`: Interactive ROI calculator modeling $20k–$50k full-arch and surgical elective cases.
  - `src/components/Navbar.tsx`: Global navigation linking to `#audit-intake`.
- **Backend / API**:
  - `src/app/api/lead/route.ts`: Node.js server route validating submissions with Zod, persisting to `leads/captured_leads.json`, and dispatching notifications directly to `name@nexusrank1.com`.
- **Deployment & Distribution**:
  - Next.js production build (`npm run build`).
  - Standalone static distribution package in `dist-netlify/` for Netlify Drop.
  - Export automation script: `scripts/build-netlify.mjs`.
- **Quality Assurance**:
  - Headless Google Chrome (Playwright) test suite: `scripts/verify-nexus-v5.mjs`.
  - TypeScript type check (`npx tsc --noEmit`).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Exact Hero Headline | "Ensure AI Search Recommends Your Clinic Over Local Competitors" | M2 | ORIGINAL_REQUEST line 159 |
| 2 | Exact Hero Subheadline | "The complete, automated local growth & AI audit system engineered exclusively for medical, dental, and aesthetic clinic owners. Dominate local search proximity on ChatGPT, Perplexity, and Google AI Overviews." | M2 | ORIGINAL_REQUEST line 160 |
| 3 | Hero CTA Smooth Scroll | "[ Request Your Zip Code Audit ]" with smooth scroll to `#audit-intake` and input focus | M2 | ORIGINAL_REQUEST line 161 |
| 4 | Clinical Badges & Licensure | CMS NPPES NPI Registry, Medical Board verified authority tags | M2 | ORIGINAL_REQUEST line 162 |
| 5 | 4 Done-For-You Growth Pillars | Geo-Visibility Grid Tracking, 0-Error Schema ASTs, Automated Review Loops, Strict Zip Code Exclusivity | M2 | ORIGINAL_REQUEST lines 164–170 |
| 6 | Doctor Intake Card UI | Sleek glassmorphic card replacing $1,500 checkout on homepage with 6 clinical fields | M2 | ORIGINAL_REQUEST lines 171–178 |
| 7 | Intake Submit Action | Button text "[ Submit Audit Request ]", loading state, in-card confirmation receipt | M2 | ORIGINAL_REQUEST lines 178, 181 |
| 8 | Instant Toast Notification | Immediate `sonner` toast confirmation referencing dispatch | M2 | ORIGINAL_REQUEST line 181 |
| 9 | Lead API Zod Validation | Strict schema validation with descriptive error reporting and backwards compatibility | M1 | ORIGINAL_REQUEST line 180 |
| 10 | Direct Email Forwarding | Submission dispatch configured to forward directly to `name@nexusrank1.com` | M1 | ORIGINAL_REQUEST line 180 |
| 11 | Lead Data Persistence | Captured audit records persisted to `leads/captured_leads.json` | M1 | Survey 2 |
| 12 | High-Ticket ROI Modeling | Full-arch case values ($20,000 to $50,000) explicitly highlighted and selectable | M2 | ORIGINAL_REQUEST lines 183–187 |
| 13 | 4 Specialty Toggles | All-on-4 Implants, Facial Plastic Surgery, Orthopedics, MedSpa | M2 | ORIGINAL_REQUEST line 187 |
| 14 | 1-Consultation ROI Proof | Mathematical proof that 1 elective patient covers system deployment multiple times | M2 | ORIGINAL_REQUEST line 186 |
| 15 | Clinical FAQ Section | Answers for Medical Board Compliance, HIPAA Zero-PHI Safety, and 48-Hour Turnaround | M2 | ORIGINAL_REQUEST lines 189–194 |
| 16 | Navigation & Banner Sync | Update header and mobile CTAs to point to `#audit-intake` | M2 | Survey 1 & 2 |
| 17 | Next.js Production Build | Dual build: `npm run build` compiling 15/15 routes with 0 errors | M3 | ORIGINAL_REQUEST line 196 |
| 18 | Netlify Drop Static Export | Standalone package in `dist-netlify/` with HTML, assets, `_redirects`, `_headers` | M3 | ORIGINAL_REQUEST line 196 |
| 19 | Headless Chrome Browser Suite | Automated Playwright verification of all 5 sections, form flow, viewports, 0 errors | M4 | ORIGINAL_REQUEST line 197 |
| 20 | Static Export Browser Check | Headless browser loads `dist-netlify/` with HTTP 200 and 0 console errors | M4 | ORIGINAL_REQUEST line 197 |
| 21 | Zero TypeScript Errors | `npx tsc --noEmit` passes with 0 errors | M4 | ORIGINAL_REQUEST line 212 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Backend Lead API & Email Dispatch Engine | Implement Zod validation, support 6 clinical fields, dispatch forwarding to `name@nexusrank1.com`, and persistence in `src/app/api/lead/route.ts` and `src/lib/types.ts` | none | DONE |
| M2 | Frontend 5-Section Architecture & Clinical Intake Pipeline | Implement `ZipCodeAuditIntake.tsx`, update `page.tsx` (R1 Hero, R2 4 Pillars, R3 Mount Intake Section, R4 ROI Math, R5 Clinical FAQ), update `Navbar.tsx` and `PatientRoiCalculator.tsx` | M1 | DONE |
| M3 | Dual Deployment & Static Export Pipeline | Implement `scripts/build-netlify.mjs`, update `package.json` build scripts, verify `dist-netlify/` generation | M2 | DONE |
| M4 | Headless Chrome E2E Verification & Certification | Implement `scripts/verify-nexus-v5.mjs`, run functional & visual browser checks across viewports with 0 console errors, run `npx tsc --noEmit` | M1, M2, M3 | DONE |

## Interface Contracts
### Client Intake Card ↔ `/api/lead`
- **Request Method**: `POST /api/lead`
- **Headers**: `Content-Type: application/json`
- **Payload Schema**:
  ```ts
  {
    practiceName: string; // required
    doctorName: string;   // required
    domain: string;       // required, sanitized
    cityZip: string;      // required
    email: string;        // required, RFC email format
    phone: string;        // required
    notes?: string;       // optional
    source?: string;      // optional
  }
  ```
- **Success Response (HTTP 200)**:
  ```json
  {
    "success": true,
    "status": "success",
    "message": "Practice consultation request registered and forwarded directly to name@nexusrank1.com.",
    "dispatch": {
      "forwardedTo": "name@nexusrank1.com",
      "recipient": "name@nexusrank1.com",
      "status": "delivered",
      "timestamp": "2026-11-04T..."
    },
    "lead": { ... }
  }
  ```
- **Error Response (HTTP 400)**:
  ```json
  {
    "error": "Error description string",
    "issues": [ ... ]
  }
  ```

## Code Layout
- `src/app/api/lead/route.ts`: Node.js server route handling POST `/api/lead`.
- `src/lib/types.ts`: Shared TypeScript interfaces for lead input and dispatch.
- `src/components/ZipCodeAuditIntake.tsx`: Doctor intake card component with ID `audit-intake`.
- `src/components/PatientRoiCalculator.tsx`: ROI calculator with 4 specialty toggles and $20k–$50k case modeling.
- `src/components/Navbar.tsx`: Global navigation header.
- `src/app/page.tsx`: Main landing page (5-section architecture).
- `scripts/build-netlify.mjs`: Static export distributor for Netlify Drop.
- `scripts/verify-nexus-v5.mjs`: Automated headless Chrome test suite.
- `dist-netlify/`: Output static package for Netlify Drop.
