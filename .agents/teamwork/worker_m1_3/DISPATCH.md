## 2026-11-01T03:09:51Z

You are Worker M1-3 (worker_m1_3) for Project Orchestrator (orchestrator_3).
Your working directory is: /home/pwn/geo-engine/.agents/teamwork/worker_m1_3
Project root: /home/pwn/geo-engine

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

MANDATORY: Read the following input files before writing any code:
1. /home/pwn/geo-engine/.agents/teamwork/ORIGINAL_REQUEST.md
2. /home/pwn/geo-engine/.agents/teamwork/orchestrator_3/PROJECT.md
3. /home/pwn/geo-engine/.agents/teamwork/explorer_survey_3_2/handoff.md (Sections 4.1, 4.2, 4.3)
4. /home/pwn/geo-engine/.agents/teamwork/explorer_survey_3_3/handoff.md (Sections 2 and 4)

Your Exclusive Write Ownership:
- `src/lib/scrapers/maps-scraper.ts`
- `src/lib/scrapers/competitor-finder.ts`
- `src/lib/scrapers/ads-verifier.ts`
- `tests/e2e/helpers/qualification-oracle.ts`
- `tests/unit/qualification.test.ts`
DO NOT modify any other files in this milestone.

Your Milestone Objectives:
1. `src/lib/scrapers/maps-scraper.ts`:
   - Expand `METRO_MAPS_CATALOG` with entries for the newly scouted corridors:
     - `new_york_ny` (Manhattan UES & Midtown)
     - `palo_alto_ca` / `los_altos_ca` / `atherton_ca` (Silicon Valley)
     - `jupiter_fl` / `palm_beach_fl` (Palm Beach & Jupiter)
     - `dallas_tx` (Park Cities & Preston Hollow)
     - `aspen_co` & `vail_co` (Colorado luxury)
   - Ensure listings include Rank #1 competitors and Ranks #4-#6 overflow candidates with realistic addresses, phones, ratings, review counts, and surgical implant positioning.
2. `src/lib/scrapers/competitor-finder.ts`:
   - Expand `METRO_RANK1_COMPETITORS` with genuine local Rank #1 competitor anchors for each corridor cluster:
     - Manhattan: New York Center for Dental Restorations (400 E 56th St, 10022; 40.7578, -73.9632)
     - Silicon Valley: Peninsula Center for Implantology (2290 Birch St, Palo Alto, CA 94306; 37.4278, -122.1445)
     - Jupiter: Jupiter Periodontics & Dental Implants (1004 S Old Dixie Hwy, 33458; 26.9285, -80.0895)
     - Palm Beach: Palm Beach Island Oral Surgery (Royal Palm Way, 33480; 26.7025, -80.0410)
     - Scottsdale North: Dental Implant Institute (8787 E Pinnacle Peak Rd, 85255; 33.6985, -111.8925)
     - Dallas Park Cities: Dallas Dental Arts (2100 Ross Ave, 75201; 32.7885, -96.7975)
     - Aspen: Roaring Fork Oral Surgery (E Hopkins Ave, Aspen, CO 81611; 39.1905, -106.8210)
     - Vail: Vail Valley Dental Arts (E Meadow Dr, Vail, CO 81657; 39.6415, -106.3765)
   - Verify that competitor rank is strictly 1 and coordinates allow distance <= 5.0 miles from target practices in those clusters.
3. `src/lib/scrapers/ads-verifier.ts`:
   - Expand `VERIFIED_ADS_CATALOG` with entries for domains across the expanded corridors.
4. `tests/e2e/helpers/qualification-oracle.ts`:
   - Synchronize `AFFLUENT_ZIPS` with `src/lib/qualification/affluent-zips.ts` to include all 23 zip codes from R1 (10021, 10065, 10075, 10022, 94027, 94301, 94022, 94024, 33480, 33458, 33477, 85255, 85262, 85253, 85266, 92660, 92625, 92657, 75205, 75225, 75209, 81611, 81657) so that the oracle validates them as affluent (Median HHI > $120k).
5. `tests/unit/qualification.test.ts`:
   - Fix assertion on `assertEqual(metros.length, 7)` to `assert(metros.length >= 7)` so that the expanded catalog in `affluent-zips.ts` passes 100%.

Verification Requirements:
Run and report the exact results of:
1. `npx tsx tests/unit/qualification.test.ts` (expect 145/145 pass)
2. `npx tsx tests/unit/scrapers.test.ts` (expect 79/79 pass)
3. `npx tsx tests/e2e/run-all-tests.ts` (expect 125/125 pass)
4. `npx tsc --noEmit` (expect 0 type errors)

Deliverables:
- Write your comprehensive work and verification report to `/home/pwn/geo-engine/.agents/teamwork/worker_m1_3/handoff.md`.
- Update your progress in `/home/pwn/geo-engine/.agents/teamwork/worker_m1_3/progress.md`.
- Send a completion message to the orchestrator referencing the handoff path.
