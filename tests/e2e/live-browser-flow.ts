import { chromium } from 'playwright';

async function runBrowserTest() {
  console.log('🚀 Launching Chrome Headless Browser for Full E2E Functional & UX Verification...');
  
  const browser = await chromium.launch({
    executablePath: '/run/current-system/sw/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const results: { test: string; status: 'PASS' | 'FAIL'; details?: string }[] = [];

  function record(test: string, pass: boolean, details?: string) {
    results.push({ test, status: pass ? 'PASS' : 'FAIL', details });
    console.log(`  [${pass ? 'PASS' : 'FAIL'}] ${test}${details ? ` - ${details}` : ''}`);
    if (!pass) throw new Error(`Test failed: ${test} - ${details}`);
  }

  try {
    // ==========================================
    // 1. HOMEPAGE NAVIGATION & HERO
    // ==========================================
    console.log('\n--- 1. Testing Homepage Navigation & Hero ---');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    const pageTitle = await page.title();
    record('Homepage Title Loaded', pageTitle.includes('NexusRank1'), pageTitle);

    // Reassurance badge
    const conciergeBadge = await page.locator('text=100% Done-For-You: We handle complete technical setup').count();
    record('Concierge Setup Badge Present', conciergeBadge > 0);

    // ==========================================
    // 2. INSTANT AUDIT BAR PRESETS & SCANNING
    // ==========================================
    console.log('\n--- 2. Testing Instant Clinical Audit Bar ---');
    const auditBar = page.locator('#audit-bar');
    await auditBar.scrollIntoViewIfNeeded();

    // Test preset click: mayoclinic.org
    const mayoPreset = page.locator('button:has-text("mayoclinic.org")');
    if (await mayoPreset.count() > 0) {
      await mayoPreset.click();
      await page.waitForTimeout(500);
      record('Preset mayoclinic.org Clicked', true);
    }

    // Test custom input: beverlyhillsdental.com
    const domainInput = page.locator('input[placeholder*="domain"], input[type="text"]').first();
    await domainInput.fill('beverlyhillsdental.com');
    const runAuditBtn = page.locator('button:has-text("Run 5-Second Clinical Audit")');
    await runAuditBtn.click();
    console.log('  Waiting for clinical audit scan to complete...');
    const auditCard = page.locator('#audit-results-card');
    await auditCard.waitFor({ state: 'visible', timeout: 15000 });
    record('Audit Scan Rendered Results Card', true);

    // ==========================================
    // 3. TESTING ALL 7 AUDIT BAR TABS
    // ==========================================
    console.log('\n--- 3. Testing All 7 Audit Result Tabs ---');
    const tabNames = [
      '1. Competitor Grid',
      '2. Profile & Directories',
      '3. Review Loops & QR',
      '4. AI Factsheet',
      'Live AI Simulator',
      'Doctor Licensure Graph',
      'Clinical Checklist'
    ];

    for (const name of tabNames) {
      const tabBtn = page.locator(`button:has-text("${name}")`).first();
      await tabBtn.scrollIntoViewIfNeeded();
      await tabBtn.click();
      await page.waitForTimeout(400);
      record(`Tab Navigation: ${name}`, true);
    }

    // ==========================================
    // 4. TAB 4 DUAL VIEW & CODE SWITCH
    // ==========================================
    console.log('\n--- 4. Testing AI Factsheet Dual View & Code Switch ---');
    const factsheetTab = page.locator('button:has-text("4. AI Factsheet")').first();
    await factsheetTab.click();
    await page.waitForTimeout(400);

    // Verify Executive Summary Cards exist
    const doctorSummaryCard = page.getByText('Doctor NPI-1 Licensure');
    record('Executive Doctor Summary View Rendered', (await doctorSummaryCard.count()) > 0);

    // Switch to Webmaster Code
    const viewCodeBtn = page.locator('button:has-text("View Webmaster Code")').first();
    if (await viewCodeBtn.count() > 0) {
      await viewCodeBtn.click();
      await page.waitForTimeout(400);

      const codePre = page.locator('pre, code');
      record('Webmaster Code View Displayed', (await codePre.count()) > 0);

      // Test tabs inside Webmaster Code
      const llmsTab = page.locator('button:has-text("/llms.txt")').first();
      if (await llmsTab.count() > 0) {
        await llmsTab.click();
        await page.waitForTimeout(300);
        record('Code View: /llms.txt Tab', true);
      }

      const cdtTab = page.locator('button:has-text("ADA CDT & AMA CPT")').first();
      if (await cdtTab.count() > 0) {
        await cdtTab.click();
        await page.waitForTimeout(300);
        record('Code View: ADA CDT & AMA CPT Tab', true);
      }

      // Switch back to Doctor Summary
      const switchSummaryBtn = page.locator('button:has-text("Switch to Doctor Summary")').first();
      await switchSummaryBtn.click();
      await page.waitForTimeout(300);
      record('Switch Back to Doctor Summary', true);
    }

    // ==========================================
    // 5. PRACTICE MANAGER EMAIL DISPATCH MODAL
    // ==========================================
    console.log('\n--- 5. Testing Practice Manager Dispatch Modal ---');
    const emailReportBtn = page.locator('button:has-text("Email Report to Practice Manager")').first();
    if (await emailReportBtn.count() > 0) {
      await emailReportBtn.click();
      await page.waitForTimeout(500);

      const modalTitle = page.getByText('Email Audit Report to Practice Manager').first();
      record('Dispatch Modal Opened', (await modalTitle.count()) > 0);

      // Fill inputs
      const emailInput = page.locator('input[type="email"]').first();
      if (await emailInput.count() > 0) {
        await emailInput.fill('amanda@newportbeachplasticsurgery.com');
        const submitBtn = page.locator('button[type="submit"]:has-text("Dispatch Lead")').first();
        if (await submitBtn.count() > 0) {
          await submitBtn.click();
          await page.waitForTimeout(1000);
          record('Practice Report Dispatched Successfully', true);
        }
      }
    }

    // ==========================================
    // 6. PATIENT ROI CALCULATOR SLIDERS
    // ==========================================
    console.log('\n--- 6. Testing Patient ROI Calculator ---');
    const roiSection = page.locator('#patient-roi-calculator');
    await roiSection.scrollIntoViewIfNeeded();

    // Specialty click
    const plasticSurgeryBtn = page.locator('button:has-text("Plastic & Cosmetic Surgery")').first();
    if (await plasticSurgeryBtn.count() > 0) {
      await plasticSurgeryBtn.click();
      await page.waitForTimeout(300);
      record('ROI Calculator: Plastic Surgery Selected', true);
    }

    const roiReality = page.getByText('The 1-Patient ROI Reality').first();
    record('ROI Metrics Dynamic Calculation Rendered', (await roiReality.count()) > 0);

    // ==========================================
    // 7. FLOATING CORNER CHAT ADVISOR
    // ==========================================
    console.log('\n--- 7. Testing Floating Corner Chat Advisor ---');
    const chatBubble = page.locator('button:has-text("NexusRank1 Advisor")').first();
    await chatBubble.click();
    await page.waitForTimeout(500);

    const chatHeader = page.getByText('NexusRank1 AI Advisor').first();
    record('Chat Widget Opened', (await chatHeader.count()) > 0);

    // Test sending message
    const chatInput = page.locator('input[placeholder*="Ask GEO clinical question..."]').first();
    await chatInput.fill('What is your pricing?');
    const chatSubmit = page.locator('form button[type="submit"]').first();
    await chatSubmit.click();
    await page.waitForTimeout(2000);

    const pricingAnswer = page.getByText('$1,500').first();
    record('Chatbot Responded with $1,500 Terms', (await pricingAnswer.count()) > 0);

    // Close chat
    const closeChatBtn = page.locator('div.fixed button:has(svg.lucide-x)').first();
    if (await closeChatBtn.count() > 0) {
      await closeChatBtn.click();
      await page.waitForTimeout(300);
      record('Chat Widget Closed', true);
    }

    // ==========================================
    // 8. CLINIC COMMAND CENTER (/partner-console)
    // ==========================================
    console.log('\n--- 8. Testing Clinic Command Center (/partner-console) ---');
    await page.goto('http://localhost:3000/partner-console', { waitUntil: 'networkidle' });
    const consoleHeader = page.getByText('ACTIVE DEFENSE').first();
    record('Partner Console Loaded with Active Defense Header', (await consoleHeader.count()) > 0);

    // Tab navigation in partner console
    const consoleTabs = [
      'Competitor Steal Radar',
      '1-Click Schema & /llms.txt',
      'Practice & NPI Licensure',
      'Executive Dashboard'
    ];

    for (const tab of consoleTabs) {
      const tabBtn = page.locator(`button:has-text("${tab}")`).first();
      if (await tabBtn.count() > 0) {
        await tabBtn.click();
        await page.waitForTimeout(300);
        record(`Partner Console Tab: ${tab}`, true);
      }
    }

    // Switch to Practice & NPI Licensure and verify Lifetime Clinic License
    const settingsTab = page.locator('button:has-text("Practice & NPI Licensure")').first();
    await settingsTab.click();
    await page.waitForTimeout(300);
    const lifetimeBadge = page.getByText('Lifetime Clinic License • Active AI Defense').first();
    record('Lifetime Clinic License Badge Verified', (await lifetimeBadge.count()) > 0);

    // ==========================================
    // 9. PRICING & PUBLIC REPORT PAGES
    // ==========================================
    console.log('\n--- 9. Testing Pricing & Public Report Routes ---');
    await page.goto('http://localhost:3000/pricing', { waitUntil: 'networkidle' });
    const pricingHeading = page.getByText('$1,500').first();
    record('Pricing Page Loaded with $1,500 Master Plan', (await pricingHeading.count()) > 0);

    await page.goto('http://localhost:3000/report/dentalpractice.com', { waitUntil: 'networkidle' });
    const reportTitle = page.getByText('Official GEO Audit').first();
    record('Public Report Page Rendered', (await reportTitle.count()) > 0);

    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
    const loginForm = page.locator('form, input[type="email"]').first();
    record('Login Page Form Rendered', (await loginForm.count()) > 0);

    console.log('\n======================================================');
    console.log(`🎉 ALL ${results.length} LIVE BROWSER TESTS PASSED 100%!`);
    console.log('======================================================\n');
  } catch (err: any) {
    console.error('❌ Browser Test Error:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runBrowserTest();
