import { createClient } from "@supabase/supabase-js";
import { Timeline } from "@/components/ui/timeline"; 
import Image from "next/image";
import Link from "next/link";

// 1. Tipe data disesuaikan dengan tabel baru 'histories'
interface SejarahRow {
  id: number;
  slug: string;
  title: string;
  year_era: string;
  short_desc?: string;
  description?: string;
  image?: string;
}

export const revalidate = 60; 

export default async function SejarahPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // 2. Tarik data dari tabel baru 'histories' & urutkan berdasarkan sort_order
  const { data: dbData } = await supabase
    .from("histories")
    .select("id, slug, title, year_era, short_desc, description, image")
    .order("sort_order", { ascending: true }); 

  const dataSejarah = (dbData as SejarahRow[]) || [];

  // 3. Transformasi data ke Aceternity Timeline dengan style mewah
  const timelineData = dataSejarah.map((item) => ({
    // Kita pajang Era/Tahun di sebelah kiri garis beserta judul peristiwanya
    title: item.year_era, 
    
    content: (
      <div key={item.id} className="font-sans text-neutral-200 group/item">
        {/* Judul Peristiwa / Nama Situs Sejarah */}
        <h3 className="text-xl md:text-2xl font-bold text-[#fff8e0] mb-3 tracking-wide transition-colors duration-300 group-hover/item:text-[#f0c040]">
          {item.title}
        </h3>

        {/* Ringkasan Singkat ber-vibe prasasti/old paper */}
        {item.short_desc && (
          <p className="text-xs md:text-sm font-normal mb-4 bg-[#0a0a14]/80 text-[#c8a84b] p-4 rounded-lg border border-[rgba(212,160,23,0.22)] shadow-[0_0_15px_rgba(212,160,23,0.05)] group-hover/item:shadow-[0_0_20px_rgba(212,160,23,0.12)] group-hover/item:border-[rgba(240,192,64,0.35)] italic leading-relaxed transition-all duration-300">
            ✦ {item.short_desc}
          </p>
        )}
        
        {/* Deskripsi utama */}
        {item.description && (
          <p className="text-neutral-400 text-sm md:text-base font-normal mb-6 leading-relaxed line-clamp-4">
            {item.description}
          </p>
        )}

        {/* Frame foto estetik dengan shadow glow */}
        {item.image && (
          <div className="relative w-full h-48 md:h-[350px] rounded-xl overflow-hidden mb-6 border border-[rgba(212,160,23,0.22)] shadow-[0_10px_30px_rgba(0,0,0,0.5)] group-hover/item:shadow-[0_0_30px_rgba(212,160,23,0.22)] group-hover/item:border-[rgba(240,192,64,0.4)] transition-all duration-500 ease-out">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover object-center scale-100 group-hover/item:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        )}

        {/* Tombol selengkapnya dengan style emas minimalis */}
        <div className="flex justify-start">
          <Link
            href={`/sejarah/${item.slug}`}
            className="text-xs md:text-sm text-[#d4a017] hover:text-[#fff8e0] font-semibold tracking-wider uppercase flex items-center gap-2 border border-[rgba(212,160,23,0.3)] hover:border-[#d4a017] hover:shadow-[0_0_15px_rgba(212,160,23,0.18)] px-4 py-2 rounded transition-all duration-300 bg-[rgba(212,160,23,0.02)]"
          >
            Buka Catatan Sejarah →
          </Link>
        </div>
      </div>
    ),
  }));

  return (
    // Samakan background base-nya dengan warna gelap di footer lu
    <div className="w-full min-h-screen bg-[#050509] pt-10">
      {timelineData.length > 0 ? (
        <Timeline data={timelineData} />
      ) : (
        <div className="flex items-center justify-center min-h-[60vh] text-[#c8a84b] opacity-50 italic font-serif">
          Belum ada data sejarah yang tersedia. Silakan cek kembali nanti, ya! ✨
        </div>
      )}
    </div>
  );
}