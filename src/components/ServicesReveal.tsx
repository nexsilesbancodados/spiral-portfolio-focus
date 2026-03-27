import { useState, useCallback } from 'react'
import { Code2, LayoutDashboard, Globe, ShoppingCart, Rocket } from 'lucide-react'

interface ServiceItem {
  title: string
  description: string
  icon: typeof Code2
  features: string[]
}

const services: ServiceItem[] = [
  {
    title: 'Landing Pages',
    description: 'Páginas de alta conversão, otimizadas para SEO, performance e responsividade. Design profissional focado em resultado.',
    icon: Rocket,
    features: ['SEO otimizado', 'Alta conversão', 'Mobile first', 'Carregamento rápido'],
  },
  {
    title: 'Plataformas SaaS',
    description: 'Sistemas completos com autenticação, dashboards, pagamentos recorrentes e APIs robustas. Do MVP ao produto final.',
    icon: Code2,
    features: ['Autenticação', 'Dashboards', 'Pagamentos', 'API REST'],
  },
  {
    title: 'Sites Institucionais',
    description: 'Sites multi-páginas que transmitem autoridade e profissionalismo. Blog integrado, CMS e design responsivo.',
    icon: Globe,
    features: ['Multi-páginas', 'Blog integrado', 'CMS', 'Design responsivo'],
  },
  {
    title: 'Sistemas Web',
    description: 'Aplicações web com painéis administrativos, CRUD completo, integrações com APIs externas e lógica de negócio personalizada.',
    icon: LayoutDashboard,
    features: ['Painel admin', 'CRUD completo', 'Integrações', 'Relatórios'],
  },
  {
    title: 'E-commerce',
    description: 'Lojas online com carrinho de compras, checkout integrado, gestão de produtos e painel de vendas completo.',
    icon: ShoppingCart,
    features: ['Carrinho', 'Checkout', 'Gestão de estoque', 'Painel de vendas'],
  },
]

export const ServicesReveal = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const handleToggle = useCallback((index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index))
  }, [])

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service, i) => {
        const isActive = activeIndex === i
        const Icon = service.icon

        return (
          <button
            key={i}
            onClick={() => handleToggle(i)}
            className={`group relative text-left rounded-2xl border p-6 sm:p-8 transition-all duration-500 overflow-hidden ${
              isActive
                ? 'border-primary/40 bg-primary/5'
                : 'border-border/50 bg-card hover:border-border'
            } ${i === 4 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
            style={{
              boxShadow: isActive
                ? '0 0 40px hsl(var(--primary) / 0.08)'
                : 'none',
            }}
          >
            {/* Glow */}
            <div
              className="absolute -top-20 -right-20 w-40 h-40 rounded-full transition-opacity duration-500 pointer-events-none"
              style={{
                background: 'hsl(var(--primary) / 0.1)',
                filter: 'blur(60px)',
                opacity: isActive ? 1 : 0,
              }}
            />

            <div className="relative z-10">
              {/* Icon + Title */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{
                    background: isActive
                      ? 'hsl(var(--primary) / 0.2)'
                      : 'hsl(var(--secondary))',
                  }}
                >
                  <Icon
                    className="w-5 h-5 transition-colors duration-300"
                    style={{
                      color: isActive
                        ? 'hsl(var(--primary))'
                        : 'hsl(var(--muted-foreground))',
                    }}
                  />
                </div>
                <h3 className="text-lg font-bold text-foreground">{service.title}</h3>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {service.description}
              </p>

              {/* Features - shown on active */}
              <div
                className="overflow-hidden transition-all duration-500"
                style={{
                  maxHeight: isActive ? '120px' : '0',
                  opacity: isActive ? 1 : 0,
                  transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                <div className="flex flex-wrap gap-2 pt-2 border-t border-border/30">
                  {service.features.map((feat, j) => (
                    <span
                      key={j}
                      className="text-xs px-3 py-1.5 rounded-full font-medium"
                      style={{
                        background: 'hsl(var(--primary) / 0.1)',
                        color: 'hsl(var(--primary))',
                      }}
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
