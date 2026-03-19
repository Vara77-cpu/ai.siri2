"use client"

import { useRouter } from "next/navigation"
import { syllabus } from "@/app/data/syllabus"

export default function NurseryPage(){

const router = useRouter()
const data = syllabus.nursery

function openLesson(subjectKey:string, unitName:string, lesson:string){

const unitSlug = unitName.toLowerCase().replace(/\s+/g,"-")
const lessonSlug = lesson.toLowerCase().replace(/\s+/g,"-")

router.push(`/learn?subject=${subjectKey}&unit=${unitSlug}&lesson=${lessonSlug}`)

}

return(

<div style={{padding:40,background:"#020617",color:"white",minHeight:"100vh"}}>

<h1>Nursery Syllabus</h1>

{Object.entries(data.subjects).map(([subjectKey, subject]:any)=>(
  
  <div key={subjectKey} style={{marginTop:20}}>

    <h2>{subject.name}</h2>

    {subject.units.map((unit:any)=>(
      
      <div key={unit.name}>

        <p style={{color:"#94a3b8"}}>{unit.name}</p>

        {unit.lessons.map((lesson:string,i:number)=>(
          
          <p
            key={i}
            onClick={()=>openLesson(subjectKey, unit.name, lesson)}
            style={{cursor:"pointer",color:"#3b82f6"}}
          >
            {lesson}
          </p>

        ))}

      </div>

    ))}

  </div>

))}

</div>

)

}