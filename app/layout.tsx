"use client";

import { Toaster } from "sonner";
import React from "react";
import Link from "next/link";
import { Zap } from "lucide-react";
import AetherCopilot from "@/components/AetherCopilot";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>AetherGEO — Luxury AI Search Optimization</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <style>
          {`
            body { 
              font-family: 'Plus Jakarta Sans', sans-serif; 
            }
          `}
        </style>
      </head>
      <body className="bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white min-h-screen relative overflow-x-hidden antialiased">
        
        {/* Soft Ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_-5%,rgba(59,130,246,0.08),rgba(255,255,255,0))] pointer-events-none z-0"></div>

        {/* Global Navbar */}
        <header className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between border-b border-slate-200/80 bg-white/70 backdrop-blur-md sticky top-0 z-50">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-500/30 text-white">
              <Zap className="h-5 w-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition">AetherGEO</span>
          </Link>

          <nav className="hidden md:flex space-x-7 text-sm font-semibold text-slate-600">
            <Link href="/" className="hover:text-blue-600 transition">Audit Studio</Link>
            <Link href="/ide" className="hover:text-blue-600 transition">Live IDE</Link>
            <Link href="/tools" className="hover:text-blue-600 transition">Tool Suite</Link>
            <Link href="/agency" className="hover:text-blue-600 transition text-blue-600">Agency OS</Link>
            <Link href="/pricing" className="hover:text-blue-600 transition">Pricing</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/signin" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition">Sign In</Link>
            <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-sm shadow-blue-500/30 transition">
              Launch Free Audit
            </Link>
          </div>
        </header>

        <main className="relative z-10">
          <Toaster position="top-right" richColors theme="light" />
          {children}
        </main>

        {/* Global In-App Assistant */}
        <AetherCopilot />
      </body>
    </html>
  );
}
