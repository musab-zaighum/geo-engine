import { NextRequest, NextResponse } from 'next/server';
import { discoverClinicUrl } from '@/lib/agentic-search';
import { executeOssScraperPipeline } from '@/lib/oss-scrapers-engine';
import { distillDomAndExtractSchema } from '@/lib/stagehand-distiller';
import { AuditResponse } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawInput = body.url || body.query;

    if (!rawInput || typeof rawInput !== 'string' || rawInput.trim() === '') {
      return NextResponse.json(
        { error: 'A valid website URL or business search query is required.' },
        { status: 400 }
      );
    }

    // 1. Agentic Web Search Discovery
    const discovery = await discoverClinicUrl(rawInput);
    const targetUrl = discovery.targetUrl;

    // 2. Execute Official Open-Source Scrapers Pipeline (Firecrawl SDK / Crawl4AI Engine / Stagehand)
    const scrapeResult = await executeOssScraperPipeline(targetUrl);

    const {
      success: pageFetchOk,
      html,
      hasLlmsTxt,
      llmsTxtStatus,
      engineUsed,
    } = scrapeResult;

    if (!pageFetchOk || !html) {
      const failedResponse: AuditResponse = {
        url: targetUrl,
        query: rawInput,
        isDirectUrl: discovery.isDirectUrl,
        isPlaywrightRendered: engineUsed.includes('Crawl4AI') || engineUsed.includes('Firecrawl'),
        discoveredTitle: discovery.discoveredTitle,
        snippet: discovery.snippet,
        hasLlmsTxt,
        llmsTxtStatus,
        hasMedicalSchema: false,
        detectedSchemas: [],
        readinessScore: hasLlmsTxt ? 15 : 0,
        criticalIssues: [
          'Website domain could not be fetched or blocked automated crawler connection.',
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

    // 3. Stagehand DOM Distillation & Schema Extractor
    const distilled = distillDomAndExtractSchema(html);
    const { detectedSchemas, hasMedicalSchema, registrationNumbers, title, metaDescription } = distilled;

    // 4. Calculate Readiness Score (0-100)
    let score = 0;
    if (pageFetchOk) score += 20;
    if (detectedSchemas.length > 0) score += 25;
    if (hasMedicalSchema) score += 25;
    if (hasLlmsTxt) score += 20;
    if (metaDescription || title) score += 10;

    const readinessScore = Math.min(100, score);

    // 5. Critical Issues Identification
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

    if (registrationNumbers.length === 0) {
      criticalIssues.push(
        'Medical license registration IDs (AHPRA, NPI, or GMC) are missing from detected structured data & page headers.'
      );
    }

    // 6. Actionable Recommendations
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
      query: rawInput,
      isDirectUrl: discovery.isDirectUrl,
      isPlaywrightRendered: engineUsed.includes('Crawl4AI') || engineUsed.includes('Firecrawl'),
      discoveredTitle: title || discovery.discoveredTitle,
      snippet: discovery.snippet,
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
