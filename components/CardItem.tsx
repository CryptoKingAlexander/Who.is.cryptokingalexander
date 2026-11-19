'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { TechCard } from '../types/techbook';
import { useNodeDeck } from '../context/NodeDeckContext';
import { useTacticalTheme } from '../context/TacticalThemeContext';
import { useToast } from '../context/ToastContext';
import { useIntelligentPrefetch } from '../context/PrefetchContext';
import { SvgEquation, PhysicsVar, PhysicsText } from './SvgEquation';
import { AcronymText } from './AcronymInfo';
import { useJargon } from './JargonDiscovery';
import { CardErrorBoundary } from './CardErrorBoundary';
import { getHighlightSegments } from '../lib/fullTextSearchIndex';
import {
  computeSemanticComplexityIndex,
  computeProfitabilityDeviationScore,
} from '../lib/complexityScoring';
import {
  getMacroCategoryForCard,
  getOfficialBusinessClassificationForCard,
  getProgramManagerOverviewForCard,
  getSystemsArchitectPerspectiveForCard,
  getProfitabilityAnalysisForCard,
  getCyberOperationsLiaisonForCard,
  getExpertInsightsForCard,
  getEcomGuruPerspectiveForCard,
  getGamingProjectManagerPerspectiveForCard,
  getPortersFiveForcesForCard,
  getMathematicalTopicalityForCard,
} from '../lib/expertInsightsGenerator';
import {
  FileText,
  Printer,
  Bookmark,
  Share2,
  ChevronDown,
  ChevronUp,
  Shield,
  Check,
  Cpu,
  BarChart3,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  Layers,
  Sigma,
  Code2,
  BookOpen,
  Tag,
  ExternalLink,
  ShoppingCart,
  Gamepad2,
} from 'lucide-react';
import { playTacticalClick, playNodeExpandHum, playBookmarkChime } from '../lib/tacticalAudio';

interface CardItemProps {
  card: TechCard;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  searchQuery?: string;
  matchedFields?: string[];
  searchScore?: number;
}

type SubnodeKey =
  | 'perspectives'
  | 'expert-insights'
  | 'porters-forces'
  | 'algorithms'
  | 'equations'
  | 'jargon'
  | 'tags';

function HighlightedOrAcronymText({
  text,
  query,
  mode = 'full',
}: {
  text: string;
  query?: string;
  mode?: 'full' | 'color-only';
}) {
  const segments = useMemo(() => getHighlightSegments(text, query || ''), [text, query]);
  if (!query || !query.trim()) {
    return <AcronymText text={text} mode={mode} />;
  }
  return (
    <>
      {segments.map((seg, i) =>
        seg.highlight ? (
          <mark
            key={i}
            className="bg-amber-500/35 text-amber-200 px-1 rounded font-bold border border-amber-400/50"
          >
            {seg.text}
          </mark>
        ) : (
          <AcronymText key={i} text={seg.text} mode={mode} />
        )
      )}
    </>
  );
}

