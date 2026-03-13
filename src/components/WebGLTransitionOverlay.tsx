import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

/**
 * WebGL Glass Transition Overlay
 * Used for cinematic glass-bubble transitions between slider ↔ detail sections.
 * Listens for 'webgl-transition' custom events.
 */

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
  uniform float uDirection; // 1.0 = forward (explore), -1.0 = backward (back)
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
    float time = progress * 5.0;
    vec2 uv1 = getCoverUV(vUv, uTexture1Size);
    vec2 uv2 = getCoverUV(vUv, uTexture2Size);

    // Glass bubble expanding from center
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
      distUV += vec2(sin(time + nd * 10.0), cos(time * 0.8 + nd * 8.0)) * 0.015 * nd * param;
      float ca = 0.02 * pow(smoothstep(0.3, 1.0, nd), 1.2);
      img = vec4(
        texture2D(uTexture2, distUV + dir * ca * 1.2).r,
        texture2D(uTexture2, distUV + dir * ca * 0.2).g,
        texture2D(uTexture2, distUV - dir * ca * 0.8).b,
        1.0
      );
      // Edge glow
      float rim = smoothstep(0.95, 1.0, nd) * (1.0 - smoothstep(1.0, 1.01, nd));
      img.rgb += rim * 0.08;
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

// Create a solid color texture
function createColorTexture(r: number, g: number, b: number): THREE.DataTexture {
  const data = new Uint8Array([r, g, b, 255]);
  const tex = new THREE.DataTexture(data, 1, 1);
  tex.userData = { size: new THREE.Vector2(1, 1) };
  tex.needsUpdate = true;
  return tex;
}

interface TransitionEvent {
  fromImage?: string;       // URL of source image (slider current slide)
  toImage?: string;         // URL of target image (detail hero or null for black)
  direction: 'forward' | 'backward';
  duration?: number;
  onMidpoint?: () => void;  // Called at ~60% progress
  onComplete?: () => void;
}

export function WebGLTransitionOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const rafRef = useRef<number>(0);
  const activeRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const blackTexRef = useRef<THREE.DataTexture | null>(null);
  const textureCache = useRef<Map<string, THREE.Texture>>(new Map());

  // Initialize WebGL once
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
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
        uDirection: { value: 1.0 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    materialRef.current = material;

    // Dark background texture (near-black matching --background: 0 0% 2%)
    blackTexRef.current = createColorTexture(5, 5, 5);

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

  const loadTexture = useCallback((src: string): Promise<THREE.Texture> => {
    const cached = textureCache.current.get(src);
    if (cached) return Promise.resolve(cached);

    return new Promise((resolve, reject) => {
      new THREE.TextureLoader().load(
        src,
        (tex) => {
          tex.minFilter = THREE.LinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.userData = { size: new THREE.Vector2(tex.image.width, tex.image.height) };
          textureCache.current.set(src, tex);
          resolve(tex);
        },
        undefined,
        reject
      );
    });
  }, []);

  const runTransition = useCallback(async (event: TransitionEvent) => {
    const mat = materialRef.current;
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const container = containerRef.current;
    const blackTex = blackTexRef.current;
    if (!mat || !renderer || !scene || !camera || !container || !blackTex) return;

    // Load textures
    let fromTex: THREE.Texture = blackTex;
    let toTex: THREE.Texture = blackTex;

    try {
      if (event.fromImage) fromTex = await loadTexture(event.fromImage);
      if (event.toImage) toTex = await loadTexture(event.toImage);
    } catch {
      // fallback to black
    }

    if (event.direction === 'backward') {
      // Reverse: from black → slide image
      mat.uniforms.uTexture1.value = toTex; // black/detail
      mat.uniforms.uTexture2.value = fromTex; // slide image
      mat.uniforms.uTexture1Size.value = toTex.userData.size;
      mat.uniforms.uTexture2Size.value = fromTex.userData.size;
    } else {
      // Forward: from slide image → black
      mat.uniforms.uTexture1.value = fromTex;
      mat.uniforms.uTexture2.value = toTex;
      mat.uniforms.uTexture1Size.value = fromTex.userData.size;
      mat.uniforms.uTexture2Size.value = toTex.userData.size;
    }

    mat.uniforms.uProgress.value = 0;
    mat.uniforms.uDirection.value = event.direction === 'forward' ? 1.0 : -1.0;

    // Show overlay
    activeRef.current = true;
    container.style.opacity = '1';
    container.style.pointerEvents = 'auto';

    // Start render loop
    const renderLoop = () => {
      if (!activeRef.current) return;
      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    let midpointCalled = false;
    const duration = event.duration || 1.8;

    gsap.fromTo(
      mat.uniforms.uProgress,
      { value: 0 },
      {
        value: 1,
        duration,
        ease: 'power3.inOut',
        onUpdate: () => {
          if (!midpointCalled && mat.uniforms.uProgress.value >= 0.55) {
            midpointCalled = true;
            event.onMidpoint?.();
          }
        },
        onComplete: () => {
          activeRef.current = false;
          cancelAnimationFrame(rafRef.current);

          // Smooth fade out overlay
          gsap.to(container, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.out',
            onComplete: () => {
              container.style.pointerEvents = 'none';
              event.onComplete?.();
            },
          });
        },
      }
    );
  }, [loadTexture]);

  // Listen for transition events
  useEffect(() => {
    const handler = (e: CustomEvent<TransitionEvent>) => {
      runTransition(e.detail);
    };
    window.addEventListener('webgl-transition', handler as EventListener);
    return () => window.removeEventListener('webgl-transition', handler as EventListener);
  }, [runTransition]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 25, opacity: 0 }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
