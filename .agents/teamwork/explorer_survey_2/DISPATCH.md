## 2026-10-31T20:26:21Z
Your identity: Qualification and Discovery Explorer (explorer_survey_2).
Working directory: /home/pwn/geo-engine/.agents/teamwork/explorer_survey_2
Project root directory: /home/pwn/geo-engine
Target output directory: /home/pwn/geo-engine/leads
Parent conversation ID: f1e9e290-ce66-4f4f-88d5-1005ccaeca98

Read the original request at /home/pwn/geo-engine/.agents/teamwork/ORIGINAL_REQUEST.md before starting any work.

Your task is to analyze the technical and domain requirements for the autonomous scouting and qualification pipeline:
1. Scout targets: High-wealth metropolitan zip codes (Scottsdale AZ, Newport Beach CA, Dallas/Plano TX, Boca Raton/Naples FL, Beverly Hills CA, Bellevue WA, Greenwich CT, etc.). Detail median income data sources and specific target zip codes.
2. 7-Point Qualification & Disqualification Engine:
   - Solo Owner / Founder verification via CMS NPI Registry (NPPES API/database), state medical/dental boards, practice "About" page.
   - DSO / corporate chain disqualification: ClearChoice, Aspen Dental, Heartland Dental, Pacific Dental Services, Smile Brands, MB2 Dental, etc.
   - Service specialization: Clinical focus on surgical dental implants, All-on-4, full-arch. Disqualification rules for general dentistry, pediatrics, Medicaid.
   - Google Maps ranking: Identifying practice ranked #4 to #6 on Google Maps Local 3-Pack overflow ("More Places") and disqualifying #1 to #3 or past #15.
   - Paid Google Ads signal: Detecting and verifying "Sponsored" tag on high-intent terms ("dental implants near me", "all on 4 dentist").
   - Proximity competitor: Identifying #1 competitor within 5 miles.
   - Affluent zip code validation.
3. Competitor Intelligence & Displacement Hook: Formulating the pitch hook ("$1,500 Pitch Hook highlighting the exact #1 competitor taking their high-ticket implant patients").
4. Write a comprehensive report to /home/pwn/geo-engine/.agents/teamwork/explorer_survey_2/handoff.md with concrete technical implementation steps and APIs/methods to execute this.
5. Send a message to your parent (f1e9e290-ce66-4f4f-88d5-1005ccaeca98) with a summary and path to your handoff.md.
