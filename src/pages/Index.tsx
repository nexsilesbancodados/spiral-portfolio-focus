// FOCUSS DEV Portfolio
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CloudDivider } from "@/components/CloudDivider";
import { AboutSection } from "@/components/AboutSection";

const Index = () => {
  return (
    <div
      className="min-h-screen bg-noise"
      style={{
        background: "linear-gradient(to bottom, #1a6fc4 0%, #5ba3d9 30%, #a8d4f0 60%, #a8d4f0 100%)",
      }}
    >
      <Header />
      <HeroSection />
      <CloudDivider />
      <AboutSection />
    </div>
  );
};

export default Index;
