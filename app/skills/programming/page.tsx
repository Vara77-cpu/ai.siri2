"use client"

import { useRouter } from "next/navigation"
import VantaBackground from "@/app/components/VantaBackground"
import AuroraGlow from "@/app/components/AuroraGlow"

export default function ProgrammingSkills(){

const router = useRouter()

const languages = [
{title:"Python",icon:"🐍",route:"/skills/programming/python"},
{title:"Java",icon:"☕",route:"/skills/programming/java"},
{title:"C",icon:"🔵",route:"/skills/programming/c"},
{title:"C++",icon:"⚙️",route:"/skills/programming/cpp"},
{title:"JavaScript",icon:"🟨",route:"/skills/programming/javascript"},
{title:"SQL",icon:"🗄️",route:"/skills/programming/sql"}
]

return(

<div className="page">

<VantaBackground/>
<AuroraGlow/>

<div className="content">

<h1 className="title">
Programming Skills
</h1>

<p className="subtitle">
Choose a programming language to start learning
</p>

<div className="grid">

{languages.map((lang,index)=>(

<div
key={index}
className="card"
onClick={()=>router.push(lang.route)}
>

<div className="icon">
{lang.icon}
</div>

<h2>{lang.title}</h2>

<p className="desc">
Learn basics, examples, projects and practice questions
</p>

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
margin-bottom:10px;
}

.desc{
font-size:14px;
color:#94a3b8;
margin-top:10px;
font-weight:400;
}

`}</style>

</div>

)

}
