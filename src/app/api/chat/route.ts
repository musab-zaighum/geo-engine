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
    return `### 💰 NexusRank1 Direct Clinic Pricing & ROI Structure

#### The Complete Clinic Local Growth & AI Audit System ($1,500 One-Time Investment)
- **Permanent Infrastructure:** 0 ongoing monthly software fees or agency retainers.
- **Pillar 1: Geo-Visibility Grid Tracking:** Maps 3x3 mile neighborhood grids and benchmarks visibility against top rival clinics in your exact zip code.
- **Pillar 2: Google Profile & Citation Cleanup:** Resolves category mismatches and syncs phone/address consistency across 50+ medical directories.
- **Pillar 3: Front-Desk Automated Review Loops:** Reception desk QR counter card and post-appointment SMS loop to distill 5-star clinical sentiment.
- **Pillar 4: AI Model Readability & Search Defense:** 100% verified clinical schema and ChatGPT /llms.txt practice factsheet linking CMS NPPES NPI-1 credentials and surgical billing codes (CDT/CPT).
- **Zero-Work Concierge Setup:** Our team installs and configures 100% of the code directly on your WordPress, Webflow, Squarespace, or custom site within 24 hours.

#### 🎯 The "1 High-Ticket Patient" ROI Guarantee:
Elective treatments (dental implants, Invisalign, full-arch cases, facial aesthetics) average $4,500 to $25,000+. Acquiring just 1 new patient through AI search covers the entire $1,500 investment 3x to 16x over! If you don't acquire a verified patient consultation within 90 days, we issue a 100% full refund.`;
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

  if (
    queryLower.includes('competitor') ||
    queryLower.includes('rival') ||
    queryLower.includes('steal') ||
    queryLower.includes('displace') ||
    queryLower.includes('outrank') ||
    queryLower.includes('implant')
  ) {
    return `### 🛡️ Local Competitor Displacement & Patient Defense Strategy

#### Why Local Competitors Are Winning Your High-Ticket Patients:
When prospective patients query ChatGPT Search, Perplexity, or Google AI Overviews for high-ticket procedures (e.g. *"Best All-on-4 dental implants in Austin"* or *"Top cosmetic surgeon for deep plane facelifts"*), AI answer engines do not display Google Maps 3-packs. Instead, they recommend whichever local practice has published **0-error Clinical Knowledge Graphs (Schema.org)** and a verified **domain /llms.txt factsheet**.

If your site lacks these, AI engines automatically redirect those $5,000–$40,000 consultations to your #1 local competitor.

#### The NexusRank1 Countermeasure ($1,500 One-Time Investment):
1. **Pillar 1: Local Geo-Grid Tracking:** Pinpoints coordinate-by-coordinate where rival practices displace you within your 5-mile radius.
2. **Pillar 2: Directory & NAP Authority:** Aligns your primary medical sub-specialty across Google Business Profile and 50+ healthcare directories.
3. **Pillar 3: Automated Review Loops:** Deploys front-desk QR stands and SMS sequences to distill procedure-specific patient sentiment.
4. **Pillar 4: Verified Clinical Knowledge Architecture:** Directly links your CMS NPPES NPI-1 license and ADA CDT/CPT procedural codes.

#### 🎯 90-Day 1-Patient ROI Guarantee:
A single implant or surgical case pays for the entire $1,500 deployment 3x to 16x over. If you don't receive a verified consultation within 90 days, we issue a 100% full refund.`;
  }

  return `### 🤖 Master NexusRank1 Practice AI Advisor

I am fully initialized with the official **NexusRank1 Clinical Practice GEO Knowledge Base**.

You can ask me about:
1. **CMS Code Insertion Guides:** Step-by-step instructions for WordPress, Shopify, Webflow, Squarespace & Wix
2. **Direct Clinic Pricing & Patient ROI:** The complete $1,500 one-time deployment with 0 monthly retainers and the 90-Day 1-Patient ROI Guarantee
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

    let messages: ChatMessage[] = [];
    if (Array.isArray(body.messages) && body.messages.length > 0) {
      messages = body.messages;
    } else if (typeof body.message === 'string' && body.message.trim().length > 0) {
      messages = [{ id: '1', role: 'user', content: body.message.trim(), timestamp: new Date().toISOString() }];
    } else if (typeof body.query === 'string' && body.query.trim().length > 0) {
      messages = [{ id: '1', role: 'user', content: body.query.trim(), timestamp: new Date().toISOString() }];
    }

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'A message or messages array is required.' },
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
- Emphasize NPI/Ahpra/GMC credentials, Schema @graph structure, /llms.txt deployment, step-by-step CMS code pasting (WordPress, Shopify, Webflow, Squarespace), zero-work concierge installation, and direct clinic pricing: $1,500 flat one-time deployment (0 monthly retainers) backed by the 90-Day 1-Patient ROI Guarantee.
- If asked for practice emails, objection handling, or technical schemas, output full ready-to-use templates.`;

    if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_openrouter_api_key')) {
      const lastUserMsg = messages.filter((m) => m.role === 'user').pop()?.content || '';
      const fallbackReply = buildFallbackChatResponse(lastUserMsg);
      return NextResponse.json({
        reply: fallbackReply,
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
              reply: replyContent,
              message: {
                role: 'assistant',
                content: replyContent,
                timestamp: new Date().toISOString(),
              },
            });
          }
        }

        const lastUserMsg = messages.filter((m) => m.role === 'user').pop()?.content || '';
        const fallback = buildFallbackChatResponse(lastUserMsg);
        return NextResponse.json({
          reply: fallback,
          message: {
            role: 'assistant',
            content: fallback,
            timestamp: new Date().toISOString(),
          },
        });
      }

      const resData = await response.json();
      const replyContent = resData.choices?.[0]?.message?.content;

      if (!replyContent) {
        const lastUserMsg = messages.filter((m) => m.role === 'user').pop()?.content || '';
        const fallback = buildFallbackChatResponse(lastUserMsg);
        return NextResponse.json({
          reply: fallback,
          message: {
            role: 'assistant',
            content: fallback,
            timestamp: new Date().toISOString(),
          },
        });
      }

      return NextResponse.json({
        reply: replyContent,
        message: {
          role: 'assistant',
          content: replyContent,
          timestamp: new Date().toISOString(),
        },
      });
    } catch {
      const lastUserMsg = messages.filter((m) => m.role === 'user').pop()?.content || '';
      const fallback = buildFallbackChatResponse(lastUserMsg);
      return NextResponse.json({
        reply: fallback,
        message: {
          role: 'assistant',
          content: fallback,
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
