'use client';

import React from 'react';
import { ShieldCheck, Scale, Sparkles } from 'lucide-react';
import { AppTheme } from './SettingsModal';

interface LegalFooterProps {
  onOpenPrivacy: () => void;
  currentTheme: AppTheme;
}

export function LegalFooter({ onOpenPrivacy, currentTheme }: LegalFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      role="contentinfo"
      aria-label="Legal Notice & Privacy Disclaimers"
      className={`fixed bottom-0 left-0 right-0 z-40 h-8 border-t-2 px-3 sm:px-6 flex items-center justify-between text-[10px] font-mono select-none backdrop-blur-md transition-colors duration-200 ${
        currentTheme === 'white'
          ? 'bg-white/95 border-amber-500/30 text-stone-600 shadow-[0_-2px_8px_rgba(0,0,0,0.04)]'
          : currentTheme === 'black'
          ? 'bg-black/95 border-stone-800 text-stone-500 shadow-[0_-2px_12px_rgba(0,0,0,0.5)]'
          : 'bg-[#10110e]/95 border-amber-600/30 text-stone-400 shadow-[0_-2px_12px_rgba(0,0,0,0.4)]'
      }`}
    >
      {/* Left: Brand Slogan & Copyright */}
      <div className="flex items-center gap-2 truncate">
        <span className="font-bold text-amber-400 flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 text-amber-400" />
          <span>Read. Code. Earn.</span>
        </span>
        <span className="text-stone-600">|</span>
        <span className="font-semibold text-stone-400">
          &copy; {currentYear} All Rights Reserved.
        </span>
        <span className="hidden md:inline text-stone-600">|</span>
        <span className="hidden md:inline truncate text-stone-500">
          Informational &amp; architectural research evaluation only. No production warranty or legal liability.
        </span>
      </div>

      {/* Right: Legal Triggers */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onOpenPrivacy}
          className="flex items-center gap-1 hover:text-amber-400 transition-colors cursor-pointer touch-manipulation underline decoration-dotted text-amber-300/90"
          title="Review Privacy Policy, Data Rights & Client-Side Telemetry"
        >
          <ShieldCheck className="w-3 h-3 text-amber-400" />
          <span>Privacy Policy</span>
        </button>

        <span className="text-stone-700 hidden sm:inline">·</span>

        <button
          type="button"
          onClick={onOpenPrivacy}
          className="hidden sm:flex items-center gap-1 hover:text-amber-400 transition-colors cursor-pointer touch-manipulation underline decoration-dotted text-stone-400"
          title="Review Legal Disclaimers & Terms"
        >
          <Scale className="w-3 h-3 text-stone-400" />
          <span>Terms &amp; Disclaimers</span>
        </button>

        <span className="text-stone-700 hidden sm:inline">·</span>

        <span className="hidden lg:flex items-center gap-1 text-emerald-400/90 font-mono text-[9px]">
          <span>Telemetry: 100% Client-Side</span>
        </span>
      </div>
    </footer>
  );
}
