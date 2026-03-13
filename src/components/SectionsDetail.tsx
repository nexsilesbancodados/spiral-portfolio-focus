import React, { useEffect, useRef, useState, useCallback, lazy, Suspense, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger); // v2

const FocussChat = lazy(() => import('@/components/FocussChat').then(m => ({ default: m.FocussChat })));
const TechLogosMarquee = lazy(() => import('@/components/TechLogosMarquee'));

const sections = [
  {
    id: 'focuss-dev',
    subtitle: 'Quem Somos',
    title: 'FOCUSS DEV',
    description: 'Somos uma equipe apaixonada por tecnologia e inovação. Na FOCUSS DEV, transformamos ideias em experiências digitais extraordinárias, combinando design de alto impacto com código robusto e escalável.',
    details: [
      'Mais de 5 anos de experiência em desenvolvimento web',
      'Projetos entregues para startups e grandes empresas',
      'Foco em performance, acessibilidade e experiência do usuário',
      'Metodologias ágeis e entrega contínua',
    ],
    image: '/images/slide-01.jpg',
  },
  {
    id: 'web-design',
    subtitle: 'Criação Visual',
    title: 'Web Design',
    description: 'Interfaces modernas e elegantes que conectam marcas ao futuro digital. Nosso processo de design combina pesquisa de usuário, prototipagem rápida e uma estética visual impactante.',
    details: [
      'Design responsivo e mobile-first',
      'Prototipagem interativa no Figma',
      'Criação de Design Systems consistentes',
      'Testes de usabilidade e iteração contínua',
    ],
    image: '/images/webdesign-gallery-02.jpg',
  },
  {
    id: 'desenvolvimento',
    subtitle: 'Código & Performance',
    title: 'Desenvolvimento',
    description: 'Código limpo, performance máxima e arquitetura escalável. Utilizamos as melhores práticas e tecnologias modernas para construir aplicações robustas e de alta qualidade.',
    details: [
      'Arquitetura limpa e código manutenível',
      'APIs REST e GraphQL performáticas',
      'Integração contínua e deploy automatizado',
      'Banco de dados otimizados com PostgreSQL',
    ],
    image: '/images/dev-detail-01.jpg',
  },
  {
    id: 'servicos',
    subtitle: 'Nossos Serviços',
    title: 'Serviços',
    description: 'Soluções digitais completas para impulsionar seu negócio. Do tráfego pago à criação de sistemas complexos, oferecemos tudo o que você precisa para dominar o digital.',
    details: [
      '📈 Tráfego Pago — Campanhas estratégicas no Google Ads, Meta Ads e TikTok Ads com ROI maximizado',
      '🌐 Criação de Sites — Sites modernos, responsivos e otimizados para SEO com tecnologias de ponta',
      '📱 Criação de Apps — Aplicativos nativos e multiplataforma para iOS, Android e PWA',
      '⚙️ Sistemas & SaaS — Plataformas escaláveis sob medida, ERPs, CRMs e dashboards',
      '🚀 Landing Pages — Páginas de alta conversão com design persuasivo e funis otimizados',
      '🎨 Design — Identidade visual completa, UI/UX premium e prototipagem interativa',
    ],
    image: '/images/servicos-detail-02.jpg',
  },
  {
    id: 'inovacao-ia',
    subtitle: 'Futuro Digital',
    title: 'Inovação e IA',
    description: 'Tecnologias de ponta e inteligência artificial para soluções que fazem a diferença. Integramos IA nos nossos projetos para criar experiências inteligentes e personalizadas.',
    details: [
      'Integração com modelos de Machine Learning',
      'Automação inteligente de processos',
      'Infraestrutura cloud escalável na AWS',
      'Chatbots e assistentes virtuais customizados',
    ],
    image: '/images/ia-gallery-02.jpg',
  },
  {
    id: 'mobile-web',
    subtitle: 'Multiplataforma',
    title: 'Mobile e Web',
    description: 'Aplicações responsivas e multiplataforma que funcionam perfeitamente em qualquer dispositivo. Do mobile ao desktop, garantimos consistência e performance.',
    details: [
      'Apps nativos com React Native',
      'Progressive Web Apps (PWA)',
      'Layouts 100% responsivos',
      'Deploy containerizado com Docker',
    ],
    image: '/images/mobile-gallery-01.jpg',
  },
  {
    id: 'skills',
    subtitle: 'Competências Técnicas',
    title: 'Skills',
    description: 'Domínio completo do ecossistema de desenvolvimento moderno. Das linguagens de programação aos frameworks mais avançados, cada skill é refinada com prática e projetos reais.',
    details: [
      'React, Next.js, TypeScript — Front-end de alta performance',
      'Node.js, Python, Go — Back-end escalável e robusto',
      'PostgreSQL, MongoDB, Redis — Dados otimizados e resilientes',
      'AWS, Docker, CI/CD — Infraestrutura cloud automatizada',
      'Figma, GSAP, Three.js — Design e animações cinematográficas',
      'Git, Scrum, TDD — Processos ágeis e código confiável',
    ],
    image: '/images/skills-detail-01.jpg',
  },
];

// Per-section detail images (labels removed for cleanliness)
const sectionGallery: Record<string, { images: { src: string; alt: string }[]; layout: 'panoramic-duo' | 'trio' | 'asymmetric' | 'stacked' }> = {
  'web-design': {
    layout: 'panoramic-duo',
    images: [
      { src: '/images/webdesign-gallery-03.jpg', alt: 'Studio' },
      { src: '/images/webdesign-gallery-01.jpg', alt: 'Prototipagem' },
      { src: '/images/webdesign-gallery-02.jpg', alt: 'Criação' },
    ],
  },
  'inovacao-ia': {
    layout: 'trio',
    images: [
      { src: '/images/ia-gallery-01.jpg', alt: 'Laboratório IA' },
      { src: '/images/ia-detail-02.jpg', alt: 'Automação' },
      { src: '/images/ia-detail-01.jpg', alt: 'Futuro' },
    ],
  },
  'mobile-web': {
    layout: 'stacked',
    images: [
      { src: '/images/mobile-detail-02.jpg', alt: 'Multiplataforma' },
    ],
  },
  'servicos': {
    layout: 'asymmetric',
    images: [
      { src: '/images/servicos-detail-01.jpg', alt: 'Marketing Digital' },
      { src: '/images/servicos-detail-02.jpg', alt: 'Desenvolvimento' },
    ],
  },
  'skills': {
    layout: 'panoramic-duo',
    images: [
      { src: '/images/dev-detail-02.jpg', alt: 'Conferência' },
    ],
  },
};

