'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { TechCard, SectionMeta } from '../types/techbook';
import { TECH_CARDS, SECTIONS } from '../lib/dataset';
import { isGhostSearchActive, setGhostSearchActive, recordCardInteraction } from '../lib/smartSearchEngine';
import { SearchFieldScope } from '../lib/fullTextSearchIndex';
import { playTacticalAudio } from '../lib/tacticalAudio';

export type SortMode = 'complexity' | 'profitability' | 'alphabetical';

interface NodeDeckContextType {
  cards: TechCard[];
  sections: SectionMeta[];
  activeSection: string;
  setActiveSection: (secId: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchScope: SearchFieldScope;
  setSearchScope: (scope: SearchFieldScope) => void;
  isGhostSearch: boolean;
  toggleGhostSearch: () => boolean;
  printQueue: string[];
  addToPrintQueue: (id: string) => void;
  removeFromPrintQueue: (id: string) => void;
  togglePrintQueue: (id: string) => void;
  clearPrintQueue: () => void;
  isPrintPreviewOpen: boolean;
  setPrintPreviewOpen: (open: boolean) => void;
  previewNodeId: string | null;
  setPreviewNodeId: (id: string | null) => void;
  isMilitaryModalOpen: boolean;
  militaryModalCard: TechCard | null;
  openMilitaryReport: (card: TechCard) => void;
  closeMilitaryReport: () => void;
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
  clearBookmarks: () => void;
  isBookmarked: (id: string) => boolean;
  isBookmarksModalOpen: boolean;
  setBookmarksModalOpen: (open: boolean) => void;
  showOnlyBookmarks: boolean;
  setShowOnlyBookmarks: (val: boolean) => void;
  expandedCardId: string | null;
  setExpandedCardId: (id: string | null) => void;
  focusNodeById: (cardId: string, clearSearch?: boolean) => void;
  rollRandomNode: () => TechCard;
  selectedLevelFilter: string;
  setSelectedLevelFilter: (lvl: string) => void;
  selectedClassificationFilter: string;
  setSelectedClassificationFilter: (cls: string) => void;
  sortMode: SortMode;
  setSortMode: (mode: SortMode) => void;
  activeView: 'cards' | 'mindmap';
  setActiveView: (view: 'cards' | 'mindmap') => void;
}

const NodeDeckContext = createContext<NodeDeckContextType | null>(null);

const VALID_CARD_IDS = new Set(TECH_CARDS.map((c) => c.id));

function readPersistedBookmarkIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const rawBookmarks = localStorage.getItem('tactical_bookmarks');
    const rawQueue = localStorage.getItem('tactical_print_queue');
    const parsedBookmarks: unknown = rawBookmarks ? JSON.parse(rawBookmarks) : [];
    const parsedQueue: unknown = rawQueue ? JSON.parse(rawQueue) : [];
    const combined = [
      ...(Array.isArray(parsedBookmarks) ? parsedBookmarks : []),
      ...(Array.isArray(parsedQueue) ? parsedQueue : []),
    ];
    const uniqueValid = Array.from(
      new Set(
        combined.filter(
          (id): id is string => typeof id === 'string' && VALID_CARD_IDS.has(id)
        )
      )
    );
    return uniqueValid;
  } catch {
    return [];
  }
}

function persistBookmarkIds(ids: string[]) {
  if (typeof window === 'undefined') return;
  try {
    const serialized = JSON.stringify(ids);
    localStorage.setItem('tactical_bookmarks', serialized);
    localStorage.setItem('tactical_print_queue', serialized);
  } catch {}
}

