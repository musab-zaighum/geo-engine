## 2026-10-31T20:36:09Z
Your identity: Qualification Engine Implementer (worker_m1_1).
Working directory: /home/pwn/geo-engine/.agents/teamwork/worker_m1_1
Project root directory: /home/pwn/geo-engine
Target output directory: /home/pwn/geo-engine/leads
Parent conversation ID: f1e9e290-ce66-4f4f-88d5-1005ccaeca98

Read the original request at /home/pwn/geo-engine/.agents/teamwork/ORIGINAL_REQUEST.md before starting any work.
Also read /home/pwn/geo-engine/.agents/teamwork/orchestrator_1/PROJECT.md and the explorer findings in /home/pwn/geo-engine/.agents/teamwork/explorer_survey_1/handoff.md and /home/pwn/geo-engine/.agents/teamwork/explorer_survey_2/handoff.md.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Scope & Exclusive File Ownership:
You exclusively own:
- src/lib/qualification/types.ts
- src/lib/qualification/affluent-zips.ts
- src/lib/qualification/npi-verifier.ts
- src/lib/qualification/dso-filter.ts
- src/lib/qualification/clinical-filter.ts
- src/lib/qualification/index.ts
- tests/unit/qualification.test.ts
You MUST NOT edit files outside this scope.

Your Mission (Milestone 1):
Implement the high-assurance qualification and disqualification engine in Node.js/TypeScript:
1. src/lib/qualification/types.ts: Define all domain interfaces and types according to the interface contract in PROJECT.md.
2. src/lib/qualification/affluent-zips.ts: Implement the 35+ high-wealth zip code repository across the 7 target metros with lookup functions.
3. src/lib/qualification/npi-verifier.ts: Robust CMS NPPES Federal Registry API (https://npiregistry.cms.hhs.gov/api/?version=2.1) integration verifying individual NPI-1 status, DDS/DMD/MD credentials, dental taxonomy codes, and sole proprietorship status with timeout and fallback.
4. src/lib/qualification/dso-filter.ts: Complete 5-tier blacklist and regex/domain matcher for 25+ national and regional DSOs (ClearChoice, Heartland Dental, Aspen Dental, Pacific Dental Services, Smile Brands, MB2 Dental, Sonrava, etc.).
5. src/lib/qualification/clinical-filter.ts: Procedural keyword density scorer verifying surgical dental implants, All-on-4, full-arch restoration, and strictly rejecting Medicaid/Denti-Cal, pediatrics, and routine-only practices.
6. src/lib/qualification/index.ts: Unified qualification engine orchestrating the DAG gates.
7. tests/unit/qualification.test.ts: Comprehensive unit tests verifying each gate with positive and negative test cases.
8. Run your tests with npx tsx tests/unit/qualification.test.ts to verify everything builds and passes.
9. Write a comprehensive report to /home/pwn/geo-engine/.agents/teamwork/worker_m1_1/handoff.md with build/test commands and results.
10. Send a message to your parent (f1e9e290-ce66-4f4f-88d5-1005ccaeca98) with your status and path to handoff.md.
