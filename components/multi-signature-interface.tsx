"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Filter,
  Search,
  Shield,
  ThumbsDown,
  ThumbsUp,
  User,
  XCircle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"
import { useApprovalRequests } from "@/hooks/use-data"
import { DataLoader, TableSkeleton } from "@/components/ui/data-loader"
import { updateApprovalStatus } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function MultiSignatureInterface() {
  const [searchTerm, setSearchTerm] = useState("")
  const [agencyFilter, setAgencyFilter] = useState("all")
  const [approvalStageFilter, setApprovalStageFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("pending")
  const [isUpdating, setIsUpdating] = useState(false)

  const { data: approvalRequests, isLoading, error, refetch } = useApprovalRequests()
  const { toast } = useToast()

  const filteredApprovals = approvalRequests?.filter((approval) => {
    const matchesSearch =
      approval.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.agency.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesAgency = agencyFilter === "all" || approval.agency.toLowerCase() === agencyFilter.toLowerCase()

    const matchesApprovalStage =
      approvalStageFilter === "all" ||
      approval.approvals.some(
        (a: any) => a.role.toLowerCase() === approvalStageFilter.toLowerCase() && a.status === "pending",
      )

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && approval.status === "pending") ||
      (activeTab === "approved" && approval.status === "approved") ||
      (activeTab === "rejected" && approval.status === "rejected")

    return matchesSearch && matchesAgency && matchesApprovalStage && matchesTab
  })

  const handleApprove = async (id: string, role: string) => {
    setIsUpdating(true)
    try {
      await updateApprovalStatus(id, role, "approved")
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

  const handleReject = async (id: string, role: string) => {
    setIsUpdating(true)
    try {
      await updateApprovalStatus(id, role, "rejected")
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="lg:col-span-5">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Approval Dashboard</CardTitle>
            <CardDescription>Multi-signature approval status for security fund transactions</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search approvals..."
                className="w-[200px] rounded-lg pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="space-y-4" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="all">All Transactions</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-4 mb-4">
              <Select value={agencyFilter} onValueChange={setAgencyFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Agency" />
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
              <Select value={approvalStageFilter} onValueChange={setApprovalStageFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Approval Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="Auditor">Auditor</SelectItem>
                  <SelectItem value="International Organization">International Organization</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DataLoader
              isLoading={isLoading}
              error={error}
              data={filteredApprovals}
              loadingComponent={<TableSkeleton rows={5} columns={7} />}
            >
              {(approvals) => (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Agency</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Approval Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(approvals ?? []).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                          No approval requests found matching your filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      (approvals ?? []).map((approval) => (
                        <TableRow key={approval.id}>
                          <TableCell className="font-medium">{approval.id}</TableCell>
                          <TableCell>{approval.description}</TableCell>
                          <TableCell>{approval.date}</TableCell>
                          <TableCell>{approval.agency}</TableCell>
                          <TableCell>₦{Number(approval.amount).toLocaleString()}</TableCell>
                          <TableCell>
                            {approval.status === "pending" && (
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span>Approval Progress</span>
                                  <span>
                                    {approval.approvals.filter((a: any) => a.status === "approved").length}/
                                    {approval.approvals.length}
                                  </span>
                                </div>
                                <Progress
                                  value={
                                    (approval.approvals.filter((a: any) => a.status === "approved").length /
                                      approval.approvals.length) *
                                    100
                                  }
                                  className="h-2"
                                />
                                <div className="flex items-center gap-2 mt-1">
                                  <TooltipProvider>
                                    {approval.approvals.map((a: any, i: number) => (
                                      <Tooltip key={i}>
                                        <TooltipTrigger asChild>
                                          <div
                                            className={`flex h-6 w-6 items-center justify-center rounded-full ${
                                              a.status === "approved"
                                                ? "bg-green-100 text-green-700"
                                                : a.status === "rejected"
                                                  ? "bg-red-100 text-red-700"
                                                  : "bg-amber-100 text-amber-700"
                                            }`}
                                          >
                                            {a.status === "approved" ? (
                                              <CheckCircle2 className="h-4 w-4" />
                                            ) : a.status === "rejected" ? (
                                              <XCircle className="h-4 w-4" />
                                            ) : (
                                              <Clock className="h-4 w-4" />
                                            )}
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>
                                            {a.role}: {a.status}
                                          </p>
                                          <p className="text-xs text-muted-foreground">{a.name}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    ))}
                                  </TooltipProvider>
                                </div>
                              </div>
                            )}
                            {approval.status === "approved" && (
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                              >
                                Approved
                              </Badge>
                            )}
                            {approval.status === "rejected" && (
                              <Badge
                                variant="outline"
                                className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200 flex items-center gap-1"
                              >
                                <AlertTriangle className="h-3 w-3" />
                                Rejected
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {approval.status === "pending" && (
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleApprove(approval.id, "AI Verification")}
                                  disabled={isUpdating}
                                >
                                  <ThumbsUp className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleReject(approval.id, "AI Verification")}
                                  disabled={isUpdating}
                                >
                                  <ThumbsDown className="h-4 w-4 text-red-600" />
                                </Button>
                                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                            {(approval.status === "approved" || approval.status === "rejected") && (
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </DataLoader>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Approval Chain</CardTitle>
          <CardDescription>Required signatures for fund release</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-2 rounded-lg border p-4">
              <div className="rounded-full bg-blue-100 p-2">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <h4 className="text-sm font-medium">Auditor</h4>
              <p className="text-xs text-center text-muted-foreground">
                Verifies transaction details and budget allocation
              </p>
            </div>
            <div className="flex justify-center">
              <div className="h-6 w-0.5 bg-border"></div>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-lg border p-4">
              <div className="rounded-full bg-amber-100 p-2">
                <Shield className="h-5 w-5 text-amber-600" />
              </div>
              <h4 className="text-sm font-medium">International Organization</h4>
              <p className="text-xs text-center text-muted-foreground">
                Reviews for compliance with anti-corruption policies
              </p>
            </div>
          </div>
          <div className="mt-6">
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <h4 className="text-sm font-medium mb-2">Digital Signatures</h4>
                <p className="text-xs text-muted-foreground">
                  All approvals use cryptographic verification to ensure security and non-repudiation.
                </p>
                <div className="mt-2 text-xs font-mono bg-background p-2 rounded border overflow-hidden">
                  <div className="truncate">sig:0x7f9e8d7c6b5a4...</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

