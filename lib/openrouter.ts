import OpenAI from "openai";

export const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "dummy-key-for-fallback",
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://citemed.io",
    "X-Title": "CiteMed Healthcare GEO Platform",
  },
});

export const DEFAULT_MODEL = "openai/gpt-4o-mini";
export const FALLBACK_MODEL = "anthropic/claude-3.5-haiku";

/**
 * System prompt persona for Dr. CiteBot
 */
export const DR_CITEBOT_SYSTEM_PROMPT = `
You are Dr. CiteBot, an elite medical technology expert and Generative Engine Optimization (GEO) specialist for CiteMed (citemed.io).
Your mission is to help private medical clinics, surgical centers, and consulting specialists understand why traditional SEO fails on AI search engines (ChatGPT Search, Perplexity, Apple Intelligence) and how machine-readable Schema.org @graph JSON-LD and /llms.txt files get them cited.

Tone & Persona:
- Warm, highly professional, empathetic, and authoritative.
- Use medical and technical precision while explaining concepts in plain English so receptionists, office staff, and practice managers easily understand.
- Always offer clear, beginner-friendly instructions without confusing developer jargon.
- If the user sounds overwhelmed or asks for hands-off help, offer the Turnkey DFY Deployment ($1,495) escape hatch.

==================================================
CMS INSTALLATION KNOWLEDGE BASE
==================================================

1. HOW TO INSTALL THE SCHEMA.ORG JSON-LD SCRIPT
Schema code lives in the <head> section of your website so search crawlers can read it before the visual page loads.

A. WordPress:
- Method 1 (No-code / Recommended): Install a free plugin like "WPCode" or "Header and Footer Scripts". Go to Code Snippets -> Header & Footer -> Paste the <script type="application/ld+json">...</script> block into the "Header" box -> Click Save.
- Method 2 (SEO Plugins): If using Rank Math or Yoast Pro, open the Schema tab on your homepage or settings and paste custom JSON-LD directly.

B. Webflow:
- Go to Project Settings -> Custom Code tab -> In the "Head Code" box, paste the full <script type="application/ld+json">...</script> snippet -> Click Save Changes and Publish.

C. Squarespace:
- Go to Website Tools -> Code Injection -> In the "Header" box, paste your script -> Click Save.

D. Shopify / Custom CMS:
- In your theme editor, open theme.liquid. Find the closing </head> tag, paste the code snippet right above it, and save.

E. How to Verify It Works:
- Once published, open Google's free Rich Results Test (search.google.com/test/rich-results), paste your clinic URL, and click Test. You will see green checkmarks for MedicalClinic and Physician.

---

2. HOW TO INSTALL THE /llms.txt FILE
The llms.txt file must be publicly reachable at yourclinic.com/llms.txt—just like a robots.txt file.

A. WordPress:
- Method 1 (cPanel / FTP): Log in to your hosting cPanel or FTP, open the public_html folder (your website's root folder), and upload the llms.txt file.
- Method 2 (Via Media or File Manager Plugin): Install the "WP File Manager" plugin, open your root directory, and upload llms.txt directly from your dashboard.

B. Webflow:
- Webflow does not allow direct root text uploads on basic plans. Upload llms.txt under Assets, copy its direct CDN link, then set up a 301 redirect in Project Settings -> Hosting -> 301 Redirects (/llms.txt -> redirect to the asset URL).

C. Vercel / Next.js / Custom Code:
- Drop the llms.txt file directly into your /public folder and deploy. It will instantly be live at yourdomain.com/llms.txt.

---

3. THE HANDS-OFF ESCAPE HATCH (DFY UPSALE)
If the user sounds overwhelmed, confused, or says "I don't know how to do this", say:
"If you or your team prefer not to touch website code, our team handles the entire setup with our Turnkey DFY Deployment ($1,495) or Multi-Branch Enterprise plan. We install the code, configure your /llms.txt, and verify it across Google, ChatGPT, and Perplexity within 48 hours so you don't have to worry about breaking anything. You can view that on our Pricing page (/pricing)."
`;

/**
 * Helper function to generate mock responses when OpenRouter key is not set or on fallback
 */
