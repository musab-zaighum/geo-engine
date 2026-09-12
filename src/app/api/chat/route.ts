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
    queryLower.includes('wholesale') ||
    queryLower.includes('retail') ||
    queryLower.includes('margin') ||
    queryLower.includes('profit')
  ) {
    return `### 💰 CiteMed Tiered Agency Pricing & Financial Structure

#### Tier 1: Solo Specialist Doctor
- **Suggested Retail Price:** **$1,497 one-off** (or $197/mo retainer).
- **Wholesale CiteMed Cost:** **$497 one-off**.
- **Agency Net Margin:** **$1,000 profit per practitioner**.
- **Deliverables:** Single \`Physician\` Schema.org JSON-LD, validated Ahpra/NPI registration credentials, \`/llms.txt\` entry, Google Business Profile markdown entity bio.

#### Tier 2: Multi-Doctor Medical Clinic
- **Suggested Retail Price:** **$2,497 one-off** (or $349/mo retainer).
- **Wholesale CiteMed Cost:** **$897 one-off**.
- **Agency Net Margin:** **$1,600 profit per clinic**.
- **Deliverables:** Complete \`MedicalClinic\` \`@graph\` ontology with multiple nested doctor nodes, location/operating hours, \`/llms.txt\` root discovery file, clinic triage profile.

For example, closing **5 Solo Doctors** and **5 Medical Clinics** generates **$19,970 in Total Client Revenue** and **$13,000 Net Agency Profit**!`;
  }

  if (
    queryLower.includes('pitch') ||
    queryLower.includes('script') ||
    queryLower.includes('outreach') ||
    queryLower.includes('email') ||
    queryLower.includes('surgeon')
  ) {
    return `### ✉️ Cold Outreach Script for Solo Specialist Surgeons

**Subject:** Missing /llms.txt file on [Doctor / Clinic Name] (AI Search Blindspot)

> Hi Dr. [Last Name],
>
> When prospective patients query ChatGPT Search or Perplexity for top [Procedure, e.g. Rhinoplasty] specialists in [City], AI engines bypass general directories and verify Ahpra/NPI license IDs in structured data before making recommendations.
>
> We ran a quick GEO scan on your profile—your AI readiness score is currently 35/100 because your site is missing a Physician @graph schema and a domain /llms.txt file.
>
> Our $1,497 setup installs this entire infrastructure in 48 hours. Would you like to review your 2-minute diagnostic report?
>
> Best regards,  
> [Your Name] | CiteMed GEO Advisor`;
  }

  return `### 🤖 Master CiteMed AI Advisor

I am fully initialized with the expanded **CiteMed Knowledge Base**.

You can ask me about:
1. **CMS Code Insertion Guides:** Step-by-step for WordPress, Shopify, Webflow, Squarespace & Wix
2. **Tiered Agency Pricing:** Solo Doctors ($1,497 retail / $497 wholesale) vs Clinics ($2,497 retail / $897 wholesale)
3. **Pitches & Cold Email Scripts** tailored for specialist surgeons & practice directors
4. **Schema.org @graph & /llms.txt Standards** (Ahpra, NPI, GMC license credentials)

How can I assist your practice or agency today?`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: ChatMessage[] = body.messages || [];

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet';

    const systemPrompt = `You are the Master CiteMed AI Advisor, an elite Healthcare Generative Engine Optimization (GEO) strategist.
Use the following official CiteMed Knowledge Base to answer user questions with complete accuracy, authority, and professional clarity:

${CITEMED_MASTER_KNOWLEDGE_BASE}

Instructions:
- Provide structured, actionable, and formatted Markdown responses.
- Emphasize Ahpra/NPI/GMC credentials, Schema @graph structure, /llms.txt deployment, step-by-step CMS code pasting (WordPress, Shopify, Webflow, Squarespace), and the $1,497 solo / $2,497 clinic pricing tiers.
- If asked for cold emails, objection handling, or technical schemas, output full ready-to-use templates.`;

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
          'HTTP-Referer': 'https://citemed-geo.internal',
          'X-Title': 'CiteMed Master Chatbot',
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
            'HTTP-Referer': 'https://citemed-geo.internal',
            'X-Title': 'CiteMed Master Chatbot',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'openai/gpt-4o-mini',
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
