import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, Database } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#070a12] text-stone-100 p-4 sm:p-8 font-sans military-grid">
      <div className="max-w-3xl mx-auto rounded-2xl bg-[#0f1420] border-2 border-amber-500/40 p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-mono text-amber-100">
                Privacy Policy &amp; Sovereign Enclave Terms
              </h1>
              <p className="text-xs font-mono text-stone-400">
                Generic · 100% Client-Side Local Storage Architecture
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-stone-300 leading-relaxed">
          <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800 space-y-2">
            <div className="flex items-center gap-2 font-mono font-bold text-emerald-400 text-xs uppercase">
              <Lock className="w-4 h-4" />
              <span>Zero External Telemetry Guarantee</span>
            </div>
            <p>
              Generic operates as a sovereign client-side knowledge enclave. All reading dwell metrics, print queue bookmarks, theme preferences, and search interactions are stored exclusively in your local browser storage (IndexedDB and localStorage).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800 space-y-2">
            <div className="flex items-center gap-2 font-mono font-bold text-amber-400 text-xs uppercase">
              <Database className="w-4 h-4" />
              <span>Standalone Executable &amp; Offline Operation</span>
            </div>
            <p>
              All 131 systems architecture blueprints, mathematical equations, and operational playbooks are bundled for offline and standalone execution without external tracking or third-party analytics cookies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
