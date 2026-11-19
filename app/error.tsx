'use client';

import React, { useEffect } from 'react';
import { RotateCcw, AlertTriangle, Home, Sparkles } from 'lucide-react';
import { errorQueue } from '@/lib/errorAggregationQueue';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundaryPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    errorQueue.dumpToConsoleFatal(error, 'App Router error.tsx');
  }, [error]);

  const handleHardReload = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0d0a] flex flex-col items-center justify-center p-4 text-stone-100 font-sans selection:bg-amber-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(234,179,8,0.12)_0%,_transparent_70%)] pointer-events-none" />

      <div className="relative w-full max-w-lg rounded-2xl border-2 border-amber-500/50 bg-[#12130e] p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(234,179,8,0.2)] space-y-5">
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-400 rounded-tl-sm" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-400 rounded-tr-sm" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-400 rounded-bl-sm" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-400 rounded-br-sm" />

        <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-950/80 border-2 border-amber-400/50 flex items-center justify-center text-amber-300 shadow-[0_0_20px_rgba(234,179,8,0.25)]">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-[11px] font-mono text-amber-300 font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Read. Code. Earn.</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-amber-100">
            System Runtime Recovery
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-sm mx-auto">
            TechBook prevented a rendering fault. Your reading metrics, saved topics, and session remain isolated and preserved.
          </p>
        </div>

        {error?.message && (
          <div className="p-3 rounded-lg bg-stone-950/90 border border-stone-800 text-[11px] font-mono text-stone-400 text-left overflow-x-auto max-h-24">
            <span className="text-amber-400 block mb-0.5">Details:</span>
            {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-mono text-xs font-bold text-stone-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(234,179,8,0.3)]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restore Interface</span>
          </button>

          <button
            type="button"
            onClick={handleHardReload}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-mono text-xs font-semibold text-stone-300 hover:text-white bg-stone-900 hover:bg-stone-800 border border-stone-800 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span>Reload Encyclopedia</span>
          </button>
        </div>
      </div>
    </div>
  );
}
