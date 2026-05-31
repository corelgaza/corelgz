import About from "@/components/About";
import Activities from "@/components/Activities";
import Contact from "@/components/Contact";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import InfoPesantren from "@/components/InfoPesantren";
import LocationMap from "@/components/LocationMap";
import LatestArticles from "@/components/LatestArticles";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import PrayerSchedule from "@/components/PrayerSchedule";
import Quotes from "@/components/Quotes";
import RevealObserver from "@/components/RevealObserver";
import ScrollProgress from "@/components/ScrollProgress";
import Testimonials from "@/components/Testimonials";
import { listPublishedArticles } from "@/lib/articles";
import { getGalleryImages } from "@/lib/gallery";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [galleryImages, allArticles] = await Promise.all([
    getGalleryImages(),
    listPublishedArticles(),
  ]);
  const latestArticles = allArticles.slice(0, 3);

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
        <LatestArticles articles={latestArticles} />
        <InfoPesantren />
        <Gallery images={galleryImages} />
        <Testimonials />
        <FaqSection />
        <LocationMap />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
