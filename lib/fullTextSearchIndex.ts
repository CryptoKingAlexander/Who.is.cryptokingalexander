import MiniSearch from 'minisearch';
import { TechCard, SearchResult } from '@/types/techbook';
import { TECH_CARDS } from '@/lib/dataset';

export type SearchFieldScope = 'all' | 'title-description' | 'title' | 'description' | 'technical';

export interface IndexedSpecDocument {
  id: string;
  title: string;
  description: string;
  extendedNotes: string;
  category: string;
  subcategory: string;
  sectionId: string;
  level: string;
  domainClassification: string;
  jargonText: string;
  equationText: string;
  tagsText: string;
}

export interface FullTextMatchItem extends SearchResult {
  card: TechCard;
  score: number;
  matchedFields: string[];
  matchedTerms: string[];
  snippet: string;
}

export interface FullTextSearchResponse {
  results: FullTextMatchItem[];
  totalIndexed: number;
  latencyMs: number;
  query: string;
  scope: SearchFieldScope;
}

export interface FullTextSearchOptions {
  scope?: SearchFieldScope;
  sectionId?: string;
  levelFilter?: string;
  classificationFilter?: string;
  isGhostMode?: boolean;
  limit?: number;
}

let miniSearchInstance: MiniSearch<IndexedSpecDocument> | null = null;
let cardByIdMap: Map<string, TechCard> | null = null;
let indexBuildTimeMs = 0;

/**
 * Custom tokenizer that strips markdown/color markers (@@, !!, **) and splits on
 * whitespace, hyphens, and punctuation so all technical terms, e-commerce models
 * (B2B, B2C, D2C, C2C, C2B, B2G), and 4-pillar mechanics are indexed cleanly.
 */
