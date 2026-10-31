export const CLINIC_OFFER_CONFIG = {
  price: 1500,
  priceFormatted: '$1,500',
  period: 'One-Time Deployment & Permanent Growth Engine',
  ctaLabel: 'Claim Your Clinic Local Growth & AI Audit System — $1,500',
  whopCheckoutUrl:
    process.env.NEXT_PUBLIC_WHOP_CHECKOUT_URL ||
    'https://whop.com/checkout/nexusrank1-clinic-growth',
  pillars: [
    {
      id: 'geo-grid',
      title: 'Geo-Visibility Grid Tracking & Zip-Code Benchmarking',
      badge: 'Local Geocoded Radar',
      description:
        'Maps hyper-local neighborhood grids (3x3 and 5x5 mile radius) and pulls top competing clinics in your exact zip code to pinpoint where your practice is displaced.',
      features: [
        'Geocoded 3x3 mile coordinate grid mapping for local high-ticket procedures',
        'Direct zip-code competitor benchmarking against top 5 rival practices',
        'Real-time Local AI & Google Maps Share of Voice calculation',
        'Neighborhood citation radius expansion to dominate adjacent sub-markets',
      ],
    },
    {
      id: 'gbp-cleanup',
      title: 'Google Business Profile (GBP) & Citation Cleanup',
      badge: 'Directory & NAP Authority',
      description:
        'Audits and corrects primary/secondary medical categories, operating hours, and ensures strict Name-Address-Phone (NAP) consistency across 50+ healthcare directories.',
      features: [
        'Primary & secondary medical category accuracy audit (e.g. Cosmetic vs General)',
        'Operating hours, weekend emergency intake, and holiday schedule synchronization',
        'NAP consistency audit across WebMD, Healthgrades, Vitals, RateMDs, and Zocdoc',
        'Keyword stuffing penalty detection and algorithmic suspension shield',
      ],
    },
    {
      id: 'review-loops',
      title: 'Automated Review Loops & Front-Desk Engine',
      badge: 'Automated Patient Flow',
      description:
        'Automated front-desk text (SMS) and email review generation engine with reception QR codes and intelligent sentiment filtering to power AI search citations.',
      features: [
        'Front-desk 1-click SMS & email review follow-up sequence automation',
        'Custom reception check-out QR codes for immediate patient feedback',
        'Clinical sentiment distillation to feed generative search knowledge graphs',
        'HIPAA-compliant positive review booster with automated reminder cadences',
      ],
    },
    {
      id: 'ai-readability',
      title: 'AI Model Readability & Crawler Directives',
      badge: 'ChatGPT & Perplexity Ready',
      description:
        'Formats clinic data into clean markdown and JSON-LD structured schemas specifically engineered for AI web-crawlers (GPTBot, PerplexityBot, ClaudeBot, Google AI).',
      features: [
        '0-Error Schema.org MedicalClinic & Physician AST graph compilation',
        'Domain-level /llms.txt machine-readable manifest generation',
        'ADA CDT & AMA CPT clinical procedure ontology code embedding',
        'RFC 9309 crawler permissions ensuring complete AI search model indexing',
      ],
    },
  ],
  guarantee: {
    title: 'The 1-Patient ROI Guarantee',
    description:
      'For any dental, medical, or aesthetic clinic, a single new patient case (dental implants, Invisalign, surgical consultation, or medspa package) is worth $3,000 to $15,000+. Acquiring just 1 new patient through generative search pays for the entire $1,500 system immediately.',
  },
};
