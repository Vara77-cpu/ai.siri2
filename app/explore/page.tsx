"use client"

import { useRouter } from "next/navigation"
import VantaBackground from "@/app/components/VantaBackground"
import AuroraGlow from "@/app/components/AuroraGlow"

export default function ExplorePage(){

const router = useRouter()

const levels = [
{title:"Nursery",route:"/learn/nursery"},
{title:"School (Class 1-10)",route:"/learn/class-1"},
{title:"Intermediate",route:"/intermediate"},
{title:"Degree",route:"/degree"},
{title:"Post Graduation",route:"/pg"}
]

return(

<div className="page">

<VantaBackground/>
<AuroraGlow/>

<div className="content">

<h1 className="title">
Explore Learning
</h1>

<p className="subtitle">
Choose your education level and start learning
</p>

<div className="grid">

{levels.map((level,index)=>(

<div
key={index}
className="card"
onClick={()=>router.push(level.route)}
>

<h2>{level.title}</h2>

<p>Start learning resources and courses</p>

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
font-size:44px;
margin-bottom:10px;
}

.subtitle{
color:#94a3b8;
margin-bottom:60px;
}

.grid{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
gap:30px;
}

.card{
background:rgba(255,255,255,.06);
border:1px solid rgba(255,255,255,.18);
backdrop-filter:blur(35px);
border-radius:24px;
padding:40px;
cursor:pointer;
transition:.3s;
}

.card:hover{
transform:translateY(-10px);
box-shadow:0 0 35px rgba(124,58,237,.5);
}

.card h2{
margin-bottom:10px;
}

.card p{
color:#94a3b8;
}

`}</style>

</div>

)

}
