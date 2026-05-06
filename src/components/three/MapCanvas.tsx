"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/lib/supabase";

type Destination = {
  slug: string;
  name: string;
  category: string;
  short_desc: string;
  image: string;
  latitude: number;
  longitude: number;
};

export default function MapCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    // Reset container kalau sudah ada map sebelumnya
    const container = el as HTMLElement & { _leaflet_id?: number };
    if (container._leaflet_id) {
      container._leaflet_id = undefined;
    }

    // Init map — center di Kediri
    const map = L.map(el, {
      center: [-7.82, 112.08],
      zoom: 10,
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: false,
    });

    // Tile layer gelap
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      { attribution: "© CartoDB" },
    ).addTo(map);

    // Render GeoJSON batas Kediri
    fetch("/data/export.geojson")
      .then((res) => res.json())
      .then((geoData) => {
        L.geoJSON(geoData, {
          style: (feature) => {
            const isKota = feature?.properties?.name?.includes("Kota");
            return {
              fillColor: isKota ? "#d4a017" : "#1e3a6e",
              fillOpacity: isKota ? 0.25 : 0.2,
              color: isKota ? "#f0c040" : "#4a7acc",
              weight: 1.5,
            };
          },
        }).addTo(map);
      });

    // Label Kabupaten
    L.marker([-7.72, 112.08], {
      icon: L.divIcon({
        className: "",
        html: `<div style="
      color: #4a7acc;
      font-size: 11px;
      font-weight: bold;
      letter-spacing: 3px;
      text-transform: uppercase;
      text-shadow: 0 0 8px #000, 0 0 4px #000;
      white-space: nowrap;
    ">KABUPATEN KEDIRI</div>`,
        iconAnchor: [60, 0],
      }),
    }).addTo(map);

    // Label Kota
    L.marker([-7.82, 112.01], {
      icon: L.divIcon({
        className: "",
        html: `<div style="
      color: #f0c040;
      font-size: 10px;
      font-weight: bold;
      letter-spacing: 2px;
      text-transform: uppercase;
      text-shadow: 0 0 8px #000, 0 0 4px #000;
      white-space: nowrap;
    ">KOTA KEDIRI</div>`,
        iconAnchor: [35, 0],
      }),
    }).addTo(map);

    // Fetch destinasi dari Supabase → tambahin marker
    supabase
      .from("destinations")
      .select("slug, name, category, short_desc, image, latitude, longitude")
      .then(({ data }) => {
        if (!data) return;

        data.forEach((dest: Destination) => {
          if (!dest.latitude || !dest.longitude) return;

          // Custom marker emas
          const icon = L.divIcon({
            className: "",
            html: `
  <div style="
    width: 18px;
    height: 18px;
    background: radial-gradient(circle, #f0c040, #d4a017);
    border: 2px solid #f0c040;
    border-radius: 50%;
    box-shadow: 0 0 12px rgba(212,160,23,1), 0 0 24px rgba(212,160,23,0.5);
    cursor: pointer;
    transition: transform 0.2s;
  "></div>
`,
            iconSize: [18, 18],
            iconAnchor: [9, 9],
          });

          // Popup konten
          const popupContent = `
  <div style="width:200px;background:#0a0a1a;border:1px solid rgba(212,160,23,0.4);border-radius:12px;overflow:hidden;font-family:sans-serif;">
    <img src="${dest.image}" alt="${dest.name}" style="width:100%;height:110px;object-fit:cover;display:block;" />
    <div style="padding:10px 12px;">
      <p style="font-size:10px;color:#d4a017;text-transform:uppercase;letter-spacing:2px;margin:0 0 4px 0;">${dest.category}</p>
      <p style="font-size:14px;font-weight:bold;color:white;margin:0 0 6px 0;">${dest.name}</p>
      <p style="font-size:11px;color:rgba(255,255,255,0.5);margin:0 0 10px 0;line-height:1.4;">${dest.short_desc}</p>
      <a href="/destinasi/${dest.slug}" style="display:inline-block;font-size:10px;color:#1a1a2e;background:#d4a017;padding:5px 12px;border-radius:20px;text-decoration:none;text-transform:uppercase;letter-spacing:1px;font-weight:bold;">Lihat Detail →</a>
    </div>
  </div>
`;

          L.marker([dest.latitude, dest.longitude], { icon })
            .addTo(map)
            .bindPopup(popupContent, {
              maxWidth: 220,
              className: "custom-popup",
            });
        });
      });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "100%",
        filter: "brightness(0.95) saturate(0.9)",
      }}
    />
  );
}
