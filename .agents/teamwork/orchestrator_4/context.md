# Context & Environment: NexusRank1 Platform

## Project Overview
- Root directory: `/home/pwn/geo-engine`
- Tech Stack: Next.js (App Router), React, TypeScript, Tailwind CSS, Lucide icons, Framer Motion
- Target URL: `http://localhost:3000`
- Target Whop Checkout URL: `https://whop.com/checkout/plan_e37e96b86e088/`

## Key Pages & Routes
1. `/` - Homepage featuring Hero, Instant Audit Bar (`#audit-bar`), ROI Calculator, Testimonials, Feature Highlights, Corner Chat Widget
2. `/pricing` - Pricing breakdown with $1,500 one-time deployment terms + ongoing partner tiers, Whop checkout links
3. `/partner-console` - Clinic Command Center (Overview, Competitor Radar, Clinical Schema, Settings tabs)
4. `/report/[domain]` - Public audit report for given practice domain
5. `/login` & `/signup` - Clinician portal authentication flows
6. `/api/report/pdf` - Vector PDF export endpoint
7. `/api/report/json` / download - JSON lead/audit dossier download

## Environment Directives
- Ensure dev server is running on `http://localhost:3000`
- Subagents must test real DOM elements, clicks, forms, links, and responsive states
- Code modifications must pass `npx tsc --noEmit` and `npm run build`
