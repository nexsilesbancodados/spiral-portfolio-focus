'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

class Vector2D {
  constructor(public x: number, public y: number) {}
  static random(min: number, max: number): number {
    return min + Math.random() * (max - min)
  }
}

// Extract text pixel positions from an offscreen canvas
function getTextPixels(
  text: string,
  fontSize: number,
  canvasWidth: number,
  canvasHeight: number,
  sampleStep = 2
): Vector2D[] {
  const offscreen = document.createElement('canvas')
  offscreen.width = canvasWidth
  offscreen.height = canvasHeight
  const ctx = offscreen.getContext('2d')!
  ctx.fillStyle = 'white'
  ctx.font = `900 ${fontSize}px 'Space Grotesk', Arial, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, canvasWidth / 2, canvasHeight / 2)

  const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight)
  const points: Vector2D[] = []
  for (let y = 0; y < canvasHeight; y += sampleStep) {
    for (let x = 0; x < canvasWidth; x += sampleStep) {
      const i = (y * canvasWidth + x) * 4
      if (imageData.data[i + 3] > 128) {
        points.push(new Vector2D(x - canvasWidth / 2, y - canvasHeight / 2))
      }
    }
  }
  return points
}

interface Particle {
  // Random start position (scattered)
  startX: number
  startY: number
  // Target position (text pixel)
  targetX: number
  targetY: number
  // Spiral intermediate
  spiralAngle: number
  spiralRadius: number
  spiralSpeed: number
  // Visual
  size: number
  brightness: number
  delay: number // 0-0.3 stagger
}

class TextParticleAnimation {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private width: number
  private height: number
  private particles: Particle[] = []
  private progress = { value: 0 }
  private timeline: gsap.core.Timeline
  private trailPoints: { x: number; y: number; alpha: number }[] = []

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.canvas = canvas
    this.ctx = ctx
    this.width = width
    this.height = height
    this.timeline = gsap.timeline({ repeat: -1, repeatDelay: 1.5 })

    const fontSize = Math.max(36, Math.floor(Math.min(width, height) * 0.09))
    const textPixels = getTextPixels('FOCUSS DEV', fontSize, width, height, 2)

    // Create particles - one per text pixel
    const maxParticles = Math.min(textPixels.length, 8000)
    const step = Math.max(1, Math.floor(textPixels.length / maxParticles))

    for (let i = 0; i < textPixels.length; i += step) {
      const tp = textPixels[i]
      const angle = Math.random() * Math.PI * 2
      const dist = 300 + Math.random() * 500

      this.particles.push({
        startX: Math.cos(angle) * dist,
        startY: Math.sin(angle) * dist,
        targetX: tp.x,
        targetY: tp.y,
        spiralAngle: angle,
        spiralRadius: 100 + Math.random() * 200,
        spiralSpeed: 1 + Math.random() * 3,
        size: 0.8 + Math.random() * 1.5,
        brightness: 40 + Math.random() * 60,
        delay: Math.random() * 0.25,
      })
    }

    this.setupTimeline()
  }

  private setupTimeline() {
    this.timeline
      // Phase 1: Spiral inward (0 -> 0.4)
      .to(this.progress, {
        value: 0.4,
        duration: 4,
        ease: 'power2.inOut',
        onUpdate: () => this.render(),
      })
      // Phase 2: Form text (0.4 -> 1.0)
      .to(this.progress, {
        value: 1.0,
        duration: 3,
        ease: 'power3.inOut',
        onUpdate: () => this.render(),
      })
      // Phase 3: Hold text
      .to(this.progress, {
        value: 1.0,
        duration: 4,
        onUpdate: () => this.render(),
      })
      // Phase 4: Explode out (1.0 -> 1.5)
      .to(this.progress, {
        value: 1.5,
        duration: 2,
        ease: 'power2.in',
        onUpdate: () => this.render(),
      })
      // Reset
      .set(this.progress, { value: 0 })
  }

  private easeOutElastic(x: number): number {
    const c4 = (2 * Math.PI) / 3
    if (x <= 0) return 0
    if (x >= 1) return 1
    return Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1
  }

  private render() {
    const ctx = this.ctx
    const w = this.width
    const h = this.height
    const p = this.progress.value

    // Dark background with slight fade for trails
    ctx.fillStyle = 'rgba(5, 5, 5, 0.15)'
    ctx.fillRect(0, 0, w, h)

    ctx.save()
    ctx.translate(w / 2, h / 2)

    // Draw spiral trail in early phase
    if (p < 0.5) {
      this.drawSpiralTrail(p)
    }

    // Draw particles
    for (const particle of this.particles) {
      const adjustedP = Math.max(0, Math.min(p - particle.delay, 1.5))
      let x: number, y: number, alpha: number, size: number

      if (adjustedP <= 0) {
        // Not started yet - at start position
        x = particle.startX
        y = particle.startY
        alpha = 0.1
        size = particle.size * 0.3
      } else if (adjustedP < 0.4) {
        // Phase 1: Spiral toward center
        const t = adjustedP / 0.4
        const spiralT = t
        const currentRadius = particle.spiralRadius * (1 - t * 0.7)
        const currentAngle = particle.spiralAngle + particle.spiralSpeed * t * Math.PI * 4

        const spiralX = Math.cos(currentAngle) * currentRadius
        const spiralY = Math.sin(currentAngle) * currentRadius

        // Blend from start to spiral
        const blend = Math.min(t * 3, 1)
        x = particle.startX * (1 - blend) + spiralX * blend
        y = particle.startY * (1 - blend) + spiralY * blend
        alpha = 0.3 + t * 0.5
        size = particle.size * (0.5 + t * 0.5)
      } else if (adjustedP < 1.0) {
        // Phase 2: Converge to text position
        const t = (adjustedP - 0.4) / 0.6
        const eased = this.easeOutElastic(Math.min(t * 1.2, 1))

        // From spiral position to text target
        const currentRadius = particle.spiralRadius * 0.3
        const currentAngle = particle.spiralAngle + particle.spiralSpeed * 0.4 * Math.PI * 4
        const spiralX = Math.cos(currentAngle) * currentRadius
        const spiralY = Math.sin(currentAngle) * currentRadius

        x = spiralX * (1 - eased) + particle.targetX * eased
        y = spiralY * (1 - eased) + particle.targetY * eased
        alpha = 0.6 + eased * 0.4
        size = particle.size * (0.8 + eased * 0.4)
      } else if (adjustedP <= 1.0) {
        // Hold at text position with subtle shimmer
        x = particle.targetX + Math.sin(Date.now() * 0.003 + particle.spiralAngle) * 0.5
        y = particle.targetY + Math.cos(Date.now() * 0.004 + particle.spiralAngle) * 0.5
        alpha = 0.85 + Math.sin(Date.now() * 0.005 + particle.delay * 20) * 0.15
        size = particle.size * 1.2
      } else {
        // Phase 4: Explode outward
        const t = (adjustedP - 1.0) / 0.5
        const angle = particle.spiralAngle + Math.random() * 0.1
        const dist = t * 600
        x = particle.targetX + Math.cos(angle) * dist
        y = particle.targetY + Math.sin(angle) * dist
        alpha = Math.max(0, 1 - t * 1.5)
        size = particle.size * (1 + t)
      }

      if (alpha <= 0) continue

      // Golden color with varying brightness
      const hue = 42 + Math.sin(particle.spiralAngle) * 8
      const sat = 90 + particle.brightness * 0.1
      const light = particle.brightness

      ctx.globalAlpha = alpha
      ctx.fillStyle = `hsl(${hue}, ${sat}%, ${light}%)`
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()

      // Glow for brighter particles
      if (alpha > 0.7 && size > 1) {
        ctx.globalAlpha = alpha * 0.2
        ctx.fillStyle = `hsl(${hue}, 100%, 80%)`
        ctx.beginPath()
        ctx.arc(x, y, size * 2.5, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    ctx.globalAlpha = 1
    ctx.restore()
  }

  private drawSpiralTrail(p: number) {
    const ctx = this.ctx
    const trailLen = 120
    const t = p / 0.5

    for (let i = 0; i < trailLen; i++) {
      const f = 1 - i / trailLen
      const angle = t * Math.PI * 8 - i * 0.08
      const radius = 180 * t * f
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      const sw = 2.5 * f * t

      ctx.globalAlpha = f * t * 0.8
      ctx.fillStyle = `hsl(45, 100%, ${55 + f * 30}%)`
      ctx.beginPath()
      ctx.arc(x, y, sw, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }

  public destroy() {
    this.timeline.kill()
  }
}

export function SpiralAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<TextParticleAnimation | null>(null)
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  })

  useEffect(() => {
    const handleResize = () =>
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = dimensions.width
    const h = dimensions.height

    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    ctx.scale(dpr, dpr)

    animationRef.current = new TextParticleAnimation(canvas, ctx, w, h)

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy()
        animationRef.current = null
      }
    }
  }, [dimensions])

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: 'hsl(0, 0%, 2%)',
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  )
}
