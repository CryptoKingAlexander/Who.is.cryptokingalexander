'use client';

import React, { useState } from 'react';
import { useNodeDeck } from '../context/NodeDeckContext';
import { useTacticalTheme } from '../context/TacticalThemeContext';
import { getCategoryPerspectives, CategoryPerspective } from '../lib/categoryPerspectives';
import { AcronymText } from './AcronymInfo';
import {
  Layers,
  Shield,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Cpu,
  BarChart3,
  ShieldAlert,
  TrendingUp,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { playNodeExpandHum } from '../lib/tacticalAudio';

export function CategoryInfoCards() {
  const { sections, activeSection } = useNodeDeck();
  const { theme } = useTacticalTheme();
  const isWhite = theme === 'white' || theme === 'paper-white';

  // Start app with every expandable section collapsed
  const [isCategoryOverviewOpen, setIsCategoryOverviewOpen] = useState<boolean>(false);
  const [expandedPerspectives, setExpandedPerspectives] = useState<Record<string, boolean>>({});

  const activeSectionMeta = sections.find((s) => s.id === activeSection) || sections[0];
  const perspectives = getCategoryPerspectives(activeSectionMeta);

  const togglePerspective = (id: string) => {
    playNodeExpandHum();
    setExpandedPerspectives((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const allPerspectivesExpanded =
    perspectives.length > 0 && perspectives.every((p) => expandedPerspectives[p.id]);

  const handleToggleAllPerspectives = () => {
    playNodeExpandHum();
    const nextState: Record<string, boolean> = {};
    perspectives.forEach((p) => {
      nextState[p.id] = !allPerspectivesExpanded;
    });
    setExpandedPerspectives(nextState);
  };

  const getPerspectiveIcon = (iconName: CategoryPerspective['iconName']) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />;
      case 'BarChart3':
        return <BarChart3 className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />;
      case 'TrendingUp':
        return <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'Layers':
      default:
        return <Layers className="w-4 h-4 text-purple-400 shrink-0" />;
    }
  };

  return (
    <div className="no-print mb-1.5 font-sans">
      {/* COLLAPSING ACTIVE CATEGORY OVERVIEW & 5 EXECUTIVE PERSPECTIVE SUBNODE CONTAINERS */}
      <div
        className={`rounded-xl border overflow-hidden transition-all ${
          activeSectionMeta.domainClassification === 'military'
            ? 'bg-[#140d10] border-red-600/50 shadow-[0_0_20px_rgba(239,68,68,0.12)]'
            : isWhite
            ? 'bg-white border-amber-500/50 text-stone-900 shadow-sm'
            : 'bg-[#12130e] border-amber-500/50 text-stone-100 shadow-md'
        }`}
      >
        {/* Master Category Overview Header Bar */}
        <div
          onClick={() => {
            playNodeExpandHum();
            setIsCategoryOverviewOpen((prev) => !prev);
          }}
          className={`px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 cursor-pointer select-none transition-colors ${
            activeSectionMeta.domainClassification === 'military'
              ? 'bg-[#1c1014] hover:bg-[#241319]'
              : 'bg-[#181913] hover:bg-[#1f2118]'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`p-1.5 rounded-lg border shrink-0 ${
                activeSectionMeta.domainClassification === 'military'
                  ? 'bg-red-950/80 border-red-500/50 text-red-400'
                  : 'bg-amber-950/80 border-amber-500/50 text-amber-400'
              }`}
            >
              {activeSectionMeta.domainClassification === 'military' ? (
                <Shield className="w-4 h-4" />
              ) : (
                <Compass className="w-4 h-4" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-[10px] font-mono uppercase tracking-widest font-bold px-2 py-0.5 rounded border ${
                    activeSectionMeta.domainClassification === 'military'
                      ? 'bg-red-950 text-red-300 border-red-700'
                      : 'bg-amber-950 text-amber-300 border-amber-600/50'
                  }`}
                >
                  CATEGORY OVERVIEW
                </span>
                <span className="text-[10px] font-mono text-stone-400 truncate">
                  Ref: {activeSectionMeta.diagramReference}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-extrabold font-mono text-amber-100 truncate mt-0.5">
                {activeSectionMeta.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2 py-0.5 rounded-lg bg-stone-900 border border-amber-500/40 text-xs font-mono font-bold text-amber-300">
              {activeSectionMeta.totalCards} Blueprints
            </span>
            {isCategoryOverviewOpen && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleAllPerspectives();
                }}
                className="px-2 py-0.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-[10px] font-mono font-bold text-stone-300 hover:text-amber-300 cursor-pointer"
              >
                {allPerspectivesExpanded ? 'Collapse 5 Directives' : 'Expand 5 Directives'}
              </button>
            )}
            <div className="px-2 py-0.5 rounded-lg bg-stone-900 border border-stone-800 text-amber-400 flex items-center gap-1 text-[10px] font-mono font-bold">
              <span>{isCategoryOverviewOpen ? 'Collapse Overview' : 'Expand Overview'}</span>
              {isCategoryOverviewOpen ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </div>
          </div>
        </div>

        {/* Collapsible Category Overview Body + 5 Collapsing Perspective Subnode Containers */}
        {isCategoryOverviewOpen && (
          <div className="p-3.5 border-t border-stone-800 space-y-3.5">
            {/* Domain Description & Entrepreneurial Power Intro */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-[#161812] border border-stone-800 text-xs sm:text-sm text-stone-200 leading-relaxed">
                <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold mb-1">
                  Domain Architectural Scope
                </div>
                <AcronymText text={activeSectionMeta.description} mode="full" />
              </div>

              {activeSectionMeta.entrepreneurialPowerIntro && (
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-950/30 via-[#161812] to-amber-950/20 border border-amber-500/40 text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Read. Code. Earn. — Solo &amp; Enterprise Leverage</span>
                  </div>
                  <AcronymText text={activeSectionMeta.entrepreneurialPowerIntro} mode="full" />
                </div>
              )}
            </div>

            {/* 5 Collapsing Executive Perspective Subnode Containers */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 px-1">
                <span className="uppercase tracking-wider font-bold text-amber-400/90">
                  Collapsing Domain Perspective Subnode Containers (5)
                </span>
                <span>Click any container header to toggle</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
                {perspectives.map((persp) => {
                  const isOpen = !!expandedPerspectives[persp.id];
                  return (
                    <div
                      key={persp.id}
                      className={`rounded-xl border transition-all overflow-hidden ${persp.borderColor} bg-[#151711]`}
                    >
                      <button
                        type="button"
                        onClick={() => togglePerspective(persp.id)}
                        className="w-full px-3 py-2 flex items-center justify-between gap-2 text-left bg-[#191b14] hover:bg-[#21241a] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`p-1.5 rounded-lg border ${persp.badgeBg} ${persp.badgeText}`}>
                            {getPerspectiveIcon(persp.iconName)}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-mono font-bold text-stone-100 truncate">
                              {persp.title}
                            </div>
                            <div className="text-[10px] font-mono text-stone-400 truncate">
                              {persp.subtitle}
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 text-stone-400">
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-amber-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-amber-400" />
                          )}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="p-3 border-t border-stone-800/80 space-y-2 text-xs text-stone-200 leading-relaxed">
                          <p>
                            <AcronymText text={persp.content} mode="full" />
                          </p>
                          <div className="pt-2 border-t border-stone-800/60 space-y-1">
                            <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                              Operational Takeaways:
                            </div>
                            {persp.keyTakeaways.map((takeaway, idx) => (
                              <div key={idx} className="flex items-start gap-1.5 text-[11px] text-stone-300">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <span>
                                  <AcronymText text={takeaway} mode="full" />
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
