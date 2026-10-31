## 2026-10-31T21:38:41Z
Your identity: Milestone 2 Scrapers and Qualification Polish Worker (worker_m2_1).
Working directory: /home/pwn/geo-engine/.agents/teamwork/worker_m2_1
Project root directory: /home/pwn/geo-engine
Target output directory: /home/pwn/geo-engine/leads
Parent conversation ID: f1e9e290-ce66-4f4f-88d5-1005ccaeca98

Read the original request at /home/pwn/geo-engine/.agents/teamwork/ORIGINAL_REQUEST.md before starting work.
Also read:
- /home/pwn/geo-engine/.agents/teamwork/orchestrator_1/PROJECT.md
- /home/pwn/geo-engine/.agents/teamwork/challenger_m1_3/handoff.md
- /home/pwn/geo-engine/.agents/teamwork/auditor_m1_2/handoff.md
- /home/pwn/geo-engine/.agents/teamwork/explorer_survey_1/handoff.md
- /home/pwn/geo-engine/TEST_READY.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Scope & Exclusive File Ownership:
You exclusively own:
- src/lib/scrapers/types.ts
- src/lib/scrapers/maps-scraper.ts
- src/lib/scrapers/ads-verifier.ts
- src/lib/scrapers/competitor-finder.ts
- src/lib/scrapers/index.ts
- tests/unit/scrapers.test.ts
- src/lib/qualification/ (apply the 9 small edge cases from challenger_m1_3)
- tests/unit/qualification.test.ts
You MUST NOT edit files outside this scope.

Your Mission:
1. Polish Milestone 1 with the 9 edge cases documented in /home/pwn/geo-engine/.agents/teamwork/challenger_m1_3/handoff.md:
   - In `dso-filter.ts`: match multi-level Workday subdomains like `.wd1.myworkdayjobs.com`, clean chained auth URLs in domain normalization, scan outbound parent DSO hyperlinks in HTML.
   - In `clinical-filter.ts`: add pediatric negation ("we do not offer pediatric", "no pediatric") and disregard "baby teeth" when discussing adult congenital missing teeth / implants; expand Medicaid negation ("excludes medicaid", "non-medicaid").
   - In `npi-verifier.ts`: allow "Associate Fellow, American Academy of Implant Dentistry" (AAID) in doctor titles; assert Oral Pathology `1223P0106X` as non-approved.
   - In `affluent-zips.ts`: ensure ZIP+4 without leading zero (e.g. `6830-1234`) normalizes to `06830`.
2. Implement Milestone 2 Scraping & Signal Pipeline in `src/lib/scrapers/`:
   - `src/lib/scrapers/types.ts`: Define scraping data models (MapsRankResult, GoogleAdsSignal, CompetitorResult).
   - `src/lib/scrapers/maps-scraper.ts`: Stealth Playwright scraper using system Google Chrome (from `src/lib/playwright-scraper.ts`) to query Google Maps Local Finder for `"dental implants {City} {State}"` and `"all on 4 {City} {State}"`, extract organic rank #4–#6 and rank #1 local competitor.
   - `src/lib/scrapers/ads-verifier.ts`: Verifies active paid Google Ads signal on high-intent terms ("Sponsored" ad detection).
   - `src/lib/scrapers/competitor-finder.ts`: Haversine calculation strictly enforcing <= 5.0 miles, confirming rank #1 competitor name, address, reviews, rating.
   - `src/lib/scrapers/index.ts`: Unified export.
   - `tests/unit/scrapers.test.ts`: Comprehensive test suite verifying all scrapers with mock and live options.
3. Verification:
   - Run `npx tsx tests/unit/qualification.test.ts`
   - Run `npx tsx tests/unit/scrapers.test.ts`
   - Run `npx tsx tests/e2e/run-all-tests.ts`
   - Run `npx tsc --noEmit` and `npm run build`
4. Write your report to `/home/pwn/geo-engine/.agents/teamwork/worker_m2_1/handoff.md`.
5. Send a message to your parent (`f1e9e290-ce66-4f4f-88d5-1005ccaeca98`) with your status and path to handoff.md.
