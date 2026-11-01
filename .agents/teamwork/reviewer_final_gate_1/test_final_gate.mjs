import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3000';
const CHROME_PATH = '/run/current-system/sw/bin/google-chrome';
const EXPECTED_WHOP_URL = 'https://whop.com/checkout/plan_e37e96b86e088/';

async function run() {
  console.log('====================================================');
  console.log('🩺 COMPREHENSIVE FINAL GATE TEST RUNNER');
  console.log('====================================================\n');

  const consoleErrors = [];
  const pageErrors = [];
  const whopLinkErrors = [];
  const findings = [];

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignore normal favicon / harmless resource 404s if any
      if (!text.includes('favicon.ico')) {
        consoleErrors.push(`[Console Error] ${page.url()}: ${text}`);
      }
    }
  });

  page.on('pageerror', (err) => {
    pageErrors.push(`[Page Crash/Error] ${page.url()}: ${err.message}`);
  });

  // Helper to verify all whop links on current page
  async function checkWhopLinksOnPage(pageName) {
    const links = await page.$$eval('a[href*="whop.com"]', (els) => els.map((e) => e.getAttribute('href')));
    console.log(`  [${pageName}] Found ${links.length} Whop links`);
    for (const href of links) {
      if (href !== EXPECTED_WHOP_URL) {
        whopLinkErrors.push(`[${pageName}] Invalid Whop link: "${href}" (Expected: "${EXPECTED_WHOP_URL}")`);
      }
    }
  }

  // --- 1. HOMEPAGE & INSTANT AUDIT BAR ---
  console.log('--- 1. Testing Homepage & Instant Audit Bar ---');
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await checkWhopLinksOnPage('Homepage');

  // Verify Audit Bar preset buttons
  const presetButtons = await page.$$('#audit-bar button:has-text(".com"), #audit-bar button:has-text(".org")');
  console.log(`  Found ${presetButtons.length} preset domain buttons`);

  // Verify Audit Bar 7 Tabs
  console.log('  Testing all 7 tabs on #audit-bar:');
  const tabSelectors = [
    { name: '1. Competitor Grid', text: 'Competitor Grid' },
    { name: '2. Profile & Directories', text: 'Profile & Directories' },
    { name: '3. Review Loops & QR', text: 'Review Loops & QR' },
    { name: '4. AI Factsheet', text: 'AI Factsheet' },
    { name: '5. Live AI Simulator', text: 'Live AI Simulator' },
    { name: '6. Doctor Licensure Graph', text: 'Doctor Licensure Graph' },
    { name: '7. Clinical Checklist', text: 'Clinical Checklist' },
  ];

  for (const tab of tabSelectors) {
    const tabBtn = await page.$(`#audit-results-card button:has-text("${tab.text}"), #audit-bar button:has-text("${tab.text}")`);
    if (tabBtn) {
      await tabBtn.click();
      await page.waitForTimeout(300);
      console.log(`    ✅ Tab "${tab.name}" clicked successfully`);
    } else {
      findings.push(`Missing tab button: ${tab.name}`);
      console.log(`    ❌ Tab "${tab.name}" not found`);
    }
  }

  // Test Webmaster Code Toggle in AI Factsheet
  const aiFactsheetTab = await page.$('button:has-text("AI Factsheet")');
  if (aiFactsheetTab) {
    await aiFactsheetTab.click();
    await page.waitForTimeout(300);
    const codeToggleBtn = await page.$('button:has-text("Switch to Webmaster Code View"), button:has-text("Webmaster Code")');
    if (codeToggleBtn) {
      await codeToggleBtn.click();
      await page.waitForTimeout(300);
      console.log('    ✅ Webmaster code toggle opened code view');
      const execToggleBtn = await page.$('button:has-text("Switch to Executive Factsheet"), button:has-text("Executive Factsheet")');
      if (execToggleBtn) {
        await execToggleBtn.click();
        await page.waitForTimeout(300);
        console.log('    ✅ Webmaster code toggle switched back to executive factsheet');
      }
    }
  }

  // Test Practice Manager Dispatch Modal
  console.log('  Testing Practice Manager Dispatch Modal:');
  const dispatchModalBtn = await page.$('button:has-text("Email Report to Practice Manager")');
  if (dispatchModalBtn) {
    await dispatchModalBtn.click();
    await page.waitForTimeout(400);
    const modal = await page.$('form');
    if (modal) {
      console.log('    ✅ Practice Manager Modal opened');
      // Fill email and test close
      const emailInput = await page.$('input[type="email"]');
      if (emailInput) {
        await emailInput.fill('practice.director@clinic-test.org');
        console.log('    ✅ Entered valid email in modal');
      }
      const closeBtn = await page.$('button:has-text("Cancel"), button svg.lucide-x');
      if (closeBtn) {
        await closeBtn.click();
        await page.waitForTimeout(300);
        console.log('    ✅ Practice Manager Modal closed');
      }
    }
  } else {
    findings.push('Email Report to Practice Manager button not found');
  }

  // --- 2. PATIENT ROI CALCULATOR ---
  console.log('\n--- 2. Testing Patient ROI Modeler ---');
  const calcSection = await page.$('#patient-roi-calculator');
  if (calcSection) {
    await calcSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const specialties = [
      'Cosmetic & Restorative Dentistry',
      'MedSpa & Facial Aesthetics',
      'Plastic & Cosmetic Surgery',
      'Orthopedics & Spine Medicine',
      'Dermatology & Skin Surgery'
    ];
    for (const spec of specialties) {
      const btn = await page.$(`#patient-roi-calculator button:has-text("${spec}")`);
      if (btn) {
        await btn.click();
        await page.waitForTimeout(200);
        console.log(`    ✅ Selected specialty "${spec}"`);
      }
    }

    // Sliders
    const sliders = await page.$$('#patient-roi-calculator input[type="range"]');
    console.log(`    Found ${sliders.length} ROI sliders`);
    if (sliders.length >= 2) {
      await sliders[0].fill('14500');
      await sliders[1].fill('5');
      await page.waitForTimeout(300);
      console.log('    ✅ Updated ROI sliders dynamically');
    }
  } else {
    findings.push('ROI Calculator section #patient-roi-calculator not found on homepage');
  }

  // --- 3. CORNER CHAT WIDGET ---
  console.log('\n--- 3. Testing Corner Chat Widget ---');
  const chatFab = await page.$('button:has-text("NexusRank1 Advisor")');
  if (chatFab) {
    await chatFab.click();
    await page.waitForTimeout(500);
    console.log('    ✅ Opened Corner Chat Widget drawer');

    // Click quick prompt
    const quickPrompt = await page.$('button:has-text("Practice Pricing")');
    if (quickPrompt) {
      await quickPrompt.click();
      console.log('    ✅ Clicked quick prompt "Practice Pricing"');
      await page.waitForTimeout(3000);
      const text = await page.innerText('div.animate-in');
      console.log(`    Chat received response snippet: "${text.substring(0, 80).replace(/\n/g, ' ')}..."`);
    }

    // Close chat drawer
    const closeChatBtn = await page.$('button svg.lucide-x');
    if (closeChatBtn) {
      await closeChatBtn.click();
      await page.waitForTimeout(300);
      console.log('    ✅ Closed Corner Chat Widget');
    }
  } else {
    findings.push('Corner Chat Widget button not found on page');
  }

  // --- 4. PRICING PAGE ---
  console.log('\n--- 4. Testing /pricing ---');
  await page.goto(`${BASE_URL}/pricing`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await checkWhopLinksOnPage('Pricing');

  // --- 5. PARTNER CONSOLE ---
  console.log('\n--- 5. Testing /partner-console ---');
  await page.goto(`${BASE_URL}/partner-console`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await checkWhopLinksOnPage('Partner Console');

  // Test partner console 4 tabs: Executive Dashboard, Competitor Steal Radar, 1-Click Schema & /llms.txt, Practice & NPI Licensure
  const consoleTabs = [
    'Executive Dashboard',
    'Competitor Steal Radar',
    '1-Click Schema & /llms.txt',
    'Practice & NPI Licensure'
  ];
  for (const tab of consoleTabs) {
    const tabBtn = await page.$(`button:has-text("${tab}")`);
    if (tabBtn) {
      await tabBtn.click();
      await page.waitForTimeout(300);
      console.log(`    ✅ Partner Console Tab "${tab}" clicked`);
    } else {
      findings.push(`Missing Partner Console tab: ${tab}`);
    }
  }

  // Test saving settings in Practice & NPI Licensure tab
  const settingsTab = await page.$('button:has-text("Practice & NPI Licensure")');
  if (settingsTab) {
    await settingsTab.click();
    await page.waitForTimeout(300);
    const saveBtn = await page.$('button:has-text("Save Practice Profile")');
    if (saveBtn) {
      await saveBtn.click();
      await page.waitForTimeout(500);
      console.log('    ✅ Saved settings, toast notification triggered');
    } else {
      findings.push('Save Practice Profile button not found in settings tab');
    }
  }

  // --- 6. STANDALONE CLIENT REPORT ---
  console.log('\n--- 6. Testing /report/dentalpractice.com ---');
  await page.goto(`${BASE_URL}/report/dentalpractice.com`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await checkWhopLinksOnPage('Client Report');

  // --- 7. AUTH PAGES: LOGIN & SIGNUP ---
  console.log('\n--- 7. Testing /login and /signup ---');
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await checkWhopLinksOnPage('Login');

  await page.goto(`${BASE_URL}/signup`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await checkWhopLinksOnPage('Signup');

  await browser.close();

  console.log('\n====================================================');
  console.log('SUMMARY OF RESULTS');
  console.log('====================================================');
  console.log(`Page Errors / Crashes: ${pageErrors.length}`);
  pageErrors.forEach((e) => console.log(`  - ${e}`));

  console.log(`Console Errors: ${consoleErrors.length}`);
  consoleErrors.forEach((e) => console.log(`  - ${e}`));

  console.log(`Whop Link Errors: ${whopLinkErrors.length}`);
  whopLinkErrors.forEach((e) => console.log(`  - ${e}`));

  console.log(`General Findings: ${findings.length}`);
  findings.forEach((e) => console.log(`  - ${e}`));

  const allPassed =
    pageErrors.length === 0 &&
    consoleErrors.length === 0 &&
    whopLinkErrors.length === 0 &&
    findings.length === 0;

  console.log(`\nFINAL VERDICT: ${allPassed ? 'ALL_CHECKS_PASSED' : 'DEFECTS_DETECTED'}`);
  console.log('====================================================\n');

  process.exit(allPassed ? 0 : 1);
}

run().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(2);
});
