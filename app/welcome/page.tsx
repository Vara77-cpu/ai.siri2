"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

/* ====================================================
   ENHANCED PARTICLE SYSTEM
   - Multi-layer: nebula clouds + orb particles + streaks + sparks
   - Trails, glow halos, pulsing cores
   - Subtle connection lines between nearby orbs
   - Nebula blobs that slowly drift and breathe
==================================================== */
function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    let time = 0

    interface Particle {
      x: number; y: number
      size: number
      vx: number; vy: number
      alpha: number
      phase: number
      hue: number
      trail: { x: number; y: number }[]
      trailLen: number
      type: "orb" | "streak" | "spark"
    }

    interface Nebula {
      x: number; y: number
      rx: number; ry: number
      hue: number
      alpha: number
      phase: number
      vx: number; vy: number
    }

    let particles: Particle[] = []
    let nebulae: Nebula[] = []

    function init(W: number, H: number) {
      particles = []
      nebulae = []

      // Drifting nebula atmospheres
      for (let i = 0; i < 7; i++) {
        nebulae.push({
          x: Math.random() * W,
          y: Math.random() * H,
          rx: 180 + Math.random() * 280,
          ry: 120 + Math.random() * 200,
          hue: [270, 290, 310, 250, 280][i % 5] + Math.random() * 20,
          alpha: 0.025 + Math.random() * 0.04,
          phase: Math.random() * Math.PI * 2,
          vx: (Math.random() - 0.5) * 0.08,
          vy: (Math.random() - 0.5) * 0.05,
        })
      }

      const count = Math.min(140, Math.floor((W * H) / 6500))
      for (let i = 0; i < count; i++) {
        const r = Math.random()
        const type: Particle["type"] = r < 0.5 ? "orb" : r < 0.75 ? "streak" : "spark"
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          size: type === "orb" ? 1.5 + Math.random() * 3 : type === "streak" ? 0.5 + Math.random() * 1.5 : 1 + Math.random() * 2,
          vx: (Math.random() - 0.5) * (type === "streak" ? 1.0 : 0.35),
          vy: -(Math.random() * (type === "streak" ? 1.1 : 0.55) + 0.1),
          alpha: type === "spark" ? 0.5 + Math.random() * 0.5 : 0.2 + Math.random() * 0.6,
          phase: Math.random() * Math.PI * 2,
          hue: 255 + Math.random() * 90,
          trail: [],
          trailLen: type === "streak" ? 16 : type === "spark" ? 5 : 4,
          type,
        })
      }
    }

    function drawNebulae() {
      for (const n of nebulae) {
        n.phase += 0.004
        n.x += n.vx; n.y += n.vy
        const W = canvas!.width, H = canvas!.height
        if (n.x < -n.rx * 2) n.x = W + n.rx
        if (n.x > W + n.rx * 2) n.x = -n.rx
        if (n.y < -n.ry * 2) n.y = H + n.ry
        if (n.y > H + n.ry * 2) n.y = -n.ry

        const pulse = 0.75 + Math.sin(n.phase) * 0.25
        const nx = n.x + Math.sin(n.phase * 0.6) * 50
        const ny = n.y + Math.cos(n.phase * 0.4) * 35

        ctx!.save()
        ctx!.translate(nx, ny)
        ctx!.scale(1, n.ry / n.rx)
        const grad = ctx!.createRadialGradient(0, 0, 0, 0, 0, n.rx * pulse)
        grad.addColorStop(0, `hsla(${n.hue},85%,65%,${n.alpha * pulse * 1.4})`)
        grad.addColorStop(0.35, `hsla(${n.hue + 15},75%,55%,${n.alpha * pulse * 0.7})`)
        grad.addColorStop(0.7, `hsla(${n.hue - 10},65%,45%,${n.alpha * pulse * 0.25})`)
        grad.addColorStop(1, `hsla(${n.hue},60%,40%,0)`)
        ctx!.beginPath()
        ctx!.arc(0, 0, n.rx * pulse, 0, Math.PI * 2)
        ctx!.fillStyle = grad
        ctx!.fill()
        ctx!.restore()
      }
    }

    function drawConnections() {
      const orbs = particles.filter(p => p.type === "orb")
      for (let i = 0; i < orbs.length; i++) {
        for (let j = i + 1; j < orbs.length; j++) {
          const dx = orbs[i].x - orbs[j].x
          const dy = orbs[i].y - orbs[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 110) {
            const a = Math.pow(1 - dist / 110, 2) * 0.15
            const hMid = (orbs[i].hue + orbs[j].hue) / 2
            ctx!.strokeStyle = `hsla(${hMid},80%,75%,${a})`
            ctx!.lineWidth = 0.6
            ctx!.beginPath()
            ctx!.moveTo(orbs[i].x, orbs[i].y)
            ctx!.lineTo(orbs[j].x, orbs[j].y)
            ctx!.stroke()
          }
        }
      }
    }

    function draw() {
      const W = canvas!.width, H = canvas!.height
      // Persistent fade for trail effect
      ctx!.fillStyle = "rgba(2,6,23,0.2)"
      ctx!.fillRect(0, 0, W, H)

      time += 0.016
      drawNebulae()
      drawConnections()

      for (const p of particles) {
        p.trail.push({ x: p.x, y: p.y })
        if (p.trail.length > p.trailLen) p.trail.shift()

        p.x += p.vx; p.y += p.vy

        if (p.y < -30) { p.y = H + 30; p.x = Math.random() * W; p.trail = [] }
        if (p.x < -30) { p.x = W + 30; p.trail = [] }
        if (p.x > W + 30) { p.x = -30; p.trail = [] }

        const pulse = 0.7 + Math.sin(time * 1.6 + p.phase) * 0.3
        const a = p.alpha * pulse

        ctx!.save()

        // Trail rendering
        if (p.trail.length > 1) {
          for (let i = 1; i < p.trail.length; i++) {
            const t = i / p.trail.length
            const ta = t * a * (p.type === "streak" ? 0.65 : 0.35)
            ctx!.strokeStyle = `hsla(${p.hue},90%,78%,${ta})`
            ctx!.lineWidth = p.size * t * (p.type === "streak" ? 1.8 : 1.0)
            ctx!.lineCap = "round"
            ctx!.beginPath()
            ctx!.moveTo(p.trail[i - 1].x, p.trail[i - 1].y)
            ctx!.lineTo(p.trail[i].x, p.trail[i].y)
            ctx!.stroke()
          }
        }

        if (p.type === "orb") {
          // Wide diffuse outer corona
          const corona = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 12)
          corona.addColorStop(0, `hsla(${p.hue},90%,72%,${a * 0.2})`)
          corona.addColorStop(0.3, `hsla(${p.hue + 10},80%,65%,${a * 0.1})`)
          corona.addColorStop(1, `hsla(${p.hue},70%,55%,0)`)
          ctx!.beginPath()
          ctx!.arc(p.x, p.y, p.size * 12, 0, Math.PI * 2)
          ctx!.fillStyle = corona
          ctx!.fill()

          // Inner glow
          const inner = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4.5)
          inner.addColorStop(0, `hsla(${p.hue + 15},100%,90%,${a * 0.9})`)
          inner.addColorStop(0.5, `hsla(${p.hue},88%,68%,${a * 0.5})`)
          inner.addColorStop(1, `hsla(${p.hue},80%,58%,0)`)
          ctx!.beginPath()
          ctx!.arc(p.x, p.y, p.size * 4.5, 0, Math.PI * 2)
          ctx!.fillStyle = inner
          ctx!.fill()

          // Bright core pinpoint
          ctx!.beginPath()
          ctx!.arc(p.x, p.y, p.size * 0.65, 0, Math.PI * 2)
          ctx!.fillStyle = `hsla(${p.hue + 25},100%,97%,${a})`
          ctx!.fill()

        } else if (p.type === "streak") {
          const sg = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6)
          sg.addColorStop(0, `hsla(${p.hue},95%,82%,${a * 0.75})`)
          sg.addColorStop(0.5, `hsla(${p.hue},80%,65%,${a * 0.3})`)
          sg.addColorStop(1, `hsla(${p.hue},70%,55%,0)`)
          ctx!.beginPath()
          ctx!.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2)
          ctx!.fillStyle = sg
          ctx!.fill()
          ctx!.beginPath()
          ctx!.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2)
          ctx!.fillStyle = `hsla(30,100%,97%,${a * 0.95})`
          ctx!.fill()

        } else {
          // Spark: sharp flicker
          const flicker = Math.abs(Math.sin(time * 4 + p.phase))
          const sp = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 7)
          sp.addColorStop(0, `hsla(${p.hue + 35},100%,92%,${a * flicker})`)
          sp.addColorStop(0.25, `hsla(${p.hue},90%,72%,${a * flicker * 0.55})`)
          sp.addColorStop(1, `hsla(${p.hue},75%,55%,0)`)
          ctx!.beginPath()
          ctx!.arc(p.x, p.y, p.size * 7, 0, Math.PI * 2)
          ctx!.fillStyle = sp
          ctx!.fill()
          ctx!.beginPath()
          ctx!.arc(p.x, p.y, p.size * 0.85, 0, Math.PI * 2)
          ctx!.fillStyle = `rgba(255,255,255,${a * flicker})`
          ctx!.fill()
        }

        ctx!.restore()
      }

      animId = requestAnimationFrame(draw)
    }

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      init(canvas!.width, canvas!.height)
    }

    resize()
    window.addEventListener("resize", resize)
    draw()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", top: 0, left: 0,
        width: "100%", height: "100%",
        zIndex: 0, pointerEvents: "none",
      }}
    />
  )
}

