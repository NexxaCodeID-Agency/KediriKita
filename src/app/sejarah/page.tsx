import { createClient } from "@supabase/supabase-js";
import { Timeline } from "@/components/ui/timeline"; // Sesuaikan path import komponen lu
import Image from "next/image";
import Link from "next/link";

interface SejarahRow {
  id: number;
  name: string;
  slug: string;
  short_desc?: string;
  description?: string;
  image?: string;
}

export const revalidate = 60; // Tetap pakai ISR biar kenceng!

export default async function SejarahPage() {
  // 1. Setup client Supabase Server
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // 2. Tarik data dari database destinations
  // Di sini gw asumsiin lu ambil data atau filter kategori 'wisata' atau 'sejarah'
  const { data: dbData } = await supabase
    .from("destinations")
    .select("id, name, slug, short_desc, description, image")
    .order("id", { ascending: true }); // Diurutkan biar runtut urutan sejarahnya

  const dataSejarah = (dbData as SejarahRow[]) || [];

  // 3. Transformasi/Mapping data dari DB ke struktur data yang diminta oleh Aceternity Timeline
  const timelineData = dataSejarah.map((item) => ({
    // Judul di sebelah kiri garis (misal nama tempat/kejadian)
    title: item.name, 
    
    // Konten di sebelah kanan garis timeline
    content: (
      <div className="font-sans">
        {item.short_desc && (
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4 bg-neutral-100 dark:bg-neutral-900 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
            {item.short_desc}
          </p>
        )}
        
        {item.description && (
          <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base font-normal mb-6 leading-relaxed line-clamp-4">
            {item.description}
          </p>
        )}

        {item.image && (
          <div className="relative w-full h-44 md:h-80 rounded-lg overflow-hidden mb-6 border border-neutral-200 dark:border-neutral-800">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover object-center hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <div className="flex justify-start">
          <Link
            href={`/sejarah/${item.slug}`}
            className="text-xs md:text-sm text-blue-500 dark:text-amber-500 font-semibold hover:underline flex items-center gap-1"
          >
            Pelajari Selengkapnya Pelan-Pelan →
          </Link>
        </div>
      </div>
    ),
  }));

  return (
    <div className="w-full min-h-screen bg-white dark:bg-neutral-950">
      {/* Jika data kosong, tampilkan fallback aman biar gak error screen */}
      {timelineData.length > 0 ? (
        <Timeline data={timelineData} />
      ) : (
        <div className="flex items-center justify-center min-h-[60vh] text-neutral-500 italic">
          Belum ada rekaman sejarah di database... 😹
        </div>
      )}
    </div>
  );
}