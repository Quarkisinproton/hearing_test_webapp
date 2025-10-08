"use client";

import React, {useEffect, useState} from 'react';

const PWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler as EventListener);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler as EventListener);
    };
  }, []);

  const onInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    console.log('PWA install choice:', choice);
    setDeferredPrompt(null);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <button
      onClick={onInstallClick}
      style={{
        position: 'fixed',
        right: 20,
        bottom: 90,
        padding: '10px 14px',
        borderRadius: 8,
        background: '#0ea5a4',
        color: '#fff',
        border: 'none',
        zIndex: 9999,
      }}
    >
      Install App
    </button>
  );
};

export default PWAInstallButton;
