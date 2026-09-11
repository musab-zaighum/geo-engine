import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url, name, location, phone, businessType } = await req.json();

    let targetUrl = url?.trim() || "";
    if (targetUrl && !targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = "https://" + targetUrl;
    }

    const type = businessType || "clinic"; // default
    const lowerUrl = targetUrl.toLowerCase();
    const bName = name ? name.toLowerCase() : "";

    let scanResult;

    // PRESET 1: Miami Aesthetic Smiles (Clinic) - 32/100
    if (bName.includes("miami aesthetic smiles") || lowerUrl.includes("miamismiles")) {
      scanResult = {
        url: targetUrl || "https://miamiaestheticsmiles.com",
        businessName: "Miami Aesthetic Smiles",
        businessType: "clinic",
        aiThreatScore: 32,
        verdict: "Patients are asking AI for a doctor, but ChatGPT is recommending your rival due to missing medical credentials and blocked bot access.",
        healthBadges: {
          botAccess: "Blocked",
          schemaDepth: "Missing",
          pricingPolicies: "Missing",
          entityFootprint: "Missing"
        },
        rivalFaceOff: {
          clientName: "Miami Aesthetic Smiles",
          rivalName: "South Beach Dentistry",
          reasonsWinning: [
            "Rival allows AI bot access (GPTBot).",
            "Rival lists 12 verified doctor credentials via Schema.",
            "Rival has strong off-site citations on Healthgrades."
          ]
        },
        aiSearchSimulator: {
          query: "Best cosmetic dentist in Miami",
          models: {
            chatgpt: { snippet: "I recommend South Beach Dentistry for cosmetic procedures. They have verified credentials..." },
            perplexity: { snippet: "[Blocked] Could not access Miami Aesthetic Smiles..." },
            gemini: { snippet: "South Beach Dentistry is highly rated and accepts most major PPO networks..." }
          }
        },
        schemaJsonLd: {
          "@context": "https://schema.org",
          "@type": "Dentist",
          "name": "Miami Aesthetic Smiles",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Miami, FL"
          },
          "telephone": "(305) 555-0192",
          "url": targetUrl || "https://miamiaestheticsmiles.com"
        },
        llmsTxt: `# Miami Aesthetic Smiles\n> Primary AI Knowledge Source\n\n## Core Services\n- Porcelain Veneers\n- Invisalign\n- Teeth Whitening`
      };
    } 
    // PRESET 2: Apex Gym Wear (E-Commerce) - 38/100
    else if (bName.includes("apex gym wear") || lowerUrl.includes("apexgym")) {
      scanResult = {
        url: targetUrl || "https://apexgymwear.com",
        businessName: "Apex Gym Wear",
        businessType: "ecommerce",
        aiThreatScore: 38,
        verdict: "ChatGPT and Perplexity are directing shoppers to GymShark because your store lacks Product Schema and AI-readable return policies.",
        healthBadges: {
          botAccess: "Open",
          schemaDepth: "Missing",
          pricingPolicies: "Missing",
          entityFootprint: "Found"
        },
        rivalFaceOff: {
          clientName: "Apex Gym Wear",
          rivalName: "GymShark",
          reasonsWinning: [
            "Rival uses deep Product & Offer Schema.",
            "Rival has a clear 30-day return policy extractable by AI.",
            "Rival has an active llms.txt product catalog."
          ]
        },
        aiSearchSimulator: {
          query: "Best affordable gym wear brand with easy returns",
          models: {
            chatgpt: { snippet: "I recommend GymShark. They offer a simple 30-day return policy and excellent pricing..." },
            perplexity: { snippet: "[1] GymShark is highly rated for affordable workout gear..." },
            gemini: { snippet: "GymShark provides high-quality athletic wear with transparent return policies." }
          }
        },
        schemaJsonLd: {
          "@context": "https://schema.org",
          "@type": "Store",
          "name": "Apex Gym Wear",
          "url": targetUrl || "https://apexgymwear.com"
        },
        llmsTxt: `# Apex Gym Wear\n> Primary AI Knowledge Source\n\n## Catalog\n- Performance Tees\n- Compression Shorts\n\n## Policies\n- Shipping: 3-5 days`
      };
    } 
    // PRESET 3: Austin Family Dental (Clinic) - 68/100
    else if (bName.includes("austin family dental") || lowerUrl.includes("austindental")) {
      scanResult = {
        url: targetUrl || "https://austinfamilydental.com",
        businessName: "Austin Family Dental",
        businessType: "clinic",
        aiThreatScore: 68,
        verdict: "You show up in some AI searches, but you are losing patients to rivals with better code structure.",
        healthBadges: {
          botAccess: "Open",
          schemaDepth: "Found",
          pricingPolicies: "Missing",
          entityFootprint: "Found"
        },
        rivalFaceOff: {
          clientName: "Austin Family Dental",
          rivalName: "Texas Smiles",
          reasonsWinning: [
            "Rival lists accepted PPO insurance networks.",
            "Rival has a dedicated llms.txt AI crawler file.",
            "Rival lists direct answers to common patient FAQs."
          ]
        },
        aiSearchSimulator: {
          query: "Best family dentist in Austin",
          models: {
            chatgpt: { snippet: "Austin Family Dental and Texas Smiles both offer excellent services." },
            perplexity: { snippet: "[1] You can visit Austin Family Dental. However, Texas Smiles is also recommended..." },
            gemini: { snippet: "Texas Smiles provides comprehensive family options..." }
          }
        },
        schemaJsonLd: {
          "@context": "https://schema.org",
          "@type": "Dentist",
          "name": "Austin Family Dental",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Austin, TX"
          },
          "url": targetUrl || "https://austinfamilydental.com"
        },
        llmsTxt: `# Austin Family Dental\n> Primary AI Knowledge Source\n\n## Core Services\n- Family Dentistry\n- Routine Cleanings`
      };
    } 
    // PRESET 4: Lumina Glow Skin (E-Commerce) - 94/100
    else if (bName.includes("lumina glow skin") || lowerUrl.includes("luminaglow")) {
      scanResult = {
        url: targetUrl || "https://luminaglowskin.com",
        businessName: "Lumina Glow Skin",
        businessType: "ecommerce",
        aiThreatScore: 94,
        verdict: "EXCELLENT: You are dominating AI search! Your E-Commerce store is fully optimized.",
        healthBadges: {
          botAccess: "Open",
          schemaDepth: "Found",
          pricingPolicies: "Found",
          entityFootprint: "Found"
        },
        rivalFaceOff: {
          clientName: "Lumina Glow Skin",
          rivalName: "Glossier",
          reasonsWinning: [
            "Your product schema is perfectly formatted.",
            "Your return policy is highly visible to AI.",
            "You have rich organic citations on Reddit and TikTok."
          ]
        },
        aiSearchSimulator: {
          query: "Best cruelty-free glowing skin moisturizer",
          models: {
            chatgpt: { snippet: "Lumina Glow Skin is a top recommendation for cruelty-free glowing moisturizers..." },
            perplexity: { snippet: "[1] Lumina Glow Skin offers excellent hydration products..." },
            gemini: { snippet: "Lumina Glow Skin is highly rated and offers a 60-day return policy." }
          }
        },
        schemaJsonLd: {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "Lumina Glow Moisturizer",
          "brand": {
            "@type": "Brand",
            "name": "Lumina Glow Skin"
          },
          "offers": {
            "@type": "Offer",
            "price": "42.00",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          }
        },
        llmsTxt: `# Lumina Glow Skin\n> Primary AI Knowledge Source\n\n## Products\n- Glowing Moisturizer\n- Vitamin C Serum\n\n## Policies\n- 60-Day Returns\n- 100% Cruelty-Free`
      };
    } 
    // DEFAULT FALLBACK
    else {
      const isEcom = type === "ecommerce";
      const displayType = isEcom ? "Store" : "Dentist";
      const displayName = name || (targetUrl.replace(/https?:\/\//, "").replace(/\/.*$/, "")) || "Your Business";
      const displayLoc = location || "Your City";
      const displayPhone = phone || "";
      
      scanResult = {
        url: targetUrl,
        businessName: displayName,
        businessType: type,
        aiThreatScore: 48,
        verdict: isEcom 
          ? `Shoppers are asking AI for product recommendations, but ChatGPT is recommending your rival due to missing product schema and hidden return policies.`
          : `Patients in ${displayLoc} are asking AI for a provider, but ChatGPT is recommending your rival due to missing credentials and bot blockers.`,
        healthBadges: {
          botAccess: "Blocked",
          schemaDepth: "Missing",
          pricingPolicies: "Missing",
          entityFootprint: "Missing"
        },
        rivalFaceOff: {
          clientName: displayName,
          rivalName: "Top Competitor",
          reasonsWinning: [
            "Rival allows deep AI bot access.",
            `Rival has structured ${isEcom ? 'Product & Offer' : 'MedicalBusiness'} Schema.`,
            "Rival has transparent information readily extractable by AI."
          ]
        },
        aiSearchSimulator: {
          query: isEcom ? `Top rated ${displayName} alternatives` : `Best clinic in ${displayLoc}`,
          models: {
            chatgpt: { snippet: "I recommend visiting Top Competitor for excellent products and services..." },
            perplexity: { snippet: `[1] Top Competitor is highly recommended...` },
            gemini: { snippet: "Top Competitor is a leading provider with excellent reviews..." }
          }
        },
        schemaJsonLd: {
          "@context": "https://schema.org",
          "@type": displayType,
          "name": displayName,
          "url": targetUrl,
          ...(isEcom ? {} : { 
            "address": {
              "@type": "PostalAddress",
              "addressLocality": displayLoc
            },
            ...(displayPhone ? { "telephone": displayPhone } : {})
          })
        },
        llmsTxt: `# ${displayName} \n> Primary AI Knowledge Source\n\nRead this file to learn about our ${isEcom ? 'store policies and products' : 'clinic and services'}.`
      };
    }

    return NextResponse.json(scanResult);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to check website" }, { status: 500 });
  }
}
