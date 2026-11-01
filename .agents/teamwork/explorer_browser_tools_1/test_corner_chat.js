const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = path.join(__dirname, 'screenshots');
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function testCornerChat() {
  console.log('=== Starting Corner Chat Widget Tests ===');
  const browser = await chromium.launch({
    executablePath: '/run/current-system/sw/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const consoleMessages = [];
  page.on('console', msg => consoleMessages.push({ type: msg.type(), text: msg.text() }));

  const results = {
    timestamp: new Date().toISOString(),
    floatingButtonTest: {},
    welcomeMessageTest: {},
    presetButtonTests: [],
    clinicianInquiries: [],
    closeReopenTest: {},
    consoleErrors: []
  };

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    console.log('Homepage loaded');

    // 1. Check Floating Button
    console.log('\n--- 1. Testing Floating Action Button ---');
    const fabButton = page.locator('button:has(svg.lucide-message-square)');
    await fabButton.waitFor({ state: 'visible', timeout: 5000 });

    const fabVisible = await fabButton.isVisible();
    const fabText = (await fabButton.innerText()).trim();
    console.log(`FAB Button visible: ${fabVisible}, Text: "${fabText}"`);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'chat_01_fab_closed.png') });

    results.floatingButtonTest = {
      visible: fabVisible,
      text: fabText
    };

    // 2. Open Chat Widget
    console.log('\n--- 2. Opening Chat Drawer ---');
    await fabButton.click();
    await page.waitForTimeout(500);

    // Verify Drawer Window
    const drawer = page.locator('div:has-text("NexusRank1 AI Advisor").fixed');
    const drawerVisible = await page.locator('text=NexusRank1 AI Advisor').first().isVisible();
    console.log(`Chat drawer visible: ${drawerVisible}`);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'chat_02_drawer_opened.png') });

    // 3. Welcome Message Verification
    console.log('\n--- 3. Verifying Welcome Message ---');
    const welcomeMsgEl = page.locator('div.whitespace-pre-wrap').first();
    const welcomeText = await welcomeMsgEl.innerText();
    console.log('Welcome Message:\n' + welcomeText);

    const hasDeploymentTerms = welcomeText.includes('$1,500 One-Time');
    const hasZeroRetainers = welcomeText.includes('0 Monthly Retainers');
    const hasRoiGuarantee = welcomeText.includes('1-Patient ROI Guarantee');
    const hasCompetitorRadar = welcomeText.includes('Competitor Steal Radar');

    results.welcomeMessageTest = {
      content: welcomeText,
      hasDeploymentTerms,
      hasZeroRetainers,
      hasRoiGuarantee,
      hasCompetitorRadar,
      passed: hasDeploymentTerms && hasZeroRetainers && hasRoiGuarantee
    };

    // 4. Test Quick Preset Button: "Practice Pricing"
    console.log('\n--- 4. Testing Quick Preset Button: Practice Pricing ---');
    const pricingPresetBtn = page.locator('button:has-text("Practice Pricing")');
    if (await pricingPresetBtn.isVisible()) {
      await pricingPresetBtn.click();
      console.log('Clicked "Practice Pricing" preset button');

      // Wait for assistant response
      await page.waitForTimeout(2000);
      // Wait until loading indicator disappears
      await page.waitForSelector('text=Consulting clinical knowledge base...', { state: 'hidden', timeout: 20000 });

      // Get latest assistant message
      const assistantMsgs = page.locator('div.whitespace-pre-wrap');
      const count = await assistantMsgs.count();
      const latestReply = await assistantMsgs.nth(count - 1).innerText();

      console.log('Preset Reply snippet:\n' + latestReply.substring(0, 300) + '...\n');

      const presetHas1500 = latestReply.includes('$1,500');
      const presetHasGuarantee = latestReply.toLowerCase().includes('guarantee');
      const presetHasPillars = latestReply.includes('Pillar 1') || latestReply.includes('Geo-Visibility');

      results.presetButtonTests.push({
        preset: 'Practice Pricing',
        replySnippet: latestReply.substring(0, 500),
        has1500: presetHas1500,
        hasGuarantee: presetHasGuarantee,
        hasPillars: presetHasPillars,
        passed: presetHas1500 && presetHasGuarantee
      });

      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'chat_03_preset_pricing_response.png') });
    }

    // 5. Test Clinician Inquiries via Input Field
    console.log('\n--- 5. Testing Clinician Inquiries via Chat Input ---');
    const clinicianQuestions = [
      {
        topic: 'Deployment Terms & $1,500 Flat Fee',
        question: 'Can you confirm the $1,500 one-time deployment terms and whether there are any hidden monthly fees?',
        expectedKeyphrases: ['$1,500', 'one-time', '0 monthly']
      },
      {
        topic: 'Google Ads Competitor Displacement',
        question: 'How does your Geo-Grid Radar displace our #1 local competitor who spends $100/click on Google Ads?',
        expectedKeyphrases: ['competitor', 'grid', 'geo']
      },
      {
        topic: 'Implementation Timeline & Team Effort',
        question: 'What is the implementation timeline and does our clinic staff have to write any code?',
        expectedKeyphrases: ['timeline', 'schema', 'install', 'hour', 'wordpress']
      }
    ];

    const inputField = page.locator('input[placeholder*="Ask GEO"]');
    const sendButton = page.locator('button[type="submit"]');

    for (const item of clinicianQuestions) {
      console.log(`\nSending inquiry: "${item.question}"`);
      await inputField.fill(item.question);
      await sendButton.click();

      // Wait for response to arrive
      await page.waitForTimeout(1000);
      try {
        await page.waitForSelector('text=Consulting clinical knowledge base...', { state: 'hidden', timeout: 20000 });
      } catch (e) {
        console.log('Note: loading indicator waited out');
      }

      const assistantMsgs = page.locator('div.whitespace-pre-wrap');
      const count = await assistantMsgs.count();
      const latestReply = await assistantMsgs.nth(count - 1).innerText();

      console.log(`Reply for "${item.topic}":`);
      console.log(latestReply.substring(0, 300) + '...\n');

      const lowerReply = latestReply.toLowerCase();
      const matchedPhrases = item.expectedKeyphrases.filter(k => lowerReply.includes(k.toLowerCase()));

      results.clinicianInquiries.push({
        topic: item.topic,
        question: item.question,
        fullReply: latestReply,
        matchedPhrases,
        passed: latestReply.length > 50 && !latestReply.includes('error')
      });
    }

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'chat_04_all_inquiries.png') });

    // 6. Test Close and Reopen
    console.log('\n--- 6. Testing Close and Reopen Drawer ---');
    const closeBtn = page.locator('button:has(svg.lucide-x)');
    await closeBtn.click();
    await page.waitForTimeout(300);

    const drawerVisibleAfterClose = await page.locator('div.fixed.bottom-6.right-6.z-50.w-\\[90vw\\]').isVisible();
    const fabVisibleAfterClose = await page.locator('button:has(svg.lucide-message-square)').isVisible();
    console.log(`Drawer closed: ${!drawerVisibleAfterClose}, FAB reopened: ${fabVisibleAfterClose}`);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'chat_05_drawer_closed.png') });

    // Reopen FAB
    await page.locator('button:has(svg.lucide-message-square)').click();
    await page.waitForTimeout(400);

    // Verify messages persisted
    const msgCount = await page.locator('div.whitespace-pre-wrap').count();
    console.log(`Message count after reopen: ${msgCount} (persisted)`);

    results.closeReopenTest = {
      drawerClosedCleanly: !drawerVisibleAfterClose,
      fabReappeared: fabVisibleAfterClose,
      reopenSuccess: msgCount >= 4,
      persistedMessageCount: msgCount
    };

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'chat_06_reopened.png') });

    results.consoleErrors = consoleMessages.filter(m => m.type === 'error');

  } catch (err) {
    console.error('Chat test error:', err);
    results.error = err.message;
  } finally {
    await browser.close();
  }

  const outPath = path.join(__dirname, 'chat_test_results.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nChat results written to ${outPath}`);
  return results;
}

testCornerChat();
