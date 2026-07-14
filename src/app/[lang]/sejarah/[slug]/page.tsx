import { notFound } from "next/navigation";
import DetailClient from "./DetailClient";
import { getTranslationData } from "@/lib/db";
import { createClient } from "@supabase/supabase-js";

export default async function SejarahDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );


  const { data: history } = await supabase
    .from("histories")
    .select("id, title, year_era, description, short_desc, image") 
    .eq("slug", slug)
    .single();

  if (!history) notFound();

  const content = await getTranslationData(history.id, 'histories', lang);

  const finalData = {
    ...history,
    ...content,
    slug
  };

  return <DetailClient data={finalData} />;
}