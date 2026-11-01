# Handoff Report: Adversarial Verification of Protocol Stripping & URL Normalization

**Agent**: `challenger_v4_3`  
**Working Directory**: `/home/pwn/geo-engine/.agents/teamwork/challenger_v4_3/`  
**Parent**: `orchestrator_4` (`3bd8238a-db03-4c7f-806b-03fdf07f6c98`)  
**Verdict**: **`DEFECT_FOUND`**

---

## 1. Observation

Direct observations obtained through Playwright browser automation, direct API requests, and live Node.js/TypeScript execution against `http://localhost:3000` and the codebase:

### A. InstantAuditBar UI & PDF Route Sanitization (Frontend Fix Verified)
1. **Frontend Normalization**:
   - `src/components/InstantAuditBar.tsx`, lines 196–203:
     ```typescript
     const clean = rawInput
       .trim()
       .replace(/^https?:\/\//i, '')
       .replace(/^www\./i, '')
       .replace(/\/.*$/, '')
       .trim()
       .toLowerCase() || 'dentalpractice.com';
     ```
   - Live browser automated tests (`scripts/challenger-v4-3-final-verify.mjs`) confirmed:
     - `HTTPS://DENTALPRACTICE.COM` -> Report: `/report/dentalpractice.com?unbranded=true`, PDF: `/api/report/pdf?domain=dentalpractice.com`, Audit ID: `dentalpractice.com-GEO`.
     - `HTTP://MYCLINIC.COM` -> Report: `/report/myclinic.com?unbranded=true`, PDF: `/api/report/pdf?domain=myclinic.com`, Audit ID: `myclinic.com-GEO`.
     - `HTTPS://WWW.BEVERLYHILLSIMPLANTS.COM/PATH` -> Report: `/report/beverlyhillsimplants.com?unbranded=true`, PDF: `/api/report/pdf?domain=beverlyhillsimplants.com`, Audit ID: `beverlyhillsimplants.com-GEO`.
     - `HTTP://SUB.CLINIC.ORG/` -> Report: `/report/sub.clinic.org?unbranded=true`, PDF: `/api/report/pdf?domain=sub.clinic.org`, Audit ID: `sub.clinic.org-GEO`.
     - Edge Cases: Whitespace (`   HTTPS://DENTALPRACTICE.COM   `), trailing slashes (`HTTPS://DENTALPRACTICE.COM/`), and subdomains (`HTTPS://SUB.PRACTICE.COM/ABOUT`) all normalize cleanly to lowercase domains.
     - Script tag (`<script>alert("xss")</script>`) triggers 0 alerts and 0 uncaught exceptions.
   - Result: Frontend truncation to `"HTTPS:"` or `"HTTP:"` is **fully eliminated** in the UI.

2. **`/api/report/pdf` Endpoint**:
   - `src/app/api/report/pdf/route.ts`, lines 30–36:
     ```typescript
     const cleanDomain = domainParam
       .trim()
       .replace(/^https?:\/\//i, '')
       .replace(/^www\./i, '')
       .replace(/\/.*$/, '')
       .trim()
       .toLowerCase() || 'dentalpractice.com';
     ```
   - Direct HTTP test commands:
     - `curl -s -o /tmp/test-out.pdf -w "%{http_code} %{content_type} %{size_download}\n" "http://localhost:3000/api/report/pdf?domain=HTTPS%3A%2F%2FDENTALPRACTICE.COM"`
       - Verbatim Output: `200 application/pdf 768578` (valid `%PDF-1.4%`)
     - `curl -s -o /tmp/test-out.pdf -w "%{http_code} %{content_type} %{size_download}\n" "http://localhost:3000/api/report/pdf?domain=HTTP%3A%2F%2FMYCLINIC.COM"`
       - Verbatim Output: `200 application/pdf 695648` (valid `%PDF-1.4%`)
     - `curl -s -o /tmp/test-out.pdf -w "%{http_code} %{content_type} %{size_download}\n" "http://localhost:3000/api/report/pdf?domain=HTTPS%3A%2F%2FWWW.BEVERLYHILLSIMPLANTS.COM%2FPATH"`
       - Verbatim Output: `200 application/pdf 754952` (valid `%PDF-1.4%`)
     - `curl -s -o /tmp/test-out.pdf -w "%{http_code} %{content_type} %{size_download}\n" "http://localhost:3000/api/report/pdf?domain=HTTP%3A%2F%2FSUB.CLINIC.ORG%2F"`
       - Verbatim Output: `200 application/pdf 747864` (valid `%PDF-1.4%`)
   - Result: Vector PDF generation handles uppercase protocols cleanly with HTTP 200.

