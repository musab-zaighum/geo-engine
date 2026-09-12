/**
 * Unified Open-Source Scrapers & Processing Pipeline
 * 
 * Powered by official open-source packages:
 * 1. Crawl4AI (unclecode/crawl4ai) - Python AsyncWebCrawler & Markdown Engine
 * 2. Firecrawl (@mendable/firecrawl-js) - Official Firecrawl Scrape & Search SDK
 * 3. Stagehand (stagehand) - Official Browserbase Agent & Zod Extractor
 * 4. Mozilla Readability (@mozilla/readability) - Official Mozilla Article DOM Parser
 * 5. Turndown (turndown & turndown-plugin-gfm) - Official GFM Markdown Converter
 * 6. Google Schema-DTS (schema-dts) - Official Schema.org Type Validation
 */

import FirecrawlApp from '@mendable/firecrawl-js';
import { extractReadabilityMarkdown } from './readability-turndown';
import { validateMedicalSchemaJson } from './schema-validator';
import { execFile } from 'child_process';
import path from 'path';

export interface OssScraperResult {
  url: string;
  success: boolean;
  html: string;
  markdown: string;
  hasLlmsTxt: boolean;
  llmsTxtStatus: number;
  detectedSchemas: string[];
  hasMedicalSchema: boolean;
  hasRegistrationId: boolean;
  pageTitle?: string;
  metaDescription?: string;
  engineUsed: string;
  errorMessage?: string;
}

export async function executeOssScraperPipeline(targetUrl: string): Promise<OssScraperResult> {
  // 1. Check llms.txt at origin domain
  let hasLlmsTxt = false;
  let llmsTxtStatus = 0;
  try {
    const origin = new URL(targetUrl).origin;
    const llmsRes = await fetch(`${origin}/llms.txt`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 CiteMedAuditor/1.0',
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

  // 2. Try Firecrawl SDK if FIRECRAWL_API_KEY environment variable is set
  const firecrawlKey = process.env.FIRECRAWL_API_KEY;
  if (firecrawlKey && firecrawlKey.trim() !== '') {
    try {
      const firecrawl = new FirecrawlApp({ apiKey: firecrawlKey });
      const scrapeRes: any = await firecrawl.scrapeUrl(targetUrl, {
        formats: ['markdown', 'html'],
      });

      if (scrapeRes && scrapeRes.success && scrapeRes.html) {
        const readability = extractReadabilityMarkdown(scrapeRes.html, targetUrl);
        const schemaValidation = validateMedicalSchemaJson(scrapeRes.html);
        return {
          url: targetUrl,
          success: true,
          html: scrapeRes.html,
          markdown: scrapeRes.markdown || readability.markdown,
          hasLlmsTxt,
          llmsTxtStatus,
          detectedSchemas: schemaValidation.detectedTypes,
          hasMedicalSchema: schemaValidation.hasMedicalType,
          hasRegistrationId: schemaValidation.hasRegistrationId,
          pageTitle: readability.title,
          metaDescription: readability.excerpt,
          engineUsed: 'Firecrawl SDK + Mozilla Readability',
        };
      }
    } catch (err: any) {
      console.warn('Firecrawl SDK note:', err?.message || err);
    }
  }

  // 3. Try official Python Crawl4AI AsyncWebCrawler process
  try {
    const pythonPath = path.join(process.cwd(), '.venv', 'bin', 'python3');
    const scriptPath = path.join(process.cwd(), 'scripts', 'crawl4ai_runner.py');

    const pythonOutput = await new Promise<string>((resolve, reject) => {
      execFile(
        pythonPath,
        [scriptPath, targetUrl],
        { maxBuffer: 10 * 1024 * 1024, timeout: 15000 },
        (err, stdout) => {
          if (err && !stdout) {
            return reject(err);
          }
          resolve(stdout);
        }
      );
    });

    if (pythonOutput) {
      const data = JSON.parse(pythonOutput);
      if (data.success && data.html) {
        const readability = extractReadabilityMarkdown(data.html, targetUrl);
        const schemaValidation = validateMedicalSchemaJson(data.html);
        return {
          url: data.url || targetUrl,
          success: true,
          html: data.html,
          markdown: data.markdown || readability.markdown,
          hasLlmsTxt,
          llmsTxtStatus,
          detectedSchemas: schemaValidation.detectedTypes,
          hasMedicalSchema: schemaValidation.hasMedicalType,
          hasRegistrationId: schemaValidation.hasRegistrationId,
          pageTitle: readability.title,
          metaDescription: readability.excerpt,
          engineUsed: 'Crawl4AI + Mozilla Readability + Google Schema-DTS',
        };
      }
    }
  } catch (err: any) {
    console.warn('Crawl4AI execution note:', err?.message || err);
  }

  // 4. Fast HTTP Fetch + Mozilla Readability & Turndown Parser
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
      const readability = extractReadabilityMarkdown(html, targetUrl);
      const schemaValidation = validateMedicalSchemaJson(html);

      return {
        url: targetUrl,
        success: true,
        html,
        markdown: readability.markdown,
        hasLlmsTxt,
        llmsTxtStatus,
        detectedSchemas: schemaValidation.detectedTypes,
        hasMedicalSchema: schemaValidation.hasMedicalType,
        hasRegistrationId: schemaValidation.hasRegistrationId,
        pageTitle: readability.title,
        metaDescription: readability.excerpt,
        engineUsed: 'Mozilla Readability + Turndown GFM + Schema-DTS',
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
      hasRegistrationId: false,
      engineUsed: 'Fast HTTP Fallback',
      errorMessage: err?.message || 'Failed to fetch domain content.',
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
    hasRegistrationId: false,
    engineUsed: 'Fast HTTP Fallback',
    errorMessage: 'Unable to process target URL.',
  };
}
