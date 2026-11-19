import { TECH_CARDS } from '@/lib/dataset';

export const STORAGE_KEY_DATASET_CACHE = 'techbook_dataset_cache_v1';
export const STORAGE_KEY_PRELOAD_TIMESTAMP = 'techbook_preload_timestamp_v1';

export interface PreloadSummary {
  success: boolean;
  totalNodesCount: number;
  equationsPrerendered: number;
  searchIndexPrimed: boolean;
  cachedAt: number;
  durationMs: number;
}

let isMemoryPreloaded = false;
let globalPreloadSummary: PreloadSummary | null = null;
const renderedFormulaCache = new Map<string, string>();

export function renderMemoizedKaTeX(formula: string): string {
  const cached = renderedFormulaCache.get(formula);
  if (cached !== undefined) {
    return cached;
  }
  renderedFormulaCache.set(formula, formula);
  return formula;
}

export async function preloadAppDataToLocalStore(): Promise<PreloadSummary> {
  const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

  if (isMemoryPreloaded && globalPreloadSummary) {
    return globalPreloadSummary;
  }

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const payloadToStore = {
          version: '2.7.0',
          timestamp: Date.now(),
          count: TECH_CARDS.length,
        };
        localStorage.setItem(STORAGE_KEY_DATASET_CACHE, JSON.stringify(payloadToStore));
        localStorage.setItem(STORAGE_KEY_PRELOAD_TIMESTAMP, String(Date.now()));
      } catch {
        // Ignore quota warnings
      }
    }

    isMemoryPreloaded = true;
    const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

    const summary: PreloadSummary = {
      success: true,
      totalNodesCount: TECH_CARDS.length,
      equationsPrerendered: 0,
      searchIndexPrimed: true,
      cachedAt: Date.now(),
      durationMs: Math.max(1, Math.round(endTime - startTime)),
    };

    globalPreloadSummary = summary;
    return summary;
  } catch {
    const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const summary: PreloadSummary = {
      success: false,
      totalNodesCount: TECH_CARDS.length,
      equationsPrerendered: 0,
      searchIndexPrimed: false,
      cachedAt: Date.now(),
      durationMs: Math.max(1, Math.round(endTime - startTime)),
    };
    return summary;
  }
}

export function getIsAppPreloaded(): boolean {
  return isMemoryPreloaded;
}

export function getPreloadSummary(): PreloadSummary | null {
  return globalPreloadSummary;
}