// Static color palette — moved outside component to avoid recreation each render
const sectionColors: Record<string, { accent: string; accentHsl: string; gradient: string; overlay: string; titleBg: string; titleGradient: string; glowColor: string }> = {
  'focuss-dev':       { accent: 'text-blue-400',      accentHsl: '210 90% 60%',   gradient: 'linear-gradient(90deg, hsl(210 90% 60%), hsl(230 80% 65%))',          overlay: 'none', titleBg: '', titleGradient: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(210 90% 70%) 40%, hsl(230 80% 60%) 70%, hsl(210 90% 50%) 100%)', glowColor: 'hsl(210 90% 60% / 0.4)' },
  'web-design':       { accent: 'text-orange-400',     accentHsl: '25 95% 55%',    gradient: 'linear-gradient(90deg, hsl(25 95% 55%), hsl(335 75% 55%))',           overlay: 'linear-gradient(135deg, hsl(25 95% 55% / 0.12), hsl(335 75% 55% / 0.08), transparent 70%)', titleBg: '', titleGradient: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(25 95% 65%) 30%, hsl(335 75% 55%) 65%, hsl(25 95% 45%) 100%)', glowColor: 'hsl(25 95% 55% / 0.35)' },
  'desenvolvimento':  { accent: 'text-emerald-400',    accentHsl: '160 70% 50%',   gradient: 'linear-gradient(90deg, hsl(160 70% 50%), hsl(190 80% 55%))',          overlay: 'linear-gradient(225deg, hsl(160 70% 50% / 0.12), hsl(190 80% 55% / 0.08), transparent 60%)', titleBg: '', titleGradient: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(160 70% 60%) 30%, hsl(190 80% 50%) 65%, hsl(160 70% 40%) 100%)', glowColor: 'hsl(160 70% 50% / 0.35)' },
  'servicos':         { accent: 'text-purple-400',     accentHsl: '270 70% 60%',   gradient: 'linear-gradient(90deg, hsl(270 70% 60%), hsl(300 65% 55%))',          overlay: 'linear-gradient(180deg, hsl(270 70% 60% / 0.1), hsl(300 65% 55% / 0.06), transparent)', titleBg: '', titleGradient: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(270 70% 70%) 30%, hsl(300 65% 55%) 65%, hsl(270 70% 50%) 100%)', glowColor: 'hsl(270 70% 60% / 0.35)' },
  'inovacao-ia':      { accent: 'text-pink-400',       accentHsl: '335 75% 55%',   gradient: 'linear-gradient(90deg, hsl(335 75% 55%), hsl(355 85% 60%))',          overlay: 'linear-gradient(180deg, hsl(335 75% 55% / 0.1), hsl(25 95% 55% / 0.08), transparent)', titleBg: '', titleGradient: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(335 75% 65%) 30%, hsl(355 85% 55%) 65%, hsl(335 75% 45%) 100%)', glowColor: 'hsl(335 75% 55% / 0.35)' },
  'mobile-web':       { accent: 'text-amber-400',      accentHsl: '40 100% 50%',   gradient: 'linear-gradient(90deg, hsl(40 100% 50%), hsl(30 95% 55%))',           overlay: 'linear-gradient(135deg, hsl(40 100% 50% / 0.1), hsl(175 70% 45% / 0.06), transparent 70%)', titleBg: '', titleGradient: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(40 100% 60%) 30%, hsl(30 95% 50%) 65%, hsl(40 100% 40%) 100%)', glowColor: 'hsl(40 100% 50% / 0.35)' },
  'skills':           { accent: 'text-cyan-400',       accentHsl: '185 80% 55%',   gradient: 'linear-gradient(90deg, hsl(185 80% 55%), hsl(210 75% 60%))',          overlay: 'linear-gradient(225deg, hsl(185 80% 55% / 0.1), hsl(210 75% 60% / 0.06), transparent 60%)', titleBg: '', titleGradient: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(185 80% 65%) 30%, hsl(210 75% 55%) 65%, hsl(185 80% 45%) 100%)', glowColor: 'hsl(185 80% 55% / 0.35)' },
};

// ─── Extended deep-dive content per section ──────────────────────
type DeepDiveBlock = {
  heading: string;
  body: string;
  highlights?: string[];
  stat?: { value: string; label: string };
};

