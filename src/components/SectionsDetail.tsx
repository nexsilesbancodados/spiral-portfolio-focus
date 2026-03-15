import React, { useEffect, useRef, useState, useCallback, lazy, Suspense, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FocussChat = lazy(() => import('@/components/FocussChat').then(m => ({ default: m.FocussChat })));
const TechLogosMarquee = lazy(() => import('@/components/TechLogosMarquee'));

const sections = [
  {
    id: 'focuss-dev',
    subtitle: 'Studio Digital',
    title: 'FOCUSS DEV',
    description: 'Nascemos da obsessão por criar experiências digitais que quebram padrões. Somos um studio boutique onde cada pixel é intencional, cada linha de código é arquitetada para escalar, e cada projeto é tratado como uma obra de arte tecnológica.',
    details: [
      'Projetos premiados em UX e inovação digital desde 2019',
      'Time multidisciplinar: designers, engenheiros e estrategistas sob o mesmo teto',
      'Metodologia proprietária que reduz o time-to-market em até 40%',
      'Parceiros certificados AWS, Google Cloud e Vercel',
    ],
    image: '/images/slide-01.jpg',
  },
  {
    id: 'web-design',
    subtitle: 'Arte & Interface',
    title: 'Web Design',
    description: 'Design não é decoração — é comunicação estratégica. Criamos interfaces que contam histórias, guiam o olhar e convertem visitantes em clientes apaixonados. Cada projeto nasce de dados e se materializa em beleza funcional.',
    details: [
      'UX Research com mapeamento de jornada e personas baseadas em dados reais',
      'Design Systems escaláveis com 300+ componentes reutilizáveis',
      'Micro-interações cinematográficas que aumentam o engajamento em 60%',
      'Acessibilidade WCAG 2.1 AAA integrada desde o primeiro wireframe',
    ],
    image: '/images/webdesign-gallery-02.jpg',
  },
  {
    id: 'desenvolvimento',
    subtitle: 'Engenharia de Software',
    title: 'Desenvolvimento',
    description: 'Engenharia de verdade, não apenas código. Construímos sistemas que suportam milhões de usuários, mantêm latência abaixo de 100ms e evoluem com seu negócio. Arquitetura robusta é a fundação de tudo que criamos.',
    details: [
      'Clean Architecture com cobertura de testes acima de 90%',
      'APIs que respondem em <50ms sob carga pesada com cache inteligente',
      'Pipelines CI/CD que deployam em produção em menos de 3 minutos',
      'Observabilidade completa com dashboards de métricas em tempo real',
    ],
    image: '/images/dev-detail-01.jpg',
  },
  {
    id: 'servicos',
    subtitle: 'Ecossistema Digital',
    title: 'Serviços',
    description: 'Um ecossistema completo de soluções digitais para empresas que querem dominar o mercado online. Da estratégia de aquisição ao produto final, cobrimos toda a cadeia de valor digital.',
    details: [
      '📈 Growth Marketing — Estratégias data-driven com ROAS acima de 4x',
      '🌐 Plataformas Web — Experiências imersivas com Next.js, React e edge computing',
      '📱 Apps Mobile — Aplicações nativas e cross-platform com React Native e Flutter',
      '⚙️ SaaS & Plataformas — Arquiteturas multi-tenant escaláveis com billing integrado',
      '🚀 Landing Pages — Conversão otimizada com A/B testing e analytics avançado',
      '🎨 Branding Digital — Identidade visual que posiciona e diferencia no mercado',
    ],
    image: '/images/servicos-detail-02.jpg',
  },
  {
    id: 'inovacao-ia',
    subtitle: 'Inteligência Artificial',
    title: 'Inovação e IA',
    description: 'A inteligência artificial não é mais ficção científica — é vantagem competitiva. Implementamos soluções de IA que automatizam processos, personalizam experiências e revelam insights ocultos nos seus dados.',
    details: [
      'LLMs customizados e fine-tuning para domínios específicos do seu negócio',
      'RAG (Retrieval-Augmented Generation) para bases de conhecimento empresariais',
      'Computer Vision para controle de qualidade e automação industrial',
      'Agentes autônomos que executam workflows complexos sem intervenção humana',
    ],
    image: '/images/ia-gallery-02.jpg',
  },
  {
    id: 'mobile-web',
    subtitle: 'Cross-Platform',
    title: 'Mobile e Web',
    description: 'Uma experiência, todos os dispositivos. Desenvolvemos aplicações que transitam perfeitamente entre mobile, tablet e desktop, mantendo performance nativa e consistência visual em cada breakpoint.',
    details: [
      'React Native com módulos nativos custom para iOS e Android',
      'PWAs que funcionam offline com sync inteligente em background',
      'Animações a 60fps com Reanimated e gesture handlers nativos',
      'CI/CD mobile com CodePush para updates instantâneos sem app stores',
    ],
    image: '/images/mobile-gallery-01.jpg',
  },
  {
    id: 'skills',
    subtitle: 'Arsenal Técnico',
    title: 'Skills',
    description: 'Cada ferramenta no nosso arsenal foi escolhida por excelência, não por modismo. Dominamos o stack completo — do banco de dados ao pixel final — com profundidade que transforma complexidade em simplicidade.',
    details: [
      'React 19, Next.js 15, TypeScript Strict — Front-end bleeding edge',
      'Node.js, Python, Rust — Back-end para cada cenário de performance',
      'PostgreSQL, Redis, Elasticsearch — Dados rápidos e resilientes',
      'Kubernetes, Terraform, GitHub Actions — Infraestrutura como código',
      'GSAP, Three.js, Framer Motion — Animações que impressionam',
      'Figma, Storybook, Chromatic — Design-to-code sem fricção',
    ],
    image: '/images/skills-detail-01.jpg',
  },
];

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

const sectionColors: Record<string, { accent: string; accentHsl: string; gradient: string; overlay: string; titleBg: string; titleGradient: string; glowColor: string }> = {
  // FOCUSS DEV — Identidade original preservada
  'focuss-dev':       { accent: 'text-blue-400',      accentHsl: '210 90% 60%',   gradient: 'linear-gradient(90deg, hsl(210 90% 60%), hsl(230 80% 65%))',          overlay: 'none', titleBg: '', titleGradient: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(210 90% 70%) 40%, hsl(230 80% 60%) 70%, hsl(210 90% 50%) 100%)', glowColor: 'hsl(210 90% 60% / 0.4)' },
  // Resident Evil — Blood red + biohazard green
  'web-design':       { accent: 'text-red-500',        accentHsl: '0 80% 50%',     gradient: 'linear-gradient(90deg, hsl(0 80% 50%), hsl(120 60% 35%))',            overlay: 'linear-gradient(135deg, hsl(0 80% 50% / 0.12), hsl(120 60% 35% / 0.08), transparent 70%)', titleBg: '', titleGradient: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(0 80% 60%) 30%, hsl(0 60% 40%) 65%, hsl(0 80% 35%) 100%)', glowColor: 'hsl(0 80% 50% / 0.4)' },
  // God of War Ragnarök — Leviathan ice blue + Blades of Chaos fire
  'desenvolvimento':  { accent: 'text-sky-400',        accentHsl: '200 85% 60%',   gradient: 'linear-gradient(90deg, hsl(200 85% 60%), hsl(15 90% 55%))',           overlay: 'linear-gradient(225deg, hsl(200 85% 60% / 0.12), hsl(15 90% 55% / 0.08), transparent 60%)', titleBg: '', titleGradient: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(200 85% 65%) 30%, hsl(15 90% 55%) 65%, hsl(200 85% 50%) 100%)', glowColor: 'hsl(200 85% 60% / 0.4)' },
  // Fallout — Pip-Boy green + nuclear amber
  'servicos':         { accent: 'text-green-400',      accentHsl: '120 75% 50%',   gradient: 'linear-gradient(90deg, hsl(120 75% 50%), hsl(45 90% 50%))',           overlay: 'linear-gradient(180deg, hsl(120 75% 50% / 0.1), hsl(45 90% 50% / 0.06), transparent)', titleBg: '', titleGradient: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(120 75% 60%) 30%, hsl(120 60% 45%) 65%, hsl(120 75% 40%) 100%)', glowColor: 'hsl(120 75% 50% / 0.4)' },
  // Detroit: Become Human — CyberLife blue + LED cyan
  'inovacao-ia':      { accent: 'text-cyan-400',       accentHsl: '195 90% 55%',   gradient: 'linear-gradient(90deg, hsl(195 90% 55%), hsl(210 80% 60%))',          overlay: 'linear-gradient(180deg, hsl(195 90% 55% / 0.1), hsl(210 80% 60% / 0.08), transparent)', titleBg: '', titleGradient: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(195 90% 65%) 30%, hsl(210 80% 55%) 65%, hsl(195 90% 45%) 100%)', glowColor: 'hsl(195 90% 55% / 0.4)' },
  // Watch Dogs — ctOS green + hacker teal
  'mobile-web':       { accent: 'text-emerald-400',    accentHsl: '160 85% 45%',   gradient: 'linear-gradient(90deg, hsl(160 85% 45%), hsl(180 70% 50%))',          overlay: 'linear-gradient(135deg, hsl(160 85% 45% / 0.1), hsl(180 70% 50% / 0.06), transparent 70%)', titleBg: '', titleGradient: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(160 85% 55%) 30%, hsl(180 70% 45%) 65%, hsl(160 85% 40%) 100%)', glowColor: 'hsl(160 85% 45% / 0.4)' },
  // Assassin's Creed Valhalla — Viking gold + Norse amber
  'skills':           { accent: 'text-amber-400',      accentHsl: '38 90% 50%',    gradient: 'linear-gradient(90deg, hsl(38 90% 50%), hsl(25 80% 45%))',            overlay: 'linear-gradient(225deg, hsl(38 90% 50% / 0.1), hsl(25 80% 45% / 0.06), transparent 60%)', titleBg: '', titleGradient: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(38 90% 60%) 30%, hsl(25 80% 50%) 65%, hsl(38 90% 40%) 100%)', glowColor: 'hsl(38 90% 50% / 0.4)' },
};

// ─── Deep-dive content ──────────────────────────────────────────
type DeepDiveBlock = {
  heading: string;
  body: string;
  highlights?: string[];
  stat?: { value: string; label: string };
};

const sectionDeepDive: Record<string, DeepDiveBlock[]> = {
  'focuss-dev': [
    {
      heading: 'A Origem da FOCUSS',
      body: 'Surgimos em 2019, quando percebemos que o mercado digital brasileiro carecia de studios que unissem excelência técnica com visão de produto. Não queríamos ser mais uma fábrica de software — queríamos ser parceiros estratégicos de negócios que acreditam no poder da tecnologia.',
      highlights: ['Visão de Produto', 'Parceria Estratégica', 'Excelência Técnica', 'Inovação Constante'],
    },
    {
      heading: 'Nosso Manifesto',
      body: 'Código é poesia quando bem escrito. Design é linguagem quando bem pensado. Produto é revolução quando bem executado. Na FOCUSS, cada entrega carrega essa filosofia — nunca o mínimo viável, sempre o máximo impactante.',
      stat: { value: '200+', label: 'Clientes Satisfeitos' },
      highlights: ['Zero Atalhos', 'Qualidade Obsessiva', 'Entrega de Valor', 'Evolução Contínua'],
    },
    {
      heading: 'Cultura de Aprendizado',
      body: 'Dedicamos 20% do nosso tempo a pesquisa e desenvolvimento interno. Isso significa explorar novas tecnologias, contribuir com open source, publicar artigos técnicos e organizar meetups. A curiosidade é o combustível que nos mantém à frente.',
    },
  ],
  'web-design': [
    {
      heading: 'Design Thinking na Prática',
      body: 'Nosso processo de design começa muito antes do Figma. Realizamos entrevistas com stakeholders, análise competitiva, mapeamento de ecossistema e workshops de co-criação. Só depois de entender profundamente o problema é que desenhamos a solução.',
      highlights: ['Entrevistas com Usuários', 'Análise Competitiva', 'Workshops de Co-criação', 'Mapeamento de Jornada', 'Priorização por Impacto'],
    },
    {
      heading: 'Design Tokens & Escala',
      body: 'Nossos Design Systems não são coleções estáticas de componentes — são organismos vivos. Utilizamos design tokens sincronizados entre Figma e código, permitindo que mudanças de tema, marca ou acessibilidade sejam propagadas instantaneamente em todo o produto.',
      stat: { value: '300+', label: 'Componentes no Sistema' },
    },
    {
      heading: 'Motion Design & Storytelling',
      body: 'Animações não são decoração — são narrativa. Cada transição, cada micro-interação conta uma parte da história do produto. Usamos GSAP, Framer Motion e Lottie para criar experiências que guiam, encantam e retêm o usuário.',
      highlights: ['GSAP Cinematográfico', 'Framer Motion', 'Lottie Animations', 'SVG Morphing', 'Scroll-Driven Effects'],
    },
    {
      heading: 'Métricas de Design',
      body: 'Design sem dados é arte, não produto. Medimos tudo: heatmaps de clique, gravações de sessão, taxas de conclusão de tarefa, NPS de usabilidade. Cada iteração é informada por comportamento real, não por achismo.',
      stat: { value: '60%', label: 'Aumento em Engajamento' },
    },
  ],
  'desenvolvimento': [
    {
      heading: 'Filosofia de Código',
      body: 'Escrevemos código para humanos, não para máquinas. Isso significa nomes descritivos, funções pequenas, abstrações claras e documentação inline. Quando outro desenvolvedor lê nosso código, ele entende a intenção — não precisa decifrá-la.',
      highlights: ['Clean Code', 'SOLID', 'DDD', 'Hexagonal Architecture', 'Event-Driven'],
    },
    {
      heading: 'Stack por Contexto',
      body: 'Não somos fanáticos por uma tecnologia — somos fanáticos por resolver o problema certo da maneira certa. React para interfaces ricas, Next.js para SEO, Node.js para I/O intensivo, Python para ML, Rust para processamento de alta performance.',
      stat: { value: '99.99%', label: 'Uptime nos Últimos 12 Meses' },
    },
    {
      heading: 'Cultura de Testes',
      body: 'Não deployamos sem testes. Unit tests com Vitest, integration tests com Testing Library, E2E com Playwright, visual regression com Chromatic. Nosso pipeline rejeita automaticamente PRs com cobertura abaixo de 85%.',
      highlights: ['Vitest / Jest', 'Testing Library', 'Playwright E2E', 'Chromatic Visual', 'Contract Testing'],
    },
    {
      heading: 'Observabilidade Total',
      body: 'Cada microsserviço emite métricas, logs estruturados e traces distribuídos. Dashboards em Grafana mostram latência por endpoint, taxa de erro, saturação de recursos e alertas inteligentes que nos avisam antes do cliente perceber.',
      stat: { value: '<50ms', label: 'P95 de Latência' },
    },
  ],
  'servicos': [
    {
      heading: 'Growth Marketing — ROI Comprovado',
      body: 'Não apenas geramos tráfego — geramos receita. Nossas campanhas são construídas sobre funis de conversão otimizados, tracking server-side (CAPI), lookalike audiences inteligentes e criativos testados com rigor estatístico.',
      highlights: ['Google Ads', 'Meta Ads', 'TikTok Ads', 'LinkedIn Ads', 'Tracking Server-Side'],
      stat: { value: '4.2x', label: 'ROAS Médio dos Clientes' },
    },
    {
      heading: 'Plataformas Web — Além do Básico',
      body: 'Nossos sites não são brochuras digitais. São máquinas de conversão com SSR para SEO, edge rendering para velocidade global, CMS headless para autonomia do cliente e analytics comportamental para evolução contínua.',
      highlights: ['Next.js / Remix', 'Edge Computing', 'Headless CMS', 'Core Web Vitals', 'SEO Técnico'],
    },
    {
      heading: 'SaaS — Do MVP ao Scale',
      body: 'Já ajudamos 15+ startups a ir do zero ao product-market fit. Construímos MVPs em 4-6 semanas, iteramos baseado em métricas de ativação e retenção, e escalamos a arquitetura conforme a base de usuários cresce.',
      stat: { value: '15+', label: 'SaaS Lançados' },
    },
    {
      heading: 'Modelo de Parceria',
      body: 'Oferecemos três formatos: projeto fechado com escopo definido, squads dedicados para evolução contínua, e consultoria técnica para times internos. Cada formato inclui rituais de alinhamento, documentação e transferência de conhecimento.',
      highlights: ['Projeto Fechado', 'Squad Dedicado', 'Consultoria Técnica', 'Retainer Mensal', 'Suporte Contínuo'],
    },
  ],
  'inovacao-ia': [
    {
      heading: 'IA Generativa Aplicada',
      body: 'Implementamos soluções com GPT-4, Claude, Gemini e modelos open-source como LLaMA e Mistral. Cada caso de uso é avaliado: quando fine-tuning vale mais que prompting? Quando RAG supera treinamento? Otimizamos custo, latência e qualidade.',
      highlights: ['GPT-4 / Claude', 'LLaMA / Mistral', 'Fine-tuning', 'RAG Avançado', 'Prompt Engineering'],
    },
    {
      heading: 'Automação com Agentes',
      body: 'Criamos agentes de IA que executam workflows inteiros: desde pesquisa de mercado automatizada até geração de relatórios, moderação de conteúdo e atendimento ao cliente. Cada agente é monitorado com métricas de qualidade e custo.',
      stat: { value: '85%', label: 'Redução em Trabalho Repetitivo' },
    },
    {
      heading: 'Visão Computacional',
      body: 'Desenvolvemos pipelines de computer vision para controle de qualidade em linhas de produção, análise de documentos (OCR avançado), reconhecimento facial para controle de acesso e análise de imagens médicas.',
      highlights: ['OCR Avançado', 'Controle de Qualidade', 'Análise de Documentos', 'Detecção de Anomalias', 'Edge AI'],
    },
    {
      heading: 'MLOps & Infraestrutura',
      body: 'Não basta treinar um modelo — é preciso deployá-lo, monitorá-lo e reciclá-lo. Nosso pipeline de MLOps inclui versionamento de dados, treinamento distribuído, A/B testing de modelos e monitoramento de drift em produção.',
      stat: { value: '<80ms', label: 'Latência de Inferência' },
    },
  ],
  'mobile-web': [
    {
      heading: 'React Native — Performance Nativa',
      body: 'Nossos apps em React Native atingem performance indistinguível de apps nativos. Usamos JSI para bridges diretas, Reanimated para animações a 60fps no UI thread e Hermes engine para startup ultra-rápido.',
      stat: { value: '95%', label: 'Código Compartilhado iOS/Android' },
    },
    {
      heading: 'PWA — O Melhor dos Dois Mundos',
      body: 'Progressive Web Apps são a escolha inteligente quando você quer alcance sem a barreira das app stores. Implementamos cache strategies com Workbox, background sync, push notifications e instalação na home screen.',
      highlights: ['Workbox Caching', 'Background Sync', 'Push Notifications', 'App Shell Pattern', 'Offline-First'],
    },
    {
      heading: 'Design Responsivo Avançado',
      body: 'Ir além de media queries simples: usamos container queries, clamp() para tipografia fluida, CSS Grid com auto-fill/auto-fit e componentes que se adaptam ao contexto, não apenas ao viewport.',
      highlights: ['Container Queries', 'Tipografia Fluida', 'CSS Grid Avançado', 'Aspect Ratio', 'Touch-Optimized'],
    },
    {
      heading: 'Deploy & Monitoramento Mobile',
      body: 'CI/CD para mobile com EAS Build, CodePush para updates OTA, Sentry para crash reports em tempo real e Firebase Analytics para métricas de engajamento. Releases semanais automatizadas com changelogs.',
      stat: { value: '<4h', label: 'Tempo para Hotfix' },
    },
  ],
  'skills': [
    {
      heading: 'Front-end — Bleeding Edge',
      body: 'Não apenas usamos React — contribuímos com a comunidade. Dominamos RSC (React Server Components), Suspense, Streaming SSR, Partial Prerendering e Server Actions. Nosso código de front-end é indistinguível do que sai de equipes da Vercel.',
      highlights: ['React 19 / RSC', 'Next.js 15', 'TypeScript 5+', 'Tailwind CSS v4', 'GSAP & Three.js'],
    },
    {
      heading: 'Back-end — Escalável por Design',
      body: 'Arquitetamos back-ends que escalam horizontalmente sem refatoração. Event-driven com Kafka/RabbitMQ, CQRS quando necessário, caching multi-layer com Redis e CDN, e bancos de dados escolhidos por workload — OLTP ou OLAP.',
      highlights: ['Node.js / Fastify', 'Python / FastAPI', 'Rust / Actix', 'Kafka & RabbitMQ', 'gRPC & REST'],
    },
    {
      heading: 'Data & Infraestrutura',
      body: 'PostgreSQL é nosso canivete suíço — com pg_vector para embeddings, PostGIS para dados geoespaciais e pg_cron para scheduling. Redis para cache/sessions, Elasticsearch para full-text search e ClickHouse para analytics.',
      stat: { value: '50TB+', label: 'Dados Gerenciados' },
    },
    {
      heading: 'DevOps & Platform Engineering',
      body: 'Infraestrutura como código com Terraform e Pulumi, orquestração com Kubernetes (EKS/GKE), observabilidade com OpenTelemetry + Grafana stack, e golden paths para que desenvolvedores deployem com confiança.',
      highlights: ['Kubernetes', 'Terraform / Pulumi', 'GitHub Actions', 'ArgoCD', 'OpenTelemetry'],
      stat: { value: '∞', label: 'Escalabilidade' },
    },
  ],
};

// Deep-dive renderer
const DeepDiveContent = memo(function DeepDiveContent({ sectionId, accentHsl, gradient }: { sectionId: string; accentHsl: string; gradient: string }) {
  const blocks = sectionDeepDive[sectionId];
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="relative z-10 bg-background">
      <div className="fluid-section-pad">
        <div className="flex items-center gap-4 mb-2">
          <div className="h-[2px] flex-1" style={{ background: `linear-gradient(90deg, hsl(${accentHsl} / 0.4), transparent)` }} />
          <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.4em] uppercase" style={{ color: `hsl(${accentHsl} / 0.6)` }}>
            EM PROFUNDIDADE
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

            <p
              className="text-foreground/75 leading-relaxed mb-8 max-w-3xl ml-[calc(clamp(11px,1vw,14px)*3+1rem)]"
              style={{ fontSize: 'clamp(0.875rem, 1.3vw, 1.125rem)' }}
            >
              {block.body}
            </p>

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
                <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                  {block.stat.label}
                </span>
              </div>
            )}

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

          {i < blocks.length - 1 && (
            <div className="max-w-5xl mx-auto mt-10">
              <div className="h-[1px]" style={{ background: `linear-gradient(90deg, transparent, hsl(${accentHsl} / 0.15), transparent)` }} />
            </div>
          )}
        </div>
      ))}

      <div className="text-center py-16">
        <div className="h-[1px] w-20 mx-auto mb-6" style={{ background: gradient }} />
        <p className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.4em] uppercase text-muted-foreground/50">
          VAMOS TRANSFORMAR SUA IDEIA EM REALIDADE?
        </p>
      </div>
    </div>
  );
});

