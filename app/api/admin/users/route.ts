import { NextResponse } from "next/server"
import { supabase } from "@/app/lib/supabase"

/* GET USERS */
export async function GET(){
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at",{ ascending:false })

  return NextResponse.json(data || [])
}