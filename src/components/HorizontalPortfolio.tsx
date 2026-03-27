import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface PortfolioCard {
  badge: string
  title: string
  description: string
  price: string
}

const portfolioCards: PortfolioCard[] = [
  {
    badge: 'SaaS',
    title: 'Plataforma de Gestão',
    description: 'Sistema SaaS completo com autenticação, dashboards interativos, pagamentos recorrentes e API REST robusta.',
    price: 'Sob consulta',
  },
  {
    badge: 'Sistema Web',
    title: 'Painel Administrativo',
    description: 'CRUD completo com filtros avançados, exportação de dados, permissões de usuário e integrações externas.',
    price: 'A partir de R$ 3.500',
  },
  {
    badge: 'Landing Page',
    title: 'Página de Conversão',
    description: 'Design de alta conversão otimizado para SEO, performance e responsividade em todos os dispositivos.',
    price: 'A partir de R$ 1.200',
  },
  {
    badge: 'E-commerce',
    title: 'Loja Online Completa',
    description: 'Carrinho de compras, checkout integrado, gestão de produtos, estoque e painel de vendas em tempo real.',
    price: 'A partir de R$ 4.800',
  },
  {
    badge: 'Site Institucional',
    title: 'Presença Digital',
    description: 'Site multi-páginas que transmite autoridade e profissionalismo. Blog integrado, CMS e design responsivo.',
    price: 'A partir de R$ 2.000',
  },
]

export const HorizontalPortfolio = () => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const track = trackRef.current
    if (!wrapper || !track) return

    const getDistance = () => {
      const trackWidth = track.scrollWidth
      const screenWidth = window.innerWidth
      const gap = window.innerWidth > 1024 ? 100 : 20
      return Math.max(0, trackWidth - screenWidth + gap)
    }

    const distance = getDistance()

    const tween = gsap.fromTo(
      track,
      { x: 0 },
      {
        x: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: () => `+=${distance}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      }
    )

    return () => {
      tween.kill()
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === wrapper) st.kill()
      })
    }
  }, [])

  return (
    <div
      ref={wrapperRef}
      className="h-screen overflow-hidden flex items-center relative"
    >
      <div
        ref={trackRef}
        className="flex gap-10 will-change-transform"
        style={{ paddingLeft: '10vw' }}
      >
        {portfolioCards.map((card, i) => (
          <div
            key={i}
            className="flex-shrink-0 flex flex-col justify-between rounded-[2rem] p-10 sm:p-12 border border-border/50 min-w-[85vw] sm:min-w-[420px] h-[520px] bg-card"
            style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
          >
            <div>
              <span
                className="inline-block rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider"
                style={{
                  background: 'hsl(var(--primary) / 0.15)',
                  color: 'hsl(var(--primary))',
                }}
              >
                {card.badge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground mt-6">
                {card.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mt-4">
                {card.description}
              </p>
            </div>
            <div className="text-xl font-bold text-primary mt-auto pt-4">
              {card.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
