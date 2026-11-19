/**
 * Client-Side Error Aggregation Queue Service
 * 
 * Captures unhandled promise rejections and window errors into a hidden
 * capped memory queue. Dumps logs to console ONLY upon:
 * 1. Reaching a designated 'fatal' error threshold (e.g., 5 unhandled errors).
 * 2. An explicit fatal exception caught by Error Boundaries.
 * 3. User-requested 'diagnostic' command (`dumpDiagnosticLogs()` or `window.DumpDiagnosticLogs()`).
 */

export interface TelemetryEntry {
  id: string;
  type: 'error' | 'nav' | 'action' | 'system';
  timestamp: string;
  epoch: number;
  message: string;
  details?: Record<string, unknown>;
  stack?: string;
  silent?: boolean;
}

class ErrorAggregationQueue {
  private buffer: TelemetryEntry[] = [];
  private maxCapacity = 100;
  private isInitialized = false;
  private sessionStartTime = Date.now();
  private unhandledErrorCount = 0;
  private fatalThreshold = 5;

  constructor() {
    this.addEntry('system', 'Client-side Error Aggregation Queue Service initialized', {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server',
      platform: typeof navigator !== 'undefined' ? navigator.platform : 'Unknown',
    });
  }

  /**
   * Set threshold count for automatic fatal dump
   */
  public setFatalThreshold(threshold: number) {
    if (threshold > 0) {
      this.fatalThreshold = threshold;
    }
  }

