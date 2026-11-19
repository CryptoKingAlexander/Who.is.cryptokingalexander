'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export type ClearanceLevel = 'UNCLASSIFIED' | 'SECRET' | 'TOP_SECRET' | 'COSMIC' | 'OMNICLEARANCE';

interface SecurityAccessContextType {
  clearance: ClearanceLevel;
  setClearance: (lvl: ClearanceLevel) => void;
  watermarkEnabled: boolean;
  setWatermarkEnabled: (val: boolean) => void;
  operatorCallsign: string;
  setOperatorCallsign: (callsign: string) => void;
  canAccessMilitaryNodes: boolean;
}

const SecurityAccessContext = createContext<SecurityAccessContextType | null>(null);

export function SecurityAccessProvider({ children }: { children: React.ReactNode }) {
  const [clearance, setClearanceState] = useState<ClearanceLevel>('OMNICLEARANCE');
  const [watermarkEnabled, setWatermarkEnabledState] = useState<boolean>(true);
  const [operatorCallsign, setOperatorCallsignState] = useState<string>('OMNICLEARANCE-ALPHA-0');

  useEffect(() => {
    try {
      const savedClearance = localStorage.getItem('tactical_clearance') as ClearanceLevel | null;
      if (savedClearance && ['UNCLASSIFIED', 'SECRET', 'TOP_SECRET', 'COSMIC', 'OMNICLEARANCE'].includes(savedClearance)) {
        setClearanceState(savedClearance);
      }
      const savedWatermark = localStorage.getItem('tactical_watermark');
      if (savedWatermark !== null) {
        setWatermarkEnabledState(savedWatermark === 'true');
      }
      const savedCallsign = localStorage.getItem('tactical_callsign');
      if (savedCallsign) {
        setOperatorCallsignState(savedCallsign);
      }
    } catch {}
  }, []);

  const setClearance = useCallback((lvl: ClearanceLevel) => {
    setClearanceState(lvl);
    try {
      localStorage.setItem('tactical_clearance', lvl);
    } catch {}
  }, []);

  const setWatermarkEnabled = useCallback((val: boolean) => {
    setWatermarkEnabledState(val);
    try {
      localStorage.setItem('tactical_watermark', String(val));
    } catch {}
  }, []);

  const setOperatorCallsign = useCallback((callsign: string) => {
    setOperatorCallsignState(callsign);
    try {
      localStorage.setItem('tactical_callsign', callsign);
    } catch {}
  }, []);

  const canAccessMilitaryNodes = useMemo(() => {
    return clearance !== 'UNCLASSIFIED';
  }, [clearance]);

  const value = useMemo(
    () => ({
      clearance,
      setClearance,
      watermarkEnabled,
      setWatermarkEnabled,
      operatorCallsign,
      setOperatorCallsign,
      canAccessMilitaryNodes,
    }),
    [clearance, setClearance, watermarkEnabled, setWatermarkEnabled, operatorCallsign, setOperatorCallsign, canAccessMilitaryNodes]
  );

  return (
    <SecurityAccessContext.Provider value={value}>
      {children}
    </SecurityAccessContext.Provider>
  );
}

const FALLBACK_SECURITY_CONTEXT: SecurityAccessContextType = {
  clearance: 'SECRET',
  setClearance: () => {},
  watermarkEnabled: true,
  setWatermarkEnabled: () => {},
  operatorCallsign: 'OPERATOR-ALPHA-7',
  setOperatorCallsign: () => {},
  canAccessMilitaryNodes: true,
};

export function useSecurityAccess(): SecurityAccessContextType {
  const ctx = useContext(SecurityAccessContext);
  return ctx ?? FALLBACK_SECURITY_CONTEXT;
}

