"use client"

import { AlertTriangle, BarChart3, FileText, Home, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MobileNav() {
  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Dashboard</h2>
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="mr-2 h-4 w-4" />
            Overview
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Shield className="mr-2 h-4 w-4" />
            Security Budget
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Fraud Detection
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Users className="mr-2 h-4 w-4" />
            Approvals
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <FileText className="mr-2 h-4 w-4" />
            Reports
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
        </div>
      </div>
    </div>
  )
}

