'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import LoadingScreen from './LoadingScreen';

export const ReadyContext = createContext(false);

export function useReady() {
  return useContext(ReadyContext);
}

const SESSION_KEY = 'kediri_intro_played';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // Selalu mulai false agar server & client HTML cocok (tidak ada hydration mismatch)
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Setelah mount (client only) — cek apakah intro sudah pernah ditampilkan.
    // Pola "lazy client-only sync" yang disengaja: state awal harus false di server
    // agar HTML cocok, lalu di-sync ke true di client kalau session menandai.
    if (sessionStorage.getItem(SESSION_KEY) === '1') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReady(true);
    }
  }, []);

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
