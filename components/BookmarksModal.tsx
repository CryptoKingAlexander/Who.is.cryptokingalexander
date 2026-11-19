'use client';

import React, { useState, useMemo } from 'react';
import { useNodeDeck } from '../context/NodeDeckContext';
import { TechCard } from '../types/techbook';
import { Bookmark, Printer, Trash2, X, ExternalLink, Filter } from 'lucide-react';
import { playTacticalAudio } from '../lib/tacticalAudio';

export function BookmarksModal() {
  const {
    isBookmarksModalOpen,
    setBookmarksModalOpen,
    bookmarks,
    toggleBookmark,
    clearBookmarks,
    printQueue,
    removeFromPrintQueue,
    clearPrintQueue,
    cards,
    focusNodeById,
    setPrintPreviewOpen,
    setPreviewNodeId,
    showOnlyBookmarks,
    setShowOnlyBookmarks,
  } = useNodeDeck();

  const [activeTab, setActiveTab] = useState<'bookmarks' | 'queue'>('bookmarks');

  const bookmarkedCards = useMemo(() => {
    const cardMap = new Map(cards.map((c) => [c.id, c]));
    return bookmarks
      .map((id) => cardMap.get(id))
      .filter((c): c is TechCard => c !== undefined);
  }, [bookmarks, cards]);

  const queueCards = useMemo(() => {
    const cardMap = new Map(cards.map((c) => [c.id, c]));
    const activeIds = printQueue.length > 0 ? printQueue : bookmarks;
    return activeIds
      .map((id) => cardMap.get(id))
      .filter((c): c is TechCard => c !== undefined);
  }, [printQueue, bookmarks, cards]);

  if (!isBookmarksModalOpen) return null;

  const handleOpenPrintPreview = () => {
    playTacticalAudio('click');
    setPreviewNodeId(null);
    setPrintPreviewOpen(true);
    setBookmarksModalOpen(false);
  };

  const handleJumpToNode = (cardId: string) => {
    playTacticalAudio('confirm');
    focusNodeById(cardId, true);
    setBookmarksModalOpen(false);
  };

  const handleFilterMainGridToBookmarks = () => {
    playTacticalAudio('confirm');
    setShowOnlyBookmarks(!showOnlyBookmarks);
    setBookmarksModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-xl border border-slate-700 bg-slate-950 p-6 text-slate-100 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-amber-400 fill-amber-400" />
            <span className="text-base font-bold text-slate-100 tracking-wider">
              SAVED BOOKMARKS &amp; PRINT DOSSIER ({bookmarkedCards.length})
            </span>
          </div>
          <button
            type="button"
            onClick={() => setBookmarksModalOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('bookmarks')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
              activeTab === 'bookmarks'
                ? 'bg-amber-950 text-amber-300 border-amber-700 shadow-sm'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Bookmarks ({bookmarkedCards.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('queue')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
              activeTab === 'queue'
                ? 'bg-cyan-950 text-cyan-300 border-cyan-700 shadow-sm'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Queue ({queueCards.length})</span>
          </button>
        </div>

        {/* Action Bar when items exist */}
        {bookmarkedCards.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded bg-slate-900/80 border border-slate-800 mb-4 text-xs">
            <span className="text-slate-300 font-bold">
              {bookmarkedCards.length} {bookmarkedCards.length === 1 ? 'node' : 'nodes'} hydrated
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleFilterMainGridToBookmarks}
                className={`flex items-center gap-1 px-2.5 py-1 rounded border font-bold cursor-pointer ${
                  showOnlyBookmarks
                    ? 'bg-amber-500 text-stone-950 border-amber-300'
                    : 'bg-amber-950/70 text-amber-300 border-amber-700 hover:bg-amber-900/80'
                }`}
              >
                <Filter className="h-3.5 w-3.5" />
                <span>{showOnlyBookmarks ? 'Showing Bookmarks in Grid' : 'Show in Main Grid'}</span>
              </button>
              <button
                type="button"
                onClick={handleOpenPrintPreview}
                className="flex items-center gap-1 px-3 py-1 rounded bg-cyan-600 text-white font-bold hover:bg-cyan-500 shadow-md shadow-cyan-600/30 cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Preview All</span>
              </button>
              <button
                type="button"
                onClick={activeTab === 'bookmarks' ? clearBookmarks : clearPrintQueue}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 text-rose-300 border border-rose-900/60 hover:bg-rose-950/60 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        )}

        {/* List of items */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {activeTab === 'bookmarks' && (
            <>
              {bookmarkedCards.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No bookmarks saved yet. Click the Bookmark button on any card to save.
                </div>
              ) : (
                bookmarkedCards.map((card) => (
                  <div
                    key={card.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => handleJumpToNode(card.id)}
                      className="flex-1 min-w-0 text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2 text-[10px] text-amber-400">
                        <span className="font-bold">{card.id}</span>
                        <span>·</span>
                        <span>{card.category}</span>
                        <span>·</span>
                        <span>{card.level}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-100 truncate mt-0.5 hover:text-amber-300">
                        {card.title}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 font-sans">
                        {card.description}
                      </div>
                    </button>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleJumpToNode(card.id)}
                        className="px-2 py-1 rounded text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-700/60 hover:bg-amber-900 cursor-pointer flex items-center gap-1"
                        title="Focus and Expand Node in Main View"
                      >
                        <span>Open</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleBookmark(card.id)}
                        className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 cursor-pointer"
                        title="Remove bookmark"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'queue' && (
            <>
              {queueCards.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  Print queue is currently empty. Bookmark any node card to add it to your print dossier.
                </div>
              ) : (
                queueCards.map((card) => (
                  <div
                    key={card.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => handleJumpToNode(card.id)}
                      className="flex-1 min-w-0 text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2 text-[10px] text-cyan-400">
                        <span className="font-bold">{card.id}</span>
                        <span>·</span>
                        <span>{card.category}</span>
                        <span>·</span>
                        <span>{card.level}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-100 truncate mt-0.5 hover:text-cyan-300">
                        {card.title}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 font-sans">
                        {card.description}
                      </div>
                    </button>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewNodeId(card.id);
                          setPrintPreviewOpen(true);
                          setBookmarksModalOpen(false);
                        }}
                        className="px-2 py-1 rounded text-[10px] font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 hover:bg-cyan-900 cursor-pointer flex items-center gap-1"
                        title="Print Preview Node"
                      >
                        <Printer className="h-3 w-3" />
                        <span>Preview</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromPrintQueue(card.id)}
                        className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 cursor-pointer"
                        title="Remove from queue"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
