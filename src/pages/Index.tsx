// FOCUSS DEV Portfolio
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background bg-noise">
      <Header />
      <HeroSection />
      <AboutSection />
    </div>
  );
};

export default Index;
