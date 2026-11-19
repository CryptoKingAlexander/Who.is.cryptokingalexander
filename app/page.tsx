'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Providers } from '../components/Providers';
import { Header } from '../components/Header';
import { CategoryInfoCards } from '../components/CategoryInfoCards';
import { VirtualizedNodeGrid } from '../components/VirtualizedNodeGrid';
import { AppTheme } from '../components/SettingsModal';
import { LegalFooter } from '../components/LegalFooter';
import { GlobalShortcutsGamepad } from '../components/GlobalShortcutsGamepad';
import { useNodeDeck } from '../context/NodeDeckContext';
import { useTacticalTheme } from '../context/TacticalThemeContext';
import { SectionId } from '../types/techbook';
import { useToast } from '../context/ToastContext';

const TaxonomyMindMap = dynamic(
  () => import('../components/TaxonomyMindMap').then((m) => m.TaxonomyMindMap),
  { ssr: false }
);
const PrintPreviewModal = dynamic(
  () => import('../components/PrintPreviewModal').then((m) => m.PrintPreviewModal),
  { ssr: false }
);
const MilitaryReportModal = dynamic(
  () => import('../components/MilitaryReportModal').then((m) => m.MilitaryReportModal),
  { ssr: false }
);
const BookmarksModal = dynamic(
  () => import('../components/BookmarksModal').then((m) => m.BookmarksModal),
  { ssr: false }
);
const SettingsModal = dynamic(
  () => import('../components/SettingsModal').then((m) => m.SettingsModal),
  { ssr: false }
);
const WelcomeModal = dynamic(
  () => import('../components/WelcomeModal').then((m) => m.WelcomeModal),
  { ssr: false }
);
const StackResilienceModal = dynamic(
  () => import('../components/StackResilienceModal').then((m) => m.StackResilienceModal),
  { ssr: false }
);

function HomeContent() {
  const router = useRouter();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [isResilienceOpen, setIsResilienceOpen] = useState(false);

  const {
    activeSection,
    activeView,
    focusNodeById,
    rollRandomNode,
    isPrintPreviewOpen,
    setPrintPreviewOpen,
    isMilitaryModalOpen,
    isBookmarksModalOpen,
    setBookmarksModalOpen,
  } = useNodeDeck();

  const { theme, setTheme } = useTacticalTheme();
  const { addToast } = useToast();

  const currentAppTheme: AppTheme =
    theme === 'white' || theme === 'paper-white'
      ? 'white'
      : theme === 'black'
      ? 'black'
      : 'slate';

  const handleHeroRandom = () => {
    const card = rollRandomNode();
    addToast('BLUEPRINT ENGAGED', `Selected ${card.title.slice(0, 36)}...`, 'info', 'radar_alert');
  };

  return (
    <div
      className={`min-h-screen flex flex-col pb-12 font-sans ${
        currentAppTheme === 'white'
          ? 'bg-[#f7f6f0] text-stone-900'
          : currentAppTheme === 'black'
          ? 'bg-black text-stone-100'
          : 'bg-[#0c0d09] text-stone-100'
      }`}
    >
      {/* Persistent Mustard-Gilded Tactical Header */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenWelcome={() => setIsWelcomeOpen(true)}
        currentTheme={currentAppTheme}
      />

      {/* Global Keyboard Shortcuts & Gamepad D-Pad Navigation */}
      <GlobalShortcutsGamepad
        onFocusSearch={() => {
          const searchEl = document.querySelector<HTMLElement>('.search-input');
          searchEl?.focus();
        }}
        onRollRandomCard={handleHeroRandom}
        onCloseAllModals={() => {
          setIsSettingsOpen(false);
          setIsWelcomeOpen(false);
          setIsResilienceOpen(false);
          setPrintPreviewOpen(false);
          setBookmarksModalOpen(false);
        }}
        onOpenBookmarks={() => setBookmarksModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Presentation Panel (1px from screen edges, starting directly with Category Overview) */}
      <main className="flex-1 w-full max-w-none m-0 px-[1px] py-1">
        {/* Starts directly with Category Overview (collapsed by default) */}
        <CategoryInfoCards />

        {/* Full-bleed Node List (1px from screen edges, no parent container visual) or Mind Map */}
        {activeView === 'mindmap' ? (
          <TaxonomyMindMap
            onSelectCard={(cardId) => focusNodeById(cardId, true)}
            currentSection={activeSection as SectionId}
          />
        ) : (
          <VirtualizedNodeGrid />
        )}
      </main>

      {/* Global Modals (mounted on demand) */}
      {isPrintPreviewOpen && <PrintPreviewModal />}
      {isMilitaryModalOpen && <MilitaryReportModal />}
      {isBookmarksModalOpen && <BookmarksModal />}
      {isSettingsOpen && (
        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      )}
      {isWelcomeOpen && (
        <WelcomeModal
          isOpen={isWelcomeOpen}
          onClose={() => setIsWelcomeOpen(false)}
          currentTheme={currentAppTheme}
          onSelectTheme={(t) => setTheme(t)}
        />
      )}
      {isResilienceOpen && (
        <StackResilienceModal
          isOpen={isResilienceOpen}
          onClose={() => setIsResilienceOpen(false)}
        />
      )}

      {/* Persistent Mustard-Gilded Legal Footer */}
      <LegalFooter
        currentTheme={currentAppTheme}
        onOpenPrivacy={() => router.push('/privacy')}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Providers>
      <HomeContent />
    </Providers>
  );
}
