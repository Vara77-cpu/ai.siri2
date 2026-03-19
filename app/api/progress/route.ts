import { NextResponse } from "next/server"
import { supabase } from "../../lib/supabase"

export async function POST(req: Request){

try{

const { email, board, classId, subject, unit, lesson } = await req.json()

/* CHECK IF ALREADY EXISTS */

const { data: existing } = await supabase
.from("progress")
.select("*")
.eq("email", email)
.eq("lesson", lesson)
.single()

if(existing){
return NextResponse.json({ message: "Already saved" })
}

/* INSERT NEW DATA */

const { error } = await supabase
.from("progress")
.insert([{
email,
board,
classId,
subject,
unit,
lesson
}])

if(error){
return NextResponse.json({ error: error.message })
}

return NextResponse.json({ success: true })

}catch(e){
return NextResponse.json({ error: "Failed to save progress" })
}

}
