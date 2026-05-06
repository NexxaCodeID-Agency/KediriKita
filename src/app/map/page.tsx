"use client";
import dynamic from "next/dynamic";

const MapCanvas = dynamic(() => import("@/components/three/MapCanvas"), {
  ssr: false,
});
export default function MapPage() {
  return (
    <main className="w-full h-screen relative bg-[#060610] overflow-hidden">
      <MapCanvas />
    </main>
  );
}
