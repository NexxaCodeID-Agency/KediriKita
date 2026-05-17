"use client";
import { ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

const MapCanvas = dynamic(() => import("@/components/three/MapCanvas"), {
  ssr: false,
});
export default function MapPage() {
  return (
    <main className="w-full h-screen relative bg-[#060610] overflow-hidden">
            <Link
              href="/"
              className="inline-flex items-center gap-2 mb-8 sm:mb-10 text-sm transition-colors duration-200"
              style={{ color: "var(--color-emas)", fontFamily: "var(--font-lato)" }}
            >
              <ArrowLeft size={16} />
              Kembali ke Beranda
            </Link>
      <MapCanvas />
    </main>
  );
}