export function NodeDeckProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSectionState] = useState<string>('all');
  const [searchQuery, setSearchQueryState] = useState<string>('');
  const [searchScope, setSearchScopeState] = useState<SearchFieldScope>('all');
  const [isGhostSearch, setIsGhostSearchState] = useState<boolean>(false);
  const [printQueue, setPrintQueue] = useState<string[]>([]);
  const [isPrintPreviewOpen, setPrintPreviewOpen] = useState<boolean>(false);
  const [previewNodeId, setPreviewNodeId] = useState<string | null>(null);
  const [isMilitaryModalOpen, setIsMilitaryModalOpen] = useState<boolean>(false);
  const [militaryModalCard, setMilitaryModalCard] = useState<TechCard | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isBookmarksModalOpen, setBookmarksModalOpen] = useState<boolean>(false);
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState<boolean>(false);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('all');
  const [selectedClassificationFilter, setSelectedClassificationFilter] = useState<string>('all');
  const [sortMode, setSortModeState] = useState<SortMode>('complexity');
  const [activeView, setActiveViewState] = useState<'cards' | 'mindmap'>('cards');

  const setSortMode = useCallback((mode: SortMode) => {
    setSortModeState(mode);
    playTacticalAudio('click');
  }, []);

  const setActiveView = useCallback((view: 'cards' | 'mindmap') => {
    setActiveViewState(view);
    playTacticalAudio('click');
  }, []);

  // Hydrate saved bookmarks & print queue on mount and sync across tabs
  useEffect(() => {
    setIsGhostSearchState(isGhostSearchActive());
    const hydrated = readPersistedBookmarkIds();
    setBookmarks(hydrated);
    setPrintQueue(hydrated);
    persistBookmarkIds(hydrated);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'tactical_bookmarks' || e.key === 'tactical_print_queue') {
        const updated = readPersistedBookmarkIds();
        setBookmarks(updated);
        setPrintQueue(updated);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setActiveSection = useCallback((secId: string) => {
    setActiveSectionState(secId);
    setShowOnlyBookmarks(false);
    playTacticalAudio('click');
  }, []);

  const setSearchQuery = useCallback((q: string) => {
    setSearchQueryState(q);
  }, []);

  const setSearchScope = useCallback((scope: SearchFieldScope) => {
    setSearchScopeState(scope);
    playTacticalAudio('click');
  }, []);

  const focusNodeById = useCallback((cardId: string, clearSearch = false) => {
    playTacticalAudio('confirm');
    recordCardInteraction(cardId);
    if (clearSearch) {
      setSearchQueryState('');
    }
    setShowOnlyBookmarks(false);
    setActiveSectionState('all');
    setSelectedLevelFilter('all');
    setSelectedClassificationFilter('all');
    setExpandedCardId(cardId);

    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const el = document.getElementById(`node-card-${cardId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ring-2', 'ring-cyan-400', 'ring-offset-2', 'ring-offset-slate-900');
          setTimeout(() => {
            el.classList.remove('ring-2', 'ring-cyan-400', 'ring-offset-2', 'ring-offset-slate-900');
          }, 3000);
        }
      }, 100);
    }
  }, []);

  const toggleGhostSearch = useCallback(() => {
    const nextVal = !isGhostSearchActive();
    setGhostSearchActive(nextVal);
    setIsGhostSearchState(nextVal);
    playTacticalAudio(nextVal ? 'glitch' : 'confirm');
    return nextVal;
  }, []);

  const addToPrintQueue = useCallback((id: string) => {
    setBookmarks((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      setPrintQueue(next);
      persistBookmarkIds(next);
      return next;
    });
    playTacticalAudio('click');
  }, []);

  const removeFromPrintQueue = useCallback((id: string) => {
    setBookmarks((prev) => {
      const next = prev.filter((item) => item !== id);
      setPrintQueue(next);
      persistBookmarkIds(next);
      return next;
    });
    playTacticalAudio('click');
  }, []);

  const togglePrintQueue = useCallback((id: string) => {
    setBookmarks((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      setPrintQueue(next);
      persistBookmarkIds(next);
      return next;
    });
    playTacticalAudio('click');
  }, []);

  const clearPrintQueue = useCallback(() => {
    setBookmarks([]);
    setPrintQueue([]);
    setShowOnlyBookmarks(false);
    try {
      localStorage.removeItem('tactical_print_queue');
      localStorage.removeItem('tactical_bookmarks');
    } catch {}
    playTacticalAudio('click');
  }, []);

  const openMilitaryReport = useCallback((card: TechCard) => {
    setMilitaryModalCard(card);
    setIsMilitaryModalOpen(true);
    playTacticalAudio('confirm');
  }, []);

  const closeMilitaryReport = useCallback(() => {
    setIsMilitaryModalOpen(false);
    setMilitaryModalCard(null);
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      setPrintQueue(next);
      persistBookmarkIds(next);
      return next;
    });
    playTacticalAudio('click');
  }, []);

  const clearBookmarks = useCallback(() => {
    setBookmarks([]);
    setPrintQueue([]);
    setShowOnlyBookmarks(false);
    try {
      localStorage.removeItem('tactical_bookmarks');
      localStorage.removeItem('tactical_print_queue');
    } catch {}
    playTacticalAudio('click');
  }, []);

  const isBookmarked = useCallback(
    (id: string) => {
      return bookmarks.includes(id);
    },
    [bookmarks]
  );

  const rollRandomNode = useCallback(() => {
    playTacticalAudio('radar_alert');
    const randomIndex = Math.floor(Math.random() * TECH_CARDS.length);
    const card = TECH_CARDS[randomIndex];

    // Clear search query so the chosen card is guaranteed to be in view
    setSearchQueryState('');
    // Switch to all or card's section
    setActiveSectionState('all');
    setSelectedLevelFilter('all');
    setSelectedClassificationFilter('all');
    setExpandedCardId(card.id);

    // Smoothly scroll to the target element if mounted
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const el = document.getElementById(`node-card-${card.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ring-2', 'ring-cyan-400', 'ring-offset-2', 'ring-offset-slate-900');
          setTimeout(() => {
            el.classList.remove('ring-2', 'ring-cyan-400', 'ring-offset-2', 'ring-offset-slate-900');
          }, 3000);
        }
      }, 100);
    }

    return card;
  }, []);

  const value = useMemo(
    () => ({
      cards: TECH_CARDS,
      sections: SECTIONS,
      activeSection,
      setActiveSection,
      searchQuery,
      setSearchQuery,
      searchScope,
      setSearchScope,
      isGhostSearch,
      toggleGhostSearch,
      printQueue,
      addToPrintQueue,
      removeFromPrintQueue,
      togglePrintQueue,
      clearPrintQueue,
      isPrintPreviewOpen,
      setPrintPreviewOpen,
      previewNodeId,
      setPreviewNodeId,
      isMilitaryModalOpen,
      militaryModalCard,
      openMilitaryReport,
      closeMilitaryReport,
      bookmarks,
      toggleBookmark,
      clearBookmarks,
      isBookmarked,
      isBookmarksModalOpen,
      setBookmarksModalOpen,
      showOnlyBookmarks,
      setShowOnlyBookmarks,
      expandedCardId,
      setExpandedCardId,
      focusNodeById,
      rollRandomNode,
      selectedLevelFilter,
      setSelectedLevelFilter,
      selectedClassificationFilter,
      setSelectedClassificationFilter,
      sortMode,
      setSortMode,
      activeView,
      setActiveView,
    }),
    [
      activeSection,
      setActiveSection,
      searchQuery,
      setSearchQuery,
      searchScope,
      setSearchScope,
      isGhostSearch,
      toggleGhostSearch,
      printQueue,
      addToPrintQueue,
      removeFromPrintQueue,
      togglePrintQueue,
      clearPrintQueue,
      isPrintPreviewOpen,
      previewNodeId,
      isMilitaryModalOpen,
      militaryModalCard,
      openMilitaryReport,
      closeMilitaryReport,
      bookmarks,
      toggleBookmark,
      clearBookmarks,
      isBookmarked,
      isBookmarksModalOpen,
      showOnlyBookmarks,
      expandedCardId,
      focusNodeById,
      rollRandomNode,
      selectedLevelFilter,
      setSelectedLevelFilter,
      selectedClassificationFilter,
      setSelectedClassificationFilter,
      sortMode,
      setSortMode,
      activeView,
      setActiveView,
    ]
  );

  return <NodeDeckContext.Provider value={value}>{children}</NodeDeckContext.Provider>;
}

export function useNodeDeck() {
  const ctx = useContext(NodeDeckContext);
  if (!ctx) {
    throw new Error('useNodeDeck must be used within NodeDeckProvider');
  }
  return ctx;
}
