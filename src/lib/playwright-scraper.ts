import { chromium, type Browser } from 'playwright';
import * as cheerio from 'cheerio';
import fs from 'fs';

export interface PlaywrightScrapeResult {
  url: string;
  pageFetchOk: boolean;
  html: string;
  hasLlmsTxt: boolean;
  llmsTxtStatus: number;
  detectedSchemas: string[];
  hasMedicalSchema: boolean;
  pageTitle?: string;
  metaDescription?: string;
  isPlaywrightRendered: boolean;
  errorMessage?: string;
}

function getChromeExecutablePath(): string | undefined {
  if (process.env.CHROME_BIN) return process.env.CHROME_BIN;
  const possiblePaths = [
    '/run/current-system/sw/bin/google-chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome-stable',
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

export async function scrapeWithPlaywright(targetUrl: string): Promise<PlaywrightScrapeResult> {
  let browser: Browser | null = null;
  const cleanUrl = targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;

  // 1. Check llms.txt at origin domain
  let hasLlmsTxt = false;
  let llmsTxtStatus = 0;
  try {
    const origin = new URL(cleanUrl).origin;
    const llmsRes = await fetch(`${origin}/llms.txt`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 NexusRank1Auditor/1.0',
      },
      signal: AbortSignal.timeout(5000),
    });
    llmsTxtStatus = llmsRes.status;
    if (llmsRes.ok) {
      const text = await llmsRes.text();
      if (text && text.trim().length > 10) {
        hasLlmsTxt = true;
      }
    }
  } catch {
    llmsTxtStatus = 0;
  }

  // 2. Launch Playwright Chromium with system Google Chrome
  try {
    const execPath = getChromeExecutablePath();
    const launchOptions: any = {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    };
    if (execPath) {
      launchOptions.executablePath = execPath;
    }

    browser = await chromium.launch(launchOptions);

    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 NexusRank1Auditor/1.0',
      viewport: { width: 1280, height: 800 },
    });

    const page = await context.newPage();
    
    await page.goto(cleanUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 12000,
    });

    await page.waitForTimeout(1500);

    const html = await page.content();
    const pageTitle = await page.title();
    
    await browser.close();
    browser = null;

    if (html && html.trim().length > 50) {
      const parsedData = parseHtmlAndSchemas(html);
      return {
        url: targetUrl,
        pageFetchOk: true,
        html,
        hasLlmsTxt,
        llmsTxtStatus,
        detectedSchemas: parsedData.detectedSchemas,
        hasMedicalSchema: parsedData.hasMedicalSchema,
        pageTitle: pageTitle || parsedData.pageTitle,
        metaDescription: parsedData.metaDescription,
        isPlaywrightRendered: true,
      };
    }
  } catch (err: any) {
    if (browser) {
      try {
        await browser.close();
      } catch {
        // ignore close error
      }
    }
    console.warn('Playwright Chrome launch note:', err?.message || err);
  }

  // 3. Fallback to standard fetch + cheerio if browser launch fails or times out
  try {
    const pageRes = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 CiteMedAuditor/1.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: AbortSignal.timeout(8000),
      redirect: 'follow',
    });

    if (pageRes.ok) {
      const html = await pageRes.text();
      const parsedData = parseHtmlAndSchemas(html);
      return {
        url: targetUrl,
        pageFetchOk: true,
        html,
        hasLlmsTxt,
        llmsTxtStatus,
        detectedSchemas: parsedData.detectedSchemas,
        hasMedicalSchema: parsedData.hasMedicalSchema,
        pageTitle: parsedData.pageTitle,
        metaDescription: parsedData.metaDescription,
        isPlaywrightRendered: false,
      };
    }
  } catch (err: any) {
    return {
      url: targetUrl,
      pageFetchOk: false,
      html: '',
      hasLlmsTxt,
      llmsTxtStatus,
      detectedSchemas: [],
      hasMedicalSchema: false,
      isPlaywrightRendered: false,
      errorMessage: err?.message || 'Failed to fetch domain HTML.',
    };
  }

  return {
    url: targetUrl,
    pageFetchOk: false,
    html: '',
    hasLlmsTxt,
    llmsTxtStatus,
    detectedSchemas: [],
    hasMedicalSchema: false,
    isPlaywrightRendered: false,
    errorMessage: 'Unable to render site content.',
  };
}

function parseHtmlAndSchemas(html: string) {
  const $ = cheerio.load(html);
  const detectedSchemas: string[] = [];

  $('script[type="application/ld+json"]').each((_, element) => {
    try {
      const content = $(element).html();
      if (!content) return;
      const parsed = JSON.parse(content);

      const extractTypes = (obj: any) => {
        if (!obj) return;
        if (Array.isArray(obj)) {
          obj.forEach((item) => extractTypes(item));
          return;
        }
        if (typeof obj === 'object') {
          if (obj['@type']) {
            const types = Array.isArray(obj['@type']) ? obj['@type'] : [obj['@type']];
            types.forEach((t: string) => {
              if (typeof t === 'string' && !detectedSchemas.includes(t)) {
                detectedSchemas.push(t);
              }
            });
          }
          if (obj['@graph'] && Array.isArray(obj['@graph'])) {
            obj['@graph'].forEach((item: any) => extractTypes(item));
          }
        }
      };

      extractTypes(parsed);
    } catch {
      // ignore parse error
    }
  });

  const medicalKeywords = [
    'MedicalClinic',
    'Physician',
    'MedicalBusiness',
    'Hospital',
    'Dentist',
    'MedicalOrganization',
    'DiagnosticLab',
    'MedicalProcedure',
    'MedicalCondition',
    'MedicalSpecialty',
  ];

  const hasMedicalSchema = detectedSchemas.some((schemaType) =>
    medicalKeywords.some((keyword) => schemaType.toLowerCase() === keyword.toLowerCase())
  );

  const pageTitle = $('title').text().trim();
  const metaDescription = $('meta[name="description"]').attr('content')?.trim();

  return {
    detectedSchemas,
    hasMedicalSchema,
    pageTitle,
    metaDescription,
  };
}
