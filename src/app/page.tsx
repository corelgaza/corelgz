import About from "@/components/About";
import Activities from "@/components/Activities";
import Contact from "@/components/Contact";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import InfoPesantren from "@/components/InfoPesantren";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import PrayerSchedule from "@/components/PrayerSchedule";
import Quotes from "@/components/Quotes";
import RevealObserver from "@/components/RevealObserver";
import ScrollProgress from "@/components/ScrollProgress";
import Testimonials from "@/components/Testimonials";
import { getGalleryImages } from "@/lib/gallery";

export default async function HomePage() {
  const galleryImages = await getGalleryImages();

  return (
    <>
      <ScrollProgress />
      <RevealObserver />
      <Loader />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Quotes />
        <PrayerSchedule />
        <Activities />
        <InfoPesantren />
        <Gallery images={galleryImages} />
        <Testimonials />
        <FaqSection />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
