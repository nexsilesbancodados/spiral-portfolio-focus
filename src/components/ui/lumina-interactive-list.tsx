import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';

interface Slide {
  title: string;
  description: string;
  media: string;
  skills: string[];
}

const slides: Slide[] = [
  { title: 'FOCUSS DEV', description: 'Transformando ideias em experiências digitais extraordinárias. Desenvolvimento web de alto nível.', media: '/images/slide-01.jpg', skills: ['React', 'TypeScript', 'Node.js', 'Next.js'] },
  { title: 'Web Design', description: 'Sobreviver exige preparação. Cada interface é projetada como um mapa de fuga — cada pixel no lugar certo, cada rota calculada para a conversão.', media: '/images/hero-webdesign.jpg', skills: ['🧬 Research', '🗝️ Wireframes', '🧪 Protótipo', '💉 Handoff'] },
  { title: 'Desenvolvimento', description: 'Forjado no gelo do Leviatã e no fogo das Lâminas do Caos. Código que escala como a fúria de um deus.', media: '/images/hero-dev.jpg', skills: ['❄️ Clean Code', '🔥 APIs', '⚡ CI/CD', '🪨 Database'] },
  { title: 'Serviços', description: 'No Wasteland digital, só sobrevive quem tem o kit completo. Soluções que resistem ao apocalipse do mercado.', media: '/images/hero-servicos.jpg', skills: ['☢️ Growth', '🔧 Web', '📻 Apps', '💊 SaaS'] },
  { title: 'Inovação e IA', description: 'A linha entre humano e máquina se dissolve. Androides que pensam, decidem e evoluem ao seu lado.', media: '/images/hero-ia.jpg', skills: ['🤖 LLMs', '💠 Agentes', '🔷 RAG', '🧠 Vision'] },
  { title: 'Mobile e Web', description: 'Hackear o sistema é dominar todas as plataformas. Apps que se conectam ao ctOS da experiência do usuário.', media: '/images/hero-mobile.jpg', skills: ['📱 Native', '💻 PWA', '🔓 Cross-Platform', '📡 OTA'] },
  { title: 'Skills', description: 'A árvore de habilidades de um verdadeiro Viking digital. Cada runa domada, cada skill desbloqueada no caminho de Valhalla.', media: '/images/hero-skills.jpg', skills: ['⚔️ Front-end', '🛡️ Back-end', '🏹 Infra', '🪙 Design'] },
];

// ── WebGL Glass Shader ──────────────────────────────────────────────
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture1, uTexture2;
  uniform float uProgress;
  uniform vec2 uResolution, uTexture1Size, uTexture2Size;
  uniform float uGlobalIntensity, uSpeedMultiplier, uDistortionStrength;
  uniform float uGlassRefractionStrength, uGlassChromaticAberration, uGlassBubbleClarity, uGlassEdgeGlow, uGlassLiquidFlow;
  varying vec2 vUv;

  vec2 getCoverUV(vec2 uv, vec2 textureSize) {
    vec2 s = uResolution / textureSize;
    float scale = max(s.x, s.y);
    vec2 scaledSize = textureSize * scale;
    vec2 offset = (uResolution - scaledSize) * 0.5;
    return (uv * uResolution - offset) / scaledSize;
  }

  void main() {
    float progress = uProgress;
    float time = progress * 5.0 * uSpeedMultiplier;
    vec2 uv1 = getCoverUV(vUv, uTexture1Size);
    vec2 uv2 = getCoverUV(vUv, uTexture2Size);

    float maxR = length(uResolution) * 0.85;
    float br = progress * maxR;
    vec2 p = vUv * uResolution;
    vec2 c = uResolution * 0.5;
    float d = length(p - c);
    float nd = d / max(br, 0.001);
    float param = smoothstep(br + 3.0, br - 3.0, d);

    vec4 img;
    if (param > 0.0) {
      float ro = 0.08 * uGlassRefractionStrength * uDistortionStrength * uGlobalIntensity * pow(smoothstep(0.3 * uGlassBubbleClarity, 1.0, nd), 1.5);
      vec2 dir = (d > 0.0) ? (p - c) / d : vec2(0.0);
      vec2 distUV = uv2 - dir * ro;
      distUV += vec2(sin(time + nd * 10.0), cos(time * 0.8 + nd * 8.0)) * 0.015 * uGlassLiquidFlow * uSpeedMultiplier * nd * param;
      float ca = 0.02 * uGlassChromaticAberration * uGlobalIntensity * pow(smoothstep(0.3, 1.0, nd), 1.2);
      img = vec4(
        texture2D(uTexture2, distUV + dir * ca * 1.2).r,
        texture2D(uTexture2, distUV + dir * ca * 0.2).g,
        texture2D(uTexture2, distUV - dir * ca * 0.8).b,
        1.0
      );
      if (uGlassEdgeGlow > 0.0) {
        float rim = smoothstep(0.95, 1.0, nd) * (1.0 - smoothstep(1.0, 1.01, nd));
        img.rgb += rim * 0.08 * uGlassEdgeGlow * uGlobalIntensity;
      }
    } else {
      img = texture2D(uTexture2, uv2);
    }

    vec4 oldImg = texture2D(uTexture1, uv1);
    if (progress > 0.95) {
      img = mix(img, texture2D(uTexture2, uv2), (progress - 0.95) / 0.05);
    }
    gl_FragColor = mix(oldImg, img, param);
  }
