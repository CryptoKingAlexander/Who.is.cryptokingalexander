'use client';

import { useEffect } from 'react';
import { stackResilienceEngine, safeStorage } from '../lib/stackResilienceEngine';

export function SessionKeepAliveGuard({ children }: { children?: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let lastPingTime = 0;
    const PING_COOLDOWN_MS = 12_000;
    const BASE_HEARTBEAT_MS = 45_000;

    const handleBenignTransportRejection = (event: PromiseRejectionEvent) => {
      const reasonStr = String(event.reason?.message || event.reason || '');
      if (
        reasonStr.includes('WebSocket') ||
        reasonStr.includes('webpack-hmr') ||
        (reasonStr.includes('Failed to fetch') && reasonStr.includes('_next/webpack-hmr'))
      ) {
        event.preventDefault();
        stackResilienceEngine.recordResolutionEvent(
          8,
          'VERIFIED',
          'HMR/WS Noise Suppressed Silently',
          1
        );
      }
    };

    const ensureMathStylesheetFallback = () => {
      try {
        const existingFallback = document.getElementById('katex-inline-fallback-css');
        if (!existingFallback) {
          const style = document.createElement('style');
          style.id = 'katex-inline-fallback-css';
          style.textContent = `
            .katex-mathml { position: absolute; clip: rect(1px, 1px, 1px, 1px); padding: 0; border: 0; height: 1px; width: 1px; overflow: hidden; }
            .katex { font: normal 1.05em KaTeX_Main, Times New Roman, serif; line-height: 1.2; text-indent: 0; text-rendering: auto; }
            .katex-display { display: block; margin: 0.5em 0; text-align: center; }
          `;
          document.head.appendChild(style);
        }
        stackResilienceEngine.recordResolutionEvent(9, 'VERIFIED', 'Inline Math CSS Guard Armed', 1);
      } catch {
        // ignore
      }
    };

    ensureMathStylesheetFallback();

    const triggerGuardedHeartbeat = () => {
      const now = Date.now();
      if (now - lastPingTime < PING_COOLDOWN_MS) return;
      lastPingTime = now;

      safeStorage.setItem('techbook_last_active_epoch', String(now));
      stackResilienceEngine.executeResilientHeartbeat().catch(() => {});
    };

    const handleVisibilityOrWake = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        triggerGuardedHeartbeat();
      }
    };

    const initialJitter = 1200 + Math.floor(Math.random() * 600);
    const initTimer = window.setTimeout(triggerGuardedHeartbeat, initialJitter);

    const intervalJitter = Math.floor(Math.random() * 5000);
    const intervalId = window.setInterval(() => {
      if (typeof document === 'undefined' || document.visibilityState === 'visible') {
        triggerGuardedHeartbeat();
      }
    }, BASE_HEARTBEAT_MS + intervalJitter);

    window.addEventListener('unhandledrejection', handleBenignTransportRejection);
    document.addEventListener('visibilitychange', handleVisibilityOrWake, { passive: true });
    window.addEventListener('focus', handleVisibilityOrWake, { passive: true });
    window.addEventListener('online', triggerGuardedHeartbeat, { passive: true });
    window.addEventListener('pageshow', handleVisibilityOrWake, { passive: true });

    return () => {
      window.clearTimeout(initTimer);
      window.clearInterval(intervalId);
      window.removeEventListener('unhandledrejection', handleBenignTransportRejection);
      document.removeEventListener('visibilitychange', handleVisibilityOrWake);
      window.removeEventListener('focus', handleVisibilityOrWake);
      window.removeEventListener('online', triggerGuardedHeartbeat);
      window.removeEventListener('pageshow', handleVisibilityOrWake);
    };
  }, []);

  return <>{children ?? null}</>;
}
