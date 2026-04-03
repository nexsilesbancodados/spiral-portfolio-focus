import { motion } from "framer-motion";
import projectsStatue from "@/assets/projects-statue.png";
import cloudOverlay from "@/assets/cloud-overlay.png";

const projects = [
  { title: "Plataforma SaaS de Gestão", category: "Sistema Web" },
  { title: "E-commerce Premium", category: "Landing Page" },
  { title: "App de Produtividade", category: "Aplicação Web" },
  { title: "Portal Corporativo", category: "Website Institucional" },
  { title: "Dashboard Analytics", category: "Painel Inteligente" },
  { title: "Marketplace Digital", category: "Plataforma Web" },
];

export const ProjectsSection = () => {
  return (
    <section id="projects" className="relative py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium tracking-widest uppercase">
            Resultados
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4">
            Cada projeto, uma <span className="text-primary">obra-prima</span>
          </h2>
        </motion.div>

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Statue */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex justify-center"
          >
            <div className="relative">
              <img
                src={projectsStatue}
                alt="Estátua grega com laptop — representação artística de projetos FOCUSS DEV"
                className="w-full max-w-[24rem] md:max-w-[28rem] drop-shadow-[0_0_40px_rgba(0,255,150,0.12)]"
                loading="lazy"
              />
              <img
                src={cloudOverlay}
                alt=""
                className="absolute -bottom-28 left-1/2 -translate-x-1/2 w-[140%] max-w-none pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </motion.div>

          {/* Project list */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="space-y-4"
          >
            {projects.map((project, i) => (
              <motion.div
                key={project.title}
                variants={{
                  hidden: { opacity: 0, x: 30 },
                  visible: { opacity: 1, x: 0 },
                }}
                className="flex items-center gap-4 border-b border-border/40 pb-4"
              >
                <span className="text-primary font-bold text-2xl tabular-nums">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {project.title}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {project.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
