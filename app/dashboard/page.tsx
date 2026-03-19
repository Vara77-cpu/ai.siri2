"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import XPProgress from "@/app/components/XPProgress"
import VantaBackground from "@/app/components/VantaBackground"
import AuroraGlow from "@/app/components/AuroraGlow"

export default function Dashboard(){

const {data:session,status}=useSession()
const router=useRouter()

const [text,setText]=useState("")
const [typingStarted,setTypingStarted]=useState(false)

/* 🔥 NEW STATE (RESUME) */
const [progress,setProgress]=useState<any>(null)

/* Smart greeting */

const hour = new Date().getHours()

let greeting = "Hello"

if(hour < 12){
greeting = "Good morning ☀️"
}
else if(hour < 18){
greeting = "Good afternoon 🚀"
}
else{
greeting = "Good evening 🌙"
}

const message=`${greeting} ${session?.user?.name || "Student"}.
Your AI assistant is ready.
Continue your learning journey.`

/* protect route */

useEffect(()=>{
if(status==="loading") return
if(!session) router.push("/login")
},[session,status,router])

/* 🔥 FETCH LAST PROGRESS */

useEffect(()=>{

async function fetchProgress(){

if(!session?.user?.email) return

try{

const res = await fetch(`/api/progress?email=${session.user.email}`)
const data = await res.json()

if(data){
setProgress(data)
}

}catch(e){
console.log(e)
}

}

fetchProgress()

},[session])

/* typing animation */

useEffect(()=>{

if(!session || typingStarted) return
setTypingStarted(true)

let i=0

const typing=setInterval(()=>{

setText(message.slice(0,i))
i++

if(i>message.length){
clearInterval(typing)
}

},35)

return()=>clearInterval(typing)

},[session,message,typingStarted])

/* 🔥 RESUME FUNCTION */

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
font-family:system-ui;
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
line-height:1.2;
}

.userName{
font-size:14px;
font-weight:600;
}

.userEmail{
font-size:12px;
color:#94a3b8;
}

.logout{
padding:10px 20px;
border-radius:14px;
border:1px solid rgba(255,255,255,.2);
background:rgba(255,255,255,.06);
cursor:pointer;
color:white;
}

/* AI PANEL */

.aiPanel{
margin-bottom:40px;
padding:40px 50px;
border-radius:28px;
background:rgba(255,255,255,.05);
border:1px solid rgba(255,255,255,.2);
backdrop-filter:blur(40px);
box-shadow:0 0 80px rgba(147,51,234,.35);
text-align:center;
max-width:900px;
margin-left:auto;
margin-right:auto;
}

/* AI CORE */

.aiCore{
position:relative;
width:150px;
height:150px;
margin:0 auto 20px auto;
}

.aiOrb{
width:150px;
height:150px;
border-radius:50%;
background:radial-gradient(circle,#9333ea,#4c1d95,#020617);
box-shadow:
0 0 40px #9333ea,
0 0 80px #9333ea,
0 0 140px #9333ea;
animation:pulse 3s infinite ease-in-out;
position:absolute;
}

.ring{
position:absolute;
border:1px solid rgba(147,51,234,.6);
border-radius:50%;
top:0;
left:0;
right:0;
bottom:0;
animation:spin 10s linear infinite;
}

.ring2{
position:absolute;
border:1px solid rgba(147,51,234,.4);
border-radius:50%;
top:-20px;
left:-20px;
right:-20px;
bottom:-20px;
animation:spinReverse 14s linear infinite;
}

@keyframes spin{
0%{transform:rotate(0deg)}
100%{transform:rotate(360deg)}
}

@keyframes spinReverse{
0%{transform:rotate(360deg)}
100%{transform:rotate(0deg)}
}

@keyframes pulse{
0%{transform:scale(1)}
50%{transform:scale(1.1)}
100%{transform:scale(1)}
}

.aiText{
font-size:22px;
line-height:1.6;
color:#cbd5f5;
white-space:pre-wrap;
}

/* ACTION BUTTONS */

.actions{
margin-top:20px;
display:flex;
justify-content:center;
gap:18px;
flex-wrap:wrap;
}

.btn{
padding:18px 32px;
border-radius:18px;
border:none;
font-weight:600;
font-size:16px;
cursor:pointer;
color:white;
transition:.3s;
}

.btn:hover{
transform:scale(1.05);
}

.learnBtn{
background:linear-gradient(90deg,#9333ea,#c026d3);
}

.aiBtn{
background:#4f46e5;
}

/* PROGRESS */

.progress{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
gap:25px;
margin-bottom:40px;
}

.card{
background:rgba(255,255,255,.06);
border:1px solid rgba(255,255,255,.18);
border-radius:24px;
padding:28px;
text-align:center;
}

.stat{
font-size:28px;
font-weight:700;
margin-top:10px;
}

/* FEATURE CARDS */

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
backdrop-filter:blur(35px);
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

<p style={{color:"#94a3b8"}}>
Your AI learning control center
</p>
</div>

<div className="userBox">

<img
src={session?.user?.image || "/user.png"}
className="avatar"
/>

<div className="userInfo">
<div className="userName">{session?.user?.name}</div>
<div className="userEmail">{session?.user?.email}</div>
</div>

<button className="logout" onClick={()=>signOut()}>
Logout </button>

</div>

</div>

{/* AI HERO */}

<div className="aiPanel">

<div className="aiCore">

<div className="ring"/>
<div className="ring2"/>
<div className="aiOrb"/>

</div>

<pre className="aiText">
{text}
</pre>

<div className="actions">

<button
className="btn learnBtn"
onClick={handleContinue}
>
Continue Learning
</button>

<button
className="btn aiBtn"
onClick={()=>router.push("/ai-tutor")}
>
Ask AI Tutor
</button>

</div>

</div>

{/* PROGRESS */}

<div className="progress">

<div className="card">
Lessons Completed
<div className="stat">0</div>
</div>

<div className="card">
Current Streak
<div className="stat">0 Days</div>
</div>

<div className="card">
<h3>XP Progress</h3>
<br/>
<XPProgress/>
</div>

</div>

{/* FEATURE CARDS */}

<div className="features">

<div className="featureCard" onClick={()=>router.push("/board")}>
<div className="icon">📚</div>
Start Learning
</div>

<div className="featureCard" onClick={()=>router.push("/results")}>
<div className="icon">📄</div>
Results
</div>

<div className="featureCard" onClick={()=>router.push("/resources")}>
<div className="icon">📚</div>
Resources
</div>

<div className="featureCard" onClick={()=>router.push("/competitive")}>
<div className="icon">🎯</div>
Competitive
</div>

<div className="featureCard" onClick={()=>router.push("/skills")}>
<div className="icon">💻</div>
Skills
</div>

<div className="featureCard" onClick={()=>router.push("/explore")}>
<div className="icon">🎓</div>
Explore
</div>

</div>

</div>

</div>

)
}