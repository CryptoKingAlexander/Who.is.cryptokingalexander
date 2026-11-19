'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Palette, 
  Volume2, 
  VolumeX, 
  Info, 
  Layers, 
  Search, 
  Compass, 
  Sigma, 
  SlidersHorizontal,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Download
} from 'lucide-react';
import { AppTheme } from './SettingsModal';
import { AppIcon } from './AppIcon';
import { useTacticalTheme } from '@/context/TacticalThemeContext';
import { 
  getIsTacticalAudioEnabled, 
  setTacticalAudioEnabled, 
  playTacticalClick, 
  playNodeExpandHum 
} from '@/lib/tacticalAudio';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { downloadStandaloneExeFile } from '@/lib/downloadExeClient';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout?: () => void;
  currentTheme?: AppTheme;
  onSelectTheme?: (theme: AppTheme) => void;
}

export function WelcomeModal({
  isOpen,
  onClose,
  currentTheme: propTheme,
  onSelectTheme: propSelectTheme,
}: WelcomeModalProps) {
  useBodyScrollLock(isOpen);
  const { 
    theme: contextTheme, 
    setTheme: contextSetTheme, 
    showAcronymButtons, 
    setShowAcronymButtons 
  } = useTacticalTheme();

  const currentTheme = propTheme || contextTheme;
  const onSelectTheme = propSelectTheme || contextSetTheme;

  // Sound settings state (initialized deterministically for SSR hydration, synced on mount)
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);
  const [activeWidget, setActiveWidget] = useState<number>(0);
  const [isDownloadingExe, setIsDownloadingExe] = useState<boolean>(false);
  const [exeDownloaded, setExeDownloaded] = useState<boolean>(false);

  useEffect(() => {
    setIsAudioEnabled(getIsTacticalAudioEnabled());
  }, [isOpen]);

  const handleToggleAudio = () => {
    const nextState = !isAudioEnabled;
    setIsAudioEnabled(nextState);
    setTacticalAudioEnabled(nextState);
    if (nextState) {
      playNodeExpandHum();
    }
  };

  const handleSelectWidget = (index: number) => {
    setActiveWidget(index);
    if (isAudioEnabled) {
      playTacticalClick();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-2.5 sm:p-4 pt-3 sm:pt-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full max-w-lg rounded-2xl border-2 flex flex-col shadow-2xl overflow-hidden transition-all duration-150 ${
          currentTheme === 'white'
            ? 'bg-white text-stone-900 border-stone-300 shadow-stone-400/20'
            : currentTheme === 'black'
            ? 'bg-[#000000] text-stone-100 border-stone-800 shadow-[0_0_50px_rgba(245,158,11,0.15)]'
            : 'bg-[#12130e] text-stone-100 border-amber-600/40 shadow-[0_0_50px_rgba(245,158,11,0.2)]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-lg text-stone-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer z-10 border border-transparent hover:border-amber-500/30"
          aria-label="Close introduction"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Content - Top aligned, compact ergonomics fitting single page on mobile */}
        <div className="p-3.5 sm:p-4.5 space-y-2.5 font-sans">
          
          {/* Slogan + App Icon + Hyperbook Reading Estimate */}
          <div className="flex items-center gap-3 pr-7">
            <div className="p-1.5 rounded-xl bg-amber-500/20 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.25)] shrink-0">
              <AppIcon
                size={24}
                className="w-6 h-6 text-amber-400"
                interactive
                onClick={() => {
                  try { playTacticalClick(); } catch {}
                  if (onSelectTheme) {
                    onSelectTheme(currentTheme === "slate" ? "black" : currentTheme === "black" ? "white" : "slate");
                  }
                }}
                title="Generic App Icon — Tap to cycle theme"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white font-mono uppercase">
                  READ. <span className="text-amber-400">CODE.</span> EARN.
                </h1>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300">
                  60+ Hrs Deck
                </span>
              </div>
              <p className="text-[11px] text-stone-400 truncate">
                Generic · Frontier systems architecture &amp; technical blueprints
              </p>
            </div>
          </div>

          {/* Intro Paragraph */}
          <div className={`p-3 rounded-xl border text-xs leading-relaxed shadow-xs transition-colors ${
            currentTheme === 'white'
              ? 'bg-amber-50/90 border-amber-300 text-stone-800'
              : 'bg-gradient-to-r from-amber-500/10 via-stone-950/70 to-amber-500/10 border-amber-500/30 text-stone-300'
          }`}>
            <p className="font-sans">
              Welcome to <strong className="text-amber-500 font-mono font-bold tracking-wide">Generic</strong> — an interactive engineering codex and multi-domain architecture deck spanning 40 cross-sector systems disciplines, from sovereign AI agent orchestration and military-grade zero-trust GovCloud enclaves to quantum error decoding and deterministic low-latency netcode. Every blueprint is synthesized with formal mathematical formulations, procedural algorithm invariants, and battle-tested operational playbooks engineered for senior systems architects.
            </p>
          </div>

          {/* 2-COLUMN GRID SETTINGS with Small Border/Spacer Between Cells */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 px-0.5">
              <SlidersHorizontal className="w-3 h-3 text-amber-400" />
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                Quick Settings
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {/* Cell 1: Theme Palette */}
              <div className="p-2 rounded-xl bg-stone-950/80 border border-stone-800 flex flex-col justify-between gap-1.5 hover:border-amber-500/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-[10px] font-bold text-stone-200">Palette</span>
                  </div>
                  <span className="text-[9px] font-mono text-stone-400 uppercase">{currentTheme}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    onClick={() => onSelectTheme('slate')}
                    className={`py-1 rounded text-[9px] font-mono font-bold cursor-pointer transition-all text-center ${
                      currentTheme === 'slate' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'bg-stone-900 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Mustard
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectTheme('black')}
                    className={`py-1 rounded text-[9px] font-mono font-bold cursor-pointer transition-all text-center ${
                      currentTheme === 'black' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'bg-stone-900 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    OLED
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectTheme('white')}
                    className={`py-1 rounded text-[9px] font-mono font-bold cursor-pointer transition-all text-center ${
                      currentTheme === 'white' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-stone-900 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Light
                  </button>
                </div>
              </div>

              {/* Cell 2: Sound Settings (Tactical Audio Feedback) */}
              <div className="p-2 rounded-xl bg-stone-950/80 border border-stone-800 flex flex-col justify-between gap-1.5 hover:border-amber-500/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {isAudioEnabled ? (
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <VolumeX className="w-3.5 h-3.5 text-stone-500" />
                    )}
                    <span className="text-[10px] font-bold text-stone-200">Tactical Audio</span>
                  </div>
                  <span className={`text-[9px] font-mono font-bold ${isAudioEnabled ? 'text-emerald-400' : 'text-stone-500'}`}>
                    {isAudioEnabled ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleToggleAudio}
                    className={`flex-1 py-1 rounded text-[9px] font-mono font-bold cursor-pointer transition-all flex items-center justify-center gap-1 ${
                      isAudioEnabled 
                        ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300' 
                        : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {isAudioEnabled ? <Check className="w-2.5 h-2.5" /> : null}
                    <span>{isAudioEnabled ? 'Enabled' : 'Enable Sound'}</span>
                  </button>
                  {isAudioEnabled && (
                    <button
                      type="button"
                      onClick={() => playNodeExpandHum()}
                      className="px-1.5 py-1 rounded text-[9px] font-mono bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 cursor-pointer"
                      title="Test Audio"
                    >
                      Test
                    </button>
                  )}
                </div>
              </div>

              {/* Cell 3: Acronym Glossaries (i) Button Toggle */}
              <div className="p-2 rounded-xl bg-stone-950/80 border border-stone-800 flex flex-col justify-between gap-1.5 hover:border-amber-500/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[10px] font-bold text-stone-200">Glossary Badges</span>
                  </div>
                  <span className={`text-[9px] font-mono font-bold ${showAcronymButtons ? 'text-amber-400' : 'text-stone-500'}`}>
                    {showAcronymButtons ? '(i) ON' : 'OFF'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAcronymButtons?.(!showAcronymButtons)}
                  className={`w-full py-1 rounded text-[9px] font-mono font-bold cursor-pointer transition-all flex items-center justify-center gap-1 ${
                    showAcronymButtons 
                      ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300' 
                      : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {showAcronymButtons ? <Check className="w-2.5 h-2.5" /> : null}
                  <span>{showAcronymButtons ? 'Badges Visible' : 'Hide (i) Buttons'}</span>
                </button>
              </div>

              {/* Cell 4: Security & Privacy Guarantees */}
              <div className="p-2 rounded-xl bg-stone-950/80 border border-stone-800 flex flex-col justify-between gap-1.5 hover:border-amber-500/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[10px] font-bold text-stone-200">Local Enclave</span>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-400 font-bold">100% PRIVATE</span>
                </div>
                <div className="py-1 px-1.5 rounded bg-stone-900 text-[9px] font-mono text-stone-400 text-center truncate">
                  Zero Telemetry · Isolated Storage
                </div>
              </div>
            </div>
          </div>

          {/* INTERACTIVE REPRESENTATION WIDGETS (Iconography preferred over raw text guesswork) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-0.5">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                  System Architecture (Interactive Preview)
                </span>
              </div>
              <span className="text-[9px] font-mono text-stone-500">Tap to inspect</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {/* Widget 1: Architecture Nodes */}
              <div
                onClick={() => handleSelectWidget(0)}
                className={`p-2 rounded-xl border transition-all cursor-pointer select-none ${
                  activeWidget === 0 
                    ? 'border-amber-500/70 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/40' 
                    : 'border-stone-800 bg-stone-950/60 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <div className="p-1 rounded bg-amber-500/20 text-amber-400">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] font-bold text-stone-200">131 Blueprints</span>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full ${activeWidget === 0 ? 'bg-amber-400 animate-pulse' : 'bg-stone-700'}`} />
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-stone-900 text-amber-300 border border-stone-800">DoD IL6</span>
                  <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-stone-900 text-cyan-300 border border-stone-800">GovCloud</span>
                  <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-stone-900 text-emerald-300 border border-stone-800">V2S</span>
                </div>
              </div>

              {/* Widget 2: Smart Search & Momentum */}
              <div
                onClick={() => handleSelectWidget(1)}
                className={`p-2 rounded-xl border transition-all cursor-pointer select-none ${
                  activeWidget === 1 
                    ? 'border-cyan-500/70 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/40' 
                    : 'border-stone-800 bg-stone-950/60 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <div className="p-1 rounded bg-cyan-500/20 text-cyan-400">
                      <Search className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] font-bold text-stone-200">NLP Smart Search</span>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full ${activeWidget === 1 ? 'bg-cyan-400 animate-pulse' : 'bg-stone-700'}`} />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 truncate">
                    2.5D Momentum Focus
                  </span>
                </div>
              </div>

              {/* Widget 3: Topological Mind Map */}
              <div
                onClick={() => handleSelectWidget(2)}
                className={`p-2 rounded-xl border transition-all cursor-pointer select-none ${
                  activeWidget === 2 
                    ? 'border-emerald-500/70 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/40' 
                    : 'border-stone-800 bg-stone-950/60 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <div className="p-1 rounded bg-emerald-500/20 text-emerald-400">
                      <Compass className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] font-bold text-stone-200">Domain Mind Map</span>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full ${activeWidget === 2 ? 'bg-emerald-400 animate-pulse' : 'bg-stone-700'}`} />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 truncate">
                    Cross-Sector Graph
                  </span>
                </div>
              </div>

              {/* Widget 4: Formal Math & Schema */}
              <div
                onClick={() => handleSelectWidget(3)}
                className={`p-2 rounded-xl border transition-all cursor-pointer select-none ${
                  activeWidget === 3 
                    ? 'border-purple-500/70 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.15)] ring-1 ring-purple-500/40' 
                    : 'border-stone-800 bg-stone-950/60 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <div className="p-1 rounded bg-purple-500/20 text-purple-400">
                      <Sigma className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] font-bold text-stone-200">Math &amp; Microdata</span>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full ${activeWidget === 3 ? 'bg-purple-400 animate-pulse' : 'bg-stone-700'}`} />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-purple-950/80 text-purple-300 border border-purple-500/30 truncate">
                    TechArticle Schema
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bon Voyage Paragraph */}
          <div className={`p-3 rounded-xl border text-xs leading-relaxed shadow-xs text-center transition-colors ${
            currentTheme === 'white'
              ? 'bg-amber-50/70 border-amber-300/80 text-stone-800'
              : 'bg-gradient-to-br from-stone-950 via-[#141209] to-stone-950 border-amber-500/30 text-stone-300'
          }`}>
            <div className="font-mono font-bold uppercase tracking-wider text-amber-500 text-[11px] flex items-center justify-center gap-1.5 mb-1">
              <Compass className="w-3.5 h-3.5 text-amber-500" />
              <span>Bon Voyage, Architect</span>
            </div>
            <p className="font-sans text-[11.5px] italic text-stone-300">
              May your voyage through these scrolls illuminate uncharted technical horizons, sharpen your engineering intuition, and equip you to forge resilient, sovereign systems capable of mastering tomorrow&apos;s frontier challenges. Safe passage into the deck.
            </p>
          </div>

          {/* Action CTA - Single Compact Row with Standalone Generic.exe Download */}
          <div className="pt-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              disabled={isDownloadingExe}
              onClick={async () => {
                setIsDownloadingExe(true);
                try {
                  await downloadStandaloneExeFile();
                  setExeDownloaded(true);
                  setTimeout(() => setExeDownloaded(false), 4000);
                } catch (err) {
                  console.warn('Error downloading Generic.exe:', err);
                } finally {
                  setIsDownloadingExe(false);
                }
              }}
              className="w-full py-2.5 px-4 bg-[#182032] hover:bg-[#1f2940] text-amber-300 border-2 border-amber-500/60 font-mono font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.2)] active:scale-98 flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>{ isDownloadingExe ? 'Building EXE...' : exeDownloaded ? 'Generic.exe Ready' : 'Generic.exe' }</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-mono font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.25)] active:scale-98 flex items-center justify-center gap-2"
            >
              <span>Start Exploring Deck</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
