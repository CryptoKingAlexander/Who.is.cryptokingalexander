'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Info, X, Sparkles } from 'lucide-react';
import { JargonTrigger } from './JargonDiscovery';
import { NON_THESAURUS_DICTIONARY } from '@/lib/jargonDefinitions';
import { ACRONYM_DICTIONARY, AcronymDefinition } from '@/lib/acronymData';
import { PhysicsVar } from './SvgEquation';

import { useTacticalTheme } from '@/context/TacticalThemeContext';


interface AcronymButtonProps {
  acronymKey: string;
  acronymDisplay?: string;
}

export function AcronymButton({ acronymKey, acronymDisplay }: AcronymButtonProps) {
  const { showAcronymButtons } = useTacticalTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const longTapTimer = useRef<NodeJS.Timeout | null>(null);

  const def = ACRONYM_DICTIONARY[acronymKey] || {
    acronym: acronymDisplay || acronymKey.toUpperCase(),
    fullName: acronymDisplay || acronymKey.toUpperCase(),
    explanation: 'Technical domain operational term.',
  };

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      setIsOpen(false);
    }, 11000); // 11s auto-dismiss lifespan
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!showAcronymButtons) return null;

  const handleMouseEnter = () => {
    if (typeof window !== 'undefined' && !window.matchMedia('(pointer: coarse)').matches) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (typeof window !== 'undefined' && !window.matchMedia('(pointer: coarse)').matches) {
      setIsOpen(false);
    }
  };

  const handleTouchStart = () => {
    longTapTimer.current = setTimeout(() => {
      setIsOpen(true);
      if (navigator.vibrate) navigator.vibrate(50);
    }, 500); // 500ms for long tap
  };

  const handleTouchEnd = () => {
    if (longTapTimer.current) {
      clearTimeout(longTapTimer.current);
    }
  };

  return (
    <span className="inline-relative shrink-0 align-baseline" ref={containerRef}>
      {/* Little (i) button taking up 1 character slot with a space after it */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="inline-flex items-center justify-center text-[9px] font-mono font-bold text-amber-400 bg-amber-950/80 hover:bg-amber-800 border border-amber-500/60 rounded px-0.5 py-0 ml-[1px] mr-1 cursor-pointer transition-all active:scale-95 shadow-xs align-middle select-none shrink-0"
        title={`Click or long-tap for info on ${def.acronym}`}
        aria-label={`Information on ${def.acronym}`}
      >
        (i)
      </button>
      {/* Space after the (i) button as requested */}
      <span className="inline text-[11px]">&nbsp;</span>

      {/* Popover Tooltip for Acronym Info */}
      {isOpen && (
        <span
          onClick={(e) => e.stopPropagation()}
          className="absolute left-0 top-full mt-1 z-50 w-72 sm:w-80 p-3 rounded-xl border-2 border-amber-500/80 bg-[#12140d]/98 text-stone-100 shadow-[0_8px_30px_rgba(0,0,0,0.9)] animate-in fade-in zoom-in-95 duration-150 font-sans block text-left"
        >
          <span className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-amber-500/30">
            <span className="font-mono text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{def.acronym} — {def.fullName}</span>
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="p-1 text-stone-400 hover:text-white cursor-pointer rounded hover:bg-stone-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
          <span className="text-xs text-stone-300 leading-relaxed font-normal block font-sans">
            {def.explanation}
          </span>
        </span>
      )}
    </span>
  );
}

/**
 * Replaces acronym words in text with the acronym followed by the little (i) button and a space.
 * Now also supports rendering Markdown-style bolding (**text**).
 * 
 * Mode:
 * - 'full': Renders colors, acronym buttons, and jargon notifications.
 * - 'color-only': Renders only the colors and bolding (used for titles/recursion).
 */
