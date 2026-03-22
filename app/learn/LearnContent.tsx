"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import ParticlesBackground from "@/app/components/ParticlesBackground"
import { syllabus } from "@/app/data/syllabus"

export default function LearnContent(){

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

/* AI CHAT */
async function sendMessage(){
if(!input.trim()) return

const userMsg = {role:"user", content:input}
setMessages(prev=>[...prev, userMsg])
setInput("")

try{
const res = await fetch("/api/ai-tutor",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
messages:[...messages, userMsg],
lesson:topic,
subject
})
})

const data = await res.json()
if(data?.response){
setMessages(prev=>[...prev, {role:"assistant", content:data.response}])
}

}catch(e){
console.log(e)
}
}

return(

<div className="page">

<ParticlesBackground />

{/* HEADER */}
<div className="header">
<h1>{topic}</h1>
<p>{subject} • Nursery</p>
</div>

{/* MAIN */}
<div className="main">

{/* VIDEO */}
<div className="videoSection">

{loading && (
<div className="loading">
<div className="spinner"></div>
<p>Loading videos...</p>
</div>
)}

{error && (
<div className="error">
<p>No videos found for this lesson</p>
<button onClick={loadVideos}>Retry</button>
</div>
)}

{!loading && !error && selectedVideo && (
<iframe
src={`https://www.youtube.com/embed/${selectedVideo}`}
frameBorder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
allowFullScreen
className="video"
/>
)}

{/* VIDEO LIST */}
{videos.length > 1 && (
<div className="videoList">
{videos.slice(1).map((v:any,i:number)=>(
<div
key={i}
className="videoItem"
onClick={()=>setSelectedVideo(v.id.videoId)}
>
<img src={v.snippet.thumbnails.default.url} alt={v.snippet.title} />
<p>{v.snippet.title.slice(0,50)}...</p>
</div>
))}
</div>
)}

</div>

{/* LESSONS */}
<div className="lessonsSection">

<h2>Lessons in this unit</h2>

<div className="lessonsGrid">
{lessonsList.map((l:string,i:number)=>{

const slug = l.toLowerCase().replace(/\s+/g,"-")
const isActive = slug === lesson

return(
<div
key={i}
className={`lessonCard ${isActive ? "active" : ""}`}
onClick={()=>openLesson(slug)}
>
<p>{l}</p>
{isActive && <span className="check">✓</span>}
</div>
)
})}
</div>

{/* NEXT */}
{nextLesson && (
<button
className="nextBtn"
onClick={()=>openLesson(nextLesson.toLowerCase().replace(/\s+/g,"-"))}
>
Next Lesson → {nextLesson}
</button>
)}

</div>

{/* AI CHAT */}
<div className="chatSection">

<h2>Ask AI Tutor</h2>

<div className="chatBox">
{messages.map((m:any,i:number)=>(
<div key={i} className={`message ${m.role}`}>
<p>{m.content}</p>
</div>
))}
</div>

<div className="chatInput">
<input
value={input}
onChange={(e)=>setInput(e.target.value)}
onKeyPress={(e)=>e.key==="Enter" && sendMessage()}
placeholder="Ask anything about this lesson..."
/>
<button onClick={sendMessage}>Send</button>
</div>

</div>

</div>

{/* STYLES */}
<style jsx>{`

.page{
width:100vw;
height:100vh;
display:flex;
flex-direction:column;
background:#020617;
color:white;
overflow:hidden;
}

.header{
padding:20px;
text-align:center;
background:rgba(0,0,0,0.5);
}

.header h1{
font-size:28px;
margin:0;
}

.header p{
color:#aaa;
margin:5px 0 0 0;
}

.main{
flex:1;
display:flex;
padding:20px;
gap:20px;
overflow:hidden;
}

.videoSection{
flex:1;
display:flex;
flex-direction:column;
gap:20px;
}

.loading, .error{
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
height:300px;
background:rgba(255,255,255,0.05);
border-radius:12px;
}

.spinner{
width:40px;
height:40px;
border:4px solid #333;
border-top:4px solid #9333ea;
border-radius:50%;
animation:spin 1s linear infinite;
}

@keyframes spin{
100%{transform:rotate(360deg)}
}

.error button{
margin-top:10px;
padding:8px 16px;
background:#9333ea;
border:none;
border-radius:6px;
color:white;
cursor:pointer;
}

.video{
width:100%;
height:300px;
border-radius:12px;
}

.videoList{
display:flex;
gap:10px;
overflow-x:auto;
padding:10px 0;
}

.videoItem{
min-width:150px;
cursor:pointer;
border-radius:8px;
overflow:hidden;
background:rgba(255,255,255,0.05);
transition:0.3s;
}

.videoItem:hover{
transform:scale(1.05);
}

.videoItem img{
width:100%;
height:80px;
object-fit:cover;
}

.videoItem p{
padding:8px;
font-size:12px;
margin:0;
}

.lessonsSection{
width:300px;
display:flex;
flex-direction:column;
gap:20px;
}

.lessonsSection h2{
margin:0;
}

.lessonsGrid{
display:grid;
grid-template-columns:1fr;
gap:10px;
overflow-y:auto;
}

.lessonCard{
padding:12px;
background:rgba(255,255,255,0.05);
border-radius:8px;
cursor:pointer;
transition:0.3s;
position:relative;
}

.lessonCard:hover{
background:rgba(255,255,255,0.1);
}

.lessonCard.active{
background:#9333ea;
}

.check{
position:absolute;
top:10px;
right:10px;
color:#fff;
font-weight:bold;
}

.nextBtn{
padding:12px;
background:#9333ea;
border:none;
border-radius:8px;
color:white;
cursor:pointer;
font-weight:bold;
transition:0.3s;
}

.nextBtn:hover{
background:#7c3aed;
}

.chatSection{
width:300px;
display:flex;
flex-direction:column;
gap:20px;
}

.chatSection h2{
margin:0;
}

.chatBox{
flex:1;
background:rgba(255,255,255,0.05);
border-radius:8px;
padding:10px;
overflow-y:auto;
}

.message{
margin-bottom:10px;
}

.message.user{
text-align:right;
}

.message p{
background:rgba(255,255,255,0.1);
padding:8px 12px;
border-radius:8px;
margin:0;
}

.chatInput{
display:flex;
gap:10px;
}

.chatInput input{
flex:1;
padding:8px 12px;
border:none;
border-radius:8px;
background:rgba(255,255,255,0.1);
color:white;
}

.chatInput input::placeholder{
color:#aaa;
}

.chatInput button{
padding:8px 16px;
background:#9333ea;
border:none;
border-radius:8px;
color:white;
cursor:pointer;
}

`}</style>

</div>

)
}