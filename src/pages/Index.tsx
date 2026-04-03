// FOCUSS DEV Portfolio
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CloudDivider } from "@/components/CloudDivider";
import { AboutSection } from "@/components/AboutSection";
import { ServicesSection } from "@/components/ServicesSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background bg-noise">
      <Header />
      <HeroSection />
      <CloudDivider />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <SkillsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
