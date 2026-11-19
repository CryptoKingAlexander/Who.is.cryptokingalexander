'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { TechCard } from '../../../types/techbook';
import { Providers } from '../../../components/Providers';
import { useNodeDeck } from '../../../context/NodeDeckContext';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { CardItem } from '../../../components/CardItem';
import { generateTechArticleSchema } from '../../../lib/techArticleSchema';
import { ArrowLeft, Printer, FileText } from 'lucide-react';
import { playTacticalAudio } from '../../../lib/tacticalAudio';

const PrintPreviewModal = dynamic(
  () => import('../../../components/PrintPreviewModal').then((m) => m.PrintPreviewModal),
  { ssr: false }
);
const MilitaryReportModal = dynamic(
  () => import('../../../components/MilitaryReportModal').then((m) => m.MilitaryReportModal),
  { ssr: false }
);
const BookmarksModal = dynamic(
  () => import('../../../components/BookmarksModal').then((m) => m.BookmarksModal),
  { ssr: false }
);

interface NodePageClientProps {
  card: TechCard;
}

function NodePageClientInner({ card }: NodePageClientProps) {
  const {
    isPrintPreviewOpen,
    setPrintPreviewOpen,
    setPreviewNodeId,
    isMilitaryModalOpen,
    isBookmarksModalOpen,
  } = useNodeDeck();
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePrint = () => {
    playTacticalAudio('confirm');
    if (typeof window !== 'undefined') {
      window.focus();
      document.body.classList.add('military-print-active');
      window.print();
      setTimeout(() => {
        document.body.classList.remove('military-print-active');
      }, 1500);
    }
  };

  const handleOpenPrintPreview = () => {
    playTacticalAudio('click');
    setPreviewNodeId(card.id);
    setPrintPreviewOpen(true);
  };

  const schemaJson = generateTechArticleSchema(card);

  return (
    <div className="min-h-screen bg-[#0c0d09] text-stone-100 font-sans pb-14">
      {/* Structured Data JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      {/* Top Navigation */}
      <nav className="no-print border-b border-amber-500/40 bg-[#141510]/95 px-2 py-2.5 sticky top-0 z-40 backdrop-blur-md">
        <div className="w-full flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 hover:text-amber-200 px-3 py-1.5 rounded-xl bg-[#181913] border border-amber-500/40"
            >
              <ArrowLeft className="h-4 w-4 text-amber-400" />
              <span>RETURN TO CODEX DECK</span>
            </Link>
            <Breadcrumb card={card} />
          </div>

          <div className="flex items-center gap-2 font-mono">
            <button
              type="button"
              onClick={handleOpenPrintPreview}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-[#181913] text-amber-200 border border-amber-500/40 hover:bg-[#22241a] cursor-pointer"
            >
              <FileText className="h-3.5 w-3.5 text-amber-400" />
              <span>Full Screen Print Preview</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-amber-500 text-stone-950 hover:bg-amber-400 shadow-md cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Dossier</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Standalone Node Container (1px from screen edges, starting collapsed) */}
      <main className="w-full max-w-none m-0 px-[1px] py-1 military-print-container">
        <CardItem
          card={card}
          isExpanded={isExpanded}
          onToggleExpand={() => setIsExpanded((prev) => !prev)}
        />
      </main>

      {/* Global Modals */}
      {isPrintPreviewOpen && <PrintPreviewModal />}
      {isMilitaryModalOpen && <MilitaryReportModal />}
      {isBookmarksModalOpen && <BookmarksModal />}
    </div>
  );
}

export function NodePageClient({ card }: NodePageClientProps) {
  return (
    <Providers>
      <NodePageClientInner card={card} />
    </Providers>
  );
}
