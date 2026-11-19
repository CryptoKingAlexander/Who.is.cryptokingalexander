'use client';

import { useEffect } from 'react';
import { errorQueue } from '@/lib/errorAggregationQueue';
import { intelligentPrefetcher } from '@/lib/intelligentPrefetcher';

/**
 * System-level diagnostic commands for identifying module resolution,
 * dependency mismatches, and intelligent prefetching telemetry at runtime.
 */
export function DebugSystems() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).Debug_Export = () => {
        console.group('--- DARKSCROLLS OPERATIONAL DIAGNOSTICS ---');
        console.log('Timestamp:', new Date().toISOString());
        console.log('Environment:', process.env.NODE_ENV);
        
        // Log basic dependency versions known to the build
        console.group('Known Project Dependencies:');
        console.log('React Version:', (window as any).React?.version || 'Bundled');
        console.log('Next.js Version:', '15.4.9 (App Router Standard)');
        console.log('Motion Version:', '12.23.24');
        console.log('Lucide-React Version:', '0.553.0');
        console.groupEnd();

        // Intelligent Prefetch Telemetry
        console.group('Intelligent Link & Node Prefetcher Telemetry:');
        const prefetchStats = intelligentPrefetcher.getStats();
        const systemSpecs = intelligentPrefetcher.getSystemSpecs();
        console.log('System Tier:', systemSpecs.tier);
        console.log('2026 Frontier Standard Compliant:', systemSpecs.tier === '2026_FRONTIER');
        console.log('Hardware Concurrency (Cores):', systemSpecs.concurrency);
        console.log('Device RAM (GB):', systemSpecs.memoryGB);
        console.log('Event Loop Lag (ms):', prefetchStats.eventLoopLagMs);
        console.log('Adaptive Throttle Active:', prefetchStats.isThrottled);
        console.log('Cache Size / Max Capacity:', `${prefetchStats.totalCached} / ${prefetchStats.maxCapacity}`);
        console.log('Cache Hits / Misses:', `${prefetchStats.hits} / ${prefetchStats.misses}`);
        console.log('Hit Rate:', `${prefetchStats.hitRatePercent}%`);
        console.log('Evicted Stale Items:', prefetchStats.evictedCount);
        console.groupEnd();

        // Check for double React instances
        const reactInstances = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__?.renderers;
        if (reactInstances && reactInstances.size > 1) {
          console.error('CRITICAL: Multiple React instances detected in memory.');
        } else {
          console.log('React Instance Check: Clean (Single instance confirmed)');
        }

        console.log('--- DIAGNOSTIC DUMP COMPLETE ---');
        console.groupEnd();
        
        return 'Operational intelligence exported to console.';
      };

      (window as any).DumpErrorQueue = (reason?: string) => {
        errorQueue.dumpToConsoleFatal(new Error(reason || 'Manual Error Queue Dump Triggered'), 'Console Command');
        return 'Error queue dumped to console.';
      };

      (window as any).ErrorQueue = errorQueue;
      (window as any).IntelligentPrefetcher = intelligentPrefetcher;

      console.log('>> [System] Debug_Export, DumpErrorQueue, & IntelligentPrefetcher commands initialized.');
    }
  }, []);

  return null;
}
