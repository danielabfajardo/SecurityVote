import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    if (type === "alerts") {
      // Get fraud alerts
      const { data, error } = await supabase.from("fraud_alerts").select("*").order("date", { ascending: false })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json(data)
    } else if (type === "patterns") {
      // Get fraud patterns
      const { data, error } = await supabase.rpc("get_fraud_patterns")

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json(data)
    } else if (type === "trends") {
      // Get fraud trends
      const { data, error } = await supabase.rpc("get_fraud_trends")

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json(data)
    } else {
      // Default to alerts
      const { data, error } = await supabase.from("fraud_alerts").select("*").order("date", { ascending: false })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json(data)
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

