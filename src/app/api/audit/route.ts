import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { AuditResponse } from '@/lib/types';

export const runtime = 'nodejs';

function normalizeUrl(rawUrl: string): string {
  let urlStr = rawUrl.trim();
  if (!urlStr.startsWith('http://') && !urlStr.startsWith('https://')) {
    urlStr = 'https://' + urlStr;
  }
  return urlStr;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawUrl = body.url;

    if (!rawUrl || typeof rawUrl !== 'string') {
      return NextResponse.json(
        { error: 'A valid URL parameter is required.' },
        { status: 400 }
      );
    }

    const targetUrl = normalizeUrl(rawUrl);
    let parsedUrlObj: URL;
    try {
      parsedUrlObj = new URL(targetUrl);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format provided.' },
        { status: 400 }
      );
    }

    const origin = parsedUrlObj.origin;
    const headers = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 CiteMedAuditor/1.0',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    };

    // 1. Check llms.txt at origin domain
    let hasLlmsTxt = false;
    let llmsTxtStatus = 0;

    try {
      const llmsUrl = `${origin}/llms.txt`;
      const llmsRes = await fetch(llmsUrl, {
        method: 'GET',
        headers,
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

    // 2. Fetch target URL homepage HTML
    let html = '';
    let pageFetchOk = false;

    try {
      const pageRes = await fetch(targetUrl, {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(8000),
        redirect: 'follow',
      });
      if (pageRes.ok) {
        html = await pageRes.text();
        pageFetchOk = true;
      }
    } catch {
      pageFetchOk = false;
    }

    if (!pageFetchOk || !html) {
      // Fallback audit response if domain cannot be fetched
      const failedResponse: AuditResponse = {
        url: targetUrl,
        hasLlmsTxt,
        llmsTxtStatus,
        hasMedicalSchema: false,
        detectedSchemas: [],
        readinessScore: hasLlmsTxt ? 15 : 0,
        criticalIssues: [
          'Website domain could not be fetched or blocked automated request.',
          ...(hasLlmsTxt
            ? []
            : ['Missing /llms.txt AI crawler standard file at domain root.']),
          'Unable to verify JSON-LD Medical Schema on homepage.',
        ],
        recommendations: [
          'Verify website accessibility, server firewall rules, and SSL configuration.',
          'Generate and publish an /llms.txt file to guide AI engines (Perplexity, SearchGPT, Claude).',
          'Embed spec-compliant MedicalClinic or Physician JSON-LD schema headers.',
        ],
      };
      return NextResponse.json(failedResponse);
    }

    // 3. Parse HTML with Cheerio & extract JSON-LD
    const $ = cheerio.load(html);
    const detectedSchemas: string[] = [];
    let hasMedicalSchema = false;

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
              const types = Array.isArray(obj['@type'])
                ? obj['@type']
                : [obj['@type']];
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
        // Ignore JSON parse errors in script tag
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

    hasMedicalSchema = detectedSchemas.some((schemaType) =>
      medicalKeywords.some(
        (keyword) => schemaType.toLowerCase() === keyword.toLowerCase()
      )
    );

    // Metadata checks
    const pageTitle = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content')?.trim();

    // 4. Calculate Readiness Score (0-100)
    let score = 0;
    if (pageFetchOk) score += 20;
    if (detectedSchemas.length > 0) score += 25;
    if (hasMedicalSchema) score += 25;
    if (hasLlmsTxt) score += 20;
    if (metaDescription && pageTitle) score += 10;

    const readinessScore = Math.min(100, score);

    // 5. Critical Issues
    const criticalIssues: string[] = [];
    if (!hasLlmsTxt) {
      criticalIssues.push(
        'Missing standard /llms.txt file. AI search agents (Perplexity, SearchGPT, Claude) cannot efficiently index your clinical services.'
      );
    }
    if (detectedSchemas.length === 0) {
      criticalIssues.push(
        'No JSON-LD structured data found on the website. AI search models cannot detect structured NAP or entity credentials.'
      );
    } else if (!hasMedicalSchema) {
      criticalIssues.push(
        `Generic schemas found (${detectedSchemas.join(', ')}), but specialized Healthcare schema (MedicalClinic or Physician) is missing.`
      );
    }

    if (
      !html.toLowerCase().includes('npi') &&
      !html.toLowerCase().includes('ahpra') &&
      !html.toLowerCase().includes('gmc')
    ) {
      criticalIssues.push(
        'Medical license registration IDs (AHPRA, NPI, or GMC) are missing from detected structured data.'
      );
    }

    // 6. Recommendations
    const recommendations: string[] = [];
    if (!hasLlmsTxt) {
      recommendations.push(
        'Deploy an /llms.txt file at domain root containing structured NAP, specialties, doctor credentials, and direct procedure links.'
      );
    }
    if (!hasMedicalSchema) {
      recommendations.push(
        'Inject a rich MedicalClinic or Physician JSON-LD schema into your homepage HTML head section.'
      );
    }
    recommendations.push(
      'Include practitioner registration numbers (AHPRA, NPI, GMC) inside Physician schema nodes to establish high E-E-A-T trust signals.'
    );
    recommendations.push(
      'Generate a standalone Raw Markdown Profile to use for Google Business Profile (GBP) AI search fallback and medical directory syndication.'
    );

    const result: AuditResponse = {
      url: targetUrl,
      hasLlmsTxt,
      llmsTxtStatus,
      hasMedicalSchema,
      detectedSchemas,
      readinessScore,
      criticalIssues,
      recommendations,
    };

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to complete website audit.' },
      { status: 500 }
    );
  }
}
