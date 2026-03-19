"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import ParticlesBackground from "../components/ParticlesBackground"

export default function WelcomePage() {
  const { data: session } = useSession()
  const router = useRouter()

  const [text, setText] = useState("")
  const [speechFinished, setSpeechFinished] = useState(false)

  const message = `Welcome ${session?.user?.name || "Student"}.
Your AI learning assistant is ready.`

  useEffect(() => {
    if (!session) return

    let i = 0
    const typing = setInterval(() => {
      setText(message.slice(0, i))
      i++
      if (i > message.length) clearInterval(typing)
    }, 35)

    return () => clearInterval(typing)
  }, [session, message])

  useEffect(() => {
    if (!session?.user?.name) return

    const speak = () => {
      if (typeof window === "undefined" || !window.speechSynthesis) return

      window.speechSynthesis.cancel()
      const voices = window.speechSynthesis.getVoices()
      if (voices.length === 0) return

      const femaleVoice =
        voices.find(v => v.name.includes("Female")) ||
        voices.find(v => v.name.includes("Samantha")) ||
        voices.find(v => v.name.includes("Zira")) ||
        voices[0]

      const speech = new SpeechSynthesisUtterance(
        `Welcome back ${session?.user?.name}. Your AI learning assistant is ready`
      )

      if (femaleVoice) speech.voice = femaleVoice
      speech.rate = 1
      speech.pitch = 1.1

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

  const particles = Array.from({ length: 40 })

  return (
    <div className="page">
      <ParticlesBackground />

      {/* SNOW */}
      <div className="aiSnow">
        {particles.map((_, i) => (
          <span
            key={i}
            className="snow"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          >
            ✦
          </span>
        ))}
      </div>

      {/* PANEL */}
      <div className="panel card3d shimmer glow">
        <div className="orb-container">
          <div className="ring" />
          <div className="ring2" />
          <div className="orb" />
        </div>

        <h1 className="title">AI.SIRI</h1>

        {/* MARQUEE */}
        <div className="marquee">
          <span>🚀 AI Powered Learning • Smart Education • Future Ready •</span>
        </div>

        <pre className="text">{text}</pre>

        {speechFinished && (
          <button
            className="enterBtn"
            onClick={() => router.push("/dashboard")}
          >
            Enter Dashboard →
          </button>
        )}
      </div>

      <style jsx>{`
        .page {
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          color: white;
          overflow: hidden;
          background: radial-gradient(circle at center, #020617, #000);
        }

        /* 3D + GLASS */
        .panel {
          width: 520px;
          max-width: 90%;
          padding: 40px;
          border-radius: 28px;
          background: rgba(255, 255, 255, .06);
          border: 1px solid rgba(255, 255, 255, .15);
          backdrop-filter: blur(30px);
          text-align: center;
          box-shadow: 0 0 60px rgba(147, 51, 234, .35);
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
          transition: all 0.4s ease;
        }

        .card3d:hover {
          transform: translate(-50%, -50%) rotateX(6deg) rotateY(-6deg) scale(1.05);
        }

        .glow {
          box-shadow: 0 0 20px #9333ea, 0 0 60px rgba(147,51,234,.4);
        }

        /* SHIMMER */
        .shimmer::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shimmerMove 3s infinite;
        }

        @keyframes shimmerMove {
          100% { left: 100%; }
        }

        /* ORB */
        .orb-container {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto 20px auto;
        }

        .orb {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: radial-gradient(circle, #c026d3, #9333ea, #302b63);
          box-shadow: 0 0 40px #9333ea, 0 0 80px #9333ea;
          animation: pulse 3s infinite;
          position: absolute;
        }

        .ring {
          position: absolute;
          border: 1px solid rgba(147, 51, 234, .6);
          border-radius: 50%;
          inset: 0;
          animation: spin 10s linear infinite;
        }

        .ring2 {
          position: absolute;
          border: 1px solid rgba(147, 51, 234, .3);
          border-radius: 50%;
          inset: -12px;
          animation: spinReverse 14s linear infinite;
        }

        @keyframes spin { 100% { transform: rotate(360deg) } }
        @keyframes spinReverse { 100% { transform: rotate(-360deg) } }
        @keyframes pulse { 50% { transform: scale(1.1) } }

        .title {
          font-size: 40px;
          font-weight: 800;
          margin-top: 10px;
          background: linear-gradient(90deg, #9333ea, #c026d3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* MARQUEE */
        .marquee {
          overflow: hidden;
          white-space: nowrap;
          margin-top: 10px;
          color: #a78bfa;
        }

        .marquee span {
          display: inline-block;
          padding-left: 100%;
          animation: marquee 12s linear infinite;
        }

        @keyframes marquee {
          100% { transform: translateX(-100%); }
        }

        .text {
          margin-top: 18px;
          font-size: 18px;
          color: #d1d5db;
          line-height: 1.6;
          white-space: pre-wrap;
        }

        .enterBtn {
          margin-top: 30px;
          padding: 16px 30px;
          border: none;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          background: linear-gradient(90deg, #9333ea, #c026d3);
          color: white;
          transition: .3s;
          position: relative;
          overflow: hidden;
        }

        .enterBtn:hover {
          transform: scale(1.08);
          box-shadow: 0 15px 40px rgba(147, 51, 234, .8);
        }

        /* SNOW */
        .aiSnow {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .snow {
          position: absolute;
          top: -20px;
          color: #9333ea;
          animation: fall linear infinite;
        }

        @keyframes fall {
          100% {
            transform: translateY(110vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}