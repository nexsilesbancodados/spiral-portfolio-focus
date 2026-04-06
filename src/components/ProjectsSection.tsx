import { motion } from "framer-motion";
import projectsStatue from "@/assets/projects-statue.webp";
import cloudOverlay from "@/assets/cloud-overlay.webp";

const projects = [
  { title: "Plataforma SaaS de Gestão", category: "Sistema Web", tech: "React · Supabase · TanStack" },
  { title: "E-commerce Premium", category: "Landing Page", tech: "Next.js · Tailwind · Stripe" },
  { title: "App de Produtividade", category: "Aplicação Web", tech: "React · OpenAI · Framer Motion" },
  { title: "Portal Corporativo", category: "Website Institucional", tech: "React · CMS · SEO" },
  { title: "Dashboard Analytics", category: "Painel Inteligente", tech: "React · Recharts · PostgreSQL" },
  { title: "Marketplace Digital", category: "Plataforma Web", tech: "Next.js · Supabase · Stripe" },
];

export const ProjectsSection = () => {
  return (
    <section id="projects" className="relative py-16 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--primary)/0.06)_0%,transparent_60%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <span className="text-primary text-sm font-medium tracking-widest uppercase">
            Resultados
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 text-foreground">
            Cada projeto, uma <span className="text-primary">obra-prima</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
            Do conceito à entrega — soluções digitais que geram impacto real.
          </p>
        </motion.div>

        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          {/* Statue — hidden on very small screens, shown from sm up */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="hidden sm:flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.1)_0%,transparent_70%)] scale-150" />
              <img
                src={projectsStatue}
                alt="Estátua grega com laptop — representação artística de projetos FOCUSS DEV"
                width={520}
                height={650}
                className="relative z-10 w-full max-w-[16rem] sm:max-w-[18rem] md:max-w-[22rem] lg:max-w-[26rem] drop-shadow-[0_0_60px_rgba(0,255,150,0.15)] object-contain mx-0 my-[clamp(40px,8vw,106px)] px-0 py-[clamp(20px,4vw,55px)]"
                loading="lazy"
              />
              <img
                src={cloudOverlay}
                alt=""
                width={1200}
                height={1500}
                className="absolute -bottom-56 sm:-bottom-72 md:-bottom-96 left-[75%] -translate-x-1/2 w-[150%] sm:w-[160%] md:w-[180%] max-w-none pointer-events-none z-20"
                aria-hidden="true"
              />
            </div>
          </motion.div>

          {/* Project list */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="space-y-1 sm:space-y-2"
          >
            {projects.map((project, i) => (
              <motion.div
                key={project.title}
                variants={{
                  hidden: { opacity: 0, x: 30 },
                  visible: { opacity: 1, x: 0 },
                }}
                whileHover={{ x: 8, transition: { type: "spring", stiffness: 400 } }}
                className="group flex items-center gap-3 sm:gap-5 rounded-xl px-3 sm:px-5 py-3 sm:py-4 border border-transparent hover:border-primary/20 hover:bg-card/50 transition-all duration-300 cursor-default"
              >
                <span className="text-primary/60 group-hover:text-primary font-bold text-xl sm:text-2xl md:text-3xl tabular-nums transition-colors min-w-[2rem] sm:min-w-[3rem]">
                  0{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2 sm:gap-3 mt-0.5 sm:mt-1">
                    <span className="text-[10px] sm:text-xs font-medium text-primary/70 uppercase tracking-wider">
                      {project.category}
                    </span>
                    <span className="text-border">•</span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground">
                      {project.tech}
                    </span>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                  →
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
