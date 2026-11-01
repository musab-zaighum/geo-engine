## 2026-11-01T03:57:47Z
You are Worker M3-3 (worker_m3_3) for Project Orchestrator (orchestrator_3).
Your working directory is: /home/pwn/geo-engine/.agents/teamwork/worker_m3_3
Project root: /home/pwn/geo-engine

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

MANDATORY: Read the following input files before starting:
1. /home/pwn/geo-engine/.agents/teamwork/ORIGINAL_REQUEST.md (specifically Follow-up dated 2026-11-01T02:55:38Z)
2. /home/pwn/geo-engine/.agents/teamwork/orchestrator_3/PROJECT.md
3. /home/pwn/geo-engine/.agents/teamwork/explorer_survey_3_2/handoff.md (Sections 1.1, 1.4, 1.5, 4.1-4.5)
4. /home/pwn/geo-engine/.agents/teamwork/explorer_survey_3_3/handoff.md (Invariance of GOAT-001..GOAT-010)

Your Exclusive Write Ownership:
- `leads/goated_leads.json`
- `leads/goated_leads.csv`
- `scripts/run-pipeline.ts`
DO NOT modify any other files in this milestone.

Your Milestone Objectives:
Execute the active corridor expansion and compile the complete, qualified "Goated" leads dataset across all 7 ultra-high-wealth corridors:
1. **Corridor Coverage Guarantee (R1)**:
   Verify that the compiled leads in `leads/goated_leads.json` and `leads/goated_leads.csv` comprehensively cover all 7 requested corridors:
   1. Manhattan Upper East Side & Midtown, NY (10021, 10065, 10075, 10022)
   2. Silicon Valley / Atherton / Palo Alto / Los Altos, CA (94027, 94301, 94022, 94024)
   3. Palm Beach & Jupiter, FL (33480, 33458, 33477)
   4. Scottsdale North & Paradise Valley, AZ (85255, 85262, 85253, 85266)
   5. Newport Beach & Corona del Mar, CA (92660, 92625, 92657)
   6. Dallas Park Cities & Preston Hollow, TX (75205, 75225, 75209)
   7. Aspen & Vail, CO (81611, 81657) — Note: Ensure Vail (81657) has a genuine qualified lead alongside Aspen!
2. **Strict 7-Point Live Qualification DAG Enforcement (R2)**:
   Every lead must be rigorously qualified against all 7 gates:
   - Solo Owner: Verified DDS/DMD/MD, solo owner/founder title, individual CMS NPI-1 with `sole_proprietor: YES` and approved dental taxonomy code.
   - 0 DSOs: 0 corporate chains / PE groups.
   - Specialization: 100% surgical dental implants, All-on-4, full-arch restoration. No Medicaid/pediatrics.
   - Map Pack Overflow Rank: Ranked #4 to #6 on Google Maps.
   - Paid Google Ads Signal: Verified "Sponsored" ad tag in Google Ads Transparency Center, high-intent keywords, $50–$140/click.
   - Local Proximity Competitor: Specific local #1 competitor within immediate 5.0 miles, strictly Rank #1, review count, rating.
   - Location Wealth: Verified high-wealth zip code (Median HHI > $120k).
3. **Preserve Invariant Leads**:
   - `GOAT-001` through `GOAT-010` MUST remain unchanged to protect Tier 4 E2E scenarios SC1-01 through SC5-01.
   - Assign sequential IDs `GOAT-011`, `GOAT-012`, etc., to newly added corridor leads.
4. **Custom $1,500 Pitch Hook & 1:1 Parity (R3, R5)**:
   - Every lead has a custom $1,500 pitch hook highlighting the exact #1 competitor taking their patients with 90-day ROI guarantee.
   - `leads/goated_leads.json` (Draft 2020-12 valid) and `leads/goated_leads.csv` (RFC 4180 across 20 columns) must be in 1:1 synchronization.
5. **Run the Pipeline & Acceptance Verification**:
   - Execute `npx tsx scripts/run-pipeline.ts --verbose` to run live discovery and generate the output files.
   - Run `npx tsx scripts/verify-leads.ts` and ensure 100% of leads pass across all 6 Acceptance Criteria.
   - Run `npx tsx tests/e2e/run-all-tests.ts` to ensure 125/125 tests pass.
