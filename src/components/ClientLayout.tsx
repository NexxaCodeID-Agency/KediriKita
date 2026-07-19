'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { useParams } from 'next/navigation';
import LoadingScreen from './LoadingScreen';
import Footer, { DestinationLink } from '@/components/sections/Footer';
import LanguageSwitcher from '@/components/sections/LanguageSwitcher';
import { getLocale } from '@/lib/i18n';


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
  
  const [ready, setReady] = useState(false);
  const params = useParams();
  const lang = getLocale(params?.lang as string | undefined);

  useEffect(() => {
    document.documentElement.lang = lang === 'cn' ? 'zh' : lang;
  }, [lang]);

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
    <ReadyContext.Provider value={ready}>
      {/* Loading screen sebagai overlay dekoratif — TIDAK memblokir konten di belakangnya */}
      {!ready && <LoadingScreen onDone={handleDone} />}

      <LanguageSwitcher />

      {/* Konten selalu di-render supaya LCP (h1 KOTA KEDIRI) langsung visible */}
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          {children}
        </div>
        
        <Footer dataWisata={dataWisata} dataKuliner={dataKuliner} />
      </div>
    </ReadyContext.Provider>
  );
}