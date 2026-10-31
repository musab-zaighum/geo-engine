import { NextRequest, NextResponse } from 'next/server';
import { chromium, type Browser } from 'playwright';
import fs from 'fs';

export const runtime = 'nodejs';

function getChromeExecutablePath(): string | undefined {
  if (process.env.CHROME_BIN) return process.env.CHROME_BIN;
  const possiblePaths = [
    '/run/current-system/sw/bin/google-chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome-stable',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ];
  for (const p of possiblePaths) {
    try {
      if (fs.existsSync(/* turbopackIgnore: true */ p)) return p;
    } catch {
      // ignore
    }
  }
  return undefined;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const domainParam = searchParams.get('domain') || 'dentalpractice.com';
  const cleanDomain = domainParam.replace(/^https?:\/\//, '').replace(/\/$/, '');

  let browser: Browser | null = null;

  try {
    const execPath = getChromeExecutablePath();
    browser = await chromium.launch({
      executablePath: execPath,
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });

    const page = await browser.newPage();
    await page.setViewportSize({ width: 1200, height: 1600 });

    // Abort external trackers and video/media to accelerate PDF vector rendering
    await page.route('**/*', (route: any) => {
      const r = route.request();
      const type = r.resourceType();
      if (['media', 'websocket'].includes(type) || /analytics|googletagmanager|segment|sentry/i.test(r.url())) {
        return route.abort();
      }
      return route.continue();
    });

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const targetUrl = `${protocol}://${host}/report/${encodeURIComponent(cleanDomain)}?print=true`;

    try {
      await page.goto(targetUrl, {
        waitUntil: 'load',
        timeout: 6000,
      });
      await page.waitForTimeout(400);
    } catch {
      // Fallback to domcontentloaded if load state times out
      await page.goto(targetUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 5000,
      });
      await page.waitForTimeout(400);
    }

    // Apply print media styling rules to guarantee crisp vector elements
    await page.emulateMedia({ media: 'print' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: false,
      margin: {
        top: '12mm',
        bottom: '12mm',
        left: '12mm',
        right: '12mm',
      },
    });

    await browser.close();
    browser = null;

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${cleanDomain}-clinical-geo-audit.pdf"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: any) {
    console.error('Playwright Vector PDF generation error:', error);
    if (browser) {
      await browser.close().catch(() => {});
    }

    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to generate vector PDF report.',
      },
      { status: 500 }
    );
  }
}
