"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import ParticlesBackground from "@/app/components/ParticlesBackground"
import { syllabus } from "@/app/data/syllabus"

export default function LearnPage(){

const searchParams = useSearchParams()
const router = useRouter()

/* PARAMS */
const subject = searchParams.get("subject") || "english"
const lesson = searchParams.get("lesson") || "standing-line"

const topic = lesson.replace(/-/g," ")

/* 📚 SYLLABUS */
const data = syllabus["nursery"]
const subjectData = data?.subjects?.[subject as keyof typeof data.subjects]

const currentUnit = subjectData?.units.find((u:any)=>
u.lessons.some((l:string)=>
l.toLowerCase().replace(/\s+/g,"-") === lesson
)
)

const lessonsList = currentUnit?.lessons || []

/* NEXT LESSON */
const currentIndex = lessonsList.findIndex((l:string)=>
l.toLowerCase().replace(/\s+/g,"-") === lesson
)

const nextLesson = lessonsList[currentIndex+1]

/* STATES */
const [videos, setVideos] = useState<any[]>([])
const [selectedVideo, setSelectedVideo] = useState("")
const [loading, setLoading] = useState(true)
const [error, setError] = useState(false)

/* AI */
const [messages, setMessages] = useState<any[]>([])
const [input, setInput] = useState("")

/* 🎥 FETCH VIDEOS */
async function loadVideos(){
setLoading(true)
setError(false)

try{
const res = await fetch(`/api/youtube?lesson=${topic}`)
const data = await res.json()

if(data?.items){

const filtered = data.items
.filter((v:any)=> v.id?.videoId && v.snippet?.thumbnails)

if(filtered.length === 0){
setError(true)
setLoading(false)
return
}

/* SIMPLE BEST SORT */
const sorted = filtered.sort((a:any,b:any)=>{
return b.snippet.title.length - a.snippet.title.length
})

setVideos(sorted)

const first = sorted[0]?.id?.videoId
if(first) setSelectedVideo(first)

}else{
setError(true)
}

}catch(e){
console.log(e)
setError(true)
}

setLoading(false)
}

useEffect(()=>{
if(topic) loadVideos()
},[lesson])

/* LESSON CLICK */
function openLesson(slug:string){
router.push(`/learn?subject=${subject}&lesson=${slug}`)
}

/* AI */
async function askAI(){
if(!input) return

const newMsgs = [...messages, { role:"user", content:input }]
setMessages(newMsgs)
setInput("")

try{
const res = await fetch("/api/tutor",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({ question:input, topic, subject })
})

const data = await res.json()

setMessages([
...newMsgs,
{ role:"ai", content:data.answer }
])
}catch{
setMessages([
...newMsgs,
{ role:"ai", content:"⚠️ AI error" }
])
}
}

