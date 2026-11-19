'use client';

import React from 'react';
import { WifiOff, Sparkles } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#141510] border-2 border-amber-500/80 text-amber-300 shadow-[0_0_20px_rgba(234,179,8,0.3)] text-xs font-mono animate-in slide-in-from-bottom-5 duration-200">
      <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
      <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
      <div>
        <span className="font-bold text-stone-100 block">Offline Mode Active</span>
        <span className="text-[10px] text-amber-200/80 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          131+ Blueprints Cached · Read. Code. Earn.
        </span>
      </div>
    </div>
  );
};
