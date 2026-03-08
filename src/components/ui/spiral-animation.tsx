'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

class Vector2D {
  constructor(public x: number, public y: number) {}
  static random(min: number, max: number): number {
    return min + Math.random() * (max - min)
  }
}

class Vector3D {
  constructor(public x: number, public y: number, public z: number) {}
}

// Extract text pixel positions from an offscreen canvas
function getTextPixels(
  text: string,
  fontSize: number,
  canvasWidth: number,
  canvasHeight: number,
  sampleStep = 3
): Vector2D[] {
  const offscreen = document.createElement('canvas')
  offscreen.width = canvasWidth
  offscreen.height = canvasHeight
  const ctx = offscreen.getContext('2d')!
  ctx.fillStyle = 'white'
  ctx.font = `700 ${fontSize}px 'Space Grotesk', sans-serif`
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

class AnimationController {
  private timeline: gsap.core.Timeline
  private time = 0
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private size: number
  private stars: Star[] = []
  private textPixels: Vector2D[] = []

  private readonly changeEventTime = 0.32
  private readonly cameraZ = -400
  private readonly cameraTravelDistance = 3400
  private readonly startDotYOffset = 28
  private readonly viewZoom = 100
  private readonly numberOfStars = 5000
  private readonly trailLength = 80

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    dpr: number,
    size: number
  ) {
    this.canvas = canvas
    this.ctx = ctx
    this.size = size
    this.timeline = gsap.timeline({ repeat: -1 })

    // Get text pixels for "FOCUSS DEV"
    const fontSize = Math.max(28, Math.floor(size * 0.08))
    this.textPixels = getTextPixels('FOCUSS DEV', fontSize, size, size, 3)

    this.createStars()
    this.setupTimeline()
  }

  private createStars() {
    for (let i = 0; i < this.numberOfStars; i++) {
      const textTarget =
        this.textPixels.length > 0
          ? this.textPixels[i % this.textPixels.length]
          : null
      this.stars.push(
        new Star(this.cameraZ, this.cameraTravelDistance, textTarget)
      )
    }
  }

  private setupTimeline() {
    this.timeline.to(this, {
      time: 1,
      duration: 15,
      repeat: -1,
      ease: 'none',
      onUpdate: () => this.render(),
    })
  }

  public ease(p: number, g: number): number {
    if (p < 0.5) return 0.5 * Math.pow(2 * p, g)
    return 1 - 0.5 * Math.pow(2 * (1 - p), g)
  }

  public easeOutElastic(x: number): number {
    const c4 = (2 * Math.PI) / 4.5
    if (x <= 0) return 0
    if (x >= 1) return 1
    return Math.pow(2, -8 * x) * Math.sin((x * 8 - 0.75) * c4) + 1
  }

  public map(
    value: number,
    start1: number,
    stop1: number,
    start2: number,
    stop2: number
  ): number {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))
  }

  public constrain(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
  }

  public lerp(start: number, end: number, t: number): number {
    return start * (1 - t) + end * t
  }

  public spiralPath(p: number): Vector2D {
    p = this.constrain(1.2 * p, 0, 1)
    p = this.ease(p, 1.8)
    const theta = 2 * Math.PI * 6 * Math.sqrt(p)
    const r = 170 * Math.sqrt(p)
    return new Vector2D(
      r * Math.cos(theta),
      r * Math.sin(theta) + this.startDotYOffset
    )
  }

  public showProjectedDot(position: Vector3D, sizeFactor: number) {
    const t2 = this.constrain(
      this.map(this.time, this.changeEventTime, 1, 0, 1),
      0,
      1
    )
    const newCameraZ =
      this.cameraZ +
      this.ease(Math.pow(t2, 1.2), 1.8) * this.cameraTravelDistance

    if (position.z > newCameraZ) {
      const depth = position.z - newCameraZ
      const x = (this.viewZoom * position.x) / depth
      const y = (this.viewZoom * position.y) / depth
      const sw = (400 * sizeFactor) / depth
      this.ctx.lineWidth = sw
      this.ctx.beginPath()
      this.ctx.arc(x, y, 0.5, 0, Math.PI * 2)
      this.ctx.fill()
    }
  }

  public get publicCameraZ() {
    return this.cameraZ
  }
  public get publicViewZoom() {
    return this.viewZoom
  }

  private drawStartDot() {
    if (this.time > this.changeEventTime) {
      const dy = (this.cameraZ * this.startDotYOffset) / this.viewZoom
      this.showProjectedDot(
        new Vector3D(0, dy, this.cameraTravelDistance),
        2.5
      )
    }
  }

  public render() {
    const ctx = this.ctx
    if (!ctx) return

    ctx.fillStyle = 'hsl(0, 0%, 2%)'
    ctx.fillRect(0, 0, this.size, this.size)

    ctx.save()
    ctx.translate(this.size / 2, this.size / 2)

    const t1 = this.constrain(
      this.map(this.time, 0, this.changeEventTime + 0.25, 0, 1),
      0,
      1
    )
    const t2 = this.constrain(
      this.map(this.time, this.changeEventTime, 1, 0, 1),
      0,
      1
    )

    ctx.rotate(-Math.PI * this.ease(t2, 2.7))

    this.drawTrail(t1)

    // Gold-tinted stars
    ctx.fillStyle = 'hsl(45, 100%, 70%)'
    for (const star of this.stars) {
      star.render(t1, this)
    }

    this.drawStartDot()
    ctx.restore()
  }

  private drawTrail(t1: number) {
    for (let i = 0; i < this.trailLength; i++) {
      const f = this.map(i, 0, this.trailLength, 1.1, 0.1)
      const sw = (1.3 * (1 - t1) + 3.0 * Math.sin(Math.PI * t1)) * f
      this.ctx.fillStyle = 'hsl(45, 100%, 65%)'
      this.ctx.lineWidth = sw
      const pathTime = t1 - 0.00015 * i
      const position = this.spiralPath(pathTime)

      const offset = new Vector2D(position.x + 5, position.y + 5)
      const mid = new Vector2D(
        (position.x + offset.x) / 2,
        (position.y + offset.y) / 2
      )
      const dx = position.x - mid.x
      const dy = position.y - mid.y
      const angle = Math.atan2(dy, dx)
      const r = Math.sqrt(dx * dx + dy * dy)
      const o = i % 2 === 0 ? -1 : 1
      const p2 = Math.sin(this.time * Math.PI * 2) * 0.5 + 0.5
      const bounce = Math.sin(p2 * Math.PI) * 0.05 * (1 - p2)
      const rx =
        mid.x +
        r *
          (1 + bounce) *
          Math.cos(angle + o * Math.PI * this.easeOutElastic(p2))
      const ry =
        mid.y +
        r *
          (1 + bounce) *
          Math.sin(angle + o * Math.PI * this.easeOutElastic(p2))

      this.ctx.beginPath()
      this.ctx.arc(rx, ry, sw / 2, 0, Math.PI * 2)
      this.ctx.fill()
    }
  }

  public destroy() {
    this.timeline.kill()
  }
}

