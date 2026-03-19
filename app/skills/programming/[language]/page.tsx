"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import VantaBackground from "@/app/components/VantaBackground"
import AuroraGlow from "@/app/components/AuroraGlow"

export default function LanguageCourse(){

const params = useParams()
const language = params.language as string

const [showAnswer,setShowAnswer] = useState(false)

return(

<div className="page">

<VantaBackground/>
<AuroraGlow/>

<div className="content">

<h1 className="title">
{language.toUpperCase()} Programming
</h1>

<p className="subtitle">
Learn {language} from basics with examples and quizzes
</p>

{/* VIDEO */}

<div className="card">

<h2>Introduction</h2>

<iframe
width="100%"
height="400"
src="https://www.youtube.com/embed/zOjov-2OZ0E"
title="Programming Tutorial"
frameBorder="0"
allowFullScreen
/>

</div>

{/* NOTES */}

<div className="card">

<h2>Lesson Notes</h2>

<p>

{language} is widely used for building applications and software.

</p>

<p>Example Code:</p>

<pre>

print("Hello World")

</pre>

</div>

{/* QUIZ */}

<div className="card">

<h2>Mini Quiz</h2>

<p>What keyword prints output?</p>

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
margin-bottom:40px;
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

`}</style>

</div>

)

}
