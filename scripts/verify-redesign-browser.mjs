#!/usr/bin/env node
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = 'http://localhost:3000';
const CHROME_PATH = '/run/current-system/sw/bin/google-chrome';

async function runBrowserVerification() {
  console.log('================================================================');
  console.log('🏥 CLINIC AI SEARCH OPTIMIZATION & INTAKE E2E BROWSER VERIFIER');
  console.log('================================================================\n');

  const pageErrors = [];
  const consoleErrors = [];
  const testResults = [];

  function record(testName, passed, details = '') {
    testResults.push({ testName, passed, details });
    const mark = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${mark}: ${testName} ${details ? `(${details})` : ''}`);
  }

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on('pageerror', (err) => {
    pageErrors.push(`[Page Crash] ${err.message}`);
  });

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!text.includes('favicon.ico') && !text.includes('status of 404')) {
        consoleErrors.push(`[Console Error] ${text}`);
      }
    }
  });

  try {
    // -------------------------------------------------------------
    // 1. R1: Hero Header & Above the Fold
    // -------------------------------------------------------------
    console.log('\n--- 1. Testing Requirement R1: Hero Header ---');
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Headline check
    const headline = await page.locator('h1').first().textContent();
    const expectedHeadline = 'Ensure AI Search Recommends Your Clinic Over Local Competitors';
    const headlineClean = headline?.replace(/\s+/g, ' ').trim() || '';
    record('Hero Headline exact text match', headlineClean.includes(expectedHeadline), headlineClean);

    // Subheadline check
    const subheadline = await page.locator('p.text-slate-400').first().textContent();
    const expectedSubheadline = 'The complete, automated local growth & AI audit system engineered exclusively for medical, dental, and aesthetic clinic owners. Dominate local search proximity on ChatGPT, Perplexity, and Google AI Overviews.';
    const subClean = subheadline?.replace(/\s+/g, ' ').trim() || '';
    record('Hero Subheadline exact text match', subClean.includes(expectedSubheadline), subClean);

    // Clinical Badges check
    record('CMS NPPES Licensure tag present', (await page.locator('text=CMS NPPES Licensure').count()) > 0);
    record('100% Medical Board Verified tag present', (await page.locator('text=100% Medical Board').count()) > 0);

    // Hero CTA button & smooth scroll to #audit-intake
    const heroCta = page.locator('a[href="#audit-intake"]').first();
    const heroCtaText = (await heroCta.textContent())?.trim();
    record('Hero CTA text is "[ Request Your Zip Code Audit ]"', heroCtaText?.includes('Request Your Zip Code Audit') || false, heroCtaText);

    // Click CTA and verify scroll & focus
    await heroCta.click();
    await page.waitForTimeout(600);
    const focusedInputId = await page.evaluate(() => document.activeElement?.id);
    record('Hero CTA clicks and focuses first input (practiceName)', focusedInputId === 'practiceName', `Focused: ${focusedInputId}`);

    // -------------------------------------------------------------
    // 2. R2: Core Done-For-You Features (4 Pillars)
    // -------------------------------------------------------------
    console.log('\n--- 2. Testing Requirement R2: 4 Clinical Growth Pillars ---');
    const featuresSection = page.locator('section#features');
    const featuresText = await featuresSection.textContent();

    record('Pillar 1: Geo-Visibility Grid Tracking & Zip Code Benchmarking', featuresText?.includes('Geo-Visibility Grid Tracking & Zip Code Benchmarking') || false);
    record('Pillar 1: 5-Mile Proximity Radar', featuresText?.includes('5-Mile Proximity Radar') || false);

    record('Pillar 2: 0-Error MedicalClinic Schema ASTs', featuresText?.includes('0-Error MedicalClinic Schema ASTs') || false);
    record('Pillar 2: 100% Validated W3C Graph', featuresText?.includes('100% Validated W3C Graph') || false);

    record('Pillar 3: Automated Review Loops & Front-Desk Engine', featuresText?.includes('Automated Review Loops & Front-Desk Engine') || false);
    record('Pillar 3: Front-Desk SMS & QR Engine', featuresText?.includes('Front-Desk SMS & QR Engine') || false);

    record('Pillar 4: Strict Zip Code Exclusivity', featuresText?.includes('Strict Zip Code Exclusivity') || false);
    record('Pillar 4: 1 Practice Per Zip Code', featuresText?.includes('1 Practice Per Zip Code') || false);

    // -------------------------------------------------------------
    // 3. R3: Intake Form Section & Dispatch Feedback
    // -------------------------------------------------------------
    console.log('\n--- 3. Testing Requirement R3: Doctor-Tailored Intake Form ---');
    const intakeSection = page.locator('section#audit-intake');
    await intakeSection.scrollIntoViewIfNeeded();

    // Verify all 6 required fields
    const practiceNameInput = page.locator('input#practiceName');
    const doctorNameInput = page.locator('input#doctorName');
    const domainInput = page.locator('input#domain');
    const cityZipInput = page.locator('input#cityZip');
    const emailInput = page.locator('input#email');
    const phoneInput = page.locator('input#phone');
    const submitBtn = intakeSection.locator('button[type="submit"]');

    record('Form contains Practice Name input', (await practiceNameInput.count()) === 1);
    record('Form contains Doctor Name input', (await doctorNameInput.count()) === 1);
    record('Form contains Website Domain input', (await domainInput.count()) === 1);
    record('Form contains City & Zip Code input', (await cityZipInput.count()) === 1);
    record('Form contains Direct Email input', (await emailInput.count()) === 1);
    record('Form contains Direct Phone input', (await phoneInput.count()) === 1);
    record('Submit button text contains "Submit Audit Request"', (await submitBtn.textContent())?.includes('Submit Audit Request') || false);

    // Fill form and submit
    await practiceNameInput.fill('Bellevue Cosmetic & Reconstructive Center');
    await doctorNameInput.fill('Dr. Kimberly Adams, MD, FACS');
    await domainInput.fill('bellevuecosmetic.com');
    await cityZipInput.fill('Bellevue, WA 98004');
    await emailInput.fill('dr.adams@bellevuecosmetic.com');
    await phoneInput.fill('(425) 555-0182');

    // Submit form
    console.log('Submitting audit intake request...');
    await submitBtn.click();
    await page.waitForTimeout(1500);

    // Check confirmation card
    const confirmationReceipt = page.locator('text=TERRITORY UNDER 48-HOUR CLINICAL REVIEW, text=Audit Request Submitted!');
    const isConfirmed = (await page.locator('text=Audit Request Submitted!').count()) > 0;
    record('In-card confirmation state rendered', isConfirmed);

    // Check dispatch notification text
    const dispatchNotice = page.locator('text=name@nexusrank1.com');
    record('Dispatch confirms forwarding to name@nexusrank1.com', (await dispatchNotice.count()) > 0);

    // Check toast notification
    const sonnerToast = page.locator('[data-sonner-toast]');
    const toastVisible = (await sonnerToast.count()) > 0;
    record('Immediate sonner toast notification displayed', toastVisible);

    // -------------------------------------------------------------
    // 4. R4: The ROI Proof & Math Section
    // -------------------------------------------------------------
    console.log('\n--- 4. Testing Requirement R4: ROI Modeler & Case Values ---');
    const roiSection = page.locator('#patient-roi-calculator');
    await roiSection.scrollIntoViewIfNeeded();

    const roiText = await roiSection.textContent();
    record('Highlights $20,000 to $50,000 per case', roiText?.includes('$20,000 to $50,000') || false);
    record('Callout: Securing just a single patient consultation covers system deployment', roiText?.includes('Securing just a single patient consultation') || false);

    // Verify 4 specialty buttons
    const specialtyButtons = roiSection.locator('button');
    const specCount = await specialtyButtons.count();
    record('Specialty presets present (All-on-4, Plastic, Ortho, MedSpa)', specCount >= 4);

    // Click "MedSpa" specialty
    const medspaBtn = roiSection.locator('button:has-text("MedSpa")');
    await medspaBtn.click();
    await page.waitForTimeout(300);
    const avgTicketDisplay = await roiSection.locator('.text-emerald-400.font-mono').first().textContent();
    record('Selecting MedSpa updates average ticket', avgTicketDisplay?.includes('4,500') || false, avgTicketDisplay);

    // Click "All-on-4 Implants" specialty
    const implantBtn = roiSection.locator('button:has-text("All-on-4")');
    await implantBtn.click();
    await page.waitForTimeout(300);
    const implantTicket = await roiSection.locator('.text-emerald-400.font-mono').first().textContent();
    record('Selecting All-on-4 restores $25,000 full-arch ticket', implantTicket?.includes('25,000') || false, implantTicket);

    // Test slider extending to $50,000
    const slider = roiSection.locator('input[type="range"]').first();
    const maxVal = await slider.getAttribute('max');
    record('Slider max extended to 50,000', maxVal === '50000', `max="${maxVal}"`);

    // -------------------------------------------------------------
    // 5. R5: Clinical FAQ Section
    // -------------------------------------------------------------
    console.log('\n--- 5. Testing Requirement R5: Clinical FAQ Accordion ---');
    const faqSection = page.locator('section:has-text("Frequently Asked Questions")');
    await faqSection.scrollIntoViewIfNeeded();

    // Check Question 0 (Medical Board Compliance, open by default)
    const faq0Text = await faqSection.textContent();
    record('FAQ: Medical Board compliance (AMA/ADA)', faq0Text?.includes('State Medical & Dental Board') && faq0Text?.includes('AMA, ADA'));

    // Click Question 1 (HIPAA Safety) to expand and test
    const hipaaBtn = faqSection.locator('button:has-text("HIPAA")');
    await hipaaBtn.click();
    await page.waitForTimeout(300);
    const hipaaAnswer = await faqSection.locator('text=Zero-PHI architecture').first().textContent();
    record('FAQ: HIPAA safety (Zero PHI)', hipaaAnswer?.includes('Zero-PHI') || false);

    // Click Question 2 (48-Hour deployment) to expand and test
    const deployBtn = faqSection.locator('button:has-text("How fast is deployment")');
    await deployBtn.click();
    await page.waitForTimeout(300);
    const deployAnswer = await faqSection.locator('text=100% Done-For-You within 48 hours').first().textContent();
    record('FAQ: 48-Hour deployment', deployAnswer?.includes('48 hours') || false);

    // Click Question 3 (Strict Zip Code Exclusivity) to expand and test
    const exclusBtn = faqSection.locator('button:has-text("Strict Zip Code Exclusivity")');
    await exclusBtn.click();
    await page.waitForTimeout(300);
    const exclusAnswer = await faqSection.locator('text=permanently lock out local rivals').first().textContent();
    record('FAQ: Strict Zip Code Exclusivity', exclusAnswer?.includes('permanently lock out local rivals') || false);

    // -------------------------------------------------------------
    // 6. Multi-Viewport & Navbar Alignment
    // -------------------------------------------------------------
    console.log('\n--- 6. Multi-Viewport & Navigation Testing ---');
    // Mobile Viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    const mobileMenuBtn = page.locator('button[aria-label="Toggle menu"]');
    await mobileMenuBtn.click();
    await page.waitForTimeout(300);

    const mobileAuditBtn = page.locator('a[href="/#audit-intake"]:has-text("Request Your Zip Code Audit")');
    record('Mobile drawer contains "Request Your Zip Code Audit" CTA', (await mobileAuditBtn.count()) > 0);

    // Reset to Desktop
    await page.setViewportSize({ width: 1440, height: 900 });

    // -------------------------------------------------------------
    // 7. Verify Static Export (dist-netlify/) via Local HTTP Server
    // -------------------------------------------------------------
    console.log('\n--- 7. Testing Static Export dist-netlify/ ---');
    const distNetlifyPath = path.join(process.cwd(), 'dist-netlify');
    if (fs.existsSync(path.join(distNetlifyPath, 'index.html'))) {
      const server = http.createServer((req, res) => {
        let filePath = path.join(distNetlifyPath, req.url === '/' ? 'index.html' : req.url);
        if (!fs.existsSync(filePath)) {
          filePath = path.join(distNetlifyPath, 'index.html');
        }
        if (fs.statSync(filePath).isDirectory()) {
          filePath = path.join(filePath, 'index.html');
        }
        const ext = path.extname(filePath);
        const mimeMap = {
          '.html': 'text/html',
          '.js': 'application/javascript',
          '.css': 'text/css',
          '.json': 'application/json',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.svg': 'image/svg+xml',
        };
        res.writeHead(200, { 'Content-Type': mimeMap[ext] || 'text/plain' });
        fs.createReadStream(filePath).pipe(res);
      });

      await new Promise((resolve) => server.listen(3456, resolve));

      const staticPage = await context.newPage();
      const staticErrors = [];
      staticPage.on('pageerror', (e) => staticErrors.push(e.message));
      staticPage.on('console', (m) => {
        if (m.type() === 'error') staticErrors.push(m.text());
      });

      await staticPage.goto('http://localhost:3456', { waitUntil: 'domcontentloaded' });
      await staticPage.waitForTimeout(1000);

      const staticH1 = await staticPage.locator('h1').first().textContent();
      record('dist-netlify/ index.html renders in Chrome without errors', staticH1?.includes(expectedHeadline) || false);
      record('dist-netlify/ 0 browser errors', staticErrors.length === 0, `Errors: ${staticErrors.length}`);

      await staticPage.close();
      server.close();
    } else {
      record('dist-netlify/ directory exists with index.html', false);
    }

    // -------------------------------------------------------------
    // 8. Console & Page Error Summary
    // -------------------------------------------------------------
    console.log('\n--- 8. Error Gate Summary ---');
    record('Zero page crashes during full interactive session', pageErrors.length === 0, `Crashes: ${pageErrors.length}`);
    record('Zero console errors during full interactive session', consoleErrors.length === 0, `Errors: ${consoleErrors.length}`);

    if (pageErrors.length > 0) {
      console.log('Page errors:', pageErrors);
    }
    if (consoleErrors.length > 0) {
      console.log('Console errors:', consoleErrors);
    }

    const totalTests = testResults.length;
    const passedTests = testResults.filter((t) => t.passed).length;
    const failedTests = totalTests - passedTests;

    console.log('\n================================================================');
    console.log(`TOTAL CHECKS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
    console.log('================================================================');

    if (failedTests > 0) {
      process.exit(1);
    }
  } finally {
    await browser.close();
  }
}

runBrowserVerification().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
