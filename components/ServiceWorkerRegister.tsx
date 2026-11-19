'use client';

import { useEffect } from 'react';
import { triggerToast } from '@/context/ToastContext';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    // Proactively evict legacy v1 caches that cached stale HTML/RSC responses
    if ('caches' in window) {
      caches
        .keys()
        .then((keys) => {
          keys.forEach((key) => {
            if (key.endsWith('-v1') || key === 'hyperbook-nodes-metadata-cache') {
              caches.delete(key);
            }
          });
        })
        .catch(() => {});
    }

    navigator.serviceWorker
      .register('/sw.js', { scope: '/', updateViaCache: 'none' })
      .then((registration) => {
        registration.update().catch(() => {});
        return navigator.serviceWorker.ready;
      })
      .then(() => {
        try {
          if (!sessionStorage.getItem('sw_toast_shown_v2')) {
            sessionStorage.setItem('sw_toast_shown_v2', '1');
            triggerToast('Offline Cache Initialized', 'system', 'Tactical node data available for field use');
          }
        } catch {
          // Ignore storage restrictions
        }
      })
      .catch(() => {
        // Ignore service worker registration errors in restricted iframe contexts
      });
  }, []);

  return null;
}

