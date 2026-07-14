import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import DestinationGrid from "@/components/ui/DestinationGrid";
import { getTranslationData } from "@/lib/db";
import { getLocale } from "@/lib/i18n";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Destinasi Wisata Kediri",
  description: "Jelajahi wisata alam, kuliner, dan sejarah Kota Kediri",
};

async function getDestinations() {
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Gagal fetch data:", error.message);
    return [];
  }

  return data ?? [];
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  const lang = getLocale(langParam);

  const destinations = await getDestinations();

  const translatedDestinations =
    lang === "id"
      ? destinations
      : await Promise.all(
          destinations.map(async (dest) => {
            const tr = await getTranslationData(String(dest.id), "destinations", lang);
            return tr ? { ...dest, ...tr } : dest;
          })
        );

  return (
    <main className="min-h-screen" style={{ background: "var(--color-langit-malam)" }}>
      <DestinationGrid destinations={translatedDestinations} />
    </main>
  );
}
