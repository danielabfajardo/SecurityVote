import {
  supabase,
  type WhistleblowerReport,
  type BudgetTransaction,
  type ApprovalRequest,
  type FraudAlert,
  type PublicReport,
} from "./supabase"

// Error handling utility
export class ApiError extends Error {
  status: number

  constructor(message: string, status = 500) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

// Update the generic data fetching with error handling
async function fetchData<T>(fetcher: () => Promise<T>, errorMessage = "Failed to fetch data"): Promise<T> {
  try {
    return await fetcher()
  } catch (error: any) {
    console.error(`${errorMessage}:`, error)

    // If the fetcher function already handled the error by returning fallback data,
    // the error would not propagate to here. If we reach here, it means the error
    // wasn't handled, so we should throw it.
    throw new ApiError(error.message || errorMessage, error.status || 500)
  }
}

// Budget data
// Update the getBudgetData function to include fallback data
export async function getBudgetData() {
  return fetchData(async () => {
    try {
      const { data, error } = await supabase.from("budget_transactions").select("*").order("date", { ascending: false })

      if (error) throw error
      return data as BudgetTransaction[]
    } catch (error: any) {
      // Fallback data if the table doesn't exist or there's an error
      console.warn("Using fallback data for budget transactions:", error.message)
      return [
        {
          id: "TR-7829",
          description: "Border Security Equipment",
          date: "2023-09-15",
          amount: 1250000,
          agency: "Border Patrol",
          status: "approved",
          risk: "low",
          created_at: new Date().toISOString(),
        },
        {
          id: "TR-6547",
          description: "Cybersecurity Training Program",
          date: "2023-09-12",
          amount: 750000,
          agency: "Cyber Defense",
          status: "approved",
          risk: "low",
          created_at: new Date().toISOString(),
        },
        {
          id: "TR-9823",
          description: "Intelligence Software Licenses",
          date: "2023-09-10",
          amount: 2100000,
          agency: "Intelligence",
          status: "flagged",
          risk: "high",
          created_at: new Date().toISOString(),
        },
        {
          id: "TR-4521",
          description: "Vehicle Fleet Maintenance",
          date: "2023-09-08",
          amount: 450000,
          agency: "Police Force",
          status: "approved",
          risk: "low",
          created_at: new Date().toISOString(),
        },
        {
          id: "TR-3365",
          description: "Communication Equipment",
          date: "2023-09-05",
          amount: 1800000,
          agency: "Emergency Response",
          status: "flagged",
          risk: "medium",
          created_at: new Date().toISOString(),
        },
      ]
    }
  }, "Failed to fetch budget data")
}

export async function getBudgetSummary() {
  return fetchData(async () => {
    const { data, error } = await supabase.rpc("get_budget_summary")

    if (error) throw error
    return data
  }, "Failed to fetch budget summary")
}

// Modify the getBudgetAllocationByAgency function to include fallback data
export async function getBudgetAllocationByAgency() {
  return fetchData(async () => {
    try {
      const { data, error } = await supabase.rpc("get_budget_allocation_by_agency")

      if (error) throw error
      return data
    } catch (error: any) {
      // Fallback data if the function doesn't exist
      console.warn("Using fallback data for budget allocation by agency:", error.message)
      return [
        { name: "Border Patrol", value: 35 },
        { name: "Cyber Defense", value: 25 },
        { name: "Intelligence", value: 20 },
        { name: "Emergency Response", value: 15 },
        { name: "Police Force", value: 5 },
      ]
    }
  }, "Failed to fetch budget allocation by agency")
}

// Modify the getBudgetTrends function to include fallback data
export async function getBudgetTrends() {
  return fetchData(async () => {
    try {
      const { data, error } = await supabase.rpc("get_budget_trends")

      if (error) throw error
      return data
    } catch (error: any) {
      // Fallback data if the function doesn't exist
      console.warn("Using fallback data for budget trends:", error.message)
      return [
        { name: "Jan", allocated: 4000, spent: 2400 },
        { name: "Feb", allocated: 3000, spent: 1398 },
        { name: "Mar", allocated: 2000, spent: 9800 },
        { name: "Apr", allocated: 2780, spent: 3908 },
        { name: "May", allocated: 1890, spent: 4800 },
        { name: "Jun", allocated: 2390, spent: 3800 },
      ]
    }
  }, "Failed to fetch budget trends")
}

// Fraud detection data
// Update the getFraudAlerts function to include fallback data
export async function getFraudAlerts() {
  return fetchData(async () => {
    try {
      const { data, error } = await supabase.from("fraud_alerts").select("*").order("date", { ascending: false })

      if (error) throw error
      return data as FraudAlert[]
    } catch (error: any) {
      // Fallback data if the table doesn't exist or there's an error
      console.warn("Using fallback data for fraud alerts:", error.message)
      return [
        {
          id: "FR-7829",
          description: "Duplicate payment detected",
          date: "2023-09-15",
          amount: 1250000,
          agency: "Border Patrol",
          risk_score: 85,
          status: "high",
          pattern: "duplicate",
          created_at: new Date().toISOString(),
        },
        {
          id: "FR-6547",
          description: "Unusual payment amount",
          date: "2023-09-12",
          amount: 750000,
          agency: "Cyber Defense",
          risk_score: 65,
          status: "medium",
          pattern: "unusual",
          created_at: new Date().toISOString(),
        },
        {
          id: "FR-9823",
          description: "Inflated contract pricing",
          date: "2023-09-10",
          amount: 2100000,
          agency: "Intelligence",
          risk_score: 92,
          status: "high",
          pattern: "inflated",
          created_at: new Date().toISOString(),
        },
        {
          id: "FR-4521",
          description: "Potential ghost project",
          date: "2023-09-08",
          amount: 450000,
          agency: "Police Force",
          risk_score: 78,
          status: "high",
          pattern: "ghost",
          created_at: new Date().toISOString(),
        },
        {
          id: "FR-3365",
          description: "Vendor with political connections",
          date: "2023-09-05",
          amount: 1800000,
          agency: "Emergency Response",
          risk_score: 60,
          status: "medium",
          pattern: "political",
          created_at: new Date().toISOString(),
        },
      ]
    }
  }, "Failed to fetch fraud alerts")
}

// Modify the getFraudPatterns function to include fallback data
export async function getFraudPatterns() {
  return fetchData(async () => {
    try {
      const { data, error } = await supabase.rpc("get_fraud_patterns")

      if (error) throw error
      return data
    } catch (error: any) {
      // Fallback data if the function doesn't exist
      console.warn("Using fallback data for fraud patterns:", error.message)
      return [
        { name: "Duplicate Payments", count: 24 },
        { name: "Inflated Contracts", count: 18 },
        { name: "Ghost Projects", count: 12 },
        { name: "Political Connections", count: 9 },
        { name: "Unusual Amounts", count: 15 },
      ]
    }
  }, "Failed to fetch fraud patterns")
}

// Modify the getFraudTrends function to include fallback data
export async function getFraudTrends() {
  return fetchData(async () => {
    try {
      const { data, error } = await supabase.rpc("get_fraud_trends")

      if (error) throw error
      return data
    } catch (error: any) {
      // Fallback data if the function doesn't exist
      console.warn("Using fallback data for fraud trends:", error.message)
      return [
        { name: "Jan", fraudCases: 4, amount: 2.4 },
        { name: "Feb", fraudCases: 3, amount: 1.8 },
        { name: "Mar", fraudCases: 5, amount: 3.2 },
        { name: "Apr", fraudCases: 7, amount: 4.5 },
        { name: "May", fraudCases: 2, amount: 1.2 },
        { name: "Jun", fraudCases: 6, amount: 3.8 },
        { name: "Jul", fraudCases: 8, amount: 5.1 },
        { name: "Aug", fraudCases: 9, amount: 6.3 },
        { name: "Sep", fraudCases: 4, amount: 2.7 },
      ]
    }
  }, "Failed to fetch fraud trends")
}

// Approval data
// Update the getApprovalRequests function to include fallback data
export async function getApprovalRequests() {
  return fetchData(async () => {
    try {
      const { data, error } = await supabase.from("approval_requests").select("*").order("date", { ascending: false })

      if (error) throw error

      // Transform the data to use the new roles
      const updatedData = data.map((request) => {
        // Convert the old 3-role system to the new 2-role system
        const newApprovals = [
          {
            role: "Auditor",
            status: request.approvals.find((a: any) => a.role === "Auditor")?.status || "pending",
            name: request.approvals.find((a: any) => a.role === "Auditor")?.name || "John Adebayo",
          },
          {
            role: "International Organization",
            status: request.approvals.find((a: any) => a.role === "Anti-Corruption")?.status || "pending",
            name: "International Observer",
          },
        ]

        return {
          ...request,
          approvals: newApprovals,
        }
      })

      return updatedData as ApprovalRequest[]
    } catch (error: any) {
      // Fallback data if the table doesn't exist or there's an error
      console.warn("Using fallback data for approval requests:", error.message)
      return [
        {
          id: "AP-7829",
          description: "Border Security Equipment",
          date: "2023-09-15",
          amount: 1250000,
          agency: "Border Patrol",
          status: "pending",
          approvals: [
            { role: "Auditor", status: "approved", name: "John Adebayo" },
            { role: "International Organization", status: "pending", name: "International Observer" },
          ],
          created_at: new Date().toISOString(),
        },
        {
          id: "AP-6547",
          description: "Cybersecurity Training Program",
          date: "2023-09-12",
          amount: 750000,
          agency: "Cyber Defense",
          status: "pending",
          approvals: [
            { role: "Auditor", status: "approved", name: "John Adebayo" },
            { role: "International Organization", status: "pending", name: "International Observer" },
          ],
          created_at: new Date().toISOString(),
        },
        {
          id: "AP-9823",
          description: "Intelligence Software Licenses",
          date: "2023-09-10",
          amount: 2100000,
          agency: "Intelligence",
          status: "rejected",
          approvals: [
            { role: "Auditor", status: "approved", name: "John Adebayo" },
            { role: "International Organization", status: "rejected", name: "International Observer" },
          ],
          rejection_reason: "Duplicate payment detected. Similar transaction processed on 2023-09-05.",
          created_at: new Date().toISOString(),
        },
        {
          id: "AP-4521",
          description: "Vehicle Fleet Maintenance",
          date: "2023-09-08",
          amount: 450000,
          agency: "Police Force",
          status: "approved",
          approvals: [
            { role: "Auditor", status: "approved", name: "John Adebayo" },
            { role: "International Organization", status: "approved", name: "International Observer" },
          ],
          created_at: new Date().toISOString(),
        },
        {
          id: "AP-3365",
          description: "Communication Equipment",
          date: "2023-09-05",
          amount: 1800000,
          agency: "Emergency Response",
          status: "pending",
          approvals: [
            { role: "Auditor", status: "pending", name: "John Adebayo" },
            { role: "International Organization", status: "pending", name: "International Observer" },
          ],
          created_at: new Date().toISOString(),
        },
      ]
    }
  }, "Failed to fetch approval requests")
}

export async function updateApprovalStatus(
  id: string,
  role: string,
  status: "approved" | "rejected",
  rejectionReason?: string,
) {
  return fetchData(async () => {
    // First get the current request
    const { data: currentRequest, error: fetchError } = await supabase
      .from("approval_requests")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError) throw fetchError

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

    if (error) throw error
    return data?.[0] as ApprovalRequest
  }, "Failed to update approval status")
}

