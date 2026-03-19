"use client"

import Link from "next/link"

export default function BoardPage(){

return(

<div style={{padding:40,color:"white"}}>

<h1>Select Your Board</h1>

<div style={{marginTop:20}}>
<Link href="/board/cbse">CBSE</Link>
</div>

<div style={{marginTop:20}}>
<Link href="/board/state">State Board</Link>
</div>

<div style={{marginTop:20}}>
<Link href="/board/icse">ICSE</Link>
</div>

</div>

)

}