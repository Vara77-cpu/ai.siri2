"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import VantaBackground from "@/app/components/VantaBackground"
import AuroraGlow from "@/app/components/AuroraGlow"

export default function Dashboard(){

const {data:session,status}=useSession()
const router=useRouter()

const [text,setText]=useState("")
const [typingStarted,setTypingStarted]=useState(false)

/* KEEP PROGRESS LOGIC (not used in UI) */
const [progress,setProgress]=useState<any>(null)

/* Greeting */

const hour = new Date().getHours()

let greeting = "Hello"
if(hour < 12) greeting = "Good morning ☀️"
else if(hour < 18) greeting = "Good afternoon 🚀"
else greeting = "Good evening 🌙"

const message=`${greeting} ${session?.user?.name || "Student"}.
Your AI assistant is ready.
Continue your learning journey.`

/* protect */

useEffect(()=>{
if(status==="loading") return
if(!session) router.push("/login")
},[session,status,router])

/* fetch progress (kept safe) */

useEffect(()=>{
async function fetchProgress(){
if(!session?.user?.email) return
try{
const res = await fetch(`/api/progress?email=${session.user.email}`)
const data = await res.json()
if(data) setProgress(data)
}catch{}
}
fetchProgress()
},[session])

/* typing */

useEffect(()=>{
if(!session || typingStarted) return
setTypingStarted(true)

let i=0
const typing=setInterval(()=>{
setText(message.slice(0,i))
i++
if(i>message.length) clearInterval(typing)
},35)

return()=>clearInterval(typing)
},[session,message,typingStarted])

/* continue */

function handleContinue(){
if(progress){
router.push(
`/board/${progress.board}/class/${progress.class}/subject/${progress.subject}/unit/${progress.unit}/lesson/${progress.lesson}`
)
}else{
router.push("/board")
}
}

if(!session) return null

return(

<div className="page">

<VantaBackground/>
<AuroraGlow/>

<div className="content">

<style jsx>{`

.page{
min-height:100vh;
padding:70px;
background:#020617;
color:white;
position:relative;
overflow:hidden;
}

.content{
position:relative;
z-index:2;
}

/* HEADER */

.header{
display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:30px;
}

.userBox{
display:flex;
align-items:center;
gap:12px;
}

.avatar{
width:40px;
height:40px;
border-radius:50%;
border:2px solid #9333ea;
}

.userInfo{
display:flex;
flex-direction:column;
}

.logout{
padding:10px 20px;
border-radius:14px;
background:rgba(255,255,255,.06);
border:1px solid rgba(255,255,255,.2);
color:white;
cursor:pointer;
}

/* AI PANEL */

.aiPanel{
position:relative;
overflow:hidden;
margin-bottom:40px;
padding:50px;
border-radius:30px;
background:rgba(255,255,255,.05);
border:1px solid rgba(255,255,255,.2);
backdrop-filter:blur(40px);
box-shadow:0 0 80px rgba(147,51,234,.35);
text-align:center;
max-width:900px;
margin:auto;
}

/* 🔥 INSIDE PARTICLES */

.cardParticles{
position:absolute;
inset:0;
overflow:hidden;
border-radius:30px;
pointer-events:none;
z-index:0;
}

.p{
position:absolute;
width:6px;
height:6px;
background:#a855f7;
border-radius:50%;
opacity:.6;
box-shadow:0 0 10px #9333ea,0 0 20px #9333ea;
animation:floatParticle 6s linear infinite;
}

@keyframes floatParticle{
0%{transform:translateY(0)}
50%{transform:translateY(-40px)}
100%{transform:translateY(-80px);opacity:0}
}

/* ORB */

.aiCore{
position:relative;
width:150px;
height:150px;
margin:0 auto 20px;
z-index:1;
}

.aiOrb{
width:150px;
height:150px;
border-radius:50%;
background:radial-gradient(circle,#9333ea,#4c1d95,#020617);
box-shadow:0 0 40px #9333ea,0 0 80px #9333ea;
animation:pulse 3s infinite;
position:absolute;
}

.ring,.ring2{
position:absolute;
border-radius:50%;
inset:0;
border:1px solid rgba(147,51,234,.5);
animation:spin 10s linear infinite;
}

.ring2{
inset:-20px;
animation:spinReverse 14s linear infinite;
}

@keyframes spin{100%{transform:rotate(360deg)}}
@keyframes spinReverse{100%{transform:rotate(-360deg)}}
@keyframes pulse{50%{transform:scale(1.1)}}

.aiText{
font-size:22px;
color:#cbd5f5;
white-space:pre-wrap;
z-index:1;
position:relative;
}

/* BUTTONS */

.actions{
margin-top:20px;
display:flex;
justify-content:center;
gap:18px;
flex-wrap:wrap;
z-index:1;
position:relative;
}

.btn{
padding:18px 32px;
border-radius:18px;
border:none;
font-weight:600;
cursor:pointer;
color:white;
transition:.3s;
}

.btn:hover{
transform:scale(1.08);
box-shadow:0 10px 40px rgba(147,51,234,.6);
}

.learnBtn{
background:linear-gradient(90deg,#9333ea,#c026d3);
}

.aiBtn{
background:#4f46e5;
}

/* FEATURES */

.features{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
gap:25px;
}

.featureCard{
padding:26px;
border-radius:24px;
background:rgba(255,255,255,.06);
border:1px solid rgba(255,255,255,.18);
cursor:pointer;
transition:.3s;
text-align:center;
}

.featureCard:hover{
transform:translateY(-8px) scale(1.03);
box-shadow:0 0 45px rgba(124,58,237,.45);
}

.icon{
font-size:34px;
margin-bottom:10px;
}

`}</style>

{/* HEADER */}

<div className="header">

<div>
<h1 style={{fontSize:"38px"}}>
{greeting}, {session?.user?.name}
</h1>
<p style={{color:"#94a3b8"}}>Your AI learning control center</p>
</div>

<div className="userBox">
<img src={session?.user?.image || "/user.png"} className="avatar"/>
<div className="userInfo">
<div>{session?.user?.name}</div>
<div style={{fontSize:"12px",color:"#94a3b8"}}>
{session?.user?.email}
</div>
</div>
<button className="logout" onClick={()=>signOut()}>Logout</button>
</div>

</div>

{/* HERO */}

<div className="aiPanel">

{/* 🔥 PARTICLES */}
<div className="cardParticles">
{Array.from({length:25}).map((_,i)=>(
<span
key={i}
className="p"
style={{
left:`${Math.random()*100}%`,
top:`${Math.random()*100}%`,
animationDelay:`${Math.random()*3}s`
}}
/>
))}
</div>

<div className="aiCore">
<div className="ring"/>
<div className="ring2"/>
<div className="aiOrb"/>
</div>

<pre className="aiText">{text}</pre>

<div className="actions">

<button className="btn learnBtn" onClick={handleContinue}>
Continue Learning
</button>

<button className="btn aiBtn" onClick={()=>router.push("/ai-tutor")}>
Ask AI Tutor
</button>

</div>

</div>

{/* FEATURES */}

<div className="features">

<div className="featureCard" onClick={()=>router.push("/board")}>
<div className="icon">📚</div>Start Learning
</div>

<div className="featureCard" onClick={()=>router.push("/results")}>
<div className="icon">📄</div>Results
</div>

<div className="featureCard" onClick={()=>router.push("/resources")}>
<div className="icon">📚</div>Resources
</div>

<div className="featureCard" onClick={()=>router.push("/competitive")}>
<div className="icon">🎯</div>Competitive
</div>

<div className="featureCard" onClick={()=>router.push("/skills")}>
<div className="icon">💻</div>Skills
</div>

<div className="featureCard" onClick={()=>router.push("/explore")}>
<div className="icon">🎓</div>Explore
</div>

</div>

</div>

</div>

)
}