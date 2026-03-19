"use client"

import VantaBackground from "@/app/components/VantaBackground"
import AuroraGlow from "@/app/components/AuroraGlow"

export default function PapersPage(){

const papers=[
{title:"SSC Maths 2024 Paper"},
{title:"SSC Science 2023 Paper"},
{title:"Intermediate Physics Paper"},
{title:"JNTU Previous Question Paper"}
]

return(

<div className="page">

<VantaBackground/>
<AuroraGlow/>

<div className="content">

<h1>Previous Papers</h1>

<div className="grid">

{papers.map((p,i)=>(

<div key={i} className="card">

<h3>{p.title}</h3>

<button>Download</button>

</div>

))}

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

.grid{
margin-top:40px;
display:grid;
gap:20px;
}

.card{
background:rgba(255,255,255,.06);
border:1px solid rgba(255,255,255,.18);
padding:25px;
border-radius:18px;
display:flex;
justify-content:space-between;
align-items:center;
}

button{
background:#9333ea;
border:none;
padding:10px 18px;
border-radius:8px;
color:white;
cursor:pointer;
}

`}</style>

</div>

)

}
