import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import MapWrapper from "@/components/ui/MapWrapper";


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
    <main className="min-h-screen text-white" style={{ background: "#0a0a1a" }}>
      {/* Hero Foto */}
      <div className="relative w-full h-[70vh]">
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #0a0a1a 0%, rgba(10,10,26,0.5) 50%, transparent 100%)",
          }}
        />

        {/* Back button */}
        <Link
          href="/destinasi"
          className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full backdrop-blur-sm transition-all hover:opacity-80"
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

        {/* Title */}
        <div className="absolute bottom-8 left-6 right-6 max-w-3xl">
          <span
            className="text-xs uppercase tracking-widest px-3 py-1 rounded-full"
            style={{
              background: "rgba(212,160,23,0.85)",
              color: "#1A1A2E",
              fontFamily: "var(--font-lato)",
            }}
          >
            {destination.category}
          </span>
          <h1
            className="text-3xl md:text-5xl font-bold mt-3"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            {destination.name}
          </h1>
          <p
            className="mt-2 text-sm"
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
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        {/* Deskripsi */}
        <div>
          <p
            className="text-xs uppercase tracking-[0.3em] mb-4"
            style={{ color: "#d4a017", fontFamily: "var(--font-lato)" }}
          >
            ✦ Tentang Tempat Ini
          </p>
          <p
            className="leading-relaxed text-base"
            style={{
              color: "rgba(255,255,255,0.7)",
              fontFamily: "var(--font-lato)",
            }}
          >
            {destination.description || destination.short_desc}
          </p>
        </div>

        {/* Galeri */}
        {destination.gallery && destination.gallery.length > 0 && (
          <div>
            <p
              className="text-xs uppercase tracking-[0.3em] mb-6"
              style={{ color: "#d4a017", fontFamily: "var(--font-lato)" }}
            >
              ✦ Galeri Foto
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {destination.gallery.map((url, i) => (
                <div
                  key={i}
                  className="relative rounded-xl overflow-hidden"
                  style={{
                    height: "200px",
                    border: "1px solid rgba(212,160,23,0.2)",
                  }}
                >
                  <Image
                    src={url}
                    alt={`${destination.name} ${i + 1}`}
                    fill
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
            className="rounded-2xl p-6"
            style={{
              background: "rgba(212,160,23,0.06)",
              border: "1px solid rgba(212,160,23,0.25)",
            }}
          >
            <p
              className="text-xs uppercase tracking-[0.3em] mb-3"
              style={{ color: "#d4a017", fontFamily: "var(--font-lato)" }}
            >
              💡 Tips Berkunjung
            </p>
            <p
              className="leading-relaxed"
              style={{
                color: "rgba(255,255,255,0.65)",
                fontFamily: "var(--font-lato)",
              }}
            >
              {destination.tips}
            </p>
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
          </div>
        )}
      </div>
    </main>
  );
}
