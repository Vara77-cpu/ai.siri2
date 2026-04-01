"use client"

import { useState, useRef, useEffect } from "react"

type Props = {
lesson: string
classId?: string
subject?: string
}

export default function AiTutor({ lesson, classId, subject }: Props){

const [chat,setChat] = useState<any[]>([])
const [message,setMessage] = useState("")
const [loading,setLoading] = useState(false)

const fileInput = useRef<HTMLInputElement>(null)
const chatRef = useRef<HTMLDivElement>(null)

/* LOAD CHAT */

useEffect(()=>{
const saved = localStorage.getItem("ai_chat")
if(saved) setChat(JSON.parse(saved))
},[])

/* SAVE + SCROLL */

useEffect(()=>{
localStorage.setItem("ai_chat",JSON.stringify(chat))
chatRef.current?.scrollTo({
top: chatRef.current.scrollHeight,
behavior:"smooth"
})
},[chat])

/* SEND TEXT */

const sendMessage = async (text:string) => {

setChat(prev => [...prev,{role:"user",text}])
setLoading(true)

try{

const res = await fetch("/api/ai-tutor",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
lesson,
classId,
subject,
question:text
})
})

const data = await res.json()

setChat(prev => [...prev,{
role:"ai",
text:data.answer
}])

}catch{

setChat(prev => [...prev,{
role:"ai",
text:"⚠️ AI failed"
}])

}

setLoading(false)

}

/* SEND IMAGE */

const sendImage = async (base64:string, fileName:string) => {

setChat(prev => [...prev,{
role:"user",
image: base64,
fileName
}])

setLoading(true)

try{

const res = await fetch("/api/ai-tutor",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
lesson,
classId,
subject,
image: base64
})
})

const data = await res.json()

setChat(prev => [...prev,{
role:"ai",
text:data.answer
}])

}catch{

setChat(prev => [...prev,{
role:"ai",
text:"⚠️ AI failed"
}])

}

setLoading(false)

}

/* INPUT */

const handleSend = () => {
if(!message.trim()) return
sendMessage(message)
setMessage("")
}

/* VOICE */

const startVoice = () => {

const SpeechRecognition =
(window as any).SpeechRecognition ||
(window as any).webkitSpeechRecognition

if(!SpeechRecognition) return

const recognition = new SpeechRecognition()

recognition.lang = "en-IN"

recognition.onresult = (event:any)=>{
const text = event.results[0][0].transcript
sendMessage(text)
}

recognition.start()

}

/* FILE (REAL IMAGE UPLOAD) */

const openUpload = () => fileInput.current?.click()

const handleFile = (e:any) => {

const file = e.target.files[0]
if(!file) return

const reader = new FileReader()

reader.onload = () => {
const base64 = reader.result as string
sendImage(base64, file.name)
}

reader.readAsDataURL(file)

}

/* UI */

return(

<div className="wrapper">

{/* CHAT */}

<div className="chat" ref={chatRef}>

{chat.length === 0 && (

<div className="welcome">
<h3>Ask anything about {lesson}</h3>
</div>
)}

{chat.map((msg,i)=>(

<div key={i} className={`row ${msg.role}`}>

<div className="bubble">

{/* IMAGE MESSAGE */}

{msg.image && ( <img src={msg.image} className="preview"/>
)}

{/* TEXT MESSAGE */}

{msg.text && <div>{msg.text}</div>}

</div>

</div>

))}

{loading && (

<div className="row ai">
<div className="bubble thinking">
<span></span><span></span><span></span>
</div>
</div>
)}

</div>

{/* INPUT PANEL */}

<div className="inputPanel">

<button onClick={openUpload}>📎</button>

<input
value={message}
onChange={(e)=>setMessage(e.target.value)}
placeholder="Ask anything..."
onKeyDown={(e)=> e.key==="Enter" && handleSend()}
/>

<button onClick={startVoice}>🎤</button>

<button onClick={handleSend}>➤</button>

</div>

<input
type="file"
ref={fileInput}
style={{display:"none"}}
onChange={handleFile}
/>

<style jsx>{`

.wrapper{
margin-top:20px;
display:flex;
flex-direction:column;
gap:15px;
}

/* CHAT */

.chat{

max-height:400px;
overflow-y:auto;

display:flex;
flex-direction:column;
gap:12px;

padding:10px;

}

.row{
display:flex;
}

.row.user{
justify-content:flex-end;
}

.bubble{

padding:12px 16px;
border-radius:16px;
max-width:70%;
line-height:1.5;

}

.user .bubble{
background:#6366f1;
color:white;
}

.ai .bubble{
background:#1e293b;
color:#e2e8f0;
}

/* IMAGE */

.preview{
max-width:200px;
border-radius:10px;
margin-bottom:8px;
}

/* THINKING */

.thinking span{
display:inline-block;
width:6px;
height:6px;
margin:0 2px;
background:#94a3b8;
border-radius:50%;
animation:bounce 1.2s infinite;
}

.thinking span:nth-child(2){animation-delay:.2s;}
.thinking span:nth-child(3){animation-delay:.4s;}

@keyframes bounce{
0%,80%,100%{transform:scale(0)}
40%{transform:scale(1)}
}

/* INPUT */

.inputPanel{

display:flex;
align-items:center;
gap:10px;

background:#0f172a;

padding:12px 16px;

border-radius:20px;

border:1px solid rgba(255,255,255,0.08);

}

input{
flex:1;
background:transparent;
border:none;
outline:none;
color:white;
font-size:14px;
}

button{
background:none;
border:none;
color:white;
cursor:pointer;
font-size:16px;
}

`}</style>

</div>

)

}
