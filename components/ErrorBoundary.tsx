'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, ShieldAlert, Sparkles, RefreshCw, Cpu } from 'lucide-react';

import { errorQueue } from '@/lib/errorAggregationQueue';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  componentName?: string;
  isSegment?: boolean;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  resetCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      resetCount: 0,
    };
  }

  componentDidMount() {
    errorQueue.initGlobalListeners();
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    // Dump full error aggregation queue to console on fatal crash
    errorQueue.dumpToConsoleFatal(error, `React ErrorBoundary [${this.props.componentName || 'Root Segment'}]`);
  }

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  /**
   * Reinitializes the specific UI segment component without triggering a full browser refresh.
   */
  handleReinitializeComponent = () => {
    if (this.props.onReset) {
      try {
        this.props.onReset();
      } catch (err) {
        console.warn('[ErrorBoundary] Error during onReset callback execution:', err);
      }
    }

    this.setState((prevState) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      resetCount: prevState.resetCount + 1,
    }));
  };

  render() {
    if (this.state.hasError) {
      const isRateExceeded =
        this.state.error?.message?.toLowerCase().includes('rate') ||
        this.state.error?.message?.toLowerCase().includes('quota') ||
        this.state.error?.message?.toLowerCase().includes('429');

      const segmentLabel = this.props.componentName || 'UI Segment Module';

      // Inline Segment Fallback (for cards, sidebars, or isolated panels)
      if (this.props.isSegment) {
        return (
          <div className="w-full p-4 sm:p-5 rounded-2xl bg-[#0d111c] border-2 border-red-800/70 shadow-[0_0_30px_rgba(239,68,68,0.2)] font-mono text-stone-100 relative overflow-hidden space-y-3">
            <div className="flex items-center justify-between gap-3 border-b border-red-900/40 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-red-950/80 border border-red-600/50 text-red-400">
                  <Cpu className="w-4 h-4 animate-pulse" />
                </div>
                <span className="text-xs font-bold text-red-200 uppercase tracking-wide">
                  {segmentLabel} Fault
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-red-950/90 text-red-300 border border-red-800/50">
                In-Place Isolated
              </span>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              A localized execution error occurred in <span className="text-red-300 font-bold">{segmentLabel}</span>. The rest of the platform remains functional.
            </p>

            {this.state.error && (
              <div className="p-2.5 rounded-lg bg-[#060a12] border border-red-900/40 text-[11px] text-stone-400 break-all max-h-20 overflow-y-auto">
                <span className="text-red-400 font-bold">Error: </span>
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="pt-1 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={this.handleReinitializeComponent}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-950 bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-400 hover:to-amber-400 transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reinitialize Component</span>
              </button>
            </div>
          </div>
        );
      }

      // Full-Page or Main Area Fallback
      return (
        <div className="min-h-screen bg-[#070a12] flex flex-col items-center justify-center p-4 sm:p-6 text-stone-100 font-sans selection:bg-red-500/30 military-grid">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-[#0f1420] border-2 border-red-800/60 shadow-[0_0_50px_rgba(239,68,68,0.25)] text-center relative overflow-hidden space-y-5">
            {/* Corner notch accents */}
            <div className="pointer-events-none absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 rounded-tl-sm border-red-500" />
            <div className="pointer-events-none absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 rounded-tr-sm border-red-500" />
            <div className="pointer-events-none absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 rounded-bl-sm border-red-500" />
            <div className="pointer-events-none absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 rounded-br-sm border-red-500" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="p-3.5 rounded-2xl bg-red-950/80 border-2 border-red-500/50 text-red-400 mb-3 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                <ShieldAlert className="w-8 h-8 animate-pulse" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-600/40 text-[11px] font-mono text-red-300 font-bold uppercase mb-2">
                <Sparkles className="w-3 h-3 text-red-400" />
                <span>Generic · Multi-Domain Operational Systems</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-red-100">
                {isRateExceeded
                  ? 'Rate Limit Mitigation Shield'
                  : (this.props.fallbackTitle || `${segmentLabel} Interruption Caught`)}
              </h2>

              <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed max-w-sm">
                {isRateExceeded
                  ? 'Request or scroll velocity exceeded rate thresholds. Rate-limiting mitigation active — auto-restoring session.'
                  : 'An abstraction coordination interruption was detected. You can reinitialize this component segment in-place without reloading the entire page.'}
              </p>

              {this.state.error && (
                <div className="mt-4 w-full text-left p-3 rounded-lg bg-[#060a12] border border-red-900/50 text-[11px] font-mono text-stone-400 max-h-28 overflow-y-auto break-all">
                  <span className="text-red-400 block mb-0.5 font-bold">Diagnostic Code:</span>
                  {this.state.error.message || String(this.state.error)}
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
                <button
                  type="button"
                  onClick={this.handleReinitializeComponent}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-mono text-xs font-bold text-stone-950 bg-gradient-to-r from-red-500 via-amber-400 to-yellow-400 hover:from-red-400 hover:to-yellow-300 transition-all shadow-[0_0_20px_rgba(239,68,68,0.35)] cursor-pointer touch-manipulation min-h-[42px] flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4 text-stone-950" />
                  <span>Reinitialize Component</span>
                </button>

                <button
                  type="button"
                  onClick={this.handleReload}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white font-mono text-xs transition-colors cursor-pointer touch-manipulation min-h-[42px] flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
                  <span>Full Browser Reload</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <React.Fragment key={this.state.resetCount}>
        {this.props.children}
      </React.Fragment>
    );
  }
}
