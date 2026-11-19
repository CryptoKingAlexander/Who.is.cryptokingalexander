'use client';

import React, { useState } from 'react';
import { Download, Share, X } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

export const PWAInstallButton: React.FC<{ currentTheme?: string }> = ({ currentTheme = 'slate' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  useBodyScrollLock(showIOSGuide);

  // If already running in standalone PWA mode, hide install button
  if (isInstalled) return null;

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 font-mono text-xs font-bold transition-all cursor-pointer touch-manipulation shadow-sm ${
          currentTheme === 'white'
            ? 'bg-amber-500 hover:bg-amber-600 text-stone-900 border-amber-600'
            : 'bg-amber-950/80 hover:bg-amber-900 border-amber-500/80 text-amber-200 shadow-[0_0_14px_rgba(234,179,8,0.2)]'
        }`}
        title="Install TechBook App for offline reading"
      >
        <Download className="w-3.5 h-3.5 text-amber-400" />
        <span className="hidden sm:inline">Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 font-mono text-xs font-bold transition-all cursor-pointer touch-manipulation ${
            currentTheme === 'white'
              ? 'bg-amber-100 hover:bg-amber-200 text-stone-900 border-amber-400'
              : 'bg-stone-900/90 hover:bg-stone-800 border-amber-500/60 text-amber-300'
          }`}
        >
          <Share className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Install iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-sm rounded-2xl bg-[#141510] border-2 border-amber-500/80 p-5 shadow-2xl text-stone-100 font-sans">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <h3 className="text-sm font-bold font-mono text-amber-300 flex items-center gap-2">
                  <Download className="w-4 h-4 text-amber-400" />
                  Install TechBook on iOS
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded text-stone-400 hover:text-stone-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-3 text-xs text-stone-300 leading-relaxed font-mono">
                1. Tap the <strong className="text-amber-400">Share</strong> icon in Safari toolbar.<br />
                2. Scroll down and select <strong className="text-amber-400">Add to Home Screen</strong>.<br />
                3. Launch TechBook offline anytime! Read. Code. Earn.
              </p>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold font-mono text-xs transition-colors cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
