import HeroSection from "@/components/Landing/HeroSection";
import FeatureBentoGrid from "@/components/Landing/FeatureBentoGrid";
import InteractiveDemo from "@/components/Landing/InteractiveDemo";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <InteractiveDemo />
      <FeatureBentoGrid />
    </main>
  );
}
