import { chromium, type Browser } from 'playwright';
import * as cheerio from 'cheerio';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import fs from 'fs';
import { parseHTML } from 'linkedom';
import { microdata } from '@cucumber/microdata';

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
  detectedProcedures?: string[];
}

export interface PlaywrightScrapeResult {
  url: string;
  pageFetchOk: boolean;
  html: string;
  hasLlmsTxt: boolean;
  llmsTxtStatus: number;
  robotsTxtStatus?: number;
  blockedAiBots?: string[];
  aiBotsAllowed?: boolean;
  detectedSchemas: string[];
  hasMedicalSchema: boolean;
  pageTitle?: string;
  metaDescription?: string;
  isPlaywrightRendered: boolean;
  clinicalData?: StructuredClinicalData;
  errorMessage?: string;
}

export function parseRobotsTxt(content: string): string[] {
  const lines = content.split(/\r?\n/);
  const blocks: Record<string, string[]> = {};
  let currentAgents: string[] = [];

  for (const line of lines) {
    const clean = line.replace(/#.*$/, '').trim();
    if (!clean) {
      currentAgents = [];
      continue;
    }
    const uaMatch = clean.match(/^User-agent:\s*(.+)$/i);
    if (uaMatch) {
      const agent = uaMatch[1].trim().toLowerCase();
      currentAgents.push(agent);
      if (!blocks[agent]) blocks[agent] = [];
    } else {
      const disallowMatch = clean.match(/^Disallow:\s*(.*)$/i);
      if (disallowMatch) {
        const path = disallowMatch[1].trim();
        for (const ag of currentAgents) {
          blocks[ag].push(path);
        }
      }
    }
  }

  const blocked: string[] = [];
  if (blocks['*'] && blocks['*'].includes('/')) {
    blocked.push('All Crawlers (*)');
  }
  const aiBots = ['gptbot', 'perplexitybot', 'claudebot', 'google-extended', 'applebot-extended'];
  for (const bot of aiBots) {
    if (blocks[bot] && blocks[bot].includes('/')) {
      const properName =
        bot === 'gptbot'
          ? 'GPTBot (ChatGPT Search)'
          : bot === 'perplexitybot'
          ? 'PerplexityBot'
          : bot === 'claudebot'
          ? 'ClaudeBot'
          : bot === 'google-extended'
          ? 'Google-Extended (Gemini)'
          : 'Applebot-Extended';
      blocked.push(properName);
    }
  }
  return blocked;
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

  // 1. Concurrently check /llms.txt and /robots.txt at origin domain
  let hasLlmsTxt = false;
  let llmsTxtStatus = 0;
  let robotsTxtStatus = 0;
  const blockedAiBots: string[] = [];
  let aiBotsAllowed = true;

  try {
    const origin = new URL(cleanUrl).origin;
    const [llmsRes, robotsRes] = await Promise.allSettled([
      fetch(`${origin}/llms.txt`, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 NexusRank1Auditor/2.0',
        },
        signal: AbortSignal.timeout(4000),
      }),
      fetch(`${origin}/robots.txt`, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 NexusRank1Auditor/2.0',
        },
        signal: AbortSignal.timeout(4000),
      }),
    ]);

    if (llmsRes.status === 'fulfilled') {
      llmsTxtStatus = llmsRes.value.status;
      if (llmsRes.value.ok) {
        const text = await llmsRes.value.text();
        if (text && text.trim().length > 10) {
          hasLlmsTxt = true;
        }
      }
    }

    if (robotsRes.status === 'fulfilled') {
      robotsTxtStatus = robotsRes.value.status;
      if (robotsRes.value.ok) {
        const robotsContent = await robotsRes.value.text();
        const detectedBlocked = parseRobotsTxt(robotsContent);
        if (detectedBlocked.length > 0) {
          blockedAiBots.push(...detectedBlocked);
          aiBotsAllowed = false;
        }
      }
    }
  } catch {
    llmsTxtStatus = 0;
    robotsTxtStatus = 0;
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

    // Route resource aborting: abort images, fonts, media, and stylesheets to slash page load time by 70%+
    await page.route('**/*', (route) => {
      const resourceType = route.request().resourceType();
      if (['image', 'media', 'font', 'stylesheet'].includes(resourceType)) {
        return route.abort();
      }
      return route.continue();
    });

    // Anti-bot stealth init script without prototype pollution traps
    // Note: rebrowser-playwright already eliminates CDP Runtime.enable leaks at protocol level
    await page.addInitScript(() => {
      try {
        // Mock window.chrome runtime object if not present
        if (!('chrome' in window)) {
          (window as any).chrome = {
            runtime: {},
            loadTimes: () => {},
            csi: () => {},
            app: {},
          };
        }

        // Spoof languages safely
        Object.defineProperty(navigator, 'languages', {
          get: () => ['en-US', 'en'],
          configurable: true,
        });

        // Spoof notification permissions query
        if (window.navigator.permissions && window.navigator.permissions.query) {
          const originalQuery = window.navigator.permissions.query;
          window.navigator.permissions.query = (parameters: any) =>
            parameters.name === 'notifications'
              ? Promise.resolve({ state: Notification.permission } as any)
              : originalQuery(parameters);
        }
      } catch {
        // ignore stealth injection issues
      }
    });

    await page.goto(cleanUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 10000,
    });

    // Give dynamic client-side single page apps (Wix, Webflow, React) a short beat to hydrate JSON-LD
    await page.waitForTimeout(600);

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
        robotsTxtStatus,
        blockedAiBots,
        aiBotsAllowed,
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
        robotsTxtStatus,
        blockedAiBots,
        aiBotsAllowed,
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
      robotsTxtStatus,
      blockedAiBots,
      aiBotsAllowed,
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
    robotsTxtStatus,
    blockedAiBots,
    aiBotsAllowed,
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

  // 1b. WHATWG Microdata Extraction (for sites using itemscope / itemtype instead of JSON-LD)
  if (html.includes('itemscope') || html.includes('itemtype')) {
    try {
      const { document } = parseHTML(html);
      const targetMicrodataTypes = [
        'http://schema.org/MedicalClinic',
        'https://schema.org/MedicalClinic',
        'http://schema.org/Dentist',
        'https://schema.org/Dentist',
        'http://schema.org/Physician',
        'https://schema.org/Physician',
        'http://schema.org/Hospital',
        'https://schema.org/Hospital',
        'http://schema.org/MedicalOrganization',
        'https://schema.org/MedicalOrganization',
        'http://schema.org/LocalBusiness',
        'https://schema.org/LocalBusiness',
      ];

      for (const mType of targetMicrodataTypes) {
        const item = microdata<any>(mType, document as any);
        if (item && typeof item === 'object') {
          const typeName = mType.replace(/^https?:\/\/schema\.org\//, '');
          if (!detectedSchemas.includes(typeName)) {
            detectedSchemas.push(typeName);
          }
          if (item.name && !clinicName) {
            clinicName = String(item.name).trim();
          }
          if (item.telephone) {
            rawPhones.add(String(item.telephone).replace(/^tel:/i, ''));
          }
          if (item.address && typeof item.address === 'object' && !address) {
            address = {
              street: item.address.streetAddress,
              city: item.address.addressLocality,
              state: item.address.addressRegion,
              postalCode: item.address.postalCode,
              country: item.address.addressCountry || 'US',
            };
          }
        }
      }
    } catch {
      // ignore microdata extraction issues
    }
  }

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

  // 1. Fallback clinic name from OpenGraph / title if missing
  if (!clinicName) {
    const ogSite = $('meta[property="og:site_name"]').attr('content')?.trim();
    if (ogSite && ogSite.length > 2 && ogSite.length < 70 && !/wordpress|wix|squarespace|home/i.test(ogSite)) {
      clinicName = ogSite;
    } else {
      const ogTitle = $('meta[property="og:title"]').attr('content')?.trim();
      if (ogTitle && ogTitle.length > 2 && ogTitle.length < 70) {
        const cleanOg = ogTitle.replace(/^(home|welcome to)\s*[-|:]\s*/i, '').split(/\s*[-|–—]\s*/)[0].trim();
        if (cleanOg.length > 2 && cleanOg.length < 50) {
          clinicName = cleanOg;
        }
      }
    }
  }

  // 2. Scan DOM text for doctors and NPI numbers if missing from JSON-LD
  const bodyText = $('body').text();
  if (doctors.length === 0) {
    const docMatch = bodyText.match(/\b(Dr\.\s+[A-Z][a-z]+(?:\s+[A-Z]\.?)?\s+[A-Z][a-z]+(?:,\s*(?:DDS|DMD|MD|DO|FAGD|FACS))?)\b/);
    if (docMatch) {
      const fullDoc = docMatch[1].trim();
      const parts = fullDoc.split(/,\s*/);
      const name = parts[0];
      const credential = parts[1] || 'DDS / Clinical Director';
      const npiMatch = bodyText.match(/\b(?:NPI|Provider ID|Lic(?:ense)?\s*#?)[:#\s]+(1\d{9})\b/i);
      doctors.push({
        name,
        credential,
        npi: npiMatch ? npiMatch[1] : undefined,
      });
    }
  }

  // 3. Scan for clinical procedures in text
  const detectedProcedures: string[] = [];
  const procedureCatalog = [
    'Dental Implants',
    'Invisalign',
    'Clear Aligners',
    'Porcelain Veneers',
    'Teeth Whitening',
    'Root Canal Therapy',
    'Bone Grafting',
    'Cosmetic Dentistry',
    'Emergency Dental Care',
    'Periodontal Therapy',
    'Sedation Dentistry',
    'Crowns & Bridges',
    'Wisdom Teeth Removal',
  ];
  for (const proc of procedureCatalog) {
    const regex = new RegExp(`\\b${proc}\\b`, 'i');
    if (regex.test(bodyText)) {
      detectedProcedures.push(proc);
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
      detectedProcedures,
    },
  };
}
