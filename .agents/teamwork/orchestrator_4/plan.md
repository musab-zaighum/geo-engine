# Master Plan: NexusRank1 Browser Testing, Clinician UX Evaluation & Remediation

## Executive Objective
Execute an exhaustive, browser-based functional, visual, and clinician UX test suite across the entire NexusRank1 platform on http://localhost:3000 using browser agents. Test every button, form, tab, modal, calculator slider, and export flow. Eliminate developer jargon, verify conversion framing, remediate all identified defects, and verify 0 TypeScript errors and 15/15 routes compiling cleanly in production.

## Phased Execution Strategy

### Phase 1: M1 - Comprehensive Interactive UI & Browser Functional Testing
- **Subagents**: 3 Explorers / Spec Miners:
  - `explorer_ui_home`: Focuses on Homepage (`/`), Instant Audit Bar (`#audit-bar`), 4 preset domain buttons, custom domain input, audit progress animation, radial score gauge, all 7 tabs (Competitor Grid, Profile & Directories, Review Loops & QR, AI Factsheet, Live AI Simulator, Doctor Licensure Graph, Clinical Checklist), Webmaster Code toggle (`showRawCode`), Copy Code / Rich Results test links, Global Export Toolbar (Whop checkout link, Live Public Report, Vector PDF export, JSON download, Practice Manager Dispatch modal).
  - `explorer_ui_tools`: Focuses on ROI Calculator (specialty buttons, Case Value and Expected Patient sliders, formula verification), Corner Chat Widget (opening, sending inquiries, checking $1,500 one-time terms response, closing), and Pricing page (`/pricing`).
  - `explorer_ui_console_auth`: Focuses on Clinic Command Center (`/partner-console`: Overview, Competitor Radar, Clinical Schema, Settings, saving & toast notifications), Public Report (`/report/[domain]`), Login (`/login`), and Signup (`/signup`).
- **Verifications**:
  - Dev server status on http://localhost:3000 (start if needed).
  - Console errors / unhandled exceptions / HTTP 500s.
  - Interactive state transitions, button clicks, slider drags, modal opens/closes, link targets.

### Phase 2: M2 - Clinician Persona & Conversion Evaluation
- **Subagents**: Spec Miner / Evaluator (`spec_miner_clinician_ux`):
  - Audit every page through the clinician persona lens (solo implant surgeons, cosmetic dentists, medspa medical directors).
  - Check for developer jargon ("SEO", "meta tags", "scraped", "DOM", "payload", "crawling") vs clinical/financial terminology ("Case Acquisition", "Full-Arch Revenue", "Patient Trust Signal", "Clinical Schema", "Verified Licensure").
  - Evaluate pricing transparency, $1,500 one-time deployment terms, ROI calculator clarity, Whop checkout links (`https://whop.com/checkout/plan_e37e96b86e088/`).

### Phase 3: M3 - Automated Code Remediation & Build Verification
- **Subagents**: Remediation Worker (`worker_remediation`):
  - Aggregate all issues, visual glitches, console errors, broken links, or friction points found in M1 and M2.
  - Apply clean, modular code fixes in Next.js components.
  - Run `npx tsc --noEmit` to verify 0 TypeScript errors.
  - Run `npm run build` to verify 15/15 routes pass production compilation.
  - Re-verify fixed components via browser checks.

### Phase 4: M4 - Multi-Agent Verification, Adversarial Hardening & Forensic Audit
- **Subagents**:
  - 2 Reviewers (`teamwork_preview_reviewer`): Check code quality, accessibility, visual design, UX polish, and build results.
  - 2 Challengers (`teamwork_preview_challenger`): Adversarial stress testing of edge-case inputs, malformed domains, rapid slider movement, extreme inputs, mobile viewport responsiveness.
  - 1 Forensic Auditor (`teamwork_preview_auditor`): Independent verification of authenticity, checking no hardcoding or dummy facades, verifying genuine calculations and API integrations.

### Phase 5: Handoff & Reporting
- Generate comprehensive `handoff.md` and report to Sentinel.
