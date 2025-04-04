"use client"

import { AlertTriangle, FileText, Home, Info, Search, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function UserMobileNav() {
  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Public Portal</h2>
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/user">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/user?tab=public-info">
              <Info className="mr-2 h-4 w-4" />
              Public Information
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/user?tab=submit-report">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Submit Report
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/user?tab=track-report">
              <Search className="mr-2 h-4 w-4" />
              Track Report
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <FileText className="mr-2 h-4 w-4" />
            Resources
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Shield className="mr-2 h-4 w-4" />
            Privacy Policy
          </Button>
        </div>
      </div>
    </div>
  )
}

