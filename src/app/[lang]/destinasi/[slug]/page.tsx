import { supabase } from "@/lib/supabase";
import { cache, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUp } from "lucide-react";
import MapWrapper from "@/components/ui/MapWrapper";
import StreetView from "@/components/ui/StreetView";
import RouteButton from "@/components/ui/RouteButton";
import GalleryClient from "@/components/ui/GalleryClient";
import { translations } from "@/lib/translations";
import { getLocale, localizedPath } from "@/lib/i18n";
import { getTranslationData } from "@/lib/db";
import { renderFormattedText } from "@/lib/formatText";
import ScrollToTop from "@/components/ui/ScrollTop";

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

export const revalidate = 60;
export const dynamicParams = true;

type Destination = {
  id: string;
  slug: string;
  name: string;
  category: string[];
  short_desc: string;
  description: string;
  image: string;
  location: string;
  tips: string;
  latitude: number;
  longitude: number;
  street_view_url: string;
  gallery: string[];
};

export async function generateStaticParams() {
  const { data } = await supabase.from("destinations").select("slug");

  return data?.map((item) => ({ slug: item.slug })) ?? [];
}

const getDestination = cache(async (slug: string): Promise<Destination | null> => {
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolveParams = await params;
  const slug = resolveParams.slug;
  if (!slug) notFound();

  const destination = await getDestination(slug);
  if (!destination) notFound();

  return {
    title: `${destination.name} — Wisata Kediri`,
    description: destination.short_desc,
  };
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const resolveParams = await params;
  const slug = resolveParams.slug;
  const lang = getLocale(resolveParams.lang);
  const t = translations[lang];
  if (!slug) notFound();
  const destination = await getDestination(slug);

  if (!destination) notFound();

  const dbTranslations = await getTranslationData(destination.id, 'destinations', lang.toLowerCase());

  const d = dbTranslations
    ? { ...destination, ...dbTranslations }
    : destination;

  return (
    <main className="min-h-screen text-white" style={{ background: "#070712" }}>
      <div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[75vh]">
        {isValidImageSrc(d.image) ? (
          <Image
            src={d.image}
            alt={d.name ?? ""}
            fill
            sizes="100vw"
            quality={80}
            className="object-cover"
            priority
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, #1A1A2E 0%, #070712 100%)",
            }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #070712 5%, rgba(7,7,18,0.25) 50%, transparent 100%)",
          }}
        />

        <Link
          href={localizedPath(lang, "/destinasi")}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 z-[90] inline-flex items-center gap-2 text-xs sm:text-sm px-4 py-2 rounded-full backdrop-blur-sm transition-all duration-300 border border-[rgba(212,160,23,0.3)] hover:border-[#d4a017] hover:shadow-[0_0_15px_rgba(212,160,23,0.18)]"
          style={{
            color: "#d4a017",
            background: "rgba(8,8,15,0.6)",
            fontFamily: "var(--font-lato)",
          }}
        >
          <ArrowLeft size={14} />
          {t.back}
        </Link>

        <div className="absolute bottom-6 sm:bottom-10 left-5 right-5 sm:left-8 sm:right-8">
          <span
            className="text-[10px] sm:text-xs uppercase tracking-widest px-3 py-1 rounded-full inline-block font-sans font-bold shadow-[0_0_15px_rgba(212,160,23,0.2)] border border-[rgba(212,160,23,0.4)]"
            style={{
              background: "rgba(212,160,23,0.15)",
              color: "#fff8e0",
              fontFamily: "var(--font-lato)",
            }}
          >
            ✦ {Array.isArray(d.category) ? d.category.join(", ") : d.category}
          </span>
          <h1
            className="text-3xl sm:text-5xl md:text-6xl font-black mt-2 sm:mt-3 leading-tight text-[#fff8e0]"
            style={{
              fontFamily: "var(--font-cinzel), serif",
              textShadow: "0 0 40px rgba(212,160,23,0.25)"
            }}
          >
            {d.name}
          </h1>
          <p
            className="mt-2 text-xs sm:text-sm font-medium tracking-wide text-[#c8a84b] opacity-90"
            style={{
              fontFamily: "var(--font-lato)",
            }}
          >
            📍 {d.location}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 sm:px-6 py-12 sm:py-16 space-y-12 sm:space-y-16">
        <div>
          <p
            className="text-xs uppercase tracking-[0.3em] mb-6 font-bold"
            style={{ color: "#d4a017", fontFamily: "var(--font-lato)" }}
          >
            ✦ {t.destDetail.about}
          </p>
          <div className="max-w-none text-base sm:text-lg leading-relaxed font-sans space-y-6">
            {renderFormattedText(d.description || d.short_desc || "", { firstLetter: true })}
          </div>
        </div>

        {d.gallery && d.gallery.length > 0 && (
          <Suspense
            fallback={
              <div className="rounded-2xl p-5 sm:p-8" style={{ background: "rgba(212,160,23,0.02)", border: "1px solid rgba(212,160,23,0.06)" }}>
                <div className="w-16 h-3 rounded-full mb-6 animate-pulse" style={{ background: "rgba(212,160,23,0.12)" }} />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={`rounded-xl animate-pulse ${i === 1 ? "col-span-2 md:col-span-2 h-48 sm:h-64 md:h-[300px]" : "h-36 sm:h-48 md:h-[200px]"}`} style={{ background: "rgba(255,255,255,0.03)" }} />
                  ))}
                </div>
              </div>
            }
          >
            <div className="rounded-2xl p-5 sm:p-8" style={{ background: "rgba(212,160,23,0.02)", border: "1px solid rgba(212,160,23,0.1)" }}>
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] font-bold" style={{ color: "#d4a017", fontFamily: "var(--font-lato)" }}>
                    ✦ {t.destDetail.gallery}
                  </p>
                  <p className="text-[11px] mt-1.5 tracking-wide" style={{ color: "rgba(200,168,75,0.5)", fontFamily: "var(--font-lato)" }}>
                    {d.gallery.filter(isValidImageSrc).length} foto &middot; Klik untuk memperbesar
                  </p>
                </div>
              </div>
              <GalleryClient gallery={d.gallery.filter(isValidImageSrc)} name={d.name} />
            </div>
          </Suspense>
        )}

        {d.tips && (
          <div
            className="rounded-2xl p-6 sm:p-8 shadow-[0_0_30px_rgba(212,160,23,0.02)]"
            style={{
              background: "rgba(212,160,23,0.04)",
              border: "1px solid rgba(212,160,23,0.15)",
            }}
          >
            <p
              className="text-xs uppercase tracking-[0.3em] mb-6 font-bold"
              style={{ color: "#d4a017", fontFamily: "var(--font-lato)" }}
            >
              💡 {t.destDetail.tips}
            </p>
            <div className="space-y-4 text-neutral-300 text-base sm:text-lg leading-relaxed font-sans">
              {d.tips
                .split(/\n+/)
                .map((tip, i) => {
                  const cleanTip = tip.trim();
                  if (!cleanTip) return null;

                  return (
                    <div key={i} className="flex items-start gap-3 text-justify">
                      <span className="text-[#d4a017] flex-shrink-0 mt-1.5 text-xs sm:text-sm">✦</span>
                      <p className="opacity-95">{cleanTip}</p>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {d.street_view_url && (
          <Suspense
            fallback={
              <div>
                <p className="text-xs uppercase tracking-[0.3em] mb-6 font-bold" style={{ color: "#d4a017", fontFamily: "var(--font-lato)" }}>
                  ✦ {t.destDetail.explore360}
                </p>
                <div className="w-full h-64 sm:h-80 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.03)" }} />
              </div>
            }
          >
            <div>
              <p className="text-xs uppercase tracking-[0.3em] mb-6 font-bold" style={{ color: "#d4a017", fontFamily: "var(--font-lato)" }}>
                ✦ {t.destDetail.explore360}
              </p>
              <StreetView url={d.street_view_url} name={d.name} />
            </div>
          </Suspense>
        )}

        {d.latitude && d.longitude && (
          <Suspense
            fallback={
              <div>
                <p className="text-xs uppercase tracking-[0.3em] mb-6 font-bold" style={{ color: "#d4a017", fontFamily: "var(--font-lato)" }}>
                  ✦ {t.destDetail.mapLocation}
                </p>
                <div className="w-full h-64 sm:h-80 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.03)" }} />
              </div>
            }
          >
            <div>
              <p className="text-xs uppercase tracking-[0.3em] mb-6 font-bold" style={{ color: "#d4a017", fontFamily: "var(--font-lato)" }}>
                ✦ {t.destDetail.mapLocation}
              </p>
              <MapWrapper latitude={d.latitude} longitude={d.longitude} name={d.name} />
              <RouteButton latitude={d.latitude} longitude={d.longitude} />
            </div>
          </Suspense>
        )}
        <ScrollToTop/>
      </div>
    </main>
  );
}