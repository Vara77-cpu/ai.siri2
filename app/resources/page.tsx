"use client"

import { useRouter } from "next/navigation"
import VantaBackground from "@/app/components/VantaBackground"
import AuroraGlow from "@/app/components/AuroraGlow"

export default function ResourcesPage(){

const router = useRouter()

const resources = [

{title:"Notes",icon:"📝",route:"/resources/notes"},
{title:"Previous Papers",icon:"📄",route:"/resources/papers"},
{title:"Mock Tests",icon:"🧠",route:"/resources/mock-tests"},
{title:"Interview Questions",icon:"💼",route:"/resources/interview"},
{title:"Study Roadmaps",icon:"🗺️",route:"/resources/roadmaps"},
{title:"PDF Library",icon:"📚",route:"/resources/library"}

]

return(

<div className="page">

<VantaBackground/>
<AuroraGlow/>

<div className="content">

<h1 className="title">Learning Resources</h1>

<p className="subtitle">
Access study materials and exam resources
</p>

<div className="grid">

{resources.map((res,index)=>(

<div
key={index}
className="card"
onClick={()=>router.push(res.route)}
>

<div className="icon">{res.icon}</div>

<h2>{res.title}</h2>

</div>

))}

</div>

</div>

<style jsx>{`

.page{
min-height:100vh;
background:#020617;
padding:80px;
color:white;
position:relative;
}

.content{
position:relative;
z-index:2;
text-align:center;
}

.title{
font-size:42px;
margin-bottom:10px;
}

.subtitle{
color:#94a3b8;
margin-bottom:50px;
}

.grid{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
gap:30px;
}

.card{
background:rgba(255,255,255,.06);
border:1px solid rgba(255,255,255,.18);
backdrop-filter:blur(30px);
border-radius:22px;
padding:40px;
font-size:20px;
font-weight:600;
cursor:pointer;
transition:.35s;
}

.card:hover{
transform:translateY(-10px) scale(1.03);
box-shadow:0 0 35px rgba(124,58,237,.6);
}

.icon{
font-size:36px;
margin-bottom:12px;
}

`}</style>

</div>

)

}
