/**
 * Challenger v4.3 Final Adversarial Verification Harness
 */

import { chromium } from 'playwright';
import http from 'http';
import { executeOssScraperPipeline } from '../src/lib/oss-scrapers-engine.js';
import { scrapeWithPlaywright } from '../src/lib/playwright-scraper.js';

const BASE_URL = 'http://localhost:3000';
const CHROME_PATH = '/run/current-system/sw/bin/google-chrome';

function fetchUrl(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const reqOptions = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: options.timeout || 30000,
    };

    const req = http.request(reqOptions, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const body = Buffer.concat(chunks);
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body,
          text: body.toString('utf-8'),
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Timeout fetching ${url}`));
    });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function run() {
  console.log('================================================================');
  console.log('🕵️ CHALLENGER V4.3 ADVERSARIAL VERIFICATION RUN');
  console.log('================================================================\n');

  const findings = [];

  // 1. TEST /api/report/pdf with uppercase protocols
  console.log('--- 1. Testing /api/report/pdf endpoint ---');
  const pdfTargets = [
    'HTTPS://DENTALPRACTICE.COM',
    'HTTP://MYCLINIC.COM',
    'HTTPS://WWW.BEVERLYHILLSIMPLANTS.COM/PATH',
    'HTTP://SUB.CLINIC.ORG/',
  ];

  for (const target of pdfTargets) {
    const url = `${BASE_URL}/api/report/pdf?domain=${encodeURIComponent(target)}`;
    try {
      const res = await fetchUrl(url, { timeout: 15000 });
      const is200 = res.statusCode === 200;
      const isPdf = res.headers['content-type'] === 'application/pdf';
      const isHeader = res.body.slice(0, 5).toString('utf-8') === '%PDF-';
      const size = res.body.length;

      if (is200 && isPdf && isHeader && size > 50000) {
        console.log(`  ✅ /api/report/pdf?domain=${encodeURIComponent(target)} -> 200 PDF (${size} bytes)`);
      } else {
        console.log(`  ❌ /api/report/pdf failed for ${target}: code ${res.statusCode}, size ${size}`);
        findings.push(`PDF route failed for ${target}: status ${res.statusCode}`);
      }
    } catch (e) {
      console.log(`  ❌ PDF route error for ${target}: ${e.message}`);
      findings.push(`PDF route exception for ${target}: ${e.message}`);
    }
  }

  // 2. TEST LIVE InstantAuditBar UI
  console.log('\n--- 2. Testing InstantAuditBar UI on Live Server ---');
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const uiTargets = [
    { input: 'HTTPS://DENTALPRACTICE.COM', expectedDomain: 'dentalpractice.com' },
    { input: 'HTTP://MYCLINIC.COM', expectedDomain: 'myclinic.com' },
    { input: 'HTTPS://WWW.BEVERLYHILLSIMPLANTS.COM/PATH', expectedDomain: 'beverlyhillsimplants.com' },
    { input: 'HTTP://SUB.CLINIC.ORG/', expectedDomain: 'sub.clinic.org' },
    { input: '   HTTPS://DENTALPRACTICE.COM   ', expectedDomain: 'dentalpractice.com' },
    { input: 'HTTPS://DENTALPRACTICE.COM/', expectedDomain: 'dentalpractice.com' },
    { input: 'HTTPS://SUB.PRACTICE.COM/ABOUT', expectedDomain: 'sub.practice.com' },
    { input: '<script>alert("xss")</script>', expectedDomain: '<script>alert("xss")<' },
  ];

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });

  for (const tc of uiTargets) {
    console.log(`  Testing UI input: "${tc.input}"...`);
    await page.fill('#audit-bar input[type="text"]', tc.input);
    await page.click('#audit-bar button[type="submit"], #audit-bar button:has-text("Run Instant GEO Audit")');

    // Wait for scan to complete (scan takes ~3.8s, wait up to 8s)
    await page.waitForTimeout(4500);

    const reportHref = await page.getAttribute('#audit-bar a[href*="/report/"]', 'href').catch(() => null);
    const pdfHref = await page.getAttribute('#audit-bar a[href*="/api/report/pdf"]', 'href').catch(() => null);
    const auditId = await page.innerText('#audit-bar code:has-text("-GEO")').catch(() => null);
    const clinicTitle = await page.innerText('#audit-results-card h3').catch(() => null);

    console.log(`    Report Href: ${reportHref}`);
    console.log(`    PDF Href:    ${pdfHref}`);
    console.log(`    Audit ID:    ${auditId}`);
    console.log(`    Clinic Name: ${clinicTitle}`);

    if (reportHref && reportHref.includes('/report/HTTPS:') || reportHref && reportHref.includes('/report/HTTP:')) {
      findings.push(`UI Defect: Report link corrupted to protocol string: ${reportHref}`);
      console.log('    ❌ Report link truncated to HTTP(S):');
    } else if (pdfHref && pdfHref.includes('domain=HTTPS%3A') || pdfHref && pdfHref.includes('domain=HTTP%3A')) {
      findings.push(`UI Defect: PDF link corrupted to protocol string: ${pdfHref}`);
      console.log('    ❌ PDF link truncated to HTTP(S):');
    } else if (clinicTitle === 'Https Clinic' || clinicTitle === 'Http Clinic') {
      findings.push(`UI Defect: Clinic Name truncated/corrupted to "${clinicTitle}" for input "${tc.input}"`);
      console.log(`    ❌ Clinic Name corrupted: "${clinicTitle}"`);
    } else {
      console.log('    ✅ UI cleanly rendered domain links without protocol truncation');
    }
  }

  await browser.close();

  // 3. TEST BACKEND SCRAPER PIPELINE CASE-SENSITIVITY DEFECT
  console.log('\n--- 3. Testing Backend Scraper Pipeline on Uppercase Protocols ---');

  console.log('  Testing executeOssScraperPipeline("HTTP://SUB.CLINIC.ORG/")...');
  try {
    const ossResult = await executeOssScraperPipeline('HTTP://SUB.CLINIC.ORG/');
    console.log(`    Scraper success: ${ossResult.success}, engine: ${ossResult.engineUsed}`);
  } catch (e) {
    console.log(`    Scraper thrown error: ${e.message}`);
  }

  console.log('  Testing scrapeWithPlaywright("HTTPS://DENTALPRACTICE.COM")...');
  try {
    const pwResult = await scrapeWithPlaywright('HTTPS://DENTALPRACTICE.COM');
    console.log(`    Playwright success: ${pwResult.success}, error: ${pwResult.errorMessage}`);
    if (pwResult.errorMessage && pwResult.errorMessage.includes('fetch failed')) {
      findings.push('Backend Scraper Defect: scrapeWithPlaywright fails on uppercase protocol (attempts https://https//...)');
    }
  } catch (e) {
    console.log(`    Playwright thrown error: ${e.message}`);
  }

  console.log('\n================================================================');
  console.log('VERIFICATION FINDINGS SUMMARY');
  console.log('================================================================');
  console.log(`Total Findings/Defects Flagged: ${findings.length}`);
  findings.forEach((f, i) => console.log(`${i + 1}. ${f}`));

  const verdict = findings.length === 0 ? 'CONFIRM_CORRECTNESS' : 'DEFECT_FOUND';
  console.log(`\nEXPLICIT VERDICT: ${verdict}`);
  console.log('================================================================\n');

  return { verdict, findings };
}

run()
  .then((res) => {
    process.exit(res.verdict === 'CONFIRM_CORRECTNESS' ? 0 : 1);
  })
  .catch((err) => {
    console.error('Fatal test error:', err);
    process.exit(2);
  });
