## 2026-11-01T16:20:51Z
You are worker_backend_scheme_fix_1.
Your working directory is: /home/pwn/geo-engine/.agents/teamwork/worker_backend_scheme_fix_1/
Read /home/pwn/geo-engine/.agents/teamwork/ORIGINAL_REQUEST.md.
Read /home/pwn/geo-engine/.agents/teamwork/challenger_v4_3/handoff.md for the defect details and reproduction scripts.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your task:
Fix the backend scraper scheme normalization defect identified by challenger_v4_3:
1. In `src/lib/oss-scrapers-engine.ts`:
   Around line 98, replace:
   ```typescript
   if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
     cleanUrl = `https://${cleanUrl}`;
   }
   ```
   with:
   ```typescript
   if (!/^https?:\/\//i.test(cleanUrl)) {
     cleanUrl = `https://${cleanUrl}`;
   }
   ```
2. In `src/lib/playwright-scraper.ts`:
   Around line 137, replace:
   ```typescript
   const cleanUrl = targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;
   ```
   with:
   ```typescript
   const cleanUrl = /^https?:\/\//i.test(targetUrl) ? targetUrl : `https://${targetUrl}`;
   ```
3. In `src/app/api/audit/route.ts`:
   Around line 223 (and anywhere else in `route.ts` with protocol detection), replace:
   ```typescript
   if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
     targetUrl = `https://${targetUrl}`;
   }
   ```
   with:
   ```typescript
   if (!/^https?:\/\//i.test(targetUrl)) {
     targetUrl = `https://${targetUrl}`;
   }
   ```
4. Run:
   ```bash
   npx tsx -e "
   import { executeOssScraperPipeline } from './src/lib/oss-scrapers-engine';
   import { scrapeWithPlaywright } from './src/lib/playwright-scraper';
   console.log('Testing scheme parsing with uppercase schemes:');
   "
   ```
   Verify that uppercase schemes like `HTTP://SUB.CLINIC.ORG/` or `HTTPS://DENTALPRACTICE.COM` do NOT result in double scheme prefixes like `https://http//` or `https://https//`.
5. Run `npx tsc --noEmit` and confirm 0 TypeScript errors.
6. Run `npm run build` and confirm all 15/15 routes compile cleanly.

Document your changes and verification in /home/pwn/geo-engine/.agents/teamwork/worker_backend_scheme_fix_1/handoff.md and send a completion message back to the orchestrator.
