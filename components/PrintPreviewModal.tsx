'use client';

import React, { useState, useMemo } from 'react';
import { useNodeDeck } from '../context/NodeDeckContext';
import { useTacticalTheme } from '../context/TacticalThemeContext';
import { useSecurityAccess } from '../context/SecurityAccessContext';
import { TechCard } from '../types/techbook';
import { SvgEquation, PhysicsVar, PhysicsText } from './SvgEquation';
import { Printer, X, ZoomIn, ZoomOut, Maximize2, Moon, Sun, ShieldAlert, FileText, Trash2 } from 'lucide-react';
import { playTacticalAudio } from '../lib/tacticalAudio';

export function PrintPreviewModal() {
  const {
    isPrintPreviewOpen,
    setPrintPreviewOpen,
    previewNodeId,
    setPreviewNodeId,
    printQueue,
    bookmarks,
    removeFromPrintQueue,
    clearPrintQueue,
    cards,
  } = useNodeDeck();

  const { theme } = useTacticalTheme();
  const { clearance, operatorCallsign } = useSecurityAccess();

  const [previewPaperWhite, setPreviewPaperWhite] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Cards to preview: either single previewNodeId or all cards in bookmarks/printQueue
  const previewCards: TechCard[] = useMemo(() => {
    if (previewNodeId) {
      const single = cards.find((c) => c.id === previewNodeId);
      return single ? [single] : [];
    }
    const activeIds = printQueue.length > 0 ? printQueue : bookmarks;
    if (activeIds.length > 0) {
      return activeIds
        .map((id) => cards.find((c) => c.id === id))
        .filter((c): c is TechCard => c !== undefined);
    }
    // Fallback if queue empty: preview the first card
    return cards.slice(0, 1);
  }, [previewNodeId, printQueue, bookmarks, cards]);

  if (!isPrintPreviewOpen) return null;

  const handlePrint = () => {
    playTacticalAudio('confirm');
    if (typeof window !== 'undefined') {
      window.focus();
      document.body.classList.add('military-print-active');
      window.print();
      setTimeout(() => {
        document.body.classList.remove('military-print-active');
      }, 1500);
    }
  };

  const handleClose = () => {
    playTacticalAudio('click');
    setPrintPreviewOpen(false);
    setPreviewNodeId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/85 backdrop-blur-md">
      {/* Top Action Bar (Hidden during print) */}
      <div className="no-print flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-950/95 px-6 py-3 text-sm font-mono text-slate-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded bg-cyan-950/80 px-2.5 py-1 text-cyan-400 border border-cyan-800">
            <FileText className="h-4 w-4" />
            <span className="font-bold tracking-wider">FULL SCREEN PRINT PREVIEW</span>
          </div>
          <span className="text-xs text-slate-400">
            {previewCards.length} {previewCards.length === 1 ? 'Specification Node' : 'Nodes in Dossier'}
          </span>
          {previewNodeId && (
            <button
              type="button"
              onClick={() => setPreviewNodeId(null)}
              className="text-xs text-cyan-400 underline hover:text-cyan-300"
            >
              Switch to Full Queue ({printQueue.length})
            </button>
          )}
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-3">
          {/* Paper White vs Dark Tactical Toggle */}
          <button
            type="button"
            onClick={() => {
              playTacticalAudio('click');
              setPreviewPaperWhite(!previewPaperWhite);
            }}
            className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs border transition-colors ${
              previewPaperWhite
                ? 'bg-amber-100 text-slate-900 border-amber-300 hover:bg-amber-200 font-bold'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {previewPaperWhite ? <Sun className="h-3.5 w-3.5 text-amber-600" /> : <Moon className="h-3.5 w-3.5" />}
            <span>{previewPaperWhite ? 'Paper White (Ink-Saver)' : 'Dark Tactical (Field)'}</span>
          </button>

          {/* Zoom controls */}
          <div className="flex items-center rounded border border-slate-700 bg-slate-900">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(50, z - 15))}
              className="px-2 py-1 hover:bg-slate-800 text-slate-400 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="px-2 text-xs text-slate-300 font-mono min-w-[42px] text-center">{zoomLevel}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
              className="px-2 py-1 hover:bg-slate-800 text-slate-400 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(100)}
              className="px-2 py-1 hover:bg-slate-800 text-slate-400 hover:text-white border-l border-slate-700"
              title="Reset Zoom"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Clear Queue button if viewing queue */}
          {!previewNodeId && printQueue.length > 0 && (
            <button
              type="button"
              onClick={() => {
                clearPrintQueue();
              }}
              className="flex items-center gap-1 rounded bg-rose-950/40 text-rose-300 border border-rose-800/60 px-2 py-1 text-xs hover:bg-rose-900/60"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear Queue</span>
            </button>
          )}

          {/* Main Print Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 rounded bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95"
          >
            <Printer className="h-4 w-4" />
            <span>PRINT DOSSIER NOW</span>
          </button>

          {/* Close Modal */}
          <button
            type="button"
            onClick={handleClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Preview Container with Zoom and Print Styling */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-slate-950/70">
        <div
          className={`military-print-container w-full max-w-4xl transition-all duration-150 ${
            previewPaperWhite
              ? 'bg-white text-slate-900 border border-slate-300 shadow-2xl'
              : 'bg-[#0b0f19] text-slate-100 border border-cyan-900/60 shadow-[0_0_30px_rgba(6,182,212,0.15)]'
          } rounded-lg p-8 md:p-12`}
          style={{
            transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined,
            transformOrigin: 'top center',
          }}
        >
          {/* Document Header */}
          <div className="border-b-2 border-stone-800 pb-6 mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-amber-600 dark:text-amber-400 uppercase">
                  <span>SYSTEM SPECIFICATION &amp; ARCHITECTURE DOSSIER</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1.5 font-sans">
                  {previewCards.length === 1 ? previewCards[0].title : 'System Architecture Collection'}
                </h1>
                <p className="text-xs text-stone-500 mt-2 font-mono">
                  {previewCards.length} {previewCards.length === 1 ? 'Specification Node' : 'Nodes in Dossier'} &bull; Generated {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>

              {/* Status Stamp */}
              <div className="self-start sm:self-auto border border-amber-500/50 rounded-lg px-3 py-1.5 text-center font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 tracking-wider">
                TECHNICAL SPECIFICATION
              </div>
            </div>
          </div>

          {/* Cards Loop */}
          <div className="space-y-16">
            {previewCards.map((card, idx) => (
              <article
                key={card.id}
                className={`print-sheet-page ${idx > 0 ? 'border-t-2 border-dashed border-stone-300 dark:border-stone-800 pt-12 mt-12' : ''}`}
              >
                {/* Node Metadata Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-stone-200 dark:border-stone-800/80 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      NODE {idx + 1} OF {previewCards.length}
                    </span>
                    <span className="text-stone-400">&bull;</span>
                    <span className="font-semibold text-stone-700 dark:text-stone-300">
                      {card.id}
                    </span>
                  </div>
                  <span className="text-stone-500 text-[11px]">
                    {card.category} &rarr; {card.subcategory}
                  </span>
                </div>

                {/* Node Title */}
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 mb-4 font-sans">
                  {card.title}
                </h2>

                {/* Description with clean paragraph spacing */}
                <div className="text-sm sm:text-[15px] text-stone-700 dark:text-stone-300 leading-relaxed mb-6 font-sans">
                  <p>{card.description}</p>
                </div>

                {/* Extended Analysis with ample delimitation */}
                {card.extendedNotes && (
                  <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 mb-8 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
                    <div className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1.5">
                      Extended Analysis
                    </div>
                    <p>{card.extendedNotes}</p>
                  </div>
                )}

                {/* Mathematical Invariants & Formulations */}
                {card.equations && card.equations.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-3 pb-1 border-b border-stone-200 dark:border-stone-800">
                      Mathematical Formulations &amp; Governing Invariants
                    </h3>
                    <div className="space-y-4">
                      {card.equations.map((eq, eIdx) => (
                        <div
                          key={eIdx}
                          className="rounded-xl p-4 sm:p-5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3"
                        >
                          <div className="physics-font text-sm font-bold text-amber-700 dark:text-amber-200">
                            <span className="font-mono not-italic uppercase text-[11px] text-amber-600 dark:text-amber-400 mr-2">
                              Formula {eIdx + 1}:
                            </span>
                            <PhysicsText
                              text={eq.name}
                              className="font-bold text-amber-700 dark:text-amber-200"
                            />
                          </div>

                          <SvgEquation formula={eq.formula} equationNumber={eIdx + 1} />

                          {eq.variables && eq.variables.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-800 space-y-2">
                              <div className="text-xs italic text-stone-500 dark:text-amber-300/90 font-mono">
                                Variable Definitions:
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs sm:text-[13px] text-stone-700 dark:text-stone-300">
                                {eq.variables.map((v, vIdx) => (
                                  <div key={vIdx} className="flex items-baseline gap-2">
                                    <span className="shrink-0 px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-amber-200 font-mono text-[11px] font-bold">
                                      <PhysicsVar symbol={v.symbol} className="text-amber-600 dark:text-amber-200" />
                                    </span>
                                    <span className="text-stone-400">&mdash;</span>
                                    <span className="flex-1">{v.explanation}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {eq.intuition && (
                            <div className="text-xs sm:text-[13px] text-stone-600 dark:text-stone-400 mt-2 pt-2 border-t border-stone-200 dark:border-stone-800 leading-relaxed font-sans">
                              <strong className="font-semibold text-stone-800 dark:text-amber-300 mr-1.5">
                                Physical Intuition:
                              </strong>
                              <span>{eq.intuition}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specialized Terminology */}
                {card.jargon && card.jargon.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-3 pb-1 border-b border-stone-200 dark:border-stone-800">
                      Domain Terminology
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {card.jargon.slice(0, 6).map((j, jIdx) => (
                        <div
                          key={jIdx}
                          className="p-3 rounded-lg bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-xs"
                        >
                          <span className="font-bold font-mono text-amber-700 dark:text-cyan-300 block mb-1">
                            {j.term}
                          </span>
                          <span className="text-stone-600 dark:text-stone-400 leading-relaxed">
                            {j.definition}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tag Metadata */}
                {card.tagSoup && card.tagSoup.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-3">
                    {card.tagSoup.slice(0, 16).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>

          {/* Document Footer */}
          <div className="border-t-2 border-stone-800 mt-16 pt-6 flex flex-wrap justify-between items-center text-xs font-mono text-stone-500">
            <div>
              <p>END OF SPECIFICATION REPORT &bull; 1,050-NODE TAXONOMY</p>
            </div>
            <div className="text-right">
              <p>SYSTEM VERIFIED &bull; {new Date().getFullYear()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
