import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import DestinationGrid from "@/components/ui/DestinationGrid";
import { getBatchTranslations } from "@/lib/db";
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

  if (error) return [];
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

  let translatedDestinations = destinations;
  if (lang !== "id" && destinations.length > 0) {
    const ids = destinations.map((d) => String(d.id));
    const translationsMap = await getBatchTranslations(ids, "destinations", lang);

    translatedDestinations = destinations.map((dest) => {
      const tr = translationsMap.get(String(dest.id));
      return tr ? { ...dest, ...tr } : dest;
    });
  }

  return (
    <main className="min-h-screen" style={{ background: "var(--color-langit-malam)" }}>
      <DestinationGrid destinations={translatedDestinations} />
    </main>
  );
}