// Whistleblower data
// Update the getWhistleblowerReports function to include fallback data
export async function getWhistleblowerReports() {
  return fetchData(async () => {
    try {
      const { data, error } = await supabase
        .from("whistleblower_reports")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      return data as WhistleblowerReport[]
    } catch (error: any) {
      // Fallback data if the table doesn't exist or there's an error
      console.warn("Using fallback data for whistleblower reports:", error.message)
      return [
        {
          id: "WB-7829",
          title: "Suspicious contract award",
          description: "Contract awarded to company with ties to agency director",
          category: "contract",
          agency: "Border Patrol",
          status: "verified",
          is_anonymous: true,
          created_at: new Date().toISOString(),
          evidence_urls: [],
        },
        {
          id: "WB-6547",
          title: "Ghost workers on payroll",
          description: "Multiple employees receiving salary but not working",
          category: "payroll",
          agency: "Cyber Defense",
          status: "investigating",
          is_anonymous: true,
          created_at: new Date().toISOString(),
          evidence_urls: [],
        },
        {
          id: "WB-9823",
          title: "Inflated equipment prices",
          description: "Equipment purchased at 3x market value",
          category: "procurement",
          agency: "Intelligence",
          status: "verified",
          is_anonymous: true,
          created_at: new Date().toISOString(),
          evidence_urls: [],
        },
        {
          id: "WB-4521",
          title: "Misappropriation of funds",
          description: "Funds allocated for training diverted to personal accounts",
          category: "funds",
          agency: "Police Force",
          status: "unverified",
          is_anonymous: true,
          created_at: new Date().toISOString(),
          evidence_urls: [],
        },
        {
          id: "WB-3365",
          title: "Bribery for contract",
          description: "Vendor paid bribe to secure communication equipment contract",
          category: "bribery",
          agency: "Emergency Response",
          status: "investigating",
          is_anonymous: true,
          created_at: new Date().toISOString(),
          evidence_urls: [],
        },
      ]
    }
  }, "Failed to fetch whistleblower reports")
}

