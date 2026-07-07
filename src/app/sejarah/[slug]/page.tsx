import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import RouteButton from "@/components/ui/RouteButton";
import { ArrowLeft } from "lucide-react";

// Tentukan tipe data History sesuai kolom tabel 'destinations' lu (atau tabel sejarah lu)
interface HistoryData {
  id: number;
  slug: string;
  name: string;
  description: string;
  short_desc?: string;
  image?: string;
}

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

// Kontrol revalidasi data di sisi server (ISR) - AMAN DI SINI KARENA SERVER COMPONENT
export const revalidate = 60;
export const dynamicParams = true;

// Gunakan async karena params di Next.js terbaru adalah Promise
export default async function SejarahDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // 1. Await params-nya biar dapet slug-nya
  const { slug } = await params;

  // 2. Bikin instance client Supabase server-side
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServer = createClient(supabaseUrl || "", supabaseAnonKey || "");

  // 3. Tarik data sejarah berdasarkan slug dari tabel 'destinations'
  const { data: history } = await supabaseServer
    .from("destinations")
    .select("id, slug, name, description, short_desc, image")
    .eq("slug", slug)
    .single(); // Ambil satu data aja

  // Jika data gak ketemu di DB, langsung lempar ke halaman 404 bawaan Next.js
  if (!history) {
    notFound();
  }

  const data = history as HistoryData;

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl text-white">
      <div className="mb-6">
        <Link
          href="/sejarah"
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
      </div>

      <h1 className="text-4xl font-bold font-sans mb-4">{data.name}</h1>
      
      {data.short_desc && (
        <p className="text-gray-400 font-serif italic mb-6">{data.short_desc}</p>
      )}

      {isValidImageSrc(data.image) && (
        <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-8">
          <Image
            src={data.image}
            alt={data.name}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="prose prose-invert max-w-none font-sans leading-relaxed text-gray-200">
        <p>{data.description}</p>
      </div>
    </div>
  );
}