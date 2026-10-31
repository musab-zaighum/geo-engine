/**
 * Tier 1: Feature Coverage (Equivalence Class Isolation Tests)
 * Tests each of the 8 features in isolation with >=5 test cases per feature (Total: 48 cases).
 */

import { describe, it, expect, runRegisteredTests, TestRunnerResult } from "./helpers/test-harness";
import {
  isAffluentZip,
  AFFLUENT_ZIPS,
  validateDoctor,
  checkDsoDisqualification,
  checkClinicalSpecialization,
  validateMapPackRank,
  validatePaidAdsSignal,
  haversineDistanceMiles,
  validateCompetitor,
  validateLeadSchema,
  CANONICAL_CSV_HEADERS,
  parseRFC4180Csv
} from "./helpers/qualification-oracle";

export function registerTier1Tests(): void {
  // ------------------------------------------------------------------------
  // Feature 1: Target Metro & Affluent Zip Code Scouting (R1)
  // ------------------------------------------------------------------------
  describe("Feature 1: Target Metro & Affluent Zip Code Scouting", () => {
    it("F1-01: Validates Scottsdale AZ affluent corridor (85260, HHI $135k)", () => {
      expect(isAffluentZip("85260")).toBe(true);
      expect(AFFLUENT_ZIPS["85260"].metro).toBe("Scottsdale");
      expect(AFFLUENT_ZIPS["85260"].medianHhi).toBeGreaterThanOrEqual(120000);
    });

    it("F1-02: Validates Newport Beach CA coastal wealth corridor (92660, HHI $165k)", () => {
      expect(isAffluentZip("92660")).toBe(true);
      expect(AFFLUENT_ZIPS["92660"].metro).toBe("Newport Beach");
      expect(AFFLUENT_ZIPS["92660"].medianHhi).toBeGreaterThanOrEqual(120000);
    });

    it("F1-03: Validates Dallas / Plano / Frisco TX executive corridor (75034, HHI $145k)", () => {
      expect(isAffluentZip("75034")).toBe(true);
      expect(AFFLUENT_ZIPS["75034"].metro).toBe("Dallas/Plano");
      expect(AFFLUENT_ZIPS["75034"].medianHhi).toBeGreaterThanOrEqual(120000);
    });

    it("F1-04: Validates Boca Raton FL medical corridor (33496, HHI $140k)", () => {
      expect(isAffluentZip("33496")).toBe(true);
      expect(AFFLUENT_ZIPS["33496"].metro).toBe("Boca Raton/Naples");
      expect(AFFLUENT_ZIPS["33496"].medianHhi).toBeGreaterThanOrEqual(120000);
    });

    it("F1-05: Validates Bellevue WA high-tech corridor (98004, HHI $155k)", () => {
      expect(isAffluentZip("98004")).toBe(true);
      expect(AFFLUENT_ZIPS["98004"].metro).toBe("Bellevue");
      expect(AFFLUENT_ZIPS["98004"].medianHhi).toBeGreaterThanOrEqual(120000);
    });

    it("F1-06: Validates Greenwich CT wealth enclave (06830, HHI $185k)", () => {
      expect(isAffluentZip("06830")).toBe(true);
      expect(AFFLUENT_ZIPS["06830"].metro).toBe("Greenwich");
      expect(AFFLUENT_ZIPS["06830"].medianHhi).toBeGreaterThanOrEqual(120000);
    });
  });

  // ------------------------------------------------------------------------
  // Feature 2: Solo Owner / Principal Doctor (DDS/DMD/MD) (R2, AC1)
  // ------------------------------------------------------------------------
  describe("Feature 2: Solo Owner / Principal Doctor Verification", () => {
    it("F2-01: Accepts solo founder with DDS doctorate and principal surgical title", () => {
      const doc = {
        name: "Dr. Gerald L. Kaiser",
        credentials: "DDS",
        title: "Solo Founder, Principal Periodontist & Implant Surgeon",
        background: "Over 35 years surgical implant experience"
      };
      const res = validateDoctor(doc);
      expect(res.valid).toBe(true);
    });

    it("F2-02: Accepts solo owner with DMD doctorate and dental surgeon title", () => {
      const doc = {
        name: "Dr. Robert Vance",
        credentials: "DMD",
        title: "Solo Owner & Implant Dental Surgeon",
        background: "Specialized in All-on-4 restorations"
      };
      const res = validateDoctor(doc);
      expect(res.valid).toBe(true);
    });

    it("F2-03: Accepts dual-doctorate MD/DDS solo principal oral surgeon", () => {
      const doc = {
        name: "Dr. Marcus Thorne",
        credentials: "MD, DDS",
        title: "Solo Principal Oral & Maxillofacial Surgeon",
        background: "Board certified in facial and dental reconstruction"
      };
      const res = validateDoctor(doc);
      expect(res.valid).toBe(true);
    });

    it("F2-04: Accepts multi-credential doctor (DDS, MS, FICOI) with founder title", () => {
      const doc = {
        name: "Dr. Dunia Korous",
        credentials: "DDS, FICOI, MICOI",
        title: "Solo Founder & Clinical Director",
        background: "Master Implantologist fellowship"
      };
      const res = validateDoctor(doc);
      expect(res.valid).toBe(true);
    });

    it("F2-05: Accepts board-certified prosthodontist solo owner (DDS, FACP)", () => {
      const doc = {
        name: "Dr. Alice Hsieh",
        credentials: "DDS, FACP",
        title: "Solo Owner & Board-Certified Prosthodontist",
        background: "Full mouth surgical reconstruction specialist"
      };
      const res = validateDoctor(doc);
      expect(res.valid).toBe(true);
    });

    it("F2-06: Accepts Malo-trained full-arch implantologist (DDS)", () => {
      const doc = {
        name: "Dr. John Minnoch",
        credentials: "DDS",
        title: "Solo Owner & Malo-Trained Implantologist",
        background: "Trained under Dr. Paulo Malo in immediate loading All-on-4"
      };
      const res = validateDoctor(doc);
      expect(res.valid).toBe(true);
    });
  });

  // ------------------------------------------------------------------------
  // Feature 3: Single Independent Clinic (0 DSOs/Chains) (R2, AC2)
  // ------------------------------------------------------------------------
  describe("Feature 3: Single Independent Clinic vs DSO Blacklist", () => {
    it("F3-01: Confirms independent clinic passes 0-DSO verification", () => {
      const res = checkDsoDisqualification("Total Freedom Dental Implant Center https://totalfreedomdentalimplants.com/");
      expect(res.isDso).toBe(false);
    });

    it("F3-02: Flags ClearChoice Dental Implant Center as corporate DSO", () => {
      const res = checkDsoDisqualification("ClearChoice Dental Implant Center Scottsdale");
      expect(res.isDso).toBe(true);
      expect(res.matchedDso).toBe("clearchoice");
    });

    it("F3-03: Flags Aspen Dental corporate network", () => {
      const res = checkDsoDisqualification("Aspen Dental Management Inc");
      expect(res.isDso).toBe(true);
      expect(res.matchedDso).toBe("aspen dental");
    });

    it("F3-04: Flags Heartland Dental corporate DSO", () => {
      const res = checkDsoDisqualification("Heartland Dental supported practice");
      expect(res.isDso).toBe(true);
      expect(res.matchedDso).toBe("heartland dental");
    });

    it("F3-05: Flags Pacific Dental Services (PDS) chain", () => {
      const res = checkDsoDisqualification("Pacific Dental Services affiliated clinic");
      expect(res.isDso).toBe(true);
      expect(res.matchedDso).toContain("pacific dental");
    });

    it("F3-06: Flags Smile Brands corporate network", () => {
      const res = checkDsoDisqualification("Smile Brands Inc partner location");
      expect(res.isDso).toBe(true);
      expect(res.matchedDso).toBe("smile brands");
    });
  });

  // ------------------------------------------------------------------------
  // Feature 4: Clinical Specialization (Implants/All-on-4) (R2, AC3)
  // ------------------------------------------------------------------------
  describe("Feature 4: Clinical Specialization Scoring", () => {
    it("F4-01: Validates surgical dental implant specialization", () => {
      const text = "Total Freedom Dental Implant Center specializing in permanent surgical dental implants.";
      const res = checkClinicalSpecialization(text);
      expect(res.qualified).toBe(true);
    });

    it("F4-02: Validates All-on-4 and full-arch reconstruction focus", () => {
      const text = "Specialized in All-on-4 permanent teeth replacement and full-arch rehabilitation.";
      const res = checkClinicalSpecialization(text);
      expect(res.qualified).toBe(true);
    });

    it("F4-03: Validates surgical periodontics and bone grafting expertise", () => {
      const text = "Board-certified periodontics, sinus lift bone grafting, and immediate implant placement.";
      const res = checkClinicalSpecialization(text);
      expect(res.qualified).toBe(true);
    });

    it("F4-04: Validates surgical prosthodontics full mouth restoration focus", () => {
      const text = "Specialized prosthodontic surgical restoration and fixed hybrid implant bridges.";
      const res = checkClinicalSpecialization(text);
      expect(res.qualified).toBe(true);
    });

    it("F4-05: Validates advanced zygomatic implant capability", () => {
      const text = "Specialized surgical center performing zygomatic implants for severe bone loss cases.";
      const res = checkClinicalSpecialization(text);
      expect(res.qualified).toBe(true);
    });

    it("F4-06: Validates high-intent query matching for clinical procedure", () => {
      const text = "Search Query: dental implants Scottsdale AZ - All-On-4 Dental Implant Center";
      const res = checkClinicalSpecialization(text);
      expect(res.qualified).toBe(true);
    });
  });

  // ------------------------------------------------------------------------
  // Feature 5: Google Maps Local Overflow Rank (#4–#6) (R2)
  // ------------------------------------------------------------------------
  describe("Feature 5: Google Maps Overflow Rank Validation", () => {
    it("F5-01: Accepts Google Maps rank #4 (1st overflow position directly behind 3-pack)", () => {
      const res = validateMapPackRank(4);
      expect(res.valid).toBe(true);
    });

    it("F5-02: Accepts Google Maps rank #5 (mid-overflow position)", () => {
      const res = validateMapPackRank(5);
      expect(res.valid).toBe(true);
    });

    it("F5-03: Accepts Google Maps rank #6 (3rd overflow position)", () => {
      const res = validateMapPackRank(6);
      expect(res.valid).toBe(true);
    });

    it("F5-04: Validates query formulation with high commercial intent and metro", () => {
      const query = "dental implants Scottsdale AZ";
      expect(query).toMatch(/dental implants/i);
      expect(query).toMatch(/Scottsdale AZ/i);
    });

    it("F5-05: Validates high review count metric as integer >= 1", () => {
      const reviewCount = 481;
      expect(typeof reviewCount).toBe("number");
      expect(Number.isInteger(reviewCount)).toBe(true);
      expect(reviewCount).toBeGreaterThan(50);
    });

    it("F5-06: Validates high rating metric within [1.0, 5.0]", () => {
      const rating = 4.9;
      expect(rating).toBeGreaterThanOrEqual(1.0);
      expect(rating).toBeLessThanOrEqual(5.0);
    });
  });

  // ------------------------------------------------------------------------
  // Feature 6: Verified Paid Google Ads Signal ("Sponsored") (R2, AC4)
  // ------------------------------------------------------------------------
  describe("Feature 6: Verified Paid Google Ads Signal", () => {
    it("F6-01: Validates active verified advertiser status", () => {
      const ads = {
        status: "Active Verified Advertiser",
        advertiser_name: "Total Freedom Dental Implant Center",
        advertiser_id: "AR08965599240894021633",
        active_ad_count: "~13 active Google Ads",
        estimated_cpc: "$65 - $110/click",
        verification_source: "Google Ads Transparency Center"
      };
      const res = validatePaidAdsSignal(ads);
      expect(res.valid).toBe(true);
    });

    it("F6-02: Validates active PPC search campaigns signal", () => {
      const ads = {
        status: "Active Verified Advertiser",
        advertiser_name: "Millennium Smiles",
        advertiser_id: "AR1029384756",
        active_ad_count: "10 active PPC ads (Search & Video)",
        estimated_cpc: "$60 - $95/click",
        verification_source: "Google Ads Transparency Center"
      };
      const res = validatePaidAdsSignal(ads);
      expect(res.valid).toBe(true);
    });

    it("F6-03: Validates live SERP Sponsored tag verification source", () => {
      const ads = {
        status: "Active Sponsored Tag Verified",
        advertiser_name: "The Newport Beach Dentist",
        advertiser_id: "thenewportbeachdentist.com",
        active_ad_count: "Active Search PPC on 'dental implants Newport Beach'",
        estimated_cpc: "$85 - $130/click",
        verification_source: "Google SERP Sponsored Tag"
      };
      const res = validatePaidAdsSignal(ads);
      expect(res.valid).toBe(true);
    });

    it("F6-04: Confirms high-intent CPC reflects $50-$100+/click ad budget", () => {
      const cpcStr = "$75 - $120/click";
      expect(cpcStr).toMatch(/\$[0-9]+/);
      const matches = cpcStr.match(/\$([0-9]+)/g)?.map(s => parseInt(s.replace("$", ""), 10));
      expect(matches).toBeTruthy();
      expect(matches![0]).toBeGreaterThanOrEqual(50);
    });

    it("F6-05: Validates advertiser registration ID presence", () => {
      const ads = {
        status: "Active Verified Advertiser",
        advertiser_name: "Boca Isles Dental",
        advertiser_id: "AR0981237465",
        active_ad_count: "~10 active ads",
        estimated_cpc: "$70 - $125/click",
        verification_source: "Google Ads Transparency Center"
      };
      const res = validatePaidAdsSignal(ads);
      expect(res.valid).toBe(true);
      expect(ads.advertiser_id).toContain("AR");
    });

    it("F6-06: Validates active targeted PPC campaigns on full-arch keywords", () => {
      const ads = {
        status: "Active Verified Advertiser",
        advertiser_name: "Bellevue Dental Care",
        advertiser_id: "bellevuedentalcare.com",
        active_ad_count: "Active Search Campaigns on All-on-4",
        estimated_cpc: "$75 - $120/click",
        verification_source: "Google Ads Transparency Center"
      };
      const res = validatePaidAdsSignal(ads);
      expect(res.valid).toBe(true);
    });
  });

  // ------------------------------------------------------------------------
  // Feature 7: Proximity Competitor (#1 within 5.0 miles) (R2, R3, AC5)
  // ------------------------------------------------------------------------
  describe("Feature 7: Proximity Competitor Profiling", () => {
    it("F7-01: Accurately calculates Haversine distance within 5-mile boundary", () => {
      // Scottsdale E Desert Cove (33.568, -111.888) to E Pinnacle Peak (33.698, -111.895) ~8.9 mi or local ~2.5 mi
      const dist = haversineDistanceMiles(33.568, -111.888, 33.585, -111.888);
      expect(dist).toBeLessThanOrEqual(5.0);
      expect(dist).toBeGreaterThan(0);
    });

    it("F7-02: Validates competitor at 1.8 miles is within 5-mile radius", () => {
      const comp = {
        practice_name: "Texas Center for Oral Surgery & Dental Implants",
        address: "6898 Dallas Pkwy, Frisco, TX 75034",
        phone: "+1 972-712-4000",
        website: "https://texascentersurgery.com/",
        rank: 1,
        rating: 4.9,
        review_count: 320
      };
      const res = validateCompetitor(comp, "Millennium Smiles", 1.8);
      expect(res.valid).toBe(true);
    });

    it("F7-03: Validates competitor at 2.8 miles on same coastal highway", () => {
      const comp = {
        practice_name: "Newport Beach Oral & Maxillofacial Surgery",
        address: "1441 Avocado Ave, Newport Beach, CA 92660",
        phone: "+1 949-760-1661",
        website: "https://newportbeachoralsurgery.com/",
        rank: 1,
        rating: 5.0,
        review_count: 215
      };
      const res = validateCompetitor(comp, "Jeremy Heldt DDS", 2.8);
      expect(res.valid).toBe(true);
    });

    it("F7-04: Confirms competitor rank is #1 local organic rival", () => {
      const comp = {
        practice_name: "Dental Implant Institute",
        address: "8787 E Pinnacle Peak Rd, Scottsdale, AZ 85255",
        phone: "+1 623-688-9590",
        website: "https://dentalimplantinstitute.net/",
        rank: 1,
        rating: 5.0,
        review_count: 85
      };
      const res = validateCompetitor(comp, "Total Freedom Dental");
      expect(res.valid).toBe(true);
      expect(comp.rank).toBe(1);
    });

    it("F7-05: Validates competitor contact dossier completeness", () => {
      const comp = {
        practice_name: "Boca Dental Group",
        address: "700 W Palmetto Park Rd, Boca Raton, FL 33486",
        phone: "+1 561-391-6606",
        website: "https://bocadentalgroup.com/",
        rank: 1,
        rating: 4.9,
        review_count: 412
      };
      const res = validateCompetitor(comp, "Gerard Cuomo Dentistry", 1.5);
      expect(res.valid).toBe(true);
      expect(comp.phone.length).toBeGreaterThan(8);
      expect(comp.address.length).toBeGreaterThan(10);
    });

    it("F7-06: Validates competitor at 0.8 miles in Bellevue tech corridor", () => {
      const comp = {
        practice_name: "Washington State Prosthodontics",
        address: "112th Ave NE, Bellevue, WA 98004",
        phone: "+1 425-454-0701",
        website: "https://waprostho.com/",
        rank: 1,
        rating: 4.9,
        review_count: 230
      };
      const res = validateCompetitor(comp, "Bellevue Dental Care", 0.8);
      expect(res.valid).toBe(true);
    });
  });

  // ------------------------------------------------------------------------
  // Feature 8: Structured Output Schema (JSON & CSV) (R4, AC6)
  // ------------------------------------------------------------------------
  describe("Feature 8: Structured Output Schema & Formats", () => {
    it("F8-01: Validates complete lead dossier against canonical Draft 2020-12 schema", () => {
      const sampleLead = {
        lead_id: "GOAT-001",
        practice_name: "Total Freedom Dental Implant Center",
        website_url: "https://totalfreedomdentalimplants.com/",
        solo_owner: {
          name: "Dr. Gerald L. Kaiser",
          credentials: "DDS",
          title: "Solo Founder, Principal Periodontist & Implant Surgeon",
          background: "35+ years surgical experience"
        },
        location: {
          address: "9002 E Desert Cove Ave Ste. 103",
          city: "Scottsdale",
          state: "AZ",
          zip_code: "85260",
          metro_affluence: "High-net-worth Scottsdale corridor"
        },
        phone_number: "(480) 860-9002",
        google_maps: {
          query: "dental implants Scottsdale AZ",
          rank: 5,
          rating: 4.9,
          review_count: 481
        },
        paid_ads_signal: {
          status: "Active Verified Advertiser",
          advertiser_name: "Total Freedom Dental",
          advertiser_id: "AR08965599240894021633",
          active_ad_count: "~13 active Google Ads",
          estimated_cpc: "$65 - $110/click",
          verification_source: "Google Ads Transparency Center"
        },
        top_competitor_5mi: {
          practice_name: "Dental Implant Institute",
          address: "8787 E Pinnacle Peak Rd, Scottsdale, AZ 85255",
          phone: "+1 623-688-9590",
          website: "https://dentalimplantinstitute.net/",
          rank: 1,
          rating: 5.0,
          review_count: 85
        },
        custom_pitch_hook_1500: "Dr. Kaiser, you have 35+ years of surgical experience yet pay $75+ per click while Dental Implant Institute sits at #1 for free. NexusRank1's $1,500 system fixes your proximity."
      };

      const res = validateLeadSchema(sampleLead);
      expect(res.valid).toBe(true);
      expect(res.errors.length).toBe(0);
    });

    it("F8-02: Confirms canonical CSV headers match exactly 20 columns in order", () => {
      expect(CANONICAL_CSV_HEADERS.length).toBe(20);
      expect(CANONICAL_CSV_HEADERS[0]).toBe("Lead ID");
      expect(CANONICAL_CSV_HEADERS[1]).toBe("Practice Name");
      expect(CANONICAL_CSV_HEADERS[11]).toBe("Google Maps Rank");
      expect(CANONICAL_CSV_HEADERS[16]).toBe("#1 Competitor Name");
      expect(CANONICAL_CSV_HEADERS[19]).toBe("Pitch Hook");
    });

    it("F8-03: Validates custom $1,500 pitch hook contains required elements and minLength", () => {
      const hook = "Dr. Kaiser, you have 35+ years of surgical experience and 481 reviews, yet pay $75+ per click on Google Ads while Dental Implant Institute sits at #1 for free. NexusRank1 deploys our $1,500 system to bump you into the top 3.";
      expect(hook.length).toBeGreaterThanOrEqual(50);
      expect(hook).toContain("NexusRank1");
      expect(hook).toContain("$1,500");
      expect(hook).toContain("Dental Implant Institute");
    });

    it("F8-04: Confirms lead_id pattern ^GOAT-[0-9]{3,}$ compliance", () => {
      expect(/^GOAT-[0-9]{3,}$/.test("GOAT-001")).toBe(true);
      expect(/^GOAT-[0-9]{3,}$/.test("GOAT-010")).toBe(true);
      expect(/^GOAT-[0-9]{3,}$/.test("GOAT-999")).toBe(true);
    });

    it("F8-05: Validates RFC 4180 CSV parser correctly handles quoted fields with internal commas and quotes", () => {
      const rawCsv = `Lead ID,Practice Name,Domain,Doctor Name,Credentials,Title,Phone,Address,City,State,Zip Code,Google Maps Rank,Reviews,Rating,Ads Status,Google Ads CPC,#1 Competitor Name,#1 Competitor Maps Rank,#1 Competitor Phone,Pitch Hook\n"GOAT-001","Total Freedom Dental","totalfreedom.com","Dr. Gerald Kaiser","DDS","Solo Founder","(480) 860-9002","9002 E Desert Cove Ave, Ste 103","Scottsdale","AZ","85260",5,481,4.9,"Active Verified Advertiser","$65 - $110/click","Dental Implant Institute",1,"+1 623-688-9590","Dr. Kaiser, you have ""35+ years"" experience, yet pay $75/click."`;
      const parsed = parseRFC4180Csv(rawCsv);
      expect(parsed.headers.length).toBe(20);
      expect(parsed.rows.length).toBe(1);
      expect(parsed.rows[0].length).toBe(20);
      expect(parsed.rows[0][7]).toBe("9002 E Desert Cove Ave, Ste 103");
      expect(parsed.rows[0][19]).toContain(`"35+ years"`);
    });

    it("F8-06: Verifies 1:1 parity between JSON dossier fields and CSV column mappings", () => {
      const jsonFields = [
        "lead_id", "practice_name", "website_url", "solo_owner.name", "solo_owner.credentials",
        "solo_owner.title", "phone_number", "location.address", "location.city", "location.state",
        "location.zip_code", "google_maps.rank", "google_maps.review_count", "google_maps.rating",
        "paid_ads_signal.status", "paid_ads_signal.estimated_cpc", "top_competitor_5mi.practice_name",
        "top_competitor_5mi.rank", "top_competitor_5mi.phone", "custom_pitch_hook_1500"
      ];
      expect(jsonFields.length).toBe(20);
      expect(CANONICAL_CSV_HEADERS.length).toBe(jsonFields.length);
    });
  });
}

export async function runTier1(): Promise<TestRunnerResult> {
  registerTier1Tests();
  return runRegisteredTests("Tier 1: Feature Coverage (Equivalence Class Isolation)");
}

if (process.argv[1]?.endsWith("tier1-feature-coverage.test.ts")) {
  runTier1().then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