`;



export function LuminaSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [contentKey, setContentKey] = useState(0); // for re-triggering text animations


  // WebGL refs
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const texturesRef = useRef<THREE.Texture[]>([]);
  const webglReadyRef = useRef(false);
  const currentSlideRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const rafRef = useRef<number>(0);

  const current = useMemo(() => slides[currentSlide], [currentSlide]);

  // ── Initialize WebGL ──────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture1: { value: null },
        uTexture2: { value: null },
        uProgress: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uTexture1Size: { value: new THREE.Vector2(1, 1) },
        uTexture2Size: { value: new THREE.Vector2(1, 1) },
        uGlobalIntensity: { value: 1.0 },
        uSpeedMultiplier: { value: 1.0 },
        uDistortionStrength: { value: 1.0 },
        uGlassRefractionStrength: { value: 1.0 },
        uGlassChromaticAberration: { value: 1.0 },
        uGlassBubbleClarity: { value: 1.0 },
        uGlassEdgeGlow: { value: 1.0 },
        uGlassLiquidFlow: { value: 1.0 },
      },
      vertexShader,
      fragmentShader,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    materialRef.current = material;

    // Load all textures
    const loader = new THREE.TextureLoader();
    const loadTexture = (src: string): Promise<THREE.Texture> =>
      new Promise((resolve, reject) => {
        loader.load(
          src,
          (tex) => {
            tex.minFilter = THREE.LinearFilter;
            tex.magFilter = THREE.LinearFilter;
            tex.userData = { size: new THREE.Vector2(tex.image.width, tex.image.height) };
            resolve(tex);
          },
          undefined,
          reject
        );
      });

    const loadAll = async () => {
      const textures: THREE.Texture[] = [];
      for (const slide of slides) {
        try {
          textures.push(await loadTexture(slide.media));
        } catch {
          const fallback = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1);
          fallback.userData = { size: new THREE.Vector2(1, 1) };
          fallback.needsUpdate = true;
          textures.push(fallback);
        }
      }
      texturesRef.current = textures;

      if (textures.length >= 2) {
        material.uniforms.uTexture1.value = textures[0];
        material.uniforms.uTexture2.value = textures[0];
        material.uniforms.uTexture1Size.value = textures[0].userData.size;
        material.uniforms.uTexture2Size.value = textures[0].userData.size;
        webglReadyRef.current = true;

        // Mark loaded
        containerRef.current?.classList.add('loaded');
      }
    };

    loadAll();

    // Render loop
    const render = () => {
      rafRef.current = requestAnimationFrame(render);
      renderer.render(scene, camera);
    };
    render();

    // Resize handler
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafRef.current);
      renderer.dispose();
      material.dispose();
    };
  }, []);

  // ── WebGL Glass Transition ────────────────────────────────────────
  const transitionToSlide = useCallback((targetIndex: number) => {
    const mat = materialRef.current;
    const textures = texturesRef.current;
    if (!mat || !webglReadyRef.current || textures.length < 2) return;

    const fromTex = textures[currentSlideRef.current];
    const toTex = textures[targetIndex];
    if (!fromTex || !toTex) return;

    isTransitioningRef.current = true;
    setIsTransitioning(true);

    mat.uniforms.uTexture1.value = fromTex;
    mat.uniforms.uTexture2.value = toTex;
    mat.uniforms.uTexture1Size.value = fromTex.userData.size;
    mat.uniforms.uTexture2Size.value = toTex.userData.size;

    gsap.fromTo(
      mat.uniforms.uProgress,
      { value: 0 },
      {
        value: 1,
        duration: 2.2,
        ease: 'power2.inOut',
        onComplete: () => {
          mat.uniforms.uProgress.value = 0;
          mat.uniforms.uTexture1.value = toTex;
          mat.uniforms.uTexture1Size.value = toTex.userData.size;
          isTransitioningRef.current = false;
          setIsTransitioning(false);
        },
      }
    );

    currentSlideRef.current = targetIndex;
    setCurrentSlide(targetIndex);
    setContentKey(k => k + 1);

  }, []);

  const goToSlide = useCallback((index: number) => {
    const bounded = (index + slides.length) % slides.length;
    if (bounded === currentSlideRef.current || isTransitioningRef.current) return;
    transitionToSlide(bounded);
  }, [transitionToSlide]);

  const triggerExplore = useCallback(() => {
    window.dispatchEvent(new CustomEvent('explore-slide', { detail: { slideIndex: currentSlideRef.current } }));
  }, []);

  // ── Scroll down to explore ────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let scrollAccum = 0;
    let scrollTimeout: ReturnType<typeof setTimeout>;
    const threshold = 120;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        scrollAccum += e.deltaY;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => { scrollAccum = 0; }, 300);
        if (scrollAccum >= threshold) {
          scrollAccum = 0;
          triggerExplore();
        }
      }
    };
    el.addEventListener('wheel', onWheel, { passive: true });
    return () => { el.removeEventListener('wheel', onWheel); clearTimeout(scrollTimeout); };
  }, [triggerExplore]);



  // ── Touch swipe ───────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let startX = 0, startY = 0;
    const onStart = (e: TouchEvent) => { startX = e.touches[0].clientX; startY = e.touches[0].clientY; };
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx < 0) goToSlide(currentSlideRef.current + 1);
        else goToSlide(currentSlideRef.current - 1);
      }
    };
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchend', onEnd, { passive: true });
    return () => { el.removeEventListener('touchstart', onStart); el.removeEventListener('touchend', onEnd); };
  }, [goToSlide]);

  // ── Keyboard ──────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToSlide(currentSlideRef.current + 1);
      else if (e.key === 'ArrowLeft') goToSlide(currentSlideRef.current - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goToSlide]);

  // ── External navigation event ─────────────────────────────────────
  useEffect(() => {
    const handler = (e: Event) => {
      const idx = (e as CustomEvent).detail?.slideIndex;
      if (typeof idx === 'number') goToSlide(idx);
    };
    window.addEventListener('navigate-slide', handler);
    return () => window.removeEventListener('navigate-slide', handler);
  }, [goToSlide]);

  // ── Animate content on slide change ───────────────────────────────
  useEffect(() => {
    const contentEl = containerRef.current?.querySelector('.slide-content-inner');
    if (!contentEl) return;

    const title = contentEl.querySelector('.slide-title');
    const desc = contentEl.querySelector('.slide-description');
    const skills = contentEl.querySelector('.slide-skills');

    const tl = gsap.timeline();
    tl.fromTo(title, { y: 30, opacity: 0, filter: 'blur(6px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' }, 0);
    tl.fromTo(desc, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 0.15);
    tl.fromTo(skills?.children ? Array.from(skills.children) : [], { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power2.out' }, 0.3);

    return () => { tl.kill(); };
  }, [contentKey]);

  return (
    <main className="slider-wrapper" ref={containerRef}>
      {/* WebGL canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none" style={{
        zIndex: 3,
        background: 'linear-gradient(to top, hsl(var(--background)) 0%, hsl(var(--background) / 0.7) 15%, hsl(var(--background) / 0.35) 35%, transparent 60%)',
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        zIndex: 3,
        background: 'linear-gradient(to right, hsl(var(--background) / 0.6) 0%, hsl(var(--background) / 0.2) 25%, transparent 50%)',
      }} />

      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 pointer-events-none" style={{
        zIndex: 4,
        background: 'radial-gradient(ellipse at 90% 10%, hsl(var(--primary) / 0.06), transparent 60%)',
      }} />

      {/* Slide counter */}
      <div className="absolute z-10 flex items-center gap-3" style={{ top: 'clamp(1rem, 2vw, 2rem)', left: 'clamp(1.25rem, 2.5vw, 2.5rem)' }}>
        <span className="font-[family-name:var(--font-display)] text-primary tracking-wider" style={{ fontSize: 'clamp(11px, 1vw, 16px)' }}>
          {String(currentSlide + 1).padStart(2, '0')}
        </span>
        <div className="h-[1px] bg-foreground/20" style={{ width: 'clamp(1.5rem, 2vw, 3rem)' }} />
        <span className="font-[family-name:var(--font-display)] text-foreground/30 tracking-wider" style={{ fontSize: 'clamp(9px, 0.8vw, 12px)' }}>
          {String(slides.length).padStart(2, '0')}
        </span>
      </div>

      {/* Side navigation arrows */}
      <button
        onClick={() => goToSlide(currentSlide - 1)}
        className="absolute z-10 hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-foreground/10 bg-background/20 text-foreground/50 hover:text-foreground hover:border-foreground/30 hover:bg-background/40 transition-all duration-300 backdrop-blur-sm"
        style={{ left: 'clamp(1.25rem, 2.5vw, 2.5rem)', top: '50%', transform: 'translateY(-50%)' }}
        aria-label="Slide anterior"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6" /></svg>
      </button>
      <button
        onClick={() => goToSlide(currentSlide + 1)}
        className="absolute z-10 hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-foreground/10 bg-background/20 text-foreground/50 hover:text-foreground hover:border-foreground/30 hover:bg-background/40 transition-all duration-300 backdrop-blur-sm"
        style={{ right: 'clamp(1.25rem, 2.5vw, 2.5rem)', top: '50%', transform: 'translateY(-50%)' }}
        aria-label="Próximo slide"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6" /></svg>
      </button>

      {/* Slide content */}
      <div className="slide-content" style={{ zIndex: 10 }}>
        <div className="slide-content-inner" key={contentKey}>
          <h1 className="slide-title" style={{ textShadow: '0 2px 40px hsl(0 0% 0% / 0.6), 0 4px 80px hsl(0 0% 0% / 0.4)' }}>{current.title}</h1>
          <p className="slide-description" style={{ textShadow: '0 1px 20px hsl(0 0% 0% / 0.5)' }}>{current.description}</p>
          <div className="slide-skills">
            {current.skills.map((skill) => (
              <span key={skill} className="skill-tag">{skill}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom navigation with animated progress */}
      <nav className="slides-navigation" aria-label="Navegação de seções" style={{ zIndex: 10 }}>
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            onClick={() => goToSlide(index)}
            className={`slide-nav-item ${index === currentSlide ? 'active' : ''}`}
            aria-label={`Ir para ${slide.title}`}
          >
            <div className="slide-progress-line">
              <div className="slide-progress-fill" style={{
                width: index === currentSlide ? '100%' : '0%',
                transition: 'width 0.3s ease',
              }} />
            </div>
            <div className="slide-nav-title">{slide.title}</div>
          </button>
        ))}
      </nav>

      <button className="explore-btn" onClick={triggerExplore} aria-label="Explorar seção atual" style={{ zIndex: 15 }}>
        <span className="explore-btn-text">Explorar</span>
        <svg className="explore-btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 5v14m-7-7l7 7 7-7" />
        </svg>
      </button>
    </main>
  );
}
