"use client"

import { useState, useRef, useEffect } from "react"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  const [adminMode, setAdminMode] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleGoogle() {
    await signIn("google", { callbackUrl: "/welcome" })
  }

  async function handleAdmin() {
    await signIn("credentials", { email, password, callbackUrl: "/welcome" })
  }

  return (
    <div className="page">

      {/* Aurora blobs */}
      <div className="aurora1" />
      <div className="aurora2" />
      <div className="aurora3" />

      {/* Canvas particles */}
      <GlowParticles />

      {/* Card */}
      <div className="card">
        <div className="scanline" />

        {/* Logo */}
        <div className="logo">
          <h1>AI.SIRI</h1>
          <p>Your intelligent learning companion</p>
        </div>

        {/* Toggle */}
        <div className="toggle">
          <button className={!adminMode ? "active" : ""} onClick={() => setAdminMode(false)}>
            👤 User
          </button>
          <button className={adminMode ? "active" : ""} onClick={() => setAdminMode(true)}>
            ⚡ Admin
          </button>
        </div>

        {/* User */}
        {!adminMode && (
          <div className="userSection">
            <div className="divider"><span /><p>Sign in to continue</p><span /></div>
            <button className="googleBtn" onClick={handleGoogle}>
              <svg className="googleIcon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>
        )}

        {/* Admin */}
        {adminMode && (
          <div className="adminBox">
            <div className="divider"><span /><p>Admin credentials</p><span /></div>
            <div className="inputWrap">
              <input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <span className="inputIcon">✉</span>
            </div>
            <div className="inputWrap">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="inputIcon">🔒</span>
            </div>
            <button className="btn" onClick={handleAdmin}>⚡ Login as Admin</button>
          </div>
        )}

        <div className="footer">Protected by AI.SIRI · Secure Login</div>
      </div>

      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes auroraMove {
          0% { transform: translate(-200px, -100px) scale(1); }
          50% { transform: translate(100px, 50px) scale(1.2); }
          100% { transform: translate(200px, 100px) scale(0.9); }
        }
        @keyframes auroraMove2 {
          0% { transform: translate(200px, 100px) scale(1); }
          50% { transform: translate(-100px, -50px) scale(1.3); }
          100% { transform: translate(-200px, -100px) scale(0.8); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 40px rgba(147,51,234,0.3), 0 0 80px rgba(147,51,234,0.1), inset 0 1px 0 rgba(255,255,255,0.1); }
          50% { box-shadow: 0 0 70px rgba(168,85,247,0.6), 0 0 140px rgba(147,51,234,0.3), inset 0 1px 0 rgba(255,255,255,0.15); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes scanline {
          0% { top: -5%; } 100% { top: 105%; }
        }
        @keyframes logoGlow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(168,85,247,0.6)) drop-shadow(0 0 20px rgba(147,51,234,0.3)); }
          50% { filter: drop-shadow(0 0 20px rgba(232,121,249,0.9)) drop-shadow(0 0 40px rgba(147,51,234,0.6)); }
        }
        @keyframes btnShine {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        .page {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #060010;
          overflow: hidden;
          position: relative;
        }

        .aurora1 {
          position: absolute;
          width: 700px; height: 700px; border-radius: 50%;
          background: radial-gradient(circle, rgba(147,51,234,0.35), rgba(99,102,241,0.15), transparent 70%);
          filter: blur(80px);
          animation: auroraMove 12s ease-in-out infinite alternate;
          pointer-events: none;
        }
        .aurora2 {
          position: absolute;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(192,38,211,0.25), rgba(79,70,229,0.12), transparent 70%);
          filter: blur(100px);
          animation: auroraMove2 15s ease-in-out infinite alternate;
          pointer-events: none;
        }
        .aurora3 {
          position: absolute;
          width: 300px; height: 300px; border-radius: 50%;
          background: radial-gradient(circle, rgba(168,85,247,0.2), transparent 70%);
          filter: blur(60px);
          top: 60%; right: 10%;
          animation: auroraMove 10s ease-in-out infinite reverse;
          pointer-events: none;
        }

        .card {
          position: relative; z-index: 2;
          width: 400px; padding: 2.5rem;
          border-radius: 32px;
          background: rgba(8, 2, 20, 0.8);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(147, 51, 234, 0.3);
          animation: fadeUp 0.8s ease forwards, pulseGlow 4s ease-in-out infinite;
          overflow: hidden;
        }
        .card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(168,85,247,0.9), rgba(232,121,249,0.9), rgba(168,85,247,0.9), transparent);
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
        .card::after {
          content: '';
          position: absolute; inset: 0; border-radius: 32px;
          background: radial-gradient(ellipse at 50% 0%, rgba(147,51,234,0.1), transparent 60%);
          pointer-events: none;
        }

        .scanline {
          position: absolute; left: 0; width: 100%; height: 1px;
          background: linear-gradient(transparent, rgba(147,51,234,0.2), transparent);
          animation: scanline 3s linear infinite;
          z-index: 1; pointer-events: none;
        }

        .logo { text-align: center; margin-bottom: 1.8rem; position: relative; z-index: 2; }
        .logo h1 {
          font-size: 2.2rem; font-weight: 800; letter-spacing: 0.08em;
          background: linear-gradient(135deg, #e879f9, #a855f7, #818cf8, #e879f9);
          background-size: 300% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          animation: gradientShift 4s ease infinite, logoGlow 3s ease-in-out infinite;
        }
        .logo p {
          color: #7c3aed; font-size: 0.75rem; letter-spacing: 0.2em;
          text-transform: uppercase; margin-top: 0.3rem; font-weight: 500;
        }

        .toggle {
          display: flex; background: rgba(0,0,0,0.4); border-radius: 14px;
          margin-bottom: 1.5rem; padding: 4px;
          border: 1px solid rgba(147,51,234,0.2);
          position: relative; z-index: 2;
        }
        .toggle button {
          flex: 1; padding: 0.6rem; border: none;
          background: transparent; color: #7c3aed;
          cursor: pointer; border-radius: 10px;
          font-weight: 600; font-size: 0.9rem;
          transition: all 0.3s; letter-spacing: 0.05em;
        }
        .toggle button.active {
          background: linear-gradient(135deg, #9333ea, #7c3aed);
          color: white;
          box-shadow: 0 4px 15px rgba(147,51,234,0.5), 0 0 30px rgba(147,51,234,0.2);
        }

        .userSection, .adminBox { position: relative; z-index: 2; }

        .divider {
          display: flex; align-items: center; gap: 0.8rem; margin-bottom: 1.2rem;
        }
        .divider span {
          flex: 1; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(147,51,234,0.3), transparent);
        }
        .divider p {
          font-size: 0.72rem; color: #7c3aed;
          letter-spacing: 0.1em; text-transform: uppercase; white-space: nowrap;
        }

        .googleBtn {
          width: 100%; padding: 0.9rem 1.5rem; border-radius: 14px;
          border: 1px solid rgba(147,51,234,0.3);
          background: rgba(0,0,0,0.4); color: white; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 0.8rem;
          font-weight: 600; font-size: 0.95rem; letter-spacing: 0.03em;
          transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.2);
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .googleBtn:hover {
          background: rgba(147,51,234,0.15); border-color: rgba(168,85,247,0.6);
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(147,51,234,0.4), 0 0 50px rgba(147,51,234,0.2);
        }
        .googleIcon { width: 20px; height: 20px; flex-shrink: 0; }

        .inputWrap { position: relative; margin-bottom: 0.9rem; }
        .inputWrap input {
          width: 100%; padding: 0.9rem 2.5rem 0.9rem 1rem;
          border-radius: 12px;
          background: rgba(0,0,0,0.5);
          border: 1px solid rgba(147,51,234,0.2);
          color: white; font-size: 0.95rem; outline: none;
          transition: all 0.3s;
        }
        .inputWrap input::placeholder { color: #4c1d95; }
        .inputWrap input:focus {
          border-color: rgba(168,85,247,0.6);
          box-shadow: 0 0 0 3px rgba(147,51,234,0.15), 0 0 20px rgba(147,51,234,0.1);
          background: rgba(10,4,25,0.7);
        }
        .inputIcon {
          position: absolute; right: 0.9rem; top: 50%;
          transform: translateY(-50%); color: #7c3aed;
          font-size: 1rem; pointer-events: none;
        }

        .btn {
          width: 100%; padding: 1rem; border-radius: 14px; border: none;
          background: linear-gradient(135deg, #9333ea, #c026d3, #9333ea);
          background-size: 200% auto;
          color: white; cursor: pointer; font-weight: 700;
          font-size: 1rem; letter-spacing: 0.05em;
          transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.2);
          box-shadow: 0 8px 25px rgba(147,51,234,0.5), 0 0 50px rgba(147,51,234,0.2);
          animation: btnShine 3s linear infinite;
          position: relative; overflow: hidden;
        }
        .btn::after {
          content: ''; position: absolute; top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: linear-gradient(transparent, rgba(255,255,255,0.1), transparent);
          transform: rotate(45deg) translateY(-100%); transition: transform 0.5s;
        }
        .btn:hover::after { transform: rotate(45deg) translateY(100%); }
        .btn:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 15px 40px rgba(147,51,234,0.7), 0 0 80px rgba(147,51,234,0.4);
        }

        .footer {
          margin-top: 1.5rem; text-align: center;
          font-size: 0.72rem; color: #4c1d95;
          letter-spacing: 0.05em; position: relative; z-index: 2;
        }

        @media (max-width: 440px) {
          .card { width: 92vw; padding: 1.8rem; }
          .logo h1 { font-size: 1.8rem; }
        }
      `}</style>
    </div>
  )
}

/* ========== Glow Particles Canvas ========== */
function GlowParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    let particles: any[] = []
    let time = 0

    function init(W: number, H: number) {
      particles = []
      const count = Math.min(80, Math.floor((W * H) / 9000))
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * W, y: Math.random() * H,
          size: Math.random() * 2.5 + 1,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -(Math.random() * 0.5 + 0.2),
          alpha: Math.random() * 0.6 + 0.2,
          phase: Math.random() * Math.PI * 2,
          color: Math.random() > 0.5 ? [147, 51, 234] : [192, 38, 211],
        })
      }
    }

    function draw() {
      const W = canvas!.width, H = canvas!.height
      ctx!.clearRect(0, 0, W, H)
      time += 0.02
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy
        if (p.y < -20) { p.y = H + 20; p.x = Math.random() * W }
        if (p.x < -20) p.x = W + 20
        if (p.x > W + 20) p.x = -20
        const pulse = Math.sin(time + p.phase) * 0.2 + 0.8
        const a = p.alpha * pulse
        const [r, g, b] = p.color
        ctx!.save()
        const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4)
        grad.addColorStop(0, `rgba(${r},${g},${b},${a})`)
        grad.addColorStop(0.5, `rgba(${r},${g},${b},${a * 0.4})`)
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2)
        ctx!.fillStyle = grad; ctx!.fill()
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(220,180,255,${a * 0.9})`; ctx!.fill()
        ctx!.restore()
      }
      animId = requestAnimationFrame(draw)
    }

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
      init(canvas!.width, canvas!.height)
    }

    resize()
    window.addEventListener("resize", resize)
    draw()
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animId) }
  }, [])

  return (
    <canvas ref={canvasRef} style={{
      position: "fixed", top: 0, left: 0,
      width: "100%", height: "100%",
      zIndex: 1, pointerEvents: "none"
    }} />
  )
}