class Star {
  private dx: number
  private dy: number
  private spiralLocation: number
  private strokeWeightFactor: number
  private z: number
  private angle: number
  private distance: number
  private rotationDirection: number
  private expansionRate: number
  private finalScale: number
  private textTarget: Vector2D | null

  constructor(
    cameraZ: number,
    cameraTravelDistance: number,
    textTarget: Vector2D | null
  ) {
    this.textTarget = textTarget
    this.angle = Math.random() * Math.PI * 2
    this.distance = 30 * Math.random() + 15
    this.rotationDirection = Math.random() > 0.5 ? 1 : -1
    this.expansionRate = 1.2 + Math.random() * 0.8
    this.finalScale = 0.7 + Math.random() * 0.6
    this.dx = this.distance * Math.cos(this.angle)
    this.dy = this.distance * Math.sin(this.angle)
    this.spiralLocation = (1 - Math.pow(1 - Math.random(), 3.0)) / 1.3
    this.z = Vector2D.random(0.5 * cameraZ, cameraTravelDistance + cameraZ)
    this.z =
      this.z * 0.7 + (cameraTravelDistance / 2) * 0.3 * this.spiralLocation
    this.strokeWeightFactor = Math.pow(Math.random(), 2.0)
  }

  render(p: number, ctrl: AnimationController) {
    const spiralPos = ctrl.spiralPath(this.spiralLocation)
    const q = p - this.spiralLocation

    if (q > 0) {
      const dp = ctrl.constrain(4 * q, 0, 1)

      let screenX: number, screenY: number

      if (this.textTarget && dp > 0.85) {
        // Converge toward text position in the final phase
        const t = (dp - 0.85) / 0.15
        const eased = ctrl.ease(t, 2.0)
        const baseX = spiralPos.x + this.dx * this.expansionRate
        const baseY = spiralPos.y + this.dy * this.expansionRate
        screenX = ctrl.lerp(baseX, this.textTarget.x, eased)
        screenY = ctrl.lerp(baseY, this.textTarget.y, eased)
      } else if (dp < 0.3) {
        const e = dp / 0.3
        screenX = ctrl.lerp(spiralPos.x, spiralPos.x + this.dx * 0.3, e)
        screenY = ctrl.lerp(spiralPos.y, spiralPos.y + this.dy * 0.3, e)
      } else if (dp < 0.7) {
        const midP = (dp - 0.3) / 0.4
        const curve =
          Math.sin(midP * Math.PI) * this.rotationDirection * 1.5
        const baseX = spiralPos.x + this.dx * 0.3
        const baseY = spiralPos.y + this.dy * 0.3
        const targetX = spiralPos.x + this.dx * 0.7
        const targetY = spiralPos.y + this.dy * 0.7
        const perpX = -this.dy * 0.4 * curve
        const perpY = this.dx * 0.4 * curve
        screenX = ctrl.lerp(baseX, targetX, midP) + perpX * midP
        screenY = ctrl.lerp(baseY, targetY, midP) + perpY * midP
      } else {
        const finalP = (dp - 0.7) / 0.3
        const baseX = spiralPos.x + this.dx * 0.7
        const baseY = spiralPos.y + this.dy * 0.7
        const targetDist = this.distance * this.expansionRate * 1.5
        const spiralAngle =
          this.angle + 1.2 * this.rotationDirection * finalP * Math.PI
        const targetX = spiralPos.x + targetDist * Math.cos(spiralAngle)
        const targetY = spiralPos.y + targetDist * Math.sin(spiralAngle)
        screenX = ctrl.lerp(baseX, targetX, finalP)
        screenY = ctrl.lerp(baseY, targetY, finalP)
      }

      const vx =
        ((this.z - ctrl.publicCameraZ) * screenX) / ctrl.publicViewZoom
      const vy =
        ((this.z - ctrl.publicCameraZ) * screenY) / ctrl.publicViewZoom

      let sizeMul = 1.0
      if (dp < 0.6) sizeMul = 1.0 + dp * 0.2
      else {
        const t = (dp - 0.6) / 0.4
        sizeMul = 1.2 * (1 - t) + this.finalScale * t
      }

      ctrl.showProjectedDot(
        new Vector3D(vx, vy, this.z),
        8.5 * this.strokeWeightFactor * sizeMul
      )
    }
  }
}

export function SpiralAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<AnimationController | null>(null)
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handleResize = () =>
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const size = Math.max(dimensions.width, dimensions.height)

    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${dimensions.width}px`
    canvas.style.height = `${dimensions.height}px`
    ctx.scale(dpr, dpr)

    animationRef.current = new AnimationController(canvas, ctx, dpr, size)

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
