// FOCUSS DEV Portfolio
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CloudDivider } from "@/components/CloudDivider";
import { AboutSection } from "@/components/AboutSection";
import { MarqueeSection } from "@/components/MarqueeSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ProjectsSection } from "@/components/ProjectsSection";

const Index = () => {
  return (
    <div className="sky-page min-h-screen overflow-x-hidden bg-noise">
      <Header />
      <HeroSection />
      <CloudDivider />
      <AboutSection />
      <MarqueeSection />
      <SkillsSection />
      <ProjectsSection />
    </div>
  );
};

export default Index;
