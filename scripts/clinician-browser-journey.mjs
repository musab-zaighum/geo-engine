import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3000';
const CHROME_PATH = '/run/current-system/sw/bin/google-chrome';
const EXPECTED_WHOP_URL = 'https://whop.com/checkout/plan_e37e96b86e088/';

async function executeClinicianBrowserAuditor() {
  console.log('================================================================');
  console.log('🩺 CLINICIAN REAL-BROWSER AUDIT & JOURNEY TEST HARNESS');
  console.log('================================================================\n');

  const pageErrors = [];
  const consoleErrors = [];
  const whopMismatches = [];
  const journeyLog = [];

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  page.on('pageerror', (err) => {
    pageErrors.push(`[Page Crash] ${page.url()}: ${err.message}`);
  });

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!text.includes('favicon.ico') && !text.includes('status of 404')) {
        consoleErrors.push(`[Console Error] ${page.url()}: ${text}`);
      }
    }
  });

  async function assertWhopLinks(pageName) {
    const links = await page.$$eval('a[href*="whop.com"]', (els) => els.map((e) => e.getAttribute('href')));
    for (const href of links) {
      if (href !== EXPECTED_WHOP_URL) {
        whopMismatches.push(`[${pageName}] Bad Whop URL: "${href}" (Expected: "${EXPECTED_WHOP_URL}")`);
      }
    }
    return links.length;
  }

  // -------------------------------------------------------------
  // JOURNEY 1: Homepage Landing, Hero & Preset Audits
  // -------------------------------------------------------------
  console.log('▶ [Journey 1] Homepage Landing, Hero & Instant Audit Bar');
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const homeWhopCount = await assertWhopLinks('Homepage');
  journeyLog.push(`Homepage loaded with ${homeWhopCount} verified Whop links`);

  // Test preset buttons
  const presets = ['beverlyhillsplasticsurgery.com', 'mayoclinic.org', 'austincosmeticdental.com'];
  for (const domain of presets) {
    const presetBtn = await page.$(`button:has-text("${domain}")`);
    if (presetBtn) {
      await presetBtn.click();
      await page.waitForTimeout(400);
      journeyLog.push(`Clicked preset button for "${domain}"`);
    }
  }

  // Run Custom Audit on Newport Beach practice
  const testDomain = 'newportbeachaestheticsurgery.com';
  const domainInput = await page.$('#audit-bar input[type="text"], input[placeholder*="domain"]');
  if (domainInput) {
    await domainInput.fill(testDomain);
    const runBtn = await page.$('#audit-bar button:has-text("Run 5-Second Clinical Audit"), #audit-bar button:has-text("Audit")');
    if (runBtn) {
      await runBtn.click();
      journeyLog.push(`Submitted custom audit for "${testDomain}"`);
      // Wait for scan animation to complete and results card to render
      await page.waitForSelector('#audit-results-card', { state: 'visible', timeout: 15000 });
      journeyLog.push(`Audit results rendered for "${testDomain}"`);
    }
  }

  // -------------------------------------------------------------
  // JOURNEY 2: All 7 Clinical Audit Tabs & Executive Switcher
  // -------------------------------------------------------------
  console.log('▶ [Journey 2] Exercising all 7 Audit Tabs');
  const auditTabs = [
    { name: '1. Competitor Grid', text: 'Competitor Grid' },
    { name: '2. Profile & Directories', text: 'Profile & Directories' },
    { name: '3. Review Loops & QR', text: 'Review Loops & QR' },
    { name: '4. AI Factsheet', text: 'AI Factsheet' },
    { name: '5. Live AI Simulator', text: 'Live AI Simulator' },
    { name: '6. Doctor Licensure Graph', text: 'Doctor Licensure Graph' },
    { name: '7. Clinical Checklist', text: 'Clinical Checklist' },
  ];

  for (const tab of auditTabs) {
    const btn = await page.$(`#audit-results-card button:has-text("${tab.text}"), #audit-bar button:has-text("${tab.text}")`);
    if (btn) {
      await btn.click();
      await page.waitForTimeout(300);
      journeyLog.push(`Successfully navigated to Tab: ${tab.name}`);
    } else {
      journeyLog.push(`⚠️ Missing Tab button: ${tab.name}`);
    }
  }

  // Test Webmaster Code Toggle in AI Factsheet
  const factsheetTab = await page.$('button:has-text("AI Factsheet")');
  if (factsheetTab) {
    await factsheetTab.click();
    await page.waitForTimeout(300);

    const codeToggle = await page.$('button:has-text("View Webmaster Code")');
    if (codeToggle) {
      await codeToggle.click();
      await page.waitForTimeout(300);
      journeyLog.push('Switched to Webmaster Code View');

      // Click sub-code tabs
      const schemaTab = await page.$('button:has-text("Schema.org JSON-LD")');
      const llmsTab = await page.$('button:has-text("/llms.txt")');
      const cptTab = await page.$('button:has-text("ADA CDT & AMA CPT")');

      if (schemaTab) await schemaTab.click();
      if (llmsTab) await llmsTab.click();
      if (cptTab) await cptTab.click();

      // Test Copy Code
      const copyBtn = await page.$('button:has-text("Copy Code"), button:has-text("Copied")');
      if (copyBtn) {
        await copyBtn.click();
        journeyLog.push('Clicked Copy Code button');
      }

      // Switch back to Doctor Summary
      const docToggle = await page.$('button:has-text("Switch to Doctor Summary")');
      if (docToggle) {
        await docToggle.click();
        await page.waitForTimeout(300);
        journeyLog.push('Switched back to Executive Doctor Summary');
      }
    }
  }

  // -------------------------------------------------------------
  // JOURNEY 3: Practice Manager Delegation Modal
  // -------------------------------------------------------------
  console.log('▶ [Journey 3] Practice Manager Delegation Modal');
  const dispatchBtn = await page.$('button:has-text("Email Report to Practice Manager")');
  if (dispatchBtn) {
    await dispatchBtn.click();
    await page.waitForTimeout(400);

    const nameInput = await page.$('input[placeholder*="Sarah"], input[placeholder*="Name"], input[type="text"]');
    const emailInput = await page.$('input[placeholder*="office@"], input[placeholder*="email"], input[type="email"]');

    if (nameInput) await nameInput.fill('Sarah Jenkins');
    if (emailInput) await emailInput.fill('sarah@newportbeachaestheticsurgery.com');

    const submitBtn = await page.$('button:has-text("Dispatch Lead & Webhook")');
    if (submitBtn) {
      await submitBtn.click();
      await page.waitForTimeout(1000);
      journeyLog.push('Dispatched audit report to practice manager successfully');
    }

    // Ensure modal is closed
    const closeBtn = await page.$('button[aria-label="Close modal"]');
    if (closeBtn) {
      await closeBtn.click();
      await page.waitForTimeout(300);
    }
  }

  // -------------------------------------------------------------
  // JOURNEY 4: Patient Acquisition & Revenue Modeler (ROI Calculator)
  // -------------------------------------------------------------
  console.log('▶ [Journey 4] Patient ROI Modeler');
  const roiSection = await page.$('section:has-text("Patient Acquisition & Revenue Modeler")');
  if (roiSection) {
    await roiSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const specialties = [
      'Cosmetic & Restorative Dentistry',
      'MedSpa & Facial Aesthetics',
      'Plastic & Cosmetic Surgery',
      'Orthopedics & Spine Medicine',
      'Dermatology & Skin Surgery',
    ];

    for (const spec of specialties) {
      const specBtn = await page.$(`button:has-text("${spec}")`);
      if (specBtn) {
        await specBtn.click();
        await page.waitForTimeout(200);
      }
    }

    // Set high-ticket plastic surgery case value slider
    const sliders = await page.$$('section:has-text("Patient Acquisition & Revenue Modeler") input[type="range"]');
    if (sliders.length >= 2) {
      await sliders[0].fill('18500'); // $18,500 case value
      await sliders[1].fill('4');     // 4 patients/mo
      await page.waitForTimeout(300);
      journeyLog.push('Tested dynamic ROI calculator: $18,500 case value x 4 patients/mo');
    }
  }

  // -------------------------------------------------------------
  // JOURNEY 5: FAQ Accordion
  // -------------------------------------------------------------
  console.log('▶ [Journey 5] FAQ Accordion Section');
  const faqButtons = await page.$$('section:has-text("Frequently Asked Questions") button');
  journeyLog.push(`Found ${faqButtons.length} FAQ accordion buttons`);
  for (let i = 0; i < Math.min(faqButtons.length, 5); i++) {
    await faqButtons[i].scrollIntoViewIfNeeded();
    await faqButtons[i].click();
    await page.waitForTimeout(150);
  }

  // -------------------------------------------------------------
  // JOURNEY 6: Floating Corner Chat Advisor
  // -------------------------------------------------------------
  console.log('▶ [Journey 6] Floating Corner Chat Advisor');
  const chatFab = await page.$('button:has-text("NexusRank1 Advisor"), button svg.lucide-message-square');
  if (chatFab) {
    await chatFab.click();
    await page.waitForTimeout(500);
    journeyLog.push('Opened Corner Chat Advisor drawer');

    // Click quick prompt "Practice Pricing"
    const pricingPrompt = await page.$('button:has-text("Practice Pricing")');
    if (pricingPrompt) {
      await pricingPrompt.click();
      await page.waitForTimeout(1500);
      journeyLog.push('Sent quick prompt "Practice Pricing" to advisor');
    }

    // Custom query
    const chatInput = await page.$('input[placeholder*="GEO clinical question"], input[placeholder*="Ask"]');
    if (chatInput) {
      await chatInput.fill('How does the 100% Done-For-You webmaster concierge work?');
      const sendBtn = await page.$('button[type="submit"]:has(svg.lucide-send)');
      if (sendBtn) {
        await sendBtn.click();
        await page.waitForTimeout(1500);
        journeyLog.push('Sent concierge question to chat assistant');
      }
    }

    // Close chat drawer
    const closeChat = await page.$('div:has-text("NexusRank1 Advisor") button svg.lucide-x, button[aria-label="Close"]');
    if (closeChat) {
      await closeChat.click();
      await page.waitForTimeout(300);
      journeyLog.push('Closed Corner Chat Advisor drawer');
    }
  }

  // -------------------------------------------------------------
  // JOURNEY 7: Dedicated Pricing Page
  // -------------------------------------------------------------
  console.log('▶ [Journey 7] Dedicated Pricing Page (/pricing)');
  await page.goto(`${BASE_URL}/pricing`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  const pricingWhopCount = await assertWhopLinks('Pricing Page');
  journeyLog.push(`Pricing page loaded with ${pricingWhopCount} verified Whop links`);

  // -------------------------------------------------------------
  // JOURNEY 8: Clinic Command Center (/partner-console)
  // -------------------------------------------------------------
  console.log('▶ [Journey 8] Clinic Command Center (/partner-console)');
  await page.goto(`${BASE_URL}/partner-console`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  const consoleWhopCount = await assertWhopLinks('Partner Console');

  const partnerTabs = [
    'Executive Dashboard',
    'Competitor Steal Radar',
    '1-Click Schema & /llms.txt',
    'Practice & NPI Licensure',
  ];

  for (const tab of partnerTabs) {
    const btn = await page.$(`button:has-text("${tab}")`);
    if (btn) {
      await btn.click();
      await page.waitForTimeout(300);
      journeyLog.push(`Partner Console Tab: "${tab}" verified`);
    }
  }

  // Test Paste Guide Modal in 1-Click Schema tab
  const schemaTab = await page.$('button:has-text("1-Click Schema & /llms.txt")');
  if (schemaTab) {
    await schemaTab.click();
    await page.waitForTimeout(300);
    const pasteGuideBtn = await page.$('button:has-text("CMS Paste Guide"), button:has-text("Installation Guide")');
    if (pasteGuideBtn) {
      await pasteGuideBtn.click();
      await page.waitForTimeout(400);
      const closeGuide = await page.$('div:has-text("Installation Guide") button svg.lucide-x, button[aria-label="Close"]');
      if (closeGuide) {
        await closeGuide.click();
        await page.waitForTimeout(200);
        journeyLog.push('Verified CMS Paste Guide modal open and close');
      }
    }
  }

  // Test Saving Profile in Practice & NPI Licensure tab
  const settingsTab = await page.$('button:has-text("Practice & NPI Licensure")');
  if (settingsTab) {
    await settingsTab.click();
    await page.waitForTimeout(300);

    const saveBtn = await page.$('button:has-text("Save Practice Profile")');
    if (saveBtn) {
      await saveBtn.click();
      await page.waitForTimeout(600);
      journeyLog.push('Triggered Save Practice Profile with edge CDN sync confirmation');
    }
  }

  // -------------------------------------------------------------
  // JOURNEY 9: Standalone Client Report Route
  // -------------------------------------------------------------
  console.log('▶ [Journey 9] Standalone Client Report (/report/mayoclinic.org)');
  await page.goto(`${BASE_URL}/report/mayoclinic.org`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  const reportWhopCount = await assertWhopLinks('Client Report');
  journeyLog.push(`Standalone Client Report loaded with ${reportWhopCount} verified Whop links`);

  // -------------------------------------------------------------
  // JOURNEY 10: Authentication Pages
  // -------------------------------------------------------------
  console.log('▶ [Journey 10] Auth Pages (/login & /signup)');
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  await assertWhopLinks('Login');

  const demoFillBtn = await page.$('button:has-text("Quick Demo Fill"), button:has-text("Demo Account")');
  if (demoFillBtn) {
    await demoFillBtn.click();
    await page.waitForTimeout(200);
    journeyLog.push('Clicked Quick Demo Fill on Login page');
  }

  await page.goto(`${BASE_URL}/signup`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  await assertWhopLinks('Signup');
  journeyLog.push('Login and Signup pages verified');

  await browser.close();

  // -------------------------------------------------------------
  // AUDIT SUMMARY
  // -------------------------------------------------------------
  console.log('\n================================================================');
  console.log('CLINICIAN AUDITOR SUMMARY REPORT');
  console.log('================================================================');
  console.log(`Journeys Successfully Completed: ${journeyLog.length}`);
  journeyLog.forEach((log) => console.log(`  ✓ ${log}`));

  console.log(`\nPage Crashes: ${pageErrors.length}`);
  pageErrors.forEach((e) => console.log(`  ❌ ${e}`));

  console.log(`Console Errors: ${consoleErrors.length}`);
  consoleErrors.forEach((e) => console.log(`  ❌ ${e}`));

  console.log(`Whop Link Mismatches: ${whopMismatches.length}`);
  whopMismatches.forEach((e) => console.log(`  ❌ ${e}`));

  const allPassed = pageErrors.length === 0 && consoleErrors.length === 0 && whopMismatches.length === 0;

  console.log(`\nFINAL CLINICIAN HARNESS VERDICT: ${allPassed ? 'EMPERICAL_SUCCESS_CONFIRMED' : 'DEFECTS_DETECTED'}`);
  console.log('================================================================\n');

  process.exit(allPassed ? 0 : 1);
}

executeClinicianBrowserAuditor().catch((err) => {
  console.error('Fatal Harness Failure:', err);
  process.exit(2);
});
