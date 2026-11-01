const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = path.join(__dirname, 'screenshots');
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

function parseCurrency(str) {
  if (!str) return 0;
  const match = str.replace(/,/g, '').match(/-?\$?(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

async function extractCalculatorValues(calc) {
  const ticketText = await calc.locator('div:has(> div > span:has-text("Average Procedure / Case Value")) > span').innerText();
  const patientText = await calc.locator('div:has(> div > span:has-text("Expected New AI Search Patients / Month")) > span').innerText();
  const monthlyText = await calc.locator('div:has(> span:has-text("Monthly Revenue Lift")) > span.font-mono').innerText();
  const annualText = await calc.locator('div:has(> span:has-text("Annual Gross Production")) > span.font-mono').innerText();
  const investText = await calc.locator('div:has(> span:has-text("One-Time System Investment")) > span.font-mono').innerText();
  const netProfitText = await calc.locator('span.text-3xl.font-black.text-emerald-400.font-mono').innerText();
  const roiText = await calc.locator('div.text-4xl.font-black.font-mono').innerText();
  const coveredText = await calc.locator('span:has-text("x System Cost in 1 Patient")').innerText();
  const sliderTicketVal = await calc.locator('input[type="range"]').first().inputValue();
  const sliderPatientVal = await calc.locator('input[type="range"]').nth(1).inputValue();

  return {
    ticketText,
    patientText,
    monthlyText,
    annualText,
    investText,
    netProfitText,
    roiText,
    coveredText,
    avgTicket: parseCurrency(ticketText),
    patientsPerMonth: parseInt(patientText.replace(/[^0-9]/g, ''), 10),
    monthlyGross: parseCurrency(monthlyText),
    annualGross: parseCurrency(annualText),
    systemCost: parseCurrency(investText),
    netProfit: parseCurrency(netProfitText),
    roiPercent: parseCurrency(roiText),
    timesCoveredByOnePatient: coveredText.replace(/x System Cost in 1 Patient/i, '').trim(),
    sliderTicketVal: parseInt(sliderTicketVal, 10),
    sliderPatientVal: parseInt(sliderPatientVal, 10),
  };
}

async function runRoiCalculatorTests() {
  console.log('=== Starting Exhaustive Patient ROI Calculator Tests ===');
  const browser = await chromium.launch({
    executablePath: '/run/current-system/sw/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  const results = {
    timestamp: new Date().toISOString(),
    specialtyTests: [],
    sliderMatrixTests: [],
    ctaTest: {},
    consoleErrors
  };

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    const calculator = page.locator('#patient-roi-calculator');
    await calculator.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'roi_calc_01_initial.png') });

    // 1. Test Specialties
    console.log('\n--- 1. Testing Specialty Selector Buttons ---');
    const specialties = [
      { id: 'dental', name: 'Cosmetic & Restorative Dentistry', defaultTicket: 4500, expectedCovered: '3.0' },
      { id: 'aesthetics', name: 'MedSpa & Facial Aesthetics', defaultTicket: 2800, expectedCovered: '1.9' },
      { id: 'plastic', name: 'Plastic & Cosmetic Surgery', defaultTicket: 11500, expectedCovered: '7.7' },
      { id: 'ortho', name: 'Orthopedics & Spine Medicine', defaultTicket: 8500, expectedCovered: '5.7' },
      { id: 'derm', name: 'Dermatology & Skin Surgery', defaultTicket: 3200, expectedCovered: '2.1' },
    ];

    for (const spec of specialties) {
      const btn = calculator.locator(`button:has-text("${spec.name}")`);
      await btn.click();
      await page.waitForTimeout(150);

      const data = await extractCalculatorValues(calculator);

      const expectedMonthly = 3 * spec.defaultTicket;
      const expectedAnnual = expectedMonthly * 12;
      const expectedNet = expectedAnnual - 1500;
      const expectedRoiPercent = Math.round(((expectedAnnual - 1500) / 1500) * 100);
      const expectedCovered = (spec.defaultTicket / 1500).toFixed(1);

      const passed = (
        data.avgTicket === spec.defaultTicket &&
        data.sliderTicketVal === spec.defaultTicket &&
        data.patientsPerMonth === 3 &&
        data.monthlyGross === expectedMonthly &&
        data.annualGross === expectedAnnual &&
        data.netProfit === expectedNet &&
        data.roiPercent === expectedRoiPercent &&
        data.timesCoveredByOnePatient === expectedCovered
      );

      console.log(`Specialty: "${spec.name}" -> Ticket: $${data.avgTicket} | Monthly: $${data.monthlyGross} (Exp: $${expectedMonthly}) | Annual: $${data.annualGross} (Exp: $${expectedAnnual}) | Net: $${data.netProfit} (Exp: $${expectedNet}) | ROI: ${data.roiPercent}% | Covered: ${data.timesCoveredByOnePatient}x | ${passed ? '✓ PASS' : '✗ FAIL'}`);

      results.specialtyTests.push({
        specialty: spec.name,
        expected: { ticket: spec.defaultTicket, monthly: expectedMonthly, annual: expectedAnnual, net: expectedNet, roiPercent: expectedRoiPercent, timesCovered: expectedCovered },
        actual: data,
        passed
      });

      await page.screenshot({ path: path.join(ARTIFACT_DIR, `roi_specialty_${spec.id}.png`) });
    }

    // 2. Comprehensive Slider Matrix (Min, Mid, Max and step testing)
    console.log('\n--- 2. Testing Sliders Across Multiple Combinations ---');
    const ticketSlider = calculator.locator('input[type="range"]').nth(0);
    const patientSlider = calculator.locator('input[type="range"]').nth(1);

    const testGrid = [
      { ticket: 1000, patients: 1, label: 'Min Boundary: $1,000 ticket, 1 patient' },
      { ticket: 1000, patients: 15, label: 'Min Ticket $1,000, Max Patients 15' },
      { ticket: 7500, patients: 8, label: 'Mid Boundary: $7,500 ticket, 8 patients' },
      { ticket: 15000, patients: 1, label: 'Max Ticket $15,000, Min Patient 1' },
      { ticket: 15000, patients: 15, label: 'Max Boundary: $15,000 ticket, 15 patients' },
      { ticket: 2500, patients: 2, label: 'Low MedSpa ($2,500), 2 patients' },
      { ticket: 4500, patients: 4, label: 'Standard Implant ($4,500), 4 patients' },
      { ticket: 9000, patients: 6, label: 'Veneers / Facelift ($9,000), 6 patients' },
      { ticket: 12000, patients: 10, label: 'Full Arch / Complex Ortho ($12,000), 10 patients' }
    ];

    for (const testCase of testGrid) {
      await ticketSlider.evaluate((el, val) => {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }, testCase.ticket.toString());

      await patientSlider.evaluate((el, val) => {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }, testCase.patients.toString());

      await page.waitForTimeout(80);

      const data = await extractCalculatorValues(calculator);

      const expectedMonthly = testCase.ticket * testCase.patients;
      const expectedAnnual = expectedMonthly * 12;
      const expectedNet = Math.max(0, expectedAnnual - 1500);
      const expectedRoiPercent = Math.round(((expectedAnnual - 1500) / 1500) * 100);
      const expectedCovered = (testCase.ticket / 1500).toFixed(1);

      const passed = (
        data.avgTicket === testCase.ticket &&
        data.sliderTicketVal === testCase.ticket &&
        data.patientsPerMonth === testCase.patients &&
        data.sliderPatientVal === testCase.patients &&
        data.monthlyGross === expectedMonthly &&
        data.annualGross === expectedAnnual &&
        data.netProfit === expectedNet &&
        data.roiPercent === expectedRoiPercent &&
        data.timesCoveredByOnePatient === expectedCovered
      );

      console.log(`[${testCase.label}] -> Ticket: $${data.avgTicket} | Patients: ${data.patientsPerMonth} | Monthly: $${data.monthlyGross} (Exp: $${expectedMonthly}) | Annual: $${data.annualGross} (Exp: $${expectedAnnual}) | Net: $${data.netProfit} (Exp: $${expectedNet}) | ROI: ${data.roiPercent}% | Covered: ${data.timesCoveredByOnePatient}x | ${passed ? '✓ PASS' : '✗ FAIL'}`);

      results.sliderMatrixTests.push({
        label: testCase.label,
        inputs: { ticket: testCase.ticket, patients: testCase.patients },
        expected: { monthly: expectedMonthly, annual: expectedAnnual, net: expectedNet, roiPercent: expectedRoiPercent, timesCovered: expectedCovered },
        actual: data,
        passed
      });
    }

    // 3. Test CTA Link and Guarantee Badges
    console.log('\n--- 3. Testing Calculator CTA & Guarantee Badges ---');
    const ctaLink = calculator.locator('a[href*="whop.com"]');
    const ctaHref = await ctaLink.getAttribute('href');
    const ctaTarget = await ctaLink.getAttribute('target');
    const ctaText = (await ctaLink.innerText()).replace(/\n/g, ' ').trim();

    const expectedWhopUrl = 'https://whop.com/checkout/plan_e37e96b86e088/';
    const matchesExpectedWhop = ctaHref === expectedWhopUrl;

    console.log(`CTA Text: "${ctaText}"`);
    console.log(`CTA Href: "${ctaHref}"`);
    console.log(`Expected Whop URL: "${expectedWhopUrl}" (Matches: ${matchesExpectedWhop})`);
    console.log(`CTA Target: "${ctaTarget}"`);

    const guaranteeBadge = await calculator.locator('text=The 1-Patient ROI Reality:').count();
    const badgesText = await calculator.locator('text=✓ 1-Patient ROI Guarantee').count();

    results.ctaTest = {
      text: ctaText,
      href: ctaHref,
      target: ctaTarget,
      expectedWhopUrl,
      matchesExpectedWhop,
      hasGuaranteeCallout: guaranteeBadge > 0,
      hasBottomBadges: badgesText > 0
    };

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'roi_calc_final.png') });
  } catch (err) {
    console.error('Test execution error:', err);
    results.error = err.message;
  } finally {
    await browser.close();
  }

  const outPath = path.join(__dirname, 'roi_test_results.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nResults written to ${outPath}`);
  return results;
}

runRoiCalculatorTests();