const sectionDeepDive: Record<string, DeepDiveBlock[]> = {
  'focuss-dev': [
    {
      heading: 'Nossa Missão',
      body: 'Acreditamos que tecnologia de ponta deve ser acessível a todos. Nossa missão é democratizar o desenvolvimento digital de alta qualidade, oferecendo soluções que combinam estética premium com engenharia robusta — transformando ideias em produtos que impactam vidas.',
      highlights: ['Inovação', 'Qualidade', 'Acessibilidade', 'Impacto Real'],
    },
    {
      heading: 'Como Trabalhamos',
      body: 'Nosso processo é transparente e colaborativo. Começamos entendendo profundamente o desafio do cliente, definimos uma estratégia técnica sólida e executamos em sprints curtos com entregas frequentes. Cada decisão é guiada por dados e feedback real.',
      stat: { value: '100%', label: 'Transparência' },
      highlights: ['Discovery', 'Estratégia', 'Execução Ágil', 'Feedback Loop', 'Entrega Contínua'],
    },
    {
      heading: 'Valores que nos Guiam',
      body: 'Excelência técnica, comunicação clara, prazos respeitados e um compromisso inabalável com a qualidade. Não entregamos apenas código — entregamos soluções que funcionam, escalam e encantam.',
    },
  ],
  'web-design': [
    {
      heading: 'Nosso Processo de Design',
      body: 'Cada projeto começa com uma fase de descoberta profunda. Entendemos o negócio, o público-alvo e os objetivos antes de traçar qualquer pixel. A partir daí, construímos wireframes de baixa fidelidade, validamos com stakeholders e evoluímos para protótipos interativos.',
      highlights: ['Discovery & Research', 'Wireframes Lo-Fi', 'Protótipos Hi-Fi', 'Design System', 'Handoff para Dev'],
    },
    {
      heading: 'Design Systems & Consistência',
      body: 'Criamos Design Systems robustos com tokens de cor, tipografia, espaçamento e componentes reutilizáveis. Isso garante que o produto final mantenha consistência visual em todas as telas e que a equipe de desenvolvimento trabalhe com eficiência máxima.',
      stat: { value: '200+', label: 'Componentes Criados' },
    },
    {
      heading: 'Ferramentas & Workflow',
      body: 'Nosso stack de design inclui Figma como ferramenta principal, com plugins customizados para automação. Utilizamos Storybook para documentação de componentes, e integramos diretamente com o código via tokens de design.',
      highlights: ['Figma', 'Storybook', 'Design Tokens', 'Auto-Layout', 'Variants'],
    },
    {
      heading: 'Acessibilidade & Inclusão',
      body: 'Todo design é criado seguindo as diretrizes WCAG 2.1 AA. Garantimos contraste adequado, navegação por teclado, textos legíveis e uma experiência inclusiva para todos os usuários, independentemente de suas capacidades.',
    },
  ],
  'desenvolvimento': [
    {
      heading: 'Arquitetura & Padrões',
      body: 'Adotamos Clean Architecture e princípios SOLID em todos os projetos. Cada aplicação é dividida em camadas bem definidas — domínio, aplicação, infraestrutura — garantindo testabilidade, manutenibilidade e facilidade de evolução.',
      highlights: ['Clean Architecture', 'SOLID Principles', 'Domain-Driven Design', 'CQRS', 'Event Sourcing'],
    },
    {
      heading: 'Stack Tecnológico',
      body: 'Escolhemos a tecnologia certa para cada projeto. Para front-end, React com TypeScript é nosso padrão. No back-end, Node.js para APIs rápidas, Python para data-heavy e Go para microsserviços de alta performance.',
      stat: { value: '99.9%', label: 'Uptime Garantido' },
    },
    {
      heading: 'Testing & Quality Assurance',
      body: 'Testes automatizados são parte integral do nosso processo. Cobrimos desde unit tests com Jest/Vitest, integration tests com Supertest, até E2E tests com Playwright. Cada PR passa por code review e CI/CD pipeline completo.',
      highlights: ['Unit Tests', 'Integration Tests', 'E2E Tests', 'Code Review', 'CI/CD Pipeline'],
    },
    {
      heading: 'Performance & Otimização',
      body: 'Monitoramos métricas de Core Web Vitals (LCP, FID, CLS) em tempo real. Aplicamos lazy loading, code splitting, caching agressivo e otimização de queries para garantir que cada aplicação carregue em menos de 2 segundos.',
      stat: { value: '<2s', label: 'Tempo de Carregamento' },
    },
  ],
  'servicos': [
    {
      heading: 'Tráfego Pago — Estratégia Completa',
      body: 'Desenvolvemos campanhas de tráfego pago com foco em ROI. Começamos com análise de mercado e público, criamos criativos de alto impacto, configuramos tracking avançado (GTM, Pixel, API de Conversões) e otimizamos diariamente com base em dados reais.',
      highlights: ['Google Ads', 'Meta Ads', 'TikTok Ads', 'Análise de Dados', 'Otimização Contínua'],
      stat: { value: '3.5x', label: 'ROAS Médio' },
    },
    {
      heading: 'Desenvolvimento de Sites — Do Conceito ao Deploy',
      body: 'Cada site é construído com tecnologias modernas (React, Next.js, Tailwind) e otimizado para SEO desde o primeiro commit. Implementamos schemas estruturados, meta tags dinâmicas, sitemap automatizado e performance lighthouse acima de 90.',
      highlights: ['SEO On-Page', 'Schema Markup', 'Performance 90+', 'Mobile-First', 'Analytics Integrado'],
    },
    {
      heading: 'Apps & Sistemas SaaS',
      body: 'Construímos aplicações completas — de MVPs para validação até plataformas SaaS escaláveis. Incluímos autenticação segura, dashboards em tempo real, integrações com APIs de terceiros, sistema de pagamentos e painel administrativo.',
      stat: { value: '15+', label: 'SaaS Entregues' },
    },
    {
      heading: 'Metodologia de Trabalho',
      body: 'Trabalhamos em sprints de 2 semanas com entregas contínuas. Cada projeto tem um canal dedicado para comunicação, board no Notion/Linear para acompanhamento e calls semanais de alinhamento. Transparência total em cada etapa.',
      highlights: ['Sprints de 2 semanas', 'Entregas Contínuas', 'Board de Acompanhamento', 'Calls Semanais', 'Relatórios de Progresso'],
    },
  ],
  'inovacao-ia': [
    {
      heading: 'Integração de IA em Produtos',
      body: 'Integramos modelos de IA diretamente nos produtos dos nossos clientes. Desde chatbots inteligentes com GPT até sistemas de recomendação personalizados, análise de sentimento em reviews e processamento automático de documentos.',
      highlights: ['Chatbots com GPT', 'Recomendação Personalizada', 'Análise de Sentimento', 'OCR Automático', 'NLP Customizado'],
    },
    {
      heading: 'Automação Inteligente',
      body: 'Criamos workflows automatizados que eliminam tarefas repetitivas. Integramos ferramentas como Make, n8n e APIs customizadas para conectar sistemas, processar dados automaticamente e gerar relatórios inteligentes.',
      stat: { value: '80%', label: 'Redução de Trabalho Manual' },
    },
    {
      heading: 'Machine Learning Aplicado',
      body: 'Desenvolvemos modelos de ML para casos de uso específicos: previsão de demanda, detecção de fraude, classificação de imagens, análise preditiva de churn e otimização de preços dinâmicos.',
      highlights: ['Previsão de Demanda', 'Detecção de Fraude', 'Classificação de Imagens', 'Análise de Churn', 'Preços Dinâmicos'],
    },
    {
      heading: 'Infraestrutura Cloud para IA',
      body: 'Deployamos modelos de IA em infraestrutura cloud escalável. Utilizamos AWS SageMaker, Google Vertex AI ou soluções serverless para garantir baixa latência e custo otimizado conforme a demanda.',
      stat: { value: '<100ms', label: 'Latência de Inferência' },
    },
  ],
  'mobile-web': [
    {
      heading: 'React Native — Apps Nativos',
      body: 'Desenvolvemos aplicações mobile com React Native, compartilhando até 90% do código entre iOS e Android. Implementamos navegação nativa, animações fluidas, push notifications e integração com recursos do dispositivo (câmera, GPS, biometria).',
      stat: { value: '90%', label: 'Código Compartilhado' },
    },
    {
      heading: 'Progressive Web Apps (PWA)',
      body: 'Para casos onde uma PWA é a melhor escolha, implementamos service workers para funcionamento offline, cache inteligente, push notifications web e instalação na home screen. A experiência é indistinguível de um app nativo.',
      highlights: ['Offline-First', 'Push Notifications', 'Instalação Home Screen', 'Cache Inteligente', 'Sync em Background'],
    },
    {
      heading: 'Responsividade Total',
      body: 'Cada interface é desenvolvida com abordagem mobile-first. Utilizamos breakpoints estratégicos, layouts fluidos com CSS Grid e Flexbox, tipografia responsiva com clamp() e imagens otimizadas para cada resolução.',
      highlights: ['Mobile-First', 'CSS Grid & Flexbox', 'Tipografia Fluida', 'Imagens Responsivas', 'Touch-Friendly'],
    },
    {
      heading: 'Deploy & Distribuição',
      body: 'Gerenciamos todo o processo de deploy — desde a configuração nas lojas (App Store, Google Play) até CI/CD com CodePush para atualizações over-the-air. Monitoramos crashes em tempo real com Sentry e analytics com Firebase.',
      stat: { value: '24h', label: 'Tempo para Hotfix' },
    },
  ],
  'skills': [
    {
      heading: 'Front-end Moderno',
      body: 'Dominamos o ecossistema React por completo: hooks avançados, server components, streaming SSR, suspense boundaries, code splitting automático e state management com Zustand/TanStack Query. Animações cinematográficas com GSAP e Three.js.',
      highlights: ['React 19+', 'Next.js App Router', 'TypeScript Strict', 'Tailwind CSS', 'GSAP & Three.js'],
    },
    {
      heading: 'Back-end Escalável',
      body: 'Construímos APIs robustas com Node.js (Express/Fastify), Python (FastAPI/Django) e Go para microsserviços de alta performance. Implementamos autenticação JWT/OAuth, rate limiting, caching com Redis e message queues com RabbitMQ.',
      highlights: ['Node.js / Express', 'Python / FastAPI', 'Go / Gin', 'Redis & RabbitMQ', 'JWT & OAuth2'],
    },
    {
      heading: 'Banco de Dados & Data',
      body: 'Expertise em PostgreSQL (com extensões PostGIS e pg_vector), MongoDB para documentos, Redis para cache/sessions e Elasticsearch para busca full-text. Modelamos schemas otimizados com migrations versionadas.',
      stat: { value: '10TB+', label: 'Dados Gerenciados' },
    },
    {
      heading: 'DevOps & Cloud',
      body: 'Infraestrutura como código com Terraform, containers com Docker/Kubernetes, CI/CD com GitHub Actions, monitoramento com Grafana/Prometheus e logging centralizado com ELK Stack. Escalamos do zero ao milhão de usuários.',
      highlights: ['Docker & K8s', 'Terraform IaC', 'GitHub Actions', 'Grafana & Prometheus', 'AWS / GCP'],
      stat: { value: '∞', label: 'Escalabilidade' },
    },
  ],
};

