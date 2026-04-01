import { NextResponse } from "next/server"
import { supabase } from "@/app/lib/supabase"

/* GET ALL */
export async function GET(){
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .order("created_at", { ascending:false })

  if(error) return NextResponse.json([])
  return NextResponse.json(data)
}

/* CREATE */
export async function POST(req:Request){

  const body = await req.json()

  const { error } = await supabase
    .from("lessons")
    .insert([body])

  if(error) return NextResponse.json({ success:false })

  return NextResponse.json({ success:true })
}

/* UPDATE */
export async function PUT(req:Request){

  const body = await req.json()

  const { error } = await supabase
    .from("lessons")
    .update({
      title: body.title,
      subject: body.subject,
      unit: body.unit,
      video_url: body.video_url
    })
    .eq("id", body.id)

  if(error) return NextResponse.json({ success:false })

  return NextResponse.json({ success:true })
}

/* DELETE */
export async function DELETE(req:Request){

  const { id } = await req.json()

  const { error } = await supabase
    .from("lessons")
    .delete()
    .eq("id", id)

  if(error) return NextResponse.json({ success:false })

  return NextResponse.json({ success:true })
}