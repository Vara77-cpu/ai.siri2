"use client"

import { useParams, useRouter } from "next/navigation"
import { syllabus } from "@/app/data/syllabus"
import VantaBackground from "@/app/components/VantaBackground"
import AuroraGlow from "@/app/components/AuroraGlow"

export default function SubjectUnitsPage() {

  const params = useParams()
  const router = useRouter()

  const board = params.board as string
  const classId = params.class as string
  const subjectKey = params.subject as string

  /* GET DATA */

  const data = syllabus[classId as keyof typeof syllabus]

  if (!data) {
    return <p style={{ color: "white", padding: 40 }}>No data</p>
  }

  const subject = data.subjects[subjectKey as keyof typeof data.subjects]

  if (!subject) {
    return <p style={{ color: "white", padding: 40 }}>Subject not found</p>
  }

  const units = subject.units

  return (
    <div className="page">

      <VantaBackground />
      <AuroraGlow />

      <div className="content">

        {/* HEADER */}
        <div className="header">
          <h1>{subject.name}</h1>
          <p>Select a unit to start learning</p>
        </div>

        {/* UNITS GRID */}
        <div className="grid">
          {units.map((unit: any, i: number) => {

            const slug = unit.name.toLowerCase().replace(/\s+/g, "-")

            return (
              <div
                key={i}
                className="card"
                onClick={() =>
                  router.push(
                    `/board/${board}/class/${classId}/${subjectKey}/${slug}`
                  )
                }
              >
                <div className="unitNumber">Unit {i + 1}</div>
                <div className="unitName">{unit.name}</div>
              </div>
            )
          })}
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
          font-size:40px;
          font-weight:700;
        }

        .header p{
          margin-top:10px;
          color:#94a3b8;
        }

        .grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
          gap:30px;
        }

        .card{
          padding:28px;
          border-radius:24px;
          background:rgba(255,255,255,.06);
          border:1px solid rgba(255,255,255,.18);
          backdrop-filter:blur(30px);
          cursor:pointer;
          transition:.35s;
          position:relative;
          overflow:hidden;
          text-align:center;
        }

        /* Glow effect */
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

        .unitNumber{
          font-size:13px;
          color:#a78bfa;
          margin-bottom:10px;
        }

        .unitName{
          font-size:18px;
          font-weight:600;
          color:#e2e8f0;
        }

      `}</style>

    </div>
  )
}