"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import ParticlesBackground from "../components/ParticlesBackground"

export default function RoadmapPage(){

const {data:session,status}=useSession()
const router=useRouter()

useEffect(()=>{

if(status==="loading") return
if(!session) router.push("/login")

},[session,status,router])

if(!session) return null

const modules=[

{title:"HTML Fundamentals",status:"done"},
{title:"CSS Mastery",status:"done"},
{title:"JavaScript Core",status:"current"},
{title:"React Development",status:"locked"},
{title:"Next.js Framework",status:"locked"},
{title:"Fullstack AI Apps",status:"locked"}

]

return(

<div className="page">

<ParticlesBackground/>

<div className="container">

<h1 className="title">
AI Learning Roadmap
</h1>

<p className="subtitle">
Your personalized learning journey
</p>

{/* roadmap */}

<div className="roadmap">

{modules.map((mod,i)=>(

<div
key={i}
className={`module ${mod.status}`}
>

<div className="moduleTitle">
{mod.title}
</div>

{mod.status==="done" && <span className="badge done">Completed</span>}
{mod.status==="current" && <span className="badge current">In Progress</span>}
{mod.status==="locked" && <span className="badge locked">Locked</span>}

{mod.status==="current" && (

<button
className="continueBtn"
onClick={()=>router.push("/learn")}
>
Continue Learning
</button>

)}

</div>

))}

</div>

{/* xp section */}

<div className="xpBox">

<h3>Learning Progress</h3>

<div className="xpBar">

<div className="xpFill"/>

</div>

<p className="xpText">
You are 45% through your learning path.
</p>

</div>

{/* ai recommendation */}

<div className="aiBox">

<h3>AI Recommendation</h3>

<p>
Based on your progress, you should focus on
<strong> JavaScript Functions and ES6 concepts </strong>
to unlock React development.
</p>

</div>

</div>

<style jsx>{`

.page{
min-height:100vh;
display:flex;
align-items:center;
justify-content:center;
background:#020617;
color:white;
overflow:hidden;
}

.container{
width:900px;
max-width:95%;
background:rgba(255,255,255,.05);
border:1px solid rgba(255,255,255,.15);
backdrop-filter:blur(25px);
border-radius:24px;
padding:40px;
box-shadow:0 0 60px rgba(147,51,234,.35);
z-index:5;
}

.title{
text-align:center;
font-size:38px;
font-weight:700;
background:linear-gradient(90deg,#9333ea,#c026d3);
-webkit-background-clip:text;
-webkit-text-fill-color:transparent;
}

.subtitle{
text-align:center;
color:#94a3b8;
margin-bottom:40px;
}

/* roadmap */

.roadmap{
display:grid;
grid-template-columns:1fr 1fr;
gap:20px;
margin-bottom:40px;
}

.module{
padding:20px;
border-radius:16px;
border:1px solid rgba(255,255,255,.15);
background:rgba(255,255,255,.05);
display:flex;
flex-direction:column;
gap:10px;
}

.moduleTitle{
font-size:18px;
font-weight:600;
}

.badge{
font-size:12px;
padding:4px 10px;
border-radius:10px;
width:max-content;
}

.done{
background:#16a34a;
}

.current{
background:#3b82f6;
}

.locked{
background:#64748b;
}

.continueBtn{
margin-top:10px;
padding:10px 16px;
border:none;
border-radius:10px;
background:linear-gradient(90deg,#9333ea,#c026d3);
color:white;
cursor:pointer;
}

/* xp */

.xpBox{
margin-bottom:30px;
}

.xpBar{
width:100%;
height:14px;
background:#1e293b;
border-radius:10px;
overflow:hidden;
margin:10px 0;
}

.xpFill{
width:45%;
height:100%;
background:linear-gradient(90deg,#9333ea,#c026d3);
}

.xpText{
color:#94a3b8;
}

/* ai */

.aiBox{
padding:20px;
border-radius:16px;
background:rgba(147,51,234,.15);
border:1px solid rgba(147,51,234,.3);
}

`}</style>

</div>

)

}