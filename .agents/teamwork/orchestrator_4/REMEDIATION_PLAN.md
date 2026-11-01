# Consolidated Remediation Plan: NexusRank1 Platform

## Issue Synthesis from M1 & M2 Specializations

### 1. Whop Checkout URL Alignment
- **Requirement**: All external checkout links must point to `https://whop.com/checkout/plan_e37e96b86e088/`.
- **Target Files**:
  - `.env.local`: `NEXT_PUBLIC_WHOP_CHECKOUT_URL=https://whop.com/checkout/plan_e37e96b86e088/`
  - `src/lib/config.ts`: `CLINIC_OFFER_CONFIG.whopCheckoutUrl` and fallback URL
  - Any direct link references in pricing or toolbar components.

### 2. Corner Chat Widget DOM Mounting & Clinician Response Alignment
- **Requirement**: Corner Chat Widget must open, send inquiries, receive responses with $1,500 one-time terms, and close.
- **Root Cause**: `CornerChatWidget` was created in `src/components/CornerChatWidget.tsx` but omitted from `src/app/layout.tsx`.
- **Target Files**:
  - `src/app/layout.tsx`: Import and render `<CornerChatWidget />`.
  - `src/app/api/chat/route.ts`: Enhance fallback responses with dedicated competitor displacement script and $1,500 one-time terms.

### 3. Auth Flow & Passcode Fixes
- **Requirement**: `/login` and `/signup` must have smooth clinician navigation and valid authentication.
- **Target Files**:
  - `src/app/api/auth/route.ts`: Add `'demo'` to `validPasscodes` list.
  - `src/app/login/page.tsx`: Add navigation link to `/signup`.
  - `src/app/signup/page.tsx`: Add staff role selector (e.g. Solo Owner Doctor vs Practice Manager) and navigation link to `/login`.

### 4. Patient Acquisition ROI Calculator Polish
- **Requirement**: High-ticket surgical case valuation and smooth dynamic calculations.
- **Target Files**:
  - `src/components/PatientRoiCalculator.tsx`: Expand case value slider up to $40,000 (reflecting full-arch / All-on-4 procedures), align slider step to 250, verify dynamic formula calculations.

### 5. Public Report Retainer Conflict Resolution
- **Requirement**: Eliminate contradictory "$997/mo retainer" toggle in favor of "$1,500 One-Time Deployment • 0 Monthly Retainers".
- **Target Files**:
  - `src/app/report/[domain]/page.tsx`: Update ROI modeler to emphasize $1,500 one-time investment and 1-patient payback guarantee.

### 6. Clinician Persona & Jargon Elimination
- **Requirement**: Replace residual engineering jargon across 12 files with clinician-centric terminology.
- **Reference**: `/home/pwn/geo-engine/.agents/teamwork/spec_miner_clinician_ux_1/handoff.md`

### 7. Verification Gates
- **TypeScript**: `npx tsc --noEmit` must pass with 0 errors.
- **Production Build**: `npm run build` must compile 15/15 routes cleanly.
- **Browser Re-verification**: Confirm all routes and interactive elements load and function without console errors.
