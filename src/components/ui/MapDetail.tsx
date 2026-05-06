"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapDetailProps {
  latitude: number;
  longitude: number;
  name: string;
}

export default function MapDetail({
  latitude,
  longitude,
  name,
}: MapDetailProps) {
  useEffect(() => {
    // Hapus map lama kalau ada (penting buat Next.js!)
    const container = L.DomUtil.get("map-detail");
    if (
      container &&
      (container as HTMLElement & { _leaflet_id?: number })._leaflet_id
    ) {
      (container as HTMLElement & { _leaflet_id?: number })._leaflet_id =
        undefined;
    }

    const map = L.map("map-detail", {
      center: [latitude, longitude],
      zoom: 14,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    // Tile layer — pakai OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Custom marker emas
    const icon = L.divIcon({
      className: "",
      html: `
        <div style="
          width: 20px;
          height: 20px;
          background: #d4a017;
          border: 3px solid #f0c040;
          border-radius: 50%;
          box-shadow: 0 0 12px rgba(212,160,23,0.8);
        "></div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    // Marker + popup
    L.marker([latitude, longitude], { icon })
      .addTo(map)
      .bindPopup(
        `
        <div style="
          font-family: sans-serif;
          font-size: 13px;
          font-weight: bold;
          color: #1a1a2e;
          padding: 4px 8px;
        ">
          📍 ${name}
        </div>
      `,
      )
      .openPopup();

    return () => {
      map.remove();
    };
  }, [latitude, longitude, name]);

return (
  <div
    style={{ position: "relative", borderRadius: "16px", overflow: "hidden" }}
  >
    <div
      id="map-detail"
      style={{
        width: "100%",
        height: "320px",
        borderRadius: "16px",
        border: "1px solid rgba(212,160,23,0.3)",
        overflow: "hidden",
        zIndex: 0,
        filter: "invert(90%) hue-rotate(180deg) brightness(0.85) saturate(0.7)",
      }}
    />
  </div>
);
}
