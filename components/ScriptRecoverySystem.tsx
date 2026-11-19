'use client';

import React, { useEffect, useState } from 'react';
import { RotateCcw, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

export function ScriptRecoverySystem({ children }: { children: React.ReactNode }) {
  const [hasStackError, setHasStackError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRecovering, setIsRecovering] = useState(false);

  const isMountedInteractiveRef = React.useRef(false);

  const purgeStaleCachesSilently = React.useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        if ('caches' in window) {
          caches.keys().then((names) => {
            names.forEach((name) => {
              if (name.includes('v1')) {
                caches.delete(name);
              }
            });
          });
        }
        fetch('/api/health', { method: 'GET', cache: 'no-store', keepalive: true }).catch(() => {});
      }
    } catch {
      // Ignore
    }
  }, []);

  const purgeCachesAndReload = React.useCallback(() => {
    setIsRecovering(true);
    try {
      if (typeof window !== 'undefined') {
        if ('caches' in window) {
          caches.keys().then((names) => {
            names.forEach((name) => caches.delete(name));
          });
        }
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then((regs) => {
            regs.forEach((reg) => reg.unregister());
          });
        }
        sessionStorage.removeItem('generic_recovery_attempts_v1');
      }
    } catch {
      // Fallback
    }

    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.location.href = window.location.pathname + '?stack_reset=' + Date.now();
      }
    }, 250);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Once the app has rendered and remained stable for 1.5s, mark interactive so we NEVER
    // replace the live DOM or force a jarring reload during AFK or background prefetch faults
    const stabilityTimer = window.setTimeout(() => {
      isMountedInteractiveRef.current = true;
      try {
        sessionStorage.removeItem('generic_recovery_attempts_v1');
      } catch {
        // Ignore storage errors
      }
    }, 1500);

    function handleScriptError(event: ErrorEvent | PromiseRejectionEvent) {
      const err = 'reason' in event ? event.reason : event.error;
      const msg = err?.message || String(err || '');

      const isScriptChunkError =
        msg.includes('Loading chunk') ||
        msg.includes('ChunkLoadError') ||
        msg.includes('Failed to fetch dynamically imported module') ||
        msg.includes('__webpack_modules__');

      if (isScriptChunkError) {
        // Prevent browser default unhandled rejection crash overlay
        if (typeof event.preventDefault === 'function') {
          event.preventDefault();
        }
        // Heal silently without forcing a disruptive full-page reload loop in preview iframes
        purgeStaleCachesSilently();
      }
    }

    window.addEventListener('error', handleScriptError);
    window.addEventListener('unhandledrejection', handleScriptError);

    return () => {
      window.clearTimeout(stabilityTimer);
      window.removeEventListener('error', handleScriptError);
      window.removeEventListener('unhandledrejection', handleScriptError);
    };
  }, [purgeCachesAndReload, purgeStaleCachesSilently]);

  if (hasStackError) {
    return (
      <div className="min-h-screen bg-[#070a12] flex flex-col items-center justify-center p-4 sm:p-6 text-stone-100 font-mono military-grid">
        <div className="w-full max-w-md p-6 rounded-2xl bg-[#0f1420] border-2 border-amber-500/80 shadow-[0_0_50px_rgba(245,158,11,0.25)] text-center relative overflow-hidden space-y-4">
          <div className="flex flex-col items-center">
            <div className="p-3 rounded-2xl bg-amber-950/80 border-2 border-amber-500/50 text-amber-400 mb-2 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <ShieldAlert className="w-7 h-7 animate-pulse" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-600/40 text-[10px] font-mono text-amber-300 font-bold uppercase mb-2">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Core Script Stack Recovery</span>
            </div>

            <h2 className="text-base sm:text-lg font-bold tracking-tight text-amber-100">
              Script Stack Pipeline Interruption
            </h2>

            <p className="mt-2 text-xs text-stone-300 leading-relaxed font-sans">
              A script stack initialization delay occurred. Re-attempt core stack initialization with flushed caches to restore full operational capability.
            </p>

            {errorMessage && (
              <div className="mt-3 w-full text-left p-2.5 rounded-lg bg-[#060a12] border border-amber-900/50 text-[10px] font-mono text-stone-400 max-h-20 overflow-y-auto break-all">
                <span className="text-amber-400 font-bold block">Script Error Code:</span>
                {errorMessage}
              </div>
            )}

            <button
              type="button"
              onClick={purgeCachesAndReload}
              disabled={isRecovering}
              className="mt-5 w-full py-3 rounded-xl font-mono text-xs font-bold text-stone-950 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.35)] cursor-pointer touch-manipulation flex items-center justify-center gap-2 border-2 border-amber-300 active:scale-95"
            >
              {isRecovering ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-stone-950" />
                  <span>Purging Caches &amp; Resetting Stack...</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4 text-stone-950" />
                  <span>Re-Attempt Core Stack Initialization</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
