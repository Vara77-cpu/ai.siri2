"use client"

import { useParams } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import ParticlesBackground from "@/app/components/ParticlesBackground"

export default function AITutor() {

/* PARAMS */

const params = useParams()
const subject = params.subject as string
const unit = params.unit as string
const topic = unit?.replace(/-/g," ")

/* STATE */

const [messages, setMessages] = useState<any[]>([
  {
    role:"ai",
    content:`Let's learn ${topic} 🚀 Ask me anything!`
  }
])

const [question, setQuestion] = useState("")
const [loading, setLoading] = useState(false)
const [generating, setGenerating] = useState(false)
const [activeFile, setActiveFile] = useState<{ name: string; type: string } | null>(null)

const chatRef = useRef<HTMLDivElement>(null)
const typingIntervalRef = useRef<NodeJS.Timeout | null>(null)

/* AUTO SCROLL */

useEffect(() => {
  if (chatRef.current) {
    chatRef.current.scrollTop = chatRef.current.scrollHeight
  }
}, [messages])

/* AUTO QUESTION */

useEffect(()=>{
  if(topic){
    setQuestion(`Explain ${topic} in simple way`)
  }
},[topic])

/* FILE */

const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'doc') => {
  const file = e.target.files?.[0]
  if (file) setActiveFile({ name: file.name, type })
}

/* VOICE */

function startVoiceTyping() {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  if (!SpeechRecognition) return alert("Voice not supported")
  const recognition = new SpeechRecognition()
  recognition.onresult = (e: any) => setQuestion(e.results[0][0].transcript)
  recognition.start()
}

/* AI */

async function askAI() {

  if (!question.trim() && !activeFile) return

  const content = activeFile
    ? `[${activeFile.type.toUpperCase()}] ${question}`
    : question

  const newMessages = [...messages, { role: "user", content }]

  setMessages(newMessages)
  setQuestion("")
  setActiveFile(null)
  setLoading(true)

  try {

    const res = await fetch("/api/tutor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: content,
        subject,
        topic
      })
    })

    const data = await res.json()
    let text = data.answer

    let index = 0

    setMessages([...newMessages, { role: "ai", content: "" }])
    setLoading(false)
    setGenerating(true)

    typingIntervalRef.current = setInterval(() => {

      index++

      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1].content = text.slice(0, index)
        return updated
      })

      if (index >= text.length) {
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
        setGenerating(false)
      }

    }, 15)

  } catch {

    setMessages([...newMessages, { role: "ai", content: "⚠️ Error" }])
    setLoading(false)
    setGenerating(false)

  }

}

/* UI */

return (

<div className={`page ${generating ? 'is-dancing' : ''}`}>

<style jsx global>{`
  body, html {
    margin: 0;
    padding: 0;
    overflow: hidden;
    height: 100vh;
    width: 100vw;
    background: #020617;
    font-family: 'Inter', -apple-system, sans-serif;
  }
`}</style>

{/* BACKGROUND */}

<div className="full-bg-container">
  <div className="global-particles">
    <ParticlesBackground />
  </div>
  <div className="global-aurora"></div>
</div>

{/* MAIN UI */}

<div className="container">

  {/* HEADER */}
  <div className="header">
    <div className="status-dot"></div>
    <span className="title">AI.Siri Tutor — {topic}</span>
  </div>

  {/* CHAT */}
  <div ref={chatRef} className="chat-area">

    {messages.map((msg, i) => (
      <div key={i} className={`msg-row ${msg.role}`}>
        <div className="msg-bubble">
          {msg.content}
          {msg.role === 'ai' && generating && i === messages.length - 1 && (
            <span className="cursor">|</span>
          )}
        </div>
      </div>
    ))}

    {loading && <div className="typing-dot">Thinking...</div>}

  </div>

  {/* FILE */}
  {activeFile && (
    <div className="attachment">📎 {activeFile.name}</div>
  )}

  {/* INPUT */}
  <div className="input-box">

    <button onClick={startVoiceTyping} className="tool">🎤</button>

    <input
      value={question}
      onChange={(e) => setQuestion(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && askAI()}
      placeholder="Ask anything..."
      className="main-input"
    />

    <button onClick={askAI} className="send-btn">↑</button>

  </div>

</div>

{/* STYLES */}

<style jsx>{`

.page {
  height:100vh;
  width:100vw;
  display:flex;
  align-items:center;
  justify-content:center;
  position:relative;
  z-index:1;
}

/* BACKGROUND */

.full-bg-container {
  position:absolute;
  inset:0;
  z-index:-1;
}

.global-particles {
  position:absolute;
  inset:0;
}

/* CONTAINER FIX */

.container {
  width:850px;
  height:75%;
  background:rgba(10,15,30,0.6);
  backdrop-filter:blur(40px);
  border-radius:40px;
  display:flex;
  flex-direction:column;
  position:relative;
  z-index:50;
  box-shadow:0 50px 100px rgba(0,0,0,0.8);
}

/* HEADER */

.header {
  padding:20px;
  display:flex;
  align-items:center;
  gap:10px;
  color:white;
}

.status-dot {
  width:10px;
  height:10px;
  background:#22c55e;
  border-radius:50%;
}

.title {
  font-weight:600;
}

/* CHAT */

.chat-area {
  flex:1;
  overflow-y:auto;
  padding:20px;
  display:flex;
  flex-direction:column;
  gap:15px;
}

.msg-row.user {
  align-self:flex-end;
}

.msg-bubble {
  padding:12px 18px;
  border-radius:14px;
  max-width:70%;
}

.user .msg-bubble {
  background:#4f46e5;
}

.ai .msg-bubble {
  background:#1e293b;
}

/* INPUT */

.input-box {
  display:flex;
  gap:10px;
  padding:15px;
}

.main-input {
  flex:1;
  background:transparent;
  border:none;
  color:white;
  outline:none;
}

.send-btn {
  background:#4f46e5;
  color:white;
  border:none;
  padding:10px;
  border-radius:10px;
  cursor:pointer;
}

.tool {
  background:none;
  border:none;
  color:white;
  cursor:pointer;
}

`}</style>

</div>

)

}