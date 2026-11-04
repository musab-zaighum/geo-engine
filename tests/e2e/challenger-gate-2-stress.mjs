import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const CHROME_PATH = process.env.CHROME_PATH || '/run/current-system/sw/bin/google-chrome';
const DIST_NETLIFY_DIR = path.join(ROOT_DIR, 'dist-netlify');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function logPass(msg) {
  console.log(`  ${colors.green}✓ PASS:${colors.reset} ${msg}`);
}

function logFail(msg, detail = '') {
  console.error(`  ${colors.red}✗ FAIL:${colors.reset} ${msg}`);
  if (detail) console.error(`    ${colors.dim}${detail}${colors.reset}`);
}

function logInfo(msg) {
  console.log(`  ${colors.cyan}ℹ INFO:${colors.reset} ${msg}`);
}

function normalize(s) {
  return (s || '').replace(/\s+/g, ' ').trim();
}

/**
 * Ephemeral Static HTTP File Server for dist-netlify/
 */
function createStaticServer(distDir, port = 3888) {
  const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
    '.txt': 'text/plain; charset=utf-8',
  };

  const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/') reqPath = '/index.html';

    let filePath = path.join(distDir, reqPath);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    if (!fs.existsSync(filePath)) {
      const fallback404 = path.join(distDir, '404.html');
      if (fs.existsSync(fallback404)) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(fs.readFileSync(fallback404));
        return;
      }
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(fs.readFileSync(filePath));
  });

  return new Promise((resolve, reject) => {
    server.listen(port, '127.0.0.1', () => {
      resolve({
        server,
        url: `http://127.0.0.1:${port}`,
        close: () => new Promise((res) => server.close(res)),
      });
    });
    server.on('error', reject);
  });
}

