import { useRef, useEffect, useState } from 'react'
import { ArrowRight, ExternalLink } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Project {
  title: string
  category: string
  description: string
  image: string
  tags: string[]
  highlight?: string
}

const projects: Project[] = [
  {
    title: 'Dashboard SaaS Analytics',
    category: 'SaaS',
    description:
      'Plataforma SaaS completa com dashboard de analytics, autenticação multi-tenant, pagamentos recorrentes via Stripe e API REST robusta.',
    image: '/images/project-saas-dashboard.jpg',
    tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Stripe'],
    highlight: 'Projeto em destaque',
  },
  {
    title: 'E-commerce Premium',
    category: 'E-commerce',
    description:
      'Loja online completa com carrinho inteligente, checkout otimizado, gestão de estoque e painel de vendas em tempo real.',
    image: '/images/project-ecommerce.jpg',
    tags: ['Next.js', 'Supabase', 'Tailwind', 'Stripe'],
  },
  {
    title: 'Landing Page de Conversão',
    category: 'Landing Page',
    description:
      'Página de alta conversão com A/B testing, animações performáticas, SEO otimizado e integração com CRM.',
    image: '/images/project-landing-page.jpg',
    tags: ['React', 'GSAP', 'SEO', 'Analytics'],
  },
  {
    title: 'Painel Administrativo',
    category: 'Sistema Web',
    description:
      'CRUD completo com filtros avançados, exportação de dados, permissões granulares e integrações com APIs externas.',
    image: '/images/project-admin-panel.jpg',
    tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
  },
  {
    title: 'Site Institucional Corporativo',
    category: 'Site Institucional',
    description:
      'Site multi-páginas que transmite autoridade, com blog integrado, CMS headless e design 100% responsivo.',
    image: '/images/project-institutional.jpg',
    tags: ['Next.js', 'CMS', 'SEO', 'Tailwind'],
  },
  {
    title: 'Plataforma de IA Conversacional',
    category: 'SaaS + IA',
    description:
      'Chatbot inteligente com processamento de linguagem natural, histórico de conversas e integração multi-canal.',
    image: '/images/project-ai-chat.jpg',
    tags: ['React', 'OpenAI', 'Supabase', 'WebSocket'],
  },
]

export const ProjectsShowcase = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const cards = section.querySelectorAll('.project-card')
    gsap.fromTo(
      cards,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
        },
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [])

  return (
    <section ref={sectionRef} id="projetos" className="py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">
            Projetos Realizados
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Portfólio de{' '}
            <span className="text-muted-foreground">projetos reais.</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            Cada projeto é pensado do zero com foco em performance, escalabilidade e resultado.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <div
              key={i}
              className="project-card group relative rounded-2xl border border-border/50 bg-card overflow-hidden cursor-pointer"
              style={{ opacity: 0 }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {project.highlight && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-block px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full bg-primary text-primary-foreground">
                    {project.highlight}
                  </span>
                </div>
              )}

              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  width={1280}
                  height={800}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    background:
                      'linear-gradient(to top, hsl(var(--card)) 0%, transparent 60%)',
                    opacity: hoveredIndex === i ? 0.9 : 0.6,
                  }}
                />
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                    <ExternalLink className="w-4 h-4 text-primary-foreground" />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <span
                  className="inline-block text-[10px] uppercase tracking-wider font-bold mb-2"
                  style={{ color: 'hsl(var(--primary))' }}
                >
                  {project.category}
                </span>
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-secondary text-muted-foreground font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 font-medium rounded-md hover:bg-secondary transition-all text-sm">
            Ver todos os projetos
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
