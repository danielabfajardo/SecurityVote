"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, BarChart3, CheckCircle2, Clock, ThumbsDown, ThumbsUp, User } from "lucide-react"
import { useApprovalRequests, useBudgetData } from "@/hooks/use-data"
import { DataLoader } from "@/components/ui/data-loader"
import { updateApprovalStatus } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { AuditorHeader } from "@/components/auditor/auditor-header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AuditorDashboard() {
  const [isUpdating, setIsUpdating] = useState(false)
  const { data: approvalRequests, isLoading: approvalsLoading, error: approvalsError, refetch } = useApprovalRequests()
  const { data: transactions, isLoading: transactionsLoading, error: transactionsError } = useBudgetData()
  const { toast } = useToast()

  // Filter only pending approvals for the auditor
  const pendingApprovals = approvalRequests?.filter(
    (approval) =>
      approval.status === "pending" &&
      approval.approvals.some((a: any) => a.role === "Auditor" && a.status === "pending"),
  )

  const handleApprove = async (id: string) => {
    setIsUpdating(true)
    try {
      await updateApprovalStatus(id, "Auditor", "approved")
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
      await updateApprovalStatus(id, "Auditor", "rejected")
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
      <AuditorHeader />
      <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Auditor Dashboard</h2>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
              <User className="mr-1 h-3 w-3" />
              Auditor
            </Badge>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingApprovals?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Transactions awaiting your verification</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {approvalRequests?.filter((a) =>
                  a.approvals.some((sig) => sig.role === "Auditor" && sig.status === "approved"),
                ).length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Transactions you've approved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Flagged Transactions</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {transactions?.filter((t) => t.status === "flagged").length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Transactions flagged for review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget Analysis</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₦
                {transactions
                  ? (transactions.reduce((sum, t) => sum + Number(t.amount), 0) / 1000000000).toFixed(1) + "B"
                  : "0"}
              </div>
              <p className="text-xs text-muted-foreground">Total transaction volume</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="approvals" className="space-y-4">
          <TabsList>
            <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
            <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="approvals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transactions Awaiting Your Approval</CardTitle>
                <CardDescription>Review and approve or reject these transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <DataLoader isLoading={approvalsLoading} error={approvalsError} data={pendingApprovals}>
                  {(approvals) => (
                    <div className="space-y-6">
                      {approvals.length === 0 ? (
                        <div className="text-center py-6">
                          <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                          <h3 className="mt-2 text-lg font-medium">No pending approvals</h3>
                          <p className="text-sm text-muted-foreground">All transactions have been reviewed</p>
                        </div>
                      ) : (
                        approvals.map((approval) => (
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
                        ))
                      )}
                    </div>
                  )}
                </DataLoader>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Overview of recent financial transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <DataLoader isLoading={transactionsLoading} error={transactionsError} data={transactions}>
                  {(transactions) => (
                    <div className="overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Agency</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transactions.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                                No transactions found
                              </TableCell>
                            </TableRow>
                          ) : (
                            transactions.map((transaction) => (
                              <TableRow key={transaction.id}>
                                <TableCell className="font-medium">{transaction.id}</TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell>{transaction.date}</TableCell>
                                <TableCell>{transaction.agency}</TableCell>
                                <TableCell>₦{Number(transaction.amount).toLocaleString()}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className={
                                      transaction.status === "approved"
                                        ? "bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                                        : transaction.status === "flagged"
                                          ? "bg-red-50 text-red-700 hover:bg-red-50 border-red-200 flex items-center gap-1"
                                          : "bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200"
                                    }
                                  >
                                    {transaction.status === "flagged" && <AlertTriangle className="h-3 w-3" />}
                                    <span className="capitalize">{transaction.status}</span>
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </DataLoader>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

