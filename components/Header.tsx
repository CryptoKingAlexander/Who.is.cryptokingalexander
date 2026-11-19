'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  ChevronDown, 
  Sparkles, 
  Printer, 
  Bookmark,
  Network, 
  Layers, 
  X, 
  Cpu, 
  BrainCircuit, 
  Binary, 
  Languages, 
  Compass,
  Atom,
  Server,
  ShieldCheck,
  Gamepad2,
  Zap,
  Coins,
  Settings,
  Dices,
  Activity,
  Dna,
  GraduationCap,
  Shield,
  Lock,
  Eye,
  DollarSign,
  Ghost,
  Brain,
  Scale,
  Globe,
  Bot,
  Users,
  Vote,
  Landmark,
  Film,
  TrendingUp,
  ArrowDownAZ,
  Briefcase,
  ShoppingCart,
  Package,
  Repeat
} from 'lucide-react';
import { SectionId, SearchResult } from '@/types/techbook';
import { SECTIONS, TECH_CARDS } from '@/lib/dataset';
import { SortMode, useNodeDeck } from '@/context/NodeDeckContext';
import { searchFullTextIndex } from '@/lib/fullTextSearchIndex';
import { AppTheme } from './SettingsModal';
import { PWAInstallButton } from './PWAInstallButton';
import { AppIcon } from './AppIcon';
import { playTacticalClick } from '@/lib/tacticalAudio';
import { intelligentPrefetcher } from '@/lib/intelligentPrefetcher';
import { 
  getSmartSearchSuggestions, 
  deweightSuggestionsWithoutSelection, 
  recordCardInteraction 
} from '@/lib/smartSearchEngine';

const ECOMMERCE_SECTION_IDS: SectionId[] = [
  'b2b-ecommerce',
  'b2c-ecommerce',
  'd2c-ecommerce',
  'c2c-ecommerce',
  'c2b-ecommerce',
  'b2g-ecommerce',
];

interface HeaderProps {
  currentSection?: SectionId;
  onSelectSection?: (sectionId: SectionId) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchResults?: SearchResult[];
  onSelectSearchResult?: (cardId: string) => void;
  activeView?: 'cards' | 'mindmap';
  onViewChange?: (view: 'cards' | 'mindmap') => void;
  bookmarkCount?: number;
  onOpenBookmarks?: () => void;
  onOpenSettings: () => void;
  onRollRandomCard?: () => void;
  onOpenWelcome?: () => void;
  currentTheme?: AppTheme;
  sortMode?: SortMode;
  onSortChange?: (mode: SortMode) => void;
}

/**
 * Adaptive font size utility: Scales category title font smaller for longer titles
 * so the title always fits the available space between Random and Printer Queue.
 */
function getAdaptiveCategoryTitleClass(title: string): string {
  const len = title.length;
  if (len <= 4) {
    return 'text-xs sm:text-sm md:text-base font-bold tracking-normal';
  } else if (len <= 8) {
    return 'text-[11px] sm:text-xs md:text-sm font-bold tracking-tight';
  } else if (len <= 12) {
    return 'text-[10px] sm:text-[11px] md:text-xs font-bold tracking-tight leading-tight';
  } else if (len <= 18) {
    return 'text-[9.5px] sm:text-[10.5px] md:text-[11px] font-semibold tracking-tighter leading-tight';
  } else if (len <= 26) {
    return 'text-[8.5px] sm:text-[9.5px] md:text-[10px] font-semibold tracking-tighter leading-none';
  } else {
    // Extremely long titles
    return 'text-[7.5px] sm:text-[8.5px] md:text-[9px] font-bold tracking-tighter leading-none uppercase';
  }
}

