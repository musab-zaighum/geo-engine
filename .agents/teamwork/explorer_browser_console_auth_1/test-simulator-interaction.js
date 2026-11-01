const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function run() {
  const browser = await chromium.launch({
    executablePath: '/run/current-system/sw/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:3000/report/dentalpractice.com', { waitUntil: 'networkidle' });

  // Switch to simulator tab
  await page.click('button:has-text("AI Citation Simulator")');
  await page.waitForTimeout(400);

  const engines = ['Google', 'OpenAI', 'Perplexity', 'Apple'];
  for (const eng of engines) {
    const btn = page.locator(`button:has-text("${eng}")`);
    await btn.click();
    await page.waitForTimeout(300);
    const answerBox = await page.locator('.lg\\:col-span-2').innerText();
    console.log(`Engine ${eng} active. Answer box snippet: ${answerBox.slice(0, 100).replace(/\n/g, ' ')}...`);
  }

  await browser.close();
  console.log('Simulator interaction test passed!');
}

run();
