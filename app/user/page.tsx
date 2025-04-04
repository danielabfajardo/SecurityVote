import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserHeader } from "@/components/user/user-header"
import { WhistleblowerSubmission } from "@/components/user/whistleblower-submission"
import { PublicInformation } from "@/components/user/public-information"
import { ReportTracking } from "@/components/user/report-tracking"

export default function UserDashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <UserHeader />
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">SecurityVote Public Portal</h2>
        </div>
        <Tabs defaultValue="public-info" className="space-y-4">
          <TabsList>
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
      </main>
    </div>
  )
}

