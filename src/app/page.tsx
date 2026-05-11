import dynamic from "next/dynamic";

const HeroSection = dynamic(() => import("./sections/HeroSection"), {
  loading: () => null,
});
const KediriSection = dynamic(() => import("./sections/KediriSection"));
const CardSection = dynamic(() => import("./sections/CardSection"));
const Carauser = dynamic(() => import("./sections/Carauser"));
const Footer = dynamic(() => import("./sections/Footer"));

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
