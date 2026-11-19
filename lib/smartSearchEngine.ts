import { TechCard } from '@/types/techbook';
import { TECH_CARDS } from '@/lib/dataset';
import { computeSemanticComplexityIndex, computeProfitabilityDeviationScore } from '@/lib/complexityScoring';
import { searchFullTextIndex, SearchFieldScope } from '@/lib/fullTextSearchIndex';

export interface SmartSuggestion {
  id: string;
  query: string;
  title: string;
  cardId?: string;
  complexity: number;
  profitability: number;
  ratio: number;
  score: number;
  reason: string;
  isGhostSuggested?: boolean;
}

const STORAGE_KEY_LAST_CARD = 'techbook_smart_last_card_v1';
const STORAGE_KEY_WEIGHTS = 'techbook_smart_weights_v1';
const STORAGE_KEY_GHOST_SEARCH = 'techbook_ghost_search_enabled_v1';

/**
 * Returns whether Ghost Search mode is currently active.
 * In Ghost Search mode, read history tracking is cloaked and private.
 */
export function isGhostSearchEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(STORAGE_KEY_GHOST_SEARCH) === 'true';
  } catch {
    return false;
  }
}

/**
 * Sets Ghost Search mode on or off.
 */
export function setGhostSearchEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_GHOST_SEARCH, String(enabled));
  } catch {
    // Ignore quota
  }
}

/**
 * Toggles Ghost Search mode and returns the new state.
 */
export function toggleGhostSearch(): boolean {
  const current = isGhostSearchEnabled();
  const next = !current;
  setGhostSearchEnabled(next);
  return next;
}

/**
 * Calculates the Complexity vs Profitability Ratio for a given card.
 */
export function getCardRatio(card: TechCard): number {
  const c = computeSemanticComplexityIndex(card);
  const p = computeProfitabilityDeviationScore(card);
  const ratio = p / Math.max(1, c);
  return Math.round(ratio * 100) / 100;
}

/**
 * Loads dynamic deweighting penalty factors from local store.
 */
function getWeightsMap(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WEIGHTS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Saves weights map to local store.
 */
function saveWeightsMap(map: Record<string, number>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_WEIGHTS, JSON.stringify(map));
  } catch {
    // Ignore quota
  }
}

/**
 * Deweights suggestion scores slightly when search bar is closed without selecting.
 */
export function deweightSuggestionsWithoutSelection(): void {
  // If Ghost Search is active, do not record or mutate tracking weights
  if (isGhostSearchEnabled()) return;

  const weights = getWeightsMap();
  const updated: Record<string, number> = {};
  for (const key of Object.keys(weights)) {
    updated[key] = Math.max(0.1, weights[key] * 0.82);
  }
  saveWeightsMap(updated);
}

/**
 * Boosts weight for a specific card when selected or expanded.
 * Cloaked (skipped entirely) when Ghost Search is enabled to protect reading privacy!
 */
export function recordCardInteraction(cardId: string): void {
  // Respect user privacy in Ghost Search mode
  if (isGhostSearchEnabled()) return;

  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_LAST_CARD, cardId);
  } catch {
    // Ignore
  }
  const weights = getWeightsMap();
  weights[cardId] = (weights[cardId] || 1.0) * 1.5;
  saveWeightsMap(weights);
}

/**
 * Records a search query to influence future smart suggestions.
 * Cloaked (skipped) when Ghost Search is enabled!
 */
export function recordSearchInteraction(query: string): void {
  if (isGhostSearchEnabled()) return;
  if (!query || typeof window === 'undefined') return;
  const weights = getWeightsMap();
  const q = query.toLowerCase();
  TECH_CARDS.forEach((card) => {
    if (card.title.toLowerCase().includes(q) || card.description.toLowerCase().includes(q)) {
      weights[card.id] = (weights[card.id] || 1.0) * 1.25;
    }
  });
  saveWeightsMap(weights);
}

/**
 * Generates Smart Search Suggestions.
 * When Ghost Search is ON:
 * - Read history tracking is cloaked.
 * - Applies a slight RNG jitter/temperature so recommendations stay serendipitous and exploratory
 *   for long-term daily use without getting stuck in an algorithmic bubble.
 */
