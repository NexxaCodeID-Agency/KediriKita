'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { useParams } from 'next/navigation';
import LoadingScreen from './LoadingScreen';
import Footer, { DestinationLink } from '@/components/sections/Footer';
import LanguageSwitcher from '@/components/sections/LanguageSwitcher';
import { getLocale } from '@/lib/i18n';
import { useHistoryNavigation } from '@/hooks/useHistoryNavigation';

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

  useHistoryNavigation();

  return (
    <>
      {!ready && <LoadingScreen onDone={handleDone} />}
      {ready && <LanguageSwitcher />}
      <ReadyContext.Provider value={ready}>
        {/* Bungkus layout utama lu */}
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow">
            {children}
          </div>
          
          {/* 3. Panggil Footer di sini dan oper datanya langsung bosquu! */}
          <Footer dataWisata={dataWisata} dataKuliner={dataKuliner} />
        </div>
      </ReadyContext.Provider>
    </>
  );
}