  /**
   * Attach global window error listeners and navigation trackers
   */
  public initGlobalListeners() {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    // Track initial URL
    this.addNavigationNote(`Initial Page Load: ${window.location.pathname}${window.location.search}`);

    // Capture window errors
    const originalOnError = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      this.logUnhandledError(error || message, 'window.onerror', { source, lineno, colno });
      if (typeof originalOnError === 'function') {
        return originalOnError(message, source, lineno, colno, error);
      }
      return false;
    };

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logUnhandledError(event.reason, 'window.unhandledrejection');
    });

    // Intercept pushState & replaceState for SPA route changes
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      const url = args[2] ? String(args[2]) : window.location.pathname;
      this.addNavigationNote(`Navigate (pushState): ${url}`);
    };

    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      const url = args[2] ? String(args[2]) : window.location.pathname;
      this.addNavigationNote(`Navigate (replaceState): ${url}`);
    };

    window.addEventListener('popstate', () => {
      this.addNavigationNote(`Navigate (popstate): ${window.location.pathname}${window.location.search}`);
    });

    // Expose diagnostic command on window
    (window as unknown as { DumpDiagnosticLogs?: (reason?: string) => string }).DumpDiagnosticLogs = (reason?: string) => {
      return this.dumpDiagnosticLogs(reason || 'User Diagnostic Command');
    };
    (window as unknown as { DumpErrorQueue?: (reason?: string) => string }).DumpErrorQueue = (reason?: string) => {
      return this.dumpDiagnosticLogs(reason || 'User ErrorQueue Command');
    };
  }

  /**
   * Append an entry to the ring buffer
   */
  private addEntry(
    type: TelemetryEntry['type'],
    message: string,
    details?: Record<string, unknown>,
    stack?: string,
    silent = true
  ) {
    const entry: TelemetryEntry = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      timestamp: new Date().toISOString().substring(11, 23),
      epoch: Date.now(),
      message,
      details,
      stack,
      silent,
    };

    this.buffer.push(entry);

    if (this.buffer.length > this.maxCapacity) {
      this.buffer.shift();
    }
  }

  /**
   * Log unhandled window/promise error and check fatal threshold
   */
  public logUnhandledError(error: unknown, context = 'UnhandledError', extraDetails?: Record<string, unknown>) {
    this.unhandledErrorCount++;
    
    let message = 'Unknown unhandled error';
    let stack: string | undefined;

    if (error instanceof Error) {
      message = error.message;
      stack = error.stack;
    } else if (typeof error === 'string') {
      message = error;
    } else if (error && typeof error === 'object') {
      message = JSON.stringify(error);
    }

    this.addEntry('error', `[${context}] ${message}`, extraDetails, stack, true);

    // If unhandled error count breaches fatal threshold, automatically dump logs
    if (this.unhandledErrorCount >= this.fatalThreshold) {
      this.dumpToConsoleFatal(
        new Error(`Fatal threshold reached (${this.unhandledErrorCount} unhandled errors captured)`),
        'ThresholdExceeded'
      );
    }
  }

  /**
   * Silently record a non-fatal error
   */
  public logSilentError(error: unknown, context = 'General', extraDetails?: Record<string, unknown>) {
    let message = 'Unknown error';
    let stack: string | undefined;

    if (error instanceof Error) {
      message = error.message;
      stack = error.stack;
    } else if (typeof error === 'string') {
      message = error;
    } else if (error && typeof error === 'object') {
      message = JSON.stringify(error);
    }

    this.addEntry('error', `[${context}] ${message}`, extraDetails, stack, true);
  }

  /**
   * Append a user navigation breadcrumb
   */
  public addNavigationNote(note: string, metadata?: Record<string, unknown>) {
    this.addEntry('nav', note, metadata);
  }

  /**
   * Log user action or UI event
   */
  public logActionNote(action: string, metadata?: Record<string, unknown>) {
    this.addEntry('action', action, metadata);
  }

  /**
   * Log a general system event
   */
  public logSystemNote(note: string, metadata?: Record<string, unknown>) {
    this.addEntry('system', note, metadata);
  }

  /**
   * User-requested diagnostic command: dumps complete hidden queue to console
   */
  public dumpDiagnosticLogs(reason = 'User Requested Diagnostic'): string {
    if (typeof console === 'undefined') return 'Console unavailable';

    const sessionDurationMs = Date.now() - this.sessionStartTime;
    const sessionSec = (sessionDurationMs / 1000).toFixed(1);

    console.group(`🔍 [DIAGNOSTIC LOG DUMP] Triggered: ${reason} (Session: ${sessionSec}s)`);
    console.log(`📊 Statistics: Total Buffered=${this.buffer.length}, UnhandledErrors=${this.unhandledErrorCount}/${this.fatalThreshold}`);

    console.groupCollapsed(`📍 Telemetry Breadcrumb Queue (${this.buffer.length} items)`);
    this.buffer.forEach((item, idx) => {
      const typeBadge =
        item.type === 'error' ? '❌ [ERROR]' :
        item.type === 'nav' ? '🧭 [NAV]' :
        item.type === 'action' ? '⚡ [ACTION]' : '⚙️ [SYSTEM]';

      console.log(
        `%c#${idx + 1} [${item.timestamp}] ${typeBadge} ${item.message}`,
        item.type === 'error' ? 'color: #f87171; font-weight: bold;' :
        item.type === 'nav' ? 'color: #38bdf8;' :
        item.type === 'action' ? 'color: #fbbf24;' : 'color: #9ca3af;',
        item.details || '',
        item.stack ? `\nStack: ${item.stack}` : ''
      );
    });
    console.groupEnd();

    console.log('💡 Diagnostics Metadata:', {
      url: typeof window !== 'undefined' ? window.location.href : 'N/A',
      viewport: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'N/A',
      memory: typeof performance !== 'undefined' && (performance as unknown as { memory?: unknown }).memory
        ? (performance as unknown as { memory: unknown }).memory
        : 'N/A',
    });

    console.groupEnd();

    return `Diagnostic dump complete. ${this.buffer.length} events reported in dev console.`;
  }

  /**
   * Retrieve current buffered history
   */
  public getHistory(): readonly TelemetryEntry[] {
    return [...this.buffer];
  }

  /**
   * Clear all buffered items
   */
  public clearQueue() {
    this.buffer = [];
    this.unhandledErrorCount = 0;
  }

  /**
   * Dumps the entire silent telemetry queue to console upon a fatal error or threshold
   */
  public dumpToConsoleFatal(fatalError?: unknown, source = 'ErrorBoundary') {
    const sessionDurationMs = Date.now() - this.sessionStartTime;
    const sessionSec = (sessionDurationMs / 1000).toFixed(1);

    let fatalMsg = 'Unhandled Crash';
    let fatalStack: string | undefined;
    if (fatalError instanceof Error) {
      fatalMsg = fatalError.message;
      fatalStack = fatalError.stack;
    } else if (typeof fatalError === 'string') {
      fatalMsg = fatalError;
    }

    this.addEntry('error', `[FATAL - ${source}] ${fatalMsg}`, { fatal: true }, fatalStack, false);

    if (typeof console === 'undefined') return;

    console.group(`🚨 [FATAL ERROR DUMP] Caught by ${source} (Session active: ${sessionSec}s)`);
    console.warn(`💥 Fatal Exception: ${fatalMsg}`);
    if (fatalStack) {
      console.warn(`📜 Stack Trace:\n${fatalStack}`);
    }

    console.groupCollapsed(`📍 Telemetry Breadcrumb Queue (${this.buffer.length} events logged)`);
    this.buffer.forEach((item, idx) => {
      const typeBadge =
        item.type === 'error' ? '❌ [ERROR]' :
        item.type === 'nav' ? '🧭 [NAV]' :
        item.type === 'action' ? '⚡ [ACTION]' : '⚙️ [SYSTEM]';

      console.log(
        `%c#${idx + 1} [${item.timestamp}] ${typeBadge} ${item.message}`,
        item.type === 'error' ? 'color: #f87171; font-weight: bold;' :
        item.type === 'nav' ? 'color: #38bdf8;' :
        item.type === 'action' ? 'color: #fbbf24;' : 'color: #9ca3af;',
        item.details || '',
        item.stack ? `\nStack: ${item.stack}` : ''
      );
    });
    console.groupEnd();

    console.log('💡 System Info:', {
      url: typeof window !== 'undefined' ? window.location.href : 'N/A',
      viewport: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'N/A',
      totalBuffered: this.buffer.length,
      unhandledErrors: this.unhandledErrorCount,
    });

    console.groupEnd();
  }
}

// Global Singleton Export
export const errorQueue = new ErrorAggregationQueue();
