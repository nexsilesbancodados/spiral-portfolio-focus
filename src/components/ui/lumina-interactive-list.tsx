import { useEffect, useRef } from 'react';

declare const gsap: any;
declare const THREE: any;

const slides = [
  { title: "FOCUSS DEV", description: "Transformando ideias em experiências digitais extraordinárias. Desenvolvimento web de alto nível.", media: "/images/slide-01.jpg", skills: ["React", "TypeScript", "Node.js", "Next.js"] },
  { title: "Web Design", description: "Interfaces modernas e elegantes que conectam marcas ao futuro digital com impacto visual.", media: "/images/slide-02.jpg", skills: ["Figma", "UI/UX", "Prototipagem", "Design System"] },
  { title: "Desenvolvimento", description: "Código limpo, performance máxima e arquitetura escalável para projetos robustos.", media: "/images/slide-03.jpg", skills: ["JavaScript", "Python", "APIs REST", "PostgreSQL"] },
  { title: "Design de Interface", description: "Design centrado no usuário com estética cinematográfica e animações fluidas.", media: "/images/slide-04.jpg", skills: ["Tailwind CSS", "Framer Motion", "GSAP", "Three.js"] },
  { title: "Inovação e IA", description: "Tecnologias de ponta e inteligência artificial para soluções que fazem a diferença.", media: "/images/slide-05.jpg", skills: ["IA", "Machine Learning", "Cloud", "AWS"] },
  { title: "Mobile e Web", description: "Aplicações responsivas e multiplataforma que funcionam perfeitamente em qualquer dispositivo.", media: "/images/slide-06.jpg", skills: ["React Native", "PWA", "Responsivo", "Docker"] },
  { title: "Skills", description: "Domínio completo do ecossistema moderno — front-end, back-end, cloud e design em um só lugar.", media: "/images/slide-07.jpg", skills: ["React", "Node.js", "Python", "AWS", "Figma", "Docker"] }
];

