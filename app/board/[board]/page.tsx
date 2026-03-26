"use client"

import { useParams, useRouter } from "next/navigation"
import VantaBackground from "@/app/components/VantaBackground"
import AuroraGlow from "@/app/components/AuroraGlow"

export default function ClassPage() {

  const params = useParams()
  const router = useRouter()

  const board = params.board as string

  const classes = [
    "nursery",
    "class1",
    "class2",
    "class3",
    "class4",
    "class5",
    "class6",
    "class7"
  ]

  return (
    <div className="page">

      <VantaBackground />
      <AuroraGlow />

      <div className="content">

        {/* HEADER */}
        <div className="header">
          <h1>Select Class ({board?.toUpperCase()})</h1>
          <p>Choose your class to continue</p>
        </div>

        {/* GRID */}
        <div className="grid">

          {classes.map((cls, i) => (

            <div
              key={i}
              className="card"
              onClick={() => router.push(`/board/${board}/class/${cls}`)}
            >
              <div className="icon">🎓</div>
              <div className="title">{cls.toUpperCase()}</div>
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
          grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
          gap:25px;
        }

        .card{
          padding:30px 20px;
          border-radius:24px;
          background:rgba(255,255,255,.06);
          border:1px solid rgba(255,255,255,.18);
          backdrop-filter:blur(30px);
          text-align:center;
          cursor:pointer;
          transition:.35s;
          position:relative;
          overflow:hidden;
        }

        /* glow */
        .card::before{
          content:"";
          position:absolute;
          inset:0;
          background:radial-gradient(circle at top, rgba(147,51,234,.4), transparent 70%);
          opacity:0;
          transition:.4s;
        }

        .card:hover::before{
          opacity:1;
        }

        .card:hover{
          transform:translateY(-10px) scale(1.05);
          box-shadow:0 0 60px rgba(147,51,234,.45);
        }

        .icon{
          font-size:36px;
          margin-bottom:10px;
        }

        .title{
          font-size:18px;
          font-weight:600;
        }

      `}</style>

    </div>
  )
}