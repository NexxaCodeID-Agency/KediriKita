import { notFound } from "next/navigation";
import { cache } from "react";
import { supabase } from "@/lib/supabase";
import DetailClient from "./DetailClient";
import { getTranslationData } from "@/lib/db";

const getHistory = cache(async (slug: string) => {
  const { data, error } = await supabase
    .from("histories")
    .select("id, title, year_era, description, short_desc, image")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data;
});

export default async function SejarahDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;

  const history = await getHistory(slug);
  if (!history) notFound();

  const content = await getTranslationData(history.id, "histories", lang);

  const finalData = {
    ...history,
    ...content,
    slug,
  };

  return <DetailClient data={finalData} />;
}
