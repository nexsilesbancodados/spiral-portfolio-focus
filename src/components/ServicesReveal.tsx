import { useState, useRef, useCallback } from 'react'
import { Plus, ChevronUp, X } from 'lucide-react'

interface ServiceItem {
  title: string
  description: string
  image: string
}

const services: ServiceItem[] = [
  {
    title: 'Landing Pages',
    description: 'Páginas de alta conversão, otimizadas para SEO, performance e responsividade. Design profissional focado em resultado.',
    image: '/images/service-landing.jpg',
  },
  {
    title: 'Plataformas SaaS',
    description: 'Sistemas completos com autenticação, dashboards, pagamentos recorrentes e APIs robustas. Do MVP ao produto final.',
    image: '/images/service-saas.jpg',
  },
  {
    title: 'Sites Institucionais',
    description: 'Sites multi-páginas que transmitem autoridade e profissionalismo. Blog integrado, CMS e design responsivo.',
    image: '/images/service-site.jpg',
  },
  {
    title: 'Sistemas Web',
    description: 'Aplicações web com painéis administrativos, CRUD completo, integrações com APIs externas e lógica de negócio personalizada.',
    image: '/images/service-sistema.jpg',
  },
  {
    title: 'E-commerce',
    description: 'Lojas online com carrinho de compras, checkout integrado, gestão de produtos e painel de vendas completo.',
    image: '/images/service-ecommerce.jpg',
  },
]

export const ServicesReveal = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }, [])

  const handleNext = useCallback(() => {
    if (openIndex === null) return
    setOpenIndex((openIndex + 1) % services.length)
  }, [openIndex])

  const handlePrev = useCallback(() => {
    if (openIndex === null) return
    setOpenIndex((openIndex - 1 + services.length) % services.length)
  }, [openIndex])

  const handleExit = useCallback(() => {
    setOpenIndex(null)
  }, [])

  const activeImage = openIndex !== null ? services[openIndex].image : services[0].image

  return (
    <div
      ref={sectionRef}
      className="relative w-full max-w-[900px] mx-auto aspect-[4/3] min-h-[420px] rounded-2xl overflow-hidden border border-border bg-card"
      style={{ containerType: 'inline-size' }}
    >
      {/* Image column */}
      <div className="absolute inset-0 pointer-events-none">
        {services.map((service, i) => {
          const isDefault = openIndex === null && i === 0
          const isActive = openIndex === i
          const shouldShow = isDefault || isActive

          return (
            <div
              key={i}
              className="absolute inset-0 transition-all duration-500"
              style={{
                opacity: shouldShow ? 1 : 0,
                transform: shouldShow
                  ? 'translateX(0) scale(1)'
                  : openIndex !== null
                    ? 'translateX(-8%) scale(0.95)'
                    : 'translateX(8%) scale(0.95)',
                transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              <img
                src={service.image}
                alt={service.title}
                loading="lazy"
                width={900}
                height={900}
                className="absolute top-0 right-0 h-full w-full object-cover"
                style={{ objectPosition: 'center' }}
              />
            </div>
          )
        })}
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-card via-card/80 to-transparent" />
      </div>

      {/* Details column */}
      <div className="relative z-10 flex flex-col justify-center gap-2 p-6 sm:p-10 lg:pl-14 h-full max-w-[340px]">
        {services.map((service, i) => {
          const isOpen = openIndex === i

          return (
            <button
              key={i}
              onClick={() => handleToggle(i)}
              className="group text-left transition-all duration-500 rounded-full overflow-hidden"
              style={{
                background: isOpen
                  ? 'hsl(var(--primary) / 0.15)'
                  : 'hsl(var(--foreground) / 0.08)',
                backdropFilter: 'blur(20px) saturate(180%)',
              }}
            >
              {/* Summary row */}
              <div
                className="flex items-center gap-2 px-4 py-3 cursor-pointer transition-opacity duration-300"
                style={{ opacity: isOpen ? 0.4 : 1 }}
              >
                <Plus
                  className="w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300"
                  style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0)' }}
                />
                <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                  {service.title}
                </span>
              </div>

              {/* Expanded content */}
              <div
                className="overflow-hidden transition-all duration-500"
                style={{
                  maxHeight: isOpen ? '200px' : '0',
                  opacity: isOpen ? 1 : 0,
                  marginTop: isOpen ? '-44px' : '0',
                  transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                <div className="px-4 pt-12 pb-4">
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Navigation controls */}
      <div
        className="absolute right-4 top-4 z-20 transition-all duration-300"
        style={{
          opacity: openIndex !== null ? 1 : 0,
          transform: openIndex !== null ? 'translateY(0)' : 'translateY(8px)',
          pointerEvents: openIndex !== null ? 'auto' : 'none',
        }}
      >
        <button
          onClick={handleExit}
          className="w-9 h-9 rounded-full bg-foreground/10 backdrop-blur-md flex items-center justify-center hover:bg-foreground/20 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-4 h-4 text-foreground" />
        </button>
      </div>

      <div
        className="absolute left-4 top-1/2 z-20 flex flex-col gap-2 transition-all duration-300"
        style={{
          opacity: openIndex !== null ? 1 : 0,
          transform: openIndex !== null ? 'translateY(-50%)' : 'translateY(calc(-50% + 8px))',
          pointerEvents: openIndex !== null ? 'auto' : 'none',
        }}
      >
        <button
          onClick={handlePrev}
          className="w-9 h-9 rounded-full bg-foreground/10 backdrop-blur-md flex items-center justify-center hover:bg-foreground/20 transition-colors"
          aria-label="Anterior"
        >
          <ChevronUp className="w-4 h-4 text-foreground" />
        </button>
        <button
          onClick={handleNext}
          className="w-9 h-9 rounded-full bg-foreground/10 backdrop-blur-md flex items-center justify-center hover:bg-foreground/20 transition-colors"
          aria-label="Próximo"
        >
          <ChevronUp className="w-4 h-4 text-foreground rotate-180" />
        </button>
      </div>
    </div>
  )
}
