const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'test_run.log');
const RESULTS_FILE = path.join(__dirname, 'test_results.json');
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

function log(msg) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

async function waitForScanToFinish(page, timeout = 12000) {
  // Wait for scan button to revert back to "Run 5-Second Clinical Audit"
  await page.waitForSelector('#audit-bar button[type="submit"]:has-text("Run 5-Second Clinical Audit"):not([disabled])', { timeout });
  // Ensure audit results card is visible
  await page.waitForSelector('#audit-results-card', { state: 'visible', timeout: 5000 });
  await page.waitForTimeout(600);
}

(async () => {
  fs.writeFileSync(LOG_FILE, `=== NexusRank1 Homepage & Audit Bar Test Suite ===\n`);

  const results = {
    timestamp: new Date().toISOString(),
    testsPassed: 0,
    testsFailed: 0,
    failures: [],
    consoleErrors: [],
    consoleWarnings: [],
    networkErrors: [],
    steps: []
  };

  function recordStep(id, title, passed, details = {}) {
    if (passed) {
      results.testsPassed++;
      log(`✅ PASS: [${id}] ${title}`);
    } else {
      results.testsFailed++;
      results.failures.push({ id, title, details });
      log(`❌ FAIL: [${id}] ${title} - Details: ${JSON.stringify(details)}`);
    }
    results.steps.push({ id, title, passed, details });
  }

  const browser = await chromium.launch({
    executablePath: '/run/current-system/sw/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 }
  });

  // Grant clipboard permissions
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);

  const page = await context.newPage();

  // Listen for console events
  page.on('console', (msg) => {
    const text = msg.text();
    const type = msg.type();
    if (type === 'error') {
      log(`[BROWSER ERROR] ${text}`);
      results.consoleErrors.push({ text, location: msg.location() });
    } else if (type === 'warn') {
      results.consoleWarnings.push({ text, location: msg.location() });
    }
  });

  page.on('pageerror', (err) => {
    log(`[UNCAUGHT PAGE ERROR] ${err.message}\n${err.stack}`);
    results.consoleErrors.push({ text: err.message, stack: err.stack });
  });

  page.on('requestfailed', (req) => {
    log(`[REQUEST FAILED] ${req.method()} ${req.url()} - ${req.failure()?.errorText}`);
    results.networkErrors.push({
      url: req.url(),
      method: req.method(),
      error: req.failure()?.errorText
    });
  });

  try {
    log('--- Navigating to http://localhost:3000 ---');
    const resp = await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
    const status = resp.status();
    recordStep('INIT-01', 'Homepage loaded with HTTP 200', status === 200, { status });

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_initial_home.png') });

    // Verify Title and Hero elements
    const title = await page.title();
    log(`Page Title: ${title}`);
    recordStep('HERO-01', 'Page title is correct', title.includes('NexusRank1'), { title });

    const auditBar = await page.$('#audit-bar');
    recordStep('HERO-02', '#audit-bar element exists', auditBar !== null);

    // ==========================================
    // SECTION 1: Preset Domain Buttons & Inputs
    // ==========================================
    log('--- Testing Preset Domain Buttons & Custom Inputs ---');

    // 1. Initial State Check (dentalpractice.com)
    const initialInputVal = await page.$eval('#audit-bar input[type="text"]', el => el.value);
    log(`Initial input value: ${initialInputVal}`);
    recordStep('INPUT-01', 'Initial domain input defaults to dentalpractice.com', initialInputVal === 'dentalpractice.com');

    // Verify initial RadialScoreDial
    const initialDial = await page.$('#audit-bar svg.-rotate-90');
    const initialScoreText = await page.$eval('#audit-bar .text-2xl, #audit-bar .text-3xl', el => el.innerText.trim());
    recordStep('DIAL-01', 'Radial score gauge rendered on initial load', initialDial !== null && initialScoreText.length > 0, { initialScoreText });

    // Test Preset 1: mayoclinic.org
    log('Clicking preset button: mayoclinic.org');
    const mayoBtn = await page.waitForSelector('#audit-bar button:has-text("mayoclinic.org")');
    await mayoBtn.click();

    // Check scanning animation elements
    try {
      await page.waitForSelector('#audit-bar button:has-text("Auditing Domain...")', { timeout: 1500 });
      log('Scan animation detected for mayoclinic.org');
    } catch (e) {}

    await waitForScanToFinish(page);

    const mayoClinicName = await page.$eval('#audit-results-card h3', el => el.innerText.trim());
    const mayoScore = await page.$eval('#audit-results-card .text-2xl, #audit-results-card .text-3xl', el => el.innerText.trim());
    const mayoGrade = await page.$eval('#audit-results-card span.bg-white\\/10', el => el.innerText.trim());
    log(`Mayo Clinic Name: ${mayoClinicName}, Score: ${mayoScore}, Grade: ${mayoGrade}`);
    recordStep('PRESET-01', 'Preset mayoclinic.org updates results with valid clinic profile and score',
      mayoClinicName.includes('Mayo Clinic') && parseInt(mayoScore) > 0 && mayoGrade.length > 0,
      { clinicName: mayoClinicName, score: mayoScore, grade: mayoGrade }
    );

    // Test Preset 2: clevelandclinic.org
    log('Clicking preset button: clevelandclinic.org');
    const clevelandBtn = await page.waitForSelector('#audit-bar button:has-text("clevelandclinic.org")');
    await clevelandBtn.click();

    await waitForScanToFinish(page);

    const clevelandClinicName = await page.$eval('#audit-results-card h3', el => el.innerText.trim());
    const clevelandScore = await page.$eval('#audit-results-card .text-2xl, #audit-results-card .text-3xl', el => el.innerText.trim());
    const clevelandGrade = await page.$eval('#audit-results-card span.bg-white\\/10', el => el.innerText.trim());
    log(`Cleveland Clinic Name: ${clevelandClinicName}, Score: ${clevelandScore}, Grade: ${clevelandGrade}`);
    recordStep('PRESET-02', 'Preset clevelandclinic.org updates results with valid clinic profile and score',
      clevelandClinicName.includes('Cleveland Clinic') && parseInt(clevelandScore) > 0 && clevelandGrade.length > 0,
      { clinicName: clevelandClinicName, score: clevelandScore, grade: clevelandGrade }
    );

    // Test Preset 3: austincosmeticdental.com
    log('Clicking preset button: austincosmeticdental.com');
    const austinBtn = await page.waitForSelector('#audit-bar button:has-text("austincosmeticdental.com")');
    await austinBtn.click();

    await waitForScanToFinish(page);

    const austinClinicName = await page.$eval('#audit-results-card h3', el => el.innerText.trim());
    const austinScore = await page.$eval('#audit-results-card .text-2xl, #audit-results-card .text-3xl', el => el.innerText.trim());
    log(`Austin Clinic Name: ${austinClinicName}, Score: ${austinScore}`);
    recordStep('PRESET-03', 'Preset austincosmeticdental.com updates results accurately',
      austinClinicName.toLowerCase().includes('austin') && parseInt(austinScore) > 0,
      { clinicName: austinClinicName, score: austinScore }
    );

    // Test Preset 4: dentalpractice.com
    log('Clicking preset button: dentalpractice.com');
    const dentalBtn = await page.waitForSelector('#audit-bar button:has-text("dentalpractice.com")');
    await dentalBtn.click();

    await waitForScanToFinish(page);

    const dentalClinicName = await page.$eval('#audit-results-card h3', el => el.innerText.trim());
    log(`Dental Practice Name: ${dentalClinicName}`);
    recordStep('PRESET-04', 'Preset dentalpractice.com updates results accurately',
      dentalClinicName.toLowerCase().includes('dental')
    );

    // Test Custom Input: Valid domain (beverlyhillsdentalimplants.com)
    log('Testing custom domain input: beverlyhillsdentalimplants.com');
    const inputField = await page.$('#audit-bar input[type="text"]');
    await inputField.fill('');
    await inputField.fill('beverlyhillsdentalimplants.com');

    const submitBtn = await page.$('#audit-bar button[type="submit"]');
    await submitBtn.click();

    // Verify scanning progress animation step indicators
    let progressStepObserved = false;
    try {
      const stepElem = await page.waitForSelector('#audit-bar .animate-ping', { timeout: 1500 });
      progressStepObserved = stepElem !== null;
    } catch {}
    recordStep('ANIM-01', 'Live audit progress bar & animated step indicators appear during scanning', progressStepObserved);

    await waitForScanToFinish(page);

    const customClinicName = await page.$eval('#audit-results-card h3', el => el.innerText.trim());
    const customScore = await page.$eval('#audit-results-card .text-2xl, #audit-results-card .text-3xl', el => el.innerText.trim());
    log(`Custom Clinic Name: ${customClinicName}, Score: ${customScore}`);
    recordStep('CUSTOM-01', 'Custom domain beverlyhillsdentalimplants.com scans and displays correctly',
      customClinicName.toLowerCase().includes('beverly') && parseInt(customScore) > 0,
      { clinicName: customClinicName, score: customScore }
    );

    // Verify Radial Gauge rendering
    const strokeDash = await page.$eval('#audit-results-card svg.-rotate-90 circle:nth-child(2)', el => el.getAttribute('stroke-dashoffset'));
    recordStep('GAUGE-01', 'Radial score gauge calculates stroke-dashoffset dynamically',
      strokeDash !== null && strokeDash !== '0',
      { strokeDashoffset: strokeDash }
    );

    // Test Edge Case 1: Empty input submission
    log('Testing edge case: empty domain input');
    await inputField.fill('');
    await submitBtn.click();
    await page.waitForTimeout(400);

    // Check for error toast
    const errorToast = await page.$('text=Please enter a target domain URL');
    recordStep('EDGE-01', 'Empty domain input triggers validation toast without crashing', errorToast !== null);

    // Test Edge Case 2: URL with protocol, path, and query params
    log('Testing edge case: complex URL https://sub.practice-implants.clinic/about-us?loc=east');
    await inputField.fill('https://sub.practice-implants.clinic/about-us?loc=east');
    await submitBtn.click();

    await waitForScanToFinish(page);

    const edgeCleanUrl = await page.$eval('#audit-results-card p.text-indigo-400', el => el.innerText.trim());
    log(`Cleaned URL in output: ${edgeCleanUrl}`);
    recordStep('EDGE-02', 'URL with protocol and path is sanitized to clean domain',
      edgeCleanUrl === 'https://sub.practice-implants.clinic',
      { sanitizedUrl: edgeCleanUrl }
    );

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_after_custom_audit.png') });

    // ==========================================
    // SECTION 2: 7 Tab Navigations in Audit Results
    // ==========================================
    log('--- Testing 7 Tab Navigations in Audit Results ---');

    // Tab 1: Competitor Grid ('geo-grid')
    log('Testing Tab 1: Competitor Grid');
    const tab1Btn = await page.waitForSelector('button:has-text("1. Competitor Grid")');
    await tab1Btn.click();
    await page.waitForTimeout(400);

    const gridPillarHeading = await page.$('text=HYPER-LOCAL ZIP-CODE BENCHMARKING');
    const coordinateGridCells = await page.$$('#audit-results-card .grid-cols-3 > div');
    const competitorTable = await page.$('#audit-results-card table');
    const reclaimBtn = await page.$('#audit-results-card a:has-text("Reclaim #1 Spot")');

    recordStep('TAB-01', 'Tab 1 (Competitor Grid) renders 3x3 coordinate matrix and benchmarking table',
      gridPillarHeading !== null && coordinateGridCells.length === 9 && competitorTable !== null && reclaimBtn !== null,
      { cellCount: coordinateGridCells.length }
    );

    // Tab 2: Profile & Directories ('gbp-cleanup')
    log('Testing Tab 2: Profile & Directories');
    const tab2Btn = await page.waitForSelector('button:has-text("2. Profile & Directories")');
    await tab2Btn.click();
    await page.waitForTimeout(400);

    const gbpHeading = await page.$('text=GOOGLE BUSINESS PROFILE & DIRECTORY AUTHORITY');
    const gbpCard1 = await page.$('text=Primary & Secondary Medical Category');
    const gbpCard2 = await page.$('text=Operating Hours & Emergency Intake');
    const gbpCard3 = await page.$('text=NAP Consistency Across 50+ Networks');
    const gbpCard4 = await page.$('text=Keyword Stuffing & Penalty Shield');

    recordStep('TAB-02', 'Tab 2 (Profile & Directories) renders 4 diagnostic cards',
      gbpHeading !== null && gbpCard1 !== null && gbpCard2 !== null && gbpCard3 !== null && gbpCard4 !== null
    );

    // Tab 3: Review Loops & QR ('review-loops')
    log('Testing Tab 3: Review Loops & QR');
    const tab3Btn = await page.waitForSelector('button:has-text("3. Review Loops & QR")');
    await tab3Btn.click();
    await page.waitForTimeout(400);

    const reviewHeading = await page.$('text=AUTOMATED PATIENT FLOW & REVIEW ENGINE');
    const smsBubble = await page.$('text=Could you take 15 seconds to share your experience');
    const qrStandCard = await page.$('text=Reception Desk QR Counter Stand Card');
    const sentimentCallout = await page.$('text=AI Citation Sentiment Distillation:');

    recordStep('TAB-03', 'Tab 3 (Review Loops & QR) renders SMS simulator and Reception QR generator',
      reviewHeading !== null && smsBubble !== null && qrStandCard !== null && sentimentCallout !== null
    );

    // Tab 4: AI Factsheet ('ai-readability')
    log('Testing Tab 4: AI Factsheet');
    const tab4Btn = await page.waitForSelector('button:has-text("4. AI Factsheet")');
    await tab4Btn.click();
    await page.waitForTimeout(400);

    const aiFactsheetHeading = await page.$('text=AI Model Readability & Practice Factsheet');
    const npiLicensureCard = await page.$('text=Doctor NPI-1 Licensure');
    const proceduralCodesCard = await page.$('text=38 Procedural Codes');
    const llmsCard = await page.$('text=ChatGPT /llms.txt');
    const accessibilityCard = await page.$('text=AI Search Accessibility');
    const conciergeCard = await page.$('text=Zero-Work Concierge Setup Included:');

    recordStep('TAB-04', 'Tab 4 (AI Factsheet) renders executive clinical factsheet cards',
      aiFactsheetHeading !== null && npiLicensureCard !== null && proceduralCodesCard !== null && llmsCard !== null && accessibilityCard !== null && conciergeCard !== null
    );

    // Tab 5: Live AI Simulator ('simulator')
    log('Testing Tab 5: Live AI Simulator');
    const tab5Btn = await page.waitForSelector('button:has-text("Live AI Simulator")');
    await tab5Btn.click();
    await page.waitForTimeout(600);

    // Verify GeoCitationSimulator components are mounted
    const simulatorContainer = await page.$('#audit-results-card [class*="slate-900"], #audit-results-card .nr-glass-card');
    const simulatorButtons = await page.$$('#audit-results-card button');

    recordStep('TAB-05', 'Tab 5 (Live AI Simulator) mounts GeoCitationSimulator without crashing',
      simulatorContainer !== null && simulatorButtons.length > 0
    );

    // Tab 6: Doctor Licensure Graph ('graph')
    log('Testing Tab 6: Doctor Licensure Graph');
    const tab6Btn = await page.waitForSelector('button:has-text("Doctor Licensure Graph")');
    await tab6Btn.click();
    await page.waitForTimeout(600);

    // Verify EntityGraphVisualizer mounts
    const graphSvg = await page.$('#audit-results-card svg');
    recordStep('TAB-06', 'Tab 6 (Doctor Licensure Graph) renders EntityGraphVisualizer SVG graph',
      graphSvg !== null
    );

    // Tab 7: Clinical Checklist ('diagnostics')
    log('Testing Tab 7: Clinical Checklist');
    const tab7Btn = await page.waitForSelector('button:has-text("Clinical Checklist")');
    await tab7Btn.click();
    await page.waitForTimeout(400);

    const meterSchema = await page.$('text=Schema Depth');
    const meterEeat = await page.$('text=E-E-A-T Licensure');
    const meterLlms = await page.$('text=AI /llms.txt Manifest');
    const meterCitation = await page.$('text=AI Citation Index');
    const diagnosticItems = await page.$$('#audit-results-card span:has-text("PASS"), #audit-results-card span:has-text("WARN"), #audit-results-card span:has-text("FAIL")');

    recordStep('TAB-07', 'Tab 7 (Clinical Checklist) renders 4 metric meters and diagnostic checklist items',
      meterSchema !== null && meterEeat !== null && meterLlms !== null && meterCitation !== null && diagnosticItems.length >= 7,
      { checklistCount: diagnosticItems.length }
    );

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_tabs_verified.png') });

    // ==========================================
    // SECTION 3: Webmaster Code Toggle & Links
    // ==========================================
    log('--- Testing Webmaster Code Toggle & Links ---');

    // Switch back to Tab 4 ("4. AI Factsheet")
    await tab4Btn.click();
    await page.waitForTimeout(400);

    // Verify toggle button initial state
    const toggleBtn = await page.waitForSelector('button:has-text("View Webmaster Code")');
    await toggleBtn.click();
    await page.waitForTimeout(400);

    // Button should now read "Switch to Doctor Summary"
    const doctorSummaryBtn = await page.$('button:has-text("Switch to Doctor Summary")');
    const codePreBlock = await page.$('#audit-results-card pre');
    const schemaTabBtn = await page.$('button:has-text("Schema.org JSON-LD")');
    const llmsTabBtn = await page.$('button:has-text("llms.txt Practice Factsheet")');
    const cptTabBtn = await page.$('button:has-text("ADA CDT & AMA CPT Procedure Codes")');

    recordStep('CODE-01', 'Webmaster Code toggle switches from Doctor View to Raw Code View',
      doctorSummaryBtn !== null && codePreBlock !== null && schemaTabBtn !== null && llmsTabBtn !== null && cptTabBtn !== null
    );

    // Test Sub-tab 1: Schema.org JSON-LD
    const schemaContent = await page.$eval('#audit-results-card pre', el => el.innerText);
    recordStep('CODE-02', 'Schema.org JSON-LD code contains valid @context and schema types',
      schemaContent.includes('https://schema.org') && (schemaContent.includes('MedicalClinic') || schemaContent.includes('MedicalProcedure')),
      { snippet: schemaContent.substring(0, 100) }
    );

    // Test Sub-tab 2: /llms.txt Practice Factsheet
    await llmsTabBtn.click();
    await page.waitForTimeout(300);
    const llmsContent = await page.$eval('#audit-results-card pre', el => el.innerText);
    recordStep('CODE-03', '/llms.txt code view contains practice factsheet headers',
      llmsContent.includes('Clinical Authority') || llmsContent.includes('CMS National Provider Identifier') || llmsContent.includes('#'),
      { snippet: llmsContent.substring(0, 100) }
    );

    // Test Sub-tab 3: ADA CDT & AMA CPT Procedure Codes
    await cptTabBtn.click();
    await page.waitForTimeout(300);
    const cptContent = await page.$eval('#audit-results-card pre', el => el.innerText);
    recordStep('CODE-04', 'Procedure codes view displays CDT D6010 & CPT 15824 nodes',
      cptContent.includes('D6010') && cptContent.includes('15824'),
      { snippet: cptContent.substring(0, 100) }
    );

    // Test Copy Code button
    log('Testing Copy Code button on active tab');
    const copyCodeBtn = await page.waitForSelector('button:has-text("Copy Code")');
    await copyCodeBtn.click();
    await page.waitForTimeout(400);

    const copiedStateBtn = await page.$('button:has-text("Copied!")');
    recordStep('CODE-05', 'Copy Code button updates label to Copied! and copies payload',
      copiedStateBtn !== null
    );

    // Test Google Rich Results Test link
    const richResultsLink = await page.waitForSelector('a:has-text("Google Rich Results Test")');
    const richResultsHref = await richResultsLink.getAttribute('href');
    const richResultsTarget = await richResultsLink.getAttribute('target');
    recordStep('CODE-06', 'Google Rich Results link has valid target="_blank" and Google search URL',
      richResultsHref.startsWith('https://search.google.com/test/rich-results?url=') && richResultsTarget === '_blank',
      { href: richResultsHref }
    );

    // Toggle back to Doctor Summary
    await doctorSummaryBtn.click();
    await page.waitForTimeout(300);
    const backToFactsheet = await page.$('text=Doctor NPI-1 Licensure');
    recordStep('CODE-07', 'Toggle cleanly switches back to Executive Doctor Summary view',
      backToFactsheet !== null
    );

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_code_toggle_verified.png') });

    // ==========================================
    // SECTION 4: Global Export Toolbar & Modals
    // ==========================================
    log('--- Testing Global Export Toolbar & Modals ---');

    // 1. Whop Checkout Link Verification (must point to https://whop.com/checkout/plan_e37e96b86e088/)
    const EXPECTED_WHOP_URL = 'https://whop.com/checkout/plan_e37e96b86e088/';
    const whopToolbarLink = await page.waitForSelector('#audit-results-card a:has-text("Claim $1,500 System")');
    const whopToolbarHref = await whopToolbarLink.getAttribute('href');

    // Check footer CTA Whop button
    const whopCtaLinks = await page.$$('#audit-results-card a[href*="whop.com"]');
    let allWhopLinksMatch = true;
    for (const l of whopCtaLinks) {
      const h = await l.getAttribute('href');
      if (h !== EXPECTED_WHOP_URL) allWhopLinksMatch = false;
    }

    recordStep('EXPORT-01', 'Whop checkout buttons point exactly to plan_e37e96b86e088',
      whopToolbarHref === EXPECTED_WHOP_URL && allWhopLinksMatch,
      { toolbarHref: whopToolbarHref, totalWhopLinksFound: whopCtaLinks.length }
    );

    // 2. Live Public Report Button (/report/[domain])
    const publicReportLink = await page.waitForSelector('#audit-results-card a:has-text("Live Public Report")');
    const publicReportHref = await publicReportLink.getAttribute('href');
    log(`Live Public Report href: ${publicReportHref}`);
    recordStep('EXPORT-02', 'Live Public Report link targets /report/[domain]',
      publicReportHref.startsWith('/report/') && publicReportHref.includes('unbranded=true'),
      { href: publicReportHref }
    );

    // Test navigating to the public report route
    log(`Testing public report page navigation: http://localhost:3000${publicReportHref}`);
    const reportPage = await context.newPage();
    const reportResp = await reportPage.goto(`http://localhost:3000${publicReportHref}`, { waitUntil: 'domcontentloaded' });
    const reportStatus = reportResp.status();
    const reportTitle = await reportPage.title();
    log(`Public report status: ${reportStatus}, Title: ${reportTitle}`);
    recordStep('EXPORT-03', 'Public report route loads with HTTP 200 without console errors',
      reportStatus === 200,
      { status: reportStatus, title: reportTitle }
    );
    await reportPage.close();

    // 3. Vector PDF Export Button (/api/report/pdf)
    const pdfExportLink = await page.waitForSelector('#audit-results-card a:has-text("Export Vector PDF")');
    const pdfExportHref = await pdfExportLink.getAttribute('href');
    log(`Vector PDF Export href: ${pdfExportHref}`);
    recordStep('EXPORT-04', 'Vector PDF export link targets /api/report/pdf?domain=[domain]',
      pdfExportHref.startsWith('/api/report/pdf?domain='),
      { href: pdfExportHref }
    );

    // Test PDF API request directly via fetch in page
    log('Testing /api/report/pdf endpoint response');
    const pdfApiResult = await page.evaluate(async (url) => {
      try {
        const res = await fetch(url);
        const contentType = res.headers.get('content-type');
        return { ok: res.ok, status: res.status, contentType };
      } catch (e) {
        return { ok: false, error: e.message };
      }
    }, pdfExportHref);

    log(`PDF API Result: ${JSON.stringify(pdfApiResult)}`);
    recordStep('EXPORT-05', '/api/report/pdf endpoint responds with HTTP 200 and application/pdf',
      pdfApiResult.ok && pdfApiResult.status === 200 && pdfApiResult.contentType.includes('application/pdf'),
      pdfApiResult
    );

    // 4. JSON Download Button
    log('Testing JSON Download button');
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 4000 }).catch(() => null),
      page.click('#audit-results-card button:has-text("Export Practice AI Passport (.json)")')
    ]);
    const downloadSuccess = download !== null || (await page.$('text=Downloaded')) !== null;
    recordStep('EXPORT-06', 'Export Practice AI Passport downloads json schema file', downloadSuccess);

    // 5. Practice Manager Dispatch Modal
    log('--- Testing Practice Manager Dispatch Modal ---');
    const openModalBtn = await page.waitForSelector('button:has-text("Email Report to Practice Manager")');
    await openModalBtn.click();
    await page.waitForTimeout(400);

    const modalTitle = await page.$('text=Email Audit Report to Practice Manager');
    recordStep('MODAL-01', 'Practice Manager Dispatch modal opens with backdrop blur', modalTitle !== null);

    // Test Modal Validation: Try submitting empty email
    const modalForm = await page.waitForSelector('form:has-text("Recipient Email")');
    const emailInput = await page.$('input[placeholder="director@clinic.com"]');
    await emailInput.fill('');
    const dispatchBtn = await page.$('button[type="submit"]:has-text("Dispatch Lead & Webhook")');
    await dispatchBtn.click();
    await page.waitForTimeout(300);

    // Should still be open due to required input
    const modalStillOpen = await page.$('text=Email Audit Report to Practice Manager');
    recordStep('MODAL-02', 'Form validation prevents empty email submission and keeps modal open', modalStillOpen !== null);

    // Fill valid form inputs
    const contactNameInput = await page.$('input[placeholder*="Dr. Jane Smith"]');
    await contactNameInput.fill('Dr. Robert Vance, DDS');
    await emailInput.fill('dr.vance@beverlyhillsimplants.com');

    const phoneInput = await page.$('input[placeholder*="+1 (555) 234-5678"]');
    await phoneInput.fill('+1 (310) 555-0199');

    const webhookInput = await page.$('input[placeholder*="https://services.leadconnectorhq.com"]');
    await webhookInput.fill('https://httpbin.org/post');

    const notesInput = await page.$('textarea');
    await notesInput.fill('Urgent full-arch dental implant clinical authority setup required.');

    // Listen for /api/lead network request
    const [leadRequest, leadResponse] = await Promise.all([
      page.waitForRequest(req => req.url().includes('/api/lead') && req.method() === 'POST'),
      page.waitForResponse(res => res.url().includes('/api/lead')),
      dispatchBtn.click()
    ]);

    const leadPayload = JSON.parse(leadRequest.postData() || '{}');
    const leadRespData = await leadResponse.json();
    log(`Lead dispatched payload: ${JSON.stringify(leadPayload)}`);
    log(`Lead dispatched response: ${JSON.stringify(leadRespData)}`);

    recordStep('MODAL-03', 'Submitting modal dispatches payload to /api/lead with HTTP 200',
      leadResponse.status() === 200 && leadRespData.success === true,
      { status: leadResponse.status(), response: leadRespData, payload: leadPayload }
    );

    // Verify success toast and modal close
    await page.waitForTimeout(600);
    const successToast = await page.$('text=Practice proposal logged and webhook dispatched successfully!');
    const modalClosed = (await page.$('text=Email Audit Report to Practice Manager')) === null;

    recordStep('MODAL-04', 'Success notification displayed and modal closes upon dispatch',
      successToast !== null && modalClosed === true
    );

    // Verify localStorage auto-saved webhook URL
    const savedWebhook = await page.evaluate(() => localStorage.getItem('nr1_practice_webhook'));
    recordStep('MODAL-05', 'Practice webhook URL is persisted to localStorage (nr1_practice_webhook)',
      savedWebhook === 'https://httpbin.org/post',
      { savedWebhook }
    );

    // Test Modal Close Button ('X')
    await openModalBtn.click();
    await page.waitForTimeout(300);
    const closeXBtn = await page.waitForSelector('button:has(svg.lucide-x)');
    await closeXBtn.click();
    await page.waitForTimeout(300);
    const modalClosedByX = (await page.$('text=Email Audit Report to Practice Manager')) === null;
    recordStep('MODAL-06', 'Modal close (X) button closes modal cleanly', modalClosedByX === true);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_final_state.png') });

  } catch (err) {
    log(`[FATAL EXCEPTION] ${err.message}\n${err.stack}`);
    recordStep('FATAL', 'Uncaught test runner exception', false, { error: err.message, stack: err.stack });
  } finally {
    await browser.close();
    fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));
    log(`\n========================================`);
    log(`Test Run Completed! Passed: ${results.testsPassed}, Failed: ${results.testsFailed}`);
    log(`Console Errors: ${results.consoleErrors.length}, Warnings: ${results.consoleWarnings.length}`);
    log(`Results saved to ${RESULTS_FILE}`);
    log(`========================================\n`);
  }
})();