// ─── Cinematic section layout ─────────────────────────────────
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
      const divider = el.querySelector('.section-enter-line');
      if (divider) {
        gsap.fromTo(divider,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 0.6, ease: 'power3.inOut', delay: 0.05 }
        );
      }

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

      gsap.utils.toArray<HTMLElement>(el.querySelectorAll('.cin-subtitle, .cin-desc')).forEach((node) => {
        gsap.fromTo(node,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: node, scroller: el, start: 'top 90%', toggleActions: 'play none none none' },
          }
        );
      });

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

      const titleWords = el.querySelectorAll('.title-word');
      if (titleWords.length) {
        gsap.fromTo(titleWords,
          { y: '110%', opacity: 0 },
          { y: '0%', opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power4.out', delay: 0.15 }
        );
      }

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

  // Scroll-up at top → go back + scroll progress
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

  // Gallery renderer
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

  // Section-specific content
  const renderSectionContent = () => {
    switch (section.id) {
      case 'web-design':
        return (
          <div className="fluid-section-pad">
            {/* Process timeline */}
            <div className="mb-20">
              <h3 className="font-[family-name:var(--font-display)] text-[11px] tracking-[0.4em] uppercase mb-10" style={{ color: `hsl(${colors.accentHsl} / 0.5)` }}>NOSSO PROCESSO</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-1">
                {[
                  { step: '01', icon: '🧬', title: 'Discovery', desc: 'Investigação profunda do problema — como explorar o Spencer Mansion' },
                  { step: '02', icon: '🗝️', title: 'Wireframes', desc: 'Mapeamento de fluxos e arquitetura — cada sala conecta ao destino certo' },
                  { step: '03', icon: '🧪', title: 'Visual Design', desc: 'Experimentos visuais controlados — cores, tipografia e componentes' },
                  { step: '04', icon: '🔬', title: 'Protótipo', desc: 'Testes de usabilidade e refinamento — sobreviver é iterar' },
                  { step: '05', icon: '💉', title: 'Handoff', desc: 'Entrega precisa com tokens e documentação — o antídoto final' },
                ].map((item, i) => (
                  <div key={i} className="detail-item magnetic-card group relative p-6 rounded-sm overflow-hidden" style={{ opacity: 0, background: 'hsl(var(--card) / 0.3)', border: `1px solid hsl(${colors.accentHsl} / 0.15)` }}>
                    <div className="absolute top-0 left-0 right-0 h-[2px] opacity-40 group-hover:opacity-100 transition-opacity duration-500" style={{ background: colors.gradient }} />
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.3em]" style={{ color: `hsl(${colors.accentHsl} / 0.4)` }}>{item.step}</span>
                    </div>
                    <h4 className="font-[family-name:var(--font-display)] text-foreground text-sm font-bold tracking-[0.1em] uppercase mb-2">{item.title}</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Showcase cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { src: '/images/webdesign-detail-01.jpg', title: 'UI Engineering', desc: 'Componentes pixel-perfect com Figma-to-code automatizado' },
                { src: '/images/webdesign-detail-02.jpg', title: 'Brand Identity', desc: 'Sistemas visuais que comunicam a essência da marca' },
                { src: '/images/webdesign-detail-03.jpg', title: 'Motion Design', desc: 'Animações cinematográficas que contam histórias' },
              ].map((card, i) => (
                <div key={i} className="detail-item image-hover-zoom card-hover-glow relative h-[45vh] rounded-sm overflow-hidden border border-border/10" style={{ opacity: 0 }}>
                  <img src={card.src} alt={card.title} loading="lazy" decoding="async" fetchPriority="low" className="w-full h-full object-cover" style={{ filter: 'brightness(0.7) saturate(1.25)' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, hsl(${colors.accentHsl} / 0.08), transparent 60%)` }} />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h4 className="font-[family-name:var(--font-display)] text-foreground font-bold text-base tracking-[0.08em] uppercase mb-1">{card.title}</h4>
                    <p className="text-foreground/60 text-xs leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'desenvolvimento':
        const devCards = [
          { icon: '❄️', title: 'APIs de Alta Performance', desc: 'Endpoints que respondem em <50ms — precisos como o Machado Leviatã. Cache inteligente, rate limiting e documentação OpenAPI.', accent: '200 85% 60%' },
          { icon: '🔥', title: 'Arquitetura Evolutiva', desc: 'Começamos simples, escalamos com a fúria das Lâminas do Caos. Monolitos modulares que evoluem em microsserviços.', accent: '15 90% 55%' },
          { icon: '⚡', title: 'Pipeline Zero-Downtime', desc: 'Deploy blue-green como os Bifröst — instantâneo e sem falhas. Canary releases, feature flags e rollback.', accent: '38 90% 50%' },
          { icon: '🪨', title: 'Dados Inteligentes', desc: 'Modelagem sólida como as runas nórdicas. Índices compostos, materialized views e queries que escalam aos milhões.', accent: '200 70% 50%' },
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
                    <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-6 text-xl border"
                      style={{ background: `hsl(${card.accent} / 0.12)`, borderColor: `hsl(${card.accent} / 0.2)`, boxShadow: `0 0 25px hsl(${card.accent} / 0.12)` }}>
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
            {/* Tech badges */}
            <div className="flex flex-wrap gap-3 mt-16 max-w-6xl">
              {['TypeScript', 'Node.js', 'Python', 'Rust', 'PostgreSQL', 'Redis', 'GraphQL', 'gRPC', 'Docker', 'Kubernetes'].map((tech, i) => (
                <span key={i} className="detail-item font-[family-name:var(--font-display)] text-[10px] tracking-[0.15em] uppercase px-4 py-2 rounded-sm border transition-all duration-300 cursor-default"
                  style={{ opacity: 0, borderColor: `hsl(${colors.accentHsl} / 0.2)`, color: `hsl(${colors.accentHsl} / 0.7)`, background: `hsl(${colors.accentHsl} / 0.04)` }}>
                  {tech}
                </span>
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
            {/* AI capabilities grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-7xl mb-16">
              <div className="detail-item lg:col-span-7 image-hover-zoom card-hover-glow relative h-[50vh] rounded-sm overflow-hidden" style={{ opacity: 0, border: `1px solid hsl(${colors.accentHsl} / 0.15)` }}>
                <img src="/images/ia-detail-01.jpg" alt="IA Generativa" loading="lazy" decoding="async" fetchPriority="low" className="w-full h-full object-cover" style={{ filter: 'brightness(0.7) saturate(1.3)' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, hsl(${colors.accentHsl} / 0.1), transparent)` }} />
                <div className="absolute bottom-6 left-6">
                  <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.3em] uppercase" style={{ color: `hsl(${colors.accentHsl} / 0.8)` }}>🤖 IA GENERATIVA</span>
                  <h4 className="font-[family-name:var(--font-display)] text-foreground text-xl font-bold mt-2">Do Prompt ao Produto</h4>
                </div>
              </div>
              <div className="lg:col-span-5 grid grid-rows-2 gap-4">
                <div className="detail-item card-hover-glow relative p-8 rounded-sm backdrop-blur-sm" style={{ opacity: 0, background: 'hsl(var(--card) / 0.5)', border: `1px solid hsl(${colors.accentHsl} / 0.15)` }}>
                  <div className="text-4xl mb-3">💠</div>
                  <h4 className="font-[family-name:var(--font-display)] text-foreground text-sm font-semibold tracking-wide uppercase mb-2">Agentes Autônomos</h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">Workflows inteligentes como androides — pesquisam, analisam, decidem e executam com precisão sobre-humana.</p>
                </div>
                <div className="detail-item image-hover-zoom card-hover-glow relative h-full rounded-sm overflow-hidden" style={{ opacity: 0, border: `1px solid hsl(${colors.accentHsl} / 0.15)` }}>
                  <img src="/images/automacao-hero.png" alt="RAG Pipeline" loading="lazy" decoding="async" fetchPriority="low" className="w-full h-full object-cover" style={{ filter: 'brightness(0.7) saturate(1.2)' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.2em] uppercase" style={{ color: `hsl(${colors.accentHsl} / 0.8)` }}>🔷 RAG PIPELINE</span>
                  </div>
                </div>
              </div>
            </div>
            {/* AI models we work with */}
            <div className="flex flex-wrap gap-3 max-w-7xl">
              {['GPT-4o', 'Claude 3.5', 'Gemini Pro', 'LLaMA 3', 'Mistral', 'Stable Diffusion', 'Whisper', 'DALL-E'].map((model, i) => (
                <span key={i} className="detail-item font-[family-name:var(--font-display)] text-[10px] tracking-[0.15em] uppercase px-4 py-2 rounded-sm border transition-all duration-300 cursor-default"
                  style={{ opacity: 0, borderColor: `hsl(${colors.accentHsl} / 0.2)`, color: `hsl(${colors.accentHsl} / 0.7)`, background: `hsl(${colors.accentHsl} / 0.05)` }}>
                  {model}
                </span>
              ))}
            </div>
          </div>
        );

      case 'mobile-web':
        return (
          <div className="fluid-section-pad">
            <div className="max-w-6xl mx-auto">
              {/* Device showcase */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <div className="detail-item magnetic-card card-hover-glow flex flex-col items-center p-8 rounded-sm border border-border/10" style={{ opacity: 0, background: 'hsl(var(--card) / 0.3)' }}>
                  <div className="relative w-[180px] h-[360px] rounded-[24px] border-2 border-foreground/20 overflow-hidden shadow-2xl">
                    <img src="/images/mobile-detail-01.jpg" alt="Mobile" loading="lazy" decoding="async" fetchPriority="low" className="w-full h-full object-cover" style={{ filter: 'brightness(0.85) saturate(1.2)' }} />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-background rounded-b-xl" />
                  </div>
                  <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.2em] uppercase text-vice-gold/70 mt-6">REACT NATIVE</span>
                </div>
                <div className="detail-item magnetic-card card-hover-glow flex flex-col items-center p-8 rounded-sm border border-border/10" style={{ opacity: 0, background: 'hsl(var(--card) / 0.3)' }}>
                  <div className="relative w-[260px] h-[340px] rounded-[16px] border-2 border-foreground/20 overflow-hidden shadow-2xl">
                    <img src="/images/mobile-detail-02.jpg" alt="Tablet" loading="lazy" decoding="async" fetchPriority="low" className="w-full h-full object-cover" style={{ filter: 'brightness(0.85) saturate(1.2)' }} />
                  </div>
                  <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.2em] uppercase text-vice-gold/70 mt-6">PWA</span>
                </div>
                <div className="detail-item magnetic-card card-hover-glow flex flex-col items-center p-8 rounded-sm border border-border/10" style={{ opacity: 0, background: 'hsl(var(--card) / 0.3)' }}>
                  <div className="relative w-full h-[220px] rounded-t-lg border-2 border-foreground/20 overflow-hidden shadow-2xl">
                    <img src="/images/mobile-detail-03.jpg" alt="Desktop" loading="lazy" decoding="async" fetchPriority="low" className="w-full h-full object-cover" style={{ filter: 'brightness(0.85) saturate(1.2)' }} />
                  </div>
                  <div className="w-24 h-3 bg-foreground/10 rounded-b-lg" />
                  <div className="w-16 h-1 bg-foreground/10 mt-1 rounded" />
                  <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.2em] uppercase text-vice-gold/70 mt-6">RESPONSIVE WEB</span>
                </div>
              </div>
              {/* Performance metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: '60fps', label: 'Animações' },
                  { value: '<1s', label: 'Cold Start' },
                  { value: '95%', label: 'Código Compartilhado' },
                  { value: '99.5%', label: 'Crash-Free Rate' },
                ].map((metric, i) => (
                  <div key={i} className="detail-item text-center p-6 rounded-sm" style={{ opacity: 0, background: 'hsl(var(--card) / 0.3)', border: '1px solid hsl(var(--border) / 0.1)' }}>
                    <span className="font-[family-name:var(--font-display)] font-bold text-2xl block mb-1" style={{ color: `hsl(${colors.accentHsl})` }}>{metric.value}</span>
                    <span className="font-[family-name:var(--font-display)] text-[9px] tracking-[0.2em] uppercase text-muted-foreground">{metric.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'skills':
        const skills = [
          { name: 'React / Next.js', level: 97, category: 'Front-end' },
          { name: 'TypeScript', level: 95, category: 'Front-end' },
          { name: 'GSAP / Three.js', level: 92, category: 'Creative' },
          { name: 'Node.js / Fastify', level: 93, category: 'Back-end' },
          { name: 'Python / FastAPI', level: 88, category: 'Back-end' },
          { name: 'PostgreSQL', level: 90, category: 'Data' },
          { name: 'Redis / Elasticsearch', level: 85, category: 'Data' },
          { name: 'AWS / Kubernetes', level: 87, category: 'Infra' },
          { name: 'Docker / Terraform', level: 89, category: 'Infra' },
          { name: 'Figma / Design Systems', level: 91, category: 'Design' },
        ];
        return (
          <div className="fluid-section-pad">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
              {skills.map((skill, i) => (
                <div key={i} className="detail-item group" style={{ opacity: 0 }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-[family-name:var(--font-display)] text-foreground/90 text-sm tracking-wide uppercase">{skill.name}</span>
                    <span className="font-[family-name:var(--font-display)] text-[10px] tracking-widest" style={{ color: `hsl(${colors.accentHsl} / 0.6)` }}>{skill.level}%</span>
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
              {['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'Rust', 'PostgreSQL', 'Redis', 'Elasticsearch', 'AWS', 'Docker', 'Kubernetes', 'Terraform', 'Figma', 'GSAP', 'Three.js', 'GraphQL', 'gRPC'].map((tech, i) => (
                <span key={i} className="detail-item card-hover-glow font-[family-name:var(--font-display)] text-[10px] tracking-[0.12em] uppercase px-4 py-2 rounded-sm border transition-all duration-300 cursor-default"
                  style={{ opacity: 0, borderColor: `hsl(${colors.accentHsl} / 0.2)`, color: `hsl(${colors.accentHsl} / 0.7)`, background: `hsl(${colors.accentHsl} / 0.05)` }}>
                  {tech}
                </span>
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
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, hsl(${colors.accentHsl} / 0.12), transparent 60%)` }} />
              <div className="absolute bottom-8 left-8">
                <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.3em] uppercase" style={{ color: `hsl(${colors.accentHsl} / 0.8)` }}>ECOSSISTEMA COMPLETO</span>
                <h4 className="font-[family-name:var(--font-display)] text-foreground text-2xl font-bold mt-2">Do Conceito ao Escala</h4>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl">
              {[
                { icon: '📈', title: 'Growth Marketing', desc: 'Campanhas data-driven com ROAS acima de 4x. Google Ads, Meta Ads, TikTok Ads com tracking server-side e atribuição multi-touch.', accent: 'vice-pink' },
                { icon: '🌐', title: 'Plataformas Web', desc: 'Experiências imersivas com Next.js, edge computing e Core Web Vitals no verde. SEO técnico que coloca você no topo.', accent: 'vice-teal' },
                { icon: '📱', title: 'Apps Mobile', desc: 'React Native com performance nativa. Publicação nas stores, updates OTA com CodePush e analytics de engajamento.', accent: 'vice-sunset' },
                { icon: '⚙️', title: 'SaaS & Plataformas', desc: 'Arquitetura multi-tenant escalável com billing Stripe, dashboards em tempo real e admin panel white-label.', accent: 'vice-sky' },
                { icon: '🚀', title: 'Landing Pages', desc: 'Conversão otimizada com A/B testing, heatmaps, copywriting estratégico e integração com CRM e automação.', accent: 'vice-gold' },
                { icon: '🎨', title: 'Branding Digital', desc: 'Identidade visual que posiciona e diferencia. Logo, tipografia, paleta, guidelines e assets para todos os canais.', accent: 'vice-palm' },
              ].map((card, i) => (
                <div key={i} className="detail-item magnetic-card card-hover-glow relative p-8 rounded-sm overflow-hidden group cursor-pointer"
                  style={{ opacity: 0, background: 'hsl(var(--card) / 0.4)', border: '1px solid hsl(var(--border) / 0.15)' }}>
                  <div className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{ background: `linear-gradient(135deg, hsl(${colors.accentHsl} / 0.1), transparent 60%)` }} />
                  <div className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: colors.gradient }} />
                  <div className="relative z-10">
                    <span className="text-4xl mb-5 block drop-shadow-lg">{card.icon}</span>
                    <h4 className="font-[family-name:var(--font-display)] text-foreground text-base font-semibold tracking-[0.15em] uppercase mb-3">{card.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{card.desc}</p>
                    <div className="h-[1px] w-12 mt-6 transition-all duration-700 group-hover:w-full"
                      style={{ background: colors.gradient }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-20 text-center">
              <p className="font-[family-name:var(--font-display)] text-[11px] tracking-[0.3em] uppercase text-muted-foreground/60 mb-4">PRONTO PARA ESCALAR SEU NEGÓCIO?</p>
              <div className="h-[1px] w-24 mx-auto" style={{ background: colors.gradient }} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div ref={sectionRef} className="absolute inset-0 overflow-y-auto gta-vi-scroll">
      {/* Scroll progress */}
      <div className="fixed right-3 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-1 pointer-events-none">
        <div className="scroll-progress-track w-[2px] bg-foreground/10 rounded-full" style={{ height: 'clamp(4rem, 8vh, 8rem)' }}>
          <div className="scroll-progress-bar w-full rounded-full origin-top" style={{ height: '0%', background: `hsl(${colors.accentHsl})` }} />
        </div>
      </div>

      {/* HERO */}
      <div className="relative h-screen w-full overflow-hidden flex items-end parallax-hero">
        <div className="absolute inset-0">
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

      {/* CONTENT */}
      <div className="relative z-10 bg-background">
        <div className="w-full h-[1px]" style={{ background: `linear-gradient(90deg, transparent, hsl(${colors.accentHsl} / 0.3), hsl(${colors.accentHsl} / 0.15), transparent)` }} />

        <div className="cin-desc" style={{ padding: `clamp(1rem, 3vw, 1.5rem) clamp(1.5rem, 4vw, 6rem)` }}>
          <div className="max-w-5xl">
            <p className="text-foreground/90 leading-relaxed font-light tracking-tight" style={{ fontSize: 'clamp(1rem, 2vw, 1.875rem)' }}>{section.description}</p>
          </div>
        </div>

        {/* Gallery */}
        <div ref={galleryRef}>{renderGallery()}</div>

        {/* Details */}
        <div ref={detailsRef} style={{ padding: `clamp(1rem, 3vw, 1.5rem) clamp(1.5rem, 4vw, 6rem)` }}>
          {section.id === 'servicos' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl">
              {section.details.map((detail, i) => {
                const emoji = detail.slice(0, 2);
                const rest = detail.slice(3);
                const [title, desc] = rest.split(' — ');
                const cardAccents = [
                  'hsl(335 75% 55%)', 'hsl(185 80% 55%)', 'hsl(25 95% 55%)',
                  'hsl(210 90% 60%)', 'hsl(45 100% 55%)', 'hsl(270 70% 60%)'
                ];
                const accent = cardAccents[i] || cardAccents[0];
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
                );
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

        {/* Deep-dive */}
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

    const prevScroller = document.querySelector('.gta-vi-scroll');
    if (prevScroller) prevScroller.scrollTop = 0;

    setIsVisible(false);
    setActiveSlide(slideIndex);

    openFrameRef.current = requestAnimationFrame(() => {
      setIsVisible(true);
      openFrameRef.current = null;

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

  // Scroll-up for focuss-dev
  useEffect(() => {
    if (!isVisible || activeSlide === null) return;
    const container = containerRef.current;
    if (!container) return;
    if (sections[activeSlide].id !== 'focuss-dev') return;

    let accum = 0;
    const scroller = container.querySelector('.gta-vi-scroll');
    const handleWheel = (e: WheelEvent) => {
      const scrollEl = scroller || container;
      if ((scrollEl as HTMLElement).scrollTop <= 5 && e.deltaY < 0) {
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
      const animEls = document.querySelectorAll('.anim-el');
      gsap.fromTo(animEls,
        { opacity: 0, y: 30, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.08, ease: 'power3.out' }
      );

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
      {section && (() => {
        const isFocussDev = section.id === 'focuss-dev';
        return (
        <div key={section.id} className="relative h-screen overflow-hidden">
          {/* Back button */}
          <button
            className="absolute top-6 left-6 z-50 flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors duration-300 font-[family-name:var(--font-display)] text-xs tracking-[0.15em] uppercase bg-background/40 px-3 py-2 rounded-sm border border-border/20 hover:border-accent/30"
            onClick={goBack}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 19V5m7 7l-7-7-7 7" /></svg>
            Voltar
          </button>

          {/* FOCUSS DEV */}
          {isFocussDev && (
            <div className="absolute inset-0 overflow-y-auto gta-vi-scroll">
              <div className="relative min-h-screen flex items-center">
                <div className="absolute inset-0">
                  <img src={section.image} alt={section.title} loading="lazy" decoding="async" className="w-full h-full object-cover" style={{ position: 'sticky', top: 0 }} />
                  <div className="absolute inset-0 bg-background/80" />
                  <div className="absolute inset-0 opacity-20" style={{ background: `linear-gradient(135deg, hsl(45 100% 55% / 0.2) 0%, transparent 60%)` }} />
                </div>
                <div className="relative z-10 w-full px-6 md:px-16 lg:px-24 py-24">
                  <div className="w-full max-w-4xl mx-auto">
                    <div className="anim-el h-[2px] w-16 mb-6 origin-left bg-accent" style={{ opacity: 0 }} />
                    <span className="anim-el block font-[family-name:var(--font-display)] text-xs tracking-[0.2em] uppercase mb-3 text-accent" style={{ opacity: 0 }}>{section.subtitle}</span>
                    <h2 className="anim-el font-[family-name:var(--font-display)] text-4xl md:text-6xl lg:text-7xl font-light text-foreground mb-6 leading-tight tracking-tight" style={{ opacity: 0 }}>{section.title}</h2>
                    <p className="anim-el text-muted-foreground text-base md:text-lg leading-relaxed mb-10 max-w-2xl" style={{ opacity: 0 }}>{section.description}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                      {[
                        { value: '6', suffix: '+', label: 'Anos no Mercado', target: 6 },
                        { value: '200', suffix: '+', label: 'Projetos Entregues', target: 200 },
                        { value: '98', suffix: '%', label: 'Satisfação dos Clientes', target: 98 },
                        { value: '∞', suffix: '', label: 'Curiosidade', target: null },
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

                    <div className="flex flex-col items-center mt-16 opacity-50">
                      <span className="font-[family-name:var(--font-display)] text-[9px] tracking-[0.3em] uppercase text-accent/60 mb-2">Role para saber mais</span>
                      <div className="w-[1px] h-8 bg-accent/30 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>

              <DeepDiveContent sectionId="focuss-dev" accentHsl={focussDevColors.accentHsl} gradient={focussDevColors.gradient} />
            </div>
          )}

          {/* All other sections: Lightweight cinematic style */}
          {!isFocussDev && (
            <CinematicSection section={section} onScrollUpAtTop={goBack} />
          )}
        </div>
        );
      })()}
    </div>
  );
}
