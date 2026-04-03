// FOCUSS DEV Portfolio
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CloudDivider } from "@/components/CloudDivider";
import { AboutSection } from "@/components/AboutSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background bg-noise">
      <Header />
      <HeroSection />
      <CloudDivider />
      <AboutSection />
    </div>
  );
};

export default Index;
