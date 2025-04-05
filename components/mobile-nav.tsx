"use client"

import { AlertTriangle, BarChart3, CheckSquare, FileText, Home, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuthState } from "@/hooks/use-auth-state"

export function MobileNav() {
  const { user } = useAuthState()
  const userRole = user?.role

  // Show different navigation options based on user role
  if (userRole === "approver") {
    return (
      <div className="flex flex-col gap-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Approver Dashboard</h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/approver">
                <Home className="mr-2 h-4 w-4" />
                Overview
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/approver/pending">
                <CheckSquare className="mr-2 h-4 w-4" />
                Pending Approvals
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/approver/history">
                <FileText className="mr-2 h-4 w-4" />
                Approval History
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/approver/reports">
                <BarChart3 className="mr-2 h-4 w-4" />
                Reports
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (userRole === "auditor") {
    return (
      <div className="flex flex-col gap-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Auditor Dashboard</h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/auditor">
                <Home className="mr-2 h-4 w-4" />
                Overview
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/auditor/transactions">
                <FileText className="mr-2 h-4 w-4" />
                Transactions
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/auditor/approvals">
                <CheckSquare className="mr-2 h-4 w-4" />
                Approvals
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/auditor/fraud">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Fraud Detection
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/auditor/reports">
                <BarChart3 className="mr-2 h-4 w-4" />
                Reports
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Default admin view
  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Dashboard</h2>
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/dashboard">
              <Home className="mr-2 h-4 w-4" />
              Overview
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/dashboard?tab=budget">
              <Shield className="mr-2 h-4 w-4" />
              Security Budget
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/dashboard?tab=fraud">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Fraud Detection
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/dashboard?tab=approval">
              <Users className="mr-2 h-4 w-4" />
              Approvals
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/dashboard?tab=whistleblower">
              <FileText className="mr-2 h-4 w-4" />
              Whistleblower
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/dashboard/reports">
              <BarChart3 className="mr-2 h-4 w-4" />
              Reports
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

