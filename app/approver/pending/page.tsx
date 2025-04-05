"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Clock, Filter, Globe, Search, ThumbsDown, ThumbsUp } from "lucide-react"
import { useApprovalRequests } from "@/hooks/use-data"
import { DataLoader, TableSkeleton } from "@/components/ui/data-loader"
import { updateApprovalStatus } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { ApproverHeader } from "@/components/approver/approver-header"

export default function PendingApprovalsPage() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [agencyFilter, setAgencyFilter] = useState("all")
  const { data: approvalRequests, isLoading, error, refetch } = useApprovalRequests()
  const { toast } = useToast()

  // Filter only pending approvals for the international organization
  const pendingApprovals = approvalRequests?.filter(
    (approval) =>
      approval.status === "pending" &&
      approval.approvals.some((a: any) => a.role === "International Organization" && a.status === "pending") &&
      (searchTerm === "" ||
        approval.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        approval.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (agencyFilter === "all" || approval.agency === agencyFilter),
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
      <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Pending Approvals</h2>
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
              <Globe className="mr-1 h-3 w-3" />
              Observer
            </Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transactions Awaiting Your Approval</CardTitle>
            <CardDescription>
              Review and approve or reject these transactions as an international observer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by ID or description..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Select value={agencyFilter} onValueChange={setAgencyFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by agency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Agencies</SelectItem>
                    <SelectItem value="Border Patrol">Border Patrol</SelectItem>
                    <SelectItem value="Cyber Defense">Cyber Defense</SelectItem>
                    <SelectItem value="Intelligence">Intelligence</SelectItem>
                    <SelectItem value="Police Force">Police Force</SelectItem>
                    <SelectItem value="Emergency Response">Emergency Response</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <DataLoader
              isLoading={isLoading}
              error={error}
              data={pendingApprovals}
              loadingComponent={<TableSkeleton rows={3} columns={2} />}
            >
              {(approvals) => (
                <div className="space-y-6">
                  {approvals.length === 0 ? (
                    <div className="text-center py-12">
                      <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                      <h3 className="mt-4 text-lg font-medium">No pending approvals</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        All transactions have been reviewed or no transactions match your filters
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2">
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
      </main>
    </div>
  )
}

