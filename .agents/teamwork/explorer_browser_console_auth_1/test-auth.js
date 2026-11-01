const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'auth-test.log');
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
  log('Starting Auth Flow (Login & Signup) Test Suite');

  const browser = await chromium.launch({
    executablePath: '/run/current-system/sw/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
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
    if (res.status() >= 400 && !res.url().includes('/api/auth')) {
      networkErrors.push({ url: res.url(), status: res.status() });
      log(`UNEXPECTED HTTP ERROR ${res.status()} on ${res.url()}`);
    }
  });

  try {
    // =========================================================================
    // 1. TEST LOGIN PAGE (http://localhost:3000/login)
    // =========================================================================
    log('--- Testing /login ---');
    const loginRes = await page.goto('http://localhost:3000/login', {
      waitUntil: 'networkidle',
      timeout: 15000,
    });

    log(`/login HTTP Status: ${loginRes.status()}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '16_login_page_initial.png') });

    // Verify Title and Subtitle
    const loginHeading = await page.locator('h1').innerText();
    log(`Login H1: "${loginHeading}"`);

    // Verify Input & Button Presence
    const passcodeInput = page.locator('input[type="password"]');
    const submitBtn = page.locator('button[type="submit"]');
    log(`Passcode input visible: ${await passcodeInput.isVisible()}`);
    log(`Submit button visible: ${await submitBtn.isVisible()}`);
    log(`Submit button text: "${await submitBtn.innerText()}"`);

    // Test Case 1.1: Empty Passcode Submission
    log('Test Case 1.1: Empty passcode submission');
    await submitBtn.click();
    await page.waitForTimeout(300);
    const emptyErrorMsg = await page.locator('.text-rose-400').first().innerText();
    log(`Error on empty input: "${emptyErrorMsg}"`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '17_login_empty_error.png') });

    // Test Case 1.2: Invalid Passcode Submission
    log('Test Case 1.2: Invalid passcode submission ("invalidpass999")');
    await passcodeInput.fill('invalidpass999');
    await submitBtn.click();
    await page.waitForTimeout(600);
    const invalidErrorMsg = await page.locator('.text-rose-400').first().innerText();
    log(`Error on invalid input: "${invalidErrorMsg}"`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '18_login_invalid_error.png') });

    // Test Case 1.3: Whop checkout link on /login
    const whopLinks = await page.locator('a[href*="whop.com"]').all();
    log(`Found ${whopLinks.length} Whop links on /login`);
    for (let i = 0; i < whopLinks.length; i++) {
      const href = await whopLinks[i].getAttribute('href');
      log(`Whop link #${i + 1} href: "${href}"`);
    }

    // Test Case 1.4: Navigation to /signup check
    const signupLinks = await page.locator('a[href*="signup"]').all();
    log(`Links to /signup on /login page: ${signupLinks.length}`);
    if (signupLinks.length === 0) {
      log('DEFECT DETECTED: No navigation link to /signup found on /login page.');
    }

    // Test Case 1.5: Valid Passcode Submission ('nexus2026' or 'velogeo2026')
    log('Test Case 1.5: Valid passcode submission ("nexus2026")');
    await passcodeInput.fill('nexus2026');
    await submitBtn.click();
    await page.waitForURL('**/partner-console', { timeout: 8000 });
    log(`Successfully redirected after valid login to: ${page.url()}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '19_login_success_redirect.png') });

    // =========================================================================
    // 2. TEST SIGNUP PAGE (http://localhost:3000/signup)
    // =========================================================================
    log('--- Testing /signup ---');
    const signupRes = await page.goto('http://localhost:3000/signup', {
      waitUntil: 'networkidle',
      timeout: 15000,
    });

    log(`/signup HTTP Status: ${signupRes.status()}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '20_signup_page_initial.png') });

    // Verify Title and Subtitle
    const signupHeading = await page.locator('h1').innerText();
    log(`Signup H1: "${signupHeading}"`);

    // Verify Form Fields
    const clinicNameField = page.locator('input[placeholder*="Dallas Center"]');
    const specialtyField = page.locator('input[placeholder*="Orthopedic Surgery"]');
    const zipCodeField = page.locator('input[placeholder="75001"]');
    const phoneField = page.locator('input[placeholder="(555) 234-5678"]');
    const emailField = page.locator('input[placeholder="director@clinic.com"]');
    const signupSubmitBtn = page.locator('button[type="submit"]:has-text("Launch Clinic Command Center")');

    log(`Form Fields visible: ClinicName=${await clinicNameField.isVisible()}, Specialty=${await specialtyField.isVisible()}, Zip=${await zipCodeField.isVisible()}, Phone=${await phoneField.isVisible()}, Email=${await emailField.isVisible()}`);

    // Check Role Selection
    const roleSelectors = await page.locator('select, input[type="radio"], [role="radiogroup"], button:has-text("Doctor"), button:has-text("Manager"), button:has-text("Role")').all();
    log(`Role selector elements found: ${roleSelectors.length}`);
    if (roleSelectors.length === 0) {
      log('DEFECT / OBSERVATION: No explicit role selection element (e.g., Solo Owner/Doctor vs Practice Manager vs Marketer) on /signup page.');
    }

    // Check Navigation to /login
    const loginNavLinks = await page.locator('a[href*="login"]').all();
    log(`Links to /login on /signup page: ${loginNavLinks.length}`);
    if (loginNavLinks.length === 0) {
      log('DEFECT / OBSERVATION: No navigation link back to /login found on /signup page.');
    }

    // Test Demo Preset Auto-Fill
    log('Testing "Quick Demo Practice Auto-Fill" button...');
    const presetBtn = page.locator('button:has-text("Load Preset")');
    await presetBtn.click();
    await page.waitForTimeout(200);

    const filledClinicName = await clinicNameField.inputValue();
    const filledEmail = await emailField.inputValue();
    const filledPhone = await phoneField.inputValue();
    const filledZip = await zipCodeField.inputValue();
    const filledSpecialty = await specialtyField.inputValue();

    log(`Preset Loaded Values: clinicName="${filledClinicName}", email="${filledEmail}", phone="${filledPhone}", zip="${filledZip}", specialty="${filledSpecialty}"`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '21_signup_preset_loaded.png') });

    // Test Form Validation on Empty Required Input
    log('Testing empty required field validation...');
    await clinicNameField.fill('');
    await signupSubmitBtn.click();
    await page.waitForTimeout(300);
    // Should still be on /signup because HTML5 required attribute blocks submission
    log(`URL after clicking submit with empty clinicName: ${page.url()} (should still be /signup)`);

    // Fill valid data and test submission
    log('Filling custom practice registration data and submitting...');
    await clinicNameField.fill('Newport Beach Implant Institute');
    await specialtyField.fill('Full Arch Surgical Implants');
    await zipCodeField.fill('92660');
    await phoneField.fill('(949) 555-0188');
    await emailField.fill('dr.vance@newportimplant.com');

    await signupSubmitBtn.click();
    // Check loading text
    await page.waitForTimeout(100);
    const loadingText = await page.locator('text=Initializing Practice Command Center...').first().isVisible();
    log(`Submit loading state visible: ${loadingText}`);

    // Wait for redirect to /partner-console
    await page.waitForURL('**/partner-console', { timeout: 8000 });
    log(`Signup redirected successfully to: ${page.url()}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '22_signup_success_redirect.png') });

    // Check localStorage practiceConfig
    const storedPracticeConfig = await page.evaluate(() => localStorage.getItem('practiceConfig'));
    const storedAuth = await page.evaluate(() => localStorage.getItem('authenticated'));
    log(`Stored localStorage practiceConfig: ${storedPracticeConfig}`);
    log(`Stored localStorage authenticated: ${storedAuth}`);

    // Check Whop checkout link on /signup
    await page.goto('http://localhost:3000/signup');
    const signupWhopLinks = await page.locator('a[href*="whop.com"]').all();
    log(`Found ${signupWhopLinks.length} Whop links on /signup`);
    for (let i = 0; i < signupWhopLinks.length; i++) {
      const href = await signupWhopLinks[i].getAttribute('href');
      log(`Signup Whop link #${i + 1} href: "${href}"`);
    }

    log('=== Auth Flow Test Completed Successfully ===');
  } catch (err) {
    log(`FATAL ERROR IN AUTH TEST: ${err.message}\n${err.stack}`);
  } finally {
    log(`Summary: ${consoleErrors.length} console errors, ${networkErrors.length} unexpected network errors.`);
    await browser.close();
  }
}

run();
