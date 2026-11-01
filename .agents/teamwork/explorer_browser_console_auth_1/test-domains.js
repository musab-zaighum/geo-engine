const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'multi-domain-test.log');

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

async function run() {
  fs.writeFileSync(LOG_FILE, '');
  log('Starting Multi-Domain Public Report Test');

  const browser = await chromium.launch({
    executablePath: '/run/current-system/sw/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    headless: true,
  });

  const domains = ['mayoclinic.org', 'clevelandclinic.org', 'austincosmetic.com'];

  for (const domain of domains) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();

    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    try {
      const url = `http://localhost:3000/report/${domain}`;
      log(`Checking ${url}...`);
      const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
      log(`Status: ${res.status()}`);

      const title = await page.locator('h2').innerText();
      const score = await page.locator('text=/100').locator('..').innerText();
      log(`Domain: ${domain} -> Title: "${title}", Score: "${score.replace(/\n/g, ' ')}"`);
      log(`Console errors: ${consoleErrors.length}`);
    } catch (err) {
      log(`Error testing ${domain}: ${err.message}`);
    } finally {
      await context.close();
    }
  }

  await browser.close();
  log('Multi-Domain Test Complete');
}

run();
