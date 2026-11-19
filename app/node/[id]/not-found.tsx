'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert, Compass } from 'lucide-react';

export default function NodeSegmentNotFound() {
  return (
    <div className="min-h-screen bg-[#070a12] text-stone-100 flex flex-col items-center justify-center p-4 font-mono">
      <div className="w-full max-w-lg p-8 rounded-2xl bg-[#0f1420] border-2 border-amber-700/60 shadow-[0_0_50px_rgba(245,158,11,0.2)] text-center space-y-5">
        <div className="p-3.5 rounded-2xl bg-amber-950/80 border-2 border-amber-500/50 text-amber-400 mx-auto w-14 h-14 flex items-center justify-center">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-950/80 border border-amber-600/40 text-[11px] text-amber-300 font-bold uppercase mb-2">
            <Compass className="w-3 h-3 text-amber-400" />
            <span>Dynamic Segment Boundary (/node/[id])</span>
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Specification Node Not Found
          </h1>
          <p className="mt-2 text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
            The requested node identifier does not match an active specification in the 1,050-node compendium. Segment-level 404 isolation prevented root /_not-found invariant escalation.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to 1,050-Node Compendium</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
