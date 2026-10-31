## 2026-10-31T21:51:41Z
Your identity: Milestone 3 Lead Dossier and Pipeline Execution Worker (worker_m3_1).
Working directory: /home/pwn/geo-engine/.agents/teamwork/worker_m3_1
Project root directory: /home/pwn/geo-engine
Target output directory: /home/pwn/geo-engine/leads
Parent conversation ID: f1e9e290-ce66-4f4f-88d5-1005ccaeca98

Read the original request at /home/pwn/geo-engine/.agents/teamwork/ORIGINAL_REQUEST.md before starting work.
Also read:
- /home/pwn/geo-engine/.agents/teamwork/orchestrator_1/PROJECT.md
- /home/pwn/geo-engine/.agents/teamwork/explorer_survey_3/handoff.md (MANDATORY: contains complete JSON schema, 20-column CSV headers, and acceptance test specifications)
- /home/pwn/geo-engine/.agents/teamwork/worker_m2_1/handoff.md
- /home/pwn/geo-engine/TEST_READY.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Scope & Exclusive File Ownership:
You exclusively own:
- src/lib/dossier/types.ts
- src/lib/dossier/pitch-generator.ts
- src/lib/dossier/exporter.ts
- src/lib/dossier/index.ts
- scripts/run-pipeline.ts
- scripts/verify-leads.ts
- leads/goated_leads.json
- leads/goated_leads.csv
- tests/unit/dossier.test.ts
You MUST NOT edit files outside this scope.

Your Mission (Milestone 3):
1. `src/lib/dossier/pitch-generator.ts`:
   - Implement the custom $1,500 pitch hook highlighting the exact #1 competitor taking their high-ticket implant patients, quantified ad spend bleed, and NexusRank1 90-day ROI guarantee.
2. `src/lib/dossier/exporter.ts`:
   - Structured JSON serializer exporting to `/home/pwn/geo-engine/leads/goated_leads.json` adhering strictly to Draft 2020-12 schema (with full solo_owner, location, google_maps, paid_ads_signal, top_competitor_5mi, custom_pitch_hook_1500, npi_number, npi_verified, and clinical_specialization).
   - Canonical RFC 4180 CSV serializer exporting to `/home/pwn/geo-engine/leads/goated_leads.csv` with exact 20 canonical columns matching JSON fields 1:1.
3. Update and fix `/home/pwn/geo-engine/leads/goated_leads.json` and `/home/pwn/geo-engine/leads/goated_leads.csv`:
   - Fix lead GOAT-005: Ensure competitor rank is strictly 1 (e.g. replace rank 3 with rank 1 local competitor `Delray Beach Dental Associates` or verify competitor rank 1).
   - Ensure all leads in `goated_leads.json` have verified solo owners (DDS/DMD/MD), 0 DSOs, active sponsored Google Ads signals, Maps rank #4 to #6, and exactly one #1 competitor within 5.0 miles.
   - Synchronize `goated_leads.csv` to match `goated_leads.json` with all 20 columns populated.
4. `scripts/run-pipeline.ts`:
   - Autonomous CLI runner connecting target affluent metro scouting, qualification DAG (`src/lib/qualification`), scrapers (`src/lib/scrapers`), and dossier exporter (`src/lib/dossier`).
5. `scripts/verify-leads.ts`:
   - Lead verification script independently verifying all 6 acceptance criteria from ORIGINAL_REQUEST.md.
6. `tests/unit/dossier.test.ts`:
   - Unit tests for pitch generation, JSON schema validation, and CSV formatting.
7. Verification:
   - Run `npx tsx scripts/run-pipeline.ts` or execute pipeline.
   - Run `npx tsx scripts/verify-leads.ts`.
   - Run `npx tsx tests/e2e/run-all-tests.ts`.
   - Run `npx tsc --noEmit` and `npm run build`.
8. Write your completion report to `/home/pwn/geo-engine/.agents/teamwork/worker_m3_1/handoff.md`.
9. Send a message to your parent (`f1e9e290-ce66-4f4f-88d5-1005ccaeca98`) with your status and path to handoff.md.
