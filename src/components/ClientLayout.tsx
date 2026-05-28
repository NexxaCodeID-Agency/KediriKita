'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import LoadingScreen from './LoadingScreen';

export const ReadyContext = createContext(false);

export const DeviceContext = createContext({
  isBot: false,
  isMobile: false,
});

export function useReady() {
  return useContext(ReadyContext);
}

export function useDeviceMode() {
  return useContext(DeviceContext);
}

const SESSION_KEY = 'kediri_intro_played';

export default function ClientLayout({
  children,
  isBot = false,
  isMobile = false,
}: {
  children: React.ReactNode;
  isBot: boolean;
  isMobile: boolean;
}) {
  // Selalu mulai false agar server & client HTML cocok (tidak ada hydration mismatch)
  const [ready, setReady] = useState(isBot);

  useEffect(() => {
    if (isBot) return;
    // Setelah mount (client only) — cek apakah intro sudah pernah ditampilkan.
    // Pola "lazy client-only sync" yang disengaja: state awal harus false di server
    // agar HTML cocok, lalu di-sync ke true di client kalau session menandai.
    if (sessionStorage.getItem(SESSION_KEY) === '1') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReady(true);
    }
  }, [isBot]);

  const handleDone = () => {
    sessionStorage.setItem(SESSION_KEY, '1');
    setReady(true);
  };

  return (
    <>
      {!ready && !isBot && <LoadingScreen onDone={handleDone} />}
      <DeviceContext.Provider value={{ isBot, isMobile }}>
        <ReadyContext.Provider value={ready}>
          {children}
        </ReadyContext.Provider>
      </DeviceContext.Provider>
    </>
  );
}
