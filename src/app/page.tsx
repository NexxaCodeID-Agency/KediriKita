import dynamic from "next/dynamic";
import HeroSection from "./sections/HeroSection";

const KediriSection = dynamic(() => import("./sections/KediriSection"));
const CardSection   = dynamic(() => import("./sections/CardSection"));
const Carauser      = dynamic(() => import("./sections/Carauser"));
const Footer        = dynamic(() => import("./sections/Footer"));

export default function Home() {
  return (
    <main>
      <HeroSection />
      <KediriSection />
      <CardSection />
      <Carauser />
      <Footer />
    </main>
  );
}
