const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'public-report-test.log');
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

async function run() {
  fs.writeFileSync(LOG_FILE, '');
  log('Starting Public Report (/report/[domain]) Test Suite');

  const browser = await chromium.launch({
    executablePath: '/run/current-system/sw/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    permissions: ['clipboard-read', 'clipboard-write'],
  });

  const page = await context.newPage();

  const consoleLogs = [];
  const consoleErrors = [];
  const failedRequests = [];

  page.on('console', (msg) => {
    const text = msg.text();
    const type = msg.type();
    consoleLogs.push({ type, text });
    if (type === 'error') {
      consoleErrors.push(text);
      log(`BROWSER CONSOLE ERROR: ${text}`);
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(err.message);
    log(`PAGE UNHANDLED ERROR: ${err.message}`);
  });

  page.on('requestfailed', (req) => {
    failedRequests.push({ url: req.url(), failure: req.failure() });
    log(`REQUEST FAILED: ${req.url()} (${req.failure()?.errorText})`);
  });

  try {
    const testDomain = 'dentalpractice.com';
    const reportUrl = `http://localhost:3000/report/${testDomain}`;
    log(`Navigating to ${reportUrl}...`);

    const response = await page.goto(reportUrl, {
      waitUntil: 'networkidle',
      timeout: 15000,
    });

    log(`Response HTTP Status: ${response.status()}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_public_report_initial.png') });

    // 1. Verify Title & Score
    const headerTitle = await page.locator('h1').innerText();
    const practiceTitle = await page.locator('h2').innerText();
    log(`Header Title: "${headerTitle}", Practice Title: "${practiceTitle}"`);

    const scoreText = await page.locator('text=/100').locator('..').innerText();
    log(`Score Display: "${scoreText.replace(/\n/g, ' ')}"`);

    // Verify 4 Metric Blocks
    const metricBlocks = await page.$$('.grid.grid-cols-2 > div, .grid.grid-cols-2.lg\\:grid-cols-4 > div');
    log(`Found ${metricBlocks.length} metric blocks`);

    // Verify Broken Images
    const images = await page.$$eval('img', (imgs) =>
      imgs.map((img) => ({
        src: img.src,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
      }))
    );
    const brokenImages = images.filter((img) => img.naturalWidth === 0);
    log(`Images on page: ${images.length}, Broken Images: ${brokenImages.length}`);
    if (brokenImages.length > 0) {
      log(`Broken image details: ${JSON.stringify(brokenImages)}`);
    }

    // 2. Tab 1: Diagnostic Checklist (Overview)
    log('--- Testing Tab 1: Diagnostic Checklist ---');
    const checklistItems = await page.$$eval('.space-y-3 > div', (divs) => divs.map((d) => d.innerText.split('\n')[0]));
    log(`Checklist items found: ${JSON.stringify(checklistItems)}`);

    // 3. Tab 2: Entity Knowledge Graph
    log('--- Testing Tab 2: Entity Knowledge Graph ---');
    const graphTabBtn = page.locator('button:has-text("Entity Knowledge Graph")');
    await graphTabBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_report_graph_tab.png') });

    const graphContainer = await page.locator('.animate-in, svg, canvas').count();
    log(`Graph containers / elements count: ${graphContainer}`);

    // 4. Tab 3: AI Citation Simulator
    log('--- Testing Tab 3: AI Citation Simulator ---');
    const simTabBtn = page.locator('button:has-text("AI Citation Simulator")');
    await simTabBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10_report_simulator_tab.png') });

    const simContent = await page.locator('text=Perplexity, text=ChatGPT, text=Search').count();
    log(`Simulator engine references count: ${simContent}`);

    // 5. Tab 4: 0-Error Code Payload
    log('--- Testing Tab 4: 0-Error Code Payload ---');
    const codeTabBtn = page.locator('button:has-text("0-Error Code Payload")');
    await codeTabBtn.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11_report_code_tab.png') });

    // Test Copy Schema Button
    const copySchemaBtn = page.locator('button:has-text("Copy Schema")').first();
    if (await copySchemaBtn.isVisible()) {
      await copySchemaBtn.click();
      await page.waitForTimeout(300);
      const toastText = await page.locator('[data-sonner-toast]').allInnerTexts();
      log(`Toast after Copy Schema: ${JSON.stringify(toastText)}`);
    }

    // Test Copy /llms.txt Button
    const copyLlmsBtn = page.locator('button:has-text("Copy /llms.txt")').first();
    if (await copyLlmsBtn.isVisible()) {
      await copyLlmsBtn.click();
      await page.waitForTimeout(300);
      const toastText = await page.locator('[data-sonner-toast]').allInnerTexts();
      log(`Toast after Copy /llms.txt: ${JSON.stringify(toastText)}`);
    }

    // 6. Tab 5: Patient Value & Retainer ROI Modeler
    log('--- Testing Tab 5: Patient Value & ROI ---');
    const roiTabBtn = page.locator('button:has-text("Patient Value & ROI")');
    await roiTabBtn.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12_report_roi_tab.png') });

    // Verify initial calculation
    const initialLift = await page.locator('text=Monthly Practice Lift').locator('..').innerText();
    log(`Initial Monthly Practice Lift: "${initialLift.replace(/\n/g, ' ')}"`);

    // Click $8000 case value button
    log('Selecting Case Value = $8,000...');
    const val8kBtn = page.locator('button:has-text("$8k")');
    await val8kBtn.click();
    await page.waitForTimeout(200);

    // Click +5 patients button
    log('Selecting New Patients = +5...');
    const patients5Btn = page.locator('button:has-text("+5")');
    await patients5Btn.click();
    await page.waitForTimeout(200);

    // Click $1500 retainer button
    log('Selecting Retainer = $1500...');
    const fee1500Btn = page.locator('button:has-text("$1500")');
    await fee1500Btn.click();
    await page.waitForTimeout(200);

    const updatedLift = await page.locator('text=Monthly Practice Lift').locator('..').innerText();
    const updatedNet = await page.locator('text=Net Practice Profit').locator('..').innerText();
    log(`Updated Calculation: Monthly Lift="${updatedLift.replace(/\n/g, ' ')}", Net Profit="${updatedNet.replace(/\n/g, ' ')}"`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '13_report_roi_updated.png') });

    // 7. Test Lead / Claim Deployment Modal
    log('--- Testing Lead / Claim Deployment Modal ---');
    const claimBtn = page.locator('button:has-text("Deploy 0-Error Fix"), button:has-text("Claim 0-Error Deployment")').first();
    await claimBtn.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '14_report_lead_modal.png') });

    const modalTitle = await page.locator('text=Claim 0-Error Deployment').first().isVisible();
    log(`Lead Modal is visible: ${modalTitle}`);

    // Test form fields
    const modalDomain = await page.locator('input[disabled]').inputValue();
    log(`Disabled domain input value: "${modalDomain}"`);

    // Fill contact details
    await page.fill('input[placeholder="doctor@practice.com"]', 'test.doctor@dentalpractice.com');
    await page.fill('input[placeholder="+1 (512) 555-0199"]', '(512) 999-1234');
    await page.fill('textarea[placeholder*="Specific requirements"]', 'Automated browser test verification run.');

    // Submit form
    log('Submitting Lead Modal form...');
    const submitBtn = page.locator('button:has-text("Send Request")');
    await submitBtn.click();
    await page.waitForTimeout(600);

    const leadToast = await page.locator('[data-sonner-toast]').allInnerTexts();
    log(`Toast after submitting lead form: ${JSON.stringify(leadToast)}`);

    // Verify modal closed
    await page.waitForTimeout(800);
    const modalClosed = !(await page.locator('text=Claim 0-Error Deployment').first().isVisible());
    log(`Lead modal closed after successful submission: ${modalClosed}`);

    // 8. Test Links (PDF export, Google Rich Results)
    const pdfLink = page.locator('a:has-text("Vector PDF")');
    const pdfHref = await pdfLink.getAttribute('href');
    log(`Vector PDF download href: "${pdfHref}"`);

    const richResultsLink = page.locator('a:has-text("Google Rich Results")');
    const richResultsHref = await richResultsLink.getAttribute('href');
    log(`Google Rich Results link href: "${richResultsHref}"`);

    // 9. Responsive layout test (Mobile Viewport)
    log('--- Testing Mobile Viewport (375x812) ---');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '15_report_mobile_view.png') });

    // Check if horizontal scrollbar exists on body
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    log(`Mobile viewport horizontal overflow: ${hasHorizontalOverflow}`);

    log('=== Public Report Test Completed Successfully ===');
  } catch (err) {
    log(`FATAL ERROR IN REPORT TEST: ${err.message}\n${err.stack}`);
  } finally {
    log(`Summary: ${consoleErrors.length} console errors, ${failedRequests.length} failed requests.`);
    await browser.close();
  }
}

run();
