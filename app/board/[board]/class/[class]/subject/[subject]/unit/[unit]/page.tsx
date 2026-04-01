"use client"

import { useParams, useRouter } from "next/navigation"
import { syllabus } from "@/app/data/syllabus"

export default function UnitPage(){

const params = useParams()
const router = useRouter()

const classId = params.class as string
const subjectKey = params.subject as string
const unitSlug = params.unit as string

const data = syllabus[classId as keyof typeof syllabus]

if(!data) return <p style={{color:"white",padding:40}}>No data</p>

const subject = data.subjects[subjectKey as keyof typeof data.subjects]

if(!subject) return <p style={{color:"white",padding:40}}>Subject not found</p>

const unit = subject.units.find((u:any)=>
u.name.toLowerCase().replace(/\s+/g,"-") === unitSlug
)

if(!unit) return <p style={{color:"white",padding:40}}>Unit not found</p>

return(

<div style={{
padding:40,
background:"#020617",
color:"white",
minHeight:"100vh"
}}>

<h1>{unit.name} Lessons</h1>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",
gap:20,
marginTop:20
}}>

{unit.lessons.map((lesson:string,i:number)=>{

const lessonSlug = lesson.toLowerCase().replace(/\s+/g,"-")

return(

<div
key={i}
onClick={()=>{
const path = `/learn/${subjectKey}/${unitSlug}/${lessonSlug}`
console.log("FINAL PATH:", path)
router.push(path)
}}
style={{
padding:18,
borderRadius:16,
background:"rgba(255,255,255,0.05)",
cursor:"pointer"
}}
>

{lesson}

</div>

)

})}

</div>

</div>

)

}