"use client"

import { useRouter } from "next/navigation"
import VantaBackground from "@/app/components/VantaBackground"
import AuroraGlow from "@/app/components/AuroraGlow"

export default function SkillsPage(){

const router = useRouter()

const skills = [
{title:"Web Development",icon:"🌐",route:"/skills/web"},
{title:"Data Science",icon:"📊",route:"/skills/data-science"},
{title:"Artificial Intelligence",icon:"🤖",route:"/skills/ai"},
{title:"Cloud Computing",icon:"☁️",route:"/skills/cloud"},
{title:"Cyber Security",icon:"🛡️",route:"/skills/cyber"},
{title:"Programming",icon:"💻",route:"/skills/programming"}
]

return(

<div className="page">

<VantaBackground/>
<AuroraGlow/>

<div className="content">

<h1 className="title">Skill Development</h1>

<p className="subtitle">
Upgrade your career with modern tech skills
</p>

<div className="grid">

{skills.map((skill,index)=>(

<div
key={index}
className={`card ${skill.title==="Programming" ? "highlight":""}`}
onClick={()=>router.push(skill.route)}
>

<div className="icon">{skill.icon}</div>

<h2>{skill.title}</h2>

<p className="desc">
Learn concepts, projects and real-world applications
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
position:relative;
}

.card:hover{
transform:translateY(-10px) scale(1.03);
box-shadow:0 0 35px rgba(124,58,237,.5);
}

.highlight{
border:1px solid rgba(124,58,237,.6);
box-shadow:0 0 25px rgba(124,58,237,.4);
}

.icon{
font-size:34px;
margin-bottom:12px;
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
