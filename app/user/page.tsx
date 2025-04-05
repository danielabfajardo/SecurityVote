"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserHeader } from "@/components/user/user-header"
import { WhistleblowerSubmission } from "@/components/user/whistleblower-submission"
import { PublicInformation } from "@/components/user/public-information"
import { ReportTracking } from "@/components/user/report-tracking"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { ResponsiveContainer } from "@/components/layout/responsive-container"

export default function UserDashboard() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("public-info")

  // Set active tab based on URL parameter
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && ["public-info", "submit-report", "track-report"].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  return (
    <div className="flex min-h-screen flex-col">
      <UserHeader />
      <main className="flex-1 py-6">
        <ResponsiveContainer>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">SecurityVote Public Portal</h2>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="flex flex-wrap">
              <TabsTrigger value="public-info">Public Information</TabsTrigger>
              <TabsTrigger value="submit-report">Submit Report</TabsTrigger>
              <TabsTrigger value="track-report">Track Report</TabsTrigger>
            </TabsList>
            <TabsContent value="public-info" className="space-y-4">
              <PublicInformation />
            </TabsContent>
            <TabsContent value="submit-report" className="space-y-4">
              <WhistleblowerSubmission />
            </TabsContent>
            <TabsContent value="track-report" className="space-y-4">
              <ReportTracking />
            </TabsContent>
          </Tabs>
        </ResponsiveContainer>
      </main>
    </div>
  )
}

