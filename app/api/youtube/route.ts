import { NextResponse } from "next/server"

export async function GET(req: Request){

try{

const { searchParams } = new URL(req.url)
const lesson = searchParams.get("lesson") || "kids learning"

/* 🔑 API KEY */
const apiKey = process.env.YOUTUBE_API_KEY

if(!apiKey){
console.log("❌ NO API KEY")
return NextResponse.json({ items: [] })
}

/* 🔥 FIXED QUERY */
const query = `${lesson} for kids nursery education drawing lines`

const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&videoEmbeddable=true&q=${encodeURIComponent(query)}&key=${apiKey}`

const res = await fetch(url)

/* 🔥 LOG FULL RESPONSE */
const data = await res.json()
console.log("YOUTUBE API RESPONSE:", data)

/* ❌ IF ERROR */
if(data.error){
console.log("❌ YT ERROR:", data.error)
return NextResponse.json({ items: [] })
}

/* ✅ FILTER VALID VIDEOS */
const items = (data.items || []).filter((v:any)=>
v.id?.videoId &&
v.snippet?.thumbnails?.medium?.url
)

return NextResponse.json({ items })

}catch(e){
console.log("❌ SERVER ERROR:", e)
return NextResponse.json({ items: [] })
}

}