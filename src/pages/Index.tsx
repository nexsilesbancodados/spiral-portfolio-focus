// FOCUSS DEV Portfolio
import { lazy, Suspense } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CloudDivider } from "@/components/CloudDivider";

const AboutSection = lazy(() => import("@/components/AboutSection").then(m => ({ default: m.AboutSection })));
const MarqueeSection = lazy(() => import("@/components/MarqueeSection").then(m => ({ default: m.MarqueeSection })));
const SkillsSection = lazy(() => import("@/components/SkillsSection").then(m => ({ default: m.SkillsSection })));
const ProjectsSection = lazy(() => import("@/components/ProjectsSection").then(m => ({ default: m.ProjectsSection })));
const DeveloperSection = lazy(() => import("@/components/DeveloperSection").then(m => ({ default: m.DeveloperSection })));
const ContactSection = lazy(() => import("@/components/ContactSection").then(m => ({ default: m.ContactSection })));
const Footer = lazy(() => import("@/components/Footer").then(m => ({ default: m.Footer })));

const Index = () => {
  return (
    <div className="sky-page min-h-screen overflow-x-hidden bg-noise">
      <Header />
      <HeroSection />
      <CloudDivider />
      <Suspense fallback={null}>
        <AboutSection />
        <MarqueeSection />
        <SkillsSection />
        <ProjectsSection />
        <DeveloperSection />
        <ContactSection />
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
