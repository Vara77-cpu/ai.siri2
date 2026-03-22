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

  /* typing */
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

  /* AI voice */
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

      speech.onstart = () => {
        const vid = document.querySelector(".assistantVideo") as HTMLVideoElement
        if (vid) vid.playbackRate = 1
      }

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

      {/* AI ASSISTANT */}
      <div className="assistant">
        <video
          src="/ai-avatar.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="assistantVideo"
        />
        <div className="assistantGlow" />
      </div>

      {/* SNOW */}
      <div className="aiSnow">
        {particles.map((_, i) => (
          <span
            key={i}
            className="snow"
            style={{
              left: `${(i * 7) % 100}%`,
              animationDelay: `${(i % 5) * 0.5}s`,
              animationDuration: `${6 + (i % 4)}s`
            }}
          >
            ✦
          </span>
        ))}
      </div>

      {/* PANEL */}
      <div className="panel">
        <h1 className="title">AI.SIRI</h1>

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

        .page{
          width:100vw;
          height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          position:relative;
          overflow:hidden;
          background:#020617;
          color:white;
        }

        /* AI ASSISTANT */

        .assistant{
          position:absolute;
          left:8%;
          top:50%;
          transform:translateY(-50%);
          z-index:5;
          animation:float 4s ease-in-out infinite;
        }

        .assistantVideo{
          width:240px;
          border-radius:20px;
          z-index:2;
        }

        .assistantGlow{
          position:absolute;
          width:280px;
          height:280px;
          border-radius:50%;
          background:radial-gradient(circle,#9333ea55,transparent);
          top:50%;
          left:50%;
          transform:translate(-50%,-50%);
          animation:pulse 2s infinite;
        }

        @keyframes float{
          0%,100%{transform:translateY(-50%)}
          50%{transform:translateY(-55%)}
        }

        @keyframes pulse{
          50%{transform:translate(-50%,-50%) scale(1.2)}
        }

        /* PANEL */

        .panel{
          width:500px;
          padding:40px;
          border-radius:28px;
          background:rgba(255,255,255,.06);
          backdrop-filter:blur(30px);
          border:1px solid rgba(255,255,255,.1);
          text-align:center;
          position:absolute;
          left:60%;
          top:50%;
          transform:translate(-50%,-50%);
          box-shadow:0 0 60px rgba(147,51,234,.3);
        }

        .title{
          font-size:40px;
          background:linear-gradient(90deg,#9333ea,#c026d3);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
        }

        .marquee{
          margin-top:10px;
          overflow:hidden;
          white-space:nowrap;
          color:#a78bfa;
        }

        .marquee span{
          display:inline-block;
          padding-left:100%;
          animation:marquee 10s linear infinite;
        }

        @keyframes marquee{
          100%{transform:translateX(-100%)}
        }

        .text{
          margin-top:20px;
          color:#cbd5f5;
        }

        .enterBtn{
          margin-top:30px;
          padding:15px 30px;
          border-radius:16px;
          border:none;
          background:linear-gradient(90deg,#9333ea,#c026d3);
          color:white;
          cursor:pointer;
        }

        /* SNOW */

        .aiSnow{
          position:absolute;
          inset:0;
        }

        .snow{
          position:absolute;
          top:-20px;
          color:#9333ea;
          animation:fall linear infinite;
        }

        @keyframes fall{
          100%{
            transform:translateY(110vh) rotate(360deg);
            opacity:0;
          }
        }

      `}</style>
    </div>
  )
}