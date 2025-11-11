import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { ProductGrid } from '@/components/home/ProductGrid';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0f1729]">
      <Navbar />
      <HeroSection />
      <ProductGrid />
      <Footer />
    </div>
  );
}