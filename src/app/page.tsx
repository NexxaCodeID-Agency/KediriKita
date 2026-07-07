"use client";
import dynamic from "next/dynamic";
import LazySection from "@/components/ui/LazySection";

const HeroSection = dynamic(() => import("./sections/HeroSection"), {
  loading: () => null,
});
const KediriSection = dynamic(() => import("./sections/KediriSection"));
const CardSection = dynamic(() => import("./sections/CardSection"));
const Carauser = dynamic(() => import("./sections/Carauser"));
const PetaSection = dynamic(() => import("./sections/peta"));
const Footer = dynamic(() => import("./sections/Footer"));
const Chartline = dynamic(() => import("./sections/chartline"), {ssr: false});

export default function Home() {
  return (
    <main>
      <HeroSection />

      <LazySection minHeight="100dvh">
        <KediriSection />
      </LazySection>

      <LazySection minHeight="100dvh">
        <CardSection />
      </LazySection>

      <LazySection minHeight="100dvh">
        <Carauser />
      </LazySection>

      <LazySection minHeight="100px">
        <Chartline />
      </LazySection>

      <LazySection minHeight="800px">
        <PetaSection />
      </LazySection>

    </main>
  );
}
