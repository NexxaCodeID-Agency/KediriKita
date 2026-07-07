import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import DetailClient from "./DetailClient";

interface HistoryData {
  id: number;
  slug: string;
  title: string;       
  year_era: string;    
  description: string;
  short_desc?: string;
  image?: string;
}

export const revalidate = 60;
export const dynamicParams = true;

export default async function SejarahDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServer = createClient(supabaseUrl || "", supabaseAnonKey || "");

  const { data: history } = await supabaseServer
    .from("histories") 
    .select("id, slug, title, year_era, description, short_desc, image")
    .eq("slug", slug)
    .single();

  if (!history) {
    notFound();
  }

  return <DetailClient data={history as HistoryData} />;
}