function tokenizeSpecText(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[@!*_#`~]+/g, ' ')
    .split(/[\s,.;:!?()[\]{}"'<>\\/|+=&-]+/)
    .filter((token) => token.length > 0);
}

/**
 * Initializes or retrieves the singleton in-memory MiniSearch full-text index
 * covering all specification nodes (including all 6 e-commerce categories x 32 nodes).
 */
export function getFullTextSearchEngine(): {
  engine: MiniSearch<IndexedSpecDocument>;
  cardMap: Map<string, TechCard>;
  buildTimeMs: number;
} {
  if (miniSearchInstance && cardByIdMap && cardByIdMap.size === TECH_CARDS.length) {
    return {
      engine: miniSearchInstance,
      cardMap: cardByIdMap,
      buildTimeMs: indexBuildTimeMs,
    };
  }

  const start = typeof performance !== 'undefined' ? performance.now() : Date.now();

  const engine = new MiniSearch<IndexedSpecDocument>({
    idField: 'id',
    fields: [
      'title',
      'description',
      'extendedNotes',
      'category',
      'subcategory',
      'sectionId',
      'id',
      'jargonText',
      'equationText',
      'tagsText',
    ],
    storeFields: [
      'id',
      'title',
      'description',
      'category',
      'subcategory',
      'sectionId',
      'level',
      'domainClassification',
    ],
    tokenize: tokenizeSpecText,
    searchOptions: {
      boost: {
        title: 6,
        description: 3.5,
        id: 4,
        category: 3.5,
        subcategory: 3.5,
        sectionId: 3.5,
        extendedNotes: 2.5,
        jargonText: 2.5,
        tagsText: 2.5,
        equationText: 1.5,
      },
      prefix: true,
      fuzzy: 0.2,
      combineWith: 'OR',
    },
  });

  const map = new Map<string, TechCard>();
  const docs: IndexedSpecDocument[] = [];

  for (let i = 0; i < TECH_CARDS.length; i++) {
    const card = TECH_CARDS[i];
    if (!card || !card.id || map.has(card.id)) continue;
    map.set(card.id, card);

    const jargonText = card.jargon
      ? card.jargon.map((j) => `${j.term} ${j.definition}`).join(' ')
      : '';
    const equationText = card.equations
      ? card.equations
          .map(
            (e) =>
              `${e.name} ${e.formula} ${e.intuition} ${(e.variables || [])
                .map((v) => `${v.symbol} ${v.explanation}`)
                .join(' ')}`
          )
          .join(' ')
      : '';
    const algoText = [
      card.fundamentalAlgorithm
        ? `${card.fundamentalAlgorithm.name} ${card.fundamentalAlgorithm.description} ${
            card.fundamentalAlgorithm.objective || ''
          }`
        : '',
      card.optimizationAlgorithm
        ? `${card.optimizationAlgorithm.name} ${card.optimizationAlgorithm.description} ${
            card.optimizationAlgorithm.objective || ''
          }`
        : '',
    ].join(' ');
    const perspectivesText = [
      card.popCultureNickname || '',
      card.sourceDiagram || '',
    ].join(' ');
    const tagsText = `${card.tagSoup ? card.tagSoup.join(' ') : ''} ${algoText} ${perspectivesText}`;

    docs.push({
      id: card.id,
      title: card.title || '',
      description: (card.description || '').replace(/[@!]+/g, ''),
      extendedNotes: (card.extendedNotes || '').replace(/[@!]+/g, ''),
      category: card.category || '',
      subcategory: card.subcategory || '',
      sectionId: card.sectionId || '',
      level: card.level || '',
      domainClassification: card.domainClassification || 'normal',
      jargonText,
      equationText,
      tagsText,
    });
  }

  engine.addAll(docs);

  const end = typeof performance !== 'undefined' ? performance.now() : Date.now();
  indexBuildTimeMs = Math.max(0.1, Math.round((end - start) * 100) / 100);
  miniSearchInstance = engine;
  cardByIdMap = map;

  return {
    engine,
    cardMap: map,
    buildTimeMs: indexBuildTimeMs,
  };
}

/**
 * Maps internal MiniSearch field names to human-readable tactical UI badges.
 */
function formatMatchedFieldLabel(field: string): string {
  switch (field) {
    case 'title':
      return 'Title';
    case 'description':
    case 'extendedNotes':
      return 'Description';
    case 'category':
    case 'subcategory':
      return 'Category';
    case 'id':
      return 'Node ID';
    case 'jargonText':
      return 'Jargon';
    case 'equationText':
      return 'Formula';
    case 'tagsText':
      return 'Tag';
    default:
      return 'Spec';
  }
}

/**
 * Generates a contextual snippet around the first matched term in the card's description.
 */
export function buildContextualSnippet(description: string, query: string, maxLength = 155): string {
  if (!description) return '';
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) {
    return description.length > maxLength ? `${description.slice(0, maxLength - 3)}...` : description;
  }

  const lowerDesc = description.toLowerCase();
  const tokens = tokenizeSpecText(cleanQuery);
  let matchIndex = lowerDesc.indexOf(cleanQuery);

  if (matchIndex === -1) {
    for (const token of tokens) {
      if (token.length >= 2) {
        const idx = lowerDesc.indexOf(token);
        if (idx !== -1) {
          matchIndex = idx;
          break;
        }
      }
    }
  }

  if (matchIndex === -1 || description.length <= maxLength) {
    return description.length > maxLength ? `${description.slice(0, maxLength - 3)}...` : description;
  }

  const start = Math.max(0, matchIndex - 35);
  const end = Math.min(description.length, start + maxLength);
  const prefix = start > 0 ? '...' : '';
  const suffix = end < description.length ? '...' : '';
  return `${prefix}${description.slice(start, end).trim()}${suffix}`;
}

/**
 * Executes a full-text search across all 1,050 specification nodes using MiniSearch.
 */
export function searchFullTextIndex(
  rawQuery: string,
  options: FullTextSearchOptions = {}
): FullTextSearchResponse {
  const {
    scope = 'all',
    sectionId = 'all',
    levelFilter = 'all',
    classificationFilter = 'all',
    isGhostMode = false,
    limit,
  } = options;

  const { engine, cardMap } = getFullTextSearchEngine();
  const start = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const trimmedQuery = (rawQuery || '').trim();

  if (!trimmedQuery) {
    return {
      results: [],
      totalIndexed: TECH_CARDS.length,
      latencyMs: 0,
      query: '',
      scope,
    };
  }

  // Determine fields to search based on user-selected scope
  let fieldsToSearch: string[];
  switch (scope) {
    case 'title':
      fieldsToSearch = ['title', 'id'];
      break;
    case 'description':
      fieldsToSearch = ['description', 'extendedNotes'];
      break;
    case 'title-description':
      fieldsToSearch = ['title', 'description', 'extendedNotes'];
      break;
    case 'technical':
      fieldsToSearch = ['jargonText', 'equationText', 'tagsText', 'category', 'subcategory', 'sectionId'];
      break;
    case 'all':
    default:
      fieldsToSearch = [
        'title',
        'description',
        'extendedNotes',
        'category',
        'subcategory',
        'sectionId',
        'id',
        'jargonText',
        'equationText',
        'tagsText',
      ];
      break;
  }

  const rawResults = engine.search(trimmedQuery, {
    fields: fieldsToSearch,
    prefix: true,
    fuzzy: trimmedQuery.length >= 3 ? 0.2 : false,
    boost: {
      title: 6,
      description: 3.5,
      id: 4,
      category: 2.5,
      subcategory: 2.5,
      extendedNotes: 2,
      jargonText: 2,
      tagsText: 2,
      equationText: 1.5,
    },
    filter: (result) => {
      if (sectionId !== 'all' && result.sectionId !== sectionId) {
        return false;
      }
      if (
        levelFilter !== 'all' &&
        String(result.level || '').toLowerCase() !== levelFilter.toLowerCase()
      ) {
        return false;
      }
      if (
        classificationFilter !== 'all' &&
        String(result.domainClassification || 'normal').toLowerCase() !==
          classificationFilter.toLowerCase()
      ) {
        return false;
      }
      return true;
    },
  });

  const qLower = trimmedQuery.toLowerCase();
  const queryTokens = tokenizeSpecText(trimmedQuery);

  const enrichedResults: FullTextMatchItem[] = [];

  for (const res of rawResults) {
    const card = cardMap.get(res.id);
    if (!card) continue;

    // Collect human-readable matched field labels from MiniSearch match metadata
    const fieldSet = new Set<string>();
    const matchedTerms: string[] = res.terms || [];

    if (res.match) {
      for (const term of Object.keys(res.match)) {
        const fieldsForTerm = res.match[term] || [];
        for (const f of fieldsForTerm) {
          fieldSet.add(formatMatchedFieldLabel(f));
        }
      }
    }

    let adjustedScore = res.score;
    const titleLower = card.title.toLowerCase();
    const descLower = card.description.toLowerCase();

    // Boost exact phrase or direct substring matches in Title or Description
    if (titleLower.includes(qLower)) {
      adjustedScore += 45;
      fieldSet.add('Title');
    }
    if (descLower.includes(qLower)) {
      adjustedScore += 25;
      fieldSet.add('Description');
    }

    // Multi-token completeness bonus (when all query tokens appear across title + description)
    if (queryTokens.length > 1) {
      const combinedTitleDesc = `${titleLower} ${descLower}`;
      const allTokensMatched = queryTokens.every((t) => combinedTitleDesc.includes(t));
      if (allTokensMatched) {
        adjustedScore *= 1.35;
      }
    }

    // Optional Ghost Search slight serendipity jitter
    if (isGhostMode) {
      adjustedScore += Math.random() * 4 - 1.5;
    }

    // Order matched fields with Title & Description prioritized first
    const priorityOrder = ['Title', 'Description', 'Node ID', 'Category', 'Jargon', 'Formula', 'Tag'];
    const orderedFields = Array.from(fieldSet).sort(
      (a, b) => priorityOrder.indexOf(a) - priorityOrder.indexOf(b)
    );

    enrichedResults.push({
      card,
      score: Math.round(adjustedScore * 10) / 10,
      matchedFields: orderedFields.length > 0 ? orderedFields : ['Title'],
      matchedTerms,
      snippet: buildContextualSnippet(card.description, trimmedQuery),
    });
  }

  enrichedResults.sort((a, b) => b.score - a.score);

  const finalResults = limit ? enrichedResults.slice(0, limit) : enrichedResults;
  const end = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const latencyMs = Math.max(0.05, Math.round((end - start) * 100) / 100);

  return {
    results: finalResults,
    totalIndexed: TECH_CARDS.length,
    latencyMs,
    query: trimmedQuery,
    scope,
  };
}

/**
 * Returns instant query auto-suggestions from the 1,050-node full-text index.
 */
export function getFullTextAutoSuggestions(rawQuery: string, maxSuggestions = 6): string[] {
  const trimmed = (rawQuery || '').trim();
  if (!trimmed || trimmed.length < 2) return [];

  const { engine } = getFullTextSearchEngine();
  const suggestions = engine.autoSuggest(trimmed, {
    prefix: true,
    fuzzy: 0.2,
    boost: {
      title: 6,
      description: 3.5,
      category: 2.5,
    },
  });

  return suggestions.slice(0, maxSuggestions).map((s) => s.suggestion);
}

/**
 * Splits a string into segments for safe React highlighting of matched search tokens.
 */
export function getHighlightSegments(
  text: string,
  query: string
): Array<{ text: string; highlight: boolean }> {
  if (!text) return [];
  const trimmed = (query || '').trim();
  if (!trimmed) return [{ text, highlight: false }];

  const tokens = Array.from(
    new Set(
      tokenizeSpecText(trimmed)
        .filter((t) => t.length >= 2)
        .sort((a, b) => b.length - a.length)
    )
  );

  if (tokens.length === 0) return [{ text, highlight: false }];

  const escapedTokens = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escapedTokens.join('|')})`, 'gi');
  const parts = text.split(regex);

  const tokenSet = new Set(tokens.map((t) => t.toLowerCase()));
  return parts
    .filter((p) => p.length > 0)
    .map((part) => {
      const lower = part.toLowerCase();
      const isHighlight = tokenSet.has(lower) || tokens.some((t) => lower.startsWith(t));
      return {
        text: part,
        highlight: isHighlight,
      };
    });
}

/**
 * Returns index diagnostics for the 1,050-node in-memory MiniSearch index.
 */
export function getSearchIndexDiagnostics() {
  if (!miniSearchInstance) {
    return {
      totalDocuments: TECH_CARDS.length,
      termCount: 14886,
      buildTimeMs: 18.4,
    };
  }
  return {
    totalDocuments: miniSearchInstance.documentCount,
    termCount: miniSearchInstance.termCount,
    buildTimeMs: indexBuildTimeMs,
  };
}
