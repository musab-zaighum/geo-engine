const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const REPORT_DIR = __dirname;
const SCREENSHOT_DIR = path.join(REPORT_DIR, 'screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const EXPECTED_WHOP_URL = 'https://whop.com/checkout/plan_e37e96b86e088/';

async function waitForScanToFinish(page, timeout = 15000) {
  // Wait for scan button to revert back to active state
  await page.waitForSelector('#audit-bar button[type="submit"]:has-text("Run 5-Second Clinical Audit"):not([disabled])', { timeout });
  // Ensure audit results card is visible
  await page.waitForSelector('#audit-results-card', { state: 'visible', timeout: 8000 });
  await page.waitForTimeout(600);
}

async function runComprehensiveVerification() {
  console.log('===============================================================');
  console.log('NexusRank1 Independent Runtime & Browser Verification Suite v2');
  console.log('Reviewer: reviewer_v4_2');
  console.log('Time: ' + new Date().toISOString());
  console.log('===============================================================\n');

  const browser = await chromium.launch({
    executablePath: '/run/current-system/sw/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const testReport = {
    timestamp: new Date().toISOString(),
    routes: {},
    widgets: {},
    checkoutLinks: {},
    adversarialStress: {},
    consoleErrors: [],
    pageErrors: [],
    overallVerdict: 'PENDING'
  };

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);

  const page = await context.newPage();

  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();
    if (type === 'error') {
      testReport.consoleErrors.push({ text, location: msg.location() });
      console.error(`[CONSOLE ERROR] ${text}`);
    }
  });

  page.on('pageerror', err => {
    testReport.pageErrors.push(err.message);
    console.error(`[PAGE ERROR] ${err.message}`);
  });

  try {
    // =========================================================================
    // 1. VERIFY ALL 6 KEY ROUTES LOAD WITH HTTP 200 AND 0 CONSOLE ERRORS
    // =========================================================================
    console.log('\n>>> SECTION 1: KEY ROUTES HTTP 200 & 0 CONSOLE ERRORS <<<');
    const routesToTest = [
      { path: '/', name: 'Homepage' },
      { path: '/pricing', name: 'Pricing Page' },
      { path: '/partner-console', name: 'Partner Console' },
      { path: '/report/dentalpractice.com', name: 'Public Report' },
      { path: '/login', name: 'Login Page' },
      { path: '/signup', name: 'Signup Page' }
    ];

    for (const r of routesToTest) {
      console.log(`\nNavigating to: ${r.path} (${r.name})`);
      const consoleCountBefore = testReport.consoleErrors.length;
      const resp = await page.goto(`http://localhost:3000${r.path}`, {
        waitUntil: 'networkidle',
        timeout: 30000
      });
      const status = resp ? resp.status() : null;
      const newErrors = testReport.consoleErrors.slice(consoleCountBefore);

      console.log(`  -> HTTP Status: ${status}`);
      console.log(`  -> New Console Errors: ${newErrors.length}`);

      testReport.routes[r.path] = {
        name: r.name,
        httpStatus: status,
        consoleErrors: newErrors,
        pass: status === 200 && newErrors.length === 0
      };

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `route_${r.path.replace(/[\/.]/g, '_') || 'root'}.png`)
      });
    }

    // =========================================================================
    // 2. VERIFY INSTANT AUDIT BAR (#audit-bar) & ALL 7 TABS
    // =========================================================================
    console.log('\n>>> SECTION 2: INSTANT AUDIT BAR & 7 TABS RENDERING <<<');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    const auditBar = page.locator('#audit-bar');
    await auditBar.scrollIntoViewIfNeeded();
    const auditBarVisible = await auditBar.isVisible();
    console.log(`Audit bar #audit-bar visible: ${auditBarVisible}`);

    // Test preset domain buttons
    const presets = [
      { label: 'dentalpractice.com', expectedClinicWord: 'Dental' },
      { label: 'mayoclinic.org', expectedClinicWord: 'Mayo Clinic' },
      { label: 'clevelandclinic.org', expectedClinicWord: 'Cleveland Clinic' },
      { label: 'austincosmeticdental.com', expectedClinicWord: 'Austin' }
    ];
    const presetResults = [];

    for (const p of presets) {
      console.log(`Testing preset: ${p.label}`);
      const btn = page.locator(`#audit-bar button:has-text("${p.label}")`);
      await btn.click();
      await waitForScanToFinish(page);

      const clinicHeading = await page.$eval('#audit-results-card h3', el => el.innerText.trim());
      const scoreText = await page.$eval('#audit-results-card .text-2xl, #audit-results-card .text-3xl', el => el.innerText.trim());
      console.log(`  -> Clinic Heading: "${clinicHeading}", Score: ${scoreText}`);

      const matched = clinicHeading.toLowerCase().includes(p.expectedClinicWord.toLowerCase());
      presetResults.push({
        preset: p.label,
        clinicHeading,
        score: scoreText,
        pass: matched
      });
    }

    // Radial Score Gauge Verification
    const radialDial = await page.$('#audit-results-card svg.-rotate-90 circle:nth-child(2)');
    const dashoffset = radialDial ? await radialDial.getAttribute('stroke-dashoffset') : null;
    const radialGaugePass = radialDial !== null && dashoffset !== null && parseFloat(dashoffset) > 0;
    console.log(`Radial score dial rendered: ${radialGaugePass} (dashoffset: ${dashoffset})`);

    // Verify all 7 tabs render distinct content without crashes
    console.log('\nTesting all 7 Audit Tabs:');
    const tabs = [
      {
        id: 'geo-grid',
        label: '1. Competitor Grid',
        selector: '#audit-bar button:has-text("1. Competitor Grid")',
        verify: async () => {
          const gridCells = await page.$$('#audit-results-card .grid-cols-3 > div');
          const table = await page.$('#audit-results-card table');
          return gridCells.length === 9 && table !== null;
        }
      },
      {
        id: 'gbp-cleanup',
        label: '2. Profile & Directories',
        selector: '#audit-bar button:has-text("2. Profile & Directories")',
        verify: async () => {
          const text = await page.innerText('#audit-results-card');
          return text.includes('Primary & Secondary Medical Category') && text.includes('NAP Consistency');
        }
      },
      {
        id: 'review-loops',
        label: '3. Review Loops & QR',
        selector: '#audit-bar button:has-text("3. Review Loops & QR")',
        verify: async () => {
          const text = await page.innerText('#audit-results-card');
          return text.includes('AUTOMATED PATIENT FLOW & REVIEW ENGINE') && text.toLowerCase().includes('reception desk qr');
        }
      },
      {
        id: 'ai-readability',
        label: '4. AI Factsheet',
        selector: '#audit-bar button:has-text("4. AI Factsheet")',
        verify: async () => {
          const text = await page.innerText('#audit-results-card');
          return text.includes('AI Model Readability & Practice Factsheet') && text.includes('Doctor NPI-1 Licensure');
        }
      },
      {
        id: 'simulator',
        label: 'Live AI Simulator',
        selector: '#audit-bar button:has-text("Live AI Simulator")',
        verify: async () => {
          const text = await page.innerText('#audit-results-card');
          return text.includes('SearchGPT') || text.includes('Perplexity') || text.includes('Google AI');
        }
      },
      {
        id: 'graph',
        label: 'Doctor Licensure Graph',
        selector: '#audit-bar button:has-text("Doctor Licensure Graph")',
        verify: async () => {
          const svgGraph = await page.$('#audit-results-card svg');
          const text = await page.innerText('#audit-results-card');
          return svgGraph !== null && (text.includes('Graph') || text.includes('Authority'));
        }
      },
      {
        id: 'diagnostics',
        label: 'Clinical Checklist',
        selector: '#audit-bar button:has-text("Clinical Checklist")',
        verify: async () => {
          const items = await page.$$('#audit-results-card [class*="border"]');
          const text = await page.innerText('#audit-results-card');
          return items.length >= 4 && (text.includes('Checklist') || text.includes('Pass') || text.includes('Diagnostic'));
        }
      }
    ];

    const tabResults = [];
    const tabContents = new Map();

    for (const tab of tabs) {
      console.log(`Navigating to Tab: "${tab.label}"`);
      const tabBtn = page.locator(tab.selector).first();
      await tabBtn.click();
      await page.waitForTimeout(500);

      const isValid = await tab.verify();
      const content = await page.innerText('#audit-results-card');
      tabContents.set(tab.id, content);

      console.log(`  -> Rendered properly: ${isValid}`);
      tabResults.push({ id: tab.id, label: tab.label, pass: isValid });
    }

    // Verify distinct content across all 7 tabs
    let distinctPairs = 0;
    const contentsArray = Array.from(tabContents.entries());
    for (let i = 0; i < contentsArray.length; i++) {
      for (let j = i + 1; j < contentsArray.length; j++) {
        if (contentsArray[i][1] !== contentsArray[j][1]) {
          distinctPairs++;
        }
      }
    }
    const allTabsDistinct = distinctPairs === 21; // 7 choose 2 = 21 unique pairs
    console.log(`Distinct tab pairs: ${distinctPairs} / 21 (all distinct: ${allTabsDistinct})`);

    testReport.widgets.auditBar = {
      visible: auditBarVisible,
      presetResults,
      radialGaugePass,
      tabResults,
      allTabsDistinct,
      pass: auditBarVisible && presetResults.every(p => p.pass) && radialGaugePass && tabResults.every(t => t.pass) && allTabsDistinct
    };

    // =========================================================================
    // 3. VERIFY WEBMASTER CODE TOGGLE (Executive Factsheet vs Raw Schema)
    // =========================================================================
    console.log('\n>>> SECTION 3: WEBMASTER CODE TOGGLE <<<');
    // Switch to Tab 4 (AI Factsheet)
    const tab4Btn = page.locator('#audit-bar button:has-text("4. AI Factsheet")').first();
    await tab4Btn.click();
    await page.waitForTimeout(400);

    // Initial state: Doctor Summary (Executive Factsheet)
    const toggleBtn = page.locator('button:has-text("View Webmaster Code"), button:has-text("Switch to Doctor Summary")').first();
    const toggleVisible = await toggleBtn.isVisible();
    const initialToggleText = await toggleBtn.innerText();
    console.log(`Code toggle button visible: ${toggleVisible}, text: "${initialToggleText}"`);

    // Click to switch to Webmaster Raw Code view
    await toggleBtn.click();
    await page.waitForTimeout(400);

    const toggleTextAfterClick = await toggleBtn.innerText();
    console.log(`Toggle text after click: "${toggleTextAfterClick}"`);

    // In raw code view, pre/code tags and schema sub-tabs appear
    const preCount = await page.locator('#audit-results-card pre, #audit-results-card code').count();
    const codeContent = await page.locator('#audit-results-card pre').first().innerText().catch(() => '');
    const copyCodeBtn = page.locator('button:has-text("Copy Code"), button:has-text("Copied!")').first();
    const copyCodeVisible = await copyCodeBtn.isVisible();
    const richResultsLink = page.locator('a[href*="search.google.com/test/rich-results"]').first();
    const richResultsVisible = await richResultsLink.isVisible();

    console.log(`Raw code view: preCount=${preCount}, copyCodeVisible=${copyCodeVisible}, richResultsVisible=${richResultsVisible}`);
    console.log(`Raw snippet: ${codeContent.substring(0, 80)}...`);

    const hasSchemaJsonLd = codeContent.includes('@context') && codeContent.includes('schema.org');

    // Click again to switch back to Doctor Summary
    await toggleBtn.click();
    await page.waitForTimeout(400);
    const toggleTextFinal = await toggleBtn.innerText();
    console.log(`Toggle text after switching back: "${toggleTextFinal}"`);

    testReport.widgets.codeToggle = {
      toggleVisible,
      switchedToRaw: toggleTextAfterClick.includes('Doctor Summary'),
      hasSchemaJsonLd,
      copyCodeVisible,
      richResultsVisible,
      switchedBack: toggleTextFinal.includes('Webmaster Code'),
      pass: toggleVisible && hasSchemaJsonLd && copyCodeVisible && richResultsVisible
    };

    // =========================================================================
    // 4. VERIFY CORNER CHAT WIDGET
    // =========================================================================
    console.log('\n>>> SECTION 4: CORNER CHAT WIDGET <<<');
    const chatFab = page.locator('button.fixed:has(svg.lucide-message-square)').first();
    await chatFab.waitFor({ state: 'visible', timeout: 5000 });
    const chatFabVisible = await chatFab.isVisible();
    console.log(`Chat FAB mounted in DOM: ${chatFabVisible}`);

    // Click to open
    await chatFab.click();
    await page.waitForTimeout(500);

    // Verify welcome message
    const welcomeBubble = page.locator('div.whitespace-pre-wrap').first();
    const welcomeText = await welcomeBubble.innerText();
    console.log(`Welcome message snippet: ${welcomeText.substring(0, 160)}...`);

    const has1500Welcome = welcomeText.includes('$1,500 One-Time');
    const hasZeroRetainers = welcomeText.includes('0 Monthly Retainers');
    const hasRoiGuarantee = welcomeText.includes('1-Patient ROI Guarantee');

    // Clinician Inquiry
    const chatInput = page.locator('input[placeholder*="Ask GEO"]');
    const chatSubmit = page.locator('form:has(input[placeholder*="Ask GEO"]) button[type="submit"]');

    console.log('Sending clinician inquiry: "Can you confirm the $1,500 one-time deployment terms and how you outrank local competitors?"');
    await chatInput.fill('Can you confirm the $1,500 one-time deployment terms and how you outrank local competitors?');
    await chatSubmit.click();

    // Wait for response
    await page.waitForTimeout(1000);
    try {
      await page.waitForSelector('text=Consulting clinical knowledge base...', { state: 'hidden', timeout: 20000 });
    } catch {}

    const assistantBubbles = page.locator('div.whitespace-pre-wrap');
    const bubbleCount = await assistantBubbles.count();
    const replyText = await assistantBubbles.nth(bubbleCount - 1).innerText();
    console.log(`Chat response snippet: ${replyText.substring(0, 200)}...`);

    const replyHas1500 = replyText.includes('$1,500');
    const replyHasCompetitorStrategy = replyText.toLowerCase().includes('competitor') || replyText.toLowerCase().includes('radar') || replyText.toLowerCase().includes('patient');

    // Close chat
    const closeBtn = page.locator('button:has(svg.lucide-x)').first();
    await closeBtn.click();
    await page.waitForTimeout(300);

    const drawerVisibleAfterClose = await page.locator('div.fixed.bottom-6.right-6.z-50.w-\\[90vw\\]').isVisible();
    console.log(`Chat closed cleanly: ${!drawerVisibleAfterClose}`);

    testReport.widgets.cornerChat = {
      mounted: chatFabVisible,
      welcomeTerms: has1500Welcome && hasZeroRetainers && hasRoiGuarantee,
      replyTerms: replyHas1500 && replyHasCompetitorStrategy,
      closedCleanly: !drawerVisibleAfterClose,
      pass: chatFabVisible && has1500Welcome && replyHas1500 && !drawerVisibleAfterClose
    };

    // =========================================================================
    // 5. PRACTICE MANAGER MODAL VALIDATION & DISPATCH
    // =========================================================================
    console.log('\n>>> SECTION 5: PRACTICE MANAGER MODAL <<<');
    // The button is inside the audit results card toolbar
    const openModalBtn = page.locator('button:has-text("Email Report to Practice Manager")').first();
    await openModalBtn.waitFor({ state: 'visible', timeout: 5000 });
    console.log('Clicking "Email Report to Practice Manager"...');
    await openModalBtn.click();
    await page.waitForTimeout(400);

    // Modal should be visible
    const modalTitle = page.locator('text=Email Audit Report to Practice Manager').first();
    const modalVisible = await modalTitle.isVisible();
    console.log(`Practice Manager Modal visible: ${modalVisible}`);

    // Test form validation: empty email submit
    const emailField = page.locator('input[placeholder="director@clinic.com"]').first();
    await emailField.fill('');
    const dispatchBtn = page.locator('button[type="submit"]:has-text("Dispatch Lead & Webhook")').first();
    await dispatchBtn.click();
    await page.waitForTimeout(300);

    // Modal should remain open due to HTML5 validation / required
    const modalStillOpen = await modalTitle.isVisible();
    console.log(`Modal validation held (modal remains open): ${modalStillOpen}`);

    // Fill valid data
    const contactField = page.locator('input[placeholder*="Dr. Jane Smith"]').first();
    await contactField.fill('Dr. Sarah Jenkins, DDS');
    await emailField.fill('director@austincosmeticdental.com');

    const phoneField = page.locator('input[placeholder*="+1 (555) 234-5678"]').first();
    if (await phoneField.isVisible()) {
      await phoneField.fill('512-555-0199');
    }

    const webhookField = page.locator('input[placeholder*="https://services.leadconnectorhq.com"]').first();
    if (await webhookField.isVisible()) {
      await webhookField.fill('https://httpbin.org/post');
    }

    // Submit and intercept /api/lead response
    console.log('Submitting Practice Manager form to /api/lead...');
    const [leadReq, leadRes] = await Promise.all([
      page.waitForRequest(req => req.url().includes('/api/lead') && req.method() === 'POST'),
      page.waitForResponse(res => res.url().includes('/api/lead')),
      dispatchBtn.click()
    ]);

    const leadStatus = leadRes.status();
    const leadBody = await leadRes.json();
    console.log(`  -> /api/lead HTTP Status: ${leadStatus}, response:`, leadBody);

    await page.waitForTimeout(600);
    const modalClosedAfterSubmit = !(await modalTitle.isVisible());
    console.log(`Modal closed after successful dispatch: ${modalClosedAfterSubmit}`);

    testReport.widgets.practiceManagerModal = {
      modalOpened: modalVisible,
      validationHeld: modalStillOpen,
      dispatchStatus: leadStatus,
      dispatchSuccess: leadBody.success === true,
      modalClosedAfterSubmit,
      pass: modalVisible && modalStillOpen && leadStatus === 200 && leadBody.success === true && modalClosedAfterSubmit
    };

    // =========================================================================
    // 6. PATIENT ROI CALCULATOR DYNAMIC RECALCULATION
    // =========================================================================
    console.log('\n>>> SECTION 6: PATIENT ROI CALCULATOR <<<');
    const roiSection = page.locator('#patient-roi-calculator').first();
    await roiSection.scrollIntoViewIfNeeded();

    const initialRoiText = await roiSection.innerText();

    // Test specialty selector button: Plastic Surgery ($14,500 preset)
    const plasticBtn = page.locator('button:has-text("Plastic Surgery")').first();
    await plasticBtn.click();
    await page.waitForTimeout(300);

    const plasticRoiText = await roiSection.innerText();
    const plasticPresetUpdated = plasticRoiText !== initialRoiText;
    console.log(`Plastic Surgery specialty preset dynamically updated numbers: ${plasticPresetUpdated}`);

    // Move sliders: Case Value slider & Patient count slider
    const sliders = roiSection.locator('input[type="range"]');
    const caseValueSlider = sliders.nth(0);
    const patientSlider = sliders.nth(1);

    console.log('Setting Case Value = $20,000 and Expected Patients = 5...');
    await caseValueSlider.fill('20000');
    await caseValueSlider.dispatchEvent('input');
    await caseValueSlider.dispatchEvent('change');
    await page.waitForTimeout(200);

    await patientSlider.fill('5');
    await patientSlider.dispatchEvent('input');
    await patientSlider.dispatchEvent('change');
    await page.waitForTimeout(300);

    const calculatedRoiText = await roiSection.innerText();
    // 20,000 * 5 = 100,000 monthly
    const has100kMonthly = calculatedRoiText.includes('100,000');
    // Annual = 1,200,000
    const hasAnnualCalc = calculatedRoiText.includes('1,200,000');
    // Net ROI multiple calculation = 799x or similar
    console.log(`Dynamic calculation verified: monthly $100,000=${has100kMonthly}, annual $1,200,000=${hasAnnualCalc}`);

    testReport.widgets.roiCalculator = {
      plasticPresetUpdated,
      dynamicMonthlyCalc: has100kMonthly,
      dynamicAnnualCalc: hasAnnualCalc,
      pass: plasticPresetUpdated && has100kMonthly && hasAnnualCalc
    };

    // =========================================================================
    // 7. EXTERNAL CHECKOUT LINKS: STRICT WHOP PLAN URL VERIFICATION
    // =========================================================================
    console.log('\n>>> SECTION 7: EXTERNAL CHECKOUT LINKS <<<');
    const pagesToCheck = ['/', '/pricing', '/report/dentalpractice.com', '/login', '/signup'];
    const linkAudits = {};

    for (const p of pagesToCheck) {
      await page.goto(`http://localhost:3000${p}`, { waitUntil: 'networkidle' });
      const whopLinks = page.locator('a[href*="whop.com"]');
      const count = await whopLinks.count();
      const hrefs = [];

      for (let i = 0; i < count; i++) {
        const href = await whopLinks.nth(i).getAttribute('href');
        hrefs.push(href);
      }

      const allMatch = count > 0 ? hrefs.every(h => h === EXPECTED_WHOP_URL) : true;
      console.log(`Route ${p}: found ${count} Whop links, all match ${EXPECTED_WHOP_URL}: ${allMatch}`);
      linkAudits[p] = { count, allMatch, hrefs };
    }

    const allWhopLinksPass = Object.values(linkAudits).every(a => a.allMatch);

    testReport.checkoutLinks = {
      expectedUrl: EXPECTED_WHOP_URL,
      audits: linkAudits,
      pass: allWhopLinksPass
    };

    // =========================================================================
    // 8. FINAL CONSOLE ERROR & INTEGRITY AUDIT
    // =========================================================================
    console.log('\n>>> SECTION 8: FINAL AUDIT & CONSOLE ERROR CHECK <<<');
    console.log(`Total console errors recorded during session: ${testReport.consoleErrors.length}`);
    console.log(`Total uncaught page errors: ${testReport.pageErrors.length}`);

    const zeroConsoleErrors = testReport.consoleErrors.length === 0;
    const zeroPageErrors = testReport.pageErrors.length === 0;

    const allRoutesPass = Object.values(testReport.routes).every(r => r.pass);
    const allWidgetsPass = Object.values(testReport.widgets).every(w => w.pass);

    console.log(`All routes pass: ${allRoutesPass}`);
    console.log(`All widgets pass: ${allWidgetsPass}`);
    console.log(`Checkout links pass: ${allWhopLinksPass}`);
    console.log(`Zero console errors: ${zeroConsoleErrors}`);
    console.log(`Zero page errors: ${zeroPageErrors}`);

    if (allRoutesPass && allWidgetsPass && allWhopLinksPass && zeroConsoleErrors && zeroPageErrors) {
      testReport.overallVerdict = 'APPROVE';
    } else {
      testReport.overallVerdict = 'REQUEST_CHANGES';
    }

    console.log('\n===============================================================');
    console.log(`FINAL INDEPENDENT VERIFICATION VERDICT: ${testReport.overallVerdict}`);
    console.log('===============================================================\n');

  } catch (err) {
    console.error('Fatal test error:', err);
    testReport.error = err.message;
    testReport.overallVerdict = 'REQUEST_CHANGES';
  } finally {
    await browser.close();
  }

  const resultFilePath = path.join(REPORT_DIR, 'verification_results.json');
  fs.writeFileSync(resultFilePath, JSON.stringify(testReport, null, 2));
  console.log(`Comprehensive test report saved to: ${resultFilePath}`);
  return testReport;
}

runComprehensiveVerification();
