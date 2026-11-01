const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = path.join(__dirname, 'screenshots');
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function runPricingPageTests() {
  console.log('=== Starting Exhaustive Pricing Page Tests (/pricing) ===');
  const browser = await chromium.launch({
    executablePath: '/run/current-system/sw/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const viewports = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 375, height: 667 },
  ];

  const results = {
    timestamp: new Date().toISOString(),
    route: '/pricing',
    httpStatus: null,
    viewports: {},
    masterOfferCard: {},
    pillarsTest: [],
    valueMatrixTest: [],
    faqTest: [],
    checkoutLinks: [],
    consoleMessages: [],
    consoleErrors: []
  };

  try {
    const page = await browser.newPage({ viewport: viewports[0] });

    page.on('console', msg => {
      const entry = { type: msg.type(), text: msg.text() };
      results.consoleMessages.push(entry);
      if (msg.type() === 'error') {
        results.consoleErrors.push(entry);
      }
    });

    const response = await page.goto('http://localhost:3000/pricing', { waitUntil: 'networkidle' });
    results.httpStatus = response.status();
    console.log(`Loaded http://localhost:3000/pricing -> HTTP Status: ${response.status()}`);

    // Test Viewports & Visual Responsiveness
    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(300);

      const shotPath = path.join(ARTIFACT_DIR, `pricing_${vp.name}.png`);
      await page.screenshot({ path: shotPath, fullPage: true });
      console.log(`Captured screenshot for viewport: ${vp.name} (${vp.width}x${vp.height})`);

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      const hasHorizontalOverflow = scrollWidth > clientWidth;

      results.viewports[vp.name] = {
        width: vp.width,
        height: vp.height,
        scrollWidth,
        clientWidth,
        hasHorizontalOverflow,
        screenshot: shotPath
      };
    }

    // Reset to desktop for element inspection
    await page.setViewportSize(viewports[0]);
    await page.waitForTimeout(200);

    // 1. Master Offer Card Verification
    console.log('\n--- 1. Testing Master Offer Card ---');
    const heroTitle = await page.locator('h1').innerText();
    const subPrice = await page.locator('span.text-5xl.font-black.text-white').innerText();
    const billingPeriod = await page.locator('span.uppercase.tracking-wider:has-text("One-Time Investment")').innerText();
    const guaranteeTitle = await page.locator('text=The 1-Patient ROI Guarantee').first().innerText();

    console.log(`Hero Title: "${heroTitle.replace(/\n/g, ' ')}"`);
    console.log(`Price Displayed: "${subPrice}"`);
    console.log(`Billing Period: "${billingPeriod}"`);
    console.log(`Guarantee: "${guaranteeTitle}"`);

    results.masterOfferCard = {
      heroTitle: heroTitle.replace(/\n/g, ' '),
      price: subPrice,
      billingPeriod,
      guaranteeTitle,
      passed: subPrice.includes('$1,500') && billingPeriod.includes('One-Time')
    };

    // 2. Pillars Breakdown Verification
    console.log('\n--- 2. Testing 4 Growth Pillars ---');
    const expectedPillars = [
      'Geo-Visibility Grid Tracking & Zip-Code Benchmarking',
      'Google Business Profile (GBP) & Citation Cleanup',
      'Automated Review Loops & Front-Desk Engine',
      'AI Model Readability & Crawler Directives'
    ];

    for (const title of expectedPillars) {
      const el = page.locator(`h4:has-text("${title}")`);
      const exists = await el.count() > 0;
      console.log(`Pillar "${title}": ${exists ? 'EXISTS' : 'MISSING'}`);
      results.pillarsTest.push({ title, exists });
    }

    // 3. Practice Value Matrix Verification
    console.log('\n--- 3. Testing Practice Value Matrix ---');
    const specialtyItems = ['Dental Implants', 'Invisalign / Ortho', 'Plastic Surgery', 'MedSpa Packages', 'Orthopedic Consult'];
    for (const spec of specialtyItems) {
      const el = page.locator(`div:has-text("${spec}")`).first();
      const exists = await el.count() > 0;
      console.log(`Value Matrix [${spec}]: ${exists ? 'EXISTS' : 'MISSING'}`);
      results.valueMatrixTest.push({ specialty: spec, exists });
    }

    // 4. FAQ Verification
    console.log('\n--- 4. Testing FAQs ---');
    const faqGrid = page.locator('div.grid.grid-cols-1.md\\:grid-cols-2 > div.nr-glass-card');
    const faqCount = await faqGrid.count();
    console.log(`Total FAQ items found: ${faqCount}`);
    for (let i = 0; i < faqCount; i++) {
      const card = faqGrid.nth(i);
      const qText = await card.locator('h4').innerText();
      const aText = await card.locator('p').innerText();
      console.log(`  FAQ #${i + 1}: "${qText.replace(/\n/g, ' ')}"`);
      results.faqTest.push({
        index: i + 1,
        question: qText.replace(/\n/g, ' ').trim(),
        answerSnippet: aText.substring(0, 100) + '...'
      });
    }

    // 5. Checkout Links & Button Verification
    console.log('\n--- 5. Checking All Checkout Links on /pricing ---');
    const expectedWhopUrl = 'https://whop.com/checkout/plan_e37e96b86e088/';
    const links = page.locator('a[href*="whop.com"]');
    const linkCount = await links.count();
    console.log(`Found ${linkCount} Whop checkout link(s) on /pricing`);

    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const href = await link.getAttribute('href');
      const target = await link.getAttribute('target');
      const rel = await link.getAttribute('rel');
      const text = (await link.innerText()).replace(/\n/g, ' ').trim();

      const isTargetPlan = href === expectedWhopUrl;
      console.log(`Link #${i + 1}:`);
      console.log(`  Text: "${text}"`);
      console.log(`  Href: "${href}"`);
      console.log(`  Target: "${target}", Rel: "${rel}"`);
      console.log(`  Matches plan_e37e96b86e088: ${isTargetPlan ? '✓ YES' : '✗ NO'}`);

      results.checkoutLinks.push({
        index: i + 1,
        text,
        href,
        target,
        rel,
        expectedWhopUrl,
        isTargetPlan
      });
    }

    // 6. Console Errors Check
    console.log('\n--- 6. Console Errors Check ---');
    console.log(`Total console messages: ${results.consoleMessages.length}`);
    console.log(`Total console errors: ${results.consoleErrors.length}`);

    await page.close();
  } catch (err) {
    console.error('Pricing page test error:', err);
    results.error = err.message;
  } finally {
    await browser.close();
  }

  const outPath = path.join(__dirname, 'pricing_test_results.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nPricing results written to ${outPath}`);
  return results;
}

runPricingPageTests();
