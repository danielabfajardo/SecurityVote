import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const type = searchParams.get("type")

    if (id) {
      // Get a specific public report
      const { data, error } = await supabase.from("public_reports").select("*").eq("id", id).single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json(data)
    } else if (type) {
      // Get public reports by type
      const { data, error } = await supabase
        .from("public_reports")
        .select("*")
        .eq("type", type)
        .order("date", { ascending: false })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json(data)
    } else {
      // Get all public reports
      const { data, error } = await supabase.from("public_reports").select("*").order("date", { ascending: false })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json(data)
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

