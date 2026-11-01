# Scope: NexusRank1 Browser Testing, Clinician UX Evaluation & Remediation

## Architecture
- Next.js web application running at `http://localhost:3000`
- Components in `src/components/`, pages in `src/app/`, API routes in `src/app/api/`
- Lead engine & scoring modules in `src/lib/`

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Instant Audit Bar Presets & Input | 4 preset buttons, custom input, live audit progress animation, radial gauge | M1 | ORIGINAL_REQUEST §R1.1 |
| 2 | Instant Audit Bar 7 Tabs | Competitor Grid, Profile & Directories, Review Loops & QR, AI Factsheet, Live AI Simulator, Doctor Licensure Graph, Clinical Checklist | M1 | ORIGINAL_REQUEST §R1.1 |
| 3 | Webmaster Code & Links | Webmaster Code toggle (showRawCode), Copy Code, Rich Results test link | M1 | ORIGINAL_REQUEST §R1.1 |
| 4 | Global Export Toolbar | Whop checkout, Live Public Report, Vector PDF export, JSON download, Practice Manager Dispatch modal | M1 | ORIGINAL_REQUEST §R1.1 |
| 5 | ROI Calculator | Specialty buttons, Case Value and Expected Patient sliders, dynamic formula calculations | M1 | ORIGINAL_REQUEST §R1.2 |
| 6 | Corner Chat Widget | Opening, sending inquiries, receiving responses with $1,500 terms, closing | M1 | ORIGINAL_REQUEST §R1.3 |
| 7 | Partner Console | 4 tabs (Overview, Competitor Radar, Clinical Schema, Settings), saving settings, toast notifications | M1 | ORIGINAL_REQUEST §R1.4 |
| 8 | Supporting Routes | Pricing (/pricing), Public Report (/report/[domain]), Login (/login), Signup (/signup) | M1 | ORIGINAL_REQUEST §R1.5 |
| 9 | Clinician Persona Evaluation | Eliminate developer jargon, verify clinical/financial framing, friction removal | M2 | ORIGINAL_REQUEST §R2 |
| 10 | Automated Remediation | Fix all defects, visual glitches, and broken links found during testing | M3 | ORIGINAL_REQUEST §R3 |
| 11 | Build & Type Integrity | 0 TypeScript errors (npx tsc --noEmit), 15/15 routes pass production compilation (npm run build) | M3 | Acceptance Criteria |
| 12 | Independent Verification & Audit | Multi-agent review, adversarial stress testing, forensic integrity audit | M4 | Methodology |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Browser Functional Testing | Interactive test across all 8 feature areas on localhost:3000 | Dev server running | IN_PROGRESS |
| M2 | Clinician Persona & UX Evaluation | Language audit, value proposition, conversion friction analysis | M1 | PLANNED |
| M3 | Code Remediation & Build Verification | Bug fixing, TypeScript zero-errors, production build pass | M1, M2 | PLANNED |
| M4 | Independent Review & Forensic Audit | Reviewers, Challengers, Forensic Auditor gate pass | M3 | PLANNED |