export function CardItem({
  card,
  isExpanded = false,
  onToggleExpand,
  searchQuery = '',
  matchedFields,
  searchScore,
}: CardItemProps) {
  const {
    openMilitaryReport,
    togglePrintQueue,
    printQueue,
    toggleBookmark,
    isBookmarked,
    setPreviewNodeId,
    setPrintPreviewOpen,
    setSearchQuery,
    focusNodeById,
  } = useNodeDeck();

  const { theme } = useTacticalTheme();
  const { addToast } = useToast();
  const { observeHover, cancelHover, observeExpansion } = useIntelligentPrefetch();
  const { showJargon } = useJargon();

  const [copiedLink, setCopiedLink] = useState(false);

  // Start app with every expandable section collapsed
  const [openSubnodes, setOpenSubnodes] = useState<Record<SubnodeKey, boolean>>({
    perspectives: false,
    'expert-insights': false,
    'porters-forces': false,
    algorithms: false,
    equations: false,
    jargon: false,
    tags: false,
  });

  // Individual role perspective sub-drawers inside the 6 Perspectives Subnode Container
  const [openRoleDrawers, setOpenRoleDrawers] = useState<Record<string, boolean>>({
    pm: true,
    architect: true,
    profitability: true,
    cyber: true,
    ecom: true,
    gaming: true,
  });

  const inQueue = printQueue.includes(card.id);
  const bookmarked = isBookmarked(card.id);
  const isMilitary = card.domainClassification === 'military';
  const isWhite = theme === 'white' || theme === 'paper-white';

  const complexityScore = useMemo(() => computeSemanticComplexityIndex(card), [card]);
  const profitabilityScore = useMemo(() => computeProfitabilityDeviationScore(card), [card]);
  const classificationBanner = useMemo(() => getOfficialBusinessClassificationForCard(card), [card]);
  const macroCategory = useMemo(() => getMacroCategoryForCard(card.sectionId), [card.sectionId]);

  // Lazy-computed rich subnode payloads when card is expanded
  const subnodePayloads = useMemo(() => {
    if (!isExpanded) return null;
    return {
      pmOverview: getProgramManagerOverviewForCard(card),
      architectPerspective: getSystemsArchitectPerspectiveForCard(card),
      profitabilityAnalysis: getProfitabilityAnalysisForCard(card),
      cyberLiaison: getCyberOperationsLiaisonForCard(card),
      ecomPerspective: getEcomGuruPerspectiveForCard(card),
      gamingPerspective: getGamingProjectManagerPerspectiveForCard(card),
      expertInsights: getExpertInsightsForCard(card),
      portersForces: getPortersFiveForcesForCard(card),
      mathTopicality: getMathematicalTopicalityForCard(card),
    };
  }, [card, isExpanded]);

  const toggleSubnodeContainer = (key: SubnodeKey, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playNodeExpandHum();
    if (!isExpanded && onToggleExpand) {
      onToggleExpand();
      observeExpansion(card);
      setOpenSubnodes((prev) => ({ ...prev, [key]: true }));
      return;
    }
    setOpenSubnodes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleRoleDrawer = (roleKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playTacticalClick();
    setOpenRoleDrawers((prev) => ({ ...prev, [roleKey]: !prev[roleKey] }));
  };

  const allSubnodesOpen = Object.values(openSubnodes).every(Boolean);
  const handleToggleAllSubnodes = (e: React.MouseEvent) => {
    e.stopPropagation();
    playNodeExpandHum();
    const next = !allSubnodesOpen;
    setOpenSubnodes({
      perspectives: next,
      'expert-insights': next,
      'porters-forces': next,
      algorithms: next,
      equations: next,
      jargon: next,
      tags: next,
    });
    if (next) {
      setOpenRoleDrawers({
        pm: true,
        architect: true,
        profitability: true,
        cyber: true,
        ecom: true,
        gaming: true,
      });
    }
  };

  const handlePrintCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTacticalClick();
    setPreviewNodeId(card.id);
    setPrintPreviewOpen(true);
  };

  const handleQueueToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    playBookmarkChime();
    togglePrintQueue(card.id);
    if (!inQueue) {
      addToast('ADDED TO PRINT QUEUE', `${card.title.slice(0, 32)}... queued for dossier`, 'success');
    }
  };

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    playBookmarkChime();
    toggleBookmark(card.id);
    addToast(
      bookmarked ? 'BOOKMARK REMOVED' : 'BOOKMARK SAVED',
      `${card.title.slice(0, 38)}...`,
      bookmarked ? 'info' : 'success'
    );
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTacticalClick();
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/node/${encodeURIComponent(card.id)}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      addToast('LINK COPIED', `Direct deep link to ${card.id} copied`, 'success');
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCardHeaderClick = () => {
    playNodeExpandHum();
    if (!isExpanded) {
      observeExpansion(card);
    }
    if (onToggleExpand) {
      onToggleExpand();
    }
  };

  const eqCount = card.equations?.length || 0;
  const jargonCount = card.jargon?.length || 0;
  const hasAlgos = Boolean(card.fundamentalAlgorithm || card.optimizationAlgorithm);

  return (
    <CardErrorBoundary cardId={card.id} cardTitle={card.title}>
      <article
        id={`node-card-${card.id}`}
        onMouseEnter={() => observeHover(card)}
        onMouseLeave={() => cancelHover()}
        className={`group relative w-full flex flex-col justify-between rounded-xl border p-3.5 sm:p-4 transition-all duration-200 font-sans ${
          isMilitary
            ? 'border-red-600/50 bg-[#140d10] hover:border-red-500 shadow-[0_6px_24px_rgba(239,68,68,0.12)]'
            : isWhite
            ? 'border-amber-500/50 bg-white text-stone-900 hover:border-amber-600 shadow-sm'
            : 'border-amber-500/40 bg-[#12130e] text-stone-100 hover:border-amber-400 shadow-[0_6px_24px_rgba(0,0,0,0.6)]'
        }`}
      >
        {/* TOP HEADER & PRIMARY CARD SUMMARY */}
        <div>
          {/* Minimal Clean Action Bar: Bookmark + Copy text button */}
          <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-stone-800/80">
            <div className="flex items-center gap-2">
              {/* Bookmark Button */}
              <button
                type="button"
                onClick={handleBookmarkToggle}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  bookmarked
                    ? 'text-amber-300 bg-amber-950/80 border border-amber-500/60 shadow-xs'
                    : 'text-stone-400 hover:text-stone-200 bg-stone-900/80 hover:bg-stone-800 border border-stone-800'
                }`}
                title={bookmarked ? 'Remove Bookmark' : 'Bookmark Node'}
              >
                <Bookmark className={`h-3.5 w-3.5 ${bookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span>{bookmarked ? 'Saved' : 'Bookmark'}</span>
              </button>

              {/* Copy Text Word Button */}
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-stone-300 hover:text-amber-200 bg-stone-900/80 hover:bg-stone-800 border border-stone-800 transition-all cursor-pointer"
                title="Copy Deep Link to Node"
              >
                {copiedLink ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <span>Copy</span>
                )}
              </button>
            </div>

            {/* Expand / Collapse Section Button */}
            <button
              type="button"
              onClick={handleCardHeaderClick}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-amber-500/40 bg-[#181913] hover:bg-[#22241b] text-xs font-mono font-bold text-amber-300 transition-colors cursor-pointer select-none"
            >
              <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
              )}
            </button>
          </div>

          {/* Clickable Card Title & Description Area */}
          <div>
            <div onClick={handleCardHeaderClick} className="cursor-pointer select-none">
              <h3
                className={`text-base sm:text-lg font-extrabold leading-snug underline decoration-2 underline-offset-4 transition-colors ${
                  isMilitary
                    ? 'text-red-100 decoration-red-500/70 hover:text-red-300'
                    : isWhite
                    ? 'text-amber-950 decoration-amber-600/70 hover:text-amber-700'
                    : 'text-amber-100 decoration-amber-500/70 hover:text-amber-300'
                }`}
              >
                <HighlightedOrAcronymText text={card.title} query={searchQuery} mode="color-only" />
              </h3>
            </div>

            {/* Operational Description Text */}
            <div
              className={`text-xs sm:text-[13px] mt-2.5 leading-relaxed ${
                isWhite ? 'text-stone-700' : 'text-stone-200'
              }`}
            >
              <HighlightedOrAcronymText text={card.description} query={searchQuery} mode="full" />
            </div>
          </div>

          {/* SUBNODE CONTAINER QUICK-LAUNCHER PILLS (Always visible so user can jump into any subnode container) */}
          <div className="mt-3.5 pt-2.5 border-t border-stone-800/80 flex flex-wrap items-center gap-1.5 font-mono">
            <span className="text-[9px] uppercase tracking-wider text-amber-400/90 font-bold mr-1">
              Subnode Containers:
            </span>
            {[
              { key: 'perspectives' as SubnodeKey, label: '6 Role Directives', icon: BarChart3 },
              { key: 'expert-insights' as SubnodeKey, label: '4D Expert Insights', icon: Sparkles },
              { key: 'porters-forces' as SubnodeKey, label: "Porter's 5 Forces", icon: Layers },
              ...(hasAlgos
                ? [{ key: 'algorithms' as SubnodeKey, label: 'Algorithms', icon: Code2 }]
                : []),
              { key: 'equations' as SubnodeKey, label: `Math (${eqCount})`, icon: Sigma },
              { key: 'jargon' as SubnodeKey, label: `Jargon (${jargonCount})`, icon: BookOpen },
              { key: 'tags' as SubnodeKey, label: `Tags (${card.tagSoup?.length || 0})`, icon: Tag },
            ].map((item) => {
              const IconComp = item.icon;
              const isActive = isExpanded && openSubnodes[item.key];
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={(e) => toggleSubnodeContainer(item.key, e)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 border-amber-300 shadow-xs'
                      : 'bg-[#181913] text-stone-300 border-stone-800 hover:border-amber-500/50 hover:text-amber-200'
                  }`}
                >
                  <IconComp className="w-3 h-3 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* EXPANDED COLLAPSING SUBNODE CONTAINERS STACK */}
          {isExpanded && subnodePayloads && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="mt-4 pt-3.5 border-t-2 border-amber-500/30 space-y-2.5 animate-in fade-in duration-150"
            >
              {/* Subnode Stack Control Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[10px] font-mono text-stone-400">
                <span className="truncate text-amber-400 font-bold">
                  {classificationBanner} · {macroCategory}
                </span>
                <button
                  type="button"
                  onClick={handleToggleAllSubnodes}
                  className="px-2.5 py-0.5 rounded bg-stone-900 hover:bg-stone-800 border border-amber-500/40 text-amber-300 font-bold cursor-pointer shrink-0"
                >
                  {allSubnodesOpen ? 'Collapse All Subnodes' : 'Expand All Subnodes'}
                </button>
              </div>

              {/* ===================================================================
                  SUBNODE CONTAINER 1: 6 EXECUTIVE & DOMAIN ROLE DIRECTIVES
              =================================================================== */}
              <div className="rounded-xl border-2 border-amber-500/40 bg-[#151711] overflow-hidden">
                <button
                  type="button"
                  onClick={(e) => toggleSubnodeContainer('perspectives', e)}
                  className="w-full px-3.5 py-2.5 bg-[#191b14] hover:bg-[#21241a] flex items-center justify-between gap-2 text-left font-mono cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                      1. Executive &amp; Operational Role Directives (6 Subnode Drawers)
                    </span>
                  </div>
                  {openSubnodes.perspectives ? (
                    <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                </button>

                {openSubnodes.perspectives && (
                  <div className="p-3 space-y-2 border-t border-stone-800">
                    {[
                      {
                        id: 'pm',
                        title: '1.1 Principal Program Manager Overview',
                        content: subnodePayloads.pmOverview,
                        border: 'border-amber-500/40',
                        text: 'text-amber-300',
                        icon: BarChart3,
                      },
                      {
                        id: 'architect',
                        title: '1.2 Chief Systems Architect Directive & Invariants',
                        content: subnodePayloads.architectPerspective,
                        border: 'border-cyan-500/40',
                        text: 'text-cyan-300',
                        icon: Cpu,
                      },
                      {
                        id: 'profitability',
                        title: '1.3 Monetization Forecaster & Unit Economics Yield (ΔProfit)',
                        content: subnodePayloads.profitabilityAnalysis,
                        border: 'border-emerald-500/40',
                        text: 'text-emerald-300',
                        icon: TrendingUp,
                      },
                      {
                        id: 'cyber',
                        title: '1.4 Cyber Operations Liaison Directive',
                        content: subnodePayloads.cyberLiaison,
                        border: 'border-red-500/40',
                        text: 'text-red-300',
                        icon: ShieldAlert,
                      },
                      {
                        id: 'ecom',
                        title: '1.5 E-Commerce & Growth Systems Perspective',
                        content: subnodePayloads.ecomPerspective,
                        border: 'border-purple-500/40',
                        text: 'text-purple-300',
                        icon: ShoppingCart,
                      },
                      {
                        id: 'gaming',
                        title: "1.6 Gaming & Simulation Systems Producer ('Vibe Check' & LiveOps)",
                        content: subnodePayloads.gamingPerspective,
                        border: 'border-pink-500/40',
                        text: 'text-pink-300',
                        icon: Gamepad2,
                      },
                    ].map((role) => {
                      const RoleIcon = role.icon;
                      const isRoleOpen = !!openRoleDrawers[role.id];
                      return (
                        <div
                          key={role.id}
                          className={`rounded-lg border ${role.border} bg-[#0e100b] overflow-hidden`}
                        >
                          <button
                            type="button"
                            onClick={(e) => toggleRoleDrawer(role.id, e)}
                            className="w-full px-3 py-2 flex items-center justify-between gap-2 text-left bg-[#13150f] hover:bg-[#1a1d15] font-mono text-[11px] font-bold cursor-pointer"
                          >
                            <span className={`flex items-center gap-2 ${role.text}`}>
                              <RoleIcon className="w-3.5 h-3.5 shrink-0" />
                              <span>{role.title}</span>
                            </span>
                            {isRoleOpen ? (
                              <ChevronUp className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                            )}
                          </button>
                          {isRoleOpen && (
                            <div className="p-3 text-xs text-stone-200 leading-relaxed border-t border-stone-800/70">
                              <AcronymText text={role.content} mode="full" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ===================================================================
                  SUBNODE CONTAINER 2: 4-DIMENSIONAL EXPERT INSIGHTS & EXPLOITATION
              =================================================================== */}
              <div className="rounded-xl border-2 border-emerald-500/40 bg-[#111714] overflow-hidden">
                <button
                  type="button"
                  onClick={(e) => toggleSubnodeContainer('expert-insights', e)}
                  className="w-full px-3.5 py-2.5 bg-[#151d19] hover:bg-[#1b2621] flex items-center justify-between gap-2 text-left font-mono cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
                      2. 4-Dimensional Expert Insights &amp; Exploitation Playbook
                    </span>
                  </div>
                  {openSubnodes['expert-insights'] ? (
                    <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </button>

                {openSubnodes['expert-insights'] && (
                  <div className="p-3.5 space-y-3 border-t border-stone-800 text-xs text-stone-200 leading-relaxed">
                    <div className="p-3 rounded-lg bg-[#0d120f] border border-emerald-900/50">
                      <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold mb-1">
                        Topic Introduction &amp; Maximum Impact Overview
                      </div>
                      <AcronymText text={subnodePayloads.expertInsights.overviewParagraph} mode="full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      <div className="p-3 rounded-lg bg-[#0d120f] border border-stone-800">
                        <div className="text-[10px] font-mono uppercase text-amber-400 font-bold mb-1.5">
                          Options for Further Exploration
                        </div>
                        <ul className="space-y-1.5 list-disc list-inside text-[11px] text-stone-300">
                          {subnodePayloads.expertInsights.explorationOptions.map((opt, idx) => (
                            <li key={idx}>
                              <AcronymText text={opt} mode="full" />
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 rounded-lg bg-[#0d120f] border border-stone-800">
                        <div className="text-[10px] font-mono uppercase text-cyan-400 font-bold mb-1.5">
                          Options for Further Exploitation
                        </div>
                        <ul className="space-y-1.5 list-disc list-inside text-[11px] text-stone-300">
                          {subnodePayloads.expertInsights.exploitationOptions.map((opt, idx) => (
                            <li key={idx}>
                              <AcronymText text={opt} mode="full" />
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-[#0d120f] border border-amber-500/30">
                      <div className="text-[10px] font-mono uppercase text-amber-300 font-bold mb-1">
                        Integration Strategy &amp; Profitability Delta (ΔProfit &gt; 0)
                      </div>
                      <AcronymText text={subnodePayloads.expertInsights.integrationParagraph} mode="full" />
                    </div>
                  </div>
                )}
              </div>

              {/* ===================================================================
                  SUBNODE CONTAINER 3: PORTER'S 5 FORCES STRATEGIC FACTORIZATION
              =================================================================== */}
              <div className="rounded-xl border-2 border-purple-500/40 bg-[#141118] overflow-hidden">
                <button
                  type="button"
                  onClick={(e) => toggleSubnodeContainer('porters-forces', e)}
                  className="w-full px-3.5 py-2.5 bg-[#191520] hover:bg-[#211b2a] flex items-center justify-between gap-2 text-left font-mono cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="text-xs font-bold text-purple-200 uppercase tracking-wider">
                      3. Porter&apos;s 5 Forces Competitive Factorization
                    </span>
                  </div>
                  {openSubnodes['porters-forces'] ? (
                    <ChevronUp className="w-4 h-4 text-purple-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-purple-400 shrink-0" />
                  )}
                </button>

                {openSubnodes['porters-forces'] && (
                  <div className="p-3.5 space-y-2.5 border-t border-stone-800 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        {
                          label: 'Threat of New Entrants',
                          data: subnodePayloads.portersForces.threatOfNewEntrants,
                        },
                        {
                          label: 'Bargaining Power of Buyers',
                          data: subnodePayloads.portersForces.bargainingPowerOfBuyers,
                        },
                        {
                          label: 'Bargaining Power of Suppliers',
                          data: subnodePayloads.portersForces.bargainingPowerOfSuppliers,
                        },
                        {
                          label: 'Threat of Substitutes',
                          data: subnodePayloads.portersForces.threatOfSubstitutes,
                        },
                        {
                          label: 'Industry Rivalry',
                          data: subnodePayloads.portersForces.industryRivalry,
                        },
                      ].map((force) => (
                        <div
                          key={force.label}
                          className="p-2.5 rounded-lg bg-[#0e0c12] border border-stone-800"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1 font-mono">
                            <span className="text-[10px] font-bold text-purple-300">
                              {force.label}
                            </span>
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                                force.data.rating === 'Low'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                                  : force.data.rating === 'Moderate'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-700'
                                  : 'bg-red-950 text-red-300 border border-red-700'
                              }`}
                            >
                              {force.data.rating}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-300 leading-relaxed">
                            <AcronymText text={force.data.analysis} mode="full" />
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="p-2.5 rounded-lg bg-purple-950/30 border border-purple-500/30 text-[11px] text-purple-200 font-mono">
                      <AcronymText
                        text={subnodePayloads.portersForces.strategicFactorizationSummary}
                        mode="full"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ===================================================================
                  SUBNODE CONTAINER 4: FUNDAMENTAL & OPTIMIZATION ALGORITHMS
              =================================================================== */}
              {hasAlgos && (
                <div className="rounded-xl border-2 border-cyan-500/40 bg-[#0f161a] overflow-hidden">
                  <button
                    type="button"
                    onClick={(e) => toggleSubnodeContainer('algorithms', e)}
                    className="w-full px-3.5 py-2.5 bg-[#131d22] hover:bg-[#18262d] flex items-center justify-between gap-2 text-left font-mono cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="text-xs font-bold text-cyan-200 uppercase tracking-wider">
                        4. Procedural Algorithms &amp; Optimization Pseudocode
                      </span>
                    </div>
                    {openSubnodes.algorithms ? (
                      <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-cyan-400 shrink-0" />
                    )}
                  </button>

                  {openSubnodes.algorithms && (
                    <div className="p-3.5 grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-stone-800">
                      {[card.fundamentalAlgorithm, card.optimizationAlgorithm]
                        .filter(Boolean)
                        .map((algo, idx) => {
                          if (!algo) return null;
                          return (
                            <div
                              key={idx}
                              className="p-3 rounded-lg bg-[#0a0f12] border border-cyan-900/50 space-y-2"
                            >
                              <div className="flex items-center justify-between gap-2 font-mono">
                                <span className="text-[10px] uppercase font-bold text-amber-400">
                                  {algo.type} Algorithm
                                </span>
                                <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-950/90 text-cyan-200 border border-cyan-700/70">
                                  <PhysicsVar symbol={algo.complexity} className="text-cyan-200" />
                                </span>
                              </div>
                              <div className="text-xs font-bold font-mono text-stone-100">
                                {algo.name}
                              </div>
                              <p className="text-[11px] text-stone-300 leading-relaxed">
                                <AcronymText text={algo.description} mode="full" />
                              </p>
                              {algo.objective && (
                                <div className="text-[11px] text-emerald-300 bg-emerald-950/30 border border-emerald-800/50 p-2 rounded">
                                  <strong className="font-mono uppercase text-[10px]">
                                    Objective:{' '}
                                  </strong>
                                  <AcronymText text={algo.objective} mode="full" />
                                </div>
                              )}
                              {algo.pseudocode && algo.pseudocode.length > 0 && (
                                <div className="pt-1.5 border-t border-stone-800 font-mono text-[10.5px] space-y-1">
                                  <div className="text-[9px] uppercase text-stone-400 font-bold">
                                    Procedural Steps:
                                  </div>
                                  {algo.pseudocode.map((step, sIdx) => (
                                    <div key={sIdx} className="text-stone-300 flex gap-1.5">
                                      <span className="text-amber-400 font-bold shrink-0">
                                        {sIdx + 1}.
                                      </span>
                                      <span>{step}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}

              {/* ===================================================================
                  SUBNODE CONTAINER 5: MATHEMATICAL FORMULATIONS & PROOFS
              =================================================================== */}
              {eqCount > 0 && (
                <div className="rounded-xl border-2 border-amber-500/40 bg-[#14150f] overflow-hidden">
                  <button
                    type="button"
                    onClick={(e) => toggleSubnodeContainer('equations', e)}
                    className="w-full px-3.5 py-2.5 bg-[#191b13] hover:bg-[#222419] flex items-center justify-between gap-2 text-left font-mono cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Sigma className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                        5. Mathematical Governing Invariants &amp; Proofs ({eqCount})
                      </span>
                    </div>
                    {openSubnodes.equations ? (
                      <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                  </button>

                  {openSubnodes.equations && (
                    <div className="p-3.5 space-y-3.5 border-t border-stone-800 physics-font">
                      {card.equations.map((eq, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-[#0b0d09] border border-amber-500/35 space-y-2.5 shadow-inner physics-font"
                        >
                          <div className="flex items-baseline justify-between gap-2 border-b border-stone-800/80 pb-1.5">
                            <div className="physics-font text-sm sm:text-[15px] font-bold italic text-amber-200">
                              <span className="not-italic font-bold uppercase tracking-wider text-[11px] text-amber-400/90 mr-2">
                                Invariant {idx + 1}.
                              </span>
                              <PhysicsText text={eq.name} className="font-bold italic text-amber-200" />
                            </div>
                            <span className="physics-font text-xs italic text-stone-400 shrink-0">
                              Eq. ({idx + 1})
                            </span>
                          </div>

                          <SvgEquation formula={eq.formula} equationNumber={idx + 1} />

                          {eq.variables && eq.variables.length > 0 && (
                            <div className="pt-2 border-t border-stone-800/80 space-y-1.5 physics-font">
                              <div className="physics-font text-xs italic text-amber-300/90">
                                where the governing physical &amp; state variables are defined as:
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 pl-2">
                                {eq.variables.map((v, vIdx) => (
                                  <div
                                    key={vIdx}
                                    className="flex items-baseline gap-2 text-[13.5px] leading-snug text-stone-200 physics-font"
                                  >
                                    <span className="shrink-0 px-1.5 py-0.5 rounded bg-[#141610] border border-amber-500/25">
                                      <PhysicsVar symbol={v.symbol} className="text-amber-200 text-[14px]" />
                                    </span>
                                    <span className="physics-font text-stone-400 italic select-none">
                                      &mdash;
                                    </span>
                                    <PhysicsText
                                      text={v.explanation}
                                      className="text-stone-200 flex-1"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {eq.intuition && (
                            <div className="pt-2 border-t border-stone-800/60 text-[13.5px] text-stone-200 leading-relaxed physics-font">
                              <span className="font-bold italic text-amber-300 mr-1.5">
                                Physical &amp; Mathematical Intuition.
                              </span>
                              <PhysicsText text={eq.intuition} className="italic text-stone-300" />
                            </div>
                          )}
                        </div>
                      ))}

                      <div className="px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-xs italic physics-font text-amber-200">
                        {subnodePayloads.mathTopicality.footerNote}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ===================================================================
                  SUBNODE CONTAINER 6: STANDARDIZED DOMAIN JARGON & TAXONOMY
              =================================================================== */}
              {jargonCount > 0 && (
                <div className="rounded-xl border-2 border-stone-700 bg-[#131410] overflow-hidden">
                  <button
                    type="button"
                    onClick={(e) => toggleSubnodeContainer('jargon', e)}
                    className="w-full px-3.5 py-2.5 bg-[#181914] hover:bg-[#20221b] flex items-center justify-between gap-2 text-left font-mono cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-xs font-bold text-stone-200 uppercase tracking-wider">
                        6. Standardized Terminology &amp; Disambiguation ({jargonCount})
                      </span>
                    </div>
                    {openSubnodes.jargon ? (
                      <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                  </button>

                  {openSubnodes.jargon && (
                    <div className="p-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-stone-800">
                      {card.jargon.map((j, idx) => (
                        <div
                          key={idx}
                          onClick={() => showJargon(j.term)}
                          className="p-2.5 rounded-lg bg-[#0d0e0a] border border-stone-800 hover:border-amber-500/50 transition-colors cursor-pointer"
                          title="Click to trigger 11s Disambiguation HUD"
                        >
                          <div className="text-xs font-mono font-bold text-amber-300 mb-0.5">
                            {j.term}
                          </div>
                          <div className="text-[11px] text-stone-300 leading-relaxed">
                            <AcronymText text={j.definition} mode="full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ===================================================================
                  SUBNODE CONTAINER 7: TAG SOUP & CROSS-LINKED SUBNODES
              =================================================================== */}
              <div className="rounded-xl border-2 border-stone-800 bg-[#11120e] overflow-hidden">
                <button
                  type="button"
                  onClick={(e) => toggleSubnodeContainer('tags', e)}
                  className="w-full px-3.5 py-2 bg-[#161712] hover:bg-[#1e2019] flex items-center justify-between gap-2 text-left font-mono cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-[11px] font-bold text-stone-300 uppercase tracking-wider">
                      7. Semantic Tag Soup ({card.tagSoup?.length || 0}) &amp; Cross-Links
                    </span>
                  </div>
                  {openSubnodes.tags ? (
                    <ChevronUp className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  )}
                </button>

                {openSubnodes.tags && (
                  <div className="p-3 space-y-2.5 border-t border-stone-800">
                    <div className="flex flex-wrap gap-1.5">
                      {card.tagSoup?.map((tag, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            playTacticalClick();
                            setSearchQuery(tag);
                          }}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-900 text-stone-300 border border-stone-700 hover:border-amber-400 hover:text-amber-300 cursor-pointer"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>

                    {card.relatedIds && card.relatedIds.length > 0 && (
                      <div className="pt-2 border-t border-stone-800 flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
                        <span className="text-amber-400 font-bold">Related Subnodes:</span>
                        {card.relatedIds.map((relId) => (
                          <button
                            key={relId}
                            type="button"
                            onClick={() => focusNodeById(relId, true)}
                            className="px-2 py-0.5 rounded bg-amber-950/50 border border-amber-500/40 text-amber-200 hover:bg-amber-900/60 cursor-pointer"
                          >
                            &rarr; {relId}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Expanded Subnodes End */}
            </div>
          )}
        </div>
      </article>
    </CardErrorBoundary>
  );
}
