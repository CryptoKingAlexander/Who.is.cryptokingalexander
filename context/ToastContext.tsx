'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { playTacticalAudio, TacticalSoundType } from '../lib/tacticalAudio';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type?: 'info' | 'success' | 'warning' | 'alert' | 'ghost';
  timestamp: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  addToast: (title: string, message?: string, type?: ToastItem['type'], sound?: TacticalSoundType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export let triggerToast: (title: string, messageOrType?: any, typeOrMessage?: any, sound?: TacticalSoundType) => void = () => {};

export function setGlobalToastTrigger(fn: typeof triggerToast) {
  triggerToast = fn;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (title: string, message?: string, type: ToastItem['type'] = 'info', sound?: TacticalSoundType) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const item: ToastItem = { id, title, message, type, timestamp: Date.now() };

      if (sound) {
        playTacticalAudio(sound);
      } else if (type === 'ghost') {
        playTacticalAudio('glitch');
      } else if (type === 'success') {
        playTacticalAudio('confirm');
      } else if (type === 'warning' || type === 'alert') {
        playTacticalAudio('radar_alert');
      } else {
        playTacticalAudio('click');
      }

      setToasts((prev) => [...prev.slice(-4), item]);

      setTimeout(() => {
        removeToast(id);
      }, 4200);
    },
    [removeToast]
  );

  const value = useMemo(() => ({ toasts, addToast, removeToast }), [toasts, addToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast Overlay UI */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
        {toasts.map((toast) => {
          const isGhost = toast.type === 'ghost';
          const isSuccess = toast.type === 'success';
          const isAlert = toast.type === 'alert' || toast.type === 'warning';

          const borderColor = isGhost
            ? 'border-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
            : isSuccess
            ? 'border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
            : isAlert
            ? 'border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
            : 'border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.3)]';

          const bgClass = isGhost
            ? 'bg-purple-950/90 text-purple-100'
            : isSuccess
            ? 'bg-emerald-950/90 text-emerald-100'
            : isAlert
            ? 'bg-amber-950/90 text-amber-100'
            : 'bg-slate-900/90 text-cyan-100';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto border backdrop-blur-md px-4 py-3 rounded-lg text-xs font-mono transition-all animate-in slide-in-from-right duration-200 ${borderColor} ${bgClass}`}
            >
              <div className="flex items-center justify-between gap-2 font-bold tracking-wider">
                <span className="flex items-center gap-1.5">
                  {isGhost && <span>👻</span>}
                  {isSuccess && <span>✓</span>}
                  {isAlert && <span>⚠️</span>}
                  {!isGhost && !isSuccess && !isAlert && <span>🛰️</span>}
                  {toast.title}
                </span>
                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="text-slate-400 hover:text-white px-1"
                >
                  ✕
                </button>
              </div>
              {toast.message && <p className="mt-1 text-slate-300 opacity-90 leading-relaxed">{toast.message}</p>}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

const FALLBACK_TOAST_CONTEXT: ToastContextType = {
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
};

export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext);
  return ctx ?? FALLBACK_TOAST_CONTEXT;
}

