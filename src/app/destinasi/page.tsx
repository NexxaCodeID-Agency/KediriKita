import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import DestinationGrid from "@/components/ui/DestinationGrid";

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

export default async function DestinationPage() {
  const destinations = await getDestinations();

  return (
    <main className="min-h-screen" style={{ background: "var(--color-langit-malam)" }}>
      <DestinationGrid destinations={destinations} />
    </main>
  );
}
