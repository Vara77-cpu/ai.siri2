import { NextResponse } from "next/server"
import { supabase } from "../../../lib/supabase"

export async function POST(req: Request){

try{

const { email } = await req.json()

const { data } = await supabase
.from("progress")
.select("*")
.eq("email", email)
.order("created_at", { ascending: false })
.limit(1)

return NextResponse.json({
last: data?.[0] || null
})

}catch(e){

console.log(e)

return NextResponse.json({ last: null })

}

}
