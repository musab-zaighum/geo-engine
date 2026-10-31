/**
 * Tier 3: Cross-Feature Interactions (Pairwise Combinatorial Testing)
 * Evaluates multi-gate filter interactions and cross-domain edge cases (>=10 test cases, Total: 13 cases).
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
  haversineDistanceMiles,
  parseRFC4180Csv,
  CANONICAL_CSV_HEADERS
} from "./helpers/qualification-oracle";

export function registerTier3Tests(): void {
  describe("Tier 3: Cross-Feature Filter Interactions & Combinations", () => {
    it("P3-01: Valid Solo Doctor (DDS) + DSO Corporate Affiliation -> REJECTED by DSO gate", () => {
      const doc = {
        name: "Dr. Arthur Dent",
        credentials: "DDS",
        title: "Solo Principal Dentist",
        background: "Implant surgeon"
      };
      const practiceText = "ClearChoice Dental Implant Center Scottsdale - Dr. Arthur Dent DDS";

      // Doctor alone is valid
      expect(validateDoctor(doc).valid).toBe(true);

      // But DSO check flags practice
      const dsoRes = checkDsoDisqualification(practiceText);
      expect(dsoRes.isDso).toBe(true);
      expect(dsoRes.matchedDso).toBe("clearchoice");
    });

    it("P3-02: Valid Solo Doctor (DMD) + Rank #5 + Medicaid Acceptance -> REJECTED by Clinical gate", () => {
      const doc = { name: "Dr. Elena Gilbert", credentials: "DMD", title: "Solo Owner & Surgeon" };
      const rank = 5;
      const clinicalText = "Elena Gilbert DMD Implants & Family Care - We accept Medicaid and state plans.";

      expect(validateDoctor(doc).valid).toBe(true);
      expect(validateMapPackRank(rank).valid).toBe(true);

      const clinicalRes = checkClinicalSpecialization(clinicalText);
      expect(clinicalRes.qualified).toBe(false);
      expect(clinicalRes.reason?.toLowerCase()).toContain("medicaid");
    });

    it("P3-03: Valid Solo Doctor (MD/DDS) + Surgical Implants + Local 3-Pack Rank #2 -> REJECTED by Rank gate", () => {
      const doc = { name: "Dr. Marcus Thorne", credentials: "MD, DDS", title: "Solo Founder & Oral Surgeon" };
      const clinicalText = "Full-arch All-on-4 surgical dental implant reconstruction.";
      const rank = 2; // In 3-pack

      expect(validateDoctor(doc).valid).toBe(true);
      expect(checkClinicalSpecialization(clinicalText).qualified).toBe(true);

      const rankRes = validateMapPackRank(rank);
      expect(rankRes.valid).toBe(false);
      expect(rankRes.reason).toContain("Local 3-Pack");
    });

    it("P3-04: Rank #4 + Surgical Implants + Non-Affluent Zip (Detroit 48201) -> REJECTED by Zip gate", () => {
      const rank = 4;
      const clinicalText = "Advanced zygomatic and full-arch dental implant center.";
      const zip = "48201";

      expect(validateMapPackRank(rank).valid).toBe(true);
      expect(checkClinicalSpecialization(clinicalText).qualified).toBe(true);

      expect(isAffluentZip(zip)).toBe(false);
    });

    it("P3-05: Affluent Zip (85260) + Valid Solo Doctor + Inactive Ads Signal -> REJECTED by Ads gate", () => {
      const zip = "85260";
      const doc = { name: "Dr. Gerald Kaiser", credentials: "DDS", title: "Solo Founder" };
      const ads = {
        status: "Inactive Account",
        advertiser_name: "Kaiser DDS",
        advertiser_id: "AR111",
        active_ad_count: "0 ads",
        estimated_cpc: "$0"
      };

      expect(isAffluentZip(zip)).toBe(true);
      expect(validateDoctor(doc).valid).toBe(true);

      const adsRes = validatePaidAdsSignal(ads);
      expect(adsRes.valid).toBe(false);
      expect(adsRes.reason?.toLowerCase()).toContain("inactive");
    });

    it("P3-06: Valid Solo Doctor + Rank #6 + Competitor at 6.8 miles (> 5.0 mi) -> REJECTED by Proximity gate", () => {
      const doc = { name: "Dr. Jason Wilner", credentials: "DDS", title: "Solo Owner" };
      const rank = 6;
      const comp = {
        practice_name: "Far Distance Implant Center",
        address: "700 Far Ave, West Palm Beach, FL 33401",
        phone: "+1 561-555-9999",
        website: "https://farimplant.com/",
        rank: 1,
        rating: 4.8,
        review_count: 150
      };
      const distance = 6.8;

      expect(validateDoctor(doc).valid).toBe(true);
      expect(validateMapPackRank(rank).valid).toBe(true);

      const compRes = validateCompetitor(comp, "Boca Isles Dental", distance);
      expect(compRes.valid).toBe(false);
      expect(compRes.reason).toContain("> 5.0-mile maximum radius");
    });

    it("P3-07: Valid Solo Doctor + Rank #5 + Competitor is ClearChoice DSO -> Competitor recognized as corporate rival", () => {
      const doc = { name: "Dr. John Hucklebridge", credentials: "DDS", title: "Solo Founder & Principal" };
      const rank = 5;
      const comp = {
        practice_name: "ClearChoice Dental Implant Center Dallas",
        address: "Dallas Pkwy, Dallas, TX 75254",
        phone: "+1 972-555-1234",
        website: "https://clearchoice.com/dallas",
        rank: 1,
        rating: 4.6,
        review_count: 520
      };

      expect(validateDoctor(doc).valid).toBe(true);
      expect(validateMapPackRank(rank).valid).toBe(true);

      // Competitor is valid rival within 5 miles
      const compRes = validateCompetitor(comp, "Plano Smile Studio", 3.2);
      expect(compRes.valid).toBe(true);

      // And competitor is a recognized corporate DSO taking local market share
      const dsoComp = checkDsoDisqualification(comp.practice_name);
      expect(dsoComp.isDso).toBe(true);
    });

    it("P3-08: Complete 7-Gate Qualified Lead validates schema and pitch hook synthesis", () => {
      const lead = {
        lead_id: "GOAT-004",
        practice_name: "The Newport Beach Dentist - Omid Haroonian, DDS",
        website_url: "https://thenewportbeachdentist.com/",
        solo_owner: {
          name: "Dr. Omid Haroonian",
          credentials: "DDS",
          title: "Solo Principal & Founder",
          background: "Cosmetic & surgical implant reconstruction"
        },
        location: {
          address: "3920 Birch St Ste 101",
          city: "Newport Beach",
          state: "CA",
          zip_code: "92660",
          metro_affluence: "Ultra-affluent Orange County coastal enclave"
        },
        phone_number: "(949) 989-2612",
        google_maps: {
          query: "dental implants Newport Beach CA",
          rank: 6,
          rating: 4.9,
          review_count: 241
        },
        paid_ads_signal: {
          status: "Active Verified Advertiser (Search PPC)",
          advertiser_name: "The Newport Beach Dentist",
          advertiser_id: "AR77889900",
          active_ad_count: "Active Search PPC on high-intent implant terms",
          estimated_cpc: "$85 - $130/click",
          verification_source: "Google Ads Transparency Center"
        },
        top_competitor_5mi: {
          practice_name: "4M Dental Implant Center",
          address: "1401 Avocado Ave, Newport Beach, CA 92660",
          phone: "+1 949-504-4444",
          website: "https://4mdentalimplants.com/",
          rank: 1,
          rating: 4.9,
          review_count: 310
        },
        custom_pitch_hook_1500: "Dr. Haroonian, you are actively paying Google $90+ per click on Newport Beach implant ads, yet 4M Dental Implant Center is monopolizing the #1 Google Maps spot on Irvine Ave. NexusRank1's $1,500 system deploys targeted centroid clusters to propel you into the Top 3 Map Pack."
      };

      // 1. Zip
      expect(isAffluentZip(lead.location.zip_code)).toBe(true);
      // 2. Doctor
      expect(validateDoctor(lead.solo_owner).valid).toBe(true);
      // 3. 0-DSO
      expect(checkDsoDisqualification(lead.practice_name).isDso).toBe(false);
      // 4. Clinical
      expect(checkClinicalSpecialization(lead.google_maps.query + " " + lead.custom_pitch_hook_1500).qualified).toBe(true);
      // 5. Rank
      expect(validateMapPackRank(lead.google_maps.rank).valid).toBe(true);
      // 6. Paid Ads
      expect(validatePaidAdsSignal(lead.paid_ads_signal).valid).toBe(true);
      // 7. Competitor
      expect(validateCompetitor(lead.top_competitor_5mi, lead.practice_name, 1.2).valid).toBe(true);
      // 8. Lead Schema
      const schemaRes = validateLeadSchema(lead);
      expect(schemaRes.valid).toBe(true);
    });

    it("P3-09: Qualified Lead to CSV formatting preserves 20 columns and handles special characters", () => {
      const hookWithQuotesAndDollar = 'Dr. Kaiser said, "We need 5 full-arch cases!" at $1,500/arch, but rival is #1.';
      const csvRow = `"GOAT-001","Total Freedom","domain.com","Dr. Kaiser","DDS","Solo Owner","(480) 860-9002","9002 E Desert Cove Ave","Scottsdale","AZ","85260",5,481,4.9,"Active Verified Advertiser","$65/click","Dental Implant Institute",1,"+1 623-688-9590","${hookWithQuotesAndDollar.replace(/"/g, '""')}"`;
      const fullCsv = `${CANONICAL_CSV_HEADERS.join(",")}\n${csvRow}`;

      const parsed = parseRFC4180Csv(fullCsv);
      expect(parsed.headers.length).toBe(20);
      expect(parsed.rows.length).toBe(1);
      expect(parsed.rows[0].length).toBe(20);
      expect(parsed.rows[0][19]).toBe(hookWithQuotesAndDollar);
    });

    it("P3-10: Multi-credential doctor (DDS, FACP) + Board Certified Prostho in Affluent Zip + Rank #5 -> Full Pipeline PASS", () => {
      const doc = {
        name: "Dr. Alice Hsieh",
        credentials: "DDS, FACP",
        title: "Solo Owner & Board-Certified Prosthodontist",
        background: "Specialist in reconstructive surgical implantology"
      };
      const zip = "85260";
      const rank = 5;

      expect(validateDoctor(doc).valid).toBe(true);
      expect(isAffluentZip(zip)).toBe(true);
      expect(validateMapPackRank(rank).valid).toBe(true);
      expect(checkDsoDisqualification("Scottsdale Esthetic & Implant Dentistry").isDso).toBe(false);
      expect(checkClinicalSpecialization("implantology prosthodontist").qualified).toBe(true);
    });

    it("P3-11: Associate Dentist in Affluent Zip + Rank #5 + Active Ads -> REJECTED by Doctor Title gate", () => {
      const doc = {
        name: "Dr. Jessica Smith",
        credentials: "DDS",
        title: "Senior Associate Dentist",
        background: "Implant surgeon"
      };
      const zip = "90210";
      const rank = 5;

      expect(isAffluentZip(zip)).toBe(true);
      expect(validateMapPackRank(rank).valid).toBe(true);

      const docRes = validateDoctor(doc);
      expect(docRes.valid).toBe(false);
      expect(docRes.reason).toContain("associate");
    });

    it("P3-12: High Rating (5.0) + High Reviews (700+) + Rank #1 (Local 3-Pack) -> REJECTED by Rank gate", () => {
      const rank = 1;
      const rating = 5.0;
      const reviews = 750;

      expect(rating).toBe(5.0);
      expect(reviews).toBeGreaterThan(500);

      const rankRes = validateMapPackRank(rank);
      expect(rankRes.valid).toBe(false);
      expect(rankRes.reason).toContain("Local 3-Pack");
    });

    it("P3-13: Rank #4 + Gatekeeper Competitor at Rank #3 within 0.5 miles -> Validated as Local Pack Displacement target", () => {
      const leadRank = 4;
      const comp = {
        practice_name: "Signature Dental Group Delray Beach",
        address: "Delray Beach, FL 33483",
        phone: "+1 561-276-6684",
        website: "https://signaturedental.com/",
        rank: 3,
        rating: 4.8,
        review_count: 140
      };

      expect(validateMapPackRank(leadRank).valid).toBe(true);
      expect(validateCompetitor(comp, "Delray Beach Laser Periodontics", 0.5).valid).toBe(true);
    });
  });
}

export async function runTier3(): Promise<TestRunnerResult> {
  registerTier3Tests();
  return runRegisteredTests("Tier 3: Cross-Feature Interactions (Pairwise Combinations)");
}

if (process.argv[1]?.endsWith("tier3-pairwise-combinations.test.ts")) {
  runTier3().then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
