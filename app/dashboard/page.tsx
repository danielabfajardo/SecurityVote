import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SecurityBudgetDashboard } from "@/components/security-budget-dashboard"
import { FraudDetectionPanel } from "@/components/fraud-detection-panel"
import { MultiSignatureInterface } from "@/components/multi-signature-interface"
import { WhistleblowerSystem } from "@/components/whistleblower-system"
import { DashboardHeader } from "@/components/dashboard-header"

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">SecurityVote Dashboard</h2>
        </div>
        <Tabs defaultValue="budget" className="space-y-4">
          <TabsList>
            <TabsTrigger value="budget">Budget Tracker</TabsTrigger>
            <TabsTrigger value="fraud">Fraud Detection</TabsTrigger>
            <TabsTrigger value="approval">Multi-Signature Approval</TabsTrigger>
            <TabsTrigger value="whistleblower">Whistleblower System</TabsTrigger>
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
      </main>
    </div>
  )
}

