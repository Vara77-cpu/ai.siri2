"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

const GREETING_LINES = [
  "Welcome back, Champion. 🚀",
  "Your AI learning journey continues...",
  "Every lesson brings you closer to mastery.",
  "AI.SIRI is ready. Are you? ✨",
]

export default function Greeting() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [countdown, setCountdown] = useState(8)
  const [progress, setProgress] = useState(0)
  const [typedText, setTypedText] = useState("")
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const [videoReady, setVideoReady] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [logoError, setLogoError] = useState(false)

  /* ── AUTO REDIRECT ── */
  useEffect(() => {
    const t = setTimeout(() => router.push("/dashboard"), 8000)
    return () => clearTimeout(t)
  }, [router])

  /* ── PROGRESS ── */
  useEffect(() => {
    const start = Date.now()
    const total = 8000
    const iv = setInterval(() => {
      const e = Date.now() - start
      setProgress(Math.min(100, (e / total) * 100))
      setCountdown(Math.max(0, Math.ceil((total - e) / 1000)))
      if (e >= total) clearInterval(iv)
    }, 50)
    return () => clearInterval(iv)
  }, [])

  /* ── TYPEWRITER ── */
  useEffect(() => {
    if (lineIndex >= GREETING_LINES.length) return
    const line = GREETING_LINES[lineIndex]
    if (charIndex < line.length) {
      const t = setTimeout(() => {
        setTypedText(prev => prev + line[charIndex])
        setCharIndex(c => c + 1)
      }, 42)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => {
        setTypedText(prev => prev + "\n")
        setLineIndex(l => l + 1)
        setCharIndex(0)
      }, 800)
      return () => clearTimeout(t)
    }
  }, [lineIndex, charIndex])

  /* ── CURSOR BLINK ── */
  useEffect(() => {
    const iv = setInterval(() => setShowCursor(c => !c), 530)
    return () => clearInterval(iv)
  }, [])

  /* ── VIDEO AUTOPLAY ── */
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const tryPlay = () => v.play().catch(() => {})
    v.addEventListener("canplay", tryPlay)
    document.addEventListener("click", tryPlay, { once: true })
    return () => v.removeEventListener("canplay", tryPlay)
  }, [])

  /* ── CANVAS PARTICLES ── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    let animId: number, time = 0
    interface P { x:number;y:number;vx:number;vy:number;r:number;a:number;ph:number }
    let pts: P[] = []

    function init(W: number, H: number) {
      pts = Array.from({ length: 55 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -(Math.random() * 0.18 + 0.04),
        r: Math.random() * 1.4 + 0.4,
        a: Math.random() * 0.35 + 0.1,
        ph: Math.random() * Math.PI * 2,
      }))
    }

    function draw() {
      if (!canvas) return
      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H)
      time += 0.01
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W }
        if (p.x < -10) p.x = W + 10
        if (p.x > W + 10) p.x = -10
        const pulse = Math.sin(time + p.ph) * 0.28 + 0.72
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(210, 170, 255, ${p.a * pulse})`
        ctx.shadowColor = "rgba(168, 85, 247, 0.7)"
        ctx.shadowBlur = 7
        ctx.fill()
        ctx.shadowBlur = 0
      }
      animId = requestAnimationFrame(draw)
    }

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      init(canvas.width, canvas.height)
    }

    resize()
    window.addEventListener("resize", resize)
    draw()
    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  const lines = typedText.split("\n").filter((_, i) => i < GREETING_LINES.length + 1)

  return (
    <div className="page">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Exo+2:ital,wght@0,200;0,300;0,400;0,500;0,600;1,300&family=Share+Tech+Mono&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { overflow: hidden; width: 100%; height: 100%; }
      `}</style>

      {/* ── FULL PAGE VIDEO BG ── */}
      <div className="video-bg">
        {!videoError ? (
          <video
            ref={videoRef}
            autoPlay muted playsInline loop preload="auto"
            className="bg-video"
            onCanPlay={() => setVideoReady(true)}
            onError={() => setVideoError(true)}
          >
            <source src="/logovideo2.mp4" type="video/mp4" />
            <source src="/logovideo2.webm" type="video/webm" />
          </video>
        ) : (
          <div className="fallback-bg" />
        )}
        <div className="ov-top" />
        <div className="ov-vignette" />
        <div className="ov-bottom" />
        <div className="ov-scan" />
      </div>

      {/* ── PARTICLES ── */}
      <canvas ref={canvasRef} className="canvas" />

      {/* ── UI LAYOUT ── */}
      <div className="ui">

        {/* TOP BAR */}
        <div className="topbar">
          <div className="logo-cluster">
            <div className="logo-ring-wrap">
              <div className="ring ra" /><div className="ring rb" /><div className="ring rc" />
              <div className="logo-disc">
                <div className="disc-bg" />
                {!logoError ? (
                  <img src="/logo.png" alt="AI.SIRI" className="logo-img"
                    onError={() => setLogoError(true)}
                    onLoad={e => { (e.target as HTMLImageElement).style.opacity = "1" }}
                    style={{ opacity: 0, transition: "opacity 0.6s ease" }}
                  />
                ) : (
                  <span className="logo-fallback-text">AI</span>
                )}
              </div>
            </div>
            <div className="brand-block">
              <h1 className="brand-name">AI.SIRI</h1>
              <div className="brand-tagline">INTELLIGENT LEARNING ASSISTANT</div>
            </div>
          </div>
          <div className="neural-pill">
            <span className="np-dot" /><span>NEURAL CORE ACTIVE</span>
          </div>
        </div>

        {/* CENTER GREETING */}
        <div className="center">
          <div className="greeting-card">
            <div className="gc-shimmer" />
            <div className="gc-c gc-tl" /><div className="gc-c gc-tr" />
            <div className="gc-c gc-bl" /><div className="gc-c gc-br" />

            <div className="gc-eyebrow">
              <span className="eb-dot" />
              <span>PERSONAL MESSAGE FROM AI.SIRI</span>
              <span className="eb-dot" />
            </div>

            <div className="typewriter">
              {lines.map((line, i) => (
                <div key={i} className={`t-line tl-${i}`}>
                  {line}
                  {i === lines.length - 1 && lineIndex < GREETING_LINES.length && (
                    <span className={`cur ${showCursor ? "on" : "off"}`}>▌</span>
                  )}
                </div>
              ))}
              {lineIndex >= GREETING_LINES.length && (
                <div className="all-done">
                  <span className="ad-dot" />
                  Message delivered — dashboard loading
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM HUD */}
        <div className="bottom-hud">
          <div className="status-strip">
            <div className="s-pill"><span className="sd green" />Systems Online</div>
            <div className="sep" />
            <div className="s-pill"><span className="sd blue" />AI Ready</div>
            <div className="sep" />
            <div className="s-pill"><span className="sd purple" />Neural Active</div>
          </div>

          <div className="prog-section">
            <div className="prog-meta">
              <span>LOADING DASHBOARD</span>
              <span className="prog-val">{Math.round(progress)}%</span>
            </div>
            <div className="prog-track">
              <div className="prog-fill" style={{ width: `${progress}%` }} />
              <div className="prog-glow" style={{ width: `${progress}%` }} />
              <div className="prog-tip"  style={{ left: `${Math.min(progress, 99.4)}%` }} />
            </div>
          </div>

          <div className="footer-note">
            Redirecting in <b>{countdown}s</b>
            <span className="fn-sep">◆</span>
            AI.SIRI v2.0
            <span className="fn-sep">◆</span>
            Secure Session
          </div>
        </div>

      </div>

      <style jsx>{`
        /* ━━━━ KEYFRAMES ━━━━ */
        @keyframes fadeIn { from{opacity:0}to{opacity:1} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-30px)}to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.7)}to{opacity:1;transform:scale(1)} }
        @keyframes floatY { 0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)} }
        @keyframes pulseRing {
          0%{transform:translate(-50%,-50%) scale(0.85);opacity:0.7}
          100%{transform:translate(-50%,-50%) scale(2.8);opacity:0}
        }
        @keyframes blink { 0%,100%{opacity:1}50%{opacity:0.15} }
        @keyframes gradFlow { 0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%} }
        @keyframes shimmerSweep { 0%{left:-120%}100%{left:120%} }
        @keyframes glowPulse {
          0%,100%{box-shadow:0 0 30px rgba(109,40,217,0.25),0 0 70px rgba(109,40,217,0.1)}
          50%{box-shadow:0 0 50px rgba(139,92,246,0.4),0 0 110px rgba(168,85,247,0.2)}
        }
        @keyframes typeIn { from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)} }
        @keyframes cursorBlink { 0%,100%{opacity:1}50%{opacity:0} }

        /* ━━━━ PAGE ━━━━ */
        .page {
          position: relative;
          width: 100vw; height: 100vh;
          overflow: hidden;
          display: flex;
          font-family: 'Exo 2', sans-serif;
          color: #fff;
        }

        /* ━━━━ VIDEO BG ━━━━ */
        .video-bg {
          position: absolute; inset: 0; z-index: 0;
        }
        .bg-video {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center center;
          display: block;
        }
        .fallback-bg {
          width: 100%; height: 100%;
          background:
            radial-gradient(ellipse at 20% 60%, rgba(90,20,180,0.6), transparent 55%),
            radial-gradient(ellipse at 80% 30%, rgba(60,10,140,0.5), transparent 55%),
            #04000f;
        }

        /* Overlays */
        .ov-top {
          position:absolute;inset:0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 25%);
        }
        .ov-vignette {
          position:absolute;inset:0;
          background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,12,0.7) 100%);
        }
        .ov-bottom {
          position:absolute;bottom:0;left:0;right:0;height:45%;
          background: linear-gradient(to top, rgba(2,0,18,0.92), transparent);
        }
        .ov-scan {
          position:absolute;inset:0;
          background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.035) 3px, rgba(0,0,0,0.035) 4px);
          pointer-events:none;
        }

        /* ━━━━ CANVAS ━━━━ */
        .canvas {
          position:absolute;inset:0;z-index:1;pointer-events:none;
        }

        /* ━━━━ UI ━━━━ */
        .ui {
          position:relative;z-index:2;
          width:100%;height:100vh;
          display:flex;flex-direction:column;
          justify-content:space-between;
          padding: 1.8rem 2.5rem 2rem;
        }

        /* ━━━━ TOPBAR ━━━━ */
        .topbar {
          display:flex;align-items:center;justify-content:space-between;
          animation: slideDown 0.8s ease 0.1s both;
        }

        .logo-cluster {
          display:flex;align-items:center;gap:1.2rem;
        }

        .logo-ring-wrap {
          position:relative;width:72px;height:72px;flex-shrink:0;
          animation: floatY 5s ease-in-out infinite;
        }
        .ring {
          position:absolute;left:50%;top:50%;
          border-radius:50%;border:1px solid;
          animation: pulseRing 3s ease-out infinite;
        }
        .ra{width:76px;height:76px;border-color:rgba(139,92,246,0.7);animation-delay:0s;}
        .rb{width:110px;height:110px;border-color:rgba(168,85,247,0.4);animation-delay:1s;}
        .rc{width:145px;height:145px;border-color:rgba(139,92,246,0.18);animation-delay:2s;}

        .logo-disc {
          width:72px;height:72px;border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          position:relative;z-index:5;
        }
        .disc-bg {
          position:absolute;inset:0;border-radius:50%;
          background: linear-gradient(135deg,#2e1065,#7c3aed,#4c1d95);
          border:2px solid rgba(167,139,250,0.7);
          box-shadow:0 0 40px rgba(139,92,246,0.6),0 0 80px rgba(168,85,247,0.28),inset 0 0 24px rgba(216,180,254,0.08);
          animation: glowPulse 3s ease-in-out infinite;
        }
        .logo-img {
          width:46px;height:46px;object-fit:contain;border-radius:50%;
          position:relative;z-index:2;
          filter: drop-shadow(0 0 12px rgba(192,132,252,0.9));
        }
        .logo-fallback-text {
          font-family:'Orbitron',monospace;font-size:1.2rem;font-weight:900;
          background:linear-gradient(135deg,#e879f9,#a855f7,#818cf8);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
          position:relative;z-index:2;
        }

        .brand-block { display:flex;flex-direction:column;gap:3px; }
        .brand-name {
          font-family:'Orbitron',monospace;
          font-size:clamp(1.6rem,3.5vw,2.4rem);
          font-weight:900;letter-spacing:0.12em;line-height:1;
          background:linear-gradient(135deg,#fde68a 0%,#f9a8d4 20%,#c084fc 45%,#818cf8 70%,#67e8f9 100%);
          background-size:300% auto;
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
          animation: gradFlow 5s ease infinite;
        }
        .brand-tagline {
          font-family:'Share Tech Mono',monospace;
          font-size:0.5rem;letter-spacing:0.28em;
          color:rgba(196,181,253,0.55);text-transform:uppercase;
        }

        .neural-pill {
          display:flex;align-items:center;gap:8px;
          padding:6px 16px;
          background:rgba(5,0,20,0.5);
          backdrop-filter:blur(16px);
          border:1px solid rgba(139,92,246,0.2);
          border-radius:40px;
          font-family:'Share Tech Mono',monospace;
          font-size:0.55rem;letter-spacing:0.22em;
          color:rgba(167,139,250,0.6);text-transform:uppercase;
        }
        .np-dot {
          width:6px;height:6px;border-radius:50%;
          background:#4ade80;box-shadow:0 0 8px #4ade80;
          animation: blink 2s ease-in-out infinite;
        }

        /* ━━━━ CENTER ━━━━ */
        .center {
          flex:1;display:flex;align-items:center;justify-content:center;
          animation: fadeIn 0.6s ease 0.4s both;
        }

        .greeting-card {
          position:relative;
          background:rgba(4,0,16,0.52);
          backdrop-filter:blur(36px);-webkit-backdrop-filter:blur(36px);
          border:1px solid rgba(139,92,246,0.28);
          border-radius:22px;
          padding:2.4rem 3rem;
          max-width:640px;width:100%;
          overflow:hidden;
          box-shadow:0 20px 70px rgba(0,0,0,0.45),0 0 90px rgba(109,40,217,0.16),inset 0 0 60px rgba(109,40,217,0.03);
          animation: glowPulse 4s ease-in-out infinite;
        }

        /* shimmer sweep */
        .gc-shimmer {
          position:absolute;top:0;left:-120%;
          width:100%;height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent);
          animation: shimmerSweep 5s ease-in-out 2s infinite;
          pointer-events:none;z-index:1;
        }

        /* corner brackets */
        .gc-c { position:absolute;width:24px;height:24px;border-color:rgba(168,85,247,0.55);border-style:solid; }
        .gc-tl{top:10px;left:10px;border-width:1.5px 0 0 1.5px;border-radius:5px 0 0 0;}
        .gc-tr{top:10px;right:10px;border-width:1.5px 1.5px 0 0;border-radius:0 5px 0 0;}
        .gc-bl{bottom:10px;left:10px;border-width:0 0 1.5px 1.5px;border-radius:0 0 0 5px;}
        .gc-br{bottom:10px;right:10px;border-width:0 1.5px 1.5px 0;border-radius:0 0 5px 0;}

        .gc-eyebrow {
          display:flex;align-items:center;justify-content:center;gap:10px;
          font-family:'Share Tech Mono',monospace;
          font-size:0.52rem;letter-spacing:0.25em;
          color:rgba(167,139,250,0.4);text-transform:uppercase;
          margin-bottom:1.4rem;
          position:relative;z-index:2;
        }
        .eb-dot {
          width:4px;height:4px;border-radius:50%;
          background:#a855f7;box-shadow:0 0 5px #a855f7;
          display:inline-block;
          animation: blink 1.8s ease-in-out infinite;
        }

        .typewriter {
          position:relative;z-index:2;
          display:flex;flex-direction:column;gap:0.6rem;
          min-height:130px;
        }

        .t-line {
          font-family:'Exo 2',sans-serif;
          animation: typeIn 0.25s ease both;
          line-height:1.5;
        }
        .tl-0 {
          font-size:clamp(1.25rem,2.8vw,1.6rem);font-weight:500;
          background:linear-gradient(90deg,#fde68a,#f9a8d4,#c084fc);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
          background-size:200% auto;
          animation: typeIn 0.25s ease both, gradFlow 4s ease infinite;
        }
        .tl-1 { font-size:clamp(0.95rem,2vw,1.15rem);font-weight:300;color:rgba(224,204,255,0.88); }
        .tl-2 { font-size:clamp(0.9rem,1.8vw,1.05rem);font-weight:300;font-style:italic;color:rgba(196,181,253,0.72); }
        .tl-3 {
          font-size:clamp(0.95rem,2vw,1.12rem);font-weight:600;
          background:linear-gradient(90deg,#67e8f9,#a78bfa,#f9a8d4);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }

        .cur { color:#c084fc;text-shadow:0 0 10px #c084fc;margin-left:1px;font-size:0.9em; }
        .cur.on{opacity:1}.cur.off{opacity:0}

        .all-done {
          display:inline-flex;align-items:center;gap:8px;
          margin-top:0.7rem;
          font-family:'Share Tech Mono',monospace;
          font-size:0.58rem;letter-spacing:0.16em;
          color:rgba(74,222,128,0.7);
          animation: fadeIn 0.5s ease both;
        }
        .ad-dot {
          width:6px;height:6px;border-radius:50%;
          background:#4ade80;box-shadow:0 0 7px #4ade80;
          animation: blink 1.2s ease-in-out infinite;
        }

        /* ━━━━ BOTTOM HUD ━━━━ */
        .bottom-hud {
          display:flex;flex-direction:column;align-items:center;gap:0.9rem;
          animation: slideUp 0.8s ease 0.5s both;
        }

        .status-strip {
          display:flex;align-items:center;gap:14px;
          padding:8px 22px;
          background:rgba(4,0,16,0.55);
          backdrop-filter:blur(20px);
          border:1px solid rgba(139,92,246,0.2);
          border-radius:40px;
        }
        .s-pill {
          display:flex;align-items:center;gap:7px;
          font-family:'Share Tech Mono',monospace;
          font-size:0.58rem;letter-spacing:0.1em;
          color:rgba(196,181,253,0.65);text-transform:uppercase;
        }
        .sd { width:6px;height:6px;border-radius:50%;animation: blink 2s ease-in-out infinite; }
        .green{background:#4ade80;box-shadow:0 0 6px #4ade80;}
        .blue{background:#60a5fa;box-shadow:0 0 6px #60a5fa;animation-delay:0.7s;}
        .purple{background:#c084fc;box-shadow:0 0 6px #c084fc;animation-delay:1.4s;}
        .sep{width:1px;height:14px;background:rgba(139,92,246,0.22);}

        .prog-section { width:min(520px,85vw); }
        .prog-meta {
          display:flex;justify-content:space-between;
          font-family:'Share Tech Mono',monospace;
          font-size:0.56rem;letter-spacing:0.18em;
          color:rgba(167,139,250,0.45);text-transform:uppercase;
          margin-bottom:8px;
        }
        .prog-val { color:rgba(216,180,254,0.75); }
        .prog-track {
          position:relative;height:5px;
          background:rgba(139,92,246,0.1);border-radius:10px;
          border:1px solid rgba(139,92,246,0.15);overflow:visible;
        }
        .prog-fill {
          height:100%;border-radius:10px;
          background:linear-gradient(90deg,#5b21b6,#9333ea,#c084fc,#f0abfc);
          transition:width 0.1s linear;
        }
        .prog-glow {
          position:absolute;top:0;left:0;height:100%;border-radius:10px;
          background:linear-gradient(90deg,transparent,rgba(240,171,252,0.55));
          filter:blur(4px);transition:width 0.1s linear;
        }
        .prog-tip {
          position:absolute;top:50%;
          width:11px;height:11px;border-radius:50%;
          background:#f0abfc;
          box-shadow:0 0 10px #f0abfc,0 0 22px rgba(240,171,252,0.45);
          transform:translate(-50%,-50%);
          transition:left 0.1s linear;z-index:2;
        }

        .footer-note {
          font-family:'Share Tech Mono',monospace;
          font-size:0.55rem;letter-spacing:0.12em;
          color:rgba(109,40,217,0.5);text-transform:uppercase;
          display:flex;align-items:center;gap:9px;flex-wrap:wrap;justify-content:center;
        }
        .footer-note b { color:rgba(196,181,253,0.72);font-weight:400; }
        .fn-sep { font-size:0.38rem;color:rgba(139,92,246,0.32); }

        /* ━━━━ RESPONSIVE ━━━━ */
        @media(max-width:768px){
          .ui { padding:1.4rem 1.4rem 1.6rem; }
          .neural-pill { display:none; }
          .greeting-card { padding:1.8rem 1.8rem; border-radius:18px; }
          .brand-name { font-size:1.5rem; }
        }
        @media(max-width:480px){
          .ui { padding:1rem 1rem 1.4rem; }
          .logo-ring-wrap { width:60px;height:60px; }
          .logo-disc { width:60px;height:60px; }
          .logo-img { width:38px;height:38px; }
          .ra{width:64px;height:64px;} .rb{width:94px;height:94px;} .rc{width:125px;height:125px;}
          .greeting-card { padding:1.5rem 1.2rem; }
          .tl-0 { font-size:1rem; }
          .status-strip { gap:8px;padding:7px 14px; }
          .sep { display:none; }
        }
      `}</style>
    </div>
  )
}