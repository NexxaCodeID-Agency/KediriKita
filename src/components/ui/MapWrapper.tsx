"use client";

import dynamic from "next/dynamic";

const MapDetail = dynamic(() => import("@/components/ui/MapDetail"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "320px",
        borderRadius: "16px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(212,160,23,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(255,255,255,0.3)",
        fontSize: "14px",
      }}
    >
      Memuat peta...
    </div>
  ),
});

interface MapWrapperProps {
  latitude: number;
  longitude: number;
  name: string;
}

export default function MapWrapper({
  latitude,
  longitude,
  name,
}: MapWrapperProps) {
  return <MapDetail latitude={latitude} longitude={longitude} name={name} />;
}
