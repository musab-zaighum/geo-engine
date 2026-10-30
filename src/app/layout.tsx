import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Toaster } from 'sonner';

export const viewport: Viewport = {
  themeColor: '#020617',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'NexusRank1.com | Autonomous Healthcare GEO & AI Search Ranking Platform',
  description:
    'Turn local healthcare schema into higher patient rankings on Perplexity, SearchGPT, and Google AI Overviews. Run 5-second clinical audits, generate 0-error Schema.org JSON-LD and /llms.txt manifests with 93% net profit margins.',
  keywords: [
    'NexusRank',
    'NexusRank1.com',
    'Healthcare GEO',
    'Generative Engine Optimization',
    'Medical Clinic Schema',
    'Perplexity Search Optimization',
    'SearchGPT Ranking',
    'Dental Schema Generator',
    'Physician NPI Registry Graph',
    'Autonomous Healthcare SEO',
  ],
  authors: [{ name: 'NexusRank Engineering' }],
  openGraph: {
    title: 'NexusRank1.com | Autonomous Healthcare GEO & AI Search Ranking Platform',
    description:
      'Prove value in 5 seconds. Generate 0-error Schema.org JSON-LD and /llms.txt manifests. Official clinical intelligence audits stamped by NexusRank1.',
    url: 'https://nexusrank1.com',
    siteName: 'NexusRank1.com',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Toaster 
          theme="dark" 
          position="top-right" 
          toastOptions={{
            style: {
              background: '#0f172a',
              border: '1px solid #334155',
              color: '#f8fafc',
            },
          }} 
        />
      </body>
    </html>
  );
}
