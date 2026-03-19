"use client"

import { useState } from "react"
import Editor from "@monaco-editor/react"
import VantaBackground from "@/app/components/VantaBackground"
import AuroraGlow from "@/app/components/AuroraGlow"

export default function PythonPlayground(){

const [code,setCode] = useState(`print("Hello World")`)
const [output,setOutput] = useState("")

const runCode = async () => {

try{

const res = await fetch("/api/python-run",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({code})
})

const data = await res.json()

setOutput(data.output)

}catch{
setOutput("Error running code")
}

}

return(

<div className="page">

<VantaBackground/>
<AuroraGlow/>

<div className="content">

<h1 className="title">Python Coding Playground</h1>

<p className="subtitle">
Write and run Python code instantly
</p>

<div className="editor">

<Editor
height="400px"
defaultLanguage="python"
value={code}
theme="vs-dark"
onChange={(value)=>setCode(value || "")}
/>

</div>

<button className="runBtn" onClick={runCode}>
Run Code
</button>

<div className="output">

<h3>Output</h3>

<pre>{output}</pre>

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
max-width:1000px;
margin:auto;
}

.title{
font-size:40px;
margin-bottom:10px;
}

.subtitle{
color:#94a3b8;
margin-bottom:30px;
}

.editor{
border-radius:12px;
overflow:hidden;
border:1px solid #333;
}

.runBtn{
margin-top:20px;
padding:12px 24px;
background:#9333ea;
border:none;
border-radius:10px;
color:white;
cursor:pointer;
font-weight:600;
}

.output{
margin-top:30px;
background:#111;
padding:20px;
border-radius:12px;
}

pre{
color:#22c55e;
}

`}</style>

</div>

)

}
