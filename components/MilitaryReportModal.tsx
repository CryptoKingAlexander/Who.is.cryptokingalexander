'use client';

import React from 'react';
import { useNodeDeck } from '../context/NodeDeckContext';
import { useSecurityAccess } from '../context/SecurityAccessContext';
import { SvgEquation, PhysicsVar, PhysicsText } from './SvgEquation';
import { Printer, X, ShieldAlert, Award, FileText, CheckCircle2, Copy, Bookmark } from 'lucide-react';
import { playTacticalAudio } from '../lib/tacticalAudio';
import { useToast } from '../context/ToastContext';

export function MilitaryReportModal() {
  const {
    isMilitaryModalOpen,
    militaryModalCard,
    closeMilitaryReport,
    addToPrintQueue,
    printQueue,
    setPrintPreviewOpen,
    setPreviewNodeId,
    toggleBookmark,
    isBookmarked,
  } = useNodeDeck();

  const { clearance, operatorCallsign } = useSecurityAccess();
  const { addToast } = useToast();

  if (!isMilitaryModalOpen || !militaryModalCard) return null;

  const card = militaryModalCard;
  const inQueue = printQueue.includes(card.id);
  const bookmarked = isBookmarked(card.id);

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

  const handleOpenPrintPreview = () => {
    playTacticalAudio('click');
    setPreviewNodeId(card.id);
    setPrintPreviewOpen(true);
    closeMilitaryReport();
  };

  const handleCopyId = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(card.id);
      addToast('ID COPIED', `${card.id} copied to clipboard`, 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="military-print-container relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-xl border border-cyan-500/40 bg-slate-950 p-6 md:p-8 text-slate-100 shadow-[0_0_50px_rgba(6,182,212,0.2)] font-mono">
        {/* Top Military Banner */}
        <div className="no-print flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold tracking-widest text-red-400 uppercase">
              {card.domainClassification === 'military'
                ? 'SECRET // CUI IL5 DEFENSE ENCLAVE // ITAR'
                : 'UNCLASSIFIED // CUI IL4 HIGH-ASSURANCE ARCHITECTURE'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyId}
              className="flex items-center gap-1 rounded bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700"
              title="Copy Spec ID"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>{card.id}</span>
            </button>
            <button
              type="button"
              onClick={() => toggleBookmark(card.id)}
              className={`p-1.5 rounded border ${
                bookmarked
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title="Bookmark Spec"
            >
              <Bookmark className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={closeMilitaryReport}
              className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Print Action Header Buttons */}
        <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-lg border border-slate-800 mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <FileText className="h-4 w-4 text-cyan-400" />
            <span>Formal Dossier & Physical Print Actions:</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                addToPrintQueue(card.id);
                addToast('QUEUE UPDATED', `${card.id} added to print queue`, 'success');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs border ${
                inQueue
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{inQueue ? 'In Print Queue' : 'Add to Queue'}</span>
            </button>

            <button
              type="button"
              onClick={handleOpenPrintPreview}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs bg-slate-800 text-cyan-300 border border-cyan-800 hover:bg-slate-700"
            >
              <FileText className="h-3.5 w-3.5 text-cyan-400" />
              <span>Full Screen Print Preview</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold bg-cyan-600 text-white hover:bg-cyan-500 shadow-lg shadow-cyan-600/30"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Direct Print (Dossier)</span>
            </button>
          </div>
        </div>

        {/* Printable Specification Body */}
        <div className="print-report-body space-y-6">
          {/* Classification & Metadata Header */}
          <div className="border-b border-slate-800 pb-4">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-xs text-cyan-400 font-semibold">{card.category} &gt; {card.subcategory}</span>
                <h1 className="text-2xl font-bold text-white tracking-tight mt-1">{card.title}</h1>
                <p className="text-xs text-slate-400 mt-1">
                  CLEARANCE: {clearance} // CALLSIGN: {operatorCallsign} // MK VARIANT: {card.id.split('-').pop()}
                </p>
              </div>
              <div className="border border-red-500/50 bg-red-950/20 px-3 py-1 rounded text-right text-xs">
                <span className="block text-red-400 font-bold uppercase">{card.level}</span>
                <span className="text-[10px] text-slate-400">INDEX #{card.subnetNumber}</span>
              </div>
            </div>
          </div>

          {/* Core Description & Analysis */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Operational Specification Summary
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/50 p-3.5 rounded border border-slate-800">
              {card.description}
            </p>
          </div>

          {card.extendedNotes && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Extended Tactical Analysis
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded border border-slate-800/80 italic">
                {card.extendedNotes}
              </p>
            </div>
          )}

          {/* Mathematical Governing Invariants */}
          {card.equations && card.equations.length > 0 && (
            <div className="physics-font">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                Mathematical Governing Invariants &amp; Proofs ({card.equations.length})
              </h3>
              <div className="space-y-3 physics-font">
                {card.equations.map((eq, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2 physics-font">
                    <div className="physics-font text-sm font-bold italic text-amber-200">
                      <span className="not-italic uppercase text-[11px] text-amber-400 mr-2">
                        Invariant {idx + 1}.
                      </span>
                      <PhysicsText text={eq.name} className="font-bold italic text-amber-200" />
                    </div>
                    <SvgEquation formula={eq.formula} equationNumber={idx + 1} />
                    {eq.variables && eq.variables.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-800 space-y-1.5 physics-font">
                        <div className="text-xs italic text-amber-300/90 physics-font">
                          where the governing physical &amp; state variables are defined as:
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[13px] text-slate-200 pl-2">
                          {eq.variables.map((v, vIdx) => (
                            <div key={vIdx} className="flex items-baseline gap-2 physics-font">
                              <span className="shrink-0 px-1.5 py-0.5 rounded bg-slate-950 border border-amber-500/25">
                                <PhysicsVar symbol={v.symbol} className="text-amber-200" />
                              </span>
                              <span className="text-slate-400 italic">&mdash;</span>
                              <PhysicsText text={v.explanation} className="text-slate-300 flex-1" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {eq.intuition && (
                      <p className="text-[13px] text-slate-300 mt-1.5 pt-1.5 border-t border-slate-800/70 physics-font">
                        <strong className="italic text-amber-300 mr-1.5">
                          Physical &amp; Mathematical Intuition.
                        </strong>
                        <PhysicsText text={eq.intuition} className="italic text-slate-300" />
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specialized Jargon */}
          {card.jargon && card.jargon.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Standardized Terminology ({card.jargon.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {card.jargon.map((j, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-slate-900/50 border border-slate-800 text-xs">
                    <span className="font-bold text-cyan-300 block mb-0.5">{j.term}</span>
                    <span className="text-slate-400">{j.definition}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Complexity Radar & Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-900/60 rounded border border-slate-800 text-center">
            <div>
              <span className="block text-[10px] text-slate-400">PREREQUISITE</span>
              <span className="text-sm font-bold text-cyan-400">{card.fundamentalPrerequisiteScore}/100</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400">ABSTRACTION</span>
              <span className="text-sm font-bold text-purple-400">{card.technicalAbstractionDepth}/100</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400">NICHE RARITY</span>
              <span className="text-sm font-bold text-emerald-400">{card.nicheRarityIndex}/100</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400">PROFITABILITY</span>
              <span className="text-sm font-bold text-amber-400">{card.profitabilityScore}/100</span>
            </div>
          </div>

          {/* Tag Cloud */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {card.tagSoup &&
              card.tagSoup.slice(0, 24).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-800"
                >
                  #{tag}
                </span>
              ))}
          </div>

          {/* Dossier Sign-off Footer */}
          <div className="border-t border-slate-800 pt-4 flex flex-wrap justify-between items-center text-xs text-slate-500">
            <span>DOD JADC2 // CUI IL5 COMPLIANT SPECIFICATION ENCLAVE</span>
            <span>STATUS: ACTIVE DETERMINISTIC VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