export function getSmartSearchSuggestions(
  currentSectionId: string = 'all',
  activeSearchQuery: string = ''
): SmartSuggestion[] {
  const ghostMode = isGhostSearchEnabled();
  let activeCard: TechCard | null = null;

  if (!ghostMode && typeof window !== 'undefined') {
    try {
      const lastId = localStorage.getItem(STORAGE_KEY_LAST_CARD);
      if (lastId) {
        activeCard = TECH_CARDS.find((c) => c.id === lastId) || null;
      }
    } catch {
      // Fallback
    }
  }

  // If a specific category is selected, prefer an anchor card from that category
  if (currentSectionId !== 'all') {
    const sectionCards = TECH_CARDS.filter((c) => c.sectionId === currentSectionId);
    if (sectionCards.length > 0 && (!activeCard || activeCard.sectionId !== currentSectionId)) {
      const seedIdx = ghostMode ? Math.floor(Math.random() * sectionCards.length) : 0;
      activeCard = sectionCards[seedIdx] || sectionCards[0];
    }
  }

  // If Ghost mode or no history, pick an anchor seed with slight RNG for long-term variety
  if (!activeCard) {
    if (ghostMode && TECH_CARDS.length > 0) {
      // Pick a random seed card across all 630 cards for serendipitous exploration
      const seedIndex = Math.floor(Math.random() * TECH_CARDS.length);
      activeCard = TECH_CARDS[seedIndex] || TECH_CARDS[0];
    } else {
      activeCard = TECH_CARDS[0] || null;
    }
  }

  const targetRatio = activeCard ? getCardRatio(activeCard) : 2.5;
  const targetCategory = currentSectionId !== 'all' ? currentSectionId : (activeCard ? activeCard.sectionId : currentSectionId);
  const weights = ghostMode ? {} : getWeightsMap();

  const candidateCards = TECH_CARDS.filter((c) => c.id !== activeCard?.id);

  // Score candidate cards
  const scored: SmartSuggestion[] = candidateCards.map((card) => {
    const c = computeSemanticComplexityIndex(card);
    const p = computeProfitabilityDeviationScore(card);
    const ratio = p / Math.max(1, c);

    const ratioDiff = Math.abs(ratio - targetRatio);
    const ratioSimScore = Math.max(0, 1 - ratioDiff / Math.max(1, targetRatio));
    const sameSectionBonus = card.sectionId === targetCategory ? 0.35 : 0;

    let queryBonus = 0;
    if (activeSearchQuery.trim()) {
      const q = activeSearchQuery.toLowerCase();
      if (card.title.toLowerCase().includes(q) || card.description.toLowerCase().includes(q)) {
        queryBonus = 0.5;
      }
    }

    const deweightMult = ghostMode ? 1.0 : (weights[card.id] ?? 1.0);

    // In Ghost Search mode, inject a controlled, slight RNG jitter (between -0.15 and +0.25)
    // to provide serendipitous cross-domain discoveries for sustained long-term use
    const rngJitter = ghostMode ? (Math.random() * 0.4 - 0.15) : 0;

    const baseScore = (ratioSimScore * 0.4 + sameSectionBonus * 0.3 + queryBonus + 0.15 + rngJitter) * deweightMult;

    let reason = ghostMode
      ? `Ghost Serendipity · ${ratio.toFixed(1)}x yield match`
      : `Ratio: ${ratio.toFixed(1)}x yield match to ${activeCard?.title.substring(0, 20)}...`;

    if (sameSectionBonus > 0) {
      reason = ghostMode
        ? `Ghost Domain Affinity (${ratio.toFixed(1)}x yield)`
        : `Same domain & ratio (${ratio.toFixed(1)}x yield)`;
    }

    const firstJargonTerm =
      card.jargon && card.jargon[0]
        ? typeof card.jargon[0] === 'string'
          ? card.jargon[0]
          : card.jargon[0].term
        : '';
    const mainPhrase = firstJargonTerm
      ? `${firstJargonTerm} — ${card.title}`
      : card.title;

    return {
      id: card.id,
      query: mainPhrase,
      title: card.title,
      cardId: card.id,
      complexity: c,
      profitability: p,
      ratio: Math.round(ratio * 100) / 100,
      score: baseScore,
      reason,
      isGhostSuggested: ghostMode,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 7);
}

export const isGhostSearchActive = isGhostSearchEnabled;
export const setGhostSearchActive = setGhostSearchEnabled;

/**
 * Fast sub-millisecond full-text search across cards using MiniSearch inverted index
 * with optional Ghost Search RNG serendipity.
 */
export function searchCardsFast(
  query: string,
  cards: TechCard[],
  isGhostMode?: boolean,
  scope: SearchFieldScope = 'all'
): TechCard[] {
  if (!query || !query.trim()) return cards;
  const isGhost = isGhostMode ?? isGhostSearchEnabled();

  const { results } = searchFullTextIndex(query, {
    scope,
    isGhostMode: isGhost,
  });

  if (cards.length === TECH_CARDS.length) {
    return results.map((r) => r.card);
  }

  const allowedIds = new Set(cards.map((c) => c.id));
  return results.filter((r) => allowedIds.has(r.card.id)).map((r) => r.card);
}


