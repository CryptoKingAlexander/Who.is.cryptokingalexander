import { TechCard, SearchResult } from '@/types/techbook';
import { searchFullTextIndex } from '@/lib/fullTextSearchIndex';
import { TECH_CARDS } from '@/lib/dataset';

export function performFuzzyNlpSearch(rawQuery: string, cards: TechCard[] = TECH_CARDS): SearchResult[] {
  if (!rawQuery || typeof rawQuery !== 'string') return [];
  const query = rawQuery.trim();
  if (!query) return [];

  const { results } = searchFullTextIndex(query, { scope: 'all' });

  if (!cards || cards.length === TECH_CARDS.length) {
    return results;
  }

  const allowedIds = new Set(cards.map((c) => c.id));
  return results.filter((r) => allowedIds.has(r.card.id));
}

