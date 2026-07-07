"use client";
import dynamic from "next/dynamic";
import LazySection from "@/components/ui/LazySection";

// 🟢 Hero tetep pakai dynamic karena paling atas sendiri (biar FCP kenceng)
const HeroSection = dynamic(() => import("./sections/HeroSection"), {
  loading: () => <div className="h-[100dvh] bg-[#080812]" />, // Kasih loading background gelap biar ga jank
});

// 🟢 Untuk section yang dibungkus LazySection, import biasa aja biar ga double delay network request
import KediriSection from "./sections/KediriSection";
import CardSection from "./sections/CardSection";
import Carauser from "./sections/Carauser";
import PetaSection from "./sections/peta";

// Chartline tetep dynamic ssr:false karena library chart biasanya butuh window object murni di client
const Chartline = dynamic(() => import("./sections/chartline"), { 
  ssr: false,
  loading: () => <div className="h-[450px] bg-transparent" />
});

export default function Home() {
  return (
    <main className="w-full relative overflow-x-hidden bg-[#080812]">
      {/* 1. Hero Screen */}
      <HeroSection />

      {/* 2. Seputar Kediri */}
      <LazySection minHeight="100dvh">
        <KediriSection />
      </LazySection>

      {/* 3. Grid Card Destinasi */}
      <LazySection minHeight="100dvh">
        <CardSection />
      </LazySection>

      {/* 4. Carousel Wisata */}
      <LazySection minHeight="100dvh">
        <Carauser />
      </LazySection>

      {/* 5. Statistik / Chart — MinHeight disesuaikan dengan tinggi asli chart lu biar gak jank */}
      <LazySection minHeight="450px">
        <Chartline />
      </LazySection>

      {/* 6. Peta Interaktif Kediri */}
      <LazySection minHeight="600px">
        <PetaSection />
      </LazySection>

    </main>
  );
}