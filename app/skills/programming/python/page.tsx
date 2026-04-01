"use client"

import { useState } from "react"
import VantaBackground from "@/app/components/VantaBackground"
import AuroraGlow from "@/app/components/AuroraGlow"

export default function PythonCourse(){

const [showAnswer,setShowAnswer] = useState(false)
const [tab,setTab] = useState("lesson")
const [code,setCode] = useState("print('Hello World')")

return(

<div className="page">

<VantaBackground/>
<AuroraGlow/>

<div className="content">

<h1 className="title">
Python Programming
</h1>

<p className="subtitle">
Learn Python from basics with examples and quizzes
</p>

{/* TABS */}

<div className="tabs">

<button onClick={()=>setTab("lesson")}>Lesson</button>
<button onClick={()=>setTab("notes")}>Notes</button>
<button onClick={()=>setTab("quiz")}>Quiz</button>
<button onClick={()=>setTab("practice")}>Practice</button>

</div>

{/* LESSON */}

{tab==="lesson" && (

<div className="card">

<h2>Python Introduction</h2>

<iframe
width="100%"
height="400"
src="https://www.youtube.com/embed/_uQrJ0TkZlc"
title="Python Tutorial"
frameBorder="0"
allowFullScreen
/>

</div>

)}

{/* NOTES */}

{tab==="notes" && (

<div className="card">

<h2>Lesson Notes</h2>

<p>
Python is a popular programming language used for:
</p>

<ul>
<li>Web Development</li>
<li>Data Science</li>
<li>Artificial Intelligence</li>
<li>Automation</li>
</ul>

<p>Example Python code:</p>

<pre>

print("Hello World")

</pre>

</div>

)}

{/* QUIZ */}

{tab==="quiz" && (

<div className="card">

<h2>Mini Quiz</h2>

<p>What function prints output in Python?</p>

<button
className="quizBtn"
onClick={()=>setShowAnswer(true)}

>

Show Answer </button>

{showAnswer && (

<p className="answer">
Correct Answer: print()
</p>

)}

</div>

)}

{/* PRACTICE */}

{tab==="practice" && (

<div className="card">

<h2>Python Practice</h2>

<textarea
value={code}
onChange={(e)=>setCode(e.target.value)}
className="editor"
/>

<button className="runBtn">
Run Code
</button>

<p className="note">
Code execution preview (real compiler can be added later)
</p>

</div>

)}

</div>

<style jsx>{`

.page{
min-height:100vh;
background:#020617;
padding:80px;
color:white;
}

.content{
position:relative;
z-index:2;
max-width:900px;
margin:auto;
}

.title{
font-size:42px;
margin-bottom:10px;
}

.subtitle{
color:#94a3b8;
margin-bottom:30px;
}

.tabs{
display:flex;
gap:10px;
margin-bottom:30px;
}

.tabs button{
padding:10px 20px;
border:none;
border-radius:10px;
background:#9333ea;
color:white;
cursor:pointer;
}

.card{
background:rgba(255,255,255,.06);
border:1px solid rgba(255,255,255,.18);
backdrop-filter:blur(30px);
border-radius:20px;
padding:30px;
margin-bottom:40px;
}

.quizBtn{
margin-top:15px;
padding:12px 20px;
border:none;
border-radius:10px;
background:#9333ea;
color:white;
cursor:pointer;
}

.answer{
margin-top:15px;
color:#22c55e;
font-weight:600;
}

.editor{
width:100%;
height:200px;
background:#000;
color:#22c55e;
border:1px solid #333;
border-radius:10px;
padding:10px;
margin-top:15px;
}

.runBtn{
margin-top:15px;
padding:10px 20px;
border:none;
border-radius:10px;
background:#9333ea;
color:white;
cursor:pointer;
}

.note{
color:#94a3b8;
margin-top:10px;
}

`}</style>

</div>

)

}
