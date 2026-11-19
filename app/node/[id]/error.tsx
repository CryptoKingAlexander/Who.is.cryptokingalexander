'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function NodeSegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#070a12] text-stone-100 flex flex-col items-center justify-center p-4 font-mono">
      <div className="w-full max-w-lg p-7 rounded-2xl bg-[#0f1420] border border-rose-500/50 shadow-[0_0_40px_rgba(244,63,94,0.2)] text-center space-y-4">
        <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-400 mx-auto w-12 h-12 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-white">Node Segment Fault Isolated</h2>
        <p className="text-xs text-slate-300">
          {error?.message || 'An unexpected error occurred while hydrating this tactical node.'}
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Segment</span>
          </button>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Main Deck</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
