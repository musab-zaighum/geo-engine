/**
 * Tier 2: Boundary & Negative Cases
 * Tests negative boundary conditions, disqualification gates, and edge cases (>=5 per feature, Total: 48 cases).
 */

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

export function registerTier2Tests(): void {
  // ------------------------------------------------------------------------
  // Feature 1: Boundary & Negative for Zip Code Scouting
  // ------------------------------------------------------------------------
  describe("Feature 1: Boundary & Negative Zip Code Scouting", () => {
    it("B1-01: Rejects low-income urban zip code (48201 Detroit, HHI $28k)", () => {
      expect(isAffluentZip("48201")).toBe(false);
    });

    it("B1-02: Rejects low-income metropolitan zip code (38126 Memphis, HHI $22k)", () => {
      expect(isAffluentZip("38126")).toBe(false);
    });

    it("B1-03: Rejects malformed alphanumeric zip code ('9021A')", () => {
      expect(isAffluentZip("9021A")).toBe(false);
    });

    it("B1-04: Rejects truncated 4-digit zip code ('8526')", () => {
      expect(isAffluentZip("8526")).toBe(false);
    });

    it("B1-05: Rejects empty or undefined zip code string", () => {
      expect(isAffluentZip("")).toBe(false);
      expect(isAffluentZip(null as any)).toBe(false);
    });

    it("B1-06: Rejects non-affluent rural zip code (59715 Bozeman MT)", () => {
      expect(isAffluentZip("59715")).toBe(false);
    });
  });

  // ------------------------------------------------------------------------
  // Feature 2: Boundary & Negative for Solo Owner Doctor Verification
  // ------------------------------------------------------------------------
  describe("Feature 2: Boundary & Negative Solo Doctor Verification", () => {
    it("B2-01: Disqualifies associate dentist without ownership title", () => {
      const doc = {
        name: "Dr. Karen Vance",
        credentials: "DDS",
        title: "Associate Dentist",
        background: "General associate provider"
      };
      const res = validateDoctor(doc);
      expect(res.valid).toBe(false);
      expect(res.reason).toContain("associate");
    });

    it("B2-02: Disqualifies registered dental hygienist (RDH) lacking doctorate", () => {
      const doc = {
        name: "Sarah Miller",
        credentials: "RDH, BSDH",
        title: "Clinical Hygiene Director",
        background: "Dental hygienist"
      };
      const res = validateDoctor(doc);
      expect(res.valid).toBe(false);
      expect(res.reason).toContain("lack DDS, DMD, or MD");
    });

    it("B2-03: Disqualifies clinic operations manager without doctorate", () => {
      const doc = {
        name: "David Sterling",
        credentials: "MHA",
        title: "Clinic Operations Manager",
        background: "Healthcare administration"
      };
      const res = validateDoctor(doc);
      expect(res.valid).toBe(false);
      expect(res.reason).toContain("lack DDS, DMD, or MD");
    });

    it("B2-04: Disqualifies practice record with missing doctor name", () => {
      const doc = {
        name: "",
        credentials: "DDS",
        title: "Solo Owner",
        background: "Experienced surgeon"
      };
      const res = validateDoctor(doc);
      expect(res.valid).toBe(false);
      expect(res.reason).toContain("Doctor name missing");
    });

    it("B2-05: Disqualifies executive with only MBA non-clinical degree", () => {
      const doc = {
        name: "James Henderson",
        credentials: "MBA",
        title: "Managing Partner & Founder",
        background: "Private equity investor"
      };
      const res = validateDoctor(doc);
      expect(res.valid).toBe(false);
      expect(res.reason).toContain("lack DDS, DMD, or MD");
    });

    it("B2-06: Disqualifies staff dentist with non-ownership coordinator title", () => {
      const doc = {
        name: "Dr. Gregory House",
        credentials: "DMD",
        title: "Staff Treatment Coordinator",
        background: "Consulting dentist"
      };
      const res = validateDoctor(doc);
      expect(res.valid).toBe(false);
      expect(res.reason?.toLowerCase()).toContain("coordinator");
    });
  });

  // ------------------------------------------------------------------------
  // Feature 3: Boundary & Negative for DSO Blacklist Rejection
  // ------------------------------------------------------------------------
  describe("Feature 3: Boundary & Negative DSO Blacklist Rejection", () => {
    it("B3-01: Disqualifies Western Dental corporate network practice", () => {
      const res = checkDsoDisqualification("Western Dental & Orthodontics Glendale");
      expect(res.isDso).toBe(true);
      expect(res.matchedDso).toBe("western dental");
    });

    it("B3-02: Disqualifies Gentle Dental / 42 North Dental PE roll-up", () => {
      const res = checkDsoDisqualification("Gentle Dental Associates of New England");
      expect(res.isDso).toBe(true);
      expect(res.matchedDso).toBe("gentle dental");
    });

    it("B3-03: Disqualifies Dental Care Alliance (DCA) network clinic", () => {
      const res = checkDsoDisqualification("Affiliated with Dental Care Alliance network");
      expect(res.isDso).toBe(true);
      expect(res.matchedDso).toBe("dental care alliance");
    });

    it("B3-04: Disqualifies Affordable Dentures & Implants corporate group", () => {
      const res = checkDsoDisqualification("Affordable Dentures & Implants Plano Practice");
      expect(res.isDso).toBe(true);
      expect(res.matchedDso).toBe("affordable dentures");
    });

    it("B3-05: Disqualifies MB2 Dental PE-backed dental partnership organization", () => {
      const res = checkDsoDisqualification("Supported by MB2 Dental Solutions");
      expect(res.isDso).toBe(true);
      expect(res.matchedDso).toBe("mb2 dental");
    });

    it("B3-06: Disqualifies obfuscated / mixed-case ClearChoice DSO name", () => {
      const res = checkDsoDisqualification("cLeArChOiCe Dental Implant Center");
      expect(res.isDso).toBe(true);
      expect(res.matchedDso).toBe("clearchoice");
    });
  });

  // ------------------------------------------------------------------------
  // Feature 4: Boundary & Negative for Clinical Specialization
  // ------------------------------------------------------------------------
  describe("Feature 4: Boundary & Negative Clinical Specialization", () => {
    it("B4-01: Strictly disqualifies Medicaid dental clinic", () => {
      const text = "We gladly accept Medicaid and state assistance programs for dental cleanings.";
      const res = checkClinicalSpecialization(text);
      expect(res.qualified).toBe(false);
      expect(res.reason).toContain("Medicaid");
    });

    it("B4-02: Strictly disqualifies Denti-Cal welfare provider", () => {
      const text = "Certified Denti-Cal provider in Orange County.";
      const res = checkClinicalSpecialization(text);
      expect(res.qualified).toBe(false);
      expect(res.reason).toContain("Medicaid or state welfare");
    });

    it("B4-03: Disqualifies clinic dedicated exclusively to pediatric dentistry", () => {
      const text = "Pediatric dentistry only for toddlers, infants, and teens.";
      const res = checkClinicalSpecialization(text);
      expect(res.qualified).toBe(false);
      expect(res.reason).toContain("exclusively pediatric");
    });

    it("B4-04: Disqualifies routine family hygiene practice without surgical implants", () => {
      const text = "Family dental practice offering routine cleanings, plaque removal, and tooth fillings.";
      const res = checkClinicalSpecialization(text);
      expect(res.qualified).toBe(false);
      expect(res.reason).toContain("Lacks surgical dental implant");
    });

    it("B4-05: Disqualifies practice focused exclusively on orthodontic braces", () => {
      const text = "Orthodontic center specializing in metal braces, retainers, and aligner tracking.";
      const res = checkClinicalSpecialization(text);
      expect(res.qualified).toBe(false);
      expect(res.reason).toContain("Lacks surgical dental implant");
    });

    it("B4-06: Disqualifies empty or blank clinical procedure description", () => {
      const res = checkClinicalSpecialization("");
      expect(res.qualified).toBe(false);
      expect(res.reason).toContain("Empty text");
    });
  });

  // ------------------------------------------------------------------------
  // Feature 5: Boundary & Negative for Google Maps Overflow Rank
  // ------------------------------------------------------------------------
  describe("Feature 5: Boundary & Negative Google Maps Rank", () => {
    it("B5-01: Disqualifies rank #1 (already dominating in Local 3-Pack)", () => {
      const res = validateMapPackRank(1);
      expect(res.valid).toBe(false);
      expect(res.reason).toContain("Local 3-Pack");
    });

    it("B5-02: Disqualifies rank #2 (already in Local 3-Pack)", () => {
      const res = validateMapPackRank(2);
      expect(res.valid).toBe(false);
      expect(res.reason).toContain("Local 3-Pack");
    });

    it("B5-03: Disqualifies rank #3 (Local 3-Pack gatekeeper edge)", () => {
      const res = validateMapPackRank(3);
      expect(res.valid).toBe(false);
      expect(res.reason).toContain("Local 3-Pack");
    });

    it("B5-04: Disqualifies rank #7 (outside required #4-#6 overflow fold)", () => {
      const res = validateMapPackRank(7);
      expect(res.valid).toBe(false);
      expect(res.reason).toContain("outside the required #4-#6");
    });

    it("B5-05: Disqualifies rank #16 (buried past #15)", () => {
      const res = validateMapPackRank(16);
      expect(res.valid).toBe(false);
      expect(res.reason).toContain("outside the required #4-#6");
    });

    it("B5-06: Disqualifies non-integer or negative ranks (rank 4.5 and rank -1)", () => {
      expect(validateMapPackRank(4.5).valid).toBe(false);
      expect(validateMapPackRank(-1).valid).toBe(false);
      expect(validateMapPackRank("5" as any).valid).toBe(false);
    });
  });

  // ------------------------------------------------------------------------
  // Feature 6: Boundary & Negative for Paid Google Ads Signal
  // ------------------------------------------------------------------------
  describe("Feature 6: Boundary & Negative Paid Google Ads Signal", () => {
    it("B6-01: Disqualifies inactive ads status ('No Active Ads')", () => {
      const ads = {
        status: "No Active Ads Detected",
        advertiser_name: "Test Practice",
        advertiser_id: "AR000000",
        active_ad_count: "0 ads",
        estimated_cpc: "$0",
        verification_source: "Google Ads Transparency Center"
      };
      const res = validatePaidAdsSignal(ads);
      expect(res.valid).toBe(false);
      expect(res.reason?.toLowerCase()).toContain("inactive");
    });

    it("B6-02: Disqualifies missing or null paid_ads_signal object", () => {
      expect(validatePaidAdsSignal(null).valid).toBe(false);
      expect(validatePaidAdsSignal(undefined).valid).toBe(false);
    });

    it("B6-03: Disqualifies missing active_ad_count field", () => {
      const ads = {
        status: "Active Verified Advertiser",
        advertiser_name: "Test Practice",
        advertiser_id: "AR000000",
        active_ad_count: "",
        estimated_cpc: "$75/click",
        verification_source: "Google Ads Transparency Center"
      };
      const res = validatePaidAdsSignal(ads);
      expect(res.valid).toBe(false);
      expect(res.reason).toContain("Missing active_ad_count");
    });

    it("B6-04: Disqualifies invalid CPC string lacking dollar values", () => {
      const ads = {
        status: "Active Verified Advertiser",
        advertiser_name: "Test Practice",
        advertiser_id: "AR000000",
        active_ad_count: "5 ads",
        estimated_cpc: "Free clicks",
        verification_source: "Google Ads Transparency Center"
      };
      const res = validatePaidAdsSignal(ads);
      expect(res.valid).toBe(false);
      expect(res.reason).toContain("must specify dollar CPC estimate");
    });

    it("B6-05: Disqualifies non-object paid ads input (primitive string)", () => {
      expect(validatePaidAdsSignal("Active Advertiser" as any).valid).toBe(false);
    });

    it("B6-06: Disqualifies empty status string", () => {
      const ads = {
        status: "",
        advertiser_name: "Test Practice",
        advertiser_id: "AR000000",
        active_ad_count: "5 ads",
        estimated_cpc: "$75/click",
        verification_source: "Google Ads Transparency Center"
      };
      expect(validatePaidAdsSignal(ads).valid).toBe(false);
    });
  });

  // ------------------------------------------------------------------------
  // Feature 7: Boundary & Negative for Proximity Competitor
  // ------------------------------------------------------------------------
  describe("Feature 7: Boundary & Negative Proximity Competitor", () => {
    it("B7-01: Disqualifies competitor located 5.1 miles away (> 5.0-mile limit)", () => {
      const comp = {
        practice_name: "Rival Dental Center",
        address: "100 Main St, City, ST 12345",
        phone: "+1 555-123-4567",
        website: "https://rivaldental.com/",
        rank: 1,
        rating: 4.8,
        review_count: 100
      };
      const res = validateCompetitor(comp, "Candidate Clinic", 5.1);
      expect(res.valid).toBe(false);
      expect(res.reason).toContain("> 5.0-mile maximum radius");
    });

    it("B7-02: Disqualifies competitor located 15.0 miles away in different market", () => {
      const comp = {
        practice_name: "Far Away Dental",
        address: "200 Far St, Other City, ST 12345",
        phone: "+1 555-987-6543",
        website: "https://faraway.com/",
        rank: 1,
        rating: 4.8,
        review_count: 100
      };
      const res = validateCompetitor(comp, "Candidate Clinic", 15.0);
      expect(res.valid).toBe(false);
      expect(res.reason).toContain("> 5.0-mile maximum radius");
    });

    it("B7-03: Disqualifies self-referential competitor (candidate listed as own rival)", () => {
      const comp = {
        practice_name: "Total Freedom Dental Implant Center",
        address: "9002 E Desert Cove Ave, Scottsdale, AZ 85260",
        phone: "(480) 860-9002",
        website: "https://totalfreedomdentalimplants.com/",
        rank: 1,
        rating: 4.9,
        review_count: 481
      };
      const res = validateCompetitor(comp, "Total Freedom Dental Implant Center", 0.0);
      expect(res.valid).toBe(false);
      expect(res.reason).toContain("cannot be the same practice");
    });

    it("B7-04: Disqualifies competitor with rank > 3 (e.g. rank #8 rival)", () => {
      const comp = {
        practice_name: "Low Ranked Dental",
        address: "300 Street, City, ST 12345",
        phone: "+1 555-000-1111",
        website: "https://lowrank.com/",
        rank: 8,
        rating: 4.2,
        review_count: 20
      };
      const res = validateCompetitor(comp, "Candidate Clinic", 1.5);
      expect(res.valid).toBe(false);
      expect(res.reason).toContain("Competitor rank must be 1");
    });

    it("B7-05: Disqualifies competitor with missing phone number", () => {
      const comp = {
        practice_name: "No Phone Dental",
        address: "400 Street, City, ST 12345",
        phone: "",
        website: "https://nophone.com/",
        rank: 1,
        rating: 4.8,
        review_count: 100
      };
      const res = validateCompetitor(comp, "Candidate Clinic", 2.0);
      expect(res.valid).toBe(false);
      expect(res.reason).toContain("Missing competitor phone");
    });

    it("B7-06: Disqualifies competitor with missing address", () => {
      const comp = {
        practice_name: "No Address Dental",
        address: "",
        phone: "+1 555-222-3333",
        website: "https://noaddress.com/",
        rank: 1,
        rating: 4.8,
        review_count: 100
      };
      const res = validateCompetitor(comp, "Candidate Clinic", 1.0);
      expect(res.valid).toBe(false);
      expect(res.reason).toContain("Missing competitor address");
    });
  });

  // ------------------------------------------------------------------------
  // Feature 8: Boundary & Negative for Schema Validation
  // ------------------------------------------------------------------------
  describe("Feature 8: Boundary & Negative Schema Validation", () => {
    it("B8-01: Disqualifies lead record missing lead_id", () => {
      const lead = {
        practice_name: "Test Clinic",
        website_url: "https://test.com/",
        solo_owner: { name: "Dr. Test", credentials: "DDS", title: "Solo Owner" },
        location: { address: "123 St", city: "Scottsdale", state: "AZ", zip_code: "85260", metro_affluence: "High" },
        phone_number: "555-1234",
        google_maps: { query: "implants", rank: 5, rating: 4.9, review_count: 100 },
        paid_ads_signal: { status: "Active Verified Advertiser", advertiser_name: "T", advertiser_id: "1", active_ad_count: "1", estimated_cpc: "$50" },
        top_competitor_5mi: { practice_name: "Rival", address: "456 St", phone: "555-5678", website: "https://rival.com", rank: 1, rating: 5, review_count: 50 },
        custom_pitch_hook_1500: "Pitch hook string with at least fifty characters of text for validation."
      };
      const res = validateLeadSchema(lead);
      expect(res.valid).toBe(false);
      expect(res.errors.some(e => e.includes("Missing required field: lead_id"))).toBe(true);
    });

    it("B8-02: Disqualifies invalid lead_id pattern ('LEAD-001' or lowercase 'goat-001')", () => {
      const lead = {
        lead_id: "LEAD-001",
        practice_name: "Test Clinic",
        website_url: "https://test.com/",
        solo_owner: { name: "Dr. Test", credentials: "DDS", title: "Solo Owner" },
        location: { address: "123 St", city: "Scottsdale", state: "AZ", zip_code: "85260", metro_affluence: "High" },
        phone_number: "555-1234",
        google_maps: { query: "implants", rank: 5, rating: 4.9, review_count: 100 },
        paid_ads_signal: { status: "Active Verified Advertiser", advertiser_name: "T", advertiser_id: "1", active_ad_count: "1", estimated_cpc: "$50" },
        top_competitor_5mi: { practice_name: "Rival", address: "456 St", phone: "555-5678", website: "https://rival.com", rank: 1, rating: 5, review_count: 50 },
        custom_pitch_hook_1500: "Pitch hook string with at least fifty characters of text for validation."
      };
      const res = validateLeadSchema(lead);
      expect(res.valid).toBe(false);
      expect(res.errors.some(e => e.includes("pattern ^GOAT-[0-9]{3,}$"))).toBe(true);
    });

    it("B8-03: Disqualifies pitch hook shorter than 50 characters", () => {
      const lead = {
        lead_id: "GOAT-001",
        practice_name: "Test Clinic",
        website_url: "https://test.com/",
        solo_owner: { name: "Dr. Test", credentials: "DDS", title: "Solo Owner" },
        location: { address: "123 St", city: "Scottsdale", state: "AZ", zip_code: "85260", metro_affluence: "High" },
        phone_number: "555-1234",
        google_maps: { query: "implants", rank: 5, rating: 4.9, review_count: 100 },
        paid_ads_signal: { status: "Active Verified Advertiser", advertiser_name: "T", advertiser_id: "1", active_ad_count: "1", estimated_cpc: "$50" },
        top_competitor_5mi: { practice_name: "Rival", address: "456 St", phone: "555-5678", website: "https://rival.com", rank: 1, rating: 5, review_count: 50 },
        custom_pitch_hook_1500: "Short pitch."
      };
      const res = validateLeadSchema(lead);
      expect(res.valid).toBe(false);
      expect(res.errors.some(e => e.includes("at least 50 chars"))).toBe(true);
    });

    it("B8-04: Disqualifies state postal code not matching ^[A-Z]{2}$ ('CALIFORNIA')", () => {
      const lead = {
        lead_id: "GOAT-001",
        practice_name: "Test Clinic",
        website_url: "https://test.com/",
        solo_owner: { name: "Dr. Test", credentials: "DDS", title: "Solo Owner" },
        location: { address: "123 St", city: "Scottsdale", state: "CALIFORNIA", zip_code: "85260", metro_affluence: "High" },
        phone_number: "555-1234",
        google_maps: { query: "implants", rank: 5, rating: 4.9, review_count: 100 },
        paid_ads_signal: { status: "Active Verified Advertiser", advertiser_name: "T", advertiser_id: "1", active_ad_count: "1", estimated_cpc: "$50" },
        top_competitor_5mi: { practice_name: "Rival", address: "456 St", phone: "555-5678", website: "https://rival.com", rank: 1, rating: 5, review_count: 50 },
        custom_pitch_hook_1500: "Pitch hook string with at least fifty characters of text for validation."
      };
      const res = validateLeadSchema(lead);
      expect(res.valid).toBe(false);
      expect(res.errors.some(e => e.includes("must be 2-letter uppercase"))).toBe(true);
    });

    it("B8-05: Disqualifies malformed zip code not matching 5 or 9-digit pattern", () => {
      const lead = {
        lead_id: "GOAT-001",
        practice_name: "Test Clinic",
        website_url: "https://test.com/",
        solo_owner: { name: "Dr. Test", credentials: "DDS", title: "Solo Owner" },
        location: { address: "123 St", city: "Scottsdale", state: "AZ", zip_code: "8526", metro_affluence: "High" },
        phone_number: "555-1234",
        google_maps: { query: "implants", rank: 5, rating: 4.9, review_count: 100 },
        paid_ads_signal: { status: "Active Verified Advertiser", advertiser_name: "T", advertiser_id: "1", active_ad_count: "1", estimated_cpc: "$50" },
        top_competitor_5mi: { practice_name: "Rival", address: "456 St", phone: "555-5678", website: "https://rival.com", rank: 1, rating: 5, review_count: 50 },
        custom_pitch_hook_1500: "Pitch hook string with at least fifty characters of text for validation."
      };
      const res = validateLeadSchema(lead);
      expect(res.valid).toBe(false);
      expect(res.errors.some(e => e.includes("Invalid location.zip_code"))).toBe(true);
    });

    it("B8-06: Disqualifies CSV with mismatched header count (e.g. 19 columns)", () => {
      const badCsv = "Lead ID,Practice Name,Domain,Doctor Name,Credentials,Title,Phone,Address,City,State,Zip Code,Google Maps Rank,Reviews,Rating,Ads Status,Google Ads CPC,#1 Competitor Name,#1 Competitor Maps Rank,#1 Competitor Phone";
      const parsed = parseRFC4180Csv(badCsv);
      expect(parsed.headers.length).toBe(19);
      expect(parsed.headers.length).not.toBe(CANONICAL_CSV_HEADERS.length);
    });
  });
}

export async function runTier2(): Promise<TestRunnerResult> {
  registerTier2Tests();
  return runRegisteredTests("Tier 2: Boundary & Negative Cases");
}

if (process.argv[1]?.endsWith("tier2-boundary-negative.test.ts")) {
  runTier2().then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
