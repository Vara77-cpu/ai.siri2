"use client"

import { useState, useEffect } from "react"
import VantaBackground from "@/app/components/VantaBackground"
import AuroraGlow from "@/app/components/AuroraGlow"
import ResultsTicker from "@/app/components/ResultsTicker"

export default function ResultsPage(){

const [exam,setExam] = useState("ssc")
const [hallTicket,setHallTicket] = useState("")
const [loading,setLoading] = useState(false)
const [result,setResult] = useState<any>(null)
const [error,setError] = useState("")
const [latest,setLatest] = useState<any[]>([])

const [name,setName] = useState("")
const [nameResults,setNameResults] = useState<any[]>([])

useEffect(()=>{

async function loadLatest(){

try{
const res = await fetch("/api/latest-results")
const data = await res.json()
setLatest(data)
}catch{
console.log("Failed to load latest results")
}

}

loadLatest()

},[])

const selectExam = (examName:string)=>{
setExam(examName)

window.scrollTo({
top:200,
behavior:"smooth"
})
}

const checkResult = async ()=>{

if(!hallTicket.trim()){
setError("Enter hall ticket number")
return
}

setLoading(true)
setError("")
setResult(null)

try{

const res = await fetch("/api/results",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({exam,hallTicket})
})

const data = await res.json()

if(!data.success){
setError("Result not found")
}else{
setResult(data.result)
}

}catch{
setError("Unable to fetch result")
}

setLoading(false)

}

const searchByName = async ()=>{

if(!name.trim()) return

const res = await fetch("/api/results/search-by-name",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({name})
})

const data = await res.json()

setNameResults(data.results)

}

