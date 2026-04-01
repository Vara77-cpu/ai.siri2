"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState, useRef } from "react"

/* ── Ambient particle canvas ── */
function AmbientParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    let time = 0

    interface P {
      x: number; y: number; vx: number; vy: number
      size: number; alpha: number; phase: number; hue: number
      trail: { x: number; y: number }[]
      type: "orb" | "spark"
    }

    let pts: P[] = []

    function init(W: number, H: number) {
      pts = []
      const n = Math.min(90, Math.floor((W * H) / 8000))
      for (let i = 0; i < n; i++) {
        const type: P["type"] = Math.random() > 0.4 ? "orb" : "spark"
        pts.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -(Math.random() * 0.4 + 0.1),
          size: type === "orb" ? 1.5 + Math.random() * 2.5 : 0.8 + Math.random() * 1.5,
          alpha: 0.2 + Math.random() * 0.6,
          phase: Math.random() * Math.PI * 2,
          hue: 260 + Math.random() * 80,
          trail: [],
          type,
        })
      }
    }

    function draw() {
      const W = canvas!.width, H = canvas!.height
      ctx!.fillStyle = "rgba(3,0,12,0.18)"
      ctx!.fillRect(0, 0, W, H)
      time += 0.016

      for (const p of pts) {
        p.trail.push({ x: p.x, y: p.y })
        if (p.trail.length > (p.type === "orb" ? 5 : 8)) p.trail.shift()
        p.x += p.vx; p.y += p.vy
        if (p.y < -20) { p.y = H + 20; p.x = Math.random() * W; p.trail = [] }
        if (p.x < -20) { p.x = W + 20; p.trail = [] }
        if (p.x > W + 20) { p.x = -20; p.trail = [] }

        const pulse = 0.72 + Math.sin(time * 1.8 + p.phase) * 0.28
        const a = p.alpha * pulse

        ctx!.save()

        for (let i = 1; i < p.trail.length; i++) {
          const t = i / p.trail.length
          ctx!.strokeStyle = `hsla(${p.hue},90%,75%,${t * a * 0.5})`
          ctx!.lineWidth = p.size * t
          ctx!.lineCap = "round"
          ctx!.beginPath()
          ctx!.moveTo(p.trail[i - 1].x, p.trail[i - 1].y)
          ctx!.lineTo(p.trail[i].x, p.trail[i].y)
          ctx!.stroke()
        }

        if (p.type === "orb") {
          const g = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 9)
          g.addColorStop(0, `hsla(${p.hue + 10},95%,82%,${a * 0.85})`)
          g.addColorStop(0.4, `hsla(${p.hue},80%,65%,${a * 0.35})`)
          g.addColorStop(1, `hsla(${p.hue},70%,55%,0)`)
          ctx!.beginPath(); ctx!.arc(p.x, p.y, p.size * 9, 0, Math.PI * 2)
          ctx!.fillStyle = g; ctx!.fill()
          ctx!.beginPath(); ctx!.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2)
          ctx!.fillStyle = `hsla(${p.hue + 20},100%,97%,${a})`; ctx!.fill()
        } else {
          const flicker = Math.abs(Math.sin(time * 5 + p.phase))
          const g = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5)
          g.addColorStop(0, `hsla(${p.hue + 30},100%,90%,${a * flicker})`)
          g.addColorStop(1, `hsla(${p.hue},80%,60%,0)`)
          ctx!.beginPath(); ctx!.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2)
          ctx!.fillStyle = g; ctx!.fill()
          ctx!.beginPath(); ctx!.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2)
          ctx!.fillStyle = `rgba(255,255,255,${a * flicker})`; ctx!.fill()
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
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animId) }
  }, [])

  return (
    <canvas ref={canvasRef} style={{
      position: "fixed", inset: 0,
      width: "100%", height: "100%",
      zIndex: 0, pointerEvents: "none",
    }} />
  )
}