/* ====================================================
   WELCOME PAGE
==================================================== */
export default function WelcomePage() {
  const { data: session } = useSession()
  const router = useRouter()

  const [text, setText] = useState("")
  const [speechFinished, setSpeechFinished] = useState(false)
  const [visible, setVisible] = useState(false)

  const message = `Welcome back, ${session?.user?.name || "Student"}.\nYour AI learning assistant is ready.`

  // Fade-in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  // Typing effect
  useEffect(() => {
    if (!session) return
    let i = 0
    const delay = setTimeout(() => {
      const typing = setInterval(() => {
        setText(message.slice(0, i))
        i++
        if (i > message.length) clearInterval(typing)
      }, 38)
      return () => clearInterval(typing)
    }, 900)
    return () => clearTimeout(delay)
  }, [session, message])

  // AI voice
  useEffect(() => {
    if (!session?.user?.name) return

    const speak = () => {
      if (typeof window === "undefined" || !window.speechSynthesis) return
      window.speechSynthesis.cancel()

      const voices = window.speechSynthesis.getVoices()
      if (!voices.length) return

      const femaleVoice =
        voices.find(v => v.name.includes("Female")) ||
        voices.find(v => v.name.includes("Samantha")) ||
        voices.find(v => v.name.includes("Zira")) ||
        voices[0]

      const speech = new SpeechSynthesisUtterance(
        `Hello ${session?.user?.name}. Welcome to AI Siri. I am your personal learning assistant. Let's begin your journey.`
      )

      if (femaleVoice) speech.voice = femaleVoice
      speech.onend = () => setSpeechFinished(true)
      window.speechSynthesis.speak(speech)
    }

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = speak
    }
    speak()

    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel()
        window.speechSynthesis.onvoiceschanged = null
      }
    }
  }, [session])

  const stars = Array.from({ length: 48 })

  return (
    <div className="page">
      <ParticlesBackground />

      {/* Falling star runes */}
      <div className="starfield">
        {stars.map((_, i) => (
          <span
            key={i}
            className="star"
            style={{
              left: `${(i * 13 + 7) % 100}%`,
              animationDelay: `${((i * 0.37) % 5)}s`,
              animationDuration: `${7 + (i % 5)}s`,
              fontSize: `${10 + (i % 3) * 4}px`,
              opacity: 0.3 + (i % 4) * 0.15,
            }}
          >
            {["✦", "✧", "⬡", "◈", "⬢"][i % 5]}
          </span>
        ))}
      </div>

      {/* Ambient aurora rings */}
      <div className="aurora auroraLeft" />
      <div className="aurora auroraRight" />
      <div className="aurora auroraCenter" />

      {/* AI ASSISTANT */}
      <div className={`assistant ${visible ? "show" : ""}`}>
        <div className="assistantRing ring1" />
        <div className="assistantRing ring2" />
        <div className="assistantRing ring3" />
        <video
          src="/ai-avatar.mp4"
          autoPlay muted loop playsInline
          className="assistantVideo"
        />
        <div className="assistantGlow" />
        <div className="assistantLabel">AI.SIRI ONLINE</div>
      </div>

      {/* PANEL */}
      <div className={`panel ${visible ? "show" : ""}`}>
        {/* Top shimmer line */}
        <div className="panelShimmer" />

        <div className="panelInner">
          {/* Badge */}
          <div className="badge">
            <span className="badgeDot" />
            ACTIVE SESSION
          </div>

          <h1 className="title">
            <span className="titleAI">AI</span>
            <span className="titleDot">.</span>
            <span className="titleSiri">SIRI</span>
          </h1>

          {/* Marquee ticker */}
          <div className="ticker">
            <div className="tickerTrack">
              <span>🚀 AI Powered Learning &nbsp;•&nbsp; Smart Education &nbsp;•&nbsp; Future Ready &nbsp;•&nbsp; Neural Pathways &nbsp;•&nbsp; Deep Learning &nbsp;•&nbsp; 🚀 AI Powered Learning &nbsp;•&nbsp; Smart Education &nbsp;•&nbsp;</span>
            </div>
          </div>

          {/* Typing text */}
          <div className="textBox">
            <pre className="typedText">{text}<span className="cursor">|</span></pre>
          </div>

          {/* Status bar */}
          <div className="statusRow">
            <div className="statusItem">
              <span className="statusDot green" />
              <span>Systems Online</span>
            </div>
            <div className="statusItem">
              <span className="statusDot blue" />
              <span>AI Ready</span>
            </div>
            <div className="statusItem">
              <span className="statusDot purple" />
              <span>Neural Active</span>
            </div>
          </div>

          {speechFinished && (
            <button className="enterBtn" onClick={() => router.push("/dashboard")}>
              <span className="btnText">Enter Dashboard</span>
              <span className="btnArrow">→</span>
              <div className="btnGlow" />
            </button>
          )}
        </div>

        <div className="scanline" />
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@300;500;700&display=swap');

        /* ── KEYFRAMES ── */
        @keyframes floatAssistant {
          0%,100% { transform: translateY(-50%) translateX(0); }
          33%      { transform: translateY(-53%) translateX(4px); }
          66%      { transform: translateY(-47%) translateX(-4px); }
        }
        @keyframes pulseRing {
          0%   { transform: translate(-50%,-50%) scale(1);   opacity:0.6; }
          100% { transform: translate(-50%,-50%) scale(1.8); opacity:0; }
        }
        @keyframes glowPulse {
          0%,100% { opacity:0.5; transform:translate(-50%,-50%) scale(1); }
          50%     { opacity:0.9; transform:translate(-50%,-50%) scale(1.15); }
        }
        @keyframes auroraFloat {
          0%,100% { transform:translate(0,0) scale(1); }
          50%      { transform:translate(40px,30px) scale(1.15); }
        }
        @keyframes auroraFloat2 {
          0%,100% { transform:translate(0,0) scale(1); }
          50%      { transform:translate(-50px,-20px) scale(1.1); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes fall {
          0%   { transform: translateY(-20px) rotate(0deg);   opacity:1; }
          100% { transform: translateY(110vh) rotate(360deg); opacity:0; }
        }
        @keyframes blink {
          0%,100% { opacity:1; }
          50%     { opacity:0; }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(30px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes scanline {
          from { top:-2px; }
          to   { top:100%; }
        }
        @keyframes panelGlow {
          0%,100% { box-shadow:0 0 60px rgba(147,51,234,0.3), 0 0 120px rgba(147,51,234,0.1), inset 0 1px 0 rgba(255,255,255,0.08); }
          50%     { box-shadow:0 0 100px rgba(168,85,247,0.55), 0 0 200px rgba(147,51,234,0.2), inset 0 1px 0 rgba(255,255,255,0.12); }
        }
        @keyframes badgePulse {
          0%,100% { box-shadow:0 0 0 0 rgba(74,222,128,0.5); }
          50%     { box-shadow:0 0 0 6px rgba(74,222,128,0); }
        }

        /* ── BASE ── */
        .page {
          font-family: 'Rajdhani', sans-serif;
          width: 100vw; height: 100vh;
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
          background: radial-gradient(ellipse at 30% 50%, #0c0220 0%, #020617 50%, #000d1a 100%);
          color: white;
        }

        /* ── STARFIELD ── */
        .starfield { position:absolute; inset:0; z-index:1; pointer-events:none; }
        .star {
          position: absolute; top: -20px;
          color: #a78bfa;
          animation: fall linear infinite;
          filter: drop-shadow(0 0 4px rgba(167,139,250,0.8));
        }

        /* ── AURORA ── */
        .aurora {
          position: absolute; border-radius: 50%;
          filter: blur(90px); pointer-events: none; z-index: 1;
        }
        .auroraLeft {
          width: 500px; height: 600px;
          left: -100px; top: 20%;
          background: radial-gradient(ellipse, rgba(147,51,234,0.22), rgba(99,102,241,0.1), transparent 70%);
          animation: auroraFloat 14s ease-in-out infinite;
        }
        .auroraRight {
          width: 450px; height: 500px;
          right: -80px; top: 30%;
          background: radial-gradient(ellipse, rgba(192,38,211,0.18), rgba(79,70,229,0.1), transparent 70%);
          animation: auroraFloat2 17s ease-in-out infinite;
        }
        .auroraCenter {
          width: 300px; height: 300px;
          left: 50%; top: 80%;
          transform: translateX(-50%);
          background: radial-gradient(ellipse, rgba(168,85,247,0.12), transparent 70%);
          animation: auroraFloat 11s ease-in-out infinite reverse;
        }

        /* ── ASSISTANT ── */
        .assistant {
          position: absolute;
          left: 8%; top: 50%;
          transform: translateY(-50%);
          z-index: 5;
          opacity: 0;
          transition: opacity 0.8s ease;
          animation: floatAssistant 6s ease-in-out infinite;
        }
        .assistant.show { opacity: 1; }

        .assistantRing {
          position: absolute; border-radius: 50%;
          left: 50%; top: 50%;
          border: 1px solid rgba(147,51,234,0.4);
          animation: pulseRing 3s ease-out infinite;
        }
        .ring1 { width: 260px; height: 260px; animation-delay: 0s; }
        .ring2 { width: 320px; height: 320px; animation-delay: 1s; }
        .ring3 { width: 380px; height: 380px; animation-delay: 2s; border-color: rgba(192,38,211,0.25); }

        .assistantVideo {
          width: 220px;
          border-radius: 24px;
          position: relative; z-index: 3;
          box-shadow:
            0 0 30px rgba(147,51,234,0.5),
            0 0 60px rgba(147,51,234,0.2),
            0 20px 60px rgba(0,0,0,0.6);
          border: 1px solid rgba(168,85,247,0.4);
        }
        .assistantGlow {
          position: absolute;
          width: 300px; height: 300px; border-radius: 50%;
          background: radial-gradient(circle, rgba(147,51,234,0.5), rgba(99,102,241,0.2), transparent 70%);
          top: 50%; left: 50%;
          animation: glowPulse 2.5s ease-in-out infinite;
          pointer-events: none; z-index: 1;
          filter: blur(20px);
        }
        .assistantLabel {
          position: absolute;
          bottom: -32px; left: 50%;
          transform: translateX(-50%);
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem; letter-spacing: 0.25em;
          color: rgba(168,85,247,0.8);
          white-space: nowrap;
          text-shadow: 0 0 10px rgba(168,85,247,0.6);
        }

        /* ── PANEL ── */
        .panel {
          position: absolute;
          left: 55%; top: 50%;
          transform: translate(-50%, -50%);
          width: 480px;
          border-radius: 28px;
          background: rgba(8,2,20,0.82);
          backdrop-filter: blur(48px);
          -webkit-backdrop-filter: blur(48px);
          border: 1px solid rgba(147,51,234,0.28);
          overflow: hidden;
          opacity: 0;
          transition: opacity 0.8s ease 0.3s;
          animation: panelGlow 5s ease-in-out infinite;
          z-index: 10;
        }
        .panel.show { opacity: 1; }

        .panelShimmer {
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(168,85,247,0.9), rgba(232,121,249,1), rgba(168,85,247,0.9), transparent);
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
          z-index: 5;
        }

        .scanline {
          position: absolute; left: 0; width: 100%; height: 2px;
          background: linear-gradient(transparent, rgba(147,51,234,0.15), transparent);
          animation: scanline 4s linear infinite;
          pointer-events: none; z-index: 6;
        }

        .panelInner {
          padding: 2.5rem 2.5rem 2rem;
          position: relative; z-index: 2;
        }

        /* ── BADGE ── */
        .badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 12px; border-radius: 20px;
          background: rgba(74,222,128,0.08);
          border: 1px solid rgba(74,222,128,0.25);
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.62rem; letter-spacing: 0.2em;
          color: #4ade80; margin-bottom: 1.2rem;
          animation: badgePulse 2.5s ease-in-out infinite;
        }
        .badgeDot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 6px #4ade80;
          animation: blink 1.4s ease-in-out infinite;
        }

        /* ── TITLE ── */
        .title {
          font-family: 'Orbitron', monospace;
          font-size: 3rem; font-weight: 900;
          letter-spacing: 0.06em;
          margin: 0 0 0.8rem;
          line-height: 1;
        }
        .titleAI {
          background: linear-gradient(135deg, #e879f9, #a855f7);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .titleDot { color: rgba(168,85,247,0.5); -webkit-text-fill-color: rgba(168,85,247,0.5); }
        .titleSiri {
          background: linear-gradient(135deg, #818cf8, #c4b5fd, #e879f9);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        /* ── TICKER ── */
        .ticker {
          overflow: hidden; margin-bottom: 1.4rem;
          border-top: 1px solid rgba(147,51,234,0.15);
          border-bottom: 1px solid rgba(147,51,234,0.15);
          padding: 6px 0;
        }
        .tickerTrack {
          display: inline-block; white-space: nowrap;
          animation: ticker 18s linear infinite;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem; letter-spacing: 0.1em;
          color: rgba(167,139,250,0.75);
        }

        /* ── TYPED TEXT ── */
        .textBox {
          background: rgba(0,0,0,0.35);
          border-radius: 14px;
          border: 1px solid rgba(147,51,234,0.18);
          padding: 1rem 1.2rem;
          margin-bottom: 1.2rem;
          min-height: 70px;
        }
        .typedText {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.92rem;
          color: #c4b5fd;
          line-height: 1.7;
          margin: 0;
          white-space: pre-wrap;
        }
        .cursor {
          color: #e879f9;
          animation: blink 0.75s step-end infinite;
          font-weight: 100;
        }

        /* ── STATUS ROW ── */
        .statusRow {
          display: flex; gap: 1rem; margin-bottom: 1.4rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.68rem; letter-spacing: 0.08em;
        }
        .statusItem { display: flex; align-items: center; gap: 5px; color: rgba(196,181,253,0.65); }
        .statusDot {
          width: 5px; height: 5px; border-radius: 50%;
        }
        .statusDot.green  { background: #4ade80; box-shadow: 0 0 5px #4ade80; }
        .statusDot.blue   { background: #60a5fa; box-shadow: 0 0 5px #60a5fa; }
        .statusDot.purple { background: #c084fc; box-shadow: 0 0 5px #c084fc; }

        /* ── ENTER BUTTON ── */
        .enterBtn {
          position: relative; overflow: hidden;
          width: 100%; padding: 1rem 1.5rem;
          border-radius: 16px; border: none;
          background: linear-gradient(135deg, #9333ea 0%, #c026d3 50%, #9333ea 100%);
          background-size: 200% auto;
          color: white; cursor: pointer;
          font-family: 'Orbitron', monospace;
          font-size: 0.9rem; font-weight: 700;
          letter-spacing: 0.12em;
          display: flex; align-items: center; justify-content: center; gap: 0.8rem;
          animation: shimmer 3s linear infinite;
          box-shadow: 0 8px 30px rgba(147,51,234,0.55), 0 0 60px rgba(147,51,234,0.2);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .enterBtn:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 14px 50px rgba(147,51,234,0.75), 0 0 100px rgba(147,51,234,0.35);
        }
        .enterBtn:active { transform: scale(0.98); }
        .btnArrow { font-size: 1.1rem; transition: transform 0.2s ease; }
        .enterBtn:hover .btnArrow { transform: translateX(4px); }
        .btnGlow {
          position: absolute; inset: 0;
          background: linear-gradient(transparent, rgba(255,255,255,0.12), transparent);
          transform: rotate(45deg) translateY(-200%);
          transition: transform 0.6s ease;
        }
        .enterBtn:hover .btnGlow { transform: rotate(45deg) translateY(200%); }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .assistant { left: 4%; }
          .panel { left: 58%; width: 420px; }
        }
        @media (max-width: 700px) {
          .assistant { display: none; }
          .panel { left: 50%; width: 90vw; }
        }
      `}</style>
    </div>
  )
}