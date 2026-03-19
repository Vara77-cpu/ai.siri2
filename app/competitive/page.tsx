"use client"

import VantaBackground from "@/app/components/VantaBackground"
import AuroraGlow from "@/app/components/AuroraGlow"

export default function CompetitivePage(){

return(

<div className="page">

<VantaBackground/>
<AuroraGlow/>

<div className="content">

<h1 className="title">Competitive Exams</h1>

<p className="subtitle">
Prepare for top government and entrance exams
</p>

<div className="grid">

<div className="card">UPSC</div>
<div className="card">SSC</div>
<div className="card">Banking</div>
<div className="card">Railways</div>
<div className="card">State PSC</div>
<div className="card">Defence</div>

</div>

</div>

<style jsx>{`

.page{
min-height:100vh;
background:#020617;
padding:80px;
color:white;
position:relative;
}

.content{
position:relative;
z-index:2;
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
grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
gap:30px;
}

.card{
background:rgba(255,255,255,.06);
border:1px solid rgba(255,255,255,.18);
backdrop-filter:blur(30px);
border-radius:22px;
padding:40px;
font-size:20px;
font-weight:600;
transition:.3s;
}

.card:hover{
transform:translateY(-8px);
box-shadow:0 0 30px rgba(124,58,237,.5);
}

`}</style>

</div>

)

}
