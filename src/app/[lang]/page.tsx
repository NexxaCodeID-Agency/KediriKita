"use client";
import dynamic from "next/dynamic";
import LazySection from "@/components/ui/LazySection";

const HeroSection = dynamic(() => import("@/components/sections/HeroSection"), {
  loading: () => null,
});
const KediriSection = dynamic(() => import("@/components/sections/KediriSection"), { ssr: false });
const CardSection = dynamic(() => import("@/components/sections/CardSection"), { ssr: false });
const Carauser = dynamic(() => import("@/components/sections/Carauser"), { ssr: false });
const PetaSection = dynamic(() => import("@/components/sections/peta"), { ssr: false });
const Chartline = dynamic(() => import("@/components/sections/chartline"), { ssr: false });

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
