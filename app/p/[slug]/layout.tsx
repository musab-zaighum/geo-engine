import type { Metadata } from "next";

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const rawSlug = params?.slug || "verified-entity";
  let decoded = rawSlug;
  try {
    decoded = decodeURIComponent(rawSlug);
  } catch {}
  
  const clean = decoded
    .replace(/<[^>]*>?/gm, "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "verified-entity";

  const formattedName = clean
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${formattedName} | Verified AI Search Passport`,
    description: `Official machine-readable AI Passport and Schema.org knowledge graph for ${formattedName}. Verified for ChatGPT, Perplexity, and Apple Intelligence.`,
    alternates: {
      canonical: `https://aethergeo.ai/p/${clean}`,
    },
    openGraph: {
      title: `${formattedName} — AetherGEO AI Passport`,
      description: `Verified Generative Engine Optimization profile for ${formattedName}. Direct entity citations, credentials, and crawl permissions.`,
      url: `https://aethergeo.ai/p/${clean}`,
      siteName: "AetherGEO",
      type: "website",
    },
  };
}

export default function PassportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}