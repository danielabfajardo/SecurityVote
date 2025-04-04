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
  Eye,
  Filter,
  MessageSquare,
  Phone,
  Search,
  Shield,
  Smartphone,
  XCircle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "@/components/ui/chart"
import { useState } from "react"
import { useWhistleblowerReports } from "@/hooks/use-data"
import { DataLoader, TableSkeleton } from "@/components/ui/data-loader"
import { updateWhistleblowerReportStatus } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function WhistleblowerSystem() {
  const [searchTerm, setSearchTerm] = useState("")
  const [agencyFilter, setAgencyFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [isUpdating, setIsUpdating] = useState(false)

  const { data: whistleblowerReports, isLoading, error, refetch } = useWhistleblowerReports()
  const { toast } = useToast()

  // Mock data for charts - in a real app, this would come from the database
  const channelData = [
    { name: "Web App", value: 45 },
    { name: "SMS", value: 30 },
    { name: "USSD", value: 25 },
  ]

  const categoryData = [
    { name: "Jan", contracts: 4, procurement: 2, funds: 1 },
    { name: "Feb", contracts: 3, procurement: 1, funds: 2 },
    { name: "Mar", contracts: 2, procurement: 3, funds: 4 },
    { name: "Apr", contracts: 5, procurement: 2, funds: 3 },
    { name: "May", contracts: 3, procurement: 4, funds: 2 },
    { name: "Jun", contracts: 4, procurement: 3, funds: 5 },
  ]

  // Filter reports based on search term, filters, and active tab
  const filteredReports = whistleblowerReports?.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesAgency = agencyFilter === "all" || report.agency.toLowerCase() === agencyFilter.toLowerCase()
    const matchesCategory = categoryFilter === "all" || report.category.toLowerCase() === categoryFilter.toLowerCase()

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "verified" && report.status === "verified") ||
      (activeTab === "investigating" && report.status === "investigating") ||
      (activeTab === "unverified" && report.status === "unverified")

    return matchesSearch && matchesAgency && matchesCategory && matchesTab
  })

  const handleUpdateStatus = async (id: string, status: "unverified" | "investigating" | "verified" | "rejected") => {
    setIsUpdating(true)
    try {
      await updateWhistleblowerReportStatus(id, status)
      toast({
        title: "Status updated",
        description: `Report status has been updated to ${status}`,
      })
      refetch()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update report status",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="lg:col-span-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Whistleblower Reports</CardTitle>
            <CardDescription>Anonymous reports of potential fraud and corruption</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search reports..."
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
          <Tabs defaultValue="all" className="space-y-4" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Reports</TabsTrigger>
              <TabsTrigger value="verified">Verified</TabsTrigger>
              <TabsTrigger value="investigating">Investigating</TabsTrigger>
              <TabsTrigger value="unverified">Unverified</TabsTrigger>
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
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="contract">Contract Fraud</SelectItem>
                  <SelectItem value="procurement">Procurement Fraud</SelectItem>
                  <SelectItem value="payroll">Payroll Fraud</SelectItem>
                  <SelectItem value="funds">Misappropriation</SelectItem>
                  <SelectItem value="bribery">Bribery</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DataLoader
              isLoading={isLoading}
              error={error}
              data={filteredReports}
              loadingComponent={<TableSkeleton rows={5} columns={7} />}
            >
              {(reports) => (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Agency</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                          No reports found matching your filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      reports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.id}</TableCell>
                          <TableCell>{report.title}</TableCell>
                          <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>{report.agency}</TableCell>
                          <TableCell>
                            {report.is_anonymous ? (
                              <div className="flex items-center gap-1">
                                <Smartphone className="h-3 w-3 text-blue-600" />
                                <span>Web App</span>
                              </div>
                            ) : report.submitter_phone ? (
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3 text-green-600" />
                                <span>SMS</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3 text-amber-600" />
                                <span>USSD</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {report.status === "verified" ? (
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200 flex items-center gap-1"
                              >
                                <CheckCircle2 className="h-3 w-3" />
                                Verified
                              </Badge>
                            ) : report.status === "investigating" ? (
                              <Badge
                                variant="outline"
                                className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200"
                              >
                                Investigating
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200 flex items-center gap-1"
                              >
                                <XCircle className="h-3 w-3" />
                                Unverified
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                  // Toggle status
                                  const newStatus =
                                    report.status === "unverified"
                                      ? "investigating"
                                      : report.status === "investigating"
                                        ? "verified"
                                        : "unverified"
                                  handleUpdateStatus(report.id, newStatus)
                                }}
                                disabled={isUpdating}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
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

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Reporting Analytics</CardTitle>
          <CardDescription>Whistleblower reporting channels and categories</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="channels" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="channels">Reporting Channels</TabsTrigger>
              <TabsTrigger value="categories">Report Categories</TabsTrigger>
            </TabsList>

            <TabsContent value="channels" className="space-y-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={channelData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {channelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-blue-600" />
                    <h4 className="text-sm font-medium">Web App</h4>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Secure encrypted web application for detailed reports with evidence upload.
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                    <h4 className="text-sm font-medium">SMS Reporting</h4>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Text-based reporting system accessible on basic mobile phones.
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-amber-600" />
                    <h4 className="text-sm font-medium">USSD Service</h4>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Menu-based reporting system that works without internet access.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="categories" className="space-y-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="contracts" fill="#8884d8" name="Contract Fraud" />
                    <Bar dataKey="procurement" fill="#82ca9d" name="Procurement Fraud" />
                    <Bar dataKey="funds" fill="#ffc658" name="Misappropriation" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 rounded-lg border p-4 bg-muted/50">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h4 className="text-sm font-medium">Whistleblower Protection</h4>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              All reports are anonymous by default. Whistleblower identities are protected through encryption and secure
              channels.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <p className="text-xs text-muted-foreground">
                AI cross-checks reports with financial records to verify claims before investigation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

