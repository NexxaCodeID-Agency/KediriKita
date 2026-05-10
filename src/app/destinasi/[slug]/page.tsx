import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import MapWrapper from "@/components/ui/MapWrapper";
import PageTransition from "@/components/ui/PageTransition";
import StreetView from "@/components/ui/StreetView";
import RouteButton from "@/components/ui/RouteButton";

type Destination = {
  id: number;
  slug: string;
  name: string;
  category: string;
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
  const { slug } = await params;

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
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data;
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = await getDestination(slug);

  if (!destination) notFound();

  return (
    <PageTransition>
      <main
        className="min-h-screen text-white"
        style={{ background: "#070712" }}
      >
        {/* Hero Foto */}
        <div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[75vh]">
          {destination.image ? (
            <Image
              src={destination.image}
              alt={destination.name ?? ""}
              fill
              sizes="100vw"
              quality={90}
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
            className="absolute top-4 left-4 sm:top-6 sm:left-6 inline-flex items-center gap-2 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm transition-all hover:opacity-80"
            style={{
              color: "#d4a017",
              border: "1px solid rgba(212,160,23,0.4)",
              background: "rgba(0,0,0,0.35)",
              fontFamily: "var(--font-lato)",
            }}
          >
            <ArrowLeft size={14} />
            Kembali
          </Link>

          <div className="absolute bottom-6 sm:bottom-10 left-5 right-5 sm:left-8 sm:right-8">
            <span
              className="text-[10px] sm:text-xs uppercase tracking-widest px-2.5 sm:px-3 py-1 rounded-full inline-block"
              style={{
                background: "rgba(212,160,23,0.85)",
                color: "#1A1A2E",
                fontFamily: "var(--font-lato)",
              }}
            >
              {destination.category}
            </span>
            <h1
              className="text-2xl sm:text-4xl md:text-6xl font-bold mt-2 sm:mt-3 leading-tight"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              {destination.name}
            </h1>
            <p
              className="mt-1.5 sm:mt-2 text-xs sm:text-sm"
              style={{
                color: "rgba(255,255,255,0.6)",
                fontFamily: "var(--font-lato)",
              }}
            >
              📍 {destination.location}
            </p>
          </div>
        </div>

        {/* Konten */}
        <div className="max-w-3xl mx-auto px-5 sm:px-6 py-12 sm:py-16 space-y-12 sm:space-y-16">
          {/* Deskripsi */}
          <div>
            <p
              className="text-xs uppercase tracking-[0.3em] mb-6"
              style={{ color: "#d4a017", fontFamily: "var(--font-lato)" }}
            >
              ✦ Tentang Tempat Ini
            </p>
            <div className="space-y-4">
              {(destination.description || destination.short_desc || "")
                .split("\n")
                .filter(Boolean)
                .map((paragraph, i) => (
                  <p
                    key={i}
                    className="leading-relaxed text-base"
                    style={{
                      color: "rgba(255,255,255,0.72)",
                      fontFamily: "var(--font-lato)",
                      lineHeight: "1.9",
                    }}
                  >
                    {paragraph}
                  </p>
                ))}
            </div>
          </div>

          {/* Galeri */}
          {destination.gallery && destination.gallery.length > 0 && (
            <div>
              <p
                className="text-xs uppercase tracking-[0.3em] mb-5 sm:mb-6"
                style={{ color: "#d4a017", fontFamily: "var(--font-lato)" }}
              >
                ✦ Galeri Foto
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {destination.gallery.map((url, i) => (
                  <div
                    key={i}
                    className="relative rounded-xl overflow-hidden h-36 sm:h-48 md:h-[200px]"
                    style={{
                      border: "1px solid rgba(212,160,23,0.2)",
                    }}
                  >
                    <Image
                      src={url}
                      alt={`${destination.name} ${i + 1}`}
                      fill
                      sizes="(min-width: 768px) 33vw, 50vw"
                      quality={85}
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          {destination.tips && (
            <div
              className="rounded-2xl p-6 sm:p-8"
              style={{
                background: "rgba(212,160,23,0.05)",
                border: "1px solid rgba(212,160,23,0.2)",
              }}
            >
              <p
                className="text-xs uppercase tracking-[0.3em] mb-6"
                style={{ color: "#d4a017", fontFamily: "var(--font-lato)" }}
              >
                💡 Tips Berkunjung
              </p>
              <div className="space-y-3">
                {destination.tips
                  .split("\n")
                  .filter(Boolean)
                  .map((tip, i) => (
                    <p
                      key={i}
                      className="leading-relaxed"
                      style={{
                        color: "rgba(255,255,255,0.65)",
                        fontFamily: "var(--font-lato)",
                        lineHeight: "1.8",
                      }}
                    >
                      {tip}
                    </p>
                  ))}
              </div>
            </div>
          )}

          {/* Street View */}
          {destination.street_view_url && (
            <div>
              <p
                className="text-xs uppercase tracking-[0.3em] mb-6"
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

          {/* Peta */}
          {destination.latitude && destination.longitude && (
            <div>
              <p
                className="text-xs uppercase tracking-[0.3em] mb-6"
                style={{ color: "#d4a017", fontFamily: "var(--font-lato)" }}
              >
                ✦ Lokasi
              </p>
              <MapWrapper
                latitude={destination.latitude}
                longitude={destination.longitude}
                name={destination.name}
              />

              {/* Tombol Rute */}
              <RouteButton
                latitude={destination.latitude}
                longitude={destination.longitude}
              />
            </div>
          )}
        </div>
      </main>
    </PageTransition>
  );
}
