"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import ParticlesBackground from "@/app/components/ParticlesBackground"

export default function SiriPage(){

const searchParams = useSearchParams()

const subject = searchParams.get("subject") || ""
const unit = searchParams.get("unit") || ""
const lesson = searchParams.get("lesson") || ""

const topic = lesson ? lesson.replace(/-/g," ") : ""

/* STATES */

const [videos, setVideos] = useState<any[]>([])
const [messages, setMessages] = useState<any[]>([])
const [input, setInput] = useState("")

/* FETCH VIDEOS */

useEffect(()=>{

if(!topic) return

async function loadVideos(){

try{

const res = await fetch(`/api/youtube?lesson=${topic}`)
const data = await res.json()

if(data.items){
setVideos(data.items.slice(0,6))
}

}catch(e){
console.log(e)
}

}

loadVideos()

},[topic])

/* AI */

async function askAI(){

if(!input) return

const newMessages = [...messages, { role:"user", content:input }]
setMessages(newMessages)
setInput("")

const res = await fetch("/api/tutor",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({
question:input,
topic,
subject
})
})

const data = await res.json()

setMessages([
...newMessages,
{ role:"ai", content:data.answer }
])

}

if(!lesson){
return <h1 style={{color:"white",padding:40}}>Select a lesson</h1>
}

return(

<div className="page">

<div className="bg">
<ParticlesBackground/>
</div>

<div className="container">

<h1>{topic}</h1>

<p>Subject: {subject}</p>

{/* VIDEOS */}

<div className="section">
<h2>Videos</h2>

<div className="grid">

{videos.map((v:any,i:number)=>{

const id = v.id.videoId

return(
<iframe key={i} src={`https://www.youtube.com/embed/${id}`} />
)

})}

</div>

</div>

{/* AI */}

<div className="section">
<h2>AI Tutor</h2>

<div className="chat">

{messages.map((m,i)=>(
<div key={i} className={m.role}>{m.content}</div>
))}

<input
value={input}
onChange={(e)=>setInput(e.target.value)}
onKeyDown={(e)=> e.key==="Enter" && askAI()}
placeholder="Ask something..."
/>

</div>

</div>

</div>

<style jsx>{`
.page{min-height:100vh;background:#020617;color:white;position:relative;}
.bg{position:absolute;inset:0;}
.container{position:relative;z-index:10;padding:40px;}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:20px;}
iframe{width:100%;height:200px;border-radius:10px;}
.section{margin-top:40px;}
`}</style>

</div>

)

}