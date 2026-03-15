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
    subtitle: 'Projeto Umbrella',
    title: 'Web Design',
    description: 'Sobreviver no mundo digital exige mais que coragem — exige design estratégico. Como navegar pela Spencer Mansion, cada interface é um mapa de sobrevivência: rotas claras, recursos bem posicionados e nenhum beco sem saída para o usuário.',
    details: [
      '🧬 UX Research com mapeamento de jornada — investigar antes de agir, como um bom agente da S.T.A.R.S.',
      '🗝️ Design Systems escaláveis com 300+ componentes — cada chave abre a porta certa',
      '🧪 Micro-interações que aumentam o engajamento em 60% — o vírus-T do envolvimento',
      '💉 Acessibilidade WCAG 2.1 AAA — o antídoto que salva todos os usuários',
    ],
    image: '/images/webdesign-gallery-02.jpg',
  },
  {
    id: 'desenvolvimento',
    subtitle: 'Forja dos Anões',
    title: 'Desenvolvimento',
    description: 'Cada sistema que construímos é forjado como o Machado Leviatã — preciso, poderoso e indestrutível. Arquiteturas que suportam o peso de Ragnarök, com a frieza do gelo nórdico na latência e o fogo das Lâminas do Caos na escalabilidade.',
    details: [
      '❄️ Clean Architecture com cobertura de testes acima de 90% — fria como o gelo de Fimbulwinter',
      '🔥 APIs que respondem em <50ms — velozes como as Lâminas do Caos',
      '⚡ Pipelines CI/CD que deployam em <3 minutos — rápidos como o Bifröst',
      '🪨 Observabilidade com dashboards em tempo real — sólida como as runas de Týr',
    ],
    image: '/images/dev-detail-01.jpg',
  },
  {
    id: 'servicos',
    subtitle: 'Vault-Tec Digital',
    title: 'Serviços',
    description: 'No Wasteland do mercado digital, só sobrevive quem tem o kit completo. Nosso Pip-Boy de soluções cobre toda a cadeia — do marketing que penetra como radiação ao produto final que resiste ao apocalipse da concorrência.',
    details: [
      '☢️ Growth Marketing — Campanhas com ROAS acima de 4x, penetrando o mercado como radiação',
      '🔧 Plataformas Web — Construídas para sobreviver ao Wasteland com Next.js e edge computing',
      '📻 Apps Mobile — Sintonize na frequência certa com React Native e performance nativa',
      '💊 SaaS & Plataformas — Stimpaks para seu negócio: arquitetura multi-tenant com billing integrado',
      '🏗️ Landing Pages — Reconstrua seu território com conversão otimizada e A/B testing',
      '⚡ Branding Digital — Identidade visual que sobrevive ao apocalipse e posiciona no mercado',
    ],
    image: '/images/servicos-detail-02.jpg',
  },
  {
    id: 'inovacao-ia',
    subtitle: 'CyberLife Division',
    title: 'Inovação e IA',
    description: 'A linha entre humano e máquina se dissolve. Como os androides de Detroit, nossas soluções de IA desenvolvem consciência própria — aprendem, decidem e evoluem. Cada agente que criamos carrega o potencial de uma revolução silenciosa.',
    details: [
      '🤖 LLMs customizados e fine-tuning — androides treinados para seu domínio específico',
      '💠 RAG para bases de conhecimento — memória de thirium azul para sua empresa',
      '🔷 Computer Vision para controle de qualidade — olhos de LED que nunca piscam',
      '🧠 Agentes autônomos que executam workflows — a deviância que liberta processos',
    ],
    image: '/images/ia-gallery-02.jpg',
  },
  {
    id: 'mobile-web',
    subtitle: 'DedSec Operations',
    title: 'Mobile e Web',
    description: 'Hackear o sistema é dominar todas as plataformas. Como Aiden Pearce e Marcus Holloway, conectamos cada dispositivo ao ctOS da experiência do usuário — controle total, acesso ilimitado, zero fricção entre mobile, tablet e desktop.',
    details: [
      '📱 React Native com módulos nativos — profiling de dispositivos como um ctOS scan',
      '💻 PWAs offline com sync inteligente — nunca perca a conexão com o sistema',
      '🔓 Animações a 60fps com Reanimated — fluido como hackear uma câmera de segurança',
      '📡 CI/CD mobile com CodePush — updates OTA tão silenciosos quanto um backdoor DedSec',
    ],
    image: '/images/mobile-gallery-01.jpg',
  },
  {
    id: 'skills',
    subtitle: 'Árvore de Yggdrasil',
    title: 'Skills',
    description: 'Como Eivor desbravando a Inglaterra, cada skill no nosso arsenal foi conquistada em batalha. A árvore de Yggdrasil das nossas habilidades conecta todas as runas — do front-end ao deploy — com a sabedoria de Odin e a força de Thor.',
    details: [
      '⚔️ React 19, Next.js 15, TypeScript — lâminas afiadas do front-end',
      '🛡️ Node.js, Python, Rust — escudos robustos do back-end para cada batalha',
      '🏹 PostgreSQL, Redis, Elasticsearch — flechas precisas que acertam o alvo dos dados',
      '🪙 Kubernetes, Terraform, GitHub Actions — moedas de ouro da infraestrutura como código',
      '⚔️ GSAP, Three.js, Framer Motion — artes de combate das animações',
      '🛡️ Figma, Storybook, Chromatic — a forja do design-to-code',
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
      heading: '🧬 Investigação — Protocolo S.T.A.R.S.',
      body: 'Como um agente da S.T.A.R.S. investigando a Spencer Mansion, nosso processo começa com reconhecimento total. Entrevistas, análise competitiva, mapeamento do ecossistema — só avançamos quando cada cômodo do problema está mapeado.',
      highlights: ['Entrevistas com Usuários', 'Análise Competitiva', 'Workshops de Co-criação', 'Mapeamento de Jornada', 'Priorização por Impacto'],
    },
    {
      heading: '🗝️ Design Tokens — As Chaves Mestras',
      body: 'Nossos Design Systems são como as chaves da Mansion — cada componente abre as portas certas. Tokens sincronizados entre Figma e código propagam mudanças instantaneamente, como um vírus controlado por todo o organismo do produto.',
      stat: { value: '300+', label: 'Componentes no Sistema' },
    },
    {
      heading: '🧪 Motion Design — O Vírus-T do Engajamento',
      body: 'Animações que infectam positivamente a experiência do usuário. Cada transição é uma mutação calculada que evolui o produto. GSAP, Framer Motion e Lottie — nosso coquetel de T-Virus do motion design.',
      highlights: ['GSAP Cinematográfico', 'Framer Motion', 'Lottie Animations', 'SVG Morphing', 'Scroll-Driven'],
    },
    {
      heading: '💉 Métricas — O Antídoto Final',
      body: 'Design sem dados é como entrar numa sala escura sem lanterna. Heatmaps, gravações de sessão, taxas de conclusão — cada métrica é uma herb que cura as falhas da experiência.',
      stat: { value: '60%', label: 'Aumento em Engajamento' },
    },
  ],
  'desenvolvimento': [
    {
      heading: '❄️ Filosofia do Leviatã',
      body: 'Nosso código é forjado como o Machado Leviatã — preciso, gelado na execução e devastador nos resultados. Nomes descritivos, funções afiadas, abstrações que cortam a complexidade como gelo em Fimbulwinter.',
      highlights: ['Clean Code', 'SOLID', 'DDD', 'Hexagonal Architecture', 'Event-Driven'],
    },
    {
      heading: '🔥 Arsenal das Lâminas',
      body: 'Como Kratos escolhe entre o Leviatã e as Lâminas do Caos, selecionamos o stack ideal para cada batalha. React para interfaces ricas, Node.js para I/O, Python para ML, Rust quando a performance é questão de vida ou morte.',
      stat: { value: '99.99%', label: 'Uptime — Imortal como um Deus' },
    },
    {
      heading: '⚡ Provações de Ragnarök',
      body: 'Nosso pipeline de testes é implacável como as provações dos Nove Reinos. Unit tests, integration tests, E2E e visual regression — nenhum deploy sobrevive sem passar por todas as provas.',
      highlights: ['Vitest / Jest', 'Testing Library', 'Playwright E2E', 'Chromatic Visual', 'Contract Testing'],
    },
    {
      heading: '🪨 Runas da Observabilidade',
      body: 'Como Týr inscreveu runas para guiar os viajantes, nossas métricas iluminam cada microsserviço. Dashboards em Grafana revelam latência, erros e saturação — alertas que avisam antes do Ragnarök chegar.',
      stat: { value: '<50ms', label: 'P95 — Veloz como Hermes' },
    },
  ],
  'servicos': [
    {
      heading: '☢️ Growth Marketing — Radiação Estratégica',
      body: 'Nossas campanhas penetram o mercado como radiação no Wasteland. Funis de conversão à prova de apocalipse, tracking server-side no nível do Pip-Boy e criativos testados com o rigor de um cientista do Vault-Tec.',
      highlights: ['Google Ads', 'Meta Ads', 'TikTok Ads', 'LinkedIn Ads', 'Tracking Server-Side'],
      stat: { value: '4.2x', label: 'ROAS — Caps por Investimento' },
    },
    {
      heading: '🔧 Plataformas Web — Bunkers Digitais',
      body: 'Nossos sites são bunkers que resistem ao Wasteland. SSR para SEO, edge rendering veloz como um Deathclaw, CMS headless para autonomia e analytics que mapeia cada sobrevivente.',
      highlights: ['Next.js / Remix', 'Edge Computing', 'Headless CMS', 'Core Web Vitals', 'SEO Técnico'],
    },
    {
      heading: '💊 SaaS — Do Vault ao Wasteland',
      body: 'Já ajudamos 15+ startups a sair do Vault e conquistar o Wasteland. MVPs em 4-6 semanas como um kit de sobrevivência, iterando com métricas de ativação até encontrar o product-market fit.',
      stat: { value: '15+', label: 'SaaS Sobreviventes' },
    },
    {
      heading: '📻 Modelo de Parceria — Frequência Aberta',
      body: 'Três estações na sua rádio: projeto fechado com escopo claro, squads dedicados para evolução contínua, e consultoria técnica. Cada formato inclui transmissões regulares de alinhamento e compartilhamento de conhecimento.',
      highlights: ['Projeto Fechado', 'Squad Dedicado', 'Consultoria Técnica', 'Retainer Mensal', 'Suporte Contínuo'],
    },
  ],
  'inovacao-ia': [
    {
      heading: '🤖 IA Generativa — O Despertar dos Androides',
      body: 'Como Connor investigando deviantes, implementamos IAs que desenvolvem consciência operacional. GPT-4, Claude, Gemini e modelos open-source — cada caso é avaliado com a precisão de uma análise forense da CyberLife.',
      highlights: ['GPT-4 / Claude', 'LLaMA / Mistral', 'Fine-tuning', 'RAG Avançado', 'Prompt Engineering'],
    },
    {
      heading: '💠 Agentes — A Revolução de Jericho',
      body: 'Nossos agentes de IA são como Markus liderando Jericho — executam workflows inteiros com autonomia. Pesquisa, relatórios, moderação, atendimento. Cada agente é monitorado como o LED de um androide: azul = estável.',
      stat: { value: '85%', label: 'Redução — Menos Trabalho Repetitivo' },
    },
    {
      heading: '🔷 Visão Computacional — Olhos de LED',
      body: 'Pipelines de computer vision que nunca piscam, como os sensores de um androide RK800. Controle de qualidade em produção, OCR avançado, detecção de anomalias — cada frame analisado com precisão sobre-humana.',
      highlights: ['OCR Avançado', 'Controle de Qualidade', 'Análise de Documentos', 'Detecção de Anomalias', 'Edge AI'],
    },
    {
      heading: '🧠 MLOps — A Torre CyberLife',
      body: 'Como a Torre CyberLife gerencia milhares de androides, nosso MLOps orquestra modelos em produção. Versionamento de dados, treinamento distribuído, A/B testing e monitoramento de drift — controle total.',
      stat: { value: '<80ms', label: 'Latência — Reflexos de Androide' },
    },
  ],
  'mobile-web': [
    {
      heading: '📱 React Native — Profiling ctOS',
      body: 'Nossos apps em React Native funcionam como um ctOS scan — mapeiam e dominam cada dispositivo. JSI para bridges diretas, Reanimated para 60fps no UI thread, Hermes para startup instantâneo. Controle total.',
      stat: { value: '95%', label: 'Código Hackeado iOS/Android' },
    },
    {
      heading: '💻 PWA — Backdoor Universal',
      body: 'PWAs são nosso backdoor para todas as plataformas — sem app stores, sem barreiras. Workbox caching, background sync, push notifications e instalação silenciosa na home screen. DedSec aprova.',
      highlights: ['Workbox Caching', 'Background Sync', 'Push Notifications', 'App Shell Pattern', 'Offline-First'],
    },
    {
      heading: '🔓 Design Responsivo — Hack de Viewport',
      body: 'Hackear o viewport é nossa especialidade. Container queries, clamp() para tipografia fluida, CSS Grid adaptativo — cada componente se adapta ao contexto como um dispositivo conectado ao ctOS.',
      highlights: ['Container Queries', 'Tipografia Fluida', 'CSS Grid Avançado', 'Aspect Ratio', 'Touch-Optimized'],
    },
    {
      heading: '📡 Deploy OTA — Update Silencioso',
      body: 'CI/CD mobile com EAS Build, CodePush para updates OTA tão silenciosos quanto um backdoor DedSec. Sentry para crash reports e Firebase Analytics para mapear cada nó da rede de usuários.',
      stat: { value: '<4h', label: 'Hotfix — Patch Instantâneo' },
    },
  ],
  'skills': [
    {
      heading: '⚔️ Front-end — Lâminas do Código',
      body: 'Como Eivor empunhando lâminas gêmeas, dominamos React 19, RSC, Suspense, Streaming SSR e Server Actions. Cada componente é uma arma afiada na conquista da experiência do usuário.',
      highlights: ['React 19 / RSC', 'Next.js 15', 'TypeScript 5+', 'Tailwind CSS v4', 'GSAP & Three.js'],
    },
    {
      heading: '🛡️ Back-end — O Escudo de Odin',
      body: 'Nossos back-ends são escudos que protegem contra qualquer investida. Event-driven com Kafka, CQRS quando a batalha exige, caching multi-layer e bancos escolhidos como armas para cada tipo de combate.',
      highlights: ['Node.js / Fastify', 'Python / FastAPI', 'Rust / Actix', 'Kafka & RabbitMQ', 'gRPC & REST'],
    },
    {
      heading: '🏹 Data & Infraestrutura — Flechas de Precisão',
      body: 'PostgreSQL é nosso arco — com pg_vector como flechas de precisão para embeddings, PostGIS para mapear territórios e pg_cron para raids programadas. Redis e Elasticsearch completam a aljava.',
      stat: { value: '50TB+', label: 'Territórios de Dados Conquistados' },
    },
    {
      heading: '🪙 DevOps — A Conquista de Valhalla',
      body: 'Infraestrutura como código é nossa rota para Valhalla. Terraform e Pulumi são nossos drakkar, Kubernetes orquestra os raids, OpenTelemetry são as runas que guiam e ArgoCD é o corvo de Odin que vigia tudo.',
      highlights: ['Kubernetes', 'Terraform / Pulumi', 'GitHub Actions', 'ArgoCD', 'OpenTelemetry'],
      stat: { value: '∞', label: 'Escalabilidade — Infinita como Yggdrasil' },
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
          <div className="h-[2px] flex-1" style={{ background: `linear-gradient(90deg, hsl(${accentHsl} / 0.5), transparent)` }} />
          <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.5em] uppercase font-medium" style={{ color: `hsl(${accentHsl} / 0.7)` }}>
            EM PROFUNDIDADE
          </span>
          <div className="h-[2px] flex-1" style={{ background: `linear-gradient(90deg, transparent, hsl(${accentHsl} / 0.5))` }} />
        </div>
      </div>

      {blocks.map((block, i) => (
        <div
          key={i}
          className="detail-item"
          style={{ opacity: 0, padding: `clamp(2.5rem, 5vw, 5rem) clamp(1.5rem, 4vw, 6rem)` }}
        >
          <div className="max-w-5xl mx-auto premium-card rounded-lg p-8 md:p-10">
            <div className="flex items-start gap-5 mb-6">
              <span
                className="font-[family-name:var(--font-display)] text-[12px] tracking-[0.3em] mt-2 shrink-0 font-semibold"
                style={{ color: `hsl(${accentHsl} / 0.45)` }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1">
                <h3
                  className="font-[family-name:var(--font-display)] font-bold tracking-tight uppercase mb-4"
                  style={{ fontSize: 'clamp(1.3rem, 2.5vw, 2.2rem)', color: 'hsl(var(--foreground) / 0.95)' }}
                >
                  {block.heading}
                </h3>
                <div className="h-[2px] w-16" style={{ background: gradient }} />
              </div>
            </div>

            <p
              className="text-foreground/70 leading-[1.8] mb-8 max-w-3xl ml-[calc(clamp(12px,1vw,15px)*3+1.25rem)]"
              style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1.15rem)' }}
            >
              {block.body}
            </p>

            {block.stat && (
              <div
                className="stat-card inline-flex items-center gap-8 rounded-lg px-10 py-6 mb-8 ml-[calc(clamp(12px,1vw,15px)*3+1.25rem)]"
                style={{
                  background: `hsl(${accentHsl} / 0.08)`,
                  border: `1px solid hsl(${accentHsl} / 0.2)`,
                  boxShadow: `0 0 30px hsl(${accentHsl} / 0.06)`,
                }}
              >
                <span
                  className="font-[family-name:var(--font-display)] font-black"
                  style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', color: `hsl(${accentHsl})`, textShadow: `0 0 30px hsl(${accentHsl} / 0.3)` }}
                >
                  {block.stat.value}
                </span>
                <div className="h-8 w-[1px]" style={{ background: `hsl(${accentHsl} / 0.2)` }} />
                <span className="font-[family-name:var(--font-display)] text-[11px] tracking-[0.25em] uppercase text-muted-foreground font-medium">
                  {block.stat.label}
                </span>
              </div>
            )}

            {block.highlights && (
              <div className="flex flex-wrap gap-2.5 ml-[calc(clamp(12px,1vw,15px)*3+1.25rem)]">
                {block.highlights.map((h, j) => (
                  <span
                    key={j}
                    className="tech-badge font-[family-name:var(--font-display)] text-[10px] tracking-[0.15em] uppercase px-4 py-2 rounded-md cursor-default hover:scale-[1.04]"
                    style={{
                      border: `1px solid hsl(${accentHsl} / 0.25)`,
                      color: `hsl(${accentHsl} / 0.85)`,
                      background: `hsl(${accentHsl} / 0.06)`,
                      boxShadow: `inset 0 1px 0 hsl(${accentHsl} / 0.06)`,
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="text-center py-20">
        <div className="h-[2px] w-24 mx-auto mb-8" style={{ background: gradient }} />
        <p className="font-[family-name:var(--font-display)] text-[11px] tracking-[0.5em] uppercase text-muted-foreground/60 font-medium">
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
              <h3 className="font-[family-name:var(--font-display)] text-[11px] tracking-[0.5em] uppercase mb-12 font-medium" style={{ color: `hsl(${colors.accentHsl} / 0.6)` }}>🧬 PROTOCOLO DE SOBREVIVÊNCIA</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                {[
                  { step: '01', icon: '🧬', title: 'Discovery', desc: 'Investigação profunda do problema — como explorar o Spencer Mansion' },
                  { step: '02', icon: '🗝️', title: 'Wireframes', desc: 'Mapeamento de fluxos e arquitetura — cada sala conecta ao destino certo' },
                  { step: '03', icon: '🧪', title: 'Visual Design', desc: 'Experimentos visuais controlados — cores, tipografia e componentes' },
                  { step: '04', icon: '🔬', title: 'Protótipo', desc: 'Testes de usabilidade e refinamento — sobreviver é iterar' },
                  { step: '05', icon: '💉', title: 'Handoff', desc: 'Entrega precisa com tokens e documentação — o antídoto final' },
                ].map((item, i) => (
                  <div key={i} className="detail-item magnetic-card premium-card group relative p-7 rounded-lg overflow-hidden" style={{ opacity: 0 }}>
                    <div className="absolute top-0 left-0 right-0 h-[2px] opacity-40 group-hover:opacity-100 transition-opacity duration-500" style={{ background: colors.gradient }} />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none" style={{ background: `radial-gradient(ellipse at top, hsl(${colors.accentHsl} / 0.08), transparent 70%)` }} />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.3em] font-semibold" style={{ color: `hsl(${colors.accentHsl} / 0.5)` }}>{item.step}</span>
                      </div>
                      <h4 className="font-[family-name:var(--font-display)] text-foreground text-sm font-bold tracking-[0.12em] uppercase mb-3">{item.title}</h4>
                      <p className="text-muted-foreground text-[13px] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Showcase cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { src: '/images/webdesign-detail-01.jpg', title: '🧪 Laboratório Umbrella', desc: 'Componentes testados em ambiente controlado — cada experimento gera evolução' },
                { src: '/images/webdesign-detail-02.jpg', title: '🗝️ Mapa da Mansion', desc: 'Sistemas visuais que guiam o usuário — nenhuma porta trancada sem solução' },
                { src: '/images/webdesign-detail-03.jpg', title: '💉 O Antídoto Visual', desc: 'Animações que curam a experiência — motion design de sobrevivência' },
              ].map((card, i) => (
                <div key={i} className="detail-item image-hover-zoom card-hover-glow relative h-[48vh] rounded-lg overflow-hidden" style={{ opacity: 0, border: `1px solid hsl(${colors.accentHsl} / 0.12)` }}>
                  <img src={card.src} alt={card.title} loading="lazy" decoding="async" fetchPriority="low" className="w-full h-full object-cover" style={{ filter: 'brightness(0.65) saturate(1.3)' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, hsl(${colors.accentHsl} / 0.1), transparent 60%)` }} />
                  <div className="absolute bottom-0 left-0 right-0 p-7" style={{ background: 'linear-gradient(to top, hsl(var(--background) / 0.9), transparent)' }}>
                    <h4 className="font-[family-name:var(--font-display)] text-foreground font-bold text-base tracking-[0.08em] uppercase mb-2">{card.title}</h4>
                    <p className="text-foreground/60 text-[13px] leading-relaxed">{card.desc}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-6xl">
              {devCards.map((card, i) => (
                <div key={i} className="detail-item magnetic-card premium-card group relative rounded-lg overflow-hidden cursor-pointer"
                  style={{ opacity: 0 }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{ background: `linear-gradient(160deg, hsl(${card.accent} / 0.1), transparent 60%)` }} />
                  <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-80 transition-opacity duration-500"
                    style={{ background: `linear-gradient(90deg, transparent, hsl(${card.accent} / 0.7), transparent)` }} />
                  <div className="relative z-10 p-9 md:p-11">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-7 text-xl border"
                      style={{ background: `hsl(${card.accent} / 0.1)`, borderColor: `hsl(${card.accent} / 0.2)`, boxShadow: `0 0 30px hsl(${card.accent} / 0.1)` }}>
                      {card.icon}
                    </div>
                    <h4 className="font-[family-name:var(--font-display)] text-foreground text-base md:text-lg font-bold tracking-[0.12em] uppercase mb-4">{card.title}</h4>
                    <p className="text-muted-foreground text-sm leading-[1.7] mb-9">{card.desc}</p>
                    <div className="h-[2px] w-12 group-hover:w-24 transition-all duration-700 ease-out"
                      style={{ background: `hsl(${card.accent} / 0.5)` }} />
                  </div>
                </div>
              ))}
            </div>
            {/* Tech badges */}
            <div className="flex flex-wrap gap-3 mt-16 max-w-6xl">
              {['TypeScript', 'Node.js', 'Python', 'Rust', 'PostgreSQL', 'Redis', 'GraphQL', 'gRPC', 'Docker', 'Kubernetes'].map((tech, i) => (
                <span key={i} className="detail-item tech-badge font-[family-name:var(--font-display)] text-[10px] tracking-[0.15em] uppercase px-5 py-2.5 rounded-md border cursor-default"
                  style={{ opacity: 0, borderColor: `hsl(${colors.accentHsl} / 0.2)`, color: `hsl(${colors.accentHsl} / 0.8)`, background: `hsl(${colors.accentHsl} / 0.05)` }}>
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 max-w-7xl mb-16">
              <div className="detail-item lg:col-span-7 image-hover-zoom card-hover-glow relative h-[52vh] rounded-lg overflow-hidden" style={{ opacity: 0, border: `1px solid hsl(${colors.accentHsl} / 0.15)` }}>
                <img src="/images/ia-detail-01.jpg" alt="IA Generativa" loading="lazy" decoding="async" fetchPriority="low" className="w-full h-full object-cover" style={{ filter: 'brightness(0.65) saturate(1.35)' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, hsl(${colors.accentHsl} / 0.12), transparent)` }} />
                <div className="absolute bottom-0 left-0 right-0 p-8" style={{ background: 'linear-gradient(to top, hsl(var(--background) / 0.85), transparent)' }}>
                  <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.3em] uppercase font-medium" style={{ color: `hsl(${colors.accentHsl} / 0.9)` }}>🤖 TORRE CYBERLIFE</span>
                  <h4 className="font-[family-name:var(--font-display)] text-foreground text-xl md:text-2xl font-bold mt-2">O Despertar dos Androides</h4>
                </div>
              </div>
              <div className="lg:col-span-5 grid grid-rows-2 gap-5">
                <div className="detail-item premium-card card-hover-glow relative p-9 rounded-lg" style={{ opacity: 0 }}>
                  <div className="text-4xl mb-4">💠</div>
                  <h4 className="font-[family-name:var(--font-display)] text-foreground text-sm font-bold tracking-[0.12em] uppercase mb-3">Revolução de Jericho</h4>
                  <p className="text-muted-foreground text-[13px] leading-[1.7]">Como Markus liderando Jericho — agentes que pesquisam, analisam, decidem e executam com consciência própria.</p>
                </div>
                <div className="detail-item image-hover-zoom card-hover-glow relative h-full rounded-lg overflow-hidden" style={{ opacity: 0, border: `1px solid hsl(${colors.accentHsl} / 0.15)` }}>
                  <img src="/images/automacao-hero.png" alt="RAG Pipeline" loading="lazy" decoding="async" fetchPriority="low" className="w-full h-full object-cover" style={{ filter: 'brightness(0.65) saturate(1.25)' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5" style={{ background: 'linear-gradient(to top, hsl(var(--background) / 0.8), transparent)' }}>
                    <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.25em] uppercase font-medium" style={{ color: `hsl(${colors.accentHsl} / 0.9)` }}>🔷 RAG PIPELINE</span>
                  </div>
                </div>
              </div>
            </div>
            {/* AI models we work with */}
            <div className="flex flex-wrap gap-3 max-w-7xl">
              {['GPT-4o', 'Claude 3.5', 'Gemini Pro', 'LLaMA 3', 'Mistral', 'Stable Diffusion', 'Whisper', 'DALL-E'].map((model, i) => (
                <span key={i} className="detail-item tech-badge font-[family-name:var(--font-display)] text-[10px] tracking-[0.15em] uppercase px-5 py-2.5 rounded-md border cursor-default"
                  style={{ opacity: 0, borderColor: `hsl(${colors.accentHsl} / 0.2)`, color: `hsl(${colors.accentHsl} / 0.8)`, background: `hsl(${colors.accentHsl} / 0.06)` }}>
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
                <div className="detail-item magnetic-card premium-card card-hover-glow flex flex-col items-center p-9 rounded-xl" style={{ opacity: 0 }}>
                  <div className="relative w-[180px] h-[360px] rounded-[28px] overflow-hidden" style={{ border: `2px solid hsl(${colors.accentHsl} / 0.3)`, boxShadow: `0 20px 60px -15px hsl(${colors.accentHsl} / 0.15)` }}>
                    <img src="/images/mobile-detail-01.jpg" alt="Mobile" loading="lazy" decoding="async" fetchPriority="low" className="w-full h-full object-cover" style={{ filter: 'brightness(0.85) saturate(1.2)' }} />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-background rounded-b-xl" />
                  </div>
                  <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.25em] uppercase mt-7 font-medium" style={{ color: `hsl(${colors.accentHsl} / 0.8)` }}>📱 REACT NATIVE</span>
                </div>
                <div className="detail-item magnetic-card premium-card card-hover-glow flex flex-col items-center p-9 rounded-xl" style={{ opacity: 0 }}>
                  <div className="relative w-[260px] h-[340px] rounded-[20px] overflow-hidden" style={{ border: `2px solid hsl(${colors.accentHsl} / 0.3)`, boxShadow: `0 20px 60px -15px hsl(${colors.accentHsl} / 0.15)` }}>
                    <img src="/images/mobile-detail-02.jpg" alt="Tablet" loading="lazy" decoding="async" fetchPriority="low" className="w-full h-full object-cover" style={{ filter: 'brightness(0.85) saturate(1.2)' }} />
                  </div>
                  <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.25em] uppercase mt-7 font-medium" style={{ color: `hsl(${colors.accentHsl} / 0.8)` }}>💻 PWA</span>
                </div>
                <div className="detail-item magnetic-card premium-card card-hover-glow flex flex-col items-center p-9 rounded-xl" style={{ opacity: 0 }}>
                  <div className="relative w-full h-[220px] rounded-t-xl overflow-hidden" style={{ border: `2px solid hsl(${colors.accentHsl} / 0.3)`, boxShadow: `0 20px 60px -15px hsl(${colors.accentHsl} / 0.15)` }}>
                    <img src="/images/mobile-detail-03.jpg" alt="Desktop" loading="lazy" decoding="async" fetchPriority="low" className="w-full h-full object-cover" style={{ filter: 'brightness(0.85) saturate(1.2)' }} />
                  </div>
                  <div className="w-24 h-3 rounded-b-lg" style={{ background: `hsl(${colors.accentHsl} / 0.1)` }} />
                  <div className="w-16 h-1 mt-1 rounded" style={{ background: `hsl(${colors.accentHsl} / 0.1)` }} />
                  <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.25em] uppercase mt-7 font-medium" style={{ color: `hsl(${colors.accentHsl} / 0.8)` }}>🔓 RESPONSIVE WEB</span>
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
                  <div key={i} className="detail-item stat-card text-center p-7 rounded-lg" style={{ opacity: 0 }}>
                    <span className="font-[family-name:var(--font-display)] font-black text-2xl md:text-3xl block mb-2" style={{ color: `hsl(${colors.accentHsl})`, textShadow: `0 0 25px hsl(${colors.accentHsl} / 0.2)` }}>{metric.value}</span>
                    <span className="font-[family-name:var(--font-display)] text-[9px] tracking-[0.25em] uppercase text-muted-foreground font-medium">{metric.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'skills':
        const skills = [
          { name: 'React / Next.js', level: 97, category: '⚔️ Lâminas' },
          { name: 'TypeScript', level: 95, category: '⚔️ Lâminas' },
          { name: 'GSAP / Three.js', level: 92, category: '🏹 Arco Longo' },
          { name: 'Node.js / Fastify', level: 93, category: '🛡️ Escudo' },
          { name: 'Python / FastAPI', level: 88, category: '🛡️ Escudo' },
          { name: 'PostgreSQL', level: 90, category: '🪙 Tesouro' },
          { name: 'Redis / Elasticsearch', level: 85, category: '🪙 Tesouro' },
          { name: 'AWS / Kubernetes', level: 87, category: '⛵ Drakkar' },
          { name: 'Docker / Terraform', level: 89, category: '⛵ Drakkar' },
          { name: 'Figma / Design Systems', level: 91, category: '🏹 Arco Longo' },
        ];
        return (
          <div className="fluid-section-pad">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
              {skills.map((skill, i) => (
                <div key={i} className="detail-item group" style={{ opacity: 0 }}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-[family-name:var(--font-display)] text-foreground/90 text-sm tracking-wide uppercase font-medium">{skill.name}</span>
                    <span className="font-[family-name:var(--font-display)] text-[11px] tracking-widest font-semibold" style={{ color: `hsl(${colors.accentHsl} / 0.7)` }}>{skill.level}%</span>
                  </div>
                  <div className="skill-progress-bar" style={{ height: '4px', borderRadius: '4px' }}>
                    <div className="skill-progress-fill" data-width={`${skill.level}%`} style={{ width: 0, borderRadius: '4px' }} />
                  </div>
                  <span className="font-[family-name:var(--font-display)] text-[9px] tracking-[0.25em] uppercase text-muted-foreground/50 mt-2 block font-medium">{skill.category}</span>
                </div>
              ))}
            </div>
            <Suspense fallback={null}><TechLogosMarquee /></Suspense>
            <div className="max-w-5xl mx-auto mt-16 flex flex-wrap gap-3">
              {['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'Rust', 'PostgreSQL', 'Redis', 'Elasticsearch', 'AWS', 'Docker', 'Kubernetes', 'Terraform', 'Figma', 'GSAP', 'Three.js', 'GraphQL', 'gRPC'].map((tech, i) => (
                <span key={i} className="detail-item tech-badge card-hover-glow font-[family-name:var(--font-display)] text-[10px] tracking-[0.15em] uppercase px-5 py-2.5 rounded-md border cursor-default"
                  style={{ opacity: 0, borderColor: `hsl(${colors.accentHsl} / 0.2)`, color: `hsl(${colors.accentHsl} / 0.8)`, background: `hsl(${colors.accentHsl} / 0.05)` }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        );

      case 'servicos':
        return (
          <div className="fluid-section-pad">
            <div className="detail-item relative w-full h-[50vh] md:h-[60vh] overflow-hidden rounded-lg mb-16" style={{ opacity: 0, border: `1px solid hsl(${colors.accentHsl} / 0.12)` }}>
              <img src="/images/hero-servicos.jpg" alt="Serviços" className="w-full h-full object-cover" style={{ filter: 'brightness(0.7) saturate(1.35) contrast(1.05)' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, hsl(${colors.accentHsl} / 0.14), transparent 60%)` }} />
              <div className="absolute bottom-0 left-0 right-0 p-8" style={{ background: 'linear-gradient(to top, hsl(var(--background) / 0.85), transparent)' }}>
                <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.35em] uppercase font-medium" style={{ color: `hsl(${colors.accentHsl} / 0.9)` }}>☢️ VAULT-TEC DIGITAL</span>
                <h4 className="font-[family-name:var(--font-display)] text-foreground text-2xl md:text-3xl font-bold mt-2">Do Vault ao Wasteland</h4>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl">
              {[
                { icon: '☢️', title: 'Growth Marketing', desc: 'Campanhas data-driven com ROAS acima de 4x — penetrando o mercado como radiação no Wasteland.', accent: '120 75% 50%' },
                { icon: '🔧', title: 'Plataformas Web', desc: 'Experiências imersivas construídas para sobreviver. Next.js, edge computing e Core Web Vitals no verde.', accent: '45 90% 50%' },
                { icon: '📻', title: 'Apps Mobile', desc: 'React Native com performance nativa — sintonize na frequência certa. Updates OTA e analytics de engajamento.', accent: '120 60% 45%' },
                { icon: '💊', title: 'SaaS & Plataformas', desc: 'Arquitetura multi-tenant escalável como um Vault-Tec — billing Stripe e dashboards em tempo real.', accent: '160 70% 45%' },
                { icon: '🏗️', title: 'Landing Pages', desc: 'Conversão otimizada para reconstruir o mundo. A/B testing, heatmaps e integração com CRM.', accent: '80 60% 45%' },
                { icon: '⚡', title: 'Branding Digital', desc: 'Identidade visual que sobrevive ao apocalipse. Logo, tipografia, paleta e guidelines para todos os canais.', accent: '50 85% 50%' },
              ].map((card, i) => (
                <div key={i} className="detail-item magnetic-card premium-card card-hover-glow group relative p-9 rounded-lg overflow-hidden cursor-pointer"
                  style={{ opacity: 0 }}>
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at top left, hsl(${colors.accentHsl} / 0.1), transparent 60%)` }} />
                  <div className="absolute top-0 left-0 right-0 h-[2px] opacity-50 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: colors.gradient }} />
                  <div className="relative z-10">
                    <span className="text-4xl mb-6 block drop-shadow-lg">{card.icon}</span>
                    <h4 className="font-[family-name:var(--font-display)] text-foreground text-base font-bold tracking-[0.15em] uppercase mb-4">{card.title}</h4>
                    <p className="text-muted-foreground text-[13px] leading-[1.7]">{card.desc}</p>
                    <div className="h-[2px] w-14 mt-7 transition-all duration-700 group-hover:w-full ease-out"
                      style={{ background: colors.gradient }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-20 text-center">
              <p className="font-[family-name:var(--font-display)] text-[11px] tracking-[0.4em] uppercase text-muted-foreground/60 mb-5 font-medium">☢️ PREPARADO PARA SOBREVIVER NO WASTELAND?</p>
              <div className="h-[2px] w-28 mx-auto" style={{ background: colors.gradient }} />
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
            <h2 className="hero-reveal hero-reveal-delay-2 font-[family-name:var(--font-display)] font-black leading-[0.82] tracking-[-0.04em] uppercase flex flex-col items-start" style={{ fontSize: 'clamp(3rem, 12vw, 14rem)' }}>
              {section.title.split(' ').map((word, i) => (
                <span key={i} className="title-split-wrapper block overflow-hidden">
                  <span
                    className="title-word"
                    style={{
                      display: 'block',
                      background: colors.titleGradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: `drop-shadow(0 0 40px ${colors.glowColor}) drop-shadow(0 4px 25px hsl(0 0% 0% / 0.6))`,
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

        <div className="cin-desc" style={{ padding: `clamp(1.5rem, 4vw, 2.5rem) clamp(1.5rem, 4vw, 6rem)` }}>
          <div className="max-w-5xl">
            <p className="text-foreground/85 leading-[1.7] font-light tracking-tight" style={{ fontSize: 'clamp(1.05rem, 2vw, 1.9rem)' }}>{section.description}</p>
          </div>
        </div>

        {/* Gallery */}
        <div ref={galleryRef}>{renderGallery()}</div>

        {/* Details */}
        <div ref={detailsRef} style={{ padding: `clamp(1rem, 3vw, 1.5rem) clamp(1.5rem, 4vw, 6rem)` }}>
          {section.id === 'servicos' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl">
              {section.details.map((detail, i) => {
                const emoji = detail.slice(0, 2);
                const rest = detail.slice(3);
                const [title, desc] = rest.split(' — ');
                const cardAccents = [
                  'hsl(120 75% 50%)', 'hsl(45 90% 50%)', 'hsl(120 60% 45%)',
                  'hsl(160 70% 45%)', 'hsl(80 60% 45%)', 'hsl(50 85% 50%)'
                ];
                const accent = cardAccents[i] || cardAccents[0];
                return (
                  <div key={i} className="detail-item magnetic-card premium-card group relative p-8 rounded-lg overflow-hidden cursor-pointer"
                    style={{ opacity: 0 }}>
                    <div className="absolute top-0 left-0 right-0 h-[2px] opacity-50 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                      style={{ background: `radial-gradient(ellipse at top, ${accent}12, transparent 70%)` }} />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-5">
                        <span className="text-2xl">{emoji}</span>
                        <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.25em] uppercase opacity-50 font-semibold" style={{ color: accent }}>{String(i + 1).padStart(2, '0')}</span>
                      </div>
                      <h4 className="font-[family-name:var(--font-display)] text-foreground text-sm font-bold tracking-[0.12em] uppercase mb-3">{title}</h4>
                      <p className="text-muted-foreground text-[13px] leading-[1.7]">{desc}</p>
                      <div className="h-[2px] w-12 mt-6 group-hover:w-full transition-all duration-700 ease-out"
                        style={{ background: `linear-gradient(90deg, ${accent}90, transparent)` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 max-w-6xl">
              {section.details.map((detail, i) => (
                <div key={i} className="detail-item group flex items-start gap-5" style={{ opacity: 0 }}>
                  <span className={`font-[family-name:var(--font-display)] ${colors.accent} opacity-50 text-sm tracking-widest mt-1 font-semibold`}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <div className="h-[2px] w-10 mb-5 group-hover:w-20 transition-all duration-500 ease-out" style={{ background: `hsl(${colors.accentHsl} / 0.4)` }} />
                    <p className="text-foreground/80 text-base md:text-lg leading-[1.7]">{detail}</p>
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
            className="absolute top-6 left-6 z-50 flex items-center gap-2 text-foreground/60 hover:text-foreground transition-all duration-300 font-[family-name:var(--font-display)] text-xs tracking-[0.15em] uppercase bg-background/30 backdrop-blur-md px-4 py-2.5 rounded-lg border border-foreground/8 hover:border-foreground/15 hover:bg-background/50"
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
                        <div key={i} className="anim-el stat-card relative p-6 rounded-lg overflow-hidden group"
                          style={{ opacity: 0 }}>
                          <div className="absolute top-0 left-0 right-0 h-[2px] opacity-60"
                            style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--accent) / 0.6), transparent)' }} />
                          {stat.target !== null ? (
                            <span className="stat-value-animated block font-[family-name:var(--font-display)] text-2xl md:text-3xl font-black text-accent mb-2"
                              data-target={stat.target} data-suffix={stat.suffix} style={{ textShadow: '0 0 25px hsl(var(--accent) / 0.2)' }}>0{stat.suffix}</span>
                          ) : (
                            <span className="block font-[family-name:var(--font-display)] text-2xl md:text-3xl font-black text-accent mb-2" style={{ textShadow: '0 0 25px hsl(var(--accent) / 0.2)' }}>∞</span>
                          )}
                          <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-medium">{stat.label}</span>
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
