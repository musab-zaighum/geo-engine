'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LicensingRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/pricing');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center font-sans">
      <div className="flex items-center gap-3 text-indigo-400">
        <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono font-bold tracking-wider uppercase">
          Redirecting to Practice Pricing...
        </span>
      </div>
    </div>
  );
}
