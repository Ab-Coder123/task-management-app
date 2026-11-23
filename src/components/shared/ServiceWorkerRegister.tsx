'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    // Avoid registering web SW inside native Electron shell if custom bridge is present
    if ((window as { taskSaaSDesktop?: { isDesktop?: boolean } }).taskSaaSDesktop?.isDesktop) {
      return;
    }

    const register = () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .catch(() => {
          // Silently ignore SW registration issues in unsupported or private browsing modes
        });
    };

    if (document.readyState === 'complete') {
      register();
    } else {
      window.addEventListener('load', register, { once: true });
    }
  }, []);

  return null;
}
