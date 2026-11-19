'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { isGhostSearchActive } from '../lib/smartSearchEngine';

interface TelemetryEntry {
  nodeId: string;
  timestamp: number;
  durationMs: number;
}

interface TelemetryContextType {
  history: TelemetryEntry[];
  recordNodeDwell: (nodeId: string, durationMs: number) => void;
  clearHistory: () => void;
  isCloaked: boolean;
  totalNodesRead: number;
}

const TelemetryContext = createContext<TelemetryContextType | null>(null);

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<TelemetryEntry[]>([]);
  const [isCloaked, setIsCloaked] = useState<boolean>(false);

  useEffect(() => {
    setIsCloaked(isGhostSearchActive());
    try {
      const saved = localStorage.getItem('tactical_telemetry_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const recordNodeDwell = useCallback((nodeId: string, durationMs: number) => {
    if (isGhostSearchActive()) {
      // In Ghost Search mode, telemetry is cloaked to protect the operator's research trace
      return;
    }
    setHistory((prev) => {
      const next = [{ nodeId, timestamp: Date.now(), durationMs }, ...prev.slice(0, 99)];
      try {
        localStorage.setItem('tactical_telemetry_history', JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem('tactical_telemetry_history');
    } catch {}
  }, []);

  const value = useMemo(
    () => ({
      history,
      recordNodeDwell,
      clearHistory,
      isCloaked,
      totalNodesRead: history.length,
    }),
    [history, recordNodeDwell, clearHistory, isCloaked]
  );

  return (
    <TelemetryContext.Provider value={value}>
      {children}
    </TelemetryContext.Provider>
  );
}

const FALLBACK_TELEMETRY_CONTEXT: TelemetryContextType = {
  history: [],
  recordNodeDwell: () => {},
  clearHistory: () => {},
  isCloaked: false,
  totalNodesRead: 0,
};

export function useTelemetry(): TelemetryContextType {
  const ctx = useContext(TelemetryContext);
  return ctx ?? FALLBACK_TELEMETRY_CONTEXT;
}

