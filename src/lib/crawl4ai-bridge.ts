import { execFile } from 'child_process';
import path from 'path';
import * as cheerio from 'cheerio';

export interface Crawl4AIBridgeResult {
  url: string;
  success: boolean;
  html: string;
  markdown: string;
  hasLlmsTxt: boolean;
  llmsTxtStatus: number;
  detectedSchemas: string[];
  hasMedicalSchema: boolean;
  pageTitle?: string;
  metaDescription?: string;
  isCrawl4AIRendered: boolean;
  errorMessage?: string;
}

export async function crawlWithCrawl4AI(targetUrl: string): Promise<Crawl4AIBridgeResult> {
  const pythonPath = path.join(process.cwd(), '.venv', 'bin', 'python3');
  const scriptPath = path.join(process.cwd(), 'scripts', 'crawl4ai_runner.py');

  // 1. Check llms.txt at domain origin root
  let hasLlmsTxt = false;
  let llmsTxtStatus = 0;
  try {
    const origin = new URL(targetUrl).origin;
    const llmsRes = await fetch(`${origin}/llms.txt`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Crawl4AI-Bridge/1.0',
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

  // 2. Execute Python Crawl4AI AsyncWebCrawler process
  try {
    const pythonOutput = await new Promise<string>((resolve, reject) => {
      execFile(pythonPath, [scriptPath, targetUrl], { maxBuffer: 10 * 1024 * 1024, timeout: 20000 }, (err, stdout) => {
        if (err && !stdout) {
          return reject(err);
        }
        resolve(stdout);
      });
    });

    if (pythonOutput) {
      const data = JSON.parse(pythonOutput);
      if (data.success && data.html) {
        const parsed = parseHtmlAndSchemas(data.html);
        return {
          url: data.url || targetUrl,
          success: true,
          html: data.html,
          markdown: data.markdown || '',
          hasLlmsTxt,
          llmsTxtStatus,
          detectedSchemas: parsed.detectedSchemas,
          hasMedicalSchema: parsed.hasMedicalSchema,
          pageTitle: parsed.pageTitle,
          metaDescription: parsed.metaDescription,
          isCrawl4AIRendered: true,
        };
      }
    }
  } catch (err: any) {
    console.warn('Crawl4AI Python bridge note:', err?.message || err);
  }

  // 3. Fallback to standard fetch + cheerio if Crawl4AI process times out or fails
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
      const parsed = parseHtmlAndSchemas(html);
      return {
        url: targetUrl,
        success: true,
        html,
        markdown: '',
        hasLlmsTxt,
        llmsTxtStatus,
        detectedSchemas: parsed.detectedSchemas,
        hasMedicalSchema: parsed.hasMedicalSchema,
        pageTitle: parsed.pageTitle,
        metaDescription: parsed.metaDescription,
        isCrawl4AIRendered: false,
      };
    }
  } catch (err: any) {
    return {
      url: targetUrl,
      success: false,
      html: '',
      markdown: '',
      hasLlmsTxt,
      llmsTxtStatus,
      detectedSchemas: [],
      hasMedicalSchema: false,
      isCrawl4AIRendered: false,
      errorMessage: err?.message || 'Failed to fetch domain HTML.',
    };
  }

  return {
    url: targetUrl,
    success: false,
    html: '',
    markdown: '',
    hasLlmsTxt,
    llmsTxtStatus,
    detectedSchemas: [],
    hasMedicalSchema: false,
    isCrawl4AIRendered: false,
    errorMessage: 'Unable to render site content via Crawl4AI.',
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
      // ignore JSON parse error
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
