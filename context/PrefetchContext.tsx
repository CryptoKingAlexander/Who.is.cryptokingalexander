'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { TechCard } from '@/types/techbook';
import { 
  intelligentPrefetcher, 
  CachedNodeData, 
  PrefetchStats, 
  SystemSpecs 
} from '@/lib/intelligentPrefetcher';
import { TECH_CARDS } from '@/lib/dataset';

interface PrefetchContextType {
  prefetchNode: (card: TechCard) => CachedNodeData;
  observeHover: (card: TechCard) => void;
  cancelHover: () => void;
  observeExpansion: (card: TechCard) => void;
  getCachedNode: (cardId: string) => CachedNodeData | undefined;
  stats: PrefetchStats;
  systemSpecs: SystemSpecs;
  refreshStats: () => void;
}

const PrefetchContext = createContext<PrefetchContextType | null>(null);

export function PrefetchProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [stats, setStats] = useState<PrefetchStats>(() => intelligentPrefetcher.getStats());
  const [systemSpecs, setSystemSpecs] = useState<SystemSpecs>(() => intelligentPrefetcher.getSystemSpecs());

  const syncMetricsIfChanged = useCallback(() => {
    const nextStats = intelligentPrefetcher.getStats();
    setStats((prev: PrefetchStats) => {
      if (
        prev.totalCached === nextStats.totalCached &&
        prev.maxCapacity === nextStats.maxCapacity &&
        prev.hits === nextStats.hits &&
        prev.misses === nextStats.misses &&
        prev.evictedCount === nextStats.evictedCount &&
        prev.systemTier === nextStats.systemTier &&
        prev.isThrottled === nextStats.isThrottled &&
        prev.prefetchesQueued === nextStats.prefetchesQueued
      ) {
        return prev;
      }
      return nextStats;
    });

    const nextSpecs = intelligentPrefetcher.getSystemSpecs();
    setSystemSpecs((prev: SystemSpecs) => {
      if (
        prev.tier === nextSpecs.tier &&
        prev.isHighLoad === nextSpecs.isHighLoad &&
        prev.maxCacheEntries === nextSpecs.maxCacheEntries &&
        prev.batchPrefetchLimit === nextSpecs.batchPrefetchLimit
      ) {
        return prev;
      }
      return nextSpecs;
    });
  }, []);

  // Wire Next.js router.prefetch to intelligent prefetch engine
  useEffect(() => {
    if (router && typeof router.prefetch === 'function') {
      intelligentPrefetcher.setRouterPrefetch((url: string) => {
        try {
          router.prefetch(url);
        } catch {
          // Ignore prefetch exceptions
        }
      });
    }

    // Periodic telemetry refresh (paused while tab is hidden/AFK)
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        return;
      }
      syncMetricsIfChanged();
    }, 3000);

    return () => clearInterval(interval);
  }, [router, syncMetricsIfChanged]);

  const prefetchNode = useCallback((card: TechCard) => {
    const data = intelligentPrefetcher.precacheNodeData(card);
    syncMetricsIfChanged();
    return data;
  }, [syncMetricsIfChanged]);

  const observeHover = useCallback((card: TechCard) => {
    intelligentPrefetcher.observeHover(card, TECH_CARDS);
  }, []);

  const cancelHover = useCallback(() => {
    intelligentPrefetcher.cancelHover();
  }, []);

  const observeExpansion = useCallback((card: TechCard) => {
    intelligentPrefetcher.observeCardExpansion(card, TECH_CARDS);
    syncMetricsIfChanged();
  }, [syncMetricsIfChanged]);

  const getCachedNode = useCallback((cardId: string) => {
    return intelligentPrefetcher.get(cardId);
  }, []);

  const refreshStats = useCallback(() => {
    syncMetricsIfChanged();
  }, [syncMetricsIfChanged]);

  const contextValue = useMemo(() => ({
    prefetchNode,
    observeHover,
    cancelHover,
    observeExpansion,
    getCachedNode,
    stats,
    systemSpecs,
    refreshStats,
  }), [prefetchNode, observeHover, cancelHover, observeExpansion, getCachedNode, stats, systemSpecs, refreshStats]);

  return (
    <PrefetchContext.Provider value={contextValue}>
      {children}
    </PrefetchContext.Provider>
  );
}

export function useIntelligentPrefetch() {
  const ctx = useContext(PrefetchContext);
  if (!ctx) {
    return {
      prefetchNode: (card: TechCard) => intelligentPrefetcher.precacheNodeData(card),
      observeHover: (card: TechCard) => intelligentPrefetcher.observeHover(card, TECH_CARDS),
      cancelHover: () => intelligentPrefetcher.cancelHover(),
      observeExpansion: (card: TechCard) => intelligentPrefetcher.observeCardExpansion(card, TECH_CARDS),
      getCachedNode: (cardId: string) => intelligentPrefetcher.get(cardId),
      stats: intelligentPrefetcher.getStats(),
      systemSpecs: intelligentPrefetcher.getSystemSpecs(),
      refreshStats: () => {},
    };
  }
  return ctx;
}
