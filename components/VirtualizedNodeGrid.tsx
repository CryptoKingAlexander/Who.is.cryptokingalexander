'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { TechCard } from '../types/techbook';
import { CardItem } from './CardItem';
import { useNodeDeck } from '../context/NodeDeckContext';
import { searchFullTextIndex } from '../lib/fullTextSearchIndex';
import {
  computeSemanticComplexityIndex,
  computeProfitabilityDeviationScore,
} from '../lib/complexityScoring';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { playTacticalClick } from '../lib/tacticalAudio';

const INITIAL_BATCH_SIZE = 20;
const BATCH_INCREMENT = 40;

interface GridCardEntry {
  card: TechCard;
  score?: number;
  matchedFields?: string[];
}

export function VirtualizedNodeGrid() {
  const {
    cards,
    activeSection,
    searchQuery,
    setSearchQuery,
    searchScope,
    setSearchScope,
    isGhostSearch,
    expandedCardId,
    setExpandedCardId,
    selectedLevelFilter,
    selectedClassificationFilter,
    sortMode,
    bookmarks,
    showOnlyBookmarks,
    setShowOnlyBookmarks,
  } = useNodeDeck();

  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_BATCH_SIZE);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset pagination when filter/search/section changes
  useEffect(() => {
    setVisibleCount(INITIAL_BATCH_SIZE);
  }, [
    activeSection,
    searchQuery,
    searchScope,
    selectedLevelFilter,
    selectedClassificationFilter,
    sortMode,
    showOnlyBookmarks,
  ]);

  // Compute filtered cards using the MiniSearch full-text search index
  const { filteredEntries } = useMemo(() => {
    const bookmarkSet = new Set(bookmarks);
    const trimmed = searchQuery ? searchQuery.trim() : '';

    if (trimmed.length > 0) {
      const response = searchFullTextIndex(trimmed, {
        scope: searchScope,
        sectionId: activeSection,
        levelFilter: selectedLevelFilter,
        classificationFilter: selectedClassificationFilter,
        isGhostMode: isGhostSearch,
      });

      const entries: GridCardEntry[] = response.results
        .filter((r) => !showOnlyBookmarks || bookmarkSet.has(r.card.id))
        .map((r) => ({
          card: r.card,
          score: r.score,
          matchedFields: r.matchedFields,
        }));

      return {
        filteredEntries: entries,
      };
    }

    let result = [...cards];

    if (showOnlyBookmarks) {
      result = result.filter((c) => bookmarkSet.has(c.id));
    }

    if (activeSection !== 'all') {
      result = result.filter((c) => c.sectionId === activeSection);
    }

    if (selectedLevelFilter !== 'all') {
      result = result.filter((c) => c.level.toLowerCase() === selectedLevelFilter.toLowerCase());
    }

    if (selectedClassificationFilter !== 'all') {
      result = result.filter(
        (c) =>
          (c.domainClassification || 'normal').toLowerCase() ===
          selectedClassificationFilter.toLowerCase()
      );
    }

    if (sortMode === 'alphabetical') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortMode === 'profitability') {
      result.sort(
        (a, b) => computeProfitabilityDeviationScore(b) - computeProfitabilityDeviationScore(a)
      );
    } else if (sortMode === 'complexity') {
      result.sort((a, b) => computeSemanticComplexityIndex(b) - computeSemanticComplexityIndex(a));
    }

    return {
      filteredEntries: result.map((card) => ({ card })),
    };
  }, [
    cards,
    activeSection,
    searchQuery,
    searchScope,
    isGhostSearch,
    selectedLevelFilter,
    selectedClassificationFilter,
    sortMode,
    bookmarks,
    showOnlyBookmarks,
  ]);

  const displayedEntries = useMemo(() => {
    return filteredEntries.slice(0, visibleCount);
  }, [filteredEntries, visibleCount]);

  const hasMore = visibleCount < filteredEntries.length;

  const handleLoadMore = () => {
    playTacticalClick();
    setVisibleCount((prev) => Math.min(prev + BATCH_INCREMENT, filteredEntries.length));
  };

  const handleToggleExpand = (cardId: string) => {
    setExpandedCardId(expandedCardId === cardId ? null : cardId);
  };

  return (
    <div ref={containerRef} className="w-full m-0 p-0 font-sans">
      {showOnlyBookmarks && (
        <div className="w-full flex flex-wrap items-center justify-between gap-2 p-2.5 mb-1.5 rounded-xl bg-amber-950/60 border border-amber-500/60 text-xs font-mono text-amber-200">
          <span>
            Viewing <strong>{filteredEntries.length}</strong> Bookmarked Specification{' '}
            {filteredEntries.length === 1 ? 'Node' : 'Nodes'}
          </span>
          <button
            type="button"
            onClick={() => {
              playTacticalClick();
              setShowOnlyBookmarks(false);
            }}
            className="px-2.5 py-1 rounded bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-500/50 text-xs font-bold cursor-pointer"
          >
            Show All {cards.length} Nodes
          </button>
        </div>
      )}

      {filteredEntries.length === 0 && (
        <div className="w-full flex flex-wrap items-center justify-between gap-2 p-3 mb-1.5 rounded-xl bg-[#12130e] border border-amber-500/40 text-xs font-mono text-amber-400">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>
              {showOnlyBookmarks
                ? 'No bookmarked nodes match the current filter.'
                : `No specification nodes matched "${searchQuery}"${
                    activeSection !== 'all' ? ` within category "${activeSection}"` : ''
                  }.`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {showOnlyBookmarks && (
              <button
                type="button"
                onClick={() => setShowOnlyBookmarks(false)}
                className="px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-700 hover:bg-amber-900 text-xs font-bold cursor-pointer"
              >
                Show All Nodes
              </button>
            )}
            {searchScope !== 'all' && (
              <button
                type="button"
                onClick={() => setSearchScope('all')}
                className="px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-700 hover:bg-amber-900 text-xs font-bold cursor-pointer"
              >
                Search All Fields
              </button>
            )}
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-2.5 py-1 rounded bg-stone-800 text-stone-200 hover:bg-stone-700 text-xs cursor-pointer"
              >
                Reset Search
              </button>
            )}
          </div>
        </div>
      )}

      {/* Full-Bleed Un-Wrapped Node List (1px from screen edges, no parent container visual squishing contents) */}
      <div className="w-full flex flex-col gap-1.5 m-0 p-0">
        {displayedEntries.map(({ card, score, matchedFields }) => (
          <CardItem
            key={card.id}
            card={card}
            isExpanded={expandedCardId === card.id}
            onToggleExpand={() => handleToggleExpand(card.id)}
            searchQuery={searchQuery}
            searchScore={score}
            matchedFields={matchedFields}
          />
        ))}
      </div>

      {/* Load More Batch Pagination */}
      {hasMore && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={handleLoadMore}
            className="flex items-center gap-2 rounded-xl border border-amber-500/60 bg-[#181913] px-5 py-2.5 text-xs font-mono font-bold text-amber-300 hover:bg-amber-950/60 hover:border-amber-400 transition-all shadow-md cursor-pointer"
          >
            <span>
              Load Next {Math.min(BATCH_INCREMENT, filteredEntries.length - visibleCount)}{' '}
              Specification Nodes ({filteredEntries.length - visibleCount} remaining)
            </span>
            <ChevronDown className="h-4 w-4 text-amber-400" />
          </button>
        </div>
      )}
    </div>
  );
}