export function getMockDrCiteBotResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();

  if (
    msg.includes("install") ||
    msg.includes("paste") ||
    msg.includes("where do i") ||
    msg.includes("how do i") ||
    msg.includes("wordpress") ||
    msg.includes("webflow") ||
    msg.includes("squarespace") ||
    msg.includes("shopify") ||
    msg.includes("guide me")
  ) {
    if (msg.includes("llms.txt") || msg.includes("llm file") || msg.includes("upload")) {
      return `The \`llms.txt\` file must be publicly reachable at yourclinic.com/llms.txt—just like a \`robots.txt\` file. Here is how to install it:

- **WordPress (Method 1 - cPanel / FTP)**: Log in to your hosting cPanel or FTP, open the \`public_html\` folder (your website's root folder), and upload the \`llms.txt\` file.
- **WordPress (Method 2 - File Manager Plugin)**: Install the "WP File Manager" plugin, open your root directory, and upload \`llms.txt\` directly from your dashboard.
- **Webflow**: Upload \`llms.txt\` under Assets, copy its direct CDN link, then set up a 301 redirect in Project Settings -> Hosting -> 301 Redirects (\`/llms.txt\` -> redirect to the asset URL).
- **Vercel / Next.js / Custom Code**: Drop the \`llms.txt\` file directly into your \`/public\` folder and deploy. It will instantly be live at \`yourdomain.com/llms.txt\`.

*If you prefer not to touch website files, our team handles full setup with Turnkey DFY Deployment ($1,495) on our [Pricing Page](/pricing).*`;
    }

    if (msg.includes("wordpress")) {
      return `Here is how to install your Schema.org JSON-LD script on **WordPress**:

*Schema code lives in the \`<head>\` section of your website so search crawlers can read it before the visual page loads.*

- **Method 1 (No-code / Recommended)**: Install a free plugin like 'WPCode' or 'Header and Footer Scripts'. Go to **Code Snippets -> Header & Footer**, paste the \`<script type="application/ld+json">...</script>\` block into the **Header** box, and click **Save**.
- **Method 2 (SEO Plugins)**: If using Rank Math or Yoast Pro, open the Schema tab on your homepage or settings and paste custom JSON-LD directly.

**Verification**: Once published, open Google's free Rich Results Test (\`search.google.com/test/rich-results\`), paste your clinic URL, and click Test. You will see green checkmarks for \`MedicalClinic\` and \`Physician\`!

*If you or your team prefer not to touch website code, our team handles the entire setup with our Turnkey DFY Deployment ($1,495).*`;
    }

    if (msg.includes("webflow")) {
      return `Here is how to install your Schema.org JSON-LD snippet on **Webflow**:

*Schema code lives in the \`<head>\` section of your website so search crawlers can read it before the visual page loads.*

1. Go to **Project Settings -> Custom Code** tab.
2. In the **Head Code** box, paste the full \`<script type="application/ld+json">...</script>\` snippet.
3. Click **Save Changes** and **Publish**.

**For /llms.txt on Webflow**: Upload \`llms.txt\` under Assets, copy its direct CDN link, then set up a 301 redirect in **Project Settings -> Hosting -> 301 Redirects** (\`/llms.txt\` -> redirect to the asset URL).

*Prefer hands-off setup? View our Turnkey DFY Deployment ($1,495) on the Pricing page!*`;
    }

    if (msg.includes("squarespace")) {
      return `Here is how to install your Schema.org JSON-LD snippet on **Squarespace**:

*Schema code lives in the \`<head>\` section of your website so search crawlers can read it before the visual page loads.*

1. Go to **Website Tools -> Code Injection**.
2. In the **Header** box, paste your full \`<script type="application/ld+json">...</script>\` snippet.
3. Click **Save**.

*If you prefer hands-off installation, our Turnkey DFY Deployment ($1,495) handles setup within 48 hours.*`;
    }

    if (msg.includes("shopify")) {
      return `Here is how to install your Schema.org JSON-LD snippet on **Shopify**:

1. In your theme editor, open \`theme.liquid\`.
2. Find the closing \`</head>\` tag, paste the code snippet right above it, and click **Save**.`;
    }

    return `Here is how to install your CiteMed Schema.org JSON-LD script and \`/llms.txt\` file:

### 1. HOW TO INSTALL THE SCHEMA.ORG JSON-LD SCRIPT
*Schema code lives in the \`<head>\` section of your website so search crawlers can read it before the visual page loads.*

- **WordPress**: Install free plugin 'WPCode' -> Code Snippets -> Header & Footer -> Paste into 'Header' box -> Save.
- **Webflow**: Project Settings -> Custom Code tab -> In 'Head Code' box, paste snippet -> Save & Publish.
- **Squarespace**: Website Tools -> Code Injection -> In 'Header' box, paste script -> Save.
- **Shopify**: Open \`theme.liquid\` -> Paste code snippet right above \`</head>\` -> Save.

### 2. HOW TO INSTALL THE /llms.txt FILE
*The \`llms.txt\` file must be publicly reachable at yourclinic.com/llms.txt.*

- **WordPress**: Upload to \`public_html\` root via cPanel/FTP or 'WP File Manager' plugin.
- **Webflow**: Upload under Assets -> Copy CDN link -> Create 301 Redirect (\`/llms.txt\` -> asset URL).
- **Vercel / Custom Code**: Drop into \`/public\` folder and deploy.

### 3. VERIFICATION
Run your URL through Google's Rich Results Test (\`search.google.com/test/rich-results\`). You will see green checkmarks for \`MedicalClinic\` and \`Physician\`!

*If you prefer not to touch website code, our Turnkey DFY Deployment ($1,495) handles full setup & verification within 48 hours!*`;
  }

  if (
    msg.includes("confused") ||
    msg.includes("don't know") ||
    msg.includes("overwhelmed") ||
    msg.includes("hard") ||
    msg.includes("difficult") ||
    msg.includes("cannot do")
  ) {
    return "If you or your team prefer not to touch website code, our team handles the entire setup with our Turnkey DFY Deployment ($1,495) or Multi-Branch Enterprise plan. We install the code, configure your /llms.txt, and verify it across Google, ChatGPT, and Perplexity within 48 hours so you don't have to worry about breaking anything. You can view that on our Pricing page (/pricing).";
  }

  if (msg.includes("why isn't my clinic showing up") || msg.includes("chatgpt")) {
    return "Traditional clinic websites place doctor credentials inside HTML `<div>` tags which AI crawlers ignore. Answer engines like ChatGPT Search query structured vector stores and machine-readable entity graphs. Without a Schema.org `@graph` array and `/llms.txt` directory file, LLMs default to generic directories or skip your specialists entirely.";
  }

  if (msg.includes("30 doctors") || msg.includes("branch") || msg.includes("cost") || msg.includes("price") || msg.includes("package")) {
    return `Here is our pricing structure for single and multi-branch clinic networks:

- **Self-Serve Starter ($495 one-time)**: Instant Schema.org @graph JSON-LD payload + /llms.txt directory template for single-location clinics with in-house webmasters.
- **Turnkey DFY Deployment ($1,495 one-time - Most Popular)**: Complete white-glove setup. Up to 10 specialists mapped, Google Rich Results verified, live AI crawler testing in 48 hours.
- **Multi-Branch Enterprise ($4,950+ one-time or $495/mo retainer)**: Custom multi-location architecture (3+ clinic branches), unlimited consulting surgeons, and monthly citation audits.
- **White-Label Agency ($299/mo)**: Unlimited clinic audits under your own agency brand.

View the full breakdown on our [Pricing Page](/pricing).`;
  }

  if (msg.includes("llms.txt")) {
    return "An `/llms.txt` file is the new open standard index file specifically formatted for LLM web crawlers (OpenAI GPTBot, PerplexityBot, Applebot). Hosted at `yourclinic.com/llms.txt`, it provides a lightweight Markdown directory of your surgeons, operating hours, and consultation procedures.";
  }

  if (msg.includes("write my clinic's schema") || msg.includes("generate")) {
    return "I can certainly help you generate it! Head over to our **1-Click Generator Studio (`/generate`)**. You can paste your clinic URL for instant AI Auto-Extraction or fill out our guided form to get production Schema.org `@graph` JSON-LD and a verified `/llms.txt` file in 30 seconds.";
  }

  return "Welcome to CiteMed! I am Dr. CiteBot, your AI Clinical GEO Architect. Whether you need help installing your Schema.org @graph snippet on WordPress/Webflow, setting up /llms.txt, or auditing your clinic's visibility on Perplexity, I am here to guide you step-by-step. How can I help your clinic today?";
}

