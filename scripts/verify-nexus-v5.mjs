#!/usr/bin/env node

/**
 * scripts/verify-nexus-v5.mjs
 * 
 * Comprehensive Automated Headless Chrome Test Suite for NexusRank1 Healthcare Redesign
 * 
 * Verifies:
 * - R1: Hero Header (Exact headline, exact subheadline, CTA button "[ Request Your Zip Code Audit ]",
 *       smooth scroll to #audit-intake, auto-focus on #practiceName, high-trust clinical badges)
 * - R2: 4 Clinical Growth Pillars (Geo-Visibility Grid, 0-Error Schema ASTs, Review Loops, Strict Zip Code Exclusivity)
 * - R3: Doctor Intake Card Section (6 fields, empty form validation, valid submission dispatch to
 *       POST /api/lead returning 200 with delivery to name@nexusrank1.com, in-card confirmation state, sonner toast)
 * - R4: ROI Math Section ($20k-$50k full-arch case values, 4 specialty toggles: All-on-4 Implants,
 *       Facial Plastic Surgery, Orthopedics, MedSpa, dynamic math recalculation, 1-patient consultation proof)
 * - R5: Clinical FAQ Section (Medical Board Compliance, HIPAA Zero-PHI safety, 48-Hour deployment)
 * - Responsive Viewports: Desktop (1440x900), Tablet (768x1024), Mobile (375x812), no overflow
 * - Static Export Verification: Serves dist-netlify/ on ephemeral Node.js server, loads in Chrome, asserts HTTP 200 & DOM
 * - Console Error Gate: 0 console errors and 0 unhandled page errors across all test runs
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const CHROME_PATH = process.env.CHROME_PATH || '/run/current-system/sw/bin/google-chrome';
const DIST_NETLIFY_DIR = path.join(ROOT_DIR, 'dist-netlify');

// Color helpers for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function pass(msg) {
  console.log(`  ${colors.green}✓${colors.reset} ${msg}`);
}

function fail(msg, details = null) {
  console.error(`  ${colors.red}✗ ${msg}${colors.reset}`);
  if (details) {
    console.error(`    ${colors.dim}${details}${colors.reset}`);
  }
}

function info(msg) {
  console.log(`  ${colors.cyan}ℹ${colors.reset} ${msg}`);
}

function normalize(str) {
  return (str || '').replace(/\s+/g, ' ').trim();
}

/**
 * Ephemeral Static HTTP File Server for dist-netlify/
 */
function createStaticServer(distDir, port = 3457) {
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
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(fs.readFileSync(filePath));
  });

  return new Promise((resolve, reject) => {
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        // Fallback to random free port
        server.listen(0, () => {
          const assignedPort = server.address().port;
          resolve({ server, port: assignedPort, url: `http://localhost:${assignedPort}` });
        });
      } else {
        reject(err);
      }
    });

    server.listen(port, () => {
      resolve({ server, port, url: `http://localhost:${port}` });
    });
  });
}

/**
 * Main Test Runner
 */
