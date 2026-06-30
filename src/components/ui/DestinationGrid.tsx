"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useIntersectionObserverAnimation } from "@/hooks/useIntersectionAnimation";
import { cn } from "@/lib/utils";

const PLACEHOLDER_IMG =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%231A1A2E' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' fill='%23d4a017' font-family='serif' font-size='14' text-anchor='middle' dominant-baseline='middle'%3EKediri%3C/text%3E%3C/svg%3E";

function isValidImageSrc(src: string | null | undefined): src is string {
  if (!src) return false;
  if (src.startsWith("/") || src.startsWith("data:")) return true;
  try {
    const u = new URL(src);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

type Destination = {
  id: number;
  slug: string;
  name: string;
  category: string[];
  short_desc: string;
  image: string;
  rating: number;
};

const CATEGORIES = ["Semua", "Wisata Alam", "Kuliner", "Sejarah & Budaya", "Ruang Publik", "Ikon Kota", "Cafe"];

// Helper untuk menormalisasi kategori string/array menjadi Array bersih
function getNormalizedCategories(categoryData: any): string[] {
  if (Array.isArray(categoryData)) {
    return categoryData.map((cat) => String(cat).trim());
  }
  if (typeof categoryData === "string" && categoryData.trim() !== "") {
    return categoryData.split(",").map((cat) => cat.trim());
  }
  return [];
}

function DestinationCard({ item, index }: { item: Destination; index: number }) {
  const ref = useIntersectionObserverAnimation<HTMLDivElement>({
    delay: index * 50,
    rootMargin: "400px",
  });

  const itemCategories = getNormalizedCategories(item.category);

  return (
    <div
      ref={ref}
      className={cn("fade-in-up")}
      style={{ transitionDelay: `${index * 50}ms` }} // Diperbaiki jadi 50ms biar sinkron bosquu
    >
      <Link
        href={`/destinasi/${encodeURIComponent(item.slug ?? "")}`}
        className="group block"
      >
        <div
          className="relative rounded-2xl overflow-hidden border transition-all duration-300"
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.03)",
            willChange: "transform",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.border =
              "1px solid var(--color-emas)";
            (e.currentTarget as HTMLDivElement).style.transform =
              "translateY(-4px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.border =
              "1px solid rgba(255,255,255,0.08)";
            (e.currentTarget as HTMLDivElement).style.transform =
              "translateY(0)";
          }}
        >
          {/* Gambar */}
          <div className="relative w-full h-48 sm:h-56 overflow-hidden">
            <Image
              src={
                isValidImageSrc(item.image)
                  ? item.image
                  : PLACEHOLDER_IMG
              }
              alt={item.name ?? "Destinasi"}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              unoptimized={
                !!item.image && !item.image.includes(".supabase.co")
              }
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(26,26,46,0.85) 0%, transparent 60%)",
              }}
            />
            
            {/* Render Kategori Terpisah Tergabung Koma */}
            <span
              className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs uppercase tracking-widest"
              style={{
                fontFamily: "var(--font-lato)",
                background: "rgba(212,160,23,0.85)",
                color: "#1A1A2E",
              }}
            >
              {itemCategories.length > 0 ? itemCategories.join(", ") : "Umum"}
            </span>

            {typeof item.rating === "number" && item.rating > 0 && (
              <div
                className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full"
                style={{
                  background: "rgba(10,10,26,0.75)",
                  border: "1px solid rgba(212,160,23,0.4)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <span style={{ color: "#f0c040", fontSize: "11px" }}>
                  ★
                </span>
                <span
                  style={{
                    color: "#f0c040",
                    fontSize: "11px",
                    fontFamily: "var(--font-lato)",
                    fontWeight: 600,
                  }}
                >
                  {item.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-4 sm:p-5">
            <h2
              className="text-white text-base sm:text-lg font-semibold leading-snug"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              {item.name}
            </h2>
            <p
              className="text-xs sm:text-sm mt-2 line-clamp-2 leading-relaxed"
              style={{
                color: "rgba(255,255,255,0.5)",
                fontFamily: "var(--font-lato)",
              }}
            >
              {item.short_desc}
            </p>
            <span
              className="inline-block mt-3 sm:mt-4 text-[10px] sm:text-xs tracking-widest uppercase"
              style={{
                color: "var(--color-emas)",
                fontFamily: "var(--font-lato)",
              }}
            >
              Lihat Detail →
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function DestinationGrid({
  destinations,
}: {
  destinations: Destination[];
}) {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();
  const activeCat = activeCategory.toLowerCase();

  const filtered = destinations
    .filter((d) => d.slug)
    .filter((d) => {
      if (activeCategory === "Semua") return true;
      
      // Normalisasi kategori per destinasi ke array lowercase untuk dicek teliti
      const currentCats = getNormalizedCategories(d.category).map(cat => cat.toLowerCase());
      
      // Menguji kecocokan elemen secara mandiri
      return currentCats.includes(activeCat);
    })
    .filter((d) => {
      if (query === "") return true;
      const name = (d.name ?? "").toLowerCase();
      const desc = (d.short_desc ?? "").toLowerCase();
      return name.includes(query) || desc.includes(query);
    });

  return (
    <section className="min-h-screen px-4 sm:px-6 pt-8 sm:pt-10 pb-20 sm:pb-24 max-w-7xl mx-auto">
      {/* Back nav */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 mb-8 sm:mb-10 text-sm transition-colors duration-200"
        style={{ color: "var(--color-emas)", fontFamily: "var(--font-lato)" }}
      >
        <ArrowLeft size={16} />
        Kembali ke Beranda
      </Link>

      {/* Header */}
      <div className="text-center mb-10 sm:mb-12 px-2">
        <p
          className="text-[10px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] mb-2 sm:mb-3 uppercase"
          style={{ color: "var(--color-emas)", fontFamily: "var(--font-lato)" }}
        >
          ✦ Temukan Destinasimu ✦
        </p>
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white"
          style={{
            fontFamily: "var(--font-cinzel)",
            textShadow: "0 2px 16px rgba(0,0,0,0.6)",
          }}
        >
          Jelajahi Kediri
        </h1>
        <p
          className="mt-3 sm:mt-4 text-xs sm:text-sm max-w-md mx-auto leading-relaxed"
          style={{
            color: "rgba(255,255,255,0.55)",
            fontFamily: "var(--font-lato)",
          }}
        >
          Wisata alam, kuliner khas, dan warisan sejarah menanti di setiap sudut
          kota.
        </p>
      </div>

      {/* Search bar */}
      <div className="flex justify-center mb-5 sm:mb-6">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari destinasi..."
            className="w-full px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-sm outline-none"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "white",
              fontFamily: "var(--font-lato)",
              caretColor: "#d4a017",
            }}
            onFocus={(e) => {
              e.currentTarget.style.border = "1px solid rgba(212,160,23,0.6)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = "1px solid rgba(255,255,255,0.12)";
            }}
          />
          {/* Icon search */}
          <span
            className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-sm"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            🔍
          </span>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs tracking-widest uppercase transition-all duration-200"
            style={{
              fontFamily: "var(--font-lato)",
              background:
                activeCategory === cat
                  ? "var(--color-emas)"
                  : "rgba(255,255,255,0.06)",
              color:
                activeCategory === cat ? "#1A1A2E" : "rgba(255,255,255,0.6)",
              border:
                activeCategory === cat
                  ? "1px solid var(--color-emas)"
                  : "1px solid rgba(255,255,255,0.12)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <p
            className="text-lg"
            style={{
              color: "rgba(255,255,255,0.35)",
              fontFamily: "var(--font-lato)",
            }}
          >
            Belum ada destinasi dalam kategori ini.
          </p>
          <button
            onClick={() => setActiveCategory("Semua")}
            className="text-xs tracking-widest uppercase underline underline-offset-4 transition-opacity hover:opacity-70"
            style={{
              color: "var(--color-emas)",
              fontFamily: "var(--font-lato)",
            }}
          >
            Tampilkan semua
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filtered.map((item, i) => (
            <DestinationCard key={item.id} item={item} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}