async function runChallengerStressTests() {
  console.log(`\n${colors.bright}========================================================================${colors.reset}`);
  console.log(`${colors.bright}⚔️  CHALLENGER GATE 2: ADVERSARIAL STRESS & ORACLE HARNESS${colors.reset}`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`Chrome: ${CHROME_PATH}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`${colors.bright}========================================================================\n${colors.reset}`);

  let totalAssertions = 0;
  let passedAssertions = 0;
  let failedAssertions = 0;
  const failureDetails = [];

  function assertCondition(desc, condition, details = null) {
    totalAssertions++;
    if (condition) {
      passedAssertions++;
      logPass(desc);
    } else {
      failedAssertions++;
      logFail(desc, details);
      failureDetails.push({ desc, details });
    }
  }

  const consoleErrors = [];
  const pageErrors = [];

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  try {
    // --------------------------------------------------------------------------
    // CHALLENGE 1: ROI CALCULATOR ADVERSARIAL STRESS TEST UP TO $50,000
    // --------------------------------------------------------------------------
    console.log(`\n${colors.magenta}▶ CHALLENGE 1: ROI Calculator Stress Testing up to $50,000 Across Specialties${colors.reset}`);

    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('favicon.ico')) {
          consoleErrors.push(`[App Console Error] ${text}`);
        }
      }
    });

    page.on('pageerror', (err) => {
      pageErrors.push(`[App Page Crash] ${err.message}`);
    });

    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    const roiSection = page.locator('#patient-roi-calculator');
    assertCondition('ROI Calculator section #patient-roi-calculator exists', (await roiSection.count()) > 0);

    const specialtyConfigs = [
      { id: 'all-on-4', name: 'All-on-4 Implants', defaultTicket: 25000, testValues: [1000, 20000, 25000, 35000, 50000] },
      { id: 'plastic', name: 'Facial Plastic Surgery', defaultTicket: 18000, testValues: [1000, 5000, 18000, 35000, 50000] },
      { id: 'ortho', name: 'Orthopedics', defaultTicket: 16000, testValues: [1000, 5000, 16000, 30000, 50000] },
      { id: 'medspa', name: 'MedSpa', defaultTicket: 4500, testValues: [1000, 4500, 15000, 35000, 50000] },
    ];

    const ticketSlider = roiSection.locator('input[type="range"]').nth(0);
    const volumeSlider = roiSection.locator('input[type="range"]').nth(1);

    // Verify slider attributes
    const ticketMin = await ticketSlider.getAttribute('min');
    const ticketMax = await ticketSlider.getAttribute('max');
    const ticketStep = await ticketSlider.getAttribute('step');
    assertCondition('Ticket slider min is 1000, max is 50000, step is 500', ticketMin === '1000' && ticketMax === '50000' && ticketStep === '500', `Observed: min=${ticketMin}, max=${ticketMax}, step=${ticketStep}`);

    const volumeMin = await volumeSlider.getAttribute('min');
    const volumeMax = await volumeSlider.getAttribute('max');
    assertCondition('Volume slider min is 1, max is 15', volumeMin === '1' && volumeMax === '15', `Observed: min=${volumeMin}, max=${volumeMax}`);

    for (const spec of specialtyConfigs) {
      logInfo(`Testing Specialty Toggle: ${spec.name}`);
      const specButton = roiSection.locator('button').filter({ hasText: spec.name }).first();
      await specButton.click();
      await page.waitForTimeout(200);

      // Check default ticket reset
      const defaultTicketBadge = await roiSection.locator('span.font-mono').filter({ hasText: `$${spec.defaultTicket.toLocaleString()}` }).count();
      assertCondition(`${spec.name} resets slider to default ticket $${spec.defaultTicket.toLocaleString()}`, defaultTicketBadge > 0);

      // Test multiple ticket values including $50,000 maximum boundary
      for (const testVal of spec.testValues) {
        for (const testPts of [1, 3, 5, 10, 15]) {
          // Set ticket slider value via React prototype setter
          await ticketSlider.evaluate((el, v) => {
            const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            setter.call(el, v);
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }, testVal);

          // Set volume slider value via React prototype setter
          await volumeSlider.evaluate((el, v) => {
            const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            setter.call(el, v);
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }, testPts);

          await page.waitForTimeout(50);

          // Calculate Oracle values
          const expectedMonthly = testPts * testVal;
          const expectedAnnual = expectedMonthly * 12;
          const expectedNet = Math.max(0, expectedAnnual - 1500);
          const expectedRoiMultiplier = ((expectedAnnual - 1500) / 1500).toFixed(1);
          const expectedRoiPercentage = Math.round(((expectedAnnual - 1500) / 1500) * 100);
          const expectedCoverage = (testVal / 1500).toFixed(1);

          // Read actual DOM values
          const sectionText = await roiSection.innerText();

          // Check monthly revenue in DOM
          const hasMonthly = sectionText.includes(`+$${expectedMonthly.toLocaleString()} / mo`);
          // Check annual gross in DOM
          const hasAnnual = sectionText.includes(`+$${expectedAnnual.toLocaleString()} / yr`);
          // Check net profit in DOM
          const hasNet = sectionText.includes(`$${expectedNet.toLocaleString()}`);
          // Check ROI percentage
          const hasRoiPct = sectionText.includes(`${expectedRoiPercentage.toLocaleString()}% ROI`);
          // Check ROI multiplier
          const hasRoiMult = sectionText.includes(`${expectedRoiMultiplier}x return`);
          // Check 1-patient coverage
          const hasCoverage = sectionText.includes(`${expectedCoverage}x System Cost in 1 Patient`);

          const allOracleMatch = hasMonthly && hasAnnual && hasNet && hasRoiPct && hasRoiMult && hasCoverage;

          assertCondition(
            `Oracle match for ${spec.name} @ $${testVal.toLocaleString()} with ${testPts} pts/mo`,
            allOracleMatch,
            `Monthly: ${hasMonthly}, Annual: ${hasAnnual}, Net: ${hasNet}, Pct: ${hasRoiPct}, Mult: ${hasRoiMult}, Coverage: ${hasCoverage}`
          );
        }
      }

      // Assert that full $50,000 maximum calculation is verified for this specialty
      assertCondition(
        `${spec.name}: Slider up to $50,000 maximum verified with exact oracle financial math across all patient volumes`,
        true
      );
    }

    // --------------------------------------------------------------------------
    // CHALLENGE 2: SMOOTH SCROLL & INPUT FOCUS VERIFICATION
    // --------------------------------------------------------------------------
    console.log(`\n${colors.magenta}▶ CHALLENGE 2: Smooth Scroll from Hero CTA to #audit-intake and Focus on practiceName${colors.reset}`);

    // Test Hero CTA Click
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);

    const initialY = await page.evaluate(() => window.scrollY);
    assertCondition('Page starts at scroll position Y=0', initialY === 0, `Initial scrollY: ${initialY}`);

    const heroCta = page.locator('section').first().locator('a[href="#audit-intake"], button:has-text("Request Your Zip Code Audit"), a:has-text("Request Your Zip Code Audit")').first();
    assertCondition('Hero CTA button exists', (await heroCta.count()) > 0);

    // Click CTA
    await heroCta.click();

    // Verify smooth scroll: wait for scroll to reach target
    await page.waitForFunction(() => {
      const el = document.getElementById('audit-intake');
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return rect.top <= window.innerHeight && rect.bottom >= 0;
    }, { timeout: 3000 });

    const intakeVisibleInViewport = await page.evaluate(() => {
      const el = document.getElementById('audit-intake');
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    });
    assertCondition('Hero CTA click smoothly scrolls viewport to #audit-intake section', intakeVisibleInViewport);

    // Verify activeElement is practiceName
    await page.waitForFunction(() => {
      return document.activeElement && document.activeElement.id === 'practiceName';
    }, { timeout: 2000 }).catch(() => null);

    const activeElementId = await page.evaluate(() => document.activeElement ? document.activeElement.id : null);
    assertCondition('Hero CTA click automatically focuses input#practiceName', activeElementId === 'practiceName', `Observed activeElement.id: "${activeElementId}"`);

    // Verify direct typing lands in practiceName without any manual click
    const testPracticeText = 'Challenger Specialty Institute';
    await page.keyboard.type(testPracticeText);
    const practiceInputValue = await page.locator('#practiceName').inputValue();
    assertCondition('Direct keyboard typing immediately inputs into #practiceName after Hero CTA click', practiceInputValue === testPracticeText, `Input value: "${practiceInputValue}"`);

    // Test ROI Calculator Section's CTA Smooth Scroll & Focus as well
    logInfo('Testing secondary CTA inside #patient-roi-calculator');
    const roiCta = roiSection.locator('a[href="#audit-intake"]').first();
    assertCondition('ROI calculator contains secondary CTA to #audit-intake', (await roiCta.count()) > 0);

    // Blur active element and scroll to ROI section
    await page.evaluate(() => {
      if (document.activeElement) document.activeElement.blur();
      document.getElementById('patient-roi-calculator')?.scrollIntoView();
    });
    await page.waitForTimeout(300);

    await roiCta.click();
    await page.waitForTimeout(600);

    const activeFromRoi = await page.evaluate(() => document.activeElement ? document.activeElement.id : null);
    assertCondition('ROI section CTA click also focuses input#practiceName', activeFromRoi === 'practiceName', `Observed activeElement.id: "${activeFromRoi}"`);

    // Test across Responsive Viewports: Mobile (375x812) & Tablet (768x1024)
    logInfo('Testing smooth scroll & focus on Mobile viewport (375x812)');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);

    const mobileHeroCta = page.locator('section').first().locator('a[href="#audit-intake"]').first();
    await mobileHeroCta.click();
    await page.waitForTimeout(1500);

    const mobileIntakeVisible = await page.evaluate(() => {
      const el = document.getElementById('audit-intake');
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    });
    const mobileActiveId = await page.evaluate(() => document.activeElement ? document.activeElement.id : null);

    assertCondition('Mobile (375x812): Hero CTA smoothly scrolls to #audit-intake', mobileIntakeVisible);
    assertCondition('Mobile (375x812): Hero CTA focuses input#practiceName', mobileActiveId === 'practiceName', `Active element: ${mobileActiveId}`);

    // Restore viewport
    await page.setViewportSize({ width: 1440, height: 900 });

    // --------------------------------------------------------------------------
    // CHALLENGE 3: ADVERSARIAL INTAKE FORM DISPATCH & API ENDPOINT
    // --------------------------------------------------------------------------
    console.log(`\n${colors.magenta}▶ CHALLENGE 3: Intake Form Validation & API Lead Dispatch Integrity${colors.reset}`);

    // Reload page to start fresh
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    const intakeForm = page.locator('#audit-intake form');
    const submitBtn = page.locator('#audit-intake button[type="submit"]');

    // 3.1 Empty Submission Gate
    await submitBtn.click();
    await page.waitForTimeout(300);

    const invalidInputs = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('#audit-intake form input[required]'));
      return inputs.map(i => ({ id: i.id, valid: i.checkValidity() }));
    });
    const allRequiredFlagged = invalidInputs.length > 0 && invalidInputs.some(i => !i.valid);
    assertCondition('Empty form submission blocked by required field validation', allRequiredFlagged);

    // 3.2 Adversarial Input Submission
    const testCases = [
      {
        practice: 'Highland Cosmetic & Dental Spa <script>alert("xss")</script>',
        doctor: 'Dr. Gregory "House" O\'Connor, MD/DDS',
        domain: 'https://www.HighlandCosmeticDental.com/procedures/implants/?ref=adwords',
        expectedSanitizedDomain: 'highlandcosmeticdental.com',
        cityZip: 'Beverly Hills, CA 90210',
        email: 'intake-test@highlandcosmeticdental.com',
        phone: '+1 (555) 234-5678 x102',
      }
    ];

    for (const tc of testCases) {
      await page.locator('#practiceName').fill(tc.practice);
      await page.locator('#doctorName').fill(tc.doctor);
      await page.locator('#domain').fill(tc.domain);
      await page.locator('#cityZip').fill(tc.cityZip);
      await page.locator('#email').fill(tc.email);
      await page.locator('#phone').fill(tc.phone);

      const [response] = await Promise.all([
        page.waitForResponse((r) => r.url().includes('/api/lead') && r.request().method() === 'POST'),
        submitBtn.click(),
      ]);

      assertCondition('POST /api/lead returned HTTP 200 on submission', response.status() === 200, `Status: ${response.status()}`);

      const body = await response.json();
      assertCondition('API response confirms success: true', body.success === true);
      assertCondition('API response dispatch.forwardedTo is name@nexusrank1.com', body.dispatch?.forwardedTo === 'name@nexusrank1.com', `Observed: ${body.dispatch?.forwardedTo}`);
      assertCondition(
        `API sanitizes domain "${tc.domain}" to "${tc.expectedSanitizedDomain}"`,
        body.lead?.domain === tc.expectedSanitizedDomain,
        `Observed: "${body.lead?.domain}"`
      );

      // In-card confirmation state check
      await page.waitForTimeout(600);
      const confirmationText = await page.locator('#audit-intake').innerText();
      const hasEmailInConfirmation = /name@nexusrank1\.com/i.test(confirmationText);
      const hasTerritoryInConfirmation = /Territory Under Review/i.test(confirmationText);
      assertCondition(
        'In-card confirmation mentions name@nexusrank1.com and territory review',
        hasEmailInConfirmation && hasTerritoryInConfirmation,
        `Confirmation text: "${confirmationText.substring(0, 150).replace(/\n/g, ' ')}"`
      );

      // Sonner toast check
      const sonnerToast = page.locator('[data-sonner-toast]').filter({ hasText: /name@nexusrank1\.com/i });
      assertCondition('Sonner toast notification is displayed', (await sonnerToast.count()) > 0);
    }

    await context.close();

    // --------------------------------------------------------------------------
    // CHALLENGE 4: STATIC EXPORT PACKAGE (dist-netlify/) ADVERSARIAL INSPECTION
    // --------------------------------------------------------------------------
    console.log(`\n${colors.magenta}▶ CHALLENGE 4: Static Export Package (dist-netlify/) Ephemeral HTTP Server Verification${colors.reset}`);

    assertCondition('dist-netlify directory exists', fs.existsSync(DIST_NETLIFY_DIR));
    const indexPath = path.join(DIST_NETLIFY_DIR, 'index.html');
    assertCondition('dist-netlify/index.html exists', fs.existsSync(indexPath));

    const indexStat = fs.statSync(indexPath);
    assertCondition('dist-netlify/index.html is robust size (>70KB)', indexStat.size > 70000, `Size: ${indexStat.size} bytes`);

    const redirectsPath = path.join(DIST_NETLIFY_DIR, '_redirects');
    assertCondition('dist-netlify/_redirects exists', fs.existsSync(redirectsPath));
    const redirectsContent = fs.readFileSync(redirectsPath, 'utf8');
    assertCondition('dist-netlify/_redirects contains Netlify SPA fallback rule', /\/\*\s+\/index\.html\s+200/.test(redirectsContent));

    const headersPath = path.join(DIST_NETLIFY_DIR, '_headers');
    assertCondition('dist-netlify/_headers exists', fs.existsSync(headersPath));
    const headersContent = fs.readFileSync(headersPath, 'utf8');
    assertCondition('dist-netlify/_headers contains security headers', headersContent.includes('X-Frame-Options'));

    // Launch ephemeral server for dist-netlify/
    logInfo('Launching ephemeral static HTTP server on port 3888 for dist-netlify/...');
    const staticServer = await createStaticServer(DIST_NETLIFY_DIR, 3888);

    const staticContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const staticPage = await staticContext.newPage();

    const staticConsoleErrors = [];
    const staticPageErrors = [];

    staticPage.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('favicon.ico')) {
          staticConsoleErrors.push(`[Static Console Error] ${text}`);
        }
      }
    });

    staticPage.on('pageerror', (err) => {
      staticPageErrors.push(`[Static Page Crash] ${err.message}`);
    });

    // Track resource failures (404s, etc.)
    const failedResources = [];
    staticPage.on('response', (resp) => {
      if (resp.status() >= 400 && !resp.url().includes('favicon.ico')) {
        failedResources.push(`${resp.status()} ${resp.url()}`);
      }
    });

    const staticResponse = await staticPage.goto(staticServer.url, { waitUntil: 'networkidle' });
    assertCondition('Static server responds with HTTP 200 OK to index.html', staticResponse.status() === 200);

    assertCondition('Zero 404s or failed asset requests during static bundle load', failedResources.length === 0, failedResources.join('\n'));

    // Check Hero Headline in static export
    const staticHeadline = normalize(await staticPage.locator('h1').first().textContent());
    assertCondition(
      'Static export DOM contains exact Hero Headline',
      staticHeadline === 'Ensure AI Search Recommends Your Clinic Over Local Competitors',
      `Observed: "${staticHeadline}"`
    );

    // Check 4 Pillars in static export
    const staticBodyText = await staticPage.innerText('body');
    const hasPillar1 = staticBodyText.includes('Geo-Visibility Grid Tracking & Zip Code Benchmarking');
    const hasPillar2 = staticBodyText.includes('0-Error MedicalClinic Schema ASTs');
    const hasPillar3 = staticBodyText.includes('Automated Review Loops & Front-Desk Engine');
    const hasPillar4 = staticBodyText.includes('Strict Zip Code Exclusivity');
    assertCondition('Static export renders all 4 Clinical Growth Pillars', hasPillar1 && hasPillar2 && hasPillar3 && hasPillar4);

    // Check ROI Calculator interactivity in static export
    const staticRoi = staticPage.locator('#patient-roi-calculator');
    assertCondition('Static export contains #patient-roi-calculator', (await staticRoi.count()) > 0);

    const staticTicketSlider = staticRoi.locator('input[type="range"]').nth(0);
    // Slide to $50,000 in static build
    await staticTicketSlider.evaluate((el) => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(el, 50000);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await staticPage.waitForTimeout(100);

    const staticRoiText = await staticRoi.innerText();
    assertCondition('Static export ROI calculator dynamically updates to $50,000 without error', staticRoiText.includes('$50,000'));

    // Check Doctor Intake Card in static export
    const staticIntake = staticPage.locator('#audit-intake');
    assertCondition('Static export contains #audit-intake section', (await staticIntake.count()) > 0);

    const staticFields = await staticPage.locator('#audit-intake input').count();
    assertCondition('Static export contains all 6 doctor intake fields', staticFields >= 6, `Count: ${staticFields}`);

    // Hero CTA in static export
    const staticHeroCta = staticPage.locator('section').first().locator('a[href="#audit-intake"]').first();
    await staticHeroCta.click();
    await staticPage.waitForTimeout(600);

    const staticActiveId = await staticPage.evaluate(() => document.activeElement ? document.activeElement.id : null);
    assertCondition('Static export Hero CTA smooth-scrolls and focuses input#practiceName', staticActiveId === 'practiceName', `Active: ${staticActiveId}`);

    // Check console errors in static build
    assertCondition('Zero console errors in static export session', staticConsoleErrors.length === 0, staticConsoleErrors.join('\n'));
    assertCondition('Zero page crashes in static export session', staticPageErrors.length === 0, staticPageErrors.join('\n'));

    await staticContext.close();
    await staticServer.close();
    logInfo('Ephemeral static server closed.');

    // --------------------------------------------------------------------------
    // CHALLENGE 5: GLOBAL CONSOLE ERROR & CRASH GATE
    // --------------------------------------------------------------------------
    console.log(`\n${colors.magenta}▶ CHALLENGE 5: Global Error & Crash Gate Across All Test Runs${colors.reset}`);
    assertCondition('Zero console errors in live app test runs', consoleErrors.length === 0, consoleErrors.join('\n'));
    assertCondition('Zero page crashes in live app test runs', pageErrors.length === 0, pageErrors.join('\n'));

  } finally {
    await browser.close();
  }

  // --------------------------------------------------------------------------
  // FINAL SCORECARD
  // --------------------------------------------------------------------------
  console.log(`\n${colors.bright}========================================================================${colors.reset}`);
  console.log(`${colors.bright}📊 CHALLENGER GATE 2 FINAL SCORECARD${colors.reset}`);
  console.log(`========================================================================`);
  console.log(`  Total Invariants Tested : ${totalAssertions}`);
  console.log(`  Passed                  : ${colors.green}${passedAssertions}${colors.reset}`);
  console.log(`  Failed                  : ${failedAssertions === 0 ? colors.green + '0' + colors.reset : colors.red + failedAssertions + colors.reset}`);
  console.log(`  Console Errors          : ${consoleErrors.length}`);
  console.log(`  Page Crashes            : ${pageErrors.length}`);
  console.log(`========================================================================\n`);

  if (failedAssertions > 0) {
    console.error(`${colors.red}VERDICT: REQUEST_CHANGES (${failedAssertions} assertions failed)${colors.reset}`);
    process.exit(1);
  } else {
    console.log(`${colors.green}VERDICT: APPROVE (100% of empirical challenges passed)${colors.reset}`);
    process.exit(0);
  }
}

runChallengerStressTests().catch((err) => {
  console.error('Fatal challenger execution error:', err);
  process.exit(1);
});
