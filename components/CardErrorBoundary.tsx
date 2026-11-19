'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { errorQueue } from '@/lib/errorAggregationQueue';

interface Props {
  cardId: string;
  cardTitle: string;
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string | null;
}

export class CardErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || 'Render coordination fault in node',
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    errorQueue.logSilentError(error, `CardErrorBoundary:${this.props.cardId}`, { errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorMessage: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-2xl border-2 border-red-800/60 bg-[#0f1420] p-5 shadow-lg text-stone-200 font-sans relative overflow-hidden">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-red-950/80 border border-red-600/40 text-red-400">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 font-bold">
                  Node Telemetry Safe Mode
                </span>
                <span className="text-[10px] font-mono text-stone-400">ID: {this.props.cardId}</span>
              </div>
              <h4 className="text-sm font-bold font-mono text-stone-100 mt-1">
                {this.props.cardTitle}
              </h4>
              <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                An internal mathematical rendering or abstraction coordination error was isolated. Other operational nodes remain active.
              </p>
              {this.state.errorMessage && (
                <div className="mt-2 text-[10px] font-mono bg-red-950/50 text-red-300 p-2 rounded border border-red-900/50 truncate">
                  {this.state.errorMessage}
                </div>
              )}
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={this.handleRetry}
                  className="px-3 py-1.5 rounded-lg font-mono text-xs font-bold text-white bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Node</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
