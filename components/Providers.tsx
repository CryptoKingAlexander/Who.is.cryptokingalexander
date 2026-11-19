'use client';

import React, { Component, ReactNode } from 'react';
import { RenderCoordinationProvider } from '@/context/RenderCoordinationContext';
import { NodeDeckProvider } from '@/context/NodeDeckContext';
import { TacticalThemeProvider } from '@/context/TacticalThemeContext';
import { SecurityAccessProvider } from '@/context/SecurityAccessContext';
import { TelemetryProvider } from '@/context/TelemetryContext';
import { PrefetchProvider } from '@/context/PrefetchContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ScriptRecoverySystem } from '@/components/ScriptRecoverySystem';
import { SessionKeepAliveGuard } from '@/components/SessionKeepAliveGuard';
import { preloadAppDataToLocalStore } from '@/lib/localStorePreloader';
import { JargonProvider } from '@/components/JargonDiscovery';
import { StaggeredHydration } from '@/components/StaggeredHydration';
import { ToastProvider } from '@/context/ToastContext';
import { errorQueue } from '@/lib/errorAggregationQueue';
import { stackResilienceEngine } from '@/lib/stackResilienceEngine';

interface IsolatorProps {
  providerName: string;
  children: ReactNode;
  fallbackChildren: ReactNode;
}

interface IsolatorState {
  hasProviderFault: boolean;
}

class ProviderFaultIsolator extends Component<IsolatorProps, IsolatorState> {
  constructor(props: IsolatorProps) {
    super(props);
    this.state = { hasProviderFault: false };
  }

  static getDerivedStateFromError(): IsolatorState {
    return { hasProviderFault: true };
  }

  componentDidCatch(error: Error) {
    errorQueue.logSilentError(error, `ProviderFaultIsolator:${this.props.providerName}`);
    stackResilienceEngine.recordResolutionEvent(
      11,
      'FALLBACK_ACTIVE',
      `Isolated ${this.props.providerName} -> Default Context Engaged`,
      1
    );
  }

  render() {
    if (this.state.hasProviderFault) {
      return <>{this.props.fallbackChildren}</>;
    }
    return <>{this.props.children}</>;
  }
}

function RootInitializationGuard({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      preloadAppDataToLocalStore()
        .then((summary) => {
          stackResilienceEngine.recordResolutionEvent(
            12,
            summary.success ? 'VERIFIED' : 'FALLBACK_ACTIVE',
            `${summary.totalNodesCount.toLocaleString()} Nodes | ${summary.equationsPrerendered} KaTeX Warm (${summary.durationMs}ms)`,
            summary.durationMs
          );
        })
        .catch((err) => {
          errorQueue.logSilentError(err, 'RootInitializationGuard');
          stackResilienceEngine.recordResolutionEvent(
            12,
            'FALLBACK_ACTIVE',
            'Emergency Procedural Dataset Fallback Armed',
            2
          );
        });
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const coreTree = (
    <NodeDeckProvider>
      <PrefetchProvider>
        <JargonProvider>
          <SessionKeepAliveGuard>
            <RootInitializationGuard>
              <StaggeredHydration>{children}</StaggeredHydration>
            </RootInitializationGuard>
          </SessionKeepAliveGuard>
        </JargonProvider>
      </PrefetchProvider>
    </NodeDeckProvider>
  );

  return (
    <ScriptRecoverySystem>
      <ErrorBoundary fallbackTitle="Generic Tactical Pipeline Recovery">
        <ProviderFaultIsolator providerName="ToastProvider" fallbackChildren={coreTree}>
          <ToastProvider>
            <ProviderFaultIsolator providerName="RenderCoordinationProvider" fallbackChildren={coreTree}>
              <RenderCoordinationProvider>
                <ProviderFaultIsolator providerName="TelemetryProvider" fallbackChildren={coreTree}>
                  <TelemetryProvider>
                    <ProviderFaultIsolator providerName="TacticalThemeProvider" fallbackChildren={coreTree}>
                      <TacticalThemeProvider>
                        <ProviderFaultIsolator providerName="SecurityAccessProvider" fallbackChildren={coreTree}>
                          <SecurityAccessProvider>{coreTree}</SecurityAccessProvider>
                        </ProviderFaultIsolator>
                      </TacticalThemeProvider>
                    </ProviderFaultIsolator>
                  </TelemetryProvider>
                </ProviderFaultIsolator>
              </RenderCoordinationProvider>
            </ProviderFaultIsolator>
          </ToastProvider>
        </ProviderFaultIsolator>
      </ErrorBoundary>
    </ScriptRecoverySystem>
  );
}
