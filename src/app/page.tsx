import { Header } from "@/components/Header";
import { Ambience } from "@/components/sections/Ambience";
import { Booking } from "@/components/sections/Booking";
import { DigitalMenu } from "@/components/sections/DigitalMenu";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { MotionProvider } from "@/components/ui/Motion";

export default function Home() {
  return (
    <MotionProvider>
      <Header />
      <main id="konten">
        <Hero />
        <DigitalMenu />
        <Ambience />
        <Booking />
      </main>
      <Footer />
    </MotionProvider>
  );
}