---

### B. Active Defect in Backend Scraper Engine (`DEFECT_FOUND`)
While the regex `/i` fix resolved client-side UI truncation and PDF query string parsing, the live backend scraping pipeline suffers from the **same case-sensitivity failure mode** when handling uppercase protocols.

1. **Defect in `src/lib/oss-scrapers-engine.ts:98`**:
   ```typescript
   export async function executeOssScraperPipeline(targetUrl: string): Promise<OssScraperResult> {
     // Normalize target URL with defensive scheme
     let cleanUrl = (targetUrl || '').trim();
     if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
       cleanUrl = `https://${cleanUrl}`;
     }
   ```
   - When `targetUrl` is `'HTTP://SUB.CLINIC.ORG/'` or `'HTTPS://WWW.BEVERLYHILLSIMPLANTS.COM/PATH'`, `cleanUrl.startsWith('http://')` and `cleanUrl.startsWith('https://')` are **both false** because `.startsWith()` is case-sensitive.
   - Consequently, `cleanUrl` becomes `https://HTTP://SUB.CLINIC.ORG/` or `https://HTTPS://WWW.BEVERLYHILLSIMPLANTS.COM/PATH`.
   - Execution Test:
     ```bash
     npx tsx -e "
     import { executeOssScraperPipeline } from './src/lib/oss-scrapers-engine';
     executeOssScraperPipeline('HTTP://SUB.CLINIC.ORG/').then(r => console.log('success:', r.success));
     "
     ```
   - Verbatim Log Output:
     ```text
     Playwright Chrome launch note: page.goto: net::ERR_NAME_NOT_RESOLVED at https://http//SUB.CLINIC.ORG/
     Call log:
       - navigating to "https://http//SUB.CLINIC.ORG/", waiting until "domcontentloaded"

     success: false
     ```

2. **Defect in `src/lib/playwright-scraper.ts:137`**:
   ```typescript
   export async function scrapeWithPlaywright(targetUrl: string): Promise<PlaywrightScrapeResult> {
     let browser: Browser | null = null;
     const cleanUrl = targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;
   ```
   - When `targetUrl` is `'HTTPS://DENTALPRACTICE.COM'`, `targetUrl.startsWith('http')` is **false**.
   - `cleanUrl` becomes `https://HTTPS://DENTALPRACTICE.COM`.
   - Origin calculation `new URL(cleanUrl).origin` evaluates to `https://http` or `https://https`.
   - Calls to `${origin}/llms.txt` and `${origin}/robots.txt` immediately throw `ENOTFOUND https` / `ENOTFOUND http`.
   - Playwright navigates to `https://https//DENTALPRACTICE.COM` and fails with `net::ERR_NAME_NOT_RESOLVED`.
   - Execution Test:
     ```bash
     npx tsx -e "
     import { scrapeWithPlaywright } from './src/lib/playwright-scraper';
     scrapeWithPlaywright('HTTPS://DENTALPRACTICE.COM').then(r => console.log(r));
     "
     ```
   - Verbatim Log Output:
     ```text
     Playwright Chrome launch note: page.goto: net::ERR_NAME_NOT_RESOLVED at https://https//DENTALPRACTICE.COM
     Call log:
       - navigating to "https://https//DENTALPRACTICE.COM", waiting until "domcontentloaded"

     Playwright scrape success: undefined
     Error message: fetch failed
     ```

