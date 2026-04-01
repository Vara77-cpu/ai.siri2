"use client"

import { useEffect, useState } from "react"

export default function ResultsTicker(){

const [results,setResults] = useState<any[]>([])

async function loadResults(){

try{

const res = await fetch("/api/result-detector")

const data = await res.json()

setResults(data)

}catch{

console.log("failed to load results")

}

}

useEffect(()=>{

loadResults()

// refresh every 60 seconds

const interval = setInterval(()=>{

loadResults()

},60000)

return ()=>clearInterval(interval)

},[])

if(results.length === 0) return null

return(

<div style={{
width:"100%",
background:"linear-gradient(90deg,#9333ea,#c026d3)",
padding:"10px",
whiteSpace:"nowrap",
overflow:"hidden",
borderRadius:"10px"
}}>

<div style={{
display:"inline-block",
animation:"scroll 30s linear infinite"
}}>

{results.map((r,i)=>(
<span key={i} style={{marginRight:"60px",fontWeight:"500"}}>
🔔 {r.title} ({r.date}) </span>
))}

</div>

<style jsx>{`

@keyframes scroll{
0%{transform:translateX(100%)}
100%{transform:translateX(-100%)}
}

`}</style>

</div>

)

}
