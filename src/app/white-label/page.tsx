'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WhiteLabelRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/partner-console');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-sans">
      <div className="flex items-center gap-3 text-[#0284C7]">
        <div className="w-5 h-5 border-2 border-[#0284C7] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono font-bold tracking-wider uppercase">
          Redirecting to Unified Partner Console...
        </span>
      </div>
    </div>
  );
}