// Deep-dive content renderer component
const DeepDiveContent = memo(function DeepDiveContent({ sectionId, accentHsl, gradient }: { sectionId: string; accentHsl: string; gradient: string }) {
  const blocks = sectionDeepDive[sectionId];
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="relative z-10 bg-background">
      {/* Section divider */}
      <div className="fluid-section-pad">
        <div className="flex items-center gap-4 mb-2">
          <div className="h-[2px] flex-1" style={{ background: `linear-gradient(90deg, hsl(${accentHsl} / 0.4), transparent)` }} />
          <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.4em] uppercase" style={{ color: `hsl(${accentHsl} / 0.6)` }}>
            DEEP DIVE
          </span>
          <div className="h-[2px] flex-1" style={{ background: `linear-gradient(90deg, transparent, hsl(${accentHsl} / 0.4))` }} />
        </div>
      </div>

      {blocks.map((block, i) => (
        <div
          key={i}
          className="detail-item"
          style={{ opacity: 0, padding: `clamp(2rem, 4vw, 4rem) clamp(1.5rem, 4vw, 6rem)` }}
        >
          <div className="max-w-5xl mx-auto">
            {/* Block number + heading */}
            <div className="flex items-start gap-4 mb-6">
              <span
                className="font-[family-name:var(--font-display)] text-[11px] tracking-[0.3em] mt-2 shrink-0"
                style={{ color: `hsl(${accentHsl} / 0.35)` }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3
                  className="font-[family-name:var(--font-display)] font-bold tracking-tight uppercase mb-4"
                  style={{ fontSize: 'clamp(1.25rem, 2.5vw, 2rem)', color: 'hsl(var(--foreground) / 0.95)' }}
                >
                  {block.heading}
                </h3>
                <div className="h-[2px] w-12" style={{ background: gradient }} />
              </div>
            </div>

            {/* Body text */}
            <p
              className="text-foreground/75 leading-relaxed mb-8 max-w-3xl ml-[calc(clamp(11px,1vw,14px)*3+1rem)]"
              style={{ fontSize: 'clamp(0.875rem, 1.3vw, 1.125rem)' }}
            >
              {block.body}
            </p>

            {/* Stat card (if present) */}
            {block.stat && (
              <div
                className="inline-flex items-center gap-6 rounded-md px-8 py-5 mb-8 ml-[calc(clamp(11px,1vw,14px)*3+1rem)]"
                style={{
                  background: `hsl(${accentHsl} / 0.06)`,
                  border: `1px solid hsl(${accentHsl} / 0.15)`,
                }}
              >
                <span
                  className="font-[family-name:var(--font-display)] font-bold"
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: `hsl(${accentHsl})` }}
                >
                  {block.stat.value}
                </span>
                <span
                  className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.2em] uppercase text-muted-foreground"
                >
                  {block.stat.label}
                </span>
              </div>
            )}

            {/* Highlights pills */}
            {block.highlights && (
              <div className="flex flex-wrap gap-2 ml-[calc(clamp(11px,1vw,14px)*3+1rem)]">
                {block.highlights.map((h, j) => (
                  <span
                    key={j}
                    className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.12em] uppercase px-3 py-1.5 rounded-sm transition-all duration-300 cursor-default hover:scale-[1.03]"
                    style={{
                      border: `1px solid hsl(${accentHsl} / 0.2)`,
                      color: `hsl(${accentHsl} / 0.8)`,
                      background: `hsl(${accentHsl} / 0.05)`,
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Separator */}
          {i < blocks.length - 1 && (
            <div className="max-w-5xl mx-auto mt-10">
              <div className="h-[1px]" style={{ background: `linear-gradient(90deg, transparent, hsl(${accentHsl} / 0.15), transparent)` }} />
            </div>
          )}
        </div>
      ))}

      {/* CTA / closing */}
      <div className="text-center py-16">
        <div className="h-[1px] w-20 mx-auto mb-6" style={{ background: gradient }} />
        <p className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.4em] uppercase text-muted-foreground/50">
          VAMOS CONVERSAR SOBRE SEU PROJETO?
        </p>
      </div>
    </div>
  );
});

