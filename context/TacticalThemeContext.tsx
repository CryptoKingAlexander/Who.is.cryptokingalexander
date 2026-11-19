'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export type TacticalThemeMode = 'dark-tactical' | 'paper-white' | 'amber-phosphor' | 'cyber-cyan' | 'slate' | 'black' | 'white';

interface TacticalThemeContextType {
  theme: TacticalThemeMode;
  setTheme: (mode: TacticalThemeMode) => void;
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  toggleAudio: () => void;
  scanlinesEnabled: boolean;
  setScanlinesEnabled: (enabled: boolean) => void;
  toggleScanlines: () => void;
  printFriendlyMode: boolean;
  setPrintFriendlyMode: (val: boolean) => void;
  showAcronymButtons?: boolean;
  setShowAcronymButtons?: (show: boolean) => void;
}

const TacticalThemeContext = createContext<TacticalThemeContextType | null>(null);

export function TacticalThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<TacticalThemeMode>('dark-tactical');
  const [audioEnabled, setAudioEnabledState] = useState<boolean>(true);
  const [scanlinesEnabled, setScanlinesEnabledState] = useState<boolean>(false);
  const [printFriendlyMode, setPrintFriendlyModeState] = useState<boolean>(false);
  const [showAcronymButtons, setShowAcronymButtons] = useState<boolean>(true);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('tactical_theme') as TacticalThemeMode | null;
      if (savedTheme && ['dark-tactical', 'paper-white', 'amber-phosphor', 'cyber-cyan'].includes(savedTheme)) {
        setThemeState(savedTheme);
      }
      const savedAudio = localStorage.getItem('tactical_audio_enabled');
      if (savedAudio !== null) {
        setAudioEnabledState(savedAudio === 'true');
      }
      const savedScanlines = localStorage.getItem('tactical_scanlines');
      if (savedScanlines !== null) {
        setScanlinesEnabledState(savedScanlines === 'true');
      }
    } catch {
      // Local storage fallback for private windows
    }
  }, []);

  const setTheme = useCallback((mode: TacticalThemeMode) => {
    setThemeState(mode);
    try {
      localStorage.setItem('tactical_theme', mode);
    } catch {}
  }, []);

  const setAudioEnabled = useCallback((enabled: boolean) => {
    setAudioEnabledState(enabled);
    try {
      localStorage.setItem('tactical_audio_enabled', String(enabled));
    } catch {}
  }, []);

  const toggleAudio = useCallback(() => {
    setAudioEnabledState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('tactical_audio_enabled', String(next));
      } catch {}
      return next;
    });
  }, []);

  const setScanlinesEnabled = useCallback((enabled: boolean) => {
    setScanlinesEnabledState(enabled);
    try {
      localStorage.setItem('tactical_scanlines', String(enabled));
    } catch {}
  }, []);

  const toggleScanlines = useCallback(() => {
    setScanlinesEnabledState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('tactical_scanlines', String(next));
      } catch {}
      return next;
    });
  }, []);

  const setPrintFriendlyMode = useCallback((val: boolean) => {
    setPrintFriendlyModeState(val);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      audioEnabled,
      setAudioEnabled,
      toggleAudio,
      scanlinesEnabled,
      setScanlinesEnabled,
      toggleScanlines,
      printFriendlyMode,
      setPrintFriendlyMode,
      showAcronymButtons,
      setShowAcronymButtons,
    }),
    [
      theme,
      setTheme,
      audioEnabled,
      setAudioEnabled,
      toggleAudio,
      scanlinesEnabled,
      setScanlinesEnabled,
      toggleScanlines,
      printFriendlyMode,
      setPrintFriendlyMode,
      showAcronymButtons,
      setShowAcronymButtons,
    ]
  );

  return (
    <TacticalThemeContext.Provider value={value}>
      <div
        data-theme={theme}
        className={`${theme === 'paper-white' ? 'theme-paper-white bg-slate-100 text-slate-900' : 'theme-dark-tactical bg-[#070b12] text-slate-100'} ${scanlinesEnabled ? 'crt-scanlines' : ''} min-h-screen transition-colors duration-200`}
      >
        {children}
      </div>
    </TacticalThemeContext.Provider>
  );
}

const FALLBACK_THEME_CONTEXT: TacticalThemeContextType = {
  theme: 'dark-tactical',
  setTheme: () => {},
  audioEnabled: true,
  setAudioEnabled: () => {},
  toggleAudio: () => {},
  scanlinesEnabled: false,
  setScanlinesEnabled: () => {},
  toggleScanlines: () => {},
  printFriendlyMode: false,
  setPrintFriendlyMode: () => {},
  showAcronymButtons: true,
  setShowAcronymButtons: () => {},
};

export function useTacticalTheme(): TacticalThemeContextType {
  const ctx = useContext(TacticalThemeContext);
  return ctx ?? FALLBACK_THEME_CONTEXT;
}

