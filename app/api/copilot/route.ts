import { NextResponse } from "next/server";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

const STRICT_GUARDRAIL_REFUSAL =
  "I am dedicated exclusively to helping you navigate AetherGEO and optimize your business for AI search engines like ChatGPT and Perplexity. How can I help with your practice or store presence today?";

const SYSTEM_GUARDRAIL_PROMPT = `You are the official AetherGEO In-App Copilot. Your ONLY job is to guide users through the AetherGEO platform, explain Generative Engine Optimization (GEO), clarify how ChatGPT/Perplexity/Apple Intelligence index businesses, guide them through the Live IDE, Tool Suite, and Hosted AI Passports, and help them choose a plan. 
STRICT RESTRICTION: You MUST NOT answer questions about unrelated topics (general coding, recipes, personal advice, trivia, jokes, essays, or off-topic tasks). If a user asks anything outside AetherGEO or AI search optimization, respond: "${STRICT_GUARDRAIL_REFUSAL}" Keep answers concise, clear, and professional.`;

function evaluateFallbackResponse(userMessage: string): string {
  const query = userMessage.toLowerCase().trim();

  // 1. Strict Off-Topic Guardrail Check
  const offTopicKeywords = [
    "snake game", "python", "javascript", "react code", "write a script", "write code", "game", "games",
    "recipe", "recipes", "chocolate cake", "bake", "cook", "ingredients", "dinner",
    "joke", "tell me a joke", "riddle", "fun fact", "trivia", "homework",
    "poem", "essay", "lyrics", "song", "story",
    "weather", "president", "capital of", "dating advice", "relationship",
    "workout", "crypto trading", "stock pick", "math"
  ];

  const geoKeywords = [
    "aether", "geo", "generative engine", "passport", "threat", "score",
    "schema", "json-ld", "llms.txt", "robots.txt", "perplexity", "chatgpt",
    "gemini", "apple intelligence", "audit", "ranking", "rank", "agency",
    "ide", "tools", "pricing", "plan", "website", "crawler", "practice", "store"
  ];

  const hasGeoContext = geoKeywords.some((kw) => query.includes(kw));
  const isClearlyOffTopic = offTopicKeywords.some((kw) => query.includes(kw));

  if (isClearlyOffTopic && !hasGeoContext) {
    return STRICT_GUARDRAIL_REFUSAL;
  }

  // 2. Pre-built Quick Prompt Matches & Intent Handlers
  if (query.includes("how does the hosted passport work") || query.includes("hosted passport") || query.includes("what is a passport")) {
    return "The Hosted AI Passport is an edge-hosted, machine-readable digital identity bundle serving llms.txt, schema.jsonld, robots.txt, and OpenGraph metadata directly on AetherGEO's ultra-fast CDN. It gives AI search engines (like ChatGPT, Claude, and Perplexity) instant, verified facts about your business, specialties, credentials, and policies without requiring you to overhaul your primary website.";
  }

  if (query.includes("threat score") || query.includes("0-100") || query.includes("explain my score") || query.includes("threat")) {
    return "Your 0–100 AI Threat Score measures how vulnerable your business is to being overlooked or replaced by competitors in AI search answers. Scores below 50 indicate critical vulnerabilities (such as missing JSON-LD schemas, blocked GPTBot/PerplexityBot crawlers, or lack of verified doctor/store credentials). Scores of 80+ reflect authoritative machine-readability.";
  }

  if (query.includes("don't have a website") || query.includes("no website") || query.includes("without a website") || query.includes("can i still use")) {
    return "Yes, absolutely! The Hosted AI Passport can serve as your business's primary canonical AI profile on our global CDN. Even without a traditional website, AetherGEO generates verified Schema.org entity metadata, custom QR codes, and an indexed endpoint so AI assistants like ChatGPT and Perplexity can reliably cite and recommend your practice.";
  }

  if (query.includes("how to rank") || query.includes("rank on perplexity") || query.includes("rank on chatgpt") || query.includes("perplexity & chatgpt") || query.includes("generative engine optimization") || query.includes("what is geo")) {
    return "To rank prominently on Perplexity, ChatGPT, and Apple Intelligence, follow the 4 pillars of Generative Engine Optimization (GEO):\n1. Unblock AI Crawlers: Permit GPTBot, PerplexityBot, and ClaudeBot in your robots.txt.\n2. Deep Entity Schema: Implement validated JSON-LD markup with doctor credentials, accepted insurance, or product specs.\n3. Publish llms.txt: Provide an authoritative markdown digest of your business at /llms.txt.\n4. Direct Fact Answers: Structure FAQs and policies in clear question-and-answer format for AI citation models.";
  }

  if (query.includes("ide") || query.includes("live ide") || query.includes("editor")) {
    return "The Live IDE (/ide) is AetherGEO's real-time developer workspace. You can draft, validate, and preview your llms.txt knowledge graphs and Schema.org JSON-LD files with instant syntax highlighting and schema validation before pushing updates to your live passport.";
  }

  if (query.includes("agency") || query.includes("white-label") || query.includes("reseller") || query.includes("margin") || query.includes("client")) {
    return "AetherGEO Agency OS (/agency) empowers SEO consultants and agencies to manage multi-tenant GEO accounts. It features full white-label client dashboards, bulk CSV client importing, custom client threat reports, and an automated margin engine starting at wholesale rates ($19/mo/client).";
  }

  if (query.includes("pricing") || query.includes("cost") || query.includes("plan") || query.includes("subscription") || query.includes("upgrade")) {
    return "AetherGEO offers transparent plans for every scale:\n• Starter ($49/mo): 1 Hosted AI Passport, continuous threat monitoring, and robots.txt validation.\n• Pro Practice ($99/mo): Live IDE synchronization, rival face-off threat intelligence, and priority edge CDN.\n• Agency OS ($19/mo per client wholesale): White-label client portals, bulk provisioning, and API access.";
  }

  if (query.includes("tool") || query.includes("tools") || query.includes("suite")) {
    return "Our Tool Suite (/tools) provides targeted utilities to boost your AI presence: the Schema.org JSON-LD Generator, robots.txt Bot Permissibility Inspector, Rival Face-Off AI Simulator, and the AI Passport QR Generator.";
  }

  // General GEO platform guidance default
  return "I am here to help you maximize your business's presence across generative AI search engines. You can ask me how to set up your Hosted AI Passport, improve your AI Threat Score, optimize llms.txt and schema files in the Live IDE, or scale with Agency OS. What would you like to explore?";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: Message[] = body.messages || [];

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { role: "assistant", content: "Hello! How can I assist you with AetherGEO today?" },
        { status: 200 }
      );
    }

    const latestUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content || "";

    // 1. Immediate Guardrail / Fallback Pre-screening
    const preCheckReply = evaluateFallbackResponse(latestUserMessage);
    if (preCheckReply === STRICT_GUARDRAIL_REFUSAL) {
      return NextResponse.json({
        role: "assistant",
        content: STRICT_GUARDRAIL_REFUSAL,
        source: "guardrail-refusal",
      });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    // If no API key is configured, instantly utilize the fallback engine
    if (!apiKey) {
      return NextResponse.json({
        role: "assistant",
        content: preCheckReply,
        source: "fallback-engine",
      });
    }

    // Call OpenRouter API with free-tier model
    const openRouterMessages = [
      { role: "system", content: SYSTEM_GUARDRAIL_PROMPT },
      ...messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "https://aethergeo.ai",
          "X-Title": "AetherGEO Copilot",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-exp:free",
          messages: openRouterMessages,
          temperature: 0.3,
          max_tokens: 600,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Upstream issue: fall back gracefully
        const fallbackReply = evaluateFallbackResponse(latestUserMessage);
        return NextResponse.json({
          role: "assistant",
          content: fallbackReply,
          source: "fallback-engine",
        });
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content;

      if (!reply || typeof reply !== "string") {
        const fallbackReply = evaluateFallbackResponse(latestUserMessage);
        return NextResponse.json({
          role: "assistant",
          content: fallbackReply,
          source: "fallback-engine",
        });
      }

      return NextResponse.json({
        role: "assistant",
        content: reply.trim(),
        source: "openrouter",
      });
    } catch (fetchErr) {
      clearTimeout(timeoutId);
      // Timeout or network error: zero-hang fallback
      const fallbackReply = evaluateFallbackResponse(latestUserMessage);
      return NextResponse.json({
        role: "assistant",
        content: fallbackReply,
        source: "fallback-engine",
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        role: "assistant",
        content: "I am ready to help you navigate AetherGEO. Please ask about your AI Threat Score, Hosted Passport, or GEO optimization.",
        source: "emergency-fallback",
      },
      { status: 200 }
    );
  }
}
