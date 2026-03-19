"use client"

import VantaBackground from "@/app/components/VantaBackground"
import AuroraGlow from "@/app/components/AuroraGlow"

export default function RoadmapsPage(){

return(

<div className="page">

<VantaBackground/>
<AuroraGlow/>

<div className="content">

<h1>Study Roadmaps</h1>

<p>Structured learning paths will appear here.</p>

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

`}</style>

</div>

)

}
