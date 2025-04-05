"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowUpIcon as ArrowDownload,
  BarChart3,
  Calendar,
  Download,
  Info,
  Search,
  Shield,
  SlidersHorizontal,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "@/components/ui/chart"
import { usePublicReports } from "@/hooks/use-data"
import { DataLoader, TableSkeleton } from "@/components/ui/data-loader"

export function PublicInformation() {
  const [searchTerm, setSearchTerm] = useState("")
  const [documentTypeFilter, setDocumentTypeFilter] = useState("all")

  const { data: financialReports, isLoading, error } = usePublicReports()

  // Mock data for charts - in a real app, this would come from the database
  const budgetData = [
    { name: "Border Patrol", allocated: 4.5, spent: 3.2 },
    { name: "Cyber Defense", allocated: 3.8, spent: 2.9 },
    { name: "Intelligence", allocated: 5.2, spent: 4.1 },
    { name: "Police Force", allocated: 2.0, spent: 1.7 },
    { name: "Emergency", allocated: 1.5, spent: 1.1 },
  ]

  const fraudData = [
    { name: "Q1", reported: 24, verified: 18, prevented: 15 },
    { name: "Q2", reported: 32, verified: 22, prevented: 20 },
    { name: "Q3", reported: 28, verified: 19, prevented: 17 },
    { name: "Q4", reported: 35, verified: 25, prevented: 22 },
  ]

  // Filter reports based on search term and document type
  const filteredReports = financialReports?.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.agency.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = documentTypeFilter === "all" || report.type === documentTypeFilter

    return matchesSearch && matchesType
  })

  return (
    <div className="grid gap-4 md:grid-cols-7">
      <Card className="md:col-span-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Public Reports & Documents</CardTitle>
            <CardDescription>Transparency reports and financial disclosures</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search reports..."
                className="w-full rounded-lg pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={documentTypeFilter} onValueChange={setDocumentTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Document Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Documents</SelectItem>
                <SelectItem value="financial">Financial Reports</SelectItem>
                <SelectItem value="audit">Audit Reports</SelectItem>
                <SelectItem value="sustainability">Sustainability Reports</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DataLoader
            isLoading={isLoading}
            error={error}
            data={filteredReports}
            loadingComponent={<TableSkeleton rows={5} columns={5} />}
          >
            {(reports) => (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No reports found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.id}</TableCell>
                        <TableCell>{report.title}</TableCell>
                        <TableCell>{report.date}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              report.type === "financial"
                                ? "bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200"
                                : report.type === "audit"
                                  ? "bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200"
                                  : "bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                            }
                          >
                            {report.type === "financial"
                              ? "Financial"
                              : report.type === "audit"
                                ? "Audit"
                                : "Sustainability"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1"
                              onClick={() => window.open(report.file_url, "_blank")}
                            >
                              <Download className="h-3 w-3" />
                              {report.format}
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Info className="h-4 w-4" />
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
        </CardContent>
      </Card>

      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>Budget Transparency</CardTitle>
          <CardDescription>Public security fund allocation and spending</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Budget Overview</TabsTrigger>
              <TabsTrigger value="fraud">Fraud Prevention</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={budgetData}
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
                    <Bar dataKey="allocated" fill="#8884d8" name="Allocated (₦B)" />
                    <Bar dataKey="spent" fill="#82ca9d" name="Spent (₦B)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <h4 className="text-sm font-medium">Total Security Budget</h4>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    ₦15.5B
                  </Badge>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Allocated:</span>
                    <span className="font-medium">₦10.2B (65.8%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Remaining:</span>
                    <span className="font-medium">₦5.3B (34.2%)</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full gap-1">
                <ArrowDownload className="h-4 w-4" />
                Download Full Budget Report
              </Button>
            </TabsContent>

            <TabsContent value="fraud" className="space-y-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={fraudData}
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
                    <Bar dataKey="reported" fill="#ff8042" name="Reported" />
                    <Bar dataKey="verified" fill="#8884d8" name="Verified" />
                    <Bar dataKey="prevented" fill="#82ca9d" name="Prevented" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <h4 className="text-sm font-medium">Fraud Prevention Impact</h4>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  In 2023, our AI system helped prevent ₦1.2B in potential fraud through early detection and
                  multi-signature verification.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="md:col-span-7">
        <CardHeader>
          <CardTitle>Recent Transparency Updates</CardTitle>
          <CardDescription>Latest public disclosures and transparency initiatives</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base">Q3 Financial Report</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground">
                  Detailed breakdown of security fund allocation and spending for Q3 2023.
                </p>
                <div className="flex items-center text-xs text-muted-foreground mt-2">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span>Published: September 30, 2023</span>
                </div>
              </CardContent>
              <div className="p-4 pt-0">
                <Button variant="outline" size="sm" className="w-full">
                  View Report
                </Button>
              </div>
            </Card>

            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base">Whistleblower Impact Report</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground">
                  Analysis of whistleblower program effectiveness and fraud prevention metrics.
                </p>
                <div className="flex items-center text-xs text-muted-foreground mt-2">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span>Published: August 15, 2023</span>
                </div>
              </CardContent>
              <div className="p-4 pt-0">
                <Button variant="outline" size="sm" className="w-full">
                  View Report
                </Button>
              </div>
            </Card>

            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base">AI Governance Framework</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground">
                  Documentation of AI ethics, oversight, and governance for the SecureGov AI system.
                </p>
                <div className="flex items-center text-xs text-muted-foreground mt-2">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span>Published: July 22, 2023</span>
                </div>
              </CardContent>
              <div className="p-4 pt-0">
                <Button variant="outline" size="sm" className="w-full">
                  View Report
                </Button>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

