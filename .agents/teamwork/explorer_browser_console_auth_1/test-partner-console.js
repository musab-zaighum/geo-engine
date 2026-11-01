const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'partner-console-test.log');
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
  log('Starting Partner Console Test Suite');

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
  const networkErrors = [];

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

  page.on('response', (res) => {
    if (res.status() >= 400) {
      networkErrors.push({ url: res.url(), status: res.status() });
      log(`HTTP ERROR ${res.status()} on ${res.url()}`);
    }
  });

  try {
    // 1. Navigate to /partner-console
    log('Navigating to http://localhost:3000/partner-console');
    const response = await page.goto('http://localhost:3000/partner-console', {
      waitUntil: 'networkidle',
      timeout: 15000,
    });

    log(`Response HTTP Status: ${response.status()}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_partner_console_initial.png') });

    // Verify Title & Header
    const title = await page.textContent('h1');
    log(`Page H1 Title: "${title}"`);

    // Verify 4 Tab Buttons exist
    const tabButtons = await page.$$('button:has-text("Executive Dashboard"), button:has-text("Competitor Steal Radar"), button:has-text("1-Click Schema"), button:has-text("Practice & NPI Licensure")');
    log(`Found ${tabButtons.length} tab navigation buttons`);

    // -------------------------------------------------------------
    // TAB 1: OVERVIEW / EXECUTIVE DASHBOARD
    // -------------------------------------------------------------
    log('--- Testing Tab 1: Executive Dashboard (Overview) ---');
    const readinessCard = await page.locator('text=AI CITATION READINESS').first().isVisible();
    const highTicketCard = await page.locator('text=HIGH-TICKET PROCEDURES').first().isVisible();
    const inquiriesCard = await page.locator('text=EST. 30-DAY INQUIRIES').first().isVisible();
    const pipelineCard = await page.locator('text=EST. PROCEDURE PIPELINE').first().isVisible();
    log(`Overview Metrics: Readiness=${readinessCard}, HighTicket=${highTicketCard}, Inquiries=${inquiriesCard}, Pipeline=${pipelineCard}`);

    // Verify 4 Generative Search Engines
    const chatgptEngine = await page.locator('text=ChatGPT Search (OpenAI)').first().isVisible();
    const perplexityEngine = await page.locator('text=Perplexity Pro').first().isVisible();
    const googleAioEngine = await page.locator('text=Google AI Overviews').first().isVisible();
    const appleEngine = await page.locator('text=Apple Intelligence').first().isVisible();
    log(`Search Engines: ChatGPT=${chatgptEngine}, Perplexity=${perplexityEngine}, GoogleAIO=${googleAioEngine}, Apple=${appleEngine}`);

    // Verify High-Ticket Procedures Table rows
    const rows = await page.$$('table tbody tr');
    log(`Procedures Table rows count: ${rows.length}`);

    // Check "Fix Displacement" button on displaced row
    const fixDisplacementBtn = page.locator('button:has-text("Fix Displacement")').first();
    const hasFixBtn = await fixDisplacementBtn.isVisible();
    log(`Has "Fix Displacement" button for Displaced procedure: ${hasFixBtn}`);

    // Test "Run Fresh AI Scan" button in header
    log('Clicking "Run Fresh AI Scan" button...');
    const freshScanBtn = page.locator('button:has-text("Run Fresh AI Scan")');
    await freshScanBtn.click();
    await page.waitForTimeout(600);
    // Check toast
    const scanToast1 = await page.locator('[data-sonner-toast]').allInnerTexts();
    log(`Toast after clicking Fresh AI Scan: ${JSON.stringify(scanToast1)}`);
    await page.waitForTimeout(1400);
    const scanToast2 = await page.locator('[data-sonner-toast]').allInnerTexts();
    log(`Toast after scan completion: ${JSON.stringify(scanToast2)}`);

    // Test clicking "Fix Displacement"
    if (hasFixBtn) {
      log('Clicking "Fix Displacement" to jump to Competitor Steal Radar...');
      await fixDisplacementBtn.click();
      await page.waitForTimeout(500);
      const fixToast = await page.locator('[data-sonner-toast]').allInnerTexts();
      log(`Toast after Fix Displacement: ${JSON.stringify(fixToast)}`);
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_competitor_radar_from_fix.png') });

    // -------------------------------------------------------------
    // TAB 2: COMPETITOR STEAL RADAR
    // -------------------------------------------------------------
    log('--- Testing Tab 2: Competitor Steal Radar ---');
    const radarHeading = await page.locator('text=Autonomous Local Competitor Displacement Radar').first().isVisible();
    log(`Competitor Radar heading visible: ${radarHeading}`);

    // Find Deploy 1-Click Countermeasure button
    const countermeasureBtn = page.locator('button:has-text("Deploy 1-Click Countermeasure")').first();
    const canDeploy = await countermeasureBtn.isVisible();
    log(`Can deploy countermeasure button visible: ${canDeploy}`);

    if (canDeploy) {
      log('Clicking "Deploy 1-Click Countermeasure"...');
      await countermeasureBtn.click();
      await page.waitForTimeout(400);
      const cmToast1 = await page.locator('[data-sonner-toast]').allInnerTexts();
      log(`Toast during countermeasure synthesis: ${JSON.stringify(cmToast1)}`);

      await page.waitForTimeout(1000);
      const cmToast2 = await page.locator('[data-sonner-toast]').allInnerTexts();
      log(`Toast after countermeasure completion: ${JSON.stringify(cmToast2)}`);

      // Verify alert is marked RESOLVED
      const resolvedBadge = await page.locator('text=RESOLVED • PRACTICE RECOMMENDED').first().isVisible();
      log(`Displacement alert resolved badge visible: ${resolvedBadge}`);

      // Verify Overview tab shows procedure updated
      log('Switching back to Executive Dashboard to verify procedure resolution...');
      const overviewTabBtn = page.locator('button:has-text("Executive Dashboard")');
      await overviewTabBtn.click();
      await page.waitForTimeout(400);

      const protectedStatus = await page.locator('text=Protected').count();
      log(`Protected procedure count: ${protectedStatus} (should be 5 now)`);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_overview_after_countermeasure.png') });
    }

    // -------------------------------------------------------------
    // TAB 3: 1-CLICK SCHEMA & /LLMS.TXT
    // -------------------------------------------------------------
    log('--- Testing Tab 3: 1-Click Schema & /llms.txt ---');
    const schemaTabBtn = page.locator('button:has-text("1-Click Schema")');
    await schemaTabBtn.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_schema_tab.png') });

    // Check pre elements
    const codeBlocks = await page.$$('pre');
    log(`Found ${codeBlocks.length} code blocks in Schema tab`);

    // Test Copy JSON-LD button
    const copyJsonLdBtn = page.locator('button:has-text("Copy JSON-LD")').first();
    if (await copyJsonLdBtn.isVisible()) {
      log('Clicking "Copy JSON-LD"...');
      await copyJsonLdBtn.click();
      await page.waitForTimeout(300);
      const copySchemaToast = await page.locator('[data-sonner-toast]').allInnerTexts();
      log(`Toast after Copy JSON-LD: ${JSON.stringify(copySchemaToast)}`);
      const copiedText = await copyJsonLdBtn.innerText();
      log(`Button text after copy: "${copiedText}"`);
    }

    // Test Copy Manifest button
    const copyManifestBtn = page.locator('button:has-text("Copy Manifest")').first();
    if (await copyManifestBtn.isVisible()) {
      log('Clicking "Copy Manifest"...');
      await copyManifestBtn.click();
      await page.waitForTimeout(300);
      const copyLlmsToast = await page.locator('[data-sonner-toast]').allInnerTexts();
      log(`Toast after Copy Manifest: ${JSON.stringify(copyLlmsToast)}`);
      const copiedText = await copyManifestBtn.innerText();
      log(`Button text after copy: "${copiedText}"`);
    }

    // Test "Open CMS Installation Guide" modal
    const openGuideBtn = page.locator('button:has-text("Open CMS Installation Guide")').first();
    if (await openGuideBtn.isVisible()) {
      log('Clicking "Open CMS Installation Guide"...');
      await openGuideBtn.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_paste_guide_modal.png') });

      const modalVisible = await page.locator('text=CMS & Hosting Installation Guide').first().isVisible();
      log(`Paste Guide Modal is visible: ${modalVisible}`);

      // Close modal
      const closeBtn = page.locator('button:has(svg.lucide-x)').first();
      if (await closeBtn.isVisible()) {
        log('Closing Paste Guide Modal...');
        await closeBtn.click();
        await page.waitForTimeout(300);
      }
    }

    // Test Google Validator link
    const googleValLink = page.locator('a:has-text("Test on Google Validator")').first();
    const valHref = await googleValLink.getAttribute('href');
    log(`Google Validator link href: ${valHref}`);

    // -------------------------------------------------------------
    // TAB 4: PRACTICE SETTINGS & NPI LICENSURE
    // -------------------------------------------------------------
    log('--- Testing Tab 4: Practice Settings & NPI Licensure ---');
    const settingsTabBtn = page.locator('button:has-text("Practice & NPI Licensure")');
    await settingsTabBtn.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_settings_tab.png') });

    // Inspect inputs
    const clinicNameInput = page.locator('input[value*="Austin Cosmetic"]').first();
    log(`Clinic Name Input exists: ${await clinicNameInput.isVisible()}`);

    // Modify values
    log('Modifying practice settings values...');
    await page.fill('input[value*="Austin Cosmetic"]', 'Beverly Hills Dental Center');
    const doctorInput = page.locator('input[value*="Dr. Tejas Patel"]').first();
    await doctorInput.fill('Dr. Julian Vance, DDS');

    // Click Save Practice Profile
    log('Clicking "Save Practice Profile"...');
    const saveBtn = page.locator('button[type="submit"]:has-text("Save Practice Profile")');
    await saveBtn.click();

    // Verify saving state
    await page.waitForTimeout(200);
    const saveToast = await page.locator('[data-sonner-toast]').allInnerTexts();
    log(`Toast after saving settings: ${JSON.stringify(saveToast)}`);

    await page.waitForTimeout(600);
    const syncText = await page.locator('text=Settings synchronized with edge CDN').first().isVisible();
    log(`"Settings synchronized with edge CDN" text visible: ${syncText}`);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_settings_saved.png') });

    // Check localStorage
    const savedConfig = await page.evaluate(() => localStorage.getItem('clinicConfig'));
    log(`Saved localStorage clinicConfig: ${savedConfig}`);

    log('=== Partner Console Test Completed Successfully ===');
  } catch (err) {
    log(`FATAL ERROR IN TEST: ${err.message}\n${err.stack}`);
  } finally {
    log(`Summary: ${consoleErrors.length} console errors, ${networkErrors.length} network errors.`);
    await browser.close();
  }
}

run();
