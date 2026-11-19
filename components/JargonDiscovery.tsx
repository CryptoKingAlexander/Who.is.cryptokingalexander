'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldAlert, Sparkles } from 'lucide-react';
import { JargonDefinition, NON_THESAURUS_DICTIONARY } from '@/lib/jargonDefinitions';

interface JargonContextType {
  showJargon: (termKey: string) => void;
  closeJargon: () => void;
}

const JargonContext = createContext<JargonContextType | null>(null);

export function useJargon() {
  const context = useContext(JargonContext);
  if (!context) {
    return {
      showJargon: () => {},
      closeJargon: () => {},
    };
  }
  return context;
}

export function JargonProvider({ children }: { children: React.ReactNode }) {
  const [activeJargon, setActiveJargon] = useState<JargonDefinition | null>(null);
  const [lifespanKey, setLifespanKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeJargon = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setActiveJargon(null);
  }, []);

  // Hot swap disambiguation term & limit lifespan to 11 seconds
  const showJargon = useCallback((termKey: string) => {
    const normalized = termKey.toLowerCase().replace(/[^a-z0-9:]/g, '');
    const definition = NON_THESAURUS_DICTIONARY[normalized];
    
    if (definition) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Hot swap definition immediately
      setActiveJargon(definition);
      setLifespanKey((prev) => prev + 1);

      // Enforce 11 seconds lifespan
      timerRef.current = setTimeout(() => {
        setActiveJargon(null);
        timerRef.current = null;
      }, 11000);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <JargonContext.Provider value={{ showJargon, closeJargon }}>
      {children}
      
      <AnimatePresence mode="popLayout">
        {activeJargon && (
          <div className="fixed inset-x-0 bottom-10 z-[100] flex justify-center pointer-events-none px-4">
            <motion.div
              key={`${activeJargon.term}-${lifespanKey}`}
              initial={{ y: 120, opacity: 0, scale: 0.92 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 120, opacity: 0, scale: 0.92 }}
              transition={{
                type: 'spring',
                stiffness: 420,
                damping: 28,
                mass: 0.8,
              }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 200 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.y > 80) {
                  closeJargon();
                }
              }}
              className="pointer-events-auto w-full max-w-sm bg-[#12140d]/95 backdrop-blur-xl border-2 border-amber-500/60 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] relative group overflow-hidden military-grid"
            >
              {/* Hot Swap Flash Ambient Effect */}
              <div className="absolute inset-0 bg-amber-500/10 animate-pulse pointer-events-none" />

              {/* 11-Second Lifespan Progress Timer Bar */}
              <motion.div
                key={`progress-${lifespanKey}`}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 11, ease: 'linear' }}
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-300 shadow-[0_0_10px_rgba(245,158,11,0.8)]"
              />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-stone-400 uppercase tracking-widest block">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>Disambiguation · 11s Lifespan</span>
                      </div>
                      <h3 className="text-lg font-black text-amber-300 uppercase tracking-tight italic font-mono">
                        {activeJargon.term}
                      </h3>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={closeJargon}
                    className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
                    aria-label="Close disambiguation"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-medium mb-4 font-sans">
                  {activeJargon.definition}
                </p>
                
                <div className="flex items-center justify-between border-t border-stone-800/80 pt-3">
                  <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest">Source: {activeJargon.source}</span>
                  <span className="text-[9px] font-mono text-amber-400/90 font-bold animate-pulse">Hot Swappable · Swipe down to dismiss</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </JargonContext.Provider>
  );
}

export function JargonTrigger({ children, term }: { children: React.ReactNode, term: string }) {
  const { showJargon } = useJargon();
  
  return (
    <span 
      onClick={(e) => {
        e.stopPropagation();
        showJargon(term);
      }}
      className="cursor-pointer group relative inline-flex items-center gap-1"
    >
      <span className="relative z-10 decoration-amber-500/40 decoration-2 underline-offset-4 group-hover:decoration-amber-400 group-hover:text-amber-200 transition-all">
        {children}
      </span>
    </span>
  );
}
