import type { Metadata, Viewport } from "next";
import { Cinzel, Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { cn } from "@/lib/utils";
import { DestinationLink } from "@/app/sections/Footer";
import { createClient } from '@supabase/supabase-js';
import { Suspense } from "react"; // 🔴 IMPORT SUSPENSE NYET!

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Kota Kediri — Temukan Keindahan & Sejarahnya",
  description:
    "Temukan keindahan, sejarah, dan kehangatan Kota Kediri — kota yang selalu punya cerita untukmu.",
  openGraph: {
    title: "Kota Kediri",
    description:
      "Temukan keindahan, sejarah, dan kehangatan Kota Kediri — kota yang selalu punya cerita untukmu.",
    images: ["/assets/images/og-kediri.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1A1A2E",
};

async function getFooterData(): Promise<{ wisata: DestinationLink[]; kuliner: DestinationLink[] }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) return { wisata: [], kuliner: [] };

  const supabaseServer = createClient(supabaseUrl, supabaseAnonKey);

  try {
    const { data: wisata } = await supabaseServer
      .from("destinations")
      .select("name, slug")
      .eq("category", "wisata");

    const { data: kuliner } = await supabaseServer
      .from("destinations")
      .select("name, slug")
      .eq("category", "kuliner");

    return { wisata: (wisata as DestinationLink[]) || [], kuliner: (kuliner as DestinationLink[]) || [] };
  } catch (error) {
    console.error("Gagal mengambil data footer:", error);
    return { wisata: [], kuliner: [] };
  }
}

// 🟢 KOMPONEN INNER UNTUK MENANGANI DATA FOOTER AGAR STREAMING RUNNING SEPARATELY
async function LayoutContent({ children }: { children: React.ReactNode }) {
  const { wisata, kuliner } = await getFooterData();
  return (
    <ClientLayout dataWisata={wisata} dataKuliner={kuliner}>
      {children}
    </ClientLayout>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={cn("h-full", cinzel.variable, playfair.variable, lato.variable, "font-sans")}
    >
      <body className="min-h-full bg-[#080812]">
        {/* 🔴 BUNTEL PAKE SUSPENSE! Biar halaman children (Home dll) lu bisa kerender instan 
            tanpa perlu nungguin query table destinations Supabase kelar! */}
        <Suspense fallback={<div className="min-h-screen bg-[#080812]" />}>
          <LayoutContent>{children}</LayoutContent>
        </Suspense>
      </body>
    </html>
  );
}