export function Header({
  currentSection: propCurrentSection,
  onSelectSection: propOnSelectSection,
  searchQuery: propSearchQuery,
  onSearchChange: propOnSearchChange,
  searchResults: propSearchResults,
  onSelectSearchResult: propOnSelectSearchResult,
  activeView: propActiveView,
  onViewChange: propOnViewChange,
  bookmarkCount: propBookmarkCount,
  onOpenBookmarks: propOnOpenBookmarks,
  onOpenSettings,
  onRollRandomCard: propOnRollRandomCard,
  onOpenWelcome,
  currentTheme = 'slate',
  sortMode: propSortMode,
  onSortChange: propOnSortChange,
}: HeaderProps) {
  const deck = useNodeDeck();

  const currentSection = (propCurrentSection ?? deck.activeSection) as SectionId;
  const onSelectSection = propOnSelectSection ?? ((secId: SectionId) => deck.setActiveSection(secId));
  const searchQuery = propSearchQuery ?? deck.searchQuery;
  const onSearchChange = propOnSearchChange ?? deck.setSearchQuery;
  const activeView = propActiveView ?? deck.activeView;
  const onViewChange = propOnViewChange ?? deck.setActiveView;
  const bookmarkCount = propBookmarkCount ?? deck.bookmarks.length;
  const onOpenBookmarks = propOnOpenBookmarks ?? (() => {
    deck.setBookmarksModalOpen(true);
  });
  const onRollRandomCard = propOnRollRandomCard ?? (() => {
    deck.rollRandomNode();
  });
  const sortMode = propSortMode ?? deck.sortMode;
  const onSortChange = propOnSortChange ?? deck.setSortMode;
  const onSelectSearchResult = propOnSelectSearchResult ?? ((cardId: string) => {
    deck.focusNodeById(cardId, true);
  });

  const computedSearchResults = React.useMemo<SearchResult[]>(() => {
    if (propSearchResults) return propSearchResults;
    const trimmed = searchQuery ? searchQuery.trim() : '';
    if (!trimmed) return [];
    const response = searchFullTextIndex(trimmed, {
      scope: deck.searchScope,
      sectionId: 'all',
      isGhostMode: deck.isGhostSearch,
      limit: 16,
    });
    return response.results.map((r) => ({
      card: r.card,
      matchType: (r.matchedFields.includes('title')
        ? 'title'
        : r.matchedFields.includes('jargon')
        ? 'jargon'
        : 'description') as 'title' | 'description' | 'jargon' | 'perspectives',
      snippet: r.card.description,
    }));
  }, [propSearchResults, searchQuery, deck.searchScope, deck.isGhostSearch]);

  const searchResults = computedSearchResults;

  const [isSectionMenuOpen, setIsSectionMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const sectionDropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const hasSelectedFromSmartSearch = useRef(false);

  // Deweight suggestions if search bar is closed without selecting from Smart Search
  useEffect(() => {
    if (isSearchFocused) {
      hasSelectedFromSmartSearch.current = false;
    } else {
      if (!hasSelectedFromSmartSearch.current) {
        deweightSuggestionsWithoutSelection();
      }
    }
  }, [isSearchFocused]);

  // Close dropdowns on click outside
  useEffect(() => {
    if (!isSectionMenuOpen && !isSearchFocused && !isSortMenuOpen) return;

    function handleClickOutside(event: MouseEvent | TouchEvent) {
      const target = event.target as Node | null;
      if (!target) return;

      if (
        isSectionMenuOpen &&
        sectionDropdownRef.current && 
        !sectionDropdownRef.current.contains(target)
      ) {
        setIsSectionMenuOpen(false);
      }
      if (
        isSortMenuOpen &&
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(target)
      ) {
        setIsSortMenuOpen(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(target)
      ) {
        setIsSearchFocused(false);
      }
    }

    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('touchend', handleClickOutside, { passive: true });
    }, 50);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchend', handleClickOutside);
    };
  }, [isSectionMenuOpen, isSearchFocused, isSortMenuOpen]);

  // Keyboard shortcut: Cmd/Ctrl+K or '/' to focus search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchFocused(true);
        setTimeout(() => searchInputRef.current?.focus(), 60);
      }
      if (e.key === 'Escape') {
        setIsSearchFocused(false);
        setIsSectionMenuOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeSectionMeta = SECTIONS.find((s) => s.id === currentSection) || SECTIONS[0];

  const getSectionIcon = (id: SectionId) => {
    switch (id) {
      case 'all': return <Layers className="w-4 h-4 text-red-400" />;
      case 'psychological-warfare-cognitive': return <BrainCircuit className="w-4 h-4 text-red-400" />;
      case 'military-cyber-sovereign-cloud': return <ShieldCheck className="w-4 h-4 text-blue-400" />;
      case 'nanotech-cellular-swarms': return <Atom className="w-4 h-4 text-lime-400" />;
      case 'superpower-command-logistics': return <Compass className="w-4 h-4 text-amber-400" />;
      case 'paramilitary-insurgent-asymmetric': return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'unconventional-directed-energy': return <Zap className="w-4 h-4 text-red-500" />;
      case 'ai-roadmap': return <Cpu className="w-4 h-4 text-emerald-300" />;
      case 'llm-dimensions': return <BrainCircuit className="w-4 h-4 text-purple-300" />;
      case 'deep-learning-apps': return <Sparkles className="w-4 h-4 text-pink-300" />;
      case 'ml-algorithms': return <Binary className="w-4 h-4 text-amber-300" />;
      case 'linguistics-taxonomy': return <Languages className="w-4 h-4 text-cyan-300" />;
      case 'quantum-computing': return <Atom className="w-4 h-4 text-emerald-300" />;
      case 'system-performance-cloud': return <Server className="w-4 h-4 text-amber-300" />;
      case 'engineering-principles': return <ShieldCheck className="w-4 h-4 text-emerald-300" />;
      case 'gametech-systems': return <Gamepad2 className="w-4 h-4 text-pink-300" />;
      case 'production-ai-evals': return <Zap className="w-4 h-4 text-purple-300" />;
      case 'gamification-monetization': return <Coins className="w-4 h-4 text-amber-300" />;
      case 'medtech': return <Activity className="w-4 h-4 text-rose-400" />;
      case 'biotech': return <Dna className="w-4 h-4 text-emerald-400" />;
      case 'edtech': return <GraduationCap className="w-4 h-4 text-blue-400" />;
      case 'miltech': return <Shield className="w-4 h-4 text-red-500" />;
      case 'cybertech': return <Lock className="w-4 h-4 text-cyan-400" />;
      case 'mindcontroltech': return <Eye className="w-4 h-4 text-purple-400" />;
      case 'fintech': return <DollarSign className="w-4 h-4 text-amber-400" />;
      case 'stealthtech': return <Ghost className="w-4 h-4 text-slate-400" />;
      case 'psytech': return <Brain className="w-4 h-4 text-pink-400" />;
      case 'qtech': return <Atom className="w-4 h-4 text-teal-300" />;
      case 'legtech': return <Scale className="w-4 h-4 text-amber-300" />;
      case 'nanotech': return <Atom className="w-4 h-4 text-lime-400" />;
      case 'microtech': return <Cpu className="w-4 h-4 text-indigo-400" />;
      case 'macrotech': return <Globe className="w-4 h-4 text-emerald-300" />;
      case 'robotech': return <Bot className="w-4 h-4 text-orange-400" />;
      case 'humtech': return <Users className="w-4 h-4 text-violet-400" />;
      case 'poltech': return <Vote className="w-4 h-4 text-sky-400" />;
      case 'govtech': return <Landmark className="w-4 h-4 text-yellow-300" />;
      case 'gametech': return <Gamepad2 className="w-4 h-4 text-fuchsia-400" />;
      case 'cliptech': return <Film className="w-4 h-4 text-rose-400" />;
      case 'b2b-ecommerce': return <Briefcase className="w-4 h-4 text-amber-400" />;
      case 'b2c-ecommerce': return <ShoppingCart className="w-4 h-4 text-emerald-400" />;
      case 'd2c-ecommerce': return <Package className="w-4 h-4 text-purple-400" />;
      case 'c2c-ecommerce': return <Repeat className="w-4 h-4 text-cyan-400" />;
      case 'c2b-ecommerce': return <Sparkles className="w-4 h-4 text-teal-300" />;
      case 'b2g-ecommerce': return <Landmark className="w-4 h-4 text-orange-400" />;
      case 'hiding-money-counter-forensics': return <DollarSign className="w-4 h-4 text-amber-400" />;
      case 'hidden-sexual-behavioral-dynamics': return <Eye className="w-4 h-4 text-pink-400" />;
      case 'geopolitical-abuse-coercion': return <Globe className="w-4 h-4 text-red-400" />;
      case 'hypnotic-systems-lossy-vs-lossless': return <BrainCircuit className="w-4 h-4 text-purple-400" />;
      case 'supply-chain-sparking': return <Package className="w-4 h-4 text-emerald-400" />;
      case 'supply-chain-infiltration': return <Shield className="w-4 h-4 text-red-500" />;
      case 'disabled-economic-systems': return <Users className="w-4 h-4 text-cyan-400" />;
      case 'salary-stacking-sting-countermath': return <ShieldCheck className="w-4 h-4 text-amber-300" />;
      default: return <Layers className="w-4 h-4 text-red-400" />;
    }
  };

  const consumerPopularSearches = [
    'Car stubby spam entrapping sting Poisson Hawkes SPRT',
    'Hypnotic systems lossless symplectic vs lossy poisoned',
    'Hiding money zk-SNARK Pedersen commitment shell',
    'Hidden sexual Zahavian handicap Bayesian mate filter',
    'Supply chain sparking percolation & infiltration PUF',
    'Disabled economic systems BCI Spoon Theory HJB',
    'Geopolitical abuse sovereign debt-trap coercion',
  ];

  return (
    <header className={`sticky top-0 z-50 w-full border-b-2 transition-colors duration-200 ${
      currentTheme === 'white'
        ? 'border-amber-500/30 bg-white/95 text-stone-900 shadow-sm'
        : currentTheme === 'black'
        ? 'border-stone-800 bg-black/95 text-stone-100 shadow-lg'
        : 'border-amber-600/40 bg-[#141510]/95 text-stone-100 backdrop-blur-xl'
    }`}>
      {/* Top decorative mustard hairline */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />

      <div className="w-full px-0 h-15 flex items-center justify-between gap-2 sm:gap-3 relative">
        
        {/* Left Side: 1. Search Button -> 2. Random Roll Node */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* 1. SEARCH BUTTON (TOP LEFT) */}
          {!isSearchFocused ? (
            <button
              type="button"
              onClick={() => {
                setIsSearchFocused(true);
                setTimeout(() => searchInputRef.current?.focus(), 60);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-amber-600/40 hover:border-amber-400 bg-[#171813] hover:bg-[#1f2019] text-stone-300 hover:text-amber-200 transition-all cursor-pointer shadow-sm min-h-[38px] active:scale-95 group shrink-0"
              title="Search 332+ architectures & math (Press ⌘K)"
            >
              <Search className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-mono text-stone-300 group-hover:text-amber-200 hidden sm:inline">
                Search
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-amber-400/80 bg-amber-950/60 border border-amber-500/40 hidden md:inline">
                ⌘K
              </span>
            </button>
          ) : null}

          {/* 2. SORT TOGGLE BUTTON NEAR SEARCH BAR (ONLY SHOWING ACTIVE OPTION) */}
          {!isSearchFocused && (
            <div className="relative" ref={sortDropdownRef}>
              <button
                type="button"
                onClick={() => setIsSortMenuOpen((prev) => !prev)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border-2 transition-all cursor-pointer touch-manipulation min-h-[38px] active:scale-95 shadow-sm shrink-0 ${
                  isSortMenuOpen
                    ? 'bg-amber-400 border-amber-300 text-stone-950 font-bold'
                    : currentTheme === 'white'
                    ? 'bg-amber-50 border-amber-300 text-stone-800 hover:bg-amber-100'
                    : 'bg-[#181913] border-amber-500/40 hover:border-amber-400 text-stone-200'
                }`}
                title={`Active Sort: ${sortMode === 'profitability' ? 'Profitability Deviation' : sortMode === 'alphabetical' ? 'Alphabetical Order' : 'Complexity Level'}. Click to toggle.`}
              >
                {sortMode === 'profitability' ? (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : sortMode === 'alphabetical' ? (
                  <ArrowDownAZ className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                ) : (
                  <Brain className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                )}
                <span className="font-mono text-xs font-bold truncate hidden xs:inline max-w-[85px] sm:max-w-[110px]">
                  {sortMode === 'profitability' ? 'Profitability' : sortMode === 'alphabetical' ? 'Alphabetical' : 'Complexity'}
                </span>
                <ChevronDown className={`w-3 h-3 text-amber-400 transition-transform ${isSortMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Sort Options Dropdown Menu */}
              {isSortMenuOpen && (
                <div className={`absolute left-0 top-[44px] w-56 rounded-xl border-2 shadow-xl z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150 ${
                  currentTheme === 'white'
                    ? 'bg-white border-amber-400 text-stone-900 shadow-stone-300/50'
                    : 'bg-[#12130e] border-amber-500/50 text-stone-100 shadow-[0_10px_30px_rgba(0,0,0,0.85)]'
                }`}>
                  <div className="px-2 py-1 text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold border-b border-stone-800 mb-1">
                    Sort Nodes By:
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSortChange?.('complexity');
                      setIsSortMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      sortMode === 'complexity'
                        ? 'bg-purple-950/80 text-purple-300 border border-purple-500/50'
                        : 'text-stone-300 hover:bg-stone-900 hover:text-purple-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Brain className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>Complexity Level</span>
                    </div>
                    {sortMode === 'complexity' && <span className="text-[9px] text-purple-400 font-bold font-mono">Active</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSortChange?.('profitability');
                      setIsSortMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      sortMode === 'profitability'
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50'
                        : 'text-stone-300 hover:bg-stone-900 hover:text-emerald-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Profitability Deviation</span>
                    </div>
                    {sortMode === 'profitability' && <span className="text-[9px] text-emerald-400 font-bold font-mono">Active</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSortChange?.('alphabetical');
                      setIsSortMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      sortMode === 'alphabetical'
                        ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/50'
                        : 'text-stone-300 hover:bg-stone-900 hover:text-cyan-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ArrowDownAZ className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Alphabetical Order</span>
                    </div>
                    {sortMode === 'alphabetical' && <span className="text-[9px] text-cyan-400 font-bold font-mono">Active</span>}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 3. RANDOM ROLL NODE BUTTON (NEXT TO SORT) */}
          {!isSearchFocused && (
            <button
              type="button"
              onClick={onRollRandomCard}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 transition-all cursor-pointer touch-manipulation min-h-[38px] active:scale-90 active:rotate-180 duration-300 shadow-sm shrink-0 ${
                currentTheme === 'white'
                  ? 'bg-amber-50 border-amber-400 text-amber-900 hover:bg-amber-100'
                  : 'bg-[#181913] border-amber-500/50 hover:border-amber-400 text-amber-300 hover:bg-[#22231b]'
              }`}
              title="Roll Random Architecture Blueprint"
              aria-label="Roll Random Card"
            >
              <Dices className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline font-mono text-xs font-bold text-amber-200">Random</span>
            </button>
          )}
        </div>

        {/* 3. CATEGORY DROPDOWN SELECTOR (CENTERED DIRECTLY BETWEEN RANDOM AND PRINTER QUEUE) */}
        {!isSearchFocused && (
          <div className="relative flex-1 min-w-0 max-w-[250px] sm:max-w-[360px] md:max-w-[480px] lg:max-w-[540px] mx-auto px-1 sm:px-2" ref={sectionDropdownRef}>
            <button
              type="button"
              onClick={() => setIsSectionMenuOpen((prev) => !prev)}
              className={`w-full flex items-center justify-between gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border-2 transition-all duration-200 focus:outline-none cursor-pointer touch-manipulation min-h-[38px] ${
                isSectionMenuOpen
                  ? currentTheme === 'white'
                    ? 'bg-stone-900 text-stone-50 font-bold border-stone-900 shadow-md'
                    : 'bg-amber-400 text-stone-950 font-black border-amber-300 shadow-[0_0_22px_rgba(251,191,36,0.65)]'
                  : currentTheme === 'white'
                    ? 'bg-stone-50 border-stone-300 hover:border-amber-500 text-stone-800 shadow-sm'
                    : 'bg-[#181913] border-amber-600/40 hover:border-amber-400 text-stone-200 shadow-[0_0_12px_rgba(234,179,8,0.06)]'
              }`}
              aria-expanded={isSectionMenuOpen}
              aria-haspopup="true"
            >
              <div className={`p-1 rounded-md shrink-0 transition-colors ${
                isSectionMenuOpen
                  ? 'bg-stone-950/20 text-stone-950'
                  : currentTheme === 'white' ? 'bg-stone-200' : 'bg-stone-900/90'
              }`}>
                {getSectionIcon(activeSectionMeta.id)}
              </div>
              <div className="text-center flex-1 min-w-0 px-0.5 overflow-hidden">
                <div className={`text-[8px] sm:text-[9px] uppercase font-mono tracking-wider font-bold leading-none mb-0.5 ${
                  isSectionMenuOpen ? 'text-stone-900/80' : 'text-amber-400'
                }`}>
                  Category
                </div>
                {/* Category Title with Adaptive Font Size: Gets smaller with long titles to always fit space available */}
                <div 
                  className={`${getAdaptiveCategoryTitleClass(activeSectionMeta.shortTitle)} truncate px-0.5 ${
                    isSectionMenuOpen ? 'text-stone-950 font-black' : 'text-stone-100'
                  }`}
                  title={activeSectionMeta.shortTitle}
                >
                  {activeSectionMeta.shortTitle}
                </div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                isSectionMenuOpen
                  ? 'rotate-180 text-stone-950 font-bold'
                  : 'text-stone-400'
              }`} />
            </button>

              {/* Category Dropdown Menu Container (Centered Below Header) */}
              {isSectionMenuOpen && (
                <div className={`fixed left-1/2 -translate-x-1/2 top-[60px] sm:top-[64px] w-[95vw] sm:w-[680px] md:w-[740px] max-w-[740px] rounded-2xl border-2 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 ${
                  currentTheme === 'white'
                    ? 'bg-white border-amber-500/40 text-stone-900 shadow-stone-300/40'
                    : 'bg-[#12130e] border-amber-500/50 text-stone-100 shadow-[0_12px_45px_rgba(0,0,0,0.85)]'
                }`}>
                  <div className={`px-4 py-2.5 border-b-2 flex items-center justify-between ${
                    currentTheme === 'white' ? 'bg-stone-50 border-stone-200' : 'bg-[#181913] border-stone-800'
                  }`}>
                    <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                      Domain Category Directory
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {SECTIONS.length - 1} Domain Categories · {TECH_CARDS.length} Total Nodes
                    </span>
                  </div>

                  <div className="p-3 max-h-[75vh] overflow-y-auto space-y-3">
                    {/* LEVEL 1: ALL DOMAINS */}
                    <div>
                      {(() => {
                        const allSec = SECTIONS.find((s) => s.id === 'all');
                        if (!allSec) return null;
                        const isSelected = currentSection === 'all';
                        return (
                          <button
                            type="button"
                            onClick={() => {
                              playTacticalClick();
                              onSelectSection('all');
                              setIsSectionMenuOpen(false);
                            }}
                            className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-all border-2 cursor-pointer touch-manipulation min-h-[50px] ${
                              isSelected 
                                ? 'bg-amber-950/50 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(234,179,8,0.2)]' 
                                : 'bg-[#1a1b14] border-stone-800 hover:bg-[#22241b] text-stone-200'
                            }`}
                          >
                            <div className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 shrink-0 mt-0.5">
                              {getSectionIcon('all')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-sm sm:text-base font-bold uppercase font-mono tracking-wider text-amber-300">
                                  {allSec.title} — All {SECTIONS.length - 1} Categories
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-amber-950 border border-amber-500/50 text-amber-300 font-bold ml-1 shrink-0">
                                  {TECH_CARDS.length}
                                </span>
                              </div>
                              <p className="text-xs text-stone-400 line-clamp-1 mt-0.5">
                                {allSec.description}
                              </p>
                            </div>
                          </button>
                        );
                      })()}
                    </div>

                    {/* HORIZONTAL DIVIDER: 6 TYPES OF E-COMMERCE */}
                    <div className="my-2 border-t-2 border-emerald-500/40 relative flex items-center justify-center">
                      <span className="bg-[#12130e] px-3 text-[9px] font-mono uppercase tracking-widest text-emerald-400 font-bold border border-emerald-500/40 rounded-full py-0.5">
                        6 Types of E-Commerce (Solo Prompt &amp; Automation — 32 Nodes Each)
                      </span>
                    </div>

                    {/* LEVEL 2: 6 E-COMMERCE SOLO-ENTREPRENEURSHIP DOMAINS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {SECTIONS
                        .filter((s) => ECOMMERCE_SECTION_IDS.includes(s.id))
                        .map((sec) => {
                          const isSelected = sec.id === currentSection;
                          return (
                            <button
                              type="button"
                              key={`ecom-${sec.id}`}
                              onClick={() => {
                                playTacticalClick();
                                onSelectSection(sec.id);
                                setIsSectionMenuOpen(false);
                              }}
                              className={`flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-all border-2 cursor-pointer touch-manipulation min-h-[56px] ${
                                isSelected
                                  ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200 shadow-[0_0_14px_rgba(16,185,129,0.25)]'
                                  : 'border-emerald-900/40 bg-[#111915] hover:bg-[#16231c] hover:border-emerald-500/60 text-stone-200 hover:text-emerald-100'
                              }`}
                            >
                              <div className="p-1.5 rounded-lg border shrink-0 mt-0.5 bg-stone-900 border-emerald-800/50">
                                {getSectionIcon(sec.id)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-bold truncate text-emerald-300">
                                    {sec.shortTitle}
                                  </span>
                                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-bold ml-1 shrink-0">
                                    {sec.totalCards} Nodes
                                  </span>
                                </div>
                                <p className="text-[11px] line-clamp-1 mt-0.5 text-stone-300">
                                  {sec.title}
                                </p>
                                <p className="text-[10px] font-mono text-emerald-400/80 truncate mt-0.5">
                                  Manufacture · Attracting Clients · Order Processing · Data Manipulation
                                </p>
                              </div>
                            </button>
                          );
                        })}
                    </div>

                    {/* HORIZONTAL DIVIDER 1 */}
                    <div className="my-2 border-t-2 border-amber-500/30 relative flex items-center justify-center">
                      <span className="bg-[#12130e] px-3 text-[9px] font-mono uppercase tracking-widest text-amber-400 font-bold border border-amber-500/30 rounded-full py-0.5">
                        Normal Domain Categories
                      </span>
                    </div>

                    {/* LEVEL 3: NORMAL DOMAINS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {SECTIONS
                        .filter((s) => s.id !== 'all' && s.domainClassification !== 'military')
                        .sort((a, b) => a.shortTitle.localeCompare(b.shortTitle))
                        .map((sec) => {
                          const isSelected = sec.id === currentSection;
                          return (
                            <button
                              type="button"
                              key={sec.id}
                              onClick={() => {
                                playTacticalClick();
                                onSelectSection(sec.id);
                                setIsSectionMenuOpen(false);
                              }}
                              className={`flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-all border-2 cursor-pointer touch-manipulation min-h-[50px] ${
                                isSelected 
                                  ? 'bg-amber-950/40 border-amber-400/80 text-amber-200 shadow-[0_0_12px_rgba(234,179,8,0.15)]' 
                                  : currentTheme === 'white'
                                  ? 'border-stone-200 hover:bg-stone-50 text-stone-700 hover:text-stone-950'
                                  : 'border-stone-800/80 hover:bg-stone-900/80 hover:border-amber-600/40 text-stone-300 hover:text-stone-100'
                              }`}
                            >
                              <div className={`p-1.5 rounded-lg border shrink-0 mt-0.5 ${
                                currentTheme === 'white' ? 'bg-stone-100 border-stone-200' : 'bg-stone-900 border-stone-800'
                              }`}>
                                {getSectionIcon(sec.id)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-semibold truncate">
                                    {sec.shortTitle}
                                  </span>
                                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-stone-900 border border-stone-800 text-stone-300 ml-1 shrink-0">
                                    {sec.totalCards}
                                  </span>
                                </div>
                                <p className={`text-xs line-clamp-1 mt-0.5 ${currentTheme === 'white' ? 'text-stone-500' : 'text-stone-400'}`}>
                                  {sec.description}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                    </div>

                    {/* HORIZONTAL DIVIDER 2 */}
                    <div className="my-2 border-t-2 border-red-600/40 relative flex items-center justify-center">
                      <span className="bg-[#12130e] px-3 text-[9px] font-mono uppercase tracking-widest text-red-400 font-bold border border-red-600/40 rounded-full py-0.5">
                        Military &amp; Tactical Domains
                      </span>
                    </div>

                    {/* LEVEL 4: MILITARY DOMAINS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {SECTIONS
                        .filter((s) => s.domainClassification === 'military')
                        .sort((a, b) => a.shortTitle.localeCompare(b.shortTitle))
                        .map((sec) => {
                          const isSelected = sec.id === currentSection;
                          return (
                            <button
                              type="button"
                              key={sec.id}
                              onClick={() => {
                                playTacticalClick();
                                onSelectSection(sec.id);
                                setIsSectionMenuOpen(false);
                              }}
                              className={`flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-all border-2 cursor-pointer touch-manipulation min-h-[50px] ${
                                isSelected 
                                  ? 'bg-red-950/60 border-red-500/80 text-red-200 shadow-[0_0_12px_rgba(239,68,68,0.2)]' 
                                  : 'border-red-900/30 bg-[#160e12] hover:bg-[#201318] hover:border-red-600/50 text-stone-300 hover:text-red-100'
                              }`}
                            >
                              <div className="p-1.5 rounded-lg border shrink-0 mt-0.5 bg-stone-900 border-red-900/40">
                                {getSectionIcon(sec.id)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-semibold truncate text-red-200">
                                    {sec.shortTitle}
                                  </span>
                                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-red-950/80 border border-red-600/40 text-red-300 ml-1 shrink-0">
                                    {sec.totalCards}
                                  </span>
                                </div>
                                <p className="text-xs line-clamp-1 mt-0.5 text-stone-400">
                                  {sec.description}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        {/* Full-Header Physics Expanded Search Bar */}
        {isSearchFocused && (
          <div 
            ref={searchContainerRef}
            className="absolute inset-x-2 sm:inset-x-4 top-1/2 -translate-y-1/2 z-50 flex items-center gap-2 transition-all duration-300 ease-out animate-in fade-in zoom-in-95"
          >
            <div className={`relative flex-1 flex items-center rounded-xl border-2 transition-all duration-200 ${
              currentTheme === 'white'
                ? 'border-amber-500 bg-white shadow-xl'
                : 'border-amber-400 bg-[#13140f] shadow-[0_0_28px_rgba(234,179,8,0.3)]'
            }`}>
              <Search className="w-4 h-4 ml-3 text-amber-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={`Search all ${TECH_CARDS.length} nodes (B2B, B2C, D2C, C2C, C2B, B2G, Manufacture, CRM, math, jargon)...`}
                className="w-full bg-transparent px-3 py-2 text-xs focus:outline-none placeholder:text-stone-500 text-stone-100 font-sans search-input select-text"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="p-1 mr-2 text-stone-400 hover:text-stone-200 cursor-pointer touch-manipulation"
                  title="Clear query"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setIsSearchFocused(false);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition-colors border-2 shadow-sm ${
                currentTheme === 'white'
                  ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
                  : 'bg-stone-900 hover:bg-stone-800 text-amber-300 border-stone-700 hover:text-white'
              }`}
            >
              Cancel
            </button>

            {/* Dropdown Results Preview */}
            <div className={`absolute left-0 right-0 top-full mt-2 rounded-2xl border-2 shadow-2xl z-50 overflow-hidden ${
              currentTheme === 'white'
                ? 'bg-white border-amber-500/40 text-stone-900'
                : 'bg-[#12130e] border-amber-500/50 text-stone-100 shadow-[0_12px_45px_rgba(0,0,0,0.85)]'
            }`}>
              {/* Quick E-Commerce & 4-Pillar Search Chips */}
              <div className="px-3.5 py-2 border-b border-stone-800 bg-[#161812] flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold mr-1">
                  Quick Filter:
                </span>
                {[
                  { label: 'B2B (32)', query: 'B2B', section: 'b2b-ecommerce' as SectionId },
                  { label: 'B2C (32)', query: 'B2C', section: 'b2c-ecommerce' as SectionId },
                  { label: 'D2C (32)', query: 'D2C', section: 'd2c-ecommerce' as SectionId },
                  { label: 'C2C (32)', query: 'C2C', section: 'c2c-ecommerce' as SectionId },
                  { label: 'C2B (32)', query: 'C2B', section: 'c2b-ecommerce' as SectionId },
                  { label: 'B2G (32)', query: 'B2G', section: 'b2g-ecommerce' as SectionId },
                  { label: 'Manufacture', query: 'Manufacture' },
                  { label: 'Attracting Clients', query: 'Attracting Clients' },
                  { label: 'Order Processing', query: 'Order Processing' },
                  { label: 'Data Manipulation', query: 'Data Manipulation' },
                ].map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      playTacticalClick();
                      onSearchChange(chip.query);
                    }}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold border transition-all cursor-pointer ${
                      searchQuery.toLowerCase() === chip.query.toLowerCase()
                        ? 'bg-emerald-950 border-emerald-400 text-emerald-200'
                        : 'bg-stone-900/90 border-stone-700 text-stone-300 hover:border-emerald-500/60 hover:text-emerald-300'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {searchQuery ? (
                <div>
                  <div className={`px-4 py-2.5 border-b-2 flex items-center justify-between text-[11px] font-mono ${
                    currentTheme === 'white' ? 'bg-stone-100 border-stone-200' : 'bg-[#181913] border-stone-800'
                  }`}>
                    <span className="text-amber-400 font-bold">
                      Search Results ({searchResults.length} top matches across {TECH_CARDS.length} nodes)
                    </span>
                    <span className="text-stone-400 text-[10px]">
                      Press Esc to close
                    </span>
                  </div>
                  <div className="max-h-80 overflow-y-auto p-1.5 divide-y divide-stone-800/60">
                    {searchResults.length > 0 ? (
                      searchResults.slice(0, 12).map((res) => (
                        <button
                          type="button"
                          key={res.card.id}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            onSelectSearchResult(res.card.id);
                            setIsSearchFocused(false);
                          }}
                          className="w-full text-left p-2.5 rounded-lg hover:bg-amber-950/30 border border-transparent transition-all group cursor-pointer touch-manipulation min-h-[44px]"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold group-hover:text-amber-400 text-stone-200 truncate">
                              {res.card.title}
                            </span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-stone-900 border border-stone-700 text-cyan-300">
                                {res.card.sectionId}
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-amber-300 font-medium">
                                {res.card.subcategory}
                              </span>
                            </div>
                          </div>
                          <p className={`text-[11px] line-clamp-1 mt-0.5 ${currentTheme === 'white' ? 'text-stone-500' : 'text-stone-400'}`}>
                            {res.card.description}
                          </p>
                        </button>
                      ))
                    ) : (
                      <div className="py-6 text-center text-xs text-stone-400">
                        No direct matches found. Try searching for <span className="text-emerald-300">B2B</span>, <span className="text-purple-300">D2C</span>, <span className="text-amber-300">Manufacture</span>, or <span className="text-cyan-300">CRM</span>.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                    <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Smart Search (Complexity vs Yield Ratio Matched)</span>
                    </span>
                    <span className="text-[10px] font-mono text-stone-400 hidden sm:inline">
                      Semantically Relevant ({TECH_CARDS.length} Nodes Indexed)
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                    {getSmartSearchSuggestions(currentSection, searchQuery).map((s) => (
                      <button
                        type="button"
                        key={s.id}
                        onMouseDown={(e) => e.preventDefault()}
                        onMouseEnter={() => {
                          if (s.cardId) {
                            const card = TECH_CARDS.find((c) => c.id === s.cardId);
                            if (card) intelligentPrefetcher.observeHover(card, TECH_CARDS);
                          }
                        }}
                        onMouseLeave={() => intelligentPrefetcher.cancelHover()}
                        onClick={() => {
                          hasSelectedFromSmartSearch.current = true;
                          if (s.cardId) {
                            recordCardInteraction(s.cardId);
                            onSelectSearchResult(s.cardId);
                          } else {
                            onSearchChange(s.query);
                          }
                          setIsSearchFocused(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer touch-manipulation flex items-center justify-between gap-3 group ${
                          currentTheme === 'white'
                            ? 'bg-stone-50 hover:bg-amber-50 border-stone-200 hover:border-amber-400 text-stone-800'
                            : 'bg-stone-900/90 hover:bg-amber-950/40 border-stone-800 hover:border-amber-500/50 text-stone-200'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-sans text-xs font-bold truncate text-amber-200 group-hover:text-amber-300">
                            {s.title}
                          </div>
                          <div className="text-[10px] font-mono text-stone-400 truncate mt-0.5">
                            {s.reason}
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 font-bold">
                            Yield {s.ratio}x
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right Side: 4. Printer Queue -> View Switcher -> 5. Settings (Top Right) */}
        <div className={`flex items-center gap-1.5 sm:gap-2 shrink-0 transition-opacity duration-200 ${isSearchFocused ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          
          {/* PWA Install Button */}
          <PWAInstallButton currentTheme={currentTheme} />

          {/* View Switcher (Cards / Mind Map) */}
          <div className={`hidden lg:flex items-center p-0.5 rounded-xl border-2 ${
            currentTheme === 'white' ? 'bg-stone-100 border-stone-200' : 'bg-stone-900/90 border-stone-800'
          }`}>
            <button
              type="button"
              onClick={() => onViewChange('cards')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer touch-manipulation min-h-[32px] ${
                activeView === 'cards'
                  ? 'bg-amber-950/80 text-amber-200 border border-amber-500/50 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Cards View"
            >
              <Compass className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onViewChange('mindmap')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer touch-manipulation min-h-[32px] ${
                activeView === 'mindmap'
                  ? 'bg-amber-950/80 text-amber-200 border border-amber-500/50 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Visual Mind Map"
            >
              <Network className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4. BOOKMARKS & PRINT QUEUE BUTTON */}
          <button
            type="button"
            onClick={() => {
              playTacticalClick();
              onOpenBookmarks();
            }}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border-2 transition-all text-xs focus:outline-none cursor-pointer touch-manipulation min-h-[38px] active:scale-95 ${
              currentTheme === 'white'
                ? 'bg-stone-50 border-stone-300 hover:border-amber-400 text-stone-700'
                : 'bg-[#181913] border-amber-600/40 hover:border-amber-400/70 text-stone-200 hover:text-amber-200'
            }`}
            title="Open Saved Bookmarks & Print Dossier"
          >
            <Bookmark className={`w-3.5 h-3.5 text-amber-400 ${bookmarkCount > 0 ? 'fill-amber-400' : ''}`} />
            <span className="hidden sm:inline font-mono text-[11px] font-bold">Bookmarks</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-950 border border-amber-400/50 text-[10px] font-mono text-amber-300 font-bold">
              {bookmarkCount}
            </span>
          </button>

          <Link 
            href="/privacy" 
            onClick={() => playTacticalClick()}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 transition-all text-xs font-mono font-bold hover:text-amber-300 active:scale-95 ${
              currentTheme === 'white'
                ? 'bg-stone-50 border-stone-300 text-stone-600'
                : 'bg-[#181913] border-stone-800 hover:border-amber-500/50 text-stone-400'
            }`}
          >
            Privacy
          </Link>

          {/* 5. SETTINGS BUTTON (TOP RIGHT) */}
          <button
            type="button"
            onClick={() => {
              playTacticalClick();
              onOpenSettings();
            }}
            className={`flex items-center justify-center p-2 rounded-xl border-2 transition-all focus:outline-none cursor-pointer touch-manipulation min-h-[38px] min-w-[38px] active:scale-95 ${
              currentTheme === 'white'
                ? 'bg-stone-50 border-stone-300 hover:border-amber-400 text-stone-700 hover:text-stone-950 shadow-sm'
                : 'bg-[#181913] border-amber-600/40 hover:border-amber-400 text-stone-200 hover:text-amber-300 shadow-[0_0_12px_rgba(234,179,8,0.1)]'
            }`}
            title="Settings & Reading Time"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
