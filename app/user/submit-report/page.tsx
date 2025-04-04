import { UserHeader } from "@/components/user/user-header"
import { WhistleblowerSubmission } from "@/components/user/whistleblower-submission"

export default function SubmitReportPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <UserHeader />
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Submit Whistleblower Report</h2>
        </div>
        <WhistleblowerSubmission />
      </main>
    </div>
  )
}

