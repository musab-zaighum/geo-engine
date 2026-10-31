# E2E Test Infra: Goated Dental Implant Leads Pipeline

## Test Philosophy
- Opaque-box, requirement-driven. Derived strictly from `ORIGINAL_REQUEST.md` and user-facing acceptance criteria.
- Zero dependency on internal implementation structures.
- Methodology: Category-Partition + Boundary Value Analysis (BVA) + Pairwise Combinatorial Testing + Real-World Workload Testing.

## Feature Inventory & Test Coverage
| # | Feature | Source | Tier 1 (Feature) | Tier 2 (Boundary) | Tier 3 (Pairwise) | Tier 4 (Scenario) |
|---|---------|--------|:----------------:|:-----------------:|:-----------------:|:-----------------:|
| 1 | Target Metro & Affluent Zip Code Scouting | R1 | 5 cases | 5 cases | ✓ | ✓ |
| 2 | Solo Owner / Principal Doctor (DDS/DMD/MD) | R2, AC1 | 5 cases | 5 cases | ✓ | ✓ |
| 3 | Single Independent Clinic (0 DSOs/Chains) | R2, AC2 | 5 cases | 5 cases | ✓ | ✓ |
| 4 | Clinical Specialization (Implants/All-on-4) | R2, AC3 | 5 cases | 5 cases | ✓ | ✓ |
| 5 | Google Maps Local Overflow Rank (#4–#6) | R2 | 5 cases | 5 cases | ✓ | ✓ |
| 6 | Verified Paid Google Ads Signal ("Sponsored") | R2, AC4 | 5 cases | 5 cases | ✓ | ✓ |
| 7 | Proximity Competitor (#1 within 5.0 miles) | R2, R3, AC5 | 5 cases | 5 cases | ✓ | ✓ |
| 8 | Structured Output Schema (JSON & CSV) | R4, AC6 | 5 cases | 5 cases | ✓ | ✓ |

## Test Architecture
- Test runner: `npx tsx tests/e2e/run-all-tests.ts`
- Exit code 0 on 100% pass, non-zero on any failure.
- Directory layout:
  - `tests/e2e/tier1-feature-coverage.test.ts`: Equivalence class isolation tests (>=40 tests)
  - `tests/e2e/tier2-boundary-negative.test.ts`: DSO blacklist, rank 1-3 & >15 rejection, Medicaid rejection, non-affluent zip rejection (>=40 tests)
  - `tests/e2e/tier3-pairwise-combinations.test.ts`: Pairwise filter interaction tests (>=10 tests)
  - `tests/e2e/tier4-application-scenarios.test.ts`: Real-world end-to-end dataset validation of `leads/goated_leads.json` and `leads/goated_leads.csv` against all 6 ACs (>=5 comprehensive scenarios)
  - `tests/e2e/run-all-tests.ts`: Unified runner aggregating all 4 tiers

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Target Metro | Complexity |
|---|----------|--------------------|--------------|------------|
| 1 | Scottsdale AZ High-Value Implant Corridor | F1, F2, F3, F4, F5, F6, F7, F8 | Scottsdale AZ (85255/85260) | High |
| 2 | Boca Raton & Delray Beach FL Full-Arch Market | F1, F2, F3, F4, F5, F6, F7, F8 | Boca Raton / Delray Beach FL | High |
| 3 | Newport Beach & Costa Mesa CA Coastal Wealth | F1, F2, F3, F4, F5, F6, F7, F8 | Newport Beach CA (92660) | High |
| 4 | Dallas / Plano / Frisco TX Executive Suburbs | F1, F2, F3, F4, F5, F6, F7, F8 | Plano / Frisco TX (75024/75034) | High |
| 5 | Bellevue WA Tech Corridor | F1, F2, F3, F4, F5, F6, F7, F8 | Bellevue WA (98004) | High |

## Coverage Thresholds
- Tier 1: ≥5 per feature (Total ≥ 40 cases)
- Tier 2: ≥5 per feature (Total ≥ 40 cases)
- Tier 3: Pairwise combinations (Total ≥ 10 cases)
- Tier 4: ≥5 realistic application scenarios (Total ≥ 5 scenarios)
- Total minimum test count: ≥ 95 test cases