return(

<div className="page">

{/* BACKGROUND */}
<ParticlesBackground />

<div className="layout">

{/* LEFT */}
<div className="left">
<h3>Lessons</h3>

<ul>
{lessonsList.length > 0 ? (
lessonsList.map((l:string)=>{
const slug = l.toLowerCase().replace(/\s+/g,"-")

return(
<li
key={l}
className={lesson===slug ? "active":""}
onClick={()=>openLesson(slug)}
>
{l}
</li>
)
})
) : (
<li>No lessons</li>
)}
</ul>

{/* NEXT BUTTON */}
{nextLesson && (
<button
className="nextBtn"
onClick={()=>openLesson(nextLesson.toLowerCase().replace(/\s+/g,"-"))}
>
Next →
</button>
)}

</div>

{/* CENTER */}
<div className="center">

<h1 className="title">{topic}</h1>

<div className="videoMain">

{loading && <p>Loading videos...</p>}

{error && (
<div>
<p>⚠️ No videos found</p>
<button onClick={loadVideos}>Retry</button>
</div>
)}

{!loading && !error && selectedVideo && (
<iframe
src={`https://www.youtube.com/embed/${selectedVideo}`}
allowFullScreen
/>
)}

</div>

{/* THUMBNAILS */}
<div className="videoList">
{videos.map((v:any,i:number)=>{

const id = v.id?.videoId
const thumb = v.snippet?.thumbnails?.medium?.url

if(!id || !thumb) return null

return(
<div
key={i}
className={`videoCard ${selectedVideo===id ? "activeVideo":""}`}
onClick={()=>setSelectedVideo(id)}
>
<img src={thumb}/>
<p>{v.snippet.title.slice(0,60)}</p>
</div>
)
})}
</div>

</div>

{/* RIGHT */}
<div className="right">

<h3>🤖 AI Tutor</h3>

<div className="chat">
{messages.map((m,i)=>(
<div key={i} className={`bubble ${m.role}`}>
{m.content}
</div>
))}
</div>

<div className="inputBox">
<input
value={input}
onChange={(e)=>setInput(e.target.value)}
onKeyDown={(e)=> e.key==="Enter" && askAI()}
placeholder={`Ask about ${topic}...`}
/>
<button onClick={askAI}>➤</button>
</div>

</div>

</div>

<style jsx>{`

.page{
position:relative;
z-index:1;
<height:50>
background:#020617;
color:white;
}

.layout{
display:grid;
grid-template-columns:220px 1fr 300px;
height:100%;
gap:15px;
<padding:20;
}

/* LEFT */
.left{
background:#0f172a;
padding:15px;
border-radius:12px;
display:flex;
flex-direction:column;
}

.left li{
padding:8px;
cursor:pointer;
border-radius:6px;
}

.left li:hover{
background:#1e293b;
}

.active{
background:#4f46e5;
}

.nextBtn{
margin-top:auto;
padding:10px;
background:#4f46e5;
border:none;
border-radius:8px;
color:white;
cursor:pointer;
}

/* CENTER */
.center{
display:center;
flex-direction:column;
gap:15px;
}

.title{
<font-size:10>
}

/* VIDEO */
.videoMain{
  width:100%;
  max-width:900px;        /* 🔥 keeps it centered like YouTube */
  aspect-ratio:16/9;      /* perfect rectangle */
  margin:0 auto;          /* center align */
  background:#000;
  border-radius:14px;
  overflow:hidden;        /* 🔥 prevents overflow issue */
  position:relative;
}

.videoMain iframe{
width:100%;
height:100%;
border:none;
}

/* THUMBNAILS */
.videoList{
display:flex;
gap:12px;
overflow-x:auto;
}

.videoCard{
min-width:120px;
background:#1e293b;
border-radius:10px;
cursor:pointer;
overflow:hidden;
transition:.3s;
 transform:perspective(800px);
 transform:perspective(800px) scale(1.12) translateY(-6px);
}

.videoCard:hover{
transform:scale(1.05);
}

.videoCard img{
width:50%;
height:50%px;
object-fit:cover;
}

.videoCard p{
font-size:12px;
padding:16px;
}

.activeVideo{
border:2px solid #4f46e5;
}

/* RIGHT */
.right{
background:#0f172a;
padding:15px;
border-radius:12px;
display:center;
flex-direction:column;
}

.chat{
flex:1;
overflow-y:auto;
display:flex;
flex-direction:column;
gap:18px;
margin-bottom:10px;
}

.bubble{
padding:8px;
border-radius:8px;
max-width:80%;
}

.user{
align-self:flex-end;
background:#4f46e5;
}

.ai{
align-self:flex-start;
background:#1e293b;
}

/* INPUT */
.inputBox{
display:flex;
gap:8px;
}

.inputBox input{
flex:1;
padding:10px;
border-radius:8px;
border:none;
background:#020617;
color:white;
}

.inputBox button{
padding:10px;
background:#4f46e5;
border:none;
border-radius:8px;
color:white;
cursor:pointer;
}

`}</style>

</div>

)
}