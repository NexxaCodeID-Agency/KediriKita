'use client';

import { useState, createContext, useContext } from 'react';
import LoadingScreen from './LoadingScreen';

export const ReadyContext = createContext(false);

export function useReady() {
  return useContext(ReadyContext);
}

const SESSION_KEY = 'kediri_intro_played';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // Cek sessionStorage saat inisialisasi state — sudah pernah lihat intro di sesi ini?
  const [ready, setReady] = useState(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(SESSION_KEY) === '1';
  });

  const handleDone = () => {
    sessionStorage.setItem(SESSION_KEY, '1');
    setReady(true);
  };

  return (
    <>
      {!ready && <LoadingScreen onDone={handleDone} />}
      <ReadyContext.Provider value={ready}>
        {children}
      </ReadyContext.Provider>
    </>
  );
}