export function AcronymText({ 
  text, 
  mode = 'full' 
}: { 
  text: string;
  mode?: 'full' | 'color-only';
}) {
  if (!text) return null;

  // Regex matching:
  // 1. Markdown bold: \*\*(.*?)\*\*
  // 2. Crimson: !!(.*?)!!
  // 3. Gilded: @@(.*?)@@
  // 4. Known acronyms: \b(V2S|GovCloud|IL5|IL6|CUI|PLA|DoD|NATO|EW|RF|HPM|ITAR|DISA|GPS|VIO|PMC|LLM|NLP|GPU)\b
  // 5. Non-Thesaurus Jargon: (JADC2|MASINT|ELINT|pLTV|LTV:CAC|Zero-Trust|Air-Gapped|Vibe Coding|Fan-Out|Back-Pressure|C4ISR|HUMINT|OSINT|ACAT I|Zero-Day|Kinetic|Clandestine|SIGINT|CYBEROPS|Infiltration|Subversion|Sabotage|Electronic Warfare|Directed Energy|Intelligence|Directive|Invariants|Sovereign|Cloud|SaaS|API|ROI|CAC|LTV|EBITDA|MLOps|Vector DB|Latency|Throughput|Availability|Scalability|Algorithm|Deterministic|Quantized|Inference|Tensors|Formalism)
  const regex = /\$([^$]+)\$|\*\*(.*?)\*\*|!!(.*?)!!|@@(.*?)@@|\b(V2S|GovCloud|IL5|IL6|CUI|PLA|DoD|NATO|EW|RF|HPM|ITAR|DISA|GPS|VIO|PMC|LLM|NLP|GPU)\b|\b(JADC2|MASINT|ELINT|pLTV|LTV:CAC|Zero-Trust|Air-Gapped|Vibe Coding|Fan-Out|Back-Pressure|C4ISR|HUMINT|OSINT|ACAT I|Zero-Day|Kinetic|Clandestine|SIGINT|CYBEROPS|Infiltration|Subversion|Sabotage|Electronic Warfare|Directed Energy|Intelligence|Directive|Invariants|Sovereign|Cloud|SaaS|API|ROI|CAC|LTV|EBITDA|MLOps|Vector DB|Latency|Throughput|Availability|Scalability|Algorithm|Deterministic|Quantized|Inference|Tensors|Formalism)\b/gi;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const mathMatch = match[1];
    const boldMatch = match[2];
    const crimsonMatch = match[3];
    const gildedMatch = match[4];
    const acronymMatch = match[5];
    const jargonMatch = match[6];

    if (mathMatch) {
      parts.push(
        <span
          key={`math-${match.index}`}
          className="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded bg-[#0c0e09] border border-amber-500/35 text-amber-200 shadow-2xs align-baseline"
        >
          <PhysicsVar symbol={mathMatch} className="text-amber-200 text-[12.5px]" />
        </span>
      );
    } else if (boldMatch) {
      parts.push(<strong key={`bold-${match.index}`} className="font-bold text-amber-300"><AcronymText text={boldMatch} mode={mode} /></strong>);
    } else if (crimsonMatch) {
      const inner = <AcronymText text={crimsonMatch} mode="color-only" />;
      if (mode === 'full') {
        parts.push(
          <JargonTrigger key={`crimson-${match.index}`} term={crimsonMatch}>
            <span className="font-bold text-red-500 underline decoration-red-500/20 underline-offset-4">
              {inner}
            </span>
          </JargonTrigger>
        );
      } else {
        parts.push(<span key={`crimson-${match.index}`} className="font-bold text-red-500">{inner}</span>);
      }
    } else if (gildedMatch) {
      const inner = <AcronymText text={gildedMatch} mode="color-only" />;
      if (mode === 'full') {
        parts.push(
          <JargonTrigger key={`gilded-${match.index}`} term={gildedMatch}>
            <span className="font-bold text-amber-400 underline decoration-amber-400/20 underline-offset-4">
              {inner}
            </span>
          </JargonTrigger>
        );
      } else {
        parts.push(<span key={`gilded-${match.index}`} className="font-bold text-amber-400">{inner}</span>);
      }
    } else if (acronymMatch) {
      const matchedWord = acronymMatch;
      const key = matchedWord.toLowerCase();
      parts.push(
        <React.Fragment key={`${key}-${match.index}`}>
          <span className="font-semibold">{matchedWord}</span>
          {mode === 'full' && <AcronymButton acronymKey={key} acronymDisplay={matchedWord} />}
        </React.Fragment>
      );
    } else if (jargonMatch) {
      if (mode === 'full') {
        parts.push(
          <JargonTrigger key={`jargon-${match.index}`} term={jargonMatch}>
            {jargonMatch}
          </JargonTrigger>
        );
      } else {
        parts.push(jargonMatch);
      }
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return <>{parts}</>;
}
