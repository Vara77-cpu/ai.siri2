"use client"

import { useParams, useRouter } from "next/navigation"
import { syllabus } from "@/app/data/syllabus"

export default function SubjectsPage(){

  const params = useParams()
  const router = useRouter()

  const classId = params?.class?.toString().toLowerCase()

  console.log("CLASS PARAM:", classId)

  const data = syllabus[classId as keyof typeof syllabus]

  if(!data){
    return <p style={{color:"white",padding:40}}>❌ Class not found: {classId}</p>
  }

  const subjects = data.subjects

  function openLesson(subjectKey:string, unitName:string, lesson:string){

    const unitSlug = unitName.toLowerCase().replace(/\s+/g,"-")
    const lessonSlug = lesson.toLowerCase().replace(/\s+/g,"-")

    router.push(
      `/learn?subject=${subjectKey}&unit=${unitSlug}&lesson=${lessonSlug}`
    )
  }

  return(

    <div className="page">

      <h1>{classId.toUpperCase()} Syllabus</h1>

      <div className="grid">

        {Object.keys(subjects).map((key)=>{

          const subject = subjects[key as keyof typeof subjects]

          return(

            <div key={key} className="card">

              <h2>{subject.name}</h2>

              {subject.units.map((unit:any,i:number)=>{

                return(

                  <div key={i}>

                    <p className="unit">{unit.name}</p>

                    <ul>

                      {unit.lessons.map((lesson:string,j:number)=>(

                        <li
                          key={j}
                          onClick={()=>openLesson(key, unit.name, lesson)}
                        >
                          {lesson}
                        </li>

                      ))}

                    </ul>

                  </div>

                )

              })}

            </div>

          )

        })}

      </div>

      <style jsx>{`

        .page{
          padding:40px;
          background:#020617;
          color:white;
          min-height:100vh;
        }

        h1{
          font-size:32px;
          margin-bottom:30px;
          text-align:center;
        }

        .grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(300px,1fr));
          gap:25px;
        }

        .card{
          background:rgba(255,255,255,0.05);
          border-radius:20px;
          padding:20px;
          border:1px solid rgba(255,255,255,0.1);
          transition:.3s;
        }

        .card:hover{
          transform:translateY(-5px);
          box-shadow:0 0 20px rgba(99,102,241,0.3);
        }

        h2{
          margin-bottom:15px;
          font-size:20px;
          color:#a5b4fc;
        }

        .unit{
          margin-top:10px;
          color:#94a3b8;
          font-size:14px;
        }

        ul{
          list-style:none;
          padding:0;
        }

        li{
          padding:6px 0;
          cursor:pointer;
          color:#e2e8f0;
          transition:.2s;
        }

        li:hover{
          color:#60a5fa;
          transform:translateX(5px);
        }

      `}</style>

    </div>

  )

}