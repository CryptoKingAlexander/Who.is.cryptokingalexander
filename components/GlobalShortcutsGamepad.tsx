'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Gamepad2, X } from 'lucide-react';
import { triggerToast } from '@/context/ToastContext';

interface GlobalShortcutsGamepadProps {
  onFocusSearch: () => void;
  onRollRandomCard: () => void;
  onCloseAllModals: () => void;
  onOpenBookmarks: () => void;
  onOpenSettings: () => void;
}

export function GlobalShortcutsGamepad({
  onFocusSearch,
  onRollRandomCard,
  onCloseAllModals,
  onOpenBookmarks,
  onOpenSettings,
}: GlobalShortcutsGamepadProps) {
  const [isGamepadMode, setIsGamepadMode] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const elementsRef = useRef<HTMLElement[]>([]);

  // Query all navigable focusable elements across the app
  const refreshNavigableElements = useCallback(() => {
    if (typeof window === 'undefined') return [];
    const selector = 'button:not([disabled]), input:not([disabled]), [role="button"]:not([disabled]), a[href]:not([disabled]), [tabindex="0"]:not([disabled])';
    const all = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter((el) => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        style.visibility !== 'hidden' &&
        style.display !== 'none' &&
        style.opacity !== '0'
      );
    });

    // Prioritize search input at index 0 if present
    const searchInput = all.find((el) => el.tagName === 'INPUT' || el.getAttribute('type') === 'text');
    if (searchInput) {
      const idx = all.indexOf(searchInput);
      if (idx > 0) {
        all.splice(idx, 1);
        all.unshift(searchInput);
      }
    }

    elementsRef.current = all;
    return all;
  }, []);

  // Update thick white border class on currently focused target element
  useEffect(() => {
    if (!isGamepadMode) {
      // Clean up white border
      document.querySelectorAll('.gamepad-focus-target').forEach((el) => {
        el.classList.remove('gamepad-focus-target');
      });
      return;
    }

    const elements = refreshNavigableElements();
    if (elements.length === 0) return;

    const clampedIdx = Math.max(0, Math.min(focusedIndex, elements.length - 1));

    elements.forEach((el, idx) => {
      if (idx === clampedIdx) {
        el.classList.add('gamepad-focus-target');
        el.focus({ preventScroll: true });
        el.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
      } else {
        el.classList.remove('gamepad-focus-target');
      }
    });
  }, [isGamepadMode, focusedIndex, refreshNavigableElements]);

  // Handle global keyboard shortcuts & D-Pad navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    function handleKeyDown(e: KeyboardEvent) {
      const activeEl = document.activeElement;
      const isInput =
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        (activeEl as HTMLElement)?.isContentEditable;

      // 1. GLOBAL KEYBOARD SHORTCUTS (Ignored when typing in inputs, except Esc)
      if (e.key === 'Escape') {
        onCloseAllModals();
        setIsGamepadMode(false);
        if (activeEl instanceof HTMLElement) activeEl.blur();
        return;
      }

      if (!isInput) {
        // 'S' or '/' -> Focus Search
        if (e.key === 's' || e.key === 'S' || e.key === '/') {
          e.preventDefault();
          onFocusSearch();
          setIsGamepadMode(true);
          setFocusedIndex(0); // Start at search bar
          triggerToast('Search Focus Protocol', 'shortcut', 'Tactical node indexing engaged');
          return;
        }

        // 'R' -> Random Node Roll
        if (e.key === 'r' || e.key === 'R') {
          e.preventDefault();
          onRollRandomCard();
          triggerToast('Random Roll Sequence', 'random', 'Spawning stochastic architecture node');
          return;
        }

        // 'B' -> Bookmarks / Print Queue
        if (e.key === 'b' || e.key === 'B') {
          e.preventDefault();
          onOpenBookmarks();
          triggerToast('Printer Queue Access', 'shortcut', 'Retrieving bookmarked dossiers');
          return;
        }

        // '?' or ',' -> Settings Modal
        if (e.key === '?' || e.key === ',') {
          e.preventDefault();
          onOpenSettings();
          triggerToast('System Configuration', 'shortcut', 'Environment variables HUD active');
          return;
        }
      }

      // 2. GAMEPAD / D-PAD NAVIGATION (Arrow keys, Tab, WASD when not in text input)
      const isArrowKey = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key);
      const isWASDKey = !isInput && ['w', 'W', 'a', 'A', 's', 'S', 'd', 'D'].includes(e.key);

      if (isArrowKey || isWASDKey) {
        const elements = refreshNavigableElements();
        if (elements.length === 0) return;

        if (!isGamepadMode) {
          setIsGamepadMode(true);
          setFocusedIndex(0); // Start starting with search bar
          triggerToast('Gamepad HUD Engaged', 'shortcut', 'Tactical D-Pad navigation active');
          return;
        }

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'Tab' || e.key === 'd' || e.key === 'D' || e.key === 's' || e.key === 'S') {
          e.preventDefault();
          setFocusedIndex((prev) => (prev + 1) % elements.length);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'a' || e.key === 'A' || e.key === 'w' || e.key === 'W') {
          e.preventDefault();
          setFocusedIndex((prev) => (prev - 1 + elements.length) % elements.length);
        }
      }

      // 'Enter' or 'Space' in Gamepad Mode triggers click on target element
      if (isGamepadMode && (e.key === 'Enter' || e.key === ' ') && !isInput) {
        const elements = elementsRef.current;
        if (elements[focusedIndex]) {
          e.preventDefault();
          elements[focusedIndex].click();
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isGamepadMode,
    focusedIndex,
    onFocusSearch,
    onRollRandomCard,
    onCloseAllModals,
    onOpenBookmarks,
    onOpenSettings,
    refreshNavigableElements,
  ]);

  return (
    <>
      {/* Gamepad Navigation Mode Indicator Badge */}
      {isGamepadMode && (
        <div className="fixed bottom-4 left-4 z-50 animate-in slide-in-from-bottom-3 fade-in duration-200 px-3.5 py-2 rounded-xl border-2 border-white bg-[#101217]/95 text-white shadow-[0_0_25px_rgba(255,255,255,0.8)] font-mono text-xs flex items-center gap-2.5 backdrop-blur-md">
          <Gamepad2 className="w-4 h-4 text-white animate-pulse" />
          <span className="font-bold tracking-tight text-[11px]">
            GAMEPAD / D-PAD NAV ACTIVE — [ENTER] SELECT · [ESC] EXIT
          </span>
          <button
            type="button"
            onClick={() => setIsGamepadMode(false)}
            className="p-1 text-stone-400 hover:text-white cursor-pointer rounded ml-1"
            title="Exit Gamepad Mode"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </>
  );
}
