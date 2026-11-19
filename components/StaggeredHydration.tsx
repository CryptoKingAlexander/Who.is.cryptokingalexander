'use client';

import React, { useState, useEffect } from 'react';
import { BackToTop } from '@/components/BackToTop';
import { DebugSystems } from '@/components/DebugSystems';

interface StaggeredHydrationProps {
  children: React.ReactNode;
}

export function StaggeredHydration({ children }: StaggeredHydrationProps) {
  // Stage 0: Synchronous critical path frame
  // Stage 1: Post-initialization non-essential UI (BackToTop)
  // Stage 2: Background diagnostics (DebugSystems)
  const [hydrationStage, setHydrationStage] = useState<number>(0);

  useEffect(() => {
    // 1. Stage 1: Mount non-essential UI elements post-initialization (120ms)
    const timer1 = setTimeout(() => {
      setHydrationStage(1);
    }, 120);

    // 2. Stage 2: Mount diagnostics and background tools (350ms)
    const timer2 = setTimeout(() => {
      setHydrationStage(2);
    }, 350);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <>
      {/* Critical Path Application Tree */}
      {children}

      {/* Pre-allocated DOM Anchor Container for Zero-Teleport BackToTop Button */}
      <div
        className="fixed bottom-6 right-6 z-[60] pointer-events-none min-w-[48px] min-h-[48px] flex items-center justify-center transition-opacity duration-300"
        aria-hidden="true"
      >
        {hydrationStage >= 1 && (
          <div className="pointer-events-auto">
            <BackToTop />
          </div>
        )}
      </div>

      {/* Deferred Diagnostic Systems (Non-Visual Console Diagnostics) */}
      {hydrationStage >= 2 && <DebugSystems />}
    </>
  );
}

