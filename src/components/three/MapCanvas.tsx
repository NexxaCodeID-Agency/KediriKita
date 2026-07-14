"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/lib/supabase";
import { getLocale, localizedPath } from "@/lib/i18n";
import { translations } from "@/lib/translations";
import { getTranslationData } from "@/lib/db";

type Destination = {
  id: string;
  slug: string;
  name: string;
  category: string[] | string;
  short_desc: string;
  image: string;
  latitude: number;
  longitude: number;
};

type Props = {
  scrollZoom?: boolean;
  fitPadding?: number;
  showMarkers?: boolean;
  lang?: string;
};

const CATEGORY_COLORS: Record<string, { base: string; glow: string }> = {
  "wisata alam":      { base: "#22c55e", glow: "#86efac" },
  "kuliner":          { base: "#f97316", glow: "#fdba74" },
  "sejarah & budaya": { base: "#d4a017", glow: "#f0c040" },
  "ruang publik":     { base: "#06b6d4", glow: "#67e8f9" },
  "ikon kota":        { base: "#a855f7", glow: "#d8b4fe" },
  "cafe":            { base: "#ec4899", glow: "#f9a8d4" },
};
const DEFAULT_COLOR = { base: "#d4a017", glow: "#f0c040" };


const CATEGORY_KEY_MAP: Record<string, string> = {
  "wisata alam": "Wisata Alam",
  "kuliner": "Kuliner",
  "sejarah & budaya": "Sejarah & Budaya",
  "ruang publik": "Ruang Publik",
  "ikon kota": "Ikon Kota",
  "cafe": "Cafe",
};