/* ── Main component ── */
export default function LearnContent() {
  const searchParams = useSearchParams()
  const subject = searchParams.get("subject") || "english"
  const lesson = searchParams.get("lesson") || "standing-line"
  const topic = lesson.replace(/-/g, " ")

  const [videos, setVideos] = useState<any[]>([])
  const [selectedVideo, setSelectedVideo] = useState("")
  const [showAI, setShowAI] = useState(true)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState("")
  const [aiTyping, setAiTyping] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  async function loadVideos() {
    try {
      const dbRes = await fetch("/api/admin/lessons")
      const db = await dbRes.json()
      let dbVideo = ""
      if (Array.isArray(db)) {
        const found = db.find((l: any) =>
          l.title?.toLowerCase().replace(/\s+/g, "-") === lesson
        )
        if (found) dbVideo = found.video_url
      }

      const ytRes = await fetch(`/api/youtube?lesson=${topic}`)
      const yt = await ytRes.json()
      const ytVideos = yt?.items?.filter((v: any) => v.id?.videoId) || []

      if (dbVideo) setSelectedVideo(dbVideo)
      else if (ytVideos.length) setSelectedVideo(ytVideos[0].id.videoId)
      setVideos(ytVideos)
    } catch (e) { console.log(e) }
  }

  useEffect(() => { loadVideos() }, [lesson])

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages, aiTyping])

  async function sendMessage() {
    if (!input.trim()) return
    const userMsg = { role: "user", content: input }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setAiTyping(true)

    const res = await fetch("/api/ai-tutor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [...messages, userMsg], lesson: topic, subject }),
    })
    const data = await res.json()
    setAiTyping(false)

    if (data?.response) {
      setMessages(prev => [...prev, { role: "assistant", content: data.response }])
      const speech = new SpeechSynthesisUtterance(data.response)
      window.speechSynthesis.speak(speech)
    }
  }

  return (
    <div className="page">
      <AmbientParticles />

      {/* ── Top bar ── */}
      <header className="topbar">
        <div className="topbarLeft">
          <span className="logoMark">AI.SIRI</span>
          <span className="breadcrumb">
            <span className="breadSubject">{subject.toUpperCase()}</span>
            <span className="breadSep">›</span>
            <span className="breadLesson">{topic}</span>
          </span>
        </div>
        <div className="topbarRight">
          <div className="levelBadge">NURSERY</div>
        </div>
      </header>

      {/* ── Main layout ── */}
      <main className={`layout ${showAI ? "withPanel" : ""}`}>

        {/* ── Hero video ── */}
        <section className="hero">
          <div className="heroGlow" />
          <div className="heroMeta">
            <h1 className="heroTitle">{topic}</h1>
            <p className="heroSub">{subject} &nbsp;·&nbsp; Nursery Level</p>
          </div>

          <div className="videoFrame">
            <div className="videoCorner tl" /><div className="videoCorner tr" />
            <div className="videoCorner bl" /><div className="videoCorner br" />
            {selectedVideo ? (
              <iframe
                src={
                  selectedVideo.includes("youtube.com")
                    ? selectedVideo
                    : `https://www.youtube.com/embed/${selectedVideo}?rel=0`
                }
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            ) : (
              <div className="videoPlaceholder">
                <div className="placeholderIcon">▶</div>
                <p>Loading video…</p>
              </div>
            )}
          </div>
        </section>

        {/* ── Netflix row ── */}
        <section className="rowSection">
          <div className="rowHeader">
            <span className="rowDot" />
            <h2 className="rowTitle">Continue Learning</h2>
          </div>
          <div className="scroll">
            {videos.map((v: any, i: number) => (
              <div
                key={i}
                className={`card ${selectedVideo === v.id.videoId ? "active" : ""}`}
                onClick={() => setSelectedVideo(v.id.videoId)}
              >
                <div className="cardThumb">
                  <img src={v.snippet.thumbnails.medium.url} alt={v.snippet.title} />
                  <div className="cardOverlay"><span className="playIcon">▶</span></div>
                </div>
                <p className="cardTitle">{v.snippet.title.slice(0, 52)}{v.snippet.title.length > 52 ? "…" : ""}</p>
              </div>
            ))}
            {videos.length === 0 && [1, 2, 3, 4, 5].map(i => (
              <div key={i} className="card skeleton">
                <div className="cardThumb skeletonBox" />
                <div className="skeletonLine" />
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── AI Toggle ── */}
      <button className={`aiToggle ${showAI ? "open" : ""}`} onClick={() => setShowAI(!showAI)}>
        <span className="aiToggleIcon">{showAI ? "✕" : "🤖"}</span>
        <span className="aiToggleLabel">{showAI ? "Close" : "AI Tutor"}</span>
        {!showAI && <span className="aiPulse" />}
      </button>

      {/* ── AI Panel ── */}
      {showAI && (
        <aside className="aiPanel">
          <div className="aiPanelShimmer" />

          <div className="aiPanelHeader">
            <div className="aiPanelTitle">
              <span className="aiOnlineDot" />
              <span className="aiPanelName">AI Tutor</span>
              <span className="aiPanelSub">• {topic}</span>
            </div>
            <button className="aiClose" onClick={() => setShowAI(false)}>✕</button>
          </div>

          <div className="aiPanelDivider" />

          <div className="chat" ref={chatRef}>
            {messages.length === 0 && (
              <div className="chatEmpty">
                <div className="chatEmptyIcon">💬</div>
                <p>Ask me anything about <strong>{topic}</strong></p>
              </div>
            )}
            {messages.map((m: any, i: number) => (
              <div key={i} className={`msg msg-${m.role}`}>
                {m.role === "assistant" && <span className="msgAvatar">AI</span>}
                <div className="msgBubble">{m.content}</div>
              </div>
            ))}
            {aiTyping && (
              <div className="msg msg-assistant">
                <span className="msgAvatar">AI</span>
                <div className="msgBubble typing"><span /><span /><span /></div>
              </div>
            )}
          </div>

          <div className="aiInputRow">
            <input
              className="aiInput"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder={`Ask about ${topic}…`}
            />
            <button className="aiSend" onClick={sendMessage} disabled={!input.trim()}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </aside>
      )}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600;900&family=Rajdhani:wght@300;500;700&family=Share+Tech+Mono&display=swap');

        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes slideIn {
          from { opacity:0; transform:translateX(30px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes pulse {
          0%,100% { transform:scale(1);    opacity:0.7; }
          50%      { transform:scale(1.15); opacity:1; }
        }
        @keyframes typing {
          0%,60%,100% { transform:translateY(0); }
          30%          { transform:translateY(-6px); }
        }
        @keyframes glow {
          0%,100% { opacity:0.3; }
          50%     { opacity:0.7; }
        }
        @keyframes skeletonPulse {
          0%,100% { opacity:0.4; }
          50%     { opacity:0.7; }
        }
        @keyframes ripple {
          0%   { transform:scale(1);   opacity:0.8; }
          100% { transform:scale(2.5); opacity:0; }
        }
        @keyframes cornerShine {
          0%,100% { opacity:0.5; }
          50%     { opacity:1; }
        }

        * { box-sizing:border-box; }

        .page {
          font-family: sans-serif;
          background: radial-gradient(ellipse at 20% 0%, #0f0428 0%, #03000f 20%, #000813 100%);
          color: white;
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        /* TOPBAR */
        .topbar {
          position: sticky; top: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 2rem; height: 56px;
          background: rgba(3,0,12,0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(147,51,234,0.2);
          animation: fadeUp 0.5s ease;
        }
        .topbarLeft { display:flex; align-items:center; gap:1.2rem; }
        .logoMark {
          font-family: 'Orbitron', monospace;
          font-size:1rem; font-weight:900;
          background: linear-gradient(135deg,#e879f9,#a855f7);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          letter-spacing:0.08em;
        }
        .breadcrumb { display:flex; align-items:center; gap:0.5rem; font-size:0.8rem; }
        .breadSubject {
          font-family:'Share Tech Mono',monospace;
          color:#a855f7; font-size:0.7rem; letter-spacing:0.15em;
        }
        .breadSep { color:rgba(255,255,255,0.25); }
        .breadLesson { color:rgba(255,255,255,0.75); text-transform:capitalize; font-weight:500; }
        .levelBadge {
          font-family:'Share Tech Mono',monospace;
          font-size:0.6rem; letter-spacing:0.2em;
          padding:4px 10px; border-radius:20px;
          border:1px solid rgba(168,85,247,0.4);
          color:#c4b5fd; background:rgba(147,51,234,0.1);
        }

        /* LAYOUT */
        .layout {
          position:relative; z-index:2;
          max-width:1200px; margin:0 auto;
          padding:2rem 2rem 6rem;
          transition:padding-right 0.3s ease;
        }
        .layout.withPanel { padding-right:390px; }

        /* HERO */
        .hero {
          position:relative; margin-bottom:2.5rem;
          animation:fadeUp 0.7s ease 0.1s both;
        }
        .heroGlow {
          position:absolute; width:600px; height:300px;
          border-radius:50%; top:-60px; left:50%; transform:translateX(-50%);
          background:radial-gradient(ellipse,rgba(147,51,234,0.15),transparent 70%);
          filter:blur(60px); pointer-events:none;
          animation:glow 5s ease-in-out infinite;
        }
        .heroMeta { margin-bottom:1.2rem; }
        .heroTitle {
          font-family:'Orbitron',monospace;
          font-size:clamp(1.6rem,3vw,2.8rem);
          font-weight:900; text-transform:capitalize;
          background:linear-gradient(135deg,#fff 30%,#c4b5fd 70%,#e879f9 100%);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          margin:0 0 0.3rem;
        }
        .heroSub {
          font-family:'Share Tech Mono',monospace;
          font-size:0.72rem; letter-spacing:0.18em;
          color:rgba(168,85,247,0.75); text-transform:uppercase;
        }

        /* VIDEO FRAME */
        .videoFrame {
          position:relative; width:100%;
          padding-top:56.25%;
          border-radius:20px; overflow:hidden;
          border:1px solid rgba(147,51,234,0.3);
          box-shadow:
            0 0 60px rgba(147,51,234,0.25),
            0 0 120px rgba(147,51,234,0.1),
            0 30px 80px rgba(0,0,0,0.7);
        }
        .videoFrame iframe,
        .videoPlaceholder {
          position:absolute; inset:0;
          width:100%; height:100%;
          border:none; border-radius:20px;
        }
        .videoPlaceholder {
          display:flex; flex-direction:column;
          align-items:center; justify-content:center;
          background:rgba(0,0,0,0.5); gap:1rem;
          color:rgba(255,255,255,0.4);
        }
        .placeholderIcon {
          font-size:3rem; opacity:0.4;
          animation:pulse 2s ease-in-out infinite;
        }
        .videoCorner {
          position:absolute; width:20px; height:20px; z-index:3;
          animation:cornerShine 3s ease-in-out infinite;
        }
        .videoCorner.tl { top:-1px;left:-1px;border-top:2px solid #a855f7;border-left:2px solid #a855f7;border-radius:20px 0 0 0; }
        .videoCorner.tr { top:-1px;right:-1px;border-top:2px solid #e879f9;border-right:2px solid #e879f9;border-radius:0 20px 0 0;animation-delay:0.75s; }
        .videoCorner.bl { bottom:-1px;left:-1px;border-bottom:2px solid #e879f9;border-left:2px solid #e879f9;border-radius:0 0 0 20px;animation-delay:1.5s; }
        .videoCorner.br { bottom:-1px;right:-1px;border-bottom:2px solid #a855f7;border-right:2px solid #a855f7;border-radius:0 0 20px 0;animation-delay:2.25s; }

        /* ROW */
        .rowSection { animation:fadeUp 0.7s ease 0.25s both; }
        .rowHeader { display:flex;align-items:center;gap:0.7rem;margin-bottom:1rem; }
        .rowDot {
          width:8px;height:8px;border-radius:50%;
          background:#a855f7;box-shadow:0 0 8px #a855f7;
          animation:pulse 2s ease-in-out infinite;
        }
        .rowTitle {
          font-family:'Orbitron',monospace;
          font-size:0.95rem;font-weight:600;
          letter-spacing:0.1em;color:rgba(255,255,255,0.85);margin:0;
        }
        .scroll {
          display:flex;gap:14px;overflow-x:auto;padding-bottom:10px;
          scrollbar-width:thin;scrollbar-color:rgba(147,51,234,0.4) transparent;
        }
        .scroll::-webkit-scrollbar { height:4px; }
        .scroll::-webkit-scrollbar-thumb { background:rgba(147,51,234,0.4);border-radius:4px; }

        .card {
          min-width:200px;max-width:200px;cursor:pointer;
          transition:transform 0.25s ease,box-shadow 0.25s ease;
          border-radius:14px;border:1px solid rgba(255,255,255,0.06);
        }
        .card:hover { transform:translateY(-6px) scale(1.03); }
        .card.active { border-color:rgba(168,85,247,0.7);box-shadow:0 0 20px rgba(168,85,247,0.35); }

        .cardThumb {
          position:relative;border-radius:14px 14px 0 0;overflow:hidden;aspect-ratio:16/9;
        }
        .cardThumb img { width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.3s ease; }
        .card:hover .cardThumb img { transform:scale(1.08); }
        .cardOverlay {
          position:absolute;inset:0;background:rgba(0,0,0,0);
          display:flex;align-items:center;justify-content:center;
          transition:background 0.25s;
        }
        .card:hover .cardOverlay { background:rgba(147,51,234,0.35); }
        .playIcon {
          color:white;font-size:1.6rem;
          opacity:0;transform:scale(0.6);
          transition:opacity 0.25s,transform 0.25s;
          text-shadow:0 0 20px rgba(255,255,255,0.8);
        }
        .card:hover .playIcon { opacity:1;transform:scale(1); }
        .cardTitle { font-size:0.72rem;color:rgba(255,255,255,0.7);padding:8px 10px;margin:0;line-height:1.4; }
        .card.active .cardTitle { color:#c4b5fd; }

        .skeleton { pointer-events:none;animation:skeletonPulse 1.5s ease-in-out infinite; }
        .skeletonBox { background:rgba(255,255,255,0.07);aspect-ratio:16/9;border-radius:14px 14px 0 0; }
        .skeletonLine { height:12px;margin:10px;border-radius:6px;background:rgba(255,255,255,0.07); }

        /* AI TOGGLE */
        .aiToggle {
          position:fixed;right:24px;bottom:28px;z-index:100;
          display:flex;align-items:center;gap:8px;
          padding:12px 18px;border-radius:50px;border:none;
          background:linear-gradient(135deg,#9333ea,#c026d3);
          color:white;cursor:pointer;
          font-family:'Rajdhani',sans-serif;
          font-size:0.9rem;font-weight:700;letter-spacing:0.05em;
          box-shadow:0 8px 30px rgba(147,51,234,0.6),0 0 60px rgba(147,51,234,0.2);
          transition:transform 0.2s,box-shadow 0.2s;
        }
        .aiToggle:hover {
          transform:translateY(-3px);
          box-shadow:0 14px 40px rgba(147,51,234,0.8),0 0 80px rgba(147,51,234,0.3);
        }
        .aiToggle.open { background:rgba(30,10,60,0.95);border:1px solid rgba(147,51,234,0.4); }
        .aiToggleIcon { font-size:1.1rem; }
        .aiPulse {
          position:absolute;inset:-4px;border-radius:50px;
          border:2px solid rgba(168,85,247,0.6);
          animation:ripple 2s ease-out infinite;
          pointer-events:none;
        }

        /* AI PANEL */
        .aiPanel {
          position:fixed;right:0;top:56px;bottom:0;
          width:360px;z-index:40;
          background:rgba(5,1,18,0.92);
          backdrop-filter:blur(40px);
          border-left:1px solid rgba(147,51,234,0.25);
          display:flex;flex-direction:column;
          animation:slideIn 0.3s ease;
          box-shadow:-10px 0 60px rgba(147,51,234,0.1);
        }
        .aiPanelShimmer {
          position:absolute;left:0;top:0;bottom:0;width:1px;
          background:linear-gradient(180deg,transparent,rgba(168,85,247,0.8),rgba(232,121,249,0.6),rgba(168,85,247,0.8),transparent);
          background-size:auto 200%;
          animation:shimmer 3s linear infinite;
        }
        .aiPanelHeader {
          display:flex;align-items:center;justify-content:space-between;
          padding:1.2rem 1.4rem 0.8rem;flex-shrink:0;
        }
        .aiPanelTitle { display:flex;align-items:center;gap:8px; }
        .aiOnlineDot {
          width:7px;height:7px;border-radius:50%;
          background:#4ade80;box-shadow:0 0 6px #4ade80;
          animation:pulse 2s ease-in-out infinite;
        }
        .aiPanelName { font-family:'Orbitron',monospace;font-size:0.95rem;font-weight:600;color:white; }
        .aiPanelSub { font-family:'Share Tech Mono',monospace;font-size:0.62rem;color:rgba(168,85,247,0.7);text-transform:capitalize; }
        .aiClose {
          background:none;border:none;color:rgba(255,255,255,0.4);
          cursor:pointer;font-size:1rem;padding:4px 8px;
          border-radius:6px;transition:color 0.2s,background 0.2s;
        }
        .aiClose:hover { color:white;background:rgba(255,255,255,0.08); }
        .aiPanelDivider {
          height:1px;margin:0 1.4rem;
          background:linear-gradient(90deg,transparent,rgba(147,51,234,0.4),transparent);
          flex-shrink:0;
        }

        /* CHAT */
        .chat {
          flex:1;overflow-y:auto;padding:1rem 1.2rem;
          display:flex;flex-direction:column;gap:0.8rem;
          scrollbar-width:thin;scrollbar-color:rgba(147,51,234,0.3) transparent;
        }
        .chat::-webkit-scrollbar { width:3px; }
        .chat::-webkit-scrollbar-thumb { background:rgba(147,51,234,0.4);border-radius:3px; }

        .chatEmpty {
          flex:1;display:flex;flex-direction:column;
          align-items:center;justify-content:center;
          gap:0.8rem;text-align:center;
          color:rgba(255,255,255,0.35);font-size:0.85rem;
        }
        .chatEmptyIcon { font-size:2.5rem;opacity:0.4; }
        .chatEmpty strong { color:rgba(168,85,247,0.8);font-weight:500; }

        .msg { display:flex;align-items:flex-start;gap:8px; }
        .msg-user { flex-direction:row-reverse; }

        .msgAvatar {
          flex-shrink:0;width:28px;height:28px;border-radius:50%;
          background:linear-gradient(135deg,#9333ea,#c026d3);
          display:flex;align-items:center;justify-content:center;
          font-family:'Orbitron',monospace;
          font-size:0.5rem;font-weight:700;color:white;
        }
        .msgBubble {
          max-width:80%;padding:0.65rem 0.9rem;
          border-radius:16px;font-size:0.88rem;line-height:1.55;
        }
        .msg-user .msgBubble {
          background:linear-gradient(135deg,rgba(147,51,234,0.4),rgba(192,38,211,0.3));
          border:1px solid rgba(168,85,247,0.3);
          border-radius:16px 4px 16px 16px;
          color:rgba(255,255,255,0.9);
        }
        .msg-assistant .msgBubble {
          background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:4px 16px 16px 16px;
          color:rgba(255,255,255,0.85);
        }
        .typing { display:flex;gap:4px;padding:12px 14px;align-items:center; }
        .typing span {
          width:6px;height:6px;border-radius:50%;
          background:#a855f7;
          animation:typing 1.2s ease-in-out infinite;
        }
        .typing span:nth-child(2) { animation-delay:0.2s; }
        .typing span:nth-child(3) { animation-delay:0.4s; }

        /* AI INPUT */
        .aiInputRow {
          display:flex;gap:8px;
          padding:0.9rem 1.2rem;
          border-top:1px solid rgba(147,51,234,0.15);
          flex-shrink:0;
        }
        .aiInput {
          flex:1;padding:0.75rem 1rem;
          background:rgba(255,255,255,0.05);
          border:1px solid rgba(147,51,234,0.25);
          border-radius:14px;color:white;
          font-family:'Rajdhani',sans-serif;
          font-size:0.9rem;outline:none;
          transition:border-color 0.2s,box-shadow 0.2s;
        }
        .aiInput::placeholder { color:rgba(255,255,255,0.3); }
        .aiInput:focus {
          border-color:rgba(168,85,247,0.6);
          box-shadow:0 0 0 3px rgba(147,51,234,0.12);
        }
        .aiSend {
          width:44px;height:44px;border-radius:12px;border:none;
          background:linear-gradient(135deg,#9333ea,#c026d3);
          color:white;cursor:pointer;
          display:flex;align-items:center;justify-content:center;
          flex-shrink:0;
          transition:transform 0.2s,box-shadow 0.2s;
          box-shadow:0 4px 15px rgba(147,51,234,0.4);
        }
        .aiSend:hover:not(:disabled) { transform:scale(1.08);box-shadow:0 8px 25px rgba(147,51,234,0.6); }
        .aiSend:disabled { opacity:0.4;cursor:not-allowed; }

        @media (max-width:900px) {
          .layout.withPanel { padding-right:2rem; }
          .aiPanel { width:100%;top:auto;bottom:0;height:70vh;border-radius:24px 24px 0 0; }
        }
        @media (max-width:600px) {
          .layout { padding:1.2rem; }
          .heroTitle { font-size:1.6rem; }
        }
      `}</style>
    </div>
  )
}