"use client"

import VantaBackground from "@/app/components/VantaBackground"
import AuroraGlow from "@/app/components/AuroraGlow"

export default function NotesPage(){

const notes = [
{title:"Maths Notes",file:"#"},
{title:"Physics Notes",file:"#"},
{title:"Chemistry Notes",file:"#"},
{title:"Computer Science Notes",file:"#"}
]

return(

<div className="page">

<VantaBackground/>
<AuroraGlow/>

<div className="content">

<h1 className="title">Study Notes</h1>

<p className="subtitle">
Download subject wise notes
</p>

<div className="grid">

{notes.map((note,i)=>(

<div key={i} className="card">

<h3>{note.title}</h3>

<a href={note.file} download>
Download
</a>

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
text-align:center;
}

.title{
font-size:42px;
margin-bottom:10px;
}

.subtitle{
color:#94a3b8;
margin-bottom:50px;
}

.grid{
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

a{
background:#9333ea;
padding:10px 18px;
border-radius:8px;
text-decoration:none;
color:white;
}

`}</style>

</div>

)

}
