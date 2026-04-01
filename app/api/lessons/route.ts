import { NextResponse } from "next/server"
import { supabase } from "@/app/lib/supabase"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)

    const subject = url.searchParams.get("subject")
    const unit = url.searchParams.get("unit")

    let query = supabase.from("lessons").select("*")

    // ✅ apply filters safely
    if (subject) {
      query = query.eq("subject", subject)
    }

    if (unit) {
      query = query.eq("unit", unit)
    }

    // ✅ execute query
    const { data, error } = await query.order("created_at", {
      ascending: true
    })

    if (error) {
      console.error("LESSONS API ERROR:", error)
      return NextResponse.json([], { status: 200 })
    }

    return NextResponse.json(data || [], { status: 200 })

  } catch (err) {
    console.error("SERVER ERROR:", err)

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}