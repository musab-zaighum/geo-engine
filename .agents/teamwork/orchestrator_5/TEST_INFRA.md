# E2E Test Infra: NexusRank1 Platform Redesign

## Test Philosophy
- Requirement-driven, opaque-box functional verification.
- Exercising the platform as an elective surgery or cosmetic clinic owner would.
- Zero tolerance for console errors, unhandled rejections, or broken links.

## Feature Inventory & Test Coverage
| # | Feature | Requirement | Verification Method |
|---|---------|-------------|---------------------|
| 1 | Exact Hero Headline | R1 | Headless Chrome DOM assertion (`h1` exact text match) |
| 2 | Exact Hero Subheadline | R1 | Headless Chrome DOM assertion (`p` exact text match) |
| 3 | Hero CTA Smooth Scroll | R1 | Click `[ Request Your Zip Code Audit ]`, assert scroll offset & focus on `#audit-intake` |
| 4 | Clinical Authority Badges | R1 | Assert CMS NPPES, Medical Board, HIPAA Safe badges rendered |
| 5 | 4 Clinical Growth Pillars | R2 | Assert Geo-Grid, 0-Error Schema ASTs, Review Loops, Strict Zip Code Exclusivity cards |
| 6 | Doctor Intake Card Fields | R3 | Assert Practice Name, Doctor Name, Domain & City/Zip, Email/Phone inputs present |
| 7 | Form Validation | R3 | Submit empty form, assert validation error display |
| 8 | Form Submission & Dispatch | R3 | Fill valid data, submit, assert HTTP 200 from `/api/lead` with `name@nexusrank1.com` dispatch |
| 9 | Toast & In-Card Confirmation | R3 | Assert immediate `sonner` toast rendered and in-card confirmation state displayed |
| 10 | ROI Full-Arch Case Values | R4 | Assert $20,000 to $50,000 case values rendered in calculator |
| 11 | 4 Specialty Toggles | R4 | Click All-on-4, Facial Plastic Surgery, Orthopedics, MedSpa; assert dynamic updates |
| 12 | 1-Consultation ROI Proof | R4 | Assert copy confirming 1 case covers entire deployment multiple times |
| 13 | Clinical FAQ Section | R5 | Expand Medical Board Compliance, HIPAA Zero-PHI Safety, 48-Hour Turnaround FAQs |
| 14 | Responsive Viewports | R6 | Test Desktop (1440x900), Tablet (768x1024), and Mobile (375x812) viewports |
| 15 | 0 Console Errors Gate | R6 | Listen to `page.on('console')` and `page.on('pageerror')`, assert 0 errors |
| 16 | Netlify Drop Static Package | R6 | Serve `dist-netlify/` on static HTTP server, load in Chrome, assert HTTP 200 & 0 console errors |

## Test Architecture
- **Runner**: Playwright / Google Chrome 156 (`/run/current-system/sw/bin/google-chrome`).
- **Test Scripts**:
  - `scripts/verify-nexus-v5.mjs`: Complete automated headless browser verification suite.
  - `tests/e2e/run-all-tests.ts`: Pipeline qualification regression test suite (125 tests).
- **Execution Command**: `node scripts/verify-nexus-v5.mjs`
