"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SecurityBudgetDashboard } from "@/components/security-budget-dashboard"
import { FraudDetectionPanel } from "@/components/fraud-detection-panel"
import { MultiSignatureInterface } from "@/components/multi-signature-interface"
import { WhistleblowerSystem } from "@/components/whistleblower-system"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function AdminDashboard() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("budget")

  // Set active tab based on URL parameter
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && ["budget", "fraud", "approval", "whistleblower"].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  return (
    <DashboardLayout title="SecurityVote Dashboard">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="budget">Budget Tracker</TabsTrigger>
          <TabsTrigger value="fraud">Fraud Detection</TabsTrigger>
          <TabsTrigger value="approval">Multi-Signature</TabsTrigger>
          <TabsTrigger value="whistleblower">Whistleblower</TabsTrigger>
        </TabsList>
        <TabsContent value="budget" className="space-y-4">
          <SecurityBudgetDashboard />
        </TabsContent>
        <TabsContent value="fraud" className="space-y-4">
          <FraudDetectionPanel />
        </TabsContent>
        <TabsContent value="approval" className="space-y-4">
          <MultiSignatureInterface />
        </TabsContent>
        <TabsContent value="whistleblower" className="space-y-4">
          <WhistleblowerSystem />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}

