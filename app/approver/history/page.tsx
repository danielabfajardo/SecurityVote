"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Clock, FileText, Filter, Globe, Search, ThumbsDown } from "lucide-react"
import { useApprovalRequests } from "@/hooks/use-data"
import { DataLoader, TableSkeleton } from "@/components/ui/data-loader"
import { useState } from "react"
import { ApproverHeader } from "@/components/approver/approver-header"

export default function ApprovalHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { data: approvalRequests, isLoading, error } = useApprovalRequests()

  // Filter approvals that have been acted on by the international organization
  const filteredApprovals = approvalRequests
    ?.filter((approval) => {
      const observerApproval = approval.approvals.find((a: any) => a.role === "International Organization")

      const matchesSearch =
        searchTerm === "" ||
        approval.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        approval.id.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "approved" && observerApproval?.status === "approved") ||
        (statusFilter === "rejected" && observerApproval?.status === "rejected")

      return observerApproval?.status !== "pending" && matchesSearch && matchesStatus
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="flex min-h-screen flex-col">
      <ApproverHeader />
      <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Approval History</h2>
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
              <Globe className="mr-1 h-3 w-3" />
              Observer
            </Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Approval History</CardTitle>
            <CardDescription>Record of your previous approvals and rejections</CardDescription>
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
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
              data={filteredApprovals}
              loadingComponent={<TableSkeleton rows={3} columns={2} />}
            >
              {(approvals) => (
                <div className="space-y-4">
                  {approvals.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                      <h3 className="mt-4 text-lg font-medium">No approval history</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        You haven't approved or rejected any transactions yet
                      </p>
                    </div>
                  ) : (
                    approvals.map((approval) => {
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
                    })
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

