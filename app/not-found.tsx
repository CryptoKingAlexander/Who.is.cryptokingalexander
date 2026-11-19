'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#070a12] text-stone-100 flex flex-col items-center justify-center p-4 font-sans military-grid">
      <div className="w-full max-w-lg p-8 rounded-2xl bg-[#0f1420] border-2 border-red-800/60 shadow-[0_0_50px_rgba(239,68,68,0.3)] text-center relative overflow-hidden space-y-5">
        <div className="p-3.5 rounded-2xl bg-red-950/80 border-2 border-red-500/50 text-red-400 mx-auto w-14 h-14 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.3)]">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-600/40 text-[11px] font-mono text-red-300 font-bold uppercase mb-2">
            <Sparkles className="w-3 h-3 text-red-400" />
            <span>Operational Node Missing</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-red-100">
            404 — Node Uncharted
          </h1>
          <p className="mt-2 text-xs text-stone-300 leading-relaxed max-w-md mx-auto font-mono">
            The requested tactical node architecture is outside current operational coordinates or has been classified.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl font-mono text-xs font-bold text-white bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Operational Deck</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
