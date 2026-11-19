'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const handleHardCacheReset = () => {
    try {
      if (typeof window !== 'undefined' && 'caches' in window) {
        caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
      }
    } catch {
      // ignore
    }
    reset();
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-950 text-white flex flex-col items-center justify-center min-h-screen font-mono p-4">
        <div className="max-w-md w-full bg-slate-900 border border-red-500/50 p-6 rounded-2xl text-center space-y-4 shadow-2xl">
          <div className="inline-block px-2.5 py-0.5 rounded bg-red-950 border border-red-500/40 text-[10px] font-bold text-red-300 uppercase">
            Root HTML Recovery Shell (WEB-NXT-01)
          </div>
          <h2 className="text-xl font-bold text-red-400">System Boundary Engaged</h2>
          <p className="text-xs text-slate-300">
            {error?.message || 'An unexpected root error was intercepted and isolated.'}
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-500 transition-colors cursor-pointer"
            >
              Recover Session
            </button>
            <button
              type="button"
              onClick={handleHardCacheReset}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Purge Cache &amp; Retry
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