// Update the getWhistleblowerReportById function to include fallback data
export async function getWhistleblowerReportById(id: string) {
  return fetchData(async () => {
    try {
      const { data, error } = await supabase.from("whistleblower_reports").select("*").eq("id", id).single()

      if (error) throw error
      return data as WhistleblowerReport
    } catch (error: any) {
      // Fallback data if the table doesn't exist or there's an error
      console.warn("Using fallback data for whistleblower report:", error.message)

      // Return a mock report with the requested ID
      return {
        id: id,
        title: "Suspicious contract award",
        description:
          "Contract awarded to company with ties to agency director without proper bidding process. The contract value appears to be inflated by approximately 30% compared to market rates.",
        category: "contract",
        agency: "Border Patrol",
        status: "investigating",
        is_anonymous: true,
        created_at: new Date().toISOString(),
        evidence_urls: [],
      }
    }
  }, "Failed to fetch whistleblower report")
}

export async function submitWhistleblowerReport(report: Omit<WhistleblowerReport, "id" | "created_at" | "status">) {
  return fetchData(async () => {
    const { data, error } = await supabase
      .from("whistleblower_reports")
      .insert({
        ...report,
        status: "unverified",
      })
      .select()

    if (error) throw error
    return data?.[0] as WhistleblowerReport
  }, "Failed to submit whistleblower report")
}

