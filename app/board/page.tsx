"use client"

import { useRouter } from "next/navigation"
import VantaBackground from "@/app/components/VantaBackground"
import AuroraGlow from "@/app/components/AuroraGlow"

export default function BoardPage() {

  const router = useRouter()

  const boards = [
    {
      name: "CBSE",
      path: "/board/cbse",
      icon: "📘",
      desc: "Central Board of Secondary Education"
    },
    {
      name: "State Board",
      path: "/board/state",
      icon: "🏫",
      desc: "Your State Curriculum"
    },
    {
      name: "ICSE",
      path: "/board/icse",
      icon: "📗",
      desc: "Indian Certificate of Secondary Education"
    }
  ]

  return (
    <div className="page">

      <VantaBackground />
      <AuroraGlow />

      <div className="content">

        {/* HEADER */}
        <div className="header">
          <h1>Select Your Board</h1>
          <p>Choose your curriculum to continue learning</p>
        </div>

        {/* GRID */}
        <div className="grid">
          {boards.map((board, i) => (
            <div
              key={i}
              className="card"
              onClick={() => router.push(board.path)}
            >
              <div className="icon">{board.icon}</div>
              <h2>{board.name}</h2>
              <p>{board.desc}</p>
            </div>
          ))}
        </div>

      </div>

      {/* STYLES */}
      <style jsx>{`

        .page{
          min-height:100vh;
          padding:60px 30px;
          background:#020617;
          color:white;
          position:relative;
          overflow:hidden;
        }

        .content{
          position:relative;
          z-index:2;
          max-width:1100px;
          margin:auto;
        }

        .header{
          text-align:center;
          margin-bottom:50px;
        }

        .header h1{
          font-size:42px;
          font-weight:700;
        }

        .header p{
          color:#94a3b8;
          margin-top:10px;
        }

        .grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
          gap:30px;
        }

        .card{
          padding:40px 30px;
          border-radius:28px;
          background:rgba(255,255,255,.06);
          border:1px solid rgba(255,255,255,.18);
          backdrop-filter:blur(30px);
          text-align:center;
          cursor:pointer;
          transition:.35s;
          position:relative;
          overflow:hidden;
        }

        /* Glow effect */
        .card::before{
          content:"";
          position:absolute;
          inset:0;
          background:radial-gradient(circle at 50% 0%, rgba(147,51,234,.4), transparent 70%);
          opacity:0;
          transition:.4s;
        }

        .card:hover::before{
          opacity:1;
        }

        .card:hover{
          transform:translateY(-10px) scale(1.04);
          box-shadow:0 0 60px rgba(147,51,234,.45);
        }

        .icon{
          font-size:48px;
          margin-bottom:15px;
        }

        .card h2{
          font-size:22px;
          margin-bottom:8px;
        }

        .card p{
          font-size:14px;
          color:#cbd5f5;
        }

      `}</style>

    </div>
  )
}