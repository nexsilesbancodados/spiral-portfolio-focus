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
      {/* Espaço para o efeito de scroll da nuvem funcionar */}
      <div className="h-[100vh]" />
    </div>
  );
};

export default Index;
