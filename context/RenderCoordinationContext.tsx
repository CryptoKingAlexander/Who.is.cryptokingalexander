'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

interface RenderCoordinationState {
  isPacingBusy: boolean;
  requestPacedRender: (callback: () => void) => void;
  viewportColumns: number;
  setViewportColumns: (cols: number) => void;
  gridScrollTop: number;
  setGridScrollTop: (pos: number) => void;
}

const RenderCoordinationContext = createContext<RenderCoordinationState | null>(null);

export function RenderCoordinationProvider({ children }: { children: React.ReactNode }) {
  const [isPacingBusy, setIsPacingBusy] = useState(false);
  const [viewportColumns, setViewportColumns] = useState(3);
  const [gridScrollTop, setGridScrollTop] = useState(0);

  const requestPacedRender = useCallback((callback: () => void) => {
    setIsPacingBusy(true);
    if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
      window.requestAnimationFrame(() => {
        callback();
        setIsPacingBusy(false);
      });
    } else {
      callback();
      setIsPacingBusy(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      isPacingBusy,
      requestPacedRender,
      viewportColumns,
      setViewportColumns,
      gridScrollTop,
      setGridScrollTop,
    }),
    [isPacingBusy, requestPacedRender, viewportColumns, gridScrollTop]
  );

  return (
    <RenderCoordinationContext.Provider value={value}>
      {children}
    </RenderCoordinationContext.Provider>
  );
}

export function useRenderCoordination() {
  const ctx = useContext(RenderCoordinationContext);
  if (!ctx) {
    throw new Error('useRenderCoordination must be used within RenderCoordinationProvider');
  }
  return ctx;
}