// ─── Lightweight cinematic section layout ─────────────────────────
const CinematicSection = memo(function CinematicSection({ section, onScrollUpAtTop }: { section: typeof sections[0]; onScrollUpAtTop: () => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const gallery = sectionGallery[section.id];
  const colors = sectionColors[section.id] || sectionColors['focuss-dev'];
  const viceOverlay = colors.overlay;

  // GSAP ScrollTrigger reveal animations
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Section enter line sweep
      const divider = el.querySelector('.section-enter-line');
      if (divider) {
        gsap.fromTo(divider,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 0.6, ease: 'power3.inOut', delay: 0.05 }
        );
      }

      // Hero content parallax
      const heroImg = el.querySelector('.ken-burns-hero');
      if (heroImg) {
        gsap.to(heroImg, {
          yPercent: 20,
          scale: 1.15,
          ease: 'none',
          scrollTrigger: {
            trigger: el.querySelector('.parallax-hero'),
            scroller: el,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // Subtitle, description fade-in
      gsap.utils.toArray<HTMLElement>(el.querySelectorAll('.cin-subtitle, .cin-desc')).forEach((node) => {
        gsap.fromTo(node,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: node, scroller: el, start: 'top 90%', toggleActions: 'play none none none' },
          }
        );
      });

      // Gallery items clipPath reveal
      const galleryItems = el.querySelectorAll('.gallery-item');
      if (galleryItems.length) {
        gsap.fromTo(galleryItems,
          { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.1,
            stagger: 0.18,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: galleryItems[0],
              scroller: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Detail items staggered reveal
      const detailItems = el.querySelectorAll('.detail-item');
      if (detailItems.length) {
        gsap.fromTo(detailItems,
          { opacity: 0, y: 50, filter: 'blur(4px)' },
          {
            opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: detailItems[0], scroller: el, start: 'top 88%', toggleActions: 'play none none none' },
          }
        );
      }

      // Title words cinematic reveal with clip
      const titleWords = el.querySelectorAll('.title-word');
      if (titleWords.length) {
        gsap.fromTo(titleWords,
          { y: '110%', opacity: 0 },
          { y: '0%', opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power4.out', delay: 0.15 }
        );
      }

      // Skill progress bars animation
      const skillBars = el.querySelectorAll('.skill-progress-fill');
      skillBars.forEach((bar) => {
        const targetWidth = (bar as HTMLElement).dataset.width || '0%';
        gsap.fromTo(bar,
          { width: '0%' },
          {
            width: targetWidth,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: { trigger: bar, scroller: el, start: 'top 90%', toggleActions: 'play none none none' },
          }
        );
      });
    }, el);

    return () => ctx.revert();
  }, [section.id]);

  // Scroll-up at top → go back to slider + scroll progress
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let accum = 0;

    const handleWheel = (e: WheelEvent) => {
      if (el.scrollTop <= 5 && e.deltaY < 0) {
        accum += Math.abs(e.deltaY);
        if (accum > 100) { accum = 0; onScrollUpAtTop(); }
      } else { accum = 0; }
    };

    const updateProgress = () => {
      const bar = el.querySelector<HTMLElement>('.scroll-progress-bar');
      if (bar) {
        const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
        bar.style.height = `${Math.min(pct, 100)}%`;
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: true });
    el.addEventListener('scroll', updateProgress, { passive: true });
    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('scroll', updateProgress);
    };
  }, [onScrollUpAtTop]);

  // Magnetic card effect
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>('.magnetic-card');
    const handlers: Array<[HTMLElement, (e: MouseEvent) => void, () => void]> = [];

    cards.forEach(card => {
      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
        gsap.to(card, { x, y, duration: 0.4, ease: 'power1.out' });
      };
      const onLeave = () => gsap.to(card, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
      handlers.push([card, onMove, onLeave]);
    });

    return () => handlers.forEach(([card, onMove, onLeave]) => {
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
    });
  }, [section.id]);

  // Render gallery based on layout type
  const renderGallery = () => {
    if (!gallery) return null;

    const imgs = gallery.images;
    const imgStyle = { filter: 'brightness(0.75) saturate(1.25) contrast(1.08)' };

    switch (gallery.layout) {
      case 'panoramic-duo':
        return (
          <div className="space-y-0">
            <div className="gallery-item relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
              <img src={imgs[0].src} alt={imgs[0].alt} loading="lazy" decoding="async" fetchPriority="low" className="w-full h-full object-cover" style={imgStyle} />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px]">
              {imgs.slice(1).map((img, i) => (
                <div key={i} className="gallery-item relative h-[35vh] md:h-[45vh] overflow-hidden">
                  <img src={img.src} alt={img.alt} loading="lazy" decoding="async" fetchPriority="low" className="w-full h-full object-cover" style={{ filter: 'brightness(0.8) saturate(1.15)' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                </div>
              ))}
            </div>
          </div>
        );
      case 'asymmetric':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px]">
            <div className="gallery-item md:col-span-2 relative h-[45vh] md:h-[60vh] overflow-hidden">
              <img src={imgs[0].src} alt={imgs[0].alt} loading="lazy" decoding="async" fetchPriority="low" className="w-full h-full object-cover" style={imgStyle} />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
            </div>
            <div className="gallery-item relative h-[45vh] md:h-[60vh] overflow-hidden">
              <img src={imgs[1].src} alt={imgs[1].alt} loading="lazy" decoding="async" fetchPriority="low" className="w-full h-full object-cover" style={imgStyle} />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
            </div>
          </div>
        );
      case 'trio':
        return (
          <div className="space-y-[2px]">
            <div className="gallery-item relative w-full h-[35vh] md:h-[45vh] overflow-hidden">
              <img src={imgs[0].src} alt={imgs[0].alt} loading="lazy" decoding="async" fetchPriority="low" className="w-full h-full object-cover" style={imgStyle} />
              <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
            </div>
            <div className="grid grid-cols-2 gap-[2px]">
              {imgs.slice(1).map((img, i) => (
                <div key={i} className="gallery-item relative h-[30vh] md:h-[40vh] overflow-hidden">
                  <img src={img.src} alt={img.alt} loading="lazy" decoding="async" fetchPriority="low" className="w-full h-full object-cover" style={{ filter: 'brightness(0.8) saturate(1.15)' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                </div>
              ))}
            </div>
          </div>
        );
      case 'stacked':
        return (
          <div className="space-y-[2px]">
            {imgs.map((img, i) => (
              <div key={i} className="gallery-item relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
                <img src={img.src} alt={img.alt} loading="lazy" decoding="async" fetchPriority="low" className="w-full h-full object-cover" style={imgStyle} />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40" />
              </div>
            ))}
          </div>
        );
    }
  };

  // Render section-specific content
  const renderSectionContent = () => {
    switch (section.id) {
      case 'web-design':
        return (
          <div className="fluid-section-pad">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { src: '/images/webdesign-detail-01.jpg', title: 'Prototipagem UI', desc: 'Wireframes e protótipos interativos' },
                { src: '/images/webdesign-detail-02.jpg', title: 'Criação Visual', desc: 'Design systems e identidade visual' },
                { src: '/images/webdesign-detail-03.jpg', title: 'Studio Criativo', desc: 'Ambientes de design profissional' },
                { src: '/images/webdesign-detail-04.jpg', title: 'Web Premium', desc: 'Sites de alto impacto visual' },
                { src: '/images/ui-detail-01.jpg', title: 'Interface 3D', desc: 'Elementos holográficos e futuristas' },
                { src: '/images/ui-detail-02.jpg', title: 'Design Mobile', desc: 'Experiências mobile-first' },
              ].map((item, i) => (
                <div key={i} className="detail-item magnetic-card image-hover-zoom card-hover-glow relative h-[35vh] md:h-[40vh] rounded-sm overflow-hidden border border-border/10 group cursor-pointer" style={{ opacity: 0 }}>
                  <img src={item.src} alt={item.title} loading="lazy" decoding="async" fetchPriority="low" className="w-full h-full object-cover" style={{ filter: 'brightness(0.7) saturate(1.2)' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(135deg, hsl(var(--vice-sunset) / 0.15), transparent)' }} />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h4 className="font-[family-name:var(--font-display)] text-foreground text-sm font-semibold tracking-wide uppercase">{item.title}</h4>
                    <p className="text-muted-foreground text-xs mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'desenvolvimento':
        const devCards = [
          { icon: '⚡', title: 'APIs REST & GraphQL', desc: 'Endpoints performáticos com autenticação JWT, rate limiting e documentação OpenAPI completa.', accent: 'var(--vice-sunset)' },
          { icon: '🏗️', title: 'Arquitetura Escalável', desc: 'Microserviços, clean architecture e patterns SOLID para projetos que crescem.', accent: 'var(--vice-teal)' },
          { icon: '🔄', title: 'CI/CD Automatizado', desc: 'Pipelines de deploy com GitHub Actions, Docker e monitoramento em tempo real.', accent: 'var(--vice-gold)' },
          { icon: '🗄️', title: 'Banco de Dados', desc: 'PostgreSQL otimizado com migrations, índices inteligentes e queries performáticas.', accent: 'var(--vice-sky)' },
        ];
        return (
          <div className="fluid-section-pad">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl">
              {devCards.map((card, i) => (
                <div key={i} className="detail-item magnetic-card group relative rounded-md overflow-hidden cursor-pointer transition-transform duration-300 hover:-translate-y-1"
                  style={{ opacity: 0, background: 'hsl(var(--card) / 0.6)', border: '1px solid hsl(var(--border) / 0.15)' }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{ background: `linear-gradient(160deg, hsl(${card.accent} / 0.08), transparent 60%)` }} />
                  <div className="absolute top-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                    style={{ background: `linear-gradient(90deg, transparent, hsl(${card.accent} / 0.6), transparent)` }} />
                  <div className="relative z-10 p-8 md:p-10">
                    <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-6 text-xl"
                      style={{ background: `hsl(${card.accent} / 0.12)`, boxShadow: `0 0 20px hsl(${card.accent} / 0.08)` }}>
                      {card.icon}
                    </div>
                    <h4 className="font-[family-name:var(--font-display)] text-foreground text-sm md:text-base font-bold tracking-[0.12em] uppercase mb-3">{card.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-8">{card.desc}</p>
                    <div className="h-[2px] w-10 group-hover:w-20 transition-all duration-700"
                      style={{ background: `hsl(${card.accent} / 0.5)` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'inovacao-ia':
        return (
          <div className="fluid-section-pad">
            <div className="mb-16">
              <Suspense fallback={null}><FocussChat /></Suspense>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-7xl">
              <div className="detail-item lg:col-span-7 image-hover-zoom card-hover-glow relative h-[50vh] rounded-sm overflow-hidden border border-vice-pink/10" style={{ opacity: 0 }}>
                <img src="/images/ia-detail-01.jpg" alt="Laboratório IA" loading="lazy" decoding="async" fetchPriority="low" className="w-full h-full object-cover" style={{ filter: 'brightness(0.7) saturate(1.3)' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, hsl(var(--vice-pink) / 0.1), transparent)' }} />
                <div className="absolute bottom-6 left-6">
                  <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.3em] uppercase text-vice-pink/80">MACHINE LEARNING</span>
                  <h4 className="font-[family-name:var(--font-display)] text-foreground text-xl font-bold mt-2">Inteligência que Transforma</h4>
                </div>
              </div>
              <div className="lg:col-span-5 grid grid-rows-2 gap-4">
                <div className="detail-item card-hover-glow relative p-8 rounded-sm border border-vice-pink/10 backdrop-blur-sm" style={{ opacity: 0, background: 'hsl(var(--card) / 0.5)' }}>
                  <div className="text-4xl mb-3">🧠</div>
                  <h4 className="font-[family-name:var(--font-display)] text-foreground text-sm font-semibold tracking-wide uppercase mb-2">Neural Networks</h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">Modelos treinados para análise preditiva, processamento de linguagem natural e visão computacional.</p>
                </div>
                <div className="detail-item image-hover-zoom card-hover-glow relative h-full rounded-sm overflow-hidden border border-vice-pink/10" style={{ opacity: 0 }}>
                  <img src="/images/automacao-hero.png" alt="Automação" loading="lazy" decoding="async" fetchPriority="low" className="w-full h-full object-cover" style={{ filter: 'brightness(0.7) saturate(1.2)' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.2em] uppercase text-vice-sunset/80">AUTOMAÇÃO</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'mobile-web':
        return (
          <div className="fluid-section-pad">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="detail-item magnetic-card card-hover-glow flex flex-col items-center p-8 rounded-sm border border-border/10" style={{ opacity: 0, background: 'hsl(var(--card) / 0.3)' }}>
                  <div className="relative w-[180px] h-[360px] rounded-[24px] border-2 border-foreground/20 overflow-hidden shadow-2xl">
                    <img src="/images/mobile-detail-01.jpg" alt="Mobile" loading="lazy" decoding="async" fetchPriority="low" className="w-full h-full object-cover" style={{ filter: 'brightness(0.85) saturate(1.2)' }} />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-background rounded-b-xl" />
                  </div>
                  <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.2em] uppercase text-vice-gold/70 mt-6">MOBILE APP</span>
                </div>
                <div className="detail-item magnetic-card card-hover-glow flex flex-col items-center p-8 rounded-sm border border-border/10" style={{ opacity: 0, background: 'hsl(var(--card) / 0.3)' }}>
                  <div className="relative w-[260px] h-[340px] rounded-[16px] border-2 border-foreground/20 overflow-hidden shadow-2xl">
                    <img src="/images/mobile-detail-02.jpg" alt="Tablet" loading="lazy" decoding="async" fetchPriority="low" className="w-full h-full object-cover" style={{ filter: 'brightness(0.85) saturate(1.2)' }} />
                  </div>
                  <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.2em] uppercase text-vice-gold/70 mt-6">TABLET</span>
                </div>
                <div className="detail-item magnetic-card card-hover-glow flex flex-col items-center p-8 rounded-sm border border-border/10" style={{ opacity: 0, background: 'hsl(var(--card) / 0.3)' }}>
                  <div className="relative w-full h-[220px] rounded-t-lg border-2 border-foreground/20 overflow-hidden shadow-2xl">
                    <img src="/images/mobile-detail-03.jpg" alt="Desktop" loading="lazy" decoding="async" fetchPriority="low" className="w-full h-full object-cover" style={{ filter: 'brightness(0.85) saturate(1.2)' }} />
                  </div>
                  <div className="w-24 h-3 bg-foreground/10 rounded-b-lg" />
                  <div className="w-16 h-1 bg-foreground/10 mt-1 rounded" />
                  <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.2em] uppercase text-vice-gold/70 mt-6">DESKTOP</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 justify-center mt-12">
                {['React Native', 'PWA', '100% Responsivo', 'Docker', 'Cloud Deploy'].map((badge, i) => (
                  <span key={i} className="detail-item font-[family-name:var(--font-display)] text-[10px] tracking-[0.15em] uppercase px-4 py-2 rounded-sm border border-vice-gold/20 text-vice-gold/80 bg-vice-gold/5 hover:bg-vice-gold/15 hover:border-vice-gold/50 transition-all duration-300 cursor-default" style={{ opacity: 0 }}>{badge}</span>
                ))}
              </div>
            </div>
          </div>
        );

      case 'skills':
        const skills = [
          { name: 'React / Next.js', level: 95, category: 'Front-end' },
          { name: 'TypeScript', level: 92, category: 'Front-end' },
          { name: 'Tailwind CSS / GSAP', level: 90, category: 'Front-end' },
          { name: 'Node.js', level: 88, category: 'Back-end' },
          { name: 'Python', level: 82, category: 'Back-end' },
          { name: 'PostgreSQL / MongoDB', level: 85, category: 'Back-end' },
          { name: 'AWS / Docker', level: 80, category: 'DevOps' },
          { name: 'Figma / UI Design', level: 88, category: 'Design' },
          { name: 'Three.js / WebGL', level: 75, category: 'Design' },
          { name: 'CI/CD / Git', level: 90, category: 'DevOps' },
        ];
        return (
          <div className="fluid-section-pad">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
              {skills.map((skill, i) => (
                <div key={i} className="detail-item group" style={{ opacity: 0 }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-[family-name:var(--font-display)] text-foreground/90 text-sm tracking-wide uppercase">{skill.name}</span>
                    <span className="font-[family-name:var(--font-display)] text-vice-sunset/60 text-[10px] tracking-widest">{skill.level}%</span>
                  </div>
                  <div className="skill-progress-bar">
                    <div className="skill-progress-fill" data-width={`${skill.level}%`} style={{ width: 0 }} />
                  </div>
                  <span className="font-[family-name:var(--font-display)] text-[9px] tracking-[0.2em] uppercase text-muted-foreground/60 mt-1 block">{skill.category}</span>
                </div>
              ))}
            </div>
            <Suspense fallback={null}><TechLogosMarquee /></Suspense>
            <div className="max-w-5xl mx-auto mt-16 flex flex-wrap gap-3">
              {['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'Go', 'PostgreSQL', 'MongoDB', 'Redis', 'AWS', 'Docker', 'Figma', 'GSAP', 'Three.js', 'Tailwind CSS', 'GraphQL'].map((tech, i) => (
                <span key={i} className="detail-item card-hover-glow font-[family-name:var(--font-display)] text-[10px] tracking-[0.12em] uppercase px-4 py-2 rounded-sm border border-vice-sunset/20 text-foreground/70 bg-vice-sunset/5 hover:text-vice-sunset hover:border-vice-sunset/50 transition-all duration-300 cursor-default" style={{ opacity: 0 }}>{tech}</span>
              ))}
            </div>
          </div>
        );

      case 'servicos':
        return (
          <div className="fluid-section-pad">
            <div className="detail-item relative w-full h-[50vh] md:h-[60vh] overflow-hidden rounded-sm mb-16" style={{ opacity: 0 }}>
              <img src="/images/hero-servicos.jpg" alt="Serviços" className="w-full h-full object-cover" style={{ filter: 'brightness(0.75) saturate(1.3) contrast(1.05)' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, hsl(270 70% 60% / 0.12), transparent 60%)' }} />
              <div className="absolute bottom-8 left-8">
                <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.3em] uppercase text-vice-pink/80">SOLUÇÕES DIGITAIS</span>
                <h4 className="font-[family-name:var(--font-display)] text-foreground text-2xl font-bold mt-2">Serviços Completos</h4>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl">
              {[
                { icon: '📈', title: 'Tráfego Pago', desc: 'Campanhas estratégicas no Google Ads, Meta Ads e TikTok Ads. Maximizamos seu ROI com segmentação precisa e otimização contínua.', accent: 'vice-pink' },
                { icon: '🌐', title: 'Criação de Sites', desc: 'Sites modernos, responsivos e otimizados para SEO. Desenvolvidos com as melhores tecnologias para performance máxima.', accent: 'vice-teal' },
                { icon: '📱', title: 'Criação de Apps', desc: 'Aplicativos nativos e multiplataforma com experiência de usuário premium. iOS, Android e PWA.', accent: 'vice-sunset' },
                { icon: '⚙️', title: 'Sistemas & SaaS', desc: 'Plataformas escaláveis sob medida. Painéis administrativos, ERPs, CRMs e soluções SaaS completas.', accent: 'vice-sky' },
                { icon: '🚀', title: 'Landing Pages', desc: 'Páginas de alta conversão com design persuasivo, copywriting estratégico e integração com funis de vendas.', accent: 'vice-gold' },
                { icon: '🎨', title: 'Design', desc: 'Identidade visual completa, UI/UX premium, design systems e prototipagem interativa no Figma.', accent: 'vice-palm' },
              ].map((card, i) => (
                <div key={i} className="detail-item magnetic-card card-hover-glow relative p-8 rounded-sm overflow-hidden group cursor-pointer" 
                  style={{ opacity: 0, background: 'hsl(var(--card) / 0.4)', border: '1px solid hsl(var(--border) / 0.15)' }}>
                  <div className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{ 
                      background: `linear-gradient(135deg, hsl(270 70% 60% / 0.1), hsl(335 75% 55% / 0.06), transparent)`,
                      boxShadow: 'inset 0 0 30px hsl(270 70% 60% / 0.05)'
                    }} />
                  <div className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(90deg, transparent, hsl(270 70% 60% / 0.6), hsl(335 75% 55% / 0.4), transparent)' }} />
                  <div className="relative z-10">
                    <span className="text-4xl mb-5 block drop-shadow-lg">{card.icon}</span>
                    <h4 className="font-[family-name:var(--font-display)] text-foreground text-base font-semibold tracking-[0.15em] uppercase mb-3">{card.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{card.desc}</p>
                    <div className="h-[1px] w-12 mt-6 transition-all duration-700 group-hover:w-full"
                      style={{ background: 'linear-gradient(90deg, hsl(270 70% 60% / 0.5), hsl(335 75% 55% / 0.3))' }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-20 text-center">
              <p className="font-[family-name:var(--font-display)] text-[11px] tracking-[0.3em] uppercase text-muted-foreground/60 mb-4">PRONTO PARA COMEÇAR?</p>
              <div className="h-[1px] w-24 mx-auto" style={{ background: 'linear-gradient(90deg, transparent, hsl(270 70% 60% / 0.5), transparent)' }} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div ref={sectionRef} className="absolute inset-0 overflow-y-auto gta-vi-scroll">
      {/* Scroll progress indicator */}
      <div className="fixed right-3 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-1 pointer-events-none">
        <div className="scroll-progress-track w-[2px] bg-foreground/10 rounded-full" style={{ height: 'clamp(4rem, 8vh, 8rem)' }}>
          <div className="scroll-progress-bar w-full rounded-full origin-top" style={{ height: '0%', background: `hsl(${colors.accentHsl})` }} />
        </div>
      </div>

      {/* ── HERO with parallax ── */}
      <div className="relative h-screen w-full overflow-hidden flex items-end parallax-hero">
        <div className="absolute inset-0">
          {/* Section enter line */}
          <div className="section-enter-line absolute top-0 left-0 right-0 h-[2px] origin-left z-20"
            style={{ background: colors.gradient }} />
          <img src={section.image} alt={section.title} loading="eager" decoding="async" width={1920} height={1080} className="w-full h-full object-cover ken-burns-hero" style={{ filter: 'saturate(1.15) contrast(1.05)' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 30%, hsl(var(--background) / 0.6) 70%, hsl(var(--background)) 95%)' }} />
          <div className="absolute inset-0" style={{ background: viceOverlay }} />
        </div>

        <div className="relative z-10 w-full" style={{ padding: `0 clamp(1.5rem, 4vw, 6rem) clamp(1rem, 3vw, 1.5rem)` }}>
          <div className="cin-subtitle hero-reveal hero-reveal-delay-1 flex items-center gap-3 mb-[clamp(0.5rem,1vw,1.5rem)]">
            <div className="h-[2px]" style={{ width: 'clamp(2rem, 3vw, 4rem)', background: colors.gradient }} />
            <span className={`font-[family-name:var(--font-display)] tracking-[0.4em] uppercase ${colors.accent}`} style={{ fontSize: 'clamp(9px, 0.8vw, 12px)', textShadow: `0 0 20px ${colors.glowColor}` }}>{section.subtitle}</span>
            <div className="h-[2px]" style={{ width: 'clamp(1rem, 1.5vw, 2rem)', background: colors.gradient, opacity: 0.4 }} />
          </div>
          <div className="relative">
            <div className="absolute inset-0 -z-10 pointer-events-none" style={{
              filter: 'blur(60px)',
              background: `radial-gradient(ellipse 80% 60% at 20% 60%, ${colors.glowColor}, transparent 70%)`,
            }} />
            <h2 className="hero-reveal hero-reveal-delay-2 font-[family-name:var(--font-display)] font-black leading-[0.85] tracking-tighter uppercase" style={{ fontSize: 'clamp(2.5rem, 9vw, 11rem)' }}>
              {section.title.split(' ').map((word, i) => (
                <span key={i} className="title-split-wrapper">
                  <span 
                    className="title-word"
                    style={{
                      display: 'inline-block',
                      background: colors.titleGradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: `drop-shadow(0 0 30px ${colors.glowColor}) drop-shadow(0 4px 20px hsl(0 0% 0% / 0.5))`,
                    }}
                  >
                    {word}
                  </span>
                </span>
              ))}
            </h2>
          </div>
          <div className="hero-reveal hero-reveal-delay-3 absolute bottom-8 flex flex-col items-center gap-2 opacity-50" style={{ right: 'clamp(1.5rem, 3vw, 4rem)' }}>
            <span className={`font-[family-name:var(--font-display)] tracking-[0.25em] uppercase ${colors.accent} opacity-60 [writing-mode:vertical-lr]`} style={{ fontSize: 'clamp(7px, 0.6vw, 9px)' }}>Role para baixo</span>
            <div className="w-[1px] animate-pulse" style={{ height: 'clamp(2rem, 3vw, 3rem)', background: `hsl(${colors.accentHsl} / 0.4)` }} />
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="relative z-10 bg-background">
        <div className="w-full h-[1px]" style={{ background: `linear-gradient(90deg, transparent, hsl(${colors.accentHsl} / 0.3), hsl(${colors.accentHsl} / 0.15), transparent)` }} />
        
        <div className="cin-desc" style={{ padding: `clamp(1rem, 3vw, 1.5rem) clamp(1.5rem, 4vw, 6rem)` }}>
          <div className="max-w-5xl">
            <p className="text-foreground/90 leading-relaxed font-light tracking-tight" style={{ fontSize: 'clamp(1rem, 2vw, 1.875rem)' }}>{section.description}</p>
          </div>
        </div>

        {/* Gallery */}
        <div ref={galleryRef}>{renderGallery()}</div>

        {/* Details grid */}
        <div ref={detailsRef} style={{ padding: `clamp(1rem, 3vw, 1.5rem) clamp(1.5rem, 4vw, 6rem)` }}>
          {section.id === 'servicos' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl">
              {section.details.map((detail, i) => {
                const emoji = detail.slice(0, 2)
                const rest = detail.slice(3)
                const [title, desc] = rest.split(' — ')
                const cardAccents = [
                  'hsl(335 75% 55%)', 'hsl(185 80% 55%)', 'hsl(25 95% 55%)',
                  'hsl(210 90% 60%)', 'hsl(45 100% 55%)', 'hsl(270 70% 60%)'
                ]
                const accent = cardAccents[i] || cardAccents[0]
                return (
                  <div key={i} className="detail-item magnetic-card group relative p-7 rounded-sm overflow-hidden cursor-pointer transition-all duration-500 hover:translate-y-[-2px]"
                    style={{ opacity: 0, background: 'hsl(var(--card) / 0.35)', border: '1px solid hsl(var(--border) / 0.1)' }}>
                    <div className="absolute top-0 left-0 right-0 h-[2px] opacity-50 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                      style={{ background: `radial-gradient(ellipse at top, ${accent}08, transparent 70%)` }} />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">{emoji}</span>
                        <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.25em] uppercase opacity-40" style={{ color: accent }}>{String(i + 1).padStart(2, '0')}</span>
                      </div>
                      <h4 className="font-[family-name:var(--font-display)] text-foreground text-sm font-semibold tracking-[0.12em] uppercase mb-2">{title}</h4>
                      <p className="text-muted-foreground text-xs leading-relaxed">{desc}</p>
                      <div className="h-[1px] w-10 mt-5 group-hover:w-full transition-all duration-700"
                        style={{ background: `linear-gradient(90deg, ${accent}80, transparent)` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 max-w-6xl">
              {section.details.map((detail, i) => (
                <div key={i} className="detail-item group flex items-start gap-4" style={{ opacity: 0 }}>
                  <span className={`font-[family-name:var(--font-display)] ${colors.accent} opacity-40 text-sm tracking-widest mt-1`}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <div className="h-[1px] w-8 mb-4 group-hover:w-16 transition-all duration-500" style={{ background: `hsl(${colors.accentHsl} / 0.3)` }} />
                    <p className="text-foreground/80 text-base md:text-lg leading-relaxed">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section-specific content */}
        {renderSectionContent()}

        {/* Deep-dive extended content */}
        <DeepDiveContent sectionId={section.id} accentHsl={colors.accentHsl} gradient={colors.gradient} />

        <div className="h-16 md:h-24" />
      </div>
    </div>
  );
});

export function SectionsDetail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const openFrameRef = useRef<number | null>(null);
  const [activeSlide, setActiveSlide] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const goBack = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsAnimating(false);
    }, 350);
  }, []);

  const openSlide = useCallback((slideIndex: number) => {
    if (openFrameRef.current !== null) {
      cancelAnimationFrame(openFrameRef.current);
    }

    // Reset scroll of previous section
    const prevScroller = document.querySelector('.gta-vi-scroll');
    if (prevScroller) prevScroller.scrollTop = 0;

    setIsVisible(false);
    setActiveSlide(slideIndex);

    openFrameRef.current = requestAnimationFrame(() => {
      setIsVisible(true);
      openFrameRef.current = null;

      // Refresh ScrollTrigger after section becomes visible
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      });
    });
  }, []);

  useEffect(() => {
    const handleExplore = (e: CustomEvent) => {
      openSlide(e.detail.slideIndex);
    };

    window.addEventListener('explore-slide', handleExplore as EventListener);
    return () => window.removeEventListener('explore-slide', handleExplore as EventListener);
  }, [openSlide]);

  useEffect(() => {
    return () => {
      if (openFrameRef.current !== null) {
        cancelAnimationFrame(openFrameRef.current);
      }
    };
  }, []);

  // Scroll-up at top for focuss-dev section → go back (with isVisible guard)
  useEffect(() => {
    if (!isVisible || activeSlide === null) return;
    const container = containerRef.current;
    if (!container) return;
    if (sections[activeSlide].id !== 'focuss-dev') return;

    let accum = 0;
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY < 0) {
        accum += Math.abs(e.deltaY);
        if (accum > 100) { accum = 0; goBack(); }
      } else { accum = 0; }
    };
    container.addEventListener('wheel', handleWheel, { passive: true });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [activeSlide, goBack, isVisible]);

  // Animated entrance + stat counters for focuss-dev
  useEffect(() => {
    if (!isVisible || activeSlide === null) return;
    if (sections[activeSlide].id !== 'focuss-dev') return;

    const timer = setTimeout(() => {
      // Stagger entrance for all .anim-el
      const animEls = document.querySelectorAll('.anim-el');
      gsap.fromTo(animEls,
        { opacity: 0, y: 30, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.08, ease: 'power3.out' }
      );

      // Animated stat counters
      const statEls = document.querySelectorAll('.stat-value-animated');
      statEls.forEach((el) => {
        const target = parseInt(el.getAttribute('data-target') || '0', 10);
        if (isNaN(target)) return;
        gsap.fromTo({ val: 0 },
          { val: 0 },
          {
            val: target,
            duration: 1.8,
            ease: 'power2.out',
            delay: 0.5,
            onUpdate: function () {
              el.textContent = Math.round(this.targets()[0].val) + (el.getAttribute('data-suffix') || '');
            },
          }
        );
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [activeSlide, isVisible]);

  const section = activeSlide === null ? null : sections[activeSlide];
  const focussDevColors = sectionColors['focuss-dev'];

  return (
    <div
      ref={containerRef}
      id="detail-section"
      className={`fixed inset-0 z-20 bg-background ${
        isVisible 
          ? isAnimating ? 'detail-section-exit pointer-events-none' : 'detail-section-enter pointer-events-auto' 
          : 'opacity-0 pointer-events-none'
      }`}
    >
      {section && (
        <div key={section.id} className="relative h-screen overflow-hidden">
          {/* Back button */}
          <button
            className="absolute top-6 left-6 z-50 flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors duration-300 font-[family-name:var(--font-display)] text-xs tracking-[0.15em] uppercase bg-background/40 px-3 py-2 rounded-sm border border-border/20 hover:border-accent/30"
            onClick={goBack}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 19V5m7 7l-7-7-7 7" /></svg>
            Voltar
          </button>

          {/* FOCUSS DEV: Original layout */}
          {isFocussDev && (
            <>
              <div className="absolute inset-0">
                <img src={section.image} alt={section.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-background/80" />
                <div className="absolute inset-0 opacity-20" style={{ background: `linear-gradient(135deg, hsl(45 100% 55% / 0.2) 0%, transparent 60%)` }} />
              </div>
              <div className="relative flex items-center h-full px-6 md:px-16 lg:px-24">
                <div className="w-full max-w-4xl mx-auto">
                  <div className="anim-el h-[2px] w-16 mb-6 origin-left bg-accent" style={{ opacity: 0 }} />
                  <span className="anim-el block font-[family-name:var(--font-display)] text-xs tracking-[0.2em] uppercase mb-3 text-accent" style={{ opacity: 0 }}>{section.subtitle}</span>
                  <h2 className="anim-el font-[family-name:var(--font-display)] text-4xl md:text-6xl lg:text-7xl font-light text-foreground mb-6 leading-tight tracking-tight" style={{ opacity: 0 }}>{section.title}</h2>
                  <p className="anim-el text-muted-foreground text-base md:text-lg leading-relaxed mb-10 max-w-2xl" style={{ opacity: 0 }}>{section.description}</p>
                  
                  {/* Stats with animated counters */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[
                      { value: '5', suffix: '+', label: 'Anos de Experiência', target: 5 },
                      { value: '50', suffix: '+', label: 'Projetos Entregues', target: 50 },
                      { value: '100', suffix: '%', label: 'Foco em Performance', target: 100 },
                      { value: '∞', suffix: '', label: 'Inovação Contínua', target: null },
                    ].map((stat, i) => (
                      <div key={i} className="anim-el relative p-5 rounded-md overflow-hidden group"
                        style={{ opacity: 0, background: 'hsl(var(--card) / 0.4)', border: '1px solid hsl(var(--border) / 0.15)' }}>
                        <div className="absolute top-0 left-0 right-0 h-[1px] opacity-60"
                          style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--accent) / 0.5), transparent)' }} />
                        {stat.target !== null ? (
                          <span className="stat-value-animated block font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold text-accent mb-1"
                            data-target={stat.target} data-suffix={stat.suffix}>0{stat.suffix}</span>
                        ) : (
                          <span className="block font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold text-accent mb-1">∞</span>
                        )}
                        <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.15em] uppercase text-muted-foreground">{stat.label}</span>
                      </div>
                    ))}
                  </div>

                  <ul className="space-y-4">
                    {section.details.map((detail, i) => (
                      <li key={i} className="anim-el flex items-start gap-4 text-muted-foreground text-sm md:text-base group" style={{ opacity: 0 }}>
                        <span className="mt-1 flex items-center justify-center w-6 h-6 rounded-full shrink-0 border border-accent/30 text-accent font-[family-name:var(--font-display)] text-[10px]">{String(i + 1).padStart(2, '0')}</span>
                        <span className="group-hover:text-foreground/90 transition-colors duration-300">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}

          {/* All other sections: Lightweight cinematic style */}
          {!isFocussDev && (
            <CinematicSection section={section} onScrollUpAtTop={goBack} />
          )}
        </div>
      )}
    </div>
  );
}
