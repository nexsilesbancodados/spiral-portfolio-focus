import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Plataforma SaaS de Gestão",
    category: "Sistema Web",
    description: "Dashboard completo com analytics, gestão de equipes e relatórios automatizados.",
    tech: ["React", "TypeScript", "Supabase", "TanStack Query"],
    gradient: "from-primary/20 to-primary/5",
  },
  {
    title: "E-commerce Premium",
    category: "Landing Page",
    description: "Loja virtual com design premium, checkout otimizado e integração de pagamentos.",
    tech: ["Next.js", "Tailwind", "Stripe", "PostgreSQL"],
    gradient: "from-blue-500/20 to-blue-500/5",
  },
  {
    title: "App de Produtividade",
    category: "Aplicação Web",
    description: "Ferramenta de gestão de tarefas com IA integrada para sugestões inteligentes.",
    tech: ["React", "OpenAI", "Supabase", "Framer Motion"],
    gradient: "from-purple-500/20 to-purple-500/5",
  },
  {
    title: "Portal Corporativo",
    category: "Website Institucional",
    description: "Site institucional com blog, área de clientes e sistema de agendamento.",
    tech: ["React", "CMS", "SEO", "Analytics"],
    gradient: "from-amber-500/20 to-amber-500/5",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

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

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-6"
        >
          {projects.map((project) => (
            <motion.div
              key={project.title}
              variants={item}
              whileHover={{ y: -6, transition: { type: "spring", stiffness: 400 } }}
              className="group relative rounded-2xl bg-card border border-border hover:border-primary/30 overflow-hidden transition-all duration-300"
            >
              {/* Gradient preview area */}
              <div className={`h-48 bg-gradient-to-br ${project.gradient} flex items-center justify-center`}>
                <div className="w-3/4 h-28 rounded-lg bg-background/60 border border-border/50" />
              </div>

              <div className="p-6 md:p-8">
                <span className="text-xs text-primary font-medium tracking-widest uppercase">
                  {project.category}
                </span>
                <h3 className="text-xl font-semibold mt-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground mt-2 leading-relaxed text-sm">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full bg-secondary text-xs text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <button className="mt-6 inline-flex items-center gap-2 text-sm text-primary hover:underline">
                  Ver detalhes <ExternalLink size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
