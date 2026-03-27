import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Instagram, Mail, MessageCircle } from 'lucide-react'
import { ContactModal } from '@/components/ContactModal'
import { ServicesReveal } from '@/components/ServicesReveal'
import { TiltedCard } from '@/components/TiltedCard'
import { DesignStackCards } from '@/components/DesignStackCards'
import { VibeCodesSection } from '@/components/VibeCodesSection'
import { HorizontalPortfolio } from '@/components/HorizontalPortfolio'
import { WaveDivider } from '@/components/WaveDivider'

const WHATSAPP_LINK = "https://api.whatsapp.com/send/?phone=5533984123591&text=Olá! Vim pelo site e gostaria de saber mais sobre os serviços."
const INSTAGRAM_LINK = "https://instagram.com/focussdev"
const EMAIL = "devcriador1@gmail.com"

const Index = () => {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [contactOpen, setContactOpen] = useState(false)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up')
            observerRef.current?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#inicio" className="font-display text-xl font-bold tracking-tight">
            FOCUSS<span className="text-primary"> DEV</span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#servicos" className="hover:text-foreground transition-colors">Serviços</a>
            <a href="#portfolio" className="hover:text-foreground transition-colors">Portfólio</a>
            <a href="#sobre" className="hover:text-foreground transition-colors">Sobre mim</a>
          </nav>
          <button
            onClick={() => setContactOpen(true)}
            className="bg-primary text-primary-foreground px-5 py-2 text-sm font-semibold rounded-md hover:brightness-110 transition-all"
          >
            Contratar
          </button>
        </div>
      </header>

      {/* Hero */}
      <section id="inicio" className="relative min-h-screen flex items-center pt-16">
        <div className="max-w-6xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 stagger-children">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
              SaaS · Sistemas · Landing Pages · Sites
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
              Transformo ideias{' '}
              <br />
              <span className="text-muted-foreground">em produtos digitais.</span>
            </h1>
            <p className="text-muted-foreground text-base lg:text-lg max-w-md leading-relaxed">
              Desenvolvimento de <span className="text-primary font-medium">SaaS, sistemas web, landing pages e sites</span> com
              código limpo, performance e foco em resultado.
            </p>
            <p className="text-muted-foreground/70 text-sm max-w-md">
              Da ideia ao deploy. Eu projeto, desenvolvo e entrego o produto completo para o seu negócio escalar.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => setContactOpen(true)}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 font-semibold rounded-md hover:brightness-110 transition-all text-sm"
              >
                Criar meu projeto
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#portfolio"
                className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 font-medium rounded-md hover:bg-secondary transition-all text-sm"
              >
                Ver Portfólio
              </a>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="relative z-10">
              <img
                src="/images/hero-portrait.jpg"
                alt="FOCUSS DEV - Desenvolvedor Web"
                width={1024}
                height={1280}
                className="w-full max-w-lg ml-auto rounded-lg"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      {/* Logo Bar */}
      <section className="border-y border-border/50 bg-secondary/30 py-6 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 flex items-center gap-8">
          <p className="text-sm font-semibold text-muted-foreground whitespace-nowrap min-w-fit">
            Experiência com<br />grandes empresas
          </p>
          <div className="overflow-hidden flex-1">
            <div className="flex gap-12 animate-marquee whitespace-nowrap">
              {['TechCorp', 'StartupX', 'DigitalFlow', 'AppVerse', 'CloudBase', 'DataSync', 'TechCorp', 'StartupX', 'DigitalFlow', 'AppVerse', 'CloudBase', 'DataSync'].map((name, i) => (
                <span key={i} className="text-muted-foreground/40 font-bold text-xl tracking-wider uppercase">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <WaveDivider />

      {/* Services */}
      <section id="servicos" className="py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16" data-animate>
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">O que eu construo</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Soluções digitais<br />
              <span className="text-muted-foreground">sob medida.</span>
            </h2>
          </div>

          <ServicesReveal />

          <div className="text-center mt-16" data-animate style={{ opacity: 0 }}>
            <p className="text-muted-foreground mb-6 text-lg">
              Cada projeto é único. <span className="text-foreground font-semibold">Código limpo, arquitetura sólida e entrega profissional.</span>
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setContactOpen(true)}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 font-semibold rounded-md hover:brightness-110 transition-all text-sm"
              >
                Criar meu projeto
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#portfolio"
                className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 font-medium rounded-md hover:bg-secondary transition-all text-sm"
              >
                Ver Portfólio
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Design */}
      <section className="relative">
        <div className="text-center pt-24 lg:pt-32 pb-8 px-6" data-animate>
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">Design Digital</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Design que<br />
            <span className="text-muted-foreground">comunica e converte.</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            Cada interface é pensada para guiar o usuário, transmitir profissionalismo e gerar resultados.
          </p>
        </div>
        <DesignStackCards />
      </section>

      {/* Portfolio - Horizontal Scroll */}
      <section id="portfolio">
        <div className="text-center pt-24 lg:pt-32 pb-8 px-6" data-animate>
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">Projetos & Serviços</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            SaaS, Sistemas<br />
            <span className="text-muted-foreground">& Landing Pages</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            Produtos digitais desenvolvidos com tecnologias modernas, performance otimizada e design de alto padrão.
          </p>
        </div>
        <HorizontalPortfolio />
      </section>


      <WaveDivider topColor="hsl(var(--primary) / 0.2)" />

      {/* About */}
      <section id="sobre" className="py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative flex items-center justify-center" data-animate>
              <TiltedCard
                imageSrc="https://i.postimg.cc/Y0HCSbqG/Whats-App-Image-2025-12-22-at-12-38-53.jpg"
                altText="Raiam Santos McArn"
                captionText="Raiam Santos McArn"
                containerHeight="450px"
                containerWidth="400px"
                imageHeight="450px"
                imageWidth="400px"
                rotateAmplitude={12}
                scaleOnHover={1.1}
                showTooltip={true}
                displayOverlayContent={true}
                overlayContent={
                  <p className="text-foreground font-bold text-lg drop-shadow-lg">
                    Raiam Santos McArn
                  </p>
                }
              />
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
            </div>
            <div className="space-y-6" data-animate style={{ opacity: 0 }}>
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Conheça um pouco mais sobre mim</p>
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
                Desenvolvedor<br />
                <span className="text-muted-foreground">Full Stack</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Especialista em criar produtos digitais completos — de SaaS a sistemas web complexos.
                Trabalho com React, TypeScript, Node.js, bancos de dados e deploy em cloud.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Já desenvolvi plataformas, painéis administrativos, landing pages e sites para
                empresas de diferentes segmentos. Foco em código limpo, performance e escalabilidade.
              </p>
              <button
                onClick={() => setContactOpen(true)}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 font-semibold rounded-md hover:brightness-110 transition-all text-sm"
              >
                Entrar em contato
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Vibe Codes */}
      <VibeCodesSection />

      {/* CTA Final */}
      <section id="contato" className="py-24 lg:py-32 bg-secondary/20 border-y border-border/50">
        <div className="max-w-3xl mx-auto px-6 text-center" data-animate>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            Tem uma ideia?<br />
            <span className="text-primary">Eu transformo em produto.</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            SaaS, sistemas, landing pages ou sites — eu projeto, desenvolvo e entrego
            o produto digital completo para o seu negócio.
          </p>
          <button
            onClick={() => setContactOpen(true)}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-bold rounded-md hover:brightness-110 transition-all text-base"
          >
            Quero meu projeto profissional
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-display text-lg font-bold">
                FOCUSS<span className="text-primary"> DEV</span>
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                © {new Date().getFullYear()} – FOCUSS DEV. Todos os Direitos Reservados.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="WhatsApp">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href={`mailto:${EMAIL}`} className="text-muted-foreground hover:text-primary transition-colors" aria-label="Email">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        whatsappLink={WHATSAPP_LINK}
        instagramLink={INSTAGRAM_LINK}
        email={EMAIL}
      />
    </div>
  )
}

export default Index