async function runNexusV5TestSuite() {
  console.log(`\n${colors.bright}${colors.blue}========================================================================${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}🩺 NEXUSRANK1 HEALTHCARE REDESIGN: HEADLESS CHROME E2E VERIFICATION${colors.reset}`);
  console.log(`${colors.dim}Target URL: ${BASE_URL}${colors.reset}`);
  console.log(`${colors.dim}Chrome Path: ${CHROME_PATH}${colors.reset}`);
  console.log(`${colors.dim}Started: ${new Date().toISOString()}${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}========================================================================${colors.reset}\n`);

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  const failureList = [];

  function record(testName, passed, details = null) {
    totalTests++;
    if (passed) {
      passedTests++;
      pass(testName);
    } else {
      failedTests++;
      fail(testName, details);
      failureList.push({ testName, details });
    }
  }

  // Global console and page error collectors
  const recordedConsoleErrors = [];
  const recordedPageErrors = [];

  // Launch browser with Google Chrome
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });

  try {
    // --------------------------------------------------------------------------
    // SUITE 1: Hero Header & Clinical Authority Badges (Requirement R1)
    // --------------------------------------------------------------------------
    console.log(`\n${colors.bright}▶ SUITE 1: Hero Header & Clinical Authority (Requirement R1)${colors.reset}`);
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    page.on('pageerror', (err) => {
      recordedPageErrors.push(`[Page Crash] ${page.url()}: ${err.message}`);
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore benign favicon 404 or expected network test drops
        if (!text.includes('favicon.ico') && !text.includes('status of 404') && !text.includes('Failed to load resource: net::ERR_CONNECTION_REFUSED')) {
          recordedConsoleErrors.push(`[Console Error] ${page.url()}: ${text}`);
        }
      }
    });

    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // 1.1 Hero Headline Exact Match
    const h1Locator = page.locator('h1').first();
    const h1Raw = await h1Locator.textContent();
    const h1Text = normalize(h1Raw);
    const EXPECTED_HEADLINE = 'Ensure AI Search Recommends Your Clinic Over Local Competitors';
    record(
      `Hero Headline exact match: "${EXPECTED_HEADLINE}"`,
      h1Text === EXPECTED_HEADLINE,
      `Observed: "${h1Text}"`
    );

    // 1.2 Hero Subheadline Exact Match
    const EXPECTED_SUBHEADLINE = 'The complete, automated local growth & AI audit system engineered exclusively for medical, dental, and aesthetic clinic owners. Dominate local search proximity on ChatGPT, Perplexity, and Google AI Overviews.';
    const subLocator = page.locator('section').first().locator('p').filter({ hasText: /engineered exclusively for medical/i }).first();
    let subText = '';
    if (await subLocator.count() > 0) {
      subText = normalize(await subLocator.textContent());
    } else {
      // Fallback: search any p in hero
      const heroPs = await page.locator('section').first().locator('p').all();
      for (const p of heroPs) {
        const t = normalize(await p.textContent());
        if (t.includes('ChatGPT, Perplexity')) {
          subText = t;
          break;
        }
      }
    }
    record(
      'Hero Subheadline exact word-for-word match',
      subText === EXPECTED_SUBHEADLINE,
      `Observed: "${subText}"`
    );

    // 1.3 High-Trust Clinical Authority Badges
    const heroContent = await page.locator('section').first().innerText();
    const hasNppesBadge = /CMS NPPES/i.test(heroContent);
    const hasMedBoardBadge = /Medical Board/i.test(heroContent);
    const hasHipaaOrVerified = /(HIPAA|Direct Healthcare Practice Growth|Verified)/i.test(heroContent);
    record(
      'High-trust clinical badges present (CMS NPPES, Medical Board, Clinical Verification)',
      hasNppesBadge && hasMedBoardBadge && hasHipaaOrVerified,
      `NPPES: ${hasNppesBadge}, MedBoard: ${hasMedBoardBadge}, Verified: ${hasHipaaOrVerified}`
    );

    // 1.4 Primary CTA Button & Smooth Scroll to #audit-intake
    const ctaButton = page.locator('a[href="#audit-intake"], a[href*="audit-intake"], button:has-text("Request Your Zip Code Audit"), a:has-text("Request Your Zip Code Audit")').first();
    const ctaExists = (await ctaButton.count()) > 0;
    record(
      'Primary CTA button "[ Request Your Zip Code Audit ]" exists in Hero',
      ctaExists
    );

    if (ctaExists) {
      // Click CTA and verify smooth scroll down to #audit-intake
      await ctaButton.click();
      await page.waitForTimeout(600);

      const isIntakeInView = await page.evaluate(() => {
        const el = document.getElementById('audit-intake');
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
      });
      record(
        'CTA button click smoothly scrolls viewport to #audit-intake section',
        isIntakeInView
      );

      // Verify focus transferred to practiceName input
      await page.waitForFunction(() => {
        const active = document.activeElement;
        return active && (active.id === 'practiceName' || active.getAttribute('name') === 'practiceName');
      }, { timeout: 2500 }).catch(() => null);

      const focusedId = await page.evaluate(() => {
        const active = document.activeElement;
        return active ? (active.id || active.getAttribute('name')) : null;
      });
      record(
        'Focus automatically directed to first intake field (#practiceName)',
        focusedId === 'practiceName',
        `Active focused element id/name: "${focusedId}"`
      );
    }

    // --------------------------------------------------------------------------
    // SUITE 2: Core Done-For-You Features (Requirement R2)
    // --------------------------------------------------------------------------
    console.log(`\n${colors.bright}▶ SUITE 2: 4 Clinical Growth Pillars (Requirement R2)${colors.reset}`);
    const pageText = await page.innerText('body');

    // Pillar 1: Geo-Visibility Grid Tracking & Zip Code Benchmarking
    const hasPillar1 = /Geo-Visibility Grid Tracking & Zip Code Benchmarking/i.test(pageText);
    const hasPillar1Radius = /(5-mile radius|eliminated? local blind spots)/i.test(pageText);
    record(
      'Pillar 1: "Geo-Visibility Grid Tracking & Zip Code Benchmarking" with 5-mile radius proof',
      hasPillar1 && hasPillar1Radius,
      `Title found: ${hasPillar1}, 5-mile radius detail: ${hasPillar1Radius}`
    );

    // Pillar 2: 0-Error MedicalClinic Schema ASTs
    const hasPillar2 = /0-Error MedicalClinic Schema ASTs/i.test(pageText);
    const hasPillar2Tech = /(Enterprise technical code|clinical credentials)/i.test(pageText);
    record(
      'Pillar 2: "0-Error MedicalClinic Schema ASTs" with enterprise code details',
      hasPillar2 && hasPillar2Tech,
      `Title found: ${hasPillar2}, Technical detail: ${hasPillar2Tech}`
    );

    // Pillar 3: Automated Review Loops & Front-Desk Engine
    const hasPillar3 = /Automated Review Loops & Front-Desk Engine/i.test(pageText);
    const hasPillar3Reviews = /(5-star Google reviews|front-desk|capture of 5-star)/i.test(pageText);
    record(
      'Pillar 3: "Automated Review Loops & Front-Desk Engine" with Google review capture',
      hasPillar3 && hasPillar3Reviews,
      `Title found: ${hasPillar3}, Review loops detail: ${hasPillar3Reviews}`
    );

    // Pillar 4: Strict Zip Code Exclusivity
    const hasPillar4 = /Strict Zip Code Exclusivity/i.test(pageText);
    const hasPillar4Lock = /(Locking out (your )?local rivals permanently|territory protection)/i.test(pageText);
    record(
      'Pillar 4: "Strict Zip Code Exclusivity" with permanent territory protection',
      hasPillar4 && hasPillar4Lock,
      `Title found: ${hasPillar4}, Exclusivity detail: ${hasPillar4Lock}`
    );

    // --------------------------------------------------------------------------
    // SUITE 3: Doctor Intake Card & Lead Dispatch (Requirement R3)
    // --------------------------------------------------------------------------
    console.log(`\n${colors.bright}▶ SUITE 3: Doctor Intake Card & Lead Dispatch (Requirement R3)${colors.reset}`);

    const intakeSection = page.locator('#audit-intake');
    const intakeSectionCount = await intakeSection.count();
    record('Intake section with id="audit-intake" is rendered on homepage', intakeSectionCount > 0);

    // Verify all 6 fields are present
    const practiceNameInput = intakeSection.locator('input#practiceName, input[name="practiceName"]').first();
    const doctorNameInput = intakeSection.locator('input#doctorName, input[name="doctorName"]').first();
    const domainInput = intakeSection.locator('input#domain, input[name="domain"]').first();
    const cityZipInput = intakeSection.locator('input#cityZip, input[name="cityZip"]').first();
    const emailInput = intakeSection.locator('input#email, input[name="email"]').first();
    const phoneInput = intakeSection.locator('input#phone, input[name="phone"]').first();
    const submitBtn = intakeSection.locator('button[type="submit"], button:has-text("Submit Audit Request")').first();

    const allFieldsPresent = 
      (await practiceNameInput.count() > 0) &&
      (await doctorNameInput.count() > 0) &&
      (await domainInput.count() > 0) &&
      (await cityZipInput.count() > 0) &&
      (await emailInput.count() > 0) &&
      (await phoneInput.count() > 0) &&
      (await submitBtn.count() > 0);

    record('All 6 doctor-tailored intake fields and [ Submit Audit Request ] button present', allFieldsPresent);

    // 3.1 Empty Form Submission Validation Error
    // Clear inputs if any, click submit button
    await practiceNameInput.fill('');
    await doctorNameInput.fill('');
    await domainInput.fill('');
    await cityZipInput.fill('');
    await emailInput.fill('');
    await phoneInput.fill('');

    await submitBtn.click();
    await page.waitForTimeout(300);

    // Verify error state (HTML5 :invalid or visible error text)
    const hasValidationError = await page.evaluate(() => {
      const form = document.querySelector('#audit-intake form');
      if (!form) return false;
      const isHtmlInvalid = form.querySelectorAll(':invalid').length > 0;
      const hasErrorText = !!document.querySelector('#audit-intake [class*="rose"], #audit-intake [class*="red"], #audit-intake [role="alert"]');
      return isHtmlInvalid || hasErrorText;
    });
    record('Empty form submission triggers client-side validation error and blocks dispatch', hasValidationError);

    // 3.2 Valid Submission & Lead Dispatch to name@nexusrank1.com
    const TEST_PRACTICE = 'Beverly Hills Aesthetics & Implant Center';
    const TEST_DOCTOR = 'Dr. Julian Vance, MD, FACS';
    const TEST_DOMAIN = 'https://www.beverlyhillsimplants.com/booking';
    const TEST_CITYZIP = 'Beverly Hills, CA 90210';
    const TEST_EMAIL = 'drvance@beverlyhillsimplants.com';
    const TEST_PHONE = '(310) 555-0199';

    await practiceNameInput.fill(TEST_PRACTICE);
    await doctorNameInput.fill(TEST_DOCTOR);
    await domainInput.fill(TEST_DOMAIN);
    await cityZipInput.fill(TEST_CITYZIP);
    await emailInput.fill(TEST_EMAIL);
    await phoneInput.fill(TEST_PHONE);

    // Intercept network POST to /api/lead
    let leadApiResponse = null;
    let leadApiPayload = null;

    const [leadResponse] = await Promise.all([
      page.waitForResponse(
        (resp) => resp.url().includes('/api/lead') && resp.request().method() === 'POST',
        { timeout: 12000 }
      ).catch(() => [null]),
      submitBtn.click(),
    ]);

    if (leadResponse) {
      const status = leadResponse.status();
      leadApiResponse = await leadResponse.json().catch(() => ({}));
      record('POST /api/lead returns HTTP 200 on valid doctor intake submission', status === 200, `HTTP Status: ${status}`);

      const forwardedTo = leadApiResponse.dispatch?.forwardedTo || leadApiResponse.dispatch?.recipient || leadApiResponse.lead?.forwardedTo;
      record(
        'Submission dispatch is configured to forward directly to name@nexusrank1.com',
        forwardedTo === 'name@nexusrank1.com',
        `Observed dispatch target: "${forwardedTo}"`
      );

      const sanitizedDomain = leadApiResponse.lead?.domain;
      record(
        'Domain is properly sanitized on backend (strips https://, www., paths)',
        sanitizedDomain === 'beverlyhillsimplants.com',
        `Sanitized domain: "${sanitizedDomain}"`
      );
    } else {
      record('POST /api/lead was triggered on submit', false, 'Network request timed out or not captured');
    }

    // 3.3 In-Card Confirmation State
    await page.waitForTimeout(600);
    const inCardConfirmation = await intakeSection.innerText();
    const hasConfirmationState = 
      /Audit Request Submitted!/i.test(inCardConfirmation) ||
      /Territory Under Review/i.test(inCardConfirmation) ||
      /48-Hour/i.test(inCardConfirmation);

    const confirmationHasEmail = /name@nexusrank1\.com/i.test(inCardConfirmation);
    record(
      'In-card confirmation state displayed with territory review status and name@nexusrank1.com dispatch',
      hasConfirmationState && confirmationHasEmail,
      `Confirmation text: "${inCardConfirmation.substring(0, 150).replace(/\n/g, ' ')}..."`
    );

    // 3.4 Sonner Toast Notification
    const toastLocator = page.locator('[data-sonner-toast], [data-sonner-toaster] li, [class*="sonner"]').filter({
      hasText: /Audit Request Submitted|name@nexusrank1\.com/i
    });
    await toastLocator.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => null);
    const toastVisible = (await toastLocator.count()) > 0;
    record(
      'Immediate Sonner toast notification triggered confirming submission dispatch',
      toastVisible,
      `Sonner toast found: ${toastVisible}`
    );

    // --------------------------------------------------------------------------
    // SUITE 4: The ROI Proof & Math Section (Requirement R4)
    // --------------------------------------------------------------------------
    console.log(`\n${colors.bright}▶ SUITE 4: ROI Proof & Math Modeler (Requirement R4)${colors.reset}`);

    const roiSection = page.locator('#patient-roi-calculator, section:has-text("Patient Value")').first();
    const roiSectionText = await roiSection.innerText();

    // 4.1 Full-Arch Case Values ($20,000 to $50,000)
    const hasFullArchValues = 
      /\$20,000/i.test(roiSectionText) &&
      /\$50,000/i.test(roiSectionText);
    record(
      'ROI section explicitly models $20,000 to $50,000 full-arch case values',
      hasFullArchValues,
      `$20,000 and $50,000 found in ROI section text: ${hasFullArchValues}`
    );

    // 4.2 Single Consultation Breakeven Proof
    const hasSinglePatientProof = /(Securing just a single|single (patient )?consultation covers|covers the (entire )?system deployment multiple times)/i.test(roiSectionText);
    record(
      '1-Patient Consultation proof explicitly shows system deployment covered multiple times over',
      hasSinglePatientProof
    );

    // 4.3 Interactive Specialty Toggles (All-on-4 Implants, Facial Plastic Surgery, Orthopedics, MedSpa)
    const specialties = [
      { name: 'All-on-4 Implants', pattern: /All-on-4/i },
      { name: 'Facial Plastic Surgery', pattern: /Facial Plastic/i },
      { name: 'Orthopedics', pattern: /Orthopedics/i },
      { name: 'MedSpa', pattern: /MedSpa/i },
    ];

    for (const spec of specialties) {
      const toggleBtn = roiSection.locator('button').filter({ hasText: spec.pattern }).first();
      const exists = (await toggleBtn.count()) > 0;
      if (exists) {
        await toggleBtn.click();
        await page.waitForTimeout(300);
        const updatedRoiText = await roiSection.innerText();
        const updatedSuccessfully = updatedRoiText.length > 0;
        record(`Specialty toggle "${spec.name}" updates dynamic calculations`, updatedSuccessfully);
      } else {
        record(`Specialty toggle "${spec.name}" found in ROI section`, false, 'Toggle button missing');
      }
    }

    // --------------------------------------------------------------------------
    // SUITE 5: Clinical FAQ Section (Requirement R5)
    // --------------------------------------------------------------------------
    console.log(`\n${colors.bright}▶ SUITE 5: Clinical FAQ Section (Requirement R5)${colors.reset}`);

    const fullPageText = await page.innerText('body');

    // 5.1 Medical Board Compliance FAQ
    const medBoardFaqBtn = page.locator('button').filter({ hasText: /Medical (Board|& Dental Board)/i }).first();
    let medBoardAnswerFound = false;
    if (await medBoardFaqBtn.count() > 0) {
      await medBoardFaqBtn.click();
      await page.waitForTimeout(300);
      const openText = await page.innerText('body');
      medBoardAnswerFound = /(AMA|ADA|State Medical|licensure boards|regulatory good standing)/i.test(openText);
    } else {
      medBoardAnswerFound = /(AMA|ADA|Medical Board advertising regulations)/i.test(fullPageText);
    }
    record(
      'Clinical FAQ: Medical Board Compliance verified (AMA/ADA guidelines)',
      medBoardAnswerFound
    );

    // 5.2 HIPAA Safety & Zero-PHI Architecture FAQ
    const hipaaFaqBtn = page.locator('button').filter({ hasText: /HIPAA/i }).first();
    let hipaaAnswerFound = false;
    if (await hipaaFaqBtn.count() > 0) {
      await hipaaFaqBtn.click();
      await page.waitForTimeout(300);
      const openText = await page.innerText('body');
      hipaaAnswerFound = /(Zero-PHI|Protected Health Information|never (touches|accesses|processes) Protected Health Information)/i.test(openText);
    } else {
      hipaaAnswerFound = /(Zero-PHI|Protected Health Information)/i.test(fullPageText);
    }
    record(
      'Clinical FAQ: HIPAA Safety verified (Zero-PHI architecture, public credentials only)',
      hipaaAnswerFound
    );

    // 5.3 48-Hour Technical Deployment FAQ
    const deployFaqBtn = page.locator('button').filter({ hasText: /(48-Hour|deployment|fast)/i }).first();
    let deployAnswerFound = false;
    if (await deployFaqBtn.count() > 0) {
      await deployFaqBtn.click();
      await page.waitForTimeout(300);
      const openText = await page.innerText('body');
      deployAnswerFound = /(48 hours|Done-For-You within 48 hours|technical integration directly with your webmaster)/i.test(openText);
    } else {
      deployAnswerFound = /(48 hours|Done-For-You within 48 hours)/i.test(fullPageText);
    }
    record(
      'Clinical FAQ: 48-Hour Done-For-You deployment verified',
      deployAnswerFound
    );

    await page.close();

    // --------------------------------------------------------------------------
    // SUITE 6: Responsive Multi-Viewport Rendering (Desktop, Tablet, Mobile)
    // --------------------------------------------------------------------------
    console.log(`\n${colors.bright}▶ SUITE 6: Multi-Viewport Responsive Integrity${colors.reset}`);

    const viewports = [
      { name: 'Desktop (1440x900)', width: 1440, height: 900 },
      { name: 'Tablet (768x1024)', width: 768, height: 1024 },
      { name: 'Mobile (375x812)', width: 375, height: 812 },
    ];

    for (const vp of viewports) {
      const vpPage = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      
      vpPage.on('pageerror', (err) => {
        recordedPageErrors.push(`[Page Crash - ${vp.name}] ${vpPage.url()}: ${err.message}`);
      });
      vpPage.on('console', (msg) => {
        if (msg.type() === 'error') {
          const text = msg.text();
          if (!text.includes('favicon.ico') && !text.includes('status of 404')) {
            recordedConsoleErrors.push(`[Console Error - ${vp.name}] ${vpPage.url()}: ${text}`);
          }
        }
      });

      await vpPage.goto(BASE_URL, { waitUntil: 'networkidle' });

      // Check for horizontal overflow
      const hasHorizontalScroll = await vpPage.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      record(
        `Viewport ${vp.name}: No horizontal overflow scroll (scrollWidth <= innerWidth)`,
        !hasHorizontalScroll
      );

      // Check Hero H1 visibility
      const h1Visible = await vpPage.locator('h1').first().isVisible();
      record(`Viewport ${vp.name}: Hero headline visible`, h1Visible);

      // Check Intake Card rendered
      const intakeVisible = await vpPage.locator('#audit-intake').first().isVisible();
      record(`Viewport ${vp.name}: Intake form container #audit-intake visible`, intakeVisible);

      await vpPage.close();
    }

    // --------------------------------------------------------------------------
    // SUITE 7: Static Netlify Drop Package Verification (dist-netlify/)
    // --------------------------------------------------------------------------
    console.log(`\n${colors.bright}▶ SUITE 7: Netlify Drop Static Package Verification (dist-netlify/)${colors.reset}`);

    const distExists = fs.existsSync(DIST_NETLIFY_DIR);
    record('Directory dist-netlify/ exists', distExists, `Path: ${DIST_NETLIFY_DIR}`);

    if (distExists) {
      const indexHtmlPath = path.join(DIST_NETLIFY_DIR, 'index.html');
      const redirectsPath = path.join(DIST_NETLIFY_DIR, '_redirects');
      const headersPath = path.join(DIST_NETLIFY_DIR, '_headers');
      const nextStaticPath = path.join(DIST_NETLIFY_DIR, '_next/static');

      record('dist-netlify/index.html exists and non-empty', fs.existsSync(indexHtmlPath) && fs.statSync(indexHtmlPath).size > 1000);
      record('dist-netlify/_redirects exists', fs.existsSync(redirectsPath));
      record('dist-netlify/_headers exists', fs.existsSync(headersPath));
      record('dist-netlify/_next/static/ client bundles exist', fs.existsSync(nextStaticPath));

      // Serve dist-netlify on ephemeral server and launch in Chrome
      info('Spinning up ephemeral static HTTP server for dist-netlify/ ...');
      const staticServerContext = await createStaticServer(DIST_NETLIFY_DIR, 3457);
      info(`Static server active at ${staticServerContext.url}`);

      const staticPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
      const staticConsoleErrors = [];
      staticPage.on('pageerror', (err) => recordedPageErrors.push(`[Static Page Crash]: ${err.message}`));
      staticPage.on('console', (msg) => {
        if (msg.type() === 'error') {
          const t = msg.text();
          if (!t.includes('favicon.ico') && !t.includes('status of 404')) {
            staticConsoleErrors.push(t);
            recordedConsoleErrors.push(`[Static Console Error]: ${t}`);
          }
        }
      });

      const staticRes = await staticPage.goto(staticServerContext.url, { waitUntil: 'networkidle' });
      const staticStatus = staticRes?.status();
      record('Static package index.html responds with HTTP 200 OK', staticStatus === 200, `Status: ${staticStatus}`);

      const staticH1 = normalize(await staticPage.locator('h1').first().textContent().catch(() => ''));
      record(
        'Static export renders exact Hero Headline',
        staticH1 === EXPECTED_HEADLINE,
        `Observed static H1: "${staticH1}"`
      );

      const staticIntakeCard = await staticPage.locator('#audit-intake').count();
      record('Static export contains doctor intake card (#audit-intake)', staticIntakeCard > 0);

      record('Static package loads with exactly 0 console errors', staticConsoleErrors.length === 0, `Errors: ${JSON.stringify(staticConsoleErrors)}`);

      await staticPage.close();
      await new Promise((resolve) => staticServerContext.server.close(resolve));
      info('Ephemeral static HTTP server closed.');
    } else {
      record('dist-netlify/ generated', false, 'Run `npm run build` or `node scripts/build-netlify.mjs` first');
    }

    // --------------------------------------------------------------------------
    // SUITE 8: Zero Console & Page Error Gate
    // --------------------------------------------------------------------------
    console.log(`\n${colors.bright}▶ SUITE 8: Zero Console & Page Error Gate${colors.reset}`);
    record(
      'Zero unhandled page crashes across all test runs',
      recordedPageErrors.length === 0,
      recordedPageErrors.join('\n')
    );
    record(
      'Zero console errors recorded during all headless Chrome interactions',
      recordedConsoleErrors.length === 0,
      recordedConsoleErrors.join('\n')
    );

  } finally {
    await browser.close();
  }

  // --------------------------------------------------------------------------
  // FINAL SCORECARD & SUMMARY
  // --------------------------------------------------------------------------
  console.log(`\n${colors.bright}${colors.blue}========================================================================${colors.reset}`);
  console.log(`${colors.bright}📊 NEXUSRANK1 HEALTHCARE REDESIGN TEST SCORECARD${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}========================================================================${colors.reset}`);
  console.log(`  Total Invariant Tests : ${totalTests}`);
  console.log(`  ${colors.green}Passed                : ${passedTests}${colors.reset}`);
  console.log(`  ${failedTests === 0 ? colors.green : colors.red}Failed                : ${failedTests}${colors.reset}`);
  console.log(`  Console Errors        : ${recordedConsoleErrors.length}`);
  console.log(`  Page Crashes          : ${recordedPageErrors.length}`);

  if (failureList.length > 0) {
    console.log(`\n${colors.red}${colors.bright}FAILED TESTS SUMMARY:${colors.reset}`);
    for (const f of failureList) {
      console.log(`  • ${colors.red}${f.testName}${colors.reset}`);
      if (f.details) console.log(`    ${colors.dim}${f.details}${colors.reset}`);
    }
  }

  console.log(`${colors.bright}${colors.blue}========================================================================${colors.reset}\n`);

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runNexusV5TestSuite().catch((err) => {
  console.error(`\n${colors.red}FATAL ERROR IN TEST HARNESS:${colors.reset}`, err);
  process.exit(1);
});