export function LuminaSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentSlideRef = useRef(0);

  useEffect(() => {
    let renderer: any, scene: any, camera: any, shaderMaterial: any;
    let slideTextures: any[] = [];
    let currentSlideIndex = 0;
    let isTransitioning = false;
    let texturesLoaded = false;
    let animFrameId: number;
    // No video elements needed — all slides are images

    const TRANSITION_DURATION = 2.5;

    const loadScript = (src: string, globalName: string) => new Promise<void>((res, rej) => {
      if ((window as any)[globalName]) { res(); return; }
      if (document.querySelector(`script[src="${src}"]`)) {
        const check = setInterval(() => {
          if ((window as any)[globalName]) { clearInterval(check); res(); }
        }, 50);
        setTimeout(() => { clearInterval(check); rej(new Error(`Timeout: ${globalName}`)); }, 10000);
        return;
      }
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => setTimeout(() => res(), 100);
      s.onerror = () => rej(new Error(`Failed: ${src}`));
      document.head.appendChild(s);
    });

    const vertexShader = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
    const fragmentShader = `
      uniform sampler2D uTexture1, uTexture2;
      uniform float uProgress;
      uniform vec2 uResolution, uTexture1Size, uTexture2Size;
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
          float ro = 0.08 * pow(smoothstep(0.3, 1.0, nd), 1.5);
          vec2 dir = (d > 0.0) ? (p - c) / d : vec2(0.0);
          vec2 distUV = uv2 - dir * ro;
          float ca = 0.02 * pow(smoothstep(0.3, 1.0, nd), 1.2);
          img = vec4(
            texture2D(uTexture2, distUV + dir * ca * 1.2).r,
            texture2D(uTexture2, distUV + dir * ca * 0.2).g,
            texture2D(uTexture2, distUV - dir * ca * 0.8).b,
            1.0
          );
          float rim = smoothstep(0.95, 1.0, nd) * (1.0 - smoothstep(1.0, 1.01, nd));
          img.rgb += rim * 0.08;
        } else {
          img = texture2D(uTexture2, uv2);
        }
        vec4 oldImg = texture2D(uTexture1, uv1);
        if (progress > 0.95) img = mix(img, texture2D(uTexture2, uv2), (progress - 0.95) / 0.05);
        gl_FragColor = mix(oldImg, img, param);
      }
    `;

    const splitText = (text: string) =>
      text.split('').map(char => `<span style="display:inline-block;opacity:0">${char === ' ' ? '&nbsp;' : char}</span>`).join('');

    const updateContent = (idx: number) => {
      const titleEl = document.getElementById('mainTitle');
      const descEl = document.getElementById('mainDesc');
      const skillsEl = document.getElementById('mainSkills');
      if (!titleEl || !descEl) return;

      gsap.to(titleEl.children, { y: -20, opacity: 0, duration: 0.5, stagger: 0.02, ease: "power2.in" });
      gsap.to(descEl, { y: -10, opacity: 0, duration: 0.4, ease: "power2.in" });
      if (skillsEl) gsap.to(skillsEl.children, { y: -10, opacity: 0, duration: 0.3, stagger: 0.05, ease: "power2.in" });

      setTimeout(() => {
        titleEl.innerHTML = splitText(slides[idx].title);
        descEl.textContent = slides[idx].description;
        if (skillsEl) {
          skillsEl.innerHTML = slides[idx].skills.map(s => `<span class="skill-tag">${s}</span>`).join('');
        }
        gsap.set(titleEl.children, { opacity: 0 });
        gsap.set(descEl, { y: 20, opacity: 0 });
        if (skillsEl) gsap.set(skillsEl.children, { y: 15, opacity: 0 });

        const children = titleEl.children;
        const animations: Record<number, () => void> = {
          0: () => { gsap.set(children, { y: 20 }); gsap.to(children, { y: 0, opacity: 1, duration: 0.8, stagger: 0.03, ease: "power3.out" }); },
          1: () => { gsap.set(children, { y: -20 }); gsap.to(children, { y: 0, opacity: 1, duration: 0.8, stagger: 0.03, ease: "back.out(1.7)" }); },
          2: () => { gsap.set(children, { filter: "blur(10px)", scale: 1.5, y: 0 }); gsap.to(children, { filter: "blur(0px)", scale: 1, opacity: 1, duration: 1, stagger: { amount: 0.5, from: "random" }, ease: "power2.out" }); },
          3: () => { gsap.set(children, { scale: 0, y: 0 }); gsap.to(children, { scale: 1, opacity: 1, duration: 0.6, stagger: 0.05, ease: "back.out(1.5)" }); },
          4: () => { gsap.set(children, { rotationX: 90, y: 0, transformOrigin: "50% 50%" }); gsap.to(children, { rotationX: 0, opacity: 1, duration: 0.8, stagger: 0.04, ease: "power2.out" }); },
          5: () => { gsap.set(children, { x: 30, y: 0 }); gsap.to(children, { x: 0, opacity: 1, duration: 0.8, stagger: 0.03, ease: "power3.out" }); },
        };
        animations[idx % 6]();

        gsap.to(descEl, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" });
        if (skillsEl) gsap.to(skillsEl.children, { y: 0, opacity: 1, duration: 0.6, delay: 0.4, stagger: 0.08, ease: "power3.out" });
      }, 500);
    };

    const updateNavigationState = (idx: number) =>
      document.querySelectorAll(".slide-nav-item").forEach((el, i) => el.classList.toggle("active", i === idx));

    const updateCounter = (idx: number) => {
      const sn = document.getElementById("slideNumber");
      const st = document.getElementById("slideTotal");
      if (sn) sn.textContent = String(idx + 1).padStart(2, "0");
      if (st) st.textContent = String(slides.length).padStart(2, "0");
    };

    const navigateToSlide = (targetIndex: number) => {
      if (isTransitioning || targetIndex === currentSlideIndex || !texturesLoaded) return;
      const currentTexture = slideTextures[currentSlideIndex];
      const targetTexture = slideTextures[targetIndex];
      if (!currentTexture || !targetTexture) return;

      isTransitioning = true;
      shaderMaterial.uniforms.uTexture1.value = currentTexture;
      shaderMaterial.uniforms.uTexture2.value = targetTexture;
      shaderMaterial.uniforms.uTexture1Size.value = currentTexture.userData.size;
      shaderMaterial.uniforms.uTexture2Size.value = targetTexture.userData.size;

      updateContent(targetIndex);
      currentSlideIndex = targetIndex;
      currentSlideRef.current = targetIndex;
      updateCounter(currentSlideIndex);
      updateNavigationState(currentSlideIndex);

      gsap.fromTo(shaderMaterial.uniforms.uProgress,
        { value: 0 },
        {
          value: 1,
          duration: TRANSITION_DURATION,
          ease: "power2.inOut",
          onComplete: () => {
            shaderMaterial.uniforms.uProgress.value = 0;
            shaderMaterial.uniforms.uTexture1.value = targetTexture;
            shaderMaterial.uniforms.uTexture1Size.value = targetTexture.userData.size;
            isTransitioning = false;
          }
        }
      );
    };

    const triggerExplore = (slideIndex: number) => {
      const detail = document.getElementById('detail-section');
      const container = containerRef.current;
      if (!detail || typeof gsap === 'undefined' || !container) return;
      currentSlideRef.current = slideIndex;
      window.dispatchEvent(new CustomEvent('explore-slide', { detail: { slideIndex } }));
      gsap.to(container, { y: '-100%', opacity: 0, duration: 1.4, ease: 'power3.inOut' });
      gsap.fromTo(detail, { y: '100%', opacity: 0 }, {
        y: '0%', opacity: 1, duration: 1.4, ease: 'power3.inOut',
        onComplete: () => {
          const innerEls = detail.querySelectorAll('.anim-el');
          gsap.fromTo(innerEls, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' });
        }
      });
    };

    const createSlidesNavigation = () => {
      const nav = document.getElementById("slidesNav");
      if (!nav) return;
      nav.innerHTML = "";
      slides.forEach((slide, i) => {
        const item = document.createElement("div");
        item.className = `slide-nav-item${i === 0 ? " active" : ""}`;
        item.innerHTML = `<div class="slide-progress-line"><div class="slide-progress-fill"></div></div><div class="slide-nav-title">${slide.title}</div><button class="slide-nav-explore" data-index="${i}">Explorar <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14m-7-7l7 7 7-7"/></svg></button>`;
        item.addEventListener("click", (e) => {
          if ((e.target as HTMLElement).closest('.slide-nav-explore')) return;
          if (!isTransitioning && i !== currentSlideIndex) navigateToSlide(i);
        });
        const exploreBtn = item.querySelector('.slide-nav-explore');
        if (exploreBtn) {
          exploreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Navigate to slide first if not current
            if (i !== currentSlideIndex && !isTransitioning) {
              navigateToSlide(i);
              setTimeout(() => triggerExplore(i), 600);
            } else {
              triggerExplore(i);
            }
          });
        }
        nav.appendChild(item);
      });
    };

    const loadImageTexture = (src: string) => new Promise<any>((resolve, reject) => {
      new THREE.TextureLoader().load(src, (t: any) => {
        t.minFilter = t.magFilter = THREE.LinearFilter;
        t.userData = { size: new THREE.Vector2(t.image.width, t.image.height) };
        resolve(t);
      }, undefined, reject);
    });

    // Video textures removed for performance — all slides use images now

    const initRenderer = async () => {
      const canvas = document.querySelector(".webgl-canvas") as HTMLCanvasElement;
      if (!canvas) return;

      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

      shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTexture1: { value: null },
          uTexture2: { value: null },
          uProgress: { value: 0 },
          uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          uTexture1Size: { value: new THREE.Vector2(1, 1) },
          uTexture2Size: { value: new THREE.Vector2(1, 1) },
        },
        vertexShader,
        fragmentShader
      });
      scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMaterial));

      for (let i = 0; i < slides.length; i++) {
        try {
          slideTextures.push(await loadImageTexture(slides[i].media));
        } catch { console.warn("Failed texture:", slides[i].media); }
      }

      if (slideTextures.length >= 2) {
        shaderMaterial.uniforms.uTexture1.value = slideTextures[0];
        shaderMaterial.uniforms.uTexture2.value = slideTextures[1];
        shaderMaterial.uniforms.uTexture1Size.value = slideTextures[0].userData.size;
        shaderMaterial.uniforms.uTexture2Size.value = slideTextures[1].userData.size;
        texturesLoaded = true;
        document.querySelector(".slider-wrapper")?.classList.add("loaded");
      }

      let isVisible = true;
      const render = () => {
        animFrameId = requestAnimationFrame(render);
        if (!isVisible) return;
        renderer.render(scene, camera);
      };
      render();
    };

    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (renderer && shaderMaterial) {
          const w = window.innerWidth;
          const h = window.innerHeight;
          renderer.setSize(w, h, false);
          shaderMaterial.uniforms.uResolution.value.set(w, h);
        }
      }, 200);
    };

    // Pause render when tab is hidden
    const handleVisibility = () => {
      // No video elements to manage
    };

    const init = async () => {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', 'gsap');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'THREE');
      } catch (e) {
        console.error('Failed to load scripts:', e);
        return;
      }

      createSlidesNavigation();
      updateCounter(0);

      const tEl = document.getElementById('mainTitle');
      const dEl = document.getElementById('mainDesc');
      const sEl = document.getElementById('mainSkills');
      if (tEl && dEl) {
        tEl.innerHTML = splitText(slides[0].title);
        dEl.textContent = slides[0].description;
        if (sEl) sEl.innerHTML = slides[0].skills.map(s => `<span class="skill-tag">${s}</span>`).join('');
        gsap.fromTo(tEl.children, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.03, ease: "power3.out", delay: 0.5 });
        gsap.fromTo(dEl, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.8 });
        if (sEl) gsap.fromTo(sEl.children, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out", delay: 1.1 });
      }

      await initRenderer();
      window.addEventListener("resize", handleResize);
      document.addEventListener("visibilitychange", handleVisibility);

      // Scroll down to explore current slide
      let scrollAccumulator = 0;
      let scrollCooldown = false;
      const SCROLL_THRESHOLD = 120;

      const handleWheelExplore = (e: WheelEvent) => {
        if (isTransitioning || scrollCooldown) return;
        if (e.deltaY > 0) {
          scrollAccumulator += e.deltaY;
          if (scrollAccumulator >= SCROLL_THRESHOLD) {
            scrollAccumulator = 0;
            scrollCooldown = true;
            triggerExplore(currentSlideIndex);
            setTimeout(() => { scrollCooldown = false; }, 2000);
          }
        } else {
          scrollAccumulator = 0;
        }
      };

      const container = containerRef.current;
      if (container) {
        container.addEventListener('wheel', handleWheelExplore, { passive: true });
      }

      // Store for cleanup
      (window as any).__cleanupWheelExplore = () => {
        container?.removeEventListener('wheel', handleWheelExplore);
      };
    };

    init();

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      (window as any).__cleanupWheelExplore?.();
      clearTimeout(resizeTimer);
      if (animFrameId) cancelAnimationFrame(animFrameId);
      if (renderer) renderer.dispose();
    };
  }, []);

  return (
    <main className="slider-wrapper" ref={containerRef}>
      <canvas className="webgl-canvas" />
      <span className="slide-number" id="slideNumber">01</span>
      <span className="slide-total" id="slideTotal">07</span>

      <div className="slide-content">
        <h1 className="slide-title" id="mainTitle" />
        <p className="slide-description" id="mainDesc" />
        <div className="slide-skills" id="mainSkills" />
      </div>

      <nav className="slides-navigation" id="slidesNav" />

    </main>
  );
}
