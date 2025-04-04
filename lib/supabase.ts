import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type User = {
  id: string
  email: string
  role: "admin" | "user"
  name: string
  created_at: string
}

export type WhistleblowerReport = {
  id: string
  title: string
  description: string
  category: string
  agency: string
  status: "unverified" | "investigating" | "verified" | "rejected"
  is_anonymous: boolean
  submitter_email?: string
  submitter_name?: string
  submitter_phone?: string
  submitter_organization?: string
  created_at: string
  evidence_urls?: string[]
}

export type BudgetTransaction = {
  id: string
  description: string
  date: string
  amount: number
  agency: string
  status: "approved" | "flagged" | "rejected"
  risk: "low" | "medium" | "high"
  created_at: string
}

export type ApprovalRequest = {
  id: string
  description: string
  date: string
  amount: number
  agency: string
  status: "pending" | "approved" | "rejected"
  approvals: {
    role: string
    status: "pending" | "approved" | "rejected"
    name: string
  }[]
  rejection_reason?: string
  created_at: string
}

export type FraudAlert = {
  id: string
  description: string
  date: string
  amount: number
  agency: string
  risk_score: number
  status: "high" | "medium" | "low"
  pattern: string
  created_at: string
}

export type PublicReport = {
  id: string
  title: string
  date: string
  type: "financial" | "audit" | "sustainability"
  agency: string
  format: string
  size: string
  file_url: string
  created_at: string
}

// API functions
export async function submitWhistleblowerReport(report: Omit<WhistleblowerReport, "id" | "created_at" | "status">) {
  const { data, error } = await supabase
    .from("whistleblower_reports")
    .insert({
      ...report,
      status: "unverified",
    })
    .select()

  if (error) throw error
  return data?.[0]
}

export async function getWhistleblowerReport(id: string) {
  const { data, error } = await supabase.from("whistleblower_reports").select("*").eq("id", id).single()

  if (error) throw error
  return data as WhistleblowerReport
}

export async function getPublicReports() {
  const { data, error } = await supabase.from("public_reports").select("*").order("date", { ascending: false })

  if (error) throw error
  return data as PublicReport[]
}

export async function getBudgetTransactions() {
  const { data, error } = await supabase.from("budget_transactions").select("*").order("date", { ascending: false })

  if (error) throw error
  return data as BudgetTransaction[]
}

export async function getFraudAlerts() {
  const { data, error } = await supabase.from("fraud_alerts").select("*").order("date", { ascending: false })

  if (error) throw error
  return data as FraudAlert[]
}

export async function getApprovalRequests() {
  const { data, error } = await supabase.from("approval_requests").select("*").order("date", { ascending: false })

  if (error) throw error
  return data as ApprovalRequest[]
}

export async function updateApprovalStatus(id: string, role: string, status: "approved" | "rejected") {
  const { data: currentRequest, error: fetchError } = await supabase
    .from("approval_requests")
    .select("*")
    .eq("id", id)
    .single()

  if (fetchError) throw fetchError

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

  const { data, error } = await supabase
    .from("approval_requests")
    .update({
      approvals: updatedApprovals,
      status: requestStatus,
    })
    .eq("id", id)
    .select()

  if (error) throw error
  return data?.[0]
}

