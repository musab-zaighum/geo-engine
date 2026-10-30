import { chromium, type Browser } from 'playwright';
import * as cheerio from 'cheerio';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import fs from 'fs';

export interface StructuredClinicalData {
  clinicName?: string;
  telephones: string[];
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  doctors: Array<{
    name: string;
    credential?: string;
    npi?: string;
  }>;
  operatingHours: string[];
}

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
  clinicalData?: StructuredClinicalData;
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
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 NexusRank1Auditor/2.0',
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
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-blink-features=AutomationControlled',
        '--disable-infobars',
        '--no-default-browser-check',
        '--ignore-certificate-errors',
      ],
    };
    if (execPath) {
      launchOptions.executablePath = execPath;
    }

    browser = await chromium.launch(launchOptions);

    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 NexusRank1Auditor/2.0',
      viewport: { width: 1280, height: 800 },
      locale: 'en-US',
      timezoneId: 'America/New_York',
      bypassCSP: true,
      ignoreHTTPSErrors: true,
    });

    const page = await context.newPage();

    // Anti-bot stealth init scripts (masks navigator.webdriver, mocks window.chrome, evades CDP detection)
    await page.addInitScript(() => {
      // 1. Mask navigator.webdriver
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });

      // 2. Mock window.chrome runtime object
      (window as any).chrome = {
        runtime: {},
        loadTimes: () => {},
        csi: () => {},
        app: {},
      };

      // 3. Spoof plugins and languages
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });

      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en'],
      });

      // 4. Spoof notification permissions query
      const originalQuery = window.navigator.permissions.query;
      window.navigator.permissions.query = (parameters: any) =>
        parameters.name === 'notifications'
          ? Promise.resolve({ state: Notification.permission } as any)
          : originalQuery(parameters);
    });

    await page.goto(cleanUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 12000,
    });

    // Give dynamic client-side single page apps (Wix, Webflow, React) a short beat to hydrate JSON-LD
    await page.waitForTimeout(1000);

    const html = await page.content();
    const pageTitle = await page.title();

    await browser.close();
    browser = null;

    if (html && html.trim().length > 50) {
      const parsedData = parseClinicalHtmlAndSchemas(html);
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
        clinicalData: parsedData.clinicalData,
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
    const pageRes = await fetch(cleanUrl, {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 NexusRank1Auditor/2.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: AbortSignal.timeout(8000),
      redirect: 'follow',
    });

    if (pageRes.ok) {
      const html = await pageRes.text();
      const parsedData = parseClinicalHtmlAndSchemas(html);
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
        clinicalData: parsedData.clinicalData,
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
      clinicalData: { telephones: [], doctors: [], operatingHours: [] },
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
    clinicalData: { telephones: [], doctors: [], operatingHours: [] },
    errorMessage: 'Unable to render site content.',
  };
}

export function parseClinicalHtmlAndSchemas(html: string) {
  const $ = cheerio.load(html);
  const detectedSchemas: string[] = [];
  const rawPhones = new Set<string>();
  const doctors: Array<{ name: string; credential?: string; npi?: string }> = [];
  const operatingHours: string[] = [];
  let clinicName: string | undefined;
  let address: StructuredClinicalData['address'] = undefined;
  let geo: StructuredClinicalData['geo'] = undefined;

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

          // Extract clinic details
          const typeStr = JSON.stringify(obj['@type'] || '');
          if (/MedicalClinic|Dentist|Physician|Hospital|MedicalOrganization|MedicalBusiness/i.test(typeStr)) {
            if (obj.name && !clinicName) clinicName = String(obj.name).trim();
            if (obj.telephone) rawPhones.add(String(obj.telephone));
            if (obj.address && typeof obj.address === 'object' && !address) {
              address = {
                street: obj.address.streetAddress,
                city: obj.address.addressLocality,
                state: obj.address.addressRegion,
                postalCode: obj.address.postalCode,
                country: obj.address.addressCountry || 'US',
              };
            }
            if (obj.geo && typeof obj.geo === 'object' && !geo) {
              const lat = parseFloat(obj.geo.latitude);
              const lng = parseFloat(obj.geo.longitude);
              if (!isNaN(lat) && !isNaN(lng)) {
                geo = { latitude: lat, longitude: lng };
              }
            }
            if (obj.openingHours) {
              if (Array.isArray(obj.openingHours)) {
                operatingHours.push(...obj.openingHours.map(String));
              } else {
                operatingHours.push(String(obj.openingHours));
              }
            }
          }

          // Extract Doctor entities
          if (/Physician|Person/i.test(typeStr) && obj.name) {
            doctors.push({
              name: String(obj.name).trim(),
              credential: obj.jobTitle || obj.credentialCategory,
              npi: obj.identifier?.value || (typeof obj.identifier === 'string' ? obj.identifier : undefined),
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

  // Extract phone links from DOM <a href="tel:...">
  $('a[href^="tel:"]').each((_, el) => {
    const href = $(el).attr('href') || '';
    const cleanPhone = href.replace(/^tel:/i, '').trim();
    if (cleanPhone) rawPhones.add(cleanPhone);
  });

  // Format and validate phones deterministically with libphonenumber-js
  const validatedPhones: string[] = [];
  rawPhones.forEach((p) => {
    try {
      const parsedNum = parsePhoneNumberFromString(p, 'US');
      if (parsedNum && parsedNum.isValid()) {
        const formatted = parsedNum.formatNational();
        if (!validatedPhones.includes(formatted)) {
          validatedPhones.push(formatted);
        }
      } else if (p.replace(/\D/g, '').length >= 10) {
        // Fallback for valid digit sequences
        const digits = p.replace(/\D/g, '').slice(-10);
        const formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
        if (!validatedPhones.includes(formatted)) {
          validatedPhones.push(formatted);
        }
      }
    } catch {
      // ignore invalid phone
    }
  });

  // Extract geo coordinates from meta tags if not already extracted
  if (!geo) {
    const geoPos = $('meta[name="geo.position"]').attr('content') || $('meta[name="ICBM"]').attr('content');
    if (geoPos) {
      const parts = geoPos.split(/[,;\s]+/).map((s) => parseFloat(s.trim()));
      if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        geo = { latitude: parts[0], longitude: parts[1] };
      }
    }
  }

  // Microdata fallback for physical address
  if (!address) {
    const street = $('[itemprop="streetAddress"]').first().text().trim();
    const city = $('[itemprop="addressLocality"]').first().text().trim();
    const state = $('[itemprop="addressRegion"]').first().text().trim();
    const postalCode = $('[itemprop="postalCode"]').first().text().trim();
    if (street || city || state || postalCode) {
      address = {
        street: street || undefined,
        city: city || undefined,
        state: state || undefined,
        postalCode: postalCode || undefined,
        country: 'US',
      };
    }
  }

  // Fallback clinic name from OpenGraph if missing
  if (!clinicName) {
    const ogSite = $('meta[property="og:site_name"]').attr('content')?.trim();
    if (ogSite && ogSite.length > 2 && ogSite.length < 70) {
      clinicName = ogSite;
    }
  }

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
    clinicalData: {
      clinicName,
      telephones: validatedPhones,
      address,
      geo,
      doctors,
      operatingHours,
    },
  };
}