return(

<div style={{
minHeight:"100vh",
background:"#020617",
color:"white",
padding:"60px",
fontFamily:"system-ui",
position:"relative",
overflow:"hidden"
}}>

<VantaBackground/>
<AuroraGlow/>

<div style={{
position:"relative",
zIndex:2,
maxWidth:"1100px",
margin:"0 auto",
display:"flex",
flexDirection:"column",
alignItems:"center",
textAlign:"center"
}}>

<ResultsTicker/>

<h1 style={{fontSize:"42px",marginTop:"20px"}}>
AP Results Portal
</h1>

<p style={{color:"#94a3b8"}}>
Check Andhra Pradesh school, university and entrance exam results
</p>

{/* SEARCH BY HALLTICKET */}

<div style={{
marginTop:"40px",
maxWidth:"520px",
width:"100%",
background:"rgba(255,255,255,0.05)",
border:"1px solid rgba(255,255,255,0.15)",
backdropFilter:"blur(20px)",
padding:"30px",
borderRadius:"16px"
}}>

<h2>Search Result</h2>

<select
value={exam}
onChange={(e)=>setExam(e.target.value)}
style={{
width:"100%",
padding:"12px",
marginTop:"15px",
marginBottom:"15px",
background:"#000",
color:"white"
}}

>

<option value="ssc">AP SSC</option>
<option value="inter">AP Intermediate</option>
<option value="jntuk">JNTUK</option>
<option value="jntua">JNTUA</option>
<option value="anu">ANU</option>

<option value="au">Andhra University</option>
<option value="svu">SVU University</option>
<option value="sku">SKU University</option>

<option value="rgukt">RGUKT</option>

<option value="pgecet">PGECET</option>
<option value="ecet">ECET</option>
<option value="eamcet">EAMCET</option>

<option value="neet">NEET</option>
<option value="jee">JEE</option>

</select>

<input
placeholder="Enter Hall Ticket Number"
value={hallTicket}
onChange={(e)=>setHallTicket(e.target.value)}
style={{
width:"100%",
padding:"12px",
marginBottom:"15px",
background:"#000",
border:"1px solid #333",
color:"white"
}}
/>

<button
onClick={checkResult}
style={{
width:"100%",
padding:"14px",
background:"linear-gradient(90deg,#9333ea,#c026d3)",
border:"none",
borderRadius:"8px",
color:"white",
cursor:"pointer",
fontWeight:"600"
}}

>

{loading ? "Searching..." : "Check Result"}

</button>

{error && (

<p style={{marginTop:"10px",color:"#ef4444"}}>
{error}
</p>

)}

</div>

{/* SEARCH BY NAME */}

<div style={{
marginTop:"30px",
maxWidth:"520px",
width:"100%",
background:"rgba(255,255,255,0.05)",
border:"1px solid rgba(255,255,255,0.15)",
backdropFilter:"blur(20px)",
padding:"30px",
borderRadius:"16px"
}}>

<h2>Search Result by Student Name</h2>

<input
placeholder="Enter Student Name"
value={name}
onChange={(e)=>setName(e.target.value)}
style={{
width:"100%",
padding:"12px",
marginTop:"15px",
marginBottom:"15px",
background:"#000",
border:"1px solid #333",
color:"white"
}}
/>

<button
onClick={searchByName}
style={{
width:"100%",
padding:"14px",
background:"#2563eb",
border:"none",
borderRadius:"8px",
color:"white",
cursor:"pointer"
}}

>

Search Student

</button>

{nameResults.length > 0 && (

<div style={{marginTop:"20px"}}>

{nameResults.map((s,i)=>(

<div
key={i}
onClick={()=>{
setHallTicket(s.hallTicket)
setExam(s.exam)
window.scrollTo({top:200,behavior:"smooth"})
}}
style={{
background:"rgba(255,255,255,0.05)",
border:"1px solid rgba(255,255,255,0.15)",
padding:"15px",
borderRadius:"10px",
marginBottom:"10px",
cursor:"pointer"
}}
>

<p><b>{s.name}</b></p>
<p>Hall Ticket: {s.hallTicket}</p>
<p>Marks: {s.marks}</p>

</div>

))}

</div>

)}

</div>

{/* RESULT CARD */}

{result && (

<div style={{
marginTop:"40px",
background:"rgba(255,255,255,0.05)",
border:"1px solid rgba(255,255,255,0.15)",
backdropFilter:"blur(20px)",
padding:"25px",
borderRadius:"16px",
maxWidth:"520px",
width:"100%"
}}>

<h2 style={{color:"#c084fc"}}>
{result.name}
</h2>

<p>Hall Ticket: {result.hallTicket}</p>
<p>Marks: {result.marks}</p>
<p>Status: {result.status}</p>

</div>

)}

{/* LATEST RESULTS */}

<h2 style={{marginTop:"80px"}}>Latest Results</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",
gap:"20px",
marginTop:"30px",
width:"100%"
}}>

{latest.map((r,i)=>(

<div
key={i}
onClick={()=>selectExam(r.exam)}
style={card}
>

<h3>{r.title}</h3>
<p style={{color:"#94a3b8"}}>{r.date}</p>

</div>

))}

</div>

{/* UNIVERSITY RESULTS */}

<h2 style={{marginTop:"80px"}}>University Results</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",
gap:"20px",
marginTop:"30px",
width:"100%"
}}>

<div onClick={()=>selectExam("au")} style={card}>Andhra University</div>
<div onClick={()=>selectExam("svu")} style={card}>SVU University</div>
<div onClick={()=>selectExam("sku")} style={card}>SKU University</div>
<div onClick={()=>selectExam("anu")} style={card}>ANU Degree</div>

</div>

{/* ENTRANCE EXAMS */}

<h2 style={{marginTop:"80px"}}>Entrance Exams</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",
gap:"20px",
marginTop:"30px",
width:"100%"
}}>

<div onClick={()=>selectExam("eamcet")} style={card}>AP EAMCET</div>
<div onClick={()=>selectExam("ecet")} style={card}>AP ECET</div>
<div onClick={()=>selectExam("pgecet")} style={card}>AP PGECET</div>
<div onClick={()=>selectExam("neet")} style={card}>NEET</div>
<div onClick={()=>selectExam("jee")} style={card}>JEE</div>

</div>

</div>

</div>

)

}

const card = {
background:"rgba(255,255,255,0.05)",
border:"1px solid rgba(255,255,255,0.15)",
padding:"20px",
borderRadius:"14px",
cursor:"pointer"
}
