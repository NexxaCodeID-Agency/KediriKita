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
type Props = {
  scrollZoom?: boolean;
  fitPadding?: number;
  showMarkers?: boolean;
};

const CATEGORY_COLORS: Record<string, { base: string; glow: string }> = {
  "wisata alam":      { base: "#22c55e", glow: "#86efac" },
  "kuliner":          { base: "#f97316", glow: "#fdba74" },
  "sejarah & budaya": { base: "#d4a017", glow: "#f0c040" },
  "ruang publik":     { base: "#06b6d4", glow: "#67e8f9" },
  "ikon kota":        { base: "#a855f7", glow: "#d8b4fe" },
  "caffe":            { base: "#ec4899", glow: "#f9a8d4" },
};
const DEFAULT_COLOR = { base: "#d4a017", glow: "#f0c040" };

function getCategoryColor(category: string) {
  return CATEGORY_COLORS[category.toLowerCase().trim()] ?? DEFAULT_COLOR;
}

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function MapCanvas({scrollZoom = true, fitPadding = 30, showMarkers = true}: Props) {
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
      zoomControl: true,
      scrollWheelZoom: scrollZoom,
      attributionControl: false,
    });

    const kediriBounds = L.latLngBounds(
        [-8.0500, 111.9000],
        [-7.6500, 112.2000],
    )
    map.fitBounds(kediriBounds, { padding: [fitPadding, fitPadding] });

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

    if (showMarkers) {
      supabase
        .from("destinations")
        .select("slug, name, category, short_desc, image, latitude, longitude")
        .then(({ data }) => {
          if (!data) return;
  
          data.forEach((dest: Destination) => {
            if (!dest.latitude || !dest.longitude) return;

            const { base, glow } = getCategoryColor(dest.category);
            const baseRgba = hexToRgba(base, 1);
            const baseRgbaSoft = hexToRgba(base, 0.5);

            // Custom marker per kategori
            const icon = L.divIcon({
              className: "",
              html: `
    <div style="
      width: 18px;
      height: 18px;
      background: radial-gradient(circle, ${glow}, ${base});
      border: 2px solid ${glow};
      border-radius: 50%;
      box-shadow: 0 0 12px ${baseRgba}, 0 0 24px ${baseRgbaSoft};
      cursor: pointer;
      transition: transform 0.2s;
    "></div>
  `,
              iconSize: [18, 18],
              iconAnchor: [9, 9],
            });

            // Popup konten
            const popupContent = `
    <div style="width:200px;background:#0a0a1a;border:1px solid ${hexToRgba(base, 0.4)};border-radius:12px;overflow:hidden;font-family:sans-serif;">
      <img src="${dest.image}" alt="${dest.name}" style="width:100%;height:110px;object-fit:cover;display:block;" />
      <div style="padding:10px 12px;">
        <p style="font-size:10px;color:${base};text-transform:uppercase;letter-spacing:2px;margin:0 0 4px 0;">${dest.category}</p>
        <p style="font-size:14px;font-weight:bold;color:white;margin:0 0 6px 0;">${dest.name}</p>
        <p style="font-size:11px;color:rgba(255,255,255,0.5);margin:0 0 10px 0;line-height:1.4;">${dest.short_desc}</p>
        <a href="/destinasi/${dest.slug}" style="display:inline-block;font-size:10px;color:#1a1a2e;background:${base};padding:5px 12px;border-radius:20px;text-decoration:none;text-transform:uppercase;letter-spacing:1px;font-weight:bold;">Lihat Detail →</a>
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
    }


    return () => {
      map.remove();
    };
  }, [scrollZoom, fitPadding, showMarkers]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div
        ref={mountRef}
        style={{
          width: "100%",
          height: "100%",
          filter: "brightness(0.95) saturate(0.9)",
        }}
      />
      {showMarkers && (
        <div
          style={{
            position: "absolute",
            bottom: 16,
            right: 16,
            zIndex: 1000,
            background: "rgba(10,10,26,0.75)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            padding: "10px 12px",
            fontFamily: "sans-serif",
            color: "white",
            fontSize: 11,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              fontSize: 9,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.5)",
              marginBottom: 8,
            }}
          >
            Kategori
          </div>
          {Object.entries(CATEGORY_COLORS).map(([key, { base, glow }]) => (
            <div
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${glow}, ${base})`,
                  border: `1.5px solid ${glow}`,
                  boxShadow: `0 0 6px ${hexToRgba(base, 0.8)}`,
                  display: "inline-block",
                }}
              />
              <span style={{ textTransform: "capitalize" }}>{key}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
