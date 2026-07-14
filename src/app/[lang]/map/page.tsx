"use client";
import { ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { localizedPath } from "@/lib/i18n";

const MapCanvas = dynamic(() => import("@/components/three/MapCanvas"), {
  ssr: false,
});

export default function MapPage() {
  const { lang, t } = useTranslation();

  return (
    <main className="w-full h-screen relative bg-[#060610] overflow-hidden">
      <Link
        href={localizedPath(lang)}
        className="absolute top-6 left-6 z-50 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors duration-200 backdrop-blur-md bg-black/40 hover:bg-black/60 border border-white/10"
        style={{ color: "var(--color-emas)", fontFamily: "var(--font-lato)" }}
      >
        <ArrowLeft size={16} />
        {t.backToHome}
      </Link>
      <MapCanvas lang={lang} />
    </main>
  );
}
