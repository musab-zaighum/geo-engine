import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { CornerChatWidget } from '@/components/CornerChatWidget';

export const metadata: Metadata = {
  title: 'VeloGEO | INTELLIGENCE SIMPLIFIED | Enterprise Healthcare Regular GEO Platform',
  description:
    'Deploy enterprise-grade, 100% white-label B2B SaaS for Healthcare Generative Engine Optimization (GEO). Run regular GEO audits, verify Schema.org @graph and /llms.txt, and scale wholesale agency revenues.',
  keywords: [
    'VeloGEO',
    'Regular GEO',
    'Healthcare GEO',
    'Medical Schema Generator',
    'llms.txt Healthcare',
    'NPI Physician Schema',
    'Perplexity Medical Search',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col selection:bg-blue-600/10 selection:text-blue-700">
        <Navbar />
        <div className="flex-1">{children}</div>
        <CornerChatWidget />
      </body>
    </html>
  );
}
