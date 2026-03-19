"use client"

import { useParams, useRouter } from "next/navigation"
import { syllabus } from "@/app/data/syllabus"

export default function SubjectUnitsPage(){

const params = useParams()
const router = useRouter()

const board = params.board as string
const classId = params.class as string
const subjectKey = params.subject as string

/* GET DATA */

const data = syllabus[classId as keyof typeof syllabus]

if(!data){
return <p style={{color:"white",padding:40}}>No data</p>
}

const subject = data.subjects[subjectKey as keyof typeof data.subjects]

if(!subject){
return <p style={{color:"white",padding:40}}>Subject not found</p>
}

/* UNITS */

const units = subject.units

return(

<div className="page">

<h1>{subject.name}</h1>

<div className="grid">

{units.map((unit:any,i:number)=>{

const slug = unit.name.toLowerCase().replace(/\s+/g,"-")

return(

<div
key={i}
className="card"
onClick={()=>router.push(
`/board/${board}/class/${classId}/${subjectKey}/${slug}`
)}
>

{unit.name}

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
font-size:28px;
margin-bottom:25px;
}

.grid{
display:grid;
grid-template-columns:repeat(auto-fill,minmax(220px,1fr));
gap:20px;
}

.card{
padding:18px;
border-radius:16px;
background:rgba(255,255,255,0.05);
border:1px solid rgba(255,255,255,0.1);
cursor:pointer;
transition:.3s;
text-align:center;
}

.card:hover{
transform:scale(1.05);
background:rgba(255,255,255,0.08);
}

`}</style>

</div>

)

}