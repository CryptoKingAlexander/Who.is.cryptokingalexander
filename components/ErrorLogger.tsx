'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, ShieldAlert, Sparkles } from 'lucide-react';
import { errorQueue } from '@/lib/errorAggregationQueue';

interface Props {
  children: ReactNode;
  contextName?: string;
  onResetContext?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorLogger Component
 * 
 * Intercepts fatal runtime errors within specific context subtrees.
 * Instead of crashing the entire UI or reloading the browser, it renders
 * a minimal 'System Reinitialization' action bar allowing users to reset 
 * only the affected context state while preserving the rest of the application.
 */
export class ErrorLogger extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Silently log error into queue and trigger diagnostic telemetry dump
    errorQueue.logSilentError(error, `ErrorLogger:${this.props.contextName || 'Subtree'}`, { errorInfo });
    errorQueue.dumpToConsoleFatal(error, `ErrorLogger (${this.props.contextName || 'Context Boundary'})`);
  }

  handleSystemReinitialization = () => {
    // Reset internal state
    this.setState({ hasError: false, error: null });

    // Execute context-specific state reset callback if provided
    if (this.props.onResetContext) {
      try {
        this.props.onResetContext();
      } catch (err) {
        errorQueue.logSilentError(err, 'ErrorLogger:onResetContext');
      }
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full my-4 p-4 rounded-xl border-2 border-amber-500/60 bg-[#0d111a] text-stone-100 shadow-[0_0_25px_rgba(245,158,11,0.2)] font-mono text-xs flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-400 shrink-0">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-amber-300">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Isolated State Interruption · {this.props.contextName || 'Node Subsystem'}</span>
              </div>
              <p className="text-stone-300 text-xs mt-0.5">
                {this.state.error?.message || 'A transient state anomaly was intercepted in this view enclave.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={this.handleSystemReinitialization}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-stone-950 font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 shrink-0 active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5 text-stone-950" />
            <span>System Reinitialization</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
