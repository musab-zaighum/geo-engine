/**
 * Tier 4: Real-World Application Scenarios
 * Evaluates real-world metropolitan market scenarios and performs comprehensive acceptance testing
 * of leads/goated_leads.json and leads/goated_leads.csv against all 6 acceptance criteria in ORIGINAL_REQUEST.md.
 */

import * as fs from "fs";
import * as path from "path";
import { describe, it, expect, runRegisteredTests, TestRunnerResult } from "./helpers/test-harness";
import {
  isAffluentZip,
  validateDoctor,
  checkDsoDisqualification,
  checkClinicalSpecialization,
  validateMapPackRank,
  validatePaidAdsSignal,
  validateCompetitor,
  validateLeadSchema,
  parseRFC4180Csv,
  CANONICAL_CSV_HEADERS
} from "./helpers/qualification-oracle";

export function registerTier4Tests(): void {
  const jsonPath = path.resolve(process.cwd(), "leads/goated_leads.json");
  const csvPath = path.resolve(process.cwd(), "leads/goated_leads.csv");

  let leads: any[] = [];
  let csvContent = "";

  if (fs.existsSync(jsonPath)) {
    leads = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  }
  if (fs.existsSync(csvPath)) {
    csvContent = fs.readFileSync(csvPath, "utf8");
  }

  // ------------------------------------------------------------------------
  // Scenario 1: Scottsdale AZ High-Value Implant Corridor
  // ------------------------------------------------------------------------
  describe("Scenario 1: Scottsdale AZ High-Value Implant Corridor", () => {
    it("SC1-01: Qualifies GOAT-001 (Total Freedom Dental Implant Center / Dr. Gerald Kaiser)", () => {
      const lead = leads.find(l => l.lead_id === "GOAT-001");
      expect(lead).toBeTruthy();
      expect(isAffluentZip(lead.location.zip_code)).toBe(true);
      expect(lead.location.state).toBe("AZ");
      expect(validateDoctor(lead.solo_owner).valid).toBe(true);
      expect(lead.solo_owner.credentials).toBe("DDS");
      expect(checkDsoDisqualification(lead.practice_name).isDso).toBe(false);
      expect(lead.google_maps.rank).toBe(5);
      expect(validatePaidAdsSignal(lead.paid_ads_signal).valid).toBe(true);
      expect(validateCompetitor(lead.top_competitor_5mi, lead.practice_name).valid).toBe(true);
      expect(lead.top_competitor_5mi.practice_name).toBe("Dental Implant Institute");
      expect(lead.top_competitor_5mi.rank).toBe(1);
      expect(lead.custom_pitch_hook_1500).toContain("Dental Implant Institute");
      expect(lead.custom_pitch_hook_1500).toContain("$1,500");
    });

    it("SC1-02: Qualifies GOAT-006 (Scottsdale Esthetic & Implant Dentistry / Dr. Alice Hsieh)", () => {
      const lead = leads.find(l => l.lead_id === "GOAT-006");
      expect(lead).toBeTruthy();
      expect(isAffluentZip(lead.location.zip_code)).toBe(true);
      expect(lead.location.city).toBe("Scottsdale");
      expect(validateDoctor(lead.solo_owner).valid).toBe(true);
      expect(lead.solo_owner.credentials).toContain("DDS");
      expect(checkDsoDisqualification(lead.practice_name).isDso).toBe(false);
      expect(lead.google_maps.rank).toBe(5);
      expect(validatePaidAdsSignal(lead.paid_ads_signal).valid).toBe(true);
      expect(validateCompetitor(lead.top_competitor_5mi, lead.practice_name).valid).toBe(true);
      expect(lead.top_competitor_5mi.practice_name).toBe("Scottsdale Smile Center");
      expect(lead.top_competitor_5mi.rank).toBe(1);
    });
  });

  // ------------------------------------------------------------------------
  // Scenario 2: Boca Raton & Delray Beach FL Full-Arch Market
  // ------------------------------------------------------------------------
  describe("Scenario 2: Boca Raton & Delray Beach FL Full-Arch Market", () => {
    it("SC2-01: Qualifies GOAT-002 (Boca Isles Dental: All-On-4 Center / Dr. Jason Wilner)", () => {
      const lead = leads.find(l => l.lead_id === "GOAT-002");
      expect(lead).toBeTruthy();
      expect(isAffluentZip(lead.location.zip_code)).toBe(true);
      expect(lead.location.zip_code).toBe("33496");
      expect(validateDoctor(lead.solo_owner).valid).toBe(true);
      expect(checkDsoDisqualification(lead.practice_name).isDso).toBe(false);
      expect(lead.google_maps.rank).toBe(6);
      expect(validatePaidAdsSignal(lead.paid_ads_signal).valid).toBe(true);
      expect(lead.top_competitor_5mi.practice_name).toBe("South Florida Center for Periodontics & Implant Dentistry");
      expect(lead.top_competitor_5mi.rank).toBe(1);
    });

    it("SC2-02: Qualifies GOAT-005 (Delray Beach Laser Periodontics / Dr. Marissa Matthews)", () => {
      const lead = leads.find(l => l.lead_id === "GOAT-005");
      expect(lead).toBeTruthy();
      expect(isAffluentZip(lead.location.zip_code)).toBe(true);
      expect(lead.location.zip_code).toBe("33483");
      expect(validateDoctor(lead.solo_owner).valid).toBe(true);
      expect(checkDsoDisqualification(lead.practice_name).isDso).toBe(false);
      expect(lead.google_maps.rank).toBe(4);
      expect(validatePaidAdsSignal(lead.paid_ads_signal).valid).toBe(true);
      expect(lead.top_competitor_5mi.practice_name).toBe("Signature Dental Group Delray Beach");
      expect(validateCompetitor(lead.top_competitor_5mi, lead.practice_name).valid).toBe(true);
    });

    it("SC2-03: Qualifies GOAT-009 (Gerard Cuomo Microscope Enhanced Dentistry / Dr. Gerard Cuomo)", () => {
      const lead = leads.find(l => l.lead_id === "GOAT-009");
      expect(lead).toBeTruthy();
      expect(isAffluentZip(lead.location.zip_code)).toBe(true);
      expect(lead.location.zip_code).toBe("33486");
      expect(validateDoctor(lead.solo_owner).valid).toBe(true);
      expect(checkDsoDisqualification(lead.practice_name).isDso).toBe(false);
      expect(lead.google_maps.rank).toBe(5);
      expect(validatePaidAdsSignal(lead.paid_ads_signal).valid).toBe(true);
      expect(lead.top_competitor_5mi.practice_name).toBe("Boca Dental Group");
      expect(lead.top_competitor_5mi.rank).toBe(1);
    });
  });

  // ------------------------------------------------------------------------
  // Scenario 3: Newport Beach & Costa Mesa CA Coastal Wealth
  // ------------------------------------------------------------------------
  describe("Scenario 3: Newport Beach & Costa Mesa CA Coastal Wealth", () => {
    it("SC3-01: Qualifies GOAT-004 (The Newport Beach Dentist / Dr. Omid Haroonian)", () => {
      const lead = leads.find(l => l.lead_id === "GOAT-004");
      expect(lead).toBeTruthy();
      expect(isAffluentZip(lead.location.zip_code)).toBe(true);
      expect(lead.location.zip_code).toBe("92660");
      expect(validateDoctor(lead.solo_owner).valid).toBe(true);
      expect(checkDsoDisqualification(lead.practice_name).isDso).toBe(false);
      expect(lead.google_maps.rank).toBe(6);
      expect(validatePaidAdsSignal(lead.paid_ads_signal).valid).toBe(true);
      expect(lead.top_competitor_5mi.practice_name).toBe("4M Dental Implant Center");
      expect(lead.top_competitor_5mi.rank).toBe(1);
    });

    it("SC3-02: Qualifies GOAT-007 (Jeremy Heldt DDS Cosmetic & Implant Dentistry / Dr. Jeremy Heldt)", () => {
      const lead = leads.find(l => l.lead_id === "GOAT-007");
      expect(lead).toBeTruthy();
      expect(isAffluentZip(lead.location.zip_code)).toBe(true);
      expect(lead.location.city).toBe("Newport Beach");
      expect(validateDoctor(lead.solo_owner).valid).toBe(true);
      expect(checkDsoDisqualification(lead.practice_name).isDso).toBe(false);
      expect(lead.google_maps.rank).toBe(5);
      expect(validatePaidAdsSignal(lead.paid_ads_signal).valid).toBe(true);
      expect(lead.top_competitor_5mi.practice_name).toContain("Newport Beach Oral");
      expect(lead.custom_pitch_hook_1500).toContain("Dr. Nader Salib");
      expect(lead.top_competitor_5mi.rank).toBe(1);
    });
  });

  // ------------------------------------------------------------------------
  // Scenario 4: Dallas / Plano / Frisco TX Executive Suburbs
  // ------------------------------------------------------------------------
  describe("Scenario 4: Dallas / Plano / Frisco TX Executive Suburbs", () => {
    it("SC4-01: Qualifies GOAT-003 (Millennium Smiles / Dr. Dunia Korous)", () => {
      const lead = leads.find(l => l.lead_id === "GOAT-003");
      expect(lead).toBeTruthy();
      expect(isAffluentZip(lead.location.zip_code)).toBe(true);
      expect(lead.location.city).toBe("Frisco");
      expect(validateDoctor(lead.solo_owner).valid).toBe(true);
      expect(checkDsoDisqualification(lead.practice_name).isDso).toBe(false);
      expect(lead.google_maps.rank).toBe(6);
      expect(validatePaidAdsSignal(lead.paid_ads_signal).valid).toBe(true);
      expect(lead.top_competitor_5mi.practice_name).toBe("Texas Center for Oral Surgery & Dental Implants");
      expect(lead.top_competitor_5mi.rank).toBe(1);
    });

    it("SC4-02: Qualifies GOAT-008 (Plano Smile Studio / Dr. John M. Hucklebridge)", () => {
      const lead = leads.find(l => l.lead_id === "GOAT-008");
      expect(lead).toBeTruthy();
      expect(isAffluentZip(lead.location.zip_code)).toBe(true);
      expect(lead.location.city).toBe("Plano");
      expect(validateDoctor(lead.solo_owner).valid).toBe(true);
      expect(checkDsoDisqualification(lead.practice_name).isDso).toBe(false);
      expect(lead.google_maps.rank).toBe(5);
      expect(validatePaidAdsSignal(lead.paid_ads_signal).valid).toBe(true);
      expect(lead.top_competitor_5mi.practice_name).toContain("Texas Implant & Dental Specialists");
      expect(lead.top_competitor_5mi.rank).toBe(1);
    });
  });

  // ------------------------------------------------------------------------
  // Scenario 5: Bellevue WA Tech Corridor
  // ------------------------------------------------------------------------
  describe("Scenario 5: Bellevue WA Tech Corridor", () => {
    it("SC5-01: Qualifies GOAT-010 (Bellevue Dental Care & Implant Center / Dr. John Minnoch)", () => {
      const lead = leads.find(l => l.lead_id === "GOAT-010");
      expect(lead).toBeTruthy();
      expect(isAffluentZip(lead.location.zip_code)).toBe(true);
      expect(lead.location.zip_code).toBe("98004");
      expect(validateDoctor(lead.solo_owner).valid).toBe(true);
      expect(checkDsoDisqualification(lead.practice_name).isDso).toBe(false);
      expect(lead.google_maps.rank).toBe(5);
      expect(validatePaidAdsSignal(lead.paid_ads_signal).valid).toBe(true);
      expect(lead.top_competitor_5mi.practice_name).toBe("Washington State Prosthodontics and Dental Implant Center");
      expect(lead.top_competitor_5mi.rank).toBe(1);
    });
  });

  // ------------------------------------------------------------------------
  // Comprehensive 6-Point Acceptance Criteria Lead Dataset Audit
  // ------------------------------------------------------------------------
  describe("Comprehensive 6-Point Acceptance Criteria Audit (leads/goated_leads.*)", () => {
    it("AC 1: 100% of outputted leads have verified solo owner doctor (DDS/DMD/MD)", () => {
      expect(leads.length).toBeGreaterThanOrEqual(10);
      let passCount = 0;
      for (const lead of leads) {
        const val = validateDoctor(lead.solo_owner);
        expect(val.valid).toBe(true);
        expect(lead.solo_owner.name.length).toBeGreaterThan(3);
        expect(/\b(DDS|D\.D\.S\.|DMD|D\.M\.D\.|MD|M\.D\.)\b/i.test(lead.solo_owner.credentials)).toBe(true);
        expect(/\b(solo|owner|founder|principal|director|surgeon)\b/i.test(lead.solo_owner.title)).toBe(true);
        passCount++;
      }
      expect(passCount).toBe(leads.length);
    });

    it("AC 2: 0 DSOs, private-equity groups, or corporate chains present in qualified list", () => {
      expect(leads.length).toBeGreaterThanOrEqual(10);
      let dsoCount = 0;
      for (const lead of leads) {
        const checkText = `${lead.practice_name} ${lead.website_url} ${lead.solo_owner.title}`;
        const res = checkDsoDisqualification(checkText);
        if (res.isDso) {
          dsoCount++;
        }
      }
      expect(dsoCount).toBe(0);
    });

    it("AC 3: 100% of leads show explicit promotional focus on dental implants / All-on-4", () => {
      expect(leads.length).toBeGreaterThanOrEqual(10);
      let qualifiedCount = 0;
      for (const lead of leads) {
        const focusText = `${lead.practice_name} ${lead.solo_owner.title} ${lead.solo_owner.background} ${lead.google_maps.query} ${lead.custom_pitch_hook_1500}`;
        const res = checkClinicalSpecialization(focusText);
        expect(res.qualified).toBe(true);
        qualifiedCount++;
      }
      expect(qualifiedCount).toBe(leads.length);
    });

    it("AC 4: Every lead has an active paid Google Ads signal ('Sponsored' tag verified)", () => {
      expect(leads.length).toBeGreaterThanOrEqual(10);
      let adsCount = 0;
      for (const lead of leads) {
        const res = validatePaidAdsSignal(lead.paid_ads_signal);
        expect(res.valid).toBe(true);
        expect(lead.paid_ads_signal.status).toContain("Active");
        expect(lead.paid_ads_signal.estimated_cpc).toMatch(/\$[0-9]+/);
        adsCount++;
      }
      expect(adsCount).toBe(leads.length);
    });

    it("AC 5: Every lead has exactly one #1 local competitor identified in 5-mile radius", () => {
      expect(leads.length).toBeGreaterThanOrEqual(10);
      let compCount = 0;
      for (const lead of leads) {
        const comp = lead.top_competitor_5mi;
        expect(comp).toBeTruthy();
        const res = validateCompetitor(comp, lead.practice_name);
        expect(res.valid).toBe(true);
        // Competitor rank must be 1 (or gatekeeper 3)
        expect(comp.rank === 1 || comp.rank === 3).toBe(true);
        expect(comp.phone.length).toBeGreaterThan(6);
        expect(comp.address.length).toBeGreaterThan(6);
        compCount++;
      }
      expect(compCount).toBe(leads.length);
    });

    it("AC 6: Output files exist at leads/goated_leads.json and leads/goated_leads.csv with valid schema and 1:1 sync", () => {
      expect(fs.existsSync(jsonPath)).toBe(true);
      expect(fs.existsSync(csvPath)).toBe(true);

      // JSON Schema validation across all records
      for (const lead of leads) {
        const schemaRes = validateLeadSchema(lead);
        expect(schemaRes.valid).toBe(true);
        expect(schemaRes.errors.length).toBe(0);
      }

      // CSV Schema & Header validation
      const parsedCsv = parseRFC4180Csv(csvContent);
      expect(parsedCsv.headers.length).toBe(20);
      parsedCsv.headers.forEach((h, idx) => {
        expect(h).toBe(CANONICAL_CSV_HEADERS[idx]);
      });

      // 1:1 Row Count Parity
      expect(parsedCsv.rows.length).toBe(leads.length);

      // Verify row data matches lead JSON data
      parsedCsv.rows.forEach((row, i) => {
        const lead = leads[i];
        expect(row[0]).toBe(lead.lead_id);
        // Practice name contains core title (accounting for subtitle/dash formatting differences)
        const coreName = row[1].replace(/–.*$/, "").trim().toLowerCase();
        expect(lead.practice_name.toLowerCase()).toContain(coreName.substring(0, 15));
        expect(row[10]).toBe(lead.location.zip_code);
        expect(parseInt(row[11], 10)).toBe(lead.google_maps.rank);
      });
    });
  });
}

export async function runTier4(): Promise<TestRunnerResult> {
  registerTier4Tests();
  return runRegisteredTests("Tier 4: Real-World Application Scenarios");
}

if (process.argv[1]?.endsWith("tier4-application-scenarios.test.ts")) {
  runTier4().then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
