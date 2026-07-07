import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import MapWrapper from "@/components/ui/MapWrapper";
import StreetView from "@/components/ui/StreetView";
import RouteButton from "@/components/ui/RouteButton";
import GalleryClient from "@/components/ui/GalleryClient";

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
  id: number;
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolveParams = await params;
  const slug = resolveParams.slug;
  if (!slug) notFound();

  const { data } = await supabase
    .from("destinations")
    .select("name, short_desc")
    .eq("slug", slug)
    .single();

  return {
    title: `${data?.name} — Wisata Kediri`,
    description: data?.short_desc,
  };
}

async function getDestination(slug: string): Promise<Destination | null> {
  console.log(`Fetching destination for slug: "${slug}"`);
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error(`Supabase error for slug "${slug}":`, error.message);
    return null;
  }
  if (!data) {
    console.log(`No data returned for slug: "${slug}"`);
  }
  return data;
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolveParams = await params;
  const slug = resolveParams.slug;
  if (!slug) notFound();
  const destination = await getDestination(slug);

  if (!destination) notFound();

  return (
    <main className="min-h-screen text-white" style={{ background: "#070712" }}>
      <div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[75vh]">
        {isValidImageSrc(destination.image) ? (
          <Image
            src={destination.image}
            alt={destination.name ?? ""}
            fill
            sizes="100vw"
            quality={90}
            unoptimized={true}
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
          href="/destinasi"
          className="absolute top-4 left-4 sm:top-6 sm:left-6 inline-flex items-center gap-2 text-xs sm:text-sm px-4 py-2 rounded-full backdrop-blur-sm transition-all duration-300 border border-[rgba(212,160,23,0.3)] hover:border-[#d4a017] hover:shadow-[0_0_15px_rgba(212,160,23,0.18)]"
          style={{
            color: "#d4a017",
            background: "rgba(8,8,15,0.6)",
            fontFamily: "var(--font-lato)",
          }}
        >
          <ArrowLeft size={14} />
          Kembali
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
            ✦ {Array.isArray(destination.category) ? destination.category.join(", ") : destination.category}
          </span>
          <h1
            className="text-3xl sm:text-5xl md:text-6xl font-black mt-2 sm:mt-3 leading-tight text-[#fff8e0]"
            style={{ 
              fontFamily: "var(--font-cinzel), serif",
              textShadow: "0 0 40px rgba(212,160,23,0.25)"
            }}
          >
            {destination.name}
          </h1>
          <p
            className="mt-2 text-xs sm:text-sm font-medium tracking-wide text-[#c8a84b] opacity-90"
            style={{
              fontFamily: "var(--font-lato)",
            }}
          >
            📍 {destination.location}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 sm:px-6 py-12 sm:py-16 space-y-12 sm:space-y-16">
        <div>
          <p
            className="text-xs uppercase tracking-[0.3em] mb-6 font-bold"
            style={{ color: "#d4a017", fontFamily: "var(--font-lato)" }}
          >
            ✦ Tentang Tempat Ini
          </p>
          <div className="max-w-none text-neutral-300 text-base sm:text-lg leading-relaxed font-sans space-y-6">
            {(destination.description || destination.short_desc || "")
              .split("\n")
              .map((paragraph, i) => {
                const cleanText = paragraph.trim();
                if (!cleanText) return null;

                if (i === 0) {
                  const firstLetter = cleanText.charAt(0);
                  const remainingText = cleanText.slice(1);
                  return (
                    <p key={i} className="text-justify first-letter:float-left first-letter:text-5xl sm:first-letter:text-6xl first-letter:font-black first-letter:text-[#d4a017] first-letter:mr-3 first-letter:font-serif first-letter:leading-none">
                      {cleanText}
                    </p>
                  );
                }

                if (cleanText.length < 45 && !cleanText.endsWith('.')) {
                  return (
                    <h2 
                      key={i} 
                      className="text-xl sm:text-2xl font-bold text-[#fff8e0] pt-4 tracking-wide font-serif"
                      style={{ textShadow: "0 0 20px rgba(212,160,23,0.15)" }}
                    >
                      ✦ {cleanText}
                    </h2>
                  );
                }

                return (
                  <p key={i} className="text-justify text-neutral-300 opacity-95 indent-4 sm:indent-8">
                    {cleanText}
                  </p>
                );
              })}
          </div>
        </div>

        {destination.gallery && destination.gallery.length > 0 && (
          <div>
            <p
              className="text-xs uppercase tracking-[0.3em] mb-5 sm:mb-6 font-bold"
              style={{ color: "#d4a017", fontFamily: "var(--font-lato)" }}
            >
              ✦ Galeri Foto
            </p>
            <GalleryClient
              gallery={destination.gallery.filter(isValidImageSrc)}
              name={destination.name}
            />
          </div>
        )}

        {destination.tips && (
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
              💡 Tips Berkunjung
            </p>
            <div className="space-y-4 text-neutral-300 text-base sm:text-lg leading-relaxed font-sans">
              {destination.tips
                .split("\n")
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

        {destination.street_view_url && (
          <div>
            <p
              className="text-xs uppercase tracking-[0.3em] mb-6 font-bold"
              style={{ color: "#d4a017", fontFamily: "var(--font-lato)" }}
            >
              ✦ Jelajahi 360°
            </p>
            <StreetView
              url={destination.street_view_url}
              name={destination.name}
            />
          </div>
        )}

        {destination.latitude && destination.longitude && (
          <div>
            <p
              className="text-xs uppercase tracking-[0.3em] mb-6 font-bold"
              style={{ color: "#d4a017", fontFamily: "var(--font-lato)" }}
            >
              ✦ Lokasi Peta
            </p>
            <MapWrapper
              latitude={destination.latitude}
              longitude={destination.longitude}
              name={destination.name}
            />

            <RouteButton
              latitude={destination.latitude}
              longitude={destination.longitude}
            />
          </div>
        )}
      </div>
    </main>
  );
}