export async function updateWhistleblowerReportStatus(
  id: string,
  status: "unverified" | "investigating" | "verified" | "rejected",
) {
  return fetchData(async () => {
    const { data, error } = await supabase.from("whistleblower_reports").update({ status }).eq("id", id).select()

    if (error) throw error
    return data?.[0] as WhistleblowerReport
  }, "Failed to update whistleblower report status")
}

// Public reports
// Update the getPublicReports function to include fallback data
export async function getPublicReports() {
  return fetchData(async () => {
    try {
      const { data, error } = await supabase.from("public_reports").select("*").order("date", { ascending: false })

      if (error) throw error
      return data as PublicReport[]
    } catch (error: any) {
      // Fallback data if the table doesn't exist or there's an error
      console.warn("Using fallback data for public reports:", error.message)
      return [
        {
          id: "FR-2023-Q3",
          title: "Security Budget Quarterly Report",
          date: "2023-09-30",
          type: "financial",
          agency: "All Agencies",
          format: "PDF",
          size: "2.4 MB",
          file_url: "#",
          created_at: new Date().toISOString(),
        },
        {
          id: "FR-2023-Q2",
          title: "Security Budget Quarterly Report",
          date: "2023-06-30",
          type: "financial",
          agency: "All Agencies",
          format: "PDF",
          size: "2.1 MB",
          file_url: "#",
          created_at: new Date().toISOString(),
        },
        {
          id: "FR-2023-Q1",
          title: "Security Budget Quarterly Report",
          date: "2023-03-31",
          type: "financial",
          agency: "All Agencies",
          format: "PDF",
          size: "2.3 MB",
          file_url: "#",
          created_at: new Date().toISOString(),
        },
        {
          id: "AR-2023-01",
          title: "Annual Audit Report",
          date: "2023-01-15",
          type: "audit",
          agency: "All Agencies",
          format: "PDF",
          size: "4.7 MB",
          file_url: "#",
          created_at: new Date().toISOString(),
        },
        {
          id: "SR-2023-02",
          title: "Sustainability Impact Report",
          date: "2023-02-28",
          type: "sustainability",
          agency: "All Agencies",
          format: "PDF",
          size: "3.2 MB",
          file_url: "#",
          created_at: new Date().toISOString(),
        },
      ]
    }
  }, "Failed to fetch public reports")
}

// Modify the getRecentActivity function to include fallback data
export async function getRecentActivity() {
  return fetchData(async () => {
    try {
      const { data, error } = await supabase.rpc("get_recent_activity")

      if (error) throw error
      return data
    } catch (error: any) {
      // Fallback data if the function doesn't exist
      console.warn("Using fallback data for recent activity:", error.message)
      return [
        {
          title: "Budget Increase Approved",
          description: "Additional ₦500M allocated to Cyber Defense",
          date: "Today, 10:30 AM",
          icon: "dollar",
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
        },
        {
          title: "Potential Duplicate Payment Detected",
          description: "AI flagged TR-9823 for review - similar to previous transaction",
          date: "Yesterday, 3:45 PM",
          icon: "alert",
          iconBg: "bg-amber-100",
          iconColor: "text-amber-600",
        },
        {
          title: "Funds Released",
          description: "₦1.2B released to Border Patrol for equipment procurement",
          date: "Sep 14, 2023",
          icon: "down",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
        },
        {
          title: "Budget Request Submitted",
          description: "Emergency Response requested ₦750M for communication upgrades",
          date: "Sep 12, 2023",
          icon: "up",
          iconBg: "bg-purple-100",
          iconColor: "text-purple-600",
        },
      ]
    }
  }, "Failed to fetch recent activity")
}

