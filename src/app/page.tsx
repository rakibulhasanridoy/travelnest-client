import Navbar            from "@/components/layout/Navbar";
import Footer            from "@/components/layout/Footer";
import FeaturedPackages  from "@/components/home/FeaturedPackages";
import {
  HeroSection, PopularDestinations, WhyChooseUs,
  TravelStats, Testimonials, LatestBlogs,
  FAQ, NewsletterSection,
} from "@/components/home/sections";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <PopularDestinations />
        <FeaturedPackages />
        <WhyChooseUs />
        <TravelStats />
        <Testimonials />
        <LatestBlogs />
        <FAQ />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
