import { supabase } from "@/lib/supabase";
import { Timeline } from "@/components/ui/timeline";
import Image from "next/image";
import Link from "next/link";
import { translations } from "@/lib/translations";
import { getLocale, localizedPath } from "@/lib/i18n";
import { getBatchTranslations } from "@/lib/db";

interface SejarahRow {
  id: string;
  slug: string;
  title: string;
  year_era: string;
  short_desc?: string;
  description?: string;
  image?: string;
}

export const revalidate = 60;

export default async function SejarahPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  const lang = getLocale(langParam);
  const t = translations[lang];

  const { data: dbData } = await supabase
    .from("histories")
    .select("id, slug, title, year_era, short_desc, description, image")
    .order("sort_order", { ascending: true });

  const dataSejarah = (dbData as SejarahRow[]) || [];

  let dataSejarahTranslated = dataSejarah;
  if (lang !== "id" && dataSejarah.length > 0) {
    const ids = dataSejarah.map((item) => item.id);
    const translationsMap = await getBatchTranslations(ids, "histories", lang);

    dataSejarahTranslated = dataSejarah.map((item) => {
      const tr = translationsMap.get(String(item.id));
      return tr ? { ...item, ...tr } : item;
    });
  }

  const timelineData = dataSejarahTranslated.map((item) => ({
    title: item.year_era,
    content: (
      <div key={item.id} className="font-sans text-neutral-200 group/item">
        <h3 className="text-xl md:text-2xl font-bold text-[#fff8e0] mb-3 tracking-wide transition-colors duration-300 group-hover/item:text-[#f0c040]">
          {item.title}
        </h3>

        {item.short_desc && (
          <p className="text-xs md:text-sm font-normal mb-4 bg-[#0a0a14]/80 text-[#c8a84b] p-4 rounded-lg border border-[rgba(212,160,23,0.22)] shadow-[0_0_15px_rgba(212,160,23,0.05)] group-hover/item:shadow-[0_0_20px_rgba(212,160,23,0.12)] group-hover/item:border-[rgba(240,192,64,0.35)] italic leading-relaxed transition-all duration-300">
            ✦ {item.short_desc}
          </p>
        )}

        {item.description && (
          <p className="text-neutral-400 text-sm md:text-base font-normal mb-6 leading-relaxed line-clamp-4">
            {item.description}
          </p>
        )}

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

        <div className="flex justify-start">
          <Link
            href={localizedPath(lang, `/sejarah/${item.slug}`)}
            className="text-xs md:text-sm text-[#d4a017] hover:text-[#fff8e0] font-semibold tracking-wider uppercase flex items-center gap-2 border border-[rgba(212,160,23,0.3)] hover:border-[#d4a017] hover:shadow-[0_0_15px_rgba(212,160,23,0.18)] px-4 py-2 rounded transition-all duration-300 bg-[rgba(212,160,23,0.02)]"
          >
            {t.openHistoryNotes}
          </Link>
        </div>
      </div>
    ),
  }));

  return (
    <div className="w-full min-h-screen bg-[#050509] pt-10">
      {timelineData.length > 0 ? (
        <Timeline data={timelineData} />
      ) : (
        <div className="flex items-center justify-center min-h-[60vh] text-[#c8a84b] opacity-50 italic font-serif">
          {t.noHistory}
        </div>
      )}
    </div>
  );
}
