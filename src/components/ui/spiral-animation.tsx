'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

class Vector2D {
  constructor(public x: number, public y: number) {}
  static random(min: number, max: number): number {
    return min + Math.random() * (max - min)
  }
}

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
  startX: number
  startY: number
  targetX: number
  targetY: number
  spiralAngle: number
  spiralRadius: number
  spiralSpeed: number
  size: number
  brightness: number
  delay: number
  shimmerSpeed: number
  shimmerOffset: number
}

class TextParticleAnimation {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private width: number
  private height: number
  private particles: Particle[] = []
  private bgParticles: { x: number; y: number; size: number; speed: number; alpha: number }[] = []
  private progress = { value: 0 }
  private timeline: gsap.core.Timeline
  private frameCount = 0

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.canvas = canvas
    this.ctx = ctx
    this.width = width
    this.height = height
    this.timeline = gsap.timeline({ repeat: -1, repeatDelay: 0.5 })

    const fontSize = Math.max(40, Math.floor(Math.min(width, height) * 0.1))
    const textPixels = getTextPixels('FOCUSS DEV', fontSize, width, height, 2)

    const maxParticles = Math.min(textPixels.length, 10000)
    const step = Math.max(1, Math.floor(textPixels.length / maxParticles))

    for (let i = 0; i < textPixels.length; i += step) {
      const tp = textPixels[i]
      const angle = Math.random() * Math.PI * 2
      const dist = 400 + Math.random() * 600

      this.particles.push({
        startX: Math.cos(angle) * dist,
        startY: Math.sin(angle) * dist,
        targetX: tp.x,
        targetY: tp.y,
        spiralAngle: angle,
        spiralRadius: 120 + Math.random() * 250,
        spiralSpeed: 1.5 + Math.random() * 3,
        size: 0.6 + Math.random() * 1.8,
        brightness: 45 + Math.random() * 55,
        delay: Math.random() * 0.2,
        shimmerSpeed: 2 + Math.random() * 4,
        shimmerOffset: Math.random() * Math.PI * 2,
      })
    }

    // Background floating particles
    for (let i = 0; i < 150; i++) {
      this.bgParticles.push({
        x: (Math.random() - 0.5) * width,
        y: (Math.random() - 0.5) * height,
        size: 0.3 + Math.random() * 0.8,
        speed: 0.1 + Math.random() * 0.3,
        alpha: 0.05 + Math.random() * 0.15,
      })
    }

    this.setupTimeline()
  }

  private setupTimeline() {
    this.timeline
      // Phase 1: Fly in and form text (0 -> 1.0)
      .to(this.progress, {
        value: 1.0,
        duration: 4,
        ease: 'power3.inOut',
        onUpdate: () => this.render(),
      })
      // Phase 2: Hold text with shimmer
      .to(this.progress, {
        value: 1.0,
        duration: 5,
        onUpdate: () => this.render(),
      })
      // Phase 3: Dissolve out (1.0 -> 1.5)
      .to(this.progress, {
        value: 1.5,
        duration: 2.5,
        ease: 'power2.in',
        onUpdate: () => this.render(),
      })
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
    this.frameCount++

    // Clear
    ctx.fillStyle = 'rgba(5, 5, 5, 0.15)'
    ctx.fillRect(0, 0, w, h)

    ctx.save()
    ctx.translate(w / 2, h / 2)

    // Background ambient particles
    this.drawBgParticles()

    // Draw main particles
    for (const particle of this.particles) {
      const adjustedP = Math.max(0, Math.min(p - particle.delay, 1.5))
      let x: number, y: number, alpha: number, size: number

      if (adjustedP <= 0) {
        // At start position, barely visible
        x = particle.startX
        y = particle.startY
        alpha = 0.05
        size = particle.size * 0.2
      } else if (adjustedP < 1.0) {
        // Fly straight from start to text target
        const t = adjustedP / 1.0
        const eased = this.easeOutElastic(Math.min(t * 1.2, 1))

        x = particle.startX * (1 - eased) + particle.targetX * eased
        y = particle.startY * (1 - eased) + particle.targetY * eased
        alpha = 0.1 + eased * 0.9
        size = particle.size * (0.3 + eased * 0.9)
      } else if (adjustedP <= 1.0) {
        // Hold — shimmer
        const time = this.frameCount * 0.016
        const shimmer = Math.sin(time * particle.shimmerSpeed + particle.shimmerOffset)
        x = particle.targetX + shimmer * 0.8
        y = particle.targetY + Math.cos(time * particle.shimmerSpeed * 0.7 + particle.shimmerOffset) * 0.8
        alpha = 0.8 + shimmer * 0.2
        size = particle.size * (1.1 + shimmer * 0.15)
      } else {
        // Dissolve out
        const t = (adjustedP - 1.0) / 0.5
        const angle = particle.spiralAngle
        const dist = t * t * 700
        x = particle.targetX + Math.cos(angle) * dist
        y = particle.targetY + Math.sin(angle) * dist
        alpha = Math.max(0, 1 - t * 2)
        size = particle.size * (1 + t * 0.5)
      }

      if (alpha <= 0.01) continue

      const hue = 40 + Math.sin(particle.spiralAngle) * 10
      const sat = 85 + particle.brightness * 0.15
      const light = particle.brightness

      ctx.globalAlpha = alpha
      ctx.fillStyle = `hsl(${hue}, ${sat}%, ${light}%)`
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()

      if (alpha > 0.8 && size > 1.3) {
        ctx.globalAlpha = alpha * 0.08
        ctx.fillStyle = `hsl(${hue}, 100%, 80%)`
        ctx.beginPath()
        ctx.arc(x, y, size * 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    ctx.globalAlpha = 1
    ctx.restore()
  }

  private drawBgParticles() {
    const ctx = this.ctx
    const time = this.frameCount * 0.016

    for (const bp of this.bgParticles) {
      bp.y -= bp.speed
      if (bp.y < -this.height / 2) bp.y = this.height / 2

      const flicker = 0.5 + Math.sin(time * 2 + bp.x * 0.01) * 0.5
      ctx.globalAlpha = bp.alpha * flicker
      ctx.fillStyle = 'hsl(45, 60%, 60%)'
      ctx.beginPath()
      ctx.arc(bp.x, bp.y, bp.size, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }

  private drawSpiralTrail(p: number) {
    const ctx = this.ctx
    const trailLen = 150
    const t = p / 0.5

    for (let i = 0; i < trailLen; i++) {
      const f = 1 - i / trailLen
      const angle = t * Math.PI * 10 - i * 0.07
      const radius = 200 * t * f
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      const sw = 3 * f * t

      ctx.globalAlpha = f * t * 0.7
      ctx.fillStyle = `hsl(43, 100%, ${50 + f * 35}%)`
      ctx.beginPath()
      ctx.arc(x, y, sw, 0, Math.PI * 2)
      ctx.fill()

      // Trail glow
      if (f > 0.6) {
        ctx.globalAlpha = f * t * 0.15
        ctx.fillStyle = `hsl(43, 100%, 80%)`
        ctx.beginPath()
        ctx.arc(x, y, sw * 3, 0, Math.PI * 2)
        ctx.fill()
      }
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
