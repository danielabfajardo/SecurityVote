import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (id) {
      // Get a specific approval request
      const { data, error } = await supabase.from("approval_requests").select("*").eq("id", id).single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json(data)
    } else {
      // Get all approval requests
      const { data, error } = await supabase.from("approval_requests").select("*").order("date", { ascending: false })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json(data)
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const body = await request.json()
    const { role, status, rejectionReason } = body

    // First get the current request
    const { data: currentRequest, error: fetchError } = await supabase
      .from("approval_requests")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 400 })
    }

    // Update the approval status for the specified role
    const updatedApprovals = currentRequest.approvals.map((approval: any) => {
      if (approval.role === role) {
        return { ...approval, status }
      }
      return approval
    })

    // Check if all approvals are complete
    const allApproved = updatedApprovals.every((a: any) => a.status === "approved")
    const anyRejected = updatedApprovals.some((a: any) => a.status === "rejected")

    let requestStatus = currentRequest.status
    if (allApproved) {
      requestStatus = "approved"
    } else if (anyRejected) {
      requestStatus = "rejected"
    }

    // Update the request
    const { data, error } = await supabase
      .from("approval_requests")
      .update({
        approvals: updatedApprovals,
        status: requestStatus,
        rejection_reason: rejectionReason || currentRequest.rejection_reason,
      })
      .eq("id", id)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data[0])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

