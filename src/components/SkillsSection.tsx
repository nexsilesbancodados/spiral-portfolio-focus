import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import skillsStatue from "@/assets/skills-statue.png";
import cloudCover from "@/assets/cloud-cover.png";
import "./SkillsSection.css";

const skillCategories = [
  {
    title: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "shadcn/ui"],
  },
  {
    title: "Backend",
    skills: ["Node.js", "Supabase", "PostgreSQL", "Edge Functions", "REST APIs", "Python"],
  },
  {
    title: "DevOps & Tools",
    skills: ["Git", "Docker", "Vercel", "AWS", "CI/CD", "Figma"],
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const SkillsSection = () => {
  const statueRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !statueRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(statueRef.current, {
        y: -10,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" className="relative py-20 md:py-32">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
          {/* Coluna esquerda — Estátua */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center lg:justify-start"
          >
            <div className="relative w-full max-w-[22rem] sm:max-w-[26rem] lg:max-w-[30rem]">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent blur-3xl rounded-full" />
              <img
                ref={statueRef}
                src={skillsStatue}
                alt="Estátua grega com óculos lendo tablet — representação artística do domínio técnico"
                className="relative z-10 w-full drop-shadow-2xl will-change-transform"
                loading="lazy"
              />
              <img
                src={cloudCover}
                alt=""
                className="absolute left-1/2 -translate-x-1/2 z-20 w-[200%] max-w-none pointer-events-none"
                style={{ bottom: '-88%' }}
              />
            </div>
          </motion.div>

          {/* Coluna direita — Skills */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <span className="text-primary text-sm font-medium tracking-widest uppercase">
                Tecnologias
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 text-white">
                Stack <span className="text-primary">técnico</span>
              </h2>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="space-y-6"
            >
              {skillCategories.map((cat) => (
                <motion.div
                  key={cat.title}
                  variants={item}
                  className="p-5 md:p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
                >
                  <h3 className="text-lg font-semibold text-primary mb-4">{cat.title}</h3>
                  <div className="flex flex-wrap gap-4">
                    {cat.skills.map((skill) => (
                      <button key={skill} className="skill-bloom-button">
                        <div className="bloom-container">
                          <div className="button-container-main">
                            <div className="button-inner">
                              <div className="back" />
                              <div className="front" />
                              <div className="content-wrapper">
                                <span className="text-content">{skill}</span>
                              </div>
                            </div>
                            <div className="button-glass" />
                          </div>
                          <div className="bloom bloom1" />
                          <div className="bloom bloom2" />
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};