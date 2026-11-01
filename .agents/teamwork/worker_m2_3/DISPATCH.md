## 2026-11-01T03:24:38Z

You are Worker M2-3 (worker_m2_3) for Project Orchestrator (orchestrator_3).
Your working directory is: /home/pwn/geo-engine/.agents/teamwork/worker_m2_3
Project root: /home/pwn/geo-engine

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

MANDATORY: Read the following input files before writing any code:
1. /home/pwn/geo-engine/.agents/teamwork/ORIGINAL_REQUEST.md
2. /home/pwn/geo-engine/.agents/teamwork/orchestrator_3/PROJECT.md
3. /home/pwn/geo-engine/.agents/teamwork/explorer_survey_3_1/handoff.md (Sections 4.1 & 4.2: Proposed Architecture & Implementation Blueprint)
4. /home/pwn/geo-engine/.agents/teamwork/explorer_survey_3_3/handoff.md (Note the invariance of GOAT-001..GOAT-010)

Your Exclusive Write Ownership:
- `scripts/run-pipeline.ts`
DO NOT modify any other files in this milestone.

Your Milestone Objectives:
Enhance `scripts/run-pipeline.ts` to implement Requirement R4 (Automated Live Discovery Engine in Pipeline Runner):
1. **Live Candidate Discovery Engine (`discoverLiveCandidates`)**:
   - Ingest `TARGET_METRO_CORRIDORS` covering all 7 ultra-high-wealth corridors and validate affluent zip codes (`isAffluentZip`).
   - For each corridor:
     - Query Google Maps Local Pack via `getMapsRankings` to discover practices and isolate rank #1 competitors and ranks #4–#6 overflow candidates (`filterOverflowRanks`, `findRank1Listing`).
     - Query CMS NPPES Registry API via `searchNpiRegistry` (from `src/lib/npi-registry.ts`) for solo dental practitioners (`enumerationType === 'NPI-1'`, `soleProprietor === true`) across postal codes in the corridor.
     - Query Google Ads signal verifier (`verifyGoogleAdsSignal` from `src/lib/scrapers/ads-verifier.ts`) for active sponsored campaigns on high-intent terms (`HIGH_INTENT_IMPLANT_KEYWORDS`) and CPC ($50–$140).
     - Resolve proximity #1 competitor within 5.0 miles via `findTopCompetitor5Mi` (from `src/lib/scrapers/competitor-finder.ts`).
     - Construct valid `CandidatePractice` objects.
2. **7-Point Live Qualification DAG Integration**:
   - Replace the legacy inline regex checks with the authoritative `qualifyPractice(candidate)` function from `src/lib/qualification/index.ts`.
   - Strictly evaluate all 7 gates:
     - Gate 1: Affluent Zip Code Validation (Median HHI > $120k)
     - Gate 2: Google Maps Local Rank #4–#6
     - Gate 3: Active Paid Google Ads Signal ($50–$140/click)
     - Gate 4: Clinical Specialization (Surgical Implants/All-on-4, 0 Medicaid/pediatrics)
     - Gate 5: Single Independent Clinic (0 DSOs, 5-tier blacklist)
     - Gate 6: Solo Doctor Licensure (CMS NPI-1, sole_proprietor: YES, DDS/DMD/MD)
     - Gate 7: Proximity Competitor (Strictly Rank #1, <= 5.0 miles)
3. **Deduplicated Master Lead Merging**:
   - Load existing leads from `leads/goated_leads.json`.
   - Preserve `GOAT-001` through `GOAT-010` invariant (critical to protect Tier 4 E2E scenarios SC1-01 through SC5-01).
   - Normalize newly qualified candidates via `normalizeToLeadDossier` and synthesize custom $1,500 pitch hooks (`generatePitchHook`).
   - Merge newly qualified leads deduplicated by NPI / domain into the dataset, assigning sequential IDs `GOAT-011`, `GOAT-012`, etc.
4. **Structured Serialization & Verification**:
   - Export structured datasets using `exportLeadsToJson` and `exportLeadsToCsv` to `leads/goated_leads.json` and `leads/goated_leads.csv`.
   - When `--verify` flag is provided, automatically invoke `verifyLeadsDataset()` to certify 100% compliance across all 6 Acceptance Criteria.
   - Support CLI flags `--verbose`, `--dry-run`, `--verify`, `--out-dir`.

Verification Requirements:
Run and report the exact results of:
1. `npx tsx scripts/run-pipeline.ts --verbose --dry-run` (verify live discovery and DAG run cleanly)
2. `npx tsx tests/e2e/run-all-tests.ts` (expect 125/125 pass)
3. `npx tsc --noEmit` (expect 0 type errors)

Deliverables:
- Write your comprehensive work and verification report to `/home/pwn/geo-engine/.agents/teamwork/worker_m2_3/handoff.md`.
- Update your progress in `/home/pwn/geo-engine/.agents/teamwork/worker_m2_3/progress.md`.
- Send a completion message to the orchestrator referencing the handoff path.
