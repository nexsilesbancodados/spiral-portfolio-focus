// FOCUSS DEV Portfolio
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CloudDivider } from "@/components/CloudDivider";

const Index = () => {
  return (
    <div className="min-h-[300vh] bg-background bg-noise">
      <Header />
      <HeroSection />
      <CloudDivider />
    </div>
  );
};

export default Index;
