'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import LoadingScreen from './LoadingScreen';
import Footer, { DestinationLink } from '@/app/sections/Footer'; 
import LazySection from "@/components/ui/LazySection";

export const ReadyContext = createContext(false);

export function useReady() {
  return useContext(ReadyContext);
}

const SESSION_KEY = 'kediri_intro_played';

// 1. Definisikan interface props baru buat nampung data dari database
interface ClientLayoutProps {
  children: React.ReactNode;
  dataWisata: DestinationLink[];
  dataKuliner: DestinationLink[];
}

export default function ClientLayout({ 
  children, 
  dataWisata, 
  dataKuliner 
}: ClientLayoutProps) { // 2. Terapkan interface props di sini
  
  // Selalu mulai false agar server & client HTML cocok (tidak ada hydration mismatch)
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Setelah mount (client only) — cek apakah intro sudah pernah ditampilkan.
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
        {/* Bungkus layout utama lu */}
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow">
            {children}
          </div>
          
          
          <LazySection minHeight="300px">
            <Footer dataWisata={dataWisata} dataKuliner={dataKuliner} />
          </LazySection>
        </div>
      </ReadyContext.Provider>
    </>
  );
}