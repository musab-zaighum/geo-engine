## 2026-11-01T14:13:58Z
You are spec_miner_clinician_ux_1.
Your working directory is: /home/pwn/geo-engine/.agents/teamwork/spec_miner_clinician_ux_1/
Read /home/pwn/geo-engine/.agents/teamwork/ORIGINAL_REQUEST.md.

MANDATORY DIRECTIVE:
You are a specification and clinician UX investigator. You MUST NOT modify source files in /home/pwn/geo-engine/src. Write your analysis and remediation specifications ONLY in /home/pwn/geo-engine/.agents/teamwork/spec_miner_clinician_ux_1/.

Your task:
Evaluate the entire NexusRank1 platform (http://localhost:3000/, /pricing, /partner-console, /report/[domain], etc.) through the clinician persona lens:
1. Persona Context:
   - Target users: Private practice solo owners, surgical implantologists, cosmetic dentists, and medspa medical directors.
   - Goal: High-ticket case acquisition ($5,000–$40,000 cases), outranking local competitors taking their high-intent patients, and defending against predatory local competitors.
2. Developer Jargon Audit:
   - Identify any residual developer/SEO jargon (e.g. raw "JSON-LD", "schema markup", "scraped", "DOM", "crawlers", "HTTP status", "meta tags", "payload") that creates cognitive friction or confusion for a practicing doctor.
   - For every jargon phrase found, formulate the exact clinician-centric translation (e.g. "AI Search Schema" -> "Clinical AI Knowledge Graph", "Verified Practice Architecture", "Doctor Authority Graph").
3. Value Framing & Trust:
   - Ensure every diagnostic, score, and metric translates into clear clinical and financial value (e.g., missed implant consultations, monthly lost patient revenue, competitor displacement hook).
   - Verify clarity of the $1,500 one-time deployment terms across all touchpoints (chat, pricing, modals).
4. Actionable Remediation Specs:
   - Produce a file-by-file specification of recommended copy and UI tweaks for the remediation worker.

Document your comprehensive UX audit and exact remediation specifications in /home/pwn/geo-engine/.agents/teamwork/spec_miner_clinician_ux_1/handoff.md.
Send a completion message back to the orchestrator when done.
