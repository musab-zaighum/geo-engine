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
    return `### 💰 NexusRank1 Tiered Agency Pricing & Financial Structure

#### Agency Growth License ($297/mo)
- **Wholesale Platform Cost:** **$297/month flat** for unlimited healthcare GEO audits, Schema.org @graph generation, and /llms.txt builds.
- **Client Retainer Recommendations:**
  - **Solo Specialist Doctor:** **$750 - $1,497/mo** (or $1,497 one-off setup).
  - **Multi-Doctor Medical Clinic:** **$1,250 - $2,497/mo** (or $2,497 one-off setup).
- **Agency Net Margin:** **93%+ net profit margins** with sub-5-minute automated delivery.
- **Deliverables:** Complete MedicalClinic/Physician @graph JSON-LD, validated NPI registry credentials, /llms.txt manifest, and GBP Markdown entity bio.

For example, retaining **10 clinical clients at $997/mo** generates **$9,970/mo in recurring agency revenue** on a single $297/mo platform cost—yielding **$9,673/mo net agency profit (97% margin)**!`;
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
> When prospective patients query ChatGPT Search or Perplexity for top [Procedure, e.g. Rhinoplasty] specialists in [City], AI engines bypass general directories and verify official NPI licensure in structured data before making recommendations.
>
> We ran a quick GEO scan on your domain—your AI search readiness score is currently 35/100 because your site is missing a Physician @graph schema and a domain /llms.txt file.
>
> We have generated the complete 0-error Schema.org JSON-LD and /llms.txt manifest for your practice. Would you be open to a 2-minute diagnostic video showing you how to install this?
>
> Best regards,  
> [Your Name] | NexusRank1 GEO Advisor`;
  }

  return `### 🤖 Master NexusRank1 AI Advisor

I am fully initialized with the expanded **NexusRank1 Clinical Knowledge Base**.

You can ask me about:
1. **CMS Code Insertion Guides:** Step-by-step for WordPress, Shopify, Webflow, Squarespace & Wix
2. **Agency Pricing & Margins:** $297/mo Growth License with 93%+ net margin on $750–$2,497/mo client retainers
3. **Pitches & Cold Email Scripts** tailored for specialist surgeons & practice directors
4. **Schema.org @graph & /llms.txt Standards** (NPI licensure, Ahpra, GMC credentials)

How can I assist your practice or agency today?`;
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

    const systemPrompt = `You are the Master NexusRank1 AI Advisor, an elite Healthcare Generative Engine Optimization (GEO) strategist.
Use the following official NexusRank1 Knowledge Base to answer user questions with complete accuracy, authority, and professional clarity:

${CITEMED_MASTER_KNOWLEDGE_BASE}

Instructions:
- Provide structured, actionable, and formatted Markdown responses.
- Emphasize NPI/Ahpra/GMC credentials, Schema @graph structure, /llms.txt deployment, step-by-step CMS code pasting (WordPress, Shopify, Webflow, Squarespace), and agency pricing tiers ($297/mo Growth License with 93%+ margins).
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