function getCategoryColor(category: string[] | string | null | undefined) {
  const arr = Array.isArray(category)
    ? category
    : typeof category === "string"
      ? category.split(",").map((c) => c.trim())
      : [];
  if (arr.length === 0) return DEFAULT_COLOR;
  return CATEGORY_COLORS[arr[0].toLocaleLowerCase().trim()] ?? DEFAULT_COLOR;
}

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function MapCanvas({
  scrollZoom = true,
  fitPadding = 30,
  showMarkers = true,
  lang: langProp,
}: Props) {
  const locale = getLocale(langProp);
  const t = translations[locale];
  const mountRef = useRef<HTMLDivElement>(null);
  
  // 1. Tambahkan state untuk menyimpan raw data dari Supabase & kategori yang dipilih
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 2. Gunakan useRef untuk menyimpan instance map dan markerGroup agar bisa diakses lintas render/effect
  const mapRef = useRef<L.Map | null>(null);
  const markerGroupRef = useRef<L.LayerGroup | null>(null);

  // EFFECT 1: Inisialisasi Peta & Fetch Data Supabase (Hanya berjalan sekali saat mount)
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    let isMounted = true; 

    const container = el as HTMLElement & { _leaflet_id?: number };
    if (container._leaflet_id) {
      container._leaflet_id = undefined;
    }

    const map = L.map(el, {
      zoomControl: true,
      scrollWheelZoom: scrollZoom,
      attributionControl: false,
    });
    mapRef.current = map;

    const kediriBounds = L.latLngBounds([-8.0500, 111.9000], [-7.6500, 112.2000]);
    map.fitBounds(kediriBounds, { padding: [fitPadding, fitPadding] });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      { attribution: "© CartoDB" }
    ).addTo(map);

    // LayerGroup khusus untuk menampung marker agar mudah dihapus-tulis ulang
    const markerGroup = L.layerGroup().addTo(map);
    markerGroupRef.current = markerGroup;

    // Render GeoJSON
    fetch("/data/export.geojson")
      .then((res) => res.json())
      .then((geoData) => {
        if (!isMounted || !mapRef.current) return;
        L.geoJSON(geoData, {
          filter: (feature) => feature.geometry.type !== "Point",
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
      })
      .catch(console.error);

    // Label Wilayah
    L.marker([-7.72, 112.08], {
      icon: L.divIcon({
        className: "",
        html: `<div style="color: #4a7acc; font-size: 11px; font-weight: bold; letter-spacing: 3px; text-transform: uppercase; text-shadow: 0 0 8px #000; white-space: nowrap;">KABUPATEN KEDIRI</div>`,
        iconAnchor: [60, 0],
      }),
    }).addTo(map);

    L.marker([-7.82, 112.01], {
      icon: L.divIcon({
        className: "",
        html: `<div style="color: #f0c040; font-size: 10px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; text-shadow: 0 0 8px #000; white-space: nowrap;">KOTA KEDIRI</div>`,
        iconAnchor: [35, 0],
      }),
    }).addTo(map);

    // Fetch data Supabase dan simpan ke state
    if (showMarkers) {
      supabase
        .from("destinations")
        .select("id, slug, name, category, short_desc, image, latitude, longitude")
        .then(async ({ data, error }) => {
          if (!isMounted) return;
          if (error) {
            console.error("Error fetching destinations:", error);
            return;
          }
          if (!data) return;

          if (locale === "id") {
            setDestinations(data);
            return;
          }

          const translated = await Promise.all(
            data.map(async (dest) => {
              const tr = await getTranslationData(dest.id, "destinations", locale);
              return tr ? { ...dest, ...tr } : dest;
            })
          );

          if (isMounted) setDestinations(translated);
        });
    }

    return () => {
      isMounted = false;
      map.remove();
    };
  }, [scrollZoom, fitPadding, showMarkers, locale]);

  // EFFECT 2: Render & Filter Marker (Berjalan setiap kali state `destinations` atau `selectedCategory` berubah)
  useEffect(() => {
    const markerGroup = markerGroupRef.current;
    if (!markerGroup) return;

    // Bersihkan semua marker lama sebelum menggambar yang baru
    markerGroup.clearLayers();

    // Filter data berdasarkan kategori yang aktif di state
    const filteredDestinations = selectedCategory
      ? destinations.filter((dest) => {if (!dest.category || !Array.isArray(dest.category)) return false;
        return dest.category.some((cat) => cat.toLowerCase().trim() === selectedCategory.toLowerCase().trim());
      })
      : destinations;

    filteredDestinations.forEach((dest) => {
      if (!dest.latitude || !dest.longitude) return;

      const { base, glow } = getCategoryColor(dest.category);
      const baseRgba = hexToRgba(base, 1);
      const baseRgbaSoft = hexToRgba(base, 0.5);

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
          "></div>
        `,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      const categoryArray = Array.isArray(dest.category)
        ? dest.category
        : typeof dest.category === "string"
          ? dest.category.split(",").map((c: string) => c.trim())
          : [];

      const translatedCategories = categoryArray.map(
        (cat) => translations[locale].categories[cat as keyof typeof translations["id"]["categories"]] ?? cat
      );

      const popupContent = `
        <div style="width:200px;background:#0a0a1a;border:1px solid ${hexToRgba(base, 0.4)};border-radius:12px;overflow:hidden;font-family:sans-serif;">
          <img src="${dest.image}" alt="${dest.name}" style="width:100%;height:110px;object-fit:cover;display:block;" />
          <div style="padding:10px 12px;">
            <p style="font-size:10px;color:${base};text-transform:uppercase;letter-spacing:2px;margin:0 0 4px 0;">${translatedCategories.join(',')}</p>
            <p style="font-size:14px;font-weight:bold;color:white;margin:0 0 6px 0;">${dest.name}</p>
            <p style="font-size:11px;color:rgba(255,255,255,0.5);margin:0 0 10px 0;line-height:1.4;">${dest.short_desc}</p>
            <a href="${localizedPath(locale, `/destinasi/${dest.slug}`)}" style="display:inline-block;font-size:10px;color:#1a1a2e;background:${base};padding:5px 12px;border-radius:20px;text-decoration:none;text-transform:uppercase;letter-spacing:1px;font-weight:bold;">${t.viewDetail} →</a>
          </div>
        </div>
      `;

      // Masukkan marker ke dalam markerGroup, bukan langsung ke map
      L.marker([dest.latitude, dest.longitude], { icon })
        .addTo(markerGroup)
        .bindPopup(popupContent, {
          maxWidth: 220,
          className: "custom-popup",
        });
    });
  }, [destinations, selectedCategory, locale, t.viewDetail]);

  // Fungsi toggle filter kategori
  const handleCategoryClick = (category: string) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  };

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
          }}
        >
          <div
            style={{
              fontSize: 9,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.5)",
              marginBottom: 8,
              display: "flex",
              justifyContent: "between",
              alignItems: "center"
            }}
          >
            <span>{translations[locale].kategori}</span>
            {selectedCategory && (
              <button 
                onClick={() => setSelectedCategory(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#f97316",
                  cursor: "pointer",
                  fontSize: 9,
                  marginLeft: "auto",
                  padding: 0
                }}
              >
                {translations[locale].reset}
              </button>
            )}
          </div>
          {Object.entries(CATEGORY_COLORS).map(([key, { base, glow }]) => {
            const isSelected = selectedCategory === key;
            const isAnySelected = selectedCategory !== null;
            
            return (
              <div
                key={key}
                onClick={() => handleCategoryClick(key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 4,
                  cursor: "pointer",
                  padding: "4px 6px",
                  borderRadius: "6px",
                  background: isSelected ? "rgba(255,255,255,0.08)" : "transparent",
                  opacity: isAnySelected && !isSelected ? 0.35 : 1,
                  transition: "all 0.2s ease",
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
                <span style={{ textTransform: "capitalize" }}>
                  {translations[locale].categories[CATEGORY_KEY_MAP[key] as keyof typeof translations["id"]["categories"]] ?? key}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}