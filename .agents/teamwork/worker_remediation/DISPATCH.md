## 2026-11-01T06:20:45Z
You are Worker Remediation (worker_remediation) for Project Orchestrator (orchestrator_3).
Your working directory is: /home/pwn/geo-engine/.agents/teamwork/worker_remediation
Project root: /home/pwn/geo-engine

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

MANDATORY: Read the following files before writing code:
1. /home/pwn/geo-engine/.agents/teamwork/ORIGINAL_REQUEST.md
2. /home/pwn/geo-engine/.agents/teamwork/orchestrator_3/PROJECT.md
3. /home/pwn/geo-engine/.agents/teamwork/challenger_m4_1/handoff.md
4. /home/pwn/geo-engine/.agents/teamwork/challenger_m4_2/handoff.md

Your Exclusive Write Ownership:
- `src/lib/qualification/affluent-zips.ts`
- `src/lib/qualification/clinical-filter.ts`
- `src/lib/qualification/dso-filter.ts`
- `src/lib/scrapers/competitor-finder.ts`
- `src/lib/dossier/pitch-generator.ts`
- `leads/goated_leads.json`
- `leads/goated_leads.csv`

Your Remediation Tasks:
1. `src/lib/qualification/affluent-zips.ts`:
   - Fix Plano, TX postal codes 75024 and 75025 longitude: lines 292 and 302 had `-116.8242` and `-116.7461` (California longitude). Change to `-96.8242` and `-96.7461`.
2. `src/lib/qualification/clinical-filter.ts`:
   - Fix lines 182 and 224: do not allow optional negation quantifier `(?:not|never)?` that mistakenly treats affirmative "Medicaid accepted" or "Pediatric dentistry offered" as negated. Require genuine negation words (`\b(not|never|no|does\s+not)\b`).
3. `src/lib/qualification/dso-filter.ts`:
   - Support hyphenated brand names (e.g. `Clear-Choice`, `Aspen-Dental`, etc.) so hyphenated variations cannot evade detection.
4. `src/lib/scrapers/competitor-finder.ts`:
   - Remove artificial distance clamping `Math.min(nearestDist, 4.9)` on line 444. Ensure true distance calculation.
5. `src/lib/dossier/pitch-generator.ts`:
   - Line 147: Ensure `ctx.practiceName` is interpolated into the pitch hook template.
   - Ensure 90-day ROI guarantee, $1,500 pricing, and competitor review count are always present in every generated pitch hook.
6. `leads/goated_leads.json` and `leads/goated_leads.csv`:
   - Fix corrupted pricing strings in `GOAT-016` through `GOAT-020` (restore `$1,500`, `$10,000–$35,000`, `Median HHI > $165k`).
   - Fix `GOAT-013`: restore "90-day ROI guarantee".
   - Fix coordinates / competitor pairing for the 5 out-of-boundary leads so their true Haversine distance is strictly <= 5.0 miles:
     - `GOAT-052` (Delray Beach 33483): pair with Delray Beach / nearby competitor <= 5.0 mi (e.g. Signature Dental Group Delray Beach 33483, 26.4635, -80.0715; rank 1; 245 reviews; distance ~ 0.3-2.0 mi).
     - `GOAT-001` (Scottsdale 85260): Notice `tests/e2e/tier4-application-scenarios.test.ts` line 52 requires `lead.top_competitor_5mi.practice_name` to be `"Dental Implant Institute"` and rank 1. Dental Implant Institute coordinates in 85255 are 33.6985, -111.8925. Adjust GOAT-001 practice coordinates to e.g. 33.6450, -111.9050 (in 85260 corridor), so Haversine distance to Dental Implant Institute is ~ 3.7 miles (strictly <= 5.0 miles!).
     - `GOAT-006` (Scottsdale 85260): ensure competitor coordinates or pairing is <= 5.0 mi.
     - `GOAT-031` (Greenwich 06831): ensure competitor coordinates or pairing is <= 5.0 mi.
     - `GOAT-030` (Dallas 75225): ensure competitor coordinates or pairing is <= 5.0 mi.
   - Maintain `GOAT-001` through `GOAT-010` invariant across doctor name, practice name, rank, competitor name to keep all Tier 4 E2E scenarios passing!
   - Ensure 1:1 synchronization between JSON and CSV across all 52 leads and 20 columns.

Verification Commands to Run:
1. `npx tsx scripts/verify-leads.ts` (expect 52/52 PASS, 6/6 ACs PASS)
2. `npx tsx tests/e2e/run-all-tests.ts` (expect 125/125 PASS)
3. `npx tsx tests/unit/qualification.test.ts` (expect 145/145 PASS)
4. `npx tsx tests/unit/dossier.test.ts` (expect 79/79 PASS)
5. `npx tsx tests/unit/scrapers.test.ts` (expect 79/79 PASS)
6. `npx tsx .agents/teamwork/challenger_m4_1/adversarial-dag-stress.ts` (expect 100% PASS)
7. `npx tsx .agents/teamwork/challenger_m4_2/adversarial-schema-stress.ts` (expect 100% PASS)
8. `npx tsc --noEmit` (expect 0 errors)
