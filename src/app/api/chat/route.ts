import { NextRequest, NextResponse } from 'next/server';
import { CITEMED_MASTER_KNOWLEDGE_BASE } from '@/lib/citemed-knowledge';
import { ChatMessage } from '@/lib/types';

export const runtime = 'nodejs';

function buildFallbackChatResponse(userQuery: string): string {
  const queryLower = userQuery.toLowerCase();

  if (
    queryLower.includes('wordpress') ||
    queryLower.includes('woocommerce') ||
    queryLower.includes('shopify') ||
    queryLower.includes('webflow') ||
    queryLower.includes('squarespace') ||
    queryLower.includes('wix') ||
    queryLower.includes('paste') ||
    queryLower.includes('upload') ||
    queryLower.includes('install')
  ) {
    return `### 📋 Step-by-Step CMS Code Insertion Guide

#### 1. WordPress / WooCommerce
- **Method 1 (Recommended Plugin):** Install **WPCode – Insert Headers and Footers** -> Go to **Code Snippets -> Header & Footer** -> Paste your \`<script type="application/ld+json">...\script>\` code into the **Header** box -> Save Changes.
- **Method 2 (Theme File Editor):** Go to **Appearance -> Theme File Editor -> header.php** -> Paste code directly BEFORE the closing \`</head>\` tag.
- **Hosting /llms.txt:** Upload your \`llms.txt\` file to your site root directory (\`public_html/llms.txt\`) via cPanel or SFTP.

#### 2. Shopify Store
- Go to **Online Store -> Themes -> Edit Code -> Layout -> theme.liquid**.
- Paste your JSON-LD script block directly ABOVE the closing \`</head>\` tag. Click **Save**.
- **Hosting /llms.txt:** Upload \`llms.txt\` under **Settings -> Files**. Copy CDN link. Create URL Redirect under **Online Store -> Navigation -> View URL Redirects** from \`/llms.txt\` to your CDN file link.

#### 3. Webflow
- Go to **Project Settings -> Custom Code -> Head Code**.
- Paste JSON-LD script and save changes. Publish site to domain.

#### 4. Squarespace & Wix
- **Squarespace:** **Settings -> Developer Tools -> Code Injection -> Header**.
- **Wix:** **Settings -> Custom Code -> Add Custom Code -> Set to Head -> Apply**.`;
  }

  if (
    queryLower.includes('pricing') ||
    queryLower.includes('cost') ||
    queryLower.includes('tier') ||
    queryLower.includes('roi') ||
    queryLower.includes('plan') ||
    queryLower.includes('price')
  ) {
    return `### 💰 NexusRank1 Direct Practice Pricing & ROI Structure

#### 1. Solo Practice ($199/mo or $159/mo billed annually)
- **Facility:** 1 Clinical Location & 1 Lead Physician
- **Monitoring:** 24/7 AI Citation Monitoring across ChatGPT, Perplexity, Google AI Overviews & Apple Intelligence
- **Structured Data:** 0-Error Schema.org MedicalClinic & Physician JSON-LD AST + Machine-Readable /llms.txt Manifest
- **Alerts:** Weekly Local Competitor Displacement & Steal Alerts

#### 2. Growth Clinic ($349/mo or $279/mo billed annually) — *Most Popular*
- **Facility:** Up to 3 Physicians & 1 Clinical Facility
- **Everything in Solo Practice plus:**
- **Real-Time Competitor Steal Radar™:** Instant alerts when a local competitor is cited for high-ticket procedures (Implants, Veneers, Facelifts, etc.)
- **Automated 1-Click CMS Injection Guide:** Seamless setup for WordPress, Webflow, Squarespace, and Shopify
- **Patient Lead Attribution:** Tracking of consult requests originating from generative search
- **RFC 9309 Crawler Defense:** Guaranteed crawler access for GPTBot, PerplexityBot, and ClaudeBot

#### 3. Surgical Group ($699/mo or $559/mo billed annually)
- **Facility:** Up to 5 Practice Locations & 10 Physicians
- **Everything in Growth Clinic plus:**
- **Multi-Location Cross-Linked Entity Graph:** Unified knowledge graph across all regional facilities
- **Custom Clinical Ontologies:** Custom procedure mapping for complex surgical specialties
- **HIPAA CRM Webhooks:** Direct lead dispatch to Dentrix, ModMed, AthenaHealth, or Kareo

#### 🎯 The "1 High-Ticket Patient" ROI Guarantee:
Capturing just 1 dental implant ($4,500), Invisalign case ($5,200), or surgical procedure ($12,000+) covers your entire annual subscription multiple times over—generating **500% to 3,000%+ Net Practice ROI**!`;
  }

  if (
    queryLower.includes('pitch') ||
    queryLower.includes('script') ||
    queryLower.includes('outreach') ||
    queryLower.includes('email') ||
    queryLower.includes('surgeon')
  ) {
    return `### ✉️ Clinical Inquiry Script for Practice Owners & Medical Directors

**Subject:** Missing /llms.txt file on [Clinic Name] (AI Search Blindspot)

> Hi Dr. [Last Name],
>
> When prospective patients query ChatGPT Search or Perplexity for top [Procedure, e.g. Dental Implants or Rhinoplasty] specialists in [City], AI engines bypass traditional websites and verify official NPI licensure in structured data before making recommendations.
>
> We ran a quick GEO scan on your practice domain—your AI search readiness score is currently 35/100 because your site is missing a Physician @graph schema and a domain /llms.txt manifest.
>
> We have generated the complete 0-error Schema.org JSON-LD and /llms.txt manifest for your clinic. Would you be open to a 2-minute diagnostic showing how this prevents local competitors from winning your patient recommendations?
>
> Best regards,  
> Clinical GEO Defense Team | NexusRank1`;
  }

  return `### 🤖 Master NexusRank1 Practice AI Advisor

I am fully initialized with the official **NexusRank1 Clinical Practice GEO Knowledge Base**.

You can ask me about:
1. **CMS Code Insertion Guides:** Step-by-step instructions for WordPress, Shopify, Webflow, Squarespace & Wix
2. **Direct Practice Pricing & Patient ROI:** Solo ($199/mo), Growth ($349/mo), and Surgical Group ($699/mo)
3. **Competitor Steal Radar:** How to reclaim patients when ChatGPT or Perplexity recommends a local rival
4. **Schema.org @graph & /llms.txt Standards:** Federal NPI registry, state licensure, and accredited procedure ontologies

How can I assist your practice with AI search defense today?`;
}

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const messages: ChatMessage[] = Array.isArray(body.messages) ? body.messages : [];

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat';

    const systemPrompt = `You are the Master NexusRank1 Practice AI Advisor, an elite Healthcare Generative Engine Optimization (GEO) strategist.
Use the following official NexusRank1 Knowledge Base to answer user questions with complete accuracy, authority, and professional clarity:

${CITEMED_MASTER_KNOWLEDGE_BASE}

Instructions:
- Provide structured, actionable, and formatted Markdown responses.
- Emphasize NPI/Ahpra/GMC credentials, Schema @graph structure, /llms.txt deployment, step-by-step CMS code pasting (WordPress, Shopify, Webflow, Squarespace), and direct clinic pricing tiers (Solo Practice $199/mo, Growth Clinic $349/mo, Surgical Group $699/mo) with the 1 High-Ticket Patient ROI Guarantee.
- If asked for practice emails, objection handling, or technical schemas, output full ready-to-use templates.`;

    if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_openrouter_api_key')) {
      const lastUserMsg = messages.filter((m) => m.role === 'user').pop()?.content || '';
      const fallbackReply = buildFallbackChatResponse(lastUserMsg);
      return NextResponse.json({
        message: {
          role: 'assistant',
          content: fallbackReply,
          timestamp: new Date().toISOString(),
        },
      });
    }

    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://nexusrank1.com',
          'X-Title': 'NexusRank1 Master Chatbot',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: formattedMessages,
          temperature: 0.3,
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) {
        const fallbackRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://nexusrank1.com',
            'X-Title': 'NexusRank1 Master Chatbot',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.0-flash-001',
            messages: formattedMessages,
            temperature: 0.3,
          }),
          signal: AbortSignal.timeout(15000),
        });

        if (fallbackRes.ok) {
          const resData = await fallbackRes.json();
          const replyContent = resData.choices?.[0]?.message?.content;
          if (replyContent) {
            return NextResponse.json({
              message: {
                role: 'assistant',
                content: replyContent,
                timestamp: new Date().toISOString(),
              },
            });
          }
        }

        const lastUserMsg = messages.filter((m) => m.role === 'user').pop()?.content || '';
        return NextResponse.json({
          message: {
            role: 'assistant',
            content: buildFallbackChatResponse(lastUserMsg),
            timestamp: new Date().toISOString(),
          },
        });
      }

      const resData = await response.json();
      const replyContent = resData.choices?.[0]?.message?.content;

      if (!replyContent) {
        const lastUserMsg = messages.filter((m) => m.role === 'user').pop()?.content || '';
        return NextResponse.json({
          message: {
            role: 'assistant',
            content: buildFallbackChatResponse(lastUserMsg),
            timestamp: new Date().toISOString(),
          },
        });
      }

      return NextResponse.json({
        message: {
          role: 'assistant',
          content: replyContent,
          timestamp: new Date().toISOString(),
        },
      });
    } catch {
      const lastUserMsg = messages.filter((m) => m.role === 'user').pop()?.content || '';
      return NextResponse.json({
        message: {
          role: 'assistant',
          content: buildFallbackChatResponse(lastUserMsg),
          timestamp: new Date().toISOString(),
        },
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Chatbot execution failed.' },
      { status: 500 }
    );
  }
}