3. **Defect in `src/app/api/audit/route.ts:223`**:
   ```typescript
   } catch {
     if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
       targetUrl = `https://${targetUrl}`;
     }
   }
   ```
   - Case-sensitive fallback check reproduces the same double-scheme corruption if `discoverClinicUrl` throws or falls back.

---

## 2. Logic Chain

1. **Premise**: Adversarial review must verify uppercase protocol handling across the entire application stack: client input, API routes, and backend scraper pipelines.
2. **Observation 1**: In `InstantAuditBar.tsx` and `api/report/pdf/route.ts`, the regex `/^https?:\/\//i` with case-insensitivity successfully strips protocols and normalizes domain strings to clean lowercase names without `"HTTPS:"` or `"HTTP:"` truncation.
3. **Observation 2**: When a user inputs an uppercase URL into the UI or calls `/api/audit`, the raw query is dispatched to the backend scraping pipeline (`executeOssScraperPipeline` and `scrapeWithPlaywright`).
4. **Observation 3**: In `src/lib/oss-scrapers-engine.ts:98` and `src/lib/playwright-scraper.ts:137`, protocol prefix detection uses case-sensitive `.startsWith('http')` checks without `/i` or `.toLowerCase()`.
5. **Inference**: Any URL with uppercase `HTTP://` or `HTTPS://` fails `.startsWith('http')`, causing the backend to prepend `https://`, transforming `HTTPS://DOMAIN.COM` into `https://https//DOMAIN.COM`.
6. **Observation 4**: In empirical test execution, Got HTTP requests and Playwright navigations to `https://https//...` fail with `net::ERR_NAME_NOT_RESOLVED`, causing live scraping to abort with `fetch failed`.
7. **Conclusion**: While client-side truncation is fixed, the backend scraper engine contains an active case-sensitivity defect on uppercase protocol inputs, requiring an explicit verdict of **DEFECT_FOUND**.

---

## 3. Caveats

- **Client UI Stability**: The client UI does not crash or display `"HTTPS:"` anymore. Client-side normalization properly cleans the domain before generating report links, PDF links, and audit IDs.
- **Production Build & Typecheck**: The project builds cleanly (`npm run build` compiled 15/15 routes successfully) and passes TypeScript typecheck with 0 errors (`npx tsc --noEmit`).
- **Scope of Defect**: The defect occurs specifically within backend scraper URL preparation when uppercase protocol URLs bypass client-side stripping (e.g. direct `/api/audit` API calls or pass-through queries).
- **Review-Only Role**: In adherence to the Review-Only constraint, no implementation code modifications were performed by this agent.

---

## 4. Conclusion

**Explicit Verdict**: **`DEFECT_FOUND`**

### Summary of Findings & Required Remediation:
1. **Frontend UI & PDF Export (`InstantAuditBar.tsx`, `/api/report/pdf`)**: **PASS**. Regex `/i` fix successfully verified; 0 truncation to `"HTTPS:"` or `"HTTP:"`.
2. **Backend Scraper Scheme Normalization (`src/lib/oss-scrapers-engine.ts:98`, `src/lib/playwright-scraper.ts:137`, `src/app/api/audit/route.ts:223`)**: **FAIL (`DEFECT_FOUND`)**.
   - **Root Cause**: `.startsWith('http')` is case-sensitive, prepending `https://` to already-schemed uppercase URLs (`https://https//...` / `https://http//...`), crashing live scraping with `net::ERR_NAME_NOT_RESOLVED`.
   - **Recommended Fix**:
     In `src/lib/oss-scrapers-engine.ts`:
     ```typescript
     let cleanUrl = (targetUrl || '').trim();
     if (!/^https?:\/\//i.test(cleanUrl)) {
       cleanUrl = `https://${cleanUrl}`;
     }
     ```
     In `src/lib/playwright-scraper.ts`:
     ```typescript
     const cleanUrl = /^https?:\/\//i.test(targetUrl) ? targetUrl : `https://${targetUrl}`;
     ```
     In `src/app/api/audit/route.ts`:
     ```typescript
     if (!/^https?:\/\//i.test(targetUrl)) {
       targetUrl = `https://${targetUrl}`;
     }
     ```

---

## 5. Verification Method

To independently reproduce and verify both the passing UI/PDF tests and the active backend scraper defect, run:

1. **Verify UI & PDF Endpoints**:
   ```bash
   npx tsx scripts/challenger-v4-3-final-verify.mjs
   ```

2. **Empirically Reproduce Backend Scraper Double-Scheme Defect**:
   ```bash
   npx tsx -e "
   import { executeOssScraperPipeline } from './src/lib/oss-scrapers-engine';
   executeOssScraperPipeline('HTTP://SUB.CLINIC.ORG/').then(r => console.log('Scraper Success:', r.success));
   "
   ```
   ```bash
   npx tsx -e "
   import { scrapeWithPlaywright } from './src/lib/playwright-scraper';
   scrapeWithPlaywright('HTTPS://DENTALPRACTICE.COM').then(r => console.log('Playwright Result:', r));
   "
   ```
   *Expected defect output: `Playwright Chrome launch note: page.goto: net::ERR_NAME_NOT_RESOLVED at https://https//DENTALPRACTICE.COM`*
