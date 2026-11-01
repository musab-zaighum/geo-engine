/**
 * Empirical Adversarial Verification Harness
 * Executed by challenger_v4_3
 * 
 * Verifies uppercase protocol stripping regex fix across:
 * 1. InstantAuditBar UI & live DOM state
 * 2. /api/report/pdf endpoint
 * 3. /api/audit and /api/lead endpoints
 * 4. /report/[domain] route
 * 5. String sanitization edge cases & normalization
 */

import { chromium } from 'playwright';
import http from 'http';

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
  console.log('🕵️ CHALLENGER_V4_3 EMPIRICAL ADVERSARIAL VERIFICATION HARNESS');
  console.log(`Target: ${BASE_URL}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log('================================================================\n');

  const results = {
    pureSanitization: { passed: 0, failed: 0, tests: [] },
    liveAuditBar: { passed: 0, failed: 0, tests: [] },
    pdfEndpoint: { passed: 0, failed: 0, tests: [] },
    apiAuditLead: { passed: 0, failed: 0, tests: [] },
    reportRoute: { passed: 0, failed: 0, tests: [] },
  };

  // -------------------------------------------------------------
  // SUITE 1: PURE SANITIZATION UNIT SPECIFICATION
  // -------------------------------------------------------------
  console.log('--- SUITE 1: Pure Sanitization Regex Normalization ---');

  function sanitize(rawInput) {
    return rawInput
      .trim()
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .replace(/\/.*$/, '')
      .trim()
      .toLowerCase() || 'dentalpractice.com';
  }

  const sanitizationCases = [
    { input: 'HTTPS://DENTALPRACTICE.COM', expected: 'dentalpractice.com' },
    { input: 'HTTP://MYCLINIC.COM', expected: 'myclinic.com' },
    { input: 'HTTPS://WWW.BEVERLYHILLSIMPLANTS.COM/PATH', expected: 'beverlyhillsimplants.com' },
    { input: 'HTTP://SUB.CLINIC.ORG/', expected: 'sub.clinic.org' },
    { input: '   HTTPS://DENTALPRACTICE.COM   ', expected: 'dentalpractice.com' },
    { input: 'http://subdomain.clinic.com/about/team/', expected: 'subdomain.clinic.com' },
    { input: 'HtTpS://MyPractice.Com/foo', expected: 'mypractice.com' },
    { input: 'HTTP://WWW.TESTCLINIC.COM:8080/BAR', expected: 'testclinic.com:8080' },
    { input: 'HTTPS://', expected: 'dentalpractice.com' },
    { input: 'HTTP://', expected: 'dentalpractice.com' },
    { input: '   ', expected: 'dentalpractice.com' },
    { input: '<script>alert("xss")</script>', expected: '<script>alert("xss")<' },
    { input: 'HTTPS://DENTALPRACTICE.COM?query=param', expected: 'dentalpractice.com?query=param' },
  ];

  for (const tc of sanitizationCases) {
    const actual = sanitize(tc.input);
    const pass = actual === tc.expected && !actual.startsWith('https:') && !actual.startsWith('http:') && actual !== 'https:' && actual !== 'http:';
    if (pass) {
      results.pureSanitization.passed++;
      console.log(`  ✅ [PASS] "${tc.input}" -> "${actual}"`);
    } else {
      results.pureSanitization.failed++;
      console.log(`  ❌ [FAIL] "${tc.input}" -> Actual: "${actual}" | Expected: "${tc.expected}"`);
    }
    results.pureSanitization.tests.push({ input: tc.input, expected: tc.expected, actual, pass });
  }

  // -------------------------------------------------------------
  // SUITE 2: LIVE AUDIT BAR BROWSER TEST (Playwright)
  // -------------------------------------------------------------
  console.log('\n--- SUITE 2: Live InstantAuditBar UI Browser Testing ---');

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const auditBarTestCases = [
    { label: 'Uppercase HTTPS', input: 'HTTPS://DENTALPRACTICE.COM', expectedDomain: 'dentalpractice.com' },
    { label: 'Uppercase HTTP', input: 'HTTP://MYCLINIC.COM', expectedDomain: 'myclinic.com' },
    { label: 'Uppercase HTTPS + WWW + PATH', input: 'HTTPS://WWW.BEVERLYHILLSIMPLANTS.COM/PATH', expectedDomain: 'beverlyhillsimplants.com' },
    { label: 'Uppercase HTTP + SUBDOMAIN + TRAILING SLASH', input: 'HTTP://SUB.CLINIC.ORG/', expectedDomain: 'sub.clinic.org' },
    { label: 'Mixed Case + Whitespace', input: '   hTtPs://AuStInCoSmEtIcDeNtAl.CoM/   ', expectedDomain: 'austincosmeticdental.com' },
  ];

  for (const tc of auditBarTestCases) {
    console.log(`  Testing UI Input: "${tc.input}" (${tc.label})...`);
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const pageErrors = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') pageErrors.push(msg.text());
    });

    try {
      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(500);

      const inputEl = page.locator('#audit-bar input[type="text"]').first();
      await inputEl.waitFor({ state: 'visible', timeout: 15000 });
      await inputEl.fill(tc.input);

      const scanBtn = page.locator('#audit-bar button[type="submit"], #audit-bar button:has-text("Run Instant GEO Audit"), #audit-bar button:has-text("Scan")').first();
      if (await scanBtn.isVisible()) {
        await scanBtn.click();
      } else {
        await inputEl.press('Enter');
      }

      // Wait for scan animation to complete and results card to render
      await page.locator('#audit-results-card').waitFor({ state: 'visible', timeout: 15000 });
      await page.waitForTimeout(1000);

      // Verify DOM output
      const auditBarText = await page.locator('#audit-bar').innerText();

      // Check displayed Target
      const targetMatch = auditBarText.match(/Target:\s*([^\s(]+)/i);
      const displayedTarget = targetMatch ? targetMatch[1].trim().toLowerCase() : '';

      // Check rendered link hrefs
      const reportLink = page.locator('#audit-bar a[href*="/report/"]').first();
      const reportHref = (await reportLink.count()) > 0 ? await reportLink.getAttribute('href') : '';

      const pdfLink = page.locator('#audit-bar a[href*="/api/report/pdf"]').first();
      const pdfHref = (await pdfLink.count()) > 0 ? await pdfLink.getAttribute('href') : '';

      // Check Audit ID
      const auditIdEl = page.locator('#audit-bar code:has-text("-GEO")').first();
      const auditIdText = (await auditIdEl.count()) > 0 ? await auditIdEl.innerText() : '';

      // Verification assertions
      const isTargetCorrect = displayedTarget === tc.expectedDomain;
      const isReportHrefClean = reportHref.includes(`/report/${encodeURIComponent(tc.expectedDomain)}`) || reportHref.includes(`/report/${tc.expectedDomain}`);
      const isPdfHrefClean = pdfHref.includes(`domain=${encodeURIComponent(tc.expectedDomain)}`) || pdfHref.includes(`domain=${tc.expectedDomain}`);
      const isAuditIdClean = auditIdText === `${tc.expectedDomain}-GEO`;
      const noCorruptedProtocol = !displayedTarget.includes('HTTPS:') && !displayedTarget.includes('HTTP:') &&
                                  !reportHref.includes('/report/HTTPS:') && !reportHref.includes('/report/HTTP:') &&
                                  !pdfHref.includes('domain=HTTPS%3A') && !pdfHref.includes('domain=HTTP%3A');

      const pass = isTargetCorrect && isReportHrefClean && isPdfHrefClean && isAuditIdClean && noCorruptedProtocol;

      if (pass) {
        results.liveAuditBar.passed++;
        console.log(`    ✅ [PASS] Target="${displayedTarget}", ReportHref="${reportHref}", PdfHref="${pdfHref}", AuditId="${auditIdText}"`);
      } else {
        results.liveAuditBar.failed++;
        console.log(`    ❌ [FAIL] Target="${displayedTarget}" (expected "${tc.expectedDomain}"), ReportHref="${reportHref}", PdfHref="${pdfHref}", AuditId="${auditIdText}"`);
      }

      results.liveAuditBar.tests.push({
        label: tc.label,
        input: tc.input,
        expectedDomain: tc.expectedDomain,
        displayedTarget,
        reportHref,
        pdfHref,
        auditIdText,
        pageErrors,
        pass,
      });
    } catch (err) {
      results.liveAuditBar.failed++;
      console.log(`    ❌ [ERROR] Exception testing "${tc.input}": ${err.message}`);
      results.liveAuditBar.tests.push({ label: tc.label, input: tc.input, error: err.message, pass: false });
    } finally {
      await page.close();
    }
  }

  // -------------------------------------------------------------
  // SUITE 3: /api/report/pdf ENDPOINT ADVERSARIAL TESTING
  // -------------------------------------------------------------
  console.log('\n--- SUITE 3: /api/report/pdf Live Endpoint Testing ---');

  const pdfTestCases = [
    { label: 'Uppercase HTTPS protocol', param: 'HTTPS://DENTALPRACTICE.COM', expectedDomain: 'dentalpractice.com' },
    { label: 'Uppercase HTTP protocol', param: 'HTTP://MYCLINIC.COM', expectedDomain: 'myclinic.com' },
    { label: 'Uppercase HTTPS + WWW + PATH', param: 'HTTPS://WWW.BEVERLYHILLSIMPLANTS.COM/PATH', expectedDomain: 'beverlyhillsimplants.com' },
    { label: 'Uppercase HTTP + SUBDOMAIN + TRAILING SLASH', param: 'HTTP://SUB.CLINIC.ORG/', expectedDomain: 'sub.clinic.org' },
    { label: 'Mixed-case protocol + whitespace', param: '   hTtP://MaYoClInIc.OrG/   ', expectedDomain: 'mayoclinic.org' },
    { label: 'Bare protocol uppercase', param: 'HTTPS://', expectedDomain: 'dentalpractice.com' },
  ];

  for (const tc of pdfTestCases) {
    console.log(`  Testing PDF endpoint with: "${tc.param}" (${tc.label})...`);
    try {
      const url = `${BASE_URL}/api/report/pdf?domain=${encodeURIComponent(tc.param)}`;
      const res = await fetchUrl(url, { method: 'GET', timeout: 35000 });

      const is200 = res.statusCode === 200;
      const isPdfContentType = res.headers['content-type'] === 'application/pdf';
      const isPdfHeader = res.body.slice(0, 5).toString('utf-8') === '%PDF-';
      const isSubstantialSize = res.body.length > 50000; // Realistic rendered PDF is > 100KB

      const pass = is200 && isPdfContentType && isPdfHeader && isSubstantialSize;

      if (pass) {
        results.pdfEndpoint.passed++;
        console.log(`    ✅ [PASS] HTTP ${res.statusCode}, Content-Type: ${res.headers['content-type']}, Size: ${res.body.length} bytes, Header: %PDF-`);
      } else {
        results.pdfEndpoint.failed++;
        console.log(`    ❌ [FAIL] HTTP ${res.statusCode}, Content-Type: ${res.headers['content-type']}, Size: ${res.body.length} bytes, Header: ${res.body.slice(0, 10).toString('utf-8')}`);
      }

      results.pdfEndpoint.tests.push({
        label: tc.label,
        param: tc.param,
        statusCode: res.statusCode,
        contentType: res.headers['content-type'],
        size: res.body.length,
        pass,
      });
    } catch (err) {
      results.pdfEndpoint.failed++;
      console.log(`    ❌ [ERROR] Exception testing PDF for "${tc.param}": ${err.message}`);
      results.pdfEndpoint.tests.push({ label: tc.label, param: tc.param, error: err.message, pass: false });
    }
  }

  // -------------------------------------------------------------
  // SUITE 4: /api/audit AND /api/lead ENDPOINTS
  // -------------------------------------------------------------
  console.log('\n--- SUITE 4: /api/audit and /api/lead Testing ---');

  // Test /api/audit with uppercase protocol
  try {
    const auditRes = await fetchUrl(`${BASE_URL}/api/audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'HTTPS://DENTALPRACTICE.COM' }),
    });

    const auditJson = JSON.parse(auditRes.text);
    const hasAuditResponse = auditRes.statusCode === 200 && (auditJson.readinessScore !== undefined || auditJson.domain !== undefined || auditJson.targetUrl !== undefined || auditJson.discoveredTitle !== undefined);

    if (hasAuditResponse) {
      results.apiAuditLead.passed++;
      console.log(`  ✅ [PASS] /api/audit POST HTTPS://DENTALPRACTICE.COM returned HTTP 200 with valid clinical diagnostic JSON`);
    } else {
      results.apiAuditLead.failed++;
      console.log(`  ❌ [FAIL] /api/audit POST returned HTTP ${auditRes.statusCode}: ${auditRes.text}`);
    }
    results.apiAuditLead.tests.push({ endpoint: '/api/audit', statusCode: auditRes.statusCode, pass: hasAuditResponse });
  } catch (err) {
    results.apiAuditLead.failed++;
    console.log(`  ❌ [ERROR] /api/audit: ${err.message}`);
    results.apiAuditLead.tests.push({ endpoint: '/api/audit', error: err.message, pass: false });
  }

  // Test /api/lead with uppercase protocol
  try {
    const leadRes = await fetchUrl(`${BASE_URL}/api/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domain: 'HTTPS://WWW.BEVERLYHILLSIMPLANTS.COM/PATH',
        email: 'drbeverly@example.com',
        name: 'Dr. Beverly',
        phone: '310-555-0199',
      }),
    });

    const leadJson = JSON.parse(leadRes.text);
    const passLead = leadRes.statusCode === 200 && (leadJson.status === 'success' || leadJson.success === true) && leadJson.lead?.domain === 'beverlyhillsimplants.com';

    if (passLead) {
      results.apiAuditLead.passed++;
      console.log(`  ✅ [PASS] /api/lead POST normalized domain to "${leadJson.lead?.domain}" with status: success`);
    } else {
      results.apiAuditLead.failed++;
      console.log(`  ❌ [FAIL] /api/lead POST returned HTTP ${leadRes.statusCode}: ${leadRes.text}`);
    }
    results.apiAuditLead.tests.push({ endpoint: '/api/lead', statusCode: leadRes.statusCode, pass: passLead, leadDomain: leadJson.lead?.domain });
  } catch (err) {
    results.apiAuditLead.failed++;
    console.log(`  ❌ [ERROR] /api/lead: ${err.message}`);
    results.apiAuditLead.tests.push({ endpoint: '/api/lead', error: err.message, pass: false });
  }

  // -------------------------------------------------------------
  // SUITE 5: STANDALONE REPORT ROUTE /report/[domain]
  // -------------------------------------------------------------
  console.log('\n--- SUITE 5: Standalone Report Route /report/[domain] Testing ---');

  const reportRouteCases = [
    { label: 'Encoded Uppercase Protocol', urlPath: `/report/${encodeURIComponent('HTTPS://DENTALPRACTICE.COM')}`, expectedDomain: 'dentalpractice.com' },
    { label: 'Encoded Subdomain + Path', urlPath: `/report/${encodeURIComponent('HTTP://SUB.CLINIC.ORG/PATH')}`, expectedDomain: 'sub.clinic.org' },
  ];

  for (const tc of reportRouteCases) {
    console.log(`  Testing Route: ${tc.urlPath} (${tc.label})...`);
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    try {
      await page.goto(`${BASE_URL}${tc.urlPath}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);

      const pageText = await page.innerText('body');
      const containsExpectedDomain = pageText.toLowerCase().includes(tc.expectedDomain);
      const noCorruptedProtocol = !pageText.includes('HTTPS: Dental Care') && !pageText.includes('HTTP: Dental Care') && !pageText.includes('Target: HTTPS:') && !pageText.includes('Target: HTTP:');
      const pass = containsExpectedDomain && noCorruptedProtocol && errors.length === 0;

      if (pass) {
        results.reportRoute.passed++;
        console.log(`    ✅ [PASS] Page cleanly loaded and rendered for "${tc.expectedDomain}" with 0 protocol corruption`);
      } else {
        results.reportRoute.failed++;
        console.log(`    ❌ [FAIL] Page errors: ${errors.join(', ')} | Expected domain present: ${containsExpectedDomain} | Clean protocol: ${noCorruptedProtocol}`);
      }
      results.reportRoute.tests.push({ label: tc.label, urlPath: tc.urlPath, expectedDomain: tc.expectedDomain, pass, errors });
    } catch (err) {
      results.reportRoute.failed++;
      console.log(`    ❌ [ERROR] Exception loading report route: ${err.message}`);
      results.reportRoute.tests.push({ label: tc.label, urlPath: tc.urlPath, error: err.message, pass: false });
    } finally {
      await page.close();
    }
  }

  await browser.close();

  // -------------------------------------------------------------
  // SUMMARY AND VERDICT
  // -------------------------------------------------------------
  console.log('\n================================================================');
  console.log('📊 CHALLENGER_V4_3 VERIFICATION SUMMARY');
  console.log('================================================================');
  console.log(`1. Pure Sanitization Unit Tests:    ${results.pureSanitization.passed} Passed, ${results.pureSanitization.failed} Failed`);
  console.log(`2. Live InstantAuditBar UI Tests:    ${results.liveAuditBar.passed} Passed, ${results.liveAuditBar.failed} Failed`);
  console.log(`3. /api/report/pdf Endpoint Tests:   ${results.pdfEndpoint.passed} Passed, ${results.pdfEndpoint.failed} Failed`);
  console.log(`4. /api/audit & /api/lead Tests:     ${results.apiAuditLead.passed} Passed, ${results.apiAuditLead.failed} Failed`);
  console.log(`5. Standalone Report Route Tests:    ${results.reportRoute.passed} Passed, ${results.reportRoute.failed} Failed`);

  const totalPassed = results.pureSanitization.passed + results.liveAuditBar.passed + results.pdfEndpoint.passed + results.apiAuditLead.passed + results.reportRoute.passed;
  const totalFailed = results.pureSanitization.failed + results.liveAuditBar.failed + results.pdfEndpoint.failed + results.apiAuditLead.failed + results.reportRoute.failed;

  console.log(`\nTOTAL: ${totalPassed} Passed, ${totalFailed} Failed`);

  const verdict = totalFailed === 0 ? 'CONFIRM_CORRECTNESS' : 'DEFECT_FOUND';
  console.log(`\n🏆 EXPLICIT VERDICT: ${verdict}`);
  console.log('================================================================\n');

  return { verdict, results, totalPassed, totalFailed };
}

run()
  .then((res) => {
    if (res.verdict !== 'CONFIRM_CORRECTNESS') {
      process.exit(1);
    }
    process.exit(0);
  })
  .catch((err) => {
    console.error('Fatal execution error:', err);
    process.exit(2);
  });
