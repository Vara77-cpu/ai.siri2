import { NextResponse } from "next/server"
import { supabase } from "@/app/lib/supabase"

export async function GET(req: Request){

  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q")?.toLowerCase() || ""

  if(!query) return NextResponse.json([])

  const { data, error } = await supabase
    .from("lessons")
    .select("*")

  if(error) return NextResponse.json([])

  const results = data.filter((l:any)=>
    l.title.toLowerCase().includes(query) ||
    l.subject.toLowerCase().includes(query) ||
    l.unit.toLowerCase().includes(query)
  )

  return NextResponse.json(results.slice(0,10))
}