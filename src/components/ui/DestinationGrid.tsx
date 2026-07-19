"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useIntersectionObserverAnimation } from "@/hooks/useIntersectionAnimation";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { localizedPath } from "@/lib/i18n";

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
  id: string;
  slug: string;
  name: string;
  category: string[];
  short_desc: string;
  image: string;
  rating: number;
};

const CATEGORIES = ["Semua", "Wisata Alam", "Kuliner", "Sejarah & Budaya", "Ruang Publik", "Ikon Kota", "Cafe"];

function getNormalizedCategories(categoryData: string[] | string): string[] {
  if (Array.isArray(categoryData)) {
    return categoryData.map((cat) => String(cat).trim());
  }
  if (typeof categoryData === "string" && categoryData.trim() !== "") {
    return categoryData.split(",").map((cat) => cat.trim());
  }
  return [];
}

function DestinationCard({ item, index }: { item: Destination; index: number }) {
  const { lang, t } = useTranslation();
  const ref = useIntersectionObserverAnimation<HTMLDivElement>({
    delay: index * 50,
    rootMargin: "400px",
  });

  const itemCategories = getNormalizedCategories(item.category);

  return (
    <div
      ref={ref}
      className={cn("fade-in-up")}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <Link
        href={localizedPath(lang, `/destinasi/${encodeURIComponent(item.slug ?? "")}`)}
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

            <span
              className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs uppercase tracking-widest"
              style={{
                fontFamily: "var(--font-lato)",
                background: "rgba(212,160,23,0.85)",
                color: "#1A1A2E",
              }}
            >
              {itemCategories.length > 0 ? itemCategories.join(", ") : t.destDetail.general}
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
              {t.viewDetail} →
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
  const { lang, t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [search, setSearch] = useState("");

  const activeCat = activeCategory.toLowerCase();

  const filtered = destinations
    .filter((d) => d.slug)
    .filter((d) => {
      if (activeCategory === "Semua") return true;
      const translatedActiveCat = (t.categories[activeCategory as keyof typeof t.categories] ?? activeCategory).toLowerCase();
      const currentCats = getNormalizedCategories(d.category).map(cat => cat.toLowerCase());
      return currentCats.includes(translatedActiveCat);
    })
    .filter((d) => {
      if (!search.trim()) return true;
      const queryText = search.toLocaleLowerCase().trim();
      const nameMatch = (d.name ?? "").toLowerCase().includes(queryText);
      const descMatch = (d.short_desc ?? "").toLowerCase().includes(queryText);
      const catMatch = getNormalizedCategories(d.category).some(cat =>
        cat.toLowerCase().includes(queryText)
      );
      return nameMatch || descMatch || catMatch;
    });

  return (
    <section className="min-h-screen px-4 sm:px-6 pt-8 sm:pt-10 pb-20 sm:pb-24 max-w-7xl mx-auto">
      <div className="w-full flex items-center justify-between gap-4 mb-8 sm:mb-10">
        <Link
          href={localizedPath(lang)}
          className="inline-flex whitespace-nowrap items-center gap-2 text-sm transition-colors duration-200"
          style={{ color: "var(--color-emas)", fontFamily: "var(--font-lato)" }}
        >
          <ArrowLeft size={16} />
          {t.backToHome}
        </Link>

        <Link
          href={localizedPath(lang, "/sejarah")}
          className="inline-flex whitespace-nowrap items-center gap-2 text-sm transition-colors duration-200"
          style={{ color: "var(--color-emas)", fontFamily: "var(--font-lato)" }}
        >
          {t.seeHistory}
          <ArrowRight size={16} />
        </Link>
      </div>
      
      <div className="text-center mb-10 sm:mb-12 px-2">
        <p
          className="text-[10px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] mb-2 sm:mb-3 uppercase"
          style={{ color: "var(--color-emas)", fontFamily: "var(--font-lato)" }}
        >
          {t.discoverDest}
        </p>
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white"
          style={{
            fontFamily: "var(--font-cinzel)",
            textShadow: "0 2px 16px rgba(0,0,0,0.6)",
          }}
        >
          {t.exploreKediri}
        </h1>
        <p
          className="mt-3 sm:mt-4 text-xs sm:text-sm max-w-md mx-auto leading-relaxed"
          style={{
            color: "rgba(255,255,255,0.55)",
            fontFamily: "var(--font-lato)",
          }}
        >
          {t.destSubtitle}
        </p>
      </div>

      <div className="flex justify-center mb-5 sm:mb-6">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchDest}
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
          <span
            className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-sm"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            🔍
          </span>
        </div>
      </div>

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
            {t.categories[cat as keyof typeof t.categories] ?? cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <p
            className="text-lg"
            style={{
              color: "rgba(255,255,255,0.35)",
              fontFamily: "var(--font-lato)",
            }}
          >
            {t.noDest}
          </p>
          <button
            onClick={() => {
              setActiveCategory("Semua");
              setSearch("");
            }}
            className="text-xs tracking-widest uppercase underline underline-offset-4 transition-opacity hover:opacity-70"
            style={{
              color: "var(--color-emas)",
              fontFamily: "var(--font-lato)",
            }}
          >
            {t.showAll}
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