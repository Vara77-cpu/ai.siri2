"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {

  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {

    if (status === "loading") return

    if (session) {
      router.push("/dashboard")
    }

  }, [session, status, router])

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#020617,#0f172a,#1e1b4b)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "60px 20px"
      }}
    >

      {/* HERO SECTION */}

      <h1 style={{ fontSize: "64px", fontWeight: "bold" }}>
        AI.Siri
      </h1>

      <p
        style={{
          marginTop: "10px",
          color: "#94a3b8",
          fontSize: "18px"
        }}
      >
        AI Powered Smart Learning Platform
      </p>

      <div style={{ display: "flex", gap: "20px", marginTop: "40px" }}>

        <button
          onClick={() => router.push("/login")}
          style={{
            padding: "15px 40px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(90deg,#9333ea,#c026d3)",
            color: "white",
            fontSize: "18px",
            cursor: "pointer"
          }}
        >
          Start Learning
        </button>

        <button
          onClick={() => router.push("/learn")}
          style={{
            padding: "15px 40px",
            borderRadius: "12px",
            border: "1px solid #444",
            background: "transparent",
            color: "white",
            fontSize: "18px",
            cursor: "pointer"
          }}
        >
          Explore Classes
        </button>

      </div>


      {/* FEATURES */}

      <div
        style={{
          marginTop: "100px",
          maxWidth: "1100px",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "25px"
        }}
      >

        <Feature
          title="🤖 AI Tutor"
          desc="Ask questions and get instant explanations for any lesson."
        />

        <Feature
          title="📚 Structured Lessons"
          desc="Learn step-by-step with class-wise curriculum."
        />

        <Feature
          title="🧠 Smart Quizzes"
          desc="Test your knowledge with interactive quizzes."
        />

        <Feature
          title="📈 Progress Tracking"
          desc="Track your learning progress and performance."
        />

      </div>


      {/* FOOTER */}

      <div
        style={{
          marginTop: "120px",
          color: "#64748b",
          fontSize: "14px"
        }}
      >
        © {new Date().getFullYear()} AI.Siri Learning Platform
      </div>

    </div>

  )
}


function Feature({ title, desc }: { title: string; desc: string }) {

  return (

    <div
      style={{
        background: "#0f172a",
        border: "1px solid #1e293b",
        padding: "30px",
        borderRadius: "14px"
      }}
    >

      <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>
        {title}
      </h3>

      <p style={{ color: "#94a3b8" }}>
        {desc}
      </p>

    </div>

  )
}