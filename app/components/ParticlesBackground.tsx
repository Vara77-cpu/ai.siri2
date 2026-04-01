"use client"

import { useEffect, useRef } from "react"

export default function ParticlesBackground() {

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {

    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d")!

    const particles: any[] = []

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7
      })
    }

    function draw() {

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {

        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = "#a855f7"
        ctx.fill()

        for (let j = i + 1; j < particles.length; j++) {

          const dx = p.x - particles[j].x
          const dy = p.y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = "rgba(168,85,247,0.2)"
            ctx.stroke()
          }
        }

      })

      requestAnimationFrame(draw)
    }

    draw()

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    })

  }, [])

  return (

    <div
      className="
      fixed
      inset-0
      -z-10
      bg-gradient-to-br
      from-blue-900
      via-purple-900
      to-indigo-900
      "
    >

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

    </div>

  )

}