"use client"

import { useParams, useRouter } from "next/navigation"
import { syllabus } from "@/app/data/syllabus"
import VantaBackground from "@/app/components/VantaBackground"
import AuroraGlow from "@/app/components/AuroraGlow"

export default function SubjectsPage() {

  const params = useParams()
  const router = useRouter()

  const classParam = params?.class
  const classId =
    typeof classParam === "string"
      ? classParam.toLowerCase()
      : Array.isArray(classParam)
      ? classParam[0].toLowerCase()
      : ""

  const data = syllabus[classId as keyof typeof syllabus]

  if (!data) {
    return <p style={{ color: "white", padding: 40 }}>❌ Class not found</p>
  }

  const subjects = data.subjects

  function openLesson(subjectKey: string, unitName: string, lesson: string) {
    const unitSlug = unitName.toLowerCase().replace(/\s+/g, "-")
    const lessonSlug = lesson.toLowerCase().replace(/\s+/g, "-")

    router.push(
      `/learn?subject=${subjectKey}&unit=${unitSlug}&lesson=${lessonSlug}`
    )
  }

  return (
    <div className="page">

      <VantaBackground />
      <AuroraGlow />

      <div className="content">

        {/* HEADER */}
        <div className="header">
          <h1>{classId.toUpperCase()} Syllabus</h1>
          <p>Select subject → unit → lesson</p>
        </div>

        {/* SUBJECT SECTIONS */}
        {Object.keys(subjects).map((key) => {

          const subject = subjects[key as keyof typeof subjects]
          if (!subject) return null

          return (

            <div key={key} className="subjectSection">

              <h2>{("name" in subject ? subject.name : key)}</h2>

              {subject.units?.map((unit: any, i: number) => {

                if (!unit) return null

                return (

                  <div key={i} className="unitRow">

                    <div className="unitTitle">
                      {unit.name}
                    </div>

                    <div className="lessonRow">

                      {unit.lessons?.map((lesson: string, j: number) => (

                        <div
                          key={j}
                          className="lessonCard"
                          onClick={() => openLesson(key, unit.name, lesson)}
                        >
                          <div className="lessonName">{lesson}</div>
                        </div>

                      ))}

                    </div>

                  </div>

                )

              })}

            </div>

          )

        })}

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
          max-width:1200px;
          margin:auto;
        }

        .header{
          text-align:center;
          margin-bottom:50px;
        }

        .header h1{
          font-size:42px;
        }

        .header p{
          margin-top:10px;
          color:#94a3b8;
        }

        /* SUBJECT */

        .subjectSection{
          margin-bottom:40px;
        }

        .subjectSection h2{
          font-size:24px;
          margin-bottom:15px;
          color:#a5b4fc;
        }

        /* UNIT */

        .unitRow{
          margin-bottom:20px;
        }

        .unitTitle{
          font-size:14px;
          color:#94a3b8;
          margin-bottom:10px;
        }

        /* NETFLIX ROW */

        .lessonRow{
          display:flex;
          gap:15px;
          overflow-x:auto;
          padding-bottom:10px;
        }

        .lessonRow::-webkit-scrollbar{
          height:6px;
        }

        .lessonRow::-webkit-scrollbar-thumb{
          background:#6d28d9;
          border-radius:10px;
        }

        /* CARD */

        .lessonCard{
          min-width:180px;
          padding:20px;
          border-radius:18px;
          background:rgba(255,255,255,.06);
          border:1px solid rgba(255,255,255,.18);
          backdrop-filter:blur(25px);
          cursor:pointer;
          transition:.35s;
          position:relative;
          overflow:hidden;
        }

        .lessonCard::before{
          content:"";
          position:absolute;
          inset:0;
          background:radial-gradient(circle at top, rgba(147,51,234,.4), transparent 70%);
          opacity:0;
          transition:.4s;
        }

        .lessonCard:hover::before{
          opacity:1;
        }

        .lessonCard:hover{
          transform:scale(1.08);
          box-shadow:0 0 40px rgba(147,51,234,.45);
        }

        .lessonName{
          font-size:15px;
          font-weight:500;
          color:#e2e8f0;
        }

      `}</style>

    </div>
  )
}