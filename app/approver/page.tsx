"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Clock, FileText, Globe, ThumbsDown, ThumbsUp } from "lucide-react"
import { useApprovalRequests } from "@/hooks/use-data"
import { DataLoader } from "@/components/ui/data-loader"
import { updateApprovalStatus } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { ApproverHeader } from "@/components/approver/approver-header"
import { ResponsiveContainer } from "@/components/layout/responsive-container"
import { MetricCard } from "@/components/ui/metric-card"

export default function ApproverDashboard() {
  const [isUpdating, setIsUpdating] = useState(false)
  const { data: approvalRequests, isLoading, error, refetch } = useApprovalRequests()
  const { toast } = useToast()

  // Filter only pending approvals
  const pendingApprovals = approvalRequests?.filter(
    (approval) =>
      approval.status === "pending" &&
      approval.approvals.some((a: any) => a.role === "International Organization" && a.status === "pending"),
  )

  const handleApprove = async (id: string) => {
    setIsUpdating(true)
    try {
      await updateApprovalStatus(id, "International Organization", "approved")
      toast({
        title: "Approval successful",
        description: "The transaction has been approved",
      })
      refetch()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve transaction",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleReject = async (id: string) => {
    setIsUpdating(true)
    try {
      await updateApprovalStatus(id, "International Organization", "rejected")
      toast({
        title: "Rejection successful",
        description: "The transaction has been rejected",
        variant: "destructive",
      })
      refetch()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject transaction",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <ApproverHeader />
      <main className="flex-1 py-6">
        <ResponsiveContainer>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">International Observer Dashboard</h2>
            <div className="mt-2 sm:mt-0">
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                <Globe className="mr-1 h-3 w-3" />
                Observer
              </Badge>
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Pending Approvals"
              value={pendingApprovals?.length || 0}
              description="Transactions awaiting your verification"
              icon={<Clock className="h-4 w-4" />}
            />

            <MetricCard
              title="Approved"
              value={
                approvalRequests?.filter((a) =>
                  a.approvals.some((sig) => sig.role === "International Organization" && sig.status === "approved"),
                ).length || 0
              }
              description="Transactions you've approved"
              icon={<CheckCircle2 className="h-4 w-4" />}
            />

            <MetricCard
              title="Total Transactions"
              value={approvalRequests?.length || 0}
              description="All transactions in the system"
              icon={<FileText className="h-4 w-4" />}
            />

            <MetricCard
              title="Approval Rate"
              value={`${
                approvalRequests && approvalRequests.length > 0
                  ? Math.round(
                      (approvalRequests.filter((a) =>
                        a.approvals.some(
                          (sig) => sig.role === "International Organization" && sig.status === "approved",
                        ),
                      ).length /
                        approvalRequests.length) *
                        100,
                    )
                  : 0
              }%`}
              description="Percentage of transactions approved"
              icon={<CheckCircle2 className="h-4 w-4" />}
            />
          </div>

          <Tabs defaultValue="pending" className="mt-6 space-y-6">
            <TabsList>
              <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
              <TabsTrigger value="history">Approval History</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Transactions Awaiting Your Approval</CardTitle>
                  <CardDescription>Review and approve or reject these transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <DataLoader isLoading={isLoading} error={error} data={pendingApprovals}>
                    {(approvals) => (
                      <div className="space-y-6">
                        {approvals.length === 0 ? (
                          <div className="text-center py-6">
                            <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                            <h3 className="mt-2 text-lg font-medium">No pending approvals</h3>
                            <p className="text-sm text-muted-foreground">All transactions have been reviewed</p>
                          </div>
                        ) : (
                          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                            {approvals.map((approval) => (
                              <Card key={approval.id} className="overflow-hidden">
                                <CardHeader className="bg-muted/50 pb-2">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <CardTitle className="text-base">{approval.description}</CardTitle>
                                      <CardDescription>
                                        {approval.id} • {approval.agency}
                                      </CardDescription>
                                    </div>
                                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                      <Clock className="mr-1 h-3 w-3" />
                                      Pending
                                    </Badge>
                                  </div>
                                </CardHeader>
                                <CardContent className="pt-4">
                                  <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                      <p className="text-sm text-muted-foreground">Amount</p>
                                      <p className="text-lg font-bold">₦{Number(approval.amount).toLocaleString()}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Date</p>
                                      <p className="font-medium">{approval.date}</p>
                                    </div>
                                  </div>

                                  <div className="space-y-2 mb-4">
                                    <p className="text-sm text-muted-foreground">Approval Status</p>
                                    <div className="flex flex-wrap gap-3">
                                      {approval.approvals.map((a: any, i: number) => (
                                        <div key={i} className="flex items-center gap-1.5">
                                          <div
                                            className={`h-2.5 w-2.5 rounded-full ${
                                              a.status === "approved"
                                                ? "bg-green-500"
                                                : a.status === "rejected"
                                                  ? "bg-red-500"
                                                  : "bg-amber-500"
                                            }`}
                                          />
                                          <span className="text-sm">
                                            {a.role}: <span className="capitalize">{a.status}</span>
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap gap-2">
                                    <Button
                                      onClick={() => handleApprove(approval.id)}
                                      disabled={isUpdating}
                                      className="flex-1"
                                    >
                                      <ThumbsUp className="mr-2 h-4 w-4" />
                                      Approve
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => handleReject(approval.id)}
                                      disabled={isUpdating}
                                      className="flex-1"
                                    >
                                      <ThumbsDown className="mr-2 h-4 w-4" />
                                      Reject
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </DataLoader>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Approval History</CardTitle>
                  <CardDescription>Record of your previous approvals and rejections</CardDescription>
                </CardHeader>
                <CardContent>
                  <DataLoader
                    isLoading={isLoading}
                    error={error}
                    data={approvalRequests?.filter((a) =>
                      a.approvals.some(
                        (sig) =>
                          sig.role === "International Organization" &&
                          (sig.status === "approved" || sig.status === "rejected"),
                      ),
                    )}
                  >
                    {(approvals) => (
                      <div className="space-y-4">
                        {approvals.length === 0 ? (
                          <div className="text-center py-6">
                            <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                            <h3 className="mt-2 text-lg font-medium">No approval history</h3>
                            <p className="text-sm text-muted-foreground">
                              You haven't approved or rejected any transactions yet
                            </p>
                          </div>
                        ) : (
                          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                            {approvals.map((approval) => {
                              const observerApproval = approval.approvals.find(
                                (a: any) => a.role === "International Organization",
                              )
                              return (
                                <div key={approval.id} className="flex items-start gap-4 p-4 border rounded-lg">
                                  <div
                                    className={`rounded-full p-2 ${
                                      observerApproval?.status === "approved" ? "bg-green-100" : "bg-red-100"
                                    }`}
                                  >
                                    {observerApproval?.status === "approved" ? (
                                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <ThumbsDown className="h-4 w-4 text-red-600" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex justify-between">
                                      <h4 className="font-medium">{approval.description}</h4>
                                      <Badge
                                        variant="outline"
                                        className={
                                          observerApproval?.status === "approved"
                                            ? "bg-green-50 text-green-700 border-green-200"
                                            : "bg-red-50 text-red-700 border-red-200"
                                        }
                                      >
                                        {observerApproval?.status === "approved" ? "Approved" : "Rejected"}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {approval.agency} • ₦{Number(approval.amount).toLocaleString()}
                                    </p>
                                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                                      <Clock className="mr-1 h-3 w-3" />
                                      {approval.date}
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </DataLoader>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ResponsiveContainer>
      </main>
    </div>
  )
}

