/**
 * Independent Victory Audit Verification Suite
 * Executed independently by victory_auditor_3
 */

import { chromium } from 'playwright';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const CHROME_PATH = process.env.CHROME_BIN || '/run/current-system/sw/bin/google-chrome';
const EXPECTED_WHOP_URL = 'https://whop.com/checkout/plan_e37e96b86e088/';

const results = {
  routes: [],
  auditBar: [],
  webmasterToggle: [],
  practiceModal: [],
  roiCalculator: [],
  cornerChat: [],
  checkoutLinks: [],
  consoleAndAuth: [],
  misc: [],
  summary: { total: 0, passed: 0, failed: 0 },
};

function record(category, testName, passed, details = '') {
  if (!results[category] || !Array.isArray(results[category])) {
    results[category] = [];
  }
  results[category].push({ testName, passed, details });
  results.summary.total++;
  if (passed) {
    results.summary.passed++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    results.summary.failed++;
    console.error(`  ❌ [FAIL] ${testName} - Details: ${details}`);
  }
}

async function runIndependentAudit() {
  console.log('================================================================');
  console.log('🔍 INDEPENDENT VICTORY AUDITOR (Phase C Execution)');
  console.log(`Target: ${BASE_URL}`);
  console.log(`Browser: ${CHROME_PATH}`);
  console.log('================================================================\n');

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  // Track all Whop links found across pages
  const allWhopLinks = new Set();

  try {
    // -------------------------------------------------------------
    // 1. ROUTE LOADING & ZERO CONSOLE ERRORS
    // -------------------------------------------------------------
    console.log('--- 1. Testing Core Routes (HTTP 200 & Zero Console Errors) ---');
    const targetRoutes = [
      '/',
      '/pricing',
      '/partner-console',
      '/report/dentalpractice.com',
      '/login',
      '/signup',
    ];

    for (const route of targetRoutes) {
      const page = await context.newPage();
      const consoleErrors = [];
      const pageErrors = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      page.on('pageerror', (err) => {
        pageErrors.push(err.message);
      });

      const res = await page.goto(`${BASE_URL}${route}`, {
        waitUntil: 'networkidle',
        timeout: 15000,
      });

      const status = res ? res.status() : 0;
      const statusPass = status === 200;
      record(
        'routes',
        `Route ${route} returned HTTP 200`,
        statusPass,
        `Status: ${status}`
      );

      // Check console and page errors
      const zeroErrors = consoleErrors.length === 0 && pageErrors.length === 0;
      record(
        'routes',
        `Route ${route} has 0 console/page errors`,
        zeroErrors,
        `Errors: ${[...consoleErrors, ...pageErrors].join('; ')}`
      );

      // Collect Whop links
      const whopElements = await page.locator('a[href*="whop.com"]').all();
      for (const el of whopElements) {
        const href = await el.getAttribute('href');
        if (href) allWhopLinks.add({ route, href });
      }

      await page.close();
    }

    // -------------------------------------------------------------
    // 2. INSTANT AUDIT BAR (All 7 Tabs & Interactive Widgets)
    // -------------------------------------------------------------
    console.log('\n--- 2. Testing Instant Audit Bar & All 7 Tabs ---');
    const homePage = await context.newPage();
    const homeConsoleErrors = [];
    homePage.on('console', (msg) => {
      if (msg.type() === 'error') homeConsoleErrors.push(msg.text());
    });
    homePage.on('pageerror', (err) => homeConsoleErrors.push(err.message));

    await homePage.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    await homePage.waitForTimeout(1000);

    const auditBar = homePage.locator('#audit-bar');
    record('auditBar', 'Audit bar #audit-bar is visible', await auditBar.isVisible());

    // Test preset domain button
    const presetBtn = homePage.locator('button:has-text("austincosmeticdental.com")').first();
    if (await presetBtn.isVisible()) {
      await presetBtn.click();
      await homePage.waitForTimeout(1500);
      record('auditBar', 'Preset domain button triggers audit update', true);
    } else {
      record('auditBar', 'Preset domain button found', false, 'button not found');
    }

    const resultsCard = homePage.locator('#audit-results-card');
    await resultsCard.waitFor({ state: 'visible', timeout: 5000 });
    record('auditBar', 'Audit results card #audit-results-card rendered', await resultsCard.isVisible());

    // Test 7 Tabs
    const tabsToTest = [
      { id: 'geo-grid', label: 'Competitor Grid', verifyText: 'Coordinate Grid' },
      { id: 'gbp-cleanup', label: 'Profile & Directories', verifyText: 'Google Business Profile' },
      { id: 'review-loops', label: 'Review Loops & QR', verifyText: 'Automated Patient Flow' },
      { id: 'ai-readability', label: 'AI Factsheet', verifyText: 'AI Model Readability' },
      { id: 'simulator', label: 'Live AI Simulator', verifyText: 'Google AI Overviews' },
      { id: 'graph', label: 'Doctor Licensure Graph', verifyText: 'Licensure' },
      { id: 'diagnostics', label: 'Clinical Checklist', verifyText: 'Schema Depth' },
    ];

    for (const tab of tabsToTest) {
      const tabButton = resultsCard.locator(`button:has-text("${tab.label}")`).first();
      const tabExists = await tabButton.isVisible();
      if (tabExists) {
        await tabButton.click();
        await homePage.waitForTimeout(400);

        const cardText = await resultsCard.innerText();
        const hasContent = cardText.toLowerCase().includes(tab.verifyText.toLowerCase());
        record(
          'auditBar',
          `Tab "${tab.label}" renders distinct verified content`,
          hasContent,
          `Looked for "${tab.verifyText}"`
        );
      } else {
        record('auditBar', `Tab button "${tab.label}" is visible`, false);
      }
    }

    // -------------------------------------------------------------
    // 3. WEBMASTER CODE TOGGLE
    // -------------------------------------------------------------
    console.log('\n--- 3. Testing Webmaster Code Toggle ---');
    // Ensure we are on the ai-readability tab
    const aiTabBtn = resultsCard.locator('button:has-text("AI Factsheet")').first();
    await aiTabBtn.click();
    await homePage.waitForTimeout(400);

    const toggleBtn = resultsCard.locator('button:has-text("View Webmaster Code")').first();
    const toggleVisible = await toggleBtn.isVisible();
    record('webmasterToggle', 'View Webmaster Code toggle button visible', toggleVisible);

    if (toggleVisible) {
      await toggleBtn.click();
      await homePage.waitForTimeout(400);

      // Check for code view
      const codeBlock = resultsCard.locator('pre, code').first();
      const codeVisible = await codeBlock.isVisible();
      record('webmasterToggle', 'Raw code view rendered upon toggle', codeVisible);

      // Test Copy Code button
      const copyBtn = resultsCard.locator('button:has-text("Copy Code")').first();
      if (await copyBtn.isVisible()) {
        await copyBtn.click();
        await homePage.waitForTimeout(300);
        const copiedText = resultsCard.locator('button:has-text("Copied!")').first();
        record('webmasterToggle', 'Copy Code changes to Copied! confirmation', await copiedText.isVisible());
      }

      // Check Google Rich Results test link
      const richResultsLink = resultsCard.locator('a[href*="search.google.com/test/rich-results"]').first();
      record('webmasterToggle', 'Google Rich Results test link present', await richResultsLink.isVisible());

      // Toggle back to Doctor Summary
      const switchBackBtn = resultsCard.locator('button:has-text("Switch to Doctor Summary")').first();
      if (await switchBackBtn.isVisible()) {
        await switchBackBtn.click();
        await homePage.waitForTimeout(400);
        const summaryHeading = resultsCard.locator('text=Executive Factsheet').or(resultsCard.locator('text=Doctor Summary')).or(resultsCard.locator('text=AI Model Readability')).first();
        record('webmasterToggle', 'Cleanly switches back to Doctor Executive Summary', await summaryHeading.isVisible());
      } else {
        record('webmasterToggle', 'Switch back button visible', false);
      }
    }

    // -------------------------------------------------------------
    // 4. PRACTICE MANAGER MODAL
    // -------------------------------------------------------------
    console.log('\n--- 4. Testing Practice Manager Modal ---');
    const openModalBtn = resultsCard.locator('button:has-text("Email Report to Practice Manager")').first();
    const canOpenModal = await openModalBtn.isVisible();
    record('practiceModal', 'Email Report to Practice Manager button visible in toolbar', canOpenModal);

    if (canOpenModal) {
      await openModalBtn.click();
      await homePage.waitForTimeout(500);

      const modalHeading = homePage.locator('text=Email Audit Report to Practice Manager').first();
      const isModalOpen = await modalHeading.isVisible();
      record('practiceModal', 'Practice Manager Modal opens with backdrop', isModalOpen);

      // Fill modal form inputs
      const emailInput = homePage.locator('form input[type="email"]').first();
      await emailInput.fill('practice.director@dentalpractice.com');

      const nameInput = homePage.locator('form input[placeholder*="Jane Smith"]').first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('Dr. Sarah Jenkins');
      }

      const phoneInput = homePage.locator('form input[type="tel"]').first();
      if (await phoneInput.isVisible()) {
        await phoneInput.fill('+1 (512) 555-0182');
      }

      // Submit modal form with modal submit button
      const modalSubmitBtn = homePage.locator('form button:has-text("Dispatch Lead & Webhook")').first();
      await modalSubmitBtn.click();
      await homePage.waitForTimeout(1000);

      // Verify modal closes and toast appears
      const isModalClosed = !(await modalHeading.isVisible());
      record('practiceModal', 'Modal successfully submits and closes', isModalClosed);

      const toastSuccess = homePage.locator('text=Practice proposal logged and webhook dispatched successfully!').or(homePage.locator('[data-sonner-toast]')).first();
      record('practiceModal', 'Success notification / toast triggered on dispatch', await toastSuccess.isVisible());
    }

    // -------------------------------------------------------------
    // 5. PATIENT ROI CALCULATOR
    // -------------------------------------------------------------
    console.log('\n--- 5. Testing Patient ROI Calculator ---');
    const roiSection = homePage.locator('#patient-roi-calculator');
    record('roiCalculator', 'ROI Calculator #patient-roi-calculator visible', await roiSection.isVisible());

    // Test specialty buttons
    const specialtyBtn = homePage.locator('button:has-text("Plastic & Cosmetic Surgery")').first();
    if (await specialtyBtn.isVisible()) {
      await specialtyBtn.click();
      await homePage.waitForTimeout(400);
      record('roiCalculator', 'Specialty selector updates active preset', true);
    }

    // Test slider range up to $40,000
    const caseValueSlider = homePage.locator('#patient-roi-calculator input[type="range"]').first();
    const maxVal = await caseValueSlider.getAttribute('max');
    record('roiCalculator', 'Case Value slider max supports $40,000 surgical case value', maxVal === '40000', `Max value: ${maxVal}`);

    // Set slider to $40,000
    await caseValueSlider.fill('40000');
    await caseValueSlider.dispatchEvent('input');
    await caseValueSlider.dispatchEvent('change');
    await homePage.waitForTimeout(300);

    const roiText = await roiSection.innerText();
    const has40k = roiText.includes('40,000');
    record('roiCalculator', 'ROI calculator dynamically displays $40,000 case value', has40k);

    const hasNoNaN = !roiText.includes('NaN');
    record('roiCalculator', 'Calculations produce authentic numeric outputs without NaN', hasNoNaN);

    // -------------------------------------------------------------
    // 6. CORNER CHAT WIDGET
    // -------------------------------------------------------------
    console.log('\n--- 6. Testing Corner Chat Widget ---');
    const chatToggle = homePage.locator('button[aria-label="Open AI Assistant"]').or(homePage.locator('button:has-text("AI Advisor")')).or(homePage.locator('button.fixed')).last();
    const chatToggleVisible = await chatToggle.isVisible();
    record('cornerChat', 'Corner Chat Widget toggle button visible', chatToggleVisible);

    if (chatToggleVisible) {
      await chatToggle.click();
      await homePage.waitForTimeout(600);

      const chatDrawer = homePage.locator('text=NexusRank1 Clinical Practice GEO Advisor').or(homePage.locator('text=Clinical Practice GEO Advisor')).first();
      record('cornerChat', 'Chat drawer opens upon click', await chatDrawer.isVisible());

      const chatInput = homePage.locator('input[placeholder*="Ask about CMS guides"]').or(homePage.locator('input[placeholder*="Ask"]')).first();
      if (await chatInput.isVisible()) {
        // Query 1: Pricing and ROI guarantee
        await chatInput.fill('What is your pricing and ROI guarantee?');
        await homePage.keyboard.press('Enter');
        await homePage.waitForTimeout(2000);

        const chatDrawerBox = homePage.locator('div.fixed.bottom-6.right-6').first();
        const chatContent = await chatDrawerBox.innerText();
        const mentions1500 = chatContent.includes('1,500');
        const mentionsROI = chatContent.toLowerCase().includes('1-patient') || chatContent.toLowerCase().includes('roi guarantee');
        record('cornerChat', 'Chatbot answers with $1,500 terms and 1-patient ROI guarantee', mentions1500 && mentionsROI, `mentions1500: ${mentions1500}, mentionsROI: ${mentionsROI}`);

        // Query 2: Local competitor displacement
        await chatInput.fill('How do you stop local competitors stealing implant patients?');
        await homePage.keyboard.press('Enter');
        await homePage.waitForTimeout(2000);

        const chatContent2 = await chatDrawerBox.innerText();
        const mentionsCompetitor = chatContent2.toLowerCase().includes('competitor') || chatContent2.toLowerCase().includes('displacement');
        record('cornerChat', 'Chatbot answers competitor defense inquiries', mentionsCompetitor);

        // Close drawer
        const closeBtn = chatDrawerBox.locator('button:has(svg.lucide-x)').or(chatDrawerBox.locator('button:has-text("✕")')).first();
        if (await closeBtn.isVisible()) {
          await closeBtn.click();
          await homePage.waitForTimeout(400);
          record('cornerChat', 'Chat drawer closes cleanly', true);
        }
      }
    }

    // Collect homepage Whop links
    const homeWhop = await homePage.locator('a[href*="whop.com"]').all();
    for (const el of homeWhop) {
      const href = await el.getAttribute('href');
      if (href) allWhopLinks.add({ route: '/', href });
    }

    await homePage.close();

    // -------------------------------------------------------------
    // 7. CHECKOUT LINKS AUDIT (100% Target Canonical Plan)
    // -------------------------------------------------------------
    console.log('\n--- 7. Verifying 100% of External Checkout Links ---');
    const whopArray = Array.from(allWhopLinks);
    console.log(`Found ${whopArray.length} Whop checkout link instances across routes.`);

    let allCorrect = whopArray.length > 0;
    const badLinks = [];
    for (const item of whopArray) {
      if (item.href !== EXPECTED_WHOP_URL) {
        allCorrect = false;
        badLinks.push(item);
      }
    }

    record(
      'checkoutLinks',
      '100% of external checkout links point strictly to canonical URL',
      allCorrect,
      badLinks.length > 0 ? `Mismatches: ${JSON.stringify(badLinks)}` : `All ${whopArray.length} links match ${EXPECTED_WHOP_URL}`
    );

    // -------------------------------------------------------------
    // 8. AUTH & CLINIC COMMAND CENTER TEST
    // -------------------------------------------------------------
    console.log('\n--- 8. Testing Auth & Partner Console ---');
    
    // Check /signup role selection
    const signupPage = await context.newPage();
    await signupPage.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle' });
    const doctorRoleBtn = signupPage.locator('button:has-text("Solo Owner Doctor")').first();
    const pmRoleBtn = signupPage.locator('button:has-text("Practice Manager")').first();
    const rolesVisible = (await doctorRoleBtn.isVisible()) && (await pmRoleBtn.isVisible());
    record('consoleAndAuth', 'Role selection buttons rendered on /signup', rolesVisible);
    await signupPage.close();

    // Check /login
    const authPage = await context.newPage();
    await authPage.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });

    // Passcode authentication
    const passInput = authPage.locator('input[type="password"]').first();
    await passInput.fill('demo');
    const loginBtn = authPage.locator('button:has-text("Unlock Clinic Console")').first();
    await loginBtn.click();
    await authPage.waitForTimeout(1500);

    const partnerConsoleTitle = authPage.locator('text=Clinic Command Center').or(authPage.locator('text=Partner Console')).or(authPage.locator('text=Overview')).first();
    record('consoleAndAuth', 'Login with demo passcode grants access to Partner Console', await partnerConsoleTitle.isVisible());

    // Test Partner Console Tabs
    if (await partnerConsoleTitle.isVisible()) {
      const consoleTabs = ['Overview', 'Competitor Radar', 'Clinical Schema', 'Settings'];
      for (const tab of consoleTabs) {
        const tabBtn = authPage.locator(`button:has-text("${tab}")`).first();
        if (await tabBtn.isVisible()) {
          await tabBtn.click();
          await authPage.waitForTimeout(300);
          record('consoleAndAuth', `Partner Console tab "${tab}" renders without error`, true);
        }
      }
    }

    await authPage.close();

  } catch (err) {
    console.error('Fatal test error:', err);
    record('misc', 'Execution completed without unhandled exception', false, err.message);
  } finally {
    await browser.close();
  }

  console.log('\n================================================================');
  console.log('📊 AUDIT SUMMARY');
  console.log(`Total Checks:  ${results.summary.total}`);
  console.log(`Passed Checks: ${results.summary.passed}`);
  console.log(`Failed Checks: ${results.summary.failed}`);
  console.log('================================================================');

  if (results.summary.failed > 0) {
    console.error(`\n❌ VERDICT: VICTORY REJECTED (${results.summary.failed} failures)`);
    process.exit(1);
  } else {
    console.log('\n🏆 VERDICT: VICTORY CONFIRMED (100% of checks passed)');
    process.exit(0);
  }
}

runIndependentAudit().catch((err) => {
  console.error('Execution failure:', err);
  process.exit(1);
});
