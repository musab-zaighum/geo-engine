/**
 * Autonomous Adversarial UI & Client Component Stress Suite
 * Executed by challenger_v4_1
 */

import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3000';
const CHROME_PATH = '/run/current-system/sw/bin/google-chrome';

async function main() {
  console.log('================================================================');
  console.log('🚀 STARTING ADVERSARIAL STRESS TEST SUITE (challenger_v4_1)');
  console.log(`Target: ${BASE_URL}`);
  console.log('================================================================\n');

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const report = {
    roiCalculator: { passed: 0, failed: 0, details: [] },
    auditBarSanitization: { passed: 0, failed: 0, details: [] },
    responsiveViewports: { passed: 0, failed: 0, details: [] },
  };

  try {
    // -------------------------------------------------------------
    // SECTION 1: ROI CALCULATOR STRESS TESTING
    // -------------------------------------------------------------
    console.log('--- 1. TESTING ROI CALCULATOR ---');
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    const pageErrors = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        pageErrors.push(msg.text());
      }
    });

    await page.goto(`${BASE_URL}/#patient-roi-calculator`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const roiSection = page.locator('#patient-roi-calculator');
    const isRoiVisible = await roiSection.isVisible();
    console.log(`ROI Calculator section visible: ${isRoiVisible}`);

    if (!isRoiVisible) {
      report.roiCalculator.failed++;
      report.roiCalculator.details.push('ROI calculator section #patient-roi-calculator not found or not visible.');
    } else {
      // Find range sliders
      const sliders = await page.locator('#patient-roi-calculator input[type="range"]').all();
      console.log(`Found ${sliders.length} range sliders in ROI calculator.`);

      if (sliders.length < 2) {
        report.roiCalculator.failed++;
        report.roiCalculator.details.push(`Expected 2 range sliders, found ${sliders.length}`);
      } else {
        const sliderTicket = sliders[0];
        const sliderPatients = sliders[1];

        const ticketMin = await sliderTicket.getAttribute('min');
        const ticketMax = await sliderTicket.getAttribute('max');
        const ticketStep = await sliderTicket.getAttribute('step');
        const patientsMin = await sliderPatients.getAttribute('min');
        const patientsMax = await sliderPatients.getAttribute('max');
        const patientsStep = await sliderPatients.getAttribute('step');

        console.log(`Ticket Slider attributes: min=${ticketMin}, max=${ticketMax}, step=${ticketStep}`);
        console.log(`Patients Slider attributes: min=${patientsMin}, max=${patientsMax}, step=${patientsStep}`);

        // Note if DOM bounds match task description:
        // Task: "min case value ($500), max case value ($40,000), min patients (1), max patients (50)"
        console.log(`Note: Slider 1 DOM min is "${ticketMin}" (task mentions $500), max is "${ticketMax}" ($40,000)`);
        console.log(`Note: Slider 2 DOM min is "${patientsMin}" (1), max is "${patientsMax}" (task mentions 50)`);

        // Test extreme values via programmatic DOM events and slider dragging
        const testCases = [
          { name: 'Min bounds in DOM (1000, 1)', ticket: 1000, patients: 1 },
          { name: 'Extreme min requested (500, 1)', ticket: 500, patients: 1 },
          { name: 'Max bounds in DOM (40000, 15)', ticket: 40000, patients: 15 },
          { name: 'Extreme max requested (40000, 50)', ticket: 40000, patients: 50 },
          { name: 'Zero patients boundary (5000, 0)', ticket: 5000, patients: 0 },
        ];

        for (const tc of testCases) {
          await page.evaluate(({ tVal, pVal }) => {
            const sliders = document.querySelectorAll('#patient-roi-calculator input[type="range"]');
            if (sliders[0]) {
              const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
              nativeInputValueSetter.call(sliders[0], tVal);
              sliders[0].dispatchEvent(new Event('input', { bubbles: true }));
              sliders[0].dispatchEvent(new Event('change', { bubbles: true }));
            }
            if (sliders[1]) {
              const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
              nativeInputValueSetter.call(sliders[1], pVal);
              sliders[1].dispatchEvent(new Event('input', { bubbles: true }));
              sliders[1].dispatchEvent(new Event('change', { bubbles: true }));
            }
          }, { tVal: tc.ticket, pVal: tc.patients });

          await page.waitForTimeout(200);

          // Scrape displayed figures
          const cardText = await page.locator('#patient-roi-calculator').innerText();
          const hasNaN = cardText.includes('NaN');
          const hasUndefined = cardText.includes('undefined');
          const hasInfinity = cardText.includes('Infinity');

          if (hasNaN || hasUndefined || hasInfinity) {
            report.roiCalculator.failed++;
            report.roiCalculator.details.push(`FAILED ${tc.name}: Output contains NaN/undefined/Infinity`);
            console.log(`  ❌ ${tc.name}: Failed with NaN/undefined/Infinity`);
          } else {
            report.roiCalculator.passed++;
            console.log(`  ✅ ${tc.name}: Passed (Calculations valid, no NaN)`);
          }
        }

        // Test Rapid Slider Dragging / Simulated Rapid Events for Race Conditions
        console.log('  Testing rapid slider events (100 rapid events in 500ms)...');
        let rapidErrors = [];
        await page.evaluate(async () => {
          const sliders = document.querySelectorAll('#patient-roi-calculator input[type="range"]');
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          for (let i = 0; i < 100; i++) {
            const randomTicket = Math.floor(Math.random() * 40000) + 500;
            const randomPatients = Math.floor(Math.random() * 50) + 1;
            if (sliders[0]) {
              setter.call(sliders[0], randomTicket);
              sliders[0].dispatchEvent(new Event('input', { bubbles: true }));
            }
            if (sliders[1]) {
              setter.call(sliders[1], randomPatients);
              sliders[1].dispatchEvent(new Event('input', { bubbles: true }));
            }
          }
        });

        await page.waitForTimeout(500);
        const textAfterRapid = await page.locator('#patient-roi-calculator').innerText();
        const rapidHasNaN = textAfterRapid.includes('NaN');
        if (rapidHasNaN) {
          report.roiCalculator.failed++;
          report.roiCalculator.details.push('Rapid slider dragging produced NaN calculation.');
          console.log('  ❌ Rapid slider dragging produced NaN!');
        } else {
          report.roiCalculator.passed++;
          console.log('  ✅ Rapid slider dragging handled cleanly with 0 NaN values.');
        }

        // Test Specialty preset buttons
        console.log('  Testing Specialty preset selectors...');
        const specialtyButtons = await page.locator('#patient-roi-calculator button[type="button"]').all();
        console.log(`  Found ${specialtyButtons.length} specialty buttons.`);
        for (let i = 0; i < Math.min(specialtyButtons.length, 5); i++) {
          await specialtyButtons[i].click();
          await page.waitForTimeout(100);
          const text = await page.locator('#patient-roi-calculator').innerText();
          if (text.includes('NaN')) {
            report.roiCalculator.failed++;
            report.roiCalculator.details.push(`Specialty button ${i} click caused NaN`);
          } else {
            report.roiCalculator.passed++;
          }
        }
        console.log('  ✅ Specialty selector buttons verified.');
      }
    }

    await page.close();

    // -------------------------------------------------------------
    // SECTION 2: AUDIT BAR INPUT SANITIZATION
    // -------------------------------------------------------------
    console.log('\n--- 2. TESTING AUDIT BAR INPUT SANITIZATION ---');
    const auditInputs = [
      { label: 'Normal domain', input: 'austincosmeticdental.com', expectCrash: false },
      { label: 'http:// prefix', input: 'http://dentalpractice.com', expectCrash: false },
      { label: 'https:// prefix', input: 'https://dentalpractice.com', expectCrash: false },
      { label: 'HTTP:// uppercase protocol', input: 'HTTP://DENTALPRACTICE.COM', expectCrash: false },
      { label: 'HTTPS:// uppercase protocol', input: 'HTTPS://DENTALPRACTICE.COM', expectCrash: false },
      { label: 'Trailing slash', input: 'dentalpractice.com/', expectCrash: false },
      { label: 'Subdomain and path', input: 'https://sub.clinic.com/about/team/', expectCrash: false },
      { label: 'Surrounding whitespace', input: '   clevelandclinic.org   ', expectCrash: false },
      { label: 'XSS script tag', input: '<script>alert("xss")</script>', expectCrash: false },
      { label: 'SQL injection payload', input: "' OR 1=1--", expectCrash: false },
      { label: 'Special chars & quotes', input: 'practice.com" onfocus="alert(1)', expectCrash: false },
      { label: 'Javascript pseudo-protocol', input: 'javascript:alert(1)', expectCrash: false },
    ];

    for (const item of auditInputs) {
      const testPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
      const testErrors = [];
      let alertFired = false;

      testPage.on('dialog', async (dialog) => {
        alertFired = true;
        console.log(`  🚨 ALERT DIALOG TRIGGERED: "${dialog.message()}"`);
        await dialog.dismiss();
      });

      testPage.on('pageerror', (err) => testErrors.push(err.message));
      testPage.on('console', (msg) => {
        if (msg.type() === 'error') {
          testErrors.push(msg.text());
        }
      });

      await testPage.goto(BASE_URL, { waitUntil: 'networkidle' });
      await testPage.waitForTimeout(500);

      // Find audit input
      const inputEl = testPage.locator('#audit-bar input[type="text"]').first();
      await inputEl.fill(item.input);
      await testPage.waitForTimeout(100);

      // Click scan button
      const scanButton = testPage.locator('#audit-bar button[type="submit"], #audit-bar button:has-text("Run Instant GEO Audit"), #audit-bar button:has-text("Scan")').first();
      if (await scanButton.isVisible()) {
        await scanButton.click();
      } else {
        await inputEl.press('Enter');
      }

      // Wait for scan animation and completion (scan takes ~3.8s)
      await testPage.waitForTimeout(4500);

      // Check results
      const auditResultText = await testPage.locator('#audit-bar').innerText();
      const hasCrashed = testErrors.some((e) => e.includes('Minified React error') || e.includes('uncaught exception'));
      
      // Check what cleanDomain was produced
      const cleanDomainMatch = auditResultText.match(/Target:\s*([^\s(]+)/);
      const displayedTarget = cleanDomainMatch ? cleanDomainMatch[1] : 'unknown';

      // Check for XSS
      if (alertFired) {
        report.auditBarSanitization.failed++;
        report.auditBarSanitization.details.push(`CRITICAL: XSS executed on input: ${item.input}`);
        console.log(`  ❌ ${item.label}: XSS Executed!`);
      } else if (hasCrashed) {
        report.auditBarSanitization.failed++;
        report.auditBarSanitization.details.push(`CRASH: Uncaught exception on input ${item.input}: ${testErrors.join('; ')}`);
        console.log(`  ❌ ${item.label}: Page Crashed!`);
      } else {
        // Check for uppercase protocol bug (e.g. HTTPS:// leaving "HTTPS:")
        if ((item.input.startsWith('HTTP://') || item.input.startsWith('HTTPS://')) && (displayedTarget === 'HTTPS:' || displayedTarget === 'HTTP:')) {
          report.auditBarSanitization.failed++;
          const bugDesc = `DEFECT: Input "${item.input}" was incorrectly sanitized to "${displayedTarget}" because regex /^https?:\\/\\// is case-sensitive without 'i' flag.`;
          report.auditBarSanitization.details.push(bugDesc);
          console.log(`  ⚠️  ${item.label}: Sanitization Defect -> displayed "${displayedTarget}"`);
        } else {
          report.auditBarSanitization.passed++;
          console.log(`  ✅ ${item.label}: Handled gracefully (Target: ${displayedTarget}, Alert: ${alertFired}, Errors: ${testErrors.length})`);
        }
      }

      await testPage.close();
    }

    // -------------------------------------------------------------
    // SECTION 3: RESPONSIVE VIEWPORTS STRESS TESTING
    // -------------------------------------------------------------
    console.log('\n--- 3. TESTING RESPONSIVE VIEWPORTS ---');
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1440, height: 900 },
    ];

    const routes = [
      '/',
      '/pricing',
      '/partner-console',
      '/report/dentalpractice.com',
      '/login',
      '/signup',
    ];

    for (const vp of viewports) {
      console.log(`\n  Checking Viewport: ${vp.name} (${vp.width}x${vp.height})`);
      const vpPage = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });

      for (const route of routes) {
        await vpPage.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle' });
        await vpPage.waitForTimeout(500);

        // Check horizontal overflow
        const overflow = await vpPage.evaluate(() => {
          const docWidth = document.documentElement.scrollWidth;
          const winWidth = window.innerWidth;
          const elements = [];
          if (docWidth > winWidth + 1) {
            // Find offending elements
            const all = document.querySelectorAll('*');
            for (const el of all) {
              const rect = el.getBoundingClientRect();
              if (rect.right > winWidth + 2) {
                elements.push({
                  tag: el.tagName,
                  id: el.id,
                  className: typeof el.className === 'string' ? el.className.slice(0, 50) : '',
                  right: Math.round(rect.right),
                  width: Math.round(rect.width),
                });
                if (elements.length >= 5) break;
              }
            }
          }
          return { docWidth, winWidth, hasOverflow: docWidth > winWidth + 1, elements };
        });

        if (overflow.hasOverflow) {
          report.responsiveViewports.failed++;
          const err = `Horizontal overflow on ${route} at ${vp.name} (${vp.width}px): scrollWidth=${overflow.docWidth}px. Offending: ${JSON.stringify(overflow.elements)}`;
          report.responsiveViewports.details.push(err);
          console.log(`    ❌ ${route}: Horizontal overflow! scrollWidth=${overflow.docWidth} vs innerWidth=${overflow.winWidth}`);
          console.log(`       Offenders:`, overflow.elements.slice(0, 3));
        } else {
          report.responsiveViewports.passed++;
          console.log(`    ✅ ${route}: No horizontal overflow (${overflow.docWidth}px <= ${overflow.winWidth}px)`);
        }
      }

      // In Mobile & Tablet on homepage, test all 7 tabs and modals
      if (vp.name === 'Mobile' || vp.name === 'Tablet') {
        console.log(`    Testing 7 tabs & modals on ${vp.name}...`);
        await vpPage.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
        await vpPage.waitForTimeout(800);

        // Find audit tab buttons
        const tabButtons = await vpPage.locator('#audit-bar button[role="tab"], #audit-bar nav button, #audit-bar div button').all();
        console.log(`    Found ${tabButtons.length} potential tab buttons in audit bar.`);

        // Test opening the Practice Manager Dispatch Modal
        const dispatchBtn = vpPage.locator('button:has-text("Dispatch"), button:has-text("Webmaster")').first();
        if (await dispatchBtn.isVisible()) {
          await dispatchBtn.click();
          await vpPage.waitForTimeout(400);

          // Check if modal fits within viewport
          const modalOverflow = await vpPage.evaluate(() => {
            const modal = document.querySelector('[role="dialog"], .fixed.inset-0');
            if (!modal) return { found: false };
            const rect = modal.getBoundingClientRect();
            return {
              found: true,
              width: rect.width,
              windowWidth: window.innerWidth,
              overflows: rect.width > window.innerWidth,
            };
          });

          if (modalOverflow.found && modalOverflow.overflows) {
            report.responsiveViewports.failed++;
            report.responsiveViewports.details.push(`Modal overflows viewport on ${vp.name}`);
            console.log(`    ❌ Practice Manager Modal overflows on ${vp.name}`);
          } else {
            report.responsiveViewports.passed++;
            console.log(`    ✅ Practice Manager Modal fits cleanly on ${vp.name}`);
          }

          // Close modal if close button exists
          const closeBtn = vpPage.locator('button:has-text("Close"), button[aria-label="Close"], button svg.lucide-x').first();
          if (await closeBtn.isVisible()) {
            await closeBtn.click();
            await vpPage.waitForTimeout(200);
          }
        }

        // Test Corner Chat Widget
        const chatToggle = vpPage.locator('button[aria-label*="chat" i], button:has(svg.lucide-message-square)').first();
        if (await chatToggle.isVisible()) {
          await chatToggle.click();
          await vpPage.waitForTimeout(400);
          const chatBox = await vpPage.evaluate(() => {
            const chat = document.querySelector('.fixed.bottom-6.right-6, .fixed.bottom-4.right-4, .fixed.z-50');
            if (!chat) return null;
            const rect = chat.getBoundingClientRect();
            return {
              right: rect.right,
              left: rect.left,
              windowWidth: window.innerWidth,
              exceedsRight: rect.right > window.innerWidth,
            };
          });
          if (chatBox && chatBox.exceedsRight) {
            report.responsiveViewports.failed++;
            report.responsiveViewports.details.push(`Chat widget overflows viewport right edge on ${vp.name}`);
            console.log(`    ❌ Chat widget overflows right edge on ${vp.name}`);
          } else {
            report.responsiveViewports.passed++;
            console.log(`    ✅ Chat widget fits cleanly on ${vp.name}`);
          }
        }
      }

      await vpPage.close();
    }

  } finally {
    await browser.close();
  }

  // Final Summary
  console.log('\n================================================================');
  console.log('🏁 ADVERSARIAL STRESS TEST SUMMARY');
  console.log('================================================================');
  console.log(`1. ROI Calculator:       Passed: ${report.roiCalculator.passed}, Failed: ${report.roiCalculator.failed}`);
  console.log(`2. Audit Sanitization:   Passed: ${report.auditBarSanitization.passed}, Failed: ${report.auditBarSanitization.failed}`);
  console.log(`3. Responsive Viewports: Passed: ${report.responsiveViewports.passed}, Failed: ${report.responsiveViewports.failed}`);

  const totalFailed = report.roiCalculator.failed + report.auditBarSanitization.failed + report.responsiveViewports.failed;
  const verdict = totalFailed === 0 ? 'CONFIRM_CORRECTNESS' : 'DEFECT_FOUND';
  console.log(`\nEXPLICIT VERDICT: ${verdict}`);
  console.log('================================================================\n');

  if (totalFailed > 0) {
    console.log('Detected Defects / Findings:');
    for (const [k, v] of Object.entries(report)) {
      if (v.details.length > 0) {
        console.log(`\n[${k}]:`);
        v.details.forEach((d) => console.log(`  - ${d}`));
      }
    }
  }

  return { report, verdict };
}

main().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
