import dynamic from "next/dynamic";
import HeroSection from "./sections/HeroSection";

const KediriSection = dynamic(() => import("./sections/KediriSection"), {
  ssr: true,
});
const CardSection = dynamic(() => import("./sections/CardSection"), {
  ssr: true,
});
const Carauser = dynamic(() => import("./sections/Carauser"), { ssr: true });
const PetaSection = dynamic(() => import("./sections/peta"), { ssr: false });
const Footer = dynamic(() => import("./sections/Footer"), { ssr: true });

export default function Home() {
  return (
    <main>
      <HeroSection />
      <KediriSection />
      <CardSection />
      <Carauser />
      <PetaSection />
      <Footer />
    </main>
  );
}
