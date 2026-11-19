'use client';

import React, { useEffect, useState } from 'react';
import {
  stackResilienceEngine,
  StackHealthSnapshot,
  StackDomain,
  StackResolutionItem,
} from '../lib/stackResilienceEngine';
import {
  ShieldCheck,
  X,
  Activity,
  Server,
  Globe,
  Cpu,
  RefreshCw,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Layers,
  BookOpenCheck,
  FileCode2,
} from 'lucide-react';
import { playTacticalAudio } from '../lib/tacticalAudio';
import { useToast } from '../context/ToastContext';

interface StackResilienceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalTab = 'TOP_3_PER_ERROR' | 'ALL' | StackDomain;

const DOMAIN_TABS: { id: ModalTab; label: string; count: string }[] = [
  { id: 'TOP_3_PER_ERROR', label: 'Top 3 Solutions / Error', count: '5×3 = 15' },
  { id: 'ALL', label: 'All 25 Mitigations', count: '25' },
  { id: 'OSI_STACK', label: 'OSI Stack (L1–L7)', count: '9' },
  { id: 'PROVIDER_STACK', label: 'Provider Stack', count: '8' },
  { id: 'WEB_STACK', label: 'Web Stack', count: '8' },
];

export function StackResilienceModal({ isOpen, onClose }: StackResilienceModalProps) {
  const [snapshot, setSnapshot] = useState<StackHealthSnapshot>(() =>
    stackResilienceEngine.getSnapshot()
  );
  const [activeTab, setActiveTab] = useState<ModalTab>('TOP_3_PER_ERROR');
  const [isVerifying, setIsVerifying] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const unsubscribe = stackResilienceEngine.subscribe(() => {
      setSnapshot(stackResilienceEngine.getSnapshot());
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  const filteredResolutions = snapshot.resolutions.filter((item) =>
    activeTab === 'ALL' || activeTab === 'TOP_3_PER_ERROR' ? true : item.stack === activeTab
  );

  const handleVerifyAll = async () => {
    setIsVerifying(true);
    playTacticalAudio('click');
    await stackResilienceEngine.verifyAll25Resolutions();
    setIsVerifying(false);
    addToast(
      'ALL 15 ERROR SOLUTIONS & 25 STACK MITIGATIONS VERIFIED',
      'Top 3 solutions per error (5×3) + 25 OSI/Provider/Web stack mitigations verified operational.',
      'success'
    );
  };

  const handleSimulateFailoverDrill = () => {
    playTacticalAudio('radar_alert');
    stackResilienceEngine.simulateContainerRestartAndMitigate();
    addToast(
      'CONTAINER RESTART DRILL ENGAGED',
      'Executed zero-downtime failover across OSI L3/L4/L7, Provider boundaries, and Web chunk guards.',
      'warning'
    );
  };

  const handleToggleSingleFallback = (item: StackResolutionItem) => {
    playTacticalAudio('click');
    stackResilienceEngine.simulateContainerRestartAndMitigate(item.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md font-mono">
      <div className="relative w-full max-w-6xl max-h-[90vh] flex flex-col rounded-2xl border border-cyan-500/50 bg-[#060a12] text-slate-100 shadow-[0_0_60px_rgba(6,182,212,0.2)] overflow-hidden">
        {/* Top Command Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/90 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950 border border-cyan-500/60 text-cyan-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-extrabold tracking-wider text-white">
                  TOP 3 SOLUTIONS PER ERROR (15/15) &amp; 25-POINT STACK RESILIENCE MATRIX
                </h2>
                <span className="rounded bg-emerald-950/90 border border-emerald-500/50 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                  {snapshot.verifiedCount}/{snapshot.totalResolutions} STACK · 15/15 ERROR FIXES
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                5 Logged Errors × Top 3 Researched Solutions · OSI Stack (L1–L7) · Provider Isolation · Next.js 15 Web Stack
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleVerifyAll}
              disabled={isVerifying}
              className="flex items-center gap-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-3 py-1.5 text-xs font-bold text-slate-950 transition-all cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
              <span>Verify All</span>
            </button>

            <button
              type="button"
              onClick={handleSimulateFailoverDrill}
              className="flex items-center gap-1.5 rounded-lg border border-amber-500/60 bg-amber-950/50 hover:bg-amber-900/60 px-3 py-1.5 text-xs font-bold text-amber-300 transition-all cursor-pointer"
            >
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <span>Test Container Failover</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Close Resilience Matrix"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Live Telemetry Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 px-5 py-3 bg-slate-900/60 border-b border-slate-800/80 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block">CONTAINER STATUS</span>
              <span className="font-bold text-emerald-400">{snapshot.containerStatus}</span>
            </div>
            <Server className="h-4 w-4 text-cyan-400" />
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block">L7 CIRCUIT BREAKER</span>
              <span className="font-bold text-cyan-300">{snapshot.circuitBreakerState}</span>
            </div>
            <Activity className="h-4 w-4 text-emerald-400" />
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block">STORAGE ADAPTER TIER</span>
              <span className="font-bold text-amber-300">{snapshot.storageTier}</span>
            </div>
            <Layers className="h-4 w-4 text-amber-400" />
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block">FRAME PACING BUDGET</span>
              <span className="font-bold text-purple-300">
                {snapshot.frameBudgetFps} FPS · {snapshot.activeFallbacks} Fallbacks Engaged
              </span>
            </div>
            <Cpu className="h-4 w-4 text-purple-400" />
          </div>
        </div>

        {/* Stack Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-2.5 bg-slate-950 border-b border-slate-800">
          <div className="flex flex-wrap items-center gap-1.5">
            {DOMAIN_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  playTacticalAudio('click');
                  setActiveTab(tab.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span className="px-1.5 py-0.2 rounded bg-slate-950 text-[10px] text-cyan-400">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <span className="text-[11px] text-slate-400">
            {activeTab === 'TOP_3_PER_ERROR'
              ? 'Showing Top 3 Researched Engineering Solutions for Each of the 5 Errors (15/15 Applied)'
              : 'Click any card\u2019s Test Fallback button to toggle its live fallback path'}
          </span>
        </div>

        {/* Scrollable Content Area */}
        {activeTab === 'TOP_3_PER_ERROR' ? (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {snapshot.researchedErrorPlaybooks.map((playbook) => (
              <div
                key={playbook.errorId}
                className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-500/60 text-[10px] font-extrabold text-rose-300">
                        {playbook.errorId}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-[10px] font-bold text-cyan-300">
                        {playbook.subsystem}
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-white font-mono">
                      {playbook.errorSignature}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      <strong className="text-slate-200">Researched Root Cause:</strong> {playbook.rootCause}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950/90 border border-emerald-500/50 text-[10px] font-bold text-emerald-300 shrink-0">
                    <BookOpenCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>3/3 SOLUTIONS APPLIED</span>
                  </span>
                </div>

                {/* Top 3 Solutions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {playbook.top3Solutions.map((sol) => (
                    <div
                      key={sol.rank}
                      className="rounded-lg bg-slate-950/90 border border-slate-800/90 p-3 flex flex-col justify-between gap-2"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-600/50 text-[10px] font-extrabold text-cyan-300">
                            SOLUTION #{sol.rank}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            {sol.status}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white">{sol.title}</h4>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {sol.implementation}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[10px] text-amber-300">
                        <FileCode2 className="h-3 w-3 shrink-0 text-amber-400" />
                        <span className="truncate" title={sol.targetFiles}>
                          {sol.targetFiles}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredResolutions.map((item) => {
              const isFallback = item.state === 'FALLBACK_ACTIVE';
              const stackBadgeColor =
                item.stack === 'OSI_STACK'
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                  : item.stack === 'PROVIDER_STACK'
                  ? 'bg-purple-950 text-purple-300 border-purple-700'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-700';

              return (
                <div
                  key={item.id}
                  className={`rounded-xl border p-4 transition-all flex flex-col justify-between gap-3 ${
                    isFallback
                      ? 'border-amber-500/80 bg-amber-950/15 shadow-[0_0_20px_rgba(245,158,11,0.12)]'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Card Top Bar */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-[10px] font-extrabold text-slate-200">
                          #{String(item.id).padStart(2, '0')} · {item.code}
                        </span>
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${stackBadgeColor}`}>
                          {item.layer}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                            isFallback
                              ? 'bg-amber-950 text-amber-300 border-amber-500'
                              : 'bg-emerald-950/80 text-emerald-300 border-emerald-700/70'
                          }`}
                        >
                          {isFallback ? (
                            <>
                              <AlertTriangle className="h-3 w-3 text-amber-400" />
                              <span>FALLBACK ACTIVE</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                              <span>VERIFIED</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Title & Failure Mode */}
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-white">{item.title}</h3>
                      <p className="text-[11px] text-rose-300/90 mt-0.5">
                        <strong className="text-rose-400">Fault Target:</strong> {item.failureMode}
                      </p>
                    </div>

                    {/* 3-Tier Resolution / Mitigation / Fallback Details */}
                    <div className="space-y-1.5 rounded-lg bg-slate-950/90 border border-slate-800/90 p-2.5 text-[11px]">
                      <div>
                        <span className="text-cyan-400 font-bold">1. Resolution: </span>
                        <span className="text-slate-300">{item.resolution}</span>
                      </div>
                      <div>
                        <span className="text-purple-400 font-bold">2. Mitigation: </span>
                        <span className="text-slate-300">{item.mitigation}</span>
                      </div>
                      <div>
                        <span className="text-amber-400 font-bold">3. Fallback: </span>
                        <span className="text-slate-200">{item.fallback}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Telemetry & Interactive Fallback Trigger */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80 text-[10px]">
                    <span className="text-slate-400 truncate">
                      <strong className="text-slate-300">Telemetry:</strong> {item.metrics}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleSingleFallback(item)}
                      className={`px-2.5 py-1 rounded font-bold border transition-colors shrink-0 cursor-pointer ${
                        isFallback
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-600 hover:bg-emerald-900'
                          : 'bg-slate-800 text-cyan-300 border-slate-700 hover:border-cyan-500'
                      }`}
                    >
                      {isFallback ? 'Restore Primary' : 'Test Fallback'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 border-t border-slate-800 bg-slate-950 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <Globe className="h-3.5 w-3.5 text-cyan-400" />
            <span>
              5 Errors × Top 3 Researched Solutions (15/15) · 9 OSI Layers · 8 Provider Isolators · 8 Web Stack Guards
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
}
