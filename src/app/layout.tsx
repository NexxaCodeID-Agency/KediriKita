import type { Metadata, Viewport } from "next";
import { Cinzel, Playfair_Display, Lato, Geist } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400"],
});

export const metadata: Metadata = {
  title: "Kota Kediri — Temukan Keindahan & Sejarahnya",
  description:
    "Temukan keindahan, sejarah, dan kehangatan Kota Kediri — kota yang selalu punya cerita untukmu.",
  openGraph: {
    title: "Kota Kediri",
    description:
      "Temukan keindahan, sejarah, dan kehangatan Kota Kediri — kota yang selalu punya cerita untukmu.",
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1A1A2E",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={cn("h-full", cinzel.variable, playfair.variable, lato.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
