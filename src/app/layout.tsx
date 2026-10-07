import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { CornerChatWidget } from '@/components/CornerChatWidget';

export const metadata: Metadata = {
  title: 'CiteMed | Healthcare GEO Engine & Agency Platform',
  description:
    'Ultra-clean Healthcare Generative Engine Optimization (GEO) platform. Audit medical practice websites, synthesize Schema.org @graph JSON-LD, deploy /llms.txt, and scale $2,500 agency packages.',
  keywords: [
    'CiteMed',
    'Healthcare GEO',
    'Medical Schema Generator',
    'llms.txt Healthcare',
    'Ahpra Medical Schema',
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
